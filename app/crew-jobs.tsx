import { useTabBar } from '@/contexts/TabBarContext';
import { useIsCrew, useUserRole } from '@/contexts/UserRoleContext';
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

// Mock job type
interface CrewJob {
  id: string;
  jobName: string;
  customerName: string;
  businessName?: string;
  address: string;
  phone: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  assignedCrew: string;
  workOrderId?: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

type JobFilter = 'scheduled' | 'active' | 'completed' | 'all';

export default function CrewJobsScreen() {
  const { setIsVisible } = useTabBar();
  const { impersonatingCrewMemberId } = useUserRole();
  const isCrew = useIsCrew();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<CrewJob[]>([]);
  const [filter, setFilter] = useState<JobFilter>('scheduled');

  const currentCrewMemberId = isCrew ? impersonatingCrewMemberId || '1' : null;

  useEffect(() => {
    setIsVisible(false);
    loadJobs();
    return () => setIsVisible(true);
  }, []);

  const loadJobs = () => {
    setIsLoading(true);
    
    // Mock jobs - In real app, filter by crew assignment from JobsService
    const mockJobs: CrewJob[] = [
      {
        id: 'JOB001',
        jobName: 'Kitchen Renovation',
        customerName: 'Sherry Williams',
        businessName: 'Williams Properties LLC',
        address: '1234 Oak Street, Orlando FL 32801',
        phone: '(407) 555-0123',
        status: 'in-progress',
        startDate: new Date().toISOString(),
        assignedCrew: "Beau's Crew",
        workOrderId: 'WO-2024-001',
        description: 'Complete kitchen remodel including new cabinets, countertops, and appliances',
        priority: 'high',
      },
      {
        id: 'JOB002',
        jobName: 'Bathroom Remodel',
        customerName: 'John Smith',
        address: '5678 Pine Avenue, Orlando FL 32802',
        phone: '(407) 555-0456',
        status: 'scheduled',
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        assignedCrew: "Beau's Crew",
        workOrderId: 'WO-2024-002',
        description: 'Master bathroom renovation with new tile, fixtures, and vanity',
        priority: 'medium',
      },
      {
        id: 'JOB003',
        jobName: 'Plumbing Repair',
        customerName: 'Jane Doe',
        address: '9876 Elm Drive, Orlando FL 32803',
        phone: '(407) 555-0789',
        status: 'completed',
        startDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        endDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        assignedCrew: "Beau's Crew",
        description: 'Emergency leak repair in basement',
        priority: 'high',
      },
    ];

    setJobs(mockJobs);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const getFilteredJobs = () => {
    switch (filter) {
      case 'scheduled':
        return jobs.filter(j => j.status === 'scheduled');
      case 'active':
        return jobs.filter(j => j.status === 'in-progress');
      case 'completed':
        return jobs.filter(j => j.status === 'completed');
      case 'all':
        return jobs;
      default:
        return jobs;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { bg: '#dbeafe', text: '#1e40af', icon: 'calendar-outline' };
      case 'in-progress':
        return { bg: '#dcfce7', text: '#047857', icon: 'play-circle' };
      case 'completed':
        return { bg: '#f3e8ff', text: '#6b21a8', icon: 'checkmark-circle' };
      case 'on-hold':
        return { bg: '#fef3c7', text: '#92400e', icon: 'pause-circle' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', icon: 'ellipse' };
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleJobPress = (job: CrewJob) => {
    // In real app, navigate to job details modal
    console.log('View job:', job.id);
  };

  const handleViewWorkOrder = (workOrderId: string) => {
    // Navigate to work order details
    router.push('/(tabs)/work-orders');
  };

  const filteredJobs = getFilteredJobs();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollContainer}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterTab, filter === 'scheduled' && styles.filterTabActive]}
          onPress={() => setFilter('scheduled')}
        >
          <Text style={[styles.filterTabText, filter === 'scheduled' && styles.filterTabTextActive]}>
            Scheduled
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterTabText, filter === 'active' && styles.filterTabTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterTabText, filter === 'completed' && styles.filterTabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      >
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Jobs Found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'scheduled' && 'No scheduled jobs at this time'}
              {filter === 'active' && 'You have no active jobs in progress'}
              {filter === 'completed' && 'No completed jobs in the last 30 days'}
              {filter === 'all' && 'No jobs assigned to you'}
            </Text>
          </View>
        ) : (
          <View style={styles.jobsList}>
            {filteredJobs.map(job => {
              const statusColors = getStatusColor(job.status);
              return (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobCard}
                  onPress={() => handleJobPress(job)}
                >
                  {/* Priority Bar */}
                  <View style={[styles.priorityBar, { backgroundColor: getPriorityColor(job.priority) }]} />

                  {/* Header */}
                  <View style={styles.jobHeader}>
                    <View style={styles.jobHeaderLeft}>
                      <Text style={styles.jobName}>{job.jobName}</Text>
                      <Text style={styles.customerName}>{job.customerName}</Text>
                      {job.businessName && (
                        <Text style={styles.businessName}>{job.businessName}</Text>
                      )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Ionicons name={statusColors.icon as any} size={14} color={statusColors.text} />
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {job.status.replace('-', ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {job.description && (
                    <Text style={styles.jobDescription} numberOfLines={2}>
                      {job.description}
                    </Text>
                  )}

                  {/* Details */}
                  <View style={styles.jobDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        Start: {formatDate(job.startDate)}
                      </Text>
                    </View>
                    {job.endDate && (
                      <View style={styles.detailRow}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                          Completed: {formatDate(job.endDate)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {job.address}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="call-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>{job.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>{job.assignedCrew}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.jobActions}>
                    {job.workOrderId && (
                      <TouchableOpacity
                        style={styles.workOrderButton}
                        onPress={() => handleViewWorkOrder(job.workOrderId!)}
                      >
                        <Ionicons name="document-text-outline" size={18} color="#6366f1" />
                        <Text style={styles.workOrderButtonText}>View Work Order</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.directionsButton}>
                      <Ionicons name="navigate-outline" size={18} color="#10b981" />
                      <Text style={styles.directionsButtonText}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  filterScrollContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    maxHeight: 60,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  filterTabActive: {
    backgroundColor: '#6366f1',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityBar: {
    height: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  jobHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  jobName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 2,
  },
  businessName: {
    fontSize: 13,
    color: '#9ca3af',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDescription: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  jobDetails: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
  },
  jobActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 12,
    gap: 8,
  },
  workOrderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
  },
  workOrderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

