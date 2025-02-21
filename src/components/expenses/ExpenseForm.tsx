
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
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (data) => {
          await onSubmit(data)
          reset()
        })} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input 
                {...register('description')} 
                placeholder="Description" 
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Input 
                {...register('amount')} 
                type="number" 
                step="0.01" 
                placeholder="Amount" 
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Input 
                {...register('date')} 
                type="date" 
                defaultValue={today}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Select {...register('category_id')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">Save Expense</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
