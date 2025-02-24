import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useHousehold = () => {
  return useQuery({
    queryKey: ['household'],
    queryFn: async () => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Get the user's profile with household_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      return {
        userId: user.id,
        householdId: profile.household_id
      };
    }
  });
};

export default useHousehold;
