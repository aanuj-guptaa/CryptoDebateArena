import { EventEmitter } from 'events';
import { callLLM } from './llm/router.js';
import * as prompts from './prompts.js';
import { randomInt } from 'crypto';

interface Turn {
  speaker: 'bull' | 'bear' | 'judge';
  turnIndex: number;
  text: string;
  tensionDelta?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DebateSession extends EventEmitter {
  id: string;
  coinId: string;
  coinData: any;
  hotTake?: string;
  turns: Turn[] = [];
  status: 'pending' | 'running' | 'completed' | 'error' = 'pending';
  verdict: any = null;

  constructor(id: string, coinId: string, coinData: any, hotTake?: string) {
    super();
    this.id = id;
    this.coinId = coinId;
    this.coinData = coinData;
    this.hotTake = hotTake;
  }

  private async executeStep(speaker: 'bull' | 'bear', stepIndex: number, promptFunc: Function, ...args: any[]) {
    const { systemPrompt, userPrompt } = promptFunc(...args);
    let text = '';
    const hasKeys = !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);

    if (hasKeys) {
      try {
        text = await callLLM(systemPrompt, userPrompt);
      } catch (e) {
        text = this.getMockTurn(speaker, stepIndex);
      }
    } else {
      await sleep(1800);
      text = this.getMockTurn(speaker, stepIndex);
    }

    const tensionDelta = speaker === 'bull' ? randomInt(8, 16) : -randomInt(8, 16);
    const turn: Turn = { speaker, turnIndex: stepIndex, text, tensionDelta };
    this.turns.push(turn);
    this.emit('turn', turn);
    return text;
  }

  private getMockTurn(speaker: 'bull' | 'bear', stepIndex: number): string {
    const coin = this.coinData?.coinName || 'Bitcoin';
    const symbol = this.coinData?.coinSymbol || 'BTC';
    const price = this.coinData?.price ? `$${this.coinData.price.toLocaleString()}` : '$64,250';
    const change = this.coinData?.change24h ? `${this.coinData.change24h > 0 ? '+' : ''}${this.coinData.change24h.toFixed(2)}%` : '+4.82%';
    const mcap = this.coinData?.marketCap ? `$${(this.coinData.marketCap / 1e9).toFixed(1)}B` : '$1.26T';
    const vol = this.coinData?.volume24h ? `$${(this.coinData.volume24h / 1e9).toFixed(1)}B` : '$28.5B';

    const hotTakeContext = this.hotTake ? ` Addressing the spectator hot-take: "${this.hotTake}" — ` : ' ';

    if (speaker === 'bull') {
      if (stepIndex === 1) {
        return `${coin} (${symbol}) is showing strong momentum at ${price} with a 24h gain of ${change}.${hotTakeContext}Backed by a massive ${mcap} market cap and ${vol} daily volume, institutional accumulation is undeniable.`;
      } else if (stepIndex === 3) {
        return `Bear overlooks the sheer liquidity represented by ${vol} in daily volume! On-chain metrics show long-term holder supply at record highs. Short-term volatility is just noise before supply shock takes over.`;
      } else {
        return `The fundamentals for ${coin} are rock solid. Every major pull-back in this structure has been fiercely bought up. At ${price}, the risk-reward ratio strongly favors aggressive buyers.`;
      }
    } else {
      if (stepIndex === 2) {
        return `Bull is ignoring clear macroeconomic headwinds and stretched valuation metrics for ${coin}.${hotTakeContext}Despite the ${change} bump, macro liquidity remains tight and upside momentum is visibly waning.`;
      } else if (stepIndex === 4) {
        return `Volume alone doesn't guarantee upward price action — distribution heavy selling can match high volume! If key support fails, leveraged long liquidations will cascade rapidly. Do not mistake turnover for demand.`;
      } else {
        return `Chasing ${symbol} after a ${change} move leaves zero margin of safety. Regulatory ambiguity and overhead technical resistance make patience the only prudent strategy right now.`;
      }
    }
  }

