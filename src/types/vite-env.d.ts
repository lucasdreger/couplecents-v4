/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@tanstack/react-query' {
  interface QueryClient {
    resetQueries: (filters?: { queryKey?: Array<unknown>; type?: string; exact?: boolean }) => Promise<void>;
  }
}
