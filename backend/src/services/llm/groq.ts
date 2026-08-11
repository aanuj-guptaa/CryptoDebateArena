import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

export async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  const groq = new Groq({ apiKey });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
    }, { signal: controller.signal as any });

    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Groq API timeout');
    }
    if (error.status === 429) {
      throw new Error('Groq rate limit exceeded');
    }
    if (error.status >= 500) {
      throw new Error(`Groq server error: ${error.status}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
