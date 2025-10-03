import { Mail, MessageSquare, Save, Send, X, Zap } from 'lucide-react-native';
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

interface DripItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    type: 'message' | 'automation';
    messageType?: 'email' | 'text';
    subject?: string;
    content: string;
    delay: number;
    automationType?: string;
    config?: any;
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
  const [automationType, setAutomationType] = useState('add_note');

  const handleSave = () => {
    if (itemType === 'message' && !content.trim()) {
      Alert.alert('Error', 'Please enter message content');
      return;
    }

    if (itemType === 'automation' && !content.trim()) {
      Alert.alert('Error', 'Please enter automation details');
      return;
    }

    onSave({
      type: itemType,
      messageType: itemType === 'message' ? messageType : undefined,
      subject: itemType === 'message' && messageType === 'email' ? subject : undefined,
      content: content.trim(),
      delay,
      automationType: itemType === 'automation' ? automationType : undefined,
      config: itemType === 'automation' ? { content: content.trim() } : undefined,
    });

    // Reset form
    setItemType('message');
    setMessageType('email');
    setSubject('');
    setContent('');
    setDelay(60);
    setAutomationType('add_note');
  };

  if (!isOpen) return null;

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

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
              </View>
            </View>
          )}

          {/* Subject (Email only) */}
          {mode === 'add-item' && itemType === 'message' && messageType === 'email' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter email subject..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {itemType === 'message' ? 'Message Content' : 'Automation Details'}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder={
                itemType === 'message' 
                  ? "Enter your message content..." 
                  : "Enter automation details..."
              }
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Delay Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delay</Text>
            
            <View style={styles.delayContainer}>
              <Text style={styles.delayLabel}>Wait time: {formatDelay(delay)}</Text>
              
              <View style={styles.delayButtons}>
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => setDelay(Math.max(0, delay - 60))}
                >
                  <Text style={styles.delayButtonText}>-1h</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => setDelay(delay + 60)}
                >
                  <Text style={styles.delayButtonText}>+1h</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.delayButton}
                  onPress={() => setDelay(delay + 1440)}
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
                  onPress={() => setDelay(0)}
                >
                  <Text style={styles.quickDelayButtonText}>Immediate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => setDelay(60)}
                >
                  <Text style={styles.quickDelayButtonText}>1 hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => setDelay(1440)}
                >
                  <Text style={styles.quickDelayButtonText}>1 day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDelayButton}
                  onPress={() => setDelay(10080)}
                >
                  <Text style={styles.quickDelayButtonText}>1 week</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Preview */}
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
                      : 'Automation'
                    }
                  </Text>
                  <Text style={styles.previewDelay}>Delay: {formatDelay(delay)}</Text>
                </View>
              </View>
              {subject && (
                <Text style={styles.previewSubject}>{subject}</Text>
              )}
              <Text style={styles.previewContent} numberOfLines={3}>
                {content || 'Enter content to see preview...'}
              </Text>
            </View>
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
    maxHeight: '90%',
    minHeight: '70%',
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
});
