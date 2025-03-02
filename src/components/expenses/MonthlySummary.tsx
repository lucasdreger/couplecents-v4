import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthlyExpenses, getFixedExpenses } from '@/lib/supabase/queries';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  year: number;
  month: number;
}

export const MonthlySummary = ({ year, month }: Props) => {
  // Get monthly income
  const { data: income } = useQuery({
    queryKey: ['income', year, month],
    queryFn: async () => {
      const { data } = await supabase
        .from('monthly_income')
        .select('*')
        .eq('year', year)
        .eq('month', month)
        .single();
      return data;
    }
  });

  // Get variable expenses
  const { data: variableExpensesResponse } = useQuery({
    queryKey: ['variable-expenses', year, month],
    queryFn: () => getMonthlyExpenses(year, month)
  });

  // Get fixed expenses
  const { data: fixedExpensesResponse } = useQuery({
    queryKey: ['fixed-expenses', year, month],
    queryFn: () => getFixedExpenses(year, month)
  });

  // Calculate total income
  const totalIncome = income ? (
    (income.lucas_main_income || 0) + 
    (income.lucas_other_income || 0) + 
    (income.camila_main_income || 0) + 
    (income.camila_other_income || 0)
  ) : 0;

  // Calculate total variable expenses - ensure we're working with an array
  const variableExpenses = variableExpensesResponse?.data || [];
  const totalVariableExpenses = Array.isArray(variableExpenses) 
    ? variableExpenses.reduce((sum: number, expense: { amount: number }) => 
        sum + (expense.amount || 0), 0)
    : 0;

  // Calculate total fixed expenses - ensure we're working with an array
  const fixedExpenses = fixedExpensesResponse?.data || [];
  const totalFixedExpenses = Array.isArray(fixedExpenses)
    ? fixedExpenses.reduce((sum: number, expense: { estimated_amount: number }) => 
        sum + (expense.estimated_amount || 0), 0)
    : 0;

  // Calculate total expenses
  const totalExpenses = totalVariableExpenses + totalFixedExpenses;

  // Calculate balance
  const balance = totalIncome - totalExpenses;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Income</p>
            <p className="font-medium text-lg">
              {totalIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">Total Expenses</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>Fixed: {totalFixedExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                <span>•</span>
                <span>Variable: {totalVariableExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
            <p className="font-medium text-lg">
              {totalExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          
          <div className="h-px bg-border my-1"></div>
          
          <div className="flex justify-between items-center">
            <p className="font-medium">Available Balance</p>
            <p className={`font-bold text-xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};