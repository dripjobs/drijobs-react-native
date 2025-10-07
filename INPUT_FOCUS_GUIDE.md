# Input Focus Highlighting Guide

This guide explains how to implement focus highlighting for all text input fields across the application.

## What's Been Implemented

All text input fields now show a visual highlight when being typed in:
- **Border color** changes from gray (#E5E7EB) to indigo (#6366F1)
- **Background color** changes to a light indigo tint (#F5F7FF)
- **Shadow/glow** appears around the focused field
- **Subtle elevation** for depth

## Files Already Updated

✅ `components/DripItemModal.tsx` - Subject and content inputs
✅ `components/NewSequenceModal.tsx` - Sequence name and description
✅ `components/CreateLeadModal.tsx` - All contact and address fields

## How to Apply This Pattern

### Step 1: Add Focus State to Component

Add a state variable to track which input is focused:

```typescript
const [focusedInput, setFocusedInput] = useState<string | null>(null);
```

### Step 2: Wrap TextInput in Container View

Replace your existing TextInput:

**Before:**
```tsx
<TextInput
  style={styles.input}
  value={name}
  onChangeText={setName}
  placeholder="Enter name..."
/>
```

**After:**
```tsx
<View style={[
  styles.inputContainer,
  focusedInput === 'name' && styles.inputContainerFocused
]}>
  <TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="Enter name..."
    onFocus={() => setFocusedInput('name')}
    onBlur={() => setFocusedInput(null)}
  />
</View>
```

### Step 3: Update Styles

Add these new styles and update the existing input style:

```typescript
inputContainer: {
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  shadowColor: '#6366F1',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0,
  shadowRadius: 4,
  elevation: 0,
},
inputContainerFocused: {
  borderColor: '#6366F1',
  backgroundColor: '#F5F7FF',
  shadowOpacity: 0.15,
  elevation: 2,
},
input: {
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 16,
  color: '#111827',
  backgroundColor: 'transparent', // Important! Keep transparent
},
```

**Important:** Remove `borderWidth`, `borderColor`, and `backgroundColor` from the `input` style if they exist, as these are now handled by `inputContainer`.

### Step 4: For TextAreas (multiline inputs)

Apply the same pattern but keep the textArea style:

```tsx
<View style={[
  styles.inputContainer,
  focusedInput === 'description' && styles.inputContainerFocused
]}>
  <TextInput
    style={[styles.input, styles.textArea]}
    value={description}
    onChangeText={setDescription}
    placeholder="Enter description..."
    multiline
    numberOfLines={4}
    onFocus={() => setFocusedInput('description')}
    onBlur={() => setFocusedInput(null)}
  />
</View>
```

## Files That Need Updating

The following files contain TextInput components that should be updated:

### Priority 1 (High Usage Modals/Forms)
- [ ] `components/NewAppointmentModal.tsx`
- [ ] `components/NewProposalModal.tsx`
- [ ] `components/SendRequestModal.tsx`
- [ ] `app/(tabs)/contacts.tsx` - Contact edit forms
- [ ] `app/(tabs)/businesses.tsx` - Business edit forms
- [ ] `app/(tabs)/tasks.tsx` - Task creation/edit

### Priority 2 (Settings & Configuration)
- [ ] `app/account-settings.tsx`
- [ ] `app/booking-form-editor.tsx`
- [ ] `app/booking-forms.tsx`

### Priority 3 (Other Screens)
- [ ] `app/lead-center.tsx`
- [ ] `app/recurring-jobs.tsx`
- [ ] `app/(tabs)/chat.tsx` - Message input (special case, already styled)
- [ ] `app/(tabs)/email.tsx`
- [ ] `app/(tabs)/phone.tsx`

## Special Cases

### Chat/Message Inputs
For chat-style inputs that already have special styling, adjust the colors to match but keep the existing structure.

### Inline Edits
For inline edit fields, consider a more subtle animation to avoid disrupting the flow.

### Search Inputs
Apply the same pattern but with quicker animation timing for better responsiveness.

## Testing Checklist

After implementing, verify:
- [ ] Border color changes to indigo when focused
- [ ] Background gets light indigo tint when focused
- [ ] Shadow appears when focused
- [ ] All animations are smooth (no flickering)
- [ ] Input text is clearly visible in both states
- [ ] Placeholder text is visible
- [ ] Works on both iOS and Android
- [ ] No performance issues with multiple inputs on screen

## Benefits

1. **Better UX** - Users clearly see which field they're typing in
2. **Accessibility** - Visual feedback for focus state
3. **Modern Design** - Matches current design trends
4. **Consistency** - Same behavior across all inputs
5. **Professional** - Polished, attention to detail

## Questions?

See the implemented examples in:
- `components/DripItemModal.tsx`
- `components/NewSequenceModal.tsx`
- `components/CreateLeadModal.tsx`
