import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Chrome as Home, Users, Handshake, Phone, MessageCircle, Square } from 'lucide-react-native';
import { useTabBar } from '@/contexts/TabBarContext';
import { useNotifications } from '@/contexts/NotificationContext';

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

export default function TabLayout() {
  const { isTransparent } = useTabBar();
  const { missedCalls } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isTransparent ? styles.transparentTabBar : styles.tabBar,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarBackground: () => <View style={isTransparent ? styles.transparentTabBarBackground : styles.tabBarBackground} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ size, color }) => (
            <Users size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Pipeline',
          tabBarIcon: ({ size, color }) => (
            <Handshake size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="phone"
        options={{
          title: 'Phone',
          tabBarIcon: ({ size, color }) => (
            <View style={styles.tabIconContainer}>
              <DialerIcon size={24} color={color} />
              <NotificationBadge count={missedCalls} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={24} color={color} strokeWidth={2} />
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