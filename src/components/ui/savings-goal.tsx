import * as React from 'react';
import { CalendarClock, LineChart, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { ProgressIndicator } from './progress-indicator';
import { StatCard } from './stat-card';

export interface SavingsGoalData {
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  monthlyContribution: number;
  contributionHistory: {
    date: Date;
    amount: number;
  }[];
}

interface SavingsGoalProps {
  goal: SavingsGoalData;
  className?: string;
  currency?: string;
  onTrack?: boolean;
  showProjection?: boolean;
}

export function SavingsGoal({
  goal,
  className,
  currency = 'USD',
  onTrack,
  showProjection = true,
}: SavingsGoalProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const {
    isOnTrack,
    projectedCompletion,
    monthsRemaining,
    requiredMonthlyContribution,
  } = React.useMemo(() => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const totalMonths =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    const required = remaining / totalMonths;
    const projectedDate = new Date();
    projectedDate.setMonth(
      projectedDate.getMonth() +
        Math.ceil(remaining / goal.monthlyContribution)
    );

    return {
      isOnTrack:
        onTrack ?? goal.monthlyContribution >= required,
      projectedCompletion: projectedDate,
      monthsRemaining: totalMonths,
      requiredMonthlyContribution: required,
    };
  }, [goal, remaining, onTrack]);

  return (
    <Card className={cn('p-6', className)}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{goal.name}</h3>
          <p className="text-sm text-muted-foreground">
            Target: {formatter.format(goal.targetAmount)}
          </p>
        </div>
        <Target className="h-5 w-5 text-primary" />
      </div>

      <ProgressIndicator
        value={goal.currentAmount}
        max={goal.targetAmount}
        showLabel
        labelPosition="top"
        formatLabel={(value, max) =>
          `${formatter.format(value)} of ${formatter.format(max)}`
        }
        thresholds={{
          warning: 80,
          danger: 100,
        }}
        className="mb-6"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Current Progress"
          value={`${Math.round(progressPercentage)}%`}
          description="of target"
          trend={progressPercentage >= 50 ? 'up' : 'neutral'}
          size="sm"
        />
        <StatCard
          title="Monthly Contribution"
          value={formatter.format(goal.monthlyContribution)}
          description={
            isOnTrack ? 'On track' : 'Below target'
          }
          trend={isOnTrack ? 'up' : 'down'}
          size="sm"
        />
        <StatCard
          title="Remaining"
          value={formatter.format(remaining)}
          description={`${monthsRemaining} months left`}
          icon={CalendarClock}
          size="sm"
        />
      </div>

      {showProjection && (
        <div className="mt-6 space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Projection</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              Required monthly contribution:{' '}
              <span className="font-medium">
                {formatter.format(requiredMonthlyContribution)}
              </span>
            </p>
            <p>
              Projected completion:{' '}
              <span className="font-medium">
                {projectedCompletion.toLocaleDateString()}
              </span>
              {!isOnTrack && (
                <span className="ml-1 text-destructive">
                  (delayed)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

// Type-safe savings goal calculation helpers
export function calculateSavingsProjection(
  goal: SavingsGoalData
): {
  monthlyContributionRequired: number;
  projectedCompletionDate: Date;
  isOnTrack: boolean;
  shortfall: number;
} {
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const monthsRemaining =
    (targetDate.getFullYear() - today.getFullYear()) * 12 +
    (targetDate.getMonth() - today.getMonth());

  const remaining = goal.targetAmount - goal.currentAmount;
  const requiredMonthly = remaining / monthsRemaining;
  const projectedMonths = Math.ceil(
    remaining / goal.monthlyContribution
  );

  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + projectedMonths);

  return {
    monthlyContributionRequired: requiredMonthly,
    projectedCompletionDate: projectedDate,
    isOnTrack: goal.monthlyContribution >= requiredMonthly,
    shortfall: requiredMonthly - goal.monthlyContribution,
  };
}

export function calculateContributionStats(
  history: SavingsGoalData['contributionHistory']
): {
  total: number;
  average: number;
  highest: number;
  lowest: number;
  consistency: number;
} {
  if (history.length === 0) {
    return {
      total: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      consistency: 0,
    };
  }

  const amounts = history.map((h) => h.amount);
  const total = amounts.reduce((a, b) => a + b, 0);
  const average = total / history.length;
  const highest = Math.max(...amounts);
  const lowest = Math.min(...amounts);
  const consistency =
    (history.filter((h) => h.amount >= average).length /
      history.length) *
    100;

  return {
    total,
    average,
    highest,
    lowest,
    consistency,
  };
}