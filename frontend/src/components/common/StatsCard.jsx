import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';

const accentColors = {
  primary: 'border-l-primary-500',
  secondary: 'border-l-secondary-500',
  accent: 'border-l-accent-500',
  warning: 'border-l-warning-500',
  error: 'border-l-error-500',
  success: 'border-l-success-500',
};

export default function StatsCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  accent,
  className = '',
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div
      className={`
        rounded-lg border border-border bg-surface px-4 py-3 shadow-xs
        ${accent ? `border-l-2 ${accentColors[accent] || ''}` : ''}
        ${className}
      `.trim()}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold text-neutral-900 leading-tight">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <div className="mt-1.5 flex items-center gap-1">
              {isPositive && (
                <TrendingUp className="h-3 w-3 text-success-500" />
              )}
              {isNegative && (
                <TrendingDown className="h-3 w-3 text-error-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive
                    ? 'text-success-500'
                    : isNegative
                      ? 'text-error-500'
                      : 'text-neutral-400'
                }`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-neutral-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-50 text-neutral-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
