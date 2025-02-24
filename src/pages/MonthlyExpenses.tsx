import { useState } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/components/ui/use-toast'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { MonthlyIncome } from '@/components/expenses/MonthlyIncome'
import { FixedExpensesList } from '@/components/expenses/FixedExpensesList'
import { VariableExpensesList } from '@/components/expenses/VariableExpensesList'

export const MonthlyExpenses = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  
  // Get all expense data from custom hook
  const { expenses, fixedExpenses, income, addExpense } = useExpenses(selectedYear, selectedMonth)
  const { toast } = useToast()

  // Generate array of recent years (current year - 2 to current year + 1)
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  // Calculate totals
  const totalIncome = income ? (income.lucas_income + income.camila_income + income.other_income) : 0
  const totalFixedExpenses = fixedExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  const totalVariableExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Monthly Expenses</h2>
        <p className="text-muted-foreground">
          Manage income and expenses for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <Tabs defaultValue={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <TabsList className="w-full justify-start">
            {years.map(year => (
              <TabsTrigger key={year} value={year.toString()}>{year}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
          <TabsList className="w-full grid grid-cols-6 sm:grid-cols-12">
            {months.map(month => (
              <TabsTrigger key={month} value={month.toString()}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'short' })}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalFixedExpenses + totalVariableExpenses).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalIncome - totalFixedExpenses - totalVariableExpenses).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <MonthlyIncome year={selectedYear} month={selectedMonth} />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fixed Expenses</CardTitle>
              <CardDescription>Total: ${totalFixedExpenses.toFixed(2)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FixedExpensesList year={selectedYear} month={selectedMonth} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Variable Expenses</CardTitle>
              <CardDescription>Total: ${totalVariableExpenses.toFixed(2)}</CardDescription>
            </div>
            <ExpenseForm
              onSubmit={async (data) => {
                try {
                  await addExpense({
                    ...data,
                    year: selectedYear,
                    month: selectedMonth
                  })
                  toast({ description: "Expense added successfully" })
                } catch (error) {
                  toast({ 
                    description: "Failed to add expense", 
                    variant: "destructive" 
                  })
                }
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <VariableExpensesList expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}
