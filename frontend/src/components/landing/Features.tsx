'use client';

import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations';
import { Activity, Cpu, Zap, Coins } from 'lucide-react';

const features = [
  {
    icon: Activity,
    tag: 'Sentiment Analytics',
    title: 'Dynamic Market Tension Gauge',
    desc: 'Visual sentiment meter dynamically tracks real-time argument weight, volume shifts, and momentum between bullish and bearish market theses.',
  },
  {
    icon: Cpu,
    tag: 'Multi-Model AI',
    tagColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    title: 'Dual LLM Consensus Engine',
    desc: 'Powered by high-throughput Llama 3.1 & Gemini 2.0 Flash models working in tandem to evaluate market structures and risk vectors.',
  },
  {
    icon: Zap,
    tag: 'Low Latency',
    title: 'Real-Time Streamed Intelligence',
    desc: 'Arguments and counter-arguments stream live with zero latency, providing immediate breakdown of key support, resistance, and market catalysts.',
  },
  {
    icon: Coins,
    tag: '40+ Assets',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    title: 'Comprehensive Crypto Coverage',
    desc: 'Instant analysis across major Layer 1s (BTC, ETH, SOL, SUI), Memecoins (PEPE, DOGE, WIF), AI Tokens (TAO, RENDER, FET), DeFi, and Layer 2 Networks.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeUp className="max-w-2xl mb-16">
          <SectionLabel>Platform Capabilities</SectionLabel>
          <SectionHeading>
            Institutional-Grade Analytics Engine
          </SectionHeading>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.title} delay={i * 0.12}>
                <div className="glass-card p-8 border border-white/10 hover:border-white/25 transition-all duration-300 relative group overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-bull group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${f.tagColor || 'text-bull bg-bull/10 border-bull/30'}`}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {f.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {f.desc}
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
