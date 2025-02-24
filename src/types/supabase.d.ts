declare module '@supabase/supabase-js' {
  export interface User {
    id: string;
    email?: string;
  }

  export interface Session {
    user: User;
    access_token: string;
    refresh_token: string;
  }

  export interface AuthOptions {
    autoRefreshToken?: boolean;
    persistSession?: boolean;
    detectSessionInUrl?: boolean;
    flowType?: 'implicit' | 'pkce';
    storage?: {
      getItem(key: string): string | null;
      setItem(key: string, value: string): void;
      removeItem(key: string): void;
    };
  }

  export interface SupabaseClientOptions {
    auth?: AuthOptions;
    [key: string]: any;
  }

  export interface PostgrestResponse<T> {
    data: T | null;
    error: Error | null;
  }

  export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
    count: number | null;
  }

  export interface PostgrestFilterBuilder<T> {
    select(columns?: string): PostgrestFilterBuilder<T>;
    single(): Promise<PostgrestSingleResponse<T>>;
    eq(column: string, value: any): PostgrestFilterBuilder<T>;
    neq(column: string, value: any): PostgrestFilterBuilder<T>;
    gt(column: string, value: any): PostgrestFilterBuilder<T>;
    lt(column: string, value: any): PostgrestFilterBuilder<T>;
    gte(column: string, value: any): PostgrestFilterBuilder<T>;
    lte(column: string, value: any): PostgrestFilterBuilder<T>;
    like(column: string, pattern: string): PostgrestFilterBuilder<T>;
    ilike(column: string, pattern: string): PostgrestFilterBuilder<T>;
    is(column: string, value: any): PostgrestFilterBuilder<T>;
    in(column: string, values: any[]): PostgrestFilterBuilder<T>;
    contains(column: string, value: any): PostgrestFilterBuilder<T>;
    containedBy(column: string, value: any): PostgrestFilterBuilder<T>;
    range(column: string, from: any, to: any): PostgrestFilterBuilder<T>;
    textSearch(column: string, query: string): PostgrestFilterBuilder<T>;
    filter(column: string, operator: string, value: any): PostgrestFilterBuilder<T>;
    match(query: object): PostgrestFilterBuilder<T>;
    not(column: string, operator: string, value: any): PostgrestFilterBuilder<T>;
    or(query: string): PostgrestFilterBuilder<T>;
    order(column: string, options?: { ascending?: boolean }): PostgrestFilterBuilder<T>;
    limit(count: number): PostgrestFilterBuilder<T>;
    offset(count: number): PostgrestFilterBuilder<T>;
  }

  export interface SupabaseClient<T = any> {
    from<TableName extends keyof T>(table: TableName): PostgrestFilterBuilder<T[TableName]>;
    auth: {
      signInWithPassword(credentials: { email: string; password: string }): Promise<any>;
      signOut(): Promise<any>;
      onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void };
      getSession(): Promise<{ data: { session: Session | null }, error: Error | null }>;
    };
  }

  export function createClient<T = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions
  ): SupabaseClient<T>;
}
