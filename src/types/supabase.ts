import { Database } from './database.types'
import { SupabaseClient, User } from '@supabase/supabase-js'

export type TypedSupabaseClient = SupabaseClient<Database>

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

export interface UserMetadata extends User {
  app_metadata: {
    provider?: string
    [key: string]: any
  }
  user_metadata: {
    avatar_url?: string
    email?: string
    email_verified?: boolean
    full_name?: string
    iss?: string
    name?: string
    preferred_username?: string
    provider_id?: string
    sub?: string
    [key: string]: any
  }
  aud: string
}

export type Category = Tables<'categories'>
export type VariableExpense = Tables<'variable_expenses'>
export type FixedExpense = Tables<'fixed_expenses'>
export type Income = Tables<'income'>
export type Investment = Tables<'investments'>
export type Reserve = Tables<'reserves'>

// Query response types
export type CategoryResponse = Category & {
  expenses?: VariableExpense[]
}

export type ExpenseWithCategory = VariableExpense & {
  category: Category
}

// Insert and update types
export type InsertCategory = Database['public']['Tables']['categories']['Insert']
export type UpdateCategory = Database['public']['Tables']['categories']['Update']

export type InsertExpense = Database['public']['Tables']['variable_expenses']['Insert']
export type UpdateExpense = Database['public']['Tables']['variable_expenses']['Update']

export type InsertIncome = Database['public']['Tables']['income']['Insert']
export type UpdateIncome = Database['public']['Tables']['income']['Update']

export type InsertInvestment = Database['public']['Tables']['investments']['Insert']
export type UpdateInvestment = Database['public']['Tables']['investments']['Update']

export type InsertReserve = Database['public']['Tables']['reserves']['Insert']
export type UpdateReserve = Database['public']['Tables']['reserves']['Update']

// View types
export type MonthlySummary = Database['public']['Views']['monthly_summary']['Row']

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      investments: {
        Row: {
          id: string
          name: string
          current_value: number
          last_updated: string
          created_at: string
          category: string
        }
        Insert: Omit<Database['public']['Tables']['investments']['Row'], 'id' | 'created_at' | 'last_updated'>
        Update: Partial<Database['public']['Tables']['investments']['Insert']>
      }
    }
  }
}
