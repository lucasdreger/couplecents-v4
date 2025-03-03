import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Pencil, Trash } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { queryKeys } from '@/lib/queries'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FixedExpense {
  id: string;
  description: string;
  estimated_amount: number;
  category_id: string;
  owner: string;
  status_required: boolean;
  due_date: string | null;
  categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

type SortField = 'description' | 'owner' | 'category' | 'amount' | 'due_date';
type SortOrder = 'asc' | 'desc';

export const FixedExpensesManagement = () => {
  const [expense, setExpense] = useState({
    id: '',
    description: '',
    amount: '',
    category_id: '',
    owner: 'Lucas',
    status_required: false,
    due_date: ''
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortField>('description');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: categories } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    }
  })
  
  const { data: fixedExpenses } = useQuery({
    queryKey: queryKeys.fixedExpenses(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*, categories(*)')
        .order('description')
      if (error) throw error
      return data
    }
  })
  
  const { mutate: addExpense, isPending: isAddPending } = useMutation({
    mutationFn: async (data: typeof expense) => {
      // Make sure the amount is properly converted to a number
      const numericAmount = parseFloat(data.amount.replace(',', '.'));
      if (isNaN(numericAmount)) {
        throw new Error("Amount must be a valid number");
      }
      
      const { error, data: insertedData } = await supabase
        .from('fixed_expenses')
        .insert({
          description: data.description,
          estimated_amount: numericAmount,
          category_id: data.category_id,
          owner: data.owner,
          status_required: data.status_required,
          due_date: data.due_date || null
        })
        .select()
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      return insertedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
      resetForm()
      toast({ description: "Fixed expense added successfully" })
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({ 
        description: "Failed to add fixed expense: " + error.message,
        variant: "destructive"
      })
    }
  })
  
  const { mutate: updateExpense, isPending: isUpdatePending } = useMutation({
    mutationFn: async (data: typeof expense) => {
      const numericAmount = parseFloat(data.amount.replace(',', '.'));
      if (isNaN(numericAmount)) {
        throw new Error("Amount must be a valid number");
      }
      
      const { error, data: updatedData } = await supabase
        .from('fixed_expenses')
        .update({
          description: data.description,
          estimated_amount: numericAmount,
          category_id: data.category_id,
          owner: data.owner,
          status_required: data.status_required,
          due_date: data.due_date || null
        })
        .eq('id', data.id)
        .select()
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
      resetForm()
      setIsEditing(false)
      toast({ description: "Fixed expense updated successfully" })
    },
    onError: (error: Error) => {
      console.error("Update error:", error);
      toast({ 
        description: "Failed to update fixed expense: " + error.message,
        variant: "destructive"
      })
    }
  })
  
  const { mutate: deleteExpense, isPending: isDeletePending } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
      setShowDeleteDialog(false)
      setExpenseToDelete(null)
      toast({ description: "Fixed expense deleted successfully" })
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      toast({ 
        description: "Failed to delete fixed expense: " + error.message,
        variant: "destructive"
      })
    }
  })
  
  const handleEditExpense = (expense: FixedExpense) => {
    setExpense({
      id: expense.id,
      description: expense.description,
      amount: expense.estimated_amount.toString().replace('.', ','),
      category_id: expense.category_id,
      owner: expense.owner,
      status_required: expense.status_required,
      due_date: expense.due_date || ''
    })
    setIsEditing(true)
  }
  
  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id)
    setShowDeleteDialog(true)
  }
  
  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete)
    }
  }
  
  const resetForm = () => {
    setExpense({
      id: '',
      description: '',
      amount: '',
      category_id: '',
      owner: 'Lucas',
      status_required: false,
      due_date: ''
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateExpense(expense);
    } else {
      addExpense(expense);
    }
  }
  
  const handleCancel = () => {
    resetForm()
    setIsEditing(false)
  }

  const handleSortChange = (field: SortField) => {
    if (field === sortBy) {
      // Toggle order if clicking the same field
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending order
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (field === sortBy) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return null;
  };
  
  const sortExpenses = (expenses: FixedExpense[] | undefined) => {
    if (!expenses) return [];
    
    return [...expenses].sort((a, b) => {
      if (sortBy === 'description') {
        return sortOrder === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      if (sortBy === 'owner') {
        return sortOrder === 'asc'
          ? a.owner.localeCompare(b.owner)
          : b.owner.localeCompare(a.owner);
      }
      if (sortBy === 'category') {
        const catA = a.categories?.name || '';
        const catB = b.categories?.name || '';
        return sortOrder === 'asc'
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc'
          ? a.estimated_amount - b.estimated_amount
          : b.estimated_amount - a.estimated_amount;
      }
      if (sortBy === 'due_date') {
        const dateA = a.due_date || '';
        const dateB = b.due_date || '';
        return sortOrder === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      }
      return 0;
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and comma
    const value = e.target.value.replace(/[^0-9,]/g, '');
    setExpense(prev => ({ ...prev, amount: value }));
  };
  
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense(prev => ({ ...prev, due_date: e.target.value }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixed Expenses Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input 
            placeholder="Description"
            value={expense.description}
            onChange={handleInputChange}
            required
          />
          
          <Label>Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            <Input
              type="text"
              className="pl-7 text-right"
              placeholder="0,00"
              value={expense.amount}
              onChange={handleAmountChange}
              required
            />
          </div>
          
          <Select 
            value={expense.category_id}
            onValueChange={(value) => setExpense(prev => ({ ...prev, category_id: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={expense.owner}
            onValueChange={(value) => setExpense(prev => ({ ...prev, owner: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lucas">Lucas</SelectItem>
              <SelectItem value="Camila">Camila</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="text"
            placeholder="Due Date (e.g., 15th or Last day)"
            value={expense.due_date}
            onChange={handleDueDateChange}
          />
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status-required"
              checked={expense.status_required}
              onCheckedChange={(checked) => 
                setExpense(prev => ({ ...prev, status_required: checked }))
              }
            />
            <Label htmlFor="status-required">Status Required</Label>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit"
              disabled={!expense.description || !expense.amount || !expense.category_id || isAddPending || isUpdatePending}
            >
              {isEditing ? (isUpdatePending ? 'Updating...' : 'Update Expense') : (isAddPending ? 'Adding...' : 'Add Fixed Expense')}
            </Button>
            
            {isEditing && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-2">Fixed Expenses List</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSortChange('description')} className="cursor-pointer">
                  <div className="flex items-center">
                    Description {getSortIcon('description')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortChange('owner')} className="cursor-pointer">
                  <div className="flex items-center">
                    Owner {getSortIcon('owner')}
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
                <TableHead onClick={() => handleSortChange('due_date')} className="cursor-pointer">
                  <div className="flex items-center">
                    Due Date {getSortIcon('due_date')}
                  </div>
                </TableHead>
                <TableHead>Status Req.</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortExpenses(fixedExpenses)?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.owner}</TableCell>
                  <TableCell>{expense.categories?.name}</TableCell>
                  <TableCell className="text-right">
                    {expense.estimated_amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </TableCell>
                  <TableCell>{expense.due_date || '-'}</TableCell>
                  <TableCell>
                    {expense.status_required ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditExpense(expense)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this fixed expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeletePending}>
              {isDeletePending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
