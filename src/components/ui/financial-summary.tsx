import * as React from 'react';
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { StatCard } from './stat-card';
import { BudgetProgress } from './budget-progress';
import { CalendarHeatmap } from './calendar-heatmap';
import { DateRangePicker } from './date-range-picker';

export interface FinancialSummaryData {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  budgetData: {
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
  }[];
  expenseHistory: {
    date: string | Date;
    value: number;
  }[];
}

interface FinancialSummaryProps {
  data: FinancialSummaryData;
  className?: string;
  currency?: string;
  showHeatmap?: boolean;
  showBudget?: boolean;
  period?: {
    start: Date;
    end: Date;
  };
  onPeriodChange?: (period: { start: Date; end: Date }) => void;
}

export function FinancialSummary({
  data,
  className,
  currency = 'USD',
  showHeatmap = true,
  showBudget = true,
  period,
  onPeriodChange,
}: FinancialSummaryProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  return (
    <div className={cn('space-y-6', className)}>
      {period && onPeriodChange && (
        <Card className="p-4">
          <DateRangePicker
            value={period ? { from: period.start, to: period.end } : undefined}
            onChange={(range) => {
              if (range?.from && range?.to) {
                onPeriodChange({ start: range.from, end: range.to });
              }
            }}
          />
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatter.format(data.totalIncome)}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={formatter.format(data.totalExpenses)}
          icon={Wallet}
          trend="down"
        />
        <StatCard
          title="Total Savings"
          value={formatter.format(data.totalSavings)}
          percentageChange={data.savingsRate}
          icon={ArrowUpIcon}
          trend={data.savingsRate >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Savings Rate"
          value={`${data.savingsRate.toFixed(1)}%`}
          icon={ArrowDownIcon}
          trend={data.savingsRate >= 20 ? 'up' : 'down'}
        />
      </div>

      {showBudget && (
        <BudgetProgress
          data={data.budgetData}
          currency={currency}
          thresholds={{ warning: 80, danger: 100 }}
        />
      )}

      {showHeatmap && (
        <CalendarHeatmap
          data={data.expenseHistory}
          formatTooltip={(data) =>
            `${format(
              typeof data.date === 'string'
                ? parseISO(data.date)
                : data.date,
              'PP'
            )}: ${formatter.format(data.value)}`
          }
        />
      )}
    </div>
  );
}

// Type-safe financial calculation helpers
export function calculateFinancialMetrics(
  income: number,
  expenses: number
): {
  savingsAmount: number;
  savingsRate: number;
  expenseRatio: number;
} {
  const savingsAmount = income - expenses;
  const savingsRate = (savingsAmount / income) * 100;
  const expenseRatio = (expenses / income) * 100;

  return {
    savingsAmount,
    savingsRate: Number(savingsRate.toFixed(2)),
    expenseRatio: Number(expenseRatio.toFixed(2)),
  };
}

export function calculateMonthlyChange(
  currentMonth: number,
  previousMonth: number
): {
  difference: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
} {
  const difference = currentMonth - previousMonth;
  const percentageChange =
    previousMonth === 0
      ? 0
      : ((currentMonth - previousMonth) / Math.abs(previousMonth)) * 100;

  return {
    difference,
    percentageChange: Number(percentageChange.toFixed(2)),
    trend:
      percentageChange > 0
        ? 'up'
        : percentageChange < 0
        ? 'down'
        : 'neutral',
  };
}