import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva('relative w-full overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-2',
      md: 'h-4',
      lg: 'h-6',
    },
    variant: {
      default: 'bg-secondary',
      success: 'bg-success/20',
      warning: 'bg-warning/20',
      danger: 'bg-destructive/20',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

const indicatorVariants = cva('h-full w-full transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-destructive',
    },
    animated: {
      true: 'transition-transform duration-500',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    animated: true,
  },
});

interface ProgressIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
  formatLabel?: (value: number, max: number) => string;
  animated?: boolean;
  thresholds?: {
    warning?: number;
    danger?: number;
  };
}

export function ProgressIndicator({
  value,
  max = 100,
  showLabel = false,
  labelPosition = 'inside',
  formatLabel = (value, max) => `${Math.round((value / max) * 100)}%`,
  className,
  size,
  variant,
  animated = true,
  thresholds,
  ...props
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const currentVariant = React.useMemo(() => {
    if (!thresholds) return variant;
    const percent = (value / max) * 100;
    if (thresholds.danger && percent >= thresholds.danger) return 'danger';
    if (thresholds.warning && percent >= thresholds.warning) return 'warning';
    return variant;
  }, [value, max, variant, thresholds]);

  const label = formatLabel(value, max);

  const renderLabel = () => (
    <div
      className={cn(
        'text-xs font-medium',
        labelPosition === 'inside' &&
          'absolute left-3 top-1/2 -translate-y-1/2',
        labelPosition === 'inside' &&
          percentage < 10 &&
          'left-[calc(10%+8px)]'
      )}
    >
      {label}
    </div>
  );

  return (
    <div className="w-full">
      {showLabel && labelPosition === 'top' && (
        <div className="mb-2 text-sm">{label}</div>
      )}
      <div
        className={cn(progressVariants({ size, variant: currentVariant }), className)}
        {...props}
      >
        <div
          className={indicatorVariants({
            variant: currentVariant,
            animated,
          })}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
          }}
        >
          {showLabel && labelPosition === 'inside' && renderLabel()}
        </div>
      </div>
      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-2 text-sm">{label}</div>
      )}
    </div>
  );
}

// Type-safe progress calculation helpers
export function calculateProgress(
  current: number,
  target: number,
  options?: {
    clamp?: boolean;
    precision?: number;
  }
): number {
  const { clamp = true, precision = 2 } = options || {};
  const progress = (current / target) * 100;
  
  if (clamp) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    return Number(clampedProgress.toFixed(precision));
  }
  
  return Number(progress.toFixed(precision));
}

export function determineProgressStatus(
  percentage: number,
  thresholds?: {
    success?: number;
    warning?: number;
    danger?: number;
  }
): 'success' | 'warning' | 'danger' | 'default' {
  const { success = 100, warning = 75, danger = 90 } = thresholds || {};

  if (percentage >= danger) return 'danger';
  if (percentage >= warning) return 'warning';
  if (percentage >= success) return 'success';
  return 'default';
}