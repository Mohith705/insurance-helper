const fs = require('fs');

let content = fs.readFileSync('src/app/actions.ts', 'utf-8');

// Function to calculate next installment date
const calcLogic = `
function calculateNextInstallmentDate(prevDateStr, frequency) {
  if (!prevDateStr) return null;
  const date = new Date(prevDateStr);
  if (isNaN(date.getTime())) return prevDateStr;
  
  if (frequency === 'Monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === 'Quarterly') {
    date.setMonth(date.getMonth() + 3);
  } else if (frequency === 'Half Yearly') {
    date.setMonth(date.getMonth() + 6);
  } else if (frequency === 'Yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split('T')[0];
}
`;

if (!content.includes('calculateNextInstallmentDate')) {
  content = content.replace("import { redirect } from 'next/navigation'", "import { redirect } from 'next/navigation'\n" + calcLogic);
}

// Replaces in addInsuranceUser
content = content.replace(
  "next_installment_date: formData.get('next_installment_date') as string,",
  "next_installment_date: calculateNextInstallmentDate(prevDate ? prevDate : (formData.get('date_of_commencement') as string), formData.get('payment_frequency') as string) || (formData.get('next_installment_date') as string),"
);

// Add new fields to addInsuranceUser
const newFields = `
    client_id: formData.get('client_id') as string || null,
    date_of_commencement: formData.get('date_of_commencement') as string || null,
    policy_status: formData.get('policy_status') as string || null,
    premium_paying_term: formData.get('premium_paying_term') ? parseInt(formData.get('premium_paying_term') as string) : null,
    policy_period: formData.get('policy_period') ? parseInt(formData.get('policy_period') as string) : null,
    base_sum_assured: formData.get('base_sum_assured') ? parseFloat(formData.get('base_sum_assured') as string) : null,
    accidental_sum_assured: formData.get('accidental_sum_assured') ? parseFloat(formData.get('accidental_sum_assured') as string) : null,
    total_sum_assured: formData.get('total_sum_assured') ? parseFloat(formData.get('total_sum_assured') as string) : null,
    life_insured_place_of_birth: formData.get('life_insured_place_of_birth') as string || null,
`;
content = content.replace("aadhar_no: formData.get('aadhar_no') as string || null,", newFields + "    aadhar_no: formData.get('aadhar_no') as string || null,");

// Remove nominee_place_of_birth
content = content.replace("nominee_place_of_birth: formData.get('nominee_place_of_birth') as string || null,", "");

// Handle multiple document uploads for Aadhar and PAN
const uploadLogic = `
  const aadharFile = formData.get('aadhar_document') as File;
  if (aadharFile && aadharFile.size > 0) {
    const fileExt = aadharFile.name.split('.').pop()
    const fileName = \`\${data.policy_number}-aadhar-\${Date.now()}.\${fileExt}\`
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, aadharFile)
    if (!uploadError) {
      data.aadhar_document_url = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl
    }
  }

  const panFile = formData.get('pan_document') as File;
  if (panFile && panFile.size > 0) {
    const fileExt = panFile.name.split('.').pop()
    const fileName = \`\${data.policy_number}-pan-\${Date.now()}.\${fileExt}\`
    const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, panFile)
    if (!uploadError) {
      data.pan_document_url = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl
    }
  }
`;
content = content.replace("  // Handle file upload if present", uploadLogic + "\n  // Handle file upload if present");

fs.writeFileSync('src/app/actions.ts', content);
