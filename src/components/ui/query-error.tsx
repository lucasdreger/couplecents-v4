import React from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Button } from './button'
import { useQueryClient } from '@tanstack/react-query'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient()

  const handleReset = () => {
    queryClient.clear()
    resetErrorBoundary()
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <p className="text-destructive font-medium">Something went wrong!</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={handleReset} variant="outline">
        Try Again
      </Button>
    </div>
  )
}

type QueryErrorBoundaryProps = {
  children: JSX.Element | JSX.Element[];
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  )
}