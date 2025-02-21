
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
 * const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(2024, 3);
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMonthlyExpenses, addVariableExpense, updateVariableExpense, deleteVariableExpense } from '@/lib/supabase'
import type { VariableExpense } from '@/types/database.types'

export const useExpenses = (year: number, month: number) => {
  const queryClient = useQueryClient()
  // Create a stable query key for caching
  const queryKey = ['expenses', year, month]

  // Fetch expenses for the specified month
  const { data: expenses, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getMonthlyExpenses(year, month)
      return data
    }
  })

  // Mutation for adding new expenses
  const { mutate: addExpense } = useMutation({
    mutationFn: async (expense: Omit<VariableExpense, 'id' | 'created_at'>) => {
      const { data, error } = await addVariableExpense(expense)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  // Mutation for updating expenses
  const { mutate: updateExpense } = useMutation({
    mutationFn: async ({ id, ...expense }: Partial<VariableExpense> & { id: string }) => {
      const { data, error } = await updateVariableExpense(id, expense)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  // Mutation for deleting expenses
  const { mutate: deleteExpense } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteVariableExpense(id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  return { expenses, isLoading, addExpense, updateExpense, deleteExpense }
}
