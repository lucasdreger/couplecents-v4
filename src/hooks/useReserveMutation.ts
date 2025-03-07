import { useOptimisticMutation } from './use-optimistic-mutation';
import { supabase } from '@/lib/supabaseClient';
import { type Reserve } from '@/types/supabase';
import { queryKeys } from '@/lib/queries';

interface UpdateReserveVariables {
  id: string;
  amount: number;
  userId?: string;
}

export function useReserveMutation() {
  return useOptimisticMutation<Reserve, UpdateReserveVariables>({
    mutationFn: async ({ id, amount }) => {
      const { data, error } = await supabase
        .from('reserves')
        .update({ amount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, amount }) => {
      // Get the current data
      const queryKey = queryKeys.reserves.all();
      const previousReserves = await queryClient.getQueryData<Reserve[]>(queryKey) ?? [];

      // Update the cache optimistically
      const updatedReserves = previousReserves.map(reserve =>
        reserve.id === id ? { ...reserve, amount } : reserve
      );

      // Return the previous data so we can revert if something goes wrong
      return updatedReserves;
    },
    invalidateQueries: ['reserves'],
  });
}