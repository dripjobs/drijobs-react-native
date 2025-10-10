# Business Creation Flow - Visual Guide

## How to Create a Business

### 1. Access the Creation Flow

**From the Businesses Page:**
- Look for the **[+]** button in the top right corner of the header (next to the filter icon)
- Tap the plus button to open the business creation wizard

```
┌────────────────────────────────────┐
│ ≡  Businesses         [+] [Filter] │ ← Tap the [+] button
└────────────────────────────────────┘
    ↓
Create Business Modal Opens
```

---

## Step-by-Step Wizard

### Step 1: Business Information
**Required Fields:**
- Legal Business Name *
- Industry * (select from 19 options)
- Business Email *
- Business Phone *

**Optional Fields:**
- DBA (Doing Business As)
- Website

**Industry Options:**
```
[Construction]  [Roofing]         [HVAC]
[Plumbing]      [Electrical]      [Landscaping]
[Painting]      [Cleaning Svcs]   [Home Services]
[Property Mgmt] [Real Estate]     [Retail]
[Technology]    [Healthcare]      [Education]
[F&B]           [Manufacturing]   [Prof Services]
[Other]
```

**Validation:**
- ✓ Business name cannot be empty
- ✓ Email must be valid format (user@domain.com)
- ✓ Phone must be entered
- ✓ Industry must be selected

**Actions:**
- [Next →] - Validates and proceeds to Step 2

---

### Step 2: Primary Contact (REQUIRED)
**Why Primary Contact?**
> Every business must have a primary contact. When a business becomes a deal, the primary contact receives all communications.

**Two Options:**

#### Option A: Create New Contact
```
Toggle: [● Create New] [ Search Existing]

Fields:
├─ First Name *
├─ Last Name *
├─ Email *
└─ Phone *
```

#### Option B: Search Existing Contact
```
Toggle: [ Create New] [● Search Existing]

[🔍 Search by name, email, or phone...]

Results:
┌───────────────────────────────┐
│ 👤 Sarah Wilson               │
│    sarah.wilson@email.com     │
│    +1 (555) 123-4567         │
└───────────────────────────────┘
┌───────────────────────────────┐
│ 👤 Mike Chen                  │
│    mike@email.com             │
│    +1 (555) 987-6543         │
└───────────────────────────────┘
```

**Validation:**
- ✓ If creating: All fields required and email must be valid
- ✓ If searching: Must select a contact

**Actions:**
- [← Back] - Returns to Step 1
- [Next →] - Validates and proceeds to Step 3

---

### Step 3: Billing Address (Optional)
**Option to Use Business Address:**
```
☑ Use business address for billing
```

**If Unchecked, Enter Custom Address:**
```
Street Address:
└─ [123 Main St]

City:                    State:
└─ [Austin]              └─ [TX]

ZIP Code:                Country:
└─ [78701]               └─ [United States]
```

**Info:**
> 💡 You can skip this step and add a billing address later from the business details page.

**Actions:**
- [← Back] - Returns to Step 2
- [Next →] - Proceeds to Step 4 (no validation required)

---

### Step 4: Additional Contacts (Optional)
**Add Multiple Contacts with Roles**

**Example: Billing Manager**
```
[+ Add Contact]

When clicked, shows form:
┌────────────────────────────────┐
│ First Name *: [Jane]            │
│ Last Name *:  [Doe]             │
│ Email *:      [jane@business]   │
│ Phone *:      [+1 555 123]      │
│                                 │
│ Role *:                         │
│ [Owner] [Manager] [●Billing Mgr]│
│ [Accts Pay] [Accts Recv] [Ops]  │
│ [Project Mgr] [Supervisor]...   │
│                                 │
│ [Cancel] [Add Contact]          │
└────────────────────────────────┘
```

**Added Contacts Display:**
```
┌────────────────────────────────┐
│ 👤 Jane Doe                  ✕ │
│    jane@business.com            │
│    [Billing Manager]            │
└────────────────────────────────┘
```

**Available Roles:**
- Owner
- Manager
- **Billing Manager** ⭐
- Accounts Payable
- Accounts Receivable
- Operations Manager
- Project Manager
- Supervisor
- Foreman
- Sales Representative
- Accountant
- Administrative Assistant
- Other

**Info:**
> 👥 You can add more contacts later. Common roles include Billing Manager, Operations Manager, and Accounts Payable.

**Actions:**
- [← Back] - Returns to Step 3
- [Create Business] - Creates the business with all entered data

---

## Progress Indicator

The modal shows progress at the top:

```
┌─────────────────────────────────────────────┐
│    (1)─────(2)─────(3)─────(4)              │
│  Business Primary Billing Contacts           │
│    Info   Contact Address                    │
└─────────────────────────────────────────────┘

Active step: Filled purple circle with white number
Completed step: Line connecting filled circles
Future step: Gray circle with gray number
```

