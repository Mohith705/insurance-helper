-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the main insurance users table
create table public.insurance_users (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic Info (Always visible)
  first_name text not null,
  last_name text not null,
  insurance_company text not null,
  policy_name text not null,
  
  -- Payment Info (Visible on dashboard)
  amount numeric(10, 2) not null,
  previous_installment_date date,
  next_installment_date date not null,
  payment_frequency text check (payment_frequency in ('Monthly', 'Quarterly', 'Yearly')) not null,
  
  -- Confidential Info (Gated behind password)
  policy_number text not null,
  ssn_or_id text,
  phone_number text,
  email text,
  address text,
  notes text
);

-- Enable RLS (Row Level Security) - basic setup allowing all access for now, 
-- but you should restrict this in production!
alter table public.insurance_users enable row level security;

create policy "Enable read access for all users" on public.insurance_users for select using (true);
create policy "Enable insert access for all users" on public.insurance_users for insert with check (true);
create policy "Enable update access for all users" on public.insurance_users for update using (true);
create policy "Enable delete access for all users" on public.insurance_users for delete using (true);
