#!/usr/bin/env python3

def make_activity_scrollable():
    # Read the current file
    with open('app/(tabs)/pipeline.tsx', 'r') as f:
        content = f.read()
    
    # Find the activity list section and wrap it in ScrollView
    old_activity_list = '''            <View style={styles.activityList}>'''
    new_activity_list = '''            <ScrollView 
              style={styles.activityScrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.activityList}>'''
    
    # Find the closing tag for activityList
    old_activity_list_close = '''            </View>'''
    new_activity_list_close = '''            </ScrollView>'''
    
    # Replace the opening tag
    if old_activity_list in content:
        content = content.replace(old_activity_list, new_activity_list)
        print("✅ Updated activity list opening tag")
    else:
        print("❌ Could not find activity list opening tag")
        return
    
    # Replace the closing tag
    if old_activity_list_close in content:
        content = content.replace(old_activity_list_close, new_activity_list_close)
        print("✅ Updated activity list closing tag")
    else:
        print("❌ Could not find activity list closing tag")
        return
    
    # Add new styles for the scrollable container
    new_styles = '''
  activityScrollContainer: {
    flex: 1,
    maxHeight: 400,
  },'''
    
    # Find where to add the new styles (after activityDescription)
    activity_desc_pattern = r"(activityDescription: \{[^}]+\},)"
    if re.search(activity_desc_pattern, content):
        content = re.sub(activity_desc_pattern, r"\1" + new_styles, content)
        print("✅ Added scroll container styles")
    else:
        print("❌ Could not find where to add styles")
        return
    
    # Write the updated content back
    with open('app/(tabs)/pipeline.tsx', 'w') as f:
        f.write(content)
    
    print("✅ Activity timeline is now scrollable!")
    print("📱 Features added:")
    print("   • ScrollView wrapper for activity list")
    print("   • Max height constraint (400px)")
    print("   • Hidden scroll indicators for cleaner UI")
    print("   • Proper content container styling")

if __name__ == "__main__":
    import re
    make_activity_scrollable()
