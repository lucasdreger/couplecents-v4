
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
      // Add other tables as needed
    }
  }
}
