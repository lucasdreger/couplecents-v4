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
  ReferenceLine,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

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
      // Get the last 12 months
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const { data, error } = await supabase
        .from('monthly_details')
        .select('*')
        .or(`year.gt.${currentYear-1}, and(year.eq.${currentYear-1}, month.gte.${currentMonth})`)
        .order('year, month');
      
      if (error) {
        console.error('Error fetching monthly details:', error);
        throw error;
      }

      // Transform and validate data
      return (data || []).map((item: MonthlyDetail): ChartData => ({
        year: item.year,
        month: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        planned_amount: Number(item.planned_amount || 0),
        actual_amount: Number(item.actual_amount || 0)
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading chart data
      </div>
    );
  }

  if (!monthlyData?.length) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
        <p>No monthly data available</p>
        <p className="text-sm mt-2">Add monthly budgets to see comparisons</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`€${value.toFixed(2)}`, undefined]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <ReferenceLine y={0} stroke="#e2e8f0" />
          <Bar 
            dataKey="planned_amount" 
            name="Planned" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="actual_amount" 
            name="Actual" 
            fill="#82ca9d" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
