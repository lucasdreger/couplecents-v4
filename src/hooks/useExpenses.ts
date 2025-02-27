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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getMonthlyExpenses, 
  getFixedExpenses,
  getMonthlyIncome,
  addVariableExpense, 
  updateVariableExpense, 
  deleteVariableExpense,
  updateFixedExpenseStatus
} from '@/lib/supabase/queries'
import type { VariableExpense, FixedExpense, Income } from '@/types/database.types'
import { queryKeys } from '@/lib/queries'

export const useExpenses = (year: number, month: number) => {
  const queryClient = useQueryClient()

  // Fetch variable expenses for the specified month
  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: queryKeys.expenses(year, month),
    queryFn: async () => {
      const { data, error } = await getMonthlyExpenses(year, month)
      if (error) throw error
      return data || []
    }
  })

  // Fetch fixed expenses
  const { data: fixedExpenses, isLoading: loadingFixed } = useQuery({
    queryKey: queryKeys.fixedExpenses(),
    queryFn: async () => {
      const { data, error } = await getFixedExpenses(year, month)
      if (error) throw error
      return data || []
    }
  })

  // Fetch monthly income
  const { data: income, isLoading: loadingIncome } = useQuery({
    queryKey: queryKeys.income(year, month),
    queryFn: async () => {
      const { data, error } = await getMonthlyIncome(year, month)
      if (error) throw error
      return data || { lucas_income: 0, camila_income: 0, other_income: 0 }
    }
  })

  // Mutation for adding new expenses
  const { mutate: addExpense } = useMutation({
    mutationFn: addVariableExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(year, month) })
    }
  })

  // Mutation for updating expenses
  const { mutate: updateExpense } = useMutation({
    mutationFn: ({ id, expense }: { id: string; expense: Partial<VariableExpense> }) => 
      updateVariableExpense(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(year, month) })
    }
  })

  // Mutation for deleting expenses
  const { mutate: removeExpense } = useMutation({
    mutationFn: deleteVariableExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(year, month) })
    }
  })

  // Mutation for updating fixed expense status
  const { mutate: updateFixedStatus } = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateFixedExpenseStatus(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses() })
    }
  })

  return {
    expenses,
    fixedExpenses,
    income,
    isLoading: loadingExpenses || loadingFixed || loadingIncome,
    addExpense,
    updateExpense,
    removeExpense,
    updateFixedStatus
  }
}
