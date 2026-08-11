'use client';
import { DebateTurn } from '../lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AgentCardProps {
  speaker: 'bull' | 'bear';
  turns: DebateTurn[];
  isActive: boolean;
}

import { sound } from '../lib/sound';

function TypewriterText({ text }: { text: string }) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    setDisplayedLength(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedLength(i);
      if (i % 2 === 0) {
        sound.playKeyPress();
      }
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {text.substring(0, displayedLength)}
      {displayedLength < text.length && (
        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function AgentCard({ speaker, turns, isActive }: AgentCardProps) {
  const isBull = speaker === 'bull';
  const Icon = isBull ? TrendingUp : TrendingDown;
  const scrollRef = useRef<HTMLDivElement>(null);

  const getLabel = (turnIndex: number) => {
    if (turnIndex <= 2) return isBull ? 'Bullish Core Thesis' : 'Bearish Core Thesis';
    if (turnIndex <= 4) return 'Market Counter-Analysis';
    return 'Final Market Position';
  };

  // Auto-scroll to bottom when new turns arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length]);

  // Card Outer Styles
  const cardBorder = isBull
    ? isActive
      ? 'border-emerald-600/90 border-l-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-emerald-950/20'
      : 'border-white/10 border-l-emerald-500/50 bg-white/5 opacity-80'
    : isActive
      ? 'border-rose-600/90 border-l-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.3)] bg-rose-950/20'
      : 'border-white/10 border-l-rose-500/50 bg-white/5 opacity-80';

  const headerBg = isActive
    ? isBull
      ? 'bg-emerald-950/40 border-b border-emerald-600/50'
      : 'bg-rose-950/40 border-b border-rose-600/50'
    : 'border-b border-white/10';

  return (
    <div className={`glass-card flex flex-col h-[500px] border-l-4 overflow-hidden transition-all duration-500 ${cardBorder} ${isActive ? 'scale-[1.01] z-10' : ''}`}>
      {/* Card Header */}
      <div className={`p-4 flex items-center justify-between transition-colors duration-300 ${headerBg}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${isBull ? 'bg-emerald-950/50 border-emerald-600/40 text-emerald-400' : 'bg-rose-950/50 border-rose-600/40 text-rose-400'}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className={`font-extrabold text-lg tracking-wide uppercase ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
              {speaker} Agent
            </h3>
            <p className="text-xs text-white/50 uppercase tracking-widest font-medium">
              {isBull ? 'Optimist' : 'Skeptic'}
            </p>
          </div>
        </div>
        {isActive && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full animate-pulse border shadow-md ${
            isBull
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-emerald-900/50'
              : 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-rose-900/50'
          }`}>
            Speaking...
          </span>
        )}
      </div>

      {/* Message Stream Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {turns.map((turn, i) => {
          const isLast = i === turns.length - 1;
          const shouldAnimate = isLast && isActive;

          // Dialogue box background & border styles
          let dialogueBoxStyle = '';
          if (shouldAnimate) {
            dialogueBoxStyle = isBull
              ? 'bg-emerald-950/70 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-emerald-100'
              : 'bg-rose-950/70 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)] text-rose-100';
          } else {
            dialogueBoxStyle = isBull
              ? 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-50/90'
              : 'bg-rose-950/30 border border-rose-800/40 text-rose-50/90';
          }

          return (
            <div key={turn.turnIndex} className="animate-fade-in">
              <div className={`text-xs mb-1 uppercase tracking-wider font-semibold ${
                shouldAnimate 
                  ? (isBull ? 'text-emerald-400' : 'text-rose-400') 
                  : 'text-white/40'
              }`}>
                {getLabel(turn.turnIndex)}
              </div>
              <div className={`p-4 rounded-xl text-sm md:text-base leading-relaxed transition-all duration-300 ${dialogueBoxStyle}`}>
                {shouldAnimate ? (
                  <TypewriterText text={turn.text} />
                ) : (
                  <span>{turn.text}</span>
                )}
              </div>
            </div>
          );
        })}

        {turns.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/30 italic text-sm">
            Waiting for argument...
          </div>
        )}
      </div>
    </div>
  );
}
