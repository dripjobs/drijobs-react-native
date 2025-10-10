import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTabBar } from '@/contexts/TabBarContext';
import { Tabs } from 'expo-router';
import { BarChart3, Building2, Calendar, CalendarDays, Grid3x3, Hash, House, Mail, MessageCircle, MessageSquare, Package, SquareCheck, TrendingUp, Users, Wrench } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

// Custom Dialer Icon Component
const DialerIcon = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={[styles.dialerGrid, { width: size * 0.8, height: size * 0.8 }]}>
      {/* Top row */}
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      {/* Middle row */}
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      {/* Bottom row */}
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
      <View style={[styles.dialerDot, { backgroundColor: color }]} />
    </View>
  </View>
);

// Notification Badge Component
const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <View style={styles.notificationBadge} />
  );
};

// Icon mapper
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    House,
    Users,
    Handshake,
    MessageCircle,
    Hash,
    Building2,
    ClipboardList,
    SquareCheck,
    Mail,
  };
  return icons[iconName] || House;
};

export default function TabLayout() {
  const { isTransparent, isVisible } = useTabBar();
  const { missedCalls } = useNotifications();
  const { selectedTabs, isLoading } = useAppSettings();

  // If settings are loading, show default tabs
  if (isLoading) {
    return null;
  }

  // Create a set of selected tab IDs for quick lookup
  const selectedTabIds = new Set(selectedTabs.map(tab => tab.id));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: !isVisible ? { display: 'none' } : (isTransparent ? styles.transparentTabBar : styles.tabBar),
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarBackground: () => <View style={isTransparent ? styles.transparentTabBarBackground : styles.tabBarBackground} />,
      }}>
      {/* Dynamically render all tabs based on user preferences */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          href: selectedTabIds.has('index') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <House size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          href: selectedTabIds.has('contacts') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Users size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Pipeline',
          href: selectedTabIds.has('pipeline') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: 'Metrics',
          href: selectedTabIds.has('metrics') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="phone"
        options={{
          title: 'Voice',
          href: selectedTabIds.has('phone') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <View style={styles.tabIconContainer}>
              <Grid3x3 size={24} color={color} strokeWidth={2} />
              <NotificationBadge count={missedCalls} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          href: selectedTabIds.has('chat') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <MessageSquare size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="team-chat"
        options={{
          title: 'Team Chat',
          href: selectedTabIds.has('team-chat') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Hash size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="businesses"
        options={{
          title: 'Businesses',
          href: selectedTabIds.has('businesses') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Building2 size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="email"
        options={{
          title: 'Email',
          href: selectedTabIds.has('email') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Mail size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: 'Work Orders',
          href: selectedTabIds.has('work-orders') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Wrench size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          href: selectedTabIds.has('tasks') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <SquareCheck size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          href: selectedTabIds.has('products') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Package size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          href: selectedTabIds.has('appointments') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <Calendar size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="job-schedule"
        options={{
          title: 'Job Schedule',
          href: selectedTabIds.has('job-schedule') ? undefined : null,
          tabBarIcon: ({ size, color }) => (
            <CalendarDays size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
  },
  transparentTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    paddingBottom: 10,
    paddingTop: 10,
  },
  transparentTabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarIcon: {
    marginBottom: -2,
  },
  dialerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    margin: 1,
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -10,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});