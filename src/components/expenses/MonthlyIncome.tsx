
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyIncome, updateMonthlyIncome } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface Props {
  year: number
  month: number
}

export const MonthlyIncome = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Local state for input values
  const [lucasInput, setLucasInput] = useState<string>('')
  const [camilaInput, setCamilaInput] = useState<string>('')
  const [otherInput, setOtherInput] = useState<string>('')
  
  const { data: income } = useQuery({
    queryKey: ['income', year, month],
    queryFn: async () => {
      const { data } = await getMonthlyIncome(year, month)
      return data
    },
    onSuccess: (data) => {
      // Initialize input fields with formatted values when data loads
      setLucasInput(data?.lucas_income ? formatCurrency(Number(data.lucas_income), 'USD').replace('$', '') : '')
      setCamilaInput(data?.camila_income ? formatCurrency(Number(data.camila_income), 'USD').replace('$', '') : '')
      setOtherInput(data?.other_income ? formatCurrency(Number(data.other_income), 'USD').replace('$', '') : '')
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

  // Format and save input when blurring or pressing Enter
  const handleSaveValue = (field: 'lucas_income' | 'camila_income' | 'other_income', value: string) => {
    // Remove any existing formatting (commas, currency symbols)
    const numericValue = parseFloat(value.replace(/[$,]/g, ''))
    
    if (!isNaN(numericValue)) {
      // Update the database with the numeric value
      updateIncome({ [field]: numericValue })
      
      // Format the display value
      const formattedValue = formatCurrency(numericValue, 'USD').replace('$', '')
      
      // Update the corresponding input field
      if (field === 'lucas_income') {
        setLucasInput(formattedValue)
      } else if (field === 'camila_income') {
        setCamilaInput(formattedValue)
      } else if (field === 'other_income') {
        setOtherInput(formattedValue)
      }
    }
  }

  // Handle key press to detect Enter key
  const handleKeyDown = (e: React.KeyboardEvent, field: 'lucas_income' | 'camila_income' | 'other_income', value: string) => {
    if (e.key === 'Enter') {
      handleSaveValue(field, value)
    }
  }

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
              type="text"
              placeholder="Lucas Income"
              value={lucasInput}
              onChange={e => setLucasInput(e.target.value)}
              onBlur={e => handleSaveValue('lucas_income', e.target.value)}
              onKeyDown={e => handleKeyDown(e, 'lucas_income', lucasInput)}
              className="text-right"
              prefix="$"
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Camila</FormLabel>
            <Input
              type="text"
              placeholder="Camila Income"
              value={camilaInput}
              onChange={e => setCamilaInput(e.target.value)}
              onBlur={e => handleSaveValue('camila_income', e.target.value)}
              onKeyDown={e => handleKeyDown(e, 'camila_income', camilaInput)}
              className="text-right"
              prefix="$"
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Others</FormLabel>
            <Input
              type="text"
              placeholder="Other Income"
              value={otherInput}
              onChange={e => setOtherInput(e.target.value)}
              onBlur={e => handleSaveValue('other_income', e.target.value)}
              onKeyDown={e => handleKeyDown(e, 'other_income', otherInput)}
              className="text-right"
              prefix="$"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
