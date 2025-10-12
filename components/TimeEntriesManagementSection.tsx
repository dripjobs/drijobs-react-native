import { crewService } from '@/services/CrewService';
import { timeTrackingService } from '@/services/TimeTrackingService';
import { TimeEntry } from '@/types/crew';
import { calculateTotalCostForEntries, formatCurrency, formatDuration } from '@/utils/costCalculations';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface TimeEntriesManagementSectionProps {
  onRefresh?: () => void;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
type DateFilter = 'today' | 'week' | 'month' | 'all';

export const TimeEntriesManagementSection: React.FC<TimeEntriesManagementSectionProps> = ({
  onRefresh,
}) => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('week');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, searchQuery, statusFilter, dateFilter]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      
      // Get date range based on filter
      let startDate: string | undefined;
      const now = new Date();
      
      if (dateFilter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (dateFilter === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart.toISOString();
      } else if (dateFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      }

      const allEntries = timeTrackingService.getTimeEntriesForAdmin({
        startDate,
        status: statusFilter === 'all' ? undefined : statusFilter,
        searchQuery: searchQuery || undefined,
      });

      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.crewMemberName.toLowerCase().includes(query) ||
          e.jobName.toLowerCase().includes(query)
      );
    }

    setFilteredEntries(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    onRefresh?.();
    setRefreshing(false);
  };

  const toggleSelectEntry = (entryId: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const selectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map((e) => e.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedEntries.size === 0) return;

    Alert.alert(
      'Bulk Approve',
      `Approve ${selectedEntries.size} time ${selectedEntries.size === 1 ? 'entry' : 'entries'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            setActionLoading(true);
            try {
              const result = await timeTrackingService.bulkApproveTimeEntries(
                Array.from(selectedEntries),
                'admin_1'
              );

              if (result.success) {
                Alert.alert('Success', `Approved ${result.approved} time entries`);
                setSelectedEntries(new Set());
                await loadEntries();
              } else {
                Alert.alert(
                  'Partial Success',
                  `Approved ${result.approved} entries, ${result.failed} failed`
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to approve entries');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBulkReject = async () => {
    if (selectedEntries.size === 0) return;

    Alert.prompt(
      'Bulk Reject',
      `Reject ${selectedEntries.size} time ${selectedEntries.size === 1 ? 'entry' : 'entries'}? Please provide a reason:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async (reason) => {
            if (!reason?.trim()) {
              Alert.alert('Error', 'Reason is required for rejection');
              return;
            }

            setActionLoading(true);
            try {
              const result = await timeTrackingService.bulkRejectTimeEntries(
                Array.from(selectedEntries),
                'admin_1',
                reason
              );

              if (result.success) {
                Alert.alert('Success', `Rejected ${result.rejected} time entries`);
                setSelectedEntries(new Set());
                await loadEntries();
              } else {
                Alert.alert(
                  'Partial Success',
                  `Rejected ${result.rejected} entries, ${result.failed} failed`
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to reject entries');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleApproveEntry = async (entryId: string) => {
    setActionLoading(true);
    try {
      const result = await timeTrackingService.approveTimeEntry(entryId, 'admin_1');
      if (result.success) {
        Alert.alert('Success', 'Time entry approved');
        await loadEntries();
      } else {
        Alert.alert('Error', result.error || 'Failed to approve');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve entry');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEntry = async (entryId: string) => {
    Alert.prompt(
      'Reject Entry',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async (reason) => {
            if (!reason?.trim()) {
              Alert.alert('Error', 'Reason is required');
              return;
            }

            setActionLoading(true);
            try {
              const result = await timeTrackingService.rejectTimeEntry(
                entryId,
                'admin_1',
                reason
              );
              if (result.success) {
                Alert.alert('Success', 'Time entry rejected');
                await loadEntries();
              } else {
                Alert.alert('Error', result.error || 'Failed to reject');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to reject entry');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fef3c7';
      case 'approved':
        return '#d1fae5';
      case 'rejected':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading time entries...</Text>
      </View>
    );
  }

  const selectedTotal = calculateTotalCostForEntries(
    filteredEntries.filter((e) => selectedEntries.has(e.id))
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by crew member or job..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {/* Date Filter */}
          {(['today', 'week', 'month', 'all'] as DateFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                dateFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setDateFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  dateFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.filterDivider} />

          {/* Status Filter */}
          {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                statusFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bulk Actions */}
      {selectedEntries.size > 0 && (
        <View style={styles.bulkActionsBar}>
          <View style={styles.bulkActionsLeft}>
            <TouchableOpacity onPress={selectAll} style={styles.selectAllButton}>
              <Ionicons
                name={selectedEntries.size === filteredEntries.length ? 'checkbox' : 'square-outline'}
                size={24}
                color="#6366f1"
              />
            </TouchableOpacity>
            <Text style={styles.bulkActionsText}>
              {selectedEntries.size} selected • {formatCurrency(selectedTotal)}
            </Text>
          </View>
          <View style={styles.bulkActionsRight}>
            <TouchableOpacity
              style={styles.bulkApproveButton}
              onPress={handleBulkApprove}
              disabled={actionLoading}
            >
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.bulkApproveText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkRejectButton}
              onPress={handleBulkReject}
              disabled={actionLoading}
            >
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={styles.bulkRejectText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Entries List */}
      <ScrollView
        style={styles.entriesList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No time entries found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <TouchableOpacity
                  onPress={() => toggleSelectEntry(entry.id)}
                  style={styles.checkbox}
                >
                  <Ionicons
                    name={selectedEntries.has(entry.id) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#6366f1"
                  />
                </TouchableOpacity>
                <View style={styles.entryHeaderInfo}>
                  <Text style={styles.crewMemberName}>{entry.crewMemberName}</Text>
                  <Text style={styles.jobName}>{entry.jobName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(entry.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(entry.status) }]}>
                    {entry.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.entryDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {formatDuration(entry.totalMinutes || 0)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{formatCurrency(entry.totalCost)}</Text>
                </View>
              </View>

              {entry.status === 'pending' && (
                <View style={styles.entryActions}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApproveEntry(entry.id)}
                    disabled={actionLoading}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color="#10b981" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRejectEntry(entry.id)}
                    disabled={actionLoading}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {entry.rejectionReason && (
                <View style={styles.rejectionNote}>
                  <Ionicons name="information-circle" size={16} color="#ef4444" />
                  <Text style={styles.rejectionText}>{entry.rejectionReason}</Text>
                </View>
              )}

              {entry.wasRemoteClockOut && (
                <View style={styles.remoteNote}>
                  <Ionicons name="warning" size={16} color="#f59e0b" />
                  <Text style={styles.remoteText}>
                    Remote clock-out: {entry.remoteClockOutReason}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
  },
  filtersRow: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  bulkActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c4b5fd',
  },
  bulkActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllButton: {
    padding: 4,
  },
  bulkActionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5b21b6',
  },
  bulkActionsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkApproveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  bulkApproveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  bulkRejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  bulkRejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  entriesList: {
    flex: 1,
    padding: 16,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    padding: 4,
    marginRight: 12,
  },
  entryHeaderInfo: {
    flex: 1,
  },
  crewMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  jobName: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  entryDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6b7280',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#d1fae5',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  rejectionNote: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rejectionText: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
  },
  remoteNote: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  remoteText: {
    flex: 1,
    fontSize: 13,
    color: '#78350f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

