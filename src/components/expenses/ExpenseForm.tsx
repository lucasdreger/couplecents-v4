
/**
 * Expense Entry Form Component
 * 
 * Features:
 * - Modal-based expense entry
 * - Category selection with validation
 * - Rich form validation with error messages
 * - Automatic form reset after submission
 * - Type-safe form data handling
 * - Real-time category loading
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/lib/supabase'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as z from 'zod'
import type { VariableExpense } from '@/types/database.types'

// Form validation schema
const expenseFormSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required').transform(v => parseFloat(v)),
  date: z.string().min(1, 'Date is required'),
  category_id: z.string().min(1, 'Category is required'),
  year: z.number(),
  month: z.number()
})

type ExpenseFormData = Omit<VariableExpense, 'id' | 'created_at'>

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>
}

export const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    }
  })

  // Load categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await getCategories()
      return data
    }
  })

  const handleSubmit = async (values: z.infer<typeof expenseFormSchema>) => {
    const date = new Date(values.date)
    const data: ExpenseFormData = {
      ...values,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      amount: parseFloat(values.amount.toString())
    }
    await onSubmit(data)
    form.reset()
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Expense description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Expense</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
