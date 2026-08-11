import { CoinInfo, CoinStats, ChartPoint } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchCoins(): Promise<CoinInfo[]> {
  const res = await fetch(`${API_URL}/api/coins`);
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export async function fetchTrendingCoins(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/coins/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending coins');
  return res.json();
}

export async function fetchCoinNews(symbol: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/coins/${symbol}/news`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function fetchCoinStats(coinId: string): Promise<CoinStats> {
  const res = await fetch(`${API_URL}/api/coins/${coinId}/stats`);
  if (!res.ok) throw new Error('Failed to fetch coin stats');
  return res.json();
}

export async function fetchCoinChart(coinId: string, days: number = 7): Promise<ChartPoint[]> {
  const res = await fetch(`${API_URL}/api/coins/${coinId}/chart?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch chart data');
  return res.json();
}

export async function startDebate(coinId: string, hotTake?: string): Promise<{ debateId: string }> {
  const res = await fetch(`${API_URL}/api/debate/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coinId, hotTake }),
  });
  if (!res.ok) throw new Error('Failed to start debate');
  return res.json();
}

export function getStreamUrl(debateId: string): string {
  return `${API_URL}/api/debate/stream/${debateId}`;
}
