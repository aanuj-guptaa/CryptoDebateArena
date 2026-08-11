'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Volume2, VolumeX, Swords, Sparkles } from 'lucide-react';
import { sound } from '../../lib/sound';

interface NavbarProps {
  onOpenPicker?: () => void;
}

export function Navbar({ onOpenPicker }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    sound.initAndResume();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-bull/20 to-bear/20 border border-white/15 group-hover:border-bull/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Swords size={22} className="text-bull group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-bull via-white to-bear text-transparent bg-clip-text">
              Crypto Debate Arena
            </span>
            <span className="block text-[10px] text-white/50 uppercase tracking-widest font-mono font-medium">
              AI Bull 🐂 vs Bear 🐻
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#agents" className="hover:text-white transition-colors">
            AI Agents
          </a>
          <a href="#timeline" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={onOpenPicker}
            className="px-5 py-2.5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-bull to-emerald-400 hover:from-emerald-400 hover:to-bull shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
          >
            <Sparkles size={16} />
            <span>Enter Arena</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
