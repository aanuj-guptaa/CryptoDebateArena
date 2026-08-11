import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import coinsRouter from './routes/coins.js';
import debateRouter from './routes/debate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: ['http://localhost:3000', FRONTEND_ORIGIN],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api/coins', coinsRouter);
app.use('/api/debate', debateRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
