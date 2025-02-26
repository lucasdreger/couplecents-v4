declare module 'react-error-boundary' {
  import { ComponentType, ReactNode } from 'react';

  export interface FallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
  }

  export interface ErrorBoundaryProps {
    children?: ReactNode;
    FallbackComponent: ComponentType<FallbackProps>;
    onReset?: () => void;
  }

  export const ErrorBoundary: ComponentType<ErrorBoundaryProps>;
}