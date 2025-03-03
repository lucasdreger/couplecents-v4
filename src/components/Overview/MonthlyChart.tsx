import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  months?: number; // Number of months to display (default: 6)
}

export const MonthlyChart = ({ months = 6 }: Props) => {
  const { data: monthlyData, isLoading } = useQuery({
    queryKey: ['monthly-expenses-chart', months],
    queryFn: async () => {
      // Get current date
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      // Calculate start date based on months parameter
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months + 1);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      
      // Get monthly expenses data
      let query = supabase
        .from('monthly_expenses')
        .select('*');
      
      // Filter based on the time range
      if (startYear === currentYear) {
        // Same year, just filter by months
        query = query.eq('year', currentYear).gte('month', startMonth);
      } else {
        // Multiple years
        query = query.or(`year.gt.${startYear}, and(year.eq.${startYear}, month.gte.${startMonth})`);
      }
      
      // Add current year/month upper limit
      query = query.lte('year', currentYear).lte('month', currentMonth);
      
      const { data: expensesData, error: expensesError } = await query.order('year').order('month');
      
      if (expensesError) throw expensesError;
      
      // Get monthly income data with same filters
      let incomeQuery = supabase
        .from('monthly_income')
        .select('*');
      
      if (startYear === currentYear) {
        incomeQuery = incomeQuery.eq('year', currentYear).gte('month', startMonth);
      } else {
        incomeQuery = incomeQuery.or(`year.gt.${startYear}, and(year.eq.${startYear}, month.gte.${startMonth})`);
      }
      
      incomeQuery = incomeQuery.lte('year', currentYear).lte('month', currentMonth);
      
      const { data: incomeData, error: incomeError } = await incomeQuery.order('year').order('month');
      
      if (incomeError) throw incomeError;
      
      // Combine and format the data
      return incomeData?.map(incomeItem => {
        // Find matching expense record
        const matchingExpense = expensesData?.find(exp => 
          exp.year === incomeItem.year && exp.month === incomeItem.month
        );
        
        const totalIncome = Number(incomeItem.lucas_main_income || 0) + 
                            Number(incomeItem.lucas_other_income || 0) + 
                            Number(incomeItem.camila_main_income || 0) + 
                            Number(incomeItem.camila_other_income || 0);
        
        const totalExpense = Number(matchingExpense?.total_expenses || 0);
        const savings = totalIncome - totalExpense;
        
        return {
          name: `${incomeItem.month}/${incomeItem.year}`,
          Income: totalIncome,
          Expenses: totalExpense,
          Savings: savings,
          SavingsRate: totalIncome > 0 ? (savings / totalIncome) * 100 : 0
        };
      }) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  if (!monthlyData?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No monthly data available.
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === "SavingsRate") {
                return [`${value.toFixed(1)}%`, name];
              }
              return [value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), name];
            }}
          />
          <Legend />
          <Bar dataKey="Income" fill="#8884d8" />
          <Bar dataKey="Expenses" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
