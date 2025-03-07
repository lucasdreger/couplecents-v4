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
  // Core financial data
  expenses: (year: number, month: number) => ['expenses', year, month],
  fixedExpenses: () => ['fixed-expenses'],
  income: (year: number, month: number) => ['income', year, month],
  investments: () => ['investments'],
  reserves: () => ['reserves'],
  
  // History tracking
  investmentHistory: (id: string) => ['investment-history', id],
  reserveHistory: (id: string) => ['reserve-history', id],
  
  // Administrative settings
  categories: () => ['categories'],
  defaultIncome: () => ['default-income'],
  
  // Analytics and summaries
  monthlyDetails: () => ['monthly-details'],
} as const;
