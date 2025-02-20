import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReserves, updateReserve, addReserveHistory } from '@/lib/supabase'

export const useReserves = () => {
  const queryClient = useQueryClient()
  const queryKey = ['reserves']

  const { data: reserves } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getReserves()
      return data
    }
  })

  const { mutate: updateValue } = useMutation({
    mutationFn: async ({ id, value, userId }: { id: string; value: number; userId: string }) => {
      const reserve = reserves?.find(r => r.id === id)
      if (reserve) {
        await addReserveHistory(id, reserve.current_value, value, userId)
        await updateReserve(id, value)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { reserves, updateValue }
}
