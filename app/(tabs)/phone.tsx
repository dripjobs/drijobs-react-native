import CallInitiationModal from '@/components/CallInitiationModal';
import ContactPickerModal from '@/components/ContactPickerModal';
import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import SendRequestModal from '@/components/SendRequestModal';
import { useCall } from '@/contexts/CallContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTabBar } from '@/contexts/TabBarContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Clock, FileText, MessageSquare, Phone as PhoneIcon, Play, Search, Settings, Sparkles, UserPlus, Volume2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function Phone() {
  const { setIsTransparent } = useTabBar();
  const { missedCalls, setMissedCalls, clearMissedCalls, hasViewedCallHistory, setHasViewedCallHistory } = useNotifications();
  const { startCall } = useCall();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [translateY] = useState(new Animated.Value(0));
  const [contactTranslateY] = useState(new Animated.Value(0));
  const [selectedContact, setSelectedContact] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTranslateY] = useState(new Animated.Value(0));
  const [showCallThread, setShowCallThread] = useState(false);
  const [callThreadTranslateY] = useState(new Animated.Value(0));
  const [selectedCallThread, setSelectedCallThread] = useState(null);
  
  // Quick Actions modal states
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showCallInitiation, setShowCallInitiation] = useState(false);
  const [callContact, setCallContact] = useState({ name: '', phone: '' });

  const dialpadNumbers = [
    [{ number: '1', letters: '' }, { number: '2', letters: 'ABC' }, { number: '3', letters: 'DEF' }],
    [{ number: '4', letters: 'GHI' }, { number: '5', letters: 'JKL' }, { number: '6', letters: 'MNO' }],
    [{ number: '7', letters: 'PQRS' }, { number: '8', letters: 'TUV' }, { number: '9', letters: 'WXYZ' }],
    [{ number: '*', letters: '' }, { number: '0', letters: '+' }, { number: '#', letters: '' }],
  ];

  const recentCalls = [
    { id: 1, name: 'Sarah Wilson', company: 'TechCorp Inc.', number: '+1 (555) 123-4567', type: 'outgoing', time: '2m ago', duration: '5:23', date: 'Today' },
    { id: 2, name: 'Mike Chen', company: 'StartupXYZ', number: '+1 (555) 987-6543', type: 'incoming', time: '1h ago', duration: '12:45', date: 'Today' },
    { id: 3, name: 'Emily Rodriguez', company: 'InnovateNow', number: '+1 (555) 456-7890', type: 'missed', time: '3h ago', duration: '0:00', date: 'Today' },
    { id: 4, name: 'David Kim', company: 'DevSolutions', number: '+1 (555) 321-0987', type: 'outgoing', time: '1d ago', duration: '8:12', date: 'Yesterday' },
    { id: 5, name: 'Lisa Thompson', company: 'GrowthCo', number: '+1 (555) 654-3210', type: 'incoming', time: '2d ago', duration: '15:30', date: 'Jan 28' },
    { id: 6, name: 'John Martinez', company: 'FlowTech', number: '+1 (555) 789-0123', type: 'outgoing', time: '3d ago', duration: '6:45', date: 'Jan 27' },
    { id: 7, name: 'Anna Foster', company: 'GrowthMax', number: '+1 (555) 456-1234', type: 'missed', time: '4d ago', duration: '0:00', date: 'Jan 26' },
    { id: 8, name: 'Robert Chang', company: 'CodeBase', number: '+1 (555) 321-7890', type: 'incoming', time: '5d ago', duration: '22:15', date: 'Jan 25' },
  ];

  const callThreadData = {
    'Sarah Wilson': [
      {
        id: 1,
        type: 'outgoing',
        time: '4:00 AM',
        duration: '4:00',
        timestamp: '4:22 AM',
        agent: 'Mike Stewart',
        recording: true,
        aiSummary: 'Initial inquiry about bathroom renovation services. Customer found us online and wants pricing information.',
        transcript: true
      },
      {
        id: 2,
        type: 'missed',
        time: '8:22 AM',
        timestamp: '8:22 AM',
        agent: 'Tanner Mullen',
        recording: false,
        aiSummary: 'Missed call - customer did not answer. Voicemail left requesting callback about bathroom renovation estimate.',
        voicemail: true
      },
      {
        id: 3,
        type: 'outgoing',
        time: '2:00 PM',
        duration: '6:30',
        timestamp: '2:15 PM',
        agent: 'Mike Stewart',
        recording: true,
        aiSummary: 'Follow-up call to discuss renovation timeline and budget. Customer interested in full bathroom remodel.',
        transcript: true
      }
    ],
    'Mike Chen': [
      {
        id: 1,
        type: 'incoming',
        time: '10:30 AM',
        duration: '12:45',
        timestamp: '10:45 AM',
        agent: 'Sarah Johnson',
        recording: true,
        aiSummary: 'Customer called about software integration services. Discussed requirements and pricing.',
        transcript: true
      },
      {
        id: 2,
        type: 'outgoing',
        time: '3:15 PM',
        duration: '8:20',
        timestamp: '3:30 PM',
        agent: 'Sarah Johnson',
        recording: true,
        aiSummary: 'Follow-up call to present proposal. Customer approved and wants to move forward.',
        transcript: true
      }
    ]
  };

  const allContacts = [
    { id: 1, name: 'Sarah Wilson', title: 'Marketing Director', company: 'TechCorp Inc.', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Mike Chen', title: 'CEO', company: 'StartupXYZ', phone: '+1 (555) 987-6543' },
    { id: 3, name: 'Emily Rodriguez', title: 'Product Manager', company: 'InnovateNow', phone: '+1 (555) 456-7890' },
    { id: 4, name: 'David Kim', title: 'CTO', company: 'DevSolutions', phone: '+1 (555) 321-0987' },
    { id: 5, name: 'Lisa Thompson', title: 'Sales Manager', company: 'GrowthCo', phone: '+1 (555) 654-3210' },
    { id: 6, name: 'John Martinez', title: 'Operations Director', company: 'FlowTech', phone: '+1 (555) 789-0123' },
    { id: 7, name: 'Anna Foster', title: 'VP of Sales', company: 'GrowthMax', phone: '+1 (555) 456-1234' },
    { id: 8, name: 'Robert Chang', title: 'Technical Lead', company: 'CodeBase', phone: '+1 (555) 321-7890' },
  ];

  const filteredContacts = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.phone.includes(contactSearchQuery)
  );

  // Phone number formatting function
  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleNumberPress = (number: string) => {
    // Add haptic feedback for dialpad button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Remove formatting, add number, then reformat
    const cleaned = phoneNumber.replace(/\D/g, '');
    const newNumber = cleaned + number;
    setPhoneNumber(formatPhoneNumber(newNumber));
    // Clear selected contact when user starts typing
    if (selectedContact) {
      setSelectedContact(null);
    }
  };

  const handleBackspace = () => {
    // Add haptic feedback for backspace
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Remove formatting, delete last digit, then reformat
    const cleaned = phoneNumber.replace(/\D/g, '');
    const newNumber = cleaned.slice(0, -1);
    setPhoneNumber(formatPhoneNumber(newNumber));
    // Clear selected contact when user deletes numbers
    if (selectedContact && cleaned.length <= 1) {
      setSelectedContact(null);
    }
  };

  const handleCall = () => {
    // Add haptic feedback for call button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length === 0) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }
    
    // Find contact info if available (compare with cleaned numbers)
    const contact = allContacts.find(c => c.phone.replace(/\D/g, '') === cleanedNumber);
    const contactName = contact?.name || phoneNumber;
    
    // Start the call using context
    startCall(contactName, phoneNumber);
    setPhoneNumber('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecentCall = (call: any) => {
    setPhoneNumber(formatPhoneNumber(call.number));
  };

  const handleContactSelect = (contact: any) => {
    // Add haptic feedback for contact selection
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setPhoneNumber(formatPhoneNumber(contact.phone));
    setSelectedContact(contact);
    setShowContactSearch(false);
    setContactSearchQuery('');
  };

  // Calculate missed calls on component mount
  useEffect(() => {
    const missedCount = recentCalls.filter(call => call.type === 'missed').length;
    setMissedCalls(missedCount);
  }, []);

  const handleRecentCallsPress = () => {
    // Add haptic feedback for recent calls button
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to call history page
    router.push('/call-history');
    // Clear missed calls when user opens call history
    clearMissedCalls();
  };

  const handleAddContactPress = () => {
    // Add haptic feedback for add contact button
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setShowContactSearch(true);
  };

  const handleCallFromHistory = (call: any) => {
    // Add haptic feedback for calling from history
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setPhoneNumber(formatPhoneNumber(call.number));
    setShowCallHistory(false);
  };

  const handleOpenCallThread = (call: any) => {
    setSelectedCallThread(call);
    setShowCallThread(true);
    setShowCallHistory(false);
    // Reset animation
    callThreadTranslateY.setValue(0);
  };

  const handleCallFromThread = (call: any) => {
    // Add haptic feedback for calling from thread
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Set the phone number and selected contact
    setPhoneNumber(formatPhoneNumber(call.number || selectedCallThread?.number));
    setSelectedContact(selectedCallThread);
    // Close the call thread modal
    setShowCallThread(false);
  };

  const handleSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (translationY > 100 || velocityY > 500) {
      // Close modal if swiped down enough or with enough velocity
      Animated.timing(translateY, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowCallHistory(false);
        translateY.setValue(0);
      });
    } else {
      // Snap back to original position
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      translateY.setValue(translationY);
    }
  };

  const handleContactSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (translationY > 100 || velocityY > 500) {
      // Close modal if swiped down enough or with enough velocity
      Animated.timing(contactTranslateY, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowContactSearch(false);
        contactTranslateY.setValue(0);
      });
    } else {
      // Snap back to original position
      Animated.spring(contactTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleContactSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      contactTranslateY.setValue(translationY);
    }
  };

  const handleSettingsSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (translationY > 100 || velocityY > 500) {
      // Close modal if swiped down enough or with enough velocity
      Animated.timing(settingsTranslateY, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSettings(false);
        settingsTranslateY.setValue(0);
      });
    } else {
      // Snap back to original position
      Animated.spring(settingsTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSettingsSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      settingsTranslateY.setValue(translationY);
    }
  };

  const handleCallThreadSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (translationY > 100 || velocityY > 500) {
      // Close modal if swiped down enough or with enough velocity
      Animated.timing(callThreadTranslateY, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowCallThread(false);
        callThreadTranslateY.setValue(0);
      });
    } else {
      // Snap back to original position
      Animated.spring(callThreadTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCallThreadSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      callThreadTranslateY.setValue(translationY);
    }
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'outgoing': return '↗';
      case 'incoming': return '↙';
      case 'missed': return '↙';
      default: return '↗';
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'outgoing': return '#10B981';
      case 'incoming': return '#3B82F6';
      case 'missed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Quick Actions handlers
  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleNewProposal = () => {
    setShowNewProposal(true);
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

  const handlePhoneCall = () => {
    setShowContactPicker(true);
  };

  const handleContactSelected = (contact: any) => {
    setCallContact({ name: contact.name, phone: contact.phone });
    setShowContactPicker(false);
    setShowCallInitiation(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <Modal
        visible={showContactSearch}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContactSearch(false)}
      >
        <View style={styles.nativeModalOverlay}>
          <PanGestureHandler
            onGestureEvent={handleContactSwipeMove}
            onHandlerStateChange={handleContactSwipeDown}
          >
            <Animated.View 
              style={[
                styles.nativeContactModal,
                {
                  transform: [{ translateY: contactTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.nativeModalHeader}>
                <Text style={styles.nativeModalTitle}>Select Contact</Text>
              </View>
              
              <View style={styles.modalSearchBox}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search contacts..."
                  value={contactSearchQuery}
                  onChangeText={setContactSearchQuery}
                  placeholderTextColor="#6B7280"
                />
              </View>
              
              <ScrollView 
                style={styles.nativeContactsList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={() => setIsTransparent(true)}
                onScrollEndDrag={() => setIsTransparent(false)}
                onMomentumScrollBegin={() => setIsTransparent(true)}
                onMomentumScrollEnd={() => setIsTransparent(false)}
              >
                {filteredContacts.map((contact) => (
                  <TouchableOpacity 
                    key={contact.id} 
                    style={styles.nativeContactItem}
                    onPress={() => handleContactSelect(contact)}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactTitle}>{contact.title}</Text>
                      <Text style={styles.contactCompany}>{contact.company}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
      
      <Modal
        visible={showCallHistory}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCallHistory(false)}
      >
        <View style={styles.nativeModalOverlay}>
          <PanGestureHandler
            onGestureEvent={handleSwipeMove}
            onHandlerStateChange={handleSwipeDown}
          >
            <Animated.View 
              style={[
                styles.nativeCallHistoryModal,
                {
                  transform: [{ translateY }]
                }
              ]}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.nativeModalHeader}>
                <Text style={styles.nativeModalTitle}>Recent Calls</Text>
              </View>
              
              <ScrollView 
                style={styles.nativeCallHistoryList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={() => setIsTransparent(true)}
                onScrollEndDrag={() => setIsTransparent(false)}
                onMomentumScrollBegin={() => setIsTransparent(true)}
                onMomentumScrollEnd={() => setIsTransparent(false)}
              >
                {recentCalls.map((call) => (
                  <TouchableOpacity 
                    key={call.id} 
                    style={styles.nativeCallHistoryItem}
                    onPress={() => handleOpenCallThread(call)}
                  >
                    <View style={styles.callTypeIndicator}>
                      <Text style={[styles.callTypeIcon, { color: getCallTypeColor(call.type) }]}>
                        {getCallTypeIcon(call.type)}
                      </Text>
                    </View>
                    
                    <View style={styles.nativeCallHistoryInfo}>
                      <Text style={styles.nativeCallHistoryName}>{call.name}</Text>
                      <Text style={styles.nativeCallHistoryCompany}>{call.company}</Text>
                      <Text style={styles.nativeCallHistoryNumber}>{call.number}</Text>
                    </View>
                    
                    <View style={styles.nativeCallHistoryMeta}>
                      <Text style={styles.nativeCallHistoryTime}>{call.time}</Text>
                      <Text style={styles.nativeCallHistoryDuration}>{call.duration}</Text>
                      <Text style={styles.nativeCallHistoryDate}>{call.date}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.nativeCallBackButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCallFromHistory(call);
                      }}
                    >
                      <PhoneIcon size={18} color="#6366F1" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>

      {/* Phone Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.nativeModalOverlay}>
          <PanGestureHandler
            onGestureEvent={handleSettingsSwipeMove}
            onHandlerStateChange={handleSettingsSwipeDown}
          >
            <Animated.View 
              style={[
                styles.nativeSettingsModal,
                {
                  transform: [{ translateY: settingsTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.nativeModalHeader}>
                <Text style={styles.nativeModalTitle}>Phone Settings</Text>
              </View>
              
              <ScrollView 
                style={styles.settingsContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={() => setIsTransparent(true)}
                onScrollEndDrag={() => setIsTransparent(false)}
                onMomentumScrollBegin={() => setIsTransparent(true)}
                onMomentumScrollEnd={() => setIsTransparent(false)}
              >
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Call Settings</Text>
                  
                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Auto-record Calls</Text>
                      <Text style={styles.settingsItemSubtitle}>Automatically record all outgoing calls</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchActive} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Call Waiting</Text>
                      <Text style={styles.settingsItemSubtitle}>Be notified of incoming calls during active calls</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchInactive} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Voicemail Transcription</Text>
                      <Text style={styles.settingsItemSubtitle}>Convert voicemails to text automatically</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchActive} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Audio Settings</Text>
                  
                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Speaker Mode</Text>
                      <Text style={styles.settingsItemSubtitle}>Use speaker by default for calls</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchInactive} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Noise Cancellation</Text>
                      <Text style={styles.settingsItemSubtitle}>Reduce background noise during calls</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchActive} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Privacy</Text>
                  
                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Block Unknown Numbers</Text>
                      <Text style={styles.settingsItemSubtitle}>Automatically block calls from unknown numbers</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchInactive} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Show Caller ID</Text>
                      <Text style={styles.settingsItemSubtitle}>Display your number to recipients</Text>
                    </View>
                    <View style={styles.toggleSwitch}>
                      <View style={styles.toggleSwitchActive} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Storage</Text>
                  
                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Call History</Text>
                      <Text style={styles.settingsItemSubtitle}>Keep call history for 30 days</Text>
                    </View>
                    <View style={styles.settingsArrow}>
                      <Text style={styles.settingsArrowText}>›</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsItem}>
                    <View style={styles.settingsItemContent}>
                      <Text style={styles.settingsItemTitle}>Recordings</Text>
                      <Text style={styles.settingsItemSubtitle}>Manage call recordings</Text>
                    </View>
                    <View style={styles.settingsArrow}>
                      <Text style={styles.settingsArrowText}>›</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>

      {/* Call Thread Modal */}
      <Modal
        visible={showCallThread}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCallThread(false)}
      >
        <View style={styles.nativeModalOverlay}>
          <PanGestureHandler
            onGestureEvent={handleCallThreadSwipeMove}
            onHandlerStateChange={handleCallThreadSwipeDown}
          >
            <Animated.View 
              style={[
                styles.nativeCallThreadModal,
                {
                  transform: [{ translateY: callThreadTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHandle} />
              
              <View style={styles.nativeModalHeader}>
                <Text style={styles.nativeModalTitle}>
                  {selectedCallThread?.name || 'Call History'}
                </Text>
                <Text style={styles.callThreadSubtitle}>
                  {selectedCallThread?.company || ''}
                </Text>
              </View>
              
              <ScrollView 
                style={styles.callThreadContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={() => setIsTransparent(true)}
                onScrollEndDrag={() => setIsTransparent(false)}
                onMomentumScrollBegin={() => setIsTransparent(true)}
                onMomentumScrollEnd={() => setIsTransparent(false)}
              >
                {selectedCallThread && callThreadData[selectedCallThread.name]?.map((call, index) => (
                  <View key={call.id} style={styles.callThreadItem}>
                    <View style={styles.callThreadHeader}>
                      <View style={styles.callThreadInfo}>
                        <View style={styles.callThreadTypeContainer}>
                          <PhoneIcon 
                            size={16} 
                            color={call.type === 'outgoing' ? '#10B981' : call.type === 'missed' ? '#EF4444' : '#3B82F6'} 
                          />
                          <Text style={styles.callThreadType}>
                            {call.type === 'outgoing' ? 'Called you' : call.type === 'missed' ? 'Call missed' : 'Called you'} • {call.time}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {call.recording && (
                      <View style={styles.callRecordingPlayer}>
                        <TouchableOpacity style={styles.playButton}>
                          <Play size={16} color="#6366F1" />
                        </TouchableOpacity>
                        <Text style={styles.recordingTime}>0:00</Text>
                        <View style={styles.recordingProgress} />
                        <Text style={styles.recordingDuration}>{call.duration}</Text>
                        <TouchableOpacity style={styles.volumeButton}>
                          <Volume2 size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.speedButton}>
                          <Text style={styles.speedText}>1x</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {call.voicemail && (
                      <View style={styles.voicemailContainer}>
                        <MessageSquare size={16} color="#6366F1" />
                        <Text style={styles.voicemailText}>Voicemail left</Text>
                      </View>
                    )}

                    <View style={styles.aiSummaryContainer}>
                      <View style={styles.aiSummaryHeader}>
                        <Sparkles size={16} color="#6366F1" />
                        <Text style={styles.aiSummaryLabel}>AI Summary</Text>
                      </View>
                      <Text style={styles.aiSummaryText}>{call.aiSummary}</Text>
                    </View>

                    {call.transcript && (
                      <TouchableOpacity style={styles.transcriptButton}>
                        <FileText size={16} color="#6366F1" />
                        <Text style={styles.transcriptText}>View transcript +</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.callThreadFooter}>
                      <View style={styles.callThreadFooterLeft}>
                        <Text style={styles.callThreadTimestamp}>{call.timestamp}</Text>
                        <Text style={styles.callThreadAgent}>{call.agent}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.callThreadCallButton}
                        onPress={() => handleCallFromThread(selectedCallThread)}
                      >
                        <PhoneIcon size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
      
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
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
          <Text style={styles.headerTitle}>
            {selectedContact ? selectedContact.name : 'Phone'}
          </Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.phoneDisplay}>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(formatPhoneNumber(text));
              // Clear selected contact when user manually types
              if (selectedContact) {
                setSelectedContact(null);
              }
            }}
            placeholder="Enter phone number"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            keyboardType="phone-pad"
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.dialpad}>
          {dialpadNumbers.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.dialpadRow}>
              {row.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.dialpadButton}
                  onPress={() => handleNumberPress(item.number)}
                >
                  <Text style={styles.dialpadNumber}>{item.number}</Text>
                  {item.letters && (
                    <Text style={styles.dialpadLetters}>{item.letters}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.callActions}>
          <TouchableOpacity style={styles.timerButton} onPress={handleRecentCallsPress}>
            <View style={styles.timerButtonContainer}>
              <Clock size={24} color="#6B7280" />
              {missedCalls > 0 && !hasViewedCallHistory && (
                <View style={styles.callHistoryBadge}>
                  <Text style={styles.callHistoryBadgeText}>
                    {missedCalls > 99 ? '99+' : missedCalls.toString()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.callButtonGradient}
            >
              <PhoneIcon size={28} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addContactButton}
            onPress={handleAddContactPress}
          >
            <UserPlus size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <FloatingActionMenu
        onNewAppointment={handleNewAppointment}
        onNewProposal={handleNewProposal}
        onSendRequest={handleSendRequest}
        onNewLead={handleCreateLead}
        onNewJob={handleCreateJob}
        onPhoneCall={handlePhoneCall}
      />

      {/* Quick Actions Modals */}
      <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
      />

      <NewProposalModal 
        visible={showNewProposal}
        onClose={() => setShowNewProposal(false)}
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
  gradientHeader: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
  },
  phoneDisplay: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  phoneInput: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    minHeight: 40,
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  dialpad: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
  },
  dialpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    alignItems: 'center',
  },
  dialpadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dialpadNumber: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1F2937',
  },
  dialpadLetters: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 100,
  },
  timerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  timerButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callHistoryBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  callHistoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  callButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContactButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactSearchModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  contactsList: {
    maxHeight: 400,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#6B7280',
  },
  callHistoryModal: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  callHistoryList: {
    maxHeight: 500,
  },
  callHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  callTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  callTypeIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  callHistoryInfo: {
    flex: 1,
  },
  callHistoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  callHistoryCompany: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 2,
  },
  callHistoryNumber: {
    fontSize: 13,
    color: '#6B7280',
  },
  callHistoryMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  callHistoryTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  callHistoryDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  callHistoryDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  callBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Native Modal Styles
  nativeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  nativeCallHistoryModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  nativeModalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nativeModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  nativeCallHistoryList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  nativeCallHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nativeCallHistoryInfo: {
    flex: 1,
  },
  nativeCallHistoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  nativeCallHistoryCompany: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 2,
  },
  nativeCallHistoryNumber: {
    fontSize: 13,
    color: '#6B7280',
  },
  nativeCallHistoryMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  nativeCallHistoryTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  nativeCallHistoryDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  nativeCallHistoryDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  nativeCallBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Active Call Modal Styles
  callModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callModal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  callContactInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  callAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  callAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callContactName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  callContactCompany: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  callContactTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  callStatus: {
    alignItems: 'center',
    marginBottom: 40,
  },
  callDuration: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  callStatusIndicators: {
    flexDirection: 'row',
    gap: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  recordingText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  holdIndicator: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  holdText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  callControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButton: {
    backgroundColor: '#6B7280',
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  holdButton: {
    backgroundColor: '#6B7280',
  },
  holdButtonActive: {
    backgroundColor: '#F59E0B',
  },
  hangupButton: {
    backgroundColor: '#EF4444',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  // Native Contact Modal Styles
  nativeContactModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 8,
  },
  nativeContactsList: {
    flex: 1,
  },
  nativeContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // Phone Settings Modal Styles
  nativeSettingsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 8,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemContent: {
    flex: 1,
    marginRight: 16,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#10B981',
    alignSelf: 'flex-end',
  },
  toggleSwitchInactive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsArrowText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  // Call Thread Modal Styles
  nativeCallThreadModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 8,
  },
  callThreadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  callThreadContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  callThreadItem: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  callThreadHeader: {
    marginBottom: 12,
  },
  callThreadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callThreadTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callThreadType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  callRecordingPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingTime: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    minWidth: 40,
  },
  recordingProgress: {
    flex: 1,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#6B7280',
    minWidth: 40,
    textAlign: 'right',
  },
  volumeButton: {
    padding: 4,
  },
  speedButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  speedText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  voicemailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  voicemailText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  aiSummaryContainer: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiSummaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  transcriptText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  callThreadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callThreadFooterLeft: {
    flex: 1,
  },
  callThreadTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  callThreadAgent: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  callThreadCallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
