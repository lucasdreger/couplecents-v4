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
import { useHousehold } from '@/hooks/useHousehold'

export const FixedExpensesManagement = () => {
  const { household } = useHousehold()
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
    queryKey: ['categories', household?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('household_id', household?.id)
        .order('name')
      if (error) throw error
      return data
    },
    enabled: !!household
  })

  const { data: fixedExpenses } = useQuery({
    queryKey: ['fixed-expenses', household?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*, categories(*)')
        .eq('household_id', household?.id)
        .order('description')
      if (error) throw error
      return data
    },
    enabled: !!household
  })

  const { mutate: addExpense } = useMutation({
    mutationFn: async (data: typeof expense) => {
      const { error } = await supabase
        .from('fixed_expenses')
        .insert({
          ...data,
          household_id: household?.id,
          estimated_amount: parseFloat(data.estimated_amount)
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      setExpense({
        description: '',
        estimated_amount: '',
        category_id: '',
        owner: 'Lucas',
        status_required: false
      })
      toast({ description: "Fixed expense added successfully" })
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

          <Button onClick={() => addExpense(expense)}>Add Fixed Expense</Button>
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
