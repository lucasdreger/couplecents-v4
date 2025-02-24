import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyDetails } from '@/lib/supabase/queries';
import useHousehold from '@/hooks/useHousehold';
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

const formatCurrency = (value: number): [string] => {
  return [`$${value.toFixed(2)}`];
};

export const MonthlyChart: React.FC = () => {
  const { data: household, isLoading: isLoadingHousehold } = useHousehold();

  const { data: monthlyData, isLoading, isError } = useQuery({
    queryKey: ['monthlyDetails', household?.householdId],
    queryFn: async (): Promise<ChartData[]> => {
      if (!household?.householdId) throw new Error('No household ID');
      const { data, error } = await getMonthlyDetails();
      if (error) throw error;

      // Transform and validate data
      return (data || []).map((item: MonthlyDetail): ChartData => ({
        year: item.year,
        month: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        planned_amount: Number(item.planned_amount || 0),
        actual_amount: Number(item.actual_amount || 0)
      }));
    },
    enabled: !!household?.householdId
  });

  if (isLoadingHousehold || isLoading) {
    return React.createElement('div', 
      { className: 'h-[300px] flex items-center justify-center' },
      'Loading...'
    );
  }

  if (isError) {
    return React.createElement('div',
      { className: 'h-[300px] flex items-center justify-center' },
      'Error loading chart data'
    );
  }

  if (!monthlyData?.length) {
    return React.createElement('div',
      { className: 'h-[300px] flex items-center justify-center' },
      'No data available'
    );
  }

  return React.createElement('div',
    { className: 'h-[300px]' },
    React.createElement(ResponsiveContainer,
      { width: '100%', height: '100%' },
      React.createElement(BarChart,
        { data: monthlyData },
        [
          React.createElement(CartesianGrid, { strokeDasharray: '3 3', key: 'grid' }),
          React.createElement(XAxis, { dataKey: 'month', key: 'x-axis' }),
          React.createElement(YAxis, { key: 'y-axis' }),
          React.createElement(Tooltip, { formatter: formatCurrency, key: 'tooltip' }),
          React.createElement(Legend, { key: 'legend' }),
          React.createElement(Bar, {
            key: 'planned',
            dataKey: 'planned_amount',
            name: 'Planned',
            fill: '#8884d8'
          }),
          React.createElement(Bar, {
            key: 'actual',
            dataKey: 'actual_amount',
            name: 'Actual',
            fill: '#82ca9d'
          })
        ]
      )
    )
  );
};
