
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedExpensesList } from "@/components/expenses/FixedExpensesList";
import { VariableExpensesList } from "@/components/expenses/VariableExpensesList";
import { MonthlyIncome } from "@/components/expenses/MonthlyIncome";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries';
import { getMonthlyExpenses, addVariableExpense } from '@/lib/supabase';
import { ErrorBoundary } from 'react-error-boundary';
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { toast } from "@/hooks/use-toast";
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
  
  // Get monthly expenses data
  const { data: expenses } = useQuery({
    queryKey: queryKeys.expenses(selectedYear, selectedMonth),
    queryFn: () => getMonthlyExpenses(selectedYear, selectedMonth)
  });
  
  // Calculate totals
  const totalVariableExpenses = expenses?.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const totalExpenses = totalVariableExpenses; // Add fixed expenses if needed
  
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
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Total Expenses: <span className="font-bold">${totalExpenses.toFixed(2)}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
