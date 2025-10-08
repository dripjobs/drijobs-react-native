import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { crewService } from '../services/CrewService';
import { CrewMember, Timesheet } from '../types/crew';

interface CrewMemberDetailProps {
  member: CrewMember;
  onBack: () => void;
  onEdit: (member: CrewMember) => void;
}

export const CrewMemberDetail: React.FC<CrewMemberDetailProps> = ({
  member,
  onBack,
  onEdit,
}) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  useEffect(() => {
    loadTimesheets();
  }, [member]);

  const loadTimesheets = () => {
    const memberTimesheets = crewService.getTimesheetsByMember(member.id);
    setTimesheets(memberTimesheets);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'foreman': return '#3b82f6';
      case 'manager': return '#8b5cf6';
      case 'technician': return '#10b981';
      case 'apprentice': return '#f59e0b';
      case 'specialist': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'on_leave': return '#f59e0b';
      case 'terminated': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const totalHours = timesheets.reduce((sum, t) => sum + t.hoursWorked + (t.overtimeHours || 0), 0);
  const approvedTimesheets = timesheets.filter(t => t.status === 'approved');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crew Member Details</Text>
        <TouchableOpacity onPress={() => onEdit(member)} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {member.firstName[0]}{member.lastName[0]}
              </Text>
            </View>
          </View>
          
          <Text style={styles.name}>{member.firstName} {member.lastName}</Text>
          <Text style={styles.employeeNumber}>{member.employeeNumber}</Text>
          
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getRoleColor(member.role) + '20' }]}>
              <Text style={[styles.badgeText, { color: getRoleColor(member.role) }]}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(member.status) + '20' }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(member.status) }]}>
                {member.status.replace('_', ' ').charAt(0).toUpperCase() + member.status.slice(1).replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
            <Text style={styles.statValue}>{approvedTimesheets.length}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#8b5cf6" />
            <Text style={styles.statValue}>${member.hourlyRate}</Text>
            <Text style={styles.statLabel}>Hourly Rate</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{member.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{member.phone}</Text>
            </View>
          </View>
          {member.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{member.address}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Employment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Details</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Hire Date</Text>
              <Text style={styles.infoValue}>{formatDate(member.hireDate)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Hourly Rate</Text>
              <Text style={styles.infoValue}>${member.hourlyRate.toFixed(2)}/hr</Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        {member.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {member.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {member.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {member.certifications.map((cert) => {
              const expiryDate = new Date(cert.expiryDate);
              const now = new Date();
              const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = daysUntilExpiry <= 90 && daysUntilExpiry > 0;
              const isExpired = daysUntilExpiry <= 0;

              return (
                <View key={cert.id} style={styles.certCard}>
                  <View style={styles.certHeader}>
                    <View style={styles.certIcon}>
                      <Ionicons name="ribbon-outline" size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.certInfo}>
                      <Text style={styles.certName}>{cert.name}</Text>
                      <Text style={styles.certIssuer}>{cert.issuedBy}</Text>
                    </View>
                    {isExpired ? (
                      <View style={[styles.certStatus, { backgroundColor: '#fee2e2' }]}>
                        <Text style={[styles.certStatusText, { color: '#ef4444' }]}>Expired</Text>
                      </View>
                    ) : isExpiringSoon ? (
                      <View style={[styles.certStatus, { backgroundColor: '#fef3c7' }]}>
                        <Text style={[styles.certStatusText, { color: '#f59e0b' }]}>Expiring Soon</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.certDates}>
                    <Text style={styles.certDate}>
                      Issued: {formatDate(cert.issuedDate)}
                    </Text>
                    <Text style={styles.certDate}>
                      Expires: {formatDate(cert.expiryDate)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Emergency Contact */}
        {member.emergencyContact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.emergencyCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{member.emergencyContact.name}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="heart-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Relationship</Text>
                  <Text style={styles.infoValue}>{member.emergencyContact.relationship}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{member.emergencyContact.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        {member.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{member.notes}</Text>
            </View>
          </View>
        )}

        {/* Recent Timesheets */}
        {timesheets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Timesheets</Text>
            {timesheets.slice(0, 5).map((timesheet) => (
              <View key={timesheet.id} style={styles.timesheetCard}>
                <View style={styles.timesheetHeader}>
                  <Text style={styles.timesheetDate}>{formatDate(timesheet.date)}</Text>
                  <Text style={styles.timesheetHours}>
                    {timesheet.hoursWorked + (timesheet.overtimeHours || 0)}h
                  </Text>
                </View>
                {timesheet.jobName && (
                  <Text style={styles.timesheetJob}>{timesheet.jobName}</Text>
                )}
                <View style={styles.timesheetFooter}>
                  <View style={[
                    styles.timesheetStatus,
                    { backgroundColor: 
                      timesheet.status === 'approved' ? '#d1fae520' :
                      timesheet.status === 'submitted' ? '#fef3c720' :
                      timesheet.status === 'rejected' ? '#fee2e220' : '#f3f4f620'
                    }
                  ]}>
                    <Text style={[
                      styles.timesheetStatusText,
                      { color:
                        timesheet.status === 'approved' ? '#10b981' :
                        timesheet.status === 'submitted' ? '#f59e0b' :
                        timesheet.status === 'rejected' ? '#ef4444' : '#6b7280'
                      }
                    ]}>
                      {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  employeeNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3b82f6',
  },
  certCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  certIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 13,
    color: '#6b7280',
  },
  certStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  certDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  certDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  emergencyCard: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  notesCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  timesheetCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  timesheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timesheetDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timesheetHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  timesheetJob: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  timesheetFooter: {
    flexDirection: 'row',
  },
  timesheetStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timesheetStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
