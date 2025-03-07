import { useOptimisticMutation } from './use-optimistic-mutation';
import { supabase } from '@/lib/supabaseClient';
import { type Investment } from '@/types/supabase';
import { queryKeys } from '@/lib/queries';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateInvestmentVariables {
  id: string;
  value: number;
  oldValue: number;
}

export function useInvestmentMutation() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<Investment, UpdateInvestmentVariables>({
    mutationFn: async ({ id, value }) => {
      const { data, error } = await supabase
        .from('investments')
        .update({ 
          amount: value,
          last_updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, value, oldValue }) => {
      // Calculate percentage change
      const changePercentage = ((value - oldValue) / oldValue) * 100;

      // Get the current data
      const queryKey = queryKeys.investments.all();
      const previousInvestments = await queryClient.getQueryData<Investment[]>(queryKey) ?? [];

      // Update the cache optimistically
      const updatedInvestments = previousInvestments.map(investment =>
        investment.id === id
          ? {
              ...investment,
              amount: value,
              last_updated: new Date().toISOString(),
              change_percentage: changePercentage
            }
          : investment
      );

      // Return the previous data so we can revert if something goes wrong
      return updatedInvestments;
    },
    invalidateQueries: ['investments'],
  });
}