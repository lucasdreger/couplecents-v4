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
          household_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          household_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          household_id?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      default_income: {
        Row: {
          camila_income: number
          camila_main_income: number | null
          camila_other_income: number | null
          created_at: string
          household_id: string | null
          id: string
          last_updated: string
          lucas_income: number
          lucas_main_income: number | null
          lucas_other_income: number | null
          other_income: number
        }
        Insert: {
          camila_income?: number
          camila_main_income?: number | null
          camila_other_income?: number | null
          created_at?: string
          household_id?: string | null
          id?: string
          last_updated?: string
          lucas_income?: number
          lucas_main_income?: number | null
          lucas_other_income?: number | null
          other_income?: number
        }
        Update: {
          camila_income?: number
          camila_main_income?: number | null
          camila_other_income?: number | null
          created_at?: string
          household_id?: string | null
          id?: string
          last_updated?: string
          lucas_income?: number
          lucas_main_income?: number | null
          lucas_other_income?: number | null
          other_income?: number
        }
        Relationships: []
      }
      fixed_expenses: {
        Row: {
          category_id: string
          created_at: string
          description: string
          estimated_amount: number
          household_id: string | null
          id: string
          owner: string
          status_required: boolean
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          estimated_amount: number
          household_id?: string | null
          id?: string
          owner: string
          status_required?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          estimated_amount?: number
          household_id?: string | null
          id?: string
          owner?: string
          status_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fixed_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "investment_history_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          category: string
          created_at: string
          current_value: number
          id: string
          last_updated: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name?: string
        }
        Relationships: []
      }
      monthly_credit_card: {
        Row: {
          amount: number
          created_at: string
          id: string
          month: number
          notes: string | null
          transfer_completed: boolean | null
          transfer_completed_at: string | null
          year: number
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          month: number
          notes?: string | null
          transfer_completed?: boolean | null
          transfer_completed_at?: string | null
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          month?: number
          notes?: string | null
          transfer_completed?: boolean | null
          transfer_completed_at?: string | null
          year?: number
        }
        Relationships: []
      }
      monthly_details: {
        Row: {
          actual_amount: number | null
          created_at: string
          id: string
          month: number
          planned_amount: number | null
          total_expenses: number | null
          total_income: number | null
          year: number
        }
        Insert: {
          actual_amount?: number | null
          created_at?: string
          id?: string
          month: number
          planned_amount?: number | null
          total_expenses?: number | null
          total_income?: number | null
          year?: number
        }
        Update: {
          actual_amount?: number | null
          created_at?: string
          id?: string
          month?: number
          planned_amount?: number | null
          total_expenses?: number | null
          total_income?: number | null
          year?: number
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "monthly_fixed_expense_status_fixed_expense_id_fkey"
            columns: ["fixed_expense_id"]
            isOneToOne: false
            referencedRelation: "fixed_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_income: {
        Row: {
          camila_income: number
          camila_main_income: number | null
          camila_other_income: number | null
          created_at: string
          id: string
          lucas_income: number
          lucas_main_income: number | null
          lucas_other_income: number | null
          month: number
          other_income: number
          year: number
        }
        Insert: {
          camila_income?: number
          camila_main_income?: number | null
          camila_other_income?: number | null
          created_at?: string
          id?: string
          lucas_income?: number
          lucas_main_income?: number | null
          lucas_other_income?: number | null
          month: number
          other_income?: number
          year: number
        }
        Update: {
          camila_income?: number
          camila_main_income?: number | null
          camila_other_income?: number | null
          created_at?: string
          id?: string
          lucas_income?: number
          lucas_main_income?: number | null
          lucas_other_income?: number | null
          month?: number
          other_income?: number
          year?: number
        }
        Relationships: []
      }
      reserve_history: {
        Row: {
          created_at: string
          id: string
          new_value: number
          previous_value: number
          reserve_id: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_value: number
          previous_value: number
          reserve_id: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          new_value?: number
          previous_value?: number
          reserve_id?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "reserve_history_reserve_id_fkey"
            columns: ["reserve_id"]
            isOneToOne: false
            referencedRelation: "reserves"
            referencedColumns: ["id"]
          },
        ]
      }
      reserves: {
        Row: {
          category: string
          created_at: string
          current_value: number
          id: string
          last_updated: string
          name: string
          target_value: number | null
        }
        Insert: {
          category: string
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name: string
          target_value?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name?: string
          target_value?: number | null
        }
        Relationships: []
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
        }
        Relationships: [
          {
            foreignKeyName: "variable_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      get_household_members: {
        Args: {
          p_household_id: string
        }
        Returns: {
          user_id: string
          email: string
          created_at: string
        }[]
      }
      get_investments: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          current_value: number
          created_at: string
          last_updated: string
        }[]
      }
      get_or_create_default_income: {
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
      get_or_create_household: {
        Args: {
          p_name: string
        }
        Returns: string
      }
      get_or_create_monthly_credit_card: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: {
          id: string
          year: number
          month: number
          amount: number
          created_at: string
        }[]
      }
      get_or_create_monthly_fixed_expense_status: {
        Args: {
          p_year: number
          p_month: number
          p_fixed_expense_id: string
        }
        Returns: {
          id: string
          year: number
          month: number
          fixed_expense_id: string
          completed: boolean
          completed_at: string
          created_at: string
        }[]
      }
      get_or_create_monthly_income: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: {
          id: string
          year: number
          month: number
          lucas_income: number
          camila_income: number
          other_income: number
          created_at: string
        }[]
      }
      initialize_monthly_fixed_expenses: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: undefined
      }
      join_household:
        | {
            Args: {
              p_household_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_household_id: string
              user_id: string
            }
            Returns: undefined
          }
      leave_household:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              user_id: string
            }
            Returns: undefined
          }
      load_default_income: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: undefined
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
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
