import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Badge } from './badge';
import { StatCard } from './stat-card';
import { DataTable } from './data-table';
import type { ColumnDef } from '@tanstack/react-table';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  category: string;
  amount: number;
  costBasis: number;
  shares: number;
  currentPrice: number;
  allocationTarget?: number;
  lastUpdated: Date;
}

interface InvestmentPortfolioProps {
  investments: Investment[];
  className?: string;
  currency?: string;
  onInvestmentClick?: (investment: Investment) => void;
}

export function InvestmentPortfolio({
  investments,
  className,
  currency = 'USD',
  onInvestmentClick,
}: InvestmentPortfolioProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  const portfolioMetrics = React.useMemo(() => {
    return calculatePortfolioMetrics(investments);
  }, [investments]);

  const { chartData, chartOptions } = React.useMemo(() => {
    const byCategory = investments.reduce((acc, inv) => {
      acc[inv.category] = (acc[inv.category] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(byCategory).reduce((a, b) => a + b, 0);
    const categories = Object.keys(byCategory);
    const data = Object.values(byCategory);
    const percentages = data.map((value) => ((value / total) * 100).toFixed(1));

    return {
      chartData: {
        labels: categories.map(
          (cat, i) => `${cat} (${percentages[i]}%)`
        ),
        datasets: [
          {
            data,
            backgroundColor: [
              'hsl(var(--primary))',
              'hsl(var(--secondary))',
              'hsl(var(--accent))',
              'hsl(var(--muted))',
            ],
          },
        ],
      },
      chartOptions: {
        plugins: {
          legend: {
            position: 'right' as const,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${formatter.format(value)} (${percentage}%)`;
              },
            },
          },
        },
      },
    };
  }, [investments, formatter]);

  const columns = React.useMemo<ColumnDef<Investment>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Investment',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.symbol}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Current Value',
        cell: ({ row }) => (
          <div className="text-right">
            <div className="font-medium">
              {formatter.format(row.original.amount)}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.shares.toFixed(2)} shares
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'returnPercent',
        header: 'Return',
        cell: ({ row }) => {
          const returnAmount = row.original.amount - row.original.costBasis;
          const returnPercent =
            ((row.original.amount - row.original.costBasis) /
              row.original.costBasis) *
            100;
          const isPositive = returnAmount >= 0;

          return (
            <div className="text-right">
              <div
                className={cn(
                  'font-medium',
                  isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {isPositive ? '+' : ''}
                {returnPercent.toFixed(2)}%
              </div>
              <div
                className={cn(
                  'text-sm',
                  isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {formatter.format(returnAmount)}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'allocation',
        header: 'Allocation',
        cell: ({ row }) => {
          const allocation =
            (row.original.amount / portfolioMetrics.totalValue) * 100;
          const target = row.original.allocationTarget;
          const diff = target
            ? allocation - target
            : 0;
          const isOffTarget = Math.abs(diff) > 2;

          return (
            <div className="text-right">
              <div className="font-medium">
                {allocation.toFixed(1)}%
              </div>
              {target && (
                <div
                  className={cn(
                    'text-sm',
                    isOffTarget
                      ? diff > 0
                        ? 'text-warning'
                        : 'text-destructive'
                      : 'text-success'
                  )}
                >
                  {target}% target ({diff > 0 ? '+' : ''}
                  {diff.toFixed(1)}%)
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [formatter, portfolioMetrics.totalValue]
  );

  return (
    <div className={className}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Value"
          value={formatter.format(portfolioMetrics.totalValue)}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Return"
          value={formatter.format(portfolioMetrics.totalReturn)}
          percentageChange={portfolioMetrics.totalReturnPercent}
          trend={portfolioMetrics.totalReturn >= 0 ? 'up' : 'down'}
          icon={portfolioMetrics.totalReturn >= 0 ? ArrowUpRight : ArrowDownRight}
        />
        <StatCard
          title="Best Performer"
          value={portfolioMetrics.bestPerformer?.name || 'N/A'}
          description={
            portfolioMetrics.bestPerformer
              ? `+${portfolioMetrics.bestPerformer.returnPercent.toFixed(2)}%`
              : undefined
          }
          trend="up"
        />
        <StatCard
          title="Worst Performer"
          value={portfolioMetrics.worstPerformer?.name || 'N/A'}
          description={
            portfolioMetrics.worstPerformer
              ? `${portfolioMetrics.worstPerformer.returnPercent.toFixed(2)}%`
              : undefined
          }
          trend="down"
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 p-6">
          <h3 className="mb-4 text-lg font-semibold">Holdings</h3>
          <DataTable
            columns={columns}
            data={investments}
            onRowClick={onInvestmentClick}
          />
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Asset Allocation</h3>
          <div className="aspect-square">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Type-safe investment calculation helpers
function calculatePortfolioMetrics(investments: Investment[]) {
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.costBasis, 0);
  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = (totalReturn / totalCost) * 100;

  const performanceData = investments.map((inv) => ({
    name: inv.name,
    returnPercent:
      ((inv.amount - inv.costBasis) / inv.costBasis) * 100,
  }));

  const bestPerformer = performanceData.reduce((best, current) =>
    !best || current.returnPercent > best.returnPercent ? current : best
  , performanceData[0]);

  const worstPerformer = performanceData.reduce((worst, current) =>
    !worst || current.returnPercent < worst.returnPercent ? current : worst
  , performanceData[0]);

  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercent,
    bestPerformer,
    worstPerformer,
  };
}

export function calculateRebalancing(
  investments: Investment[]
): {
  investment: Investment;
  currentAllocation: number;
  targetAllocation: number;
  diffAmount: number;
  action: 'buy' | 'sell' | 'none';
}[] {
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return investments
    .filter((inv) => inv.allocationTarget !== undefined)
    .map((inv) => {
      const currentAllocation = (inv.amount / totalValue) * 100;
      const targetAllocation = inv.allocationTarget!;
      const targetAmount = (totalValue * targetAllocation) / 100;
      const diffAmount = targetAmount - inv.amount;
      const action =
        Math.abs(diffAmount) < totalValue * 0.01
          ? 'none'
          : diffAmount > 0
          ? 'buy'
          : 'sell';

      return {
        investment: inv,
        currentAllocation,
        targetAllocation,
        diffAmount,
        action,
      };
    })
    .sort((a, b) => Math.abs(b.diffAmount) - Math.abs(a.diffAmount));
}