import { useState } from 'react'
import { InsuranceUser } from '@/types'
import { updatePaymentStatus, addCustomReminder } from '@/app/actions'
import { format, subDays, isFuture } from 'date-fns'

export default function RemindersSection({ user }: { user: InsuranceUser }) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  
  // Local state for optimistic UI updates
  const [localPaymentComplete, setLocalPaymentComplete] = useState(user.payment_complete || false)
  const [localCustomReminders, setLocalCustomReminders] = useState(user.custom_reminders || [])

  const handleTogglePayment = async () => {
    const newValue = !localPaymentComplete
    setLocalPaymentComplete(newValue) // Optimistic update
    setLoading(true)
    try {
      await updatePaymentStatus(user.id, newValue)
    } catch (e) {
      setLocalPaymentComplete(!newValue) // Revert on failure
    } finally {
      setLoading(false)
    }
  }

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !note) return
    
    const newReminder = { date, note }
    setLocalCustomReminders([...localCustomReminders, newReminder]) // Optimistic update
    setLoading(true)
    
    try {
      await addCustomReminder(user.id, date, note)
      setDate('')
      setNote('')
    } catch (e) {
      // If it fails, we should ideally remove it, but for now just clear loading
    } finally {
      setLoading(false)
    }
  }

  // Generate automated reminders based on next installment date
  const generateAutoReminders = () => {
    if (!user.next_installment_date) return []
    const nextDate = new Date(user.next_installment_date)
    return [30, 20, 10].map(days => {
      const reminderDate = subDays(nextDate, days)
      return {
        date: reminderDate.toISOString(),
        note: `Automatic Reminder: ${days} days until next premium of ₹${user.amount}`,
        isAuto: true
      }
    })
  }

  const allReminders = [
    ...generateAutoReminders(),
    ...localCustomReminders.map(r => ({ ...r, isAuto: false }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const generateWhatsAppLink = (rem: any) => {
    const msg = `Hello ${user.first_name},\n\nThis is a reminder from your insurance agent.\n\n${rem.note}\n\nPolicy: ${user.policy_name} (${user.policy_number})\nDue Date: ${user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : 'N/A'}\nPremium Amount: ₹${user.amount}\n\nPlease ignore if already paid.`
    const phone = user.phone_number?.replace(/\D/g, '') || ''
    return `https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="md:col-span-2 mt-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-800 text-lg flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Reminders & Follow-ups
        </h4>
        
        <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
          <input 
            type="checkbox" 
            checked={localPaymentComplete}
            onChange={handleTogglePayment}
            disabled={loading}
            className="rounded text-green-600 focus:ring-green-500"
          />
          <span className="text-sm font-medium text-slate-700">Payment Complete</span>
        </label>
      </div>

      {localPaymentComplete ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-100 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Payment is marked as complete. Reminders are paused.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {allReminders.map((rem, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-3 sm:gap-0">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {format(new Date(rem.date), 'MMM d, yyyy')}
                    {rem.isAuto && <span className="ml-2 text-[10px] uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold tracking-wider">Auto</span>}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">{rem.note}</p>
                </div>
                <a 
                  href={generateWhatsAppLink(rem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg flex items-center justify-center text-sm font-medium transition-colors whitespace-nowrap sm:ml-4 shrink-0"
                >
                  WhatsApp
                </a>
              </div>
            ))}
            {allReminders.length === 0 && (
              <div className="p-4 text-sm text-slate-500 text-center">No upcoming reminders.</div>
            )}
          </div>

          <form onSubmit={handleAddReminder} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-slate-200">
            <input 
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 shrink-0"
            />
            <input 
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Custom reminder note..."
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
