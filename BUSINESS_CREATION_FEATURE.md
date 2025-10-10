# Business Creation Feature

## Overview
This document describes the comprehensive business creation flow that allows users to create business entities with required primary contacts, optional billing addresses, and multiple associated contacts with roles.

## Architecture

### Components Created

#### 1. CreateBusinessModal (`components/CreateBusinessModal.tsx`)
A multi-step wizard modal that guides users through creating a business entity.

**Steps:**
1. **Business Information** - Core business details
2. **Primary Contact** - Required contact (create new or search existing)
3. **Billing Address** - Optional billing information
4. **Additional Contacts** - Optional multiple contacts with roles

### Key Features

#### Business Entity Requirements
- **Legal Business Name** (required)
- **DBA** (Doing Business As) - Optional
- **Industry** (required) - Selectable from 19 industry options
- **Business Email** (required)
- **Business Phone** (required)
- **Website** (optional)

#### Primary Contact (Required)
Every business MUST have a primary contact. This is critical because:
- When a business becomes a "deal", the primary contact receives all communications
- Users can either:
  - **Create New Contact**: Enter first name, last name, email, and phone
  - **Search Existing Contact**: Search through existing contacts and select one

#### Billing Address (Optional)
- Users can add a billing address for invoices and payments
- Option to use the same address as the business
- Fields include: Street, City, State, ZIP, Country

#### Additional Contacts (Optional)
- Users can add multiple contacts to the business
- Each contact requires:
  - First Name, Last Name, Email, Phone
  - **Role**: Assigned from predefined roles including:
    - Owner
    - Manager
    - **Billing Manager**
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

## Integration with Businesses Page

### Header Button
The "New Business" action has been added as a header button on the businesses page:
- Icon: Plus (+) icon in white
- Location: Top right corner of the header, next to the Filter button
- Color: White on purple gradient background
- Behavior: Opens CreateBusinessModal directly

### User Flow
1. User navigates to the Businesses page
2. Taps the [+] button in the top right corner of the header
3. Goes through the 4-step wizard:
   - Step 1: Enter business information
   - Step 2: Create/select primary contact
   - Step 3: Add billing address (optional)
   - Step 4: Add additional contacts (optional)
4. Reviews and creates the business
5. Success confirmation with the business name

## Form Validation

### Step 1 Validation
- Business name is required
- Email is required and must be valid format
- Phone is required
- Industry must be selected

### Step 2 Validation
- If creating new contact:
  - First name is required
  - Last name is required
  - Email is required and must be valid
  - Phone is required
- If searching existing contact:
  - A contact must be selected

### Step 4 Validation (for each additional contact)
- First name is required
- Last name is required
- Email is required and must be valid
- Phone is required
- Role must be selected

## User Experience Features

### Multi-Step Progress Indicator
- Visual step indicator showing current step
- Steps are highlighted as user progresses
- Connecting lines show completion status

### Smart Navigation
- "Back" button to return to previous steps
- "Next" button validates current step before proceeding
- "Create Business" button on final step
- Discard confirmation if user closes modal mid-creation

### Contact Management
- Search functionality for existing contacts
- Visual feedback for selected contacts
- Ability to add/remove additional contacts
- Role tags for easy identification

### Responsive UI
- Clean, modern interface with consistent styling
- Color-coded elements (e.g., industry chips, role tags)
- Error messages displayed inline with form fields
- Loading states for async operations

## Technical Implementation

### State Management
The modal manages complex state including:
- Current step (1-4)
- Business data
- Primary contact data (create or search mode)
- Billing address
- Additional contacts array
- Form validation errors
- UI states (saving, form visibility)

### Contact Search
- Real-time search filtering
- Search by name, email, or phone
- Visual selection feedback
- Mock data for demonstration (to be replaced with API)

### Form Reset
- Comprehensive reset function clears all state
- Called on successful creation or when user discards

## Future Enhancements

### API Integration
Currently uses mock data and setTimeout for simulated API calls. Future implementation should:
1. Connect to actual business creation API endpoint
2. Fetch real contacts for search functionality
3. Handle API errors gracefully
4. Implement proper loading states

### Additional Features
- Business logo upload
- Tax ID/EIN field
- Business type (LLC, Corporation, etc.)
- Multiple addresses (shipping, billing, physical)
- Notes/tags for business
- Import from QuickBooks or other systems

### Contact Management
- Create new contacts directly from business creation
- Link to existing contact detail pages
- View contact history with business
- Assign multiple roles per contact

## Business Logic Rules

### Primary Contact Rules
1. Every business MUST have exactly one primary contact
2. The primary contact can be:
   - A newly created contact
   - An existing contact from the system
3. The primary contact receives all deal communications
4. Primary contact role is automatically set to "Primary Contact"

### Contact Roles
- Multiple contacts can have the same role
- A contact can only have one role per business
- Special roles like "Billing Manager" are important for payment workflows
- Roles help organize communication and responsibilities

### Billing Address
- Billing address is optional at creation time
- Can be added/edited later from business details
- If not set, system can fall back to business address

## Files Modified

### New Files
- `/components/CreateBusinessModal.tsx` - Main business creation modal component

### Modified Files
- `/app/(tabs)/businesses.tsx` - Added integration for business creation
  - Imported CreateBusinessModal
  - Added showCreateBusiness state
  - Added handleCreateBusiness handler
  - Added Plus button to header (next to Filter button)
  - Added CreateBusinessModal to render tree
  - Added headerButtons style for button grouping

## Usage Example

```typescript
// In businesses.tsx
const [showCreateBusiness, setShowCreateBusiness] = useState(false);

const handleCreateBusiness = () => {
  setShowCreateBusiness(true);
};

// In header render
<View style={styles.headerButtons}>
  <TouchableOpacity 
    style={styles.headerButton}
    onPress={handleCreateBusiness}
  >
    <Plus size={20} color="#FFFFFF" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.headerButton}>
    <Filter size={20} color="#FFFFFF" />
  </TouchableOpacity>
</View>

// In modal render
<CreateBusinessModal 
  visible={showCreateBusiness}
  onClose={() => setShowCreateBusiness(false)}
/>
```

## Styling Approach

- Consistent color scheme with the app (Purple/Indigo primary)
- White cards with subtle shadows for depth
- Blue accents for selected/active states
- Red for errors and delete actions
- Green for success states (create button)
- Responsive spacing and typography
- Touch-friendly button sizes (minimum 44x44 points)

## Accessibility Considerations

- Clear labels for all form fields
- Error messages are descriptive
- Visual feedback for all interactions
- Adequate color contrast
- Touch targets meet minimum size requirements
- Keyboard navigation friendly (for supported devices)

## Summary

The business creation feature provides a comprehensive, user-friendly way to create business entities with all necessary information. The multi-step wizard approach breaks down the complex task into manageable pieces, while the requirement for a primary contact ensures proper communication flow when businesses become deals. The feature is fully integrated with the existing businesses page and follows established design patterns in the application.

