---
name: insurance-helper-context
description: Core context and domain logic for the Insurance Helper CRM workspace. Activate this when asked to work on or modify the insurance-helper CRM application.
---

# Insurance Helper CRM Context

This skill provides essential context about the `insurance-helper` Next.js application to ensure any agent working in this repo follows the established domain logic, architecture, and security protocols.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (with Lucide React icons)
- **Database:** Supabase (PostgreSQL) + Supabase Storage (for documents)
- **Form Handling:** Standard HTML `FormData` parsed in Server Actions.

## Domain Model
The CRM manages `insurance_users` across various categories.
1. **Life Insurance:** Base category for term/whole life policies.
2. **General Insurance:** Contains sub-categories.
   - **Auto:** For 2-wheeler and 4-wheeler policies. (Includes fields like `auto_registration_no`, `auto_ncb`, `auto_idv`, etc.)
   - **Health:** Includes specialized fields like `health_portability_type` (Internal, External, None).

### Core Philosophy
- **Individual Columns:** The database relies on strict, individual columns for specific fields rather than dumping unstructured JSON into a single column.
- **Strict Constraints:** The database heavily utilizes `CHECK` constraints on `insurance_type` and sub-categories to prevent invalid data states. Always respect these constraints.

## Audit & History Logging (`history_logs`)
- Every user row has a `history_logs` (JSONB) column array.
- This is an **audit trail**. 
- Whenever an existing client is edited (via `/edit-user/[id]`), the `updateInsuranceUser` server action strictly compares original values against new values (e.g., changes to Premium, Installment Date, Company, Portability). It generates formatted log objects and appends them to this array automatically.
- For new health clients using Portability, initial portability info is manually entered and injected as the first history log.

## Security & Secrets
The Dashboard component has UI logic that restricts visibility and destructive actions using local hardcoded passwords:
- **View Confidential Data:** Requires password `secret123`
- **Delete User:** Requires password `delete123`

## Directory Structure Highlights
- `/src/app/actions.ts`: Contains all Supabase mutations (`addInsuranceUser`, `updateInsuranceUser`, `deleteInsuranceUser`).
- `/src/components/Dashboard.tsx`: Central hub for rendering the client list, search/filter logic, and the detailed user modal (including history timeline).
- `/src/app/add-user/page.tsx` & `/src/app/edit-user/[id]/page.tsx`: Contains the massive forms for onboarding/updating clients. `EditFormClient` is dynamically populated using uncontrolled inputs and a `useEffect` hydration block.
- `/supabase_schema.sql`: Source of truth for database migrations and schema definitions.

## Adjacent Repositories
An adjacent repository exists at `../insurance-landing-page`. It is a Vite/React application representing the public-facing advertising site for the insurance agent, styled with custom Vanilla CSS.
