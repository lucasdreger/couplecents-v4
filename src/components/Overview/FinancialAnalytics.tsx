import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface AnalyticsData {
  name: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface FinancialAnalyticsProps {
  data: AnalyticsData[];
}

export function FinancialAnalytics({ data }: FinancialAnalyticsProps) {
  // Calculate totals
  const totals = {
    income: data.reduce((sum, item) => sum + item.income, 0),
    expenses: data.reduce((sum, item) => sum + item.expenses, 0),
    savings: data.reduce((sum, item) => sum + item.savings, 0),
    investments: data.reduce((sum, item) => sum + item.investments, 0),
  };

  // Format for percentage display
  const formatValue = (value: number): string => {
    return value.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Format for percentage display in tooltip
  const formatPercentValue = (value: number, name: string): string => {
    const total = totals[name.toLowerCase() as keyof typeof totals];
    const percentage = ((value / total) * 100).toFixed(1);
    return `${formatValue(value)} (${percentage}%)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatPercentValue(value, name),
                  name
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke="#3b82f6" name="Savings" />
              <Line type="monotone" dataKey="investments" stroke="#8b5cf6" name="Investments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(totals).map(([key, value], index) => (
            <div key={key} className="flex flex-col p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground capitalize">{key}</span>
              <span className="text-2xl font-bold">
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