  async runDebate() {
    this.status = 'running';
    try {
      // 1. Bull opening
      const t1 = await this.executeStep('bull', 1, prompts.bullOpening, this.coinData, this.hotTake);
      
      // 2. Bear opening
      const t2 = await this.executeStep('bear', 2, prompts.bearOpening, this.coinData, t1, this.hotTake);
      
      // 3. Bull rebuttal
      const t3 = await this.executeStep('bull', 3, prompts.bullRebuttal, this.coinData, t2, this.hotTake);
      
      // 4. Bear rebuttal
      const t4 = await this.executeStep('bear', 4, prompts.bearRebuttal, this.coinData, t3, this.hotTake);
      
      // 5. Bull closing
      const t5 = await this.executeStep('bull', 5, prompts.bullClosing, this.coinData, t4);
      
      // 6. Bear closing
      const t6 = await this.executeStep('bear', 6, prompts.bearClosing, this.coinData, t5);
      
      // 7. Judge verdict
      const transcript = this.turns.map(t => `${t.speaker}: ${t.text}`).join('\n\n');
      const { systemPrompt, userPrompt } = prompts.judgeVerdict(this.coinData, transcript);
      
      let parsedVerdict = null;
      const hasKeys = !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);

      if (hasKeys) {
        let attempt = 0;
        while (attempt < 2 && !parsedVerdict) {
          try {
            const judgeText = await callLLM(systemPrompt, userPrompt);
            const cleanedText = judgeText.replace(/```json/gi, '').replace(/```/g, '').trim();
            parsedVerdict = JSON.parse(cleanedText);
          } catch (e) {
            console.error(`Judge parse attempt ${attempt + 1} failed`, e);
            attempt++;
          }
        }
      }

      if (!parsedVerdict) {
        await sleep(2000);
        const coin = this.coinData?.coinName || 'Bitcoin';
        const symbol = this.coinData?.coinSymbol || 'BTC';
        const isBullish = (this.coinData?.change24h || 0) >= 0;

        parsedVerdict = {
          winner: isBullish ? 'bull' : 'bear',
          confidence: 78,
          finalJudgment: isBullish ? 'CAUTIOUS BUY' : 'CAUTIOUS SELL',
          executiveSynthesis: `${coin} (${symbol}) presents a solid value thesis driven by high trading volume and network fundamentals, though short-term market liquidity headwinds warrant measured entry strategies.`,
          reasoning: `${coin}'s fundamental valuation is undergoing structural transition. While macro technical indicators remain near key support, sustained 24h volume and ongoing protocol activity mitigate downside risk, justifying a measured position for medium-to-long-term investors.`,
          bullStrongestPoint: `"Record 24h trading volume combined with net deflationary staking mechanics creates long-term structural supply scarcity for ${coin}."`,
          bearCriticalWarning: `"Macro liquidity rollups and overhead technical resistance could reduce fee burns while competing protocols capture volume market share."`,
          keyRisks: [
            `Continued L1 transaction fee degradation`,
            `Sustained weakness in ${symbol}/BTC relative strength ratio`,
            `Market share competition from alternative high-throughput blockchains`
          ]
        };
      }

      this.verdict = parsedVerdict;
      this.emit('verdict', parsedVerdict);
      
      this.status = 'completed';
      this.emit('done');
    } catch (e) {
      console.error('Debate failed:', e);
      this.status = 'error';
      this.emit('done');
    }
  }
}

export const sessionStore = new Map<string, DebateSession>();

export function createSession(id: string, coinId: string, coinData: any, hotTake?: string): DebateSession {
  const session = new DebateSession(id, coinId, coinData, hotTake);
  sessionStore.set(id, session);
  
  setTimeout(() => {
    sessionStore.delete(id);
  }, 10 * 60 * 1000);
  
  return session;
}
