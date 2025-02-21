CREATE TABLE IF NOT EXISTS monthly_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_income NUMERIC DEFAULT 0,
  total_expenses NUMERIC DEFAULT 0,
  planned_amount NUMERIC DEFAULT 0,
  actual_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);
