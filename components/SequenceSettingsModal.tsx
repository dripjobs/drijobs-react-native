import { AlertTriangle, Clock, Info, Moon, Save, Settings, Shield, Sun, X, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
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

interface SequenceSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  sequence: any;
  onSave: (updates: any) => void;
}

export default function SequenceSettingsModal({
  visible,
  onClose,
  sequence,
  onSave
}: SequenceSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'moved_to_stage',
    status: 'active',
    timingMode: 'previous_action',
    optOutRules: [] as string[],
    sendRules: {
      businessHours: {
        startHour: 8,
        endHour: 20
      },
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      skipHolidays: true
    },
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    if (visible && sequence) {
      setFormData({
        name: sequence.name,
        description: sequence.description || '',
        trigger: sequence.trigger,
        status: sequence.status,
        timingMode: sequence.timingMode,
        optOutRules: sequence.optOutRules || [],
        sendRules: sequence.sendRules || {
          businessHours: {
            startHour: 8,
            endHour: 20
          },
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          skipHolidays: true
        },
        isActive: sequence.isActive !== undefined ? sequence.isActive : true
      });
      setErrors({});
    }
  }, [visible, sequence]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Sequence name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      trigger: formData.trigger,
      status: formData.status,
      timingMode: formData.timingMode,
      optOutRules: formData.optOutRules,
      sendRules: formData.sendRules,
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

  const handleOptOutRuleToggle = (rule: string) => {
    const currentRules = formData.optOutRules;
    const newRules = currentRules.includes(rule)
      ? currentRules.filter(r => r !== rule)
      : [...currentRules, rule];
    handleChange('optOutRules', newRules);
  };

  const handleDayToggle = (day: number) => {
    const currentDays = formData.sendRules.daysOfWeek;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    handleChange('sendRules', { ...formData.sendRules, daysOfWeek: newDays });
  };

  const getDayShortName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  if (!visible || !sequence) return null;

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
              <Text style={styles.headerTitle}>Sequence Settings</Text>
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
                Configure the fundamental properties of your sequence
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sequence Name *</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'name' && styles.inputContainerFocused,
                errors.name && styles.inputContainerError
              ]}>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder="Enter sequence name"
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
                  placeholder="Describe what this sequence does"
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
                Choose when your sequence should start
              </Text>
            </View>

            <View style={styles.radioGroup}>
              {[
                { value: 'moved_to_stage', label: 'When moved to stage', desc: 'Trigger when card moved into this stage' },
                { value: 'created_in_stage', label: 'When created in stage', desc: 'Trigger when card created in this stage' },
                { value: 'both', label: 'Both moved and created', desc: 'Trigger for both scenarios' }
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioOption,
                    formData.trigger === option.value && styles.radioOptionActive
                  ]}
                  onPress={() => handleChange('trigger', option.value)}
                >
                  <View style={[
                    styles.radioCircle,
                    formData.trigger === option.value && styles.radioCircleActive
                  ]}>
                    {formData.trigger === option.value && (
                      <View style={styles.radioCircleInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                    <Text style={styles.radioDesc}>{option.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Timing Configuration */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={18} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Timing Mode</Text>
            </View>

            <View style={[styles.helperBox, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
              <Info size={14} color="#F59E0B" />
              <Text style={styles.helperText}>
                Control how delays are calculated between actions
              </Text>
            </View>

            <View style={styles.radioGroup}>
              {[
                { value: 'previous_action', label: 'Based on previous action', desc: 'Each delay relative to previous step' },
                { value: 'time_in_stage', label: 'Based on time in stage', desc: 'All delays relative to stage entry' }
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioOption,
                    formData.timingMode === option.value && styles.radioOptionActive
                  ]}
                  onPress={() => handleChange('timingMode', option.value)}
                >
                  <View style={[
                    styles.radioCircle,
                    formData.timingMode === option.value && styles.radioCircleActive
                  ]}>
                    {formData.timingMode === option.value && (
                      <View style={styles.radioCircleInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                    <Text style={styles.radioDesc}>{option.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rules & Preferences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Shield size={18} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Rules & Preferences</Text>
            </View>

            <View style={[styles.helperBox, { backgroundColor: '#EEF2FF', borderColor: '#E0E7FF' }]}>
              <Info size={14} color="#6366F1" />
              <Text style={styles.helperText}>
                Configure sequence behavior and send preferences
              </Text>
            </View>

            {/* Stop Conditions */}
            <Text style={styles.subsectionTitle}>Stop Conditions</Text>
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => handleOptOutRuleToggle('customer_replies')}
            >
              <View style={[
                styles.checkbox,
                formData.optOutRules.includes('customer_replies') && styles.checkboxActive
              ]}>
                {formData.optOutRules.includes('customer_replies') && (
                  <Text style={styles.checkboxCheck}>✓</Text>
                )}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxLabel}>Stop when customer replies</Text>
                <Text style={styles.checkboxDesc}>Auto-stop if customer responds</Text>
              </View>
            </TouchableOpacity>

            {/* Business Hours */}
            <Text style={styles.subsectionTitle}>Business Hours</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hourPicker}>
                <Sun size={16} color="#F59E0B" />
                <Text style={styles.hourLabel}>Start</Text>
                <View style={styles.hourValue}>
                  <Text style={styles.hourValueText}>
                    {formatHour(formData.sendRules.businessHours.startHour)}
                  </Text>
                </View>
              </View>
              <Text style={styles.hourSeparator}>to</Text>
              <View style={styles.hourPicker}>
                <Moon size={16} color="#6366F1" />
                <Text style={styles.hourLabel}>End</Text>
                <View style={styles.hourValue}>
                  <Text style={styles.hourValueText}>
                    {formatHour(formData.sendRules.businessHours.endHour)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Days of Week */}
            <Text style={styles.subsectionTitle}>Days of Week</Text>
            <View style={styles.daysGrid}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    formData.sendRules.daysOfWeek.includes(day) && styles.dayButtonActive
                  ]}
                  onPress={() => handleDayToggle(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.sendRules.daysOfWeek.includes(day) && styles.dayButtonTextActive
                  ]}>
                    {getDayShortName(day)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Holidays */}
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => handleChange('sendRules', {
                ...formData.sendRules,
                skipHolidays: !formData.sendRules.skipHolidays
              })}
            >
              <View style={[
                styles.checkbox,
                formData.sendRules.skipHolidays && styles.checkboxActive
              ]}>
                {formData.sendRules.skipHolidays && (
                  <Text style={styles.checkboxCheck}>✓</Text>
                )}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxLabel}>Skip Major US Holidays</Text>
                <Text style={styles.checkboxDesc}>New Year, Memorial Day, July 4th, etc.</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Active Status */}
          <View style={styles.section}>
            <View style={styles.activeSwitchRow}>
              <View style={styles.activeSwitchContent}>
                <View style={[styles.sectionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Zap size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.activeSwitchTitle}>Sequence Active</Text>
                  <Text style={styles.activeSwitchDesc}>Control whether this sequence runs</Text>
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
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  radioOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: '#6366F1',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  radioDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  checkboxDesc: {
    fontSize: 12,
    color: '#6B7280',
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
  bottomSpacer: {
    height: 40,
  },
});
