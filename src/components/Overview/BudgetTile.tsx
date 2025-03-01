
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
  total_income: number;
  total_expenses: number;
}

export const BudgetTile = () => {
  const { data: budgetData, isLoading, isError } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('total_income, total_expenses')
        .single();
      
      if (error) throw error;
      return data as BudgetData;
    },
  });

  const totalIncome = budgetData?.total_income || 0;
  const totalExpenses = budgetData?.total_expenses || 0;
  const balance = totalIncome - totalExpenses;

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
              ${totalIncome.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Expenses: ${totalExpenses.toFixed(2)}
            </p>
            <p className={`text-sm ${balance >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
              Balance: ${balance.toFixed(2)}
            </p>
          </div>
        )}
      </CardContent>
    </>
  );
};
