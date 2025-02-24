import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { useHousehold } from '@/hooks/useHousehold'

export const DefaultIncomeManagement = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { household } = useHousehold()

  const { data: defaultIncome } = useQuery({
    queryKey: ['default-income', household?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('default_income')
        .select('*')
        .eq('household_id', household?.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!household
  })

  const { mutate: updateIncome } = useMutation({
    mutationFn: async (values: {
      lucas_income?: number;
      camila_income?: number;
      other_income?: number;
    }) => {
      const { error } = await supabase
        .from('default_income')
        .update({
          ...values,
          household_id: household?.id
        })
        .eq('id', defaultIncome?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-income'] })
      toast({ description: "Default income updated successfully" })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Income Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Input
            type="number"
            placeholder="Lucas Income"
            value={defaultIncome?.lucas_income || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value)) {
                updateIncome({ lucas_income: value })
              }
            }}
          />
          <Input
            type="number"
            placeholder="Camila Income"
            value={defaultIncome?.camila_income || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value)) {
                updateIncome({ camila_income: value })
              }
            }}
          />
          <Input
            type="number"
            placeholder="Other Income"
            value={defaultIncome?.other_income || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value)) {
                updateIncome({ other_income: value })
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
