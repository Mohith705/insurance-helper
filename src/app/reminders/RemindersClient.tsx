'use client'

import { useState } from 'react'
import { InsuranceUser } from '@/types'
import { differenceInDays, format } from 'date-fns'
import { updatePaymentStatus } from '../actions'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RemindersClient({ users }: { users: InsuranceUser[] }) {
  const [activeUsers, setActiveUsers] = useState<InsuranceUser[]>(users)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handlePaymentComplete = async (userId: string) => {
    setLoadingId(userId)
    // Optimistic UI: remove from list immediately
    setActiveUsers(prev => prev.filter(u => u.id !== userId))
    
    try {
      await updatePaymentStatus(userId, true)
    } catch (error) {
      console.error("Failed to update payment status", error)
      // Revert if failed
      setActiveUsers(users)
    } finally {
      setLoadingId(null)
    }
  }

  const generateWhatsAppLink = (user: InsuranceUser, days: number, customNote?: string) => {
    const note = customNote || `Automatic Reminder: ${days} days until next premium of ₹${user.amount}`
    const msg = `Hello ${user.first_name},\n\nThis is a reminder from your insurance agent.\n\n${note}\n\nPolicy: ${user.policy_name} (${user.policy_number})\nDue Date: ${user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : 'N/A'}\nPremium Amount: ₹${user.amount}\n\nPlease ignore if already paid.`
    const phone = user.phone_number?.replace(/\D/g, '') || ''
    return `https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}`
  }

  // Categorize users based on days remaining
  const categorized = activeUsers.reduce((acc, user) => {
    if (user.next_installment_date) {
      const daysRemaining = differenceInDays(new Date(user.next_installment_date), new Date())
      
      if (daysRemaining < 0) {
        acc.overdue.push({ user, daysRemaining })
      } else if (daysRemaining <= 10) {
        acc.tenDays.push({ user, daysRemaining })
      } else if (daysRemaining <= 20) {
        acc.twentyDays.push({ user, daysRemaining })
      } else if (daysRemaining <= 30) {
        acc.thirtyDays.push({ user, daysRemaining })
      }
    }

    if (user.custom_reminders && Array.isArray(user.custom_reminders)) {
      user.custom_reminders.forEach((rem: any) => {
        const customDaysRemaining = differenceInDays(new Date(rem.date), new Date())
        if (customDaysRemaining <= 14) { // Due within 14 days or overdue
          acc.custom.push({ user, daysRemaining: customDaysRemaining, note: rem.note, date: rem.date })
        }
      })
    }

    return acc
  }, {
    overdue: [] as { user: InsuranceUser, daysRemaining: number }[],
    tenDays: [] as { user: InsuranceUser, daysRemaining: number }[],
    twentyDays: [] as { user: InsuranceUser, daysRemaining: number }[],
    thirtyDays: [] as { user: InsuranceUser, daysRemaining: number }[],
    custom: [] as { user: InsuranceUser, daysRemaining: number, note: string, date: string }[]
  })

  const renderSection = (title: string, items: any[], badgeColor: string, icon: React.ReactNode, isCustom = false) => {
    if (items.length === 0) return null

    return (
      <div className="mb-8 glass-card border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${badgeColor}`}>
          <h2 className="text-lg font-semibold flex items-center text-slate-800">
            {icon}
            <span className="ml-2">{title}</span>
            <span className="ml-3 glass-card/50 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const { user, daysRemaining, note, date } = item
            return (
            <div key={`${user.id}-${idx}`} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/60 transition-colors">
              <div className="mb-4 md:mb-0">
                <Link href={`/edit-user/${user.id}`} className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                  {user.first_name} {user.last_name}
                </Link>
                {isCustom && (
                  <p className="text-sm font-medium text-purple-700 mt-1 bg-purple-50 inline-block px-2 py-0.5 rounded border border-purple-100">
                    Custom Note: {note} (Set for {format(new Date(date), 'MMM d, yyyy')})
                  </p>
                )}
                <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{user.policy_name}</span>
                  <span>•</span>
                  <span className="font-medium text-slate-700">₹{user.amount}</span>
                  <span>•</span>
                  <span>Due: {format(new Date(user.next_installment_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a
                  href={generateWhatsAppLink(user, isCustom ? daysRemaining : (daysRemaining > 20 ? 30 : daysRemaining > 10 ? 20 : 10), isCustom ? note : undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => handlePaymentComplete(user.id)}
                  disabled={loadingId === user.id}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  {loadingId === user.id ? 'Saving...' : 'Mark Paid'}
                </button>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    )
  }

  const totalActionable = categorized.overdue.length + categorized.tenDays.length + categorized.twentyDays.length + categorized.thirtyDays.length + categorized.custom.length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          Reminders Inbox
        </h1>
        <p className="text-slate-600 mt-1">Manage upcoming premiums. Marking as paid removes them from this list.</p>
      </div>

      {totalActionable === 0 ? (
        <div className="text-center bg-white/60 border border-slate-200 rounded-xl py-12 px-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-800">All caught up!</h3>
          <p className="text-slate-500 mt-1">There are no upcoming premiums within the next 30 days.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection("Custom Reminders", categorized.custom, "bg-purple-50 text-purple-800", <AlertCircle className="w-5 h-5 text-purple-500" />, true)}
          {renderSection("Overdue", categorized.overdue, "bg-red-50 text-red-800", <AlertCircle className="w-5 h-5 text-red-500" />)}
          {renderSection("10-Day Reminders (Critical)", categorized.tenDays, "bg-orange-50 text-orange-800", <Clock className="w-5 h-5 text-orange-500" />)}
          {renderSection("20-Day Reminders", categorized.twentyDays, "bg-yellow-50 text-yellow-800", <Clock className="w-5 h-5 text-yellow-500" />)}
          {renderSection("30-Day Reminders", categorized.thirtyDays, "bg-blue-50 text-blue-800", <Clock className="w-5 h-5 text-blue-500" />)}
        </div>
      )}
    </div>
  )
}
