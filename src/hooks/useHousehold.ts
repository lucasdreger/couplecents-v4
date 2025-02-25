
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './useAuth'
import { useToast } from '@/components/ui/use-toast'

interface Household {
  id: string;
  name: string;
  created_at: string;
}

export const useHousehold = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: household, isLoading: isLoadingHousehold } = useQuery({
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

      return household as Household | null
    },
    enabled: !!user
  })

  const { mutate: createHousehold } = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .rpc('get_or_create_household', { p_name: name })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] })
      toast({
        title: "Success",
        description: "Household created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create household",
        variant: "destructive",
      })
      console.error('Error creating household:', error)
    }
  })

  const { mutate: joinHousehold } = useMutation({
    mutationFn: async (householdId: string) => {
      const { error } = await supabase
        .rpc('join_household', { p_household_id: householdId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] })
      toast({
        title: "Success",
        description: "Successfully joined household",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join household",
        variant: "destructive",
      })
      console.error('Error joining household:', error)
    }
  })

  const { mutate: leaveHousehold } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ household_id: null })
        .eq('id', user?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] })
      toast({
        title: "Success",
        description: "Successfully left household",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to leave household",
        variant: "destructive",
      })
      console.error('Error leaving household:', error)
    }
  })

  return {
    household,
    isLoadingHousehold,
    createHousehold,
    joinHousehold,
    leaveHousehold
  }
}
