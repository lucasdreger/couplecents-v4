import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import useHousehold from '@/hooks/useHousehold'
import type { FixedExpense } from '@/types/database.types'

const FixedExpensesList: React.FC = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: household, isLoading: isLoadingHousehold } = useHousehold();

  const { data: fixedExpenses, isLoading, isError, error } = useQuery({
    queryKey: ['fixed-expenses', household?.householdId],
    queryFn: async () => {
      if (!household?.householdId) throw new Error('No household ID');
      const { data, error } = await getFixedExpenses();
      if (error) throw error;
      return data || [];
    },
    enabled: !!household?.householdId,
    retry: 1
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
        description: "Failed to update expense status" 
      })
    }
  })

  if (isLoadingHousehold || isLoading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load expenses'
    return (
      <div className="text-center text-destructive py-4">
        {errorMessage}
      </div>
    )
  }

  if (!fixedExpenses?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No fixed expenses found for this month
      </div>
    )
  }

  const handleStatusChange = (id: string, checked: boolean) => {
    updateStatus({ id, completed: checked });
  };

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
                  onCheckedChange={(checked: boolean) => handleStatusChange(expense.id, checked)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}

export default FixedExpensesList;
