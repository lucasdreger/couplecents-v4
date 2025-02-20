import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    }
  })

  return {
    user: session?.user,
    isAuthenticated: !!session,
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut()
  }
}
