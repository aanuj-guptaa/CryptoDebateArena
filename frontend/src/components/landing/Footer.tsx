'use client';

import Link from 'next/link';
import { Swords } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-slate-950 text-white/50 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-bull">
            <Swords size={16} />
          </div>
          <span className="font-bold text-sm text-white">Crypto Debate Arena</span>
        </div>

        <p className="text-center md:text-left text-white/40">
          Powered by CoinGecko API, Groq (Llama 3.1 8B), and Gemini 2.0 Flash. For entertainment &amp; research only. Not financial advice.
        </p>

        <div className="flex items-center space-x-6">
          <Link href="/arena?coin=bitcoin" className="hover:text-white transition-colors">
            Bitcoin Arena
          </Link>
          <Link href="/arena?coin=solana" className="hover:text-white transition-colors">
            Solana Arena
          </Link>
          <Link href="/arena?coin=ethereum" className="hover:text-white transition-colors">
            Ethereum Arena
          </Link>
        </div>
      </div>
    </footer>
  );
}
