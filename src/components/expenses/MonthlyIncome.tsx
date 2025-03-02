import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"
import { formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'

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
      // Use Euro currency format instead of USD
      setLucasMainInput(income.lucas_main_income ? income.lucas_main_income.toFixed(2) : '')
      setLucasOtherInput(income.lucas_other_income ? income.lucas_other_income.toFixed(2) : '')
      setCamilaMainInput(income.camila_main_income ? income.camila_main_income.toFixed(2) : '')
      setCamilaOtherInput(income.camila_other_income ? income.camila_other_income.toFixed(2) : '')
    }
  }, [income])

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
    const numericValue = parseFloat(value.replace(/[€,]/g, ''))
    
    if (!isNaN(numericValue)) {
      // Update the database with the numeric value
      updateIncome({ [field]: numericValue })
      
      // Format the display value - just show decimal places
      const formattedValue = numericValue.toFixed(2)
      
      // Update the corresponding input field
      if (field === 'lucas_main_income') {
        setLucasMainInput(formattedValue)
      } else if (field === 'lucas_other_income') {
        setLucasOtherInput(formattedValue)
      } else if (field === 'camila_main_income') {
        setCamilaMainInput(formattedValue)
      } else if (field === 'camila_other_income') {
        setCamilaOtherInput(formattedValue)
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-medium">Lucas</h3>
          <FormLabel>Main Income</FormLabel>
          <Input type="text" disabled placeholder="Loading..." />
          <FormLabel>Other Income</FormLabel>
          <Input type="text" disabled placeholder="Loading..." />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Camila</h3>
          <FormLabel>Main Income</FormLabel>
          <Input type="text" disabled placeholder="Loading..." />
          <FormLabel>Other Income</FormLabel>
          <Input type="text" disabled placeholder="Loading..." />
        </div>
      </div>
    )
  }

  // Calculate total monthly income
  const totalIncome = [
    parseFloat(lucasMainInput) || 0,
    parseFloat(lucasOtherInput) || 0,
    parseFloat(camilaMainInput) || 0,
    parseFloat(camilaOtherInput) || 0
  ].reduce((sum, val) => sum + val, 0);

  // Calculate Lucas total
  const lucasTotal = (parseFloat(lucasMainInput) || 0) + (parseFloat(lucasOtherInput) || 0);
  
  // Calculate Camila total
  const camilaTotal = (parseFloat(camilaMainInput) || 0) + (parseFloat(camilaOtherInput) || 0);

  return (
    <div className="space-y-6">
      {/* Lucas's Income */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Lucas's Income</h3>
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
            Total: {((parseFloat(lucasMainInput) || 0) + (parseFloat(lucasOtherInput) || 0)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <FormLabel>Main Income</FormLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                type="text"
                value={lucasMainInput}
                onChange={(e) => setLucasMainInput(e.target.value)}
                onBlur={(e) => handleSaveValue('lucas_main_income', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'lucas_main_income', e.currentTarget.value)}
                className="text-right pl-7"
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
                value={lucasOtherInput}
                onChange={(e) => setLucasOtherInput(e.target.value)}
                onBlur={(e) => handleSaveValue('lucas_other_income', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'lucas_other_income', e.currentTarget.value)}
                className="text-right pl-7"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Camila's Income */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Camila's Income</h3>
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
            Total: {((parseFloat(camilaMainInput) || 0) + (parseFloat(camilaOtherInput) || 0)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <FormLabel>Main Income</FormLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                type="text"
                value={camilaMainInput}
                onChange={(e) => setCamilaMainInput(e.target.value)}
                onBlur={(e) => handleSaveValue('camila_main_income', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'camila_main_income', e.currentTarget.value)}
                className="text-right pl-7"
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
                value={camilaOtherInput}
                onChange={(e) => setCamilaOtherInput(e.target.value)}
                onBlur={(e) => handleSaveValue('camila_other_income', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'camila_other_income', e.currentTarget.value)}
                className="text-right pl-7"
                placeholder="0,00"
              />
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
