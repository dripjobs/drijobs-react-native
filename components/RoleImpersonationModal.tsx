import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import { useUserRole } from '../contexts/UserRoleContext';
import { crewService } from '../services/CrewService';
import { CrewMember } from '../types/crew';
import { ROLE_DEFINITIONS, UserRole } from '../types/userRoles';

interface RoleImpersonationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RoleImpersonationModal: React.FC<RoleImpersonationModalProps> = ({
  visible,
  onClose,
}) => {
  const { currentRole, impersonatingCrewMemberId, setUserRole, clearImpersonation } = useUserRole();
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);

  useEffect(() => {
    if (visible) {
      loadCrewMembers();
    }
  }, [visible]);

  const loadCrewMembers = () => {
    const members = crewService.getCrewMembers().filter(m => m.status === 'active');
    setCrewMembers(members);
  };

  const handleRoleSwitch = async (role: UserRole, crewMemberId?: string) => {
    try {
      if (role === 'crew' && !crewMemberId) {
        Alert.alert('Error', 'Please select a crew member to impersonate');
        return;
      }

      // Get permission level from crew member
      const member = crewMembers.find(m => m.id === crewMemberId);
      const permissionLevel = member?.permissionLevel || 1;

      await setUserRole(role, crewMemberId, permissionLevel);
      
      const levelLabel = permissionLevel === 1 ? 'Level 1 - Basic' : permissionLevel === 2 ? 'Level 2 - Customer Comms' : 'Level 3';
      
      Alert.alert(
        'Role Changed',
        `You are now viewing the app as ${ROLE_DEFINITIONS[role].label}${
          crewMemberId 
            ? ` (${member?.firstName} ${member?.lastName} - ${levelLabel})` 
            : ''
        }`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to switch role');
    }
  };

  const handleClearImpersonation = async () => {
    try {
      await clearImpersonation();
      Alert.alert('Role Reset', 'You are now back to Administrator view', [
        { text: 'OK', onPress: onClose },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset role');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Role & Impersonation</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Role Display */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Role</Text>
            <View style={styles.currentRoleCard}>
              <View style={styles.roleInfo}>
                <Text style={styles.roleLabel}>{ROLE_DEFINITIONS[currentRole].label}</Text>
                <Text style={styles.roleDescription}>
                  {ROLE_DEFINITIONS[currentRole].description}
                </Text>
                {impersonatingCrewMemberId && (
                  <View style={styles.impersonatingBanner}>
                    <Ionicons name="person-circle-outline" size={16} color="#f59e0b" />
                    <Text style={styles.impersonatingText}>
                      Impersonating:{' '}
                      {crewMembers.find(m => m.id === impersonatingCrewMemberId)?.firstName}{' '}
                      {crewMembers.find(m => m.id === impersonatingCrewMemberId)?.lastName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quick Role Switch */}
          {currentRole !== 'admin' && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleClearImpersonation}
              >
                <Ionicons name="arrow-back-circle" size={20} color="white" />
                <Text style={styles.resetButtonText}>Return to Admin View</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Available Roles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Switch to Role</Text>
            <Text style={styles.sectionSubtitle}>
              Test the app experience as different user roles
            </Text>

            {/* Admin Role */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                currentRole === 'admin' && !impersonatingCrewMemberId && styles.roleCardActive,
              ]}
              onPress={() => handleRoleSwitch('admin')}
            >
              <View style={[styles.roleIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#3b82f6" />
              </View>
              <View style={styles.roleCardContent}>
                <Text style={styles.roleCardTitle}>Administrator</Text>
                <Text style={styles.roleCardSubtitle}>Full access to all features</Text>
              </View>
              {currentRole === 'admin' && !impersonatingCrewMemberId && (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              )}
            </TouchableOpacity>

            {/* Accountant Role */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                currentRole === 'accountant' && styles.roleCardActive,
              ]}
              onPress={() => handleRoleSwitch('accountant')}
            >
              <View style={[styles.roleIcon, { backgroundColor: '#e9d5ff' }]}>
                <Ionicons name="calculator" size={24} color="#8b5cf6" />
              </View>
              <View style={styles.roleCardContent}>
                <Text style={styles.roleCardTitle}>Accountant/Bookkeeper</Text>
                <Text style={styles.roleCardSubtitle}>Read-only financial access</Text>
              </View>
              {currentRole === 'accountant' && (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              )}
            </TouchableOpacity>
          </View>

          {/* Crew Member Impersonation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impersonate Crew Member</Text>
            <Text style={styles.sectionSubtitle}>
              View the app as a specific crew member for testing
            </Text>

            {crewMembers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>No active crew members</Text>
              </View>
            ) : (
              crewMembers.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.crewMemberCard,
                    impersonatingCrewMemberId === member.id && styles.crewMemberCardActive,
                  ]}
                  onPress={() => handleRoleSwitch('crew', member.id)}
                >
                  <View style={[styles.roleIcon, { backgroundColor: '#d1fae5' }]}>
                    <Ionicons name="person" size={24} color="#10b981" />
                  </View>
                  <View style={styles.crewMemberInfo}>
                    <Text style={styles.crewMemberName}>
                      {member.firstName} {member.lastName}
                    </Text>
                    <View style={styles.badgeRow}>
                      <Text style={styles.crewMemberRole}>{member.role}</Text>
                      <View style={[
                        styles.permissionBadge,
                        { backgroundColor: member.permissionLevel === 1 ? '#dbeafe' : '#dcfce7' }
                      ]}>
                        <Text style={[
                          styles.permissionBadgeText,
                          { color: member.permissionLevel === 1 ? '#1e40af' : '#047857' }
                        ]}>
                          Level {member.permissionLevel}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.crewMemberDetails}>
                      {member.employeeNumber} • ${member.hourlyRate}/hr
                    </Text>
                  </View>
                  {impersonatingCrewMemberId === member.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Ionicons name="information-circle" size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              Role impersonation is for testing only. Some features may have limited
              functionality in this demo environment.
            </Text>
          </View>
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
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  currentRoleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  roleInfo: {
    gap: 8,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  impersonatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  impersonatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleCardContent: {
    flex: 1,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roleCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  crewMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  crewMemberCardActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  crewMemberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  crewMemberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  crewMemberRole: {
    fontSize: 13,
    color: '#3b82f6',
    textTransform: 'capitalize',
  },
  permissionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  permissionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  crewMemberDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fffbeb',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
});

