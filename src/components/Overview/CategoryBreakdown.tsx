import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { Category, VariableExpense } from '@/types/supabase';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
];

interface CategoryBreakdownProps {
  timeRange?: number; // Number of months to look back
}

export function CategoryBreakdown({ timeRange = 1 }: CategoryBreakdownProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { expenses, isLoading: isLoadingExpenses } = useExpenses(currentYear, currentMonth);
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const chartData = React.useMemo((): CategoryData[] => {
    if (!expenses || !categories) return [];

    const categoryTotals = new Map<string, number>();
    
    // Calculate total for each category
    expenses.forEach((expense: VariableExpense) => {
      const currentTotal = categoryTotals.get(expense.category_id) || 0;
      categoryTotals.set(expense.category_id, currentTotal + expense.amount);
    });

    // Convert to chart data format and sort by value
    return Array.from(categoryTotals.entries())
      .map(([categoryId, total], index) => {
        const category = categories.find((c: Category) => c.id === categoryId);
        return {
          name: category?.name || 'Unknown',
          value: total,
          color: COLORS[index % COLORS.length]
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  if (isLoadingExpenses || isLoadingCategories) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
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
                  })} (${((value / totalExpenses) * 100).toFixed(1)}%)`,
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
