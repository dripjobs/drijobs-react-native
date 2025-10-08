# Accountant/Bookkeeper Access Guide

## Overview

DripJobs provides a special **Accountant/Bookkeeper** role designed for external accountants, bookkeepers, or financial professionals who need read-only access to QuickBooks-synced data for reconciliation and reporting purposes.

## Purpose

The Accountant role is specifically designed for:
- External bookkeepers who manage QuickBooks for multiple clients
- Accountants who need to reconcile transactions
- Financial auditors who need to verify sync status
- Tax preparers who need access to financial records

## What Accountants Can Do

### ✅ View Access
- View all customers (businesses and contacts)
- View all invoices and invoice details
- View all payments and payment history
- View all QuickBooks sync status indicators
- View sync logs and audit trails
- Export financial reports
- See last sync timestamps
- View QuickBooks IDs for all synced entities

### ✅ Reconciliation Features
- Verify which entities are synced to QuickBooks
- Check sync status (synced, pending, error, not synced)
- Review error messages for failed syncs
- View sync history and timestamps
- Export reconciliation reports
- Access audit logs of all sync activities

### ✅ Navigation
- Access all financial screens (invoices, payments, work orders)
- Navigate between customers and related invoices
- View business-to-contact relationships
- Access recurring job information

## What Accountants Cannot Do

### ❌ No Modification Rights
- Cannot create new customers, invoices, or payments
- Cannot edit existing records
- Cannot delete any data
- Cannot change sync settings
- Cannot connect or disconnect QuickBooks
- Cannot force manual syncs
- Cannot assign roles to other users
- Cannot modify company settings

### ❌ No QuickBooks Control
- Cannot access QuickBooks connection settings
- Cannot view QuickBooks credentials
- Cannot change sync frequency
- Cannot enable/disable entity syncs
- Cannot configure job status triggers

## How to Grant Accountant Access

### For Administrators:

1. **Navigate to Settings**
   - Open DripJobs app
   - Go to Settings → Account Settings
   - Select the **Integrations** tab

2. **Locate User Access Section**
   - Scroll to "User Access" section
   - Find the role management area

3. **Switch Role**
   - Current role displays (usually "Administrator")
   - Click "Switch to Accountant Role"
   - Confirm the role change

4. **Provide Credentials**
   - Share the login credentials with your accountant/bookkeeper
   - Inform them they have read-only access

5. **Important Notes**
   - In production, this would be a proper multi-user system
   - Currently implemented as role switching for demonstration
   - Full implementation would include:
     - Invite system via email
     - Individual user accounts
     - Permission management
     - User activity tracking

## Using DripJobs as an Accountant

### First-Time Setup

1. **Log In**
   - Use credentials provided by business owner
   - App will display read-only notice

2. **Verify QuickBooks Connection**
   - Go to Settings → Account Settings → Integrations
   - Verify QuickBooks is connected
   - Note the company name and last sync time

3. **Familiarize Yourself with Sync Badges**
   - Look for colored badges throughout the app:
     - 🟢 **Green (Synced)**: Successfully synced to QuickBooks
     - 🟡 **Yellow (Pending)**: Waiting to sync
     - 🔴 **Red (Error)**: Sync failed, requires attention
     - ⚪ **Gray (Not Synced)**: Not yet synced (may be intentional)

### Daily Reconciliation Workflow

#### Step 1: Review Sync Status
1. Navigate to Invoices screen
2. Review sync badges for all invoices
3. Note any red error badges
4. Click badges to view error details

#### Step 2: Verify Customer Hierarchy
1. Go to Businesses screen
2. Verify businesses show "Synced" status
3. Navigate to Contacts
4. Verify contacts linked to correct businesses
5. Confirm primary contacts are marked

#### Step 3: Reconcile Invoices
1. Open QuickBooks Online
2. Go to DripJobs invoices list
3. For each invoice:
   - Click sync badge to get QuickBooks ID
   - Find matching invoice in QuickBooks by ID
   - Verify amounts match
   - Verify customer assignment is correct
   - Check dates match

#### Step 4: Reconcile Payments
1. Review payments in DripJobs
2. For each payment:
   - Note sync status
   - Get QuickBooks ID from badge
   - Find in QuickBooks
   - Verify amount and date
   - Confirm linked to correct invoice

