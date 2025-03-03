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
      
      // Calculate start date based on months parameter (looking back from current date)
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months + 1);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      
      // Create an array of all month/year combinations we need data for
      const periods = [];
      let year = startYear;
      let month = startMonth;
      
      for (let i = 0; i < months; i++) {
        periods.push({ year, month });
        
        // Move to the next month
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        
        // Stop if we've reached beyond the current month/year
        if (year > currentYear || (year === currentYear && month > currentMonth)) {
          break;
        }
      }
      
      // Get monthly income data for all relevant months
      const incomePromises = periods.map(period => 
        supabase
          .from('monthly_income')
          .select('*')
          .eq('year', period.year)
          .eq('month', period.month)
          .maybeSingle()
      );
      
      // Get monthly expenses data for all relevant months
      const expensesPromises = periods.map(period => 
        supabase
          .from('monthly_expenses')
          .select('*')
          .eq('year', period.year)
          .eq('month', period.month)
          .maybeSingle()
      );
      
      // Get all fixed expenses to calculate monthly fixed costs
      const { data: fixedExpensesData, error: fixedExpensesError } = await supabase
        .from('fixed_expenses')
        .select('estimated_amount');
      
      if (fixedExpensesError) throw fixedExpensesError;
      
      // Calculate total fixed expenses (assuming they're consistent monthly)
      const totalFixedExpenses = fixedExpensesData?.reduce(
        (sum, expense) => sum + Number(expense.estimated_amount || 0),
        0
      ) || 0;
      
      // Wait for all promises to resolve
      const incomeResults = await Promise.all(incomePromises);
      const expensesResults = await Promise.all(expensesPromises);
      
      // Create the final dataset by combining income and expenses data
      return periods.map((period, index) => {
        const incomeData = incomeResults[index].data;
        const expenseData = expensesResults[index].data;
        
        // Calculate totals
        const totalIncome = incomeData
          ? (Number(incomeData.lucas_main_income || 0) +
             Number(incomeData.lucas_other_income || 0) +
             Number(incomeData.camila_main_income || 0) +
             Number(incomeData.camila_other_income || 0))
          : 0;
        
        // If we have monthly expenses data, use it, otherwise use fixed expenses as an estimate
        const totalExpenses = expenseData
          ? Number(expenseData.total_expenses || 0)
          : totalFixedExpenses;
        
        const savings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
        
        // Format month name
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthDisplay = monthNames[period.month - 1];
        
        return {
          name: `${monthDisplay}/${period.year}`,
          Income: totalIncome,
          Expenses: totalExpenses,
          Savings: savings,
          SavingsRate: savingsRate
        };
      });
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
        No monthly data available. Please add income and expenses to see your budget trends.
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
