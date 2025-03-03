import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormLabel } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Props {
  year: number
  month: number
}

export const CreditCardBill = ({ year, month }: Props) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [amount, setAmount] = useState<string>('')
  const [transferCompleted, setTransferCompleted] = useState(false)
  const [transferAmount, setTransferAmount] = useState<number | null>(null)
  const [transferNeeded, setTransferNeeded] = useState(false)
  const [transferDate, setTransferDate] = useState<string | null>(null)
  
  // Get credit card bill data
  const { data: creditCardBill, isLoading: isCreditCardLoading } = useQuery({
    queryKey: ['credit-card-bill', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_credit_card')
        .select('*')
        .eq('year', year)
        .eq('month', month)
        .maybeSingle()
      
      if (error) throw error
      
      // If no record exists, create one with default values
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('monthly_credit_card')
          .insert({
            amount: 0,
            month,
            year,
            transfer_completed: false,
            notes: null
          })
          .select()
          .single()
        
        if (insertError) throw insertError
        return newData
      }
      
      return data
    }
  })
  
  // Get Lucas income and fixed expenses
  const { data: lucasFinancials, isLoading: isFinancialsLoading } = useQuery({
    queryKey: ['lucas-financials', year, month],
    queryFn: async () => {
      // Get Lucas income
      const { data: incomeData, error: incomeError } = await supabase
        .from('monthly_income')
        .select('lucas_main_income, lucas_other_income')
        .eq('year', year)
        .eq('month', month)
        .maybeSingle()
      
      if (incomeError) throw incomeError
      
      // Get Lucas fixed expenses
      const { data: fixedExpensesData, error: fixedExpensesError } = await supabase
        .from('fixed_expenses')
        .select('estimated_amount, owner')
        .eq('owner', 'Lucas')
      
      if (fixedExpensesError) throw fixedExpensesError
      
      return {
        income: incomeData ? {
          main: incomeData.lucas_main_income || 0,
          other: incomeData.lucas_other_income || 0
        } : { main: 0, other: 0 },
        fixedExpenses: fixedExpensesData || []
      }
    }
  })
  
  // Update credit card bill
  const { mutate: updateCreditCardBill } = useMutation({
    mutationFn: async (values: {
      amount?: number;
      transfer_completed?: boolean;
      transfer_completed_at?: string | null;
    }) => {
      const { error } = await supabase
        .from('monthly_credit_card')
        .update(values)
        .eq('id', creditCardBill?.id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-bill'] })
      toast({ description: "Credit card bill updated successfully" })
    },
    onError: (error: any) => {
      toast({ 
        description: "Failed to update credit card bill: " + error.message,
        variant: "destructive"
      })
    }
  })
  
  // Format number to string with comma as decimal separator
  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) return '0,00';
    return value.toFixed(2).replace('.', ',');
  };
  
  // Parse string value to number
  const parseValue = (value: string): number => {
    const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : Number(number.toFixed(2));
  };
  
  // Update local state when data changes
  useEffect(() => {
    if (creditCardBill) {
      setAmount(formatValue(creditCardBill.amount));
      setTransferCompleted(creditCardBill.transfer_completed || false);
      setTransferDate(creditCardBill.transfer_completed_at);
    }
  }, [creditCardBill]);
  
  // Calculate transfer amount when data changes
  useEffect(() => {
    if (creditCardBill && lucasFinancials) {
      // Calculate Lucas's total income
      const totalLucasIncome = Number(lucasFinancials.income.main || 0) + 
                               Number(lucasFinancials.income.other || 0);
      
      // Calculate Lucas's total fixed expenses
      const totalLucasFixedExpenses = lucasFinancials.fixedExpenses.reduce(
        (sum, expense) => sum + Number(expense.estimated_amount || 0), 0
      );
      
      // Parse bill amount
      const creditCardBillAmount = parseValue(amount);
      
      // Calculate remaining amount after fixed expenses and credit card bill
      // Note: Variable expenses are intentionally excluded from this calculation
      const remainingAfterExpenses = totalLucasIncome - totalLucasFixedExpenses - creditCardBillAmount;
      
      // Minimum Lucas should have left after all expenses
      const minimumThreshold = 300;
      
      // The transfer amount is whatever is needed to get Lucas back to the minimum
      if (remainingAfterExpenses < minimumThreshold) {
        setTransferNeeded(true);
        // We need to transfer enough to get back to the minimum threshold
        const neededTransfer = Math.ceil(minimumThreshold - remainingAfterExpenses);
        setTransferAmount(neededTransfer);
      } else {
        setTransferNeeded(false);
        setTransferAmount(null);
      }
      
      // Log the calculation for debugging
      console.log({
        lucasIncome: totalLucasIncome,
        lucasFixedExpenses: totalLucasFixedExpenses,
        creditCardBillAmount,
        remainingAfterExpenses,
        minimumThreshold,
        transferNeeded: remainingAfterExpenses < minimumThreshold,
        transferAmount: Math.ceil(minimumThreshold - remainingAfterExpenses)
      });
    }
  }, [creditCardBill, lucasFinancials, amount]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and comma
    const value = e.target.value.replace(/[^0-9,]/g, '');
    setAmount(value);
  }
  
  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format value on blur
    const numericValue = parseValue(e.target.value);
    
    // Update formatted value
    setAmount(formatValue(numericValue));
    
    // Save to database
    updateCreditCardBill({ amount: numericValue });
  }
  
  const handleTransferStatusChange = (checked: boolean) => {
    setTransferCompleted(checked)
    
    updateCreditCardBill({
      transfer_completed: checked,
      transfer_completed_at: checked ? new Date().toISOString() : null
    })
  }
  
  if (isCreditCardLoading || isFinancialsLoading) {
    return <div>Loading credit card bill data...</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="space-y-2">
          <FormLabel>Credit Card Bill Amount</FormLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              className="text-right pl-7"
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      {/* Always show transfer status */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="transfer-completed" 
          checked={transferCompleted}
          onCheckedChange={handleTransferStatusChange}
        />
        <label
          htmlFor="transfer-completed"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Credit card bill paid
        </label>
      </div>

      {/* Transfer messages */}
      {transferNeeded && transferAmount && !transferCompleted && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            Camila needs to transfer {transferAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} to Lucas.
          </AlertDescription>
        </Alert>
      )}
      
      {transferNeeded && transferAmount && transferCompleted && transferDate && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Transfer of {transferAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} done on {new Date(transferDate).toLocaleDateString('de-DE')}.
          </AlertDescription>
        </Alert>
      )}
      
      {!transferNeeded && !transferCompleted && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            No transfer needed for this month.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}