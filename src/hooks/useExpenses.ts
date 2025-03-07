/**
 * Expenses Management Hook
 * 
 * Provides a clean interface for:
 * - Fetching monthly expenses (variable and fixed)
 * - Fetching monthly income
 * - Adding/updating/deleting expenses
 * - Automatic cache invalidation
 * - Type-safe expense mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation';
import { selectFrom, insertInto, updateIn, deleteFrom } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type VariableExpense = Database['public']['Tables']['variable_expenses']['Row'];
type ExpenseInsert = Database['public']['Tables']['variable_expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['variable_expenses']['Update'];

interface UseExpensesOptions {
  year: number;
  month: number;
  enabled?: boolean;
}

export function useExpenses({ year, month, enabled = true }: UseExpensesOptions) {
  return useQuery({
    queryKey: QueryKeys.expenses.list({ year, month }),
    queryFn: () => selectFrom('variable_expenses', {
      filters: { year, month },
      orderBy: { column: 'date', ascending: false }
    }),
    enabled
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: QueryKeys.expenses.detail(id),
    queryFn: () => selectFrom('variable_expenses', {
      filters: { id }
    }).then(data => data[0]),
    enabled: !!id
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<VariableExpense[], ExpenseInsert>({
    mutationFn: (data) => insertInto('variable_expenses', data),
    queryKey: QueryKeys.expenses.all,
    updateFn: (old = [], newExpense) => {
      return [...old, { ...newExpense, id: 'temp-id' } as VariableExpense];
    },
    successMessage: 'Expense added successfully',
    errorMessage: (error) => `Failed to add expense: ${error.message}`
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<VariableExpense, { id: string } & ExpenseUpdate>({
    mutationFn: ({ id, ...data }) => updateIn('variable_expenses', id, data),
    queryKey: QueryKeys.expenses.all,
    updateFn: (old = [], { id, ...update }) => {
      return old.map(expense =>
        expense.id === id
          ? { ...expense, ...update }
          : expense
      );
    },
    successMessage: 'Expense updated successfully',
    errorMessage: (error) => `Failed to update expense: ${error.message}`
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, string>({
    mutationFn: deleteFrom,
    queryKey: QueryKeys.expenses.all,
    updateFn: (old = [], id) => {
      return old.filter(expense => expense.id !== id);
    },
    successMessage: 'Expense deleted successfully',
    errorMessage: (error) => `Failed to delete expense: ${error.message}`
  });
}

export function useExpenseStats({ year, month }: { year: number; month: number }) {
  return useQuery({
    queryKey: QueryKeys.expenses.stats(`${year}-${month}`),
    queryFn: () => fetch(`/api/expenses/stats?year=${year}&month=${month}`).then(res => res.json()),
    select: (data) => ({
      totalExpenses: data.total,
      averageExpense: data.average,
      categoryBreakdown: data.byCategory,
      dailyExpenses: data.byDay
    })
  });
}
