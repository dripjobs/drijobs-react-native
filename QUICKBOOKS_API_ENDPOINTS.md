# QuickBooks Integration - Backend API Specification

## Overview

This document specifies the backend API endpoints required for the DripJobs QuickBooks Online integration. These endpoints must be implemented on your backend server to handle OAuth authentication, token management, and data synchronization with QuickBooks.

**Important Security Notes:**
- QuickBooks Client Secret MUST be stored server-side only
- Never expose Client Secret in the mobile app
- All token exchanges must happen server-side
- Use HTTPS for all API endpoints

## Base URL

```
Production: https://api.dripjobs.com/api
Staging: https://staging-api.dripjobs.com/api
Development: http://localhost:3000/api
```

## Authentication

All endpoints (except OAuth callback) require authentication using Bearer token:

```
Authorization: Bearer {user_access_token}
```

---

## OAuth Endpoints

### 1. Get Authorization URL

**Endpoint:** `GET /quickbooks/auth/url`

**Description:** Generates QuickBooks OAuth authorization URL for the user to initiate the OAuth flow.

**Request:**
```http
GET /quickbooks/auth/url HTTP/1.1
Authorization: Bearer {user_access_token}
```

**Response:**
```json
{
  "url": "https://appcenter.intuit.com/connect/oauth2?client_id=...&redirect_uri=...&scope=...&state=...",
  "state": "random_state_token_for_csrf_protection"
}
```

**Implementation Notes:**
- Generate secure random `state` parameter for CSRF protection
- Store `state` temporarily (Redis/database) associated with user
- Include required scopes: `com.intuit.quickbooks.accounting`
- Set redirect_uri to app's deep link: `dripjobs://quickbooks-callback`

### 2. Exchange Authorization Code

**Endpoint:** `POST /quickbooks/auth/token`

**Description:** Exchanges authorization code for access and refresh tokens.

**Request:**
```json
{
  "code": "authorization_code_from_quickbooks",
  "redirectUri": "dripjobs://quickbooks-callback",
  "state": "state_token_from_auth_url"
}
```

**Response:**
```json
{
  "accessToken": "encrypted_access_token",
  "refreshToken": "encrypted_refresh_token",
  "realmId": "quickbooks_company_id",
  "expiresAt": "2025-10-08T12:00:00Z",
  "refreshTokenExpiresAt": "2025-04-08T12:00:00Z"
}
```

**Implementation:**
1. Verify `state` parameter matches stored value
2. Exchange code for tokens via QuickBooks Token Endpoint:
   ```
   POST https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
   ```
3. Store tokens encrypted in database
4. Return encrypted tokens (never expose raw tokens)

### 3. Refresh Access Token

**Endpoint:** `POST /quickbooks/auth/refresh`

**Description:** Refreshes expired access token using refresh token.

**Request:**
```json
{
  "refreshToken": "encrypted_refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_encrypted_access_token",
  "refreshToken": "new_encrypted_refresh_token",
  "realmId": "quickbooks_company_id",
  "expiresAt": "2025-10-08T13:00:00Z",
  "refreshTokenExpiresAt": "2025-04-08T12:00:00Z"
}
```

**Implementation:**
1. Decrypt stored refresh token
2. Call QuickBooks refresh endpoint
3. Store new tokens encrypted
4. Return new encrypted tokens

### 4. Revoke Tokens

**Endpoint:** `POST /quickbooks/auth/revoke`

**Description:** Revokes QuickBooks access and refresh tokens.

**Request:**
```json
{
  "token": "encrypted_access_or_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens revoked successfully"
}
```

**Implementation:**
1. Decrypt token
2. Call QuickBooks revoke endpoint
3. Delete stored tokens from database

---

## Sync Endpoints

### 5. Sync Customer (Business or Contact)

**Endpoint:** `POST /quickbooks/sync/customer`

**Description:** Creates or updates a customer in QuickBooks.

