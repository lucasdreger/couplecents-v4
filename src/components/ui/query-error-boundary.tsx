import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@/lib/errors';

interface FallbackProps {
  error: AppError;
  resetErrorBoundary: () => void;
}

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  queryKeys?: string[];
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient();

  const handleReset = async () => {
    // Invalidate all queries to trigger a fresh fetch
    await queryClient.invalidateQueries();
    resetErrorBoundary();
  };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message}
      </AlertDescription>
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          size="sm"
        >
          Try again
        </Button>
      </div>
    </Alert>
  );
}

export function QueryErrorBoundary({ children, queryKeys }: QueryErrorBoundaryProps) {
  const queryClient = useQueryClient();

  const handleReset = async () => {
    if (queryKeys) {
      // Invalidate specific queries
      await Promise.all(
        queryKeys.map(key => queryClient.invalidateQueries({ queryKey: [key] }))
      );
    } else {
      // Invalidate all queries
      await queryClient.invalidateQueries();
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
      onError={(error) => {
        console.error('Query Error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}