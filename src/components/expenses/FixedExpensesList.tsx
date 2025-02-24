
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { PostgrestError } from '@supabase/supabase-js'

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
}

export const FixedExpensesList = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: fixedExpenses } = useQuery<FixedExpense[], PostgrestError>({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      const { data, error } = await getFixedExpenses(year, month)
      if (error) throw error
      return data || []
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
              ${(expense.estimated_amount ?? 0).toFixed(2)}
            </TableCell>
            <TableCell>{expense.due_date}</TableCell>
            <TableCell>
              <Checkbox
                checked={expense.status?.[0]?.completed}
                onCheckedChange={(checked) => 
                  updateStatus({ id: expense.id, completed: checked as boolean })
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
