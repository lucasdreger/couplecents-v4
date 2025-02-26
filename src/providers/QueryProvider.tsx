import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { QueryErrorBoundary } from '@/components/ui/query-error'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Don't retry failed queries
      suspense: true, // Enable suspense mode
      useErrorBoundary: true, // Use error boundary for failed queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
})

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryErrorBoundary>
  )
}
