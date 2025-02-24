declare module '@tanstack/react-query' {
  export type QueryKey = readonly unknown[];

  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: {
        retry?: number | boolean;
        retryDelay?: (attemptIndex: number) => number;
        staleTime?: number;
        cacheTime?: number;
        refetchOnMount?: boolean | "always";
        refetchOnWindowFocus?: boolean | "always";
        refetchOnReconnect?: boolean | "always";
      };
    };
  }

  export class QueryClient {
    constructor(config?: QueryClientConfig);
    resetQueries: (filters?: { queryKey?: QueryKey; type?: string; exact?: boolean }) => Promise<void>;
    invalidateQueries: (filters?: { queryKey?: QueryKey; exact?: boolean }) => Promise<void>;
    setQueryData: <T>(queryKey: QueryKey, updater: T | ((oldData: T | undefined) => T)) => void;
    getQueryData: <T>(queryKey: QueryKey) => T | undefined;
  }

  export interface UseQueryOptions<TData> {
    queryKey: QueryKey;
    queryFn: () => Promise<TData>;
    enabled?: boolean;
    retry?: number | boolean;
    retryDelay?: (attemptIndex: number) => number;
    staleTime?: number;
    cacheTime?: number;
    refetchOnMount?: boolean | "always";
    refetchOnWindowFocus?: boolean | "always";
    refetchOnReconnect?: boolean | "always";
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  }

  export interface UseQueryResult<TData> {
    data?: TData;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<UseQueryResult<TData>>;
  }

  export function useQuery<TData>(options: UseQueryOptions<TData>): UseQueryResult<TData>;
  export function useQueryClient(): QueryClient;

  export interface QueryClientProviderProps {
    client: QueryClient;
    children?: React.ReactNode;
  }

  export const QueryClientProvider: React.FC<QueryClientProviderProps>;

  export interface MutationOptions<TData = unknown, TVariables = unknown> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }

  export interface MutationResult<TData, TVariables> {
    data?: TData;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    mutate: (variables: TVariables) => Promise<TData>;
  }

  export function useMutation<TData, TVariables>(
    options: MutationOptions<TData, TVariables>
  ): MutationResult<TData, TVariables>;
}
