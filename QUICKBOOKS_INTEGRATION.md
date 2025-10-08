# QuickBooks Online Integration Guide

## Overview

The DripJobs QuickBooks Online integration provides seamless synchronization of customers, invoices, payments, and recurring jobs between DripJobs and QuickBooks Online. This integration follows accounting best practices and is designed to meet the needs of bookkeepers and accountants.

## Features

### 1. Customer Synchronization
- **Businesses**: Synced as parent customers in QuickBooks
- **Contacts**: Synced as sub-customers under their associated business
- **Hierarchy**: Maintains business-to-contact relationships for accurate billing

### 2. Invoice Synchronization
- **Delayed Creation**: Invoices are NOT created in QuickBooks when a proposal is accepted
- **Job-Triggered**: Invoices are created when a job reaches the configured status (e.g., "In Progress")
- **Accrual Accounting**: Complies with accrual-based accounting principles

### 3. Payment Synchronization
- **Immediate Sync**: All payments sync immediately for accurate cash flow tracking
- **Invoice Linking**: Payments are automatically linked to their corresponding invoices
- **Payment Methods**: Supports multiple payment methods

### 4. Recurring Jobs
- **Recurring Transactions**: Creates recurring transaction templates in QuickBooks
- **Automatic Generation**: Each instance creates an individual invoice when the job starts
- **Customer Association**: All instances linked to the same parent business customer

### 5. Sync Status Indicators
- Visual badges throughout the app showing sync status:
  - ✅ **Synced**: Successfully synced to QuickBooks
  - 🕐 **Pending**: Waiting to sync
  - ⚠️ **Error**: Sync failed
  - ⭕ **Not Synced**: Not yet synced

### 6. User Role Management
- **Administrator**: Full access to all features
- **Accountant/Bookkeeper**: Read-only access to QuickBooks-synced data

## Setup Instructions

### Prerequisites
1. Active QuickBooks Online account
2. QuickBooks Online company
3. DripJobs account with admin privileges

### Step 1: Connect to QuickBooks

1. Navigate to **Settings** → **Account Settings**
2. Select the **Integrations** tab
3. Find the **QuickBooks Online** section
4. Click **Connect to QuickBooks**
5. Log in to your QuickBooks account
6. Authorize DripJobs to access your QuickBooks data
7. You'll be redirected back to DripJobs with a success message

### Step 2: Configure Sync Settings

Once connected, configure your sync preferences:

#### Auto-Sync
- **Enabled (Default)**: Automatically sync data to QuickBooks in real-time
- **Disabled**: Manual sync only

#### Entity Sync Toggles
- ✅ **Sync Customers**: Sync contacts and businesses
- ✅ **Sync Invoices**: Sync invoices when jobs start
- ✅ **Sync Payments**: Immediately sync all payments
- ✅ **Sync Recurring Jobs**: Create recurring transactions in QuickBooks

#### Job Status Trigger
- Set the job status that triggers invoice creation (default: "In Progress")
- Example values: "In Progress", "Started", "Active"

### Step 3: Initial Sync

1. After configuration, perform a **Force Full Sync**
2. This will sync all existing data to QuickBooks
3. Monitor the sync logs for any errors
4. Resolve any conflicts or errors before proceeding

### Step 4: Ongoing Use

The integration will now:
- Automatically sync new data based on your settings
- Display sync status badges throughout the app
- Log all sync activities for audit purposes

## Understanding the Customer Hierarchy

### Business as Parent Customer
When you create or update a business in DripJobs:
- The business is created as a **parent customer** in QuickBooks
- Company name, address, and contact details are synced
- The business remains the top-level entity for billing

### Contacts as Sub-Customers
When you create or update a contact linked to a business:
- The contact is created as a **sub-customer** in QuickBooks
- The contact is linked to the parent business customer
- Invoices can be issued to the sub-customer while rolling up to the parent

### Primary Contact
- Each business should have a designated **primary contact**
- The primary contact is used for billing information
- This ensures consistent billing across multiple jobs for the same business

## Invoice Creation Workflow

### Proposal Accepted → No Immediate Invoice
When a proposal is accepted in DripJobs:
1. The proposal is stored locally in DripJobs
2. **NO invoice is created in QuickBooks yet**
3. The proposal status shows as "Accepted" but "Not Synced"

### Job Starts → Invoice Created
When the job status changes to your configured trigger (e.g., "In Progress"):
1. DripJobs checks if the business exists in QuickBooks (creates if needed)
2. Checks if the primary contact exists as sub-customer (creates if needed)
3. Creates the invoice in QuickBooks linked to the sub-customer
4. Stores the QuickBooks Invoice ID locally
5. Updates the sync status badge to "Synced"

### Why This Approach?
- **Accrual Accounting Compliance**: Revenue is recognized when work begins, not when contracted
- **Cash Flow Accuracy**: Prevents premature revenue recognition
- **Bookkeeper-Friendly**: Aligns with standard accounting practices

## Payment Synchronization

