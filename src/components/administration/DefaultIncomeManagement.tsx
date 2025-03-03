import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"
import { useState } from 'react'

type DefaultIncomeField = 'lucas_main_income' | 'lucas_other_income' | 'camila_main_income' | 'camila_other_income'

export const DefaultIncomeManagement = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formValues, setFormValues] = useState({
    lucas_main_income: '',
    lucas_other_income: '',
    camila_main_income: '',
    camila_other_income: ''
  })
  
  const { data: defaultIncome, isLoading } = useQuery({
    queryKey: ['default-income'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('default_income')
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data) {
        // Format values when data is loaded
        setFormValues({
          lucas_main_income: formatValue(data.lucas_main_income),
          lucas_other_income: formatValue(data.lucas_other_income),
          camila_main_income: formatValue(data.camila_main_income),
          camila_other_income: formatValue(data.camila_other_income)
        })
      }
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
  
  // Format number to string with comma as decimal separator and two decimal places
  const formatValue = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0,00';
    return value.toFixed(2).replace('.', ',');
  };
  
  // Parse string value to number, handling comma as decimal separator
  const parseValue = (value: string): number => {
    // Remove currency symbol, spaces, and replace comma with dot
    const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : Number(number.toFixed(2));
  };
  
  const handleInputChange = (field: DefaultIncomeField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the form values
    setFormValues(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  
  const handleInputBlur = (field: DefaultIncomeField) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseValue(value);
    
    // Format to always show two decimal places with comma
    const formattedValue = formatValue(numericValue);
    
    // Update both the form value and the database
    setFormValues(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    updateIncome({
      ...defaultIncome,
      [field]: numericValue
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Default Income Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Loading income settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
                  value={formValues.lucas_main_income}
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
                  value={formValues.lucas_other_income}
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
                  value={formValues.camila_main_income}
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
                  value={formValues.camila_other_income}
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
