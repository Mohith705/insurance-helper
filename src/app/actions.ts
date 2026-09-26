'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addInsuranceUser(formData: FormData) {
  const supabase = await createClient()

  const prevDate = formData.get('previous_installment_date') as string;

  const data = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
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
  }

  const { error } = await supabase.from('insurance_users').insert([data])

  if (error) {
    console.error('Error adding user:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}
