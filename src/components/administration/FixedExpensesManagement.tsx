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
    amount: '',
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
  
  const { mutate: addExpense, isPending } = useMutation({
    mutationFn: async (data: typeof expense) => {
      // Make sure the amount is properly converted to a number
      const numericAmount = parseFloat(data.amount);
      if (isNaN(numericAmount)) {
        throw new Error("Amount must be a valid number");
      }
      
      const { error, data: insertedData } = await supabase
        .from('fixed_expenses')
        .insert({
          description: data.description,
          estimated_amount: numericAmount, // Use the correct column name
          category_id: data.category_id,
          owner: data.owner,
          status_required: data.status_required
        })
        .select()
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      return insertedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
      setExpense({
        description: '',
        amount: '',
        category_id: '',
        owner: 'Lucas',
        status_required: false
      })
      toast({ description: "Fixed expense added successfully" })
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({ 
        description: "Failed to add fixed expense: " + error.message,
        variant: "destructive"
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(expense);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixed Expenses Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input 
            placeholder="Description"
            value={expense.description}
            onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
            required
          />
          
          <Input 
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
          
          <Select 
            value={expense.category_id}
            onValueChange={(value) => setExpense(prev => ({ ...prev, category_id: value }))}
            required
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
            type="submit"
            disabled={!expense.description || !expense.amount || !expense.category_id || isPending}
          >
            {isPending ? 'Adding...' : 'Add Fixed Expense'}
          </Button>
        </form>
        
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
