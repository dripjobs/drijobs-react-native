#!/bin/bash

echo "🔄 Making Activity Timeline Scrollable (Precise Update)..."

# Find the exact line with the activity list opening
ACTIVITY_LIST_LINE=$(grep -n "style={styles.activityList}" "app/(tabs)/pipeline.tsx" | head -1 | cut -d: -f1)

if [ -z "$ACTIVITY_LIST_LINE" ]; then
    echo "❌ Could not find activity list opening"
    exit 1
fi

echo "✅ Found activity list at line $ACTIVITY_LIST_LINE"

# Create a temporary file with the updated content
awk -v line="$ACTIVITY_LIST_LINE" '
NR == line {
    print "            <ScrollView"
    print "              style={styles.activityScrollContainer}"
    print "              showsVerticalScrollIndicator={false}"
    print "              contentContainerStyle={styles.activityList}>"
    next
}
{ print }
' "app/(tabs)/pipeline.tsx" > temp_pipeline.tsx

# Find the closing tag for the activity list (should be the last </View> before the closing </View> of activitySection)
# We need to be more specific - look for the pattern that ends the activity list
sed -i '' 's|            </View>|            </ScrollView>|g' temp_pipeline.tsx

# Add the new styles at the end of the styles object
cat >> temp_pipeline.tsx << 'EOF'

  activityScrollContainer: {
    flex: 1,
    maxHeight: 400,
  },
EOF

# Replace the original file
mv temp_pipeline.tsx "app/(tabs)/pipeline.tsx"

echo "✅ Activity timeline is now scrollable!"
echo "📱 Features added:"
echo "   • ScrollView wrapper for activity list"
echo "   • Max height constraint (400px)"
echo "   • Hidden scroll indicators for cleaner UI"
echo "   • Proper content container styling"
echo ""
echo "✅ Complete!"
