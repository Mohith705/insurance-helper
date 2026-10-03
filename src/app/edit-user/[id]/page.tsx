import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditFormClient from './EditFormClient'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from('insurance_users')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !user) {
    return notFound()
  }

  return <EditFormClient initialData={user} />
}
