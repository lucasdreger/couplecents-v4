import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { MonthlyDetail } from '@/types/database.types';
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

interface ChartData {
  year: number;
  month: string;
  planned_amount: number;
  actual_amount: number;
}

export const MonthlyChart = () => {
  const { data: monthlyData, isLoading, isError } = useQuery({
    queryKey: ['monthlyExpenses'],
    queryFn: async (): Promise<ChartData[]> => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('*')
        .order('year, month');
      if (error) throw error;

      // Transform and validate data
      return (data || []).map((item: MonthlyDetail): ChartData => ({
        year: item.year,
        month: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        planned_amount: Number(item.planned_amount || 0),
        actual_amount: Number(item.actual_amount || 0)
      }));
    }
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="h-[300px] flex items-center justify-center">Error loading chart data</div>;
  }

  if (!monthlyData?.length) {
    return <div className="h-[300px] flex items-center justify-center">No data available</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar 
            dataKey="planned_amount" 
            name="Planned" 
            fill="#8884d8" 
          />
          <Bar 
            dataKey="actual_amount" 
            name="Actual" 
            fill="#82ca9d" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
