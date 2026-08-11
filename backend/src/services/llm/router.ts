import { callGroq } from './groq.js';
import { callGemini } from './gemini.js';

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    const result = await callGroq(systemPrompt, userPrompt);
    console.log('Served by Groq');
    return result;
  } catch (groqError: any) {
    console.warn(`Groq failed (${groqError.message}), falling back to Gemini...`);
    try {
      const result = await callGemini(systemPrompt, userPrompt);
      console.log('Served by Gemini');
      return result;
    } catch (geminiError: any) {
      console.error(`Gemini also failed: ${geminiError.message}`);
      throw new Error('Both LLM providers failed');
    }
  }
}
