import AutomationsService from '@/services/AutomationsService';
import { ActionConfig, ActionType, AUTOMATION_VARIABLES } from '@/types/automations';
import { CheckSquare, ChevronDown, ChevronUp, Clock, Hash, Mail, MessageSquare, Save, Send, User, X, Zap } from 'lucide-react-native';
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

interface AutomationStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stepData: {
    type: 'action' | 'delay';
    actionType?: ActionType;
    config?: ActionConfig;
    delay: number;
    status: 'draft' | 'active';
  }) => void;
  mode: 'add-step' | 'add-delay';
  prefillDelay?: number;
}

export default function AutomationStepModal({
  isOpen,
  onClose,
  onSave,
  mode,
  prefillDelay = 60
}: AutomationStepModalProps) {
  const [actionType, setActionType] = useState<ActionType>('create_team_chat_channel');
  const [delay, setDelay] = useState(prefillDelay);
  const [manualDelay, setManualDelay] = useState(String(prefillDelay));
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showVariables, setShowVariables] = useState(false);
  
  // Action-specific config states
  const [config, setConfig] = useState<ActionConfig>({});
  const [showConfig, setShowConfig] = useState(false);

  const teamMembers = AutomationsService.getTeamMembers();

  const handleSave = () => {
    if (mode === 'add-delay') {
      onSave({
        type: 'delay',
        delay,
        status,
      });
      resetForm();
      return;
    }

    // For actions, validate required config
    if (actionType === 'create_team_chat_channel' && !config.channelName?.trim()) {
      Alert.alert('Error', 'Please enter a channel name');
      return;
    }
    if (['send_team_chat_message', 'send_text_message'].includes(actionType) && !config.message?.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    if (actionType === 'create_task' && !config.taskName?.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    onSave({
      type: 'action',
      actionType,
      config,
      delay,
      status,
    });

    resetForm();
  };

  const resetForm = () => {
    setActionType('create_team_chat_channel');
    setDelay(60);
    setManualDelay('60');
    setStatus('draft');
    setConfig({});
    setShowVariables(false);
    setShowConfig(false);
  };

  const handleManualDelayChange = (text: string) => {
    setManualDelay(text);
    const minutes = parseInt(text);
    if (!isNaN(minutes) && minutes >= 0) {
      setDelay(minutes);
    }
  };

  const insertVariable = (variable: string) => {
    const currentValue = getCurrentConfigValue();
    const newValue = currentValue + `{{${variable}}}`;
    updateConfigValue(newValue);
    setShowVariables(false);
  };

  const getCurrentConfigValue = (): string => {
    switch (actionType) {
      case 'create_team_chat_channel':
        return config.channelName || '';
      case 'send_team_chat_message':
      case 'send_text_message':
        return config.message || '';
      case 'create_task':
        return config.taskName || '';
      case 'send_email':
        return config.emailContent || '';
      default:
        return '';
    }
  };

  const updateConfigValue = (value: string) => {
    switch (actionType) {
      case 'create_team_chat_channel':
        setConfig({ ...config, channelName: value });
        break;
      case 'send_team_chat_message':
      case 'send_text_message':
        setConfig({ ...config, message: value });
        break;
      case 'create_task':
        setConfig({ ...config, taskName: value });
        break;
      case 'send_email':
        setConfig({ ...config, emailContent: value });
        break;
    }
  };

  const getActionLabel = (type: ActionType): string => {
    const labels: Record<ActionType, string> = {
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

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'create_team_chat_channel':
      case 'send_team_chat_message':
      case 'find_team_chat_channel':
        return <Hash size={20} color="#3B82F6" />;
      case 'create_task':
        return <CheckSquare size={20} color="#10B981" />;
      case 'send_text_message':
        return <Send size={20} color="#10B981" />;
      case 'send_email':
        return <Mail size={20} color="#8B5CF6" />;
      case 'delay':
        return <Clock size={20} color="#F59E0B" />;
      case 'add_note':
        return <MessageSquare size={20} color="#6366F1" />;
      case 'update_stage':
        return <Zap size={20} color="#8B5CF6" />;
      case 'assign_user':
        return <User size={20} color="#F59E0B" />;
      default:
        return <Zap size={20} color="#6B7280" />;
    }
  };

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'add-delay' ? 'Add Delay' : 'Add Action Step'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#6366F1" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Action Type Selection */}
          {mode === 'add-step' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Action Type</Text>
              
              <View style={styles.actionTypeGrid}>
                {[
                  { type: 'create_team_chat_channel', label: 'Create Team Chat', icon: <Hash size={16} color="#3B82F6" /> },
                  { type: 'send_team_chat_message', label: 'Send Team Message', icon: <MessageSquare size={16} color="#3B82F6" /> },
                  { type: 'create_task', label: 'Create Task', icon: <CheckSquare size={16} color="#10B981" /> },
                  { type: 'send_text_message', label: 'Send Text', icon: <Send size={16} color="#10B981" /> },
                  { type: 'send_email', label: 'Send Email', icon: <Mail size={16} color="#8B5CF6" /> },
                  { type: 'find_team_chat_channel', label: 'Find Channel', icon: <Hash size={16} color="#6366F1" /> },
                  { type: 'add_note', label: 'Add Note', icon: <MessageSquare size={16} color="#6366F1" /> },
                  { type: 'update_stage', label: 'Update Stage', icon: <Zap size={16} color="#8B5CF6" /> },
                  { type: 'assign_user', label: 'Assign User', icon: <User size={16} color="#F59E0B" /> }
                ].map(({ type, label, icon }) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.actionTypeButton,
                      actionType === type && styles.actionTypeButtonActive
                    ]}
                    onPress={() => {
                      setActionType(type as ActionType);
                      setConfig({});
                      setShowConfig(true);
                    }}
                  >
                    <View style={styles.actionTypeButtonIcon}>
                      {icon}
                    </View>
                    <Text style={[
                      styles.actionTypeButtonText,
                      actionType === type && styles.actionTypeButtonTextActive
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Action Configuration */}
          {mode === 'add-step' && showConfig && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Configuration</Text>
              
              {/* Channel Name */}
              {actionType === 'create_team_chat_channel' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Channel Name *</Text>
                  <View style={styles.inputWithVariables}>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'channelName' && styles.inputFocused
                      ]}
                      value={config.channelName || ''}
                      onChangeText={(text) => setConfig({ ...config, channelName: text })}
                      placeholder="e.g., Project {'{{proposal_id}}'} - {'{{customer_name}}'}"
                      placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocusedInput('channelName')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      style={styles.variablesButton}
                      onPress={() => setShowVariables(!showVariables)}
                    >
                      <Text style={styles.variablesButtonText}>Variables</Text>
                      {showVariables ? <ChevronUp size={16} color="#6366F1" /> : <ChevronDown size={16} color="#6366F1" />}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Message Content */}
              {['send_team_chat_message', 'send_text_message'].includes(actionType) && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message *</Text>
                  <View style={styles.inputWithVariables}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        focusedInput === 'message' && styles.inputFocused
                      ]}
                      value={config.message || ''}
                      onChangeText={(text) => setConfig({ ...config, message: text })}
                      placeholder="Enter your message..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      onFocus={() => setFocusedInput('message')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      style={styles.variablesButton}
                      onPress={() => setShowVariables(!showVariables)}
                    >
                      <Text style={styles.variablesButtonText}>Variables</Text>
                      {showVariables ? <ChevronUp size={16} color="#6366F1" /> : <ChevronDown size={16} color="#6366F1" />}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Task Name */}
              {actionType === 'create_task' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Task Name *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'taskName' && styles.inputFocused
                    ]}
                    value={config.taskName || ''}
                    onChangeText={(text) => setConfig({ ...config, taskName: text })}
                    placeholder="e.g., Schedule color consultation"
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('taskName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              )}

              {/* Task Assignment */}
              {actionType === 'create_task' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Assign To</Text>
                  <View style={styles.userSelector}>
                    {teamMembers.map(member => (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.userOption,
                          config.assignedUserId === member.id && styles.userOptionActive
                        ]}
                        onPress={() => setConfig({ ...config, assignedUserId: member.id, assignedUserRole: member.role })}
                      >
                        <View style={styles.userOptionAvatar}>
                          <Text style={styles.userOptionInitials}>{member.initials}</Text>
                        </View>
                        <View style={styles.userOptionInfo}>
                          <Text style={[
                            styles.userOptionName,
                            config.assignedUserId === member.id && styles.userOptionNameActive
                          ]}>
                            {member.name}
                          </Text>
                          <Text style={[
                            styles.userOptionRole,
                            config.assignedUserId === member.id && styles.userOptionRoleActive
                          ]}>
                            {member.role}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Text Message Recipient */}
              {actionType === 'send_text_message' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Recipient</Text>
                  <View style={styles.recipientSelector}>
                    <TouchableOpacity
                      style={[
                        styles.recipientOption,
                        config.recipientType === 'salesperson' && styles.recipientOptionActive
                      ]}
                      onPress={() => setConfig({ ...config, recipientType: 'salesperson' })}
                    >
                      <Text style={[
                        styles.recipientOptionText,
                        config.recipientType === 'salesperson' && styles.recipientOptionTextActive
                      ]}>
                        Salesperson
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.recipientOption,
                        config.recipientType === 'project_manager' && styles.recipientOptionActive
                      ]}
                      onPress={() => setConfig({ ...config, recipientType: 'project_manager' })}
                    >
                      <Text style={[
                        styles.recipientOptionText,
                        config.recipientType === 'project_manager' && styles.recipientOptionTextActive
                      ]}>
                        Project Manager
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.recipientOption,
                        config.recipientType === 'customer' && styles.recipientOptionTextActive
                      ]}
                      onPress={() => setConfig({ ...config, recipientType: 'customer' })}
                    >
                      <Text style={[
                        styles.recipientOptionText,
                        config.recipientType === 'customer' && styles.recipientOptionTextActive
                      ]}>
                        Customer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Email Configuration */}
              {actionType === 'send_email' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Subject</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'emailSubject' && styles.inputFocused
                      ]}
                      value={config.emailSubject || ''}
                      onChangeText={(text) => setConfig({ ...config, emailSubject: text })}
                      placeholder="Enter email subject..."
                      placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocusedInput('emailSubject')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Content</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        focusedInput === 'emailContent' && styles.inputFocused
                      ]}
                      value={config.emailContent || ''}
                      onChangeText={(text) => setConfig({ ...config, emailContent: text })}
                      placeholder="Enter email content..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      onFocus={() => setFocusedInput('emailContent')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </>
              )}

              {/* Delay Configuration */}
              {actionType === 'delay' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Delay Duration</Text>
                  <View style={styles.delaySelector}>
                    <TouchableOpacity
                      style={[
                        styles.delayOption,
                        config.delayMinutes && styles.delayOptionActive
                      ]}
                      onPress={() => setConfig({ ...config, delayMinutes: 30, delayHours: undefined, delayDays: undefined })}
                    >
                      <Text style={[
                        styles.delayOptionText,
                        config.delayMinutes && styles.delayOptionTextActive
                      ]}>
                        30 minutes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.delayOption,
                        config.delayHours && styles.delayOptionActive
                      ]}
                      onPress={() => setConfig({ ...config, delayHours: 1, delayMinutes: undefined, delayDays: undefined })}
                    >
                      <Text style={[
                        styles.delayOptionText,
                        config.delayHours && styles.delayOptionTextActive
                      ]}>
                        1 hour
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.delayOption,
                        config.delayDays && styles.delayOptionActive
                      ]}
                      onPress={() => setConfig({ ...config, delayDays: 1, delayMinutes: undefined, delayHours: undefined })}
                    >
                      <Text style={[
                        styles.delayOptionText,
                        config.delayDays && styles.delayOptionTextActive
                      ]}>
                        1 day
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Variables Panel */}
          {showVariables && (
            <View style={styles.variablesSection}>
              <Text style={styles.variablesTitle}>Available Variables</Text>
              <Text style={styles.variablesDescription}>Click to insert into your text</Text>
              <View style={styles.variablesList}>
                {AUTOMATION_VARIABLES.map((variable) => (
                  <TouchableOpacity
                    key={variable.key}
                    style={styles.variableButton}
                    onPress={() => insertVariable(variable.key)}
                  >
                    <Text style={styles.variableLabel}>{variable.label}</Text>
                    <Text style={styles.variableTag}>{'{{' + variable.key + '}}'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Delay Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delay</Text>
            
            <View style={styles.manualDelayContainer}>
              <Text style={styles.manualDelayLabel}>Wait time (minutes):</Text>
              <View style={[
                styles.manualDelayInputContainer,
                focusedInput === 'delay' && styles.inputFocused
              ]}>
                <TextInput
                  style={styles.manualDelayInput}
                  value={manualDelay}
                  onChangeText={handleManualDelayChange}
                  placeholder="Enter minutes..."
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  onFocus={() => setFocusedInput('delay')}
                  onBlur={() => setFocusedInput(null)}
                />
                <Text style={styles.manualDelayDisplay}>{formatDelay(delay)}</Text>
              </View>
            </View>
            
            <View style={styles.delayContainer}>
              <Text style={styles.delayLabel}>Current: {formatDelay(delay)}</Text>
              
              <View style={styles.delayButtons}>
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => {
                    const newDelay = Math.max(0, delay - 60);
                    setDelay(newDelay);
                    setManualDelay(String(newDelay));
                  }}
                >
                  <Text style={styles.delayButtonText}>-1h</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => {
                    const newDelay = delay + 60;
                    setDelay(newDelay);
                    setManualDelay(String(newDelay));
                  }}
                >
                  <Text style={styles.delayButtonText}>+1h</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => {
                    const newDelay = delay + 1440;
                    setDelay(newDelay);
                    setManualDelay(String(newDelay));
                  }}
                >
                  <Text style={styles.delayButtonText}>+1d</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Delay Options */}
            <View style={styles.quickDelayOptions}>
              <Text style={styles.quickDelayLabel}>Quick options:</Text>
              <View style={styles.quickDelayButtons}>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => {
                    setDelay(0);
                    setManualDelay('0');
                  }}
                >
                  <Text style={styles.quickDelayButtonText}>Immediate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => {
                    setDelay(60);
                    setManualDelay('60');
                  }}
                >
                  <Text style={styles.quickDelayButtonText}>1 hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => {
                    setDelay(1440);
                    setManualDelay('1440');
                  }}
                >
                  <Text style={styles.quickDelayButtonText}>1 day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => {
                    setDelay(10080);
                    setManualDelay('10080');
                  }}
                >
                  <Text style={styles.quickDelayButtonText}>1 week</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Status Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusSelector}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'draft' && styles.statusButtonActive
                ]}
                onPress={() => setStatus('draft')}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'draft' && styles.statusButtonTextActive
                ]}>
                  Draft
                </Text>
                <Text style={[
                  styles.statusButtonDescription,
                  status === 'draft' && styles.statusButtonDescriptionActive
                ]}>
                  Save without activating
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'active' && styles.statusButtonActive
                ]}
                onPress={() => setStatus('active')}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'active' && styles.statusButtonTextActive
                ]}>
                  Active
                </Text>
                <Text style={[
                  styles.statusButtonDescription,
                  status === 'active' && styles.statusButtonDescriptionActive
                ]}>
                  Start running immediately
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
                  {getActionIcon(actionType)}
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {mode === 'add-delay' ? 'Delay' : getActionLabel(actionType)}
                  </Text>
                  <Text style={styles.previewDelay}>Delay: {formatDelay(delay)}</Text>
                </View>
                <View style={[
                  styles.previewStatusBadge,
                  status === 'active' ? styles.previewStatusBadgeActive : styles.previewStatusBadgeDraft
                ]}>
                  <Text style={[
                    styles.previewStatusText,
                    status === 'active' ? styles.previewStatusTextActive : styles.previewStatusTextDraft
                  ]}>
                    {status === 'active' ? 'Active' : 'Draft'}
                  </Text>
                </View>
              </View>
              {getCurrentConfigValue() && (
                <Text style={styles.previewContent} numberOfLines={3}>
                  {getCurrentConfigValue()}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    marginBottom: 12,
  },
  actionTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTypeButton: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  actionTypeButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  actionTypeButtonIcon: {
    marginBottom: 8,
  },
  actionTypeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  actionTypeButtonTextActive: {
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithVariables: {
    position: 'relative',
  },
  variablesButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  variablesButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  variablesSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  variablesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  variablesDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  variablesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variableButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  variableLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  variableTag: {
    fontSize: 10,
    color: '#6366F1',
    fontFamily: 'monospace',
  },
  userSelector: {
    gap: 8,
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  userOptionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userOptionInitials: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userOptionInfo: {
    flex: 1,
  },
  userOptionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  userOptionNameActive: {
    color: '#6366F1',
  },
  userOptionRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  userOptionRoleActive: {
    color: '#6366F1',
  },
  recipientSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  recipientOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  recipientOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  recipientOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  recipientOptionTextActive: {
    color: '#6366F1',
  },
  delaySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  delayOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  delayOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  delayOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  delayOptionTextActive: {
    color: '#6366F1',
  },
  manualDelayContainer: {
    marginBottom: 12,
  },
  manualDelayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  manualDelayInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingRight: 12,
  },
  manualDelayInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
  },
  manualDelayDisplay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  delayContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  delayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  delayButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  delayButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  delayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  quickDelayOptions: {
    marginTop: 8,
  },
  quickDelayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  quickDelayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickDelayButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quickDelayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  statusButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  statusButtonTextActive: {
    color: '#6366F1',
  },
  statusButtonDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusButtonDescriptionActive: {
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  previewDelay: {
    fontSize: 12,
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
  previewStatusBadgeDraft: {
    backgroundColor: '#FEF3C7',
  },
  previewStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewStatusTextActive: {
    color: '#065F46',
  },
  previewStatusTextDraft: {
    color: '#92400E',
  },
  previewContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
