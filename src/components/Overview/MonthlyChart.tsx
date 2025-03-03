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
      
      // Create an array of month/year combinations we need data for
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
        
        // Stop if we've reached beyond the current month
        if (year > currentYear || (year === currentYear && month > currentMonth)) {
          break;
        }
      }
      
      // Get all monthly income records for these periods
      const { data: incomeData, error: incomeError } = await supabase
        .from('monthly_income')
        .select('*')
        .in('year', periods.map(p => p.year))
        .in('month', periods.map(p => p.month))
        .order('year')
        .order('month');
      
      if (incomeError) throw incomeError;
      
      // Get all variable expenses for the same periods
      const { data: variableExpensesData, error: variableExpensesError } = await supabase
        .from('variable_expenses')
        .select('amount, year, month')
        .in('year', periods.map(p => p.year))
        .in('month', periods.map(p => p.month));
      
      if (variableExpensesError) throw variableExpensesError;
      
      // Get all fixed expenses
      const { data: fixedExpensesData, error: fixedExpensesError } = await supabase
        .from('fixed_expenses')
        .select('estimated_amount');
      
      if (fixedExpensesError) throw fixedExpensesError;
      
      // Calculate total fixed expenses (assuming consistent monthly amount)
      const totalFixedExpenses = fixedExpensesData?.reduce(
        (sum, expense) => sum + Number(expense.estimated_amount || 0),
        0
      ) || 0;
      
      // Group variable expenses by month/year
      const expensesByPeriod = periods.map(period => {
        const periodVariableExpenses = variableExpensesData
          ?.filter(e => e.year === period.year && e.month === period.month)
          .reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;
        
        return {
          year: period.year,
          month: period.month,
          variableExpenses: periodVariableExpenses,
          fixedExpenses: totalFixedExpenses
        };
      });
      
      // Create the final dataset
      return periods.map(period => {
        // Find income for this period
        const income = incomeData?.find(
          inc => inc.year === period.year && inc.month === period.month
        );
        
        // Find expenses for this period
        const expenses = expensesByPeriod.find(
          exp => exp.year === period.year && exp.month === period.month
        );
        
        // Calculate totals
        const totalIncome = income
          ? (Number(income.lucas_main_income || 0) +
             Number(income.lucas_other_income || 0) +
             Number(income.camila_main_income || 0) +
             Number(income.camila_other_income || 0))
          : 0;
        
        const totalExpenses = (expenses?.variableExpenses || 0) + (expenses?.fixedExpenses || 0);
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
