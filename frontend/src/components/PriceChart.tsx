'use client';

import { useState } from 'react';
import { ChartPoint } from '../lib/types';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, ReferenceLine } from 'recharts';
import { Layers } from 'lucide-react';

export default function PriceChart({ data, change24h }: { data: ChartPoint[]; change24h: number }) {
  const [showLines, setShowLines] = useState(true);
  const isPositive = change24h >= 0;
  const color = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 or rose-500

  if (!data || data.length === 0) return null;

  // Calculate 7-day min & max price for dynamic scaling & stats label
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Technical Support and Resistance calculation
  const resistancePrice = maxPrice - priceRange * 0.04;
  const supportPrice = minPrice + priceRange * 0.04;

  // Add 8% padding so min/max peaks don't clip top/bottom border
  const yDomainMin = Math.max(0, minPrice - priceRange * 0.1);
  const yDomainMax = maxPrice + priceRange * 0.1;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="glass-card w-full p-4 md:p-5 h-[180px] md:h-[210px] animate-fade-in relative flex flex-col justify-between">
      {/* Header Info & SR Toggle */}
      <div className="flex justify-between items-center z-10 mb-1">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            7-Day Technical Chart
          </span>

          <button
            onClick={() => setShowLines(!showLines)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showLines
                ? 'bg-bull/20 text-bull border-bull/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
            }`}
            title="Toggle Technical Support & Resistance Reference Lines"
          >
            <Layers size={12} />
            <span>S/R Lines: {showLines ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs font-medium">
          <span className="text-emerald-400 font-mono text-[11px]">
            Support: <strong className="font-bold">{formatter.format(supportPrice)}</strong>
          </span>
          <span className="text-rose-400 font-mono text-[11px]">
            Resist: <strong className="font-bold">{formatter.format(resistancePrice)}</strong>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* XAxis with timestamp key so tooltip receives actual millisecond timestamp */}
            <XAxis dataKey="timestamp" hide />

            {/* Scaled YAxis centered around actual 7-day min/max */}
            <YAxis domain={[yDomainMin, yDomainMax]} hide />

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              labelFormatter={(label) => new Date(label as number).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              formatter={(value) => [formatter.format(Number(value)), 'Price']}
            />

            {/* Support Line */}
            {showLines && (
              <ReferenceLine
                y={supportPrice}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `S: ${formatter.format(supportPrice)}`,
                  fill: '#10b981',
                  fontSize: 10,
                  position: 'insideBottomLeft',
                  fontWeight: 700
                }}
              />
            )}

            {/* Resistance Line */}
            {showLines && (
              <ReferenceLine
                y={resistancePrice}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `R: ${formatter.format(resistancePrice)}`,
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  fontWeight: 700
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
