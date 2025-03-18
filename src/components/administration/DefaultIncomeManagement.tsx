
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"

// Define the type for default income fields
type DefaultIncomeField = 'lucas_main_income' | 'lucas_other_income' | 'camila_main_income' | 'camila_other_income';

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

  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) return '';
    return value.toFixed(2).replace('.', ',');
  };

  const parseValue = (value: string): number => {
    // Remove currency symbol and any spaces
    const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
  };

  const handleInputChange = (field: DefaultIncomeField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty field or valid input pattern with comma as decimal separator
    if (value === '' || /^[0-9]*,?[0-9]*$/.test(value)) {
      // Only update the database on blur to avoid too many updates
      // Just update the visual state for now
      e.target.value = value;
    }
  };

  const handleInputBlur = (field: DefaultIncomeField) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseValue(value);

    // Update the field with numeric value
    updateIncome({
      ...defaultIncome,
      [field]: numericValue
    });

    // Format to always show two decimal places
    e.target.value = formatValue(numericValue);
  };

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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="text"
                  defaultValue={formatValue(defaultIncome?.lucas_main_income)}
                  onChange={handleInputChange('lucas_main_income')}
                  onBlur={handleInputBlur('lucas_main_income')}
                  className="pl-7 text-right"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>Other Income</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="text"
                  defaultValue={formatValue(defaultIncome?.lucas_other_income)}
                  onChange={handleInputChange('lucas_other_income')}
                  onBlur={handleInputBlur('lucas_other_income')}
                  className="pl-7 text-right"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Camila</h3>
            <div className="space-y-2">
              <FormLabel>Main Income</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="text"
                  defaultValue={formatValue(defaultIncome?.camila_main_income)}
                  onChange={handleInputChange('camila_main_income')}
                  onBlur={handleInputBlur('camila_main_income')}
                  className="pl-7 text-right"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>Other Income</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="text"
                  defaultValue={formatValue(defaultIncome?.camila_other_income)}
                  onChange={handleInputChange('camila_other_income')}
                  onBlur={handleInputBlur('camila_other_income')}
                  className="pl-7 text-right"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
