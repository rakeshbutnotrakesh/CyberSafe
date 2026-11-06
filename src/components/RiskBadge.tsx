import React from 'react';
import { RiskLevel } from '../types/security';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  showIcon = true,
  size = 'md',
}) => {
  const config = {
    Low: {
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
      icon: ShieldCheck,
      label: 'Low Risk',
    },
    Medium: {
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
      icon: AlertTriangle,
      label: 'Medium Risk',
    },
    High: {
      color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
      icon: AlertOctagon,
      label: 'High Risk',
    },
  }[level];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border ${config.color} ${sizeClasses} tracking-wide whitespace-nowrap`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      <span>{config.label}</span>
    </span>
  );
};
