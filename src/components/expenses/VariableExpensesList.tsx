import { useState } from 'react'
import { Edit, Trash, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMonthlyExpenses, deleteVariableExpense } from '@/lib/supabase'
import { queryKeys } from '@/lib/queries'
import { toast } from '@/hooks/use-toast'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VariableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: { name: string } | null;
  year: number;
  month: number;
}

interface Props {
  year?: number;
  month?: number;
  onEdit?: (expense: VariableExpense) => void;
}

export const VariableExpensesList = ({ year, month, onEdit }: Props) => {
  const queryClient = useQueryClient()
  const [expenseToDelete, setExpenseToDelete] = useState<VariableExpense | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
      return 0;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }
  
  if (!expenses.length) {
    return <div className="text-center py-4 text-muted-foreground">No expenses found for this month.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'category') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={toggleSortOrder}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortExpenses(expenses).map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className="text-right">
                {expense.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
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
    </div>
  );
};
