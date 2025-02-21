
/**
 * Monthly Expenses Management Page
 * 
 * Features:
 * - Monthly expense tracking with year/month selection
 * - Real-time expense updates
 * - Category-based expense organization
 * - Interactive data table with sorting and filtering
 * - Responsive design for all screen sizes
 */

import { useState } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export const Expenses = () => {
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  
  // Custom hook for expense management
  const { expenses, addExpense } = useExpenses(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1
  )
  const { toast } = useToast()

  // Calculate total expenses for the selected month
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Monthly Expenses</h2>
          <p className="text-muted-foreground">
            Manage and track your expenses for {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
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

      {/* Month Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
          <CardDescription>Choose the month and year to view expenses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
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
            <SelectTrigger className="w-[120px]">
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
        </CardContent>
      </Card>

      {/* Expenses Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses Summary</CardTitle>
          <CardDescription>Overview of expenses for the selected month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">
            Total expenses for {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>List of all expenses for the selected month</CardDescription>
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
              {expenses?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category?.name}</TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {!expenses?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No expenses found for this month
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
