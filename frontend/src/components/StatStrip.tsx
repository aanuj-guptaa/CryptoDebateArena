'use client';

import { CoinStats } from '../lib/types';
import { Volume2, VolumeX, RefreshCw, MessageSquarePlus, Pause, Play } from 'lucide-react';
import { sound } from '../lib/sound';
import { useState } from 'react';

interface StatStripProps {
  stats: CoinStats;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onOpenPicker?: () => void;
  onOpenHotTake?: () => void;
}

export default function StatStrip({
  stats,
  coinName,
  coinSymbol,
  coinImage,
  isPaused = false,
  onTogglePause,
  onOpenPicker,
  onOpenHotTake,
}: StatStripProps) {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    sound.initAndResume();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const formatLarge = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return formatter.format(num);
  };

  const isPositive = stats.change24h >= 0;

  return (
    <div className="glass-card flex flex-wrap items-center justify-between p-4 md:px-8 gap-4 w-full animate-fade-in">
      <div className="flex items-center space-x-4">
        {coinImage && (
          <img
            src={coinImage}
            alt={coinName}
            width={36}
            height={36}
            className="rounded-full shadow-md"
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white leading-tight">
              {coinName}
            </h2>
            {onOpenPicker && (
              <button
                onClick={onOpenPicker}
                title="Switch Coin"
                className="px-2.5 py-1 text-xs font-bold text-bull bg-bull/10 hover:bg-bull/20 border border-bull/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <RefreshCw size={12} />
                <span>Switch Coin</span>
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {coinSymbol}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center space-x-3 md:space-x-5 gap-y-2">
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Price
          </span>
          <span className="text-lg font-semibold text-white">
            {formatter.format(stats.price)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
            24h Change
          </span>
          <span
            className={`text-lg font-semibold flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(stats.change24h).toFixed(2)}%
          </span>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Market Cap
          </span>
          <span className="text-lg font-medium text-white/90">
            {formatLarge(stats.marketCap)}
          </span>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Volume (24h)
          </span>
          <span className="text-lg font-medium text-white/90">
            {formatLarge(stats.volume24h)}
          </span>
        </div>

        {/* Pause / Resume Button */}
        {onTogglePause && (
          <button
            onClick={onTogglePause}
            className={`px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white'
            }`}
            title={isPaused ? 'Resume Debate Stream' : 'Pause Debate Stream'}
          >
            {isPaused ? <Play size={15} className="fill-amber-300" /> : <Pause size={15} />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        )}

        {/* Hot Take Injector Button */}
        {onOpenHotTake && (
          <button
            onClick={onOpenHotTake}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-bull/20 hover:from-cyan-500/30 hover:to-bull/30 border border-cyan-400/40 text-cyan-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <MessageSquarePlus size={16} />
            <span className="hidden sm:inline">Inject Hot-Take 💬</span>
          </button>
        )}

        {/* Audio Toggle Button */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Arena Sound Effects' : 'Mute Sound Effects'}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
            isMuted
              ? 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
              : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          }`}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span className="hidden lg:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>
      </div>
    </div>
  );
}
