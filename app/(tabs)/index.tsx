import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, Calendar, CheckSquare, ChevronDown, ChevronRight, Clock, Copy, DollarSign, FileText, Handshake, Mail, MapPin, MessageSquare, Navigation, Phone, Search, Target, TrendingUp, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [meetingDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [activeMenu, setActiveMenu] = useState('myDay'); // 'myDay', 'stats', or 'updates'
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showTaskStatusDropdown, setShowTaskStatusDropdown] = useState(null);
  const [nextItem, setNextItem] = useState<any>(null);
  const [currentGreeting, setCurrentGreeting] = useState<string>('');
  const [statusOptions] = useState([
    { value: 'scheduled', label: 'Scheduled', color: '#3B82F6' },
    { value: 'confirmed', label: 'Confirmed', color: '#10B981' },
    { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
    { value: 'completed', label: 'Completed', color: '#059669' },
    { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
    { value: 'no-show', label: 'No Show', color: '#6B7280' }
  ]);
  const [taskStatusOptions] = useState([
    { value: 'pending', label: 'Pending', color: '#6B7280' },
    { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
    { value: 'completed', label: 'Completed', color: '#10B981' },
    { value: 'cancelled', label: 'Cancelled', color: '#EF4444' }
  ]);

  // Dynamic greetings
  const greetings = [
    "Welcome back, Tanner",
    "Good to see you, Tanner",
    "Hey there, Tanner",
    "Hello again, Tanner",
    "Great to have you back, Tanner",
    "Ready to tackle the day, Tanner?",
    "Let's make it happen, Tanner",
    "Time to shine, Tanner"
  ];

  const getRandomGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };

  useEffect(() => {
    setCurrentGreeting(getRandomGreeting());
  }, []);

  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleAppointmentClose = () => {
    setShowNewAppointment(false);
  };

  // Today's appointments data
  const todaysAppointments = [
    { 
      id: 1, 
      time: '08:00 AM', 
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      duration: '1h',
      customer: 'Robert Johnson', 
      type: 'Consultation',
      address: '4214 SE 11 PL, Ocala FL 34471',
      phone: '(352) 895-5224',
      status: 'confirmed',
      statusColor: '#10B981',
      assignee: 'Chris Palmer',
      notes: 'Kitchen renovation consultation. Customer wants modern design with $50k budget.',
      details: 'Initial consultation for kitchen renovation project. Customer wants to discuss design options and budget.',
      appointmentNotes: 'Customer mentioned they have a budget of $50,000 and prefer modern design. They have two young children so need durable materials.',
      adminNotes: 'Customer seems very interested and ready to move forward. Follow up with design portfolio.',
      dealId: 'deal-001',
      photos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Kitchen before renovation' },
        { id: 2, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Current layout' }
      ]
    },
    { 
      id: 2, 
      time: '09:00 AM', 
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      duration: '1.5h',
      customer: 'Sherry Williams', 
      type: 'Estimate',
      address: '123 Main St, Orlando FL 32801',
      phone: '(555) 123-4567',
      status: 'scheduled',
      statusColor: '#3B82F6',
      assignee: 'Mike Wilson',
      notes: 'Bathroom remodel estimate. Customer wants walk-in shower and double vanity.',
      details: 'On-site estimate for bathroom remodel. Customer wants to modernize master bathroom.',
      appointmentNotes: 'Customer wants a walk-in shower and double vanity. Budget is flexible but wants high-quality fixtures.',
      adminNotes: 'Customer is very responsive and has been planning this remodel for months. Good lead.',
      dealId: 'deal-002',
      photos: [
        { id: 3, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Bathroom current state' }
      ]
    },
    { 
      id: 3, 
      time: '02:30 PM', 
      startTime: '02:30 PM',
      endTime: '04:30 PM',
      duration: '2h',
      customer: 'Billy Thompson', 
      type: 'Site Visit',
      address: '456 Oak Ave, Tampa FL 33602',
      phone: '(407) 987-6543',
      status: 'in-progress',
      statusColor: '#F59E0B',
      assignee: 'Sarah Johnson',
      notes: 'Commercial office renovation site visit. Need to assess condition and take measurements.',
      details: 'Site visit for commercial office renovation. Need to assess current condition and take measurements.',
      appointmentNotes: 'Commercial project with tight timeline. Need to coordinate with building management.',
      adminNotes: 'High-value project. Customer is very professional and organized.',
      dealId: 'deal-003',
      photos: [
        { id: 4, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Office exterior' },
        { id: 5, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Current layout' }
      ]
    }
  ];

  // Today's tasks data
  const todaysTasks = [
    {
      id: 1,
      time: '07:30 AM',
      title: 'Check equipment and materials',
      description: 'Verify all tools and materials are ready for the day',
      priority: 'high',
      status: 'pending',
      statusColor: '#6B7280',
      type: 'Follow Up',
      assignedBy: 'Tanner Mullen',
      dueDate: 'Today',
      actionType: 'call',
      actionLabel: 'Call'
    },
    {
      id: 2,
      time: '11:30 AM',
      title: 'Follow up with Johnson project',
      description: 'Call Robert Johnson to confirm tomorrow\'s appointment details',
      priority: 'medium',
      status: 'pending',
      statusColor: '#6B7280',
      type: 'Update',
      assignedBy: 'Chris Palmer',
      dueDate: 'Today',
      actionType: 'call',
      actionLabel: 'Call'
    },
    {
      id: 3,
      time: '12:00 PM',
      title: 'Lunch break',
      description: 'Take lunch break between appointments',
      priority: 'low',
      status: 'pending',
      statusColor: '#6B7280',
      type: 'Follow Up',
      assignedBy: 'System',
      dueDate: 'Today',
      actionType: 'none',
      actionLabel: ''
    },
    {
      id: 4,
      time: '05:00 PM',
      title: 'Update project notes',
      description: 'Document today\'s site visits and update project files',
      priority: 'high',
      status: 'pending',
      statusColor: '#6B7280',
      type: 'Update',
      assignedBy: 'Tanner Mullen',
      dueDate: 'Today',
      actionType: 'email',
      actionLabel: 'Email'
    }
  ];

  // Combine appointments and tasks in chronological order
  const getTodaysSchedule = () => {
    const allItems = [
      ...todaysAppointments.map(item => ({ ...item, itemType: 'appointment' })),
      ...todaysTasks.map(item => ({ ...item, itemType: 'task' }))
    ];
    
    return allItems.sort((a, b) => {
      const timeA = a.time.replace(/[^\d:]/g, '');
      const timeB = b.time.replace(/[^\d:]/g, '');
      return timeA.localeCompare(timeB);
    });
  };

  // Get the next upcoming item
  const getNextItem = () => {
    const schedule = getTodaysSchedule();
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    for (let item of schedule) {
      const itemTime = item.time.replace(/[^\d:]/g, '');
      const [hours, minutes] = itemTime.split(':').map(Number);
      const itemTimeMinutes = hours * 100 + minutes;
      
      if (itemTimeMinutes >= currentTime) {
        return item;
      }
    }
    
    return schedule.length > 0 ? schedule[0] : null;
  };

  // Update next item when component mounts or schedule changes
  useEffect(() => {
    setNextItem(getNextItem());
  }, []);

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Scheduled';
    }
  };

  const handleAppointmentPress = (appointment: any) => {
    setSelectedMeeting(appointment);
    setShowMeetingDetails(true);
    
    // Animate modal in from bottom
    Animated.timing(meetingDetailsTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseMeetingDetails = () => {
    Animated.timing(meetingDetailsTranslateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMeetingDetails(false);
      setSelectedMeeting(null);
    });
  };

  const handleViewCalendar = () => {
    router.push('/appointments');
  };

  // Gesture handlers for swipe to close
  const onMeetingDetailsGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: meetingDetailsTranslateY } }],
    { useNativeDriver: true }
  );

  const onMeetingDetailsHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      if (translationY > 100 || velocityY > 500) {
        handleCloseMeetingDetails();
      } else {
        Animated.spring(meetingDetailsTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Action handlers
  const handleNavigateToAddress = () => {
    console.log('Navigate to address:', selectedMeeting?.address);
  };

  const handleCopyAddress = () => {
    console.log('Copy address:', selectedMeeting?.address);
  };

  const handleCall = () => {
    console.log('Call:', selectedMeeting?.phone);
  };

  const handleText = () => {
    console.log('Text:', selectedMeeting?.phone);
  };

  const handleEmail = () => {
    console.log('Email customer');
  };

  const handleViewDeal = () => {
    console.log('View deal:', selectedMeeting?.dealId);
  };

  // Phone call functionality
  const handlePhoneCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    const phoneUrl = `tel:${cleanNumber}`;
    Linking.openURL(phoneUrl).catch(err => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  // GPS navigation functionality
  const handleGPSNavigation = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
    Linking.openURL(mapsUrl).catch(err => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  // Status change functionality
  const handleStatusChange = (appointmentId: any, newStatus: string) => {
    // Update the appointment status
    console.log('Status changed for appointment', appointmentId, 'to', newStatus);
    setShowStatusDropdown(null);
  };

  const handleTaskStatusChange = (taskId: any, newStatus: string) => {
    // Update the task status
    console.log('Task status changed for task', taskId, 'to', newStatus);
    setShowTaskStatusDropdown(null);
  };

  const toggleStatusDropdown = (appointmentId: any) => {
    setShowStatusDropdown(showStatusDropdown === appointmentId ? null : appointmentId);
  };

  const toggleTaskStatusDropdown = (taskId: any) => {
    setShowTaskStatusDropdown(showTaskStatusDropdown === taskId ? null : taskId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Row */}
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>{currentGreeting}</Text>
        </View>

        {/* Menu Toggle in Purple Header */}
        <View style={styles.headerMenuToggle}>
          <TouchableOpacity 
            style={[styles.headerMenuButton, activeMenu === 'myDay' && styles.headerActiveMenuButton]}
            onPress={() => setActiveMenu('myDay')}
          >
            <Text style={[styles.headerMenuButtonText, activeMenu === 'myDay' && styles.headerActiveMenuButtonText]}>My Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerMenuButton, activeMenu === 'stats' && styles.headerActiveMenuButton]}
            onPress={() => setActiveMenu('stats')}
          >
            <Text style={[styles.headerMenuButtonText, activeMenu === 'stats' && styles.headerActiveMenuButtonText]}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerMenuButton, activeMenu === 'updates' && styles.headerActiveMenuButton]}
            onPress={() => setActiveMenu('updates')}
          >
            <Text style={[styles.headerMenuButtonText, activeMenu === 'updates' && styles.headerActiveMenuButtonText]}>Updates</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>


      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsTransparent(true)}
        onScrollEndDrag={() => setIsTransparent(false)}
        onMomentumScrollBegin={() => setIsTransparent(true)}
        onMomentumScrollEnd={() => setIsTransparent(false)}
      >
        <View style={styles.agendaSection}>
          {activeMenu === 'myDay' ? (
            <>
              {/* Next Item Highlight */}
              {nextItem && (
                <View style={styles.nextItemHighlight}>
                  <View style={styles.nextItemHeader}>
                    <View style={styles.nextItemTimeSection}>
                      <View style={styles.nextItemIconContainer}>
                        {nextItem.itemType === 'appointment' ? (
                          <Clock size={20} color="#6366F1" />
                        ) : (
                          <CheckSquare size={20} color="#8B5CF6" />
                        )}
                      </View>
                      <View style={styles.nextItemTimeInfo}>
                        <Text style={styles.nextItemTimeText}>{nextItem.time}</Text>
                      </View>
                    </View>
                    <View style={styles.nextItemStatusBadge}>
                      <Text style={styles.nextItemStatusText}>Next Up</Text>
                    </View>
                  </View>

                  <View style={styles.nextItemContent}>
                    <Text style={styles.nextItemTitle}>
                      {nextItem.itemType === 'appointment' ? nextItem.customer : nextItem.title}
                    </Text>
                    <Text style={styles.nextItemSubtitle}>
                      {nextItem.itemType === 'appointment' ? nextItem.type : nextItem.type}
                    </Text>
                    
                    {nextItem.itemType === 'appointment' && (
                      <View style={styles.nextItemDetails}>
                        <TouchableOpacity 
                          style={styles.nextItemDetailRow}
                          onPress={() => handleGPSNavigation(nextItem.address)}
                        >
                          <View style={styles.nextItemDetailIconContainer}>
                            <MapPin size={16} color="#EF4444" />
                          </View>
                          <Text style={styles.nextItemDetailText} numberOfLines={1}>{nextItem.address}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.nextItemDetailRow}
                          onPress={() => handlePhoneCall(nextItem.phone)}
                        >
                          <View style={styles.nextItemDetailIconContainer}>
                            <Phone size={16} color="#10B981" />
                          </View>
                          <Text style={styles.nextItemDetailText}>{nextItem.phone}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.nextItemViewDetailsButton}
                      onPress={() => nextItem.itemType === 'appointment' ? handleAppointmentPress(nextItem) : null}
                    >
                      <Text style={styles.nextItemViewDetailsButtonText}>View Details</Text>
                      <ChevronRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {getTodaysSchedule().length === 0 ? (
                <View style={styles.emptyState}>
                  <Calendar size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateTitle}>No items today</Text>
                  <Text style={styles.emptyStateText}>You're all caught up! Enjoy your free time.</Text>
                </View>
              ) : (
                <View style={styles.scheduleList}>
                  {getTodaysSchedule().map((item, index) => (
                    <View key={`${item.itemType}-${item.id}`} style={styles.scheduleItem}>
                        {item.itemType === 'appointment' ? (
                          <View style={styles.appointmentCard}>
                            <View style={styles.appointmentHeader}>
                              <View style={styles.appointmentTimeSection}>
                                <View style={styles.appointmentIconContainer}>
                                  <Clock size={20} color="#6366F1" />
                                </View>
                                <View style={styles.appointmentTimeInfo}>
                                  <Text style={styles.appointmentTimeText}>{item.itemType === 'appointment' ? (item as any).startTime : item.time}</Text>
                                </View>
                              </View>
                              <TouchableOpacity 
                                style={[styles.appointmentStatusBadge, { backgroundColor: item.statusColor }]}
                                onPress={() => toggleStatusDropdown(item.id)}
                              >
                                <Text style={styles.appointmentStatusText}>{getStatusText(item.status)}</Text>
                                <ChevronDown size={12} color="#FFFFFF" />
                              </TouchableOpacity>
                              
                              {showStatusDropdown === item.id && (
                                <View style={styles.statusDropdown}>
                                  {statusOptions.map((option) => (
                                    <TouchableOpacity
                                      key={option.value}
                                      style={styles.statusOption}
                                      onPress={() => handleStatusChange(item.id, option.value)}
                                    >
                                      <View style={[styles.statusOptionColor, { backgroundColor: option.color }]} />
                                      <Text style={styles.statusOptionText}>{option.label}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              )}
                            </View>

                            <View style={styles.appointmentContent}>
                              <Text style={styles.customerName}>{item.itemType === 'appointment' ? (item as any).customer : (item as any).title}</Text>
                              <Text style={styles.appointmentType}>{item.itemType === 'appointment' ? item.type : item.type}</Text>
                              
                              <View style={styles.appointmentDetails}>
                                {item.itemType === 'appointment' && (
                                  <>
                                    <TouchableOpacity 
                                      style={styles.detailRow}
                                      onPress={() => handleGPSNavigation((item as any).address)}
                                    >
                                      <MapPin size={16} color="#EF4444" />
                                      <Text style={[styles.detailText, styles.clickableText]} numberOfLines={1}>{(item as any).address}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                      style={styles.detailRow}
                                      onPress={() => handlePhoneCall((item as any).phone)}
                                    >
                                      <Phone size={16} color="#10B981" />
                                      <Text style={[styles.detailText, styles.clickableText]}>{(item as any).phone}</Text>
                                    </TouchableOpacity>
                                  </>
                                )}
                              </View>
                              
                              <TouchableOpacity 
                                style={styles.viewDetailsButton}
                                onPress={() => handleAppointmentPress(item)}
                              >
                                <Text style={styles.viewDetailsButtonText}>View Details</Text>
                                <ChevronRight size={16} color="#6366F1" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.taskCard}>
                            <View style={styles.taskHeader}>
                              <View style={styles.taskTimeSection}>
                                <View style={styles.taskIconContainer}>
                                  <CheckSquare size={20} color="#8B5CF6" />
                                </View>
                                <View style={styles.taskTimeInfo}>
                                  <Text style={styles.taskTimeText}>{item.time}</Text>
                                </View>
                              </View>
                              <TouchableOpacity 
                                style={[styles.taskStatusBadge, { backgroundColor: item.statusColor || '#6B7280' }]}
                                onPress={() => toggleTaskStatusDropdown(item.id)}
                              >
                                <Text style={styles.taskStatusText}>{item.status || 'Pending'}</Text>
                                <ChevronDown size={12} color="#FFFFFF" />
                              </TouchableOpacity>
                              
                              {showTaskStatusDropdown === item.id && (
                                <View style={styles.taskStatusDropdown}>
                                  {taskStatusOptions.map((option) => (
                                    <TouchableOpacity
                                      key={option.value}
                                      style={styles.taskStatusOption}
                                      onPress={() => handleTaskStatusChange(item.id, option.value)}
                                    >
                                      <View style={[styles.taskStatusOptionColor, { backgroundColor: option.color }]} />
                                      <Text style={styles.taskStatusOptionText}>{option.label}</Text>
                                    </TouchableOpacity>
            ))}
          </View>
                              )}
        </View>

                            <View style={styles.taskContent}>
                              <Text style={styles.taskTitle}>{item.itemType === 'task' ? (item as any).title : (item as any).customer}</Text>
                              <Text style={styles.taskDescription}>{item.itemType === 'task' ? (item as any).description : item.type}</Text>
                              
                              
                              <TouchableOpacity style={styles.taskActionButton}>
                                <Text style={styles.taskActionText}>View Details</Text>
                                <ChevronRight size={16} color="#8B5CF6" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : activeMenu === 'stats' ? (
            <View style={styles.statsContent}>
              {/* Daily Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#ECFDF5' }]}>
                    <DollarSign size={24} color="#059669" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>$12,500</Text>
                    <Text style={styles.statLabel}>Sales Today</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp size={14} color="#059669" />
                      <Text style={styles.statTrendText}>+$2,300 from yesterday</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#EEF2FF' }]}>
                    <Target size={24} color="#6366F1" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>8</Text>
                    <Text style={styles.statLabel}>New Leads Today</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp size={14} color="#6366F1" />
                      <Text style={styles.statTrendText}>+3 from yesterday</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#F3E8FF' }]}>
                    <FileText size={24} color="#8B5CF6" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>5</Text>
                    <Text style={styles.statLabel}>Estimates Sent</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp size={14} color="#8B5CF6" />
                      <Text style={styles.statTrendText}>+2 from yesterday</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                    <Calendar size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Appointments Set</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp size={14} color="#F59E0B" />
                      <Text style={styles.statTrendText}>+4 from yesterday</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Performance Metrics */}
              <View style={styles.performanceCard}>
                <Text style={styles.performanceTitle}>Performance Breakdown</Text>
                
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Conversion Rate</Text>
                  <View style={styles.metricValueContainer}>
                    <View style={[styles.metricBar, { width: '42%', backgroundColor: '#10B981' }]} />
                    <Text style={styles.metricValue}>42%</Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Response Time</Text>
                  <View style={styles.metricValueContainer}>
                    <View style={[styles.metricBar, { width: '80%', backgroundColor: '#3B82F6' }]} />
                    <Text style={styles.metricValue}>2.3 hrs</Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Customer Satisfaction</Text>
                  <View style={styles.metricValueContainer}>
                    <View style={[styles.metricBar, { width: '95%', backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.metricValue}>95%</Text>
                  </View>
                </View>
              </View>

              {/* Pipeline Overview */}
              <View style={styles.pipelineCard}>
                <Text style={styles.pipelineTitle}>Pipeline Status</Text>
                <View style={styles.pipelineStats}>
                  <View style={styles.pipelineStat}>
                    <Text style={styles.pipelineValue}>23</Text>
                    <Text style={styles.pipelineLabel}>Active Deals</Text>
                  </View>
                  <View style={styles.pipelineStat}>
                    <Text style={styles.pipelineValue}>$125k</Text>
                    <Text style={styles.pipelineLabel}>Total Value</Text>
                  </View>
                  <View style={styles.pipelineStat}>
                    <Text style={styles.pipelineValue}>$5.4k</Text>
                    <Text style={styles.pipelineLabel}>Avg Deal</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.updatesContent}>
              <Text style={styles.updatesHeader}>Recent Activity</Text>
              
              {/* Update Cards */}
              <View style={styles.updateCard}>
                <View style={styles.updateIconContainer}>
                  <Handshake size={20} color="#10B981" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>Joe Smith signed proposal #4232</Text>
                  <Text style={styles.updateValue}>$5,000</Text>
                  <Text style={styles.updateTime}>5 minutes ago</Text>
                </View>
                <View style={styles.updateActions}>
                  <TouchableOpacity style={styles.updateActionButton}>
                    <Calendar size={14} color="#6366F1" />
                    <Text style={styles.updateActionText}>Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.updateActionButton, styles.updateViewButton]}>
                    <Text style={styles.updateViewText}>View Deal</Text>
                    <ChevronRight size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.updateCard}>
                <View style={[styles.updateIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Target size={20} color="#6366F1" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>New lead! Sam Smith from Facebook</Text>
                  <Text style={styles.updateMeta}>Kitchen Renovation • $35k budget</Text>
                  <Text style={styles.updateTime}>12 minutes ago</Text>
                </View>
                <View style={styles.updateActions}>
                  <TouchableOpacity style={[styles.updateActionButton, styles.callNowButton]}>
                    <Phone size={14} color="#FFFFFF" />
                    <Text style={styles.callNowText}>Call Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.updateActionButton, styles.updateViewButton]}>
                    <Text style={styles.updateViewText}>View Deal</Text>
                    <ChevronRight size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.updateCard}>
                <View style={[styles.updateIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <FileText size={20} color="#8B5CF6" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>Estimate viewed by Michael Johnson</Text>
                  <Text style={styles.updateMeta}>Basement Finishing • Viewed 3 times</Text>
                  <Text style={styles.updateTime}>1 hour ago</Text>
                </View>
                <View style={styles.updateActions}>
                  <TouchableOpacity style={[styles.updateActionButton, styles.updateViewButton]}>
                    <Text style={styles.updateViewText}>View Deal</Text>
                    <ChevronRight size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.updateCard}>
                <View style={[styles.updateIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Mail size={20} color="#F59E0B" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>Email reply from Lisa Anderson</Text>
                  <Text style={styles.updateMeta}>"Ready to move forward!"</Text>
                  <Text style={styles.updateTime}>2 hours ago</Text>
                </View>
                <View style={styles.updateActions}>
                  <TouchableOpacity style={[styles.updateActionButton, styles.updateViewButton]}>
                    <Text style={styles.updateViewText}>View Thread</Text>
                    <ChevronRight size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <FloatingActionMenu onNewAppointment={handleNewAppointment} />
      
      {/* New Appointment Modal */}
      <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={handleAppointmentClose}
      />

      {/* Meeting Details Modal */}
      <Modal
        visible={showMeetingDetails}
        transparent
        animationType="none"
        onRequestClose={handleCloseMeetingDetails}
      >
        <View style={styles.fullScreenModalOverlay}>
          <PanGestureHandler
            onGestureEvent={onMeetingDetailsGestureEvent}
            onHandlerStateChange={onMeetingDetailsHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.fullScreenModalContainer,
                {
                  transform: [{ translateY: meetingDetailsTranslateY }],
                },
              ]}
            >
              {selectedMeeting && (
                <View style={styles.fullScreenContent}>
                  {/* Header with Close Button */}
                  <View style={styles.modalHeader}>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={handleCloseMeetingDetails}
                    >
                      <X size={24} color="#6B7280" />
            </TouchableOpacity>
                    <Text style={styles.modalHeaderTitle}>Appointment Details</Text>
                    <View style={styles.headerSpacer} />
              </View>

                  <ScrollView
                    style={styles.fullScreenScrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Status Section */}
                    <View style={styles.statusSection}>
                      <Text style={styles.statusSectionLabel}>Status</Text>
                      <TouchableOpacity 
                        style={[styles.clickableStatusBadge, { backgroundColor: selectedMeeting.statusColor }]}
                        onPress={() => toggleStatusDropdown(selectedMeeting.id)}
                      >
                        <Text style={styles.clickableStatusText}>{getStatusText(selectedMeeting.status)}</Text>
                        <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
                      
                      {showStatusDropdown === selectedMeeting.id && (
                        <View style={styles.statusDropdown}>
                          {statusOptions.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={styles.statusOption}
                              onPress={() => handleStatusChange(selectedMeeting.id, option.value)}
                            >
                              <View style={[styles.statusOptionColor, { backgroundColor: option.color }]} />
                              <Text style={styles.statusOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
              </View>
                      )}
                    </View>

                    {/* Prominent Address Section */}
                    <View style={styles.prominentAddressSection}>
                      <View style={styles.addressHeader}>
                        <MapPin size={20} color="#EF4444" />
                        <Text style={styles.addressLabel}>Location</Text>
                      </View>
                      <Text style={styles.prominentAddress}>{selectedMeeting.address}</Text>
                      <View style={styles.addressActions}>
                        <TouchableOpacity 
                          style={styles.navigationButton}
                          onPress={handleNavigateToAddress}
                        >
                          <Navigation size={16} color="#FFFFFF" />
                          <Text style={styles.navigationButtonText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.copyButton}
                          onPress={handleCopyAddress}
                        >
                          <Copy size={16} color="#6B7280" />
                          <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

                    {/* Primary Action Buttons */}
                    <View style={styles.primaryActionsSection}>
                      <TouchableOpacity style={styles.viewDealButton} onPress={handleViewDeal}>
                        <Handshake size={20} color="#FFFFFF" />
                        <Text style={styles.viewDealButtonText}>View Deal</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Communication Actions */}
                    <View style={styles.communicationActions}>
                      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                        <Phone size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.textButton} onPress={handleText}>
                        <MessageSquare size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Text</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
                        <Mail size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Email</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Appointment Information Cards */}
                    <View style={styles.appointmentInfoCard}>
                      <Text style={styles.cardTitle}>Appointment Information</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Type:</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.type}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Assignee:</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.assignee}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.customer}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>Today</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time:</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.time}</Text>
                      </View>
                    </View>

                    {/* Appointment Details */}
                    <View style={styles.appointmentInfoCard}>
                      <Text style={styles.cardTitle}>Appointment Details</Text>
                      <Text style={styles.appointmentDetailsText}>{selectedMeeting.details}</Text>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.notesSection}>
                      <Text style={styles.notesTitle}>Appointment Notes</Text>
                      <Text style={styles.notesText}>{selectedMeeting.appointmentNotes}</Text>
                    </View>

                    {selectedMeeting.adminNotes && (
                      <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>Admin Notes</Text>
                        <Text style={styles.adminNotesText}>{selectedMeeting.adminNotes}</Text>
                      </View>
                    )}

                    {/* Attachments */}
                    {selectedMeeting.photos && selectedMeeting.photos.length > 0 && (
                      <View style={styles.attachmentsSection}>
                        <Text style={styles.attachmentsTitle}>Attached Photos</Text>
                        <View style={styles.photosGrid}>
                          {selectedMeeting.photos.map((photo: any) => (
                            <View key={photo.id} style={styles.photoPlaceholder}>
                              <Text style={styles.photoText}>📷</Text>
                              <Text style={styles.photoCaption}>{photo.caption}</Text>
                            </View>
                          ))}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradientBackground: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pullOutIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 6,
  },
  pullOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  // Header Menu Toggle
  headerMenuToggle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  headerMenuButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerActiveMenuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerMenuButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerActiveMenuButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -8,
  },
  // Sticky Header
  stickyHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 1000,
  },
  agendaSection: {
    marginBottom: 120,
    paddingTop: 8,
  },
  // Menu Toggle
  menuToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  menuButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeMenuButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeMenuButtonText: {
    color: '#111827',
  },
  agendaHeader: {
    marginBottom: 20,
  },
  agendaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Next Item Highlight
  nextItemHighlight: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 24,
    padding: 0,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  nextItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextItemTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  nextItemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextItemTimeInfo: {
    gap: 4,
  },
  nextItemTimeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366F1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextItemStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  nextItemStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextItemContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  nextItemTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  nextItemSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    marginBottom: 16,
  },
  nextItemDetails: {
    gap: 12,
    marginBottom: 20,
  },
  nextItemDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextItemDetailText: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '500',
  },
  nextItemDetailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextItemViewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextItemViewDetailsButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Simple Schedule List
  scheduleList: {
    gap: 20,
  },
  scheduleItem: {
    marginBottom: 20,
  },
  appointmentsList: {
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  appointmentTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  appointmentTimeInfo: {
    gap: 4,
  },
  appointmentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentTimeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366F1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },
  appointmentStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Status Dropdown Styles
  statusDropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    minWidth: 140,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  statusOptionColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  // Clickable Text
  clickableText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  appointmentContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  appointmentType: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '700',
    marginBottom: 16,
  },
  appointmentDetails: {
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
  // World-Class Task Card Design
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    position: 'relative',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  taskTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  taskTimeInfo: {
    gap: 4,
  },
  taskTimeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B5CF6',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskType: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  // Task Status Badge and Dropdown
  taskStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },
  taskStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskStatusDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    minWidth: 140,
  },
  taskStatusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  taskStatusOptionColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskStatusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  taskContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 24,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  taskDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  taskActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  taskActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  // Updates Section
  updatesContent: {
    padding: 16,
    gap: 16,
  },
  // Overview Card
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  overviewChange: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
  // Lead Source Card
  leadSourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leadSourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leadSourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  leadSourceBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  leadSourceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  leadSourceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leadSourceStat: {
    alignItems: 'center',
  },
  leadSourceStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  leadSourceStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Insights Card
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  // Actions Card
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  updatesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Meeting Details Modal Styles
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
  // Status Section
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
    marginRight: 8,
  },
  // Prominent Address Section
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
  // Primary Actions
  primaryActionsSection: {
    marginBottom: 20,
  },
  viewDealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  viewDealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Communication Actions
  communicationActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    gap: 6,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    gap: 6,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Information Cards
  appointmentInfoCard: {
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
  },
  appointmentDetailsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // Notes Section
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
  adminNotesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  // Attachments
  attachmentsSection: {
    marginBottom: 20,
  },
  attachmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photoText: {
    fontSize: 24,
    marginBottom: 4,
  },
  photoCaption: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  // Stats Content Styles
  statsContent: {
    padding: 24,
    gap: 20,
  },
  statsGrid: {
    gap: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statTrendText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  metricRow: {
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricBar: {
    height: 10,
    borderRadius: 5,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  pipelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  pipelineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  pipelineStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pipelineStat: {
    alignItems: 'center',
  },
  pipelineValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 6,
  },
  pipelineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Updates Content Styles
  updatesHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  updateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  updateContent: {
    marginBottom: 16,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  updateValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
  },
  updateMeta: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  updateTime: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  updateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  updateActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  updateActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  callNowButton: {
    backgroundColor: '#10B981',
  },
  callNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  updateViewButton: {
    flex: 1,
    justifyContent: 'center',
  },
  updateViewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
});