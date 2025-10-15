# Invoice Payment Collection - Complete Guide

## Overview

The invoice payment collection system now supports two distinct workflows:

1. **Log a Payment** - Manually record payments received via check, cash, Venmo, CashApp, or other methods
2. **Run a Card Payment** - Process credit/debit card payments through Stripe

## Features

### 🎯 Multi-Step Payment Collection

When you click "Collect Payment", you'll see:

#### Step 1: Choose Payment Type
- **Log a Payment** - For already-received payments
- **Run a Card Payment** - For processing new card payments

---

## 📝 Log a Payment Workflow

### Use Cases
- Customer paid with cash
- Check received
- Venmo/CashApp transfer completed
- Wire transfer received
- Any other non-card payment method

### Features

#### 1. Payment Amount
- Enter the amount received
- Real-time new balance calculation
- Cannot exceed current balance due

#### 2. Payment Method Selection
Choose from 5 options:
- **Cash** - Physical currency
- **Check** - Check payment
- **Venmo** - Venmo transfer
- **CashApp** - CashApp payment
- **Other** - Specify custom method (e.g., "Wire Transfer", "ACH", "PayPal")

#### 3. Notes (Optional)
- Add any relevant details about the payment
- Check number
- Transaction reference
- Special instructions
- Any other context

#### 4. Send Payment Receipt
Toggle on/off to send receipt to customer

##### Receipt Options:
- ✉️ **Email** - Send to customer's email address
- 💬 **Text** - Send to customer's phone number
- 📧 **Both** - Send via both methods

##### Receipt Preview
If receipts are enabled, you'll see a full preview showing:
- **Delivery methods** (email/text)
- **Subject line**
- **Complete message body** with:
  - Amount received
  - Payment method
  - Date
  - Invoice details
  - Previous and new balance
  - Notes (if added)

##### Actions:
- **Send Receipt & Log Payment** - Confirm and send
- **Skip Receipt** - Log payment without sending receipt
- **Back** - Return to edit payment details

### Receipt Message Format

```
Subject: Payment Receipt - Invoice INV-12345

Hi [Customer Name],

Thank you for your payment!

Payment Details:
• Amount Received: $500.00
• Payment Method: Cash
• Date: October 13, 2025

Invoice Information:
• Invoice Number: INV-12345
• Invoice Total: $1,500.00
• Previous Balance: $1,000.00
• New Balance: $500.00

Remaining balance due: $500.00

Notes: [Your notes here]

If you have any questions about this payment, please don't hesitate to contact us.

Best regards
```

---

## 💳 Run a Card Payment Workflow

### Use Cases
- Customer wants to pay with credit/debit card
- Process payment over the phone
- In-person card payment
- Online payment submission

### Features

#### 1. Balance Summary
Shows:
- Invoice Total
- Amount Already Paid (green)
- Current Balance Due (red, highlighted)

#### 2. Payment Amount
- Enter amount to charge
- Real-time "New Balance" preview
- Shows remaining balance after payment

#### 3. Card Details
- **Card Number** - Auto-formats with spaces (1234 5678 9012 3456)
- **Expiry Date** - Auto-formats as MM/YY
- **CVC** - Secure entry (3-4 digits)
- **Cardholder Name** - Full name on card

#### 4. Processing
- Validates all fields before processing
- Shows "Processing..." state
- Simulates Stripe payment (2 seconds)
- Creates transaction record
- Updates payment history
- Calculates new balance

---

## 🔄 User Flow Examples

### Example 1: Log Cash Payment with Receipt

1. Click **"Collect Payment"**
2. Choose **"Log a Payment"**
3. Enter **$500** as amount
4. Select **"Cash"** as payment method
5. Add note: **"Received from John at job site"**
6. Toggle **Send Receipt** ON
7. Select **Email** ✓ and **Text** ✓
8. Click **"Log Payment"**
9. **Receipt Preview** appears showing:
   - Will send to both email and text
   - Full message content
10. Click **"Send Receipt & Log Payment"**
11. ✅ Payment logged + Receipt sent

### Example 2: Log Venmo Payment without Receipt

1. Click **"Collect Payment"**
2. Choose **"Log a Payment"**
3. Enter **$250** as amount
4. Select **"Venmo"**
5. Add note: **"@johndoe - Venmo transaction #1234"**
6. Toggle **Send Receipt** OFF
7. Click **"Log Payment"**
8. ✅ Payment logged immediately (no preview)

### Example 3: Run Card Payment

1. Click **"Collect Payment"**
2. Choose **"Run a Card Payment"**
3. Enter **$1,000** as amount
4. See new balance will be **$0.00**
5. Enter card details:
   - **4242 4242 4242 4242**
   - **12/25**
   - **123**
   - **John Smith**
6. Click **"Process Payment - $1,000.00"**
7. Shows **"Processing..."** for 2 seconds
8. ✅ Payment processed successfully

### Example 4: Check Payment with Custom Note

1. Click **"Collect Payment"**
2. Choose **"Log a Payment"**
3. Enter **$750** as amount
4. Select **"Check"**
5. Add note: **"Check #5432 - deposited 10/13/2025"**
6. Toggle **Send Receipt** ON
7. Select **Email** only
8. Click **"Log Payment"**
9. Review receipt in preview
10. Click **"Send Receipt & Log Payment"**
11. ✅ Payment logged + Email sent

---

## 🎨 UI/UX Features

