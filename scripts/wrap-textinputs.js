#!/usr/bin/env node

/**
 * TextInput Wrapper Script
 * 
 * This script specifically handles wrapping individual TextInput components
 * with the focus container. Use this after running add-input-focus.js
 * to complete the implementation.
 * 
 * Usage:
 *   node scripts/wrap-textinputs.js --file path/to/file.tsx --dry-run
 *   node scripts/wrap-textinputs.js --file path/to/file.tsx
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fileArg = args.indexOf('--file');
const targetFile = fileArg !== -1 ? args[fileArg + 1] : null;

if (!targetFile) {
  console.error('❌ Please specify a file with --file');
  console.log('Usage: node scripts/wrap-textinputs.js --file path/to/file.tsx [--dry-run]');
  process.exit(1);
}

console.log('🔧 TextInput Wrapper Tool');
console.log('========================\n');

const filePath = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${targetFile}`);
  process.exit(1);
}

console.log(`📄 File: ${targetFile}`);
if (dryRun) console.log('⚠️  DRY RUN MODE\n');

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find all TextInput components
console.log('🔍 Scanning for TextInput components...\n');

let textInputCount = 0;
let lineIndex = 0;

const textInputLocations = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('<TextInput')) {
    textInputCount++;
    const indent = line.match(/^(\s*)/)[1];
    
    // Get some context
    const contextBefore = lines.slice(Math.max(0, i - 3), i).join('\n');
    const contextAfter = lines.slice(i, Math.min(lines.length, i + 10)).join('\n');
    
    // Try to find field name
    let fieldName = `input${textInputCount}`;
    
    // Check for value binding
    const valueMatch = contextAfter.match(/value=\{([^}]+)\}/);
    if (valueMatch) {
      const fullMatch = valueMatch[1].trim();
      const varMatch = fullMatch.match(/[\w.]+\.(\w+)|(\w+)/);
      if (varMatch) {
        fieldName = varMatch[1] || varMatch[2];
      }
    }
    
    // Check for placeholder
    const placeholderMatch = contextAfter.match(/placeholder=["']([^"']+)["']/);
    if (placeholderMatch) {
      const cleanName = placeholderMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 25);
      if (cleanName) fieldName = cleanName;
    }
    
    // Check if already wrapped
    const isWrapped = contextBefore.includes('inputContainer') ||
                      contextBefore.includes('focusedInput ===');
    
    // Check if has focus handlers
    const hasFocusHandlers = contextAfter.includes('onFocus') && contextAfter.includes('onBlur');
    
    textInputLocations.push({
      line: i + 1,
      indent,
      fieldName,
      isWrapped,
      hasFocusHandlers,
      preview: line.trim().substring(0, 80) + (line.length > 80 ? '...' : '')
    });
  }
}

console.log(`Found ${textInputCount} TextInput component(s):\n`);

textInputLocations.forEach((loc, idx) => {
  console.log(`${idx + 1}. Line ${loc.line}: ${loc.fieldName}`);
  console.log(`   ${loc.preview}`);
  console.log(`   Wrapped: ${loc.isWrapped ? '✓ Yes' : '✗ No'}`);
  console.log(`   Focus handlers: ${loc.hasFocusHandlers ? '✓ Yes' : '✗ No'}`);
  console.log('');
});

// Generate wrapper code examples
const needsWrapping = textInputLocations.filter(loc => !loc.isWrapped);

if (needsWrapping.length > 0) {
  console.log('\n📝 Wrapper Code Examples:');
  console.log('========================\n');
  
  needsWrapping.slice(0, 3).forEach((loc, idx) => {
    console.log(`${idx + 1}. For field "${loc.fieldName}" (line ${loc.line}):`);
    console.log('```tsx');
    console.log(`${loc.indent}<View style={[`);
    console.log(`${loc.indent}  styles.inputContainer,`);
    console.log(`${loc.indent}  focusedInput === '${loc.fieldName}' && styles.inputContainerFocused`);
    console.log(`${loc.indent}]}>`);
    console.log(`${loc.indent}  <TextInput`);
    console.log(`${loc.indent}    // ... existing props`);
    console.log(`${loc.indent}    onFocus={() => setFocusedInput('${loc.fieldName}')}`);
    console.log(`${loc.indent}    onBlur={() => setFocusedInput(null)}`);
    console.log(`${loc.indent}  />`);
    console.log(`${loc.indent}</View>`);
    console.log('```\n');
  });
  
  if (needsWrapping.length > 3) {
    console.log(`... and ${needsWrapping.length - 3} more\n`);
  }
}

console.log('\n📊 Summary:');
console.log(`Total TextInputs: ${textInputCount}`);
console.log(`Already wrapped: ${textInputLocations.filter(l => l.isWrapped).length}`);
console.log(`Need wrapping: ${needsWrapping.length}`);
console.log(`Have focus handlers: ${textInputLocations.filter(l => l.hasFocusHandlers).length}`);

console.log('\n💡 Next Steps:');
console.log('1. Review the TextInput locations above');
console.log('2. Use the wrapper code examples as templates');
console.log('3. Wrap each TextInput with the focus container');
console.log('4. Ensure focusedInput state and styles are present');
console.log('5. Test the focus highlighting on each input\n');

console.log('✨ Done!\n');

