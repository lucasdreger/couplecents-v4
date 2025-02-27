import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"

export const DefaultIncomeManagement = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: defaultIncome } = useQuery({
    queryKey: ['default-income'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('default_income')
        .select('*')
        .single()
      if (error) throw error
      return data
    }
  })

  const { mutate: updateIncome } = useMutation({
    mutationFn: async (values: {
      lucas_income?: number;
      camila_income?: number;
      other_income?: number;
    }) => {
      // If no default income exists, create it
      if (!defaultIncome?.id) {
        const { error } = await supabase
          .from('default_income')
          .insert({
            ...values,
            lucas_income: values.lucas_income || 0,
            camila_income: values.camila_income || 0,
            other_income: values.other_income || 0
          })
        if (error) throw error
      } else {
        // Otherwise, update existing record
        const { error } = await supabase
          .from('default_income')
          .update(values)
          .eq('id', defaultIncome.id)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-income'] })
      toast({ description: "Default income updated successfully" })
    },
    onError: (error: Error) => {
      toast({ 
        description: "Failed to update default income: " + error.message,
        variant: "destructive"
      })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Income Settings</CardTitle>
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
