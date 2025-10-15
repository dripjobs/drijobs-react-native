import CallInitiationModal from '@/components/CallInitiationModal';
import ContactPickerModal from '@/components/ContactPickerModal';
import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import NotificationModal from '@/components/NotificationModal';
import SendRequestModal from '@/components/SendRequestModal';
import StatCard from '@/components/StatCard';
import StatDetailModal from '@/components/StatDetailModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { useIsCrew } from '@/contexts/UserRoleContext';
import { appointmentRequestService } from '@/services/AppointmentRequestService';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, Building, Calendar, CheckSquare, ChevronDown, ChevronRight, Clock, Copy, DollarSign, Edit, Eye, FileText, Handshake, Lightbulb, Mail, MapPin, MessageSquare, MoreVertical, Navigation, Phone, Search, Target, TrendingUp, User, Users, X, Zap } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();
  const { setIsTransparent } = useTabBar();
  const isCrew = useIsCrew();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Redirect crew members to My Day
  useEffect(() => {
    if (isCrew) {
      router.replace('/my-day');
    }
  }, [isCrew]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [meetingDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [activeMenu, setActiveMenu] = useState('myDay'); // 'myDay', 'stats', 'updates', or 'jobs'
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showTaskStatusDropdown, setShowTaskStatusDropdown] = useState(null);
  const [nextItem, setNextItem] = useState<any>(null);
  const [currentGreeting, setCurrentGreeting] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [showStatDetail, setShowStatDetail] = useState<boolean>(false);
  const [selectedStatType, setSelectedStatType] = useState<'sales' | 'leads' | 'estimates' | 'appointments'>('sales');
  const [selectedStatTitle, setSelectedStatTitle] = useState<string>('');
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [unreadNotifications] = useState(6); // This would come from your notification service
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobDetailsTranslateY] = useState(new Animated.Value(screenHeight));
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showCallInitiation, setShowCallInitiation] = useState(false);
  const [callContact, setCallContact] = useState({ name: '', phone: '' });
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      time: '02:30 PM', 
      startTime: '02:30 PM',
      endTime: '03:30 PM',
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
  ]);
  const [tasks, setTasks] = useState([
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
      type: 'Personal',
      assignedBy: 'Self',
      dueDate: 'Today',
      actionType: 'reminder',
      actionLabel: 'Set Reminder'
    }
  ]);

  // Jobs data with start and end dates
  const [jobs] = useState([
    {
      id: 1,
      customer: {
        name: 'Sherry Williams',
        email: 'sherry.williams@email.com',
        phone: '(407) 555-0123',
        company: 'Williams Properties LLC',
        address: '1234 Oak Street, Orlando FL 32801',
      },
      projectType: 'Kitchen Renovation',
      startDate: new Date(), // Today
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      address: '1234 Oak Street, Orlando FL 32801',
      phone: '(407) 555-0123',
      projectManager: 'Chris Palmer',
      crew: 'Team A - Dan',
      value: '$45,000',
      progress: 0,
      status: 'starting',
      color: '#10B981',
      jobAddress: '1234 Oak Street, Orlando FL 32801',
      notes: 'Initial demo and prep work. Customer will be out of town.',
      jobInfo: {
        startDate: 'Oct 6, 2024',
        endDate: 'Oct 20, 2024',
        salesperson: 'Tom Henderson',
        projectManager: 'Chris Palmer',
        crewLeader: 'Dan Mitchell',
      },
      dealInfo: {
        pipeline: 'Jobs',
        stage: 'Scheduled',
        inStage: '1 day',
        source: 'Website Inquiry',
      },
      dripCampaign: {
        remaining: 3,
      },
      financial: {
        contractValue: 45000,
        paidToDate: 15000,
        balanceDue: 30000,
        changeOrderValue: 0,
      },
    },
    {
      id: 2,
      customer: 'Thompson Commercial',
      projectType: 'Office Renovation',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      address: '567 Business Blvd, Orlando FL 32803',
      phone: '(407) 555-0456',
      projectManager: 'Tanner Mullen',
      crew: 'Team B - Beau',
      value: '$75,000',
      progress: 35,
      status: 'in-progress',
      notes: 'On schedule. Electrical work completed, starting drywall.',
    },
    {
      id: 3,
      customer: 'Martinez Residence',
      projectType: 'Bathroom Remodel',
      startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      endDate: new Date(), // Today
      address: '890 Pine Ave, Orlando FL 32804',
      phone: '(407) 555-0789',
      projectManager: 'Mike Wilson',
      crew: 'Team C - Mitch',
      value: '$28,500',
      progress: 95,
      status: 'finishing',
      notes: 'Final walkthrough scheduled for 3 PM. Touch-ups completed.',
    },
    {
      id: 4,
      customer: 'Wilson Estate',
      projectType: 'Exterior Painting',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      address: '234 Sunset Drive, Winter Park FL 32789',
      phone: '(407) 555-0234',
      projectManager: 'Sarah Johnson',
      crew: 'Team D - Shemel',
      value: '$18,900',
      progress: 45,
      status: 'in-progress',
      notes: 'Weather permitting. Second coat application in progress.',
    },
    {
      id: 5,
      customer: 'Davis Property',
      projectType: 'Deck Construction',
      startDate: new Date(), // Today
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      address: '456 Lake View Court, Orlando FL 32805',
      phone: '(407) 555-0345',
      projectManager: 'Chris Palmer',
      crew: 'Team A - Dan',
      value: '$22,000',
      progress: 0,
      status: 'starting',
      notes: 'Materials delivered yesterday. Foundation prep today.',
    },
  ]);
  
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

  const getFormattedDate = () => {
    const date = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Add ordinal suffix
    const getOrdinalSuffix = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${dayName}, ${monthName} ${getOrdinalSuffix(day)} ${year}`;
  };

  useEffect(() => {
    setCurrentGreeting(getRandomGreeting());
  }, []);

  // AI Summary functionality
  const generateAISummary = async () => {
    setIsLoadingSummary(true);
    // Simulate API call
    setTimeout(() => {
      const summaries = [
        "Today's performance shows strong momentum with $12,500 in sales and 8 new leads. Your conversion rate is trending upward.",
        "Excellent day with 5 estimates sent and 12 appointments scheduled. Revenue is 23% above yesterday's pace.",
        "Outstanding results today: $12,500 in sales, 8 new leads, and 5 estimates sent. You're on track for a record week.",
        "Strong performance today with $12,500 in sales and 8 new leads. Your appointment booking rate is exceptional.",
        "Today's metrics show great progress: $12,500 in sales, 8 new leads, and 12 appointments set. Keep up the momentum!"
      ];
      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
      setAiSummary(randomSummary);
      setIsLoadingSummary(false);
    }, 1500);
  };

  useEffect(() => {
    if (activeMenu === 'stats' && !aiSummary) {
      generateAISummary();
    }
  }, [activeMenu]);

  // Mock data for stat details
  const salesData = [
    { id: '1', customerName: 'John Smith', detail1: '$5,200' },
    { id: '2', customerName: 'Sarah Johnson', detail1: '$3,800' },
    { id: '3', customerName: 'Mike Davis', detail1: '$2,100' },
    { id: '4', customerName: 'Emily Wilson', detail1: '$1,400' },
  ];

  const leadsData = [
    { id: '1', customerName: 'David Thompson', detail1: 'Facebook Ads' },
    { id: '2', customerName: 'Lisa Anderson', detail1: 'Google' },
    { id: '3', customerName: 'Robert Martinez', detail1: 'Referral' },
    { id: '4', customerName: 'Jennifer Taylor', detail1: 'Instagram' },
    { id: '5', customerName: 'William Brown', detail1: 'Website' },
    { id: '6', customerName: 'Susan Garcia', detail1: 'Facebook Ads' },
    { id: '7', customerName: 'James Miller', detail1: 'Referral' },
    { id: '8', customerName: 'Mary Wilson', detail1: 'Google' },
  ];

  const estimatesData = [
    { id: '1', customerName: 'Thomas Moore', detail1: '#1234', detail2: 'Sent' },
    { id: '2', customerName: 'Patricia Taylor', detail1: '#1235', detail2: 'Sent' },
    { id: '3', customerName: 'Richard Anderson', detail1: '#1236', detail2: 'Sent' },
    { id: '4', customerName: 'Barbara White', detail1: '#1237', detail2: 'Sent' },
    { id: '5', customerName: 'Charles Martin', detail1: '#1238', detail2: 'Sent' },
  ];

  const appointmentsData = [
    { id: '1', customerName: 'Daniel Lee', detail1: 'Today 2:30 PM', detail2: 'Site Visit' },
    { id: '2', customerName: 'Nancy Harris', detail1: 'Tomorrow 10:00 AM', detail2: 'Consultation' },
    { id: '3', customerName: 'Matthew Clark', detail1: 'Tomorrow 2:00 PM', detail2: 'Follow-up' },
    { id: '4', customerName: 'Betty Lewis', detail1: 'Wed 9:00 AM', detail2: 'Site Visit' },
    { id: '5', customerName: 'Donald Robinson', detail1: 'Wed 1:30 PM', detail2: 'Consultation' },
    { id: '6', customerName: 'Helen Walker', detail1: 'Thu 11:00 AM', detail2: 'Site Visit' },
    { id: '7', customerName: 'George Hall', detail1: 'Thu 3:00 PM', detail2: 'Follow-up' },
    { id: '8', customerName: 'Karen Allen', detail1: 'Fri 10:30 AM', detail2: 'Consultation' },
    { id: '9', customerName: 'Kenneth Young', detail1: 'Fri 2:30 PM', detail2: 'Site Visit' },
    { id: '10', customerName: 'Dorothy King', detail1: 'Sat 9:00 AM', detail2: 'Consultation' },
    { id: '11', customerName: 'Steven Wright', detail1: 'Sat 1:00 PM', detail2: 'Follow-up' },
    { id: '12', customerName: 'Carol Lopez', detail1: 'Mon 10:00 AM', detail2: 'Site Visit' },
  ];

  const getStatData = () => {
    switch (selectedStatType) {
      case 'sales':
        return salesData;
      case 'leads':
        return leadsData;
      case 'estimates':
        return estimatesData;
      case 'appointments':
        return appointmentsData;
      default:
        return [];
    }
  };

  const handleStatCardPress = (type: 'sales' | 'leads' | 'estimates' | 'appointments', title: string) => {
    setSelectedStatType(type);
    setSelectedStatTitle(title);
    setShowStatDetail(true);
  };

  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleAppointmentClose = () => {
    setShowNewAppointment(false);
  };

  const handleNewProposal = () => {
    setShowNewProposal(true);
  };

  const handleProposalClose = () => {
    setShowNewProposal(false);
  };

  const handleSendRequest = () => {
    setShowSendRequest(true);
  };

  const handleSendRequestClose = () => {
    setShowSendRequest(false);
  };

  const handleCreateLead = () => {
    setShowCreateLead(true);
  };

  const handleCreateLeadClose = () => {
    setShowCreateLead(false);
  };

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  const handleCreateJobClose = () => {
    setShowCreateJob(false);
  };

  // Today's appointments data
  const todaysAppointments = appointments;
  const todaysTasks = tasks;

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

  const handleTaskPress = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
    
    // Animate modal in from bottom
    Animated.timing(taskDetailsTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseTaskDetails = () => {
    Animated.timing(taskDetailsTranslateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowTaskDetails(false);
      setSelectedTask(null);
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

  // Gesture handlers for task details swipe to close
  const onTaskDetailsGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: taskDetailsTranslateY } }],
    { useNativeDriver: true }
  );

  const onTaskDetailsHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      if (translationY > 100 || velocityY > 500) {
        handleCloseTaskDetails();
      } else {
        Animated.spring(taskDetailsTranslateY, {
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

  const handleCall = () => {
    if (selectedMeeting?.customer && selectedMeeting?.phone) {
      setCallContact({ 
        name: selectedMeeting.customer, 
        phone: selectedMeeting.phone 
      });
      setShowCallInitiation(true);
    }
  };

  const handleOpenContactPicker = () => {
    setShowContactPicker(true);
  };

  const handleContactSelected = (contact: any) => {
    setCallContact({ name: contact.name, phone: contact.phone });
    setShowContactPicker(false);
    setShowCallInitiation(true);
  };

  const handleText = () => {
    if (selectedMeeting) {
      // Navigate to chat screen with customer data
      router.push({
        pathname: '/(tabs)/chat',
        params: { 
          customerId: selectedMeeting.id.toString(),
          customerName: selectedMeeting.customer,
          customerPhone: selectedMeeting.phone,
          composeMode: 'true' // Flag to indicate we want to compose a new message
        }
      });
    }
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

  // Job details modal handlers
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
      setExpandedActionItem(null);
    });
  };

  const handleToggleActionMenu = (item: string) => {
    setExpandedActionItem(expandedActionItem === item ? null : item);
  };

  const handleCopyAddress = (address: string) => {
    Alert.alert('Success', 'Address copied to clipboard');
  };

  // Status change functionality
  const handleStatusChange = (appointmentId: any, newStatus: string) => {
    // Update the appointment status
    const statusColorMap: { [key: string]: string } = {
      scheduled: '#3B82F6',
      confirmed: '#10B981',
      'in-progress': '#F59E0B',
      completed: '#059669',
      cancelled: '#EF4444',
      'no-show': '#6B7280'
    };
    
    setAppointments(prevAppointments => 
      prevAppointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus, statusColor: statusColorMap[newStatus] || '#6B7280' }
          : apt
      )
    );
    
    // Also update selectedMeeting if it's the same appointment
    if (selectedMeeting && selectedMeeting.id === appointmentId) {
      setSelectedMeeting(prev => ({
        ...prev,
        status: newStatus,
        statusColor: statusColorMap[newStatus] || '#6B7280'
      }));
    }
    
    setShowStatusDropdown(null);
  };

  const handleTaskStatusChange = (taskId: any, newStatus: string) => {
    // Update the task status
    const statusColorMap: { [key: string]: string } = {
      pending: '#6B7280',
      'in-progress': '#F59E0B',
      completed: '#10B981',
      cancelled: '#EF4444'
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, statusColor: statusColorMap[newStatus] || '#6B7280' }
          : task
      )
    );
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
      <DrawerMenu 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        pendingRequestsCount={appointmentRequestService.getPendingRequestsCount()}
      />
      
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
          
          <Text style={styles.headerDateText}>{getFormattedDate()}</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/search')}
            >
              <Search size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowNotificationModal(true)}
            >
              <Bell size={24} color="#FFFFFF" />
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </Text>
                </View>
              )}
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
            style={[styles.headerMenuButton, activeMenu === 'jobs' && styles.headerActiveMenuButton]}
            onPress={() => setActiveMenu('jobs')}
          >
            <Text style={[styles.headerMenuButtonText, activeMenu === 'jobs' && styles.headerActiveMenuButtonText]}>Jobs</Text>
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
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          if (currentScrollY > 50) {
            setShowFAB(false);
          } else {
            setShowFAB(true);
          }
          setLastScrollY(currentScrollY);
        }}
        scrollEventThrottle={16}
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
                      onPress={() => nextItem.itemType === 'appointment' ? handleAppointmentPress(nextItem) : handleTaskPress(nextItem)}
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
                          <View style={[
                            styles.appointmentCard, 
                            item.status === 'completed' && styles.completedCard
                          ]}>
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
                              <Text style={[
                                styles.customerName,
                                item.status === 'completed' && styles.completedText
                              ]}>{item.itemType === 'appointment' ? (item as any).customer : (item as any).title}</Text>
                              <Text style={[
                                styles.appointmentType,
                                item.status === 'completed' && styles.completedText
                              ]}>{item.itemType === 'appointment' ? item.type : item.type}</Text>
                              
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
                          <View style={[
                            styles.taskCard,
                            item.status === 'completed' && styles.completedCard
                          ]}>
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
                              <Text style={[
                                styles.taskTitle,
                                item.status === 'completed' && styles.completedText
                              ]}>{item.itemType === 'task' ? (item as any).title : (item as any).customer}</Text>
                              <Text style={[
                                styles.taskDescription,
                                item.status === 'completed' && styles.completedText
                              ]}>{item.itemType === 'task' ? (item as any).description : item.type}</Text>
                              
                              
                              <TouchableOpacity 
                                style={styles.taskActionButton}
                                onPress={() => handleTaskPress(item)}
                              >
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
              {/* AI Summary Box - Purple Gradient like Next Up */}
              <View style={styles.aiSummaryHighlight}>
                <View style={styles.aiSummaryHeader}>
                  <View style={styles.aiSummaryTimeSection}>
                    <View style={styles.aiSummaryIconContainer}>
                      <Lightbulb size={20} color="#6366F1" />
                    </View>
                    <View style={styles.aiSummaryTimeInfo}>
                      <Text style={styles.aiSummaryTimeText}>AI Insights</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.aiSummaryStatusBadge}
                    onPress={generateAISummary}
                    disabled={isLoadingSummary}
                  >
                    <Text style={styles.aiSummaryStatusText}>Refresh</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.aiSummaryContent}>
                  {isLoadingSummary ? (
                    <View style={styles.aiSummaryLoadingContainer}>
                      <View style={styles.aiSummaryLoadingDots}>
                        <View style={[styles.aiSummaryLoadingDot, { animationDelay: '0ms' }]} />
                        <View style={[styles.aiSummaryLoadingDot, { animationDelay: '150ms' }]} />
                        <View style={[styles.aiSummaryLoadingDot, { animationDelay: '300ms' }]} />
                      </View>
                      <Text style={styles.aiSummaryLoadingText}>Generating insights...</Text>
                    </View>
                  ) : (
                    <Text style={styles.aiSummaryText}>{aiSummary}</Text>
                  )}
                </View>
              </View>

              {/* Enhanced Stats Grid with Better Cards */}
              <View style={styles.statsGrid}>
                <View style={styles.statRow}>
                  <StatCard
                    title="Sales Today"
                    value="$12,500"
                    subtitle="Revenue generated"
                    icon={TrendingUp}
                    iconColor="#059669"
                    backgroundColor="#10B981"
                    trend={{ value: "+$2,300", isPositive: true }}
                    onPress={() => handleStatCardPress('sales', 'Sales Today')}
                  />
                  <StatCard
                    title="New Leads"
                    value="8"
                    subtitle="Potential customers"
                    icon={Users}
                    iconColor="#6366F1"
                    backgroundColor="#3B82F6"
                    trend={{ value: "+3", isPositive: true }}
                    onPress={() => handleStatCardPress('leads', 'New Leads')}
                  />
                </View>

                <View style={styles.statRow}>
                  <StatCard
                    title="Estimates Sent"
                    value="5"
                    subtitle="Proposals delivered"
                    icon={FileText}
                    iconColor="#8B5CF6"
                    backgroundColor="#A855F7"
                    trend={{ value: "+2", isPositive: true }}
                    onPress={() => handleStatCardPress('estimates', 'Estimates Sent')}
                  />
                  <StatCard
                    title="Bookings"
                    value="12"
                    subtitle="Meetings scheduled"
                    icon={Calendar}
                    iconColor="#F59E0B"
                    backgroundColor="#F59E0B"
                    trend={{ value: "+4", isPositive: true }}
                    onPress={() => handleStatCardPress('appointments', 'Bookings')}
                  />
                </View>
              </View>
            </View>
          ) : activeMenu === 'jobs' ? (
            <View style={styles.jobsContent}>
              {/* Jobs Starting Today */}
              {jobs.filter(job => {
                const today = new Date();
                const startDate = new Date(job.startDate);
                return startDate.toDateString() === today.toDateString();
              }).length > 0 && (
                <>
                  <View style={styles.jobsSectionHeader}>
                    <Text style={styles.jobsSectionTitle}>Starting Today</Text>
                    <View style={styles.jobsSectionBadge}>
                      <Text style={styles.jobsSectionBadgeText}>
                        {jobs.filter(job => {
                          const today = new Date();
                          const startDate = new Date(job.startDate);
                          return startDate.toDateString() === today.toDateString();
                        }).length}
                      </Text>
                    </View>
                  </View>

                  {jobs.filter(job => {
                    const today = new Date();
                    const startDate = new Date(job.startDate);
                    return startDate.toDateString() === today.toDateString();
                  }).map(job => (
                    <View key={job.id} style={styles.jobCard}>
                      <View style={styles.jobCardHeader}>
                        <View style={styles.jobCardHeaderLeft}>
                          <View style={[styles.jobStatusIndicator, { backgroundColor: '#10B981' }]} />
                          <View>
                            <Text style={styles.jobCustomerName}>{typeof job.customer === 'object' ? job.customer.name : job.customer}</Text>
                            <Text style={styles.jobProjectType}>{job.projectType}</Text>
                          </View>
                        </View>
                        <View style={styles.jobValue}>
                          <Text style={styles.jobValueText}>{job.value}</Text>
                        </View>
                      </View>

                      <View style={styles.jobDetails}>
                        <View style={styles.jobCardDetailRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.projectManager}</Text>
                        </View>
                        <View style={styles.jobCardDetailRow}>
                          <Users size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.crew}</Text>
                        </View>
                      </View>

                      <View style={styles.jobActions}>
                        <TouchableOpacity 
                          style={[styles.jobActionButton, styles.jobActionPrimary]}
                          onPress={() => handlePhoneCall(job.phone)}
                        >
                          <Phone size={16} color="#FFFFFF" />
                          <Text style={styles.jobActionPrimaryText}>Call Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.jobActionButton}
                          onPress={() => handleJobPress(job)}
                        >
                          <FileText size={16} color="#6366F1" />
                          <Text style={styles.jobActionSecondaryText}>View Details</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {/* Jobs In Progress */}
              {jobs.filter(job => {
                const today = new Date();
                const startDate = new Date(job.startDate);
                const endDate = new Date(job.endDate);
                return today > startDate && today < endDate;
              }).length > 0 && (
                <>
                  <View style={styles.jobsSectionHeader}>
                    <Text style={styles.jobsSectionTitle}>In Progress</Text>
                    <View style={[styles.jobsSectionBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.jobsSectionBadgeText, { color: '#92400E' }]}>
                        {jobs.filter(job => {
                          const today = new Date();
                          const startDate = new Date(job.startDate);
                          const endDate = new Date(job.endDate);
                          return today > startDate && today < endDate;
                        }).length}
                      </Text>
                    </View>
                  </View>

                  {jobs.filter(job => {
                    const today = new Date();
                    const startDate = new Date(job.startDate);
                    const endDate = new Date(job.endDate);
                    return today > startDate && today < endDate;
                  }).map(job => (
                    <View key={job.id} style={styles.jobCard}>
                      <View style={styles.jobCardHeader}>
                        <View style={styles.jobCardHeaderLeft}>
                          <View style={[styles.jobStatusIndicator, { backgroundColor: '#F59E0B' }]} />
                          <View>
                            <Text style={styles.jobCustomerName}>{typeof job.customer === 'object' ? job.customer.name : job.customer}</Text>
                            <Text style={styles.jobProjectType}>{job.projectType}</Text>
                          </View>
                        </View>
                        <View style={styles.jobValue}>
                          <Text style={styles.jobValueText}>{job.value}</Text>
                        </View>
                      </View>

                      <View style={styles.jobProgressSection}>
                        <View style={styles.jobProgressHeader}>
                          <Text style={styles.jobProgressLabel}>Progress</Text>
                          <Text style={styles.jobProgressPercent}>{job.progress}%</Text>
                        </View>
                        <View style={styles.jobProgressBar}>
                          <View style={[styles.jobProgressFill, { width: `${job.progress}%` }]} />
                        </View>
                      </View>

                      <View style={styles.jobDetails}>
                        <View style={styles.jobCardDetailRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.projectManager}</Text>
                        </View>
                        <View style={styles.jobCardDetailRow}>
                          <Users size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.crew}</Text>
                        </View>
                      </View>

                      <View style={styles.jobActions}>
                        <TouchableOpacity 
                          style={[styles.jobActionButton, styles.jobActionPrimary]}
                          onPress={() => router.push('/job-schedule')}
                        >
                          <Calendar size={16} color="#FFFFFF" />
                          <Text style={styles.jobActionPrimaryText}>View Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.jobActionButton}
                          onPress={() => handlePhoneCall(job.phone)}
                        >
                          <Phone size={16} color="#6366F1" />
                          <Text style={styles.jobActionSecondaryText}>Call</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {/* Jobs Finishing Today */}
              {jobs.filter(job => {
                const today = new Date();
                const endDate = new Date(job.endDate);
                return endDate.toDateString() === today.toDateString();
              }).length > 0 && (
                <>
                  <View style={styles.jobsSectionHeader}>
                    <Text style={styles.jobsSectionTitle}>Finishing Today</Text>
                    <View style={[styles.jobsSectionBadge, { backgroundColor: '#DBEAFE' }]}>
                      <Text style={[styles.jobsSectionBadgeText, { color: '#1E40AF' }]}>
                        {jobs.filter(job => {
                          const today = new Date();
                          const endDate = new Date(job.endDate);
                          return endDate.toDateString() === today.toDateString();
                        }).length}
                      </Text>
                    </View>
                  </View>

                  {jobs.filter(job => {
                    const today = new Date();
                    const endDate = new Date(job.endDate);
                    return endDate.toDateString() === today.toDateString();
                  }).map(job => (
                    <View key={job.id} style={styles.jobCard}>
                      <View style={styles.jobCardHeader}>
                        <View style={styles.jobCardHeaderLeft}>
                          <View style={[styles.jobStatusIndicator, { backgroundColor: '#3B82F6' }]} />
                          <View>
                            <Text style={styles.jobCustomerName}>{typeof job.customer === 'object' ? job.customer.name : job.customer}</Text>
                            <Text style={styles.jobProjectType}>{job.projectType}</Text>
                          </View>
                        </View>
                        <View style={styles.jobValue}>
                          <Text style={styles.jobValueText}>{job.value}</Text>
                        </View>
                      </View>

                      <View style={styles.jobProgressSection}>
                        <View style={styles.jobProgressHeader}>
                          <Text style={styles.jobProgressLabel}>Progress</Text>
                          <Text style={styles.jobProgressPercent}>{job.progress}%</Text>
                        </View>
                        <View style={styles.jobProgressBar}>
                          <View style={[styles.jobProgressFill, { width: `${job.progress}%`, backgroundColor: '#3B82F6' }]} />
                        </View>
                      </View>

                      <View style={styles.jobDetails}>
                        <View style={styles.jobDetailRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.projectManager}</Text>
                        </View>
                        <View style={styles.jobDetailRow}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.notes}</Text>
                        </View>
                      </View>

                      <View style={styles.jobActions}>
                        <TouchableOpacity 
                          style={[styles.jobActionButton, styles.jobActionPrimary]}
                        >
                          <CheckSquare size={16} color="#FFFFFF" />
                          <Text style={styles.jobActionPrimaryText}>Final Walkthrough</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.jobActionButton}
                          onPress={() => handlePhoneCall(job.phone)}
                        >
                          <Phone size={16} color="#6366F1" />
                          <Text style={styles.jobActionSecondaryText}>Call</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {/* Empty State */}
              {jobs.filter(job => {
                const today = new Date();
                const startDate = new Date(job.startDate);
                const endDate = new Date(job.endDate);
                return startDate.toDateString() === today.toDateString() || 
                       endDate.toDateString() === today.toDateString() ||
                       (today > startDate && today < endDate);
              }).length === 0 && (
                <View style={styles.jobsEmptyState}>
                  <CheckSquare size={48} color="#D1D5DB" />
                  <Text style={styles.jobsEmptyTitle}>No Active Jobs Today</Text>
                  <Text style={styles.jobsEmptyText}>
                    You have no jobs starting, finishing, or in progress today.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.updatesContent}>
              {/* Signed Proposal Update */}
              <View style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <View style={styles.updateIconContainer}>
                    <Handshake size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.updateTimeContainer}>
                    <Text style={styles.updateTime}>5 min ago</Text>
                  </View>
                </View>
                <View style={styles.updateContentSection}>
                  <Text style={styles.updateTitle}>Proposal Signed</Text>
                  <Text style={styles.updateCustomer}>Joe Smith</Text>
                  <View style={styles.updateDetailsRow}>
                    <Text style={styles.updateDetail}>Proposal #4232</Text>
                    <View style={styles.updateDot} />
                    <Text style={styles.updateValue}>$5,000</Text>
                  </View>
                  <View style={styles.updateActionsRow}>
                    <TouchableOpacity style={styles.primaryActionButton}>
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionText}>View</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* New Lead Update */}
              <View style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <View style={[styles.updateIconContainer, { backgroundColor: '#6366F1' }]}>
                    <Target size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.updateTimeContainer}>
                    <Text style={styles.updateTime}>12 min ago</Text>
                  </View>
                </View>
                <View style={styles.updateContentSection}>
                  <Text style={styles.updateTitle}>New Lead</Text>
                  <Text style={styles.updateCustomer}>Sam Smith</Text>
                  <View style={styles.updateDetailsRow}>
                    <Text style={styles.updateDetail}>Kitchen Renovation</Text>
                    <View style={styles.updateDot} />
                    <Text style={styles.updateDetail}>$35k budget</Text>
                  </View>
                  <Text style={styles.updateSource}>Source: Facebook</Text>
                  <View style={styles.updateActionsRow}>
                    <TouchableOpacity style={[styles.primaryActionButton, { backgroundColor: '#10B981' }]}>
                      <Phone size={16} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Call Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionText}>View</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Estimate Viewed Update */}
              <View style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <View style={[styles.updateIconContainer, { backgroundColor: '#8B5CF6' }]}>
                    <FileText size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.updateTimeContainer}>
                    <Text style={styles.updateTime}>1 hour ago</Text>
                  </View>
                </View>
                <View style={styles.updateContentSection}>
                  <Text style={styles.updateTitle}>Estimate Viewed</Text>
                  <Text style={styles.updateCustomer}>Michael Johnson</Text>
                  <View style={styles.updateDetailsRow}>
                    <Text style={styles.updateDetail}>Basement Finishing</Text>
                    <View style={styles.updateDot} />
                    <Text style={styles.updateDetail}>Viewed 3 times</Text>
                  </View>
                  <View style={styles.updateActionsRow}>
                    <TouchableOpacity style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionText}>View Deal</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Email Reply Update */}
              <View style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <View style={[styles.updateIconContainer, { backgroundColor: '#F59E0B' }]}>
                    <Mail size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.updateTimeContainer}>
                    <Text style={styles.updateTime}>2 hours ago</Text>
                  </View>
                </View>
                <View style={styles.updateContentSection}>
                  <Text style={styles.updateTitle}>Email Reply</Text>
                  <Text style={styles.updateCustomer}>Lisa Anderson</Text>
                  <Text style={styles.updateQuote}>"Ready to move forward!"</Text>
                  <View style={styles.updateActionsRow}>
                    <TouchableOpacity style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionText}>View Thread</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {!isCrew && (
        <FloatingActionMenu
          onNewAppointment={handleNewAppointment}
          onNewProposal={handleNewProposal}
          onSendRequest={handleSendRequest}
          onNewLead={handleCreateLead}
          onNewJob={handleCreateJob}
          onPhoneCall={handlePhoneCall}
          onSendText={handleText}
          isVisible={showFAB} 
        />
      )}
      
      {/* New Appointment Modal */}
      <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={handleAppointmentClose}
      />

      {/* New Proposal Modal */}
      <NewProposalModal 
        visible={showNewProposal}
        onClose={handleProposalClose}
      />

      {/* Send Request Modal */}
      <SendRequestModal 
        visible={showSendRequest}
        onClose={handleSendRequestClose}
      />

      {/* Create Lead Modal */}
      <CreateLeadModal
        visible={showCreateLead}
        onClose={handleCreateLeadClose}
      />

      {/* Create Job Modal */}
      <CreateJobModal
        visible={showCreateJob}
        onClose={handleCreateJobClose}
        onNavigateToProposal={(proposalId, jobDetails) => {
          // Navigate to proposal detail page with status=accepted and isScheduled=false
          // Pass job details to pre-populate the line item
          router.push({
            pathname: '/proposal-builder',
            params: {
              id: proposalId,
              status: 'accepted',
              isScheduled: 'false',
              lineItemName: jobDetails.jobType,
              lineItemQuantity: '1',
              lineItemPrice: jobDetails.jobAmount
            }
          });
        }}
        onOpenProposalModal={() => {
          setShowCreateJob(false);
          setShowNewProposal(true);
        }}
      />

      <StatDetailModal
        visible={showStatDetail}
        onClose={() => setShowStatDetail(false)}
        title={selectedStatTitle}
        type={selectedStatType}
        data={getStatData()}
      />

      {/* Job Details Modal */}
      <Modal
        visible={showJobDetails}
        transparent
        animationType="none"
        onRequestClose={handleCloseJobDetails}
      >
        <View style={styles.jobDetailsOverlay}>
          <PanGestureHandler>
            <Animated.View
              style={[
                styles.jobDetailsContainer,
                {
                  transform: [{ translateY: jobDetailsTranslateY }],
                },
              ]}
            >
              {selectedJob && (
                <View style={styles.jobDetailsContent}>
                  <View style={styles.jobDetailsHeader}>
                    <TouchableOpacity 
                      style={styles.jobDetailsCloseButton}
                      onPress={handleCloseJobDetails}
                    >
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.jobDetailsTitle}>Job Details</Text>
                    <View style={styles.jobDetailsHeaderSpacer} />
                  </View>

                  <ScrollView
                    style={styles.jobDetailsScrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Status Section */}
                    <View style={styles.statusSectionTop}>
                      <Text style={styles.statusLabel}>Status</Text>
                      <TouchableOpacity style={[styles.statusDropdown, { backgroundColor: selectedJob.color }]}>
                        <Text style={styles.statusDropdownText}>{selectedJob.dealInfo?.stage || 'Scheduled'}</Text>
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
                        <TouchableOpacity style={styles.quickActionCall}>
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
                          onPress={() => handleCopyAddress(selectedMeeting?.address || '')}
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

      {/* Task Details Modal */}
      <Modal
        visible={showTaskDetails}
        transparent
        animationType="none"
        onRequestClose={handleCloseTaskDetails}
      >
        <View style={styles.fullScreenModalOverlay}>
          <PanGestureHandler
            onGestureEvent={onTaskDetailsGestureEvent}
            onHandlerStateChange={onTaskDetailsHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.fullScreenModalContainer,
                {
                  transform: [{ translateY: taskDetailsTranslateY }],
                },
              ]}
            >
              {selectedTask && (
                <View style={styles.fullScreenContent}>
                  {/* Header with Close Button */}
                  <View style={styles.modalHeader}>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={handleCloseTaskDetails}
                    >
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.modalHeaderTitle}>Task Details</Text>
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
                        style={[styles.clickableStatusBadge, { backgroundColor: selectedTask.statusColor }]}
                        onPress={() => setShowTaskStatusDropdown(showTaskStatusDropdown === selectedTask.id ? null : selectedTask.id)}
                      >
                        <Text style={styles.clickableStatusText}>{selectedTask.status || 'Pending'}</Text>
                        <ChevronDown size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      {showTaskStatusDropdown === selectedTask.id && (
                        <View style={styles.statusDropdown}>
                          {taskStatusOptions.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={styles.statusOption}
                              onPress={() => handleTaskStatusChange(selectedTask.id, option.value)}
                            >
                              <View style={[styles.statusOptionColor, { backgroundColor: option.color }]} />
                              <Text style={styles.statusOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Task Information Card */}
                    <View style={styles.appointmentInfoCard}>
                      <Text style={styles.cardTitle}>Task Information</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Title:</Text>
                        <Text style={styles.infoValue}>{selectedTask.title}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Priority:</Text>
                        <Text style={styles.infoValue}>{selectedTask.priority || 'Normal'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Due Date:</Text>
                        <Text style={styles.infoValue}>{selectedTask.dueDate || 'Not set'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time:</Text>
                        <Text style={styles.infoValue}>{selectedTask.time}</Text>
                      </View>
                      {selectedTask.assignedBy && (
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Assigned By:</Text>
                          <Text style={styles.infoValue}>{selectedTask.assignedBy}</Text>
                        </View>
                      )}
                    </View>

                    {/* Task Description */}
                    <View style={styles.appointmentInfoCard}>
                      <Text style={styles.cardTitle}>Description</Text>
                      <Text style={styles.appointmentDetailsText}>{selectedTask.description}</Text>
                    </View>

                    {/* Action Type */}
                    {selectedTask.actionType && (
                      <View style={styles.appointmentInfoCard}>
                        <Text style={styles.cardTitle}>Action Required</Text>
                        <Text style={styles.infoValue}>{selectedTask.actionLabel || selectedTask.actionType}</Text>
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

      {/* Notification Modal */}
      <NotificationModal 
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />

      {/* Contact Picker Modal */}
      <ContactPickerModal
        visible={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onSelectContact={handleContactSelected}
      />

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
  gradientBackground: {
    paddingBottom: 8,
    zIndex: 10,
    elevation: 10,
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
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
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
  headerDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  // Header Menu Toggle
  headerMenuToggle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 8,
  },
  headerMenuButton: {
    paddingHorizontal: 16,
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
    fontSize: 13,
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
    zIndex: 1,
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
  completedCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
    borderColor: '#E5E7EB',
  },
  completedText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
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
  appointmentStatusDropdown: {
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
    paddingTop: 8,
    gap: 20,
  },
  // AI Summary Card - Purple Gradient like Next Up
  aiSummaryHighlight: {
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
  aiSummaryHeader: {
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
  aiSummaryTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiSummaryIconContainer: {
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
  aiSummaryTimeInfo: {
    gap: 4,
  },
  aiSummaryTimeText: {
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
  aiSummaryStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  aiSummaryStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiSummaryContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  aiSummaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    fontWeight: '500',
  },
  aiSummaryLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiSummaryLoadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  aiSummaryLoadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  aiSummaryLoadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statsGrid: {
    gap: 20,
  },
  statRow: {
    flexDirection: 'row',
    gap: 0,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
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
  // New stat card styles matching My Day structure
  statHeader: {
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
  statTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statTimeInfo: {
    gap: 4,
  },
  statTimeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366F1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },
  statStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  statSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  // Updates Content Styles
  updatesContent: {
    gap: 16,
    paddingTop: 20,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateTimeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  updateTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  updateContentSection: {
    gap: 8,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  updateCustomer: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  updateDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  updateDetail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  updateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  updateValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  updateSource: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  updateQuote: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    fontStyle: 'italic',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  updateActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  // Jobs Content Styles
  jobsContent: {
    paddingTop: 8,
    gap: 20,
  },
  jobsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  jobsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  jobsSectionBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobsSectionBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  jobStatusIndicator: {
    width: 4,
    height: 44,
    borderRadius: 2,
  },
  jobCustomerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  jobProjectType: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobValue: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  jobProgressSection: {
    marginBottom: 12,
  },
  jobProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  jobProgressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  jobProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  jobProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  jobCardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  jobDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  jobActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobActionPrimary: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  jobActionPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobActionSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  jobsEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  jobsEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  jobsEmptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Job Details Modal Styles
  jobDetailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  jobDetailsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  jobDetailsContent: {
    flex: 1,
  },
  jobDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  jobDetailsCloseButton: {
    padding: 8,
  },
  jobDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  jobDetailsHeaderSpacer: {
    width: 40,
  },
  jobDetailsScrollView: {
    flex: 1,
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
});