### Visual Design
- **Gradient headers** for payment modals
- **Color-coded amounts**:
  - Green for amounts paid
  - Red for balance due
  - Blue for new balance preview
- **Card icons** for visual distinction
- **Progress indicators** during processing
- **Real-time calculations** throughout

### Smart Validation
- Payment amount must be > 0
- Cannot exceed balance due
- Card number must be 15-16 digits
- Expiry must be in MM/YY format
- CVC must be 3-4 digits
- "Other" payment method requires specification

### Auto-Formatting
- **Card numbers**: Adds spaces every 4 digits
- **Expiry dates**: Auto-formats to MM/YY
- **Currency**: Always displays with $ and decimals

### User Guidance
- Back buttons on each step
- Clear labels and placeholders
- Contextual help text
- Preview before sending receipts
- Option to skip receipts

---

## 📊 Payment History

After logging or processing a payment:
- Appears immediately in **Payments** tab
- Shows:
  - Amount
  - Payment method (Check, Cash, Venmo, CashApp, Credit Card, etc.)
  - Status badge (completed)
  - Date processed
  - Transaction ID (PMT-XXXXX for logged, TXN-XXXXX for cards)

---

## 🔐 Security & Best Practices

### For Logged Payments
✅ Record payments immediately after receiving them  
✅ Include relevant details in notes  
✅ Send receipts for documentation  
✅ Use specific payment methods (not just "Other")

### For Card Payments
✅ Validate card details before processing  
✅ Never store card information locally  
✅ Use HTTPS in production  
✅ Implement Stripe webhook handlers  
✅ Handle declined cards gracefully

---

## 🚀 Integration Guide

### Stripe Integration (for Card Payments)

The card payment flow is ready for Stripe integration. See the main implementation guide for details, but here's a quick overview:

```typescript
// Replace the mock processing in handleProcessPayment()
// with actual Stripe API calls:

const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
  paymentMethodType: 'Card',
  paymentMethodData: {
    billingDetails: {
      name: cardholderName,
    },
  },
});
```

### Receipt Sending Integration

Currently, receipts are simulated. To implement:

```typescript
// In completePaymentLogging(), replace the Alert with:

if (receiptViaEmail) {
  await sendEmail({
    to: invoice.contactEmail,
    subject: message.subject,
    body: message.body,
  });
}

if (receiptViaText) {
  await sendSMS({
    to: invoice.contactPhone,
    message: message.body,
  });
}
```

---

## 📱 Keywords & Terminology

### Payment Methods
- **Cash** - Physical currency
- **Check** - Paper check
- **Venmo** - P2P payment app
- **CashApp** - Cash App by Square
- **Other** - Custom payment type
- **Credit Card** - Visa, Mastercard, Amex, Discover

### Payment Status
- **Completed** - Payment successfully processed
- **Pending** - Awaiting processing
- **Failed** - Payment declined or failed

### Transaction Types
- **Logged Payment** - Manually recorded (PMT prefix)
- **Card Payment** - Processed through Stripe (TXN prefix)

### Receipt Options
- **Email Receipt** - Sent to customer email
- **Text Receipt** - Sent via SMS
- **Both** - Email and text
- **Skip** - Don't send receipt

---

## 🎯 Feature Summary

### ✅ Completed Features

1. **Dual Payment Workflows**
   - Log manual payments
   - Process card payments

2. **Payment Methods**
   - Cash, Check, Venmo, CashApp, Other
   - Custom "Other" method specification

3. **Receipt System**
   - Toggle on/off
   - Email/Text selection
   - Full message preview
   - Professional formatting

4. **Real-Time Calculations**
   - New balance preview
   - Amount validation
   - Cannot overpay

5. **Payment History**
   - Transaction records
   - Payment method tracking
   - Status indicators

6. **Professional UI**
   - Multi-step wizard
   - Choice-based navigation
   - Back navigation
   - Visual feedback

---

## 💡 Tips for Users

### When to Log vs Run
- **Log a Payment**: Already received money outside the app
- **Run Card Payment**: Processing a new card transaction

### Receipt Best Practices
- Always send receipts for cash/check payments (documentation)
- Optional for electronic payments (already have confirmation)
- Include notes for clarity

### Payment Notes
- Check numbers
- Transaction IDs from other platforms
- Reference numbers
- Special circumstances
- Partial payment agreements

### Managing Partial Payments
- System prevents overpayment
- Can log multiple partial payments
- Each payment shows in history
- Balance updates after each payment

---

## 🆘 Troubleshooting

### "Amount cannot exceed balance due"
**Solution**: Enter an amount less than or equal to the current balance

### "Please specify the payment method"
**Solution**: When selecting "Other", type the payment method in the field that appears

### Receipt not sending
**Solution**: Ensure at least one option (Email or Text) is selected

### Card payment failing
**Solution**: Check card details for errors, ensure proper formatting

---

## 🔮 Future Enhancements

Potential additions:
- **Recurring payments** - Set up automatic payments
- **Split payments** - Split across multiple methods
- **Refunds** - Process partial/full refunds
- **Payment links** - Send payment request links
- **QR codes** - Generate payment QR codes
- **Apple Pay / Google Pay** - Digital wallets
- **ACH payments** - Bank transfers
- **International payments** - Multi-currency
- **Payment reminders** - Automated follow-ups

---

This payment collection system provides a complete, professional solution for managing invoice payments across multiple payment methods with optional receipt notifications and full message preview capabilities.