**Request:**
```json
{
  "entityId": "dripjobs_entity_id",
  "data": {
    "Id": "existing_quickbooks_id_if_update",
    "DisplayName": "John Smith",
    "CompanyName": "Smith Plumbing",
    "GivenName": "John",
    "FamilyName": "Smith",
    "PrimaryEmailAddr": {
      "Address": "john@smithplumbing.com"
    },
    "PrimaryPhone": {
      "FreeFormNumber": "(555) 123-4567"
    },
    "BillAddr": {
      "Line1": "123 Main St",
      "City": "Springfield",
      "CountrySubDivisionCode": "IL",
      "PostalCode": "62701"
    },
    "ParentRef": {
      "value": "parent_customer_qb_id"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "quickbooksId": "123",
  "syncToken": "0",
  "data": {
    "Id": "123",
    "DisplayName": "John Smith",
    "SyncToken": "0",
    "MetaData": {
      "CreateTime": "2025-10-07T12:00:00Z",
      "LastUpdatedTime": "2025-10-07T12:00:00Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Customer with this name already exists",
  "quickbooksError": {
    "code": "6240",
    "message": "Duplicate Name Exists Error",
    "detail": "A customer with this name already exists"
  }
}
```

**Implementation:**
1. Get user's QuickBooks tokens from database
2. Check if token expired, refresh if needed
3. If `data.Id` exists, perform UPDATE (sparse update)
4. If no `data.Id`, perform CREATE
5. Call QuickBooks Customer API:
   ```
   POST https://quickbooks.api.intuit.com/v3/company/{realmId}/customer
   ```
6. Handle errors and return formatted response

### 6. Sync Invoice

**Endpoint:** `POST /quickbooks/sync/invoice`

**Description:** Creates or updates an invoice in QuickBooks.

**Request:**
```json
{
  "entityId": "dripjobs_invoice_id",
  "data": {
    "Id": "existing_quickbooks_id_if_update",
    "DocNumber": "INV-1001",
    "TxnDate": "2025-10-07",
    "DueDate": "2025-10-21",
    "CustomerRef": {
      "value": "quickbooks_customer_id"
    },
    "Line": [
      {
        "LineNum": 1,
        "Description": "Lawn mowing service",
        "Amount": 150.00,
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "ItemRef": {
            "value": "1",
            "name": "Services"
          },
          "Qty": 1,
          "UnitPrice": 150.00
        }
      }
    ],
    "TotalAmt": 150.00,
    "CustomerMemo": {
      "value": "Thank you for your business!"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "quickbooksId": "456",
  "syncToken": "0",
  "data": {
    "Id": "456",
    "DocNumber": "INV-1001",
    "SyncToken": "0",
    "TotalAmt": 150.00,
    "Balance": 150.00,
    "MetaData": {
      "CreateTime": "2025-10-07T12:00:00Z"
    }
  }
}
```

**Implementation:**
1. Validate customer exists in QuickBooks
2. Map line items to QuickBooks items (create if needed)
3. Call QuickBooks Invoice API
4. Return invoice with Balance for payment tracking

### 7. Sync Payment

**Endpoint:** `POST /quickbooks/sync/payment`

**Description:** Creates or updates a payment in QuickBooks.

**Request:**
```json
{
  "entityId": "dripjobs_payment_id",
  "data": {
    "Id": "existing_quickbooks_id_if_update",
    "TxnDate": "2025-10-07",
    "CustomerRef": {
      "value": "quickbooks_customer_id"
    },
    "TotalAmt": 150.00,
    "Line": [
      {
        "Amount": 150.00,
        "LinkedTxn": [
          {
            "TxnId": "quickbooks_invoice_id",
            "TxnType": "Invoice"
          }
        ]
      }
    ],
    "PaymentMethodRef": {
      "value": "1",
      "name": "Cash"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "quickbooksId": "789",
  "syncToken": "0",
  "data": {
    "Id": "789",
    "TotalAmt": 150.00,
    "SyncToken": "0"
  }
}
```

### 8. Sync Recurring Transaction

**Endpoint:** `POST /quickbooks/sync/recurring`

**Description:** Creates or updates a recurring transaction template in QuickBooks.