#### Step 5: Handle Errors
1. Review all items with error badges
2. Document error messages
3. Report to business owner with:
   - Entity type (customer, invoice, payment)
   - Entity identifier
   - Error message
   - Recommended fix

### Monthly Reconciliation Checklist

- [ ] All customers synced without errors
- [ ] All invoices for the month synced
- [ ] All payments for the month synced
- [ ] No pending syncs older than 1 hour
- [ ] Customer hierarchy matches QuickBooks
- [ ] Payment totals match QuickBooks
- [ ] Invoice totals match QuickBooks
- [ ] Recurring jobs creating invoices correctly
- [ ] No duplicate records in QuickBooks

### Understanding Sync Status

#### Synced ✅
**What it means:** Entity successfully synced to QuickBooks

**What to do:**
- Nothing required
- QuickBooks ID available for reference
- Can verify in QuickBooks using ID

**Example:**
```
Status: Successfully synced to QuickBooks
Last Synced: 2 hours ago
QuickBooks ID: 123
```

#### Pending 🕐
**What it means:** Entity waiting to sync based on configured schedule

**What to do:**
- Wait for auto-sync to complete
- If pending > 1 hour, report to admin
- Check that auto-sync is enabled

**Example:**
```
Status: Waiting to sync to QuickBooks
Queued: 5 minutes ago
```

#### Error ⚠️
**What it means:** Sync failed, needs attention

**What to do:**
1. Click badge to view error details
2. Common errors and fixes:
   - **"Duplicate name exists"**: Customer name already in QuickBooks
     - Solution: Admin needs to rename or merge customers
   - **"Customer not found"**: Referenced customer doesn't exist
     - Solution: Sync customer first, then retry invoice
   - **"Invalid reference"**: Referenced entity ID invalid
     - Solution: Admin needs to fix reference
   - **"Rate limit exceeded"**: Too many API calls
     - Solution: Wait 1 minute, retry automatically

3. Document error and report to admin

**Example:**
```
Status: Sync failed
Error: Duplicate Name Exists Error
Detail: A customer with this name already exists
```

#### Not Synced ⭕
**What it means:** Entity intentionally not synced yet

**What to do:**
- For proposals: Normal until job starts
- For other entities: May indicate disabled sync
- Verify this is expected

**Example:**
```
Status: Not synced to QuickBooks
Reason: Will sync when job starts
```

### Common Reconciliation Scenarios

#### Scenario 1: Missing Invoice in QuickBooks
**Problem:** DripJobs shows invoice as "Synced" but not in QuickBooks

**Steps:**
1. Get QuickBooks ID from sync badge
2. Search QuickBooks by ID (not invoice number)
3. If still not found:
   - Check you're in correct QuickBooks company
   - Check invoice not deleted in QuickBooks
   - Report discrepancy to admin

#### Scenario 2: Amount Mismatch
**Problem:** Invoice amount differs between DripJobs and QuickBooks

**Steps:**
1. Check last sync timestamp
2. If recently updated, wait for next sync
3. If old sync, report discrepancy
4. Admin may need to force re-sync

#### Scenario 3: Payment Not Applied
**Problem:** Payment shows synced but invoice still shows balance in QuickBooks

**Steps:**
1. Get payment QuickBooks ID from badge
2. Find payment in QuickBooks
3. Check if payment linked to invoice
4. If not linked:
   - Admin may need to manually apply in QuickBooks
   - Or delete and re-sync from DripJobs

#### Scenario 4: Duplicate Customers
**Problem:** Multiple customers in QuickBooks for same business

**Steps:**
1. Identify all duplicate customer IDs
2. Check DripJobs for duplicate business records
3. Report to admin to:
   - Merge customers in QuickBooks
   - Update DripJobs to reference correct ID
   - Delete duplicate business in DripJobs

### Reporting

#### Weekly Report Template

**To:** Business Owner
**Subject:** DripJobs QuickBooks Sync Status - Week of [Date]

**Summary:**
- Total Synced Entities: [Number]
- Total Pending: [Number]
- Total Errors: [Number]

