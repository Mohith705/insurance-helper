export interface InsuranceUser {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  insurance_type: 'Life' | 'General';
  insurance_company: string;
  policy_name: string;
  amount: number;
  previous_installment_date: string | null;
  next_installment_date: string;
  payment_frequency: 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly';
  policy_number: string;
  client_id: string | null;
  date_of_commencement: string | null;
  policy_status: string | null;
  base_sum_assured: number | null;
  accidental_sum_assured: number | null;
  total_sum_assured: number | null;
  ssn_or_id: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  
  // New Life Insurance Fields (Confidential)
  aadhar_no: string | null;
  aadhar_document_url: string | null;
  pan_card_no: string | null;
  pan_document_url: string | null;
  existing_insurances: { company: string; premium: number; sum_insured: number; start_year: number; payment_term: string }[] | null;
  height: string | null;
  weight: string | null;
  health_issues: string | null;
  education: string | null;
  bank_details: string | null;
  mother_name: string | null;
  profession: 'Job' | 'Business' | null;
  designation: string | null;
  yearly_income: number | null;
  mole: string | null;
  location: string | null;
  life_insured_place_of_birth: string | null;
  premium_paying_term: number | null;
  policy_period: number | null;
  
  // Nominee Details
  nominee_name: string | null;
  nominee_dob: string | null;
  nominee_relation: string | null;
  
  // Document Upload
  document_url: string | null;

  // General Insurance Sub-Category
  general_sub_category: 'Health' | 'Auto' | null;

  // Health Insurance Specific (Portability)
  health_portability_type: 'None' | 'External' | 'Internal' | null;
  health_portability_details: string | null;

  // Auto Insurance Fields
  auto_vehicle_type: '2-Wheeler' | '4-Wheeler' | 'Commercial' | null;
  auto_registration_no: string | null;
  auto_make_model: string | null;
  auto_engine_no: string | null;
  auto_chassis_no: string | null;
  auto_mfg_year: number | null;
  auto_rto_code: string | null;
  auto_idv: number | null;
  auto_ncb: string | null;
  auto_purchase_location: string | null;

  // History logs
  history_logs: { date: string; type: string; message: string }[] | null;

  // Reminders
  payment_complete?: boolean;
  custom_reminders?: { date: string; note: string }[];
}
