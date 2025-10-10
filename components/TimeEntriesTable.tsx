import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TimeEntry, TimeEntryFilters } from '../types/crew';
import { TimeEntryCard } from './TimeEntryCard';

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  onEditEntry?: (entry: TimeEntry) => void;
  onApproveEntry?: (entry: TimeEntry) => void;
  onRejectEntry?: (entry: TimeEntry) => void;
  filters?: TimeEntryFilters;
}

type GroupBy = 'none' | 'job' | 'crew' | 'date';

export const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({
  entries,
  onEditEntry,
  onApproveEntry,
  onRejectEntry,
}) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('date');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleApprove = (entry: TimeEntry) => {
    Alert.alert(
      'Approve Time Entry',
      `Approve ${entry.totalHours.toFixed(2)} hours for ${entry.crewMemberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => onApproveEntry?.(entry),
        },
      ]
    );
  };

  const handleReject = (entry: TimeEntry) => {
    Alert.alert(
      'Reject Time Entry',
      `Reject time entry for ${entry.crewMemberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => onRejectEntry?.(entry),
        },
      ]
    );
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const groupEntries = () => {
    if (groupBy === 'none') {
      return { 'All Entries': entries };
    }

    const grouped: { [key: string]: TimeEntry[] } = {};

    entries.forEach(entry => {
      let key: string;
      switch (groupBy) {
        case 'job':
          key = entry.jobName;
          break;
        case 'crew':
          key = entry.crewMemberName;
          break;
        case 'date':
          key = new Date(entry.clockInTime).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          break;
        default:
          key = 'All';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });

    return grouped;
  };

  const calculateGroupTotals = (groupEntries: TimeEntry[]) => {
    const totalHours = groupEntries.reduce((sum, e) => sum + e.totalHours, 0);
    const totalCost = groupEntries.reduce((sum, e) => sum + e.totalCost, 0);
    return { totalHours, totalCost };
  };

  const groupedEntries = groupEntries();

  return (
    <View style={styles.container}>
      {/* Group By Selector */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {entries.length} Time {entries.length === 1 ? 'Entry' : 'Entries'}
        </Text>
        <View style={styles.groupByContainer}>
          <Text style={styles.groupByLabel}>Group by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.groupByButtons}>
              <TouchableOpacity
                style={[styles.groupByButton, groupBy === 'date' && styles.groupByButtonActive]}
                onPress={() => setGroupBy('date')}
              >
                <Text
                  style={[
                    styles.groupByButtonText,
                    groupBy === 'date' && styles.groupByButtonTextActive,
                  ]}
                >
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.groupByButton, groupBy === 'job' && styles.groupByButtonActive]}
                onPress={() => setGroupBy('job')}
              >
                <Text
                  style={[
                    styles.groupByButtonText,
                    groupBy === 'job' && styles.groupByButtonTextActive,
                  ]}
                >
                  Job
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.groupByButton, groupBy === 'crew' && styles.groupByButtonActive]}
                onPress={() => setGroupBy('crew')}
              >
                <Text
                  style={[
                    styles.groupByButtonText,
                    groupBy === 'crew' && styles.groupByButtonTextActive,
                  ]}
                >
                  Crew
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.groupByButton, groupBy === 'none' && styles.groupByButtonActive]}
                onPress={() => setGroupBy('none')}
              >
                <Text
                  style={[
                    styles.groupByButtonText,
                    groupBy === 'none' && styles.groupByButtonTextActive,
                  ]}
                >
                  None
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Grouped Entries */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedEntries).map(([groupKey, groupEntries]) => {
          const isExpanded = expandedGroups.has(groupKey);
          const { totalHours, totalCost } = calculateGroupTotals(groupEntries);

          return (
            <View key={groupKey} style={styles.group}>
              {/* Group Header */}
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => toggleGroup(groupKey)}
              >
                <View style={styles.groupHeaderLeft}>
                  <Ionicons
                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={20}
                    color="#6b7280"
                  />
                  <Text style={styles.groupTitle}>{groupKey}</Text>
                  <View style={styles.groupCount}>
                    <Text style={styles.groupCountText}>{groupEntries.length}</Text>
                  </View>
                </View>
                <View style={styles.groupHeaderRight}>
                  <Text style={styles.groupHours}>{totalHours.toFixed(2)}h</Text>
                  <Text style={styles.groupCost}>
                    ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Group Entries */}
              {isExpanded && (
                <View style={styles.groupEntries}>
                  {groupEntries.map(entry => (
                    <View key={entry.id} style={styles.entryWrapper}>
                      <TimeEntryCard entry={entry} showCost={true} onPress={() => onEditEntry?.(entry)} />

                      {/* Action Buttons for Completed Entries */}
                      {entry.status === 'completed' && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleReject(entry)}
                          >
                            <Ionicons name="close-circle" size={16} color="#ef4444" />
                            <Text style={styles.rejectButtonText}>Reject</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleApprove(entry)}
                          >
                            <Ionicons name="checkmark-circle" size={16} color="white" />
                            <Text style={styles.approveButtonText}>Approve</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  groupByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupByLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  groupByButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  groupByButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  groupByButtonActive: {
    backgroundColor: '#dbeafe',
  },
  groupByButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  groupByButtonTextActive: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  group: {
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    paddingHorizontal: 16,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  groupCount: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  groupCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  groupCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  groupEntries: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  entryWrapper: {
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
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
});

