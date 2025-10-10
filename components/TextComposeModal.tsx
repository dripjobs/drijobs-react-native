import { MessageSquare, Phone, Send, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Customer {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

interface TextComposeModalProps {
  visible: boolean;
  onClose: () => void;
  customer?: Customer;
  onSendMessage?: (message: string, customer: Customer) => void;
}

export default function TextComposeModal({ 
  visible, 
  onClose, 
  customer,
  onSendMessage 
}: TextComposeModalProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Message Required', 'Please enter a message to send.');
      return;
    }

    if (!customer) {
      Alert.alert('Customer Required', 'Customer information is required to send a message.');
      return;
    }

    setIsSending(true);
    
    try {
      // Call the onSendMessage callback if provided
      if (onSendMessage) {
        await onSendMessage(message.trim(), customer);
      }
      
      // Clear the message and close modal
      setMessage('');
      onClose();
      
      // Show success message
      Alert.alert('Message Sent', `Text message sent to ${customer.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (message.trim()) {
      Alert.alert(
        'Discard Message',
        'Are you sure you want to discard this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setMessage('');
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
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
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compose Text</Text>
          <TouchableOpacity 
            style={[styles.sendButton, (!message.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || isSending}
          >
            <Send size={20} color={message.trim() && !isSending ? "#FFFFFF" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Customer Information */}
          {customer && (
            <View style={styles.customerInfo}>
              <View style={styles.customerHeader}>
                <View style={styles.customerIcon}>
                  <User size={20} color="#6366F1" />
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  {customer.company && (
                    <Text style={styles.customerCompany}>{customer.company}</Text>
                  )}
                  {customer.phone && (
                    <View style={styles.contactInfo}>
                      <Phone size={14} color="#6B7280" />
                      <Text style={styles.contactText}>{customer.phone}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Message Input */}
          <View style={styles.messageSection}>
            <Text style={styles.inputLabel}>Message</Text>
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
                maxLength={1600} // Standard SMS limit
              />
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {message.length}/1600
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Templates */}
          <View style={styles.templatesSection}>
            <Text style={styles.sectionTitle}>Quick Templates</Text>
            <View style={styles.templatesGrid}>
              {[
                "Hi! This is [Your Name] from [Company]. How can I help you today?",
                "Thank you for your interest! I'll send you more information shortly.",
                "Your appointment is confirmed for [Date] at [Time]. See you then!",
                "I wanted to follow up on your recent inquiry. Are you still interested?",
                "Thank you for choosing us! We'll be in touch soon with next steps."
              ].map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.templateButton}
                  onPress={() => setMessage(template)}
                >
                  <MessageSquare size={16} color="#6366F1" />
                  <Text style={styles.templateText} numberOfLines={2}>
                    {template}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sendButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  customerInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  customerCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  messageInputContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    minHeight: 120,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
  characterCount: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  characterCountText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  templatesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  templatesGrid: {
    gap: 12,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
