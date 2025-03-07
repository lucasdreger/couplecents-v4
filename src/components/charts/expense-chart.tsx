import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ExpenseData {
  category: string;
  amount: number;
  color?: string;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  title?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export function ExpenseChart({
  data,
  title = 'Expense Distribution',
  height = 300,
  className,
  showLegend = true
}: ExpenseChartProps) {
  const formatYAxis = (value: number) => formatCurrency(value);
  const formatTooltip = (value: number) => formatCurrency(value);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={formatTooltip}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                }}
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              )}
              <Bar
                dataKey="amount"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface MultiSeriesExpenseChartProps extends Omit<ExpenseChartProps, 'data'> {
  data: Array<ExpenseData & { series: string }>;
  series: string[];
  colors?: string[];
}

export function MultiSeriesExpenseChart({
  data,
  series,
  colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'],
  ...props
}: MultiSeriesExpenseChartProps) {
  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: props.height }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={formatCurrency}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                }}
              />
              {props.showLegend && (
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              )}
              {series.map((s, index) => (
                <Bar
                  key={s}
                  dataKey={s}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  stackId="stack"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}