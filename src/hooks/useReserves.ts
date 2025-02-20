
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useReserves = () => {
  const queryClient = useQueryClient()
  const queryKey = ['reserves']

  const { data: reserves, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log("Fetching reserves") // Debug log
      const { data, error } = await supabase
        .from('reserves')
        .select('*')
      
      if (error) {
        console.error("Error fetching reserves:", error) // Debug log
        throw error
      }
      
      console.log("Fetched reserves:", data) // Debug log
      return data
    }
  })

  const { mutate: updateValue } = useMutation({
    mutationFn: async ({ id, value, userId }: { id: string; value: number; userId: string }) => {
      // First add to history
      const { error: historyError } = await supabase
        .from('reserve_history')
        .insert({
          reserve_id: id,
          previous_value: reserves?.find(r => r.id === id)?.current_value || 0,
          new_value: value,
          updated_by: userId
        })

      if (historyError) throw historyError

      // Then update current value
      const { data, error } = await supabase
        .from('reserves')
        .update({ 
          current_value: value,
          last_updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { reserves, updateValue }
}
