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
  const { data: categoryData } = useQuery({
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

      // Aggregate by category
      const categoryTotals = data.reduce((acc: Record<string, number>, curr) => {
        const categoryName = curr.category?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + curr.amount;
        return acc;
      }, {});

      // Convert to array format for recharts
      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  if (!categoryData?.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {categoryData.map((entry, index) => (
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
