#!/usr/bin/env python3

import re

def update_activity_section():
    # Read the current file
    with open('app/(tabs)/pipeline.tsx', 'r') as f:
        content = f.read()
    
    # New Activity case content
    new_activity_case = '''      case 'Activity':
        return (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
            
            {/* Activity Filter Tabs */}
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
            </View>

            <View style={styles.activityList}>
              {/* Customer Activity - Proposal Viewed */}
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
              </View>
            </View>
          </View>
        );'''
    
    # Replace the Activity case
    pattern = r"case 'Activity':\s*return\s*\([^}]+}\);\s*"
    content = re.sub(pattern, new_activity_case, content, flags=re.DOTALL)
    
    # Add new styles after the existing activity styles
    new_styles = '''
  // Enhanced Activity Styles
  activityFilterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  activityFilterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  activityFilterTabActive: {
    backgroundColor: '#6366F1',
  },
  activityFilterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activityFilterTabTextActive: {
    color: '#FFFFFF',
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },'''
    
    # Find the end of the existing activity styles and add new ones
    activity_date_pattern = r"(activityDate: \{[^}]+\},)"
    content = re.sub(activity_date_pattern, r"\1" + new_styles, content)
    
    # Write the updated content back
    with open('app/(tabs)/pipeline.tsx', 'w') as f:
        f.write(content)
    
    print("✅ Activity section updated successfully!")
    print("📊 Enhanced Activity Timeline with:")
    print("   • Customer vs Team activity separation")
    print("   • Filter tabs (All, Customer, Team)")
    print("   • Rich activity cards with icons and badges")
    print("   • Timeline view with proper categorization")

if __name__ == "__main__":
    update_activity_section()
