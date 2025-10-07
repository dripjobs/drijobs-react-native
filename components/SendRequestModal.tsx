import { Copy, Mail, MessageSquare, Phone, Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface SendRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SendRequestModal({ visible, onClose }: SendRequestModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null);
  const [recipient, setRecipient] = useState('');
  const [smsMessage, setSmsMessage] = useState('Hi! Thank you for requesting an appointment with DripJobs Painting. Please click here to submit your information: https://premium.dripjobs.com/book/default');
  const [emailSubject, setEmailSubject] = useState('Schedule Your Appointment with DripJobs Painting');
  const [emailBody, setEmailBody] = useState('Hi!\n\nThank you for requesting an appointment with DripJobs Painting. Please click the link below to submit your information and schedule your appointment:\n\nhttps://premium.dripjobs.com/book/default\n\nWe look forward to working with you!\n\nBest regards,\nDripJobs Painting Team');
  const [showCallHistory, setShowCallHistory] = useState(false);

  // Mock call history - in real app, this would come from phone integration
  const recentCalls = [
    { name: 'Jennifer Martinez', phone: '(555) 111-2222', time: '2 hours ago' },
    { name: 'Robert Chen', phone: '(555) 456-7890', time: '5 hours ago' },
    { name: 'Amanda Foster', phone: '(555) 321-6547', time: 'Yesterday' },
    { name: 'Unknown', phone: '(555) 789-4561', time: 'Yesterday' },
  ];

  const bookingFormName = 'Default Booking Form';
  const bookingFormUrl = 'https://premium.dripjobs.com/book/default';

  const handleClose = () => {
    setSelectedMethod(null);
    setRecipient('');
    setShowCallHistory(false);
    onClose();
  };

  const handleSelectFromCallHistory = (phone: string) => {
    setRecipient(phone);
    setShowCallHistory(false);
    if (!selectedMethod) {
      setSelectedMethod('sms');
    }
  };

  const handleSendRequest = () => {
    if (!recipient) {
      Toast.show({
        type: 'error',
        text1: 'Recipient Required',
        text2: 'Please enter a phone number or email address',
      });
      return;
    }

    if (!selectedMethod) {
      Toast.show({
        type: 'error',
        text1: 'Method Required',
        text2: 'Please select SMS or Email',
      });
      return;
    }

    // In real app, this would send the SMS/Email
    Toast.show({
      type: 'success',
      text1: 'Request Sent!',
      text2: `Booking link sent via ${selectedMethod.toUpperCase()}`,
    });

    handleClose();
  };

  const handleCopyLink = () => {
    // In real app, this would copy to clipboard
    Toast.show({
      type: 'success',
      text1: 'Link Copied!',
      text2: 'Booking form URL copied to clipboard',
    });
  };

  const handleFillOnBehalf = () => {
    // In real app, this would navigate to the booking form
    Toast.show({
      type: 'info',
      text1: 'Opening Form',
      text2: 'Fill out the form on behalf of the customer',
    });
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Send Booking Request</Text>
            <Text style={styles.subtitle}>Quick way to send a booking link to customers</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Booking Form Info */}
          <View style={styles.formInfoCard}>
            <View style={styles.formInfoHeader}>
              <Text style={styles.formInfoLabel}>Booking Form</Text>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
            <Text style={styles.formName}>{bookingFormName}</Text>
            <TouchableOpacity style={styles.copyUrlButton} onPress={handleCopyLink}>
              <Copy size={16} color="#6366F1" />
              <Text style={styles.copyUrlText}>{bookingFormUrl}</Text>
            </TouchableOpacity>
          </View>

          {/* What Happens Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>What happens when the form is submitted?</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>A new contact will be created</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>A deal will be created in "Estimate Requested" stage</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>An appointment request will be created for follow-up</Text>
              </View>
            </View>
          </View>

          {/* Main Actions */}
          <View style={styles.mainActions}>
            <Text style={styles.sectionTitle}>Choose an option</Text>
            
            {/* Send to Customer */}
            <TouchableOpacity 
              style={styles.primaryActionCard}
              onPress={() => setShowCallHistory(false)}
            >
              <View style={styles.actionIconContainer}>
                <Send size={24} color="#FFFFFF" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Send Link to Customer</Text>
                <Text style={styles.actionDescription}>Send booking link via SMS or email</Text>
              </View>
            </TouchableOpacity>

            {/* Fill on Behalf */}
            <TouchableOpacity 
              style={styles.secondaryActionCard}
              onPress={handleFillOnBehalf}
            >
              <View style={styles.actionIconContainerSecondary}>
                <Phone size={24} color="#6366F1" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitleSecondary}>Fill Out on Their Behalf</Text>
                <Text style={styles.actionDescriptionSecondary}>
                  Customer on the phone? Fill out the form for them
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Send Link Section */}
          <View style={styles.sendSection}>
            <Text style={styles.sectionTitle}>Send Booking Link</Text>

            {/* Recipient Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number or email"
                  placeholderTextColor="#9CA3AF"
                  value={recipient}
                  onChangeText={setRecipient}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.callHistoryButton}
                  onPress={() => setShowCallHistory(!showCallHistory)}
                >
                  <Phone size={18} color="#6366F1" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Call History */}
            {showCallHistory && (
              <View style={styles.callHistoryCard}>
                <Text style={styles.callHistoryTitle}>Recent Calls</Text>
                {recentCalls.map((call, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.callHistoryItem}
                    onPress={() => handleSelectFromCallHistory(call.phone)}
                  >
                    <View style={styles.callHistoryInfo}>
                      <Text style={styles.callHistoryName}>{call.name}</Text>
                      <Text style={styles.callHistoryPhone}>{call.phone}</Text>
                    </View>
                    <Text style={styles.callHistoryTime}>{call.time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Method Selection */}
            <View style={styles.methodSelection}>
              <Text style={styles.inputLabel}>Send via</Text>
              <View style={styles.methodButtons}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    selectedMethod === 'sms' && styles.methodButtonActive
                  ]}
                  onPress={() => setSelectedMethod('sms')}
                >
                  <MessageSquare 
                    size={20} 
                    color={selectedMethod === 'sms' ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    selectedMethod === 'sms' && styles.methodButtonTextActive
                  ]}>
                    SMS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    selectedMethod === 'email' && styles.methodButtonActive
                  ]}
                  onPress={() => setSelectedMethod('email')}
                >
                  <Mail 
                    size={20} 
                    color={selectedMethod === 'email' ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    selectedMethod === 'email' && styles.methodButtonTextActive
                  ]}>
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SMS Message Template */}
            {selectedMethod === 'sms' && (
              <View style={styles.messageTemplate}>
                <Text style={styles.inputLabel}>SMS Message</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter SMS message"
                  placeholderTextColor="#9CA3AF"
                  value={smsMessage}
                  onChangeText={setSmsMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Email Template */}
            {selectedMethod === 'email' && (
              <View style={styles.messageTemplate}>
                <Text style={styles.inputLabel}>Email Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email subject"
                  placeholderTextColor="#9CA3AF"
                  value={emailSubject}
                  onChangeText={setEmailSubject}
                />

                <Text style={[styles.inputLabel, { marginTop: 16 }]}>Email Body</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter email body"
                  placeholderTextColor="#9CA3AF"
                  value={emailBody}
                  onChangeText={setEmailBody}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  defaultBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  copyUrlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyUrlText: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  mainActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  primaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  actionIconContainerSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitleSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescriptionSecondary: {
    fontSize: 14,
    color: '#6B7280',
  },
  sendSection: {
    marginTop: 24,
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#1F2937',
  },
  callHistoryButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  callHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  callHistoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  callHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  callHistoryInfo: {
    flex: 1,
  },
  callHistoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  callHistoryPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  callHistoryTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  methodSelection: {
    marginBottom: 16,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  methodButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  methodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  messageTemplate: {
    marginTop: 16,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    color: '#1F2937',
    minHeight: 100,
  },
  bottomSpacing: {
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
