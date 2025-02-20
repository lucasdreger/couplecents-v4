export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface DefaultIncome {
  id: string;
  lucas_income: number;
  camila_income: number;
  other_income: number;
  last_updated: string;
  created_at: string;
}

export interface FixedExpense {
  id: string;
  category_id: string;
  description: string;
  estimated_amount: number;
  owner: string;
  status_required: boolean;
  created_at: string;
}

export interface Investment {
  id: string;
  category: string;
  name: string;
  current_value: number;
  last_updated: string;
  created_at: string;
}

export interface InvestmentHistory {
  id: string;
  investment_id: string;
  previous_value: number;
  new_value: number;
  updated_by: string;
  created_at: string;
}

export interface Reserve {
  id: string;
  category: string;
  name: string;
  current_value: number;
  target_value: number | null;
  last_updated: string;
  created_at: string;
}

export interface MonthlyIncome {
  id: string;
  year: number;
  month: number;
  lucas_income: number;
  camila_income: number;
  other_income: number;
  created_at: string;
}

export interface MonthlyFixedExpenseStatus {
  id: string;
  year: number;
  month: number;
  fixed_expense_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface VariableExpense {
  id: string;
  year: number;
  month: number;
  category_id: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}
