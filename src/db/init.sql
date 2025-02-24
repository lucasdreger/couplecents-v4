-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Monthly Details
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

-- Investments
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment History
CREATE TABLE IF NOT EXISTS investment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID NOT NULL REFERENCES investments(id),
  old_value NUMERIC NOT NULL,
  new_value NUMERIC NOT NULL,
  user_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample investments data
INSERT INTO investments (name, current_value) VALUES
  ('Stocks', 10000),
  ('Bonds', 5000),
  ('Real Estate', 250000),
  ('Crypto', 2000)
ON CONFLICT DO NOTHING;
