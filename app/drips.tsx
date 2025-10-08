import DripItemModal from '@/components/DripItemModal';
import NewSequenceModal from '@/components/NewSequenceModal';
import SequenceSettingsModal from '@/components/SequenceSettingsModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    BarChart3,
    Clock,
    DollarSign,
    Edit,
    Info,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Send,
    Settings,
    Target,
    Users,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock data types - these would come from your actual types
interface DripSequence {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  trigger: 'created_in_stage' | 'moved_to_stage';
  timingMode: 'previous_action' | 'time_in_stage';
  totalMessages: number;
  totalAutomations: number;
  totalSent: number;
  isDefault?: boolean;
  optOutRules?: any[];
  messages: DripMessage[];
  automations: DripAutomation[];
}

interface DripMessage {
  id: string;
  sequenceId: string;
  type: 'email' | 'text';
  subject?: string;
  content: string;
  delay: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DripAutomation {
  id: string;
  sequenceId: string;
  type: AutomationType;
  delay: number;
  order: number;
  isActive: boolean;
  config?: any;
  createdAt: string;
  updatedAt: string;
}

type AutomationType = 'add_note' | 'create_task' | 'add_discount' | 'add_label' | 'move_stage' | 'ai_followup' | 'send_text' | 'send_email';

type ViewMode = 'sequences' | 'timeline' | 'analytics';

// Mock service - replace with actual service
const mockDripService = {
  getSequencesByStage: (pipeline: string, stage: string) => [
    {
      id: '1',
      name: 'Welcome New Leads',
      description: 'Initial welcome sequence for new leads',
      status: 'active',
      trigger: 'created_in_stage',
      timingMode: 'previous_action',
      totalMessages: 3,
      totalAutomations: 2,
      totalSent: 1247,
      isDefault: true,
      messages: [
        {
          id: 'm1',
          sequenceId: '1',
          type: 'email',
          subject: 'Welcome to our service!',
          content: 'Hi there! Thanks for your interest. We\'re excited to work with you.',
          delay: 0,
          order: 1,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 'm2',
          sequenceId: '1',
          type: 'email',
          subject: 'Quick question for you',
          content: 'Just wanted to follow up and see if you had any questions about our services.',
          delay: 1440,
          order: 2,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 'm3',
          sequenceId: '1',
          type: 'text',
          content: 'Hey! Just checking in - would love to chat about your project.',
          delay: 4320,
          order: 3,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ],
      automations: [
        {
          id: 'a1',
          sequenceId: '1',
          type: 'add_note',
          delay: 60,
          order: 1,
          isActive: true,
          config: { content: 'New lead entered sequence - monitor for responses' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 'a2',
          sequenceId: '1',
          type: 'create_task',
          delay: 10080,
          order: 2,
          isActive: true,
          config: { content: 'Call lead if no response after 1 week' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ]
    },
    {
      id: '2',
      name: 'Follow Up Sequence',
      description: 'Follow up with prospects who showed interest',
      status: 'active',
      trigger: 'moved_to_stage',
      timingMode: 'previous_action',
      totalMessages: 5,
      totalAutomations: 1,
      totalSent: 892,
      messages: [
        {
          id: 'm4',
          sequenceId: '2',
          type: 'email',
          subject: 'Great talking with you!',
          content: 'Thanks for the conversation. Here\'s what we discussed...',
          delay: 0,
          order: 1,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 'm5',
          sequenceId: '2',
          type: 'email',
          subject: 'Additional information',
          content: 'I wanted to share some additional details that might be helpful.',
          delay: 2880,
          order: 2,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ],
      automations: [
        {
          id: 'a3',
          sequenceId: '2',
          type: 'add_label',
          delay: 1440,
          order: 1,
          isActive: true,
          config: { content: 'Add "Hot Lead" label' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ]
    }
  ],
  getSequenceAnalytics: (id: string) => ({
    totalContacts: 150,
    activeContacts: 45,
    completedContacts: 89,
    optedOutContacts: 16,
    averageDeliveryRate: 98.5,
    averageOpenRate: 24.3,
    averageReplyRate: 8.7,
    averageClickRate: 12.1,
    conversionRate: 15.2,
    totalRevenue: 45600,
    averageRevenuePerContact: 304,
    averageTimeToConversion: 72
  })
};

const pipelineConfigs = {
  leads: {
    title: 'Lead Pipeline',
    stages: ['new_leads', 'cold_leads', 'on_hold', 'warm_leads'],
    stageLabels: {
      new_leads: 'New Leads',
      cold_leads: 'Cold Leads', 
      on_hold: 'On Hold',
      warm_leads: 'Warm Leads'
    },
    stageDescriptions: {
      new_leads: 'Fresh leads that need initial contact',
      cold_leads: 'Leads that need nurturing',
      on_hold: 'Leads temporarily paused',
      warm_leads: 'Engaged leads ready to convert'
    }
  },
  opportunities: {
    title: 'Opportunities',
    stages: ['new_opportunities', 'prospecting', 'negotiating', 'closed_won', 'closed_lost'],
    stageLabels: {
      new_opportunities: 'New Opportunities',
      prospecting: 'Prospecting',
      negotiating: 'Negotiating',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost'
    },
    stageDescriptions: {
      new_opportunities: 'New business opportunities identified',
      prospecting: 'Actively prospecting and qualifying',
      negotiating: 'In negotiation phase',
      closed_won: 'Successfully closed deals',
      closed_lost: 'Lost opportunities'
    }
  },
  proposals: {
    title: 'Proposals',
    stages: ['draft', 'sent', 'reviewed', 'accepted', 'rejected'],
    stageLabels: {
      draft: 'Draft',
      sent: 'Sent',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected'
    },
    stageDescriptions: {
      draft: 'Proposal being drafted',
      sent: 'Proposal sent to client',
      reviewed: 'Client is reviewing',
      accepted: 'Proposal accepted',
      rejected: 'Proposal rejected'
    }
  },
  jobs: {
    title: 'Jobs',
    stages: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    stageLabels: {
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    stageDescriptions: {
      scheduled: 'Jobs scheduled for future',
      in_progress: 'Jobs currently being worked on',
      completed: 'Successfully completed jobs',
      cancelled: 'Cancelled jobs'
    }
  }
};

export default function DripsScreen() {
  const router = useRouter();
  const { setIsTransparent } = useTabBar();
  const [selectedPipeline, setSelectedPipeline] = useState('leads');
  const [selectedStage, setSelectedStage] = useState('new_leads');
  const [sequences, setSequences] = useState<DripSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<DripSequence | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('sequences');
  const [showNewSequenceModal, setShowNewSequenceModal] = useState(false);
  const [showSequenceSettings, setShowSequenceSettings] = useState(false);
  const [showDripItemModal, setShowDripItemModal] = useState(false);
  const [dripItemModalMode, setDripItemModalMode] = useState<'add-item' | 'add-delay'>('add-item');
  const [dripItemModalPrefillDelay, setDripItemModalPrefillDelay] = useState(60);

  useEffect(() => {
    loadSequences();
  }, [selectedPipeline, selectedStage]);

  const loadSequences = () => {
    const stageSequences = mockDripService.getSequencesByStage(selectedPipeline, selectedStage);
    setSequences(stageSequences);
  };

  const handleCreateNewSequence = () => {
    setShowNewSequenceModal(true);
  };

  const handleSaveNewSequence = (sequenceData: any) => {
    // Mock save - replace with actual service call
    console.log('Saving new sequence:', sequenceData);
    setShowNewSequenceModal(false);
    loadSequences();
  };

  const handleAddDripItem = (mode: 'add-item' | 'add-delay', prefillDelay: number = 60) => {
    setDripItemModalMode(mode);
    setDripItemModalPrefillDelay(prefillDelay);
    setShowDripItemModal(true);
  };

  const handleSaveDripItem = (itemData: any) => {
    // Mock save - replace with actual service call
    console.log('Saving drip item:', itemData);
    
    if (selectedSequence) {
      // Create new message or automation based on itemData
      if (itemData.type === 'message') {
        const newMessage = {
          id: `m${Date.now()}`,
          sequenceId: selectedSequence.id,
          type: itemData.messageType,
          subject: itemData.subject || undefined,
          content: itemData.content,
          delay: itemData.delay,
          order: selectedSequence.messages.length + 1,
          isActive: itemData.status === 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Update the selected sequence with the new message
        const updatedSequence = {
          ...selectedSequence,
          messages: [...selectedSequence.messages, newMessage],
          totalMessages: selectedSequence.totalMessages + 1,
        };
        
        setSelectedSequence(updatedSequence);
        
        // Also update in sequences list
        setSequences(sequences.map(seq => 
          seq.id === selectedSequence.id ? updatedSequence : seq
        ));
      } else if (itemData.type === 'automation') {
        const newAutomation = {
          id: `a${Date.now()}`,
          sequenceId: selectedSequence.id,
          type: itemData.automationType || 'add_note',
          delay: itemData.delay,
          order: selectedSequence.automations.length + 1,
          isActive: itemData.status === 'active',
          config: itemData.config || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Update the selected sequence with the new automation
        const updatedSequence = {
          ...selectedSequence,
          automations: [...selectedSequence.automations, newAutomation],
          totalAutomations: selectedSequence.totalAutomations + 1,
        };
        
        setSelectedSequence(updatedSequence);
        
        // Also update in sequences list
        setSequences(sequences.map(seq => 
          seq.id === selectedSequence.id ? updatedSequence : seq
        ));
      }
    }
    
    setShowDripItemModal(false);
  };

  const handleSaveSequenceSettings = (updates: any) => {
    // Mock save - replace with actual service call
    console.log('Saving sequence settings:', updates);
    if (selectedSequence) {
      // Update the selected sequence with new data
      setSelectedSequence({
        ...selectedSequence,
        ...updates
      });
      // Also update in the sequences list
      setSequences(sequences.map(seq => 
        seq.id === selectedSequence.id ? { ...seq, ...updates } : seq
      ));
    }
    setShowSequenceSettings(false);
  };

  const handleEditSequence = (sequence: DripSequence) => {
    setSelectedSequence(sequence);
    setViewMode('timeline');
  };

  const handleViewAnalytics = (sequence: DripSequence) => {
    setSelectedSequence(sequence);
    setViewMode('analytics');
  };

  const handleBackToSequences = () => {
    setSelectedSequence(null);
    setViewMode('sequences');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => {
          if (selectedSequence) {
            handleBackToSequences();
          } else {
            router.back();
          }
        }}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Drip Sequences</Text>
        <Text style={styles.headerSubtitle}>
          {selectedSequence ? selectedSequence.name : 'Automate your communication'}
        </Text>
      </View>
    </View>
  );

  const renderPipelineSelector = () => (
    <View style={styles.pipelineSelector}>
      <Text style={styles.sectionTitle}>Pipeline</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pipelineScroll}>
        {Object.entries(pipelineConfigs).map(([key, config]) => {
          const getPipelineStyle = (pipelineKey: string, isSelected: boolean) => {
            switch (pipelineKey) {
              case 'leads':
                return {
                  borderColor: isSelected ? '#3B82F6' : '#93C5FD',
                  backgroundColor: isSelected ? '#DBEAFE' : '#EFF6FF',
                  textColor: isSelected ? '#1E40AF' : '#3B82F6'
                };
              case 'opportunities':
                return {
                  borderColor: isSelected ? '#10B981' : '#6EE7B7',
                  backgroundColor: isSelected ? '#D1FAE5' : '#ECFDF5',
                  textColor: isSelected ? '#047857' : '#10B981'
                };
              case 'proposals':
                return {
                  borderColor: isSelected ? '#8B5CF6' : '#A78BFA',
                  backgroundColor: isSelected ? '#EDE9FE' : '#F3F4F6',
                  textColor: isSelected ? '#6D28D9' : '#8B5CF6'
                };
              case 'jobs':
                return {
                  borderColor: isSelected ? '#F59E0B' : '#FCD34D',
                  backgroundColor: isSelected ? '#FEF3C7' : '#FFFBEB',
                  textColor: isSelected ? '#D97706' : '#F59E0B'
                };
              default:
                return {
                  borderColor: isSelected ? '#6B7280' : '#D1D5DB',
                  backgroundColor: isSelected ? '#F3F4F6' : '#F9FAFB',
                  textColor: isSelected ? '#374151' : '#6B7280'
                };
            }
          };

          const isSelected = selectedPipeline === key;
          const pipelineStyle = getPipelineStyle(key, isSelected);
          
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                setSelectedPipeline(key);
                setSelectedSequence(null);
                setViewMode('sequences');
                // Reset to first stage of selected pipeline
                const firstStage = config.stages[0];
                setSelectedStage(firstStage);
              }}
              style={[
                styles.pipelineButton,
                {
                  borderColor: pipelineStyle.borderColor,
                  backgroundColor: pipelineStyle.backgroundColor,
                }
              ]}
            >
              <Text style={[
                styles.pipelineButtonText,
                {
                  color: pipelineStyle.textColor,
                  fontWeight: isSelected ? '600' : '500'
                }
              ]}>
                {config.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStageSelector = () => {
    const currentPipeline = pipelineConfigs[selectedPipeline];
    if (!currentPipeline) return null;

    return (
      <View style={styles.stageSelector}>
        <Text style={styles.sectionTitle}>
          {currentPipeline.title} Stages
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageScroll}>
          {currentPipeline.stages.map(stage => {
            const stageLabel = currentPipeline.stageLabels[stage];
            const stageDescription = currentPipeline.stageDescriptions[stage];
            const stageSequences = mockDripService.getSequencesByStage(selectedPipeline, stage);
            
            return (
              <TouchableOpacity
                key={stage}
                onPress={() => {
                  setSelectedStage(stage);
                  setSelectedSequence(null);
                  setViewMode('sequences');
                }}
                style={[
                  styles.stageButton,
                  selectedStage === stage && styles.stageButtonActive
                ]}
              >
                <View style={styles.stageButtonContent}>
                  <Text style={[
                    styles.stageButtonText,
                    selectedStage === stage && styles.stageButtonTextActive
                  ]}>
                    {stageLabel}
                  </Text>
                  <View style={styles.stageBadge}>
                    <Text style={styles.stageBadgeText}>{stageSequences.length}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.stageDescription,
                  selectedStage === stage && styles.stageDescriptionActive
                ]} numberOfLines={1}>
                  {stageDescription}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderSequencesList = () => (
    <View style={styles.sequencesList}>
      {/* Sequences Header */}
      <View style={styles.sequencesHeader}>
        <View style={styles.sequencesHeaderContent}>
          <Text style={styles.sequencesTitle}>
            {pipelineConfigs[selectedPipeline]?.stageLabels[selectedStage]} Sequences
          </Text>
          <Text style={styles.sequencesSubtitle}>
            {sequences.length} sequences configured
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.newSequenceButton}
          onPress={handleCreateNewSequence}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newSequenceButtonText}>New Sequence</Text>
        </TouchableOpacity>
      </View>

      {/* Helper Text */}
      <View style={styles.helperTextContainer}>
        <Info size={16} color="#6366F1" />
        <Text style={styles.helperText}>
          These automations send when a card enters this stage
        </Text>
      </View>

      {sequences.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MessageSquare size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No sequences configured</Text>
          <Text style={styles.emptySubtitle}>
            Create your first drip sequence to start automating your customer communication
          </Text>
          <TouchableOpacity 
            onPress={handleCreateNewSequence}
            style={styles.createFirstButton}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createFirstButtonText}>Create First Sequence</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {sequences.map(sequence => {
            const analytics = mockDripService.getSequenceAnalytics(sequence.id);
            return (
              <TouchableOpacity
                key={sequence.id}
                style={styles.sequenceCard}
                onPress={() => handleEditSequence(sequence)}
              >
                <View style={styles.sequenceHeader}>
                  <View style={styles.sequenceInfo}>
                    <Text style={styles.sequenceName}>{sequence.name}</Text>
                    <View style={styles.sequenceBadges}>
                      <View style={[
                        styles.statusBadge,
                        sequence.status === 'active' ? styles.statusBadgeActive : styles.statusBadgePaused
                      ]}>
                        <Text style={[
                          styles.statusBadgeText,
                          sequence.status === 'active' ? styles.statusBadgeTextActive : styles.statusBadgeTextPaused
                        ]}>
                          {sequence.status}
                        </Text>
                      </View>
                      {sequence.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.sequenceMenu}>
                    <MoreHorizontal size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {sequence.description && (
                  <Text style={styles.sequenceDescription}>{sequence.description}</Text>
                )}

                <View style={styles.sequenceStats}>
                  <View style={styles.statItem}>
                    <MessageSquare size={16} color="#6B7280" />
                    <Text style={styles.statText}>{sequence.totalMessages} messages</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Zap size={16} color="#6B7280" />
                    <Text style={styles.statText}>{sequence.totalAutomations} automations</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Send size={16} color="#6B7280" />
                    <Text style={styles.statText}>{sequence.totalSent.toLocaleString()} sent</Text>
                  </View>
                </View>

                {analytics && (
                  <View style={styles.analyticsPreview}>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Open Rate</Text>
                      <Text style={styles.analyticsValue}>{analytics.averageOpenRate.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Reply Rate</Text>
                      <Text style={styles.analyticsValue}>{analytics.averageReplyRate.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Conversion</Text>
                      <Text style={styles.analyticsValue}>{analytics.conversionRate.toFixed(1)}%</Text>
                    </View>
                  </View>
                )}

                <View style={styles.sequenceActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleViewAnalytics(sequence)}
                  >
                    <BarChart3 size={16} color="#6366F1" />
                    <Text style={styles.actionButtonText}>Analytics</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => handleEditSequence(sequence)}
                  >
                    <Edit size={16} color="#FFFFFF" />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  const renderTimelineView = () => {
    if (!selectedSequence) return null;

    return (
      <View style={styles.timelineView}>
        <View style={styles.timelineHeader}>
          <View style={styles.timelineInfo}>
            <Text style={styles.timelineTitle}>{selectedSequence.name}</Text>
            <Text style={styles.timelineSubtitle}>{selectedSequence.description}</Text>
          </View>
          <TouchableOpacity 
            style={styles.timelineSettings}
            onPress={() => setShowSequenceSettings(true)}
          >
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.timelineContent} showsVerticalScrollIndicator={false}>
          {/* Sequence Info Cards */}
          <View style={styles.sequenceInfoCards}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Zap size={16} color="#3B82F6" />
                <Text style={styles.infoCardTitle}>Trigger</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedSequence.trigger === 'created_in_stage' ? 'Created in stage' : 'Moved to stage'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Clock size={16} color="#10B981" />
                <Text style={styles.infoCardTitle}>Timing</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedSequence.timingMode === 'previous_action' ? 'Sequential' : 'Absolute'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Send size={16} color="#F59E0B" />
                <Text style={styles.infoCardTitle}>Status</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedSequence.status === 'active' ? 'Active' : 'Paused'}
              </Text>
            </View>
          </View>

          {/* Timeline Items */}
          <View style={styles.timelineItems}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineItemHeader}>
                <View style={styles.timelineItemIcon}>
                  <Zap size={20} color="#6366F1" />
                </View>
                <View style={styles.timelineItemInfo}>
                  <Text style={styles.timelineItemTitle}>Sequence Start</Text>
                  <Text style={styles.timelineItemSubtitle}>When contact enters stage</Text>
                </View>
                <View style={styles.timelineItemBadge}>
                  <Text style={styles.timelineItemBadgeText}>Day 1</Text>
                </View>
              </View>
            </View>

            {/* Existing Messages and Automations */}
            {selectedSequence.messages.map((message, index) => (
              <View key={`message-${message.id}`} style={styles.timelineItem}>
                <View style={styles.timelineItemHeader}>
                  <View style={[styles.timelineItemIcon, { backgroundColor: message.type === 'email' ? '#DBEAFE' : '#D1FAE5' }]}>
                    {message.type === 'email' ? (
                      <Mail size={20} color="#3B82F6" />
                    ) : (
                      <Send size={20} color="#10B981" />
                    )}
                  </View>
                  <View style={styles.timelineItemInfo}>
                    <View style={styles.timelineItemTitleRow}>
                      <Text style={styles.timelineItemTitle}>
                        {message.type === 'email' ? 'Email' : 'Text'}: {message.subject || 'Message'}
                      </Text>
                      <View style={[
                        styles.itemStatusBadge,
                        message.isActive ? styles.itemStatusBadgeActive : styles.itemStatusBadgeDraft
                      ]}>
                        <Text style={[
                          styles.itemStatusText,
                          message.isActive ? styles.itemStatusTextActive : styles.itemStatusTextDraft
                        ]}>
                          {message.isActive ? 'Active' : 'Draft'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.timelineItemSubtitle} numberOfLines={2}>
                      {message.content}
                    </Text>
                  </View>
                  <View style={styles.timelineItemActions}>
                    <View style={styles.timelineItemBadge}>
                      <Text style={styles.timelineItemBadgeText}>
                        {message.delay === 0 ? 'Immediate' : 
                         message.delay < 60 ? `${message.delay}m` :
                         message.delay < 1440 ? `${Math.floor(message.delay / 60)}h` :
                         `${Math.floor(message.delay / 1440)}d`}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.timelineItemMenu}>
                      <MoreHorizontal size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {selectedSequence.automations.map((automation, index) => {
              const getAutomationLabel = (type: string) => {
                const labels: Record<string, string> = {
                  'send_text': 'Send Text Message',
                  'send_email': 'Send Email',
                  'add_note': 'Add Note',
                  'create_task': 'Create Task',
                  'add_discount': 'Add Discount to Proposal',
                  'ai_followup': 'AI Follow-up',
                  'add_label': 'Add Label',
                  'move_stage': 'Move to Stage',
                  'change_pipeline': 'Change Pipeline',
                };
                return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              };

              const getAutomationDescription = (automation: DripAutomation) => {
                if (automation.type === 'send_text' || automation.type === 'send_email') {
                  return automation.config?.content || 'Message content';
                }
                if (automation.type === 'add_note') {
                  return automation.config?.noteContent || 'Note content';
                }
                if (automation.type === 'create_task') {
                  return automation.config?.taskName || 'Task name';
                }
                if (automation.type === 'add_discount') {
                  return `${automation.config?.discountValue || 0}${automation.config?.discountType === 'percentage' ? '%' : '$'} discount`;
                }
                return automation.config?.content || 'Automated action';
              };

              return (
                <View key={`automation-${automation.id}`} style={styles.timelineItem}>
                  <View style={styles.timelineItemHeader}>
                    <View style={[styles.timelineItemIcon, { backgroundColor: '#FEF3C7' }]}>
                      <Zap size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.timelineItemInfo}>
                      <View style={styles.timelineItemTitleRow}>
                        <Text style={styles.timelineItemTitle}>
                          {getAutomationLabel(automation.type)}
                        </Text>
                        <View style={[
                          styles.itemStatusBadge,
                          automation.isActive ? styles.itemStatusBadgeActive : styles.itemStatusBadgeDraft
                        ]}>
                          <Text style={[
                            styles.itemStatusText,
                            automation.isActive ? styles.itemStatusTextActive : styles.itemStatusTextDraft
                          ]}>
                            {automation.isActive ? 'Active' : 'Draft'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.timelineItemSubtitle}>
                        {getAutomationDescription(automation)}
                      </Text>
                    </View>
                    <View style={styles.timelineItemActions}>
                      <View style={styles.timelineItemBadge}>
                        <Text style={styles.timelineItemBadgeText}>
                          {automation.delay === 0 ? 'Immediate' : 
                           automation.delay < 60 ? `${automation.delay}m` :
                           automation.delay < 1440 ? `${Math.floor(automation.delay / 60)}h` :
                           `${Math.floor(automation.delay / 1440)}d`}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.timelineItemMenu}>
                        <MoreHorizontal size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Add Item Buttons */}
            <View style={styles.addItemSection}>
              <View style={styles.addItemHeader}>
                <Text style={styles.addItemTitle}>Add to Sequence</Text>
                <Text style={styles.addItemSubtitle}>Select one of the options below to add to your sequence</Text>
              </View>
              <View style={styles.addItemButtons}>
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={() => handleAddDripItem('add-item', 60)}
                >
                  <View style={[styles.addItemButtonIcon, { backgroundColor: '#DBEAFE' }]}>
                    <MessageSquare size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.addItemButtonText}>Message</Text>
                  <Text style={styles.addItemButtonDesc}>Send email or text</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={() => handleAddDripItem('add-item', 60)}
                >
                  <View style={[styles.addItemButtonIcon, { backgroundColor: '#D1FAE5' }]}>
                    <Zap size={20} color="#10B981" />
                  </View>
                  <Text style={styles.addItemButtonText}>Automation</Text>
                  <Text style={styles.addItemButtonDesc}>Create tasks or notes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={() => handleAddDripItem('add-delay', 1440)}
                >
                  <View style={[styles.addItemButtonIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Clock size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.addItemButtonText}>Delay</Text>
                  <Text style={styles.addItemButtonDesc}>Wait before next</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Section */}
            <View style={styles.timelineHelp}>
              <View style={styles.timelineHelpHeader}>
                <Info size={16} color="#6366F1" />
                <Text style={styles.timelineHelpTitle}>Building Your Sequence</Text>
              </View>
              <Text style={styles.timelineHelpText}>
                Start with a welcome message, then add follow-ups every 1-3 days. 
                Use automations to create tasks for your team when leads show interest.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderAnalyticsView = () => {
    if (!selectedSequence) return null;

    const analytics = mockDripService.getSequenceAnalytics(selectedSequence.id);

    return (
      <View style={styles.analyticsView}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>Analytics: {selectedSequence.name}</Text>
          <Text style={styles.analyticsSubtitle}>Comprehensive tracking and performance metrics</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Users size={20} color="#3B82F6" />
                <Text style={styles.metricTitle}>Total Contacts</Text>
              </View>
              <Text style={styles.metricValue}>{analytics.totalContacts}</Text>
              <Text style={styles.metricSubtext}>
                {analytics.activeContacts} active, {analytics.completedContacts} completed
              </Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Target size={20} color="#10B981" />
                <Text style={styles.metricTitle}>Delivery Rate</Text>
              </View>
              <Text style={styles.metricValue}>{analytics.averageDeliveryRate.toFixed(1)}%</Text>
              <Text style={styles.metricSubtext}>Average across all messages</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <BarChart3 size={20} color="#8B5CF6" />
                <Text style={styles.metricTitle}>Open Rate</Text>
              </View>
              <Text style={styles.metricValue}>{analytics.averageOpenRate.toFixed(1)}%</Text>
              <Text style={styles.metricSubtext}>Average across all messages</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <DollarSign size={20} color="#F59E0B" />
                <Text style={styles.metricTitle}>Revenue</Text>
              </View>
              <Text style={styles.metricValue}>${analytics.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.metricSubtext}>${analytics.averageRevenuePerContact} per contact</Text>
            </View>
          </View>

          {/* Performance Overview */}
          <View style={styles.performanceOverview}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceItem}>
                <View style={styles.performanceItemHeader}>
                  <View style={styles.performanceIcon}>
                    <MessageSquare size={16} color="#10B981" />
                  </View>
                  <Text style={styles.performanceLabel}>Reply Rate</Text>
                </View>
                <Text style={styles.performanceValue}>{analytics.averageReplyRate.toFixed(1)}%</Text>
              </View>

              <View style={styles.performanceItem}>
                <View style={styles.performanceItemHeader}>
                  <View style={styles.performanceIcon}>
                    <Send size={16} color="#3B82F6" />
                  </View>
                  <Text style={styles.performanceLabel}>Click Rate</Text>
                </View>
                <Text style={styles.performanceValue}>{analytics.averageClickRate.toFixed(1)}%</Text>
              </View>

              <View style={styles.performanceItem}>
                <View style={styles.performanceItemHeader}>
                  <View style={styles.performanceIcon}>
                    <Target size={16} color="#8B5CF6" />
                  </View>
                  <Text style={styles.performanceLabel}>Conversion</Text>
                </View>
                <Text style={styles.performanceValue}>{analytics.conversionRate.toFixed(1)}%</Text>
              </View>

              <View style={styles.performanceItem}>
                <View style={styles.performanceItemHeader}>
                  <View style={styles.performanceIcon}>
                    <Clock size={16} color="#F59E0B" />
                  </View>
                  <Text style={styles.performanceLabel}>Avg Time</Text>
                </View>
                <Text style={styles.performanceValue}>{Math.round(analytics.averageTimeToConversion / 24)}d</Text>
              </View>
            </View>
          </View>

          {/* Contact Status Breakdown */}
          <View style={styles.contactStatus}>
            <Text style={styles.sectionTitle}>Contact Status</Text>
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <View style={styles.statusItemHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.statusLabel}>Active</Text>
                </View>
                <Text style={styles.statusValue}>{analytics.activeContacts}</Text>
              </View>

              <View style={styles.statusItem}>
                <View style={styles.statusItemHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.statusLabel}>Completed</Text>
                </View>
                <Text style={styles.statusValue}>{analytics.completedContacts}</Text>
              </View>

              <View style={styles.statusItem}>
                <View style={styles.statusItemHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.statusLabel}>Opted Out</Text>
                </View>
                <Text style={styles.statusValue}>{analytics.optedOutContacts}</Text>
              </View>

              <View style={styles.statusItem}>
                <View style={styles.statusItemHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.statusLabel}>Success Rate</Text>
                </View>
                <Text style={styles.statusValue}>
                  {((analytics.completedContacts / analytics.totalContacts) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <BarChart3 size={16} color="#6366F1" />
                <Text style={styles.actionButtonText}>Export Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Settings size={16} color="#6366F1" />
                <Text style={styles.actionButtonText}>Sequence Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderViewModeTabs = () => {
    if (!selectedSequence) return null;

    return (
      <View style={styles.viewModeTabs}>
        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === 'timeline' && styles.viewModeTabActive
          ]}
          onPress={() => setViewMode('timeline')}
        >
          <Text style={[
            styles.viewModeTabText,
            viewMode === 'timeline' && styles.viewModeTabTextActive
          ]}>
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === 'analytics' && styles.viewModeTabActive
          ]}
          onPress={() => setViewMode('analytics')}
        >
          <Text style={[
            styles.viewModeTabText,
            viewMode === 'analytics' && styles.viewModeTabTextActive
          ]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.background}
      >
        {renderHeader()}
        
        {!selectedSequence && (
          <>
            {renderPipelineSelector()}
            {renderStageSelector()}
          </>
        )}

        {selectedSequence && renderViewModeTabs()}

        <View style={styles.content}>
          {selectedSequence ? (
            viewMode === 'timeline' ? renderTimelineView() : 
            viewMode === 'analytics' ? renderAnalyticsView() : 
            renderSequencesList()
          ) : renderSequencesList()}
        </View>

        {/* New Sequence Modal */}
        <NewSequenceModal
          isOpen={showNewSequenceModal}
          onClose={() => setShowNewSequenceModal(false)}
          onSave={handleSaveNewSequence}
          initialPipeline={selectedPipeline}
          initialStage={selectedStage}
        />

        {/* Drip Item Modal */}
        <DripItemModal
          isOpen={showDripItemModal}
          onClose={() => setShowDripItemModal(false)}
          onSave={handleSaveDripItem}
          mode={dripItemModalMode}
          prefillDelay={dripItemModalPrefillDelay}
        />

        {/* Sequence Settings Modal */}
        <SequenceSettingsModal
          visible={showSequenceSettings}
          onClose={() => setShowSequenceSettings(false)}
          sequence={selectedSequence}
          onSave={handleSaveSequenceSettings}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
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
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
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
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pipelineSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  pipelineScroll: {
    flexDirection: 'row',
  },
  pipelineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  pipelineButtonActive: {
    backgroundColor: '#6366F1',
  },
  pipelineButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  pipelineButtonTextActive: {
    color: '#FFFFFF',
  },
  stageSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stageScroll: {
    flexDirection: 'row',
  },
  stageButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stageButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  stageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  stageButtonTextActive: {
    color: '#FFFFFF',
  },
  stageDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  stageDescriptionActive: {
    color: '#E0E7FF',
  },
  stageBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  content: {
    flex: 1,
  },
  sequencesList: {
    flex: 1,
    padding: 20,
  },
  sequencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sequencesHeaderContent: {
    flex: 1,
  },
  sequencesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sequencesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  helperTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 10,
  },
  helperText: {
    fontSize: 14,
    color: '#0369A1',
    flex: 1,
    lineHeight: 20,
  },
  newSequenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newSequenceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sequenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sequenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sequenceInfo: {
    flex: 1,
  },
  sequenceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sequenceBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgePaused: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadgeTextActive: {
    color: '#065F46',
  },
  statusBadgeTextPaused: {
    color: '#92400E',
  },
  defaultBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sequenceMenu: {
    padding: 4,
  },
  sequenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  sequenceStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  analyticsPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  analyticsValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  sequenceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  actionButtonPrimary: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 6,
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },
  viewModeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  viewModeTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewModeTabActive: {
    backgroundColor: '#6366F1',
  },
  viewModeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  viewModeTabTextActive: {
    color: '#FFFFFF',
  },
  timelineView: {
    flex: 1,
    padding: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  timelineSettings: {
    padding: 8,
  },
  timelineContent: {
    flex: 1,
  },
  sequenceInfoCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  infoCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timelineItems: {
    gap: 16,
  },
  timelineItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineItemInfo: {
    flex: 1,
  },
  timelineItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timelineItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  timelineItemBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timelineItemBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  timelineItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineItemMenu: {
    padding: 4,
  },
  timelineItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 8,
  },
  itemStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemStatusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  itemStatusBadgeDraft: {
    backgroundColor: '#FEF3C7',
  },
  itemStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  itemStatusTextActive: {
    color: '#065F46',
  },
  itemStatusTextDraft: {
    color: '#92400E',
  },
  addItemSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  addItemHeader: {
    marginBottom: 16,
  },
  addItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  addItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  addItemButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addItemButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  addItemButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addItemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  addItemButtonDesc: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  timelineHelp: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  timelineHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineHelpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginLeft: 6,
  },
  timelineHelpText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  analyticsView: {
    flex: 1,
    padding: 20,
  },
  analyticsHeader: {
    marginBottom: 24,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  performanceOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceItem: {
    width: (screenWidth - 68) / 2,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performanceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contactStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    width: (screenWidth - 68) / 2,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalSave: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPlaceholder: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
