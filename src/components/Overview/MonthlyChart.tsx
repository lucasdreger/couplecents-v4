import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthlySummary } from '@/types/supabase';

interface MonthlyData extends MonthlySummary {
  name: string;
}

interface MonthlyChartProps {
  months?: number; // Number of months to display
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function MonthlyChart({ months = 12 }: MonthlyChartProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const { data: monthlySummaries, isLoading } = useQuery<MonthlySummary[]>({
    queryKey: queryKeys.monthlyAnalytics(currentYear),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*')
        .eq('year', currentYear)
        .order('month');

      if (error) throw error;
      return data;
    },
  });

  const chartData = React.useMemo((): MonthlyData[] => {
    if (!monthlySummaries) return [];

    return monthlySummaries
      .map(summary => ({
        ...summary,
        name: MONTHS[summary.month - 1],
      }))
      .slice(-months);
  }, [monthlySummaries, months]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground text-xs"
              />
              <YAxis
                className="text-muted-foreground text-xs"
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value)]}
                labelClassName="text-muted-foreground"
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_income"
                name="Income"
                stroke="#10b981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="total_expenses"
                name="Expenses"
                stroke="#ef4444"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
