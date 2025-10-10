import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimeEntry } from '../types/crew';

interface TimeEntryCardProps {
  entry: TimeEntry;
  onPress?: () => void;
  showCost?: boolean;
}

export const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  entry,
  onPress,
  showCost = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#3b82f6';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'edited':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.jobName}>{entry.jobName}</Text>
          <Text style={styles.date}>{formatDate(entry.clockInTime)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(entry.status)}20` },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(entry.status) }]}>
            {getStatusLabel(entry.status)}
          </Text>
        </View>
      </View>

      {/* Time Details */}
      <View style={styles.timeDetails}>
        <View style={styles.timeRow}>
          <Ionicons name="log-in-outline" size={16} color="#10b981" />
          <Text style={styles.timeLabel}>Clock In:</Text>
          <Text style={styles.timeValue}>{formatTime(entry.clockInTime)}</Text>
        </View>

        {entry.clockOutTime && (
          <View style={styles.timeRow}>
            <Ionicons name="log-out-outline" size={16} color="#ef4444" />
            <Text style={styles.timeLabel}>Clock Out:</Text>
            <Text style={styles.timeValue}>{formatTime(entry.clockOutTime)}</Text>
          </View>
        )}
      </View>

      {/* Hours Summary */}
      <View style={styles.hoursContainer}>
        <View style={styles.hoursRow}>
          <View style={styles.hoursItem}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.hoursLabel}>Regular</Text>
            <Text style={styles.hoursValue}>{entry.regularHours.toFixed(2)}h</Text>
          </View>

          {entry.overtimeHours > 0 && (
            <View style={styles.hoursItem}>
              <Ionicons name="flash-outline" size={16} color="#f59e0b" />
              <Text style={styles.hoursLabel}>Overtime</Text>
              <Text style={styles.hoursValue}>{entry.overtimeHours.toFixed(2)}h</Text>
            </View>
          )}

          <View style={styles.hoursItem}>
            <Ionicons name="calculator-outline" size={16} color="#3b82f6" />
            <Text style={styles.hoursLabel}>Total</Text>
            <Text style={[styles.hoursValue, styles.totalHours]}>
              {entry.totalHours.toFixed(2)}h
            </Text>
          </View>
        </View>
      </View>

      {/* Breaks */}
      {entry.breaks.length > 0 && (
        <View style={styles.breaksContainer}>
          <View style={styles.breaksHeader}>
            <Ionicons name="pause-circle-outline" size={14} color="#6b7280" />
            <Text style={styles.breaksText}>
              {entry.breaks.length} break{entry.breaks.length > 1 ? 's' : ''} ({entry.totalBreakMinutes} min)
            </Text>
          </View>
        </View>
      )}

      {/* Cost (Admin/Approved view only) */}
      {showCost && entry.status !== 'active' && (
        <View style={styles.costContainer}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Labor Cost:</Text>
            <Text style={styles.costValue}>{formatCurrency(entry.totalCost)}</Text>
          </View>
          {entry.overtimeCost > 0 && (
            <Text style={styles.costBreakdown}>
              Regular: {formatCurrency(entry.regularCost)} • OT: {formatCurrency(entry.overtimeCost)}
            </Text>
          )}
        </View>
      )}

      {/* Notes */}
      {entry.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={14} color="#6b7280" />
          <Text style={styles.notesText}>{entry.notes}</Text>
        </View>
      )}

      {/* Edited/Admin Notes */}
      {entry.isEdited && entry.adminNotes && (
        <View style={styles.adminNotesContainer}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#f59e0b" />
          <Text style={styles.adminNotesText}>{entry.adminNotes}</Text>
        </View>
      )}

      {/* GPS Indicators */}
      {(entry.clockInLocation || entry.clockOutLocation) && (
        <View style={styles.gpsContainer}>
          <Ionicons name="location" size={12} color="#10b981" />
          <Text style={styles.gpsText}>GPS verified</Text>
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  jobName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
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
  timeDetails: {
    gap: 8,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  hoursContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalHours: {
    color: '#3b82f6',
  },
  breaksContainer: {
    marginBottom: 8,
  },
  breaksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breaksText: {
    fontSize: 13,
    color: '#6b7280',
  },
  costContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
  },
  costValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  costBreakdown: {
    fontSize: 12,
    color: '#3b82f6',
    textAlign: 'right',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#78350f',
  },
  adminNotesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fed7aa',
    borderRadius: 8,
  },
  adminNotesText: {
    flex: 1,
    fontSize: 12,
    color: '#9a3412',
    fontStyle: 'italic',
  },
  gpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  gpsText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '500',
  },
});

