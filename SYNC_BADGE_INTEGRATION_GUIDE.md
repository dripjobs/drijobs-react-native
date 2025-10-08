# QuickBooks Sync Badge Integration Guide

## Overview

This guide provides step-by-step instructions for adding QuickBooks sync badges to screens throughout the DripJobs app. Follow this pattern for consistent implementation.

## Pattern Overview

The integration pattern consists of:
1. Import the `QuickBooksSyncBadge` component and types
2. Add sync metadata to your data models
3. Render the badge next to entity items
4. Handle badge press events (optional)

---

## Step 1: Import Dependencies

Add these imports to your screen file:

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus, SyncMetadata } from '@/types/quickbooks';
```

---

## Step 2: Extend Your Data Model

Add sync metadata to your entity interface. For example, for contacts:

```typescript
interface Contact extends SyncMetadata {
  id: string;
  name: string;
  email: string;
  // ... other fields
  // SyncMetadata adds:
  // quickbooksId?: string;
  // syncStatus: SyncStatus;
  // lastSyncedAt?: string;
  // lastSyncError?: string;
  // syncVersion?: number;
}
```

---

## Step 3: Add Mock/Real Sync Data

### For Development (Mock Data):

```typescript
const contacts = [
  {
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    // Add sync metadata
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QB123',
    lastSyncedAt: '2025-10-07T12:00:00Z',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@example.com',
    // Not synced yet
    syncStatus: 'not_synced' as SyncStatus,
  },
  {
    id: 3,
    name: 'Jane Doe',
    email: 'jane@example.com',
    // Pending sync
    syncStatus: 'pending' as SyncStatus,
  },
  {
    id: 4,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    // Error state
    syncStatus: 'error' as SyncStatus,
    lastSyncError: 'Duplicate customer name exists in QuickBooks',
  },
];
```

### For Production (Real Data):

Fetch sync metadata from your API:

```typescript
useEffect(() => {
  const loadContactsWithSyncStatus = async () => {
    const contactsData = await fetchContacts();
    // contactsData already includes syncStatus, quickbooksId, etc.
    setContacts(contactsData);
  };
  
  loadContactsWithSyncStatus();
}, []);
```

---

## Step 4: Render the Badge

### Pattern A: List Items (Small Badge)

For contact/business/invoice lists:

```typescript
<View style={styles.contactItem}>
  <View style={styles.contactInfo}>
    <Text style={styles.contactName}>{contact.name}</Text>
    <Text style={styles.contactEmail}>{contact.email}</Text>
  </View>
  
  {/* Add sync badge */}
  <QuickBooksSyncBadge
    syncStatus={contact.syncStatus}
    lastSyncedAt={contact.lastSyncedAt}
    quickbooksId={contact.quickbooksId}
    errorMessage={contact.lastSyncError}
    size="small"
    showLabel={false}
  />
</View>
```

### Pattern B: Detail View (Medium Badge with Label)

For contact/business/invoice detail screens:

```typescript
<View style={styles.detailHeader}>
  <Text style={styles.detailName}>{contact.name}</Text>
  
  {/* Add sync badge with label */}
  <QuickBooksSyncBadge
    syncStatus={contact.syncStatus}
    lastSyncedAt={contact.lastSyncedAt}
    quickbooksId={contact.quickbooksId}
    errorMessage={contact.lastSyncError}
    size="medium"
    showLabel={true}
  />
</View>
```

### Pattern C: Cards (Large Badge)

For proposal or invoice cards:

```typescript
<View style={styles.invoiceCard}>
  <View style={styles.cardHeader}>
    <Text style={styles.invoiceNumber}>INV-1001</Text>
    <Text style={styles.invoiceAmount}>$1,500.00</Text>
  </View>
  
  <View style={styles.cardFooter}>
    <Text style={styles.invoiceDate}>Due: Oct 15, 2025</Text>
    
    {/* Add large sync badge */}
    <QuickBooksSyncBadge
      syncStatus={invoice.syncStatus}
      lastSyncedAt={invoice.lastSyncedAt}
      quickbooksId={invoice.quickbooksId}
      errorMessage={invoice.lastSyncError}
      size="large"
      showLabel={true}
    />
  </View>
</View>
```

---

## Complete Examples by Screen

### Example 1: Contacts Screen

**File:** `app/(tabs)/contacts.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

// In your contacts array, add sync status:
const contacts = [
  { 
    id: 1, 
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QB123',
    lastSyncedAt: '2025-10-07T12:00:00Z',
  },
  // ... more contacts
];

// In your render function:
return (
  <ScrollView>
    {contacts.map((contact) => (
      <TouchableOpacity
        key={contact.id}
        style={styles.contactRow}
        onPress={() => handleContactPress(contact)}
      >
        <View style={styles.contactInfo}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.email}>{contact.email}</Text>
        </View>
        
        <QuickBooksSyncBadge
          syncStatus={contact.syncStatus}
          lastSyncedAt={contact.lastSyncedAt}
          quickbooksId={contact.quickbooksId}
          size="small"
          showLabel={false}
        />
      </TouchableOpacity>
    ))}
  </ScrollView>
);
```

### Example 2: Businesses Screen

**File:** `app/(tabs)/businesses.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

