import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CategoryBreakdown = () => {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          category:categories (name),
          amount
        `)
        .eq('year', new Date().getFullYear())
        .eq('month', new Date().getMonth() + 1);
      if (error) throw error;

      if (!data?.length) {
        return [];
      }

      // Aggregate by category
      const categoryTotals = data.reduce((acc: Record<string, number>, curr) => {
        const categoryName = curr.category?.name || 'Uncategorized';
        const amount = curr.amount || 0;
        acc[categoryName] = (acc[categoryName] || 0) + amount;
        return acc;
      }, {});

      // Convert to array format for recharts
      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (!categoryData?.length) {
    return <div>No expense data available</div>;
  }

  const chartData = categoryData;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
