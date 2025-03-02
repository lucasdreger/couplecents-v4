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
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4B0082', '#FF1493', '#008B8B', '#8B4513', '#808000'];

type CategoryData = {
  name: string;
  value: number;
};

interface VariableExpenseRow {
  category: { name: string } | null;
  amount: number;
}

// Custom label that only shows percentage inside the pie slice
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const CategoryBreakdown = () => {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: async () => {
      // Get current date info
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      // Query for the last 6 months of data instead of only current month
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          category:categories (name),
          amount
        `)
        .or(`year.gt.${currentYear-1}, and(year.eq.${currentYear-1}, month.gte.${currentMonth})`); // Past 12 months
      
      if (error) {
        console.error("Error fetching category data:", error);
        throw error;
      }
      
      if (!data?.length) {
        console.log("No expense data found for categories");
        return [];
      }
      
      // Aggregate by category with null checking
      const categoryTotals = (data as any[]).reduce((acc: Record<string, number>, curr) => {
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
      return Object.entries(categoryTotals)
        .map(([name, value]) => ({
          name,
          value: Number(value) || 0,
        }))
        .sort((a, b) => b.value - a.value); // Sort by value descending
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">
      <Skeleton className="h-[250px] w-[250px] rounded-full" />
    </div>;
  }

  if (!categoryData?.length) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">
      No expense data available. Add some expenses to see your spending breakdown.
    </div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData as CategoryData[]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false} 
            label={renderCustomizedLabel}
          >
            {categoryData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `€${value.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
