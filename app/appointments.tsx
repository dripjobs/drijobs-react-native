import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import SendRequestModal from '@/components/SendRequestModal';
import { useTabBar } from '@/contexts/TabBarContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Archive,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Edit,
    Eye,
    FileText,
    Filter,
    Handshake,
    List,
    Mail,
    MapPin,
    MessageSquare,
    Navigation,
    Phone,
    Trash2,
    User,
    UserPlus,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const { height: screenHeight } = Dimensions.get('window');

// Sample data
const appointmentRequests = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    source: 'Website Form',
    timeAgo: '7h ago',
    phone: '(555) 111-2222',
    email: 'jennifer@example.com',
    notes: 'Interested in kitchen renovation. Looking for a consultation to discuss design options and budget.',
    type: 'Consultation',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Robert Chen',
    source: 'Referral',
    timeAgo: '12h ago',
    phone: '(555) 456-7890',
    email: 'robert@greenenergy.co',
    company: 'Green Energy Solutions',
    notes: 'Commercial project inquiry. Need to discuss solar panel installation for office building.',
    type: 'Estimate',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Amanda Foster',
    source: 'Google Ads',
    timeAgo: '2d ago',
    phone: '(555) 321-6547',
    email: 'amanda@example.com',
    notes: 'Bathroom remodel project. Wants to schedule a site visit to assess current condition.',
    type: 'Site Visit',
    priority: 'low'
  }
];

