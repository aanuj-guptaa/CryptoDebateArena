'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';

interface InjectHotTakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinSymbol: string;
  onInject: (hotTake: string) => void;
}

const PRESETS = [
  'What if the Federal Reserve slashes rates by 50bps next month?',
  'Is the current whale wallet outflow a sell signal or OTC accumulation?',
  'How does the upcoming protocol upgrade impact long-term tokenomics?',
  'What happens if regulatory crackdown targets top exchanges?',
];

export default function InjectHotTakeModal({
  isOpen,
  onClose,
  coinSymbol,
  onInject,
}: InjectHotTakeModalProps) {
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onInject(question.trim());
    setQuestion('');
    onClose();
  };

  const handlePresetClick = (presetText: string) => {
    setQuestion(presetText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#06111e] border border-[#163456] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 md:p-8 space-y-6 relative overflow-hidden animate-scale-up text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-[#0a1e36] border border-[#1b436e] text-[#22d3ee]">
              <MessageSquarePlus size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-xl tracking-tight text-white">
                Inject Spectator Hot-Take
              </h3>
              <p className="text-xs text-slate-400">
                Cross-examine Bull and Bear mid-match
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-300 font-semibold">
              Ask a question or inject a scenario for {coinSymbol.toUpperCase()}:
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`e.g. "Will ${coinSymbol.toUpperCase()} break past its 24h high if Bitcoin breaks $100k?"`}
              rows={3}
              className="w-full bg-[#030914] border border-[#163456] focus:border-[#22d3ee] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors resize-none font-sans"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-2.5">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
              QUICK PRESETS:
            </span>
            <div className="space-y-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left p-3 rounded-xl bg-[#081729] hover:bg-[#0e243f] border border-[#163456] hover:border-[#22d3ee]/50 text-xs text-slate-200 hover:text-white transition-all cursor-pointer leading-relaxed"
                >
                  &ldquo;{preset}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0a1b2d] hover:bg-[#0f2742] border border-[#163456] transition-colors cursor-pointer font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!question.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#22d3ee] to-emerald-400 hover:from-emerald-400 hover:to-[#22d3ee] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider"
            >
              <Send size={14} />
              <span>INJECT INTO DEBATE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
