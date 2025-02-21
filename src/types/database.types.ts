
export interface VariableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
  year: number;
  month: number;
  created_at: string;
}

export interface FixedExpense {
  id: string;
  description: string;
  estimated_amount: number;
  owner: string;
  category_id: string;
  status_required: boolean;
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
