import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import type { AppError } from '@/lib/errors';

interface UseFormSubmitOptions<TData> {
  onSubmit: (data: TData) => void | Promise<void>;
  onSuccess?: () => void;
  onError?: (error: AppError | Error) => void;
  successMessage?: string;
  errorMessage?: string | ((error: AppError | Error) => string);
}

interface FormSubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: AppError | Error | null;
}

type SubmitHandler<TData> = (data: TData) => Promise<void>;

export function useFormSubmit<TData>({
  onSubmit,
  onSuccess,
  onError,
  successMessage = 'Successfully saved',
  errorMessage = 'An error occurred'
}: UseFormSubmitOptions<TData>) {
  const [state, setState] = useState<FormSubmitState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });
  
  const toast = useToast();

  const handleSubmit: SubmitHandler<TData> = useCallback(
    async (data: TData) => {
      setState({
        isSubmitting: true,
        isSuccess: false,
        error: null
      });

      try {
        await onSubmit(data);
        
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true
        }));

        if (successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.();
      } catch (error) {
        const err = error as AppError | Error;
        
        setState({
          isSubmitting: false,
          isSuccess: false,
          error: err
        });

        const message = typeof errorMessage === 'function'
          ? errorMessage(err)
          : errorMessage;

        toast.error(err, { description: message });
        onError?.(err);
      }
    },
    [onSubmit, onSuccess, onError, successMessage, errorMessage, toast]
  );

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null
    });
  }, []);

  return {
    ...state,
    submit: handleSubmit,
    reset
  };
}

// Helper function to handle backend validation errors
export function isValidationError(error: unknown): error is AppError {
  return (
    error instanceof Error &&
    'code' in error &&
    error.code === 'VALIDATION_ERROR' &&
    'fieldErrors' in error
  );
}

// Helper function to create a form error handler
export function createFormErrorHandler(setError: (field: string, message: string) => void) {
  return (error: AppError | Error) => {
    if (isValidationError(error) && 'fieldErrors' in error) {
      Object.entries(error.fieldErrors).forEach(([field, message]) => {
        setError(field, message as string);
      });
    }
  };
}