// Sample appointment events
const appointmentEvents = [
  { 
    id: 1, 
    date: 2, 
    time: '08:00', 
    duration: 60, 
    name: 'Robert Johnson', 
    type: 'consultation', 
    color: '#10B981',
    status: 'confirmed',
    assignee: 'Chris Palmer',
    phone: '(352) 895-5224',
    address: '4214 SE 11 PL, Ocala FL 34471',
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
    date: 2, 
    time: '09:00', 
    duration: 90, 
    name: 'Sherry Williams', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignee: 'Mike Wilson',
    phone: '(555) 123-4567',
    address: '123 Main St, Orlando FL 32801',
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
    date: 2, 
    time: '14:30', 
    duration: 120, 
    name: 'Billy Thompson', 
    type: 'site-visit', 
    color: '#06B6D4',
    status: 'in-progress',
    assignee: 'Sarah Johnson',
    phone: '(407) 987-6543',
    address: '456 Oak Ave, Tampa FL 33602',
    details: 'Site visit for commercial office renovation. Need to assess current condition and take measurements.',
    dealId: 'deal-003',
    photos: [
      { id: 4, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Office exterior' },
      { id: 5, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Current layout' },
      { id: 6, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Electrical panel' }
    ]
  },
  { 
    id: 4, 
    date: 3, 
    time: '09:00', 
    duration: 60, 
    name: 'Richard Martinez', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignee: 'Chris Palmer',
    phone: '(555) 234-5678',
    address: '789 Pine St, Miami FL 33101',
    details: 'Kitchen renovation estimate. Customer wants to modernize their 1980s kitchen with new cabinets and countertops.',
    dealId: 'deal-004',
    photos: [
      { id: 7, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Kitchen before' },
      { id: 8, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Cabinets detail' }
    ]
  },
  { 
    id: 5, 
    date: 3, 
    time: '15:00', 
    duration: 45, 
    name: 'Larry Thompson', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'confirmed',
    assignee: 'Mike Wilson',
    phone: '(555) 345-6789',
    address: '321 Elm Ave, Jacksonville FL 32202',
    details: 'Bathroom remodel estimate. Small master bathroom needs complete renovation.',
    dealId: 'deal-005',
    photos: [
      { id: 9, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Bathroom current' },
      { id: 10, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Tile condition' },
      { id: 11, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Fixtures' }
    ]
  },
  { 
    id: 6, 
    date: 4, 
    time: '08:00', 
    duration: 60, 
    name: 'James Wilson', 
    type: 'consultation', 
    color: '#10B981',
    status: 'scheduled',
    assignee: 'Sarah Johnson',
    phone: '(555) 456-7890',
    address: '654 Oak Dr, Tallahassee FL 32301',
    details: 'Initial consultation for whole house renovation. Customer is planning a major remodel.',
    dealId: 'deal-006'
  },
  { 
    id: 7, 
    date: 4, 
    time: '10:00', 
    duration: 90, 
    name: 'William Davis', 
    type: 'consultation', 
    color: '#10B981',
    status: 'in-progress',
    assignee: 'Chris Palmer',
    phone: '(555) 567-8901',
    address: '987 Maple Ln, Gainesville FL 32601',
    details: 'Follow-up consultation for commercial office renovation. Reviewing design options and timeline.',
    dealId: 'deal-007'
  },
  { 
    id: 8, 
    date: 4, 
    time: '12:00', 
    duration: 30, 
    name: 'Wayne Brown', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignee: 'Mike Wilson',
    phone: '(555) 678-9012',
    address: '147 Cedar St, Fort Lauderdale FL 33301',
    details: 'Quick estimate for deck repair and staining.',
    dealId: 'deal-008'
  },
  { 
    id: 9, 
    date: 5, 
    time: '09:30', 
    duration: 75, 
    name: 'Jennifer Garcia', 
    type: 'site-visit', 
    color: '#06B6D4',
    status: 'confirmed',
    assignee: 'Sarah Johnson',
    phone: '(555) 789-0123',
    address: '258 Birch Rd, Sarasota FL 34201',
    details: 'Site visit for new construction project. Need to assess lot and discuss foundation requirements.',
    dealId: 'deal-009'
  },
  { 
    id: 10, 
    date: 5, 
    time: '14:00', 
    duration: 60, 
    name: 'Michael Rodriguez', 
    type: 'consultation', 
    color: '#10B981',
    status: 'scheduled',
    assignee: 'Chris Palmer',
    phone: '(555) 890-1234',
    address: '369 Spruce Ave, Naples FL 34101',
    details: 'Consultation for pool area renovation. Customer wants to update pool deck and add outdoor kitchen.',
    dealId: 'deal-010'
  },
  { 
    id: 11, 
    date: 6, 
    time: '08:30', 
    duration: 90, 
    name: 'Lisa Anderson', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'confirmed',
    assignee: 'Mike Wilson',
    phone: '(555) 901-2345',
    address: '741 Willow Way, Clearwater FL 33701',
    details: 'Comprehensive estimate for master suite renovation. Includes bedroom, bathroom, and walk-in closet.',
    dealId: 'deal-011'
  },
  { 
    id: 12, 
    date: 6, 
    time: '11:00', 
    duration: 45, 
    name: 'David Taylor', 
    type: 'consultation', 
    color: '#10B981',
    status: 'scheduled',
    assignee: 'Sarah Johnson',
    phone: '(555) 012-3456',
    address: '852 Poplar St, St. Petersburg FL 33701',
    details: 'Initial consultation for home office renovation. Customer needs dedicated workspace.',
    dealId: 'deal-012'
  },
  { 
    id: 13, 
    date: 7, 
    time: '10:30', 
    duration: 60, 
    name: 'Amanda White', 
    type: 'site-visit', 
    color: '#06B6D4',
    status: 'in-progress',
    assignee: 'Chris Palmer',
    phone: '(555) 123-4567',
    address: '963 Hickory Ln, Lakeland FL 33801',
    details: 'Site visit for kitchen expansion project. Need to assess structural requirements for wall removal.',
    dealId: 'deal-013'
  },
  { 
    id: 14, 
    date: 7, 
    time: '15:30', 
    duration: 75, 
    name: 'Robert Johnson', 
    type: 'estimate', 
    color: '#8B5CF6',
    status: 'scheduled',
    assignee: 'Mike Wilson',
    phone: '(555) 234-5678',
    address: '174 Ash Dr, Winter Haven FL 33801',
    details: 'Estimate for bathroom renovation. Customer wants to update master bathroom with modern fixtures.',
    dealId: 'deal-014'
  },
  { 
    id: 15, 
    date: 8, 
    time: '09:00', 
    duration: 60, 
    name: 'Susan Miller', 
    type: 'consultation', 
    color: '#10B981',
    status: 'confirmed',
    assignee: 'Sarah Johnson',
    phone: '(555) 345-6789',
    address: '285 Beech St, Kissimmee FL 34701',
    details: 'Consultation for outdoor living space. Customer wants to add covered patio and outdoor kitchen.',
    dealId: 'deal-015'
  },
];

const assignees = ['All Assignees', 'John Smith', 'Sarah Johnson', 'Mike Wilson'];
const appointmentTypes = ['All Types', 'Consultation', 'Estimate', 'Site Visit', 'Follow-up'];
const availableUsers = ['Chris Palmer', 'Mike Wilson', 'Sarah Johnson', 'John Smith', 'Lisa Anderson', 'David Taylor', 'Amanda White'];
const durationOptions = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 }
];

export default function Appointments() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRequestQueue, setShowRequestQueue] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number>(0);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEditAppointment, setShowEditAppointment] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees');
  const [selectedType, setSelectedType] = useState('All Types');
  const [translateY] = useState(new Animated.Value(0));
  const [meetingDetailsTranslateY] = useState(new Animated.Value(0));
  
  // Edit appointment form state
  const [editForm, setEditForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    assignee: '',
    coHosts: [],
    duration: 60,
    calendarColor: '#3B82F6',
    street: '',
    city: '',
    zip: '',
    state: '',
    appointmentNotes: '',
    adminNotes: '',
    sendNotification: false,
    updateReminders: false
  });
  const [showCoHostSearch, setShowCoHostSearch] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState('start'); // 'start' or 'end'
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [pickerTime, setPickerTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return appointmentEvents.filter(event => event.date === day);
  };

  // Calculate end time from start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + durationMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  // Format time for display (add AM/PM)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors = {
      'scheduled': '#BFDBFE', // light blue
      'confirmed': '#BBF7D0', // light green
      'complete': '#16A34A', // dark green
      'no-show': '#D1D5DB', // gray
      'cancelled': '#FECACA', // red
      'in-progress': '#FED7AA', // orange
    };
    return statusColors[status as keyof typeof statusColors] || '#D1D5DB';
  };

  // Get status text
  const getStatusText = (status: string) => {
    const statusTexts = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'complete': 'Complete',
      'no-show': 'No Show',
      'cancelled': 'Cancelled',
      'in-progress': 'In Progress',
    };
    return statusTexts[status as keyof typeof statusTexts] || 'Scheduled';
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const events = isCurrentMonth ? getEventsForDay(date.getDate()) : [];
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        events
      });
    }
    
    return days;
  };

  // Handle request queue modal
  const handleRequestQueuePress = () => {
    setShowRequestQueue(true);
    translateY.setValue(0);
  };

  const handleRequestSelect = (request: any) => {
    const index = appointmentRequests.findIndex(r => r.id === request.id);
    setSelectedRequest(request);
    setSelectedRequestIndex(index);
  };

  const handleNextRequest = () => {
    if (selectedRequestIndex < appointmentRequests.length - 1) {
      const nextIndex = selectedRequestIndex + 1;
      setSelectedRequestIndex(nextIndex);
      setSelectedRequest(appointmentRequests[nextIndex]);
    }
  };

  const handlePreviousRequest = () => {
    if (selectedRequestIndex > 0) {
      const prevIndex = selectedRequestIndex - 1;
      setSelectedRequestIndex(prevIndex);
      setSelectedRequest(appointmentRequests[prevIndex]);
    }
  };

  const handleCloseRequestQueue = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowRequestQueue(false);
      setSelectedRequest(null);
    });
  };

  // Handle meeting details modal
  const handleMeetingSelect = (meeting: any) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetails(true);
    meetingDetailsTranslateY.setValue(0);
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

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    if (selectedMeeting) {
      setSelectedMeeting({ ...selectedMeeting, status: newStatus });
      setShowStatusDropdown(false);
      // In a real app, this would trigger automations
      console.log('Status changed to:', newStatus, 'Automations triggered');
    }
  };

  // Handle customer contact view
  const handleViewCustomer = () => {
    if (selectedMeeting) {
      // In a real app, this would navigate to contact details
      console.log('Viewing customer:', selectedMeeting.name);
    }
  };

  // Handle edit appointment
  const handleEditAppointment = () => {
    if (selectedMeeting) {
      // Parse the appointment date and time
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedMeeting.time.split(':').map(Number);
      const appointmentTime = new Date();
      appointmentTime.setHours(hours, minutes, 0, 0);
      
      setPickerDate(appointmentDate);
      setPickerTime(appointmentTime);
      
      // Reset picker states
      setShowDatePicker(false);
      setShowTimePicker(false);
      
      // Initialize form with current appointment data
      setEditForm({
        date: `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`,
        startTime: formatTime(selectedMeeting.time),
        endTime: formatTime(calculateEndTime(selectedMeeting.time, selectedMeeting.duration)),
        assignee: selectedMeeting.assignee,
        coHosts: [],
        duration: selectedMeeting.duration,
        calendarColor: selectedMeeting.color,
        street: selectedMeeting.address.split(',')[0] || '',
        city: selectedMeeting.address.split(',')[1]?.trim() || '',
        state: selectedMeeting.address.split(',')[2]?.trim().split(' ')[0] || '',
        zip: selectedMeeting.address.split(',')[2]?.trim().split(' ')[1] || '',
        appointmentNotes: selectedMeeting.appointmentNotes || '',
        adminNotes: selectedMeeting.adminNotes || '',
        sendNotification: false,
        updateReminders: false
      });
    }
    setShowMeetingDetails(false);
    setShowEditAppointment(true);
  };

  // Handle close edit appointment
  const handleCloseEditAppointment = () => {
    setShowEditAppointment(false);
    setShowMeetingDetails(true);
    // Reset picker states
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // Close the edit modal
    setShowEditAppointment(false);
    setShowMeetingDetails(false);
    // Reset picker states
    setShowDatePicker(false);
    setShowTimePicker(false);
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Meeting Details Updated',
      text2: 'Your changes have been saved successfully',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  // Handle reschedule appointment
  const handleRescheduleAppointment = () => {
    // Close the edit modal
    setShowEditAppointment(false);
    setShowMeetingDetails(false);
    // Reset picker states
    setShowDatePicker(false);
    setShowTimePicker(false);
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Meeting Rescheduled',
      text2: 'The appointment has been rescheduled successfully',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  // Handle meeting press (from calendar or list view)
  const handleMeetingPress = (meeting: any) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetails(true);
  };

  // Handle navigation to maps
  const handleNavigateToAddress = () => {
    if (selectedMeeting?.address) {
      // In a real app, this would open maps with the address
      console.log('Opening maps with address:', selectedMeeting.address);
    }
  };

  // Handle copy address
  const handleCopyAddress = () => {
    if (selectedMeeting?.address) {
      // In a real app, this would copy to clipboard
      console.log('Copying address:', selectedMeeting.address);
    }
  };

  // Handle call action
  const handleCall = () => {
    if (selectedMeeting?.phone) {
      // In a real app, this would initiate a call
      console.log('Calling:', selectedMeeting.phone);
    }
  };

  // Handle text action
  const handleText = () => {
    if (selectedMeeting?.phone) {
      // In a real app, this would open messaging
      console.log('Texting:', selectedMeeting.phone);
    }
  };

  // Handle email action
  const handleEmail = () => {
    // In a real app, this would open email client
    console.log('Opening email client');
  };

  // Modal handlers
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

  const handleCreateLead = () => {
    setShowCreateLead(true);
  };

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  // Edit form helper functions
  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };


  const handleColorSelect = (color: string) => {
    updateEditForm('calendarColor', color);
  };

  const handleAddCoHost = (user: string) => {
    if (!editForm.coHosts.includes(user)) {
      updateEditForm('coHosts', [...editForm.coHosts, user]);
    }
    setShowCoHostSearch(false);
  };

  const handleRemoveCoHost = (user: string) => {
    updateEditForm('coHosts', editForm.coHosts.filter((host: string) => host !== user));
  };

  const handleAssigneeSelect = (assignee: string) => {
    updateEditForm('assignee', assignee);
    setShowAssigneeDropdown(false);
  };

  const handleDurationSelect = (duration: number) => {
    updateEditForm('duration', duration);
    setShowDurationDropdown(false);
    // Recalculate end time based on new duration
    const [hours, minutes] = editForm.startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    updateEditForm('endTime', formatTime(endTime));
  };

  const getDurationLabel = (value: number) => {
    const option = durationOptions.find(opt => opt.value === value);
    return option ? option.label : `${value} minutes`;
  };

  // Get status for the footer indicator
  const getStatusInfo = () => {
    if (!hasChanges()) {
      return { text: 'No changes', color: '#10B981', bgColor: '#D1FAE5' }; // Green
    }
    
    // Check if required fields are missing
    if (!editForm.date || !editForm.startTime || !editForm.endTime || !editForm.assignee) {
      return { text: 'Incomplete', color: '#EF4444', bgColor: '#FEE2E2' }; // Red
    }
    
    return { text: 'Draft', color: '#F59E0B', bgColor: '#FEF3C7' }; // Orange
  };

  // Check if any changes have been made
  const hasChanges = () => {
    if (!selectedMeeting) return false;
    
    const originalDate = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    const originalStartTime = formatTime(selectedMeeting.time);
    const originalEndTime = formatTime(calculateEndTime(selectedMeeting.time, selectedMeeting.duration));
    
    return (
      editForm.date !== originalDate ||
      editForm.startTime !== originalStartTime ||
      editForm.endTime !== originalEndTime ||
      editForm.assignee !== selectedMeeting.assignee ||
      editForm.calendarColor !== selectedMeeting.color ||
            editForm.adminNotes !== (selectedMeeting.adminNotes || '') ||
      editForm.coHosts.length > 0
    );
  };

  // Check if date/time has changed (for reschedule button)
  const hasDateTimeChanges = () => {
    if (!selectedMeeting) return false;
    
    const originalDate = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    const originalStartTime = formatTime(selectedMeeting.time);
    const originalEndTime = formatTime(calculateEndTime(selectedMeeting.time, selectedMeeting.duration));
    
    return (
      editForm.date !== originalDate ||
      editForm.startTime !== originalStartTime ||
      editForm.endTime !== originalEndTime
    );
  };

  // Pan gesture handler for request queue
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      if (translationY > 100 || velocityY > 500) {
        handleCloseRequestQueue();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Pan gesture handler for meeting details
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

  // Scroll handlers for tab bar transparency
  const handleScrollBeginDrag = () => {
    setIsTransparent(true);
  };

  const handleScrollEndDrag = () => {
    setIsTransparent(false);
  };

  // Date picker handlers
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickerDate(selectedDate);
      const dateString = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
      updateEditForm('date', dateString);
    }
  };

  const handleDateTimePickerChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPickerTime(selectedTime);
      const timeString = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
      
      if (timePickerType === 'start') {
        updateEditForm('startTime', formatTime(timeString));
        // Recalculate end time based on duration
        const startMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
        const endMinutes = startMinutes + editForm.duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
        updateEditForm('endTime', formatTime(endTime));
      } else {
        updateEditForm('endTime', formatTime(timeString));
        // Recalculate duration based on start and end times
        const [startHours, startMinutes] = editForm.startTime.split(':').map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
        const duration = endTotalMinutes - startTotalMinutes;
        updateEditForm('duration', duration);
      }
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group meetings by day for list view
  const groupMeetingsByDay = () => {
    const grouped: { [key: string]: any[] } = {};
    
    appointmentEvents.forEach(meeting => {
      const dayKey = `${meeting.date}`;
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(meeting);
    });

    // Sort meetings within each day by time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    });

    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([day, meetings]) => ({
        day: parseInt(day),
        meetings
      }))
      .sort((a, b) => a.day - b.day);
  };

  const groupedMeetings = groupMeetingsByDay();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {viewMode === 'calendar' ? 'Appointments' : 'All Meetings'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.viewToggleButton}
            onPress={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          >
            {viewMode === 'calendar' ? (
              <List size={20} color="#6B7280" />
            ) : (
              <Calendar size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.requestQueueIconContainer}
            onPress={handleRequestQueuePress}
          >
            <UserPlus size={20} color="#6B7280" />
            {appointmentRequests.length > 0 && (
              <View style={styles.requestQueueBadge}>
                <Text style={styles.requestQueueBadgeText}>
                  {appointmentRequests.length > 99 ? '99+' : appointmentRequests.length.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar or List View */}
      {viewMode === 'calendar' ? (
        <>
          {/* Navigation Controls */}
          <View style={styles.navigationControls}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth('prev')}
            >
              <ChevronLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <View style={styles.monthYearContainer}>
              <Text style={styles.monthYearText}>
                {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth('next')}
            >
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Filter size={16} color="#6B7280" />
              <Text style={styles.filterLabel}>Filters:</Text>
            </View>
            
            <View style={styles.filterButtons}>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>{selectedAssignee}</Text>
                <ChevronRight size={16} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>{selectedType}</Text>
                <ChevronRight size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Days */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !day.isCurrentMonth && styles.calendarDayInactive,
                day.isToday && styles.calendarDayToday,
                day.isSelected && styles.calendarDaySelected,
              ]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  !day.isCurrentMonth && styles.calendarDayTextInactive,
                  day.isToday && styles.calendarDayTextToday,
                  day.isSelected && styles.calendarDayTextSelected,
                ]}
              >
                {day.day}
              </Text>
              
              {/* Events for this day */}
              {day.events && day.events.length > 0 && (
                <View style={styles.dayEvents}>
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <View
                      key={eventIndex}
                      style={[
                        styles.eventDot,
                        { backgroundColor: event.color }
                      ]}
                    />
                  ))}
                  {day.events.length > 3 && (
                    <Text style={styles.moreEventsText}>+{day.events.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Day Events */}
        {selectedDate && getEventsForDay(selectedDate.getDate()).length > 0 && (
          <View style={styles.selectedDayEvents}>
            <Text style={styles.meetingsHeader}>Meetings</Text>
            <Text style={styles.selectedDayTitle}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
            </Text>
            {getEventsForDay(selectedDate.getDate()).map((event) => (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventItem}
                onPress={() => handleMeetingSelect(event)}
              >
                <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTime}>
                    {formatTime(event.time)}-{formatTime(calculateEndTime(event.time, event.duration))}
                  </Text>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventType}>{event.type.replace('-', ' ')}</Text>
                </View>
                <View style={styles.eventActionButton}>
                  <ChevronRight size={16} color="#6B7280" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        </ScrollView>
        </>
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
          {groupedMeetings.map(({ day, meetings }) => (
            <View key={day} style={styles.daySection}>
              <View style={styles.daySectionHeader}>
                <Text style={styles.daySectionTitle}>
                  {monthNames[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}
                </Text>
                <Text style={styles.daySectionSubtitle}>
                  {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
                </Text>
              </View>
              
              {meetings.map((meeting) => (
                <TouchableOpacity
                  key={meeting.id}
                  style={styles.listMeetingItem}
                  onPress={() => handleMeetingPress(meeting)}
                >
                  <View style={styles.listMeetingTime}>
                    <Text style={styles.listMeetingTimeText}>
                      {formatTime(meeting.time)}
                    </Text>
                    <Text style={styles.listMeetingDuration}>
                      {meeting.duration}min
                    </Text>
                  </View>
                  
                  <View style={styles.listMeetingContent}>
                    <Text style={styles.listMeetingName}>{meeting.name}</Text>
                    <Text style={styles.listMeetingType}>{meeting.type}</Text>
                    <Text style={styles.listMeetingAssignee}>Assigned to {meeting.assignee}</Text>
                  </View>
                  
                  <View style={styles.listMeetingStatus}>
                    <View style={[styles.listStatusBadge, { backgroundColor: getStatusColor(meeting.status) }]}>
                      <Text style={styles.listStatusText}>{meeting.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          {groupedMeetings.length === 0 && (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No meetings scheduled</Text>
              <Text style={styles.emptyStateSubtitle}>
                Your upcoming meetings will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Request Queue Modal */}
      <Modal
        visible={showRequestQueue}
        transparent
        animationType="none"
        onRequestClose={handleCloseRequestQueue}
      >
        <View style={styles.modalOverlay}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Text style={styles.modalTitle}>Request Queue</Text>
                  <Text style={styles.modalSubtitle}>{appointmentRequests.length} pending</Text>
                </View>
                <View style={styles.modalHeaderRight}>
                  {selectedRequest && (
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity 
                        style={styles.navButton}
                        onPress={handlePreviousRequest}
                        disabled={selectedRequestIndex === 0}
                      >
                        <ChevronLeft 
                          size={20} 
                          color={selectedRequestIndex === 0 ? "#D1D5DB" : "#6B7280"} 
                        />
                      </TouchableOpacity>
                      <Text style={styles.navCounter}>
                        {selectedRequestIndex + 1} of {appointmentRequests.length}
                      </Text>
                      <TouchableOpacity 
                        style={styles.navButton}
                        onPress={handleNextRequest}
                        disabled={selectedRequestIndex === appointmentRequests.length - 1}
                      >
                        <ChevronRight 
                          size={20} 
                          color={selectedRequestIndex === appointmentRequests.length - 1 ? "#D1D5DB" : "#6B7280"} 
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleCloseRequestQueue}
                  >
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {selectedRequest ? (
                // Request Details View
                <ScrollView style={styles.requestDetailsContainer}>
                  <View style={styles.requestDetailsHeader}>
                    <View style={styles.requestDetailsIcon}>
                      <User size={24} color="#6366F1" />
                    </View>
                    <View style={styles.requestDetailsInfo}>
                      <Text style={styles.requestDetailsName}>{selectedRequest.name}</Text>
                      <Text style={styles.requestDetailsSource}>{selectedRequest.source}</Text>
                      <Text style={styles.requestDetailsTime}>{selectedRequest.timeAgo}</Text>
                    </View>
                    <View style={styles.requestDetailsPriority}>
                      <AlertCircle 
                        size={16} 
                        color={selectedRequest.priority === 'high' ? '#EF4444' : selectedRequest.priority === 'medium' ? '#F59E0B' : '#10B981'} 
                      />
                    </View>
                  </View>

                  {/* Action Buttons - Moved to Top */}
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.viewDealButtonFull}>
                      <Handshake size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>View Deal</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.requestActionsRow}>
                      <TouchableOpacity style={styles.callButton}>
                        <Phone size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Call</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.textButton}>
                        <MessageSquare size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Text</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.emailButton}>
                        <Mail size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Email</Text>
                      </TouchableOpacity>
                    </View>
                  </View>


                  {/* Preferred Dates & Times - Highlighted */}
                  <View style={styles.preferredDatesCard}>
                    <Text style={styles.preferredDatesTitle}>Preferred Schedule</Text>
                    <View style={styles.preferredDateItem}>
                      <View style={styles.preferredDateIcon}>
                        <Calendar size={16} color="#10B981" />
                      </View>
                      <View style={styles.preferredDateInfo}>
                        <Text style={styles.preferredDateLabel}>Preferred Date</Text>
                        <Text style={styles.preferredDateValue}>Monday, August 25, 2025</Text>
                      </View>
                    </View>
                    <View style={styles.preferredDateItem}>
                      <View style={styles.preferredDateIcon}>
                        <Clock size={16} color="#10B981" />
                      </View>
                      <View style={styles.preferredDateInfo}>
                        <Text style={styles.preferredDateLabel}>Preferred Time</Text>
                        <Text style={styles.preferredDateValue}>1:00 PM</Text>
                      </View>
                    </View>
                    <View style={styles.preferredDateItem}>
                      <View style={styles.preferredDateIcon}>
                        <Calendar size={16} color="#F59E0B" />
                      </View>
                      <View style={styles.preferredDateInfo}>
                        <Text style={styles.preferredDateLabel}>Secondary Date</Text>
                        <Text style={styles.preferredDateValue}>Tuesday, August 26, 2025 at 2:00 PM</Text>
                      </View>
                    </View>
                  </View>

                  {/* Request Details */}
                  <View style={styles.requestDetailsCard}>
                    <Text style={styles.requestDetailsCardTitle}>Request Details</Text>
                    <View style={styles.requestDetailItem}>
                      <Text style={styles.requestDetailLabel}>Appointment Details</Text>
                      <Text style={styles.requestDetailValue}>{selectedRequest.notes}</Text>
                    </View>
                  </View>


                  {/* Custom Questions */}
                  <View style={styles.customQuestionsCard}>
                    <Text style={styles.customQuestionsTitle}>Custom Questions</Text>
                    <View style={styles.customQuestionItem}>
                      <Text style={styles.customQuestionLabel}>What type of project are you interested in?</Text>
                      <Text style={styles.customQuestionAnswer}>Complete bathroom renovation</Text>
                    </View>
                    <View style={styles.customQuestionItem}>
                      <Text style={styles.customQuestionLabel}>What is your estimated budget range?</Text>
                      <Text style={styles.customQuestionAnswer}>$15,000 - $25,000</Text>
                    </View>
                    <View style={styles.customQuestionItem}>
                      <Text style={styles.customQuestionLabel}>Do you have any specific timeline requirements?</Text>
                      <Text style={styles.customQuestionAnswer}>Yes - need to complete before summer</Text>
                    </View>
                  </View>

                  {/* Attachments */}
                  <View style={styles.attachmentsCard}>
                    <Text style={styles.attachmentsTitle}>Attachments</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsScrollView}>
                      <View style={styles.attachmentItem}>
                        <View style={styles.attachmentImage}>
                          <Text style={styles.attachmentImageText}>📷</Text>
                        </View>
                        <Text style={styles.attachmentCaption}>current_bathroom_1.jpg</Text>
                        <Text style={styles.attachmentSize}>2.4 MB</Text>
                      </View>
                      <View style={styles.attachmentItem}>
                        <View style={styles.attachmentImage}>
                          <Text style={styles.attachmentImageText}>📷</Text>
                        </View>
                        <Text style={styles.attachmentCaption}>current_bathroom_2.jpg</Text>
                        <Text style={styles.attachmentSize}>1.8 MB</Text>
                      </View>
                      <View style={styles.attachmentItem}>
                        <View style={styles.attachmentImage}>
                          <Text style={styles.attachmentImageText}>📷</Text>
                        </View>
                        <Text style={styles.attachmentCaption}>kitchen_layout.pdf</Text>
                        <Text style={styles.attachmentSize}>1.2 MB</Text>
                      </View>
                      <View style={styles.attachmentItem}>
                        <View style={styles.attachmentImage}>
                          <Text style={styles.attachmentImageText}>📷</Text>
                        </View>
                        <Text style={styles.attachmentCaption}>inspiration_photo.jpg</Text>
                        <Text style={styles.attachmentSize}>3.1 MB</Text>
                      </View>
                    </ScrollView>
                  </View>

                  {/* Schedule Appointment Call-to-Action */}
                  <TouchableOpacity style={styles.scheduleAppointmentButton}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.scheduleAppointmentGradient}
                    >
                      <Calendar size={20} color="#FFFFFF" />
                      <Text style={styles.scheduleAppointmentText}>Schedule Appointment</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Archive and Delete Buttons */}
                  <View style={styles.archiveDeleteButtons}>
                    <TouchableOpacity style={styles.archiveButton}>
                      <Archive size={16} color="#6B7280" />
                      <Text style={styles.archiveButtonText}>Archive</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.deleteButton}>
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Details Section */}
                  <View style={styles.detailsCard}>
                    <Text style={styles.detailsCardTitle}>Details</Text>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Form Type</Text>
                      <Text style={styles.detailsValue}>{selectedRequest.type}</Text>
                    </View>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Assigned To</Text>
                      <Text style={styles.detailsValue}>Tanner Mullen</Text>
                    </View>
                    <View style={styles.detailsItem}>
                      <Text style={styles.detailsLabel}>Date Submitted</Text>
                      <Text style={styles.detailsValue}>1/1/2025 10:45PM</Text>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                // Request List View
                <ScrollView style={styles.requestListContainer}>
                  {appointmentRequests.map((request) => (
                    <TouchableOpacity
                      key={request.id}
                      style={styles.requestItem}
                      onPress={() => handleRequestSelect(request)}
                    >
                      <View style={styles.requestItemHeader}>
                        <View style={styles.requestItemIcon}>
                          <User size={20} color="#6366F1" />
                        </View>
                        <View style={styles.requestItemInfo}>
                          <Text style={styles.requestItemName}>{request.name}</Text>
                          <Text style={styles.requestItemSource}>{request.source}</Text>
                          <Text style={styles.requestItemTime}>{request.timeAgo}</Text>
                        </View>
                        <View style={styles.requestItemPriority}>
                          <AlertCircle 
                            size={16} 
                            color={request.priority === 'high' ? '#EF4444' : request.priority === 'medium' ? '#F59E0B' : '#10B981'} 
                          />
                        </View>
                      </View>
                      
                      <View style={styles.requestItemDetails}>
                        <Text style={styles.requestItemNotes}>{request.notes}</Text>
                      </View>
                      
                      <View style={styles.requestItemActions}>
                        <TouchableOpacity style={styles.viewRequestButton}>
                          <ChevronRight size={16} color="#6366F1" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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

                  <ScrollView style={styles.fullScreenScrollView} showsVerticalScrollIndicator={false}>
                    {/* Status Section - Dropdown */}
                    <View style={styles.statusSection}>
                      <Text style={styles.statusSectionLabel}>Status</Text>
                      <TouchableOpacity 
                        style={[styles.clickableStatusBadge, { backgroundColor: getStatusColor(selectedMeeting.status) }]}
                        onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                      >
                        <Text style={styles.clickableStatusText}>{getStatusText(selectedMeeting.status)}</Text>
                        <ChevronDown size={16} color="#374151" />
                      </TouchableOpacity>
                      
                      {showStatusDropdown && (
                        <View style={styles.statusDropdown}>
                          {['scheduled', 'confirmed', 'in-progress', 'complete', 'no-show', 'cancelled'].map((status) => (
                            <TouchableOpacity
                              key={status}
                              style={[
                                styles.statusOption,
                                { backgroundColor: getStatusColor(status) },
                                selectedMeeting.status === status && styles.selectedStatusOption
                              ]}
                              onPress={() => handleStatusChange(status)}
                            >
                              <Text style={styles.statusOptionText}>{getStatusText(status)}</Text>
                              {selectedMeeting.status === status && <CheckCircle size={16} color="#374151" />}
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
                      <TouchableOpacity style={styles.viewDealButton}>
                        <Handshake size={20} color="#FFFFFF" />
                        <Text style={styles.viewDealButtonText}>View Deal</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Communication Actions */}
                    <View style={styles.communicationActions}>
                      <TouchableOpacity 
                        style={[styles.commActionButton, styles.callButton]}
                        onPress={handleCall}
                      >
                        <Phone size={20} color="#FFFFFF" />
                        <Text style={styles.commActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.commActionButton, styles.textButton]}
                        onPress={handleText}
                      >
                        <MessageSquare size={20} color="#FFFFFF" />
                        <Text style={styles.commActionText}>Text</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.commActionButton, styles.emailButton]}
                        onPress={handleEmail}
                      >
                        <Mail size={20} color="#FFFFFF" />
                        <Text style={styles.commActionText}>Email</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Meeting Information Card */}
                    <View style={styles.infoCard}>
                      <View style={styles.infoCardHeader}>
                        <Calendar size={20} color="#6366F1" />
                        <Text style={styles.infoCardTitle}>Appointment Details</Text>
                      </View>
                      
                      <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Customer</Text>
                          <TouchableOpacity 
                            style={styles.clickableCustomer}
                            onPress={handleViewCustomer}
                          >
                            <Text style={styles.clickableCustomerText}>{selectedMeeting.name}</Text>
                            <User size={16} color="#6366F1" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Type</Text>
                          <Text style={styles.infoItemValue}>{selectedMeeting.type.replace('-', ' ')}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Date</Text>
                          <Text style={styles.infoItemValue}>
                            {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                          </Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Start Time</Text>
                          <Text style={styles.infoItemValue}>{formatTime(selectedMeeting.time)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>End Time</Text>
                          <Text style={styles.infoItemValue}>{formatTime(calculateEndTime(selectedMeeting.time, selectedMeeting.duration))}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Assignee</Text>
                          <Text style={styles.infoItemValue}>{selectedMeeting.assignee}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoItemLabel}>Phone</Text>
                          <Text style={styles.infoItemValue}>{selectedMeeting.phone}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Notes Section */}
                    {/* Appointment Notes */}
                    {selectedMeeting.appointmentNotes && (
                      <View style={styles.notesCard}>
                        <View style={styles.notesHeader}>
                          <FileText size={20} color="#3B82F6" />
                          <Text style={styles.notesTitle}>Appointment Notes</Text>
                        </View>
                        <Text style={styles.notesText}>{selectedMeeting.appointmentNotes}</Text>
                      </View>
                    )}

                    {/* Admin Notes */}
                    {selectedMeeting.adminNotes && (
                      <View style={styles.adminNotesCard}>
                        <View style={styles.notesHeader}>
                          <FileText size={20} color="#F59E0B" />
                          <Text style={styles.notesTitle}>Admin Notes</Text>
                        </View>
                        <Text style={styles.notesText}>{selectedMeeting.adminNotes}</Text>
                      </View>
                    )}

                    {/* Attached Photos Section */}
                    {selectedMeeting.photos && selectedMeeting.photos.length > 0 && (
                      <View style={styles.photosCard}>
                        <View style={styles.photosHeader}>
                          <Eye size={20} color="#8B5CF6" />
                          <Text style={styles.photosTitle}>Attached Photos</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScrollView}>
                          {selectedMeeting.photos.map((photo) => (
                            <View key={photo.id} style={styles.photoItem}>
                              <View style={styles.photoPlaceholder}>
                                <Eye size={24} color="#8B5CF6" />
                              </View>
                              <Text style={styles.photoCaption}>{photo.caption}</Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Secondary Actions */}
                    <View style={styles.secondaryActions}>
                      <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={handleEditAppointment}
                      >
                        <Edit size={16} color="#6B7280" />
                        <Text style={styles.secondaryButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Archive size={16} color="#6B7280" />
                        <Text style={styles.secondaryButtonText}>Archive</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.secondaryButton, styles.deleteSecondaryButton]}>
                        <Trash2 size={16} color="#DC2626" />
                        <Text style={[styles.secondaryButtonText, styles.deleteSecondaryText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={styles.bottomSpacing} />
                  </ScrollView>
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        visible={showEditAppointment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditAppointment(false)}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContainer}>
            {/* Header */}
            <View style={styles.editModalHeader}>
              <View style={styles.editHeaderLeft}>
                <View style={styles.editIconContainer}>
                  <Edit size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.editModalTitle}>Edit Appointment</Text>
                  <Text style={styles.editModalSubtitle}>Update appointment details for new date.</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.editCloseButton}
                onPress={handleCloseEditAppointment}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusIndicatorRow}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusInfo().bgColor }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusInfo().color }]} />
                <Text style={[styles.statusText, { color: getStatusInfo().color }]}>
                  {getStatusInfo().text}
                </Text>
              </View>
            </View>

            {/* Appointment Summary */}
            <View style={styles.appointmentSummary}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <User size={16} color="#10B981" />
                </View>
                <Text style={styles.summaryLabel}>Client/Contact</Text>
                <Text style={styles.summaryValue}>{selectedMeeting?.name}</Text>
              </View>
              {hasDateTimeChanges() && (
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                    <Calendar size={16} color="#3B82F6" />
                  </View>
                  <Text style={styles.summaryLabel}>New Time</Text>
                  <Text style={styles.summaryValue}>
                    {editForm.date} at {editForm.startTime}
                  </Text>
                </View>
              )}
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <User size={16} color="#8B5CF6" />
                </View>
                <Text style={styles.summaryLabel}>Assigned To</Text>
                <Text style={styles.summaryValue}>{editForm.assignee}</Text>
              </View>
            </View>

            <ScrollView style={styles.editScrollView} showsVerticalScrollIndicator={false}>
              {/* Confirm New Schedule */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Confirm New Schedule</Text>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Select Date *</Text>
                  <TouchableOpacity 
                    style={styles.editInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.editInputText}>{editForm.date}</Text>
                    <Calendar size={16} color="#6B7280" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={pickerDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Start Time *</Text>
                  <TouchableOpacity 
                    style={styles.editInput}
                    onPress={() => {
                      setTimePickerType('start');
                      setShowTimePicker(true);
                    }}
                  >
                    <Text style={styles.editInputText}>{editForm.startTime}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                  {showTimePicker && timePickerType === 'start' && (
                    <DateTimePicker
                      value={pickerTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateTimePickerChange}
                      is24Hour={false}
                    />
                  )}
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>End Time *</Text>
                  <TouchableOpacity 
                    style={styles.editInput}
                    onPress={() => {
                      setTimePickerType('end');
                      setShowTimePicker(true);
                    }}
                  >
                    <Text style={styles.editInputText}>{editForm.endTime}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                  {showTimePicker && timePickerType === 'end' && (
                    <DateTimePicker
                      value={pickerTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateTimePickerChange}
                      is24Hour={false}
                    />
                  )}
                </View>
              </View>

              {/* Assignment & Settings */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Assignment & Settings</Text>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Assign To *</Text>
                  <TouchableOpacity 
                    style={styles.editInput}
                    onPress={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  >
                    <Text style={styles.editInputText}>{editForm.assignee}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                  {showAssigneeDropdown && (
                    <View style={styles.dropdown}>
                      {assignees.filter(a => a !== 'All Assignees').map((assignee) => (
                        <TouchableOpacity
                          key={assignee}
                          style={styles.dropdownOption}
                          onPress={() => handleAssigneeSelect(assignee)}
                        >
                          <Text style={styles.dropdownOptionText}>{assignee}</Text>
                          {editForm.assignee === assignee && <CheckCircle size={16} color="#3B82F6" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Co-Hosts</Text>
                  {editForm.coHosts.map((host, index) => (
                    <View key={index} style={styles.coHostItem}>
                      <Text style={styles.coHostText}>{host}</Text>
                      <TouchableOpacity 
                        style={styles.removeCoHostButton}
                        onPress={() => handleRemoveCoHost(host)}
                      >
                        <X size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.addCoHostButton}
                    onPress={() => setShowCoHostSearch(!showCoHostSearch)}
                  >
                    <User size={16} color="#3B82F6" />
                    <Text style={styles.addCoHostText}>Add Co-Host</Text>
                  </TouchableOpacity>
                  {showCoHostSearch && (
                    <View style={styles.coHostSearch}>
                      {availableUsers.filter(user => !editForm.coHosts.includes(user)).map((user) => (
                        <TouchableOpacity
                          key={user}
                          style={styles.coHostSearchOption}
                          onPress={() => handleAddCoHost(user)}
                        >
                          <Text style={styles.coHostSearchText}>{user}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <Text style={styles.addCoHostDescription}>Add additional team members to this appointment</Text>
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Duration (minutes)</Text>
                  <TouchableOpacity 
                    style={styles.editInput}
                    onPress={() => setShowDurationDropdown(!showDurationDropdown)}
                  >
                    <Text style={styles.editInputText}>{getDurationLabel(editForm.duration)}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                  {showDurationDropdown && (
                    <View style={styles.dropdown}>
                      {durationOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={styles.dropdownOption}
                          onPress={() => handleDurationSelect(option.value)}
                        >
                          <Text style={styles.dropdownOptionText}>{option.label}</Text>
                          {editForm.duration === option.value && <CheckCircle size={16} color="#3B82F6" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Calendar Color</Text>
                  <View style={styles.colorSwatches}>
                    {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'].map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.colorSwatch, { backgroundColor: color }]}
                        onPress={() => handleColorSelect(color)}
                      >
                        {editForm.calendarColor === color && <CheckCircle size={12} color="#FFFFFF" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Additional Details */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Additional Details</Text>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Street Address</Text>
                  <View style={styles.editInput}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.editInputText}>{editForm.street}</Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <View style={styles.locationField}>
                    <Text style={styles.editLabel}>City</Text>
                    <View style={styles.editInput}>
                      <Text style={styles.editInputText}>{editForm.city}</Text>
                    </View>
                  </View>
                  <View style={styles.locationField}>
                    <Text style={styles.editLabel}>State</Text>
                    <View style={styles.editInput}>
                      <Text style={styles.editInputText}>{editForm.state}</Text>
                    </View>
                  </View>
                  <View style={styles.locationField}>
                    <Text style={styles.editLabel}>ZIP</Text>
                    <View style={styles.editInput}>
                      <Text style={styles.editInputText}>{editForm.zip}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Appointment Notes</Text>
                  <View style={styles.readOnlyNotes}>
                    <Text style={styles.readOnlyNotesText}>
                      {editForm.appointmentNotes || 'No appointment notes from customer.'}
                    </Text>
                  </View>
                </View>
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Admin Notes</Text>
                  <TextInput
                    style={styles.editTextArea}
                    value={editForm.adminNotes}
                    onChangeText={(text) => updateEditForm('adminNotes', text)}
                    placeholder="Add admin notes for team context..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Customer Notifications */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Customer Notifications</Text>
                <TouchableOpacity 
                  style={[styles.notificationOption, editForm.sendNotification && styles.notificationOptionSelected]}
                  onPress={() => updateEditForm('sendNotification', !editForm.sendNotification)}
                >
                  <View style={styles.notificationIcon}>
                    <MessageSquare size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Send Update Notification</Text>
                    <Text style={styles.notificationDescription}>Automatically notify the customer about the appointment changes via SMS and email.</Text>
                  </View>
                  <View style={styles.checkbox}>
                    {editForm.sendNotification ? (
                      <CheckCircle size={20} color="#3B82F6" />
                    ) : (
                      <View style={styles.uncheckedBox} />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.notificationOption, editForm.updateReminders && styles.notificationOptionSelected]}
                  onPress={() => updateEditForm('updateReminders', !editForm.updateReminders)}
                >
                  <View style={styles.notificationIcon}>
                    <Clock size={16} color="#10B981" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Update Appointment Reminders</Text>
                    <Text style={styles.notificationDescription}>Reset reminder schedule for 24 hours and 2 hours before the new appointment time.</Text>
                  </View>
                  <View style={styles.checkbox}>
                    {editForm.updateReminders ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <View style={styles.uncheckedBox} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.editBottomSpacing} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.editFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCloseEditAppointment}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              {hasDateTimeChanges() ? (
                <TouchableOpacity 
                  style={styles.rescheduleButton}
                  onPress={handleRescheduleAppointment}
                >
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.rescheduleButtonText}>Reschedule Appointment</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <CheckCircle size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

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

      <FloatingActionMenu 
        onNewAppointment={handleNewAppointment}
        onNewProposal={handleNewProposal}
        onSendRequest={handleSendRequest}
        onNewLead={handleCreateLead}
        onNewJob={handleCreateJob}
      />

      <SendRequestModal 
        visible={showSendRequest}
        onClose={() => setShowSendRequest(false)}
      />

      <CreateLeadModal 
        visible={showCreateLead}
        onClose={() => setShowCreateLead(false)}
      />

      <CreateJobModal 
        visible={showCreateJob}
        onClose={() => setShowCreateJob(false)}
      />

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestQueueIconContainer: {
    position: 'relative',
    padding: 8,
  },
  requestQueueBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  requestQueueBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    padding: 8,
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
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
    flex: 1,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
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
  calendarDayInactive: {
    opacity: 0.3,
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
  calendarDayTextInactive: {
    color: '#9CA3AF',
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
  moreEventsText: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  selectedDayEvents: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 1,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meetingsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 2,
  },
  eventType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  eventActionButton: {
    padding: 8,
  },
  // Full Screen Modal Styles
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
    color: '#374151',
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
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  viewDealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Communication Actions
  communicationActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  commActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#10B981',
  },
  textButton: {
    backgroundColor: '#3B82F6',
  },
  emailButton: {
    backgroundColor: '#8B5CF6',
  },
  commActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Info Card
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  infoItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 2,
    textAlign: 'right',
  },
  // Notes Card
  notesCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // Secondary Actions
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  deleteSecondaryButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deleteSecondaryText: {
    color: '#DC2626',
  },
  bottomSpacing: {
    height: 40,
  },
  // Status Dropdown Styles
  statusDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedStatusOption: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  // Clickable Customer Styles
  clickableCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  clickableCustomerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginRight: 6,
  },
  // Photos Styles
  photosCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  photosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 8,
  },
  photosScrollView: {
    marginHorizontal: -4,
  },
  photoItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  photoCaption: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 80,
  },
  // Edit Appointment Modal Styles
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  editModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    minHeight: '85%',
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  editModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  editCloseButton: {
    padding: 8,
  },
  appointmentSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
  },
  editScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  editSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  editFormGroup: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  editInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  editInputText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  addCoHostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  addCoHostText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 8,
  },
  addCoHostDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  editTextArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 80,
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  readOnlyNotes: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 80,
  },
  readOnlyNotesText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  adminNotesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  checkbox: {
    marginLeft: 12,
  },
  editBottomSpacing: {
    height: 20,
  },
  editFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  noChangesText: {
    fontSize: 14,
    color: '#6B7280',
  },
  editFooterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  // Co-host styles
  coHostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  coHostText: {
    fontSize: 14,
    color: '#1E40AF',
    flex: 1,
  },
  removeCoHostButton: {
    padding: 4,
  },
  // Location row styles
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationField: {
    flex: 1,
  },
  // Notification option styles
  notificationOptionSelected: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  // Footer styles
  editFooterContent: {
    flexDirection: 'column',
    gap: 12,
  },
  changesStatusText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  // Dropdown styles
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  // Co-host search styles
  coHostSearch: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 8,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  coHostSearchOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  coHostSearchText: {
    fontSize: 14,
    color: '#374151',
  },
  // Status indicator row
  statusIndicatorRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // List view styles
  listContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  daySection: {
    marginBottom: 24,
  },
  daySectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  daySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  daySectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  listMeetingItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listMeetingTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  listMeetingTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listMeetingDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  listMeetingContent: {
    flex: 1,
    marginRight: 12,
  },
  listMeetingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listMeetingType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  listMeetingAssignee: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listMeetingStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewToggleButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.98,
    minHeight: screenHeight * 0.8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCounter: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginTop: -9,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  requestListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  requestItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requestItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestItemInfo: {
    flex: 1,
  },
  requestItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  requestItemSource: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  requestItemTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  requestItemPriority: {
    marginLeft: 8,
  },
  requestItemDetails: {
    marginBottom: 12,
  },
  requestItemNotes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  requestItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewRequestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestDetailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  requestDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  requestDetailsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  requestDetailsInfo: {
    flex: 1,
  },
  requestDetailsName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  requestDetailsSource: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  requestDetailsTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  requestDetailsPriority: {
    marginLeft: 16,
  },
  requestDetailsSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  requestDetailsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  requestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  requestTypeValue: {
    fontSize: 14,
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // Request Summary Card
  requestSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requestSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestSummaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestSummaryInfo: {
    flex: 1,
  },
  requestSummaryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  requestSummaryDetails: {
    gap: 4,
  },
  requestSummaryDetailItem: {
    fontSize: 14,
    color: '#6B7280',
  },
  requestSummaryStatus: {
    alignItems: 'flex-end',
  },
  requestSummaryStatusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  requestSummaryDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  // Preferred Dates Card
  preferredDatesCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  preferredDatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  preferredDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  preferredDateIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preferredDateInfo: {
    flex: 1,
  },
  preferredDateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  preferredDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Request Details Card
  requestDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requestDetailsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  requestDetailItem: {
    marginBottom: 12,
  },
  requestDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  requestDetailValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },

  // Assignee Card
  assigneeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assigneeCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  assigneeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assigneeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  // Custom Questions Card
  customQuestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  customQuestionItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  customQuestionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  customQuestionAnswer: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },

  // Attachments Card
  attachmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  attachmentsScrollView: {
    marginTop: 8,
  },
  attachmentItem: {
    marginRight: 12,
    alignItems: 'center',
    width: 80,
  },
  attachmentImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  attachmentImageText: {
    fontSize: 24,
  },
  attachmentCaption: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Schedule Appointment Button
  scheduleAppointmentButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  scheduleAppointmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  scheduleAppointmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Archive and Delete Buttons
  archiveDeleteButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  archiveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 8,
  },
  archiveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 6,
  },

  // Details Section
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  detailsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  detailsValue: {
    fontSize: 14,
    color: '#111827',
  },

  // Action Buttons
  requestActions: {
    paddingVertical: 20,
    gap: 12,
  },
  viewDealButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
  },
  textButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
});