**Request:**
```json
{
  "entityId": "dripjobs_recurring_job_id",
  "data": {
    "Id": "existing_quickbooks_id_if_update",
    "Name": "Monthly Lawn Care",
    "Type": "RecurringInvoice",
    "Active": true,
    "ScheduleInfo": {
      "IntervalType": "Monthly",
      "NumInterval": 1,
      "StartDate": "2025-10-01",
      "EndDate": "2026-09-30"
    },
    "RecurringInvoice": {
      "CustomerRef": {
        "value": "quickbooks_customer_id"
      },
      "Line": [
        {
          "Description": "Monthly lawn mowing",
          "Amount": 150.00,
          "DetailType": "SalesItemLineDetail",
          "SalesItemLineDetail": {
            "ItemRef": {
              "value": "1"
            }
          }
        }
      ],
      "TxnDate": "2025-10-01"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "quickbooksId": "RT123",
  "syncToken": "0",
  "data": {
    "Id": "RT123",
    "Name": "Monthly Lawn Care",
    "Active": true
  }
}
```

### 9. Batch Sync

**Endpoint:** `POST /quickbooks/sync/batch`

**Description:** Syncs multiple entities in a single batch request.

**Request:**
```json
{
  "entities": [
    {
      "entityType": "customer",
      "entityId": "dj_customer_1",
      "data": { /* customer data */ }
    },
    {
      "entityType": "invoice",
      "entityId": "dj_invoice_1",
      "data": { /* invoice data */ }
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "entityId": "dj_customer_1",
      "success": true,
      "quickbooksId": "123"
    },
    {
      "entityId": "dj_invoice_1",
      "success": false,
      "error": "Customer not found"
    }
  ],
  "successCount": 1,
  "errorCount": 1
}
```

**Implementation:**
- Process entities in order (customers before invoices)
- Continue processing if one fails
- Return results for all entities

### 10. Get Sync Status

**Endpoint:** `GET /quickbooks/status/:entityType/:entityId`

**Description:** Gets QuickBooks sync status for a specific entity.

**Request:**
```http
GET /quickbooks/status/customer/dripjobs_customer_id HTTP/1.1
Authorization: Bearer {user_access_token}
```

**Response:**
```json
{
  "entityId": "dripjobs_customer_id",
  "entityType": "customer",
  "quickbooksId": "123",
  "syncStatus": "synced",
  "lastSyncedAt": "2025-10-07T12:00:00Z",
  "syncVersion": 1
}
```

---

## Webhook Endpoints

### 11. QuickBooks Webhook Handler

**Endpoint:** `POST /quickbooks/webhook`

**Description:** Receives webhook notifications from QuickBooks when data changes.

**Request (from QuickBooks):**
```json
{
  "eventNotifications": [
    {
      "realmId": "123456789",
      "dataChangeEvent": {
        "entities": [
          {
            "name": "Customer",
            "id": "123",
            "operation": "Update",
            "lastUpdated": "2025-10-07T12:00:00Z"
          }
        ]
      }
    }
  ]
}
```

**Response:**
```json
{
  "received": true
}
```

**Implementation:**
1. Verify webhook signature from QuickBooks
2. Queue webhook for processing (use job queue)
3. Return 200 OK immediately
4. Process webhook asynchronously:
   - Fetch updated entity from QuickBooks
   - Update DripJobs database
   - Notify mobile app via push notification

---

## Company Info Endpoint

### 12. Get Company Info

**Endpoint:** `GET /quickbooks/company/info`

**Description:** Gets QuickBooks company information.

**Response:**
```json
{
  "companyName": "Smith Plumbing Inc",
  "realmId": "123456789",
  "country": "US",
  "fiscalYearStartMonth": "January"
}
```

---

## Error Handling

### Standard Error Response