const businesses = [
  {
    id: 1,
    name: 'Acme Corporation',
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QB456',
    lastSyncedAt: '2025-10-07T11:30:00Z',
  },
  // ... more businesses
];

return (
  <View style={styles.businessCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.businessName}>{business.name}</Text>
      
      <QuickBooksSyncBadge
        syncStatus={business.syncStatus}
        lastSyncedAt={business.lastSyncedAt}
        quickbooksId={business.quickbooksId}
        size="medium"
        showLabel={true}
      />
    </View>
    {/* ... rest of card */}
  </View>
);
```

### Example 3: Invoices Screen

**File:** `app/invoices.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

const invoices = [
  {
    id: 1,
    invoiceNumber: 'INV-1001',
    amount: 1500.00,
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QB789',
    lastSyncedAt: '2025-10-07T10:00:00Z',
  },
  {
    id: 2,
    invoiceNumber: 'INV-1002',
    amount: 2000.00,
    syncStatus: 'pending' as SyncStatus,
  },
  // ... more invoices
];

return (
  <View style={styles.invoiceList}>
    {invoices.map((invoice) => (
      <View key={invoice.id} style={styles.invoiceCard}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.invoiceAmount}>${invoice.amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.invoiceFooter}>
          <Text style={styles.invoiceStatus}>Due Soon</Text>
          
          <QuickBooksSyncBadge
            syncStatus={invoice.syncStatus}
            lastSyncedAt={invoice.lastSyncedAt}
            quickbooksId={invoice.quickbooksId}
            size="medium"
            showLabel={true}
          />
        </View>
      </View>
    ))}
  </View>
);
```

### Example 4: Proposals Screen

**File:** `app/proposals.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

const proposals = [
  {
    id: 1,
    title: 'Website Redesign',
    amount: 5000.00,
    status: 'Accepted',
    jobStatus: 'Pending', // Not started yet
    syncStatus: 'not_synced' as SyncStatus,
    syncMessage: 'Will sync when job starts',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    amount: 15000.00,
    status: 'Accepted',
    jobStatus: 'In Progress',
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QB999',
    lastSyncedAt: '2025-10-07T09:00:00Z',
  },
];

return (
  <View style={styles.proposalCard}>
    <Text style={styles.proposalTitle}>{proposal.title}</Text>
    <Text style={styles.proposalAmount}>${proposal.amount.toFixed(2)}</Text>
    
    <View style={styles.statusRow}>
      <Text style={styles.jobStatus}>{proposal.jobStatus}</Text>
      
      <QuickBooksSyncBadge
        syncStatus={proposal.syncStatus}
        lastSyncedAt={proposal.lastSyncedAt}
        quickbooksId={proposal.quickbooksId}
        size="medium"
        showLabel={true}
      />
    </View>
    
    {proposal.syncStatus === 'not_synced' && (
      <Text style={styles.syncNote}>{proposal.syncMessage}</Text>
    )}
  </View>
);
```

### Example 5: Work Orders Screen

**File:** `app/(tabs)/work-orders.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

const workOrders = [
  {
    id: 1,
    orderNumber: 'WO-1001',
    customer: 'Acme Corp',
    status: 'In Progress',
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QBINV123',
    lastSyncedAt: '2025-10-07T08:00:00Z',
  },
];

return (
  <View style={styles.workOrderCard}>
    <View style={styles.cardRow}>
      <Text style={styles.orderNumber}>{workOrder.orderNumber}</Text>
      
      <QuickBooksSyncBadge
        syncStatus={workOrder.syncStatus}
        lastSyncedAt={workOrder.lastSyncedAt}
        quickbooksId={workOrder.quickbooksId}
        size="small"
        showLabel={false}
      />
    </View>
    <Text style={styles.customer}>{workOrder.customer}</Text>
    <Text style={styles.status}>{workOrder.status}</Text>
  </View>
);
```

### Example 6: Recurring Jobs Screen

**File:** `app/recurring-jobs.tsx`

```typescript
import QuickBooksSyncBadge from '@/components/QuickBooksSyncBadge';
import { SyncStatus } from '@/types/quickbooks';

const recurringJobs = [
  {
    id: 1,
    title: 'Monthly Lawn Care',
    frequency: 'Monthly',
    amount: 150.00,
    isActive: true,
    syncStatus: 'synced' as SyncStatus,
    quickbooksId: 'QBRT123',
    lastSyncedAt: '2025-10-01T00:00:00Z',
  },
];

