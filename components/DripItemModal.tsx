import { AlertCircle, ChevronDown, ChevronUp, Mail, MessageSquare, Save, Send, X, Zap } from 'lucide-react-native';
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
    View
} from 'react-native';

type AutomationType = 'send_text' | 'send_email' | 'add_note' | 'create_task' | 'add_discount' | 'ai_followup' | 'add_label' | 'move_stage' | 'change_pipeline';

interface DripItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    type: 'message' | 'automation';
    messageType?: 'email' | 'text';
    subject?: string;
    content?: string;
    delay: number;
    automationType?: AutomationType;
    config?: any;
    status: 'draft' | 'active';
  }) => void;
  mode: 'add-item' | 'add-delay';
  prefillDelay?: number;
  specificDay?: number;
}

export default function DripItemModal({
  isOpen,
  onClose,
  onSave,
  mode,
  prefillDelay = 60,
  specificDay
}: DripItemModalProps) {
  const [itemType, setItemType] = useState<'message' | 'automation'>('message');
  const [messageType, setMessageType] = useState<'email' | 'text'>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [delay, setDelay] = useState(prefillDelay);
  const [manualDelay, setManualDelay] = useState(String(prefillDelay));
  const [automationType, setAutomationType] = useState<AutomationType>('add_note');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [showMetaTags, setShowMetaTags] = useState(false);

  const handleSave = () => {
    // For add-delay mode, we don't need content
    if (mode === 'add-delay') {
      onSave({
        type: 'automation',
        delay,
        status,
      });
      resetForm();
      return;
    }

    // For messages, require content
    if (itemType === 'message' && !content.trim()) {
      Alert.alert('Error', 'Please enter message content');
      return;
    }

    // For automations that need config, validate based on type
    if (itemType === 'automation') {
      if (['send_text', 'send_email'].includes(automationType) && !content.trim()) {
        Alert.alert('Error', 'Please enter message content');
        return;
      }
      if (['add_note', 'create_task'].includes(automationType) && !content.trim()) {
        Alert.alert('Error', 'Please enter details');
        return;
      }
    }

    // Show warning if activating with pending contacts
    if (status === 'active') {
      Alert.alert(
        'Activate Drip',
        'This drip will become active. Any customers currently in this stage will receive this message according to the delay settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Activate', 
            onPress: () => saveItem()
          }
        ]
      );
    } else {
      saveItem();
    }
  };

  const saveItem = () => {
    const automationConfig: any = {};
    
    if (itemType === 'automation') {
      if (['send_text', 'send_email'].includes(automationType)) {
        automationConfig.content = content.trim();
        if (automationType === 'send_email') {
          automationConfig.subject = subject.trim();
        }
      } else if (automationType === 'add_note') {
        automationConfig.noteContent = content.trim();
      } else if (automationType === 'create_task') {
        automationConfig.taskName = content.trim();
      }
    }

    onSave({
      type: itemType,
      messageType: itemType === 'message' ? messageType : (automationType === 'send_text' ? 'text' : automationType === 'send_email' ? 'email' : undefined),
      subject: (itemType === 'message' && messageType === 'email') || automationType === 'send_email' ? subject : undefined,
      content: content.trim() || undefined,
      delay,
      automationType: itemType === 'automation' ? automationType : undefined,
      config: itemType === 'automation' ? automationConfig : undefined,
      status,
    });

    resetForm();
  };

  const resetForm = () => {
    setItemType('message');
    setMessageType('email');
    setSubject('');
    setContent('');
    setDelay(60);
    setManualDelay('60');
    setAutomationType('add_note');
    setStatus('draft');
    setShowMetaTags(false);
  };

  const handleManualDelayChange = (text: string) => {
    setManualDelay(text);
    const minutes = parseInt(text);
    if (!isNaN(minutes) && minutes >= 0) {
      setDelay(minutes);
    }
  };

  const insertMetaTag = (tag: string) => {
    setContent(content + `{{${tag}}}`);
  };

  const metaTags = [
    { tag: 'first_name', label: 'First Name', description: 'Contact\'s first name' },
    { tag: 'last_name', label: 'Last Name', description: 'Contact\'s last name' },
    { tag: 'company', label: 'Company', description: 'Company name' },
    { tag: 'phone', label: 'Phone', description: 'Phone number' },
    { tag: 'email', label: 'Email', description: 'Email address' },
    { tag: 'address', label: 'Address', description: 'Full address' },
    { tag: 'city', label: 'City', description: 'City' },
    { tag: 'state', label: 'State', description: 'State' },
    { tag: 'zip', label: 'ZIP', description: 'ZIP code' },
  ];

  if (!isOpen) return null;

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

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
            {mode === 'add-delay' ? 'Add Delay' : itemType === 'message' ? 'Add Message' : 'Add Automation'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#6366F1" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Type Selection */}
          {mode === 'add-item' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Item Type</Text>
              
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    itemType === 'message' && styles.typeButtonActive
                  ]}
                  onPress={() => setItemType('message')}
                >
                  <MessageSquare size={20} color={itemType === 'message' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.typeButtonText,
                    itemType === 'message' && styles.typeButtonTextActive
                  ]}>
                    Message
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    itemType === 'automation' && styles.typeButtonActive
                  ]}
                  onPress={() => setItemType('automation')}
                >
                  <Zap size={20} color={itemType === 'automation' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.typeButtonText,
                    itemType === 'automation' && styles.typeButtonTextActive
                  ]}>
                    Automation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Message Type Selection */}
          {mode === 'add-item' && itemType === 'message' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Message Type</Text>
              
              <View style={styles.messageTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.messageTypeButton,
                    messageType === 'email' && styles.messageTypeButtonActive
                  ]}
                  onPress={() => setMessageType('email')}
                >
                  <Mail size={18} color={messageType === 'email' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.messageTypeButtonText,
                    messageType === 'email' && styles.messageTypeButtonTextActive
                  ]}>
                    Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.messageTypeButton,
                    messageType === 'text' && styles.messageTypeButtonActive
                  ]}
                  onPress={() => setMessageType('text')}
                >
                  <Send size={18} color={messageType === 'text' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.messageTypeButtonText,
                    messageType === 'text' && styles.messageTypeButtonTextActive
                  ]}>
                    Text
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Automation Type Selection */}
          {mode === 'add-item' && itemType === 'automation' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Automation Type</Text>
              
              <View style={styles.automationTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'send_text' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('send_text')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'send_text' && styles.automationTypeButtonTextActive
                  ]}>
                    Send Text
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'send_email' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('send_email')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'send_email' && styles.automationTypeButtonTextActive
                  ]}>
                    Send Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'add_note' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('add_note')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'add_note' && styles.automationTypeButtonTextActive
                  ]}>
                    Add Note
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'create_task' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('create_task')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'create_task' && styles.automationTypeButtonTextActive
                  ]}>
                    Create Task
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'add_discount' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('add_discount')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'add_discount' && styles.automationTypeButtonTextActive
                  ]}>
                    Add Discount
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'ai_followup' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('ai_followup')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'ai_followup' && styles.automationTypeButtonTextActive
                  ]}>
                    AI Follow-up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'add_label' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('add_label')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'add_label' && styles.automationTypeButtonTextActive
                  ]}>
                    Add Label
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'move_stage' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('move_stage')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'move_stage' && styles.automationTypeButtonTextActive
                  ]}>
                    Move Stage
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.automationTypeButton,
                    automationType === 'change_pipeline' && styles.automationTypeButtonActive
                  ]}
                  onPress={() => setAutomationType('change_pipeline')}
                >
                  <Text style={[
                    styles.automationTypeButtonText,
                    automationType === 'change_pipeline' && styles.automationTypeButtonTextActive
                  ]}>
                    Change Pipeline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Subject (Email only) */}
          {mode === 'add-item' && itemType === 'message' && messageType === 'email' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email Subject</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'subject' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Enter email subject..."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('subject')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          )}

          {/* Content - Only show for messages or certain automation types, and not for add-delay mode */}
          {mode !== 'add-delay' && (
            <>
              {(itemType === 'message' || ['send_text', 'send_email', 'add_note', 'create_task'].includes(automationType)) && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      {itemType === 'message' ? 'Message Content' : 'Automation Details'}
                    </Text>
                    {(itemType === 'message' || ['send_text', 'send_email'].includes(automationType)) && (
                      <TouchableOpacity 
                        style={styles.metaTagsToggle}
                        onPress={() => setShowMetaTags(!showMetaTags)}
                      >
                        <Text style={styles.metaTagsToggleText}>Meta Tags</Text>
                        {showMetaTags ? <ChevronUp size={16} color="#6366F1" /> : <ChevronDown size={16} color="#6366F1" />}
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Meta Tags Section */}
                  {showMetaTags && (itemType === 'message' || ['send_text', 'send_email'].includes(automationType)) && (
                    <View style={styles.metaTagsSection}>
                      <Text style={styles.metaTagsTitle}>Available Tags</Text>
                      <Text style={styles.metaTagsDescription}>Click to insert into your message</Text>
                      <View style={styles.metaTagsList}>
                        {metaTags.map((meta) => (
                          <TouchableOpacity
                            key={meta.tag}
                            style={styles.metaTagButton}
                            onPress={() => insertMetaTag(meta.tag)}
                          >
                            <Text style={styles.metaTagLabel}>{meta.label}</Text>
                            <Text style={styles.metaTagTag}>{'{{' + meta.tag + '}}'}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'content' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={content}
                      onChangeText={setContent}
                      placeholder={
                        itemType === 'message' 
                          ? "Enter your message content..." 
                          : automationType === 'add_note'
                          ? "Enter note content..."
                          : automationType === 'create_task'
                          ? "Enter task name..."
                          : "Enter automation details..."
                      }
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      onFocus={() => setFocusedInput('content')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
              )}
            </>
          )}

          {/* Delay Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delay</Text>
            
            {/* Manual Delay Input */}
            <View style={styles.manualDelayContainer}>
              <Text style={styles.manualDelayLabel}>Wait time (minutes):</Text>
              <View style={[
                styles.manualDelayInputContainer,
                focusedInput === 'delay' && styles.inputContainerFocused
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
                  Start sending immediately
                </Text>
              </TouchableOpacity>
            </View>

            {/* Warning for active status */}
            {status === 'active' && (
              <View style={styles.warningContainer}>
                <AlertCircle size={16} color="#F59E0B" />
                <Text style={styles.warningText}>
                  Customers currently in this stage will receive this message according to the delay settings.
                </Text>
              </View>
            )}
          </View>

          {/* Preview - Only show for add-item mode */}
          {mode !== 'add-delay' && (
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewIcon}>
                    {itemType === 'message' ? (
                      messageType === 'email' ? <Mail size={16} color="#3B82F6" /> : <Send size={16} color="#10B981" />
                    ) : (
                      <Zap size={16} color="#F59E0B" />
                    )}
                  </View>
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewTitle}>
                      {itemType === 'message' 
                        ? `${messageType === 'email' ? 'Email' : 'Text'} Message`
                        : automationType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                      }
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
                {subject && (
                  <Text style={styles.previewSubject}>{subject}</Text>
                )}
                {content && (
                  <Text style={styles.previewContent} numberOfLines={3}>
                    {content || 'Enter content to see preview...'}
                  </Text>
                )}
              </View>
            </View>
          )}
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
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  messageTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  messageTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  messageTypeButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  messageTypeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  messageTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  automationTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  automationTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  automationTypeButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  automationTypeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  automationTypeButtonTextActive: {
    color: '#FFFFFF',
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
    height: 100,
    textAlignVertical: 'top',
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
  previewSubject: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  previewContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaTagsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
  },
  metaTagsToggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  metaTagsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metaTagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  metaTagsDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  metaTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaTagButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  metaTagLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  metaTagTag: {
    fontSize: 10,
    color: '#6366F1',
    fontFamily: 'monospace',
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
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});

