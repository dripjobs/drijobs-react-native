#!/usr/bin/env node

/**
 * Automated Input Focus Highlighting Implementation Script
 * 
 * This script adds focus highlighting to all TextInput components in React Native files
 * by wrapping them with focus state management and applying focused styles.
 * 
 * Usage:
 *   node scripts/add-input-focus.js --dry-run          # Preview changes
 *   node scripts/add-input-focus.js                     # Apply changes
 *   node scripts/add-input-focus.js --file path/to/file.tsx  # Single file
 */

const fs = require('fs');
const path = require('path');

const FOCUS_STATE = `const [focusedInput, setFocusedInput] = useState<string | null>(null);`;

const FOCUS_STYLES = `  inputContainer: {
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
  },`;

// Files already completed (skip these)
const COMPLETED_FILES = [
  'components/NewAppointmentModal.tsx',
  'components/NewProposalModal.tsx',
  'components/SendRequestModal.tsx',
  'components/ProductModal.tsx',
  'components/InvoiceDetail.tsx',
  'components/JobTasksModal.tsx',
  'components/DripItemModal.tsx',
  'components/NewSequenceModal.tsx',
  'components/CreateLeadModal.tsx',
  'components/NewAutomationModal.tsx',
  'components/AutomationStepModal.tsx',
  'components/AutomationSettingsModal.tsx',
  'components/AutomationFilterBuilder.tsx',
  'components/SequenceSettingsModal.tsx',
  'components/CreateJobModal.tsx',
];

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const singleFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

console.log('🚀 Input Focus Highlighting Automation Script');
console.log('============================================\n');

if (dryRun) {
  console.log('⚠️  DRY RUN MODE - No files will be modified\n');
}

/**
 * Generate unique field name from context
 */
function generateFieldName(line, index) {
  // Try to extract from placeholder
  const placeholderMatch = line.match(/placeholder=["']([^"']+)["']/);
  if (placeholderMatch) {
    return placeholderMatch[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 20);
  }
  
  // Try to extract from value binding
  const valueMatch = line.match(/value=\{([^}]+)\}/);
  if (valueMatch) {
    const varName = valueMatch[1].trim();
    // Extract the actual variable name
    const match = varName.match(/[\w.]+\.(\w+)|(\w+)/);
    if (match) {
      return match[1] || match[2];
    }
  }
  
  // Fallback to index-based name
  return `input${index}`;
}

/**
 * Check if file already has focus state
 */
function hasFocusState(content) {
  return content.includes('focusedInput') || 
         content.includes('setFocusedInput');
}

/**
 * Check if file already has focus styles
 */
function hasFocusStyles(content) {
  return content.includes('inputContainerFocused') ||
         content.includes('F5F7FF'); // The focused background color
}

/**
 * Add focus state after other useState declarations
 */
function addFocusState(content) {
  // Find the last useState in the component
  const useStateRegex = /const \[[\w,\s]+\] = useState[^;]+;/g;
  const matches = [...content.matchAll(useStateRegex)];
  
  if (matches.length === 0) {
    console.log('  ⚠️  Could not find useState declarations');
    return content;
  }
  
  const lastMatch = matches[matches.length - 1];
  const insertPosition = lastMatch.index + lastMatch[0].length;
  
  return content.slice(0, insertPosition) + '\n  ' + FOCUS_STATE + content.slice(insertPosition);
}

/**
 * Add focus styles to StyleSheet
 */
