import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Activity, BarChart3, Bell, Building2, Calendar, Calendar as CalendarIcon, CheckSquare, CircleUser, Clock, Droplets, FileCheck, FileText, Home, Mail, MessageCircle, MessageSquare, Mic, RotateCcw, Settings2, Star, Users, Wrench, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const [translateX] = useState(new Animated.Value(-280));
  const [mainTranslateX] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;

  const menuSections = [
    {
      title: 'Core',
      items: [
        { icon: Home, label: 'Dashboard', action: () => router.push('/(tabs)/'), primary: true },
        { icon: Users, label: 'Contacts', action: () => router.push('/(tabs)/contacts'), primary: true },
        { icon: Building2, label: 'Businesses', action: () => router.push('/(tabs)/businesses'), primary: true },
        { icon: BarChart3, label: 'Pipeline', action: () => router.push('/(tabs)/pipeline'), primary: true },
      ]
    },
        {
          title: 'Communication',
          items: [
            { icon: Mic, label: 'Voice', action: () => router.push('/(tabs)/phone') },
            { icon: MessageSquare, label: 'Chat', action: () => router.push('/(tabs)/chat') },
            { icon: Mail, label: 'Email', action: () => router.push('/email') },
            { icon: MessageCircle, label: 'Team Chat', action: () => router.push('/(tabs)/team-chat') },
          ]
        },
    {
      title: 'Scheduling',
      items: [
        { icon: Calendar, label: 'Appointments', action: () => router.push('/appointments') },
        { icon: Clock, label: 'Job Schedule', action: () => router.push('/job-schedule') },
        { icon: CalendarIcon, label: 'Booking Forms', action: () => router.push('/booking-forms') },
        { icon: RotateCcw, label: 'Recurring Jobs', action: () => router.push('/recurring-jobs') },
      ]
    },
    {
      title: 'Business',
      items: [
        { icon: FileText, label: 'Invoices', action: () => router.push('/invoices') },
        { icon: FileCheck, label: 'Proposals', action: () => router.push('/proposals') },
        { icon: Wrench, label: 'Work Orders', action: () => router.push('/(tabs)/work-orders') },
        { icon: Star, label: 'Reviews', action: () => router.push('/reviews') },
      ]
    },
        {
          title: 'Productivity',
          items: [
            { icon: CheckSquare, label: 'Tasks', action: () => router.push('/(tabs)/tasks') },
            { icon: Activity, label: 'Metrics', action: () => router.push('/metrics') },
            { icon: Droplets, label: 'Drips', action: () => router.push('/drips') },
          ]
        },
    {
      title: 'System',
      items: [
        { icon: Bell, label: 'Notifications', action: () => router.push('/notifications') },
        { icon: Settings2, label: 'Settings', action: () => router.push('/account-settings') },
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Slide drawer in from left and push main content to right
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(mainTranslateX, {
          toValue: 280,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide drawer out to left and bring main content back
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -280,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(mainTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleSwipeLeft = (event: any) => {
    const { translationX, velocityX } = event.nativeEvent;
    
    if (translationX < -100 || velocityX < -500) {
      // Close drawer if swiped left enough or with enough velocity
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -280,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(mainTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    } else {
      // Snap back to original position
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(mainTranslateX, {
          toValue: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSwipeMove = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (translationX <= 0) {
      translateX.setValue(translationX);
      mainTranslateX.setValue(280 + translationX);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.mainContent,
            {
              transform: [{ translateX: mainTranslateX }]
            }
          ]}
        >
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        </Animated.View>
        
        <PanGestureHandler
          onGestureEvent={handleSwipeMove}
          onHandlerStateChange={handleSwipeLeft}
        >
          <Animated.View 
            style={[
              styles.drawer,
              {
                transform: [{ translateX: translateX }]
              }
            ]}
          >
            <SafeAreaView style={styles.drawerContent}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <View style={styles.header}>
                  <View style={styles.profile}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>JD</Text>
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.name}>John Doe</Text>
                      <Text style={styles.email}>john.doe@company.com</Text>
                      <Text style={styles.role}>Sales Manager</Text>
                    </View>
                  </View>
                  
                  <View style={styles.headerActions}>
                    <TouchableOpacity 
                      style={styles.profileIconButton}
                      onPress={() => {
                        console.log('Profile');
                        onClose();
                      }}
                    >
                      <CircleUser size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <X size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>

              <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
                {menuSections.map((section, sectionIndex) => (
                  <View key={sectionIndex} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.sectionItems}>
                      {section.items.map((item, itemIndex) => (
                        <TouchableOpacity
                          key={itemIndex}
                          style={[
                            styles.menuItem,
                            item.primary && styles.primaryMenuItem
                          ]}
                          onPress={() => {
                            item.action();
                            onClose();
                          }}
                        >
                          <View style={[
                            styles.iconContainer,
                            item.primary && styles.primaryIconContainer
                          ]}>
                            <item.icon 
                              size={18} 
                              color={item.primary ? '#FFFFFF' : '#6366F1'} 
                            />
                          </View>
                          <Text style={[
                            styles.menuLabel,
                            item.primary && styles.primaryMenuLabel
                          ]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerContent: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileIconButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profile: {
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  role: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  menu: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
  },
  primaryMenuItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryIconContainer: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  primaryMenuLabel: {
    color: '#1E293B',
    fontWeight: '600',
  },
});