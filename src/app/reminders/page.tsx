import { createClient } from '@/utils/supabase/server'
import RemindersClient from './RemindersClient'

export const dynamic = 'force-dynamic'

export default async function RemindersPage() {
  const supabase = await createClient()

  // Fetch all users where payment is NOT complete
  const { data: users, error } = await supabase
    .from('insurance_users')
    .select('*')
    .or('payment_complete.eq.false,payment_complete.is.null')

  if (error) {
    console.error('Error fetching reminders:', error)
    return (
      <div className="p-8 text-center text-red-600">
        Error loading reminders data: {error.message}
      </div>
    )
  }

  return <RemindersClient users={users || []} />
}
