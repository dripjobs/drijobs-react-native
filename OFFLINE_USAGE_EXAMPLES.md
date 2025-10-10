# Offline Functionality - Practical Usage Examples

## Quick Start

The offline functionality is **already active** in your app! Here's what you can do right now:

### 1. Test It Immediately

1. **Start your app** (it's already configured)
2. **Turn on Airplane Mode** on your device
3. **See the red "No Internet Connection" banner** appear at top
4. **Navigate around** - all existing screens work with mock data
5. **Turn off Airplane Mode**
6. **Banner disappears** automatically

That's it! No code changes needed for basic offline detection.

## Integration Patterns

### Pattern 1: Read-Only Screen (Viewing Data)

Perfect for screens that just display data (Contacts, Appointments, etc.)

```typescript
import { useNetwork } from '@/contexts/NetworkContext';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

export default function ContactsScreen() {
  const { isConnected } = useNetwork();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      // ApiService automatically:
      // - Returns cached data if offline
      // - Fetches fresh data if online
      // - Falls back to cache on network error
      const response = await ApiService.fetch('/contacts', {
        method: 'GET',
        entityType: 'contact', // Used for caching
      });
      
      setContacts(response.data);
      setFromCache(response.cached);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      // ApiService already shows a toast message
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Show cache indicator */}
      {fromCache && (
        <View style={styles.cacheIndicator}>
          <Text>Viewing cached data</Text>
        </View>
      )}
      
      {/* Your existing UI */}
      <FlatList
        data={contacts}
        renderItem={({ item }) => <ContactCard contact={item} />}
        onRefresh={loadContacts}
        refreshing={loading}
      />
    </View>
  );
}
```

### Pattern 2: Create/Edit Screen (Mutating Data)

For screens where users create or edit data:

```typescript
import { useNetwork } from '@/contexts/NetworkContext';
import ApiService from '@/services/ApiService';

export default function CreateContactScreen() {
  const { isConnected } = useNetwork();
  const [saving, setSaving] = useState(false);

  const handleSave = async (contactData) => {
    try {
      setSaving(true);
      
      await ApiService.fetch('/contacts', {
        method: 'POST',
        entityType: 'contact',
        body: JSON.stringify(contactData),
      });
      
      // If online: Success!
      // If offline: Request queued, user sees toast
      
      navigation.goBack();
    } catch (error) {
      if (error.message?.includes('queued')) {
        // Request was queued for later - this is success!
        navigation.goBack();
        return;
      }
      
      // Actual error occurred
      Alert.alert('Error', 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      {/* Show offline warning */}
      {!isConnected && (
        <View style={styles.offlineWarning}>
          <Text>You're offline - changes will sync automatically</Text>
        </View>
      )}
      
      {/* Your form */}
      <TextInput placeholder="Name" />
      <TextInput placeholder="Email" />
      
      <Button 
        title={isConnected ? 'Save' : 'Save (will sync later)'} 
        onPress={handleSave}
        disabled={saving}
      />
    </View>
  );
}
```

### Pattern 3: Optimistic Updates

Update UI immediately, sync in background:

```typescript
const handleToggleFavorite = async (contactId) => {
  // Get current state
  const contact = contacts.find(c => c.id === contactId);
  const newFavoriteState = !contact.isFavorite;
  
  // Update UI immediately (optimistic)
  setContacts(contacts.map(c => 
    c.id === contactId 
      ? { ...c, isFavorite: newFavoriteState }
      : c
  ));
  
  try {
    // Sync to backend/queue
    await ApiService.fetch(`/contacts/${contactId}/favorite`, {
      method: 'PUT',
      entityType: 'contact',
      entityId: contactId,
      body: JSON.stringify({ isFavorite: newFavoriteState }),
    });
  } catch (error) {
    // Rollback on actual error (not when queued)
    if (!error.message?.includes('queued')) {
      setContacts(contacts.map(c => 
        c.id === contactId 
          ? { ...c, isFavorite: !newFavoriteState }
          : c
      ));
    }
  }
};
```

## Real-World Example: Upgrading Your Dashboard

Here's how to add offline support to `app/(tabs)/index.tsx`:

```typescript
// At the top of your Dashboard component
import { useNetwork } from '@/contexts/NetworkContext';
import ApiService from '@/services/ApiService';

export default function Dashboard() {
  const { isConnected } = useNetwork();
  
  // Add cache state
  const [dataFromCache, setDataFromCache] = useState(false);
  
  // Modify your data loading (if you add API calls later)
  const loadDashboardData = async () => {
    try {
      const response = await ApiService.fetch('/dashboard', {
        method: 'GET',
        entityType: 'dashboard',
      });
      
      setDataFromCache(response.cached);
      // Use response.data for your state
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
  };
  
  // Add a subtle indicator in your UI
  return (
    <View>
      {/* Add this near your top header */}
      {dataFromCache && (
        <Text style={{ 
          fontSize: 11, 
          color: '#999', 
          textAlign: 'center',
          marginTop: 4 
        }}>
          Last updated: {getLastUpdateTime()}
        </Text>
      )}
      
      {/* Your existing dashboard UI */}
    </View>
  );
}
```

## Working with Mock Data (Current State)

Your app currently uses mock data. Here's how offline works **right now**:

### Current Behavior ✅

1. **Network detection works** - banner shows when offline
2. **Mock data always available** - screens work offline
3. **AsyncStorage caching works** - settings persist
4. **Visual feedback works** - users see offline state

### When You Add Real APIs 🔄

Just replace mock arrays with API calls:

```typescript
// BEFORE (Mock Data)
const [contacts, setContacts] = useState([
  { id: 1, name: 'John Doe', phone: '555-0100' },
  { id: 2, name: 'Jane Smith', phone: '555-0101' },
]);

// AFTER (API with Offline Support)
const [contacts, setContacts] = useState([]);

useEffect(() => {
  loadContacts();
}, []);

const loadContacts = async () => {
  const { data } = await ApiService.fetch('/contacts', {
    method: 'GET',
    entityType: 'contact',
  });
  setContacts(data);
};
```

## Common Scenarios

### Scenario 1: User Creates Contact While Offline

```typescript
// User fills form and taps Save
const handleSave = async (data) => {
  await ApiService.fetch('/contacts', {
    method: 'POST',
    entityType: 'contact',
    body: JSON.stringify(data),
  });
  // If offline: Toast shows "will sync when online"
  // Request added to queue
  // UI can show success
};

// Later, when internet returns:
// - ApiService automatically syncs
// - Sync badge shows progress
// - Success toast appears
// - Contact created on server
```

### Scenario 2: User Edits Appointment While Offline

```typescript
const handleUpdate = async (appointmentId, updates) => {
  // Optimistically update UI
  setAppointments(appointments.map(a => 
    a.id === appointmentId ? { ...a, ...updates } : a
  ));
  
  // Queue the request
  await ApiService.fetch(`/appointments/${appointmentId}`, {
    method: 'PUT',
    entityType: 'appointment',
    entityId: appointmentId,
    body: JSON.stringify(updates),
  });
  
  // If offline: Queued
  // If online: Immediate
};
```

### Scenario 3: User Views Contacts Offline

```typescript
const loadContacts = async () => {
  const { data, cached } = await ApiService.fetch('/contacts', {
    method: 'GET',
    entityType: 'contact',
  });
  
  // If offline: data from cache, cached = true
  // If online: data from API, cached = false (but also cached for next time)
  
  setContacts(data);
  setCachedData(cached);
};
```

## Advanced Patterns

### Pattern: Pull-to-Refresh with Cache

```typescript
const onRefresh = async () => {
  setRefreshing(true);
  
  try {
    const { data, cached } = await ApiService.fetch('/contacts', {
      method: 'GET',
      entityType: 'contact',
      skipCache: !isConnected, // Only skip cache if online
    });
    
    setContacts(data);
    
    if (cached && isConnected) {
      // Show message that we're loading fresh data
      Toast.show({ text1: 'Refreshing...' });
    }
  } finally {
    setRefreshing(false);
  }
};
```

### Pattern: Show Stale Data Warning

```typescript
import OfflineStorageService from '@/services/OfflineStorageService';

const [isStale, setIsStale] = useState(false);

useEffect(() => {
  checkCacheAge();
}, []);

const checkCacheAge = async () => {
  const lastSync = await OfflineStorageService.getLastSync('@offline_contacts');
  
  if (lastSync) {
    const hoursSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60);
    setIsStale(hoursSinceSync > 4); // Warn if data is >4 hours old
  }
};

// In your UI:
{isStale && !isConnected && (
  <Text style={{ color: 'orange' }}>
    ⚠️ This data may be outdated
  </Text>
)}
```

### Pattern: Manual Cache Management

```typescript
import OfflineStorageService from '@/services/OfflineStorageService';

// Clear specific cache
const clearContactsCache = async () => {
  await OfflineStorageService.clearCache('@offline_contacts');
  await loadContacts(); // Reload fresh data
};

// Check cache info
const getCacheInfo = async () => {
  const info = await OfflineStorageService.getCacheInfo();
  console.log('Cache sizes:', info);
};

// Check if cache is valid
const isValid = await OfflineStorageService.isCacheValid('@offline_contacts');
```

## Testing Checklist

Test these scenarios in your app:

- [ ] **Go offline** - See offline indicator
- [ ] **View cached data** - Navigate screens offline
- [ ] **Create item offline** - See "will sync" message
- [ ] **Edit item offline** - Changes saved locally
- [ ] **Go back online** - See sync badge appear
- [ ] **Sync completes** - See success toast
- [ ] **Manual sync** - Tap sync badge
- [ ] **Poor connection** - See graceful fallback to cache
- [ ] **Airplane mode toggle** - Banner appears/disappears smoothly

## Performance Tips

1. **Debounce API calls** - Don't call API on every keystroke
2. **Batch updates** - Group multiple changes into one request
3. **Lazy load** - Only fetch data when needed
4. **Pagination** - Don't cache huge lists
5. **Compression** - Use gzip for large payloads
6. **Selective caching** - Not everything needs to be cached

## Summary

Your app is **ready for offline use**! 

**Available Now:**
- ✅ Offline detection
- ✅ Visual indicators
- ✅ Request queuing
- ✅ Automatic sync
- ✅ Manual sync
- ✅ Cache management

**When You Add APIs:**
- Just use `ApiService.fetch()` instead of `fetch()`
- Everything else is automatic!

**No Breaking Changes:**
- All existing code continues to work
- Mock data still works
- Gradual migration possible

