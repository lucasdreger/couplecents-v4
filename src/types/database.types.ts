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
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          budget: number | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Categories['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Categories['Row'], 'id'>>;
      };
      variable_expenses: {
        Row: {
          id: string;
          description: string;
          amount: number;
          date: string;
          category_id: string;
          user_id: string;
          year: number;
          month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<VariableExpenses['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VariableExpenses['Row'], 'id'>>;
      };
      fixed_expenses: {
        Row: {
          id: string;
          description: string;
          amount: number;
          due_day: number;
          category_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<FixedExpenses['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FixedExpenses['Row'], 'id'>>;
      };
      monthly_fixed_expense_status: {
        Row: {
          id: string;
          expense_id: string;
          year: number;
          month: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<MonthlyFixedExpenseStatus['Row'], 'id' | 'created_at'>;
        Update: Partial<Omit<MonthlyFixedExpenseStatus['Row'], 'id'>>;
      };
      investments: {
        Row: {
          id: string;
          name: string;
          type: 'STOCK' | 'BOND' | 'CRYPTO' | 'REAL_ESTATE' | 'OTHER';
          initial_value: number;
          current_value: number;
          target_value: number | null;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Investments['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Investments['Row'], 'id'>>;
      };
      investment_history: {
        Row: {
          id: string;
          investment_id: string;
          previous_value: number;
          new_value: number;
          updated_by: string;
          created_at: string;
        };
        Insert: Omit<InvestmentHistory['Row'], 'id' | 'created_at'>;
        Update: Partial<Omit<InvestmentHistory['Row'], 'id'>>;
      };
      monthly_income: {
        Row: {
          id: string;
          year: number;
          month: number;
          lucas_main_income: number;
          lucas_other_income: number;
          camila_main_income: number;
          camila_other_income: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<MonthlyIncome['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MonthlyIncome['Row'], 'id'>>;
      };
      default_income: {
        Row: {
          id: string;
          lucas_main_income: number;
          lucas_other_income: number;
          camila_main_income: number;
          camila_other_income: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<DefaultIncome['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DefaultIncome['Row'], 'id'>>;
      };
      reserves: {
        Row: {
          id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          priority: number;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Reserves['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Reserves['Row'], 'id'>>;
      };
      user_preferences: {
        Row: {
          user_id: string;
          currency: string;
          theme: 'light' | 'dark' | 'system';
          notifications: boolean;
          week_starts_on: number;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<UserPreferences['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences['Row'], 'user_id'>>;
      };
    };
    Views: {
      monthly_details: {
        Row: {
          month: string;
          total_income: number;
          total_expenses: number;
          planned_amount: number;
          actual_amount: number;
        };
      };
    };
    Functions: {
      calculate_monthly_totals: {
        Args: { year: number; month: number };
        Returns: {
          total_income: number;
          total_expenses: number;
          savings: number;
        };
      };
    };
  };
}
