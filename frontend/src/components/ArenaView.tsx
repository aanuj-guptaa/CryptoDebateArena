'use client';

import { useState, useEffect } from 'react';
import { CoinStats, ChartPoint } from '../lib/types';
import { fetchCoinStats, fetchCoinChart, startDebate } from '../lib/api';
import { useDebateStream } from '../hooks/useDebateStream';
import StatStrip from './StatStrip';
import PriceChart from './PriceChart';
import AgentCard from './AgentCard';
import TensionMeter from './TensionMeter';
import VerdictPanel from './VerdictPanel';
import LoadingState from './LoadingState';
import CoinPickerModal from './CoinPickerModal';
import InjectHotTakeModal from './InjectHotTakeModal';
import { AlertCircle, MessageSquarePlus, Pause, Play, RefreshCw } from 'lucide-react';
import { sound } from '../lib/sound';

interface ArenaViewProps {
  coinId: string;
}

export default function ArenaView({ coinId }: ArenaViewProps) {
  const [stats, setStats] = useState<CoinStats | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [debateId, setDebateId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isHotTakeOpen, setIsHotTakeOpen] = useState(false);
  const [currentHotTake, setCurrentHotTake] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { turns, tension, verdict, status, error: streamError } = useDebateStream(debateId, isPaused);

  const [activeSpeaker, setActiveSpeaker] = useState<'bull' | 'bear' | null>(null);

  const initializeArena = async (hotTake?: string) => {
    setIsInitializing(true);
    setInitError(null);
    setDebateId(null);
    setIsPaused(false);
    if (hotTake) {
      setCurrentHotTake(hotTake);
    }

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const [statsData, chartData] = await Promise.all([
          fetchCoinStats(coinId),
          fetchCoinChart(coinId),
        ]);

        setStats(statsData);
        setChart(chartData);

        const debateData = await startDebate(coinId, hotTake);
        setDebateId(debateData.debateId);
        setIsInitializing(false);
        return;
      } catch (err) {
        console.warn(`Arena init attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          setInitError('Failed to initialize the arena. If the backend is sleeping on Render (free tier), it takes ~30 seconds to wake up. Click "Try Again" below.');
          setIsInitializing(false);
          return;
        }
        // Wait 3 seconds before retrying (Render cold start)
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  };

  useEffect(() => {
    setCurrentHotTake(null);
    initializeArena();
  }, [coinId]);

  // Determine active speaker from turns
  useEffect(() => {
    if (!isPaused && turns.length > 0) {
      const lastTurn = turns[turns.length - 1];
      if (lastTurn.speaker === 'bull' || lastTurn.speaker === 'bear') {
        setActiveSpeaker(lastTurn.speaker);
        sound.playTurnStart(lastTurn.speaker);
        const timeout = setTimeout(() => {
          setActiveSpeaker(null);
        }, 7000);
        return () => clearTimeout(timeout);
      }
    }
  }, [turns.length, isPaused]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState mode="coldStart" />
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 flex flex-col items-center max-w-md text-center">
          <AlertCircle className="text-bear mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Backend Connection Alert</h2>
          <p className="text-white/60 text-sm mb-6">{initError}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => initializeArena()}
              className="px-6 py-3 bg-bull/20 hover:bg-bull/30 text-bull border border-bull/40 rounded-xl transition-all font-bold cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
            <button 
              onClick={() => setIsPickerOpen(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all font-medium cursor-pointer"
            >
              Pick Another Coin
            </button>
          </div>
        </div>

        <CoinPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          currentCoinId={coinId}
        />
      </div>
    );
  }

  const bullTurns = turns.filter(t => t.speaker === 'bull');
  const bearTurns = turns.filter(t => t.speaker === 'bear');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {stats && (
        <StatStrip 
          stats={stats} 
          coinName={stats.coinName} 
          coinSymbol={stats.coinSymbol} 
          coinImage={stats.image}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          onOpenPicker={() => setIsPickerOpen(true)}
          onOpenHotTake={() => setIsHotTakeOpen(true)}
        />
      )}
      
      {chart.length > 0 && stats && (
        <PriceChart data={chart} change24h={stats.change24h} />
      )}

      {/* Paused Debate Banner */}
      {isPaused && (
        <div className="glass-card p-4 border border-amber-500/50 bg-amber-950/40 rounded-xl flex items-center justify-between gap-4 animate-fade-in shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Pause size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                DEBATE PAUSED
              </span>
              <p className="text-xs md:text-sm font-semibold text-white">
                Live argument streaming is paused. Press <strong className="text-amber-300">RESUME</strong> to continue the duel.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaused(false)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Play size={14} className="fill-slate-950" />
            <span>RESUME</span>
          </button>
        </div>
      )}

      {/* Injected Spectator Hot-Take Banner */}
      {currentHotTake && (
        <div className="glass-card p-4 border border-[#22d3ee]/40 bg-[#06172a]/80 rounded-xl flex items-center justify-between gap-4 animate-fade-in shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#22d3ee]/20 text-[#22d3ee]">
              <MessageSquarePlus size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#22d3ee] block">
                SPECTATOR HOT-TAKE INJECTED
              </span>
              <p className="text-xs md:text-sm font-semibold text-white italic">
                &ldquo;{currentHotTake}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHotTakeOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0 cursor-pointer"
          >
            Change 💬
          </button>
        </div>
      )}

      {streamError && (
        <div className="bg-bear/20 border border-bear/50 text-white p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-bear shrink-0" />
          <p>{streamError}</p>
        </div>
      )}

      {status === 'idle' || status === 'connecting' ? (
        <LoadingState mode="debating" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            <AgentCard 
              speaker="bull" 
              turns={bullTurns} 
              isActive={activeSpeaker === 'bull'} 
            />
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-arena-darker border border-white/20 shadow-2xl text-white/50 font-bold italic text-sm">
              VS
            </div>
            <AgentCard 
              speaker="bear" 
              turns={bearTurns} 
              isActive={activeSpeaker === 'bear'} 
            />
          </div>

          <TensionMeter value={tension} />
          
          {verdict && (
            <VerdictPanel 
              verdict={verdict} 
              onDebateAgain={() => initializeArena(currentHotTake || undefined)} 
              onOpenPicker={() => setIsPickerOpen(true)}
            />
          )}
        </>
      )}

      {/* Coin Picker Modal */}
      <CoinPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentCoinId={coinId}
      />

      {/* Inject Hot-Take Modal */}
      {stats && (
        <InjectHotTakeModal
          isOpen={isHotTakeOpen}
          onClose={() => setIsHotTakeOpen(false)}
          coinSymbol={stats.coinSymbol}
          onInject={(hotTake) => {
            initializeArena(hotTake);
          }}
        />
      )}
    </div>
  );
}
