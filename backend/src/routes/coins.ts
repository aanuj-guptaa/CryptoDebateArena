import { Router } from 'express';
import { fetchCoinStats, fetchCoinChart, fetchTrendingCoins, fetchCoinNews } from '../services/coingecko.js';

const router = Router();

export const CURATED_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', image: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', image: 'https://coin-images.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', image: 'https://coin-images.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', image: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', image: 'https://coin-images.coingecko.com/coins/images/11939/small/shiba.png' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', image: 'https://coin-images.coingecko.com/coins/images/29850/small/pepe-token.png' },
  { id: 'dogwifhat', symbol: 'WIF', name: 'dogwifhat', image: 'https://coin-images.coingecko.com/coins/images/33566/small/dogwifhat.png' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', image: 'https://coin-images.coingecko.com/coins/images/28600/small/bonk.jpg' },
  { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', image: 'https://coin-images.coingecko.com/coins/images/16746/small/FLOKI.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', image: 'https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', image: 'https://coin-images.coingecko.com/coins/images/26375/small/sui-ocean-square.png' },
  { id: 'the-open-network', symbol: 'TON', name: 'Toncoin', image: 'https://coin-images.coingecko.com/coins/images/17980/small/ton_symbol.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', image: 'https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', image: 'https://coin-images.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', image: 'https://coin-images.coingecko.com/coins/images/10365/small/near.png' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', image: 'https://coin-images.coingecko.com/coins/images/26455/small/aptos_round.png' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', image: 'https://coin-images.coingecko.com/coins/images/25751/small/kaspa-icon-3000.png' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', image: 'https://coin-images.coingecko.com/coins/images/3688/small/hbar.png' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom', image: 'https://coin-images.coingecko.com/coins/images/4001/small/Fantom_round.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos Hub', image: 'https://coin-images.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', image: 'https://coin-images.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', image: 'https://coin-images.coingecko.com/coins/images/12645/small/AAVE.png' },
  { id: 'maker', symbol: 'MKR', name: 'Maker', image: 'https://coin-images.coingecko.com/coins/images/1364/small/Mark_Maker.png' },
  { id: 'render-token', symbol: 'RENDER', name: 'Render', image: 'https://coin-images.coingecko.com/coins/images/11636/small/rndr.png' },
  { id: 'fetch-ai', symbol: 'FET', name: 'Artificial Superintelligence', image: 'https://coin-images.coingecko.com/coins/images/5681/small/Fetch.jpg' },
  { id: 'bittensor', symbol: 'TAO', name: 'Bittensor', image: 'https://coin-images.coingecko.com/coins/images/28452/small/tao.png' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', image: 'https://coin-images.coingecko.com/coins/images/12882/small/Secondary_Symbol.png' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', image: 'https://coin-images.coingecko.com/coins/images/4713/small/polygon.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', image: 'https://coin-images.coingecko.com/coins/images/16547/small/arbitrum.png' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', image: 'https://coin-images.coingecko.com/coins/images/25244/small/OP.png' },
  { id: 'immutable-x', symbol: 'IMX', name: 'Immutable', image: 'https://coin-images.coingecko.com/coins/images/17233/small/imx.png' },
  { id: 'mantle', symbol: 'MNT', name: 'Mantle', image: 'https://coin-images.coingecko.com/coins/images/30980/small/token-logo.png' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', image: 'https://coin-images.coingecko.com/coins/images/2/small/litecoin.png' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', image: 'https://coin-images.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', image: 'https://coin-images.coingecko.com/coins/images/100/small/Stellar_lumens.png' },
  { id: 'monero', symbol: 'XMR', name: 'Monero', image: 'https://coin-images.coingecko.com/coins/images/69/small/monero-symbol-on-white-480.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', image: 'https://coin-images.coingecko.com/coins/images/12817/small/filecoin.png' },
  { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', image: 'https://coin-images.coingecko.com/coins/images/13573/small/Lido_DAO.png' }
];

router.get('/', (req, res) => {
  res.json(CURATED_COINS);
});

router.get('/trending', async (req, res) => {
  try {
    const trending = await fetchTrendingCoins();
    res.json(trending);
  } catch (error) {
    console.error('Failed to fetch trending coins:', error);
    res.status(500).json({ error: 'Failed to fetch trending coins' });
  }
});

router.get('/:symbol/news', async (req, res) => {
  try {
    const news = await fetchCoinNews(req.params.symbol);
    res.json(news);
  } catch (error) {
    console.error(`Failed to fetch news for ${req.params.symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await fetchCoinStats(req.params.id);
    res.json(stats);
  } catch (error) {
    console.error(`Failed to fetch stats for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch coin stats' });
  }
});

router.get('/:id/chart', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const chart = await fetchCoinChart(req.params.id, days);
    res.json(chart);
  } catch (error) {
    console.error(`Failed to fetch chart for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch coin chart' });
  }
});

export default router;
