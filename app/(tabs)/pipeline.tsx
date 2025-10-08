import CallInitiationModal from '@/components/CallInitiationModal';
import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import SendRequestModal from '@/components/SendRequestModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { Archive, ArrowRight, Building, Calendar, CheckSquare, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, Eye, FileText, Filter, Mail, MapPin, MessageSquare, MoreVertical, Phone, Plus, Send, Tag, Target, Trash2, TrendingUp, User, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function Pipeline() {
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(0);
  const [selectedStage, setSelectedStage] = useState(0);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [commandCenterTranslateY] = useState(new Animated.Value(Dimensions.get('window').height));
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "customer" | "team" | "automation">("all");
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteTaggedUsers, setNoteTaggedUsers] = useState<string[]>([]);
  const [noteTag, setNoteTag] = useState('');
  const [showUserTagDropdown, setShowUserTagDropdown] = useState(false);
  const [showNoteTagDropdown, setShowNoteTagDropdown] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    eventType: '',
    user: '',
    startDate: '09/19/2025',
    startTime: '09:00 AM',
    duration: '1 hour',
    appointmentAddress: '',
    billingAddress: '',
    notes: '',
    reminders: true,
    reminderType: 'both'
  });
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Quick Actions modal states (additional ones beyond showNewAppointment)
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCallInitiation, setShowCallInitiation] = useState(false);
  const [callContact, setCallContact] = useState({ name: '', phone: '' });

  const pipelines = [
    {
      name: 'Leads',
      stages: [
        { name: 'New Leads', description: 'Fresh leads that need initial contact' },
        { name: 'Cold Leads', description: 'Leads requiring follow-up and nurturing' },
        { name: 'On Hold', description: 'Temporarily paused leads' },
        { name: 'Warm Leads', description: 'Engaged leads showing interest' },
        { name: 'Not a Fit', description: 'Leads that don\'t match our criteria' }
      ]
    },
    {
      name: 'Opportunities',
      stages: [
        { name: 'Qualified', description: 'Verified opportunities ready for proposal' },
        { name: 'Proposal Sent', description: 'Proposals delivered to prospects' },
        { name: 'Negotiation', description: 'Active negotiation phase' },
        { name: 'Decision Pending', description: 'Awaiting final decision' },
        { name: 'Closed Won', description: 'Successfully closed opportunities' }
      ]
    },
    {
      name: 'Proposals',
      stages: [
        { name: 'Draft', description: 'Proposals being prepared' },
        { name: 'Review', description: 'Internal review and approval' },
        { name: 'Sent', description: 'Proposals delivered to clients' },
        { name: 'Follow Up', description: 'Following up on sent proposals' },
        { name: 'Accepted', description: 'Proposals accepted by clients' }
      ]
    },
    {
      name: 'Jobs',
      stages: [
        { name: 'Scheduled', description: 'Jobs scheduled for execution' },
        { name: 'In Progress', description: 'Active job execution' },
        { name: 'Review', description: 'Quality review and inspection' },
        { name: 'Completed', description: 'Jobs completed successfully' },
        { name: 'Invoiced', description: 'Invoices sent to clients' }
      ]
    }
  ];

  const pipelineData = {
    leads: [
      { 
        id: 1, 
        title: 'Bathroom Renovation Inquiry', 
        contact: 'Mike Stewart', 
        stage: 0, 
        labels: ['Hot Lead', 'Urgent'], 
        source: 'Website Form', 
        assignedTo: 'Tanner Mullen', 
        dripCampaign: 5, 
        inStage: '2 days',
        lastActivity: 'Email sent 2 hours ago',
        nextAction: 'Follow up call scheduled',
        priority: 'High',
        tags: ['Residential', 'Bathroom', 'Renovation']
      },
      { 
        id: 2, 
        title: 'Bathroom Remodel', 
        contact: 'Sarah Johnson', 
        stage: 3, 
        labels: ['Warm Lead', 'Follow Up'], 
        source: 'Google Ads', 
        assignedTo: 'Tanner Mullen', 
        dripCampaign: 3, 
        inStage: '5 days',
        lastActivity: 'Phone call completed',
        nextAction: 'Send estimate',
        priority: 'High',
        tags: ['Residential', 'Bathroom', 'Remodel']
      },
      { 
        id: 3, 
        title: 'Kitchen Remodel Inquiry', 
        contact: 'Jennifer Wilson', 
        stage: 3, 
        labels: ['Qualified', 'Phone Call'], 
        source: 'Phone Call', 
        assignedTo: 'Tanner Mullen', 
        dripCampaign: 2, 
        inStage: '1 week',
        lastActivity: 'Proposal sent',
        nextAction: 'Schedule site visit',
        priority: 'Medium',
        tags: ['Residential', 'Kitchen', 'Remodel']
      },
      { 
        id: 10, 
        title: 'Commercial Office Renovation', 
        contact: 'David Chen', 
        stage: 1, 
        labels: ['Cold Lead', 'Commercial'], 
        source: 'Referral', 
        assignedTo: 'Tanner Mullen', 
        dripCampaign: 1, 
        inStage: '3 days',
        lastActivity: 'Initial contact made',
        nextAction: 'Send portfolio',
        priority: 'High',
        tags: ['Commercial', 'Office', 'Renovation']
      },
      { 
        id: 11, 
        title: 'Basement Finishing', 
        contact: 'Lisa Rodriguez', 
        stage: 2, 
        labels: ['Warm Lead', 'Basement'], 
        source: 'Website Form', 
        assignedTo: 'Tanner Mullen', 
        dripCampaign: 4, 
        inStage: '1 week',
        lastActivity: 'Site visit completed',
        nextAction: 'Prepare estimate',
        priority: 'Medium',
        tags: ['Residential', 'Basement', 'Finishing']
      }
    ],
    opportunities: [
      { 
        id: 4, 
        title: 'Enterprise Software License', 
        contact: 'TechCorp Inc.', 
        stage: 2, 
        value: '$85,000', 
        probability: 85, 
        closeDate: '2024-02-15', 
        owner: 'Sarah Wilson',
        assignedTo: 'Sarah Wilson',
        inStage: '2 weeks',
        lastActivity: 'Proposal presented',
        nextAction: 'Negotiate terms',
        priority: 'High',
        tags: ['Enterprise', 'Software', 'License']
      },
      { 
        id: 5, 
        title: 'Marketing Automation Platform', 
        contact: 'GrowthCo', 
        stage: 1, 
        value: '$42,500', 
        probability: 65, 
        closeDate: '2024-02-20', 
        owner: 'Mike Chen',
        assignedTo: 'Mike Chen',
        inStage: '1 week',
        lastActivity: 'Demo completed',
        nextAction: 'Send proposal',
        priority: 'Medium',
        tags: ['Marketing', 'Automation', 'Platform']
      }
    ],
    proposals: [
      { 
        id: 6, 
        title: 'Cloud Infrastructure Setup', 
        contact: 'StartupXYZ', 
        stage: 2, 
        value: '$28,000', 
        sentDate: '2024-01-15', 
        owner: 'Emily Rodriguez',
        assignedTo: 'Emily Rodriguez',
        inStage: '3 weeks',
        lastActivity: 'Follow-up call',
        nextAction: 'Schedule demo',
        priority: 'Medium',
        tags: ['Cloud', 'Infrastructure', 'Setup']
      },
      { 
        id: 7, 
        title: 'Custom Development Project', 
        contact: 'InnovateNow', 
        stage: 0, 
        value: '$120,000', 
        owner: 'David Kim',
        assignedTo: 'David Kim',
        inStage: '1 day',
        lastActivity: 'Proposal drafted',
        nextAction: 'Internal review',
        priority: 'High',
        tags: ['Custom', 'Development', 'Project']
      }
    ],
    jobs: [
      { 
        id: 8, 
        title: 'Office Renovation', 
        contact: 'BusinessCorp', 
        stage: 1, 
        value: '$45,000', 
        startDate: '2024-02-01', 
        owner: 'Lisa Thompson',
        assignedTo: 'Lisa Thompson',
        inStage: '2 weeks',
        lastActivity: 'Work started',
        nextAction: 'Progress check',
        priority: 'High',
        tags: ['Office', 'Renovation', 'Commercial']
      },
      { 
        id: 9, 
        title: 'Retail Space Design', 
        contact: 'ShopCo', 
        stage: 3, 
        value: '$32,000', 
        owner: 'John Smith',
        assignedTo: 'John Smith',
        inStage: '1 week',
        lastActivity: 'Design approved',
        nextAction: 'Begin construction',
        priority: 'Medium',
        tags: ['Retail', 'Design', 'Commercial']
      }
    ]
  };

  const getCurrentPipelineData = () => {
    const pipelineKeys = ['leads', 'opportunities', 'proposals', 'jobs'];
    return pipelineData[pipelineKeys[selectedPipeline] as keyof typeof pipelineData] || [];
  };

  const getCurrentStageData = () => {
    return getCurrentPipelineData().filter(item => item.stage === selectedStage);
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'hot lead': return '#EF4444';
      case 'warm lead': return '#F59E0B';
      case 'cold lead': return '#6B7280';
      case 'qualified': return '#10B981';
      case 'urgent': return '#EF4444';
      case 'follow up': return '#3B82F6';
      case 'phone call': return '#10B981';
      case 'commercial': return '#6366F1';
      case 'basement': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const commandCenterData = {
    leads: {
      1: {
        id: 1,
        title: 'Bathroom Renovation Inquiry',
        contact: 'Mike Stewart',
        email: 'mike.stewart@example.com',
        phone: '(555) 123-4567',
        company: 'Stewart Construction',
        address: '123 Main St, San Francisco, CA 94102',
        currentStage: 'New Leads',
        inStage: '1 year',
        team: [
          { name: 'Tanner Mullen', role: 'Salesperson', initials: 'TM' },
          { name: 'Kimberly Mastrangelo', role: 'Project Manager', initials: 'KM' }
        ],
        dealCreated: 'Jan 10, 2024',
        financials: {
          invoiceTotal: 0,
          totalPayments: 0,
          amountDue: 0
        },
        journey: [
          { stage: 'Lead', status: 'completed', date: 'Jan 10, 2024', count: 1 },
          { stage: 'Opportunities', status: 'pending', date: null, count: 0 },
          { stage: 'Proposals', status: 'pending', date: null, count: 0 },
          { stage: 'Jobs', status: 'pending', date: null, count: 0 }
        ],
        recentActivity: [
          { action: 'Moved to New Leads', user: 'Tanner Mullen', date: 'Jan 18, 2024, 9:30 AM', avatar: 'TM' },
          { action: 'Updated card details', user: 'Tanner Mullen', date: 'Jan 18, 2024, 9:30 AM', avatar: 'TM' },
          { action: 'Card created', user: 'System', date: 'Jan 10, 2024, 5:00 AM', avatar: 'S' }
        ],
        recommendedActions: [
          { title: 'Schedule Estimate', icon: Calendar, color: '#6366F1' }
        ]
      }
    }
  };

  const handleOpenCommandCenter = (card: any) => {
    setSelectedCard(card);
    setShowCommandCenter(true);
    Animated.timing(commandCenterTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCallPress = (contactName: string, phoneNumber: string) => {
    setCallContact({ name: contactName, phone: phoneNumber });
    setShowCallInitiation(true);
  };

  const toggleCardExpansion = (cardId: number) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(cardId)) {
      newExpandedCards.delete(cardId);
    } else {
      newExpandedCards.add(cardId);
    }
    setExpandedCards(newExpandedCards);
  };

  const handleToggleActionMenu = (itemType: string) => {
    setExpandedActionItem(expandedActionItem === itemType ? null : itemType);
  };

  const handleNewAppointment = () => {
    setShowNewAppointment(true);
    setAppointmentStep(1);
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

  const handleAppointmentNext = () => {
    if (appointmentStep < 5) {
      setAppointmentStep(appointmentStep + 1);
    }
  };

  const handleAppointmentBack = () => {
    if (appointmentStep > 1) {
      setAppointmentStep(appointmentStep - 1);
    }
  };

  const handleAppointmentClose = () => {
    setShowNewAppointment(false);
    setAppointmentStep(1);
    setAppointmentData({
      eventType: '',
      user: '',
      startDate: '09/19/2025',
      startTime: '09:00 AM',
      duration: '1 hour',
      appointmentAddress: '',
      billingAddress: '',
      notes: '',
      reminders: true,
      reminderType: 'both'
    });
  };



  const handleCloseCommandCenter = () => {
    Animated.timing(commandCenterTranslateY, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCommandCenter(false);
      setSelectedCard(null);
    });
  };

  const handleCommandCenterSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (translationY > 100 || velocityY > 500) {
      handleCloseCommandCenter();
    } else {
      Animated.spring(commandCenterTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCommandCenterSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      commandCenterTranslateY.setValue(translationY);
    }
  };

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: Eye, count: null },
    { id: 'Customer Journey', label: 'Customer Journey', icon: ArrowRight, count: null },
    { id: 'Proposals', label: 'Proposals', icon: FileText, count: 0 },
    { id: 'Activity', label: 'Activity', icon: TrendingUp, count: null },
    { id: 'Notes', label: 'Notes', icon: FileText, count: 3 },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, count: 2 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            {/* Communication Actions */}
            <View style={styles.communicationSection}>
              <View style={styles.communicationActions}>
                <TouchableOpacity 
                  style={[styles.communicationButton, styles.callButton]}
                  onPress={() => handleCallPress('Mike Stewart', '(555) 123-4567')}
                >
                  <Phone size={18} color="#FFFFFF" />
                  <Text style={styles.communicationButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.communicationButton, styles.textButton]}>
                  <MessageSquare size={18} color="#FFFFFF" />
                  <Text style={styles.communicationButtonText}>Text</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.communicationButton, styles.emailButton]}>
                  <Mail size={18} color="#FFFFFF" />
                  <Text style={styles.communicationButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Details - Collapsible */}
            <View style={styles.customerDetailsSection}>
              <TouchableOpacity 
                style={styles.customerDetailsHeader}
                onPress={() => setCustomerDetailsExpanded(!customerDetailsExpanded)}
              >
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <ChevronRight 
                  size={20} 
                  color="#6B7280" 
                  style={[
                    styles.expandArrow, 
                    customerDetailsExpanded && styles.expandArrowRotated
                  ]} 
                />
              </TouchableOpacity>
              
              {customerDetailsExpanded && (
                <View style={styles.contactSection}>
                  <View style={styles.contactItem}>
                    <Mail size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>mike.stewart@example.com</Text>
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
                  <View style={styles.contactItem}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>(555) 123-4567</Text>
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
                  <View style={styles.contactItem}>
                    <Building size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>Stewart Construction</Text>
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
                  <View style={styles.contactItem}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>123 Main St, San Francisco, CA 94102</Text>
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
                  <View style={styles.contactItem}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>Mike Stewart</Text>
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
            </View>

            {/* Current Stage */}
            <View style={styles.stageSection}>
              <Text style={styles.sectionTitle}>Current Stage</Text>
              <View style={styles.stageInfo}>
                <Text style={styles.stageName}>New Leads</Text>
                <TouchableOpacity style={styles.moveButton}>
                  <Text style={styles.moveButtonText}>Move</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.stageDuration}>In stage for 1 year</Text>
            </View>

            {/* Drips Section */}
            <View style={styles.dripsSection}>
              <Text style={styles.sectionTitle}>Drips</Text>
              <View style={styles.dripStatusContainer}>
                <View style={styles.dripStatusHeader}>
                  <View style={styles.dripStatusIndicator}>
                    <Zap size={16} color="#10B981" />
                    <Text style={styles.dripStatusText}>Active & Sending</Text>
                  </View>
                  <TouchableOpacity style={styles.dripPreviewButton}>
                    <Eye size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.nextDripInfo}>
                  <Text style={styles.nextDripLabel}>Next Drip:</Text>
                  <Text style={styles.nextDripDetails}>Drip 1 in "Default Sequence"</Text>
                  <Text style={styles.nextDripSchedule}>Scheduled for 5:55 PM on 9/18/2025</Text>
                </View>
              </View>
            </View>

            {/* Team */}
            <View style={styles.teamSection}>
              <Text style={styles.sectionTitle}>Team</Text>
              <View style={styles.teamMembers}>
                <View style={styles.teamMember}>
                  <View style={styles.teamMemberAvatar}>
                    <Text style={styles.teamMemberAvatarText}>TM</Text>
                  </View>
                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>Tanner Mullen</Text>
                    <Text style={styles.teamMemberRole}>Salesperson</Text>
                  </View>
                </View>
                <View style={styles.teamMember}>
                  <View style={styles.teamMemberAvatar}>
                    <Text style={styles.teamMemberAvatarText}>KM</Text>
                  </View>
                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>Kimberly Mastrangelo</Text>
                    <Text style={styles.teamMemberRole}>Project Manager</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Deal Info */}
            <View style={styles.dealInfoSection}>
              <Text style={styles.sectionTitle}>Deal Info</Text>
              <Text style={styles.dealCreated}>Deal created Jan 10, 2024</Text>
            </View>

            {/* Financials */}
            <View style={styles.financialsSection}>
              <Text style={styles.sectionTitle}>Financials</Text>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Invoice Total:</Text>
                <Text style={styles.financialValue}>$0.00</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Total Payments:</Text>
                <Text style={styles.financialValue}>$0.00</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Amount Due:</Text>
                <Text style={styles.financialValue}>$0.00</Text>
              </View>
            </View>


            {/* Recommended Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Recommended Next Actions</Text>
              <TouchableOpacity style={styles.recommendedAction}>
                <Calendar size={16} color="#FFFFFF" />
                <Text style={styles.recommendedActionText}>Schedule Estimate</Text>
              </TouchableOpacity>
            </View>

            {/* Deal Actions - Moved to Bottom */}
            <View style={styles.dealActionsSection}>
              <Text style={styles.sectionTitle}>Deal Actions</Text>
              <View style={styles.dealActions}>
                <TouchableOpacity style={styles.dealActionButton}>
                  <Archive size={16} color="#6B7280" />
                  <Text style={styles.dealActionText}>Archive Deal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dealActionButton, styles.deleteActionButton]}>
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={[styles.dealActionText, { color: '#EF4444' }]}>Delete Deal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
      case 'Customer Journey':
        return (
          <View style={styles.journeySection}>
            <Text style={styles.sectionTitle}>Complete Customer Journey</Text>
            
            {/* Deal Insights Card */}
            <View style={styles.insightsCard}>
              <View style={styles.insightsHeader}>
                <TrendingUp size={20} color="#6366F1" />
                <Text style={styles.insightsTitle}>Deal Insights</Text>
              </View>
              
              <View style={styles.insightsGrid}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Project Value</Text>
                  <Text style={styles.insightValue}>$35,000</Text>
                </View>
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Time in Pipeline</Text>
                  <Text style={styles.insightValue}>89 days</Text>
                  <Text style={styles.insightSubtext}>Avg: 45 days</Text>
                </View>
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Customer Engagement</Text>
                  <View style={styles.engagementBar}>
                    <View style={[styles.engagementFill, { width: '85%' }]} />
                  </View>
                  <Text style={styles.insightSubtext}>85% Response Rate</Text>
                </View>
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Est. Start Date</Text>
                  <Text style={styles.insightValue}>Feb 15, 2024</Text>
                </View>
              </View>
              
              <View style={styles.insightsDivider} />
              
              <View style={styles.insightsFooter}>
                <View style={styles.insightAlert}>
                  <Clock size={14} color="#F59E0B" />
                  <Text style={styles.insightAlertText}>Last contact: 3 days ago</Text>
                </View>
                <View style={[styles.insightAlert, { backgroundColor: '#D1FAE5' }]}>
                  <CheckSquare size={14} color="#059669" />
                  <Text style={[styles.insightAlertText, { color: '#065F46' }]}>On track for Feb start</Text>
                </View>
              </View>
            </View>
            
            {/* Stage 4: Project (Current) */}
            <View style={[styles.journeyCard, styles.currentJourneyCard]}>
              <View style={styles.journeyCardHeader}>
                <View style={[styles.journeyCardIconContainer, { backgroundColor: '#FED7AA' }]}>
                  <Building size={20} color="#C2410C" />
                </View>
                <View style={styles.journeyCardHeaderInfo}>
                  <View style={styles.journeyTitleRow}>
                    <Text style={styles.journeyCardTitle}>Basement Finishing Project</Text>
                    <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>Current</Text>
                    </View>
                  </View>
                  <View style={styles.journeyCardStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>Pending Schedule</Text>
                    </View>
                    <Text style={styles.journeyCardDuration}>In stage for 3 weeks</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardMeta}>
                <View style={styles.journeyRelatedRecords}>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Lead #5</Text>
                  </View>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Opportunity #3</Text>
                  </View>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Proposal #2</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardFooter}>
                <Text style={styles.journeyCardDate}>Created: Dec 28, 2023, 9:00 AM</Text>
                <Text style={styles.journeyCardDate}>Updated: Jan 19, 2024, 5:00 AM</Text>
              </View>
              
              <View style={styles.journeyCardActions}>
                <TouchableOpacity style={[styles.journeyActionButton, styles.journeyActionButtonSecondary]}>
                  <Text style={styles.journeyActionButtonTextSecondary}>Move Stage</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stage 3: Proposal */}
            <View style={styles.journeyCard}>
              <View style={styles.journeyCardHeader}>
                <View style={[styles.journeyCardIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <FileText size={20} color="#9333EA" />
                </View>
                <View style={styles.journeyCardHeaderInfo}>
                  <View style={styles.journeyTitleRow}>
                    <Text style={styles.journeyCardTitle}>Basement Finishing Proposal</Text>
                    <Text style={styles.journeyCardValue}>$35,000.00</Text>
                  </View>
                  <View style={styles.journeyCardStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>Proposal Approved</Text>
                    </View>
                    <Text style={styles.journeyCardDuration}>In stage for 1 month</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardMeta}>
                <View style={styles.journeyMetaRow}>
                  <Send size={14} color="#9333EA" />
                  <Text style={styles.journeyMetaText}>Sent: Nov 20, 2023</Text>
                </View>
                <View style={styles.journeyRelatedRecords}>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Lead #5</Text>
                  </View>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Opportunity #3</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardFooter}>
                <Text style={styles.journeyCardDate}>Created: Nov 20, 2023, 7:00 AM</Text>
                <Text style={styles.journeyCardDate}>Updated: Dec 28, 2023, 9:00 AM</Text>
              </View>
            </View>

            {/* Stage 2: Opportunity */}
            <View style={styles.journeyCard}>
              <View style={styles.journeyCardHeader}>
                <View style={[styles.journeyCardIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Target size={20} color="#059669" />
                </View>
                <View style={styles.journeyCardHeaderInfo}>
                  <View style={styles.journeyTitleRow}>
                    <Text style={styles.journeyCardTitle}>Basement Finishing Opportunity</Text>
                    <Text style={styles.journeyCardValue}>$35,000.00</Text>
                  </View>
                  <View style={styles.journeyCardStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>Qualified</Text>
                    </View>
                    <Text style={styles.journeyCardDuration}>In stage for 1 week</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardMeta}>
                <View style={styles.journeyRelatedRecords}>
                  <View style={styles.relatedRecord}>
                    <ArrowRight size={12} color="#6B7280" />
                    <Text style={styles.relatedRecordText}>From Lead #5</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardFooter}>
                <Text style={styles.journeyCardDate}>Created: Nov 15, 2023, 3:00 PM</Text>
                <Text style={styles.journeyCardDate}>Updated: Nov 20, 2023, 10:00 AM</Text>
              </View>
            </View>

            {/* Stage 1: Inquiry (Lead) */}
            <View style={styles.journeyCard}>
              <View style={styles.journeyCardHeader}>
                <View style={styles.journeyCardIconContainer}>
                  <User size={20} color="#6366F1" />
                </View>
                <View style={styles.journeyCardHeaderInfo}>
                  <Text style={styles.journeyCardTitle}>Basement Finishing Inquiry</Text>
                  <View style={styles.journeyCardStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>Qualified</Text>
                    </View>
                    <Text style={styles.journeyCardDuration}>In stage for 2 weeks</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardMeta}>
                <View style={styles.journeyMetaRow}>
                  <Zap size={14} color="#F59E0B" />
                  <Text style={styles.journeyMetaText}>Lead Source: Website Form</Text>
                </View>
                <View style={styles.journeyCardTags}>
                  <View style={styles.journeyTag}>
                    <Text style={styles.journeyTagText}>Basement</Text>
                  </View>
                  <View style={styles.journeyTag}>
                    <Text style={styles.journeyTagText}>Residential</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.journeyCardFooter}>
                <Text style={styles.journeyCardDate}>Created: Nov 1, 2023, 9:00 AM</Text>
                <Text style={styles.journeyCardDate}>Updated: Nov 15, 2023, 2:00 PM</Text>
              </View>
            </View>
          </View>
        );
      case 'Proposals':
        return (
          <View style={styles.proposalsSection}>
            <Text style={styles.sectionTitle}>Proposals</Text>
            
            {/* Proposal Card 1 - Basement Finishing */}
            <View style={styles.proposalCard}>
              <View style={styles.proposalHeader}>
                <View style={[styles.proposalIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <FileText size={20} color="#9333EA" />
                </View>
                <View style={styles.proposalHeaderInfo}>
                  <Text style={styles.proposalTitle}>Basement Finishing Proposal</Text>
                  <View style={styles.proposalStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>Approved</Text>
                    </View>
                    <Text style={styles.proposalValue}>$35,000.00</Text>
                  </View>
                </View>
              </View>

              <View style={styles.proposalMeta}>
                <View style={styles.proposalMetaRow}>
                  <Send size={14} color="#9333EA" />
                  <Text style={styles.proposalMetaText}>Sent: Nov 20, 2023</Text>
                </View>
                <View style={styles.proposalMetaRow}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.proposalMetaText}>Salesperson: Tanner Mullen</Text>
                </View>
              </View>

              <View style={styles.proposalStats}>
                <View style={styles.proposalStat}>
                  <Eye size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Total Views</Text>
                  <Text style={styles.proposalStatValue}>12</Text>
                </View>
                <View style={styles.proposalStat}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Time Viewed</Text>
                  <Text style={styles.proposalStatValue}>18 min</Text>
                </View>
                <View style={styles.proposalStat}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Last Viewed</Text>
                  <Text style={styles.proposalStatValue}>2 days ago</Text>
                </View>
              </View>

              <View style={styles.proposalFooter}>
                <Text style={styles.proposalDate}>Created: Nov 20, 2023</Text>
                <TouchableOpacity style={styles.viewProposalButton}>
                  <Eye size={16} color="#FFFFFF" />
                  <Text style={styles.viewProposalButtonText}>View Proposal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Proposal Card 2 - Kitchen Renovation */}
            <View style={styles.proposalCard}>
              <View style={styles.proposalHeader}>
                <View style={[styles.proposalIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <FileText size={20} color="#9333EA" />
                </View>
                <View style={styles.proposalHeaderInfo}>
                  <Text style={styles.proposalTitle}>Kitchen Renovation Proposal</Text>
                  <View style={styles.proposalStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.statusBadgeText, { color: '#92400E' }]}>Pending Review</Text>
                    </View>
                    <Text style={styles.proposalValue}>$52,500.00</Text>
                  </View>
                </View>
              </View>

              <View style={styles.proposalMeta}>
                <View style={styles.proposalMetaRow}>
                  <Send size={14} color="#9333EA" />
                  <Text style={styles.proposalMetaText}>Sent: Jan 15, 2024</Text>
                </View>
                <View style={styles.proposalMetaRow}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.proposalMetaText}>Salesperson: Sarah Johnson</Text>
                </View>
              </View>

              <View style={styles.proposalStats}>
                <View style={styles.proposalStat}>
                  <Eye size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Total Views</Text>
                  <Text style={styles.proposalStatValue}>7</Text>
                </View>
                <View style={styles.proposalStat}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Time Viewed</Text>
                  <Text style={styles.proposalStatValue}>12 min</Text>
                </View>
                <View style={styles.proposalStat}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.proposalStatLabel}>Last Viewed</Text>
                  <Text style={styles.proposalStatValue}>5 hours ago</Text>
                </View>
              </View>

              <View style={styles.proposalFooter}>
                <Text style={styles.proposalDate}>Created: Jan 15, 2024</Text>
                <TouchableOpacity style={styles.viewProposalButton}>
                  <Eye size={16} color="#FFFFFF" />
                  <Text style={styles.viewProposalButtonText}>View Proposal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Empty State Example (commented out - shown when no proposals) */}
            {/* <View style={styles.emptyProposalsState}>
              <View style={styles.emptyStateIcon}>
                <FileText size={48} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyStateTitle}>No Proposals Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Proposals will appear here once this deal reaches the proposal stage
              </Text>
            </View> */}
          </View>
        );
      case 'Activity':
        return (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
            
            {/* Activity Filter Tabs */}
            <View style={styles.activityFilterTabs}>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'all' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('all')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'all' && styles.activityFilterTabTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'customer' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('customer')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'customer' && styles.activityFilterTabTextActive]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'team' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('team')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'team' && styles.activityFilterTabTextActive]}>Team</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.activityFilterTab, activityFilter === 'automation' && styles.activityFilterTabActive]}
                onPress={() => setActivityFilter('automation')}
              >
                <Text style={[styles.activityFilterTabText, activityFilter === 'automation' && styles.activityFilterTabTextActive]}>Automation</Text>
              </TouchableOpacity>
            </View>

            {(() => {
              const activities = [
              { type: 'customer', icon: Eye, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '5 hours ago', timestamp: 'Today, 11:30 AM', title: 'Proposal Viewed', description: 'Customer viewed "Kitchen Renovation Proposal" for 8 minutes' },
              { type: 'team', icon: Mail, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '1 day ago', timestamp: 'Jan 30, 2024, 2:15 PM', user: 'Tanner Mullen', title: 'Follow-up Email Sent', description: 'Sent proposal follow-up email to customer' },
              { type: 'customer', icon: Phone, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '2 days ago', timestamp: 'Jan 29, 2024, 10:45 AM', title: 'Phone Call', description: 'Customer called to discuss timeline - Duration: 12 min' },
              { type: 'team', icon: ArrowRight, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '3 days ago', timestamp: 'Jan 28, 2024, 3:20 PM', user: 'Sarah Johnson', title: 'Moved to Proposal Stage', description: 'Moved deal from Opportunity to Proposal' },
              { type: 'customer', icon: Mail, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: '4 days ago', timestamp: 'Jan 27, 2024, 9:05 AM', title: 'Email Reply Received', description: 'Customer replied: "Looks great! When can we start?"' },
              { type: 'team', icon: Calendar, iconColor: '#059669', iconBg: '#F0FDF4', badge: 'TEAM', badgeBg: '#D1FAE5', badgeColor: '#065F46', time: '5 days ago', timestamp: 'Jan 26, 2024, 1:30 PM', user: 'Tanner Mullen', title: 'Site Visit Scheduled', description: 'Scheduled site visit for Feb 2, 2024 at 10:00 AM' },
              { type: 'customer', icon: FileText, iconColor: '#6366F1', iconBg: '#EEF2FF', badge: 'CUSTOMER', badgeBg: '#EEF2FF', badgeColor: '#6366F1', time: 'Nov 1, 2023', timestamp: 'Nov 1, 2023, 8:15 AM', title: 'Initial Inquiry Submitted', description: 'Customer submitted website form for basement finishing' },
              { type: 'automation', icon: Zap, iconColor: '#F59E0B', iconBg: '#FEF3C7', badge: 'AUTOMATION', badgeBg: '#FEF3C7', badgeColor: '#F59E0B', time: '6 hours ago', timestamp: 'Today, 10:15 AM', title: 'Drip Email Sent', description: 'Automated follow-up email: "Still interested in your renovation?"' },
              { type: 'automation', icon: MessageSquare, iconColor: '#F59E0B', iconBg: '#FEF3C7', badge: 'AUTOMATION', badgeBg: '#FEF3C7', badgeColor: '#F59E0B', time: '2 days ago', timestamp: 'Jan 29, 2024, 3:00 PM', title: 'SMS Reminder Sent', description: 'Automated text: "Your appointment is coming up on Feb 2"' },
              { type: 'automation', icon: ArrowRight, iconColor: '#F59E0B', iconBg: '#FEF3C7', badge: 'AUTOMATION', badgeBg: '#FEF3C7', badgeColor: '#F59E0B', time: '4 days ago', timestamp: 'Jan 27, 2024, 12:00 AM', title: 'Deal Auto-Advanced', description: 'Deal automatically moved from Lead to Opportunity (30+ day rule)' },
              { type: 'automation', icon: Mail, iconColor: '#F59E0B', iconBg: '#FEF3C7', badge: 'AUTOMATION', badgeBg: '#FEF3C7', badgeColor: '#F59E0B', time: '6 days ago', timestamp: 'Jan 25, 2024, 9:00 AM', title: 'Welcome Email Sent', description: 'Automated welcome series email #2: "What to expect"' },
              { type: 'automation', icon: MessageSquare, iconColor: '#F59E0B', iconBg: '#FEF3C7', badge: 'AUTOMATION', badgeBg: '#FEF3C7', badgeColor: '#F59E0B', time: 'Nov 2, 2023', timestamp: 'Nov 2, 2023, 9:30 AM', title: 'Thank You SMS', description: 'Automated text: "Thanks for your inquiry! We will be in touch soon"' },

            ];

            const filteredActivities = activityFilter === 'all' 
              ? activities 
              : activities.filter(activity => activity.type === activityFilter);

              return (<ScrollView 
              style={styles.activityScrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.activityList}>
              {filteredActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <View key={index} style={styles.activityItem}>
                    <View style={[styles.activityIconContainer, { backgroundColor: activity.iconBg }]}>
                      <IconComponent size={16} color={activity.iconColor} />
                    </View>
                    <View style={styles.activityContent}>
                      <View style={styles.activityHeader}>
                        <View style={[styles.activityBadge, { backgroundColor: activity.badgeBg }]}>
                          <Text style={[styles.activityBadgeText, { color: activity.badgeColor }]}>{activity.badge}</Text>
                        </View>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      {activity.user && (
                        <Text style={styles.activityUser}>
                          <User size={12} color="#6B7280" /> {activity.user}
                        </Text>
                      )}
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                      <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
              );
            })()}
          </View>
        );
      case 'Notes':
        return (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            
            {/* Add Note Button */}
            <TouchableOpacity style={styles.addNoteButton} onPress={() => setShowAddNoteModal(true)}>
              <Plus size={16} color="#6366F1" />
              <Text style={styles.addNoteButtonText}>Add Note</Text>
            </TouchableOpacity>

            {/* Notes List */}
            <View style={styles.notesList}>
              <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteAuthor}>
                    <View style={styles.noteAuthorAvatar}>
                      <Text style={styles.noteAuthorAvatarText}>TM</Text>
                    </View>
                    <View>
                      <Text style={styles.noteAuthorName}>Tanner Mullen</Text>
                      <Text style={styles.noteTimestamp}>Jan 30, 2024, 2:30 PM</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <MoreVertical size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent}>
                  Customer is very interested in eco-friendly materials. Discussed budget range of $30-40k. Follow up next week with green options.
                </Text>
                <View style={styles.noteTags}>
                  <View style={styles.noteTag}>
                    <Tag size={12} color="#6366F1" />
                    <Text style={styles.noteTagText}>Follow-up</Text>
                  </View>
                </View>
              </View>

              <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteAuthor}>
                    <View style={styles.noteAuthorAvatar}>
                      <Text style={styles.noteAuthorAvatarText}>SJ</Text>
                    </View>
                    <View>
                      <Text style={styles.noteAuthorName}>Sarah Johnson</Text>
                      <Text style={styles.noteTimestamp}>Jan 28, 2024, 11:15 AM</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <MoreVertical size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent}>
                  Site visit completed. Measured basement - 800 sq ft total. Customer wants open concept with wet bar area.
                </Text>
                <View style={styles.noteTags}>
                  <View style={styles.noteTag}>
                    <Tag size={12} color="#059669" />
                    <Text style={styles.noteTagText}>Site Visit</Text>
                  </View>
                </View>
              </View>

              <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteAuthor}>
                    <View style={styles.noteAuthorAvatar}>
                      <Text style={styles.noteAuthorAvatarText}>TM</Text>
                    </View>
                    <View>
                      <Text style={styles.noteAuthorName}>Tanner Mullen</Text>
                      <Text style={styles.noteTimestamp}>Jan 25, 2024, 9:00 AM</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <MoreVertical size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent}>
                  Initial call went great. Customer referred by previous client (Johnson renovation). Ready to move forward quickly.
                </Text>
                <View style={styles.noteTags}>
                  <View style={styles.noteTag}>
                    <Tag size={12} color="#8B5CF6" />
                    <Text style={styles.noteTagText}>Referral</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'Tasks':
        return (
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            
            {/* Add Task Button */}
            <TouchableOpacity style={styles.addTaskButton}>
              <Plus size={16} color="#6366F1" />
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            </TouchableOpacity>

            {/* Tasks List */}
            <View style={styles.tasksList}>
              <View style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <TouchableOpacity style={styles.taskCheckbox}>
                    <View style={styles.taskCheckboxInner} />
                  </TouchableOpacity>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>Send updated proposal with eco-friendly options</Text>
                    <View style={styles.taskMeta}>
                      <View style={styles.taskDueDate}>
                        <Calendar size={12} color="#EF4444" />
                        <Text style={styles.taskDueDateText}>Due: Feb 2, 2024</Text>
                      </View>
                      <View style={styles.taskAssignee}>
                        <User size={12} color="#6B7280" />
                        <Text style={styles.taskAssigneeText}>Tanner Mullen</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.taskPriority, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.taskPriorityText, { color: '#DC2626' }]}>High</Text>
                  </View>
                </View>
              </View>

              <View style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <TouchableOpacity style={styles.taskCheckbox}>
                    <View style={styles.taskCheckboxInner} />
                  </TouchableOpacity>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>Schedule final design meeting</Text>
                    <View style={styles.taskMeta}>
                      <View style={styles.taskDueDate}>
                        <Calendar size={12} color="#F59E0B" />
                        <Text style={styles.taskDueDateText}>Due: Feb 5, 2024</Text>
                      </View>
                      <View style={styles.taskAssignee}>
                        <User size={12} color="#6B7280" />
                        <Text style={styles.taskAssigneeText}>Sarah Johnson</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.taskPriority, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.taskPriorityText, { color: '#D97706' }]}>Medium</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      
            default:
        return (
          <View style={styles.emptyTabContent}>
            <Text style={styles.emptyTabText}>Content for {activeTab} coming soon...</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
          <View style={styles.pullOutIndicator}>
            <View style={styles.pullOutDot} />
            <View style={styles.pullOutDot} />
            <View style={styles.pullOutDot} />
          </View>
          <View style={styles.pullOutArrow}>
            <ChevronRight size={16} color="#6366F1" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Multi-Pipeline CRM</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Plus size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pipeline Tabs */}
      <View style={styles.pipelineTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.pipelineTabs}
          contentContainerStyle={styles.pipelineTabsContent}
        >
          {pipelines.map((pipeline, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pipelineTab,
                selectedPipeline === index && styles.activePipelineTab
              ]}
              onPress={() => {
                setSelectedPipeline(index);
                setSelectedStage(0);
              }}
            >
              <Text style={[
                styles.pipelineTabText,
                selectedPipeline === index && styles.activePipelineTabText
              ]}>
                {pipeline.name}
              </Text>
              {selectedPipeline === index && <View style={styles.activePipelineIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stage Navigation */}
      <View style={styles.stageNavigation}>
        <TouchableOpacity 
          style={[styles.stageNavButton, selectedStage === 0 && styles.disabledButton]}
          onPress={() => setSelectedStage(Math.max(0, selectedStage - 1))}
          disabled={selectedStage === 0}
        >
          <ChevronLeft size={20} color={selectedStage === 0 ? "#D1D5DB" : "#6B7280"} />
        </TouchableOpacity>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.stageTabs}
          contentContainerStyle={styles.stageTabsContent}
        >
          {pipelines[selectedPipeline].stages.map((stage, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.stageTab,
                selectedStage === index && styles.activeStageTab
              ]}
              onPress={() => setSelectedStage(index)}
            >
              <Text style={[
                styles.stageTabText,
                selectedStage === index && styles.activeStageTabText
              ]}>
                {stage.name}
              </Text>
              <Text style={styles.stageCount}>
                {getCurrentPipelineData().filter(item => item.stage === index).length}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.stageNavButton, selectedStage === pipelines[selectedPipeline].stages.length - 1 && styles.disabledButton]}
          onPress={() => setSelectedStage(Math.min(pipelines[selectedPipeline].stages.length - 1, selectedStage + 1))}
          disabled={selectedStage === pipelines[selectedPipeline].stages.length - 1}
        >
          <ChevronRight size={20} color={selectedStage === pipelines[selectedPipeline].stages.length - 1 ? "#D1D5DB" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Stage Description */}
      <View style={styles.stageDescription}>
        <Text style={styles.stageDescriptionText}>
          {pipelines[selectedPipeline].stages[selectedStage].description}
        </Text>
      </View>

      {/* Pipeline Cards */}
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
        <View style={styles.cardsContainer}>
          {getCurrentStageData().length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No cards in this stage</Text>
            </View>
          ) : (
            getCurrentStageData().map((card) => {
              const isExpanded = expandedCards.has(card.id);
              return (
                <View key={card.id} style={styles.pipelineCard}>
                  {/* Condensed View */}
                  <TouchableOpacity 
                    style={styles.cardCondensed}
                    onPress={() => toggleCardExpansion(card.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.condensedContent}>
                      <View style={styles.condensedHeader}>
                        <View style={styles.condensedTitleRow}>
                          <Text style={styles.condensedTitle} numberOfLines={2}>
                            {card.title}
                          </Text>
                        </View>
                        <View style={styles.condensedContactRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.condensedContact} numberOfLines={1}>
                            {card.contact}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.condensedMeta}>
                        <View style={styles.condensedMetaItem}>
                          <Clock size={12} color="#6B7280" />
                          <Text style={styles.condensedMetaText}>{card.inStage}</Text>
                        </View>
                        <View style={styles.condensedMetaItem}>
                          <Tag size={12} color="#6B7280" />
                          <Text style={styles.condensedMetaText}>{card.source}</Text>
                        </View>
                        {selectedPipeline >= 2 && card.value && (
                          <View style={styles.condensedMetaItem}>
                            <DollarSign size={12} color="#10B981" />
                            <Text style={[styles.condensedMetaText, { color: '#10B981', fontWeight: '600' }]}>
                              {card.value}
                            </Text>
                          </View>
                        )}
                        {card.dripCampaign && (
                          <View style={styles.condensedMetaItem}>
                            <View style={styles.dripIndicator}>
                              <Zap size={14} color="#10B981" />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.expandIndicator}>
                      <ArrowRight 
                        size={16} 
                        color="#6B7280" 
                        style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Expanded View */}
                  {isExpanded && (
                    <View style={styles.cardExpanded}>
                      {/* Communication Actions */}
                      <View style={styles.communicationSection}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.communicationActions}>
                          <TouchableOpacity 
                            style={[styles.communicationButton, styles.callButton]}
                            onPress={() => handleCallPress(card.contact || 'Contact', '(555) 123-4567')}
                          >
                            <Phone size={18} color="#FFFFFF" />
                            <Text style={styles.communicationButtonText}>Call</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.communicationButton, styles.textButton]}>
                            <MessageSquare size={18} color="#FFFFFF" />
                            <Text style={styles.communicationButtonText}>Text</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.communicationButton, styles.emailButton]}>
                            <Mail size={18} color="#FFFFFF" />
                            <Text style={styles.communicationButtonText}>Email</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.expandedDetails}>
                        <View style={styles.detailRow}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.detailLabel}>In Stage:</Text>
                          <Text style={styles.detailValue}>{card.inStage}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Tag size={14} color="#6B7280" />
                          <Text style={styles.detailLabel}>Source:</Text>
                          <Text style={styles.detailValue}>{card.source}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.detailLabel}>Assigned:</Text>
                          <Text style={styles.detailValue}>{card.assignedTo}</Text>
                        </View>
                        {selectedPipeline >= 2 && card.value && (
                          <View style={styles.detailRow}>
                            <DollarSign size={14} color="#10B981" />
                            <Text style={styles.detailLabel}>Value:</Text>
                            <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '600' }]}>
                              {card.value}
                            </Text>
                          </View>
                        )}
                        <View style={styles.detailRow}>
                          <Target size={14} color="#6B7280" />
                          <Text style={styles.detailLabel}>Last Activity:</Text>
                          <Text style={styles.detailValue}>{card.lastActivity}</Text>
                        </View>
                        {card.dripCampaign && (
                          <View style={styles.detailRow}>
                            <Zap size={14} color="#10B981" />
                            <Text style={styles.detailLabel}>Drip Campaign:</Text>
                            <View style={styles.dripStatusBadge}>
                              <Zap size={12} color="#10B981" />
                              <Text style={styles.dripStatusText}>{card.dripCampaign} remaining</Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={styles.expandedLabels}>
                        {card.labels && card.labels.map((label, index) => (
                          <View key={index} style={[styles.label, { backgroundColor: getLabelColor(label) + '20' }]}>
                            <Text style={[styles.labelText, { color: getLabelColor(label) }]}>
                              {label}
                            </Text>
                          </View>
                        ))}
                        <TouchableOpacity style={styles.addLabelButton}>
                          <Plus size={12} color="#6B7280" />
                          <Text style={styles.addLabelText}>Add Label</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Other Actions */}
                      <View style={styles.otherActions}>
                        <TouchableOpacity style={styles.otherActionButton}>
                          <Calendar size={16} color="#6366F1" />
                          <Text style={styles.otherActionText}>Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.otherActionButton, styles.commandCenterButton]}
                          onPress={() => handleOpenCommandCenter(card)}
                        >
                          <Zap size={16} color="#FFFFFF" />
                          <Text style={[styles.otherActionText, { color: '#FFFFFF' }]}>Command Center</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <FloatingActionMenu
        onNewAppointment={handleNewAppointment}
        onNewProposal={handleNewProposal}
        onSendRequest={handleSendRequest}
        onNewLead={handleCreateLead}
        onNewJob={handleCreateJob}
        isVisible={showFAB}
      />

      {/* Quick Actions Modals */}
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

      {/* Command Center Modal */}
      <Modal
        visible={showCommandCenter}
        transparent
        animationType="none"
        onRequestClose={handleCloseCommandCenter}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={handleCloseCommandCenter} 
          />
          
          <PanGestureHandler
            onGestureEvent={handleCommandCenterSwipeMove}
            onHandlerStateChange={handleCommandCenterSwipeDown}
          >
            <Animated.View 
              style={[
                styles.commandCenterModal,
                {
                  transform: [{ translateY: commandCenterTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHandle} />
              
              <ScrollView 
                style={styles.commandCenterContent}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={() => setIsTransparent(true)}
                onScrollEndDrag={() => setIsTransparent(false)}
                onMomentumScrollBegin={() => setIsTransparent(true)}
                onMomentumScrollEnd={() => setIsTransparent(false)}
              >
                {selectedCard && (
                  <>
                    {/* Header */}
                    <View style={styles.commandCenterHeader}>
                      <View style={styles.contactHeader}>
                        <View style={styles.contactAvatar}>
                          <Text style={styles.contactAvatarText}>
                            {selectedCard.contact.split(' ').map((n: string) => n[0]).join('')}
                          </Text>
                        </View>
                        <View style={styles.contactInfo}>
                          <View style={styles.contactNameRow}>
                            <Text style={styles.contactName}>{selectedCard.contact}</Text>
                            {selectedCard.dripCampaign && (
                              <View style={styles.dripIndicator}>
                                <Zap size={14} color="#10B981" />
                              </View>
                            )}
                          </View>
                          <Text style={styles.contactTitle}>Lead #{selectedCard.id}</Text>
                          <View style={styles.contactTag}>
                            <Text style={styles.contactTagText}>Needs HOA</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity onPress={handleCloseCommandCenter} style={styles.closeButton}>
                        <X size={24} color="#6B7280" />
                      </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.headerActions}>
                      <TouchableOpacity style={styles.headerActionButton}>
                        <Calendar size={16} color="#FFFFFF" />
                        <Text style={styles.headerActionButtonText}>New Appointment</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.headerActionButton}>
                        <FileText size={16} color="#FFFFFF" />
                        <Text style={styles.headerActionButtonText}>New Proposal</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Tab Navigation */}
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.tabNavigation}
                      contentContainerStyle={styles.tabNavigationContent}
                    >
                      {tabs.map((tab) => (
                        <TouchableOpacity
                          key={tab.id}
                          style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                          ]}
                          onPress={() => setActiveTab(tab.id)}
                        >
                          <tab.icon 
                            size={16} 
                            color={activeTab === tab.id ? '#6366F1' : '#6B7280'} 
                          />
                          <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                          ]}>
                            {tab.label}
                          </Text>
                          {tab.count !== null && (
                            <Text style={styles.tabCount}>({tab.count})</Text>
                          )}
                          {activeTab === tab.id && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* Tab Content */}
                    {renderTabContent()}
                  </>
                )}
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>

      {/* New Appointment Modal */}

      {/* Add Note Modal */}
      <Modal
        visible={showAddNoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddNoteModal(false)}
      >
        <SafeAreaView style={styles.addNoteModal}>
          <View style={styles.addNoteHeader}>
            <TouchableOpacity onPress={() => {
              setShowAddNoteModal(false);
              setNoteContent('');
              setNoteTaggedUsers([]);
              setNoteTag('');
            }}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.addNoteTitle}>Add Note</Text>
            <TouchableOpacity 
              style={styles.saveNoteButton}
              onPress={() => {
                // Handle save note
                console.log('Note saved:', { content: noteContent, taggedUsers: noteTaggedUsers, tag: noteTag });
                setShowAddNoteModal(false);
                setNoteContent('');
                setNoteTaggedUsers([]);
                setNoteTag('');
              }}
            >
              <Text style={styles.saveNoteButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.addNoteContent}>
            {/* Note Content */}
            <View style={styles.addNoteField}>
              <Text style={styles.addNoteLabel}>Note</Text>
              <TextInput
                style={styles.addNoteTextArea}
                placeholder="Write your note here..."
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Tag Team Members */}
            <View style={styles.addNoteField}>
              <Text style={styles.addNoteLabel}>Tag Team Members</Text>
              <TouchableOpacity 
                style={styles.addNoteDropdown}
                onPress={() => setShowUserTagDropdown(!showUserTagDropdown)}
              >
                <User size={16} color="#6B7280" />
                <Text style={styles.addNoteDropdownText}>
                  {noteTaggedUsers.length > 0 ? `${noteTaggedUsers.length} member(s) tagged` : 'Select team members...'}
                </Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {showUserTagDropdown && (
                <View style={styles.dropdownOptions}>
                  {['Tanner Mullen', 'Sarah Johnson', 'Mike Davis', 'Lisa Anderson'].map((user) => (
                    <TouchableOpacity
                      key={user}
                      style={styles.dropdownOption}
                      onPress={() => {
                        if (noteTaggedUsers.includes(user)) {
                          setNoteTaggedUsers(noteTaggedUsers.filter(u => u !== user));
                        } else {
                          setNoteTaggedUsers([...noteTaggedUsers, user]);
                        }
                      }}
                    >
                      <View style={[
                        styles.dropdownCheckbox,
                        noteTaggedUsers.includes(user) && styles.dropdownCheckboxChecked
                      ]}>
                        {noteTaggedUsers.includes(user) && (
                          <CheckSquare size={14} color="#FFFFFF" />
                        )}
                      </View>
                      <Text style={styles.dropdownOptionText}>{user}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Tagged Users Pills */}
              {noteTaggedUsers.length > 0 && (
                <View style={styles.taggedUsersPills}>
                  {noteTaggedUsers.map((user) => (
                    <View key={user} style={styles.userPill}>
                      <Text style={styles.userPillText}>{user}</Text>
                      <TouchableOpacity onPress={() => setNoteTaggedUsers(noteTaggedUsers.filter(u => u !== user))}>
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Note Tag */}
            <View style={styles.addNoteField}>
              <Text style={styles.addNoteLabel}>Note Tag</Text>
              <TouchableOpacity 
                style={styles.addNoteDropdown}
                onPress={() => setShowNoteTagDropdown(!showNoteTagDropdown)}
              >
                <Tag size={16} color="#6B7280" />
                <Text style={styles.addNoteDropdownText}>
                  {noteTag || 'Select a tag...'}
                </Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {showNoteTagDropdown && (
                <View style={styles.dropdownOptions}>
                  {['Follow-up', 'Site Visit', 'Referral', 'Budget Discussion', 'Design Meeting', 'Materials', 'Important'].map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setNoteTag(tag);
                        setShowNoteTagDropdown(false);
                      }}
                    >
                      <Tag size={14} color="#6366F1" />
                      <Text style={styles.dropdownOptionText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Selected Tag */}
              {noteTag && (
                <View style={styles.selectedTagContainer}>
                  <View style={styles.selectedTag}>
                    <Tag size={12} color="#6366F1" />
                    <Text style={styles.selectedTagText}>{noteTag}</Text>
                    <TouchableOpacity onPress={() => setNoteTag('')}>
                      <X size={14} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

            <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={handleAppointmentClose}
      />

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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    backgroundColor: '#6366F1',
  },
  pullOutArrow: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconButton: {
    padding: 8,
  },
  pipelineTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pipelineTabs: {
    backgroundColor: '#FFFFFF',
  },
  pipelineTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  pipelineTab: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 0,
    position: 'relative',
    alignItems: 'center',
  },
  activePipelineTab: {
    backgroundColor: '#6366F1',
  },
  pipelineTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  activePipelineTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activePipelineIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#6366F1',
  },
  stageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stageNavButton: {
    padding: 12,
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.3,
  },
  stageTabs: {
    flex: 1,
  },
  stageTabsContent: {
    paddingHorizontal: 8,
  },
  stageTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  activeStageTab: {
    backgroundColor: '#F3F4F6',
  },
  stageTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  activeStageTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  stageCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stageDescription: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stageDescriptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  pipelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  cardType: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  cardContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  cardLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '500',
  },
  addLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addLabelText: {
    fontSize: 11,
    color: '#6B7280',
  },
  cardMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sourceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  assignedText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dripText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  // Responsive Card Styles
  cardCondensed: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  condensedContent: {
    flex: 1,
    marginRight: 12,
  },
  condensedHeader: {
    marginBottom: 8,
  },
  condensedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  condensedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dripIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  condensedContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  condensedContact: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  condensedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  condensedMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  condensedMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  expandIndicator: {
    padding: 4,
  },
  cardExpanded: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expandedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expandedContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expandedContactText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  expandedDetails: {
    marginBottom: 16,
    paddingTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  expandedLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  expandedActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expandedActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  expandedActionText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  commandCenterButton: {
    backgroundColor: '#6366F1',
  },
  addLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 4,
  },
  addLabelText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  communicationSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  communicationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  communicationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  callButton: {
    backgroundColor: '#10B981', // Green for call
  },
  textButton: {
    backgroundColor: '#3B82F6', // Blue for text
  },
  emailButton: {
    backgroundColor: '#8B5CF6', // Purple for email
  },
  communicationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  otherActions: {
    flexDirection: 'row',
    gap: 8,
  },
  otherActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  otherActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  dripStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dripStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealActionsSection: {
    marginBottom: 24,
  },
  dealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dealActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 8,
  },
  dealActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  deleteActionButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  contactMenuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Inline Action Menu Styles
  inlineActionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inlineActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 12,
    borderRadius: 8,
  },
  inlineActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  // Command Center Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  commandCenterModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
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
  commandCenterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commandCenterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  contactTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  contactTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  customerDetailsSection: {
    marginBottom: 24,
  },
  customerDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expandArrow: {
    transform: [{ rotate: '0deg' }],
  },
  expandArrowRotated: {
    transform: [{ rotate: '90deg' }],
  },
  contactSection: {
    marginTop: 12,
    marginBottom: 0,
  },
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
  sendEmailButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  sendEmailButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  stageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  dripsSection: {
    marginBottom: 24,
  },
  dripStatusContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dripStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dripStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dripStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  dripPreviewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDripInfo: {
    gap: 4,
  },
  nextDripLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextDripDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  nextDripSchedule: {
    fontSize: 13,
    color: '#6B7280',
  },
  stageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  moveButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  moveButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  stageDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  teamSection: {
    marginBottom: 24,
  },
  teamMembers: {
    gap: 12,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamMemberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamMemberAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  teamMemberRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  dealInfoSection: {
    marginBottom: 24,
  },
  dealCreated: {
    fontSize: 14,
    color: '#6B7280',
  },
  financialsSection: {
    marginBottom: 24,
  },
  financialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  financialLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  actionsSection: {
    marginBottom: 24,
  },
  recommendedAction: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  recommendedActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  journeySection: {
    marginBottom: 24,
  },
  journeyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  currentJourneyCard: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  journeyCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  journeyCardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  journeyCardHeaderInfo: {
    flex: 1,
  },
  journeyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  journeyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  journeyCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 8,
  },
  journeyCardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  journeyCardDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  journeyCardMeta: {
    marginBottom: 12,
  },
  journeyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  journeyMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  journeyCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  journeyTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  journeyTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  journeyRelatedRecords: {
    marginTop: 4,
    gap: 4,
  },
  relatedRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  relatedRecordText: {
    fontSize: 12,
    color: '#6B7280',
  },
  journeyCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  journeyCardDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  journeyCardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  journeyActionButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  journeyActionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  journeyActionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  journeyActionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  futureSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    padding: 16,
    marginBottom: 16,
  },
  futureSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  futureSectionIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  futureSectionInfo: {
    flex: 1,
  },
  futureSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  futureSectionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightItem: {
    flex: 1,
    minWidth: '45%',
  },
  insightLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  insightSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  engagementBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  engagementFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  insightsDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  insightsFooter: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  insightAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    minWidth: '45%',
  },
  insightAlertText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  proposalsSection: {
    marginBottom: 24,
  },
  proposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  proposalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  proposalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  proposalHeaderInfo: {
    flex: 1,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  proposalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proposalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  proposalMeta: {
    marginBottom: 16,
    gap: 8,
  },
  proposalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proposalMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  proposalStats: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 16,
  },
  proposalStat: {
    flex: 1,
    alignItems: 'center',
  },
  proposalStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  proposalStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  proposalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  proposalDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewProposalButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  viewProposalButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyProposalsState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  journeySteps: {
    gap: 16,
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  journeyStepInfo: {
    flex: 1,
  },
  journeyStepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  journeyStepDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  journeyStepTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  journeyStepTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  activityUser: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Enhanced Activity Styles
  activityFilterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  activityFilterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  activityFilterTabActive: {
    backgroundColor: '#6366F1',
  },
  activityFilterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activityFilterTabTextActive: {
    color: '#FFFFFF',
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityUser: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  activityTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },  activityScrollContainer: {
    height: 500,
  },
  // Enhanced Command Center Styles
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  headerActionButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  headerActionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tabNavigation: {
    marginBottom: 20,
  },
  tabNavigationContent: {
    paddingHorizontal: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    position: 'relative',
    minWidth: 100,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6366F1',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  communicationSection: {
    marginBottom: 24,
  },
  communicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  commActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTabText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Notes Section Styles
  notesSection: {
    marginBottom: 24,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addNoteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  notesList: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteAuthorAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noteAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  noteContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteTags: {
    flexDirection: 'row',
    gap: 8,
  },
  noteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  noteTagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Tasks Section Styles
  tasksSection: {
    marginBottom: 24,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addTaskButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  taskCheckboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  taskDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskDueDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskAssigneeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskPriorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Add Note Modal Styles
  addNoteModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addNoteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveNoteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  saveNoteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addNoteContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addNoteField: {
    marginBottom: 24,
  },
  addNoteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  addNoteTextArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 120,
  },
  addNoteDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 8,
  },
  addNoteDropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  dropdownOptions: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownCheckboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  taggedUsersPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  userPillText: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
  },
  selectedTagContainer: {
    marginTop: 12,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    alignSelf: 'flex-start',
  },
  selectedTagText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
