import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome, getDefaultIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export const MonthlyIncome = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
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
    mutationFn: async (values: typeof income) => {
      await updateMonthlyIncome(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        values
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] })
      toast({ description: "Income updated successfully" })
    }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Monthly Income</h2>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="number"
              placeholder="Lucas Income"
              value={income?.lucas_income || ''}
              onChange={e => updateIncome({ ...income, lucas_income: +e.target.value })}
            />
            <Input
              type="number"
              placeholder="Camila Income"
              value={income?.camila_income || ''}
              onChange={e => updateIncome({ ...income, camila_income: +e.target.value })}
            />
            <Input
              type="number"
              placeholder="Other Income"
              value={income?.other_income || ''}
              onChange={e => updateIncome({ ...income, other_income: +e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
