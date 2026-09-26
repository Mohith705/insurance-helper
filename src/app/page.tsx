import { createClient } from '@/utils/supabase/server'
import Dashboard from '@/components/Dashboard'

// Opt out of caching for this page so the dashboard always has fresh data
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // Fetch all users from Supabase
  const { data: users, error } = await supabase
    .from('insurance_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-xl">
        <h2 className="font-bold text-xl mb-2">Error Loading Dashboard</h2>
        <p>{error.message}</p>
        <p className="mt-4 text-sm">Did you run the SQL schema and configure the .env.local file correctly?</p>
      </div>
    )
  }

  return <Dashboard initialUsers={users || []} />
}
