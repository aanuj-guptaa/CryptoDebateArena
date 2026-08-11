'use client';

import { FadeUp } from '../ui/Animations';
import Link from 'next/link';
import { ArrowRight, Swords } from 'lucide-react';

export function CTA({ onOpenPicker }: { onOpenPicker?: () => void }) {
  return (
    <section className="py-24 relative z-10 border-t border-white/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <FadeUp>
          <div className="glass-card p-10 md:p-16 border-white/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-bull/20 to-bear/20 blur-[90px] rounded-full pointer-events-none" />

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto mb-6 text-bull">
              <Swords size={32} />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to Watch the Market Clash?
            </h2>
            <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Experience live AI Bull vs Bear debates for Bitcoin, Solana, Pepe, and 40+ cryptocurrencies.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {onOpenPicker ? (
                <button
                  onClick={onOpenPicker}
                  className="px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-bull to-emerald-400 hover:from-emerald-400 hover:to-bull shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center space-x-3 text-base cursor-pointer"
                >
                  <span>Choose Cryptocurrency &amp; Enter Arena</span>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <Link
                  href="/arena?coin=bitcoin"
                  className="px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-bull to-emerald-400 hover:from-emerald-400 hover:to-bull shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all active:scale-95 flex items-center space-x-3 text-base"
                >
                  <span>Enter Arena</span>
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
