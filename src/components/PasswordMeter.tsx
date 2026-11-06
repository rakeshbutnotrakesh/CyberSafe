import React from 'react';
import { PasswordAnalysis } from '../types/security';
import { ShieldAlert, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { formatEntropy, getCrackTimeColor } from '../utils/formatters';

interface PasswordMeterProps {
  analysis: PasswordAnalysis;
}

export const PasswordMeter: React.FC<PasswordMeterProps> = ({ analysis }) => {
  const getCategoryStyles = () => {
    switch (analysis.category) {
      case 'Very Weak':
        return {
          textColor: 'text-rose-400',
          barColor: 'bg-rose-500',
          borderColor: 'border-rose-900/50',
          bgTint: 'bg-rose-950/20',
        };
      case 'Weak':
        return {
          textColor: 'text-orange-400',
          barColor: 'bg-orange-500',
          borderColor: 'border-orange-900/50',
          bgTint: 'bg-orange-950/20',
        };
      case 'Moderate':
        return {
          textColor: 'text-amber-400',
          barColor: 'bg-amber-500',
          borderColor: 'border-amber-900/50',
          bgTint: 'bg-amber-950/20',
        };
      case 'Strong':
        return {
          textColor: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          borderColor: 'border-emerald-900/50',
          bgTint: 'bg-emerald-950/20',
        };
      case 'Very Strong':
        return {
          textColor: 'text-cyan-400',
          barColor: 'bg-gradient-to-r from-emerald-500 to-cyan-400',
          borderColor: 'border-cyan-900/50',
          bgTint: 'bg-cyan-950/20',
        };
    }
  };

  const style = getCategoryStyles();

  return (
    <div className={`p-4 rounded-lg border ${style.borderColor} ${style.bgTint} space-y-4`}>
      {/* Category & Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {analysis.score >= 68 ? (
            <ShieldCheck className={`w-5 h-5 ${style.textColor}`} />
          ) : (
            <ShieldAlert className={`w-5 h-5 ${style.textColor}`} />
          )}
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Estimated Strength</span>
          <span className="text-slate-600">·</span>
          <span className={`text-sm font-semibold ${style.textColor}`}>{analysis.category}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Score</span>
          <span className={`font-semibold tabular-nums ${style.textColor}`}>
            {analysis.score}/100
          </span>
        </div>
      </div>

      {/* Progress Bar with 5 segments */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-5 gap-1.5 h-2">
          {[1, 2, 3, 4, 5].map((segIndex) => {
            const segmentThreshold = segIndex * 20;
            const isFilled = analysis.score >= segmentThreshold - 15;
            return (
              <div
                key={segIndex}
                className={`h-full rounded-sm transition-all duration-300 ${
                  isFilled ? style.barColor : 'bg-slate-800/80'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Entropy: {formatEntropy(analysis.entropyBits)}</span>
          <span>{analysis.length} characters</span>
        </div>
      </div>

      {/* Crack Time Estimates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
        <div className="flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-400">Online Guessing (Rate-Limited)</div>
            <div className={`text-xs font-mono font-medium ${getCrackTimeColor(analysis.estimatedCrackTimeOnline)}`}>
              {analysis.estimatedCrackTimeOnline}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-400">Offline GPU Rig (100B/sec)</div>
            <div className={`text-xs font-mono font-medium ${getCrackTimeColor(analysis.estimatedCrackTimeOffline)}`}>
              {analysis.estimatedCrackTimeOffline}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
