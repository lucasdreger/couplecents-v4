import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppError, handleError } from '@/lib/errors';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorContextType {
  error: AppError | null;
  setError: (error: unknown) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: React.ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setErrorState] = useState<AppError | null>(null);

  const setError = useCallback((err: unknown) => {
    const appError = handleError(err);
    setErrorState(appError);

    // Show toast for non-critical errors
    if (appError.statusCode < 500) {
      toast.error(appError.message);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const contextValue = {
    error,
    setError,
    clearError,
    handleError: setError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {error?.statusCode >= 500 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}