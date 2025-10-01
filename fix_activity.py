#!/usr/bin/env python3

def fix_activity_section():
    # Read the current file
    with open('app/(tabs)/pipeline.tsx', 'r') as f:
        content = f.read()
    
    # Find and replace the entire Activity case
    old_activity = '''      case 'Activity':
        return (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>TM</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>→ Moved to New Leads</Text>
                  <Text style={styles.activityUser}>Tanner Mullen</Text>
                  <Text style={styles.activityDate}>Jan 18, 2024, 9:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>TM</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>Updated card details</Text>
                  <Text style={styles.activityUser}>Tanner Mullen</Text>
                  <Text style={styles.activityDate}>Jan 18, 2024, 9:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>S</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>+ Card created</Text>
                  <Text style={styles.activityUser}>System</Text>
                  <Text style={styles.activityDate}>Jan 10, 2024, 5:00 AM</Text>
                </View>
              </View>
            </View>
          </View>
        );'''
    
    new_activity = '''      case 'Activity':
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
    
    # Replace the content
    if old_activity in content:
        content = content.replace(old_activity, new_activity)
        
        # Write back
        with open('app/(tabs)/pipeline.tsx', 'w') as f:
            f.write(content)
        
        print("✅ Activity section updated successfully!")
    else:
        print("❌ Could not find the exact Activity section to replace")
        print("Let me try a different approach...")

if __name__ == "__main__":
    fix_activity_section()
