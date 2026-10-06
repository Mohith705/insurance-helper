'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function calculateNextInstallmentDate(prevDateStr, frequency) {
  if (!prevDateStr) return null;
  const date = new Date(prevDateStr);
  if (isNaN(date.getTime())) return prevDateStr;
  
  if (frequency === 'Monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === 'Quarterly') {
    date.setMonth(date.getMonth() + 3);
  } else if (frequency === 'Half Yearly') {
    date.setMonth(date.getMonth() + 6);
  } else if (frequency === 'Yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split('T')[0];
}


export async function addInsuranceUser(formData: FormData) {
  const supabase = await createClient()

  const prevDate = formData.get('previous_installment_date') as string;

  const data = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    insurance_type: formData.get('insurance_type') as string,
    insurance_company: formData.get('insurance_company') as string,
    policy_name: formData.get('policy_name') as string,
    amount: parseFloat(formData.get('amount') as string),
    previous_installment_date: prevDate ? prevDate : null,
    next_installment_date: calculateNextInstallmentDate(prevDate ? prevDate : (formData.get('date_of_commencement') as string), formData.get('payment_frequency') as string) || (formData.get('next_installment_date') as string),
    payment_frequency: formData.get('payment_frequency') as string,
    policy_number: formData.get('policy_number') as string,
    ssn_or_id: formData.get('ssn_or_id') as string,
    phone_number: formData.get('phone_number') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
    
    // New Life Insurance Fields
    
    client_id: formData.get('client_id') as string || null,
    date_of_commencement: formData.get('date_of_commencement') as string || null,
    policy_status: formData.get('policy_status') as string || null,
    premium_paying_term: formData.get('premium_paying_term') ? parseInt(formData.get('premium_paying_term') as string) : null,
    policy_period: formData.get('policy_period') ? parseInt(formData.get('policy_period') as string) : null,
    base_sum_assured: formData.get('base_sum_assured') ? parseFloat(formData.get('base_sum_assured') as string) : null,
    accidental_sum_assured: formData.get('accidental_sum_assured') ? parseFloat(formData.get('accidental_sum_assured') as string) : null,
    total_sum_assured: formData.get('total_sum_assured') ? parseFloat(formData.get('total_sum_assured') as string) : null,
    life_insured_place_of_birth: formData.get('life_insured_place_of_birth') as string || null,
    aadhar_no: formData.get('aadhar_no') as string || null,
    pan_card_no: formData.get('pan_card_no') as string || null,
    height: formData.get('height') as string || null,
    weight: formData.get('weight') as string || null,
    health_issues: formData.get('health_issues') as string || null,
    education: formData.get('education') as string || null,
    bank_details: formData.get('bank_details') as string || null,
    mother_name: formData.get('mother_name') as string || null,
    profession: formData.get('profession') as string || null,
    designation: formData.get('designation') as string || null,
    yearly_income: formData.get('yearly_income') ? parseFloat(formData.get('yearly_income') as string) : null,
    mole: formData.get('mole') as string || null,
    location: formData.get('location') as string || null,
    
    // Nominee
    nominee_name: formData.get('nominee_name') as string || null,
    nominee_dob: formData.get('nominee_dob') as string || null,
    nominee_relation: formData.get('nominee_relation') as string || null,
    
    
    // JSON arrays
    existing_insurances: formData.get('existing_insurances') ? JSON.parse(formData.get('existing_insurances') as string) : [],
    
    document_url: null as string | null,

    // General Sub-Category
    general_sub_category: formData.get('general_sub_category') as string || null,

    // Health specific (Portability)
    health_portability_type: formData.get('health_portability_type') as string || null,
    health_portability_details: null as string | null, // Removed field, migrated to history_logs

    // Auto specific
    auto_vehicle_type: formData.get('auto_vehicle_type') as string || null,
    auto_registration_no: formData.get('auto_registration_no') as string || null,
    auto_make_model: formData.get('auto_make_model') as string || null,
    auto_engine_no: formData.get('auto_engine_no') as string || null,
    auto_chassis_no: formData.get('auto_chassis_no') as string || null,
    auto_mfg_year: formData.get('auto_mfg_year') ? parseInt(formData.get('auto_mfg_year') as string) : null,
    auto_rto_code: formData.get('auto_rto_code') as string || null,
    auto_idv: formData.get('auto_idv') ? parseFloat(formData.get('auto_idv') as string) : null,
    auto_ncb: formData.get('auto_ncb') as string || null,
    auto_purchase_location: formData.get('auto_purchase_location') as string || null,
  }


  const aadharFile = formData.get('aadhar_document') as File;
  if (aadharFile && aadharFile.size > 0) {
    const fileExt = aadharFile.name.split('.').pop()
    const fileName = `${data.policy_number}-aadhar-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, aadharFile)
    if (!uploadError) {
      data.aadhar_document_url = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl
    }
  }

  const panFile = formData.get('pan_document') as File;
  if (panFile && panFile.size > 0) {
    const fileExt = panFile.name.split('.').pop()
    const fileName = `${data.policy_number}-pan-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, panFile)
    if (!uploadError) {
      data.pan_document_url = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl
    }
  }

  // Handle file upload if present
  const documentFile = formData.get('document_file') as File;
  if (documentFile && documentFile.size > 0) {
    const fileExt = documentFile.name.split('.').pop()
    const fileName = `${data.policy_number}-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(fileName, documentFile)
      
    if (uploadError) {
      console.error('File upload error:', uploadError)
      throw new Error('Failed to upload document.')
    }
    
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName)
    data.document_url = publicUrl
  }

  // Check for duplicate policy number
  const { data: existingUser } = await supabase
    .from('insurance_users')
    .select('id')
    .eq('policy_number', data.policy_number)
    .single()

  if (existingUser) {
    throw new Error('A client with this Policy Number already exists in the system.')
  }

  const history_logs = []
  const portType = data.health_portability_type
  if (portType && portType !== 'None') {
    history_logs.push({
      date: new Date().toISOString(),
      type: `Portability Initial (${portType})`,
      message: `Previous Company: ${formData.get('prev_company') || 'Unknown'}, Policy: ${formData.get('prev_policy_name') || 'N/A'} (No. ${formData.get('prev_policy_number') || 'N/A'})`
    })
  }

  const finalData = {
    ...data,
    history_logs
  }

  const { error } = await supabase.from('insurance_users').insert([finalData])

  if (error) {
    console.error('Error adding user:', error)
    if (error.code === '23505') {
      throw new Error('A client with this Policy Number already exists in the system.')
    }
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}

export async function deleteInsuranceUser(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('insurance_users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting user:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function updateInsuranceUser(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: oldUser } = await supabase
    .from('insurance_users')
    .select('*')
    .eq('id', id)
    .single()

  if (!oldUser) {
    throw new Error('User not found.')
  }

  const prevDate = formData.get('previous_installment_date') as string;

  const data = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    insurance_type: formData.get('insurance_type') as string,
    insurance_company: formData.get('insurance_company') as string,
    policy_name: formData.get('policy_name') as string,
    amount: parseFloat(formData.get('amount') as string),
    previous_installment_date: prevDate ? prevDate : null,
    next_installment_date: formData.get('next_installment_date') as string,
    payment_frequency: formData.get('payment_frequency') as string,
    policy_number: formData.get('policy_number') as string,
    ssn_or_id: formData.get('ssn_or_id') as string,
    phone_number: formData.get('phone_number') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    notes: formData.get('notes') as string,
    
    aadhar_no: formData.get('aadhar_no') as string || null,
    pan_card_no: formData.get('pan_card_no') as string || null,
    height: formData.get('height') as string || null,
    weight: formData.get('weight') as string || null,
    health_issues: formData.get('health_issues') as string || null,
    education: formData.get('education') as string || null,
    bank_details: formData.get('bank_details') as string || null,
    mother_name: formData.get('mother_name') as string || null,
    profession: formData.get('profession') as string || null,
    designation: formData.get('designation') as string || null,
    yearly_income: formData.get('yearly_income') ? parseFloat(formData.get('yearly_income') as string) : null,
    mole: formData.get('mole') as string || null,
    location: formData.get('location') as string || null,
    
    nominee_name: formData.get('nominee_name') as string || null,
    nominee_dob: formData.get('nominee_dob') as string || null,
    nominee_relation: formData.get('nominee_relation') as string || null,
    nominee_place_of_birth: formData.get('nominee_place_of_birth') as string || null,
    
    existing_insurances: formData.get('existing_insurances') ? JSON.parse(formData.get('existing_insurances') as string) : [],
    
    general_sub_category: formData.get('general_sub_category') as string || null,
    health_portability_type: formData.get('health_portability_type') as string || null,
    
    auto_vehicle_type: formData.get('auto_vehicle_type') as string || null,
    auto_registration_no: formData.get('auto_registration_no') as string || null,
    auto_make_model: formData.get('auto_make_model') as string || null,
    auto_engine_no: formData.get('auto_engine_no') as string || null,
    auto_chassis_no: formData.get('auto_chassis_no') as string || null,
    auto_mfg_year: formData.get('auto_mfg_year') ? parseInt(formData.get('auto_mfg_year') as string) : null,
    auto_rto_code: formData.get('auto_rto_code') as string || null,
    auto_idv: formData.get('auto_idv') ? parseFloat(formData.get('auto_idv') as string) : null,
    auto_ncb: formData.get('auto_ncb') as string || null,
    auto_purchase_location: formData.get('auto_purchase_location') as string || null,
    
    document_url: oldUser.document_url,
  }

  const documentFile = formData.get('document_file') as File;
  if (documentFile && documentFile.size > 0) {
    const fileExt = documentFile.name.split('.').pop()
    const fileName = `${data.policy_number}-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(fileName, documentFile)
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName)
      data.document_url = publicUrl
    }
  }

  const newLogs = []
  
  if (data.health_portability_type !== oldUser.health_portability_type) {
    newLogs.push({
      date: new Date().toISOString(),
      type: 'Portability Changed',
      message: `Portability changed to ${data.health_portability_type || 'None'}.`
    })
  }
  
  if (data.next_installment_date !== oldUser.next_installment_date) {
    newLogs.push({
      date: new Date().toISOString(),
      type: 'Installment Date Changed',
      message: `Next Installment pushed from ${oldUser.next_installment_date} to ${data.next_installment_date}.`
    })
  }

  if (data.amount !== oldUser.amount) {
    newLogs.push({
      date: new Date().toISOString(),
      type: 'Premium Changed',
      message: `Premium amount changed from ₹${oldUser.amount} to ₹${data.amount}.`
    })
  }

  if (data.insurance_company !== oldUser.insurance_company) {
    newLogs.push({
      date: new Date().toISOString(),
      type: 'Company Changed',
      message: `Insurance company changed from ${oldUser.insurance_company} to ${data.insurance_company}.`
    })
  }

  const finalData = {
    ...data,
    history_logs: [...(oldUser.history_logs || []), ...newLogs]
  }

  const { error } = await supabase.from('insurance_users').update(finalData).eq('id', id)

  if (error) {
    console.error('Error updating user:', error)
    if (error.code === '23505') {
      throw new Error('A client with this Policy Number already exists in the system.')
    }
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}

export async function updatePaymentStatus(id: string, isComplete: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('insurance_users').update({ payment_complete: isComplete }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function addCustomReminder(id: string, date: string, note: string) {
  const supabase = await createClient()
  
  const { data: user } = await supabase.from('insurance_users').select('custom_reminders').eq('id', id).single()
  if (!user) throw new Error('User not found')
  
  const currentReminders = user.custom_reminders || []
  const updatedReminders = [...currentReminders, { date, note }]
  
  const { error } = await supabase.from('insurance_users').update({ custom_reminders: updatedReminders }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}
