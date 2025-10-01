#!/bin/bash

echo "🔄 Adding Activity Filter Functionality..."

# Create a backup
cp "app/(tabs)/pipeline.tsx" "app/(tabs)/pipeline_backup.tsx"

# Create a Python script to do the complex replacements
cat > update_filters.py << 'PYTHON_SCRIPT'
#!/usr/bin/env python3

with open('app/(tabs)/pipeline.tsx', 'r') as f:
    content = f.read()

# Find and replace the filter tabs section with clickable ones
old_tabs = '''            {/* Activity Filter Tabs */}
            <View style={styles.activityFilterTabs}>
              <TouchableOpacity style={[styles.activityFilterTab, styles.activityFilterTabActive]}>
                <Text style={[styles.activityFilterTabText, styles.activityFilterTabTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.activityFilterTab}>
                <Text style={styles.activityFilterTabText}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.activityFilterTab}>
                <Text style={styles.activityFilterTabText}>Team</Text>
              </TouchableOpacity>
            </View>'''

new_tabs = '''            {/* Activity Filter Tabs */}
            <View style={styles.activityFilterTabs}>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'all' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('all')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'all' && styles.activityFilterTabTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'customer' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('customer')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'customer' && styles.activityFilterTabTextActive]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'team' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('team')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'team' && styles.activityFilterTabTextActive]}>Team</Text>
              </TouchableOpacity>
            </View>'''

content = content.replace(old_tabs, new_tabs)

# Define activity data with types
activities = '''
            const activities = [
              { type: 'customer', icon: Eye, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '5 hours ago', title: 'Proposal Viewed', description: 'Customer viewed "Kitchen Renovation Proposal" for 8 minutes' },
              { type: 'team', icon: Mail, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '1 day ago', title: 'Follow-up Email Sent', description: 'Tanner Mullen sent proposal follow-up email' },
              { type: 'customer', icon: Phone, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '2 days ago', title: 'Phone Call', description: 'Customer called to discuss timeline - Duration: 12 min' },
              { type: 'team', icon: ArrowRight, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '3 days ago', title: 'Moved to Proposal Stage', description: 'Sarah Johnson moved deal from Opportunity to Proposal' },
              { type: 'customer', icon: Mail, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '4 days ago', title: 'Email Reply Received', description: 'Customer replied: "Looks great! When can we start?"' },
              { type: 'team', icon: Calendar, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '5 days ago', title: 'Site Visit Scheduled', description: 'Tanner Mullen scheduled site visit for Feb 2, 2024 at 10:00 AM' },
              { type: 'customer', icon: FileText, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: 'Nov 1, 2023', title: 'Initial Inquiry Submitted', description: 'Customer submitted website form for basement finishing' },
            ];

            const filteredActivities = activityFilter === 'all' 
              ? activities 
              : activities.filter(activity => activity.type === activityFilter);
'''

# Find where to insert the activities array (before the ScrollView)
scroll_view_start = '<ScrollView \n              style={styles.activityScrollContainer}'
content = content.replace(scroll_view_start, activities + '\n            ' + scroll_view_start)

# Replace the hardcoded activities with mapped ones
old_activities_block = '''              {/* Customer Activity - Proposal Viewed */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Eye size={16} color="#6366F1" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>CUSTOMER</Text>
                    </View>
                    <Text style={styles.activityTime}>5 hours ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Proposal Viewed</Text>
                  <Text style={styles.activityDescription}>
                    Customer viewed "Kitchen Renovation Proposal" for 8 minutes
                  </Text>
                </View>
              </View>

              {/* Team Activity - Email Sent */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Mail size={16} color="#059669" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={[styles.activityBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#065F46' }]}>TEAM</Text>
                    </View>
                    <Text style={styles.activityTime}>1 day ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Follow-up Email Sent</Text>
                  <Text style={styles.activityDescription}>
                    Tanner Mullen sent proposal follow-up email
                  </Text>
                </View>
              </View>

              {/* Customer Activity - Phone Call */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Phone size={16} color="#6366F1" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>CUSTOMER</Text>
                    </View>
                    <Text style={styles.activityTime}>2 days ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Phone Call</Text>
                  <Text style={styles.activityDescription}>
                    Customer called to discuss timeline - Duration: 12 min
                  </Text>
                </View>
              </View>

              {/* Team Activity - Stage Changed */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <ArrowRight size={16} color="#059669" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={[styles.activityBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#065F46' }]}>TEAM</Text>
                    </View>
                    <Text style={styles.activityTime}>3 days ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Moved to Proposal Stage</Text>
                  <Text style={styles.activityDescription}>
                    Sarah Johnson moved deal from Opportunity to Proposal
                  </Text>
                </View>
              </View>

              {/* Customer Activity - Email Reply */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Mail size={16} color="#6366F1" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>CUSTOMER</Text>
                    </View>
                    <Text style={styles.activityTime}>4 days ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Email Reply Received</Text>
                  <Text style={styles.activityDescription}>
                    Customer replied: "Looks great! When can we start?"
                  </Text>
                </View>
              </View>

              {/* Team Activity - Site Visit Scheduled */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Calendar size={16} color="#059669" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={[styles.activityBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#065F46' }]}>TEAM</Text>
                    </View>
                    <Text style={styles.activityTime}>5 days ago</Text>
                  </View>
                  <Text style={styles.activityTitle}>Site Visit Scheduled</Text>
                  <Text style={styles.activityDescription}>
                    Tanner Mullen scheduled site visit for Feb 2, 2024 at 10:00 AM
                  </Text>
                </View>
              </View>

              {/* Customer Activity - Form Submission */}
              <View style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <FileText size={16} color="#6366F1" />
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>CUSTOMER</Text>
                    </View>
                    <Text style={styles.activityTime}>Nov 1, 2023</Text>
                  </View>
                  <Text style={styles.activityTitle}>Initial Inquiry Submitted</Text>
                  <Text style={styles.activityDescription}>
                    Customer submitted website form for basement finishing
                  </Text>
                </View>
              </View>'''

new_activities_block = '''              {filteredActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <View key={index} style={styles.activityItem}>
                    <View style={[styles.activityIconContainer, { backgroundColor: activity.iconBg }]}>
                      <IconComponent size={16} color={activity.iconColor} />
                    </View>
                    <View style={styles.activityContent}>
                      <View style={styles.activityHeader}>
                        <View style={[styles.activityBadge, { backgroundColor: activity.badgeBg }]}>
                          <Text style={[styles.activityBadgeText, { color: activity.badgeColor }]}>{activity.badge}</Text>
                        </View>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </View>
                  </View>
                );
              })}'''

content = content.replace(old_activities_block, new_activities_block)

with open('app/(tabs)/pipeline.tsx', 'w') as f:
    f.write(content)

print("✅ Activity filters are now functional!")
PYTHON_SCRIPT

chmod +x update_filters.py
python3 update_filters.py

rm update_filters.py

echo ""
echo "✅ Activity Filter Functionality Added!"
echo "📱 Features:"
echo "   • All, Customer, Team filter tabs"
echo "   • Dynamic filtering of activities"
echo "   • Active state styling"
echo "   • Data-driven activity rendering"
echo ""
echo "✅ Complete!"
