import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedExpensesList } from "@/components/expenses/FixedExpensesList";
import { VariableExpensesList } from "@/components/expenses/VariableExpensesList";
import { MonthlyIncome } from "@/components/expenses/MonthlyIncome";
import { CreditCardBill } from "@/components/expenses/CreditCardBill";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries';
import { getMonthlyExpenses, addVariableExpense, supabase } from '@/lib/supabase';
import { ErrorBoundary } from 'react-error-boundary';
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { VariableExpense } from '@/types/database.types';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: any }) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong:</h2>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
};

export function MonthlyExpenses() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const queryClient = useQueryClient();
  
  // Start with 2025 by default
  const defaultYear = 2025;
  
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [uncheckedTasksCount, setUncheckedTasksCount] = useState(0);
  
  // Get monthly expenses data
  const { data: expenses } = useQuery({
    queryKey: queryKeys.expenses(selectedYear, selectedMonth),
    queryFn: () => getMonthlyExpenses(selectedYear, selectedMonth)
  });
  
  // Get monthly income data
  const { data: income } = useQuery({
    queryKey: ['income', selectedYear, selectedMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from('monthly_income')
        .select('*')
        .eq('year', selectedYear)
        .eq('month', selectedMonth)
        .single();
      return data;
    }
  });
  
  // Get fixed expenses data
  const { data: fixedExpenses } = useQuery({
    queryKey: ['fixed-expenses', selectedYear, selectedMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from('fixed_expenses')
        .select(`
          *,
          status:monthly_fixed_expense_status(completed)
        `)
        .eq('status.year', selectedYear)
        .eq('status.month', selectedMonth);
      return data;
    }
  });
  
  // Get credit card bill status
  const { data: creditCardBill } = useQuery({
    queryKey: ['credit-card-bill', selectedYear, selectedMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from('monthly_credit_card')
        .select('*')
        .eq('year', selectedYear)
        .eq('month', selectedMonth)
        .maybeSingle();
      return data;
    }
  });
  
  // Calculate total income (salaries)
  const totalIncome = income ? (
    (income.lucas_main_income || 0) + 
    (income.lucas_other_income || 0) + 
    (income.camila_main_income || 0) + 
    (income.camila_other_income || 0)
  ) : 0;
  
  // Calculate total variable expenses
  const totalVariableExpenses = expenses?.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  
  // Calculate total fixed expenses
  const totalFixedExpenses = fixedExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  
  // Calculate total expenses
  const totalExpenses = totalVariableExpenses + totalFixedExpenses;
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  // Check for uncompleted tasks
  useEffect(() => {
    let count = 0;
    
    // Check fixed expenses with uncompleted status
    if (fixedExpenses) {
      count += fixedExpenses.filter(expense => 
        expense.status_required && !expense.status?.completed
      ).length;
    }
    
    // Check credit card bill transfer if needed
    if (creditCardBill) {
      const needsTransfer = creditCardBill.transfer_completed === false && 
        creditCardBill.amount > 0;
      if (needsTransfer) {
        count += 1;
      }
    }
    
    setUncheckedTasksCount(count);
  }, [fixedExpenses, creditCardBill]);
  
  // Generate years for dropdown (from 2025 to current year + 2)
  // Ensure 2025 is included in the range
  const startYear = Math.min(2025, defaultYear);
  const endYear = Math.max(currentYear + 2, defaultYear + 2);
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };
  
  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };
  
  const handleAddExpense = async (expenseData: Omit<VariableExpense, 'id' | 'created_at'>) => {
    try {
      await addVariableExpense(expenseData);
      
      // Invalidate the expenses query to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.expenses(selectedYear, selectedMonth) 
      });
      
      toast({
        title: "Success",
        description: "Expense added successfully.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Monthly Expenses</h1>
          <p className="text-muted-foreground text-sm">
            Managing expenses for {monthNames[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
          <select 
            className="border border-border rounded px-2 py-1 bg-background text-foreground"
            value={selectedYear} 
            onChange={(e) => handleYearChange(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <Tabs defaultValue={selectedMonth.toString()} onValueChange={handleMonthChange}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
              {monthNames.map((month, index) => (
                <TabsTrigger 
                  key={month} 
                  value={(index + 1).toString()}
                  className="text-xs sm:text-sm"
                >
                  {month.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {uncheckedTasksCount > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There are {uncheckedTasksCount} tasks still open that need your attention.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 mb-6">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyIncome
                year={selectedYear}
                month={selectedMonth}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Credit Card Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditCardBill
                year={selectedYear}
                month={selectedMonth}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Fixed Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <FixedExpensesList 
                year={selectedYear}
                month={selectedMonth}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle>Variable Expenses</CardTitle>
              <ExpenseForm 
                onSubmit={handleAddExpense}
                year={selectedYear}
                month={selectedMonth}
              />
            </CardHeader>
            <CardContent>
              <VariableExpensesList
                year={selectedYear}
                month={selectedMonth}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Total Income:</p>
                <p className="font-medium">
                  {totalIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Total Expenses:</p>
                <p className="font-medium">
                  {totalExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
              <div className="h-px bg-border my-1"></div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">Balance:</p>
                <p className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
