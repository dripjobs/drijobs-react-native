import { Info, Save, X } from 'lucide-react-native';
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

// Mock pipeline configs - in real app this would come from a service
const pipelineConfigs = {
  leads: {
    title: 'Lead Pipeline',
    stageLabels: {
      new_leads: 'New Leads',
      qualified_leads: 'Qualified Leads', 
      hot_leads: 'Hot Leads'
    }
  },
  opportunities: {
    title: 'Opportunities',
    stageLabels: {
      new_opportunities: 'New Opportunities',
      prospecting: 'Prospecting',
      negotiating: 'Negotiating',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost'
    }
  },
  proposals: {
    title: 'Proposals',
    stageLabels: {
      draft: 'Draft',
      sent: 'Sent',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected'
    }
  },
  jobs: {
    title: 'Jobs',
    stageLabels: {
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  }
};

interface NewSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sequenceData: {
    name: string;
    description: string;
    trigger: 'moved_to_stage';
    timingMode: 'previous_action' | 'time_in_stage';
    pipeline: string;
    stage: string;
  }) => void;
  initialPipeline?: string;
  initialStage?: string;
}

export default function NewSequenceModal({
  isOpen,
  onClose,
  onSave,
  initialPipeline = 'leads',
  initialStage = 'new_leads'
}: NewSequenceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timingMode, setTimingMode] = useState<'previous_action' | 'time_in_stage'>('previous_action');
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [stage, setStage] = useState(initialStage);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a sequence name');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      trigger: 'moved_to_stage', // Always trigger when moved to or created in stage
      timingMode,
      pipeline,
      stage,
    });

    // Reset form
    setName('');
    setDescription('');
    setTimingMode('previous_action');
    setPipeline(initialPipeline);
    setStage(initialStage);
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
          <Text style={styles.title}>New Sequence</Text>
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
              <Text style={styles.label}>Sequence Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Welcome New Leads"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what this sequence does..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>


          {/* Timing Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timing Mode</Text>
            
            {/* Trigger Info */}
            <View style={styles.triggerInfo}>
              <Text style={styles.triggerInfoText}>
                This sequence will trigger whenever a contact is moved to or created in the selected stage.
              </Text>
            </View>
            
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  timingMode === 'previous_action' && styles.optionButtonActive
                ]}
                onPress={() => setTimingMode('previous_action')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    timingMode === 'previous_action' && styles.optionTitleActive
                  ]}>
                    Sequential Timing
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    timingMode === 'previous_action' && styles.optionDescriptionActive
                  ]}>
                    Each action waits for the previous one to complete
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  timingMode === 'time_in_stage' && styles.optionButtonActive
                ]}
                onPress={() => setTimingMode('time_in_stage')}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    timingMode === 'time_in_stage' && styles.optionTitleActive
                  ]}>
                    Absolute Timing
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    timingMode === 'time_in_stage' && styles.optionDescriptionActive
                  ]}>
                    Each action has a specific delay from stage entry
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pipeline & Stage Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pipeline & Stage</Text>
            
            <View style={styles.pipelineStageInfo}>
              <Text style={styles.pipelineStageText}>
                This sequence will be configured for the <Text style={styles.pipelineStageHighlight}>{pipelineConfigs[pipeline]?.title}</Text> pipeline, 
                specifically for the <Text style={styles.pipelineStageHighlight}>{pipelineConfigs[pipeline]?.stageLabels[stage]}</Text> stage.
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pipeline</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{pipelineConfigs[pipeline]?.title}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stage</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{pipelineConfigs[pipeline]?.stageLabels[stage]}</Text>
              </View>
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpHeader}>
              <Info size={16} color="#6366F1" />
              <Text style={styles.helpTitle}>Getting Started</Text>
            </View>
            <Text style={styles.helpText}>
              After creating your sequence, you can add messages and automations to build your drip campaign. 
              Start with a simple welcome message and add follow-ups every few days.
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
  triggerInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  triggerInfoText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  pipelineStageInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pipelineStageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  pipelineStageHighlight: {
    fontWeight: '600',
    color: '#6366F1',
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionGroup: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  optionButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: '#6366F1',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  optionDescriptionActive: {
    color: '#6366F1',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  pickerText: {
    fontSize: 16,
    color: '#374151',
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
