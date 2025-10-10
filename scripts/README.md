# Input Focus Highlighting Automation Scripts

This directory contains scripts to automate the implementation of input focus highlighting across the application.

## Scripts

### 1. `add-input-focus.js`
Adds the focus state and styles to files. This is the first step.

**What it does:**
- Adds `const [focusedInput, setFocusedInput] = useState<string | null>(null);`
- Adds `inputContainer` and `inputContainerFocused` styles
- Updates existing input styles to use `backgroundColor: 'transparent'`
- Identifies TextInput components that need wrapping

**Usage:**
```bash
# Preview changes without modifying files
node scripts/add-input-focus.js --dry-run

# Apply changes to all files
node scripts/add-input-focus.js

# Process a single file
node scripts/add-input-focus.js --file app/(tabs)/contacts.tsx
```

### 2. `wrap-textinputs.js`
Analyzes a file and provides guidance for wrapping TextInput components.

**What it does:**
- Scans for all TextInput components
- Identifies which ones are already wrapped
- Generates wrapper code examples
- Provides field name suggestions

**Usage:**
```bash
# Analyze a file
node scripts/wrap-textinputs.js --file app/(tabs)/contacts.tsx

# With dry-run flag
node scripts/wrap-textinputs.js --file app/(tabs)/contacts.tsx --dry-run
```

## Workflow

### Automated Approach (Recommended)

1. **Run the analysis script** to add focus state and styles:
   ```bash
   node scripts/add-input-focus.js --dry-run
   ```

2. **Review the output** to see what changes will be made

3. **Apply the changes**:
   ```bash
   node scripts/add-input-focus.js
   ```

4. **For each file with TextInputs**, use the wrapper tool:
   ```bash
   node scripts/wrap-textinputs.js --file path/to/file.tsx
   ```

5. **Manually wrap the TextInputs** using the provided examples (currently requires manual wrapping due to AST complexity)

6. **Test the file** to ensure focus highlighting works correctly

### Manual Approach (For Complex Files)

For files with complex TextInput patterns:

1. Add focus state manually:
   ```tsx
   const [focusedInput, setFocusedInput] = useState<string | null>(null);
   ```

2. Wrap each TextInput:
   ```tsx
   <View style={[
     styles.inputContainer,
     focusedInput === 'fieldName' && styles.inputContainerFocused
   ]}>
     <TextInput
       onFocus={() => setFocusedInput('fieldName')}
       onBlur={() => setFocusedInput(null)}
       {...props}
     />
   </View>
   ```

3. Add styles (copy from completed files):
   ```tsx
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
   ```

## File Status Tracking

Refer to `FOCUS_IMPLEMENTATION_PROGRESS.md` in the root directory for the current status of all files.

**Completed files** (these are automatically skipped by the scripts):
- components/NewAppointmentModal.tsx
- components/NewProposalModal.tsx
- components/SendRequestModal.tsx
- components/ProductModal.tsx
- components/InvoiceDetail.tsx
- components/JobTasksModal.tsx
- components/DripItemModal.tsx
- components/NewSequenceModal.tsx
- components/CreateLeadModal.tsx
- And more... (see COMPLETED_FILES in add-input-focus.js)

## Notes

- The scripts are designed to be safe and non-destructive
- Always run with `--dry-run` first to preview changes
- Keep backups or use git to track changes
- Test each file after modification
- Some complex TextInput patterns may need manual adjustment

## Troubleshooting

**Script can't find useState declarations:**
- Ensure the file has at least one useState call
- Check that the component is a functional component

**TextInputs not detected:**
- Verify the file uses `<TextInput` (not lowercase)
- Check for import from 'react-native'

**Styles not added:**
- Ensure file has `StyleSheet.create({`
- Check for syntax errors in existing styles

**Focus not working after wrapping:**
- Verify focus state was added
- Check that styles include inputContainerFocused
- Ensure onFocus/onBlur handlers are present
- Test on both iOS and Android

## Support

For issues or questions:
1. Check `INPUT_FOCUS_GUIDE.md` for the implementation pattern
2. Review `FOCUS_IMPLEMENTATION_PROGRESS.md` for file status
3. Look at completed files as reference examples
4. Ensure all dependencies are installed: `npm install`

