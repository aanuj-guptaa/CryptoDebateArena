'use client';

import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI Bull vs Bear debate work?',
    a: 'When you select a cryptocurrency, the platform ingests live market data from CoinGecko. High-performance AI models (Llama 3.1 & Gemini 2.0 Flash) then execute a structured multi-turn debate sequence between Bull, Bear, and Judge personas.',
  },
  {
    q: 'Are the market data numbers real-time?',
    a: 'Yes. All spot prices, 24h trading volume, market cap figures, and historical sparkline trends are pulled directly from CoinGecko public API feeds.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. The AI debate agents analyze market data to model bullish and bearish perspectives for research, education, and sentiment analysis. Always conduct independent due diligence before trading.',
  },
  {
    q: 'What cryptocurrencies can I analyze?',
    a: 'We support 40+ cryptocurrencies across Layer 1 blockchains (BTC, ETH, SOL, SUI), Memecoins (PEPE, DOGE, WIF), AI & Big Data tokens (TAO, RENDER, FET), DeFi protocols (LINK, UNI, AAVE), and Layer 2 networks.',
  },
  {
    q: 'How is the final Judge verdict determined?',
    a: 'The neutral AI Judge evaluates argument quality, checks factual consistency against CoinGecko metrics, and generates a structured verdict complete with a confidence score and key takeaways.',
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative z-10 border-t border-white/10 bg-slate-950/40">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <FadeUp className="text-center mb-16">
          <SectionLabel>Got Questions?</SectionLabel>
          <SectionHeading>Frequently Asked Questions</SectionHeading>
        </FadeUp>

        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <FadeUp key={f.q} delay={i * 0.08}>
                <div className="glass-card border border-white/10 overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-base md:text-lg text-white hover:text-bull transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-bull' : 'text-white/40'}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
