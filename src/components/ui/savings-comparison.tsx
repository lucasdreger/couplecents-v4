import * as React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Badge } from './badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface SavingsScenario {
  id: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  includeInflation?: boolean;
  inflationRate?: number;
}

interface SavingsComparisonProps {
  scenarios: SavingsScenario[];
  className?: string;
  currency?: string;
  showMonthly?: boolean;
  showInflationAdjusted?: boolean;
}

export function SavingsComparison({
  scenarios,
  className,
  currency = 'USD',
  showMonthly = false,
  showInflationAdjusted = true,
}: SavingsComparisonProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
  });

  const { labels, datasets } = React.useMemo(() => {
    const maxYears = Math.max(...scenarios.map((s) => s.years));
    const months = showMonthly ? maxYears * 12 : maxYears;
    const labels = Array.from({ length: months + 1 }, (_, i) =>
      showMonthly
        ? `Month ${i}`
        : `Year ${Math.floor(i)}`
    );

    const datasets = scenarios.map((scenario) => {
      const data = calculateSavingsGrowth(scenario, showMonthly);
      const inflationAdjustedData = showInflationAdjusted && scenario.includeInflation
        ? calculateInflationAdjustedGrowth(data, scenario.inflationRate || 2)
        : null;

      return [
        {
          label: scenario.name,
          data: data,
          borderColor: `hsl(var(--primary))`,
          backgroundColor: `hsl(var(--primary) / 0.1)`,
          tension: 0.4,
        },
        ...(inflationAdjustedData
          ? [
              {
                label: `${scenario.name} (Inflation Adjusted)`,
                data: inflationAdjustedData,
                borderColor: `hsl(var(--muted))`,
                backgroundColor: `hsl(var(--muted) / 0.1)`,
                borderDash: [5, 5],
                tension: 0.4,
              },
            ]
          : []),
      ];
    }).flat();

    return { labels, datasets };
  }, [scenarios, showMonthly, showInflationAdjusted]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: ${formatter.format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatter.format(value),
        },
      },
    },
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold">Savings Growth Comparison</h3>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <Badge key={scenario.id} variant="outline">
              {scenario.name}: {formatter.format(scenario.monthlyContribution)}/mo,{' '}
              {scenario.annualReturn}% return
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <Line data={{ labels, datasets }} options={options} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => {
          const finalAmount = calculateFinalAmount(scenario);
          const totalContributions =
            scenario.initialAmount +
            scenario.monthlyContribution * scenario.years * 12;
          const totalReturn = finalAmount - totalContributions;

          return (
            <Card key={scenario.id} className="p-4">
              <h4 className="font-medium">{scenario.name}</h4>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Final Amount:</span>
                  <span className="font-medium">
                    {formatter.format(finalAmount)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Total Contributed:</span>
                  <span>{formatter.format(totalContributions)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Total Return:</span>
                  <span className="text-success">
                    {formatter.format(totalReturn)}
                  </span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

// Type-safe savings calculation helpers
function calculateSavingsGrowth(
  scenario: SavingsScenario,
  monthly: boolean = false
): number[] {
  const periods = monthly ? scenario.years * 12 : scenario.years;
  const monthlyRate = scenario.annualReturn / 12 / 100;
  const growth: number[] = [scenario.initialAmount];

  for (let i = 1; i <= periods; i++) {
    const previousAmount = growth[i - 1];
    const withContribution = previousAmount + scenario.monthlyContribution;
    const withReturn = withContribution * (1 + monthlyRate);
    growth.push(withReturn);

    // If not showing monthly, skip to next year
    if (!monthly) {
      for (let m = 1; m < 12; m++) {
        const monthAmount = growth[growth.length - 1];
        growth[growth.length - 1] =
          (monthAmount + scenario.monthlyContribution) * (1 + monthlyRate);
      }
    }
  }

  return growth;
}

function calculateInflationAdjustedGrowth(
  nominalGrowth: number[],
  inflationRate: number
): number[] {
  const monthlyInflation = inflationRate / 12 / 100;
  return nominalGrowth.map((amount, index) => {
    const inflationFactor = Math.pow(1 + monthlyInflation, index);
    return amount / inflationFactor;
  });
}

function calculateFinalAmount(scenario: SavingsScenario): number {
  const monthlyRate = scenario.annualReturn / 12 / 100;
  const months = scenario.years * 12;
  let amount = scenario.initialAmount;

  for (let i = 0; i < months; i++) {
    amount = (amount + scenario.monthlyContribution) * (1 + monthlyRate);
  }

  return amount;
}