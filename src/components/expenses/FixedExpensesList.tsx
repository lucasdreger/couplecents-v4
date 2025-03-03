import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { PostgrestError } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabaseClient'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

interface Props {
  year: number
  month: number
}

interface FixedExpense {
  id: string
  description: string
  estimated_amount: number
  due_date?: string
  category?: { name: string }
  status?: Array<{ completed: boolean }>
  status_required: boolean
}

export const FixedExpensesList = ({ year, month }: Props) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [sortBy, setSortBy] = useState<'description' | 'amount' | 'category' | 'due_date'>('description');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: fixedExpenses, isLoading, isError } = useQuery<FixedExpense[], PostgrestError>({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select(`
          *,
          categories (name),
          status:monthly_fixed_expense_status!left (
            completed
          )
        `)
        .eq('status.year', year)
        .eq('status.month', month);

      if (error) throw error;

      return data?.map(expense => ({
        ...expense,
        status: expense.status || []
      })) || [];
    }
  });

  const handleStatusChange = async (expenseId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('monthly_fixed_expense_status')
        .upsert({
          fixed_expense_id: expenseId,
          year,
          month,
          completed: checked
        }, {
          onConflict: 'fixed_expense_id,year,month'
        });

      if (error) throw error;

      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', year, month] });

      toast({
        description: `Task marked as ${checked ? 'completed' : 'pending'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update status",
      });
    }
  };

  const sortExpenses = (expenses: FixedExpense[]) => {
    return [...expenses].sort((a, b) => {
      if (sortBy === 'description') {
        return sortOrder === 'asc' 
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' 
          ? a.estimated_amount - b.estimated_amount
          : b.estimated_amount - a.estimated_amount;
      }
      if (sortBy === 'category') {
        const catA = a.category?.name || '';
        const catB = b.category?.name || '';
        return sortOrder === 'asc'
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
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

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (isError) {
    return <div className="text-red-500">Failed to load fixed expenses</div>
  }

  if (!fixedExpenses?.length) {
    return <div className="py-4 text-center text-muted-foreground">No fixed expenses found for this month</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(value: 'description' | 'amount' | 'category' | 'due_date') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="description">Description</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={toggleSortOrder}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortExpenses(fixedExpenses || []).map((expense: FixedExpense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name}</TableCell>
              <TableCell className="text-right">
                {expense.estimated_amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </TableCell>
              <TableCell>{expense.due_date}</TableCell>
              <TableCell>
                {expense.status_required ? (
                  <Checkbox
                    checked={expense.status?.[0]?.completed}
                    onCheckedChange={(checked: boolean) => 
                      handleStatusChange(expense.id, checked)
                    }
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
