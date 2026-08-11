export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface CoinStats {
  coinName: string;
  coinSymbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
  image: string;
}

export interface ChartPoint {
  timestamp: number;
  price: number;
}

export interface DebateTurn {
  speaker: 'bull' | 'bear' | 'judge';
  turnIndex: number;
  text: string;
  tensionDelta: number;
}

export interface Verdict {
  winner: 'bull' | 'bear' | 'neutral';
  confidence: number;
  reasoning: string;
  finalJudgment?: string;
  executiveSynthesis?: string;
  bullStrongestPoint?: string;
  bearCriticalWarning?: string;
  keyRisks?: string[];
}

export type DebateStatus = 'idle' | 'connecting' | 'streaming' | 'completed' | 'error' | 'reconnecting';
