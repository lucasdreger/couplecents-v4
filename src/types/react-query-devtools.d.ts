declare module '@tanstack/react-query-devtools' {
  export const ReactQueryDevtools: React.FC<{
    initialIsOpen?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
}
