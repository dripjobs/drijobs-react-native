import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { timeTrackingService } from '../services/TimeTrackingService';
import { ActiveClockSession } from '../types/crew';

interface LiveTrackingDashboardProps {
  onAdminClockOut?: (session: ActiveClockSession) => void;
}

export const LiveTrackingDashboard: React.FC<LiveTrackingDashboardProps> = ({
  onAdminClockOut,
}) => {
  const [activeSessions, setActiveSessions] = useState<ActiveClockSession[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
    // Refresh every 30 seconds
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = () => {
    const sessions = timeTrackingService.getActiveSessions();
    setActiveSessions(sessions);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadSessions();
    setRefreshing(false);
  };

  const handleAdminClockOut = (session: ActiveClockSession) => {
    Alert.alert(
      'Admin Clock Out',
      `Clock out ${session.crewMemberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clock Out',
          style: 'destructive',
          onPress: () => {
            if (onAdminClockOut) {
              onAdminClockOut(session);
            }
          },
        },
      ]
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const totalEstimatedCost = activeSessions.reduce(
    (sum, session) => sum + session.estimatedCost,
    0
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.lastUpdate}>
            Updated {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{activeSessions.length}</Text>
            <Text style={styles.statLabel}>Clocked In</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="cash" size={24} color="#10b981" />
            <Text style={styles.statValue}>{formatCurrency(totalEstimatedCost)}</Text>
            <Text style={styles.statLabel}>Est. Cost</Text>
          </View>
        </View>
      </View>

      {/* Active Sessions */}
      {activeSessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No Active Sessions</Text>
          <Text style={styles.emptySubtext}>
            No crew members are currently clocked in
          </Text>
        </View>
      ) : (
        activeSessions.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            {/* Header */}
            <View style={styles.sessionHeader}>
              <View style={styles.crewInfo}>
                <Ionicons name="person-circle" size={40} color="#3b82f6" />
                <View style={styles.crewDetails}>
                  <Text style={styles.crewName}>{session.crewMemberName}</Text>
                  <Text style={styles.crewRole}>{session.crewMemberRole}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.clockOutButton}
                onPress={() => handleAdminClockOut(session)}
              >
                <Ionicons name="stop-circle" size={20} color="white" />
                <Text style={styles.clockOutText}>Clock Out</Text>
              </TouchableOpacity>
            </View>

            {/* Job Info */}
            <View style={styles.jobSection}>
              <View style={styles.jobHeader}>
                <Ionicons name="briefcase" size={18} color="#6b7280" />
                <Text style={styles.jobName}>{session.jobName}</Text>
              </View>
              {session.jobAddress && (
                <View style={styles.jobAddress}>
                  <Ionicons name="location-outline" size={14} color="#9ca3af" />
                  <Text style={styles.jobAddressText}>{session.jobAddress}</Text>
                </View>
              )}
            </View>

            {/* Time Info */}
            <View style={styles.timeSection}>
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Ionicons name="log-in-outline" size={16} color="#10b981" />
                  <Text style={styles.timeLabel}>Clock In:</Text>
                  <Text style={styles.timeValue}>{formatTime(session.clockInTime)}</Text>
                </View>

                <View style={styles.timeItem}>
                  <Ionicons name="hourglass-outline" size={16} color="#3b82f6" />
                  <Text style={styles.timeLabel}>Duration:</Text>
                  <Text style={styles.timeValue}>{formatDuration(session.elapsedMinutes)}</Text>
                </View>
              </View>

              {session.currentBreak && (
                <View style={styles.breakBanner}>
                  <Ionicons name="pause-circle" size={16} color="#f59e0b" />
                  <Text style={styles.breakText}>
                    On Break ({Math.floor(session.currentBreak.elapsedMinutes)} min)
                  </Text>
                </View>
              )}
            </View>

            {/* Cost Info */}
            <View style={styles.costSection}>
              <View style={styles.costRow}>
                <View style={styles.costLabel}>
                  <Ionicons name="cash-outline" size={16} color="#1e40af" />
                  <Text style={styles.costLabelText}>Estimated Cost:</Text>
                </View>
                <Text style={styles.costValue}>{formatCurrency(session.estimatedCost)}</Text>
              </View>
              <Text style={styles.costBreakdown}>
                ${session.hourlyRate}/hr × {(session.elapsedMinutes / 60).toFixed(2)}h
              </Text>
            </View>

            {/* GPS Indicator */}
            {session.clockInLocation && (
              <View style={styles.gpsIndicator}>
                <Ionicons name="location" size={12} color="#10b981" />
                <Text style={styles.gpsText}>
                  GPS verified ({session.clockInLocation.accuracy.toFixed(0)}m accuracy)
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  crewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  crewDetails: {
    flex: 1,
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  crewRole: {
    fontSize: 13,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  clockOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clockOutText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  jobSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  jobName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  jobAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  jobAddressText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  timeSection: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  breakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  breakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  costSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costLabelText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e40af',
  },
  costValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  costBreakdown: {
    fontSize: 11,
    color: '#3b82f6',
    textAlign: 'right',
  },
  gpsIndicator: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: 'white',
    borderRadius: 12,
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

