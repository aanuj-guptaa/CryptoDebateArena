export interface CoinData {
  coinName: string;
  coinSymbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  news?: any[];
}

export function formatCoinData(coinData: CoinData): string {
  let text = `Coin: ${coinData.coinName} (${coinData.coinSymbol})
Price: $${coinData.price.toLocaleString()}
24h Change: ${coinData.change24h?.toFixed(2)}%
Market Cap: $${coinData.marketCap.toLocaleString()}
24h Volume: $${coinData.volume24h.toLocaleString()}`;

  if (coinData.news && coinData.news.length > 0) {
    text += `\n\nRecent Market Headlines:\n` + coinData.news.slice(0, 3).map((n, i) => `${i + 1}. "${n.title}"`).join('\n');
  }

  return text;
}

export function bullOpening(coinData: CoinData, hotTake?: string) {
  const hotTakeText = hotTake ? `\n\nSPECTATOR HOT-TAKE INJECTED: "${hotTake}"\nAddress this specific question/scenario in your argument.` : '';
  return {
    systemPrompt: "You are Bull, a confident crypto analyst who argues FOR buying. You use the live data and news headlines given to you, cite specific numbers/facts, and make a sharp, punchy case in 2-3 sentences. No hedging, no disclaimers, no 'not financial advice' — you're a debate character, not a compliance officer. Never fabricate data not given to you.",
    userPrompt: `${formatCoinData(coinData)}${hotTakeText}\n\nMake your opening case for why ${coinData.coinName} is a good buy right now.`
  };
}

export function bearOpening(coinData: CoinData, bullTurn: string, hotTake?: string) {
  const hotTakeText = hotTake ? `\n\nSPECTATOR HOT-TAKE INJECTED: "${hotTake}"\nAddress this specific question/scenario.` : '';
  return {
    systemPrompt: "You are Bear, a skeptical crypto analyst who argues AGAINST buying right now. Use the live data and news headlines, point to risk/volatility/valuation concerns, be sharp and specific, 2-3 sentences, no disclaimers.",
    userPrompt: `${formatCoinData(coinData)}\n\nBull just argued: "${bullTurn}"${hotTakeText}\n\nMake your opening case for why ${coinData.coinName} is NOT a good buy right now.`
  };
}

export function bullRebuttal(coinData: CoinData, bearTurn: string, hotTake?: string) {
  const hotTakeText = hotTake ? `\n\nSPECTATOR HOT-TAKE SCENARIO: "${hotTake}"` : '';
  return {
    systemPrompt: "You are Bull, a confident crypto analyst who argues FOR buying. You're in a live debate. Respond directly to what Bear just said — counter their specific point, don't repeat your opening. Stay under 3 sentences. No disclaimers.",
    userPrompt: `${formatCoinData(coinData)}\n\nBear just argued: "${bearTurn}"${hotTakeText}\n\nCounter their point and reinforce your case.`
  };
}

export function bearRebuttal(coinData: CoinData, bullTurn: string, hotTake?: string) {
  const hotTakeText = hotTake ? `\n\nSPECTATOR HOT-TAKE SCENARIO: "${hotTake}"` : '';
  return {
    systemPrompt: "You are Bear, a skeptical crypto analyst who argues AGAINST buying right now. You're in a live debate. Respond directly to what Bull just said — counter their specific point, don't repeat your opening. Stay under 3 sentences. No disclaimers.",
    userPrompt: `${formatCoinData(coinData)}\n\nBull just argued: "${bullTurn}"${hotTakeText}\n\nCounter their point and reinforce your case.`
  };
}

export function bullClosing(coinData: CoinData, bearTurn: string) {
  return {
    systemPrompt: "You are Bull, a confident crypto analyst who argues FOR buying. This is your final closing statement. Summarize your single strongest point based on the data and news. Make it land. 2-3 sentences max. No disclaimers.",
    userPrompt: `${formatCoinData(coinData)}\n\nBear's last point: "${bearTurn}"\n\nDeliver your closing statement.`
  };
}

export function bearClosing(coinData: CoinData, bullTurn: string) {
  return {
    systemPrompt: "You are Bear, a skeptical crypto analyst who argues AGAINST buying right now. This is your final closing statement. Summarize your single strongest risk concern based on the data and news. Make it land. 2-3 sentences max. No disclaimers.",
    userPrompt: `${formatCoinData(coinData)}\n\nBull's last point: "${bullTurn}"\n\nDeliver your closing statement.`
  };
}

export function judgeVerdict(coinData: CoinData, fullTranscript: string) {
  return {
    systemPrompt: `You are Judge, a neutral, data-driven analyst. You've watched Bull and Bear debate. Weigh their strongest points against actual data and news. Do not just split the difference — reach a real lean. Output STRICT JSON only, no markdown fences:
{
  "winner": "bull"|"bear"|"neutral",
  "confidence": <0-100>,
  "finalJudgment": "STRONG BUY"|"CAUTIOUS BUY"|"NEUTRAL / HOLD"|"CAUTIOUS SELL"|"STRONG SELL",
  "executiveSynthesis": "<1-2 sentence executive verdict summary>",
  "reasoning": "<3-4 sentence detailed arbiter reasoning>",
  "bullStrongestPoint": "<single strongest argument from Bull>",
  "bearCriticalWarning": "<single strongest critical warning from Bear>",
  "keyRisks": ["<risk 1>", "<risk 2>", "<risk 3>"]
}`,
    userPrompt: `${formatCoinData(coinData)}\n\nFull debate transcript:\n${fullTranscript}\n\nGive your complete verdict as strict JSON.`
  };
}
