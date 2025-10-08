import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CheckSquare, FileText, Mic, MicOff, Minimize2, Pause, Phone, Play, Volume2, VolumeX, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ActiveCallModalProps {
  visible: boolean;
  onClose: () => void;
  contactName: string;
  phoneNumber: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

interface CallNote {
  id: string;
  text: string;
  timestamp: Date;
}

export default function ActiveCallModal({ 
  visible, 
  onClose, 
  contactName, 
  phoneNumber, 
  onMinimize,
  isMinimized = false 
}: ActiveCallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [taskText, setTaskText] = useState('');
  const [appointmentText, setAppointmentText] = useState('');
  const [callNotes, setCallNotes] = useState<CallNote[]>([]);
  
  const recordingPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setIsMuted(false);
      setIsOnHold(false);
      setIsSpeakerOn(false);
      setIsRecording(false);
      setCallNotes([]);
    }
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulseAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      recordingPulseAnim.setValue(1);
    }
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onClose();
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote: CallNote = {
        id: Date.now().toString(),
        text: noteText.trim(),
        timestamp: new Date(),
      };
      setCallNotes(prev => [...prev, newNote]);
      setNoteText('');
      setShowAddNote(false);
      Alert.alert('Success', 'Note added to call');
    }
  };

  const handleCreateTask = () => {
    if (taskText.trim()) {
      // Here you would typically save to your task management system
      Alert.alert('Success', `Task created: ${taskText}`);
      setTaskText('');
      setShowCreateTask(false);
    }
  };

  const handleCreateAppointment = () => {
    if (appointmentText.trim()) {
      // Here you would typically save to your appointment system
      Alert.alert('Success', `Appointment created: ${appointmentText}`);
      setAppointmentText('');
      setShowCreateAppointment(false);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (isMinimized) {
    return (
      <View style={styles.minimizedContainer}>
        <TouchableOpacity style={styles.minimizedCall} onPress={() => onMinimize?.()}>
          <View style={styles.minimizedInfo}>
            <View style={styles.minimizedAvatar}>
              <Text style={styles.minimizedAvatarText}>
                {contactName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.minimizedDetails}>
              <Text style={styles.minimizedName}>{contactName}</Text>
              <Text style={styles.minimizedDuration}>{formatDuration(callDuration)}</Text>
            </View>
          </View>
          {isRecording && (
            <Animated.View style={[styles.minimizedRecording, { opacity: recordingPulseAnim }]}>
              <View style={styles.minimizedRecordingDot} />
            </Animated.View>
          )}
          <TouchableOpacity style={styles.minimizedEndCall} onPress={handleEndCall}>
            <Phone size={16} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleEndCall}
    >
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={styles.container}
      >
        {/* Status Bar Area */}
        <View style={styles.statusArea}>
          <Text style={styles.statusText}>
            {isOnHold ? 'On Hold' : 'DripJobs'}
          </Text>
          <TouchableOpacity onPress={onMinimize} style={styles.minimizeButton}>
            <Minimize2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contactName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <View style={styles.callStatusRow}>
            <Text style={styles.callStatus}>
              {isOnHold ? 'on hold' : 'mobile'}
            </Text>
            {isRecording && (
              <>
                <View style={styles.statusDot} />
                <Animated.View style={[styles.recordingIndicator, { opacity: recordingPulseAnim }]}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Recording</Text>
                </Animated.View>
              </>
            )}
          </View>
        </View>

        {/* Call Duration */}
        <View style={styles.durationSection}>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionsContainer}>
          {/* Row 1 */}
          <View style={styles.actionsRow}>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, isMuted && styles.actionButtonActive]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff size={28} color="#FFFFFF" />
                ) : (
                  <Mic size={28} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text style={styles.actionLabel}>mute</Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {}}
              >
                <View style={styles.keypadIcon}>
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                  <View style={styles.keypadDot} />
                </View>
              </TouchableOpacity>
              <Text style={styles.actionLabel}>keypad</Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, isSpeakerOn && styles.actionButtonActive]}
                onPress={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? (
                  <Volume2 size={28} color="#FFFFFF" />
                ) : (
                  <VolumeX size={28} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text style={styles.actionLabel}>speaker</Text>
            </View>
          </View>

          {/* Row 2 - New Action Buttons */}
          <View style={styles.actionsRow}>
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowAddNote(true)}
              >
                <FileText size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>add notes</Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowCreateTask(true)}
              >
                <CheckSquare size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>create task</Text>
            </View>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowCreateAppointment(true)}
              >
                <Calendar size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>create appt</Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {/* Recording Button */}
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={handleToggleRecording}
          >
            {isRecording ? (
              <View style={styles.stopIcon} />
            ) : (
              <View style={styles.recordIcon} />
            )}
          </TouchableOpacity>

          {/* Hold Button */}
          <TouchableOpacity
            style={[styles.holdButton, isOnHold && styles.holdButtonActive]}
            onPress={() => setIsOnHold(!isOnHold)}
          >
            {isOnHold ? (
              <Play size={32} color="#FFFFFF" />
            ) : (
              <Pause size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Phone size={32} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Add Note Modal */}
        <Modal
          visible={showAddNote}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddNote(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Note</Text>
                <TouchableOpacity onPress={() => setShowAddNote(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="Add a note about this call..."
                placeholderTextColor="#AEAEB2"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowAddNote(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSaveButton}
                  onPress={handleAddNote}
                >
                  <Text style={styles.modalSaveText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Create Task Modal */}
        <Modal
          visible={showCreateTask}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCreateTask(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Task</Text>
                <TouchableOpacity onPress={() => setShowCreateTask(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter task description..."
                placeholderTextColor="#AEAEB2"
                value={taskText}
                onChangeText={setTaskText}
                multiline
                numberOfLines={3}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowCreateTask(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSaveButton}
                  onPress={handleCreateTask}
                >
                  <Text style={styles.modalSaveText}>Create Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Create Appointment Modal */}
        <Modal
          visible={showCreateAppointment}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCreateAppointment(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Appointment</Text>
                <TouchableOpacity onPress={() => setShowCreateAppointment(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter appointment details..."
                placeholderTextColor="#AEAEB2"
                value={appointmentText}
                onChangeText={setAppointmentText}
                multiline
                numberOfLines={3}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowCreateAppointment(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSaveButton}
                  onPress={handleCreateAppointment}
                >
                  <Text style={styles.modalSaveText}>Create Appointment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  statusArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  minimizeButton: {
    padding: 8,
  },
  contactSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  callStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  recordingText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  durationSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  durationText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  actionsContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionButtonContainer: {
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    textAlign: 'center',
  },
  keypadIcon: {
    width: 36,
    height: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomActions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
    gap: 32,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#FF3B30',
  },
  recordIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  stopIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  holdButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  endCallButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Minimized call styles
  minimizedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  minimizedCall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  minimizedInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  minimizedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  minimizedAvatarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  minimizedDetails: {
    flex: 1,
  },
  minimizedName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  minimizedDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  minimizedRecording: {
    marginRight: 12,
  },
  minimizedRecordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  minimizedEndCall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3A3A3C',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});