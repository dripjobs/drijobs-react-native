import { crewService } from '@/services/CrewService';
import { CrewMember } from '@/types/crew';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CrewPermissionSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CrewPermissionSettingsModal: React.FC<CrewPermissionSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCrewMembers();
    }
  }, [visible]);

  const loadCrewMembers = () => {
    setIsLoading(true);
    const members = crewService.getCrewMembers();
    setCrewMembers(members);
    setIsLoading(false);
  };

  const handlePermissionLevelChange = (memberId: string, newLevel: 1 | 2 | 3) => {
    Alert.alert(
      'Change Permission Level',
      `This would change the crew member's permission level to Level ${newLevel}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // In real app, update via CrewService
            setCrewMembers(members =>
              members.map(m => (m.id === memberId ? { ...m, permissionLevel: newLevel } : m))
            );
            Alert.alert('Success', 'Permission level updated');
          },
        },
      ]
    );
  };

  const getLevelColor = (level: number) => {
    if (level === 1) return { bg: '#dbeafe', text: '#1e40af' };
    if (level === 2) return { bg: '#dcfce7', text: '#047857' };
    return { bg: '#f3e8ff', text: '#6b21a8' };
  };

  const getLevelDescription = (level: number) => {
    if (level === 1)
      return 'Basic access: My Day, Jobs, Work Orders, Schedule, Timesheets, Team Chat, Tasks';
    if (level === 2) return 'Level 1 + Customer communication (Chat, Phone)';
    return 'Level 2 + Additional features (future)';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crew Permissions</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Permission Levels</Text>
              <Text style={styles.infoText}>
                Control what crew members can access in the app by assigning permission levels.
              </Text>
            </View>
          </View>

          {/* Permission Level Reference */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permission Levels</Text>

            <View style={styles.levelReferenceCard}>
              <View style={styles.levelReferenceHeader}>
                <View style={[styles.levelBadge, { backgroundColor: '#dbeafe' }]}>
                  <Text style={[styles.levelBadgeText, { color: '#1e40af' }]}>Level 1</Text>
                </View>
                <Text style={styles.levelReferenceTitle}>Basic Crew Member</Text>
              </View>
              <Text style={styles.levelReferenceDescription}>
                My Day, Jobs, Work Orders, Job Schedule, Timesheets, Team Chat, Tasks, Notifications,
                Profile
              </Text>
            </View>

            <View style={styles.levelReferenceCard}>
              <View style={styles.levelReferenceHeader}>
                <View style={[styles.levelBadge, { backgroundColor: '#dcfce7' }]}>
                  <Text style={[styles.levelBadgeText, { color: '#047857' }]}>Level 2</Text>
                </View>
                <Text style={styles.levelReferenceTitle}>Customer Communication</Text>
              </View>
              <Text style={styles.levelReferenceDescription}>
                Level 1 + Chat with Customers, Phone Calls, View Contact Details
              </Text>
            </View>

            <View style={styles.levelReferenceCard}>
              <View style={styles.levelReferenceHeader}>
                <View style={[styles.levelBadge, { backgroundColor: '#f3e8ff' }]}>
                  <Text style={[styles.levelBadgeText, { color: '#6b21a8' }]}>Level 3</Text>
                </View>
                <Text style={styles.levelReferenceTitle}>Advanced (Future)</Text>
              </View>
              <Text style={styles.levelReferenceDescription}>
                Reserved for future expansion (e.g., quotes, proposals, inventory)
              </Text>
            </View>
          </View>

          {/* Crew Members List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew Members ({crewMembers.length})</Text>

            {crewMembers.map(member => {
              const levelColors = getLevelColor(member.permissionLevel);
              return (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberAvatar}>
                      <Ionicons name="person" size={24} color="#6366f1" />
                    </View>
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>
                        {member.firstName} {member.lastName}
                      </Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                      <Text style={styles.memberNumber}>{member.employeeNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.memberPermission}>
                    <View style={[styles.currentLevelBadge, { backgroundColor: levelColors.bg }]}>
                      <Text style={[styles.currentLevelText, { color: levelColors.text }]}>
                        Level {member.permissionLevel}
                      </Text>
                    </View>

                    <View style={styles.levelButtons}>
                      <TouchableOpacity
                        style={[
                          styles.levelButton,
                          member.permissionLevel === 1 && styles.levelButtonActive,
                        ]}
                        onPress={() => handlePermissionLevelChange(member.id, 1)}
                      >
                        <Text
                          style={[
                            styles.levelButtonText,
                            member.permissionLevel === 1 && styles.levelButtonTextActive,
                          ]}
                        >
                          1
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.levelButton,
                          member.permissionLevel === 2 && styles.levelButtonActive,
                        ]}
                        onPress={() => handlePermissionLevelChange(member.id, 2)}
                      >
                        <Text
                          style={[
                            styles.levelButtonText,
                            member.permissionLevel === 2 && styles.levelButtonTextActive,
                          ]}
                        >
                          2
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.levelButton,
                          member.permissionLevel === 3 && styles.levelButtonActive,
                        ]}
                        onPress={() => handlePermissionLevelChange(member.id, 3)}
                      >
                        <Text
                          style={[
                            styles.levelButtonText,
                            member.permissionLevel === 3 && styles.levelButtonTextActive,
                          ]}
                        >
                          3
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  closeButton: {
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6366f1',
    lineHeight: 20,
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
  levelReferenceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  levelReferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelReferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  levelReferenceDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: '#6b7280',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  memberNumber: {
    fontSize: 12,
    color: '#9ca3af',
  },
  memberPermission: {
    gap: 12,
  },
  currentLevelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentLevelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
  },
  levelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  levelButtonTextActive: {
    color: 'white',
  },
});

