import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation';
import { selectFrom, insertInto, updateIn, deleteFrom } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Investment = Database['public']['Tables']['investments']['Row'];
type InvestmentInsert = Database['public']['Tables']['investments']['Insert'];
type InvestmentUpdate = Database['public']['Tables']['investments']['Update'];
type InvestmentHistory = Database['public']['Tables']['investment_history']['Row'];

interface UseInvestmentsOptions {
  type?: Investment['type'];
  enabled?: boolean;
}

export function useInvestments({ type, enabled = true }: UseInvestmentsOptions = {}) {
  return useQuery({
    queryKey: QueryKeys.investments.list({ type }),
    queryFn: () => selectFrom('investments', {
      filters: type ? { type } : undefined,
      orderBy: { column: 'name', ascending: true }
    }),
    enabled
  });
}

export function useInvestment(id: string) {
  return useQuery({
    queryKey: QueryKeys.investments.detail(id),
    queryFn: () => selectFrom('investments', {
      filters: { id }
    }).then(data => data[0]),
    enabled: !!id
  });
}

export function useInvestmentHistory(investmentId: string) {
  return useQuery({
    queryKey: ['investment-history', investmentId],
    queryFn: () => selectFrom('investment_history', {
      filters: { investment_id: investmentId },
      orderBy: { column: 'created_at', ascending: false }
    }),
    enabled: !!investmentId
  });
}

export function useCreateInvestment() {
  return useOptimisticMutation<Investment[], InvestmentInsert>({
    mutationFn: (data) => insertInto('investments', data),
    queryKey: QueryKeys.investments.all,
    updateFn: (old = [], newInvestment) => {
      return [...old, { ...newInvestment, id: 'temp-id' } as Investment];
    },
    successMessage: 'Investment added successfully',
    errorMessage: (error) => `Failed to add investment: ${error.message}`
  });
}

export function useUpdateInvestment() {
  return useOptimisticMutation<Investment, { id: string } & InvestmentUpdate>({
    mutationFn: async ({ id, ...data }) => {
      const previousValue = (await selectFrom('investments', { filters: { id } }))[0]?.current_value;
      const result = await updateIn('investments', id, data);
      
      // If the current_value has changed, log it in history
      if (data.current_value && data.current_value !== previousValue) {
        await insertInto('investment_history', {
          investment_id: id,
          previous_value: previousValue,
          new_value: data.current_value,
          updated_by: data.user_id
        });
      }
      
      return result;
    },
    queryKey: QueryKeys.investments.all,
    updateFn: (old = [], { id, ...update }) => {
      return old.map(investment =>
        investment.id === id
          ? { ...investment, ...update }
          : investment
      );
    },
    successMessage: 'Investment updated successfully',
    errorMessage: (error) => `Failed to update investment: ${error.message}`
  });
}

export function useDeleteInvestment() {
  return useOptimisticMutation<void, string>({
    mutationFn: (id) => deleteFrom('investments', id),
    queryKey: QueryKeys.investments.all,
    updateFn: (old = [], id) => {
      return old.filter(investment => investment.id !== id);
    },
    successMessage: 'Investment deleted successfully',
    errorMessage: (error) => `Failed to delete investment: ${error.message}`
  });
}

export function useInvestmentPerformance(period: string) {
  return useQuery({
    queryKey: QueryKeys.investments.performance(period),
    queryFn: () => fetch(`/api/investments/performance?period=${period}`).then(res => res.json()),
    select: (data) => ({
      totalValue: data.totalValue,
      totalGain: data.totalGain,
      percentageGain: data.percentageGain,
      byType: data.byType,
      timeline: data.timeline
    })
  });
}
