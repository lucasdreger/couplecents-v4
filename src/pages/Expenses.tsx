import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMonthlyExpenses, getFixedExpenseStatus } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { ExpenseForm } from "@/components/expenses/ExpenseForm"

export function Expenses() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const { data: variableExpenses } = useQuery({
    queryKey: ['expenses', selectedYear, selectedMonth],
    queryFn: () => getMonthlyExpenses(selectedYear, selectedMonth)
  })

  const { data: fixedExpenses } = useQuery({
    queryKey: ['fixed-expenses', selectedYear, selectedMonth],
    queryFn: () => getFixedExpenseStatus(selectedYear, selectedMonth)
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <ExpenseForm />
      </div>

      <Tabs defaultValue="variable">
        <TabsList>
          <TabsTrigger value="variable">Variable Expenses</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="variable">
          <DataTable 
            data={variableExpenses?.data || []}
            columns={[
              { accessorKey: 'date', header: 'Date' },
              { accessorKey: 'description', header: 'Description' },
              { accessorKey: 'amount', header: 'Amount' },
              { accessorKey: 'category.name', header: 'Category' },
            ]}
          />
        </TabsContent>
        <TabsContent value="fixed">
          <DataTable 
            data={fixedExpenses?.data || []}
            columns={[
              { accessorKey: 'fixed_expenses.description', header: 'Description' },
              { accessorKey: 'fixed_expenses.estimated_amount', header: 'Amount' },
              { accessorKey: 'completed', header: 'Status' },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
