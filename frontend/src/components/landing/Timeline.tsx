'use client';

import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations';
import { Play, MessageSquare, Award, RefreshCw } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Live Market Data Ingestion',
    desc: 'Ingests real-time spot price, 24h trading volume, market cap, and 7-day sparkline trends directly from CoinGecko.',
    icon: Play,
  },
  {
    num: '02',
    title: 'Dual Thesis Opening',
    desc: 'AI Bull presents accumulation thesis based on volume & network metrics. AI Bear opens with macro risks.',
    icon: MessageSquare,
  },
  {
    num: '03',
    title: 'Dynamic Rebuttal Stream',
    desc: 'Agents respond directly to specific claims in real-time, driving live market tension metrics.',
    icon: RefreshCw,
  },
  {
    num: '04',
    title: 'Arbitrated Synthesis & Verdict',
    desc: 'AI Judge evaluates argument strength against hard data and outputs a confidence-scored verdict.',
    icon: Award,
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="py-24 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeUp className="max-w-2xl mb-16">
          <SectionLabel>Analysis Workflow</SectionLabel>
          <SectionHeading>
            How the Debate Unfolds
          </SectionHeading>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.num} delay={i * 0.12}>
                <div className="glass-card p-6 border border-white/10 hover:border-bull/40 transition-all duration-300 relative group h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-3xl font-extrabold text-white/20 group-hover:text-bull transition-colors">
                        {s.num}
                      </span>
                      <div className="p-2.5 rounded-xl bg-white/5 text-bull">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-white mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
