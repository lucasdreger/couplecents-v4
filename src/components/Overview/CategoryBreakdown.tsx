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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4B0082', '#FF1493', '#008B8B', '#8B4513', '#808000'];

type CategoryData = {
  name: string;
  value: number;
};

type VariableExpenseRow = {
  category: { name: string } | null;
  amount: number;
};

export const CategoryBreakdown = () => {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: async () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          category:categories (name),
          amount
        `)
        .or(`year.gt.${currentYear-1}, and(year.eq.${currentYear-1}, month.gte.${currentMonth})`);
      
      if (error) {
        console.error("Error fetching category data:", error);
        throw error;
      }
      
      if (!data?.length) {
        console.log("No expense data found for categories");
        return [];
      }
      
      const categoryTotals = (data as VariableExpenseRow[]).reduce((acc: Record<string, number>, curr) => {
        const categoryName = curr.category?.name || 'Uncategorized';
        const amount = typeof curr.amount === 'number' ? curr.amount : 0;
        
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        
        acc[categoryName] += amount;
        return acc;
      }, {});
      
      return Object.entries(categoryTotals)
        .map(([name, value]) => ({
          name,
          value: Number(value) || 0,
        }))
        .sort((a, b) => b.value - a.value);
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!categoryData?.length) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">
      No expense data available. Add some expenses to see your spending breakdown.
    </div>;
  }

  const chartData = categoryData as CategoryData[];

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
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `€${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
