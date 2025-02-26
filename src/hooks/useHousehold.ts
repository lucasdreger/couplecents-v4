import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './useAuth'
import { useToast } from '@/components/ui/use-toast'

interface Household {
  id: string;
  name: string;
  created_at: string;
}

interface HouseholdMember {
  user_id: string;
  email: string;
  created_at: string;
}

export const useHousehold = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get user's household
  const { data: household, isLoading: isLoadingHousehold } = useQuery({
    queryKey: ['household', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      const { data, error } = await supabase
        .rpc('get_user_household', { user_id: user.id })
      if (error) {
        console.error('Error fetching household:', error)
        return null
      }
      
      return data && data.length > 0 ? data[0] as Household : null
    },
    enabled: !!user
  })

  // Get household members
  const { data: householdMembers, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['householdMembers', household?.id],
    queryFn: async () => {
      if (!household?.id) return []
      
      const { data, error } = await supabase
        .rpc('get_household_members', { p_household_id: household.id })
      
      if (error) {
        console.error('Error fetching household members:', error)
        return []
      }
      
      return data as HouseholdMember[]
    },
    enabled: !!household?.id
  })

  // Create household
  const { mutate: createHousehold } = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .rpc('get_or_create_household', { p_name: name, user_id: user?.id })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household', user?.id] })
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

  // Join household
  const { mutate: joinHousehold } = useMutation({
    mutationFn: async (householdId: string) => {
      const { error } = await supabase
        .rpc('join_household', { p_household_id: householdId, user_id: user?.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household', user?.id] })
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

  // Leave household
  const { mutate: leaveHousehold } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .rpc('leave_household', { user_id: user?.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household', user?.id] })
      toast({
        title: "Success",
        description: "Successfully left household",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join household",
        variant: "destructive",
      })
      console.error('Error leaving household:', error)
    }
  })

  return {
    household,
    isLoadingHousehold,
    householdMembers,
    isLoadingMembers,
    createHousehold,
    joinHousehold,
    leaveHousehold
  }
}
