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

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
        <p className="text-gray-700 bg-red-50 p-4 rounded-lg inline-block text-left font-mono text-sm border border-red-200">
          {error.message}
          <br/><br/>
          Details: {error.details || 'None'}
          <br/>
          Hint: {error.hint || 'None'}
        </p>
      </div>
    )
  }

  if (!user) {
    return notFound()
  }

  return <EditFormClient initialData={user} />
}
