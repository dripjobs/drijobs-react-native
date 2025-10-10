import { AutomationWorkflow } from '@/types/automations';
import { AlertTriangle, Info, Moon, Save, Settings, Shield, Sun, Trash2, X, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AutomationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  automation: AutomationWorkflow | null;
  onSave: (updates: any) => void;
}

export default function AutomationSettingsModal({
  visible,
  onClose,
  automation,
  onSave
}: AutomationSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'paused' | 'draft',
    trigger: {
      pipeline: 'proposals' as string,
      stage: 'accepted' as string,
      event: 'moved_to_stage' as 'created_in_stage' | 'moved_to_stage' | 'both',
      labels: [] as string[]
    },
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    if (visible && automation) {
      setFormData({
        name: automation.name,
        description: automation.description || '',
        status: automation.status,
        trigger: automation.trigger,
        isActive: automation.isActive
      });
      setErrors({});
    }
  }, [visible, automation]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Automation name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      trigger: formData.trigger,
      isActive: formData.isActive
    });
    
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDeleteAutomation = () => {
    Alert.alert(
      'Delete Automation',
      'Are you sure you want to delete this automation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle delete
            onClose();
          }
        }
      ]
    );
  };

  if (!visible || !automation) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Settings size={24} color="#FFFFFF" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Automation Settings</Text>
              <Text style={styles.headerSubtitle}>Configure behavior and rules</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <Save size={20} color="#6366F1" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Zap size={18} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.helperBox}>
              <Info size={14} color="#3B82F6" />
              <Text style={styles.helperText}>
                Configure the fundamental properties of your automation
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Automation Name *</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'name' && styles.inputContainerFocused,
                errors.name && styles.inputContainerError
              ]}>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder="Enter automation name"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.name && (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={12} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerButtonsRow}>
                  {['active', 'paused', 'draft'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.pickerButton,
                        formData.status === status && styles.pickerButtonActive
                      ]}
                      onPress={() => handleChange('status', status)}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        formData.status === status && styles.pickerButtonTextActive
                      ]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'description' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholder="Describe what this automation does"
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
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#EDE9FE' }]}>
                <Zap size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.sectionTitle}>Trigger Configuration</Text>
            </View>

            <View style={[styles.helperBox, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
              <Info size={14} color="#8B5CF6" />
              <Text style={styles.helperText}>
                Choose when your automation should start
              </Text>
            </View>

            <View style={styles.triggerInfo}>
              <View style={styles.triggerInfoItem}>
                <Text style={styles.triggerInfoLabel}>Pipeline</Text>
                <Text style={styles.triggerInfoValue}>
                  {formData.trigger.pipeline.charAt(0).toUpperCase() + formData.trigger.pipeline.slice(1)}
                </Text>
              </View>
              <View style={styles.triggerInfoItem}>
                <Text style={styles.triggerInfoLabel}>Stage</Text>
                <Text style={styles.triggerInfoValue}>
                  {formData.trigger.stage.charAt(0).toUpperCase() + formData.trigger.stage.slice(1)}
                </Text>
              </View>
              <View style={styles.triggerInfoItem}>
                <Text style={styles.triggerInfoLabel}>Event</Text>
                <Text style={styles.triggerInfoValue}>
                  {formData.trigger.event === 'moved_to_stage' ? 'Moved to Stage' :
                   formData.trigger.event === 'created_in_stage' ? 'Created in Stage' : 'Both'}
                </Text>
              </View>
            </View>
          </View>

          {/* Execution Rules */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Shield size={18} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Execution Rules</Text>
            </View>

            <View style={[styles.helperBox, { backgroundColor: '#EEF2FF', borderColor: '#E0E7FF' }]}>
              <Info size={14} color="#6366F1" />
              <Text style={styles.helperText}>
                Configure automation behavior and execution preferences
              </Text>
            </View>

            {/* Business Hours */}
            <Text style={styles.subsectionTitle}>Business Hours</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hourPicker}>
                <Sun size={16} color="#F59E0B" />
                <Text style={styles.hourLabel}>Start</Text>
                <View style={styles.hourValue}>
                  <Text style={styles.hourValueText}>8:00 AM</Text>
                </View>
              </View>
              <Text style={styles.hourSeparator}>to</Text>
              <View style={styles.hourPicker}>
                <Moon size={16} color="#6366F1" />
                <Text style={styles.hourLabel}>End</Text>
                <View style={styles.hourValue}>
                  <Text style={styles.hourValueText}>6:00 PM</Text>
                </View>
              </View>
            </View>

            {/* Days of Week */}
            <Text style={styles.subsectionTitle}>Days of Week</Text>
            <View style={styles.daysGrid}>
              {[
                { day: 0, label: 'Sun' },
                { day: 1, label: 'Mon' },
                { day: 2, label: 'Tue' },
                { day: 3, label: 'Wed' },
                { day: 4, label: 'Thu' },
                { day: 5, label: 'Fri' },
                { day: 6, label: 'Sat' }
              ].map(({ day, label }) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    true && styles.dayButtonActive // Mock: all days selected
                  ]}
                >
                  <Text style={[
                    styles.dayButtonText,
                    true && styles.dayButtonTextActive
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Execution Limits */}
            <Text style={styles.subsectionTitle}>Execution Limits</Text>
            <View style={styles.limitContainer}>
              <View style={styles.limitItem}>
                <Text style={styles.limitLabel}>Max executions per day</Text>
                <Text style={styles.limitValue}>50</Text>
              </View>
              <View style={styles.limitItem}>
                <Text style={styles.limitLabel}>Cooldown period</Text>
                <Text style={styles.limitValue}>1 hour</Text>
              </View>
            </View>
          </View>

          {/* Active Status */}
          <View style={styles.section}>
            <View style={styles.activeSwitchRow}>
              <View style={styles.activeSwitchContent}>
                <View style={[styles.sectionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Zap size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.activeSwitchTitle}>Automation Active</Text>
                  <Text style={styles.activeSwitchDesc}>Control whether this automation runs</Text>
                </View>
              </View>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => handleChange('isActive', value)}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Trash2 size={18} color="#EF4444" />
              </View>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
            </View>

            <View style={styles.dangerZone}>
              <View style={styles.dangerZoneItem}>
                <View style={styles.dangerZoneContent}>
                  <Text style={styles.dangerZoneTitle}>Delete Automation</Text>
                  <Text style={styles.dangerZoneDesc}>
                    Permanently delete this automation and all its execution history
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.dangerZoneButton}
                  onPress={handleDeleteAutomation}
                >
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={styles.dangerZoneButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },
  inputContainerError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  pickerContainer: {
    marginBottom: 0,
  },
  pickerButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  pickerButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pickerButtonTextActive: {
    color: '#6366F1',
  },
  triggerInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  triggerInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  triggerInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  triggerInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hourPicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  hourLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  hourValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  hourValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  hourSeparator: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  dayButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  dayButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayButtonTextActive: {
    color: '#6366F1',
  },
  limitContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  limitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  limitLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeSwitchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeSwitchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  activeSwitchDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  dangerZone: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerZoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dangerZoneContent: {
    flex: 1,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dangerZoneDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  dangerZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  dangerZoneButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});
