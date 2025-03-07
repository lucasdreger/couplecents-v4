import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation';
import { selectFrom, insertInto, updateIn, deleteFrom } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Reserve = Database['public']['Tables']['reserves']['Row'];
type ReserveInsert = Database['public']['Tables']['reserves']['Insert'];
type ReserveUpdate = Database['public']['Tables']['reserves']['Update'];

interface UseReservesOptions {
  enabled?: boolean;
  orderBy?: {
    field: keyof Reserve;
    ascending?: boolean;
  };
}

export function useReserves({ enabled = true, orderBy }: UseReservesOptions = {}) {
  return useQuery({
    queryKey: QueryKeys.reserves.list({ orderBy }),
    queryFn: () => selectFrom('reserves', {
      orderBy: orderBy
        ? { column: orderBy.field, ascending: orderBy.ascending ?? true }
        : { column: 'priority', ascending: true }
    }),
    enabled
  });
}

export function useReserve(id: string) {
  return useQuery({
    queryKey: QueryKeys.reserves.detail(id),
    queryFn: () => selectFrom('reserves', {
      filters: { id }
    }).then(data => data[0]),
    enabled: !!id
  });
}

export function useCreateReserve() {
  return useOptimisticMutation<Reserve[], ReserveInsert>({
    mutationFn: (data) => insertInto('reserves', data),
    queryKey: QueryKeys.reserves.all,
    updateFn: (old = [], newReserve) => {
      return [...old, { ...newReserve, id: 'temp-id' } as Reserve];
    },
    successMessage: 'Reserve fund created successfully',
    errorMessage: (error) => `Failed to create reserve fund: ${error.message}`
  });
}

export function useUpdateReserve() {
  return useOptimisticMutation<Reserve, { id: string } & ReserveUpdate>({
    mutationFn: ({ id, ...data }) => updateIn('reserves', id, data),
    queryKey: QueryKeys.reserves.all,
    updateFn: (old = [], { id, ...update }) => {
      return old.map(reserve =>
        reserve.id === id
          ? { ...reserve, ...update }
          : reserve
      );
    },
    successMessage: 'Reserve fund updated successfully',
    errorMessage: (error) => `Failed to update reserve fund: ${error.message}`
  });
}

export function useDeleteReserve() {
  return useOptimisticMutation<void, string>({
    mutationFn: (id) => deleteFrom('reserves', id),
    queryKey: QueryKeys.reserves.all,
    updateFn: (old = [], id) => {
      return old.filter(reserve => reserve.id !== id);
    },
    successMessage: 'Reserve fund deleted successfully',
    errorMessage: (error) => `Failed to delete reserve fund: ${error.message}`
  });
}

export function useReserveSummary() {
  return useQuery({
    queryKey: QueryKeys.reserves.summary(),
    queryFn: () => selectFrom('reserves').then(reserves => {
      const total = reserves.reduce((sum, reserve) => sum + reserve.current_amount, 0);
      const target = reserves.reduce((sum, reserve) => sum + reserve.target_amount, 0);
      const progress = target > 0 ? (total / target) * 100 : 0;

      return {
        totalAmount: total,
        targetAmount: target,
        progress,
        count: reserves.length,
        byPriority: reserves.reduce((acc, reserve) => {
          const priority = reserve.priority;
          if (!acc[priority]) {
            acc[priority] = {
              count: 0,
              total: 0,
              target: 0
            };
          }
          acc[priority].count++;
          acc[priority].total += reserve.current_amount;
          acc[priority].target += reserve.target_amount;
          return acc;
        }, {} as Record<number, { count: number; total: number; target: number }>)
      };
    })
  });
}