### Immediate Sync
All payments are synced immediately when recorded:
1. Payment recorded in DripJobs
2. Finds or creates customer in QuickBooks
3. Finds linked invoice in QuickBooks
4. Creates payment record in QuickBooks
5. Links payment to invoice
6. Updates local record with QuickBooks Payment ID

### Payment Types
- One-time payments
- Progress payments
- Final payments
- Refunds (marked as credit memos)

## Accountant/Bookkeeper Access

### Creating Accountant Access
1. Navigate to **Settings** → **Account Settings** → **Integrations**
2. Under **User Access**, find **Switch Role**
3. Select **Accountant/Bookkeeper** role
4. The user will now have read-only access

### Accountant Role Capabilities
- ✅ View all QuickBooks-synced data
- ✅ View sync status and history
- ✅ Export reconciliation reports
- ✅ View audit logs
- ❌ Cannot create, edit, or delete records
- ❌ Cannot change sync settings
- ❌ Cannot disconnect QuickBooks

### Use Case
Perfect for external bookkeepers who need to:
- Reconcile transactions
- Verify sync status
- Generate reports
- Audit financial data

## Sync Status Reference

### Synced ✅
- Entity successfully synced to QuickBooks
- QuickBooks ID stored locally
- Last sync timestamp available
- Click badge to view details

### Pending 🕐
- Entity queued for sync
- Will sync based on your settings
- No action required

### Error ⚠️
- Sync failed
- Click badge to view error details
- Common causes:
  - Missing required fields
  - QuickBooks API rate limit
  - Network connection issues
  - Duplicate record conflicts

### Not Synced ⭕
- Entity not yet synced
- May be intentional (e.g., proposals before job start)
- Enable auto-sync or manually trigger sync

## Manual Sync Actions

### Force Full Sync
- Syncs all pending items immediately
- Useful after initial setup
- Use when catching up after downtime

### Entity-Specific Sync
- Sync only customers, invoices, or payments
- Useful for troubleshooting
- Available in sync settings

### Retry Failed Syncs
- Automatically retries failed syncs after 1 hour
- Manual retry available in sync logs
- Review error messages before retrying

## Troubleshooting

### Connection Issues
**Problem**: "Failed to connect to QuickBooks"
**Solution**:
1. Verify QuickBooks account is active
2. Check internet connection
3. Try disconnecting and reconnecting
4. Clear app cache and retry

### Sync Errors
**Problem**: "Sync failed" badge on entities
**Solution**:
1. Click the badge to view error details
2. Common fixes:
   - Add missing required fields (e.g., customer name)
   - Resolve duplicate customer names in QuickBooks
   - Check QuickBooks subscription includes API access
3. Retry sync after fixing issues

### Token Expiration
**Problem**: "Token expired" error
**Solution**:
- The app will automatically refresh tokens
- If persistent, disconnect and reconnect to QuickBooks

### Rate Limiting
**Problem**: "Too many requests" error
**Solution**:
- QuickBooks limits API requests per minute
- The app will automatically retry after delay
- Consider reducing sync frequency in settings

## Best Practices

### 1. Initial Setup
- Connect QuickBooks before creating data
- Perform full sync during off-hours
- Review sync logs for errors before going live

### 2. Data Entry
- Always set a primary contact for businesses
- Use consistent naming conventions
- Fill in all required fields before saving

### 3. Reconciliation
- Review sync status daily
- Export sync logs monthly for audit
- Grant accountant access to external bookkeepers

### 4. Job Status Naming
- Use consistent job status names
- Match the configured trigger status exactly
- Avoid special characters in status names

### 5. Testing
- Use QuickBooks Sandbox for testing (dev/staging only)
- Test sync flows before production use
- Verify sync status after major changes

## Support

### Common Questions

**Q: Can I sync historical data?**
A: Yes, use "Force Full Sync" after initial connection to sync all existing data.

**Q: What happens if I disconnect QuickBooks?**
A: Sync status will show "Not Connected". Historical sync data is preserved but no new syncs will occur.

**Q: Can I sync to multiple QuickBooks companies?**
A: No, each DripJobs account connects to one QuickBooks company at a time.

**Q: How often does auto-sync run?**
A: Real-time (immediate) by default, or configure hourly/daily intervals.

**Q: Are deleted records synced?**
A: No, deletions are not synced. Mark records as inactive instead.

### Getting Help

For additional support:
1. Check the sync logs in Settings → Integrations
2. Review error messages in sync badges
3. Contact support with sync log details
4. Provide QuickBooks company ID for faster resolution

## Security & Privacy

### Data Security
- OAuth 2.0 for secure authentication
- Tokens encrypted at rest
- No QuickBooks credentials stored
- API requests over HTTPS only

### Permissions
- Read/Write access to Customers
- Read/Write access to Invoices
- Read/Write access to Payments
- Read access to Company Info

### Data Retention
- Sync logs retained for 90 days
- QuickBooks IDs stored indefinitely
- Token auto-refresh for continuous access

## Updates & Maintenance

### System Updates
- QuickBooks API updates handled automatically
- App updates include integration improvements
- No action required for most updates

### Breaking Changes
- Advance notice provided for major changes
- Migration guides provided when needed
- Backwards compatibility maintained when possible
