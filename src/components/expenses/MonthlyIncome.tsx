import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"

interface Props {
  year: number
  month: number
}

export const MonthlyIncome = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const { data: income } = useQuery({
    queryKey: ['income', year, month],
    queryFn: async () => {
      const { data } = await getMonthlyIncome(year, month)
      return data
    }
  })

  const { mutate: updateIncome } = useMutation({
    mutationFn: async (values: { 
      lucas_income?: number
      camila_income?: number
      other_income?: number 
    }) => {
      await updateMonthlyIncome(year, month, values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] })
      toast({ description: "Income updated successfully" })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <FormLabel>Lucas</FormLabel>
            <Input
              type="number"
              placeholder="Lucas Income"
              value={income?.lucas_income || ''}
              onChange={e => updateIncome({ lucas_income: +e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Camila</FormLabel>
            <Input
              type="number"
              placeholder="Camila Income"
              value={income?.camila_income || ''}
              onChange={e => updateIncome({ camila_income: +e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Others</FormLabel>
            <Input
              type="number"
              placeholder="Other Income"
              value={income?.other_income || ''}
              onChange={e => updateIncome({ other_income: +e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
