import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AmountFormatter, AmountDelta } from './amount-formatter';
import { cn } from '@/lib/utils';

interface StatProps {
  title: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down';
  trendTarget?: number;
  className?: string;
}

function Stat({
  title,
  value,
  previousValue,
  suffix,
  prefix,
  trend,
  trendTarget,
  className
}: StatProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix && <span className="text-muted-foreground mr-1">{prefix}</span>}
          <AmountFormatter amount={value} />
          {suffix && <span className="text-muted-foreground ml-1">{suffix}</span>}
        </div>
        
        {previousValue !== undefined && (
          <div className="text-xs text-muted-foreground mt-1">
            <AmountDelta amount={value} previousAmount={previousValue} />
          </div>
        )}

        {trendTarget !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Target</span>
              <AmountFormatter amount={trendTarget} className="font-medium" />
            </div>
            <div className="mt-1 h-1 w-full bg-secondary">
              <div
                className={cn(
                  "h-full",
                  value >= trendTarget ? "bg-green-500" : "bg-red-500"
                )}
                style={{
                  width: `${Math.min((value / trendTarget) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsSummaryProps {
  stats: StatProps[];
  className?: string;
}

export function StatsSummary({ stats, className }: StatsSummaryProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <Stat key={index} {...stat} />
      ))}
    </div>
  );
}