# Menu Button Implementation Guidelines

## Standard Menu Button

All pages in the DripJobs React Native app should use the **standardized pull-out menu button** with three vertical dots and a chevron arrow. This creates a consistent user experience across the application.

## Visual Design

The menu button consists of:
- **Three vertical dots** (6x6 pixels each, 3px border radius)
- **Chevron right arrow** (16px size)
- Dots are stacked vertically with equal spacing
- Clean, minimalist design without background styling

## Implementation

### JSX Structure

```tsx
<TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
  <View style={styles.pullOutIndicator}>
    <View style={styles.pullOutDot} />
    <View style={styles.pullOutDot} />
    <View style={styles.pullOutDot} />
  </View>
  <View style={styles.pullOutArrow}>
    <ChevronRight size={16} color="#FFFFFF" />
  </View>
</TouchableOpacity>
```

### Required Import

```tsx
import { ChevronRight } from 'lucide-react-native';
```

### StyleSheet Definitions

```tsx
pullOutMenu: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
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
  backgroundColor: '#FFFFFF', // Or adjust color to match header background
},
pullOutArrow: {
  marginLeft: 4,
},
```

## Color Customization

The dot and arrow colors should be adjusted based on the header background:

- **Purple/Gradient Headers**: Use `#FFFFFF` (white) for dots and chevron
- **White Headers**: Use `#6366F1` (indigo) for dots and chevron
- **Other Headers**: Choose a contrasting color that maintains readability

## Placement

The menu button should be:
- Positioned on the **left side** of the header
- Aligned with other header elements (title, action buttons)
- Part of the main header View container

## Example Header Structure

```tsx
<LinearGradient
  colors={['#6366F1', '#8B5CF6', '#A855F7']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientHeader}
>
  <View style={styles.header}>
    <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
      <View style={styles.pullOutIndicator}>
        <View style={styles.pullOutDot} />
        <View style={styles.pullOutDot} />
        <View style={styles.pullOutDot} />
      </View>
      <View style={styles.pullOutArrow}>
        <ChevronRight size={16} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Page Title</Text>
    <TouchableOpacity style={styles.headerButton}>
      {/* Action button */}
    </TouchableOpacity>
  </View>
</LinearGradient>
```

## Do NOT Use

❌ **Hamburger menu icons** (`<Menu />` from lucide-react-native)
❌ **Different dot arrangements** (horizontal dots, different sizes)
❌ **Additional styling** (backgrounds, borders, shadows on the menu button itself)
❌ **Different icon sets** or custom menu implementations

## Updated Pages

The following pages have been updated to use the standard menu button:

### Tab Pages
- ✅ `app/(tabs)/chat.tsx` - Original reference implementation
- ✅ `app/(tabs)/index.tsx` - Dashboard
- ✅ `app/(tabs)/phone.tsx`
- ✅ `app/(tabs)/contacts.tsx`
- ✅ `app/(tabs)/pipeline.tsx`
- ✅ `app/(tabs)/team-chat.tsx`
- ✅ `app/(tabs)/work-orders.tsx`

### Standalone Pages
- ✅ `app/appointments.tsx`
- ✅ `app/notifications.tsx`

## Future Implementation

When creating new pages:

1. Copy the exact JSX structure from above
2. Copy the exact StyleSheet definitions
3. Import `ChevronRight` from lucide-react-native
4. Ensure you have `DrawerMenu` component imported and set up
5. Adjust dot and arrow colors to match your header design
6. Test on both iOS and Android devices

## Questions?

If you're unsure about implementation, refer to `app/(tabs)/chat.tsx` as the reference implementation.

---

**Last Updated**: October 3, 2025
**Maintained By**: Development Team

