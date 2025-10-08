import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { crewService } from '../services/CrewService';
import { Timesheet } from '../types/crew';

export const TimesheetManagement: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = () => {
    const allTimesheets = crewService.getTimesheets();
    setTimesheets(allTimesheets);
  };

  const handleApprove = (timesheet: Timesheet) => {
    Alert.alert(
      'Approve Timesheet',
      `Approve timesheet for ${timesheet.crewMemberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            crewService.approveTimesheet(timesheet.id, 'Admin');
            loadTimesheets();
          },
        },
      ]
    );
  };

  const handleReject = (timesheet: Timesheet) => {
    Alert.alert(
      'Reject Timesheet',
      `Reject timesheet for ${timesheet.crewMemberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            crewService.rejectTimesheet(timesheet.id);
            loadTimesheets();
          },
        },
      ]
    );
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    if (filterStatus === 'all') return true;
    return timesheet.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'submitted': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
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

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabsRow}>
            <TouchableOpacity
              style={[styles.filterTab, filterStatus === 'all' && styles.filterTabActive]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
                All ({timesheets.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterStatus === 'submitted' && styles.filterTabActive]}
              onPress={() => setFilterStatus('submitted')}
            >
              <Text style={[styles.filterText, filterStatus === 'submitted' && styles.filterTextActive]}>
                Submitted ({timesheets.filter(t => t.status === 'submitted').length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterStatus === 'approved' && styles.filterTabActive]}
              onPress={() => setFilterStatus('approved')}
            >
              <Text style={[styles.filterText, filterStatus === 'approved' && styles.filterTextActive]}>
                Approved ({timesheets.filter(t => t.status === 'approved').length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filterStatus === 'rejected' && styles.filterTabActive]}
              onPress={() => setFilterStatus('rejected')}
            >
              <Text style={[styles.filterText, filterStatus === 'rejected' && styles.filterTextActive]}>
                Rejected ({timesheets.filter(t => t.status === 'rejected').length})
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Timesheets List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredTimesheets.map((timesheet) => (
          <View key={timesheet.id} style={styles.timesheetCard}>
            <View style={styles.cardHeader}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{timesheet.crewMemberName}</Text>
                <Text style={styles.dateText}>{formatDate(timesheet.date)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(timesheet.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(timesheet.status) }]}>
                  {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.hoursRow}>
                <View style={styles.hoursItem}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.hoursLabel}>Regular</Text>
                  <Text style={styles.hoursValue}>{timesheet.hoursWorked}h</Text>
                </View>
                {timesheet.overtimeHours && timesheet.overtimeHours > 0 && (
                  <View style={styles.hoursItem}>
                    <Ionicons name="flash-outline" size={16} color="#f59e0b" />
                    <Text style={styles.hoursLabel}>Overtime</Text>
                    <Text style={styles.hoursValue}>{timesheet.overtimeHours}h</Text>
                  </View>
                )}
                <View style={styles.hoursItem}>
                  <Ionicons name="calculator-outline" size={16} color="#3b82f6" />
                  <Text style={styles.hoursLabel}>Total</Text>
                  <Text style={[styles.hoursValue, styles.totalHours]}>
                    {timesheet.hoursWorked + (timesheet.overtimeHours || 0)}h
                  </Text>
                </View>
              </View>

              {timesheet.jobName && (
                <View style={styles.jobInfo}>
                  <Ionicons name="briefcase-outline" size={14} color="#6b7280" />
                  <Text style={styles.jobText}>{timesheet.jobName}</Text>
                </View>
              )}

              {timesheet.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{timesheet.notes}</Text>
                </View>
              )}
            </View>

            {timesheet.status === 'submitted' && (
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(timesheet)}
                >
                  <Ionicons name="close-circle" size={18} color="#ef4444" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(timesheet)}
                >
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}

            {timesheet.status === 'approved' && timesheet.approvedBy && (
              <View style={styles.approvalInfo}>
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text style={styles.approvalText}>
                  Approved by {timesheet.approvedBy} on {formatDate(timesheet.approvedAt!)}
                </Text>
              </View>
            )}
          </View>
        ))}

        {filteredTimesheets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No timesheets found</Text>
            <Text style={styles.emptySubtext}>
              {filterStatus === 'all' 
                ? 'No timesheets have been submitted yet'
                : `No ${filterStatus} timesheets`}
            </Text>
          </View>
        )}
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
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#3b82f6',
  },
  listContainer: {
    flex: 1,
  },
  timesheetCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  hoursItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalHours: {
    color: '#3b82f6',
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  jobText: {
    fontSize: 14,
    color: '#4b5563',
  },
  notesContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#78350f',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  approvalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  approvalText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
