import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { FixedExpense } from '@/types/database.types'

interface Props {
  year: number
  month: number
}

export const FixedExpensesList = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: fixedExpenses, isLoading, isError } = useQuery({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      const { data, error } = await getFixedExpenses(year, month)
      if (error) throw error
      return data || []
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      await updateFixedExpenseStatus(id, completed)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      toast({ description: "Status updated successfully" })
    },
    onError: () => {
      toast({ 
        variant: "destructive",
        description: "Failed to update status" 
      })
    }
  })

  if (isLoading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }

  if (isError) {
    return <div className="text-center text-destructive py-4">Error loading expenses</div>
  }

  if (!fixedExpenses?.length) {
    return <div className="text-center text-muted-foreground py-4">No fixed expenses found</div>
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
        {fixedExpenses.map((expense: FixedExpense) => {
          const amount = Number(expense.amount || 0);
          return (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category?.name || 'Uncategorized'}</TableCell>
              <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
              <TableCell>{expense.due_date}</TableCell>
              <TableCell>
                <Checkbox
                  checked={expense.status?.completed}
                  onCheckedChange={(checked) => 
                    updateStatus({ id: expense.id, completed: checked as boolean })
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}
