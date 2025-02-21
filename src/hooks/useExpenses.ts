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
  deleteVariableExpense 
} from '@/lib/supabase/queries'
import type { VariableExpense, FixedExpense, Income } from '@/types/database.types'

export const useExpenses = (year: number, month: number) => {
  const queryClient = useQueryClient()

  // Create stable query keys for caching
  const variableExpensesKey = ['variable-expenses', year, month]
  const fixedExpensesKey = ['fixed-expenses', year, month]
  const incomeKey = ['income', year, month]

  // Fetch variable expenses for the specified month
  const { data: expenses } = useQuery({
    queryKey: variableExpensesKey,
    queryFn: async () => {
      const { data } = await getMonthlyExpenses(year, month)
      return data
    }
  })

  // Fetch fixed expenses
  const { data: fixedExpenses } = useQuery({
    queryKey: fixedExpensesKey,
    queryFn: async () => {
      const { data } = await getFixedExpenses(year, month)
      return data
    }
  })

  // Fetch monthly income
  const { data: income } = useQuery({
    queryKey: incomeKey,
    queryFn: async () => {
      const { data } = await getMonthlyIncome(year, month)
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableExpensesKey })
    }
  })

  // Mutation for updating expenses
  const { mutate: updateExpense } = useMutation({
    mutationFn: async ({ id, ...expense }: Partial<VariableExpense> & { id: string }) => {
      const { data, error } = await updateVariableExpense(id, expense)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableExpensesKey })
    }
  })

  // Mutation for deleting expenses
  const { mutate: deleteExpense } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteVariableExpense(id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableExpensesKey })
    }
  })

  return { 
    expenses, 
    fixedExpenses, 
    income, 
    addExpense, 
    updateExpense, 
    deleteExpense 
  }
}
