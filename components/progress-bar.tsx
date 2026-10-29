'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  height?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  height = 'h-3',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative w-full overflow-hidden rounded-full bg-muted', height)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            barClassName || 'gradient-bg-blue'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-medium text-muted-foreground">
          {pct.toFixed(0)}%
        </div>
      )}
    </div>
  );
}
