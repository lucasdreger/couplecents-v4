
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { FixedExpense } from '@/types/database.types'

export const FixedExpenses = () => {
  const queryClient = useQueryClient()
  const { data: expenses } = useQuery({
    queryKey: ['fixed-expenses'],
    queryFn: async () => {
      const { data } = await getFixedExpenses()
      return data as FixedExpense[]
    }
  })

  const { mutate: toggleStatus } = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await updateFixedExpenseStatus(id, completed)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
  })

  const byCategory = expenses?.reduce((acc, expense) => {
    const category = expense.category?.name || 'Uncategorized'
    return {
      ...acc,
      [category]: [...(acc[category] || []), expense]
    }
  }, {} as Record<string, FixedExpense[]>)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Fixed Expenses</h2>
      {Object.entries(byCategory || {}).map(([category, expenses]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={expense.id}
                      checked={expense.status_required}
                      onCheckedChange={(checked) => 
                        toggleStatus({ id: expense.id, completed: checked as boolean })
                      }
                    />
                    <label htmlFor={expense.id}>{expense.description}</label>
                  </div>
                  <span>${expense.estimated_amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
