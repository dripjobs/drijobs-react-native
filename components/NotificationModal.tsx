import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle,
    DollarSign,
    MessageSquare,
    X
} from 'lucide-react-native';
import React from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'payment' | 'reminder' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

// Get notifications from last 24 hours
const getRecentNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'message',
      title: 'New message from Robert Johnson',
      message: 'Can we reschedule tomorrow\'s appointment to 2 PM?',
      timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      read: false,
      icon: MessageSquare,
      iconColor: '#3B82F6',
      iconBg: '#DBEAFE'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Starting Soon',
      message: 'Kitchen Renovation at 4214 SE 11 PL starts in 1 hour',
      timestamp: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
      read: false,
      icon: Calendar,
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Sherry Williams paid $1,500.00 for Invoice #1234',
      timestamp: new Date(now.getTime() - 2 * 3600000), // 2 hours ago
      read: false,
      icon: DollarSign,
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Proposal Follow-up',
      message: 'Follow up with Mike Stewart about the roofing proposal',
      timestamp: new Date(now.getTime() - 4 * 3600000), // 4 hours ago
      read: false,
      icon: Bell,
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7'
    },
    {
      id: '5',
      type: 'update',
      title: 'Job Status Updated',
      message: 'Williams Property - Roof Replacement marked as completed',
      timestamp: new Date(now.getTime() - 6 * 3600000), // 6 hours ago
      read: false,
      icon: CheckCircle,
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    {
      id: '6',
      type: 'alert',
      title: 'Invoice Overdue',
      message: 'Invoice #1230 is 5 days overdue - $2,450.00',
      timestamp: new Date(now.getTime() - 20 * 3600000), // 20 hours ago
      read: false,
      icon: AlertCircle,
      iconColor: '#EF4444',
      iconBg: '#FEE2E2'
    }
  ];
};

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const router = useRouter();
  const notifications = getRecentNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  const handleViewAll = () => {
    onClose();
    router.push('/notifications');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalSafeArea}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Bell size={24} color="#111827" />
                <Text style={styles.modalTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>Last 24 hours</Text>

            {/* Notifications List */}
            <ScrollView 
              style={styles.notificationsList}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Bell size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No new notifications</Text>
                </View>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = notification.icon || Bell;
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={styles.notificationItem}
                    >
                      <View style={[styles.notificationIcon, { backgroundColor: notification.iconBg }]}>
                        <IconComponent size={18} color={notification.iconColor} />
                      </View>
                      
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle} numberOfLines={1}>
                          {notification.title}
                        </Text>
                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {getTimeAgo(notification.timestamp)}
                        </Text>
                      </View>

                      {!notification.read && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            {/* View All Button */}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAll}
            >
              <Text style={styles.viewAllButtonText}>View All Notifications</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalSafeArea: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0, // Let the button handle its own bottom padding
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginLeft: 8,
    marginTop: 4,
  },
  viewAllButton: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: Platform.OS === 'ios' ? 34 : 16, // Extra padding for iPhone home indicator
    paddingVertical: 14,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

