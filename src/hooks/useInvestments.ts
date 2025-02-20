import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvestments, updateInvestment, addInvestmentHistory } from '@/lib/supabase'

export const useInvestments = () => {
  const queryClient = useQueryClient()
  const queryKey = ['investments']

  const { data: investments } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getInvestments()
      return data
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { investments, updateValue }
}
