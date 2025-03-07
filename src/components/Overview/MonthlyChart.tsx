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
      
      // Create an array of month/year combinations to fetch data for
      const periods = [];
      
      // If showing just one month, use the current month
      if (months === 1) {
        periods.push({ year: currentYear, month: currentMonth });
      } 
      // If showing more months, go back from current month
      else {
        // Start from months - 1 ago (to include current month in the range)
        for (let i = months - 1; i >= 0; i--) {
          const date = new Date(currentYear, currentMonth - 1 - i, 1);
          periods.push({ 
            year: date.getFullYear(), 
            month: date.getMonth() + 1 
          });
        }
      }
      
      console.log("Periods to fetch:", periods);
      
      // Get all monthly income records
      const { data: allIncomeData, error: incomeError } = await supabase
        .from('monthly_income')
        .select('*');
      
      if (incomeError) throw incomeError;
      
      // Get all variable expenses
      const { data: allVariableExpensesData, error: variableExpensesError } = await supabase
        .from('variable_expenses')
        .select('amount, year, month');
      
      if (variableExpensesError) throw variableExpensesError;
      
      // Get all fixed expenses (assuming consistent monthly amount)
      const { data: fixedExpensesData, error: fixedExpensesError } = await supabase
        .from('fixed_expenses')
        .select('estimated_amount');
      
      if (fixedExpensesError) throw fixedExpensesError;
      
      // Calculate total fixed expenses
      const totalFixedExpenses = fixedExpensesData?.reduce(
        (sum, expense) => sum + Number(expense.estimated_amount || 0),
        0
      ) || 0;
      
      // Create data for each month in our range
      return periods.map(period => {
        // Find income for this period
        const income = allIncomeData?.find(
          inc => inc.year === period.year && inc.month === period.month
        );
        
        // Find all variable expenses for this period
        const periodVariableExpenses = allVariableExpensesData
          ?.filter(e => e.year === period.year && e.month === period.month)
          .reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;
        
        // Calculate totals
        const totalIncome = income
          ? (Number(income.lucas_main_income || 0) +
             Number(income.lucas_other_income || 0) +
             Number(income.camila_main_income || 0) +
             Number(income.camila_other_income || 0))
          : 0;
        
        const totalExpenses = periodVariableExpenses + totalFixedExpenses;
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
