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

// Query key factory functions for React Query
export const queryKeys = {
  expenses: (year: number, month: number) => ['expenses', year, month],
  fixedExpenses: () => ['fixed-expenses'],
  income: (year: number, month: number) => ['income', year, month],
  investments: () => ['investments'],
  investmentHistory: (id: string) => ['investment-history', id],
  categories: () => ['categories'],
  defaultIncome: () => ['default-income'],
  reserves: () => ['reserves'],
  reserveHistory: (id: string) => ['reserve-history', id],
  monthlyDetails: () => ['monthly-details'],
} as const;
