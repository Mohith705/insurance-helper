'use client'

import { useState, useMemo } from 'react'
import { InsuranceUser } from '@/types'
import { Search, Filter, Lock, Unlock, Eye, X, Trash2, AlertTriangle, Edit } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { deleteInsuranceUser } from '@/app/actions'
import RemindersSection from './RemindersSection'

export default function Dashboard({ initialUsers }: { initialUsers: InsuranceUser[] }) {
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState<InsuranceUser | null>(null)
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'Life' | 'General'>('Life')

  // Modal State
  const [passwordInput, setPasswordInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  // Derive unique companies for the filter
  const companies = useMemo(() => {
    const set = new Set(initialUsers.map(u => u.insurance_company))
    return ['All', ...Array.from(set)]
  }, [initialUsers])

  // Filter users based on search, dropdown, and tab
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      // For now, if insurance_type is undefined on old data, assume it's 'Life'
      const type = user.insurance_type || 'Life';
      const matchTab = type === activeTab;
      
      const matchSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
      const matchCompany = companyFilter === 'All' || user.insurance_company === companyFilter
      
      return matchTab && matchSearch && matchCompany
    })
  }, [initialUsers, search, companyFilter, activeTab])

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

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState<InsuranceUser | null>(null)
  const [deletePasswordInput, setDeletePasswordInput] = useState('')
  const [deletePasswordError, setDeletePasswordError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openDeleteModal = (user: InsuranceUser) => {
    setUserToDelete(user)
    setDeletePasswordInput('')
    setDeletePasswordError(false)
  }

  const closeDeleteModal = () => {
    setUserToDelete(null)
  }

  const handleDeleteAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (deletePasswordInput === 'delete123' && userToDelete) {
      setIsDeleting(true)
      setDeletePasswordError(false)
      try {
        await deleteInsuranceUser(userToDelete.id)
        closeDeleteModal()
      } catch (error) {
        console.error("Failed to delete user", error)
      } finally {
        setIsDeleting(false)
      }
    } else {
      setDeletePasswordError(true)
    }
  }

  const generateDashboardWhatsAppLink = (user: InsuranceUser) => {
    const msg = `*Policy Details*\n\nCompany: ${user.insurance_company}\nPolicy Name: ${user.policy_name}\nPolicy No: ${user.policy_number}\nClient ID: ${user.client_id || 'N/A'}\nDate of Commencement: ${user.date_of_commencement ? format(new Date(user.date_of_commencement), 'MMM d, yyyy') : 'N/A'}\nPolicy Period: ${user.policy_period || 'N/A'} Years\nPremium Paying Term: ${user.premium_paying_term || 'N/A'} Years\nBase Sum Assured: ${user.base_sum_assured ? '₹' + user.base_sum_assured : 'N/A'}\nAccidental Sum Assured: ${user.accidental_sum_assured ? '₹' + user.accidental_sum_assured : 'N/A'}\nTotal Sum Assured: ${user.total_sum_assured ? '₹' + user.total_sum_assured : 'N/A'}\n\n*Payment Details*\nAmount: ₹${user.amount}\nPayment Mode: ${user.payment_frequency}\nNext Installment Date: ${user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : 'N/A'}`
    const phone = user.phone_number?.replace(/\D/g, '') || ''
    return `https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Clients Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('Life')}
            className={`${activeTab === 'Life' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Life
          </button>
          <button
            onClick={() => setActiveTab('General')}
            className={`${activeTab === 'General' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            General
          </button>
        </nav>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none glass-card w-full sm:w-auto"
            >
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up border border-white/50">
            {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-200">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No users found.</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{user.first_name} {user.last_name}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      {user.insurance_company}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      <span className="text-sm">View</span>
                    </button>
                    <Link
                      href={`/edit-user/${user.id}`}
                      className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                      title="Edit Client"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <a
                      href={generateDashboardWhatsAppLink(user)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 font-medium flex items-center bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors"
                      title="Send WhatsApp"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                    </a>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-600 hover:text-red-800 font-medium flex items-center bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Policy</p>
                    <p className="font-medium text-slate-700">{user.policy_name}</p>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Amount</p>
                    <p className="font-medium text-slate-700">₹{user.amount}</p>
                  </div>
                  <div className="col-span-2 bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="text-amber-700/80 text-[11px] uppercase tracking-wider font-bold mb-1">Next Installment</p>
                      <p className="font-bold text-amber-900 text-base">
                        {user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-4 whitespace-nowrap">Name</th>
                <th className="px-3 py-4 whitespace-nowrap">Company</th>
                <th className="px-3 py-4">Policy</th>
                <th className="px-3 py-4 whitespace-nowrap">Amount</th>
                <th className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">Prev. Installment</th>
                <th className="px-3 py-4 whitespace-nowrap">Next Installment</th>
                <th className="px-3 py-4 whitespace-nowrap">Action</th>
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
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-3 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.insurance_company}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-600 min-w-[150px]">{user.policy_name}</td>
                    <td className="px-3 py-4 font-medium text-slate-800 whitespace-nowrap">₹{user.amount}</td>
                    <td className="px-3 py-4 text-slate-500 hidden lg:table-cell whitespace-nowrap">
                      {user.previous_installment_date ? format(new Date(user.previous_installment_date), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                        {user.next_installment_date ? format(new Date(user.next_installment_date), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <Link
                          href={`/edit-user/${user.id}`}
                          className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <a
                          href={generateDashboardWhatsAppLink(user)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-medium flex items-center bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors"
                          title="Send WhatsApp"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                          </svg>
                        </a>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-800 font-medium flex items-center bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
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
                  <p className="font-medium text-slate-800">₹{selectedUser.amount} ({selectedUser.payment_frequency})</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Next Payment</p>
                  <p className="font-medium text-amber-600">
                    {selectedUser.next_installment_date ? format(new Date(selectedUser.next_installment_date), 'MMMM d, yyyy') : '-'}
                  </p>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="bg-slate-50/50 rounded-xl p-8 border border-slate-200 text-center">
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
                    
                    {(selectedUser.insurance_type === 'Life' || (selectedUser.insurance_type === 'General' && selectedUser.general_sub_category === 'Health')) && (
                      <>
                        <div className="md:col-span-2 pt-4 mt-2 border-t border-slate-100">
                          <h4 className="font-semibold text-slate-700 mb-4">{selectedUser.insurance_type === 'Life' ? 'Life' : 'Health'} Insurance specific</h4>
                        </div>
                        


                        <div>
                          <p className="text-sm text-slate-500">Aadhar No.</p>
                          <p className="font-medium text-slate-800">{selectedUser.aadhar_no || 'N/A'}</p>
                          {(selectedUser.aadhar_document_url || selectedUser.aadhar_back_document_url) && (
                            <div className="flex space-x-3 mt-1">
                              {selectedUser.aadhar_document_url && (
                                <a href={selectedUser.aadhar_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">View Front</a>
                              )}
                              {selectedUser.aadhar_back_document_url && (
                                <a href={selectedUser.aadhar_back_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">View Back</a>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">PAN Card No.</p>
                          <p className="font-medium text-slate-800">{selectedUser.pan_card_no || 'N/A'}</p>
                          {selectedUser.pan_document_url && (
                            <a href={selectedUser.pan_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium block mt-1">View PAN</a>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Height</p>
                          <p className="font-medium text-slate-800">{selectedUser.height || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Weight</p>
                          <p className="font-medium text-slate-800">{selectedUser.weight || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Education</p>
                          <p className="font-medium text-slate-800">{selectedUser.education || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mother's Name</p>
                          <p className="font-medium text-slate-800">{selectedUser.mother_name || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-slate-500">Health Issues</p>
                          <p className="font-medium text-slate-800">{selectedUser.health_issues || 'None'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-slate-500">Bank Details</p>
                          <p className="font-medium text-slate-800">{selectedUser.bank_details || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mole / Mark</p>
                          <p className="font-medium text-slate-800">{selectedUser.mole || 'N/A'}</p>
                        </div>
                        
                        {/* Profession */}
                        <div className="md:col-span-2 bg-slate-50/50 p-4 rounded-lg mt-2">
                          <h5 className="font-semibold text-slate-700 text-sm mb-3">Profession: {selectedUser.profession || 'N/A'}</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Designation</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.designation || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Location</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.location || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Yearly Income</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.yearly_income ? `₹${selectedUser.yearly_income}` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Document</p>
                              {selectedUser.document_url ? (
                                <a href={selectedUser.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">View File</a>
                              ) : (
                                <p className="text-sm text-slate-500">No document</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Nominee */}
                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg mt-2">
                          <h5 className="font-semibold text-blue-800 text-sm mb-3">Nominee Details</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-blue-600/70">Name</p>
                              <p className="font-medium text-blue-900 text-sm">{selectedUser.nominee_name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-600/70">Relation</p>
                              <p className="font-medium text-blue-900 text-sm">{selectedUser.nominee_relation || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-600/70">DOB</p>
                              <p className="font-medium text-blue-900 text-sm">{selectedUser.nominee_dob ? format(new Date(selectedUser.nominee_dob), 'MMM d, yyyy') : 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Existing Insurances */}
                        {selectedUser.existing_insurances && selectedUser.existing_insurances.length > 0 && (
                          <div className="md:col-span-2 mt-2">
                            <h5 className="font-semibold text-slate-700 text-sm mb-3">Existing Policies</h5>
                            <div className="space-y-3">
                              {selectedUser.existing_insurances.map((ins, i) => (
                                <div key={i} className="border border-slate-200 rounded p-3 text-sm flex justify-between glass-card">
                                  <div>
                                    <p className="font-bold text-slate-800">{ins.company}</p>
                                    <p className="text-slate-500 text-xs">Term: {ins.payment_term} | Since: {ins.start_year}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-slate-800">Sum: ₹{ins.sum_insured}</p>
                                    <p className="text-slate-500 text-xs">Premium: ₹{ins.premium}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {selectedUser.insurance_type === 'General' && selectedUser.general_sub_category === 'Auto' && (
                      <>
                        <div className="md:col-span-2 pt-4 mt-2 border-t border-slate-100">
                          <h4 className="font-semibold text-slate-700 mb-4">Auto Insurance Details</h4>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Vehicle Type</p>
                          <p className="font-medium text-slate-800">{selectedUser.auto_vehicle_type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Make & Model</p>
                          <p className="font-medium text-slate-800">{selectedUser.auto_make_model || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Registration No (RC)</p>
                          <p className="font-medium text-slate-800 uppercase">{selectedUser.auto_registration_no || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Manufacturing Year</p>
                          <p className="font-medium text-slate-800">{selectedUser.auto_mfg_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Engine Number</p>
                          <p className="font-medium text-slate-800 uppercase">{selectedUser.auto_engine_no || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Chassis Number</p>
                          <p className="font-medium text-slate-800 uppercase">{selectedUser.auto_chassis_no || 'N/A'}</p>
                        </div>

                        <div className="md:col-span-2 bg-slate-50/50 p-4 rounded-lg mt-2">
                          <h5 className="font-semibold text-slate-700 text-sm mb-3">Policy & Values</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">RTO Code</p>
                              <p className="font-medium text-slate-800 text-sm uppercase">{selectedUser.auto_rto_code || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Purchase Location</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.auto_purchase_location || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">IDV Value</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.auto_idv ? `₹${selectedUser.auto_idv}` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Previous NCB</p>
                              <p className="font-medium text-slate-800 text-sm">{selectedUser.auto_ncb ? `${selectedUser.auto_ncb}%` : 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-slate-500">Document</p>
                              {selectedUser.document_url ? (
                                <a href={selectedUser.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">View RC/Policy Document</a>
                              ) : (
                                <p className="text-sm text-slate-500">No document</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="md:col-span-2 pt-4 mt-2 border-t border-slate-100">
                      <p className="text-sm text-slate-500">Full Address</p>
                      <p className="font-medium text-slate-800">{selectedUser.address || 'N/A'}</p>
                    </div>
                    {selectedUser.notes && (
                      <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="text-sm text-yellow-800 font-medium mb-1">Notes</p>
                        <p className="text-yellow-900">{selectedUser.notes}</p>
                      </div>
                    )}
                    
                    <RemindersSection user={selectedUser} />
                    
                    {selectedUser.history_logs && selectedUser.history_logs.length > 0 && (
                      <div className="md:col-span-2 mt-4">
                        <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          History & Audit Trail
                        </h4>
                        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                          {selectedUser.history_logs.map((log, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-blue-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] glass-card p-3 rounded border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-bold text-slate-700 text-sm">{log.type}</div>
                                  <time className="text-xs text-slate-500">{new Date(log.date).toLocaleDateString()}</time>
                                </div>
                                <div className="text-slate-600 text-sm">{log.message}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
              <h2 className="text-xl font-bold text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Delete Client
              </h2>
              <button onClick={closeDeleteModal} className="text-red-400 hover:text-red-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-6 text-center">
                Are you sure you want to delete <span className="font-bold text-slate-800">{userToDelete.first_name} {userToDelete.last_name}</span>? This action cannot be undone.
              </p>

              <form onSubmit={handleDeleteAuth} className="max-w-xs mx-auto">
                <input
                  type="password"
                  placeholder="Enter delete password..."
                  value={deletePasswordInput}
                  onChange={(e) => setDeletePasswordInput(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  required
                />
                {deletePasswordError && (
                  <p className="text-red-500 text-sm mb-3 text-center">Incorrect password.</p>
                )}
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center shadow-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