**Details:**
- Customers Synced: [Number]
- Invoices Synced: [Number]
- Payments Synced: [Number]

**Issues:**
1. [Entity Type] - [Entity Name] - [Error Message]
2. [Entity Type] - [Entity Name] - [Error Message]

**Action Items:**
- [What admin needs to do]

**Notes:**
- [Any observations or recommendations]

#### Monthly Reconciliation Report

Include:
- Total revenue synced
- Payment collection rate
- Outstanding invoices
- Sync success rate
- Common errors encountered
- Recommendations for improvement

### Best Practices

#### For Accuracy
1. **Reconcile daily** - Don't let errors accumulate
2. **Use QuickBooks IDs** - More reliable than names
3. **Document discrepancies** - Keep detailed notes
4. **Report promptly** - Don't wait for month-end

#### For Efficiency
1. **Learn sync badge colors** - Quick visual scan
2. **Bookmark common screens** - Faster navigation
3. **Use filters** - Focus on specific entities
4. **Export regularly** - Keep offline records

#### For Communication
1. **Be specific** - Include entity IDs and error messages
2. **Include screenshots** - Visual reference helps
3. **Suggest solutions** - Based on error type
4. **Set expectations** - Sync timing, resolution time

### Limitations to Be Aware Of

1. **Read-Only Access**
   - Cannot fix errors directly
   - Must communicate with admin for changes

2. **Sync Timing**
   - Auto-sync may have delays
   - Not always real-time
   - Hourly/daily sync based on settings

3. **Proposal Timing**
   - Proposals don't create invoices immediately
   - Only when job status changes
   - This is intentional for accrual accounting

4. **Customer Hierarchy**
   - Businesses are parents, contacts are children
   - Understand this when reconciling
   - Invoices may be under contact, not business

### Frequently Asked Questions

**Q: Why can't I edit records?**
A: Accountant role is read-only to prevent accidental changes. Request admin to make edits.

**Q: Why do some invoices show "Not Synced"?**
A: Proposals don't create invoices until the job starts. This is intentional for accrual accounting compliance.

**Q: How often does data sync?**
A: Depends on settings. Usually real-time, but may be hourly or daily. Check with admin.

**Q: Can I disconnect QuickBooks?**
A: No, only admins can manage QuickBooks connection settings.

**Q: Why are contacts sub-customers?**
A: This follows QuickBooks best practice for B2B relationships. It allows multiple contacts per business while maintaining proper hierarchy.

**Q: What if I need to export data?**
A: Currently, take screenshots or manually export from QuickBooks. Future versions will include export features.

**Q: Can I see who made changes?**
A: Audit logs show sync activities. User-level tracking would be in full multi-user implementation.

**Q: How do I switch back to admin?**
A: Only admins can switch roles. Log in as admin account.

### Getting Help

**For Sync Issues:**
1. Check this guide first
2. Review error message in sync badge
3. Report to business admin with details

**For QuickBooks Questions:**
1. Consult QuickBooks documentation
2. Contact QuickBooks support
3. Check with business admin on sync settings

**For DripJobs Questions:**
1. Contact business admin
2. Refer to QuickBooks Integration Guide
3. Email support@dripjobs.com

### Security Reminders

- Keep login credentials secure
- Don't share account with others
- Log out when finished
- Report any suspicious activity
- Don't attempt to bypass read-only restrictions

---

## Appendix: Sync Badge Quick Reference

| Badge | Status | Action Needed |
|-------|--------|---------------|
| 🟢 Green Checkmark | Synced | None - verify in QB if needed |
| 🟡 Yellow Clock | Pending | Wait for auto-sync |
| 🔴 Red Warning | Error | Report to admin |
| ⚪ Gray Circle | Not Synced | Verify this is expected |

## Appendix: Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Duplicate Name Exists" | Customer name already in QB | Admin: Rename or merge |
| "Customer not found" | Referenced customer missing | Admin: Sync customer first |
| "Invalid reference" | Entity ID is invalid | Admin: Fix reference |
| "Token expired" | QB authentication expired | Admin: Reconnect |
| "Rate limit exceeded" | Too many API calls | Wait 1 min, auto-retry |
| "Validation error" | Required field missing | Admin: Add missing data |
