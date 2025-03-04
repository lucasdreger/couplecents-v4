import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"
import { formatCurrency } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface Props {
  year: number
  month: number
}

export const MonthlyIncome = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Local state for input values
  const [lucasMainInput, setLucasMainInput] = useState<string>('')
  const [lucasOtherInput, setLucasOtherInput] = useState<string>('')
  const [camilaMainInput, setCamilaMainInput] = useState<string>('')
  const [camilaOtherInput, setCamilaOtherInput] = useState<string>('')
  
  // References for auto-selection on focus
  const lucasMainRef = useRef<HTMLInputElement>(null);
  const lucasOtherRef = useRef<HTMLInputElement>(null);
  const camilaMainRef = useRef<HTMLInputElement>(null);
  const camilaOtherRef = useRef<HTMLInputElement>(null);
  
  const { data: income, isLoading } = useQuery({
    queryKey: ['income', year, month],
    queryFn: async () => {
      const { data } = await getMonthlyIncome(year, month)
      return data
    }
  })

  // Update local state when data changes or on initial load
  useEffect(() => {
    if (income) {
      // Format numbers with German locale (comma as decimal separator)
      setLucasMainInput(income.lucas_main_income ? income.lucas_main_income.toFixed(2).replace('.', ',') : '')
      setLucasOtherInput(income.lucas_other_income ? income.lucas_other_income.toFixed(2).replace('.', ',') : '')
      setCamilaMainInput(income.camila_main_income ? income.camila_main_income.toFixed(2).replace('.', ',') : '')
      setCamilaOtherInput(income.camila_other_income ? income.camila_other_income.toFixed(2).replace('.', ',') : '')
    }
  }, [income])

  // Auto-select all text on focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const { mutate: updateIncome } = useMutation({
    mutationFn: async (values: { 
      lucas_main_income?: number
      lucas_other_income?: number
      camila_main_income?: number
      camila_other_income?: number
    }) => {
      await updateMonthlyIncome(year, month, values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] })
      toast({ description: "Income updated successfully" })
    },
    onError: (error) => {
      console.error("Error updating income:", error)
      toast({ 
        description: "Failed to update income", 
        variant: "destructive" 
      })
    }
  })

  // Format and save input when blurring or pressing Enter
  const handleSaveValue = (field: 'lucas_main_income' | 'lucas_other_income' | 'camila_main_income' | 'camila_other_income', value: string) => {
    // Remove any existing formatting (commas, currency symbols)
    const sanitizedValue = value.replace(/[€\s]/g, '').replace(',', '.');
    const numericValue = parseFloat(sanitizedValue);
    
    if (!isNaN(numericValue)) {
      // Update the database with the numeric value
      updateIncome({ [field]: numericValue });
      
      // Format the display value with German locale
      const formattedValue = numericValue.toFixed(2).replace('.', ',');
      
      // Update the corresponding input field
      if (field === 'lucas_main_income') {
        setLucasMainInput(formattedValue);
      } else if (field === 'lucas_other_income') {
        setLucasOtherInput(formattedValue);
      } else if (field === 'camila_main_income') {
        setCamilaMainInput(formattedValue);
      } else if (field === 'camila_other_income') {
        setCamilaOtherInput(formattedValue);
      }
    }
  }

  // Handle key press to detect Enter key
  const handleKeyDown = (e: React.KeyboardEvent, field: 'lucas_main_income' | 'lucas_other_income' | 'camila_main_income' | 'camila_other_income', value: string) => {
    if (e.key === 'Enter') {
      handleSaveValue(field, value)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h3 className="font-medium text-lg">Income</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 animate-pulse bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex gap-4">
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 animate-pulse bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex gap-4">
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate totals
  const lucasTotal = (parseFloat(lucasMainInput.replace(',', '.')) || 0) + (parseFloat(lucasOtherInput.replace(',', '.')) || 0);
  const camilaTotal = (parseFloat(camilaMainInput.replace(',', '.')) || 0) + (parseFloat(camilaOtherInput.replace(',', '.')) || 0);
  const totalIncome = lucasTotal + camilaTotal;

  return (
    <div className="space-y-6">
      {/* Compact Income Layout */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Monthly Income</h3>
        
        {/* Grid Layout for Income Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lucas Section */}
          <div className="bg-card/50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Lucas's Income</h4>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                {lucasTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Main Income</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    ref={lucasMainRef}
                    type="text"
                    value={lucasMainInput}
                    onChange={(e) => setLucasMainInput(e.target.value)}
                    onBlur={(e) => handleSaveValue('lucas_main_income', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'lucas_main_income', e.currentTarget.value)}
                    onFocus={handleFocus}
                    className="pl-7 text-right text-sm h-9"
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Other Income</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    ref={lucasOtherRef}
                    type="text"
                    value={lucasOtherInput}
                    onChange={(e) => setLucasOtherInput(e.target.value)}
                    onBlur={(e) => handleSaveValue('lucas_other_income', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'lucas_other_income', e.currentTarget.value)}
                    onFocus={handleFocus}
                    className="pl-7 text-right text-sm h-9"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Camila Section */}
          <div className="bg-card/50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Camila's Income</h4>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                {camilaTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Main Income</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    ref={camilaMainRef}
                    type="text"
                    value={camilaMainInput}
                    onChange={(e) => setCamilaMainInput(e.target.value)}
                    onBlur={(e) => handleSaveValue('camila_main_income', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'camila_main_income', e.currentTarget.value)}
                    onFocus={handleFocus}
                    className="pl-7 text-right text-sm h-9"
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Other Income</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    ref={camilaOtherRef}
                    type="text"
                    value={camilaOtherInput}
                    onChange={(e) => setCamilaOtherInput(e.target.value)}
                    onBlur={(e) => handleSaveValue('camila_other_income', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'camila_other_income', e.currentTarget.value)}
                    onFocus={handleFocus}
                    className="pl-7 text-right text-sm h-9"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Monthly Income Summary */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Total Monthly Income</h3>
          <span className="text-lg font-bold text-primary">
            {totalIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>
    </div>
  )
}
