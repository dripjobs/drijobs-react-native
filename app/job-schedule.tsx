import DrawerMenu from '@/components/DrawerMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    Grid,
    List,
    MapPin,
    Navigation,
    Users,
    Wrench,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

// Sample job data
const jobEvents = [
  { 
    id: 1, 
    date: 2, 
    time: '08:00', 
    duration: 120, 
    jobName: 'Kitchen Renovation - Johnson Residence', 
    type: 'renovation', 
    color: '#10B981',
    status: 'in-progress',
    assignedTeam: 'Team A - Mike, Sarah, John',
    address: '4214 SE 11 PL, Ocala FL 34471',
    notes: 'Day 3 of kitchen demo and prep for new cabinets. Need to coordinate plumber visit.',
    description: 'Complete kitchen renovation with custom cabinetry installation',
  },
  { 
    id: 2, 
    date: 2, 
    time: '10:00', 
    duration: 180, 
    jobName: 'Roof Replacement - Williams Property', 
    type: 'roofing', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignedTeam: 'Team B - Chris, Tom',
    address: '123 Main St, Orlando FL 32801',
    notes: 'Weather permitting. Materials delivered yesterday.',
    description: 'Full roof tear-off and replacement with architectural shingles',
  },
  { 
    id: 3, 
    date: 3, 
    time: '09:00', 
    duration: 240, 
    jobName: 'Office Build-Out - Thompson Commercial', 
    type: 'commercial', 
    color: '#06B6D4',
    status: 'scheduled',
    assignedTeam: 'Team A & C - Full Crew',
    address: '456 Oak Ave, Tampa FL 33602',
    notes: 'Large commercial project. All hands on deck. HVAC contractor arriving at 1 PM.',
    description: 'Commercial office space renovation - 5,000 sq ft',
  },
  { 
    id: 4, 
    date: 4, 
    time: '08:30', 
    duration: 90, 
    jobName: 'Deck Finishing - Martinez Home', 
    type: 'outdoor', 
    color: '#F59E0B',
    status: 'scheduled',
    assignedTeam: 'Team B - Chris, David',
    address: '789 Pine St, Tampa FL 33603',
    notes: 'Final staining and sealing. Weather must be dry.',
    description: 'Complete deck staining and sealing project',
  },
  { 
    id: 5, 
    date: 5, 
    time: '13:00', 
    duration: 150, 
    jobName: 'Bathroom Remodel - Davis Residence', 
    type: 'plumbing', 
    color: '#3B82F6',
    status: 'scheduled',
    assignedTeam: 'Team A - Mike, Sarah',
    address: '321 Elm St, Orlando FL 32802',
    notes: 'Tile installation day. Plumber scheduled for morning prep.',
    description: 'Master bathroom remodel with new fixtures',
  }
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function JobSchedule() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: '#3B82F6' },
    { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
    { value: 'completed', label: 'Completed', color: '#10B981' },
    { value: 'delayed', label: 'Delayed', color: '#EF4444' },
  ];

  const handleScrollBeginDrag = () => setIsTransparent(true);
  const handleScrollEndDrag = () => setIsTransparent(false);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getJobsForDate = (date: number) => {
    return jobEvents.filter(job => job.date === date);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'delayed': return 'Delayed';
      default: return 'Scheduled';
    }
  };

  const handleJobPress = (job: any) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    
    Animated.timing(jobDetailsTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseJobDetails = () => {
    Animated.timing(jobDetailsTranslateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowJobDetails(false);
      setSelectedJob(null);
    });
  };

  const handleGPSNavigation = (address: string) => {
    console.log('Navigate to:', address);
  };

  const handleCopyAddress = (address: string) => {
    console.log('Copy address:', address);
  };

  // Group jobs by day for list view
  const groupedJobs = jobEvents.reduce((acc: any[], job) => {
    const existing = acc.find(item => item.day === job.date);
    if (existing) {
      existing.jobs.push(job);
    } else {
      acc.push({ day: job.date, jobs: [job] });
    }
    return acc;
  }, []).sort((a, b) => a.day - b.day);

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                        currentDate.getFullYear() === today.getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Schedule</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.viewToggle, viewMode === 'calendar' && styles.viewToggleActive]}
              onPress={() => setViewMode('calendar')}
            >
              <Grid size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
              onPress={() => setViewMode('list')}
            >
              <List size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthNavButton}>
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.monthYearContainer}>
          <Text style={styles.monthYearText}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthNavButton}>
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <ScrollView 
          style={styles.calendarContainer}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollBegin={handleScrollBeginDrag}
          onMomentumScrollEnd={handleScrollEndDrag}
          showsVerticalScrollIndicator={false}
        >
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.calendarDay} />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = isCurrentMonth && day === today.getDate();
              const isSelected = selectedDate.getDate() === day && 
                                selectedDate.getMonth() === currentDate.getMonth() &&
                                selectedDate.getFullYear() === currentDate.getFullYear();
              const dayJobs = getJobsForDate(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.calendarDay,
                    isToday && styles.calendarDayToday,
                    isSelected && styles.calendarDaySelected
                  ]}
                  onPress={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                  <Text style={[
                    styles.calendarDayText,
                    isToday && styles.calendarDayTextToday,
                    isSelected && styles.calendarDayTextSelected
                  ]}>
                    {day}
                  </Text>
                  {dayJobs.length > 0 && (
                    <View style={styles.dayEvents}>
                      {dayJobs.slice(0, 3).map((job, idx) => (
                        <View key={idx} style={[styles.eventDot, { backgroundColor: job.color }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Day Jobs */}
          <View style={styles.selectedDaySection}>
            <Text style={styles.selectedDayTitle}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </Text>
            
            {getJobsForDate(selectedDate.getDate()).length === 0 ? (
              <View style={styles.noJobsContainer}>
                <Wrench size={40} color="#9CA3AF" />
                <Text style={styles.noJobsText}>No jobs scheduled</Text>
              </View>
            ) : (
              <View style={styles.jobsList}>
                {getJobsForDate(selectedDate.getDate()).map((job) => (
                  <TouchableOpacity
                    key={job.id}
                    style={styles.jobCard}
                    onPress={() => handleJobPress(job)}
                  >
                    <View style={styles.jobHeader}>
                      <View style={styles.jobHeaderLeft}>
                        <View style={[styles.jobIconContainer, { backgroundColor: job.color + '20' }]}>
                          <Wrench size={20} color={job.color} />
                        </View>
                        <View style={styles.jobHeaderInfo}>
                          <Text style={styles.jobTime}>{job.time}</Text>
                          <Text style={styles.jobDuration}>{job.duration} min</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: job.color }]}>
                        <Text style={styles.statusBadgeText}>{getStatusLabel(job.status)}</Text>
                      </View>
                    </View>

                    <View style={styles.jobBody}>
                      <Text style={styles.jobName}>{job.jobName}</Text>
                      <View style={styles.jobDetails}>
                        <View style={styles.detailRow}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.detailText} numberOfLines={1}>{job.address}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Users size={16} color="#6B7280" />
                          <Text style={styles.detailText}>{job.assignedTeam}</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.viewDetailsButton}
                        onPress={() => handleJobPress(job)}
                      >
                        <Text style={styles.viewDetailsButtonText}>View Details</Text>
                        <ChevronRight size={16} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        /* List View */
        <ScrollView 
          style={styles.listContainer}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollBegin={handleScrollBeginDrag}
          onMomentumScrollEnd={handleScrollEndDrag}
          showsVerticalScrollIndicator={false}
        >
          {groupedJobs.map(({ day, jobs }) => (
            <View key={day} style={styles.daySection}>
              <View style={styles.daySectionHeader}>
                <Text style={styles.daySectionTitle}>
                  {monthNames[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}
                </Text>
                <Text style={styles.daySectionSubtitle}>
                  {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </Text>
              </View>
              
              {jobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobCard}
                  onPress={() => handleJobPress(job)}
                >
                  <View style={styles.jobHeader}>
                    <View style={styles.jobHeaderLeft}>
                      <View style={[styles.jobIconContainer, { backgroundColor: job.color + '20' }]}>
                        <Wrench size={20} color={job.color} />
                      </View>
                      <View style={styles.jobHeaderInfo}>
                        <Text style={styles.jobTime}>{job.time}</Text>
                        <Text style={styles.jobDuration}>{job.duration} min</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: job.color }]}>
                      <Text style={styles.statusBadgeText}>{getStatusLabel(job.status)}</Text>
                    </View>
                  </View>

                  <View style={styles.jobBody}>
                    <Text style={styles.jobName}>{job.jobName}</Text>
                    <View style={styles.jobDetails}>
                      <View style={styles.detailRow}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.detailText} numberOfLines={1}>{job.address}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Users size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{job.assignedTeam}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.viewDetailsButton}
                      onPress={() => handleJobPress(job)}
                    >
                      <Text style={styles.viewDetailsButtonText}>View Details</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      {/* Job Details Modal */}
      <Modal
        visible={showJobDetails}
        transparent
        animationType="none"
        onRequestClose={handleCloseJobDetails}
      >
        <View style={styles.fullScreenModalOverlay}>
          <PanGestureHandler>
            <Animated.View
              style={[
                styles.fullScreenModalContainer,
                {
                  transform: [{ translateY: jobDetailsTranslateY }],
                },
              ]}
            >
              {selectedJob && (
                <View style={styles.fullScreenContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={handleCloseJobDetails}
                    >
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.modalHeaderTitle}>Job Details</Text>
                    <View style={styles.headerSpacer} />
                  </View>

                  <ScrollView
                    style={styles.fullScreenScrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Status Section */}
                    <View style={styles.statusSection}>
                      <Text style={styles.statusSectionLabel}>Status</Text>
                      <View style={[styles.clickableStatusBadge, { backgroundColor: selectedJob.color }]}>
                        <Text style={styles.clickableStatusText}>{getStatusLabel(selectedJob.status)}</Text>
                      </View>
                    </View>

                    {/* Job Location */}
                    <View style={styles.prominentAddressSection}>
                      <View style={styles.addressHeader}>
                        <MapPin size={20} color="#EF4444" />
                        <Text style={styles.addressLabel}>Job Site</Text>
                      </View>
                      <Text style={styles.prominentAddress}>{selectedJob.address}</Text>
                      <View style={styles.addressActions}>
                        <TouchableOpacity 
                          style={styles.navigationButton}
                          onPress={() => handleGPSNavigation(selectedJob.address)}
                        >
                          <Navigation size={16} color="#FFFFFF" />
                          <Text style={styles.navigationButtonText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.copyButton}
                          onPress={() => handleCopyAddress(selectedJob.address)}
                        >
                          <Copy size={16} color="#6B7280" />
                          <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Job Information */}
                    <View style={styles.jobInfoCard}>
                      <Text style={styles.cardTitle}>Job Information</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Job:</Text>
                        <Text style={styles.infoValue}>{selectedJob.jobName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time:</Text>
                        <Text style={styles.infoValue}>{selectedJob.time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Duration:</Text>
                        <Text style={styles.infoValue}>{selectedJob.duration} minutes</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Team:</Text>
                        <Text style={styles.infoValue}>{selectedJob.assignedTeam}</Text>
                      </View>
                    </View>

                    {/* Job Description */}
                    <View style={styles.jobInfoCard}>
                      <Text style={styles.cardTitle}>Description</Text>
                      <Text style={styles.jobDescriptionText}>{selectedJob.description}</Text>
                    </View>

                    {/* Notes Section */}
                    {selectedJob.notes && (
                      <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>Notes</Text>
                        <Text style={styles.notesText}>{selectedJob.notes}</Text>
                      </View>
                    )}

                    <View style={styles.bottomSpacing} />
                  </ScrollView>
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  viewToggleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthNavButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  calendarDayToday: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  calendarDaySelected: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  calendarDayTextToday: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayEvents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  selectedDaySection: {
    marginTop: 24,
    marginBottom: 24,
  },
  selectedDayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  noJobsText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  jobsList: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobHeaderInfo: {
    flex: 1,
  },
  jobTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  jobDuration: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jobBody: {
    padding: 16,
  },
  jobName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  jobDetails: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewDetailsButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6366F1',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  daySection: {
    marginBottom: 24,
  },
  daySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
  },
  daySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  daySectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 120,
  },
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fullScreenContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  fullScreenScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statusSectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  clickableStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clickableStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  prominentAddressSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  prominentAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 16,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flex: 1,
    justifyContent: 'center',
  },
  copyButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  jobInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  jobDescriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
});

