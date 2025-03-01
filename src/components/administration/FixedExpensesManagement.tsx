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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export const FixedExpensesManagement = () => {
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category_id: '',
    owner: 'Lucas',
    status_required: false,
    due_date: undefined as Date | undefined
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
          status_required: data.status_required,
          due_date: data.due_date
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
        status_required: false,
        due_date: undefined
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expense.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expense.due_date ? format(expense.due_date, "PPP") : "Select due date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expense.due_date}
                onSelect={(date) => setExpense(prev => ({ ...prev, due_date: date || undefined }))}
              />
            </PopoverContent>
          </Popover>
          
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
                {expense.due_date && (
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(expense.due_date), "PPP")}
                  </p>
                )}
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
