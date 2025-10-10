import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

interface ClockOutModalProps {
  visible: boolean;
  jobName: string;
  elapsedTime: string;
  onConfirm: (notes?: string) => void;
  onCancel: () => void;
}

export const ClockOutModal: React.FC<ClockOutModalProps> = ({
  visible,
  jobName,
  elapsedTime,
  onConfirm,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes(''); // Reset notes for next time
  };

  const handleCancel = () => {
    setNotes(''); // Reset notes
    onCancel();
  };

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
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="stop-circle" size={48} color="#ef4444" />
                </View>
                <Text style={styles.title}>Clock Out</Text>
                <Text style={styles.subtitle}>Ending work on:</Text>
                <Text style={styles.jobName}>{jobName}</Text>
                <View style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Time Worked</Text>
                  <Text style={styles.timeValue}>{elapsedTime}</Text>
                </View>
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>
                  Notes (Optional)
                </Text>
                <Text style={styles.notesHint}>
                  Add any notes about your departure or work completion
                </Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Completed all tasks, Left early - family emergency, etc."
                  placeholderTextColor="#9ca3af"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{notes.length}/300</Text>
              </View>

              <View style={styles.exampleSection}>
                <Text style={styles.exampleTitle}>Example notes:</Text>
                <Text style={styles.exampleText}>• "Completed all assigned tasks"</Text>
                <Text style={styles.exampleText}>• "Left early - family emergency"</Text>
                <Text style={styles.exampleText}>• "Working through lunch today"</Text>
                <Text style={styles.exampleText}>• "Job took longer than expected"</Text>
              </View>
            </ScrollView>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Ionicons name="stop-circle" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.confirmButtonText}>Clock Out</Text>
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
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeCard: {
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400e',
  },
  notesSection: {
    padding: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notesHint: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  notesInput: {
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
  exampleSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#f9fafb',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
  buttonIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

