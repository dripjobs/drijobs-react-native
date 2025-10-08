# QuickBooks Integration Testing Guide

## Overview

This guide provides comprehensive testing procedures for the DripJobs QuickBooks Online integration. Follow these steps to ensure the integration works correctly before deploying to production.

## Prerequisites

### 1. QuickBooks Sandbox Account

1. Create a developer account at [developer.intuit.com](https://developer.intuit.com)
2. Create a new app in the Intuit Developer Portal
3. Get your Sandbox credentials:
   - Client ID
   - Client Secret
   - Redirect URI: `dripjobs://quickbooks-callback`

### 2. Test Data Setup

Create test data in your QuickBooks Sandbox:
- At least 2 test customers
- At least 1 test invoice
- At least 1 test payment
- At least 1 test recurring transaction

### 3. Environment Configuration

```bash
# Set environment variables for testing
EXPO_PUBLIC_QB_CLIENT_ID=your_sandbox_client_id
EXPO_PUBLIC_QB_ENVIRONMENT=sandbox
EXPO_PUBLIC_QB_API_URL=https://sandbox-quickbooks.api.intuit.com/v3
EXPO_PUBLIC_QB_REDIRECT_URI=dripjobs://quickbooks-callback
EXPO_PUBLIC_API_URL=http://localhost:3000/api  # Your backend URL
```

## Testing Checklist

### Phase 1: OAuth Authentication

#### Test 1.1: Successful Connection
- [ ] Navigate to Settings → Account Settings → Integrations
- [ ] Click "Connect to QuickBooks"
- [ ] Browser opens with QuickBooks login page
- [ ] Log in with sandbox credentials
- [ ] Authorize DripJobs
- [ ] Redirected back to app with success message
- [ ] Connection status shows "Connected"
- [ ] Company name displayed correctly
- [ ] Last sync time shown

**Expected Result:** ✅ Successfully connected to QuickBooks Sandbox

#### Test 1.2: User Cancels Authorization
- [ ] Start connection flow
- [ ] Click "Cancel" in QuickBooks authorization page
- [ ] Redirected back to app with error message
- [ ] Connection status remains "Not Connected"

**Expected Result:** ✅ Graceful handling of user cancellation

#### Test 1.3: Invalid Credentials
- [ ] Use invalid client ID or secret
- [ ] Attempt to connect
- [ ] Error message displayed

**Expected Result:** ✅ Clear error message about invalid credentials

#### Test 1.4: Token Refresh
- [ ] Wait for token to expire (or manually set expired token)
- [ ] Trigger a sync action
- [ ] Token automatically refreshed
- [ ] Sync completes successfully

**Expected Result:** ✅ Automatic token refresh works

#### Test 1.5: Disconnect
- [ ] Click "Disconnect QuickBooks"
- [ ] Confirm disconnection
- [ ] Connection status shows "Not Connected"
- [ ] Sync badges show "Not Synced"

**Expected Result:** ✅ Clean disconnection

---

### Phase 2: Customer Synchronization

#### Test 2.1: Sync Business as Parent Customer
- [ ] Create a new business in DripJobs:
  - Name: "Test Business Inc"
  - Address: "123 Test St, Test City, TS 12345"
  - Phone: "(555) 123-4567"
  - Email: "test@testbusiness.com"
- [ ] Wait for auto-sync or trigger manual sync
- [ ] Sync badge shows "Synced"
- [ ] Click sync badge to view QuickBooks ID
- [ ] Verify in QuickBooks Sandbox that customer exists
- [ ] Verify all fields synced correctly

**Expected Result:** ✅ Business created as parent customer in QuickBooks

#### Test 2.2: Sync Contact as Sub-Customer
- [ ] Create a contact linked to the business:
  - First Name: "John"
  - Last Name: "Smith"
  - Email: "john@testbusiness.com"
  - Phone: "(555) 234-5678"
  - Mark as Primary Contact
- [ ] Wait for sync
- [ ] Verify sync badge shows "Synced"
- [ ] Verify in QuickBooks that contact exists as sub-customer
- [ ] Verify ParentRef links to business customer

**Expected Result:** ✅ Contact created as sub-customer under business

#### Test 2.3: Update Existing Customer
- [ ] Edit business name to "Test Business LLC"
- [ ] Change phone number
- [ ] Wait for sync
- [ ] Verify sync badge updates
- [ ] Verify changes reflected in QuickBooks

**Expected Result:** ✅ Customer updated in QuickBooks

#### Test 2.4: Duplicate Name Handling
- [ ] Create another business with same name
- [ ] Attempt to sync
- [ ] Verify error badge shown
- [ ] Click badge to view error: "Duplicate name exists"
- [ ] Rename business
- [ ] Retry sync
- [ ] Verify successful sync

**Expected Result:** ✅ Duplicate name error handled gracefully

---

### Phase 3: Invoice Synchronization

#### Test 3.1: Proposal Accepted - No Invoice Yet
- [ ] Create a proposal for the test business
- [ ] Set proposal amount: $500
- [ ] Accept proposal
- [ ] Verify NO invoice created in QuickBooks
- [ ] Sync badge shows "Not Synced"
- [ ] Badge message: "Will sync when job starts"

**Expected Result:** ✅ No invoice created until job starts

#### Test 3.2: Job Starts - Invoice Created
- [ ] Change job status to "In Progress" (or configured trigger)
- [ ] Verify business customer exists in QB (or created)
- [ ] Verify primary contact sub-customer exists
- [ ] Invoice automatically created in QuickBooks
- [ ] Sync badge shows "Synced"
- [ ] Click badge to view QuickBooks Invoice ID
- [ ] Verify in QuickBooks:
  - Invoice linked to sub-customer
  - Line items match proposal
  - Amount is correct
  - Due date set

**Expected Result:** ✅ Invoice created when job starts

#### Test 3.3: Multiple Line Items
- [ ] Create proposal with 3 line items:
  - Item 1: "Lawn Mowing" - $150
  - Item 2: "Edging" - $50
  - Item 3: "Cleanup" - $75
- [ ] Accept and start job
- [ ] Verify all line items synced to invoice

**Expected Result:** ✅ All line items synced correctly

#### Test 3.4: Update Existing Invoice
- [ ] Modify job/invoice amount
- [ ] Trigger sync
- [ ] Verify invoice updated in QuickBooks
- [ ] Verify SyncToken incremented

**Expected Result:** ✅ Invoice updated in QuickBooks

---

### Phase 4: Payment Synchronization

#### Test 4.1: Full Payment
- [ ] Record payment for full invoice amount
- [ ] Payment syncs immediately
- [ ] Verify sync badge shows "Synced"
- [ ] Verify in QuickBooks:
  - Payment created
  - Linked to invoice
  - Invoice balance = $0

**Expected Result:** ✅ Payment synced and linked to invoice

#### Test 4.2: Partial Payment
- [ ] Create invoice for $500
- [ ] Record payment for $200
- [ ] Verify payment synced
- [ ] Verify invoice balance = $300 in QuickBooks

**Expected Result:** ✅ Partial payment recorded correctly

#### Test 4.3: Multiple Payments
- [ ] Record second payment for $150
- [ ] Record third payment for $150
- [ ] Verify all payments synced
- [ ] Verify invoice fully paid

**Expected Result:** ✅ All payments synced correctly

#### Test 4.4: Payment Before Invoice
- [ ] Record payment without linked invoice
- [ ] Verify payment synced to customer
- [ ] Verify NOT linked to invoice (unapplied payment)

**Expected Result:** ✅ Unapplied payment created

---

### Phase 5: Recurring Jobs

#### Test 5.1: Create Recurring Job
- [ ] Create monthly recurring job:
  - Title: "Monthly Lawn Care"
  - Amount: $150
  - Frequency: Monthly
  - Start Date: Current date
  - End Date: 12 months from now
- [ ] Verify recurring transaction created in QuickBooks
- [ ] Verify sync badge shows "Synced"
- [ ] Verify in QuickBooks:
  - Template active
  - Schedule matches
  - Amount correct

**Expected Result:** ✅ Recurring transaction template created

#### Test 5.2: Recurring Job Instance
- [ ] When first instance date arrives
- [ ] Verify individual invoice created
- [ ] Verify linked to same parent customer
- [ ] Verify sync badge on instance shows "Synced"

**Expected Result:** ✅ Individual invoices created from template

#### Test 5.3: Update Recurring Job
- [ ] Change amount to $175
- [ ] Update sync
- [ ] Verify template updated in QuickBooks
- [ ] Verify future instances use new amount

**Expected Result:** ✅ Recurring template updated

#### Test 5.4: Deactivate Recurring Job
- [ ] Set recurring job as inactive
- [ ] Verify template marked inactive in QuickBooks
- [ ] Verify no new instances created

**Expected Result:** ✅ Recurring job properly deactivated

---

### Phase 6: Sync Settings

#### Test 6.1: Auto-Sync Toggle
- [ ] Disable auto-sync
- [ ] Create new business
- [ ] Verify sync badge shows "Pending"
- [ ] Enable auto-sync
- [ ] Verify business syncs automatically

**Expected Result:** ✅ Auto-sync toggle works

#### Test 6.2: Entity-Specific Sync Toggles
- [ ] Disable "Sync Customers"
- [ ] Create new business
- [ ] Verify NOT synced
- [ ] Enable "Sync Customers"
- [ ] Verify syncs

**Expected Result:** ✅ Entity toggles control sync behavior

#### Test 6.3: Job Status Trigger
- [ ] Change trigger to "Active"
- [ ] Accept proposal and start job with "In Progress"
- [ ] Verify invoice NOT created
- [ ] Change job status to "Active"
- [ ] Verify invoice created

**Expected Result:** ✅ Custom trigger status works

#### Test 6.4: Force Full Sync
- [ ] Create multiple unsynchronized items
- [ ] Click "Force Full Sync"
- [ ] Verify all items sync
- [ ] Verify sync logs show all operations

**Expected Result:** ✅ Batch sync works

---

### Phase 7: Sync Status Indicators

#### Test 7.1: Synced Badge
- [ ] Verify synced items show green checkmark
- [ ] Click badge to view modal
- [ ] Verify shows:
  - Status: "Successfully synced to QuickBooks"
  - Last Synced: Timestamp
  - QuickBooks ID: ID value

**Expected Result:** ✅ Synced badge displays correctly

#### Test 7.2: Pending Badge
- [ ] Disable auto-sync
- [ ] Create new item
- [ ] Verify yellow clock icon
- [ ] Badge message: "Waiting to sync to QuickBooks"

**Expected Result:** ✅ Pending badge displays correctly

#### Test 7.3: Error Badge
- [ ] Create item with duplicate name
- [ ] Verify red warning icon
- [ ] Click badge to view error details
- [ ] Error message shown

**Expected Result:** ✅ Error badge displays with details

#### Test 7.4: Not Synced Badge
- [ ] Create proposal (before job start)
- [ ] Verify gray icon
- [ ] Badge message: "Not synced to QuickBooks"

**Expected Result:** ✅ Not synced badge displays correctly

---

### Phase 8: User Role Management

#### Test 8.1: Admin Role
- [ ] Verify default role is Admin
- [ ] Verify can:
  - Create entities
  - Edit entities
  - Delete entities
  - Access QuickBooks settings
  - Sync data
  - View sync status

**Expected Result:** ✅ Admin has full access

#### Test 8.2: Switch to Accountant Role
- [ ] Navigate to Integrations → User Access
- [ ] Click "Switch to Accountant Role"
- [ ] Confirm switch
- [ ] Verify role badge shows "Accountant/Bookkeeper"
- [ ] Verify info box shows read-only notice

**Expected Result:** ✅ Role switch works

#### Test 8.3: Accountant Read-Only Access
- [ ] In accountant mode, verify:
  - CAN view customers
  - CAN view invoices
  - CAN view payments
  - CAN view sync status
  - CANNOT create/edit/delete
  - CANNOT access QuickBooks settings
  - CANNOT disconnect QuickBooks

**Expected Result:** ✅ Read-only restrictions enforced

#### Test 8.4: Switch Back to Admin
- [ ] Switch back to Admin role
- [ ] Verify full access restored

**Expected Result:** ✅ Role switch back works

---

### Phase 9: Error Handling

#### Test 9.1: Network Error
- [ ] Disconnect internet
- [ ] Attempt to sync
- [ ] Verify error badge shown
- [ ] Error message: "Network error"
- [ ] Reconnect internet
- [ ] Retry sync
- [ ] Verify successful

**Expected Result:** ✅ Network errors handled gracefully

#### Test 9.2: API Rate Limit
- [ ] Trigger many sync operations rapidly
- [ ] Verify rate limit error caught
- [ ] Verify automatic retry after delay

**Expected Result:** ✅ Rate limiting handled

#### Test 9.3: Invalid Data
- [ ] Create customer with missing required field
- [ ] Attempt sync
- [ ] Verify validation error shown
- [ ] Fix data
- [ ] Retry sync
- [ ] Verify successful

**Expected Result:** ✅ Validation errors handled

#### Test 9.4: QuickBooks API Error
- [ ] Trigger QuickBooks-specific error (e.g., duplicate)
- [ ] Verify QuickBooks error message shown
- [ ] Verify error code displayed

**Expected Result:** ✅ QuickBooks errors handled

---

### Phase 10: Data Integrity

#### Test 10.1: Customer Hierarchy Verification
- [ ] Sync business and contact
- [ ] In QuickBooks, verify:
  - Business is parent customer
  - Contact is sub-customer with ParentRef
  - Hierarchy is correct

**Expected Result:** ✅ Hierarchy maintained

#### Test 10.2: Invoice-Payment Linking
- [ ] Create invoice and payment
- [ ] In QuickBooks, verify:
  - Payment linked to invoice
  - Invoice balance updated
  - Payment shows correct TxnId

**Expected Result:** ✅ Linking correct

#### Test 10.3: Sync Token Management
- [ ] Update entity multiple times
- [ ] Verify SyncToken increments
- [ ] Verify no conflicts

**Expected Result:** ✅ SyncToken managed correctly

#### Test 10.4: Idempotency
- [ ] Sync same entity twice
- [ ] Verify only one record in QuickBooks
- [ ] Verify update, not duplicate

**Expected Result:** ✅ No duplicate records created

---

## Performance Testing

### Test 11.1: Large Dataset Sync
- [ ] Create 100 customers in DripJobs
- [ ] Trigger batch sync
- [ ] Monitor:
  - Sync completion time
  - Error rate
  - Memory usage
  - API rate limit handling

**Expected Result:** ✅ Large dataset syncs within acceptable time

### Test 11.2: Concurrent Sync Operations
- [ ] Create multiple entities simultaneously
- [ ] Verify all sync correctly
- [ ] No race conditions or conflicts

**Expected Result:** ✅ Concurrent operations handled

---

## Security Testing

### Test 12.1: Token Storage
- [ ] Verify tokens stored encrypted
- [ ] Verify tokens not in logs
- [ ] Verify tokens not exposed in API responses

**Expected Result:** ✅ Tokens securely stored

### Test 12.2: OAuth State Verification
- [ ] Modify state parameter in callback
- [ ] Verify connection rejected

**Expected Result:** ✅ CSRF protection works

### Test 12.3: Permission Validation
- [ ] In accountant mode, attempt API call to create entity
- [ ] Verify blocked

**Expected Result:** ✅ Permissions enforced

---

## Regression Testing

Run this checklist after any code changes:

- [ ] OAuth flow still works
- [ ] Customer sync still works
- [ ] Invoice sync still works
- [ ] Payment sync still works
- [ ] Recurring jobs still work
- [ ] Sync badges display correctly
- [ ] Role switching works
- [ ] Error handling works

---

## Production Readiness Checklist

Before deploying to production:

### Configuration
- [ ] Switch to production QuickBooks credentials
- [ ] Update API URLs to production
- [ ] Enable HTTPS only
- [ ] Configure proper redirect URI
- [ ] Set up environment variables

### Backend
- [ ] All API endpoints implemented
- [ ] Token encryption enabled
- [ ] Webhook handler set up
- [ ] Rate limiting configured
- [ ] Error tracking enabled (Sentry/Bugsnag)
- [ ] Logging configured
- [ ] Monitoring dashboards set up

### Testing
- [ ] All test cases pass
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Load testing completed
- [ ] User acceptance testing completed

### Documentation
- [ ] User guide updated
- [ ] API documentation complete
- [ ] Troubleshooting guide available
- [ ] Support team trained

### Deployment
- [ ] Staged rollout plan
- [ ] Rollback procedure documented
- [ ] Monitoring alerts configured
- [ ] On-call rotation scheduled

---

## Troubleshooting Common Issues

### Issue: "Token expired" error persists
**Solution:**
1. Check token refresh logic
2. Verify refresh token not expired
3. Check system time is correct
4. Manually disconnect and reconnect

### Issue: Duplicate customer errors
**Solution:**
1. Check for existing customers with same DisplayName
2. Append unique identifier to DisplayName
3. Or update existing customer instead

### Issue: Invoice not creating on job start
**Solution:**
1. Verify job status matches trigger setting
2. Check auto-sync enabled
3. Check sync customers toggle enabled
4. Verify customer exists in QuickBooks
5. Check sync logs for errors

### Issue: Sync badge stuck on "Pending"
**Solution:**
1. Check network connection
2. Verify auto-sync enabled
3. Check backend API is running
4. Trigger manual sync
5. Check sync logs

### Issue: Payment not linking to invoice
**Solution:**
1. Verify invoice exists in QuickBooks
2. Check invoice ID correct
3. Verify customer matches
4. Check invoice not already paid

---

## Support Contacts

For testing support:
- **Technical Issues**: dev-team@dripjobs.com
- **QuickBooks API Issues**: developer.intuit.com/support
- **Sandbox Access**: developer.intuit.com/sandbox

## Additional Resources

- [QuickBooks API Explorer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer)
- [QuickBooks Sandbox Guide](https://developer.intuit.com/app/developer/qbo/docs/develop/sandboxes)
- [OAuth 2.0 Playground](https://developer.intuit.com/app/developer/playground)
