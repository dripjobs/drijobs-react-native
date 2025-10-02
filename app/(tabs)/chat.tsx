import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Building, Calendar, Camera, ChevronRight, DollarSign, FileText, Image, Mail, MapPin, Phone, Search, Send, TrendingUp, Upload, User, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ChatThread {
  id: number;
  customerName: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: 'customer' | 'business';
  unreadCount: number;
  customerPhone: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'customer' | 'business';
  timestamp: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string; // Name of the business user who sent the message
  senderInitials?: string; // Initials for avatar
  isNote?: boolean; // True if this is an internal note (not sent to customer)
}

export default function Chat() {
  const { setIsTransparent, setIsVisible } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showUserMention, setShowUserMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock chat threads data
  const chatThreads: ChatThread[] = [
    {
      id: 1,
      customerName: 'Robert Johnson',
      lastMessage: 'Perfect! See you tomorrow at 2 PM.',
      lastMessageTime: '10:45 AM',
      lastMessageSender: 'customer',
      unreadCount: 0,
      customerPhone: '(352) 895-5224'
    },
    {
      id: 2,
      customerName: 'Sarah Williams',
      lastMessage: 'Can you send me photos of the tile options?',
      lastMessageTime: '9:30 AM',
      lastMessageSender: 'customer',
      unreadCount: 2,
      customerPhone: '(555) 123-4567'
    },
    {
      id: 3,
      customerName: 'Michael Chen',
      lastMessage: 'Thanks for the quick response!',
      lastMessageTime: 'Yesterday',
      lastMessageSender: 'customer',
      unreadCount: 0,
      customerPhone: '(555) 987-6543'
    },
    {
      id: 4,
      customerName: 'Emily Rodriguez',
      lastMessage: 'We just sent the estimate to your email.',
      lastMessageTime: 'Yesterday',
      lastMessageSender: 'business',
      unreadCount: 0,
      customerPhone: '(555) 456-7890'
    },
    {
      id: 5,
      customerName: 'David Thompson',
      lastMessage: 'When can you schedule the site visit?',
      lastMessageTime: '2 days ago',
      lastMessageSender: 'customer',
      unreadCount: 1,
      customerPhone: '(555) 234-5678'
    },
  ];

  // Mock messages for selected thread
  const mockMessages: { [key: number]: Message[] } = {
    1: [
      {
        id: 1,
        text: 'Hi! I\'d like to schedule a consultation for my kitchen renovation.',
        sender: 'customer',
        timestamp: '2:30 PM',
        status: 'read'
      },
      {
        id: 2,
        text: 'Hello Robert! We\'d love to help with your kitchen renovation. I can schedule you for tomorrow at 2 PM. Does that work?',
        sender: 'business',
        timestamp: '2:35 PM',
        status: 'read',
        senderName: 'Sarah Martinez',
        senderInitials: 'SM'
      },
      {
        id: 3,
        text: 'Perfect! See you tomorrow at 2 PM.',
        sender: 'customer',
        timestamp: '10:45 AM',
        status: 'read'
      },
    ],
    2: [
      {
        id: 1,
        text: 'Hi, I\'m interested in the bathroom remodel estimate we discussed.',
        sender: 'customer',
        timestamp: 'Yesterday 3:20 PM',
        status: 'read'
      },
      {
        id: 2,
        text: 'Great! I\'ll prepare some tile options for you.',
        sender: 'business',
        timestamp: 'Yesterday 3:25 PM',
        status: 'read',
        senderName: 'Mike Johnson',
        senderInitials: 'MJ'
      },
      {
        id: 3,
        text: 'Can you send me photos of the tile options?',
        sender: 'customer',
        timestamp: '9:30 AM',
        status: 'delivered'
      },
    ],
  };

  const filteredThreads = chatThreads.filter(thread =>
    thread.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize messages from mock data
  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  // Simulate typing indicator (for demo purposes - only for team members)
  // In production, this would be triggered by real-time updates from other business users
  useEffect(() => {
    if (selectedThread) {
      // Randomly show typing indicator from team members
      const interval = setInterval(() => {
        const shouldShow = Math.random() > 0.7; // 30% chance
        if (shouldShow) {
          // Show a random team member typing
          const teamMembers = ['Sarah Martinez', 'Mike Johnson', 'Emily Chen'];
          const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
          
          setIsTyping(true);
          setTypingUser(randomMember);
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, 3000); // Hide after 3 seconds
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedThread]);

  // Hide tab bar when in chat thread
  useEffect(() => {
    if (selectedThread) {
      setIsVisible(false);
      // Scroll to bottom when thread is opened
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } else {
      setIsVisible(true);
    }
    
    return () => setIsVisible(true);
  }, [selectedThread]);

  const handleThreadPress = (thread: ChatThread) => {
    setSelectedThread(thread);
  };

  const handleBackToList = () => {
    setSelectedThread(null);
    setShowContactPanel(false);
  };

  const handleShowContactPanel = () => {
    setShowContactPanel(true);
  };

  const handleCloseContactPanel = () => {
    setShowContactPanel(false);
  };

  const handleAttachmentPress = () => {
    setShowAttachmentModal(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
  };

  const handleAttachmentOption = (option: string) => {
    console.log('Selected attachment option:', option);
    setShowAttachmentModal(false);
    // TODO: Implement actual attachment functionality
  };

  const handleTextChange = (text: string) => {
    setNewMessage(text);
    
    // Check for @ mentions
    const atIndex = text.lastIndexOf('@');
    if (atIndex !== -1) {
      const afterAt = text.substring(atIndex + 1);
      if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
        setMentionQuery(afterAt);
        setMentionStart(atIndex);
        setShowUserMention(true);
      } else {
        setShowUserMention(false);
      }
    } else {
      setShowUserMention(false);
    }
  };

  const handleUserMention = (user: string) => {
    const beforeMention = newMessage.substring(0, mentionStart);
    const afterMention = newMessage.substring(mentionStart + mentionQuery.length + 1);
    setNewMessage(beforeMention + '@' + user + ' ' + afterMention);
    setShowUserMention(false);
    setMentionQuery('');
  };

  // Mock team members for mentions
  const teamMembers = [
    { name: 'Sarah Martinez', initials: 'SM' },
    { name: 'Mike Johnson', initials: 'MJ' },
    { name: 'Emily Chen', initials: 'EC' },
    { name: 'David Wilson', initials: 'DW' },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThread) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      // TODO: Replace with actual logged-in user info
      const currentUser = {
        name: 'You',
        initials: 'YO'
      };
      
      // Create new message or note
      const newMsg: Message = {
        id: Date.now(), // Use timestamp as unique ID
        text: newMessage.trim(),
        sender: 'business',
        timestamp: timestamp,
        status: isNoteMode ? undefined : 'sent', // Notes don't have status
        senderName: currentUser.name,
        senderInitials: currentUser.initials,
        isNote: isNoteMode
      };

      // Update messages state
      setMessages(prevMessages => {
        const threadMessages = prevMessages[selectedThread.id] || [];
        return {
          ...prevMessages,
          [selectedThread.id]: [...threadMessages, newMsg]
        };
      });

      // Clear input and reset note mode
      setNewMessage('');
      setIsNoteMode(false);
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const currentMessages = selectedThread ? (messages[selectedThread.id] || []) : [];

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {!selectedThread ? (
        // Thread List View
        <>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.header}>
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
              <Text style={styles.headerTitle}>Messages</Text>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
              </View>
            </View>
          </LinearGradient>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            onScroll={(event) => {
              const currentScrollY = event.nativeEvent.contentOffset.y;
              if (currentScrollY > 50) {
                setShowFAB(false);
              } else {
                setShowFAB(true);
              }
              setLastScrollY(currentScrollY);
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.threadsList}>
              {filteredThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  style={styles.threadCard}
                  onPress={() => handleThreadPress(thread)}
                >
                  <View style={styles.threadAvatar}>
                    <Text style={styles.threadAvatarText}>
                      {thread.customerName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  
                  <View style={styles.threadContent}>
                    <View style={styles.threadHeader}>
                      <Text style={styles.threadName}>{thread.customerName}</Text>
                      <Text style={styles.threadTime}>{thread.lastMessageTime}</Text>
                    </View>
                    
                    <View style={styles.threadMessageRow}>
                      <Text style={[
                        styles.threadMessage,
                        thread.unreadCount > 0 && styles.unreadMessage
                      ]} numberOfLines={1}>
                        {thread.lastMessageSender === 'business' && 'You: '}
                        {thread.lastMessage}
                      </Text>
                      {thread.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{thread.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <FloatingActionMenu isVisible={showFAB} />
        </>
      ) : (
        // Individual Chat Thread View
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chatHeader}
          >
            <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.chatHeaderInfo}>
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>
                  {selectedThread.customerName.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.chatHeaderText}>
                <Text style={styles.chatHeaderName}>{selectedThread.customerName}</Text>
                <Text style={styles.chatHeaderPhone}>{selectedThread.customerPhone}</Text>
              </View>
            </View>

            <View style={styles.chatHeaderActions}>
              <TouchableOpacity style={styles.chatHeaderButton} onPress={handleShowContactPanel}>
                <User size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.chatHeaderButton}>
                <Phone size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Messages Area */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {currentMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isNote ? styles.noteMessageContainer : (message.sender === 'business' ? styles.sentMessageContainer : styles.receivedMessageContainer)
                ]}
              >
                {message.isNote && (
                  <Text style={styles.noteLabel}>📝 Internal Note</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.isNote ? styles.noteBubble : (message.sender === 'business' ? styles.sentMessage : styles.receivedMessage)
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.isNote ? styles.noteText : (message.sender === 'business' ? styles.sentMessageText : styles.receivedMessageText)
                  ]}>
                    {message.text}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text style={[
                      styles.messageTime,
                      message.isNote ? styles.noteTime : (message.sender === 'business' ? styles.sentMessageTime : styles.receivedMessageTime)
                    ]}>
                      {message.timestamp}
                    </Text>
                    {message.sender === 'business' && message.senderName && (
                      <>
                        <Text style={[styles.messageDivider, message.isNote && styles.noteDivider]}>•</Text>
                        <Text style={[styles.messageSender, message.isNote && styles.noteSender]}>{message.senderName}</Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}

          </ScrollView>

          {/* Typing Indicator - Bottom Middle */}
          {isTyping && (
            <View style={styles.typingIndicatorBottom}>
              <View style={styles.typingBubbleBottom}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
                {typingUser && (
                  <Text style={styles.typingTextBottom}>{typingUser} is typing...</Text>
                )}
              </View>
            </View>
          )}

          {/* Message Input */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[
              styles.messageInputContainer,
              isNoteMode && styles.noteInputContainer
            ]}
          >
            <View style={[
              styles.messageInputWrapper,
              isNoteMode && styles.noteInputWrapper
            ]}>
              <TouchableOpacity 
                style={styles.attachmentButton}
                onPress={handleAttachmentPress}
              >
                <Image size={22} color={isNoteMode ? "#92400E" : "#6B7280"} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.noteToggleButton,
                  isNoteMode && styles.noteToggleButtonActive
                ]}
                onPress={() => setIsNoteMode(!isNoteMode)}
              >
                <Text style={[
                  styles.noteToggleText,
                  isNoteMode && styles.noteToggleTextActive
                ]}>
                  {isNoteMode ? '📝' : 'Note'}
                </Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.messageInput,
                    isNoteMode && styles.noteInput
                  ]}
                  placeholder={isNoteMode ? "Add internal note..." : "Type a message..."}
                  value={newMessage}
                  onChangeText={handleTextChange}
                  multiline
                  placeholderTextColor={isNoteMode ? "#92400E" : "#9CA3AF"}
                />
                
                {/* User Mention Dropdown */}
                {showUserMention && (
                  <View style={styles.mentionDropdown}>
                    {teamMembers
                      .filter(member => 
                        member.name.toLowerCase().includes(mentionQuery.toLowerCase())
                      )
                      .map((member, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.mentionOption}
                          onPress={() => handleUserMention(member.name)}
                        >
                          <View style={styles.mentionAvatar}>
                            <Text style={styles.mentionAvatarText}>{member.initials}</Text>
                          </View>
                          <Text style={styles.mentionName}>{member.name}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !newMessage.trim() && styles.sendButtonDisabled,
                  isNoteMode && styles.noteSendButton
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          {/* Contact Info Panel */}
          <Modal
            visible={showContactPanel}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleCloseContactPanel}
          >
            <SafeAreaView style={styles.contactPanelModal}>
                <View style={styles.contactPanelHeader}>
                  <Text style={styles.contactPanelTitle}>Contact Details</Text>
                  <TouchableOpacity onPress={handleCloseContactPanel} style={styles.closePanelButton}>
                    <X size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.contactPanelContent} showsVerticalScrollIndicator={false}>
                  {/* Customer Info */}
                  <View style={styles.customerInfoSection}>
                    <View style={styles.customerAvatar}>
                      <Text style={styles.customerAvatarText}>
                        {selectedThread?.customerName.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <Text style={styles.customerName}>{selectedThread?.customerName}</Text>
                    <Text style={styles.customerPhone}>{selectedThread?.customerPhone}</Text>
                  </View>

                  {/* Quick Actions */}
                  <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Phone size={20} color="#6366F1" />
                      <Text style={styles.quickActionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Mail size={20} color="#6366F1" />
                      <Text style={styles.quickActionText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <MapPin size={20} color="#6366F1" />
                      <Text style={styles.quickActionText}>Navigate</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Contact Information */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    
                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <Mail size={18} color="#6B7280" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>robert.johnson@email.com</Text>
                      </View>
                    </View>

                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <MapPin size={18} color="#6B7280" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>4214 SE 11 PL, Ocala FL 34471</Text>
                      </View>
                    </View>
                  </View>

                  {/* Active Deals */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Active Deals</Text>
                    
                    <View style={styles.dealCard}>
                      <View style={styles.dealHeader}>
                        <View style={styles.dealIconContainer}>
                          <Building size={20} color="#6366F1" />
                        </View>
                        <View style={styles.dealInfo}>
                          <Text style={styles.dealTitle}>Kitchen Renovation</Text>
                          <Text style={styles.dealStage}>Proposal Stage</Text>
                        </View>
                      </View>
                      <View style={styles.dealMeta}>
                        <View style={styles.dealMetaItem}>
                          <DollarSign size={16} color="#10B981" />
                          <Text style={styles.dealMetaText}>$50,000</Text>
                        </View>
                        <View style={styles.dealMetaItem}>
                          <TrendingUp size={16} color="#6366F1" />
                          <Text style={styles.dealMetaText}>75% Probability</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Recent Activity */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Calendar size={16} color="#6366F1" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>Site visit scheduled</Text>
                        <Text style={styles.activityTime}>Tomorrow at 2:00 PM</Text>
                      </View>
                    </View>

                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Mail size={16} color="#8B5CF6" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>Estimate sent</Text>
                        <Text style={styles.activityTime}>2 days ago</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* View Contact Card Button */}
                <View style={styles.contactPanelFooter}>
                  <TouchableOpacity 
                    style={styles.viewContactCardButton}
                    onPress={() => {
                      handleCloseContactPanel();
                      // Navigate to full contact card
                      console.log('Navigate to contact card for:', selectedThread?.customerName);
                    }}
                  >
                    <User size={16} color="#6366F1" />
                    <Text style={styles.viewContactCardButtonText}>View Contact Card</Text>
                    <ChevronRight size={16} color="#6366F1" />
                  </TouchableOpacity>
                </View>
            </SafeAreaView>
          </Modal>

          {/* Attachment Options Modal */}
          <Modal
            visible={showAttachmentModal}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseAttachmentModal}
          >
            <View style={styles.attachmentModalOverlay}>
              <TouchableOpacity 
                style={styles.attachmentModalBackdrop}
                activeOpacity={1}
                onPress={handleCloseAttachmentModal}
              />
              <View style={styles.attachmentModal}>
              <View style={styles.attachmentHeader}>
                <Text style={styles.attachmentTitle}>Attach File</Text>
                <TouchableOpacity onPress={handleCloseAttachmentModal} style={styles.closeAttachmentButton}>
                  <X size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={styles.attachmentOptions}>
                <TouchableOpacity 
                  style={styles.attachmentOption}
                  onPress={() => handleAttachmentOption('camera')}
                >
                  <View style={styles.attachmentOptionIcon}>
                    <Camera size={24} color="#6366F1" />
                  </View>
                  <View style={styles.attachmentOptionContent}>
                    <Text style={styles.attachmentOptionTitle}>Take Photo</Text>
                    <Text style={styles.attachmentOptionSubtitle}>Use camera to take a new photo</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.attachmentOption}
                  onPress={() => handleAttachmentOption('gallery')}
                >
                  <View style={styles.attachmentOptionIcon}>
                    <Image size={24} color="#6366F1" />
                  </View>
                  <View style={styles.attachmentOptionContent}>
                    <Text style={styles.attachmentOptionTitle}>Choose from Gallery</Text>
                    <Text style={styles.attachmentOptionSubtitle}>Select photo from your gallery</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.attachmentOption}
                  onPress={() => handleAttachmentOption('file')}
                >
                  <View style={styles.attachmentOptionIcon}>
                    <FileText size={24} color="#6366F1" />
                  </View>
                  <View style={styles.attachmentOptionContent}>
                    <Text style={styles.attachmentOptionTitle}>Attach Document</Text>
                    <Text style={styles.attachmentOptionSubtitle}>Upload PDF, Word, or other files</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.attachmentOption}
                  onPress={() => handleAttachmentOption('upload')}
                >
                  <View style={styles.attachmentOptionIcon}>
                    <Upload size={24} color="#6366F1" />
                  </View>
                  <View style={styles.attachmentOptionContent}>
                    <Text style={styles.attachmentOptionTitle}>Upload from Cloud</Text>
                    <Text style={styles.attachmentOptionSubtitle}>Import from Google Drive, Dropbox, etc.</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradientHeader: {
    paddingBottom: 20,
    zIndex: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  threadsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  threadAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  threadTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  threadMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  threadMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#111827',
  },
  unreadBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Chat Thread View Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    zIndex: 10,
    elevation: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderPhone: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  noteMessageContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
    marginRight: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  sentMessage: {
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteBubble: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRightWidth: 4,
    borderRightColor: '#F59E0B',
    maxWidth: '80%',
    borderBottomRightRadius: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#111827',
  },
  noteText: {
    color: '#78350F',
    fontStyle: 'italic',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  receivedMessageTime: {
    color: '#9CA3AF',
  },
  noteTime: {
    color: '#92400E',
  },
  messageDivider: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  noteDivider: {
    color: '#92400E',
  },
  messageSender: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  noteSender: {
    color: '#92400E',
  },
  typingIndicatorBottom: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubbleBottom: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  typingTextBottom: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noteInputContainer: {
    backgroundColor: '#FEF3C7',
    borderTopColor: '#F59E0B',
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  noteInputWrapper: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  noteToggleButtonActive: {
    backgroundColor: '#F59E0B',
  },
  noteToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  noteToggleTextActive: {
    color: '#FFFFFF',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
  },
  noteInput: {
    color: '#78350F',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteSendButton: {
    backgroundColor: '#F59E0B',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  // Contact Panel Styles
  contactPanelModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contactPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactPanelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closePanelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactPanelContent: {
    flex: 1,
  },
  customerInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  customerAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  dealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  dealHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  dealStage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  dealMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  dealMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dealMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  contactPanelFooter: {
    padding: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  viewContactCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viewContactCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Attachment Modal Styles
  attachmentModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  attachmentModalBackdrop: {
    flex: 1,
  },
  attachmentModal: {
    height: '40%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  attachmentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeAttachmentButton: {
    padding: 8,
  },
  attachmentOptions: {
    padding: 20,
    gap: 12,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachmentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  attachmentOptionContent: {
    flex: 1,
  },
  attachmentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  attachmentOptionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Input Container and Mention Styles
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  mentionDropdown: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 8,
    maxHeight: 200,
  },
  mentionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mentionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mentionAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mentionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
