/**
 * Budget Summary Tile Component
 * 
 * Displays the total budget information including:
 * - Total income
 * - Total expenses
 * - Net balance
 */
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetData {
  totalIncome: number;
  totalExpenses: number;
}

export const BudgetTile = () => {
  const { data: budgetData, isLoading, isError } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: async () => {
      // First get the latest month's income
      const { data: incomeData, error: incomeError } = await supabase
        .from('monthly_income')
        .select('lucas_main_income, lucas_other_income, camila_main_income, camila_other_income')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(1);
      
      if (incomeError) throw incomeError;

      // Get expenses from the monthly details
      const { data: expensesData, error: expensesError } = await supabase
        .from('monthly_details')
        .select('planned_amount')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(1);

      if (expensesError) throw expensesError;
      
      const income = incomeData && incomeData.length > 0 ? 
        (incomeData[0].lucas_main_income || 0) + 
        (incomeData[0].lucas_other_income || 0) + 
        (incomeData[0].camila_main_income || 0) + 
        (incomeData[0].camila_other_income || 0) : 0;
      
      const expenses = expensesData && expensesData.length > 0 ? 
        expensesData[0].planned_amount || 0 : 0;

      return {
        totalIncome: income,
        totalExpenses: expenses
      };
    },
  });

  const totalIncome = budgetData?.totalIncome || 0;
  const totalExpenses = budgetData?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;

  // Format number as European currency (Euro)
  const formatEuro = (value: number) => {
    return '€' + value.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Total Budget</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : isError ? (
          <div className="text-red-500">Error loading budget data</div>
        ) : (
          <div className="space-y-2">
            <p className="text-3xl font-bold text-primary">
              {formatEuro(totalIncome)}
            </p>
            <p className="text-sm text-muted-foreground">
              Expenses: {formatEuro(totalExpenses)}
            </p>
            <p className={`text-sm ${balance >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
              Balance: {formatEuro(balance)}
            </p>
          </div>
        )}
      </CardContent>
    </>
  );
};
