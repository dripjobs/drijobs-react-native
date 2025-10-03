import DrawerMenu from '@/components/DrawerMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Mail,
    MessageSquare,
    Phone,
    Users,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Notification types
interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'payment' | 'reminder' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
}

// Sample notifications
const generateNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'message',
      title: 'New message from Robert Johnson',
      message: 'Can we reschedule tomorrow\'s appointment to 2 PM?',
      timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      read: false,
      actionable: true,
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
      actionable: true,
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
      actionable: false,
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
      read: true,
      actionable: true,
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
      read: true,
      actionable: false,
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
      read: true,
      actionable: true,
      icon: AlertCircle,
      iconColor: '#EF4444',
      iconBg: '#FEE2E2'
    },
    {
      id: '7',
      type: 'message',
      title: 'New SMS from (555) 123-4567',
      message: 'Thanks for the quote! When can you start?',
      timestamp: new Date(now.getTime() - 1 * 86400000), // 1 day ago
      read: true,
      actionable: true,
      icon: Phone,
      iconColor: '#6366F1',
      iconBg: '#E0E7FF'
    },
    {
      id: '8',
      type: 'appointment',
      title: 'New Appointment Request',
      message: 'David Martinez requested an appointment for next Tuesday',
      timestamp: new Date(now.getTime() - 2 * 86400000), // 2 days ago
      read: true,
      actionable: true,
      icon: Calendar,
      iconColor: '#8B5CF6',
      iconBg: '#EDE9FE'
    },
    {
      id: '9',
      type: 'update',
      title: 'Team Member Added',
      message: 'John Davis was added to Team A',
      timestamp: new Date(now.getTime() - 3 * 86400000), // 3 days ago
      read: true,
      actionable: false,
      icon: Users,
      iconColor: '#6366F1',
      iconBg: '#E0E7FF'
    },
    {
      id: '10',
      type: 'payment',
      title: 'Payment Reminder Sent',
      message: 'Payment reminder sent to 3 customers with outstanding invoices',
      timestamp: new Date(now.getTime() - 5 * 86400000), // 5 days ago
      read: true,
      actionable: false,
      icon: Mail,
      iconColor: '#8B5CF6',
      iconBg: '#EDE9FE'
    }
  ];
};

export default function Notifications() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setIsTransparent(false);
    setNotifications(generateNotifications());
  }, []);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Mark All as Read Button */}
      {unreadCount > 0 && (
        <View style={styles.markAllReadContainer}>
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={handleMarkAllAsRead}
          >
            <CheckCircle size={16} color="#6366F1" />
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'unread' 
                ? 'You\'re all caught up!' 
                : 'You don\'t have any notifications yet'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = notification.icon || Bell;
            return (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationCard, !notification.read && styles.notificationCardUnread]}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={[styles.notificationIcon, { backgroundColor: notification.iconBg }]}>
                  <IconComponent size={20} color={notification.iconColor} />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{getTimeAgo(notification.timestamp)}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {notification.actionable && (
                    <View style={styles.notificationActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNotification(notification.id)}
                >
                  <X size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {!notification.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterTabTextActive: {
    color: '#6366F1',
  },
  markAllReadContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  bottomSpacing: {
    height: 40,
  },
});

