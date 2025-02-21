
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/card';

export const MonthlyChart = () => {
  const { data: monthlyData } = useQuery({
    queryKey: ['monthlyComparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('month, planned_amount, actual_amount')
        .order('month');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="w-full h-[300px]">
      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned_amount" fill="#8884d8" name="Planned" />
        <Bar dataKey="actual_amount" fill="#82ca9d" name="Actual" />
      </BarChart>
    </div>
  );
};