---

## Real-World Use Cases

### Use Case 1: Property Management Company
```
Step 1: Business Info
  Name: "Greenfield Properties LLC"
  DBA: "Greenfield Mgmt"
  Industry: Property Management
  Email: info@greenfield.com
  Phone: +1 (555) 100-2000

Step 2: Primary Contact
  Create New:
    John Smith (Owner)
    john@greenfield.com

Step 3: Billing Address
  ☑ Use business address

Step 4: Additional Contacts
  + Sarah Johnson - Billing Manager
    sarah@greenfield.com
  + Mike Chen - Operations Manager
    mike@greenfield.com
```

### Use Case 2: Construction Company
```
Step 1: Business Info
  Name: "Acme Construction Inc."
  DBA: "Acme Builders"
  Industry: Construction
  Email: info@acmecon.com
  Phone: +1 (555) 200-3000

Step 2: Primary Contact
  Search Existing:
    Select: Robert Martinez (existing contact)

Step 3: Billing Address
  Custom:
    Street: 500 Industrial Blvd
    City: Austin, State: TX
    ZIP: 78701

Step 4: Additional Contacts
  + Lisa Thompson - Accounts Payable
    lisa@acmecon.com
  + David Kim - Project Manager
    david@acmecon.com
```

---

## Success Flow

After clicking "Create Business":
1. Loading state: Button shows "Creating..."
2. API call simulated (1.5 seconds)
3. Success alert appears:
   ```
   ┌────────────────────────────┐
   │         Success!            │
   │                            │
   │  Greenfield Properties LLC │
   │  has been created          │
   │  successfully!             │
   │                            │
   │           [OK]             │
   └────────────────────────────┘
   ```
4. Modal closes and returns to Businesses page
5. New business appears in the list

---

## Discard Changes Confirmation

If user clicks [X] to close modal after entering data:
```
┌────────────────────────────┐
│   Discard Changes?         │
│                            │
│  Are you sure you want to  │
│  discard this business?    │
│                            │
│  [Cancel]  [Discard]       │
└────────────────────────────┘
```

---

## Key Features Summary

✅ **Multi-Step Wizard** - Breaks complex form into manageable steps
✅ **Required Primary Contact** - Ensures proper communication flow
✅ **Flexible Contact Entry** - Create new or search existing
✅ **Role-Based Organization** - Assign specific roles like "Billing Manager"
✅ **Optional Fields** - Skip billing address and additional contacts
✅ **Form Validation** - Real-time validation with helpful error messages
✅ **Progress Tracking** - Visual step indicator shows progress
✅ **Smart Navigation** - Back/Next buttons with validation
✅ **Confirmation Dialogs** - Prevent accidental data loss
✅ **Professional UI** - Clean, modern interface matching app design

---

## Business Logic

### Why Primary Contact is Required
1. **Deal Communication**: When a business record becomes a deal, the system needs to know who to contact
2. **Relationship Management**: Businesses are governed by contacts - they don't exist in isolation
3. **Data Integrity**: Ensures every business has at least one point of contact

### Contact Roles Importance
- **Billing Manager**: Receives invoices and payment communications
- **Operations Manager**: Handles day-to-day operations
- **Accounts Payable**: Processes payments
- **Project Manager**: Oversees specific projects

### Business vs Contact Entity
```
Business Entity
├─ Legal Name, DBA, Industry
├─ Contact Information (general)
├─ Billing Address
└─ Governed by Contacts
    ├─ Primary Contact (required) → Receives deal communications
    └─ Additional Contacts (optional)
        ├─ Billing Manager → Payment flows
        ├─ Operations Manager → Daily operations
        └─ Other Roles → Specific functions
```

---

## Developer Notes

### Mock Data
Currently uses mock contact data for search functionality:
```typescript
const allContacts = [
  { id: 101, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', ... },
  { id: 102, name: 'Mike Chen', email: 'mike@email.com', ... },
  // ... more contacts
];
```

### API Integration Points
1. **Create Business**: POST /api/businesses
2. **Search Contacts**: GET /api/contacts?search={query}
3. **Create Contact**: POST /api/contacts
4. **Link Contact to Business**: POST /api/businesses/{id}/contacts

### State Structure
```typescript
businessData: {
  name, dba, industry, email, phone, website
}
primaryContact: Contact | ContactFormData
billingAddress: Address
additionalContacts: Contact[]
```

---

## Summary

This business creation flow provides a comprehensive, user-friendly way to create business entities with all necessary information. The wizard approach makes complex data entry feel simple, while enforcing critical requirements like the primary contact. The role-based contact system enables proper communication routing, especially important for billing and deal management workflows.

