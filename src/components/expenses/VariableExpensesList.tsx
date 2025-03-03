import { useState } from 'react'
import { Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMonthlyExpenses, deleteVariableExpense } from '@/lib/supabase'
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

type SortField = 'date' | 'amount' | 'category' | 'description';
type SortOrder = 'asc' | 'desc';

export const VariableExpensesList = ({ year, month, onEdit, onDelete }: Props) => {
  const queryClient = useQueryClient()
  const [expenseToDelete, setExpenseToDelete] = useState<VariableExpense | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Fetch expenses if year and month are provided
  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: queryKeys.expenses(year || 0, month || 0),
    queryFn: () => getMonthlyExpenses(year || 0, month || 0),
    enabled: !!year && !!month,
  });

  // Extract expenses from the response
  const expenses = expensesResponse?.data || [];

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

  const sortExpenses = (expenses: VariableExpense[]) => {
    return [...expenses].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (sortBy === 'category') {
        const catA = a.category?.name || '';
        const catB = b.category?.name || '';
        return sortOrder === 'asc'
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }
      if (sortBy === 'description') {
        return sortOrder === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });
  };

  const handleSortChange = (field: SortField) => {
    if (field === sortBy) {
      // Toggle order if clicking the same field
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending order
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Get the appropriate sort icon for a column
  const getSortIcon = (field: SortField) => {
    if (field === sortBy) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return null;
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }
  
  if (!expenses.length) {
    return <div className="text-center py-4 text-muted-foreground">No expenses found for this month.</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSortChange('date')} className="cursor-pointer">
              <div className="flex items-center">
                Date {getSortIcon('date')}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSortChange('description')} className="cursor-pointer">
              <div className="flex items-center">
                Description {getSortIcon('description')}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSortChange('category')} className="cursor-pointer">
              <div className="flex items-center">
                Category {getSortIcon('category')}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSortChange('amount')} className="cursor-pointer text-right">
              <div className="flex items-center justify-end">
                Amount {getSortIcon('amount')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortExpenses(expenses).map((expense) => (
            <TableRow 
              key={expense.id}
              className={`transition-colors duration-200 ${hoveredRow === expense.id ? 'bg-accent/10' : ''}`}
              onMouseEnter={() => setHoveredRow(expense.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className="text-right">
                {expense.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit?.(expense)}
                    className={`transition-opacity duration-200 ${hoveredRow === expense.id ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setExpenseToDelete(expense)
                      setIsDeleteDialogOpen(true)
                    }}
                    className={`transition-opacity duration-200 ${hoveredRow === expense.id ? 'opacity-100' : 'opacity-0'}`}
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
