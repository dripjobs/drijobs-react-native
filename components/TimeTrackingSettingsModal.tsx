import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
import { timeTrackingService } from '../services/TimeTrackingService';
import { TimeTrackingSettings } from '../types/crew';

interface TimeTrackingSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const TimeTrackingSettingsModal: React.FC<TimeTrackingSettingsModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<TimeTrackingSettings>(
    timeTrackingService.getSettings()
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await timeTrackingService.updateSettings(settings, 'admin');
      if (success) {
        Alert.alert('Success', 'Settings saved successfully', [
          { text: 'OK', onPress: () => {
            onSave?.();
            onClose();
          }},
        ]);
      } else {
        Alert.alert('Error', 'Failed to save settings');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof TimeTrackingSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Time Tracking Settings</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Overtime Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overtime Rules</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Daily Overtime Threshold (hours)</Text>
              <TextInput
                style={styles.input}
                value={settings.overtimeThresholdHours.toString()}
                onChangeText={text => updateSetting('overtimeThresholdHours', parseFloat(text) || 8)}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Overtime Multiplier</Text>
              <TextInput
                style={styles.input}
                value={settings.overtimeMultiplier.toString()}
                onChangeText={text => updateSetting('overtimeMultiplier', parseFloat(text) || 1.5)}
                keyboardType="numeric"
                placeholder="1.5"
              />
            </View>
          </View>

          {/* Cost Calculations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Calculations</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Overhead Multiplier (%)</Text>
              <Text style={styles.helpText}>
                Add percentage for benefits, insurance, etc.
              </Text>
              <TextInput
                style={styles.input}
                value={(settings.overheadMultiplier * 100).toString()}
                onChangeText={text =>
                  updateSetting('overheadMultiplier', (parseFloat(text) || 0) / 100)
                }
                keyboardType="numeric"
                placeholder="30"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Benefits Percentage (%)</Text>
              <TextInput
                style={styles.input}
                value={(settings.benefitsPercentage * 100).toString()}
                onChangeText={text =>
                  updateSetting('benefitsPercentage', (parseFloat(text) || 0) / 100)
                }
                keyboardType="numeric"
                placeholder="15"
              />
            </View>
          </View>

          {/* Break Policies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Break Policies</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Break Deduction Policy</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => updateSetting('breakDeductionPolicy', 'none')}
                >
                  <Ionicons
                    name={
                      settings.breakDeductionPolicy === 'none'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={settings.breakDeductionPolicy === 'none' ? '#3b82f6' : '#9ca3af'}
                  />
                  <Text style={styles.radioLabel}>None</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => updateSetting('breakDeductionPolicy', 'auto_30min')}
                >
                  <Ionicons
                    name={
                      settings.breakDeductionPolicy === 'auto_30min'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={settings.breakDeductionPolicy === 'auto_30min' ? '#3b82f6' : '#9ca3af'}
                  />
                  <Text style={styles.radioLabel}>Auto 30min</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => updateSetting('breakDeductionPolicy', 'auto_60min')}
                >
                  <Ionicons
                    name={
                      settings.breakDeductionPolicy === 'auto_60min'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={settings.breakDeductionPolicy === 'auto_60min' ? '#3b82f6' : '#9ca3af'}
                  />
                  <Text style={styles.radioLabel}>Auto 60min</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => updateSetting('breakDeductionPolicy', 'manual')}
                >
                  <Ionicons
                    name={
                      settings.breakDeductionPolicy === 'manual'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={settings.breakDeductionPolicy === 'manual' ? '#3b82f6' : '#9ca3af'}
                  />
                  <Text style={styles.radioLabel}>Manual</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* GPS Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GPS Settings</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Require GPS for Clock In</Text>
                <Text style={styles.helpText}>Verify location when clocking in</Text>
              </View>
              <Switch
                value={settings.requireGPSForClockIn}
                onValueChange={value => updateSetting('requireGPSForClockIn', value)}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Require GPS for Clock Out</Text>
                <Text style={styles.helpText}>Verify location when clocking out</Text>
              </View>
              <Switch
                value={settings.requireGPSForClockOut}
                onValueChange={value => updateSetting('requireGPSForClockOut', value)}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Allow GPS Exceptions</Text>
                <Text style={styles.helpText}>Permit clock in/out without GPS if unavailable</Text>
              </View>
              <Switch
                value={settings.allowedGPSlessExceptions}
                onValueChange={value => updateSetting('allowedGPSlessExceptions', value)}
              />
            </View>
          </View>

          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Settings</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Enable Break Tracking</Text>
                <Text style={styles.helpText}>Allow crew to track breaks</Text>
              </View>
              <Switch
                value={settings.enableBreakTracking}
                onValueChange={value => updateSetting('enableBreakTracking', value)}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Require Job Selection</Text>
                <Text style={styles.helpText}>Must select job to clock in</Text>
              </View>
              <Switch
                value={settings.requireJobSelection}
                onValueChange={value => updateSetting('requireJobSelection', value)}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Allow Manual Time Entry</Text>
                <Text style={styles.helpText}>Admin can manually add time entries</Text>
              </View>
              <Switch
                value={settings.allowManualTimeEntry}
                onValueChange={value => updateSetting('allowManualTimeEntry', value)}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
});

