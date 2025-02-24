import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryBoundaryState {
  hasError: boolean;
}

class QueryBoundary extends React.Component<{ children: React.ReactNode }, QueryBoundaryState> {
  public state = { hasError: false };

  public static getDerivedStateFromError(): QueryBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    console.error('React Query error:', error);
  }

  public override render(): React.ReactElement {
    if (this.state.hasError) {
      return React.createElement('div', 
        { className: "flex items-center justify-center min-h-screen" },
        React.createElement('div',
          { className: "text-center" },
          [
            React.createElement('h2',
              { className: "text-lg font-semibold", key: 'title' },
              'Something went wrong'
            ),
            React.createElement('p',
              { className: "text-muted-foreground", key: 'message' },
              'Please try refreshing the page'
            )
          ]
        )
      );
    }

    return React.createElement(React.Fragment, null, this.props.children);
  }
}

// Create query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps): React.ReactElement {
  return React.createElement(QueryBoundary, null,
    React.createElement(QueryClientProvider, { client: queryClient },
      [
        children,
        import.meta.env.MODE === 'development' && React.createElement(ReactQueryDevtools)
      ]
    )
  );
}
