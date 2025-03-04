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
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { supabase } from '@/lib/supabaseClient'

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>
  year: number
  month: number
}

interface ExpenseFormData {
  amount: number
  category_id: string
  description: string
  date: string
}

export const ExpenseForm = ({ onSubmit, year, month }: ExpenseFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [categoryId, setCategoryId] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string }>>([])

  React.useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (error) throw error
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const numericAmount = parseFloat(amount.replace(',', '.'))
      if (isNaN(numericAmount)) {
        throw new Error('Invalid amount')
      }

      const today = new Date()
      const expenseDate = new Date(year, month - 1, today.getDate())

      await onSubmit({
        amount: numericAmount,
        category_id: categoryId,
        description,
        date: expenseDate.toISOString()
      })

      setAmount('')
      setCategoryId('')
      setDescription('')

      toast({
        description: "Expense added successfully",
      })
    } catch (error) {
      toast({
        description: "Error adding expense",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '')
    setAmount(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-7"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !amount || !categoryId}>
              Add Expense
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
