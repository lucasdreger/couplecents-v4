
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
  ReferenceLine,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartData {
  name: string;
  planned: number;
  actual: number;
  month: number;
  year: number;
}

export const MonthlyChart = () => {
  const { data: monthlyData, isLoading, isError } = useQuery({
    queryKey: ['monthlyExpenses'],
    queryFn: async (): Promise<ChartData[]> => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('year, month, planned_amount, actual_amount')
        .order('year, month');
      
      if (error) {
        console.error('Error fetching monthly details:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform data for the chart
      return data.map(item => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = (item.month || 1) - 1; // Ensure it's within bounds
        const monthName = monthNames[monthIndex >= 0 && monthIndex < 12 ? monthIndex : 0];
        
        return {
          name: `${monthName} ${item.year}`,
          planned: Number(item.planned_amount || 0),
          actual: Number(item.actual_amount || 0),
          month: item.month,
          year: item.year
        };
      });
    }
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
        Error loading chart data. Please try again later.
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
            dataKey="name" 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
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
            dataKey="planned" 
            name="Planned" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="actual" 
            name="Actual" 
            fill="#82ca9d" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
