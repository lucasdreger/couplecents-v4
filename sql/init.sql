create table if not exists monthly_details (
  id uuid primary key default uuid_generate_v4(),
  month text not null,
  total_income decimal(10,2) default 0,
  total_expenses decimal(10,2) default 0,
  planned_amount decimal(10,2) default 0,
  actual_amount decimal(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
