import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { 
  getInvestments, 
  updateInvestment, 
  addInvestmentHistory 
} from '@/lib/supabase/queries'
import { queryKeys } from '@/lib/queries'

export const useInvestments = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: investments, isLoading } = useQuery({
    queryKey: queryKeys.investments(),
    queryFn: async () => {
      const { data, error } = await getInvestments()
      if (error) throw error
      return data || []
    }
  })

  const { mutate: updateValue } = useMutation({
    mutationFn: async ({ id, value, oldValue }: { id: string; value: number; oldValue: number }) => {
      // Update the investment value
      const { error: updateError } = await updateInvestment(id, value)
      if (updateError) throw updateError

      // Record the change in history if there's a user
      if (user?.id) {
        const { error: historyError } = await addInvestmentHistory(id, oldValue, value, user.id)
        if (historyError) throw historyError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() })
    }
  })

  return {
    investments,
    isLoading,
    updateValue
  }
}
