'use client';

export default function TensionMeter({ value }: { value: number }) {
  const getLabel = (val: number) => {
    if (val < 20) return 'Strong Bearish Dominance';
    if (val < 45) return 'Moderate Bearish Bias';
    if (val <= 55) return 'Balanced Market Sentiment';
    if (val < 80) return 'Moderate Bullish Bias';
    return 'Strong Bullish Dominance';
  };

  return (
    <div className="glass-card p-6 w-full animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex justify-between text-sm font-semibold mb-3">
        <span className="text-rose-400 flex items-center gap-2">🐻 Bear</span>
        <span className="text-white/70 tracking-wide font-medium">Market Sentiment Index</span>
        <span className="text-emerald-400 flex items-center gap-2">Bull 🐂</span>
      </div>

      <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500">
        {/* Center mark */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/30 -translate-x-1/2 z-0" />
        
        {/* Needle */}
        <div 
          className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-10"
          style={{ left: `${value}%` }}
        />
      </div>

      <div className="mt-4 text-center">
        <span className="text-base font-extrabold text-white uppercase tracking-wider">
          {getLabel(value)}
        </span>
      </div>
    </div>
  );
}
