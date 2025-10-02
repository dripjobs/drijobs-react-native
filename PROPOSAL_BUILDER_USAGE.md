# Proposal Builder - Usage Guide

## How to Access

### Method 1: Create New Proposal
1. Open the app
2. Navigate to **Proposals** from the drawer menu
3. Tap the **"+"** button in the top-right corner of the header
4. You'll be taken to a blank proposal builder

### Method 2: Edit Existing Proposal
1. Open the app
2. Navigate to **Proposals** from the drawer menu
3. Tap on any proposal card in the list
4. A detail modal will appear
5. Tap the **"Open"** button at the bottom
6. You'll be taken to the proposal builder with that proposal's data

## Features Walkthrough

### Tab Navigation
Swipe horizontally or tap on the tab names to switch between:
- **Overview**: Main proposal editor with line items and summary
- **Settings**: Basic proposal information
- **Notes**: Three types of notes (crew, company, client)
- **Comments**: Team collaboration (placeholder)
- **Activity**: Proposal history (placeholder)
- **Video**: Video content (placeholder)
- **Presentation**: Presentation wizard (placeholder)

### Overview Tab

#### Adding Line Items
1. Tap **"Add Item"** button in the Line Items section
2. A modal will slide up from the bottom
3. Fill in:
   - Item Name
   - Description
   - Quantity
   - Unit Price
4. Tap **"Add Item"** to save

#### Adding Optional Items
1. Tap the **"Add Optional Item"** button (dashed border)
2. Same modal as regular items
3. Optional items appear in a separate section with yellow dashed border

#### Removing Items
- Tap the trash icon (🗑️) on any line item to remove it

#### Applying Discounts
1. Tap the **percentage icon (%)** in the Proposal Summary section
2. Choose discount type:
   - **Percentage (%)**: Enter a percentage (e.g., 10 for 10%)
   - **Fixed Amount ($)**: Enter a dollar amount
3. Enter the discount value
4. Tap **"Apply"**
5. The summary updates automatically

#### Removing Discounts
1. Open the discount modal again
2. Set the discount value to 0
3. Tap **"Apply"**

#### Setting Up Deposit
1. Tap the **Deposit** card in Payment Settings
2. Toggle **"Require Deposit"** ON
3. Choose deposit type:
   - **Fixed Amount ($)**: Specific dollar amount
   - **Percentage (%)**: Percentage of total
4. Enter the deposit value
5. Tap **"Save"**

#### Adding Payment Milestones
1. Tap the **"+"** icon on the Payment Schedule card
2. Currently creates a placeholder milestone
3. Tap the trash icon to remove milestones

#### Terms and Conditions
1. Scroll to the Terms and Conditions section
2. Tap in the text area
3. Type your terms and conditions
4. The content saves automatically with the proposal

#### Notes
1. Scroll to the Notes section
2. Tap in the text area
3. Type any additional notes
4. The content saves automatically with the proposal

### Settings Tab

Fill in basic proposal information:
- **Proposal Title**: Name for the proposal
- **Contact Name**: Customer's name
- **Business Name**: Customer's business (if applicable)
- **Valid Until**: Expiration date for the proposal
- **Payment Terms**: Default is "Net 30"

### Notes Tab

Three types of notes for different purposes:

1. **Crew Notes**: 
   - Visible on work orders
   - Instructions for field crews
   
2. **Company Notes**: 
   - Internal only
   - Team notes, reminders, etc.
   
3. **Client Notes**: 
   - Visible on the proposal
   - Additional information for the customer

## Header Actions

### Save Button
- Saves the current proposal
- Shows success alert
- Currently saves to local state only

### Send Button
- Opens confirmation dialog
- Sends proposal to customer
- Currently shows alert only

### Preview Button
- View how the proposal looks to customers
- Not yet implemented

### Back Button (← )
- Returns to proposals list
- **Warning**: Unsaved changes will be lost!

## Quick Tips

### Calculations Are Automatic
- Total updates as you add/remove items
- Discount applies immediately when set
- Deposit calculates based on type and value
- Remaining balance auto-calculates

### Visual Indicators
- **Blue cards**: Standard line items
- **Yellow dashed border**: Optional items
- **Blue/indigo summary**: Proposal totals
- **Green**: Deposit/payment info
- **Red trash icons**: Delete actions

### Modal Controls
- **Tap outside** the modal to close it
- **X button** in top-right to close
- **Cancel** button to close without saving
- **Save/Apply** button to save changes

### Navigation
- **Swipe** the tab bar to see all tabs
- **Tap** any tab to switch to it
- **Active tab** highlighted in blue with underline

## Keyboard Shortcuts (iOS)

When keyboard is open:
- **Return/Enter**: Moves to next field (in modals)
- **Done**: Closes keyboard
- Keyboard appearance matches field type (numeric for numbers, default for text)

## Testing Scenarios

### Scenario 1: Simple Proposal
1. Create new proposal
2. Go to Settings, enter basic info
3. Return to Overview
4. Add 2-3 line items
5. Review the summary
6. Tap Save

### Scenario 2: Proposal with Deposit
1. Create new proposal
2. Add line items (total should be >$1000)
3. Tap Deposit card
4. Enable deposit
5. Choose "Percentage"
6. Enter 50 (for 50%)
7. Save and review the summary

### Scenario 3: Discounted Proposal
1. Create new proposal
2. Add multiple line items
3. Tap the % icon in summary
4. Choose "Percentage"
5. Enter 15 (for 15% discount)
6. Apply and watch the total update

### Scenario 4: Optional Items
1. Create new proposal
2. Add 2 standard items
3. Tap "Add Optional Item"
4. Add 1-2 optional items
5. Notice they appear in separate section
6. See how they're tracked in summary

### Scenario 5: Full Proposal
1. Create new proposal
2. Fill in all Settings
3. Add multiple line items (mix of standard and optional)
4. Apply a discount
5. Set up a deposit
6. Add milestone payments
7. Enter terms and conditions
8. Add all three types of notes
9. Review all tabs
10. Save the proposal

## Troubleshooting

### Modal Won't Open
- Make sure you're tapping the button (not just near it)
- Try tapping again
- If stuck, navigate away and back

### Keyboard Blocking Input
- Scroll the modal content
- The modal should automatically adjust
- Close and reopen if needed

### Numbers Not Calculating
- Make sure you entered valid numbers (no letters)
- Decimal values should use a dot (.) not comma
- Very large numbers might need rounding

### Changes Not Saving
- Make sure to tap the Save button in the header
- Currently no auto-save implemented
- Navigating away will lose changes

### Can't See All Tabs
- Swipe left on the tab bar to see more
- Tab bar scrolls horizontally

## Future Features (Not Yet Available)

The following are planned but not yet implemented:

- ❌ Backend data persistence
- ❌ Actual date pickers (currently text input)
- ❌ Form validation
- ❌ Image/file attachments
- ❌ Rich text editing
- ❌ Production rates calculation
- ❌ Packaged pricing options
- ❌ Customer profile sidebar
- ❌ PDF generation/preview
- ❌ Email sending integration
- ❌ E-signature capture
- ❌ Payment processing
- ❌ Templates library
- ❌ Comments with replies
- ❌ Activity tracking
- ❌ Video uploads

## Feedback

This is the initial implementation. Key areas to test:
1. Usability on your device size
2. Modal interactions
3. Calculation accuracy
4. Tab navigation smoothness
5. Overall workflow for creating proposals

Any issues or suggestions should be noted for future iterations!

