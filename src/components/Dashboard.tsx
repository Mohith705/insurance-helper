'use client'

import { useState, useMemo } from 'react'
import { InsuranceUser } from '@/types'
import { Search, Filter, Lock, Unlock, Eye, X } from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard({ initialUsers }: { initialUsers: InsuranceUser[] }) {
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState<InsuranceUser | null>(null)
  
  // Modal State
  const [passwordInput, setPasswordInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  // Derive unique companies for the filter
  const companies = useMemo(() => {
    const set = new Set(initialUsers.map(u => u.insurance_company))
    return ['All', ...Array.from(set)]
  }, [initialUsers])

  // Filter users based on search and dropdown
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      const matchSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
      const matchCompany = companyFilter === 'All' || user.insurance_company === companyFilter
      return matchSearch && matchCompany
    })
  }, [initialUsers, search, companyFilter])

  // Modal handlers
  const openModal = (user: InsuranceUser) => {
    setSelectedUser(user)
    setIsAuthenticated(false)
    setPasswordInput('')
    setPasswordError(false)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setIsAuthenticated(false)
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'secret123') {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Clients Dashboard</h1>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
            >
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Policy</th>
                <th className="p-4">Amount</th>
                <th className="p-4 hidden md:table-cell">Prev. Installment</th>
                <th className="p-4">Next Installment</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-medium text-slate-800">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.insurance_company}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{user.policy_name}</td>
                    <td className="p-4 font-medium text-slate-800">${user.amount}</td>
                    <td className="p-4 text-slate-500 hidden md:table-cell">
                      {user.previous_installment_date ? format(new Date(user.previous_installment_date), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="p-4">
                      <span className="text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">
                        {user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => openModal(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View User</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                {selectedUser.first_name} {selectedUser.last_name}
                {isAuthenticated ? (
                  <Unlock className="w-4 h-4 ml-2 text-green-600" />
                ) : (
                  <Lock className="w-4 h-4 ml-2 text-slate-400" />
                )}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              
              {/* Basic Info always visible in Modal */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-sm text-slate-500">Company</p>
                  <p className="font-medium text-slate-800">{selectedUser.insurance_company}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Policy Name</p>
                  <p className="font-medium text-slate-800">{selectedUser.policy_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Installment Amount</p>
                  <p className="font-medium text-slate-800">${selectedUser.amount} ({selectedUser.payment_frequency})</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Next Payment</p>
                  <p className="font-medium text-amber-600">
                    {selectedUser.next_installment_date ? format(new Date(selectedUser.next_installment_date), 'MMMM d, yyyy') : '-'}
                  </p>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Confidential Data Protected</h3>
                  <p className="text-slate-500 mb-6 text-sm">Please enter the security password to view sensitive client information like SSN, Policy Number, and Contact Details.</p>
                  
                  <form onSubmit={handleAuth} className="max-w-xs mx-auto">
                    <input
                      type="password"
                      placeholder="Enter password..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mb-3">Incorrect password. Hint: secret123</p>
                    )}
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition-colors">
                      Unlock Details
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Confidential Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-sm text-slate-500">Policy Number</p>
                      <p className="font-medium text-slate-800">{selectedUser.policy_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">SSN / ID</p>
                      <p className="font-medium text-slate-800">{selectedUser.ssn_or_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-800">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="font-medium text-slate-800">{selectedUser.phone_number || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-500">Full Address</p>
                      <p className="font-medium text-slate-800">{selectedUser.address || 'N/A'}</p>
                    </div>
                    {selectedUser.notes && (
                      <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="text-sm text-yellow-800 font-medium mb-1">Notes</p>
                        <p className="text-yellow-900">{selectedUser.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
