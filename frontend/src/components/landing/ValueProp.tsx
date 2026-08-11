'use client';

import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations';
import { Database, Zap, ShieldCheck } from 'lucide-react';

const props = [
  {
    icon: Database,
    title: 'Live CoinGecko Data Integration',
    desc: 'Every argument is grounded in real-time market stats — price, 24h volume, market cap, and 7-day sparkline trends. Zero fabricated numbers.',
    color: 'text-bull border-bull/30 bg-bull/10',
  },
  {
    icon: Zap,
    title: 'Real-Time SSE Streaming',
    desc: 'Watch the debate unfold live on screen as Bull and Bear agents counter arguments turn-by-turn with character-by-character typewriter reveal.',
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  },
  {
    icon: ShieldCheck,
    title: 'Unbiased AI Judge Verdicts',
    desc: 'A neutral AI Judge analyzes both sides, evaluates argument strength against hard market data, and outputs a confidence score with reasoning.',
    color: 'text-bear border-bear/30 bg-bear/10',
  },
];

export function ValueProp() {
  return (
    <section className="py-20 relative z-10 border-t border-white/10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeUp className="max-w-2xl mb-12">
          <SectionLabel>Core Intelligence</SectionLabel>
          <SectionHeading>
            Built for Serious Crypto &amp; Market Analysis
          </SectionHeading>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeUp key={p.title} delay={i * 0.15}>
                <div className="glass-card p-8 h-full border border-white/10 hover:border-white/25 transition-all duration-300 group hover:-translate-y-1">
                  <div className={`p-3.5 rounded-2xl w-fit border mb-6 ${p.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bull transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
