import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { queryKeys } from '@/lib/queries'

export const FixedExpensesManagement = () => {
  const [expense, setExpense] = useState({
    description: '',
    estimated_amount: '',
    category_id: '',
    owner: 'Lucas',
    status_required: false
  })
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    }
  })

  const { data: fixedExpenses } = useQuery({
    queryKey: queryKeys.fixedExpenses(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*, categories(*)')
        .order('description')
      if (error) throw error
      return data
    }
  })

  const { mutate: addExpense } = useMutation({
    mutationFn: async (data: typeof expense) => {
      const { error } = await supabase
        .from('fixed_expenses')
        .insert({
          ...data,
          estimated_amount: parseFloat(data.estimated_amount)
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
      setExpense({
        description: '',
        estimated_amount: '',
        category_id: '',
        owner: 'Lucas',
        status_required: false
      })
      toast({ description: "Fixed expense added successfully" })
    },
    onError: (error: Error) => {
      toast({ 
        description: "Failed to add fixed expense: " + error.message,
        variant: "destructive"
      })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixed Expenses Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <Input 
            placeholder="Description"
            value={expense.description}
            onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <Input 
            type="number"
            placeholder="Estimated Amount"
            value={expense.estimated_amount}
            onChange={(e) => setExpense(prev => ({ ...prev, estimated_amount: e.target.value }))}
          />
          
          <Select 
            value={expense.category_id}
            onValueChange={(value) => setExpense(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={expense.owner}
            onValueChange={(value) => setExpense(prev => ({ ...prev, owner: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lucas">Lucas</SelectItem>
              <SelectItem value="Camila">Camila</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch 
              id="status-required"
              checked={expense.status_required}
              onCheckedChange={(checked) => 
                setExpense(prev => ({ ...prev, status_required: checked }))
              }
            />
            <Label htmlFor="status-required">Status Required</Label>
          </div>
          <Button 
            onClick={() => addExpense(expense)}
            disabled={!expense.description || !expense.estimated_amount || !expense.category_id}
          >
            Add Fixed Expense
          </Button>
        </div>
        <div className="space-y-2">
          {fixedExpenses?.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center p-3 rounded border">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  ${expense.estimated_amount} • {expense.categories?.name} • {expense.owner}
                </p>
              </div>
              {expense.status_required && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Status Required
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
