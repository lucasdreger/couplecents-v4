import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvestments, updateInvestment, addInvestmentHistory } from '@/lib/supabase/queries'
import type { Investment } from '@/types/database.types'

export const useInvestments = () => {
  const queryClient = useQueryClient()
  const queryKey = ['investments']

  const { data: investments, isLoading } = useQuery<Investment[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await getInvestments()
      if (error) throw error
      return data || []
    }
  })

  const { mutate: updateValue } = useMutation({
    mutationFn: async ({ id, value, userId }: { id: string; value: number; userId: string }) => {
      const investment = investments?.find(i => i.id === id)
      if (investment) {
        await addInvestmentHistory(id, investment.current_value, value, userId)
        await updateInvestment(id, value)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error('Failed to update investment:', error)
    }
  })

  return { investments: investments || [], isLoading, updateValue }
}
