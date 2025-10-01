#!/bin/bash

echo "🔄 Making Activity Timeline Scrollable..."

# Create a backup
cp "app/(tabs)/pipeline.tsx" "app/(tabs)/pipeline_backup.tsx"
echo "✅ Backup created"

# Replace the activity list opening tag
sed -i '' 's/<View style={styles.activityList}>/<ScrollView \
              style={styles.activityScrollContainer}\
              showsVerticalScrollIndicator={false}\
              contentContainerStyle={styles.activityList}>/g' "app/(tabs)/pipeline.tsx"

echo "✅ Updated activity list opening tag"

# Replace the activity list closing tag
sed -i '' 's|            </View>|            </ScrollView>|g' "app/(tabs)/pipeline.tsx"

echo "✅ Updated activity list closing tag"

# Add new styles after activityDescription
cat >> "app/(tabs)/pipeline.tsx" << 'EOF'

  activityScrollContainer: {
    flex: 1,
    maxHeight: 400,
  },
EOF

echo "✅ Added scroll container styles"

echo ""
echo "🎉 Activity Timeline is now scrollable!"
echo "📱 Features added:"
echo "   • ScrollView wrapper for activity list"
echo "   • Max height constraint (400px)"
echo "   • Hidden scroll indicators for cleaner UI"
echo "   • Proper content container styling"
echo ""
echo "✅ Complete!"
