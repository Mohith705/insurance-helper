export interface InsuranceUser {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  insurance_company: string;
  policy_name: string;
  amount: number;
  previous_installment_date: string | null;
  next_installment_date: string;
  payment_frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  policy_number: string;
  ssn_or_id: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
}
