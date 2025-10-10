import { useTabBar } from '@/contexts/TabBarContext';
import { useIsCrew, useUserRole } from '@/contexts/UserRoleContext';
import { timeTrackingService } from '@/services/TimeTrackingService';
import { ActiveClockSession } from '@/types/crew';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Mock data types
interface TodayJob {
  id: string;
  jobName: string;
  customerName: string;
  startTime: string;
  address: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface TodayTask {
  id: string;
  title: string;
  jobName?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface UpcomingAppointment {
  id: string;
  time: string;
  customerName: string;
  type: string;
  address: string;
}

export default function MyDayScreen() {
  const { setIsVisible } = useTabBar();
  const { impersonatingCrewMemberId } = useUserRole();
  const isCrew = useIsCrew();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveClockSession | null>(null);
  const [todayJobs, setTodayJobs] = useState<TodayJob[]>([]);
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);

  const currentCrewMemberId = isCrew ? impersonatingCrewMemberId || '1' : null;

  useEffect(() => {
    setIsVisible(false);
    loadData();
    return () => setIsVisible(true);
  }, []);

  const loadData = () => {
    setIsLoading(true);
    
    // Load active session
    if (currentCrewMemberId) {
      const session = timeTrackingService.getActiveSessionByCrewMember(currentCrewMemberId);
      setActiveSession(session);
    }

    // Load mock data - In real app, these would come from services
    loadTodayJobs();
    loadTodayTasks();
    loadUpcomingAppointments();

    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadTodayJobs = () => {
    // Mock jobs for today
    setTodayJobs([
      {
        id: 'JOB001',
        jobName: 'Kitchen Renovation',
        customerName: 'Sherry Williams',
        startTime: '09:00 AM',
        address: '1234 Oak Street, Orlando FL',
        status: 'in-progress',
      },
      {
        id: 'JOB002',
        jobName: 'Bathroom Remodel',
        customerName: 'John Smith',
        startTime: '02:00 PM',
        address: '5678 Pine Avenue, Orlando FL',
        status: 'scheduled',
      },
    ]);
  };

  const loadTodayTasks = () => {
    // Mock tasks for today
    setTodayTasks([
      {
        id: 'TASK001',
        title: 'Install new plumbing fixtures',
        jobName: 'Kitchen Renovation',
        priority: 'high',
        completed: false,
      },
      {
        id: 'TASK002',
        title: 'Paint walls',
        jobName: 'Kitchen Renovation',
        priority: 'medium',
        completed: false,
      },
      {
        id: 'TASK003',
        title: 'Clean up job site',
        priority: 'low',
        completed: true,
      },
    ]);
  };

  const loadUpcomingAppointments = () => {
    // Mock appointments
    setUpcomingAppointments([
      {
        id: 'APT001',
        time: '03:30 PM',
        customerName: 'Jane Doe',
        type: 'Consultation',
        address: '9876 Elm Drive, Orlando FL',
      },
    ]);
  };

  const handleTaskToggle = (taskId: string) => {
    setTodayTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatElapsedTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'in-progress':
        return { bg: '#dcfce7', text: '#047857' };
      case 'completed':
        return { bg: '#f3e8ff', text: '#6b21a8' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading your day...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/timesheets')} style={styles.clockButton}>
          <Ionicons name="time-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      >
        {/* Currently Clocked In */}
        {activeSession && (
          <View style={styles.section}>
            <View style={styles.activeSessionCard}>
              <View style={styles.activeSessionHeader}>
                <View style={styles.pulsingDot} />
                <Text style={styles.activeSessionTitle}>Currently Clocked In</Text>
              </View>
              <Text style={styles.activeSessionJob}>{activeSession.jobName}</Text>
              <View style={styles.activeSessionStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Elapsed Time</Text>
                  <Text style={styles.statValue}>{formatElapsedTime(activeSession.elapsedMinutes)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.quickClockOutButton}
                  onPress={() => router.push('/timesheets')}
                >
                  <Text style={styles.quickClockOutText}>Clock Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Today's Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/crew-jobs')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {todayJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No jobs scheduled for today</Text>
            </View>
          ) : (
            todayJobs.map(job => {
              const statusColors = getStatusColor(job.status);
              return (
                <TouchableOpacity key={job.id} style={styles.jobCard}>
                  <View style={styles.jobHeader}>
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobName}>{job.jobName}</Text>
                      <Text style={styles.jobCustomer}>{job.customerName}</Text>
                    </View>
                    <View style={[styles.jobStatusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.jobStatusText, { color: statusColors.text }]}>
                        {job.status.replace('-', ' ')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.jobDetails}>
                    <View style={styles.jobDetailRow}>
                      <Ionicons name="time-outline" size={16} color="#6b7280" />
                      <Text style={styles.jobDetailText}>{job.startTime}</Text>
                    </View>
                    <View style={styles.jobDetailRow}>
                      <Ionicons name="location-outline" size={16} color="#6b7280" />
                      <Text style={styles.jobDetailText}>{job.address}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {todayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No tasks for today</Text>
            </View>
          ) : (
            todayTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => handleTaskToggle(task.id)}
              >
                <View style={styles.taskCheckbox}>
                  <Ionicons
                    name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={task.completed ? '#10b981' : '#d1d5db'}
                  />
                </View>
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleCompleted,
                    ]}
                  >
                    {task.title}
                  </Text>
                  {task.jobName && (
                    <Text style={styles.taskJobName}>{task.jobName}</Text>
                  )}
                </View>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            </View>

            {upcomingAppointments.map(apt => (
              <View key={apt.id} style={styles.appointmentCard}>
                <View style={styles.appointmentTime}>
                  <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                  <Text style={styles.appointmentTimeText}>{apt.time}</Text>
                </View>
                <Text style={styles.appointmentCustomer}>{apt.customerName}</Text>
                <Text style={styles.appointmentType}>{apt.type}</Text>
                <View style={styles.appointmentLocation}>
                  <Ionicons name="location-outline" size={14} color="#6b7280" />
                  <Text style={styles.appointmentLocationText}>{apt.address}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/timesheets')}
            >
              <Ionicons name="time" size={32} color="#6366f1" />
              <Text style={styles.quickActionText}>Timesheets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/job-schedule')}
            >
              <Ionicons name="calendar" size={32} color="#10b981" />
              <Text style={styles.quickActionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/team-chat')}
            >
              <Ionicons name="chatbubbles" size={32} color="#f59e0b" />
              <Text style={styles.quickActionText}>Team Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/crew-jobs')}
            >
              <Ionicons name="briefcase" size={32} color="#ef4444" />
              <Text style={styles.quickActionText}>My Jobs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  clockButton: {
    padding: 8,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  activeSessionCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#a5b4fc',
  },
  activeSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  activeSessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338ca',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeSessionJob: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 12,
  },
  activeSessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e1b4b',
  },
  quickClockOutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickClockOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDetails: {
    gap: 8,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 12,
  },
  taskCheckbox: {},
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskJobName: {
    fontSize: 13,
    color: '#6b7280',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  appointmentTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  appointmentCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  appointmentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appointmentLocationText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9ca3af',
  },
});