function addFocusStyles(content) {
  // Find the StyleSheet.create block
  const styleSheetMatch = content.match(/const styles = StyleSheet\.create\({/);
  
  if (!styleSheetMatch) {
    console.log('  ⚠️  Could not find StyleSheet.create');
    return content;
  }
  
  const insertPosition = styleSheetMatch.index + styleSheetMatch[0].length;
  
  return content.slice(0, insertPosition) + '\n' + FOCUS_STYLES + content.slice(insertPosition);
}

/**
 * Find TextInput instances that need wrapping
 */
function findTextInputs(content) {
  const lines = content.split('\n');
  const textInputs = [];
  let inTextInput = false;
  let currentInput = { start: -1, end: -1, indent: '', lines: [] };
  
  lines.forEach((line, index) => {
    if (line.includes('<TextInput')) {
      inTextInput = true;
      currentInput.start = index;
      currentInput.indent = line.match(/^(\s*)/)[1];
      currentInput.lines = [line];
    } else if (inTextInput) {
      currentInput.lines.push(line);
      if (line.includes('/>') || line.includes('</TextInput>')) {
        currentInput.end = index;
        textInputs.push({ ...currentInput });
        currentInput = { start: -1, end: -1, indent: '', lines: [] };
        inTextInput = false;
      }
    }
  });
  
  return textInputs;
}

/**
 * Check if TextInput is already wrapped with focus container
 */
function isAlreadyWrapped(lines, startIndex) {
  if (startIndex < 2) return false;
  
  const prevLine = lines[startIndex - 1] || '';
  const prevPrevLine = lines[startIndex - 2] || '';
  
  return prevLine.includes('inputContainer') || 
         prevPrevLine.includes('inputContainer') ||
         prevLine.includes('focusedInput ===');
}

/**
 * Wrap TextInput with focus container
 */
function wrapTextInput(textInput, fieldName) {
  const indent = textInput.indent;
  const inputLines = textInput.lines;
  
  // Check if already has onFocus/onBlur
  const hasOnFocus = inputLines.some(l => l.includes('onFocus'));
  const hasOnBlur = inputLines.some(l => l.includes('onBlur'));
  
  // Build the wrapper
  const wrapper = [];
  wrapper.push(`${indent}<View style={[`);
  wrapper.push(`${indent}  styles.inputContainer,`);
  wrapper.push(`${indent}  focusedInput === '${fieldName}' && styles.inputContainerFocused`);
  wrapper.push(`${indent}]}>`);
  
  // Add the TextInput with focus handlers
  inputLines.forEach((line, i) => {
    if (i === inputLines.length - 1 && !hasOnFocus && !hasOnBlur) {
      // Add onFocus and onBlur before closing tag
      if (line.includes('/>')) {
        const modifiedLine = line.replace('/>', '');
        wrapper.push(`  ${modifiedLine}`);
        wrapper.push(`${indent}    onFocus={() => setFocusedInput('${fieldName}')}`);
        wrapper.push(`${indent}    onBlur={() => setFocusedInput(null)}`);
        wrapper.push(`${indent}  />`);
      } else {
        wrapper.push(`  ${line}`);
        wrapper.push(`${indent}    onFocus={() => setFocusedInput('${fieldName}')}`);
        wrapper.push(`${indent}    onBlur={() => setFocusedInput(null)}`);
      }
    } else {
      wrapper.push(`  ${line}`);
    }
  });
  
  wrapper.push(`${indent}</View>`);
  
  return wrapper;
}

/**
 * Update input styles to use transparency
 */
function updateInputStyles(content) {
  // Update input style to use transparent background
  const inputStyleRegex = /(\s+input:\s*{[^}]+backgroundColor:\s*['"][^'"]+['"][^}]*})/g;
  
  return content.replace(inputStyleRegex, (match) => {
    return match.replace(/backgroundColor:\s*['"][^'"]+['"]/, "backgroundColor: 'transparent'");
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Skip if already completed
  if (COMPLETED_FILES.includes(relativePath)) {
    console.log(`⏭️  Skipping ${relativePath} (already completed)`);
    return { modified: false };
  }
  
  console.log(`\n📄 Processing: ${relativePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file uses TextInput
    if (!content.includes('TextInput') && !content.includes('<TextInput')) {
      console.log('  ℹ️  No TextInput components found');
      return { modified: false };
    }
    
    let modified = content;
    let changes = [];
    
    // Step 1: Add focus state if needed
    if (!hasFocusState(content)) {
      modified = addFocusState(modified);
      changes.push('Added focus state');
    } else {
      console.log('  ✓ Focus state already present');
    }
    
    // Step 2: Add focus styles if needed
    if (!hasFocusStyles(modified)) {
      modified = addFocusStyles(modified);
      changes.push('Added focus styles');
    } else {
      console.log('  ✓ Focus styles already present');
    }
    
    // Step 3: Update input style backgrounds
    modified = updateInputStyles(modified);
    
    // Step 4: Find and wrap TextInputs (this would need more sophisticated parsing)
    // For now, report what was found
    const textInputs = findTextInputs(content);
    if (textInputs.length > 0) {
      console.log(`  📝 Found ${textInputs.length} TextInput instance(s)`);
      changes.push(`Found ${textInputs.length} TextInput(s) to wrap`);
    }
    
    // Write the file if not dry run and changes were made
    if (!dryRun && changes.length > 0) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`  ✅ Updated: ${changes.join(', ')}`);
      return { modified: true, changes };
    } else if (dryRun && changes.length > 0) {
      console.log(`  🔍 Would update: ${changes.join(', ')}`);
      return { modified: false, changes };
    }
    
    return { modified: false };
    
  } catch (error) {
    console.error(`  ❌ Error processing file: ${error.message}`);
    return { modified: false, error: error.message };
  }
}

/**
 * Find all TypeScript/TSX files in directory
 */
function findTSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (!file.startsWith('.') && file !== 'node_modules') {
        findTSXFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main execution
 */
function main() {
  const rootDir = process.cwd();
  
  if (singleFile) {
    const filePath = path.resolve(rootDir, singleFile);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${singleFile}`);
      process.exit(1);
    }
    processFile(filePath);
  } else {
    // Process all files in app/ and components/
    const appFiles = findTSXFiles(path.join(rootDir, 'app'));
    const componentFiles = findTSXFiles(path.join(rootDir, 'components'));
    const allFiles = [...appFiles, ...componentFiles];
    
    console.log(`\n📊 Found ${allFiles.length} TypeScript files to analyze\n`);
    
    let modifiedCount = 0;
    const results = [];
    
    allFiles.forEach(file => {
      const result = processFile(file);
      if (result.modified) modifiedCount++;
      results.push({ file, ...result });
    });
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files analyzed: ${allFiles.length}`);
    console.log(`Files modified: ${modifiedCount}`);
    console.log(`Files skipped: ${allFiles.length - modifiedCount}`);
    
    if (dryRun) {
      console.log('\n⚠️  This was a DRY RUN - no files were actually modified');
      console.log('Run without --dry-run to apply changes');
    }
  }
  
  console.log('\n✨ Done!\n');
}

// Run the script
main();

