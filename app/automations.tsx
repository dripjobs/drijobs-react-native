import AutomationSettingsModal from '@/components/AutomationSettingsModal';
import AutomationStepModal from '@/components/AutomationStepModal';
import NewAutomationModal from '@/components/NewAutomationModal';
import { useTabBar } from '@/contexts/TabBarContext';
import AutomationsService from '@/services/AutomationsService';
import { AutomationWorkflow } from '@/types/automations';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Info,
    MessageSquare,
    MoreHorizontal,
    Pause,
    Play,
    Plus,
    Settings,
    Target,
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

type ViewMode = 'list' | 'timeline' | 'analytics';

export default function AutomationsScreen() {
  const router = useRouter();
  const { setIsTransparent } = useTabBar();
  const [automations, setAutomations] = useState<AutomationWorkflow[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationWorkflow | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showNewAutomationModal, setShowNewAutomationModal] = useState(false);
  const [showAutomationSettings, setShowAutomationSettings] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [stepModalMode, setStepModalMode] = useState<'add-step' | 'add-delay'>('add-step');
  const [stepModalPrefillDelay, setStepModalPrefillDelay] = useState(60);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = () => {
    const allAutomations = AutomationsService.getAllAutomations();
    setAutomations(allAutomations);
  };

  const handleCreateNewAutomation = () => {
    setShowNewAutomationModal(true);
  };

  const handleSaveNewAutomation = (automationData: any) => {
    console.log('Saving new automation:', automationData);
    setShowNewAutomationModal(false);
    loadAutomations();
  };

  const handleAddStep = (mode: 'add-step' | 'add-delay', prefillDelay: number = 60) => {
    setStepModalMode(mode);
    setStepModalPrefillDelay(prefillDelay);
    setShowStepModal(true);
  };

  const handleSaveStep = (stepData: any) => {
    console.log('Saving automation step:', stepData);
    setShowStepModal(false);
  };

  const handleSaveAutomationSettings = (updates: any) => {
    console.log('Saving automation settings:', updates);
    if (selectedAutomation) {
      const updatedAutomation = AutomationsService.updateAutomation(selectedAutomation.id, updates);
      if (updatedAutomation) {
        setSelectedAutomation(updatedAutomation);
        setAutomations(automations.map(auto => 
          auto.id === selectedAutomation.id ? updatedAutomation : auto
        ));
      }
    }
    setShowAutomationSettings(false);
  };

  const handleEditAutomation = (automation: AutomationWorkflow) => {
    setSelectedAutomation(automation);
    setViewMode('timeline');
  };

  const handleViewAnalytics = (automation: AutomationWorkflow) => {
    setSelectedAutomation(automation);
    setViewMode('analytics');
  };

  const handleBackToList = () => {
    setSelectedAutomation(null);
    setViewMode('list');
  };

  const handleToggleAutomation = (automation: AutomationWorkflow) => {
    const newStatus = automation.status === 'active' ? 'paused' : 'active';
    const updatedAutomation = AutomationsService.updateAutomation(automation.id, { 
      status: newStatus,
      isActive: newStatus === 'active'
    });
    if (updatedAutomation) {
      setAutomations(automations.map(auto => 
        auto.id === automation.id ? updatedAutomation : auto
      ));
      if (selectedAutomation?.id === automation.id) {
        setSelectedAutomation(updatedAutomation);
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => {
          if (selectedAutomation) {
            handleBackToList();
          } else {
            router.back();
          }
        }}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Automations</Text>
        <Text style={styles.headerSubtitle}>
          {selectedAutomation ? selectedAutomation.name : 'Automate your internal operations'}
        </Text>
      </View>
    </View>
  );

  const renderAutomationsList = () => (
    <View style={styles.automationsList}>
      {/* Automations Header */}
      <View style={styles.automationsHeader}>
        <View style={styles.automationsHeaderContent}>
          <Text style={styles.automationsTitle}>Automation Workflows</Text>
          <Text style={styles.automationsSubtitle}>
            {automations.length} automations configured
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.newAutomationButton}
          onPress={handleCreateNewAutomation}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newAutomationButtonText}>New Automation</Text>
        </TouchableOpacity>
      </View>

      {/* Helper Text */}
      <View style={styles.helperTextContainer}>
        <Info size={16} color="#6366F1" />
        <Text style={styles.helperText}>
          These automations run when specific events occur in your pipelines
        </Text>
      </View>

      {automations.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Zap size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No automations configured</Text>
          <Text style={styles.emptySubtitle}>
            Create your first automation to start streamlining your internal operations
          </Text>
          <TouchableOpacity 
            onPress={handleCreateNewAutomation}
            style={styles.createFirstButton}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createFirstButtonText}>Create First Automation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {automations.map(automation => {
            const analytics = AutomationsService.getAutomationAnalytics(automation.id);
            return (
              <TouchableOpacity
                key={automation.id}
                style={styles.automationCard}
                onPress={() => handleEditAutomation(automation)}
              >
                <View style={styles.automationHeader}>
                  <View style={styles.automationInfo}>
                    <Text style={styles.automationName}>{automation.name}</Text>
                    <View style={styles.automationBadges}>
                      <View style={[
                        styles.statusBadge,
                        automation.status === 'active' ? styles.statusBadgeActive : 
                        automation.status === 'paused' ? styles.statusBadgePaused : styles.statusBadgeDraft
                      ]}>
                        <Text style={[
                          styles.statusBadgeText,
                          automation.status === 'active' ? styles.statusBadgeTextActive : 
                          automation.status === 'paused' ? styles.statusBadgeTextPaused : styles.statusBadgeTextDraft
                        ]}>
                          {automation.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.automationMenu}
                    onPress={() => handleToggleAutomation(automation)}
                  >
                    {automation.status === 'active' ? (
                      <Pause size={20} color="#6B7280" />
                    ) : (
                      <Play size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>

                {automation.description && (
                  <Text style={styles.automationDescription}>{automation.description}</Text>
                )}

                <View style={styles.automationStats}>
                  <View style={styles.statItem}>
                    <Zap size={16} color="#6B7280" />
                    <Text style={styles.statText}>{automation.actions.length} actions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Target size={16} color="#6B7280" />
                    <Text style={styles.statText}>{automation.totalExecutions} runs</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.statText}>
                      {automation.lastExecuted ? 'Last run: ' + new Date(automation.lastExecuted).toLocaleDateString() : 'Never run'}
                    </Text>
                  </View>
                </View>

                {analytics && (
                  <View style={styles.analyticsPreview}>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Success Rate</Text>
                      <Text style={styles.analyticsValue}>
                        {analytics.totalExecutions > 0 ? 
                          ((analytics.successfulExecutions / analytics.totalExecutions) * 100).toFixed(1) : 0}%
                      </Text>
                    </View>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Avg Time</Text>
                      <Text style={styles.analyticsValue}>{analytics.averageExecutionTime.toFixed(1)}m</Text>
                    </View>
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>Trigger</Text>
                      <Text style={styles.analyticsValue}>
                        {automation.trigger.pipeline} - {automation.trigger.stage}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.automationActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleViewAnalytics(automation)}
                  >
                    <BarChart3 size={16} color="#6366F1" />
                    <Text style={styles.actionButtonText}>Analytics</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => handleEditAutomation(automation)}
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
    if (!selectedAutomation) return null;

    return (
      <View style={styles.timelineView}>
        <View style={styles.timelineHeader}>
          <View style={styles.timelineInfo}>
            <Text style={styles.timelineTitle}>{selectedAutomation.name}</Text>
            <Text style={styles.timelineSubtitle}>{selectedAutomation.description}</Text>
          </View>
          <TouchableOpacity 
            style={styles.timelineSettings}
            onPress={() => setShowAutomationSettings(true)}
          >
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.timelineContent} showsVerticalScrollIndicator={false}>
          {/* Automation Info Cards */}
          <View style={styles.automationInfoCards}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Zap size={16} color="#3B82F6" />
                <Text style={styles.infoCardTitle}>Trigger</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedAutomation.trigger.pipeline} - {selectedAutomation.trigger.stage}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Target size={16} color="#10B981" />
                <Text style={styles.infoCardTitle}>Filters</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedAutomation.filters.length} condition{selectedAutomation.filters.length !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Play size={16} color="#F59E0B" />
                <Text style={styles.infoCardTitle}>Status</Text>
              </View>
              <Text style={styles.infoCardText}>
                {selectedAutomation.status === 'active' ? 'Active' : 
                 selectedAutomation.status === 'paused' ? 'Paused' : 'Draft'}
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
                  <Text style={styles.timelineItemTitle}>Automation Start</Text>
                  <Text style={styles.timelineItemSubtitle}>When trigger conditions are met</Text>
                </View>
                <View style={styles.timelineItemBadge}>
                  <Text style={styles.timelineItemBadgeText}>Trigger</Text>
                </View>
              </View>
            </View>

            {/* Existing Actions */}
            {selectedAutomation.actions.map((action, index) => {
              const getActionLabel = (type: string) => {
                const labels: Record<string, string> = {
                  'create_team_chat_channel': 'Create Team Chat Channel',
                  'send_team_chat_message': 'Send Team Chat Message',
                  'create_task': 'Create Task',
                  'send_text_message': 'Send Text Message',
                  'send_email': 'Send Email',
                  'delay': 'Delay',
                  'find_team_chat_channel': 'Find Team Chat Channel',
                  'add_note': 'Add Note',
                  'update_stage': 'Update Stage',
                  'assign_user': 'Assign User'
                };
                return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              };

              const getActionDescription = (action: any) => {
                if (action.type === 'create_team_chat_channel') {
                  return action.config?.channelName || 'Create team chat channel';
                }
                if (action.type === 'send_team_chat_message') {
                  return action.config?.message || 'Send message to team chat';
                }
                if (action.type === 'create_task') {
                  return action.config?.taskName || 'Create task';
                }
                if (action.type === 'send_text_message') {
                  return `Send text to ${action.config?.recipientType || 'recipient'}`;
                }
                if (action.type === 'delay') {
                  return `Wait ${action.config?.delayDays || 0} days`;
                }
                return action.config?.content || 'Automated action';
              };

              return (
                <View key={`action-${action.id}`} style={styles.timelineItem}>
                  <View style={styles.timelineItemHeader}>
                    <View style={[styles.timelineItemIcon, { backgroundColor: '#FEF3C7' }]}>
                      <Zap size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.timelineItemInfo}>
                      <View style={styles.timelineItemTitleRow}>
                        <Text style={styles.timelineItemTitle}>
                          {getActionLabel(action.type)}
                        </Text>
                        <View style={[
                          styles.itemStatusBadge,
                          action.isActive ? styles.itemStatusBadgeActive : styles.itemStatusBadgeDraft
                        ]}>
                          <Text style={[
                            styles.itemStatusText,
                            action.isActive ? styles.itemStatusTextActive : styles.itemStatusTextDraft
                          ]}>
                            {action.isActive ? 'Active' : 'Draft'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.timelineItemSubtitle}>
                        {getActionDescription(action)}
                      </Text>
                    </View>
                    <View style={styles.timelineItemActions}>
                      <View style={styles.timelineItemBadge}>
                        <Text style={styles.timelineItemBadgeText}>
                          {action.delay === 0 ? 'Immediate' : 
                           action.delay < 60 ? `${action.delay}m` :
                           action.delay < 1440 ? `${Math.floor(action.delay / 60)}h` :
                           `${Math.floor(action.delay / 1440)}d`}
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

            {/* Add Step Buttons */}
            <View style={styles.addStepSection}>
              <View style={styles.addStepHeader}>
                <Text style={styles.addStepTitle}>Add to Automation</Text>
                <Text style={styles.addStepSubtitle}>Select one of the options below to add to your automation</Text>
              </View>
              <View style={styles.addStepButtons}>
                <TouchableOpacity 
                  style={styles.addStepButton}
                  onPress={() => handleAddStep('add-step', 60)}
                >
                  <View style={[styles.addStepButtonIcon, { backgroundColor: '#DBEAFE' }]}>
                    <MessageSquare size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.addStepButtonText}>Action</Text>
                  <Text style={styles.addStepButtonDesc}>Add automation action</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.addStepButton}
                  onPress={() => handleAddStep('add-delay', 1440)}
                >
                  <View style={[styles.addStepButtonIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Clock size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.addStepButtonText}>Delay</Text>
                  <Text style={styles.addStepButtonDesc}>Wait before next</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Section */}
            <View style={styles.timelineHelp}>
              <View style={styles.timelineHelpHeader}>
                <Info size={16} color="#6366F1" />
                <Text style={styles.timelineHelpTitle}>Building Your Automation</Text>
              </View>
              <Text style={styles.timelineHelpText}>
                Start with immediate actions like creating channels and tasks, then add follow-up actions with delays. 
                Use variables like {'{{customer_name}}'} and {'{{salesperson}}'} to personalize your automations.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderAnalyticsView = () => {
    if (!selectedAutomation) return null;

    const analytics = AutomationsService.getAutomationAnalytics(selectedAutomation.id);

    return (
      <View style={styles.analyticsView}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>Analytics: {selectedAutomation.name}</Text>
          <Text style={styles.analyticsSubtitle}>Execution tracking and performance metrics</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Target size={20} color="#3B82F6" />
                <Text style={styles.metricTitle}>Total Runs</Text>
              </View>
              <Text style={styles.metricValue}>{analytics.totalExecutions}</Text>
              <Text style={styles.metricSubtext}>
                {analytics.successfulExecutions} successful, {analytics.failedExecutions} failed
              </Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.metricTitle}>Success Rate</Text>
              </View>
              <Text style={styles.metricValue}>
                {analytics.totalExecutions > 0 ? 
                  ((analytics.successfulExecutions / analytics.totalExecutions) * 100).toFixed(1) : 0}%
              </Text>
              <Text style={styles.metricSubtext}>Average success rate</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Clock size={20} color="#8B5CF6" />
                <Text style={styles.metricTitle}>Avg Time</Text>
              </View>
              <Text style={styles.metricValue}>{analytics.averageExecutionTime.toFixed(1)}m</Text>
              <Text style={styles.metricSubtext}>Average execution time</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Calendar size={20} color="#F59E0B" />
                <Text style={styles.metricTitle}>Last Run</Text>
              </View>
              <Text style={styles.metricValue}>
                {analytics.lastExecution ? 
                  new Date(analytics.lastExecution).toLocaleDateString() : 'Never'
                }
              </Text>
              <Text style={styles.metricSubtext}>Most recent execution</Text>
            </View>
          </View>

          {/* Execution History */}
          <View style={styles.executionHistory}>
            <Text style={styles.sectionTitle}>Execution History (Last 30 Days)</Text>
            <View style={styles.historyChart}>
              {analytics.executionHistory.slice(-7).map((day, index) => (
                <View key={index} style={styles.historyBar}>
                  <View style={styles.historyBarContainer}>
                    <View 
                      style={[
                        styles.historyBarFill, 
                        { height: `${Math.max(day.executions * 20, 4)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.historyBarLabel}>
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </Text>
                  <Text style={styles.historyBarValue}>{day.executions}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Performance */}
          <View style={styles.actionPerformance}>
            <Text style={styles.sectionTitle}>Action Performance</Text>
            {analytics.actionPerformance.map((action, index) => (
              <View key={index} style={styles.actionPerformanceItem}>
                <View style={styles.actionPerformanceHeader}>
                  <Text style={styles.actionPerformanceName}>
                    {action.actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  <Text style={styles.actionPerformanceRate}>{action.successRate}%</Text>
                </View>
                <View style={styles.actionPerformanceStats}>
                  <Text style={styles.actionPerformanceStat}>
                    {action.totalExecutions} runs
                  </Text>
                  <Text style={styles.actionPerformanceStat}>
                    {action.averageTime}m avg
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderViewModeTabs = () => {
    if (!selectedAutomation) return null;

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
        
        {selectedAutomation && renderViewModeTabs()}

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {selectedAutomation ? (
            viewMode === 'timeline' ? renderTimelineView() : 
            viewMode === 'analytics' ? renderAnalyticsView() : 
            renderAutomationsList()
          ) : renderAutomationsList()}
        </ScrollView>

        {/* New Automation Modal */}
        <NewAutomationModal
          isOpen={showNewAutomationModal}
          onClose={() => setShowNewAutomationModal(false)}
          onSave={handleSaveNewAutomation}
        />

        {/* Automation Step Modal */}
        <AutomationStepModal
          isOpen={showStepModal}
          onClose={() => setShowStepModal(false)}
          onSave={handleSaveStep}
          mode={stepModalMode}
          prefillDelay={stepModalPrefillDelay}
        />

        {/* Automation Settings Modal */}
        <AutomationSettingsModal
          visible={showAutomationSettings}
          onClose={() => setShowAutomationSettings(false)}
          automation={selectedAutomation}
          onSave={handleSaveAutomationSettings}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  automationsList: {
    padding: 20,
  },
  automationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  automationsHeaderContent: {
    flex: 1,
  },
  automationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  automationsSubtitle: {
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
  newAutomationButton: {
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
  newAutomationButtonText: {
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
  automationCard: {
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
  automationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  automationInfo: {
    flex: 1,
  },
  automationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  automationBadges: {
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
  statusBadgeDraft: {
    backgroundColor: '#F3F4F6',
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
  statusBadgeTextDraft: {
    color: '#6B7280',
  },
  automationMenu: {
    padding: 4,
  },
  automationDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  automationStats: {
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
  automationActions: {
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
  automationInfoCards: {
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
  addStepSection: {
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
  addStepHeader: {
    marginBottom: 16,
  },
  addStepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  addStepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  addStepButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addStepButton: {
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
  addStepButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addStepButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  addStepButtonDesc: {
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
  executionHistory: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  historyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  historyBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  historyBarContainer: {
    flex: 1,
    width: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  historyBarFill: {
    backgroundColor: '#6366F1',
    borderRadius: 4,
    minHeight: 4,
  },
  historyBarLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  historyBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  actionPerformance: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionPerformanceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionPerformanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionPerformanceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionPerformanceRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  actionPerformanceStats: {
    flexDirection: 'row',
    gap: 16,
  },
  actionPerformanceStat: {
    fontSize: 12,
    color: '#6B7280',
  },
});
