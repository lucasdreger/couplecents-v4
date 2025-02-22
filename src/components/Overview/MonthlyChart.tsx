import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export const MonthlyChart = () => {
  const { data: monthlyData, isLoading } = useQuery({
    queryKey: ['monthlyExpenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('*')
        .order('year, month');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  // Ensure we have data or provide default empty array
  const chartData = monthlyData || [];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned_amount" name="Planned" fill="#8884d8" />
          <Bar dataKey="actual_amount" name="Actual" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
