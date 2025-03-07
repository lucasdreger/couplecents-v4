import { VariableExpense, Category, Investment, Reserve, Income } from '@/types/supabase';

export const createQueryKeys = {
  user: () => ['user'] as const,
  
  expenses: {
    all: () => ['expenses'] as const,
    byMonth: (year: number, month: number) => 
      ['expenses', 'month', year, month] as const,
    byCategory: (categoryId: string) => 
      ['expenses', 'category', categoryId] as const,
    detail: (id: string) => 
      ['expenses', 'detail', id] as const,
  },

  categories: {
    all: () => ['categories'] as const,
    detail: (id: string) => 
      ['categories', 'detail', id] as const,
    withExpenses: (categoryId: string) => 
      ['categories', 'with-expenses', categoryId] as const,
  },

  investments: {
    all: () => ['investments'] as const,
    detail: (id: string) => 
      ['investments', 'detail', id] as const,
    byCategory: (category: string) => 
      ['investments', 'category', category] as const,
  },

  reserves: {
    all: () => ['reserves'] as const,
    detail: (id: string) => 
      ['reserves', 'detail', id] as const,
  },

  income: {
    all: () => ['income'] as const,
    byMonth: (year: number, month: number) => 
      ['income', 'month', year, month] as const,
    byUser: (user: string) => 
      ['income', 'user', user] as const,
  },

  analytics: {
    monthly: (year: number) => 
      ['analytics', 'monthly', year] as const,
    categoryBreakdown: (year: number, month: number) => 
      ['analytics', 'category-breakdown', year, month] as const,
    investmentDistribution: () => 
      ['analytics', 'investment-distribution'] as const,
  }
} as const;

export type QueryKeys = typeof createQueryKeys;

// Type inference helpers
export type InferQueryKey<T> = T extends (...args: any[]) => infer R ? R : never;

// Query result type mapping
export interface QueryResults {
  expenses: VariableExpense[];
  categories: Category[];
  investments: Investment[];
  reserves: Reserve[];
  income: Income[];
}

// Type-safe query key generation
export function getQueryKey<T extends keyof QueryResults>(
  key: T,
  ...args: any[]
): string[] {
  return [key, ...args];
}

// Strongly typed query keys for react-query
export const QueryKeys = {
  expenses: {
    all: ['expenses'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...QueryKeys.expenses.all, { filters }] as const,
    detail: (id: string) => 
      [...QueryKeys.expenses.all, id] as const,
    stats: (period: string) => 
      [...QueryKeys.expenses.all, 'stats', period] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...QueryKeys.categories.all, { filters }] as const,
    detail: (id: string) => 
      [...QueryKeys.categories.all, id] as const,
  },
  investments: {
    all: ['investments'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...QueryKeys.investments.all, { filters }] as const,
    detail: (id: string) => 
      [...QueryKeys.investments.all, id] as const,
    performance: (period: string) => 
      [...QueryKeys.investments.all, 'performance', period] as const,
  },
  reserves: {
    all: ['reserves'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...QueryKeys.reserves.all, { filters }] as const,
    detail: (id: string) => 
      [...QueryKeys.reserves.all, id] as const,
    summary: () => 
      [...QueryKeys.reserves.all, 'summary'] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    preferences: ['user', 'preferences'] as const,
    notifications: ['user', 'notifications'] as const,
  },
} as const;

// Type helper for extracting query key types
export type QueryKeyType = typeof QueryKeys;
export type QueryKeyPath<T> = T extends readonly (string | object)[] ? T : never;

// Helper function to ensure type safety when invalidating queries
export function getQueryKey<T extends readonly unknown[]>(key: T): T {
  return key;
}