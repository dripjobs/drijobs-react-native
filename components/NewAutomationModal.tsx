import { PIPELINE_CONFIGS } from '@/types/automations';
import { Filter, Info, Save, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AutomationFilterBuilder from './AutomationFilterBuilder';

interface NewAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (automationData: {
    name: string;
    description: string;
    trigger: {
      type: 'proposal_status' | 'pipeline_change' | 'stage_change' | 'invoice_status' | 'job_status' | 'appointment_status';
      pipeline?: string;
      stage?: string;
      status?: string;
      fromStage?: string;
      toStage?: string;
      fromPipeline?: string;
      toPipeline?: string;
      labels?: string[];
    };
    filters: any[];
    status: 'active' | 'paused' | 'draft';
  }) => void;
}

export default function NewAutomationModal({
  isOpen,
  onClose,
  onSave
}: NewAutomationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'proposal_status' | 'pipeline_change' | 'stage_change' | 'invoice_status' | 'job_status' | 'appointment_status'>('proposal_status');
  const [pipeline, setPipeline] = useState('proposals');
  const [stage, setStage] = useState('accepted');
  const [status, setStatus] = useState('accepted');
  const [fromStage, setFromStage] = useState('');
  const [toStage, setToStage] = useState('');
  const [fromPipeline, setFromPipeline] = useState('');
  const [toPipeline, setToPipeline] = useState('');
  const [filters, setFilters] = useState<any[]>([]);
  const [automationStatus, setAutomationStatus] = useState<'active' | 'paused' | 'draft'>('draft');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an automation name');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      trigger: {
        type: triggerType,
        pipeline: triggerType === 'proposal_status' || triggerType === 'stage_change' ? pipeline : undefined,
        stage: triggerType === 'proposal_status' || triggerType === 'stage_change' ? stage : undefined,
        status: triggerType === 'proposal_status' || triggerType === 'invoice_status' || triggerType === 'job_status' || triggerType === 'appointment_status' ? status : undefined,
        fromStage: triggerType === 'stage_change' ? fromStage : undefined,
        toStage: triggerType === 'stage_change' ? toStage : undefined,
        fromPipeline: triggerType === 'pipeline_change' ? fromPipeline : undefined,
        toPipeline: triggerType === 'pipeline_change' ? toPipeline : undefined,
        labels: []
      },
      filters,
      status: automationStatus,
    });

    // Reset form
    setName('');
    setDescription('');
    setTriggerType('proposal_status');
    setPipeline('proposals');
    setStage('accepted');
    setStatus('accepted');
    setFromStage('');
    setToStage('');
    setFromPipeline('');
    setToPipeline('');
    setFilters([]);
    setAutomationStatus('draft');
  };

  const handleFiltersChange = (newFilters: any[]) => {
    setFilters(newFilters);
  };

  const getCurrentPipeline = () => {
    return PIPELINE_CONFIGS[pipeline as keyof typeof PIPELINE_CONFIGS];
  };

  const getCurrentStageLabel = () => {
    const pipelineConfig = getCurrentPipeline();
    return pipelineConfig?.stageLabels[stage] || stage;
  };

  if (!isOpen) return null;

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>New Automation</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#6366F1" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Automation Name *</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'name' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Exterior Job Project Kickoff"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'description' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe what this automation does..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  onFocus={() => setFocusedInput('description')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          </View>

          {/* Trigger Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trigger Configuration</Text>
            
            <View style={styles.triggerInfo}>
              <Info size={16} color="#6366F1" />
              <Text style={styles.triggerInfoText}>
                This automation will trigger when a record moves to or is created in the selected stage.
              </Text>
            </View>

            {/* Trigger Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trigger Type</Text>
              <View style={styles.triggerTypeSelector}>
                {[
                  { key: 'proposal_status', label: 'Proposal Status' },
                  { key: 'pipeline_change', label: 'Pipeline Change' },
                  { key: 'stage_change', label: 'Stage Change' },
                  { key: 'invoice_status', label: 'Invoice Status' },
                  { key: 'job_status', label: 'Job Status' },
                  { key: 'appointment_status', label: 'Appointment Status' }
                ].map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.triggerTypeOption,
                      triggerType === key && styles.triggerTypeOptionActive
                    ]}
                    onPress={() => setTriggerType(key as any)}
                  >
                    <Text style={[
                      styles.triggerTypeOptionText,
                      triggerType === key && styles.triggerTypeOptionTextActive
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pipeline Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pipeline</Text>
              <View style={styles.pipelineSelector}>
                {Object.entries(PIPELINE_CONFIGS).map(([key, config]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.pipelineOption,
                      pipeline === key && styles.pipelineOptionActive
                    ]}
                    onPress={() => {
                      setPipeline(key);
                      // Reset to first stage of new pipeline
                      const firstStage = config.stages[0];
                      setStage(firstStage);
                    }}
                  >
                    <Text style={[
                      styles.pipelineOptionText,
                      pipeline === key && styles.pipelineOptionTextActive
                    ]}>
                      {config.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stage Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stage</Text>
              <View style={styles.stageSelector}>
                {getCurrentPipeline()?.stages.map(stageKey => (
                  <TouchableOpacity
                    key={stageKey}
                    style={[
                      styles.stageOption,
                      stage === stageKey && styles.stageOptionActive
                    ]}
                    onPress={() => setStage(stageKey)}
                  >
                    <Text style={[
                      styles.stageOptionText,
                      stage === stageKey && styles.stageOptionTextActive
                    ]}>
                      {getCurrentPipeline()?.stageLabels[stageKey] || stageKey}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Event Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trigger Event</Text>
              <View style={styles.eventSelector}>
                <TouchableOpacity
                  style={[
                    styles.eventOption,
                    event === 'moved_to_stage' && styles.eventOptionActive
                  ]}
                  onPress={() => setEvent('moved_to_stage')}
                >
                  <Text style={[
                    styles.eventOptionText,
                    event === 'moved_to_stage' && styles.eventOptionTextActive
                  ]}>
                    Moved to Stage
                  </Text>
                  <Text style={[
                    styles.eventOptionDesc,
                    event === 'moved_to_stage' && styles.eventOptionDescActive
                  ]}>
                    When record moves to this stage
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.eventOption,
                    event === 'created_in_stage' && styles.eventOptionActive
                  ]}
                  onPress={() => setEvent('created_in_stage')}
                >
                  <Text style={[
                    styles.eventOptionText,
                    event === 'created_in_stage' && styles.eventOptionTextActive
                  ]}>
                    Created in Stage
                  </Text>
                  <Text style={[
                    styles.eventOptionDesc,
                    event === 'created_in_stage' && styles.eventOptionDescActive
                  ]}>
                    When record is created in this stage
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.eventOption,
                    event === 'both' && styles.eventOptionActive
                  ]}
                  onPress={() => setEvent('both')}
                >
                  <Text style={[
                    styles.eventOptionText,
                    event === 'both' && styles.eventOptionTextActive
                  ]}>
                    Both
                  </Text>
                  <Text style={[
                    styles.eventOptionDesc,
                    event === 'both' && styles.eventOptionDescActive
                  ]}>
                    When record moves to or is created in this stage
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Filter Configuration */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Filter Conditions</Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterBuilder(!showFilterBuilder)}
              >
                <Filter size={16} color="#6366F1" />
                <Text style={styles.filterButtonText}>
                  {filters.length > 0 ? `${filters.length} filter${filters.length !== 1 ? 's' : ''}` : 'Add Filters'}
                </Text>
              </TouchableOpacity>
            </View>

            {showFilterBuilder && (
              <AutomationFilterBuilder
                pipeline={pipeline}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClose={() => setShowFilterBuilder(false)}
              />
            )}

            {!showFilterBuilder && filters.length > 0 && (
              <View style={styles.filtersSummary}>
                <Text style={styles.filtersSummaryText}>
                  {filters.length} filter condition{filters.length !== 1 ? 's' : ''} configured
                </Text>
                <TouchableOpacity
                  style={styles.editFiltersButton}
                  onPress={() => setShowFilterBuilder(true)}
                >
                  <Text style={styles.editFiltersButtonText}>Edit Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Status Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusSelector}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  automationStatus === 'draft' && styles.statusOptionActive
                ]}
                onPress={() => setAutomationStatus('draft')}
              >
                <Text style={[
                  styles.statusOptionText,
                  automationStatus === 'draft' && styles.statusOptionTextActive
                ]}>
                  Draft
                </Text>
                <Text style={[
                  styles.statusOptionDesc,
                  automationStatus === 'draft' && styles.statusOptionDescActive
                ]}>
                  Save without activating
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  automationStatus === 'active' && styles.statusOptionActive
                ]}
                onPress={() => setAutomationStatus('active')}
              >
                <Text style={[
                  styles.statusOptionText,
                  automationStatus === 'active' && styles.statusOptionTextActive
                ]}>
                  Active
                </Text>
                <Text style={[
                  styles.statusOptionDesc,
                  automationStatus === 'active' && styles.statusOptionDescActive
                ]}>
                  Start running immediately
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === 'paused' && styles.statusOptionActive
                ]}
                onPress={() => setStatus('paused')}
              >
                <Text style={[
                  styles.statusOptionText,
                  status === 'paused' && styles.statusOptionTextActive
                ]}>
                  Paused
                </Text>
                <Text style={[
                  styles.statusOptionDesc,
                  status === 'paused' && styles.statusOptionDescActive
                ]}>
                  Created but not running
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={styles.previewIcon}>
                  <Zap size={20} color="#6366F1" />
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>{name || 'Automation Name'}</Text>
                  <Text style={styles.previewSubtitle}>
                    {getCurrentPipeline()?.title} - {getCurrentStageLabel()}
                  </Text>
                </View>
                <View style={[
                  styles.previewStatusBadge,
                  automationStatus === 'active' ? styles.previewStatusBadgeActive : 
                  automationStatus === 'paused' ? styles.previewStatusBadgePaused : styles.previewStatusBadgeDraft
                ]}>
                  <Text style={[
                    styles.previewStatusText,
                    automationStatus === 'active' ? styles.previewStatusTextActive : 
                    automationStatus === 'paused' ? styles.previewStatusTextPaused : styles.previewStatusTextDraft
                  ]}>
                    {automationStatus}
                  </Text>
                </View>
              </View>
              {description && (
                <Text style={styles.previewDescription}>{description}</Text>
              )}
              {filters.length > 0 && (
                <View style={styles.previewFilters}>
                  <Text style={styles.previewFiltersLabel}>
                    {filters.length} filter condition{filters.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpHeader}>
              <Info size={16} color="#6366F1" />
              <Text style={styles.helpTitle}>Getting Started</Text>
            </View>
            <Text style={styles.helpText}>
              After creating your automation, you can add action steps like creating team chat channels, 
              assigning tasks, and sending messages. Use variables like {'{{customer_name}}'} to personalize your automations.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    minHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  triggerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 8,
  },
  triggerInfoText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
    shadowOpacity: 0.15,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pipelineSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pipelineOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pipelineOptionActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  pipelineOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  pipelineOptionTextActive: {
    color: '#FFFFFF',
  },
  triggerTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerTypeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  triggerTypeOptionActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  triggerTypeOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  triggerTypeOptionTextActive: {
    color: '#FFFFFF',
  },
  stageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  stageOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stageOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  stageOptionTextActive: {
    color: '#FFFFFF',
  },
  eventSelector: {
    gap: 12,
  },
  eventOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  eventOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventOptionTextActive: {
    color: '#6366F1',
  },
  eventOptionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventOptionDescActive: {
    color: '#6366F1',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  filtersSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  filtersSummaryText: {
    fontSize: 14,
    color: '#0369A1',
    flex: 1,
  },
  editFiltersButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editFiltersButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0369A1',
  },
  statusSelector: {
    gap: 12,
  },
  statusOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statusOptionTextActive: {
    color: '#6366F1',
  },
  statusOptionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusOptionDescActive: {
    color: '#6366F1',
  },
  previewSection: {
    marginTop: 8,
  },
  previewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewStatusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  previewStatusBadgePaused: {
    backgroundColor: '#FEF3C7',
  },
  previewStatusBadgeDraft: {
    backgroundColor: '#F3F4F6',
  },
  previewStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewStatusTextActive: {
    color: '#065F46',
  },
  previewStatusTextPaused: {
    color: '#92400E',
  },
  previewStatusTextDraft: {
    color: '#6B7280',
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  previewFilters: {
    marginTop: 8,
  },
  previewFiltersLabel: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  helpSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginLeft: 6,
  },
  helpText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
});
