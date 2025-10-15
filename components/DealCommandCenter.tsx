import { useRouter } from 'expo-router';
import { ArrowRight, Calendar, CheckSquare, DollarSign, Eye, FileText, Mail, MessageSquare, MoreVertical, Phone, Target, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface DealCommandCenterProps {
  visible: boolean;
  onClose: () => void;
  dealData: any;
}

export default function DealCommandCenter({ visible, onClose, dealData }: DealCommandCenterProps) {
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  const [commandCenterTranslateY] = useState(new Animated.Value(screenHeight));
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "customer" | "team" | "automation">("all");
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  React.useEffect(() => {
    if (visible) {
      // Small delay to ensure render completes before animating
      requestAnimationFrame(() => {
        Animated.spring(commandCenterTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 300,
          mass: 0.5,
          useNativeDriver: true,
        }).start();
      });
    } else {
      commandCenterTranslateY.setValue(screenHeight);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.spring(commandCenterTranslateY, {
      toValue: screenHeight,
      damping: 25,
      stiffness: 350,
      mass: 0.5,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSwipeDown = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    
    if (event.nativeEvent.state === State.END) {
      if (translationY > 100 || velocityY > 500) {
        handleClose();
      } else {
        Animated.spring(commandCenterTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleSwipeMove = (event: any) => {
    const { translationY } = event.nativeEvent;
    if (translationY >= 0) {
      commandCenterTranslateY.setValue(translationY);
    }
  };

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: Eye, count: null },
    { id: 'Customer Journey', label: 'Customer Journey', icon: ArrowRight, count: null },
    { id: 'Proposals', label: 'Proposals', icon: FileText, count: 0 },
    { id: 'Invoices', label: 'Invoices', icon: DollarSign, count: 2 },
    { id: 'Activity', label: 'Activity', icon: TrendingUp, count: null },
    { id: 'Notes', label: 'Notes', icon: FileText, count: 3 },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, count: 2 },
    { id: 'Job Tasks', label: 'Job Tasks', icon: Target, count: null },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Overview content for {dealData?.name}</Text>
            <Text style={styles.tabContentSubtext}>Deal ID: {dealData?.id}</Text>
            <Text style={styles.tabContentSubtext}>Status: {dealData?.status}</Text>
            <Text style={styles.tabContentSubtext}>Value: ${dealData?.value?.toLocaleString?.() || dealData?.value}</Text>
          </View>
        );
      case 'Customer Journey':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Customer Journey</Text>
          </View>
        );
      case 'Proposals':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Proposals</Text>
          </View>
        );
      case 'Invoices':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Invoices</Text>
          </View>
        );
      case 'Activity':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Activity</Text>
          </View>
        );
      case 'Notes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Notes</Text>
          </View>
        );
      case 'Tasks':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Tasks</Text>
          </View>
        );
      case 'Job Tasks':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Job Tasks</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (!dealData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={handleClose} 
        />
        
        <PanGestureHandler
          onGestureEvent={handleSwipeMove}
          onHandlerStateChange={handleSwipeDown}
        >
          <Animated.View 
            style={[
              styles.commandCenterModal,
              {
                transform: [{ translateY: commandCenterTranslateY }]
              }
            ]}
          >
            {/* Swipe Indicator */}
            <View style={styles.swipeIndicatorContainer}>
              <View style={styles.swipeIndicator} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header */}
              <View style={styles.commandCenterHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>
                      {dealData.contact?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>{dealData.name}</Text>
                    <View style={styles.headerSubtitle}>
                      {dealData.tags?.map((tag: string, index: number) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerActionButton}>
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.headerActionButtonText}>New Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton}>
                  <FileText size={16} color="#FFFFFF" />
                  <Text style={styles.headerActionButtonText}>New Proposal</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    handleClose();
                    // Handle call
                  }}
                >
                  <Phone size={20} color="#10B981" />
                  <Text style={styles.quickActionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    handleClose();
                    // Handle text
                  }}
                >
                  <MessageSquare size={20} color="#3B82F6" />
                  <Text style={styles.quickActionText}>Text</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    handleClose();
                    // Handle email
                  }}
                >
                  <Mail size={20} color="#8B5CF6" />
                  <Text style={styles.quickActionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <MoreVertical size={20} color="#6B7280" />
                  <Text style={styles.quickActionText}>More</Text>
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.tabsContainer}
                contentContainerStyle={styles.tabsContent}
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={[styles.tab, isActive && styles.tabActive]}
                      onPress={() => setActiveTab(tab.id)}
                    >
                      <Icon size={16} color={isActive ? '#6366F1' : '#6B7280'} />
                      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                        {tab.label}
                      </Text>
                      {tab.count !== null && tab.count > 0 && (
                        <View style={styles.tabBadge}>
                          <Text style={styles.tabBadgeText}>{tab.count}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Tab Content */}
              {renderTabContent()}
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  commandCenterModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  swipeIndicatorContainer: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  commandCenterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 10,
  },
  headerActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabContent: {
    padding: 20,
    minHeight: 300,
  },
  tabContentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tabContentSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});

