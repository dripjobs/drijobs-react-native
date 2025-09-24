import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Modal, Animated } from 'react-native';
import { Menu, Calendar, DollarSign, TrendingUp, ChevronLeft, ChevronRight, User, Clock, Tag, Plus, Filter, Upload, Zap, X, Mail, Phone, MapPin, Building, Eye, Target, FileText, CheckSquare, ArrowRight, Send, MessageSquare, PhoneCall, Edit, Archive, Trash2, MoreVertical, Check } from 'lucide-react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import DrawerMenu from '@/components/DrawerMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import { useTabBar } from '@/contexts/TabBarContext';

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
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
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
    { id: 'Notes & Tasks', label: 'Notes & Tasks', icon: CheckSquare, count: 5 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            {/* Communication Actions */}
            <View style={styles.communicationSection}>
              <View style={styles.communicationActions}>
                <TouchableOpacity style={[styles.communicationButton, styles.callButton]}>
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
            <Text style={styles.sectionTitle}>Customer Journey Progress</Text>
            <View style={styles.journeySteps}>
              <View style={styles.journeyStep}>
                <View style={[styles.journeyStepIcon, { backgroundColor: '#10B981' }]}>
                  <User size={16} color="#FFFFFF" />
                </View>
                <View style={styles.journeyStepInfo}>
                  <Text style={styles.journeyStepTitle}>Lead</Text>
                  <Text style={styles.journeyStepDate}>Created Jan 10, 2024</Text>
                </View>
                <View style={styles.journeyStepTag}>
                  <Text style={styles.journeyStepTagText}>New Leads</Text>
                </View>
              </View>
              
              <View style={styles.journeyStep}>
                <View style={[styles.journeyStepIcon, { backgroundColor: '#E5E7EB' }]}>
                  <Target size={16} color="#6B7280" />
                </View>
                <View style={styles.journeyStepInfo}>
                  <Text style={styles.journeyStepTitle}>Opportunities (0)</Text>
                  <Text style={styles.journeyStepDate}>Not started</Text>
                </View>
              </View>
              
              <View style={styles.journeyStep}>
                <View style={[styles.journeyStepIcon, { backgroundColor: '#E5E7EB' }]}>
                  <FileText size={16} color="#6B7280" />
                </View>
                <View style={styles.journeyStepInfo}>
                  <Text style={styles.journeyStepTitle}>Proposals (0)</Text>
                  <Text style={styles.journeyStepDate}>Not started</Text>
                </View>
              </View>
              
              <View style={styles.journeyStep}>
                <View style={[styles.journeyStepIcon, { backgroundColor: '#E5E7EB' }]}>
                  <Building size={16} color="#6B7280" />
                </View>
                <View style={styles.journeyStepInfo}>
                  <Text style={styles.journeyStepTitle}>Jobs (0)</Text>
                  <Text style={styles.journeyStepDate}>Not started</Text>
                </View>
              </View>
            </View>
          </View>
        );
      case 'Activity':
        return (
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>TM</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>→ Moved to New Leads</Text>
                  <Text style={styles.activityUser}>Tanner Mullen</Text>
                  <Text style={styles.activityDate}>Jan 18, 2024, 9:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>TM</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>Updated card details</Text>
                  <Text style={styles.activityUser}>Tanner Mullen</Text>
                  <Text style={styles.activityDate}>Jan 18, 2024, 9:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>S</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>+ Card created</Text>
                  <Text style={styles.activityUser}>System</Text>
                  <Text style={styles.activityDate}>Jan 10, 2024, 5:00 AM</Text>
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
                          <TouchableOpacity style={[styles.communicationButton, styles.callButton]}>
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

      <FloatingActionMenu onNewAppointment={handleNewAppointment} />

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
      <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={handleAppointmentClose}
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
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pullOutIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 8,
  },
  pullOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366F1',
  },
  pullOutArrow: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
