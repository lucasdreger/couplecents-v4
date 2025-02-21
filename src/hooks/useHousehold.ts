import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './useAuth'

export const useHousehold = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: household, isLoading, error } = useQuery({
    queryKey: ['household', user?.id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('household_id')
        .eq('id', user?.id)
        .single()

      if (!profile?.household_id) return null

      const { data: household } = await supabase
        .from('households')
        .select('*')
        .eq('id', profile.household_id)
        .single()

      return household
    },
    enabled: !!user
  })

  const { mutate: createHousehold } = useMutation({
    mutationFn: async (name: string) => {
      // Create new household
      const { data: newHousehold, error: createError } = await supabase
        .from('households')
        .insert({ name })
        .select()
        .single()
      if (createError) throw createError

      // Update user profile with new household
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ household_id: newHousehold.id })
        .eq('id', user?.id)
      if (updateError) throw updateError

      return newHousehold
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] })
    }
  })

  return { household, isLoading, error, createHousehold }
}
