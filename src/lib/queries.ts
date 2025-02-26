import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
})

// Query keys as constants to avoid typos
export const queryKeys = {
  session: ['session'] as const,
  household: (userId?: string) => ['household', userId] as const,
  investments: ['investments'] as const,
  expenses: (year: number, month: number) => ['expenses', year, month] as const,
  income: (year: number, month: number) => ['income', year, month] as const,
  categories: (householdId?: string) => ['categories', householdId] as const,
  fixedExpenses: (householdId?: string) => ['fixed-expenses', householdId] as const,
  defaultIncome: (householdId?: string) => ['default-income', householdId] as const,
}
