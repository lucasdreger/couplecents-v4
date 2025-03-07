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
import React, { useState, useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import type { VariableExpense } from '@/types/database.types'

// Form validation schema
const expenseFormSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0, "Amount must be positive"),
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
  const amountInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  // Format amount as currency with comma decimal separator (German format)
  const formatAmount = (value: number | null): string => {
    if (value === null || value === undefined) return '';
    return value.toFixed(2).replace('.', ',');
  };
  
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
      form.setValue('amount', formatAmount(expense.amount))
      form.setValue('date', new Date(expense.date).toISOString().split('T')[0])
      form.setValue('category_id', expense.category_id)
      
      // Auto-select the amount input field when editing
      setTimeout(() => {
        if (isEditing && amountInputRef.current) {
          amountInputRef.current.select();
        }
      }, 100);
    }
  }, [expense, form, isEditing])

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
        title: isEditing ? "Expense Updated" : "Expense Added",
        description: `Your expense has been successfully ${isEditing ? 'updated' : 'added'}.`,
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
        description: `Failed to ${isEditing ? 'update' : 'add'} expense. Please try again.`,
        variant: "destructive"
      });
      console.error(`Failed to ${isEditing ? 'update' : 'add'} expense:`, error);
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
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                    <Input 
                      type="number"
                      placeholder="0,00"
                      className="pl-7 text-right"
                      {...field}
                      ref={amountInputRef}
                    />
                  </div>
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
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                      <Input 
                        type="number"
                        placeholder="0,00"
                        className="pl-7 text-right"
                        {...field}
                      />
                    </div>
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
