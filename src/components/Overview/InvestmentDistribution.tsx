import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useInvestments } from '@/hooks/useInvestments';
import { Skeleton } from '@/components/ui/skeleton';
import { Investment } from '@/types/supabase';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const CATEGORY_COLORS = {
  stocks: '#10b981',
  bonds: '#3b82f6',
  crypto: '#8b5cf6',
  real_estate: '#ef4444',
  other: '#6b7280'
} as const;

const CATEGORY_LABELS = {
  stocks: 'Stocks',
  bonds: 'Bonds',
  crypto: 'Cryptocurrency',
  real_estate: 'Real Estate',
  other: 'Other'
} as const;

export function InvestmentDistribution() {
  const { investments, isLoading } = useInvestments();

  const chartData = React.useMemo((): ChartData[] => {
    if (!investments?.length) return [];

    const categoryTotals = investments.reduce((acc, investment: Investment) => {
      const category = investment.category;
      acc[category] = (acc[category] || 0) + investment.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, value]) => ({
        name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS],
        value,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
      }))
      .sort((a, b) => b.value - a.value);
  }, [investments]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalInvestments = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="stroke-background dark:stroke-background transition-colors duration-200"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString('de-DE', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })} (${((value / totalInvestments) * 100).toFixed(1)}%)`,
                  'Amount'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          {chartData.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.value.toLocaleString('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR' 
                })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}