return (
  <View style={styles.recurringJobCard}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.frequency}>{job.frequency}</Text>
      </View>
      
      <QuickBooksSyncBadge
        syncStatus={job.syncStatus}
        lastSyncedAt={job.lastSyncedAt}
        quickbooksId={job.quickbooksId}
        size="medium"
        showLabel={true}
      />
    </View>
    
    <Text style={styles.amount}>${job.amount.toFixed(2)}/month</Text>
    <Text style={styles.activeStatus}>
      {job.isActive ? 'Active' : 'Inactive'}
    </Text>
  </View>
);
```

---

## Styling Guidelines

### Recommended Styles for Badge Placement

```typescript
const styles = StyleSheet.create({
  // List item with badge
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  // Card header with badge
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Card footer with badge
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
```

---

## Handling Badge Press (Advanced)

### Option 1: Use Default Modal

The badge component includes a built-in modal that shows on press. No additional code needed!

```typescript
<QuickBooksSyncBadge
  syncStatus={entity.syncStatus}
  lastSyncedAt={entity.lastSyncedAt}
  quickbooksId={entity.quickbooksId}
  // Built-in modal shows automatically on press
/>
```

### Option 2: Custom Action

If you need custom behavior on badge press:

```typescript
<QuickBooksSyncBadge
  syncStatus={entity.syncStatus}
  lastSyncedAt={entity.lastSyncedAt}
  quickbooksId={entity.quickbooksId}
  onPress={() => {
    // Custom action
    if (entity.syncStatus === 'error') {
      Alert.alert('Sync Error', entity.lastSyncError);
    } else {
      // Navigate to QuickBooks in browser
      Linking.openURL(`https://qbo.intuit.com/app/invoice?txnId=${entity.quickbooksId}`);
    }
  }}
/>
```

---

## Role-Based Display

Show sync badges only for relevant roles:

```typescript
import { useUserRole } from '@/contexts/UserRoleContext';

function MyScreen() {
  const { currentRole } = useUserRole();
  
  return (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      
      {/* Show sync badge for admin and accountant */}
      {(currentRole === 'admin' || currentRole === 'accountant') && (
        <QuickBooksSyncBadge
          syncStatus={item.syncStatus}
          lastSyncedAt={item.lastSyncedAt}
          quickbooksId={item.quickbooksId}
        />
      )}
    </View>
  );
}
```

---

## Dynamic Sync Status

Update sync status in real-time:

```typescript
import QuickBooksService from '@/services/QuickBooksService';

function MyScreen() {
  const [contacts, setContacts] = useState([]);
  
  const syncContact = async (contactId: string) => {
    // Update UI to pending
    setContacts(prev => prev.map(c => 
      c.id === contactId 
        ? { ...c, syncStatus: 'pending' as SyncStatus }
        : c
    ));
    
    try {
      // Perform sync
      const response = await QuickBooksService.syncContact(contact, parentBusinessQBId);
      
      if (response.success) {
        // Update UI to synced
        setContacts(prev => prev.map(c =>
          c.id === contactId
            ? {
                ...c,
                syncStatus: 'synced' as SyncStatus,
                quickbooksId: response.quickbooksId,
                lastSyncedAt: new Date().toISOString(),
              }
            : c
        ));
      } else {
        // Update UI to error
        setContacts(prev => prev.map(c =>
          c.id === contactId
            ? {
                ...c,
                syncStatus: 'error' as SyncStatus,
                lastSyncError: response.error,
              }
            : c
        ));
      }
    } catch (error) {
      // Handle error
      setContacts(prev => prev.map(c =>
        c.id === contactId
          ? {
              ...c,
              syncStatus: 'error' as SyncStatus,
              lastSyncError: error.message,
            }
          : c
      ));
    }
  };
  
  return (
    // Your component JSX
  );
}
```

---

## Testing Checklist

After adding sync badges to a screen:

- [ ] Badge displays correctly for each sync status
- [ ] Badge press opens details modal
- [ ] Sync status updates in real-time
- [ ] QuickBooks ID displayed correctly
- [ ] Error messages show when present
- [ ] Last sync timestamp displays correctly
- [ ] Badge sizes render appropriately
- [ ] Labels show/hide based on `showLabel` prop
- [ ] Badge responsive on different screen sizes
- [ ] Accessibility labels present

---

## Troubleshooting

### Badge Not Showing
**Problem:** Badge doesn't render

**Solutions:**
1. Check entity has `syncStatus` field
2. Verify import path is correct
3. Ensure SyncStatus type is properly typed
4. Check for console errors

### Wrong Status Displayed
**Problem:** Badge shows wrong status

**Solutions:**
1. Verify `syncStatus` value is valid SyncStatus type
2. Check data source is correct
3. Ensure state updates properly
4. Log syncStatus value to console

### Modal Not Opening
**Problem:** Click badge but modal doesn't show

**Solutions:**
1. Ensure no `onPress` prop (uses default behavior)
2. Check for TouchableOpacity/Pressable conflicts
3. Verify no parent blocking touch events
4. Check modal z-index and overlay

---

## Summary

To add sync badges to any screen:
1. Import `QuickBooksSyncBadge` and `SyncStatus`
2. Add sync metadata to your data model
3. Place badge in your render method
4. Choose appropriate size and showLabel props
5. Test all sync states

The badge component handles all display logic, modal interactions, and styling automatically!
