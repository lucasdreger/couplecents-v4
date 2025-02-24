declare module '@tanstack/react-query' {
  import { ComponentType } from 'react';

  export interface QueryResult<T> {
    data?: T;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  }

  export interface MutationResult<T> {
    mutate: (variables: T) => Promise<void>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  }

  export interface QueryClient {
    invalidateQueries: (options: { queryKey: string[] }) => Promise<void>;
  }

  export function useQuery<T = unknown>(options: {
    queryKey: unknown[];
    queryFn: () => Promise<T>;
    enabled?: boolean;
    retry?: number;
  }): QueryResult<T>;

  export function useMutation<T = unknown>(options: {
    mutationFn: (variables: T) => Promise<void>;
    onSuccess?: () => void;
    onError?: () => void;
  }): { mutate: (variables: T) => void };

  export function useQueryClient(): QueryClient;

  export const QueryClientProvider: ComponentType<{
    client: QueryClient;
    children: React.ReactNode;
  }>;
}
