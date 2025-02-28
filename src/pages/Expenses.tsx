/**
 * Comprehensive Expenses Management Page
 * 
 * Features:
 * - Integrated view of all financial transactions
 * - Tabs for Monthly Variable Expenses, Fixed Expenses, and Income
 * - Year/month selection for time-based filtering
 * - Real-time updates across all financial data
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { FixedExpensesList } from '@/components/expenses/FixedExpensesList';
import { MonthlyIncome } from '@/components/expenses/MonthlyIncome';
export const Expenses = () => {
  // Router state
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Determine active tab based on URL query param
  const getActiveTab = () => {
    const tab = searchParams.get('tab');
    if (tab === 'fixed') return 'fixed';
    if (tab === 'income') return 'income';
    return 'monthly';
  };

  // State for selected month and active tab
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Custom hooks for data
  const {
    expenses,
    addExpense
  } = useExpenses(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);
  const {
    categories
  } = useCategories();
  const {
    toast
  } = useToast();

  // Calculate totals
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Handle tab changes - just update the state, no navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update the URL with a query param without navigation
    const newUrl = new URL(window.location.href);
    if (value !== 'monthly') {
      newUrl.searchParams.set('tab', value);
    } else {
      newUrl.searchParams.delete('tab');
    }
    window.history.pushState({}, '', newUrl);
  };

  // Sync tab with URL on mount and URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.search]);
  return <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Financial Management</h2>
          <p className="text-muted-foreground">
            Manage all your financial transactions for {selectedMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
          </p>
        </div>
      </div>
      
      {/* Year and Month Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
          <CardDescription>Choose the year and month to view financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedMonth.getFullYear().toString()} className="space-y-4">
            <TabsList>
              {Array.from({
              length: 5
            }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return <TabsTrigger key={year} value={year.toString()} onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setFullYear(year);
                setSelectedMonth(newDate);
              }}>
                    {year}
                  </TabsTrigger>;
            })}
            </TabsList>
            <Tabs defaultValue={selectedMonth.getMonth().toString()} className="pt-4">
              <TabsList className="grid grid-cols-6 sm:grid-cols-12">
                {Array.from({
                length: 12
              }, (_, i) => <TabsTrigger key={i} value={i.toString()} onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setMonth(i);
                setSelectedMonth(newDate);
              }}>
                    {new Date(0, i).toLocaleString('default', {
                  month: 'short'
                })}
                  </TabsTrigger>)}
              </TabsList>
            </Tabs>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        
        {/* Monthly Variable Expenses Tab */}
        <TabsContent value="monthly" className="space-y-4">
          {/* Expenses Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Variable Expenses Summary</CardTitle>
              <CardDescription>Overview of variable expenses for the selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">
                Total variable expenses for {selectedMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              })}
              </p>
            </CardContent>
          </Card>
          
          {/* Variable Expenses Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Variable Expenses</CardTitle>
                <CardDescription>List of all variable expenses for the selected month</CardDescription>
              </div>
              <ExpenseForm onSubmit={async data => {
              try {
                await addExpense(data);
                toast({
                  description: "Expense added successfully"
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  description: "Failed to add expense"
                });
              }
            }} categories={categories} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses?.map(expense => <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category?.name}</TableCell>
                      <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>)}
                  {!expenses?.length && <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No expenses found for this month
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fixed Expenses Tab */}
        <TabsContent value="fixed">
          <Card>
            <CardHeader>
              <CardTitle>Fixed Expenses</CardTitle>
              <CardDescription>Manage your recurring monthly expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <FixedExpensesList year={selectedMonth.getFullYear()} month={selectedMonth.getMonth() + 1} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Income Tab */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
              <CardDescription>Track and manage your income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyIncome year={selectedMonth.getFullYear()} month={selectedMonth.getMonth() + 1} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};