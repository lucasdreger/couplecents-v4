
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedExpensesList } from "@/components/expenses/FixedExpensesList";
import { VariableExpensesList } from "@/components/expenses/VariableExpensesList";
import { MonthlyIncome } from "@/components/expenses/MonthlyIncome";
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries';
import { getMonthlyExpenses } from '@/lib/supabase';

export function MonthlyExpenses() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  // Get monthly expenses data
  const { data: expenses } = useQuery({
    queryKey: queryKeys.expenses(selectedYear, selectedMonth),
    queryFn: () => getMonthlyExpenses(selectedYear, selectedMonth)
  });
  
  // Calculate totals
  const totalVariableExpenses = expenses?.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const totalExpenses = totalVariableExpenses; // Add fixed expenses if needed
  
  // Generate years for dropdown (from 2023 to current year + 1)
  const years = Array.from({ length: (currentYear + 1) - 2023 + 1 }, (_, i) => 2023 + i);
  
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
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">Monthly Expenses</h1>
        
        <div className="flex gap-2 flex-wrap">
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Variable Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <VariableExpensesList
              year={selectedYear}
              month={selectedMonth}
            />
          </CardContent>
        </Card>
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
