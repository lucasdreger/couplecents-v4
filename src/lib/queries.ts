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
  expenses: (year: number, month: number) => ['expenses', year, month] as const,
  categories: () => ['categories'] as const,
  investments: () => ['investments'] as const,
  reserves: () => ['reserves'] as const,
  income: (year: number, month: number) => ['income', year, month] as const,
  monthlyAnalytics: (year: number) => ['monthlyAnalytics', year] as const,
  fixedExpenses: () => ['fixedExpenses'] as const,
  defaultIncome: () => ['defaultIncome'] as const,
  user: () => ['user'] as const,
  profile: (userId: string) => ['profile', userId] as const,
} as const;

export type QueryKeys = typeof queryKeys;
export type QueryKeyType<T extends keyof QueryKeys> = ReturnType<QueryKeys[T]>;
