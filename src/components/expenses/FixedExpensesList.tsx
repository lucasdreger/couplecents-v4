import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { PostgrestError } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'

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
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: fixedExpenses, isLoading, isError } = useQuery<FixedExpense[], PostgrestError>({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select(`
          *,
          category:categories(name),
          status:monthly_fixed_expense_status!inner(completed)
        `)
        .eq('monthly_fixed_expense_status.year', year)
        .eq('monthly_fixed_expense_status.month', month);

      if (error) throw error;
      return data || [];
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await updateFixedExpenseStatus(id, completed)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      toast({ description: "Status updated successfully" })
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
            <TableCell>{expense.category?.name}</TableCell>
            <TableCell className="text-right">
              {expense.estimated_amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </TableCell>
            <TableCell>{expense.due_date}</TableCell>
            <TableCell>
              {expense.status_required ? (
                <Checkbox
                  checked={expense.status?.[0]?.completed}
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
