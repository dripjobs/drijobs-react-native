import CallInitiationModal from '@/components/CallInitiationModal';
import DrawerMenu from '@/components/DrawerMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Bell,
    Building,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    DollarSign,
    Edit,
    Eye,
    FileText,
    Grid,
    List,
    Mail,
    MapPin,
    MessageSquare,
    MoreVertical,
    Navigation,
    Phone,
    Plus,
    User,
    Users,
    Wrench,
    X,
    Zap
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

// Sample job data with multi-day spans
const jobEvents = [
  { 
    id: 1, 
    startDate: 2, 
    endDate: 4,
    time: '08:00 AM - 05:00 PM', 
    duration: 120, 
    jobName: 'Kitchen Renovation - Johnson Residence', 
    amount: 7850.00,
    type: 'renovation', 
    color: '#10B981',
    status: 'in-progress',
    assignedTeam: 'Team A - Mike, Sarah, John',
    jobAddress: '4214 SE 11 PL, Ocala FL 34471',
    notes: 'Day 3 of kitchen demo and prep for new cabinets. Need to coordinate plumber visit.',
    description: 'Complete kitchen renovation with custom cabinetry installation',
    customer: {
      name: 'Robert Johnson',
      company: 'Johnson Home Improvements',
      address: '4214 SE 11 PL, Ocala FL 34471',
      phone: '(352) 895-5224',
      email: 'robert.johnson@email.com'
    },
    jobInfo: {
      startDate: 'Oct 2, 2024',
      endDate: 'Oct 4, 2024',
      salesperson: 'Sarah Martinez',
      projectManager: 'Mike Chen',
      crewLeader: 'John Davis'
    },
    dealInfo: {
      pipeline: 'Jobs',
      stage: 'In Progress',
      inStage: '3 days',
      source: 'Facebook May 2025'
    },
    dripCampaign: {
      remaining: 5
    },
    financial: {
      contractValue: 7850.00,
      paidToDate: 2000.00,
      balanceDue: 5850.00,
      changeOrderValue: 0,
      invoiceStatus: 'Pending'
    }
  },
  { 
    id: 2, 
    startDate: 6, 
    endDate: 11,
    time: '08:00 AM - 05:00 PM', 
    duration: 180, 
    jobName: 'Roof Replacement - Williams Property', 
    amount: 5950.00,
    type: 'roofing', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignedTeam: 'Team B - Chris, Tom',
    jobAddress: '123 Main St, Orlando FL 32801',
    notes: 'Weather permitting. Materials delivered yesterday.',
    description: 'Full roof tear-off and replacement with architectural shingles',
    customer: {
      name: 'Sherry Williams',
      company: 'Williams Properties LLC',
      address: '123 Main St, Orlando FL 32801',
      phone: '(407) 555-8901',
      email: 'sherry.williams@email.com'
    },
    jobInfo: {
      startDate: 'Oct 6, 2024',
      endDate: 'Oct 11, 2024',
      salesperson: 'Tom Henderson',
      projectManager: 'Lisa Brown',
      crewLeader: 'Chris Murphy'
    },
    dealInfo: {
      pipeline: 'Jobs',
      stage: 'Scheduled',
      inStage: '1 day',
      source: 'Website Inquiry'
    },
    dripCampaign: {
      remaining: 3
    },
    financial: {
      contractValue: 5950.00,
      paidToDate: 1500.00,
      balanceDue: 4450.00,
      changeOrderValue: 0,
      invoiceStatus: 'Pending'
    }
  },
  { 
    id: 3, 
    startDate: 4, 
    endDate: 6,
    time: '08:00 AM - 05:00 PM', 
    duration: 240, 
    jobName: 'Office Build-Out - Thompson Commercial', 
    amount: 17303.45,
    type: 'commercial', 
    color: '#F59E0B',
    status: 'scheduled',
    assignedTeam: 'Team A & C - Full Crew',
    address: '456 Oak Ave, Tampa FL 33602',
    notes: 'Large commercial project. All hands on deck. HVAC contractor arriving at 1 PM.',
    description: 'Commercial office space renovation - 5,000 sq ft',
  },
  { 
    id: 4, 
    startDate: 7, 
    endDate: 9,
    time: '08:00 AM - 05:00 PM', 
    duration: 90, 
    jobName: 'Deck Construction - Martinez Home', 
    amount: 9350.00,
    type: 'outdoor', 
    color: '#EF4444',
    status: 'scheduled',
    assignedTeam: 'Team B - Chris, David',
    address: '789 Pine St, Tampa FL 33603',
    notes: 'Final staining and sealing. Weather must be dry.',
    description: 'Complete deck staining and sealing project',
  },
  { 
    id: 5, 
    startDate: 12, 
    endDate: 18,
    time: '08:00 AM - 05:00 PM', 
    duration: 150, 
    jobName: 'Bathroom Remodel - Davis Residence', 
    amount: 18575.29,
    type: 'plumbing', 
    color: '#3B82F6',
    status: 'scheduled',
    assignedTeam: 'Team A - Mike, Sarah',
    address: '321 Elm St, Orlando FL 32802',
    notes: 'Tile installation day. Plumber scheduled for morning prep.',
    description: 'Master bathroom remodel with new fixtures',
  },
  { 
    id: 6, 
    startDate: 19, 
    endDate: 22,
    time: '08:00 AM - 05:00 PM', 
    duration: 150, 
    jobName: 'Flooring Installation - Garcia Home', 
    amount: 8200.00,
    type: 'flooring', 
    color: '#10B981',
    status: 'scheduled',
    assignedTeam: 'Team C - Paul, Lisa',
    address: '555 Maple Dr, Orlando FL 32803',
    notes: 'Hardwood flooring throughout main level.',
    description: 'Hardwood flooring installation - 1,200 sq ft',
  },
  { 
    id: 7, 
    startDate: 23, 
    endDate: 25,
    time: '08:00 AM - 05:00 PM', 
    duration: 150, 
    jobName: 'HVAC Installation - Black Residence', 
    amount: 5910.00,
    type: 'hvac', 
    color: '#06B6D4',
    status: 'scheduled',
    assignedTeam: 'Team B - Chris, Tom',
    address: '888 Oak Lane, Tampa FL 33604',
    notes: 'New HVAC system installation. Electrician on-site.',
    description: 'Complete HVAC system replacement',
  },
  { 
    id: 8, 
    startDate: 20, 
    endDate: 25,
    time: '08:00 AM - 05:00 PM', 
    duration: 150, 
    jobName: 'Whole Home Remodel - Jacobsen Estate', 
    amount: 12950.00,
    type: 'renovation', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignedTeam: 'Team A, B, C - All Teams',
    address: '999 Estate Blvd, Orlando FL 32805',
    notes: 'Major renovation project. Multiple phases.',
    description: 'Comprehensive home renovation - Phase 1',
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
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid'>('calendar');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [hideWeekends, setHideWeekends] = useState(false);
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [showCallInitiation, setShowCallInitiation] = useState(false);
  const [callContact, setCallContact] = useState({ name: '', phone: '' });
  
  // Edit Event Modal State
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editEndDate, setEditEndDate] = useState(new Date());
  const [editStartTime, setEditStartTime] = useState(new Date());
  const [editEndTime, setEditEndTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [editProjectManager, setEditProjectManager] = useState('');
  const [editCrew, setEditCrew] = useState('');
  const [editCrewLeader, setEditCrewLeader] = useState('');
  const [editEventType, setEditEventType] = useState('');
  const [textReminderEnabled, setTextReminderEnabled] = useState(false);
  const [emailReminderEnabled, setEmailReminderEnabled] = useState(false);
  const [showNotifyCustomer, setShowNotifyCustomer] = useState(false);
  const [notifyViaSMS, setNotifyViaSMS] = useState(false);
  const [notifyViaEmail, setNotifyViaEmail] = useState(false);

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
    return jobEvents.filter(job => date >= job.startDate && date <= job.endDate);
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

  const handleCall = () => {
    if (selectedJob?.customer && selectedJob?.customerPhone) {
      setCallContact({ 
        name: selectedJob.customer, 
        phone: selectedJob.customerPhone 
      });
      setShowCallInitiation(true);
    }
  };

  const handleToggleActionMenu = (item: string) => {
    setExpandedActionItem(expandedActionItem === item ? null : item);
  };

  const handleOpenEditEvent = () => {
    if (selectedJob) {
      // Close job details modal first
      Animated.timing(jobDetailsTranslateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowJobDetails(false);
        
        // Then open edit event modal
        // Parse dates from the job
        const startDateParts = selectedJob.jobInfo.startDate.split(' ');
        const endDateParts = selectedJob.jobInfo.endDate.split(' ');
        
        setEditStartDate(new Date(selectedJob.jobInfo.startDate));
        setEditEndDate(new Date(selectedJob.jobInfo.endDate));
        setEditStartTime(new Date());
        setEditEndTime(new Date());
        setEditProjectManager(selectedJob.jobInfo.projectManager);
        setEditCrew(selectedJob.assignedTeam);
        setEditCrewLeader(selectedJob.jobInfo.crewLeader);
        setEditEventType(selectedJob.type);
        
        setShowEditEventModal(true);
      });
    }
  };

  const handleCloseEditEvent = () => {
    setShowEditEventModal(false);
    setShowNotifyCustomer(false);
    setNotifyViaSMS(false);
    setNotifyViaEmail(false);
  };

  const handleDateTimeChange = () => {
    // Show notify customer section if date or time changed
    setShowNotifyCustomer(true);
  };

  const handleSaveEvent = () => {
    console.log('Saving event changes...');
    // Here you would save the changes
    handleCloseEditEvent();
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
              style={[styles.viewToggle, viewMode === 'grid' && styles.viewToggleActive]}
              onPress={() => setViewMode('grid')}
            >
              <Grid size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewToggle, viewMode === 'calendar' && styles.viewToggleActive]}
              onPress={() => setViewMode('calendar')}
            >
              <Calendar size={18} color="#FFFFFF" />
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
        {viewMode === 'grid' && (
          <TouchableOpacity 
            style={[styles.weekendToggle, hideWeekends && styles.weekendToggleActive]}
            onPress={() => setHideWeekends(!hideWeekends)}
          >
            <Text style={[styles.weekendToggleText, hideWeekends && styles.weekendToggleTextActive]}>
              {hideWeekends ? 'Show Weekends' : 'Hide Weekends'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {viewMode === 'grid' ? (
        /* Grid Calendar View */
        <ScrollView 
          style={styles.gridContainer}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollBegin={handleScrollBeginDrag}
          onMomentumScrollEnd={handleScrollEndDrag}
          showsVerticalScrollIndicator={false}
        >
          {/* Week Headers */}
          <View style={styles.gridHeader}>
            {(hideWeekends 
              ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
              : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            ).map((day, index) => (
              <View key={day} style={styles.gridDayHeader}>
                <Text style={styles.gridDayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid with Jobs */}
          <View style={styles.gridCalendarWrapper}>
            {/* Generate weeks */}
            {(() => {
              const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
              const weeks: any[][] = [];
              let currentWeek: any[] = [];
              
              const daysPerWeek = hideWeekends ? 5 : 7;
              const startOffset = hideWeekends ? (startingDayOfWeek === 0 ? 0 : startingDayOfWeek - 1) : startingDayOfWeek;
              
              // Add empty cells for days before month starts
              for (let i = 0; i < startOffset; i++) {
                if (hideWeekends && (i === 5 || i === 6)) continue;
                currentWeek.push({ empty: true, index: i });
              }
              
              // Add all days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayOfWeek = date.getDay();
                
                // Skip weekends if hideWeekends is true
                if (hideWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
                  continue;
                }
                
                const dayJobs = getJobsForDate(day);
                currentWeek.push({ day, jobs: dayJobs, dayOfWeek });
                
                if (currentWeek.length === daysPerWeek) {
                  weeks.push(currentWeek);
                  currentWeek = [];
                }
              }
              
              // Fill last week with empty cells
              while (currentWeek.length > 0 && currentWeek.length < daysPerWeek) {
                currentWeek.push({ empty: true, index: currentWeek.length });
              }
              if (currentWeek.length > 0) {
                weeks.push(currentWeek);
              }
              
              return weeks.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.gridWeekRow}>
                  {week.map((cell, cellIndex) => {
                    if (cell.empty) {
                      return <View key={`empty-${cell.index}`} style={styles.gridDayCell} />;
                    }
                    
                    const isToday = isCurrentMonth && cell.day === today.getDate();
                    
                    return (
                      <View key={`day-${cell.day}`} style={[styles.gridDayCell, isToday && styles.gridDayCellToday]}>
                        <Text style={[styles.gridDayNumber, isToday && styles.gridDayNumberToday]}>
                          {cell.day}
                        </Text>
                        
                        {/* Jobs for this day */}
                        <View style={styles.gridDayJobs}>
                          {cell.jobs.slice(0, 3).map((job: any, idx: number) => {
                            // Check if this is the start day of the job
                            const isStartDay = job.startDate === cell.day;
                            const isEndDay = job.endDate === cell.day;
                            
                            return (
                              <TouchableOpacity
                                key={job.id}
                                style={[
                                  styles.gridJobBlock, 
                                  { backgroundColor: job.color },
                                  !isStartDay && styles.gridJobBlockContinued,
                                  !isEndDay && styles.gridJobBlockContinues
                                ]}
                                onPress={() => handleJobPress(job)}
                              >
                                {isStartDay && (
                                  <>
                                    <Text style={styles.gridJobTime} numberOfLines={1}>
                                      {job.time.split('-')[0].trim()}
                                    </Text>
                                    <Text style={styles.gridJobName} numberOfLines={2}>
                                      {job.jobName}
                                    </Text>
                                    {job.amount && (
                                      <Text style={styles.gridJobAmount} numberOfLines={1}>
                                        ${job.amount.toLocaleString()}
                                      </Text>
                                    )}
                                  </>
                                )}
                                {!isStartDay && (
                                  <Text style={styles.gridJobContinued} numberOfLines={1}>
                                    ⟶ {job.jobName.split('-')[0].trim()}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                          {cell.jobs.length > 3 && (
                            <View style={styles.gridJobMore}>
                              <Text style={styles.gridJobMoreText}>
                                +{cell.jobs.length - 3} more
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ));
            })()}
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : viewMode === 'calendar' ? (
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
                    <View style={styles.statusSectionTop}>
                      <Text style={styles.statusLabel}>Status</Text>
                      <TouchableOpacity style={[styles.statusDropdown, { backgroundColor: selectedJob.color }]}>
                        <Text style={styles.statusDropdownText}>{getStatusLabel(selectedJob.status)}</Text>
                        <ChevronDown size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    {/* Job Site Address with Actions */}
                    <View style={styles.addressSection}>
                      <View style={styles.addressHeaderRow}>
                        <MapPin size={20} color="#EF4444" />
                        <Text style={styles.addressLabelText}>Job Site</Text>
                      </View>
                      <Text style={styles.addressText}>{selectedJob.jobAddress}</Text>
                      <View style={styles.addressButtonsRow}>
                        <TouchableOpacity 
                          style={styles.navigateButton}
                          onPress={() => handleGPSNavigation(selectedJob.jobAddress)}
                        >
                          <Navigation size={16} color="#FFFFFF" />
                          <Text style={styles.navigateButtonText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.copyAddressButton}
                          onPress={() => handleCopyAddress(selectedJob.jobAddress)}
                        >
                          <Copy size={16} color="#6B7280" />
                          <Text style={styles.copyAddressButtonText}>Copy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Edit Event Button */}
                    <View style={styles.editEventSection}>
                      <TouchableOpacity 
                        style={styles.editEventButton}
                        onPress={handleOpenEditEvent}
                      >
                        <Edit size={20} color="#FFFFFF" />
                        <Text style={styles.editEventButtonText}>Edit Event</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Customer Information */}
                    {selectedJob.customer && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Customer Information</Text>
                        
                        {/* Email */}
                        <View style={styles.contactItem}>
                          <Mail size={16} color="#6B7280" />
                          <Text style={styles.contactItemText}>{selectedJob.customer.email}</Text>
                          <TouchableOpacity 
                            style={styles.contactMenuButton}
                            onPress={() => handleToggleActionMenu('email')}
                          >
                            <MoreVertical size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        {expandedActionItem === 'email' && (
                          <View style={styles.inlineActionMenu}>
                            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <Mail size={16} color="#6366F1" />
                              <Text style={styles.inlineActionText}>Send Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <FileText size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>Copy Email</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Phone */}
                        <View style={styles.contactItem}>
                          <Phone size={16} color="#6B7280" />
                          <Text style={styles.contactItemText}>{selectedJob.customer.phone}</Text>
                          <TouchableOpacity 
                            style={styles.contactMenuButton}
                            onPress={() => handleToggleActionMenu('phone')}
                          >
                            <MoreVertical size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        {expandedActionItem === 'phone' && (
                          <View style={styles.inlineActionMenu}>
                            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <Phone size={16} color="#10B981" />
                              <Text style={styles.inlineActionText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <MessageSquare size={16} color="#3B82F6" />
                              <Text style={styles.inlineActionText}>Send Text</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <FileText size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>Copy Number</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <Edit size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>Edit Number</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Company */}
                        {selectedJob.customer.company && (
                          <>
                            <View style={styles.contactItem}>
                              <Building size={16} color="#6B7280" />
                              <Text style={styles.contactItemText}>{selectedJob.customer.company}</Text>
                              <TouchableOpacity 
                                style={styles.contactMenuButton}
                                onPress={() => handleToggleActionMenu('business')}
                              >
                                <MoreVertical size={16} color="#6B7280" />
                              </TouchableOpacity>
                            </View>
                            {expandedActionItem === 'business' && (
                              <View style={styles.inlineActionMenu}>
                                <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                                <TouchableOpacity style={styles.inlineActionItem}>
                                  <Edit size={16} color="#6B7280" />
                                  <Text style={styles.inlineActionText}>Edit Business</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.inlineActionItem}>
                                  <Eye size={16} color="#6B7280" />
                                  <Text style={styles.inlineActionText}>View Details</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}

                        {/* Address */}
                        <View style={styles.contactItem}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.contactItemText}>{selectedJob.customer.address}</Text>
                          <TouchableOpacity 
                            style={styles.contactMenuButton}
                            onPress={() => handleToggleActionMenu('address')}
                          >
                            <MoreVertical size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        {expandedActionItem === 'address' && (
                          <View style={styles.inlineActionMenu}>
                            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <FileText size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>Copy Address</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <MapPin size={16} color="#10B981" />
                              <Text style={styles.inlineActionText}>Navigate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <Edit size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>Edit Address</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Contact Name */}
                        <View style={styles.contactItem}>
                          <User size={16} color="#6B7280" />
                          <Text style={styles.contactItemText}>{selectedJob.customer.name}</Text>
                          <TouchableOpacity 
                            style={styles.contactMenuButton}
                            onPress={() => handleToggleActionMenu('contact')}
                          >
                            <MoreVertical size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        {expandedActionItem === 'contact' && (
                          <View style={styles.inlineActionMenu}>
                            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                            <TouchableOpacity style={styles.inlineActionItem}>
                              <Eye size={16} color="#6B7280" />
                              <Text style={styles.inlineActionText}>View Contact</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Quick Actions - Contact Customer */}
                    {selectedJob.customer && (
                      <View style={styles.quickActionsRow}>
                        <TouchableOpacity style={styles.quickActionCall} onPress={handleCall}>
                          <Phone size={20} color="#FFFFFF" />
                          <Text style={styles.quickActionText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionText2}>
                          <MessageSquare size={20} color="#FFFFFF" />
                          <Text style={styles.quickActionText}>Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionEmail}>
                          <Mail size={20} color="#FFFFFF" />
                          <Text style={styles.quickActionText}>Email</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Job Information */}
                    {selectedJob.jobInfo && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Job Information</Text>
                        
                        <TouchableOpacity style={styles.viewWorkOrderButton}>
                          <FileText size={20} color="#6366F1" />
                          <Text style={styles.viewWorkOrderText}>View Work Order</Text>
                        </TouchableOpacity>

                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Job Start Date</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.jobInfo.startDate}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Job End Date</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.jobInfo.endDate}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Salesperson</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.jobInfo.salesperson}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Project Manager</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.jobInfo.projectManager}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Crew Leader</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.jobInfo.crewLeader}</Text>
                        </View>
                      </View>
                    )}

                    {/* Deal Information */}
                    {selectedJob.dealInfo && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Deal Information</Text>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Pipeline</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.dealInfo.pipeline}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Stage</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.dealInfo.stage}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>In Stage</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.dealInfo.inStage}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Text style={styles.jobDetailLabel}>Job Source</Text>
                          <Text style={styles.jobDetailValue}>{selectedJob.dealInfo.source}</Text>
                        </View>
                      </View>
                    )}

                    {/* Drip Campaign */}
                    {selectedJob.dripCampaign && (
                      <View style={styles.modalSection}>
                        <View style={styles.dripCampaignHeader}>
                          <Text style={styles.dripCampaignLabel}>Drip Campaign</Text>
                          <View style={styles.dripRemainingBadge}>
                            <Zap size={16} color="#10B981" />
                            <Text style={styles.dripRemainingText}>{selectedJob.dripCampaign.remaining} remaining</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* View Deal Command Center Button */}
                    <View style={styles.commandCenterSection}>
                      <TouchableOpacity style={styles.commandCenterButton}>
                        <Zap size={20} color="#FFFFFF" />
                        <Text style={styles.commandCenterText}>View Deal Command Center</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Financial Details */}
                    {selectedJob.financial && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Financial Details</Text>
                        <View style={styles.financialRow}>
                          <Text style={styles.financialLabel}>Contract Value</Text>
                          <Text style={styles.financialValueLarge}>${selectedJob.financial.contractValue.toLocaleString()}</Text>
                        </View>
                        <View style={styles.financialRow}>
                          <Text style={styles.financialLabel}>Paid to Date</Text>
                          <Text style={styles.financialValue}>${selectedJob.financial.paidToDate.toLocaleString()}</Text>
                        </View>
                        <View style={styles.financialRow}>
                          <Text style={styles.financialLabel}>Balance Due</Text>
                          <Text style={styles.financialValue}>${selectedJob.financial.balanceDue.toLocaleString()}</Text>
                        </View>
                        {selectedJob.financial.changeOrderValue > 0 && (
                          <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Change Order Value</Text>
                            <Text style={styles.financialValue}>+${selectedJob.financial.changeOrderValue.toLocaleString()}</Text>
                          </View>
                        )}
                        
                        <View style={styles.financialButtonsRow}>
                          <TouchableOpacity style={styles.financialButton}>
                            <DollarSign size={18} color="#6366F1" />
                            <Text style={styles.financialButtonText}>View Invoice</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.financialButton}>
                            <FileText size={18} color="#6366F1" />
                            <Text style={styles.financialButtonText}>View Proposal</Text>
                          </TouchableOpacity>
                        </View>
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

      {/* Edit Event Modal */}
      <Modal
        visible={showEditEventModal}
        transparent={false}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseEditEvent}
      >
        <SafeAreaView style={styles.editEventModalContainer}>
              {/* Modal Header */}
              <View style={styles.editEventHeader}>
                <TouchableOpacity 
                  onPress={handleCloseEditEvent}
                  style={styles.closeButton}
                >
                  <X size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.editEventTitle}>Edit Event</Text>
                <TouchableOpacity 
                  onPress={handleSaveEvent}
                  style={styles.saveButton}
                >
                  <Check size={24} color="#10B981" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.editEventScrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Date & Time Section */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Date & Time</Text>
                  
                  {/* Start Date */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>Start Date</Text>
                    <TouchableOpacity 
                      style={styles.editFieldButton}
                      onPress={() => {
                        setShowStartDatePicker(true);
                        handleDateTimeChange();
                      }}
                    >
                      <Calendar size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editStartDate.toLocaleDateString()}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* End Date */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>End Date</Text>
                    <TouchableOpacity 
                      style={styles.editFieldButton}
                      onPress={() => {
                        setShowEndDatePicker(true);
                        handleDateTimeChange();
                      }}
                    >
                      <Calendar size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editEndDate.toLocaleDateString()}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Start Time */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>Start Time</Text>
                    <TouchableOpacity 
                      style={styles.editFieldButton}
                      onPress={() => {
                        setShowStartTimePicker(true);
                        handleDateTimeChange();
                      }}
                    >
                      <Clock size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* End Time */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>End Time</Text>
                    <TouchableOpacity 
                      style={styles.editFieldButton}
                      onPress={() => {
                        setShowEndTimePicker(true);
                        handleDateTimeChange();
                      }}
                    >
                      <Clock size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Team Section */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Team</Text>
                  
                  {/* Project Manager */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>Project Manager</Text>
                    <TouchableOpacity style={styles.editFieldButton}>
                      <User size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editProjectManager}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Crew */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>Crew</Text>
                    <TouchableOpacity style={styles.editFieldButton}>
                      <Users size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editCrew}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Crew Leader */}
                  <View style={styles.editField}>
                    <Text style={styles.editFieldLabel}>Crew Leader</Text>
                    <TouchableOpacity style={styles.editFieldButton}>
                      <User size={18} color="#6366F1" />
                      <Text style={styles.editFieldValue}>{editCrewLeader}</Text>
                      <ChevronDown size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Event Type Section */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Event Type</Text>
                  <View style={styles.eventTypeOptions}>
                    {['Painting', 'Drywall', 'Pressure Wash', 'Roofing', 'Renovation'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.eventTypeChip,
                          editEventType.toLowerCase() === type.toLowerCase() && styles.eventTypeChipActive
                        ]}
                        onPress={() => setEditEventType(type.toLowerCase())}
                      >
                        <Text style={[
                          styles.eventTypeChipText,
                          editEventType.toLowerCase() === type.toLowerCase() && styles.eventTypeChipTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Reminders Section */}
                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Reminders</Text>
                  
                  <View style={styles.reminderToggle}>
                    <View style={styles.reminderToggleLeft}>
                      <Bell size={20} color="#6366F1" />
                      <Text style={styles.reminderToggleLabel}>Text Reminder</Text>
                    </View>
                    <Switch
                      value={textReminderEnabled}
                      onValueChange={setTextReminderEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                      thumbColor={textReminderEnabled ? '#3B82F6' : '#F3F4F6'}
                    />
                  </View>

                  <View style={styles.reminderToggle}>
                    <View style={styles.reminderToggleLeft}>
                      <Mail size={20} color="#6366F1" />
                      <Text style={styles.reminderToggleLabel}>Email Reminder</Text>
                    </View>
                    <Switch
                      value={emailReminderEnabled}
                      onValueChange={setEmailReminderEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                      thumbColor={emailReminderEnabled ? '#3B82F6' : '#F3F4F6'}
                    />
                  </View>
                </View>

                {/* Notify Customer Section */}
                {showNotifyCustomer && (
                  <View style={styles.notifyCustomerSection}>
                    <Text style={styles.notifyCustomerTitle}>Notify Customer of Changes?</Text>
                    <Text style={styles.notifyCustomerSubtitle}>Date or time has changed</Text>
                    
                    <TouchableOpacity 
                      style={styles.notifyOption}
                      onPress={() => setNotifyViaSMS(!notifyViaSMS)}
                    >
                      <View style={[styles.checkbox, notifyViaSMS && styles.checkboxChecked]}>
                        {notifyViaSMS && <Check size={16} color="#FFFFFF" />}
                      </View>
                      <MessageSquare size={18} color="#3B82F6" />
                      <Text style={styles.notifyOptionText}>Notify via SMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.notifyOption}
                      onPress={() => setNotifyViaEmail(!notifyViaEmail)}
                    >
                      <View style={[styles.checkbox, notifyViaEmail && styles.checkboxChecked]}>
                        {notifyViaEmail && <Check size={16} color="#FFFFFF" />}
                      </View>
                      <Mail size={18} color="#8B5CF6" />
                      <Text style={styles.notifyOptionText}>Notify via Email</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Schedule Additional Stage Button */}
                <View style={styles.additionalStageSection}>
                  <TouchableOpacity style={styles.additionalStageButton}>
                    <Plus size={20} color="#6366F1" />
                    <Text style={styles.additionalStageButtonText}>Schedule Additional Stage</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
              </ScrollView>

              {/* Date/Time Pickers */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={editStartDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setEditStartDate(selectedDate);
                    }
                  }}
                />
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  value={editEndDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setEditEndDate(selectedDate);
                    }
                  }}
                />
              )}
              {showStartTimePicker && (
                <DateTimePicker
                  value={editStartTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowStartTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setEditStartTime(selectedTime);
                    }
                  }}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  value={editEndTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowEndTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setEditEndTime(selectedTime);
                    }
                  }}
                />
              )}
        </SafeAreaView>
      </Modal>

      {/* Call Initiation Modal */}
      <CallInitiationModal
        visible={showCallInitiation}
        onClose={() => setShowCallInitiation(false)}
        contactName={callContact.name}
        phoneNumber={callContact.phone}
      />
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
    flexWrap: 'wrap',
    gap: 8,
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
  // Grid View Styles
  gridContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  gridDayHeader: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDayHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  gridCalendarWrapper: {
    flex: 1,
  },
  gridWeekRow: {
    flexDirection: 'row',
    minHeight: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  gridDayCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: 4,
    backgroundColor: '#FFFFFF',
  },
  gridDayCellToday: {
    backgroundColor: '#F0F9FF',
  },
  gridDayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridDayNumberToday: {
    color: '#2563EB',
    fontWeight: '800',
  },
  gridDayJobs: {
    gap: 2,
  },
  gridJobBlock: {
    borderRadius: 4,
    padding: 6,
    marginBottom: 2,
    minHeight: 50,
  },
  gridJobTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gridJobName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 14,
  },
  gridJobMore: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    alignItems: 'center',
  },
  gridJobMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  gridJobBlockContinued: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: -4,
  },
  gridJobBlockContinues: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -4,
  },
  gridJobContinued: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gridJobAmount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  weekendToggle: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  weekendToggleActive: {
    backgroundColor: '#6366F1',
  },
  weekendToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  weekendToggleTextActive: {
    color: '#FFFFFF',
  },
  // Status Section at Top
  statusSectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusDropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Address Section with Navigate/Copy
  addressSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addressLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 22,
  },
  addressButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  navigateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  copyAddressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  copyAddressButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  // Edit Event Button Section
  editEventSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  editEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editEventButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Modal Section Styles
  modalSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  // Customer Information Styles (Command Center Style)
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  contactMenuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineActionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inlineActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 12,
  },
  inlineActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  // Quick Actions Row
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickActionCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionEmail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Job Information Styles
  viewWorkOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  viewWorkOrderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  jobDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  jobDetailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  jobDetailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  // Drip Campaign Styles
  dripCampaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dripCampaignLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  dripRemainingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dripRemainingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  // Command Center Button
  commandCenterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  commandCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  commandCenterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Financial Details Styles
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  financialLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  financialValueLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
  },
  financialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  financialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  financialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  // Edit Event Modal Styles
  editEventModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editEventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  saveButton: {
    padding: 4,
  },
  editEventScrollView: {
    flex: 1,
  },
  editSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  editField: {
    marginBottom: 16,
  },
  editFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  editFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  editFieldValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  eventTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  eventTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventTypeChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  eventTypeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  eventTypeChipTextActive: {
    color: '#FFFFFF',
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  reminderToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderToggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  notifyCustomerSection: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  notifyCustomerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  notifyCustomerSubtitle: {
    fontSize: 13,
    color: '#78350F',
    marginBottom: 16,
  },
  notifyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  notifyOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  additionalStageSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  additionalStageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
  },
  additionalStageButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
});

