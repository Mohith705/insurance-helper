-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the main insurance users table
create table public.insurance_users (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic Info (Always visible)
  first_name text not null,
  last_name text not null,
  insurance_type text check (insurance_type in ('Life', 'General')) not null default 'Life',
  insurance_company text not null,
  policy_name text not null,
  
  -- Payment Info (Visible on dashboard)
  amount numeric(10, 2) not null,
  previous_installment_date date,
  next_installment_date date not null,
  payment_frequency text check (payment_frequency in ('Monthly', 'Quarterly', 'Yearly')) not null,
  
  -- Confidential Info (Gated behind password)
  policy_number text not null unique,
  ssn_or_id text,
  phone_number text,
  email text,
  address text,
  notes text,

  -- New Life Insurance Confidential Fields
  aadhar_no text,
  pan_card_no text,
  existing_insurances jsonb default '[]'::jsonb,
  height text,
  weight text,
  health_issues text,
  education text,
  bank_details text,
  mother_name text,
  profession text check (profession in ('Job', 'Business')),
  designation text,
  yearly_income numeric(12, 2),
  mole text,
  location text,
  
  -- Nominee
  nominee_name text,
  nominee_dob date,
  nominee_relation text,
  nominee_place_of_birth text,

  -- Document Reference
  document_url text,

  -- General Insurance Sub-Category
  general_sub_category text check (general_sub_category in ('Health', 'Auto')),

  -- Health Portability Fields
  health_portability_type text check (health_portability_type in ('None', 'External', 'Internal')),
  health_portability_details text,

  -- Auto Insurance Fields
  auto_vehicle_type text check (auto_vehicle_type in ('2-Wheeler', '4-Wheeler', 'Commercial')),
  auto_registration_no text,
  auto_make_model text,
  auto_engine_no text,
  auto_chassis_no text,
  auto_mfg_year integer,
  auto_rto_code text,
  auto_idv numeric(12, 2),
  auto_ncb text,
  auto_purchase_location text,
  
  -- Audit / History Logs
  history_logs jsonb default '[]'::jsonb
);

-- Enable RLS (Row Level Security) - basic setup allowing all access for now, 
-- but you should restrict this in production!
alter table public.insurance_users enable row level security;

create policy "Enable read access for all users" on public.insurance_users for select using (true);
create policy "Enable insert access for all users" on public.insurance_users for insert with check (true);
create policy "Enable update access for all users" on public.insurance_users for update using (true);
create policy "Enable delete access for all users" on public.insurance_users for delete using (true);

-- Add Reminders support
ALTER TABLE public.insurance_users
ADD COLUMN payment_complete BOOLEAN DEFAULT false,
ADD COLUMN custom_reminders JSONB DEFAULT '[]'::jsonb;
