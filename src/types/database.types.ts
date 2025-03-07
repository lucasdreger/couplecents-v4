export interface VariableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
  year: number;
  month: number;
  created_at: string;
  created_by: string;
  updated_at: string | null;
}

export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  status_required: boolean;
  owner: string;
  created_at: string;
  updated_at: string | null;
}

export interface Income {
  id: string;
  year: number;
  month: number;
  lucas_income: number;
  camila_income: number;
  other_income: number;
  created_at: string;
  updated_at: string | null;
}

export interface Investment {
  id: string;
  name: string;
  current_value: number;
  initial_value: number;
  category: string;
  created_at: string;
  last_updated: string | null;
  notes: string | null;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  date: string;
  category_id: string;
  year: number;
  month: number;
}

export interface MonthlyDetail {
  id: string;
  year: number;
  month: number;
  planned_amount: number;
  actual_amount: number;
  created_at: string;
}

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
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
      default_income: {
        Row: {
          id: string
          lucas_income: number
          camila_income: number
          other_income: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          lucas_income: number
          camila_income: number
          other_income: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          lucas_income?: number
          camila_income?: number
          other_income?: number
          updated_at?: string | null
        }
      }
      financial_goals: {
        Row: {
          id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string | null
          created_at: string
          updated_at: string | null
          category_id: string | null
          notes: string | null
          completed: boolean
          completed_at: string | null
          linked_reserve_id: string | null
          linked_investment_id: string | null
        }
        Insert: {
          id?: string
          name: string
          target_amount: number
          current_amount?: number
          target_date?: string | null
          created_at?: string
          updated_at?: string | null
          category_id?: string | null
          notes?: string | null
          completed?: boolean
          completed_at?: string | null
          linked_reserve_id?: string | null
          linked_investment_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string | null
          created_at?: string
          updated_at?: string | null
          category_id?: string | null
          notes?: string | null
          completed?: boolean
          completed_at?: string | null
          linked_reserve_id?: string | null
          linked_investment_id?: string | null
        }
      }
      fixed_expenses: {
        Row: {
          id: string
          description: string
          amount: number
          category_id: string
          status_required: boolean
          owner: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          description: string
          amount: number
          category_id: string
          status_required?: boolean
          owner: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          category_id?: string
          status_required?: boolean
          owner?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      households: {
        Row: {
          id: string
          name: string
          created_at: string
          created_by: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          created_by: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          created_by?: string
          updated_at?: string | null
        }
      }
      investment_history: {
        Row: {
          id: string
          investment_id: string
          previous_value: number
          new_value: number
          created_at: string
          updated_by: string
        }
        Insert: {
          id?: string
          investment_id: string
          previous_value: number
          new_value: number
          created_at?: string
          updated_by: string
        }
        Update: {
          id?: string
          investment_id?: string
          previous_value?: number
          new_value?: number
          created_at?: string
          updated_by?: string
        }
      }
      investments: {
        Row: {
          id: string
          name: string
          current_value: number
          initial_value: number
          category: string
          created_at: string
          last_updated: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          current_value: number
          initial_value: number
          category: string
          created_at?: string
          last_updated?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          current_value?: number
          initial_value?: number
          category?: string
          created_at?: string
          last_updated?: string | null
          notes?: string | null
        }
      }
      monthly_credit_card: {
        Row: {
          id: string
          amount: number
          month: number
          year: number
          created_at: string
          updated_at: string | null
          transfer_completed: boolean
          transfer_completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          amount: number
          month: number
          year: number
          created_at?: string
          updated_at?: string | null
          transfer_completed?: boolean
          transfer_completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          amount?: number
          month?: number
          year?: number
          created_at?: string
          updated_at?: string | null
          transfer_completed?: boolean
          transfer_completed_at?: string | null
          notes?: string | null
        }
      }
      monthly_fixed_expense_status: {
        Row: {
          id: string
          fixed_expense_id: string
          month: number
          year: number
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          fixed_expense_id: string
          month: number
          year: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          fixed_expense_id?: string
          month?: number
          year?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      monthly_income: {
        Row: {
          id: string
          lucas_income: number
          camila_income: number
          other_income: number
          month: number
          year: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          lucas_income: number
          camila_income: number
          other_income: number
          month: number
          year: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          lucas_income?: number
          camila_income?: number
          other_income?: number
          month?: number
          year?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      reserves: {
        Row: {
          id: string
          name: string
          current_amount: number
          target_amount: number | null
          created_at: string
          updated_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          current_amount: number
          target_amount?: number | null
          created_at?: string
          updated_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          current_amount?: number
          target_amount?: number | null
          created_at?: string
          updated_at?: string | null
          notes?: string | null
        }
      }
      reserve_history: {
        Row: {
          id: string
          reserve_id: string
          previous_amount: number
          new_amount: number
          created_at: string
          updated_by: string
          notes: string | null
        }
        Insert: {
          id?: string
          reserve_id: string
          previous_amount: number
          new_amount: number
          created_at?: string
          updated_by: string
          notes?: string | null
        }
        Update: {
          id?: string
          reserve_id?: string
          previous_amount?: number
          new_amount?: number
          created_at?: string
          updated_by?: string
          notes?: string | null
        }
      }
      user_households: {
        Row: {
          id: string
          user_id: string
          role: string
          joined_at: string
          invited_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          joined_at?: string
          invited_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          joined_at?: string
          invited_by?: string | null
        }
      }
      variable_expenses: {
        Row: {
          id: string
          description: string
          amount: number
          date: string
          category_id: string
          month: number
          year: number
          created_at: string
          created_by: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          description: string
          amount: number
          date: string
          category_id: string
          month: number
          year: number
          created_at?: string
          created_by: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          date?: string
          category_id?: string
          month?: number
          year?: number
          created_at?: string
          created_by?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
