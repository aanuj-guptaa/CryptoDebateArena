import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { fetchCoinStats, fetchCoinNews } from '../services/coingecko.js';
import { createSession, sessionStore } from '../services/orchestrator.js';

const router = Router();

router.post('/start', async (req, res) => {
  const { coinId, hotTake } = req.body;
  if (!coinId || typeof coinId !== 'string' || coinId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing coinId' });
  }

  const cleanCoinId = coinId.trim().toLowerCase();

  try {
    const coinData = await fetchCoinStats(cleanCoinId);
    try {
      const news = await fetchCoinNews(coinData.coinSymbol || cleanCoinId);
      coinData.news = news;
    } catch (e) {
      console.warn('News fetch warning:', e);
    }

    const debateId = uuidv4();
    const session = createSession(debateId, cleanCoinId, coinData, typeof hotTake === 'string' ? hotTake.trim() : undefined);
    
    // Fire and forget
    session.runDebate();
    
    res.json({ debateId });
  } catch (error) {
    console.error('Failed to start debate:', error);
    res.status(500).json({ error: 'Failed to initialize debate' });
  }
});

router.get('/stream/:debateId', (req, res) => {
  const { debateId } = req.params;
  const session = sessionStore.get(debateId);
  
  if (!session) {
    return res.status(404).json({ error: 'Debate not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Send previously completed turns
  session.turns.forEach(turn => {
    res.write(`event: turn\ndata: ${JSON.stringify(turn)}\n\n`);
  });
  
  if (session.verdict) {
    res.write(`event: verdict\ndata: ${JSON.stringify(session.verdict)}\n\n`);
  }

  if (session.status === 'completed' || session.status === 'error') {
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
    return;
  }

  const onTurn = (turn: any) => res.write(`event: turn\ndata: ${JSON.stringify(turn)}\n\n`);
  const onVerdict = (verdict: any) => res.write(`event: verdict\ndata: ${JSON.stringify(verdict)}\n\n`);
  const onDone = () => {
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  };

  session.on('turn', onTurn);
  session.on('verdict', onVerdict);
  session.on('done', onDone);

  req.on('close', () => {
    session.off('turn', onTurn);
    session.off('verdict', onVerdict);
    session.off('done', onDone);
  });
});

export default router;
