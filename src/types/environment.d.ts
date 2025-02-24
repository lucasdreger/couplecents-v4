/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend the NodeJS namespace
declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv {}
}

// Extend Vite's client types
declare module 'vite/client' {
  interface ImportMetaEnv extends ImportMetaEnv {}
}

// Extend the window object
interface Window {
  env: ImportMetaEnv;
}
