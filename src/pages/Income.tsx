import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Income = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const { data: income } = useQuery({
    queryKey: ['income', selectedMonth.getFullYear(), selectedMonth.getMonth() + 1],
    queryFn: async () => {
      const { data } = await getMonthlyIncome(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1
      )
      return data
    }
  })

  const { mutate: updateIncome } = useMutation({
    mutationFn: async (data: { lucas_income?: number; camila_income?: number; other_income?: number }) => {
      return await updateMonthlyIncome(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['income', selectedMonth.getFullYear(), selectedMonth.getMonth() + 1] 
      })
      toast({ description: "Income updated successfully" })
    },
    onError: () => {
      toast({ variant: "destructive", description: "Failed to update income" })
    }
  })

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monthly Income</h2>
          <p className="text-muted-foreground">
            Manage income for {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
          <CardDescription>Choose month and year to view or update income</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Select
            value={selectedMonth.getMonth().toString()}
            onValueChange={(value) => {
              const newDate = new Date(selectedMonth)
              newDate.setMonth(parseInt(value))
              setSelectedMonth(newDate)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Details</CardTitle>
          <CardDescription>Update monthly income values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lucas Income</label>
              <Input
                type="number"
                value={income?.lucas_income || ''}
                onChange={(e) => updateIncome({ lucas_income: parseFloat(e.target.value) })}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Camila Income</label>
              <Input
                type="number"
                value={income?.camila_income || ''}
                onChange={(e) => updateIncome({ camila_income: parseFloat(e.target.value) })}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Other Income</label>
              <Input
                type="number"
                value={income?.other_income || ''}
                onChange={(e) => updateIncome({ other_income: parseFloat(e.target.value) })}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold">Total Income: ${
              ((income?.lucas_income || 0) + 
               (income?.camila_income || 0) + 
               (income?.other_income || 0)).toFixed(2)
            }</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
