import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"

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
      lucas_main_income?: number;
      lucas_other_income?: number;
      camila_main_income?: number;
      camila_other_income?: number;
    }) => {
      // If no default income exists, create it
      if (!defaultIncome?.id) {
        const { error } = await supabase
          .from('default_income')
          .insert({
            ...values,
            lucas_main_income: values.lucas_main_income || 0,
            lucas_other_income: values.lucas_other_income || 0,
            camila_main_income: values.camila_main_income || 0,
            camila_other_income: values.camila_other_income || 0
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
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium">Lucas</h3>
            <div className="space-y-2">
              <FormLabel>Main Income</FormLabel>
              <Input
                type="number"
                placeholder="Main Income Lucas"
                value={defaultIncome?.lucas_main_income || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    updateIncome({ lucas_main_income: value })
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Other Income</FormLabel>
              <Input
                type="number"
                placeholder="Other Income Lucas"
                value={defaultIncome?.lucas_other_income || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    updateIncome({ lucas_other_income: value })
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Camila</h3>
            <div className="space-y-2">
              <FormLabel>Main Income</FormLabel>
              <Input
                type="number"
                placeholder="Main Income Camila"
                value={defaultIncome?.camila_main_income || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    updateIncome({ camila_main_income: value })
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Other Income</FormLabel>
              <Input
                type="number"
                placeholder="Other Income Camila"
                value={defaultIncome?.camila_other_income || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    updateIncome({ camila_other_income: value })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
