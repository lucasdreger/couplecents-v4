import { useState } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/components/ui/use-toast'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Expenses Management Page
 * 
 * Features:
 * - Monthly expense tracking
 * - Month/Year selection
 * - Expense addition through modal form
 * - Tabular view of expenses with sorting
 * - Category-based expense organization
 */

export const Expenses = () => {
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  
  // Custom hook for expense management
  const { expenses, addExpense } = useExpenses(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1
  )
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <div className="flex items-center gap-4">
            <Select
              value={selectedMonth.getMonth().toString()}
              onValueChange={(value) => {
                const newDate = new Date(selectedMonth)
                newDate.setMonth(parseInt(value))
                setSelectedMonth(newDate)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedMonth.getFullYear().toString()}
              onValueChange={(value) => {
                const newDate = new Date(selectedMonth)
                newDate.setFullYear(parseInt(value))
                setSelectedMonth(newDate)
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ExpenseForm
          onSubmit={async (data) => {
            try {
              await addExpense(data)
              toast({ description: "Expense added successfully" })
            } catch (error) {
              toast({ 
                variant: "destructive", 
                description: "Failed to add expense" 
              })
            }
          }}
        />
      </div>

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
          {expenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
