'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Hero({ onOpenPicker }: { onOpenPicker?: () => void }) {
  const line1 = [{ text: 'Where', cls: 'text-white' }, { text: 'AI Bull', cls: 'text-bull font-extrabold' }];
  const line2 = [{ text: 'Fights', cls: 'text-white' }, { text: 'AI Bear.', cls: 'text-bear font-extrabold' }];
  const line3 = [
    { text: 'Real-Time', cls: 'text-white/40 font-medium' },
    { text: 'Market Intelligence.', cls: 'text-white/40 font-medium' },
  ];

  const lines = [line1, line2, line3];

  // Interactive Live Preview Simulation State
  const [activeSpeaker, setActiveSpeaker] = useState<'bull' | 'bear'>('bull');
  const [tensionVal, setTensionVal] = useState(58);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpeaker((prev) => {
        const next = prev === 'bull' ? 'bear' : 'bull';
        setTensionVal(next === 'bull' ? 68 : 38);
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-bull/10 via-slate-900/0 to-bear/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Column: Heading & CTAs */}
        <div className="flex-1 max-w-2xl">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 mb-6 text-xs font-semibold text-white/80"
          >
            <span className="w-2 h-2 rounded-full bg-bull animate-ping" />
            <Sparkles size={14} className="text-bull" />
            <span>Powered by Live CoinGecko Market Feeds</span>
          </motion.div>

          {/* Staggered Heading */}
          <div className="mb-6 space-y-1">
            {lines.map((words, li) => (
              <div key={li} className="flex items-baseline flex-wrap gap-x-3 overflow-hidden leading-tight">
                {words.map((w, wi) => (
                  <div key={wi} className="overflow-hidden py-1">
                    <motion.span
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{ duration: 0.75, delay: (li * 2 + wi) * 0.12 }}
                      className={`inline-block text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight ${w.cls}`}
                    >
                      {w.text}
                    </motion.span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base md:text-lg text-white/70 mb-10 leading-relaxed max-w-xl"
          >
            Watch autonomous AI agents debate cryptocurrency buys in real-time.
            Bull and Bear analyze volume, hash rates, and macro liquidity — while a neutral AI Judge declares the final verdict.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4"
          >
            {onOpenPicker ? (
              <button
                onClick={onOpenPicker}
                className="px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-bull to-emerald-400 hover:from-emerald-400 hover:to-bull shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center space-x-3 text-base cursor-pointer"
              >
                <span>Enter the Arena</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <Link
                href="/arena?coin=bitcoin"
                className="px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-bull to-emerald-400 hover:from-emerald-400 hover:to-bull shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center space-x-3 text-base"
              >
                <span>Enter the Arena</span>
                <ArrowRight size={20} />
              </Link>
            )}

            {onOpenPicker && (
              <button
                onClick={onOpenPicker}
                className="px-6 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all text-base cursor-pointer"
              >
                Explore 40+ Coins 🪙
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Column: Animated Live Debate Preview Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="glass-card p-6 border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png"
                  alt="Bitcoin"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-white text-base">Bitcoin Arena</h3>
                  <span className="text-xs text-white/50 font-mono">$64,250.50 (+4.82% 24h)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-bull/20 text-bull border border-bull/40 font-bold uppercase animate-pulse">
                LIVE DEBATE
              </span>
            </div>

            {/* Duel Cards */}
            <div className="space-y-3 mb-5">
              {/* Bull Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-500 ${
                  activeSpeaker === 'bull'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp size={14} /> 🐂 BULL AGENT
                  </span>
                  {activeSpeaker === 'bull' && (
                    <span className="text-[10px] uppercase animate-pulse font-mono">Speaking...</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed">
                  &ldquo;BTC volume surged past $28.5B with long-term supply locked at record highs. Momentum heavily favors buyers.&rdquo;
                </p>
              </div>

              {/* Bear Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-500 ${
                  activeSpeaker === 'bear'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <TrendingDown size={14} /> 🐻 BEAR AGENT
                  </span>
                  {activeSpeaker === 'bear' && (
                    <span className="text-[10px] uppercase animate-pulse font-mono">Speaking...</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed">
                  &ldquo;Macro liquidity remains tight and overhead technical resistance is firm. Chasing this move risks buying the top.&rdquo;
                </p>
              </div>
            </div>

            {/* Dynamic Tension Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-white/60">
                <span className="text-rose-400">🐻 Bear</span>
                <span>Market Sentiment Index ({tensionVal}%)</span>
                <span className="text-emerald-400">Bull 🐂</span>
              </div>
              <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#fff] transition-all duration-700 ease-out"
                  style={{ left: `${tensionVal}%` }}
                />
              </div>
            </div>

            {/* Verdict Badge */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Scale size={14} /> AI Judge: Bullish Lean (78% Confidence)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/40">
                Verified Data
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
