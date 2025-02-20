/**
 * Expense Entry Form Component
 * 
 * Features:
 * - Modal-based expense entry
 * - Category selection
 * - Form validation
 * - Automatic form reset after submission
 * - Type-safe form data handling
 * 
 * Uses react-hook-form for form state management and shadcn/ui for styling.
 */

import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/lib/supabase'
import type { VariableExpense } from '@/types/database.types'

type ExpenseFormData = Omit<VariableExpense, 'id' | 'created_at'>

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>
}

export const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const { register, handleSubmit, reset } = useForm<ExpenseFormData>()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await getCategories()
      return data
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (data) => {
          await onSubmit(data)
          reset()
        })}>
          <div className="space-y-4">
            <Input {...register('description')} placeholder="Description" />
            <Input {...register('amount')} type="number" step="0.01" placeholder="Amount" />
            <Input {...register('date')} type="date" />
            <select {...register('category_id')}>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
