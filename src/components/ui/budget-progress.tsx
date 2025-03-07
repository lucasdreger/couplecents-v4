import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { cn } from '@/lib/utils';
import { ProgressIndicator } from './progress-indicator';
import { Card } from './card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

interface BudgetProgressProps {
  data: BudgetData[];
  title?: string;
  showChart?: boolean;
  className?: string;
  currency?: string;
  thresholds?: {
    warning: number;
    danger: number;
  };
}

export function BudgetProgress({
  data,
  title = 'Budget Progress',
  showChart = true,
  className,
  currency = 'USD',
  thresholds = {
    warning: 80,
    danger: 100,
  },
}: BudgetProgressProps) {
  const sortedData = React.useMemo(
    () => [...data].sort((a, b) => (b.spent / b.allocated) - (a.spent / a.allocated)),
    [data]
  );

  const chartData = React.useMemo(
    () => ({
      labels: sortedData.map((item) => item.category),
      datasets: [
        {
          label: 'Spent',
          data: sortedData.map((item) => item.spent),
          backgroundColor: 'rgba(var(--primary), 0.8)',
        },
        {
          label: 'Remaining',
          data: sortedData.map((item) => item.remaining),
          backgroundColor: 'rgba(var(--muted), 0.4)',
        },
      ],
    }),
    [sortedData]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
              notation: 'compact',
            }).format(value),
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <Card className={cn('p-4', className)}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      )}
      <div className="space-y-4">
        {sortedData.map((item) => {
          const percentage = (item.spent / item.allocated) * 100;
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{item.category}</span>
                <span className="text-muted-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                  }).format(item.spent)}{' '}
                  /{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                  }).format(item.allocated)}
                </span>
              </div>
              <ProgressIndicator
                value={item.spent}
                max={item.allocated}
                showLabel
                labelPosition="inside"
                formatLabel={(value, max) =>
                  `${Math.round((value / max) * 100)}%`
                }
                thresholds={thresholds}
                size="sm"
              />
            </div>
          );
        })}
      </div>
      {showChart && (
        <div className="mt-6 h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </Card>
  );
}

// Type-safe budget calculation helpers
export function calculateBudgetProgress(
  spent: number,
  allocated: number,
  options?: {
    precision?: number;
    includeRemaining?: boolean;
  }
): {
  percentage: number;
  remaining?: number;
} {
  const { precision = 2, includeRemaining = false } = options || {};
  const percentage = Number(((spent / allocated) * 100).toFixed(precision));
  
  return {
    percentage,
    ...(includeRemaining && { remaining: allocated - spent }),
  };
}

export function getBudgetStatus(
  percentage: number,
  thresholds?: {
    onTrack: number;
    warning: number;
    danger: number;
  }
): 'onTrack' | 'warning' | 'danger' {
  const { onTrack = 90, warning = 95, danger = 100 } = thresholds || {};

  if (percentage >= danger) return 'danger';
  if (percentage >= warning) return 'warning';
  return 'onTrack';
}