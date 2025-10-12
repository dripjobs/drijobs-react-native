import { timeTrackingService } from '@/services/TimeTrackingService';
import { ActiveClockSession } from '@/types/crew';
import { formatCurrency, formatDuration } from '@/utils/costCalculations';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface RemoteClockOutModalProps {
  visible: boolean;
  session: ActiveClockSession;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoteClockOutModal: React.FC<RemoteClockOutModalProps> = ({
  visible,
  session,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for remote clock-out');
      return;
    }

    setLoading(true);
    try {
      const result = await timeTrackingService.remoteClockOut(
        session.crewMemberId,
        'admin_1', // In real app, get from auth context
        reason.trim()
      );

      if (result.success) {
        Alert.alert(
          'Clock Out Successful',
          `${session.crewMemberName} has been clocked out remotely`,
          [{ text: 'OK', onPress: () => {
            setReason('');
            onConfirm();
          }}]
        );
      } else {
        Alert.alert('Clock Out Failed', result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Remote clock out error:', error);
      Alert.alert('Error', 'Failed to clock out crew member');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  const estimatedCost = (session.elapsedMinutes / 60) * session.hourlyRate;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="stop-circle" size={48} color="#ef4444" />
                </View>
                <Text style={styles.title}>Remote Clock Out</Text>
                <Text style={styles.subtitle}>
                  You are about to clock out a crew member remotely
                </Text>
              </View>

              {/* Crew Member Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Crew Member</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{session.crewMemberName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{session.jobName}</Text>
                  </View>
                  {session.jobAddress && (
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={20} color="#6b7280" />
                      <Text style={styles.infoText}>{session.jobAddress}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Time & Cost Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Time Summary</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Elapsed Time</Text>
                      <Text style={styles.summaryValue}>
                        {formatDuration(session.elapsedMinutes)}
                      </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Estimated Cost</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(estimatedCost)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Reason Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Reason <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Explain why you're clocking out this crew member
                </Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="e.g., End of work day, Emergency, Left site early, etc."
                  placeholderTextColor="#9ca3af"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{reason.length}/300</Text>
              </View>

              {/* Warning */}
              <View style={styles.warningCard}>
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Important</Text>
                  <Text style={styles.warningText}>
                    The crew member will be clocked out immediately. This action will be
                    logged and visible in the time entry record.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
                disabled={loading || !reason.trim()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="stop-circle" size={20} color="white" />
                    <Text style={styles.confirmButtonText}>Clock Out</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  required: {
    color: '#ef4444',
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#bfdbfe',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    backgroundColor: '#f9fafb',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  warningCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fffbeb',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

