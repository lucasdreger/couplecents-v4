export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
      }
      default_income: {
        Row: {
          camila_income: number
          created_at: string
          id: string
          lucas_income: number
          other_income: number
        }
        Insert: {
          camila_income?: number
          created_at?: string
          id?: string
          lucas_income?: number
          other_income?: number
        }
        Update: {
          camila_income?: number
          created_at?: string
          id?: string
          lucas_income?: number
          other_income?: number
        }
      }
      fixed_expenses: {
        Row: {
          category_id: string
          created_at: string
          description: string
          estimated_amount: number
          id: string
          owner: string
          status_required: boolean
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          estimated_amount: number
          id?: string
          owner: string
          status_required?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          estimated_amount?: number
          id?: string
          owner?: string
          status_required?: boolean
        }
      }
      investment_history: {
        Row: {
          created_at: string
          id: string
          investment_id: string
          new_value: number
          previous_value: number
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          investment_id: string
          new_value: number
          previous_value: number
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          investment_id?: string
          new_value?: number
          previous_value?: number
          updated_by?: string
        }
      }
      investments: {
        Row: {
          created_at: string
          current_value: number
          id: string
          last_updated: string
          name: string
          category: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name: string
          category: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name?: string
          category?: string
          notes?: string | null
        }
      }
      monthly_fixed_expense_status: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          fixed_expense_id: string
          id: string
          month: number
          year: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          fixed_expense_id: string
          id?: string
          month: number
          year: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          fixed_expense_id?: string
          id?: string
          month?: number
          year?: number
        }
      }
      monthly_income: {
        Row: {
          camila_income: number
          created_at: string
          id: string
          lucas_income: number
          month: number
          other_income: number
          year: number
        }
        Insert: {
          camila_income?: number
          created_at?: string
          id?: string
          lucas_income?: number
          month: number
          other_income?: number
          year: number
        }
        Update: {
          camila_income?: number
          created_at?: string
          id?: string
          lucas_income?: number
          month?: number
          other_income?: number
          year?: number
        }
      }
      variable_expenses: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          date: string
          description: string
          id: string
          month: number
          year: number
          created_by: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          date: string
          description: string
          id?: string
          month: number
          year: number
          created_by: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          month?: number
          year?: number
          created_by?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_default_income: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          lucas_income: number
          camila_income: number
          other_income: number
          last_updated: string
          created_at: string
        }[]
      }
      get_expenses: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: {
          id: string
          description: string
          amount: number
          date: string
          category_id: string
          month: number
          year: number
          created_at: string
          category_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
