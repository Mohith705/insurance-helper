'use client'

import { useState } from 'react'
import { addInsuranceUser } from '../actions'
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react'

export default function AddUserPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [insuranceType, setInsuranceType] = useState('Life')
  const [generalSubCategory, setGeneralSubCategory] = useState('Auto')
  const [profession, setProfession] = useState('Job')
  const [portability, setPortability] = useState('None')
  const [existingInsurances, setExistingInsurances] = useState<{ company: string; premium: number; sum_insured: number; start_year: number; payment_term: string }[]>([])
  const [baseSum, setBaseSum] = useState<number>(0)
  const [accidentalSum, setAccidentalSum] = useState<number>(0)

  const addExistingInsurance = () => {
    setExistingInsurances([...existingInsurances, { company: '', premium: 0, sum_insured: 0, start_year: new Date().getFullYear(), payment_term: 'Monthly' }])
  }

  const removeExistingInsurance = (index: number) => {
    setExistingInsurances(existingInsurances.filter((_, i) => i !== index))
  }

  const updateExistingInsurance = (index: number, field: string, value: any) => {
    const updated = [...existingInsurances]
    updated[index] = { ...updated[index], [field]: value }
    setExistingInsurances(updated)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      // Append the existing insurances array as a JSON string
      formData.append('existing_insurances', JSON.stringify(existingInsurances))
      await addInsuranceUser(formData)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Add New Client</h1>
        <p className="text-slate-500 mt-2">Enter the client details to onboard them into the CRM.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Submission Error</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <form action={handleSubmit} className="p-8 space-y-8">
          
          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Basic Information
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input name="email" type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input name="phone_number" type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="(555) 123-4567" />
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Category</label>
                <select 
                  required 
                  name="insurance_type" 
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Life">Life Insurance</option>
                  <option value="General">General Insurance</option>
                </select>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Client ID</label>
                <input name="client_id" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="CLI-1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Commencement</label>
                <input name="date_of_commencement" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Status</label>
                <input name="policy_status" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Active, Grace, Lapsed..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Premium Paying Term (Years)</label>
                <input name="premium_paying_term" type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Period (Years)</label>
                <input name="policy_period" type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base Sum Assured</label>
                <input name="base_sum_assured" type="number" value={baseSum || ''} onChange={(e) => setBaseSum(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Accidental Sum Assured</label>
                <input name="accidental_sum_assured" type="number" value={accidentalSum || ''} onChange={(e) => setAccidentalSum(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Sum Assured</label>
                <input name="total_sum_assured" type="number" value={baseSum + accidentalSum || ''} readOnly className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Life/Health Insurance Specifics (Conditional) */}
          {(insuranceType === 'Life' || (insuranceType === 'General' && generalSubCategory === 'Health')) && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  {insuranceType === 'Life' ? 'Life' : 'Health'} Insurance Details (Confidential)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  
                  {insuranceType === 'General' && generalSubCategory === 'Health' && (
                    <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200 mb-2">
                      <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Portability Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Portability Type</label>
                          <select 
                            name="health_portability_type" 
                            value={portability}
                            onChange={(e) => setPortability(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                          >
                            <option value="None">None (New Policy)</option>
                            <option value="External">External (From other company)</option>
                            <option value="Internal">Internal (Upgrade/Downgrade)</option>
                          </select>
                        </div>
                        {portability !== 'None' && (
                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                            <div className="md:col-span-3">
                              <p className="text-xs font-semibold text-slate-500 uppercase">Previous Policy Details</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Previous Company</label>
                              <input name="prev_company" type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Star Health" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Previous Policy Name</label>
                              <input name="prev_policy_name" type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Optima Restore" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Previous Policy No.</label>
                              <input name="prev_policy_number" type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm uppercase" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Aadhar No.</label>
                    <input name="aadhar_no" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2" />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Upload Front Side</label>
                        <input type="file" name="aadhar_document" className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Upload Back Side</label>
                        <input type="file" name="aadhar_back_document" className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">PAN Card No.</label>
                    <input name="pan_card_no" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2" />
                    <label className="block text-xs font-medium text-slate-500 mb-1">Upload PAN</label>
                    <input type="file" name="pan_document" className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  
                  {/* Health / Personal Details */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Life Insured Place of Birth</label>
                    <input name="life_insured_place_of_birth" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Height</label>
                    <input name="height" type="text" placeholder="e.g. 5'10" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weight</label>
                    <input name="weight" type="text" placeholder="e.g. 70kg" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Health Issues</label>
                    <textarea name="health_issues" rows={2} placeholder="None or specify..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Education Qualification</label>
                    <input name="education" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name</label>
                    <input name="mother_name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bank Details (A/C No, IFSC)</label>
                    <input name="bank_details" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mole / Identification Mark</label>
                    <input name="mole" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  
                  {/* Profession Details */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Profession Type</label>
                      <select 
                        name="profession" 
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                      >
                        <option value="Job">Job</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Designation / Role</label>
                      <input name="designation" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <input name="location" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Yearly Income (₹)</label>
                      <input name="yearly_income" type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="md:col-span-2 pt-2 border-t border-slate-100">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {profession === 'Job' ? 'Upload 6 Months Payslip' : 'Upload ITR Document'}
                      </label>
                      <input type="file" name="document_file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    </div>
                    </div>
                  </div>

                  {/* Existing Insurances */}
                  <div className="md:col-span-2 mt-4">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                      <h3 className="font-semibold text-slate-800">Existing Insurance Policies</h3>
                      <button type="button" onClick={addExistingInsurance} className="text-sm flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full font-medium">
                        <Plus className="w-4 h-4 mr-1" /> Add Policy
                      </button>
                    </div>
                    
                    {existingInsurances.length === 0 ? (
                      <p className="text-sm text-slate-500 italic text-center py-4">No existing policies added.</p>
                    ) : (
                      <div className="space-y-4">
                        {existingInsurances.map((ins, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                            <button type="button" onClick={() => removeExistingInsurance(index)} className="absolute top-3 right-3 text-red-500 hover:bg-red-50 p-1.5 rounded-md">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pr-8">
                              <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                                <input value={ins.company} onChange={e => updateExistingInsurance(index, 'company', e.target.value)} type="text" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Premium</label>
                                <input value={ins.premium || ''} onChange={e => updateExistingInsurance(index, 'premium', parseFloat(e.target.value))} type="number" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Sum Insured</label>
                                <input value={ins.sum_insured || ''} onChange={e => updateExistingInsurance(index, 'sum_insured', parseFloat(e.target.value))} type="number" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Start Year</label>
                                <input value={ins.start_year || ''} onChange={e => updateExistingInsurance(index, 'start_year', parseInt(e.target.value))} type="number" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Term</label>
                                <input value={ins.payment_term} onChange={e => updateExistingInsurance(index, 'payment_term', e.target.value)} type="text" placeholder="e.g. Monthly" className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md outline-none" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className="border-slate-100" />
            </>
          )}

          {/* Section: General Insurance Specifics (Conditional) */}
          {insuranceType === 'General' && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  General Insurance Details
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">General Category Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex-1">
                      <input 
                        type="radio" 
                        name="general_sub_category" 
                        value="Health" 
                        checked={generalSubCategory === 'Health'}
                        onChange={() => setGeneralSubCategory('Health')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-slate-800">Health</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex-1">
                      <input 
                        type="radio" 
                        name="general_sub_category" 
                        value="Auto" 
                        checked={generalSubCategory === 'Auto'}
                        onChange={() => setGeneralSubCategory('Auto')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-slate-800">Auto</span>
                    </label>
                  </div>
                </div>

                {generalSubCategory === 'Auto' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-2">Vehicle Details</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Type</label>
                      <select name="auto_vehicle_type" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="2-Wheeler">2-Wheeler</option>
                        <option value="4-Wheeler">4-Wheeler</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Make and Model</label>
                      <input name="auto_make_model" type="text" placeholder="e.g. Honda City" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Registration No (RC Number)</label>
                      <input name="auto_registration_no" type="text" placeholder="e.g. MH01AB1234" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturing Year</label>
                      <input name="auto_mfg_year" type="number" placeholder="YYYY" min="1990" max={new Date().getFullYear()} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Engine Number</label>
                      <input name="auto_engine_no" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Chassis Number</label>
                      <input name="auto_chassis_no" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-2">Policy Specifics</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">RTO Code</label>
                      <input name="auto_rto_code" type="text" placeholder="e.g. MH01" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Insured Declared Value (IDV) ₹</label>
                      <input name="auto_idv" type="number" step="0.01" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Previous NCB (%)</label>
                      <select name="auto_ncb" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="0">0%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="35">35%</option>
                        <option value="45">45%</option>
                        <option value="50">50%</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Location</label>
                      <input name="auto_purchase_location" type="text" placeholder="Dealership / City" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="md:col-span-2 pt-2 border-t border-slate-100 mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload RC / Previous Policy Document
                      </label>
                      <input type="file" name="document_file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    </div>
                  </div>
                )}
                
                {generalSubCategory === 'Health' && (
                  <div className="grid grid-cols-1 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="text-slate-500 italic text-sm">Health specific fields (like Portability and Life details) are handled above.</p>
                  </div>
                )}
              </div>
              <hr className="border-slate-100" />
            </>
          )}

          {/* Section: Payment Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                {insuranceType === 'Life' ? '4' : '3'}
              </span>
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Installment Amount (₹)</label>
                <input required name="amount" type="number" step="0.01" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Frequency</label>
                <select required name="payment_frequency" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Previous Installment Date</label>
                <input name="previous_installment_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Next Installment Date (Optional)</label>
                <input name="next_installment_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>
          
          <hr className="border-slate-100" />

          {/* Nominee Details */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                {insuranceType === 'Life' ? '5' : '4'}
              </span>
              Nominee Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nominee Name</label>
                <input name="nominee_name" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                <input name="nominee_dob" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relation with Insured</label>
                <input name="nominee_relation" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
