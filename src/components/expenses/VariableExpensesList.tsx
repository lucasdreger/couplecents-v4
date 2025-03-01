
import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMonthlyExpenses, updateVariableExpense, deleteVariableExpense } from '@/lib/supabase'
import { queryKeys } from '@/lib/queries'
import { toast } from '@/hooks/use-toast'
import type { VariableExpense } from '@/types/database.types'

interface Props {
  expenses?: VariableExpense[]
  year?: number
  month?: number
  onEdit?: (expense: VariableExpense) => void
  onDelete?: (expense: VariableExpense) => void
}

export const VariableExpensesList = ({ year, month, onEdit, onDelete }: Props) => {
  const queryClient = useQueryClient()
  const [expenseToDelete, setExpenseToDelete] = useState<VariableExpense | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch expenses if year and month are provided
  const { data: expenses, isLoading } = useQuery({
    queryKey: queryKeys.expenses(year || 0, month || 0),
    queryFn: () => getMonthlyExpenses(year || 0, month || 0),
    enabled: !!year && !!month,
  })

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!expenseToDelete) return
    
    try {
      await deleteVariableExpense(expenseToDelete.id)
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.expenses(year || 0, month || 0) 
      })
      
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully deleted.",
      })
      
      setIsDeleteDialogOpen(false)
      setExpenseToDelete(null)
      
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  if (isLoading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }
  
  if (!expenses?.data?.length) {
    return <div className="text-center py-4 text-muted-foreground">No expenses found for this month.</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.data.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(expense)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setExpenseToDelete(expense)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
