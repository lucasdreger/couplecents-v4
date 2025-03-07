import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: readonly unknown[];
  updateFn: (oldData: TData | undefined, newVariables: TVariables) => TData;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: (error: Error) => string;
  rollbackOnError?: boolean;
}

export function useOptimisticMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  updateFn,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  rollbackOnError = true,
}: OptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const options: UseMutationOptions<TData, Error, TVariables> = {
    onMutate: async (newVariables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => 
        updateFn(old, newVariables)
      );

      return { previousData };
    },

    onSuccess: async (data, variables) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      if (onSuccess) {
        await onSuccess(data, variables);
      }
    },

    onError: async (error: Error, variables, context: any) => {
      if (rollbackOnError) {
        // Rollback to the previous value if there's an error
        queryClient.setQueryData(queryKey, context?.previousData);
      }

      const message = errorMessage 
        ? errorMessage(error) 
        : error.message || 'An error occurred';
      
      toast.error(message);

      if (onError) {
        await onError(error, variables);
      }
    },

    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey });
    },
  };

  return useMutation({
    mutationFn,
    ...options,
  });
}