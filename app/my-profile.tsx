import { useTabBar } from '@/contexts/TabBarContext';
import { useCrewPermissionLevel, useIsCrew, useUserRole } from '@/contexts/UserRoleContext';
import { crewService } from '@/services/CrewService';
import { CrewMember } from '@/types/crew';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function MyProfileScreen() {
  const { setIsVisible } = useTabBar();
  const { currentRole, impersonatingCrewMemberId, clearImpersonation } = useUserRole();
  const isCrew = useIsCrew();
  const permissionLevel = useCrewPermissionLevel();

  const [isLoading, setIsLoading] = useState(true);
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [textNotifications, setTextNotifications] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    loadProfile();
    return () => setIsVisible(true);
  }, []);

  const loadProfile = () => {
    if (isCrew && impersonatingCrewMemberId) {
      const member = crewService.getCrewMembers().find(m => m.id === impersonatingCrewMemberId);
      setCrewMember(member || null);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearImpersonation();
            router.replace('/(tabs)/');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality will be implemented with authentication.');
  };

  const handleUpdateProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
  };

  if (isLoading || !crewMember) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getLevelBadgeColor = (level: number) => {
    if (level === 1) return { bg: '#dbeafe', text: '#1e40af' };
    if (level === 2) return { bg: '#dcfce7', text: '#047857' };
    return { bg: '#f3e8ff', text: '#6b21a8' };
  };

  const levelColors = getLevelBadgeColor(permissionLevel);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#6366f1" />
            </View>
          </View>
          <Text style={styles.nameText}>
            {crewMember.firstName} {crewMember.lastName}
          </Text>
          <Text style={styles.roleText}>{crewMember.role}</Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColors.bg }]}>
            <Text style={[styles.levelBadgeText, { color: levelColors.text }]}>
              Level {permissionLevel} Crew Member
            </Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee Number</Text>
              <Text style={styles.infoValue}>{crewMember.employeeNumber}</Text>
            </View>
            
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{crewMember.phone}</Text>
            </View>
            
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{crewMember.email}</Text>
            </View>
            
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Hire Date</Text>
              <Text style={styles.infoValue}>
                {new Date(crewMember.hireDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{crewMember.status}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Ionicons name="lock-closed-outline" size={20} color="#6366f1" />
            <Text style={styles.buttonText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Emergency Contact Section */}
        {crewMember.emergencyContact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{crewMember.emergencyContact.name}</Text>
              </View>
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>Relationship</Text>
                <Text style={styles.infoValue}>{crewMember.emergencyContact.relationship}</Text>
              </View>
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{crewMember.emergencyContact.phone}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Notification Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.notificationRow}>
                <Ionicons name="notifications-outline" size={20} color="#6b7280" />
                <View style={styles.notificationText}>
                  <Text style={styles.notificationLabel}>Push Notifications</Text>
                  <Text style={styles.notificationHint}>Receive app notifications</Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
                thumbColor={pushNotifications ? '#6366f1' : '#f3f4f6'}
              />
            </View>
            
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <View style={styles.notificationRow}>
                <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                <View style={styles.notificationText}>
                  <Text style={styles.notificationLabel}>Text Notifications</Text>
                  <Text style={styles.notificationHint}>Receive SMS alerts</Text>
                </View>
              </View>
              <Switch
                value={textNotifications}
                onValueChange={setTextNotifications}
                trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
                thumbColor={textNotifications ? '#6366f1' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Skills & Certifications Section */}
        {crewMember.skills && crewMember.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {crewMember.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Support</Text>
              <Text style={styles.infoValue}>support@dripjobs.com</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: '#6b7280',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
    textTransform: 'capitalize',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  notificationText: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  notificationHint: {
    fontSize: 13,
    color: '#9ca3af',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366f1',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

