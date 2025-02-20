/**
 * Expenses Management Hook
 * 
 * Provides a clean interface for:
 * - Fetching monthly expenses
 * - Adding new expenses
 * - Automatic cache invalidation
 * - Type-safe expense mutations
 * 
 * Usage:
 * const { expenses, addExpense } = useExpenses(2024, 3);
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyExpenses, addVariableExpense, updateVariableExpense, deleteVariableExpense } from '@/lib/supabase'
import type { VariableExpense } from '@/types/database.types'

export const useExpenses = (year: number, month: number) => {
  const queryClient = useQueryClient()
  // Create a stable query key for caching
  const queryKey = ['expenses', year, month]

  // Fetch expenses for the specified month
  const { data: expenses } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getMonthlyExpenses(year, month)
      return data
    }
  })

  // Mutation for adding new expenses
  const { mutate: addExpense } = useMutation({
    mutationFn: (expense: Omit<VariableExpense, 'id' | 'created_at'>) =>
      addVariableExpense(expense),
    // Invalidate and refetch expenses after adding new one
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { expenses, addExpense }
}
