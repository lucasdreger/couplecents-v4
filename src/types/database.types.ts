
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface Category {
  id: string;
  name: string;
}

export interface VariableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
  category?: Category;
  year: number;
  month: number;
  created_at: string;
  household_id: string;
}

interface ExpenseStatus {
  completed: boolean;
  updated_at: string;
}

export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  owner: string;
  category_id: string;
  category?: Category;
  status?: ExpenseStatus;
  due_date: string;
  created_at: string;
  household_id: string;
}

export interface Income {
  id: string;
  year: number;
  month: number;
  lucas_income: number;
  camila_income: number;
  other_income: number;
  created_at: string;
  household_id: string;
}

export interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
  created_at: string;
  household_id: string;
}

export interface MonthlyDetail {
  id: string;
  year: number;
  month: number;
  planned_amount: number;
  actual_amount: number;
  created_at: string;
  household_id: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Category>;
      };
      variable_expenses: {
        Row: VariableExpense;
        Insert: Omit<VariableExpense, 'id' | 'created_at'>;
        Update: Partial<VariableExpense>;
      };
      fixed_expenses: {
        Row: FixedExpense;
        Insert: Omit<FixedExpense, 'id' | 'created_at'>;
        Update: Partial<FixedExpense>;
      };
      investments: {
        Row: Investment;
        Insert: Omit<Investment, 'id' | 'created_at'>;
        Update: Partial<Investment>;
      };
      monthly_details: {
        Row: MonthlyDetail;
        Insert: Omit<MonthlyDetail, 'id' | 'created_at'>;
        Update: Partial<MonthlyDetail>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