All errors return:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "errorCode": "ERROR_CODE",
  "quickbooksError": {
    "code": "QB_ERROR_CODE",
    "message": "QuickBooks error message",
    "detail": "Detailed error information"
  }
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `AUTH_EXPIRED` | Access token expired | Refresh token |
| `AUTH_INVALID` | Invalid token | Re-authenticate |
| `RATE_LIMIT` | Too many requests | Retry after delay |
| `DUPLICATE_NAME` | Customer name exists | Use different name |
| `INVALID_REFERENCE` | Referenced entity not found | Create referenced entity first |
| `VALIDATION_ERROR` | Invalid data format | Check request format |

---

## Rate Limiting

QuickBooks API Rate Limits:
- **Sandbox**: 100 requests per minute
- **Production**: 500 requests per minute per realm ID

**Backend Implementation:**
- Implement exponential backoff for rate limit errors
- Queue requests when approaching limits
- Return rate limit info in response headers:
  ```
  X-RateLimit-Limit: 500
  X-RateLimit-Remaining: 450
  X-RateLimit-Reset: 1696694400
  ```

---

## Security Considerations

### 1. Token Storage
- Encrypt tokens at rest using AES-256
- Store encryption key in secure key management system
- Never log tokens
- Rotate encryption keys periodically

### 2. OAuth State
- Generate cryptographically secure random state
- Store state with expiration (10 minutes)
- Verify state on callback
- Delete state after use

### 3. API Authentication
- Validate user bearer token on all requests
- Check user has permission to access QuickBooks
- Rate limit per user to prevent abuse

### 4. Webhook Verification
- Verify webhook signature using QuickBooks Verifier Token
- Reject webhooks with invalid signatures
- Log all webhook attempts for audit

### 5. Data Privacy
- Only sync data user has access to
- Respect user's sync settings
- Provide ability to disconnect and delete data

---

## Testing

### Sandbox Environment

Use QuickBooks Sandbox for development and testing:
- **OAuth URL**: https://appcenter.intuit.com/connect/oauth2 (same)
- **API URL**: https://sandbox-quickbooks.api.intuit.com/v3
- **Test Credentials**: Use QuickBooks developer sandbox credentials

### Test Cases

1. **OAuth Flow**
   - Successful authorization
   - User cancels authorization
   - Invalid state parameter
   - Token refresh
   - Token expiration

2. **Customer Sync**
   - Create new customer
   - Update existing customer
   - Create sub-customer
   - Duplicate name handling

3. **Invoice Sync**
   - Create invoice
   - Update invoice
   - Link to customer
   - Multiple line items

4. **Payment Sync**
   - Record payment
   - Link to invoice
   - Partial payments
   - Multiple invoices

5. **Error Handling**
   - Network failures
   - Invalid data
   - Rate limiting
   - Duplicate records

---

## Monitoring & Logging

### Required Logs

1. **OAuth Events**
   - Authorization attempts
   - Token exchanges
   - Token refreshes
   - Revocations

2. **Sync Events**
   - Sync requests
   - Success/failure status
   - QuickBooks IDs
   - Error messages

3. **Webhook Events**
   - Received webhooks
   - Processing results
   - Invalid webhooks

### Metrics to Track

- OAuth success rate
- Sync success rate by entity type
- Average sync time
- Error rate by error type
- API rate limit hits
- Webhook processing time

---

## Deployment Checklist

### Before Production

- [ ] Implement all endpoints
- [ ] Set up secure token storage
- [ ] Configure webhook URL in QuickBooks
- [ ] Test OAuth flow end-to-end
- [ ] Test all sync operations
- [ ] Implement error handling and retries
- [ ] Set up monitoring and alerting
- [ ] Document API for mobile team
- [ ] Perform security audit
- [ ] Load test with expected traffic

### Production Configuration

- [ ] Use production QuickBooks credentials
- [ ] Set production API URLs
- [ ] Enable HTTPS only
- [ ] Configure rate limiting
- [ ] Set up log aggregation
- [ ] Enable error tracking (Sentry/Bugsnag)
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring dashboards

---

## Support Resources

- [QuickBooks API Documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer)
- [QuickBooks OAuth 2.0 Guide](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)
- [QuickBooks Webhooks Guide](https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks)
- [QuickBooks API Explorer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer)
