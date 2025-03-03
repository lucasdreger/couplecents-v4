import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { PostgrestError } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  year: number
  month: number
}

interface FixedExpense {
  id: string
  description: string
  estimated_amount: number
  due_date?: string
  categories?: { name: string }
  status?: { fixed_expense_id: string; year: number; month: number; completed: boolean }
  status_required: boolean
}

export const FixedExpensesList = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: fixedExpenses, isLoading, isError } = useQuery<FixedExpense[], PostgrestError>({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      // First get all fixed expenses
      const { data: allFixedExpenses, error: expensesError } = await supabase
        .from('fixed_expenses')
        .select('*, categories(name)')
        .order('description');
        
      if (expensesError) throw expensesError;
      
      // Then get status for this month/year
      const { data: statusData, error: statusError } = await supabase
        .from('monthly_fixed_expense_status')
        .select('*')
        .eq('year', year)
        .eq('month', month);
        
      if (statusError) throw statusError;
      
      // Merge the data
      return allFixedExpenses.map(expense => ({
        ...expense,
        status: statusData?.find(status => status.fixed_expense_id === expense.id)
      }));
    }
  })

  const handleStatusChange = async (expenseId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('monthly_fixed_expense_status')
        .upsert({
          fixed_expense_id: expenseId,
          year,
          month,
          completed: checked
        });

      if (error) throw error;

      // Invalidate queries to refresh the list and task count
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
        {fixedExpenses?.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.categories?.name}</TableCell>
            <TableCell className="text-right">
              {expense.estimated_amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </TableCell>
            <TableCell>{expense.due_date}</TableCell>
            <TableCell>
              {expense.status_required ? (
                <Checkbox
                  checked={expense.status?.completed}
                  onCheckedChange={(checked) => 
                    handleStatusChange(expense.id, checked as boolean)
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
  )
}
