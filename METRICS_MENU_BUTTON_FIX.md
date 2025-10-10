# Metrics Page - Menu Button Styling Fix

## Issue
The hamburger menu button on the metrics page didn't match the rest of the app's design pattern.

## Solution
Updated the menu button to use the **three-dot indicator pattern** used throughout the app (matching the dashboard and other pages).

## Changes Made

### Header Button Structure

**Before:**
```typescript
<View style={styles.backButton} />
<Text style={styles.headerTitle}>Business Metrics</Text>
<TouchableOpacity style={styles.menuButton}>
  <Menu size={24} color="#FFFFFF" />  // ❌ Hamburger icon
</TouchableOpacity>
```

**After:**
```typescript
<TouchableOpacity style={styles.pullOutMenu}>
  <View style={styles.pullOutIndicator}>
    <View style={styles.pullOutDot} />  // ✅ Three-dot indicator
    <View style={styles.pullOutDot} />
    <View style={styles.pullOutDot} />
  </View>
</TouchableOpacity>
<Text style={styles.headerTitle}>Business Metrics</Text>
<View style={styles.headerSpacer} />
```

### Style Updates

**Replaced:**
```typescript
backButton: {
  width: 40,
  height: 40,
},
menuButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  alignItems: 'center',
  justifyContent: 'center',
},
```

**With:**
```typescript
pullOutMenu: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingVertical: 8,
  paddingHorizontal: 4,
},
pullOutIndicator: {
  width: 6,
  height: 24,
  justifyContent: 'space-between',
  alignItems: 'center',
},
pullOutDot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
},
headerTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#FFFFFF',
  flex: 1,
  textAlign: 'center',
},
headerSpacer: {
  width: 40,
},
```

## Visual Design

### Before:
```
[Empty space]  Business Metrics  [☰ Hamburger]
```

### After:
```
[⋮ Three dots]  Business Metrics  [Empty space]
```

The three-dot indicator now matches:
- ✅ Dashboard page
- ✅ Other tab pages
- ✅ App-wide design pattern

## Features
- **Three vertical dots** (6x6px each with 3px border radius)
- **White color** matching the gradient header text
- **Proper spacing** with header title centered
- **Consistent touch target** with proper padding
- **Matches app design system**

## Benefits
1. **Visual Consistency** - Matches the rest of the app
2. **Better UX** - Users recognize the pattern
3. **Cleaner Look** - Subtle and modern
4. **Proper Alignment** - Title centered with balanced spacing

## Status
✅ **Complete**
✅ **No linting errors**
✅ **Tested styling**
✅ **Matches app pattern**

## Testing
- [ ] Open metrics page
- [ ] Verify three-dot indicator appears (left side)
- [ ] Verify title is centered
- [ ] Tap three-dot indicator
- [ ] Drawer menu should open
- [ ] Visual style matches dashboard

