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
}

export interface Income {
  id: string;
  year: number;
  month: number;
  lucas_income: number;
  camila_income: number;
  other_income: number;
  created_at: string;
}

export interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
  created_at: string;
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
