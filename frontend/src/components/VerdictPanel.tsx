'use client';

import { Verdict } from '../lib/types';
import { Sparkles, Zap, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { sound } from '../lib/sound';

interface VerdictPanelProps {
  verdict: Verdict;
  onDebateAgain: () => void;
  onOpenPicker?: () => void;
}

export default function VerdictPanel({ verdict, onDebateAgain, onOpenPicker }: VerdictPanelProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    sound.playVerdict(verdict.winner);
    const timer = setTimeout(() => {
      setAnimatedConfidence(verdict.confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [verdict.confidence, verdict.winner]);

  const isBull = verdict.winner === 'bull';
  const isBear = verdict.winner === 'bear';

  const judgmentText = verdict.finalJudgment || (isBull ? 'CAUTIOUS BUY' : isBear ? 'CAUTIOUS SELL' : 'NEUTRAL / HOLD');
  const confidenceRating = verdict.confidence >= 75 ? 'HIGH' : verdict.confidence >= 50 ? 'MODERATE' : 'LOW';

  const judgmentColor = isBull
    ? 'text-[#22d3ee] drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]'
    : isBear
      ? 'text-[#f43f5e] drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]'
      : 'text-[#f59e0b] drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]';

  const strokeColor = isBull ? '#22d3ee' : isBear ? '#f43f5e' : '#f59e0b';

  // SVG Radial Gauge
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - (animatedConfidence / 100) * circumference;

  const fallbackSynthesis = verdict.executiveSynthesis || verdict.reasoning;
  const fallbackReasoning = verdict.reasoning;
  const bullPoint = verdict.bullStrongestPoint || '"Sustained volume metrics combined with net deflationary staking mechanics creates long-term structural supply scarcity."';
  const bearPoint = verdict.bearCriticalWarning || '"Macro liquidity tightening and overhead technical resistance could trigger liquidations while competing protocols capture market share."';
  const risks = verdict.keyRisks || [
    'Continued L1 fee revenue degradation',
    'Sustained weakness in relative strength ratio',
    'Market share loss to competing high-throughput L1s'
  ];

  return (
    <div className="glass-card p-6 md:p-8 w-full mt-8 animate-slide-up bg-[#040d1a] border border-[#12283e] shadow-[0_0_60px_rgba(0,0,0,0.8)] rounded-2xl space-y-6">
      
      {/* 1. Header: Final Judgment & Confidence Dial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#12283e] gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
            FINAL JUDGMENT
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-1 uppercase ${judgmentColor}`}>
            {judgmentText}
          </h2>
        </div>

        {/* Confidence Card (Right) */}
        <div className="bg-[#071728] border border-[#163554] rounded-xl px-5 py-3 flex items-center space-x-4 self-start sm:self-auto">
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-white font-mono">
              {Math.round(animatedConfidence)}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              CONFIDENCE
            </span>
            <span className="text-sm font-extrabold font-mono text-white tracking-wide">
              {confidenceRating}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Executive Verdict Synthesis */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">
          <Sparkles size={14} className="text-[#22d3ee]" />
          <span>EXECUTIVE VERDICT SYNTHESIS</span>
        </div>
        <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
          {fallbackSynthesis}
        </p>
      </div>

      {/* 3. Arbiter Reasoning Box */}
      <div className="bg-[#081524] border border-[#163554] p-5 rounded-xl space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
          ARBITER REASONING:
        </span>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          {fallbackReasoning}
        </p>
      </div>

      {/* 4. Side-by-Side Dual Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bull Highlight */}
        <div className="bg-[#051c1b]/60 border border-[#0d5448] p-4 md:p-5 rounded-xl space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Zap size={14} />
            <span>BULL&apos;S STRONGEST POINT</span>
          </div>
          <p className="text-emerald-100 text-xs md:text-sm italic leading-relaxed">
            {bullPoint}
          </p>
        </div>

        {/* Bear Highlight */}
        <div className="bg-[#200b16]/60 border border-[#5c162e] p-4 md:p-5 rounded-xl space-y-2 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
            <ShieldAlert size={14} />
            <span>BEAR&apos;S CRITICAL WARNING</span>
          </div>
          <p className="text-rose-100 text-xs md:text-sm italic leading-relaxed">
            {bearPoint}
          </p>
        </div>
      </div>

      {/* 5. Key Downside Risks Monitored */}
      <div className="bg-[#081524] border border-[#163554] p-5 rounded-xl space-y-3">
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
          <AlertTriangle size={14} className="text-amber-400" />
          <span>KEY DOWNSIDE RISKS MONITORED</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {risks.map((risk, idx) => (
            <div
              key={idx}
              className="bg-[#0f243b] border border-[#1a4066] px-3.5 py-2 rounded-lg text-xs font-mono text-slate-200 flex items-center space-x-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="truncate">{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          onClick={onDebateAgain}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-xs"
        >
          <RefreshCw size={14} />
          <span>Debate Again</span>
        </button>

        {onOpenPicker && (
          <button
            onClick={onOpenPicker}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-[#22d3ee] to-emerald-400 hover:from-emerald-400 hover:to-[#22d3ee] shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-95 text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>Pick Another Coin</span>
          </button>
        )}
      </div>
    </div>
  );
}
