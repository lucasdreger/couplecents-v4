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
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, PlusCircle, CalendarIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries'
import { getCategories } from '@/lib/supabase'
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast"
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
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  year: number;
  month: number;
  expense?: VariableExpense | null;
  isEditing?: boolean;
}

export const ExpenseForm = ({ onSubmit, year, month, expense = null, isEditing = false }: ExpenseFormProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descriptionInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      year: year,
      month: month
    }
  });

  // Load categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await getCategories()
      return data
    }
  });

  // Set form data if we're editing an existing expense
  useEffect(() => {
    if (expense) {
      form.setValue('description', expense.description)
      form.setValue('amount', expense.amount)
      form.setValue('date', new Date(expense.date).toISOString().split('T')[0])
      form.setValue('category_id', expense.category_id)
    }
  }, [expense, form])

  const handleSubmit = async (values: ExpenseFormData, keepOpen: boolean) => {
    try {
      setIsSubmitting(true)
      
      // Ensure the date is extracted properly
      const date = new Date(values.date);
      
      // Create the expense object
      const expenseData = {
        ...values,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        amount: Number(values.amount)
      };
      
      // Submit the data
      await onSubmit(expenseData);
      
      // Show success message
      toast({
        title: "Expense Added",
        description: "Your expense has been successfully added.",
      });
      
      // Reset the form with the current date
      form.reset({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        year: year,
        month: month
      });
      
      if (keepOpen) {
        // Focus on the description field after form reset
        setTimeout(() => {
          if (descriptionInputRef.current) {
            descriptionInputRef.current.focus();
          }
        }, 0);
      } else {
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
      console.error("Failed to add expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're editing, just show the form directly
  if (isEditing) {
    return (
      <form onSubmit={form.handleSubmit((values) => handleSubmit(values, false))} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Expense</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Expense description" 
                    {...field} 
                    ref={descriptionInputRef}
                  />
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
                    prefix="$"
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
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isCategoriesLoading ? (
                      <SelectItem disabled value="loading">Loading...</SelectItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">No categories found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Expense'}
        </Button>
      </form>
    )
  }

  // Regular add expense dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Expense description" 
                      {...field} 
                      ref={descriptionInputRef}
                    />
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
                      prefix="$"
                      {...field} 
                    />
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isCategoriesLoading ? (
                        <SelectItem disabled value="loading">Loading...</SelectItem>
                      ) : categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="none">No categories found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
            <div className="flex space-x-2 pt-2">
              <Button 
                type="button" 
                onClick={form.handleSubmit((values) => handleSubmit(values, true))}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save and another"}
              </Button>
              <Button 
                type="button" 
                onClick={form.handleSubmit((values) => handleSubmit(values, false))}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save and close"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
