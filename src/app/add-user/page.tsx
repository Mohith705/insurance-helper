'use client'

import { useState } from 'react'
import { addInsuranceUser } from '../actions'
import { Save, AlertCircle } from 'lucide-react'

export default function AddUserPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await addInsuranceUser(formData)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Add New Client</h1>
        <p className="text-slate-500 mt-2">Enter the details of the newly purchased insurance policy.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form action={handleSubmit} className="p-8 space-y-8">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input required name="first_name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input required name="last_name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input name="email" type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input name="phone_number" type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SSN or ID</label>
                <input name="ssn_or_id" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="XXX-XX-XXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input name="address" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="123 Main St, City, State" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Policy Details */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Policy Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Company</label>
                <input required name="insurance_company" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="State Farm, Geico, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Name/Type</label>
                <input required name="policy_name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Auto, Home, Life..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Number (Confidential)</label>
                <input required name="policy_number" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="POL-123456789" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Payment Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Installment Amount ($)</label>
                <input required name="amount" type="number" step="0.01" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Frequency</label>
                <select required name="payment_frequency" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Previous Installment Date</label>
                <input name="previous_installment_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Next Installment Date</label>
                <input required name="next_installment_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Any special requirements..." />
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={loading}
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
