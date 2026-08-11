'use client';

export default function LoadingState({ mode = 'coldStart' }: { mode?: 'coldStart' | 'debating' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="flex space-x-3 mb-6">
        <div className="w-4 h-4 rounded-full bg-bull animate-pulse-glow" style={{ animationDelay: '0ms' }} />
        <div className="w-4 h-4 rounded-full bg-judge animate-pulse-glow" style={{ animationDelay: '150ms' }} />
        <div className="w-4 h-4 rounded-full bg-bear animate-pulse-glow" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-lg font-medium text-white/70 animate-pulse tracking-wide">
        {mode === 'coldStart' ? 'Waking up the arena...' : 'The debate is about to begin...'}
      </p>
    </div>
  );
}
