import { timeTrackingService } from '@/services/TimeTrackingService';
import { ActiveClockSession } from '@/types/crew';
import { calculateAccruingCost, formatCurrency, formatDuration } from '@/utils/costCalculations';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RemoteClockOutModal } from './RemoteClockOutModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LiveTrackingDashboardProps {
  onRefresh?: () => void;
}

type ViewMode = 'list' | 'map';

export const LiveTrackingDashboard: React.FC<LiveTrackingDashboardProps> = ({ onRefresh }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [trackingData, setTrackingData] = useState<{
    activeSessions: ActiveClockSession[];
    totalClockedIn: number;
    totalCostPerHour: number;
    totalCostAccrued: number;
  } | null>(null);
  const [selectedSessionForClockOut, setSelectedSessionForClockOut] = useState<ActiveClockSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLiveData();
    
    // Poll every 5 seconds for live updates
    const interval = setInterval(() => {
      loadLiveData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadLiveData = () => {
    try {
      const data = timeTrackingService.getLiveTrackingData();
      setTrackingData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading live tracking data:', error);
      setLoading(false);
    }
  };

  const handleRemoteClockOut = () => {
    setSelectedSessionForClockOut(null);
    loadLiveData();
    onRefresh?.();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading live tracking...</Text>
      </View>
    );
  }

  if (!trackingData) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>Unable to load tracking data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Clocked In</Text>
            <Text style={styles.summaryValue}>{trackingData.totalClockedIn}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cost/Hour</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(trackingData.totalCostPerHour)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Accrued</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(trackingData.totalCostAccrued)}
            </Text>
          </View>
        </View>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons
            name="list"
            size={20}
            color={viewMode === 'list' ? '#fff' : '#6366f1'}
          />
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Ionicons
            name="map"
            size={20}
            color={viewMode === 'map' ? '#fff' : '#6366f1'}
          />
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {trackingData.activeSessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No crew members currently clocked in</Text>
          <Text style={styles.emptySubtext}>
            Crew members will appear here when they clock in
          </Text>
        </View>
      ) : viewMode === 'list' ? (
        <ScrollView style={styles.listView} showsVerticalScrollIndicator={false}>
          {trackingData.activeSessions.map((session) => (
            <View key={session.id} style={styles.crewCard}>
              <View style={styles.crewHeader}>
                <View style={styles.crewAvatar}>
                  <Ionicons name="person" size={24} color="#6366f1" />
                </View>
                <View style={styles.crewInfo}>
                  <Text style={styles.crewName}>{session.crewMemberName}</Text>
                  <Text style={styles.crewRole}>{session.crewMemberRole}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.statusText}>ACTIVE</Text>
                </View>
              </View>

              <View style={styles.jobInfo}>
                <View style={styles.jobRow}>
                  <Ionicons name="briefcase-outline" size={16} color="#6b7280" />
                  <Text style={styles.jobName}>{session.jobName}</Text>
                </View>
                {session.jobAddress && (
                  <View style={styles.jobRow}>
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text style={styles.jobAddress}>{session.jobAddress}</Text>
                  </View>
                )}
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <View>
                    <Text style={styles.metricLabel}>Elapsed</Text>
                    <Text style={styles.metricValue}>
                      {formatDuration(session.elapsedMinutes)}
                    </Text>
                  </View>
                </View>
                <View style={styles.metricItem}>
                  <Ionicons name="cash-outline" size={18} color="#6b7280" />
                  <View>
                    <Text style={styles.metricLabel}>Est. Cost</Text>
                    <Text style={styles.metricValue}>
                      {formatCurrency(calculateAccruingCost(session, session.hourlyRate))}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.clockOutButton}
                onPress={() => setSelectedSessionForClockOut(session)}
              >
                <Ionicons name="stop-circle-outline" size={20} color="#ef4444" />
                <Text style={styles.clockOutButtonText}>Remote Clock Out</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.mapView}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: trackingData.activeSessions[0]?.clockInLocation?.latitude || 28.5384,
              longitude: trackingData.activeSessions[0]?.clockInLocation?.longitude || -81.3792,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {trackingData.activeSessions.map((session, index) => {
              if (!session.clockInLocation) return null;
              
              return (
                <Marker
                  key={session.id}
                  coordinate={{
                    latitude: session.clockInLocation.latitude,
                    longitude: session.clockInLocation.longitude,
                  }}
                  title={session.crewMemberName}
                  description={`${session.jobName} - ${formatDuration(session.elapsedMinutes)}`}
                  pinColor="#6366f1"
                />
              );
            })}
          </MapView>

          {/* Map Legend */}
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={styles.legendText}>Active Crew</Text>
            </View>
          </View>
        </View>
      )}

      {/* Remote Clock Out Modal */}
      {selectedSessionForClockOut && (
        <RemoteClockOutModal
          visible={true}
          session={selectedSessionForClockOut}
          onConfirm={handleRemoteClockOut}
          onCancel={() => setSelectedSessionForClockOut(null)}
        />
      )}
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
  summaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  viewToggle: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  toggleButtonActive: {
    backgroundColor: '#6366f1',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  toggleTextActive: {
    color: 'white',
  },
  listView: {
    flex: 1,
    padding: 16,
  },
  crewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  crewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  crewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  crewInfo: {
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
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 0.5,
  },
  jobInfo: {
    marginBottom: 16,
    gap: 8,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  jobAddress: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  clockOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clockOutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  mapView: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
