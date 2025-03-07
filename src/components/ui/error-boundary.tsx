import React from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './alert';
import { Button } from './button';
import type { AppError } from '@/lib/errors';

interface FallbackProps {
  error: AppError | Error;
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
  resetKeys?: Array<unknown>;
  fallbackComponent?: React.ComponentType<FallbackProps>;
}

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isAppError = 'code' in error;
  const errorMessage = isAppError ? error.message : 'An unexpected error occurred';
  const errorCode = isAppError ? error.code : 'UNKNOWN_ERROR';

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error {errorCode}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{errorMessage}</p>
        <Button
          variant="outline"
          onClick={resetErrorBoundary}
          className="w-fit"
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function ErrorBoundaryWrapper({
  children,
  onError,
  resetKeys,
  fallbackComponent: FallbackComponent = DefaultFallback,
}: ErrorBoundaryProps) {
  const { ErrorBoundary } = useErrorBoundary();

  return (
    <ErrorBoundary
      onError={onError}
      resetKeys={resetKeys}
      FallbackComponent={FallbackComponent}
    >
      {children}
    </ErrorBoundary>
  );
}

interface AsyncBoundaryProps extends ErrorBoundaryProps {
  suspenseFallback?: React.ReactNode;
}

export function AsyncBoundary({
  children,
  suspenseFallback,
  ...errorBoundaryProps
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundaryWrapper {...errorBoundaryProps}>
      <React.Suspense fallback={suspenseFallback}>
        {children}
      </React.Suspense>
    </ErrorBoundaryWrapper>
  );
}