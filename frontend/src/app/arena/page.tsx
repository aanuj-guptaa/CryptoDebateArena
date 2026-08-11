import ArenaView from '../../components/ArenaView';
import { Suspense } from 'react';
import LoadingState from '../../components/LoadingState';

// Map common symbols to CoinGecko IDs
const coinMap: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'sol': 'solana',
  'xrp': 'ripple',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'shib': 'shiba-inu',
  'pepe': 'pepe',
  'wif': 'dogwifhat',
  'bonk': 'bonk',
  'floki': 'floki',
  'avax': 'avalanche-2',
  'sui': 'sui',
  'ton': 'the-open-network',
  'link': 'chainlink',
  'dot': 'polkadot',
  'near': 'near',
  'apt': 'aptos',
  'kas': 'kaspa',
  'hbar': 'hedera-hashgraph',
  'ftm': 'fantom',
  'atom': 'cosmos',
  'uni': 'uniswap',
  'aave': 'aave',
  'mkr': 'maker',
  'render': 'render-token',
  'fet': 'fetch-ai',
  'tao': 'bittensor',
  'inj': 'injective-protocol',
  'matic': 'matic-network',
  'arb': 'arbitrum',
  'op': 'optimism',
  'imx': 'immutable-x',
  'mnt': 'mantle',
  'ltc': 'litecoin',
  'bch': 'bitcoin-cash',
  'xlm': 'stellar',
  'xmr': 'monero',
  'fil': 'filecoin',
  'ldo': 'lido-dao',
};

export const metadata = {
  title: 'Arena | Crypto Debate Arena',
  description: 'Watch AI agents debate cryptocurrency investments in real-time',
};

export default async function ArenaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let coinQuery = (params.coin as string) || 'bitcoin';
  coinQuery = coinQuery.toLowerCase();
  
  const coinId = coinMap[coinQuery] || coinQuery;

  return (
    <main className="min-h-screen bg-arena-darker text-white overflow-x-hidden">
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><LoadingState mode="coldStart" /></div>}>
        <ArenaView coinId={coinId} />
      </Suspense>
    </main>
  );
}
