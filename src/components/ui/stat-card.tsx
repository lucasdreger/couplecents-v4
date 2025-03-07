import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

const statCardVariants = cva('', {
  variants: {
    trend: {
      up: 'text-success',
      down: 'text-destructive',
      neutral: 'text-muted-foreground',
    },
    size: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    trend: 'neutral',
    size: 'md',
  },
});

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  percentageChange?: number;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  percentageChange,
  className,
  valuePrefix,
  valueSuffix,
  trend,
  size,
  loading,
  onClick,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (percentageChange === 0) return <Minus className="h-4 w-4" />;
    if (percentageChange && percentageChange > 0)
      return <ArrowUp className="h-4 w-4" />;
    if (percentageChange && percentageChange < 0)
      return <ArrowDown className="h-4 w-4" />;
    return null;
  };

  const determineTrend = (): 'up' | 'down' | 'neutral' => {
    if (!percentageChange) return 'neutral';
    if (percentageChange > 0) return 'up';
    if (percentageChange < 0) return 'down';
    return 'neutral';
  };

  return (
    <Card
      className={cn(
        statCardVariants({ size }),
        loading && 'animate-pulse',
        onClick && 'cursor-pointer hover:bg-muted/50',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {valuePrefix}
          {value}
          {valueSuffix}
        </div>
        {(description || percentageChange !== undefined) && (
          <p
            className={cn(
              'mt-2 flex items-center gap-1 text-xs',
              statCardVariants({ trend: trend || determineTrend() })
            )}
          >
            {getTrendIcon()}
            {percentageChange !== undefined && (
              <span>
                {Math.abs(percentageChange)}%
                {percentageChange > 0 ? ' increase' : percentageChange < 0 ? ' decrease' : ' no change'}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">
                {description}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Type-safe stat formatter helpers
export function formatStatValue(
  value: number,
  options?: {
    notation?: 'compact' | 'standard' | 'scientific' | 'engineering';
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    currency?: string;
    style?: 'decimal' | 'currency' | 'percent';
  }
): string {
  const {
    notation = 'standard',
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    currency,
    style = 'decimal',
  } = options || {};

  return new Intl.NumberFormat('en-US', {
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
    style,
    currency,
  }).format(value);
}

export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}