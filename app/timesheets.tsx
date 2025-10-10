import { ActiveTimerDisplay } from '@/components/ActiveTimerDisplay';
import { ClockInOutButton } from '@/components/ClockInOutButton';
import { JobPickerForTimeTracking } from '@/components/JobPickerForTimeTracking';
import { TimeEntryCard } from '@/components/TimeEntryCard';
import { useTabBar } from '@/contexts/TabBarContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { crewService } from '@/services/CrewService';
import { timeTrackingService } from '@/services/TimeTrackingService';
import { ActiveClockSession, CrewMember, TimeEntry } from '@/types/crew';
import { Job } from '@/types/jobs';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TimeFilter = 'today' | 'week' | 'month';

export default function TimesheetsScreen() {
  const { setIsVisible } = useTabBar();
  const { currentRole, impersonatingCrewMemberId, permissions } = useUserRole();

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveClockSession | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [refreshing, setRefreshing] = useState(false);
  const [offlinePending, setOfflinePending] = useState(0);

  const isCrew = currentRole === 'crew';
  const currentCrewMemberId = isCrew ? impersonatingCrewMemberId || '1' : null;

  useEffect(() => {
    setIsVisible(false);
    loadData();
    return () => setIsVisible(true);
  }, [currentRole, impersonatingCrewMemberId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load crew member if in crew mode
      if (currentCrewMemberId) {
        const member = crewService.getCrewMember(currentCrewMemberId);
        setCrewMember(member || null);

        // Check for active session
        const session = timeTrackingService.getActiveSessionByCrewMember(currentCrewMemberId);
        setActiveSession(session);

        // Load assigned jobs
        const mockJobs = getMockJobs();
        const assigned = timeTrackingService.getAssignedJobs(currentCrewMemberId, mockJobs);
        setAssignedJobs(assigned);
      }

      // Load time entries
      loadTimeEntries();

      // Check offline queue
      const pending = timeTrackingService.getPendingOfflineEvents();
      setOfflinePending(pending.length);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load timesheet data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimeEntries = () => {
    const now = new Date();
    let startDate: string | undefined;

    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart.toISOString();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        break;
    }

    if (currentCrewMemberId) {
      const entries = timeTrackingService.getTimeEntriesByCrewMember(
        currentCrewMemberId,
        startDate
      );
      setTimeEntries(entries);
    } else {
      const entries = timeTrackingService.getTimeEntries({ startDate });
      setTimeEntries(entries);
    }
  };

  useEffect(() => {
    loadTimeEntries();
  }, [timeFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleClockIn = async () => {
    if (!selectedJob) {
      setShowJobPicker(true);
      return;
    }

    if (!crewMember) {
      Alert.alert('Error', 'Crew member data not found');
      return;
    }

    setIsActionLoading(true);

    try {
      const result = await timeTrackingService.clockIn(
        currentCrewMemberId!,
        crewMember,
        selectedJob.id,
        selectedJob.projectName,
        selectedJob.address
      );

      if (result.success) {
        setActiveSession(result.session || null);
        Alert.alert(
          'Clocked In',
          `Successfully clocked in to ${selectedJob.projectName}`,
          [{ text: 'OK' }]
        );
        loadTimeEntries();
      } else {
        Alert.alert('Clock In Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Clock in error:', error);
      Alert.alert('Error', 'Failed to clock in. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    Alert.alert(
      'Clock Out',
      'Are you sure you want to clock out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clock Out',
          style: 'destructive',
          onPress: async () => {
            setIsActionLoading(true);
            try {
              const result = await timeTrackingService.clockOut(currentCrewMemberId!);

              if (result.success) {
                setActiveSession(null);
                Alert.alert('Clocked Out', 'Successfully clocked out', [{ text: 'OK' }]);
                loadTimeEntries();
              } else {
                Alert.alert('Clock Out Failed', result.error || 'Unknown error');
              }
            } catch (error) {
              console.error('Clock out error:', error);
              Alert.alert('Error', 'Failed to clock out. Please try again.');
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBreakToggle = async () => {
    if (!activeSession) return;

    try {
      if (activeSession.currentBreak) {
        const result = await timeTrackingService.endBreak(currentCrewMemberId!);
        if (result.success) {
          const updatedSession = timeTrackingService.getActiveSessionByCrewMember(
            currentCrewMemberId!
          );
          setActiveSession(updatedSession);
        }
      } else {
        const result = await timeTrackingService.startBreak(currentCrewMemberId!);
        if (result.success) {
          const updatedSession = timeTrackingService.getActiveSessionByCrewMember(
            currentCrewMemberId!
          );
          setActiveSession(updatedSession);
        }
      }
    } catch (error) {
      console.error('Break toggle error:', error);
      Alert.alert('Error', 'Failed to toggle break');
    }
  };

  const getMockJobs = (): Job[] => {
    // Mock jobs data - in real app this would come from a JobsService
    return [
      {
        id: 'JOB001',
        workOrderNumber: 'WO-2024-001',
        customerName: 'Sherry Williams',
        businessName: 'Williams Properties LLC',
        projectName: 'Kitchen Renovation',
        address: '1234 Oak Street, Orlando FL 32801',
        phone: '(407) 555-0123',
        jobStage: 'in-progress',
        contractValue: 45000,
        startDate: new Date().toISOString(),
        daysInStage: 5,
        assignedTo: {
          projectManager: 'Chris Palmer',
          crewLeader: 'John Smith',
          salesperson: 'Tom Henderson',
        },
        assignedCrewIds: ['crew_1'],
        assignedCrewMemberIds: ['1', '2'],
        priority: 'high',
        completionPercentage: 35,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'JOB002',
        workOrderNumber: 'WO-2024-002',
        customerName: 'Thompson Commercial',
        projectName: 'Office Renovation',
        address: '567 Business Blvd, Orlando FL 32803',
        phone: '(407) 555-0456',
        jobStage: 'scheduled',
        contractValue: 75000,
        startDate: new Date().toISOString(),
        daysInStage: 1,
        assignedTo: {
          projectManager: 'Tanner Mullen',
          crewLeader: 'John Smith',
          salesperson: 'Sarah Johnson',
        },
        assignedCrewIds: ['crew_1'],
        assignedCrewMemberIds: ['1'],
        priority: 'medium',
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Timesheets',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Crew Member View
  if (isCrew && crewMember) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'My Timesheet',
            headerBackTitle: 'Back',
          }}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Crew Member Info */}
          <View style={styles.crewInfoCard}>
            <View style={styles.crewInfoHeader}>
              <Ionicons name="person-circle" size={48} color="#3b82f6" />
              <View style={styles.crewInfoText}>
                <Text style={styles.crewName}>
                  {crewMember.firstName} {crewMember.lastName}
                </Text>
                <Text style={styles.crewRole}>{crewMember.role}</Text>
              </View>
            </View>
          </View>

          {/* Offline Indicator */}
          {offlinePending > 0 && (
            <View style={styles.offlineBanner}>
              <Ionicons name="cloud-offline" size={20} color="#f59e0b" />
              <Text style={styles.offlineText}>
                {offlinePending} event{offlinePending > 1 ? 's' : ''} pending sync
              </Text>
            </View>
          )}

          {/* Active Session or Clock In */}
          {activeSession ? (
            <View style={styles.section}>
              <ActiveTimerDisplay
                session={activeSession}
                onBreakToggle={handleBreakToggle}
                showBreakButton={true}
              />
              <ClockInOutButton
                isClockedIn={true}
                isLoading={isActionLoading}
                onPress={handleClockOut}
              />
            </View>
          ) : (
            <View style={styles.section}>
              {/* Job Selection */}
              {selectedJob && (
                <TouchableOpacity
                  style={styles.selectedJobCard}
                  onPress={() => setShowJobPicker(true)}
                >
                  <View style={styles.selectedJobHeader}>
                    <Ionicons name="briefcase" size={20} color="#3b82f6" />
                    <Text style={styles.selectedJobTitle}>{selectedJob.projectName}</Text>
                  </View>
                  <Text style={styles.selectedJobCustomer}>{selectedJob.customerName}</Text>
                  <TouchableOpacity
                    style={styles.changeJobButton}
                    onPress={() => setShowJobPicker(true)}
                  >
                    <Text style={styles.changeJobText}>Change Job</Text>
                    <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}

              {!selectedJob && (
                <TouchableOpacity
                  style={styles.selectJobButton}
                  onPress={() => setShowJobPicker(true)}
                >
                  <Ionicons name="add-circle" size={24} color="#3b82f6" />
                  <Text style={styles.selectJobText}>Select Job to Clock In</Text>
                </TouchableOpacity>
              )}

              {/* Clock In Button */}
              <ClockInOutButton
                isClockedIn={false}
                isLoading={isActionLoading}
                onPress={handleClockIn}
                disabled={!selectedJob}
              />
            </View>
          )}

          {/* Time Entries History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Time Entries</Text>

              {/* Filter Tabs */}
              <View style={styles.filterTabs}>
                <TouchableOpacity
                  style={[styles.filterTab, timeFilter === 'today' && styles.filterTabActive]}
                  onPress={() => setTimeFilter('today')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      timeFilter === 'today' && styles.filterTabTextActive,
                    ]}
                  >
                    Today
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterTab, timeFilter === 'week' && styles.filterTabActive]}
                  onPress={() => setTimeFilter('week')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      timeFilter === 'week' && styles.filterTabTextActive,
                    ]}
                  >
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterTab, timeFilter === 'month' && styles.filterTabActive]}
                  onPress={() => setTimeFilter('month')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      timeFilter === 'month' && styles.filterTabTextActive,
                    ]}
                  >
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {timeEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No time entries</Text>
                <Text style={styles.emptySubtext}>
                  Clock in to start tracking your time
                </Text>
              </View>
            ) : (
              timeEntries.map(entry => (
                <TimeEntryCard key={entry.id} entry={entry} showCost={false} />
              ))
            )}
          </View>
        </ScrollView>

        {/* Job Picker Modal */}
        <JobPickerForTimeTracking
          visible={showJobPicker}
          jobs={assignedJobs}
          onSelect={job => setSelectedJob(job)}
          onClose={() => setShowJobPicker(false)}
          selectedJobId={selectedJob?.id}
        />
      </SafeAreaView>
    );
  }

  // Admin View - Show all timesheets (will be enhanced in next phase)
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Timesheets',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.adminPlaceholder}>
          <Ionicons name="construct" size={64} color="#d1d5db" />
          <Text style={styles.adminPlaceholderText}>Admin Dashboard</Text>
          <Text style={styles.adminPlaceholderSubtext}>
            Live tracking and reporting features coming next
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  crewInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  crewInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crewInfoText: {
    flex: 1,
  },
  crewName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  crewRole: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  section: {
    marginBottom: 24,
    gap: 16,
  },
  selectedJobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  selectedJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  selectedJobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  selectedJobCustomer: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  changeJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  changeJobText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  selectJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  selectJobText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterTabActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: '#3b82f6',
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
  adminPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 64,
  },
  adminPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  adminPlaceholderSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

