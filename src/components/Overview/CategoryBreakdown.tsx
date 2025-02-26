
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

      // Aggregate by category with null checking
      const categoryTotals = data.reduce((acc: Record<string, number>, curr) => {
        // Ensure we have valid category name and amount
        const categoryName = curr.category?.name || 'Uncategorized';
        const amount = typeof curr.amount === 'number' ? curr.amount : 0;
        
        // Initialize category if it doesn't exist
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        
        acc[categoryName] += amount;
        return acc;
      }, {});

      // Convert to array format for recharts with explicit number typing
      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value: Number(value) || 0, // Ensure value is always a number
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
            label={({ value }) => `$${Number(value).toFixed(2)}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
