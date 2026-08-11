'use client';

import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

const agents = [
  {
    role: 'Bull Agent 🐂',
    title: 'The Optimist Analyst',
    color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    icon: TrendingUp,
    points: [
      'Cites 24h volume surges & liquidity accumulation',
      'Highlights network security & hash rate growth',
      'Focuses on supply squeeze & institutional momentum',
    ],
  },
  {
    role: 'Bear Agent 🐻',
    title: 'The Skeptic Analyst',
    color: 'border-rose-500/50 bg-rose-950/20 text-rose-400',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]',
    icon: TrendingDown,
    points: [
      'Exposes macro liquidity contractions & overhead resistance',
      'Warns of leveraged long liquidation cascades',
      'Demands high margin of safety before entry',
    ],
  },
  {
    role: 'Judge Agent ⚖️',
    title: 'The Neutral Arbiter',
    color: 'border-amber-500/50 bg-amber-950/20 text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    icon: Scale,
    points: [
      'Weighs arguments against actual CoinGecko numbers',
      'Prevents split-the-difference neutral hedging',
      'Outputs structured JSON verdict with confidence score',
    ],
  },
];

export function Roles() {
  return (
    <section id="agents" className="py-24 relative z-10 border-t border-white/10 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeUp className="max-w-2xl mb-16">
          <SectionLabel>Meet the Combatants</SectionLabel>
          <SectionHeading>
            Three Specialized AI Personalities
          </SectionHeading>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeUp key={a.role} delay={i * 0.15}>
                <div className={`glass-card p-8 border ${a.color} ${a.glow} rounded-2xl h-full flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <Icon size={26} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl text-white">{a.role}</h3>
                        <p className="text-xs text-white/50 uppercase tracking-widest">{a.title}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      {a.points.map((pt, j) => (
                        <div key={j} className="flex items-start space-x-2 text-xs text-white/80 leading-relaxed">
                          <span className="text-white/40 font-mono">•</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
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
