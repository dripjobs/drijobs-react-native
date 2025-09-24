import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, Search, MessageCircle, Send, Circle, ChevronRight, ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Phone, Video } from 'lucide-react-native';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import DrawerMenu from '@/components/DrawerMenu';
import { useTabBar } from '@/contexts/TabBarContext';

export default function Chat() {
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showChatThread, setShowChatThread] = useState(false);
  const [chatThreadTranslateY] = useState(new Animated.Value(0));
  const [selectedChatData, setSelectedChatData] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    { 
      id: 1, 
      name: 'Sarah Wilson', 
      company: 'TechCorp Inc.', 
      lastMessage: 'Thanks for the proposal, looks great!', 
      time: '2m ago', 
      unread: 2,
      online: true,
      type: 'contact',
      avatar: 'SW'
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      company: 'StartupXYZ', 
      lastMessage: 'Can we schedule a call for tomorrow?', 
      time: '15m ago', 
      unread: 0,
      online: true,
      type: 'contact',
      avatar: 'MC'
    },
    { 
      id: 3, 
      name: 'Sales Team', 
      company: 'Internal', 
      lastMessage: 'Emily: Great work on the TechCorp deal!', 
      time: '1h ago', 
      unread: 5,
      online: false,
      type: 'group',
      avatar: 'ST'
    },
    { 
      id: 4, 
      name: 'Emily Rodriguez', 
      company: 'InnovateNow', 
      lastMessage: 'Perfect, I\'ll send over the requirements', 
      time: '2h ago', 
      unread: 0,
      online: false,
      type: 'contact',
      avatar: 'ER'
    },
    { 
      id: 5, 
      name: 'David Kim', 
      company: 'DevSolutions', 
      lastMessage: 'The integration looks good to go', 
      time: '1d ago', 
      unread: 1,
      online: true,
      type: 'contact',
      avatar: 'DK'
    },
    { 
      id: 6, 
      name: 'Marketing Team', 
      company: 'Internal', 
      lastMessage: 'Lisa: New campaign results are in', 
      time: '1d ago', 
      unread: 3,
      online: false,
      type: 'group',
      avatar: 'MT'
    },
  ];

  const conversationData = {
    1: [
      { id: 1, text: "Hi Sarah! I wanted to follow up on our discussion about the new marketing campaign.", sender: 'me', time: '10:30 AM', date: 'Today' },
      { id: 2, text: "Hi! Yes, I've been reviewing the proposal you sent over. It looks comprehensive.", sender: 'them', time: '10:32 AM', date: 'Today' },
      { id: 3, text: "Great! I'm particularly excited about the social media strategy. Do you have any questions about the timeline?", sender: 'me', time: '10:35 AM', date: 'Today' },
      { id: 4, text: "The timeline looks good. I'm wondering about the budget allocation for the influencer partnerships.", sender: 'them', time: '10:38 AM', date: 'Today' },
      { id: 5, text: "Good question! We've allocated 30% of the budget for influencer partnerships. I can send you a detailed breakdown if you'd like.", sender: 'me', time: '10:40 AM', date: 'Today' },
      { id: 6, text: "That would be helpful, thanks!", sender: 'them', time: '10:42 AM', date: 'Today' },
      { id: 7, text: "Thanks for the proposal, looks great!", sender: 'them', time: '2m ago', date: 'Today' },
    ],
    2: [
      { id: 1, text: "Hey Mike! How's the startup going?", sender: 'me', time: '9:15 AM', date: 'Today' },
      { id: 2, text: "Going well! We just closed our Series A funding round.", sender: 'them', time: '9:17 AM', date: 'Today' },
      { id: 3, text: "Congratulations! That's fantastic news. How much did you raise?", sender: 'me', time: '9:20 AM', date: 'Today' },
      { id: 4, text: "Thanks! We raised $5M. Now we're looking to scale our team.", sender: 'them', time: '9:22 AM', date: 'Today' },
      { id: 5, text: "That's amazing! I'd love to help with your hiring process if you're interested.", sender: 'me', time: '9:25 AM', date: 'Today' },
      { id: 6, text: "Can we schedule a call for tomorrow?", sender: 'them', time: '15m ago', date: 'Today' },
    ],
    4: [
      { id: 1, text: "Hi Emily! I hope you're doing well.", sender: 'me', time: 'Yesterday', date: 'Yesterday' },
      { id: 2, text: "Hi! I'm doing great, thanks for asking. How about you?", sender: 'them', time: 'Yesterday', date: 'Yesterday' },
      { id: 3, text: "I'm good! I wanted to discuss the project requirements you mentioned last week.", sender: 'me', time: 'Yesterday', date: 'Yesterday' },
      { id: 4, text: "Of course! I've been putting together a detailed list of what we need.", sender: 'them', time: 'Yesterday', date: 'Yesterday' },
      { id: 5, text: "Perfect, I'll send over the requirements", sender: 'them', time: '2h ago', date: 'Today' },
    ],
  };

  const handleChatPress = (chat: any) => {
    setSelectedChat(chat.id);
    setSelectedChatData(chat);
    setShowChatThread(true);
    Animated.timing(chatThreadTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseChatThread = () => {
    Animated.timing(chatThreadTranslateY, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowChatThread(false);
      setSelectedChatData(null);
    });
  };

  const handleChatThreadSwipeDown = (event: any) => {
    if (event.nativeEvent.translationY > 50) {
      handleCloseChatThread();
    }
  };

  const handleChatThreadSwipeMove = (event: any) => {
    if (event.nativeEvent.translationY > 0) {
      chatThreadTranslateY.setValue(event.nativeEvent.translationY);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
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
            <MessageCircle size={24} color="#FFFFFF" />
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
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        onScrollBeginDrag={() => setIsTransparent(true)}
        onScrollEndDrag={() => setIsTransparent(false)}
        onMomentumScrollBegin={() => setIsTransparent(true)}
        onMomentumScrollEnd={() => setIsTransparent(false)}
      >
        <View style={styles.chatsList}>
          {chats.map((chat) => (
            <TouchableOpacity 
              key={chat.id} 
              style={[
                styles.chatCard,
                selectedChat === chat.id && styles.selectedChatCard
              ]}
              onPress={() => handleChatPress(chat)}
            >
              <View style={styles.chatRow}>
                <View style={styles.avatarContainer}>
                  <View style={[
                    styles.avatar,
                    chat.type === 'group' && styles.groupAvatar
                  ]}>
                    <Text style={styles.avatarText}>
                      {chat.avatar}
                    </Text>
                  </View>
                  {chat.online && chat.type === 'contact' && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                  </View>
                  <View style={styles.chatMeta}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.chatCompany}>{chat.company}</Text>
                </View>
                
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FloatingActionMenu />

      {/* Chat Thread Modal */}
      <Modal
        visible={showChatThread}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseChatThread}
      >
        <View style={styles.modalOverlay}>
          <PanGestureHandler
            onGestureEvent={handleChatThreadSwipeMove}
            onHandlerStateChange={handleChatThreadSwipeDown}
          >
            <Animated.View 
              style={[
                styles.chatThreadModal,
                { transform: [{ translateY: chatThreadTranslateY }] }
              ]}
            >
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.chatThreadContainer}
              >
                {/* Chat Header */}
                <View style={styles.chatThreadHeader}>
                  <TouchableOpacity onPress={handleCloseChatThread} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <View style={styles.chatThreadHeaderInfo}>
                    <View style={styles.chatThreadAvatar}>
                      <Text style={styles.chatThreadAvatarText}>
                        {selectedChatData?.avatar}
                      </Text>
                    </View>
                    <View style={styles.chatThreadHeaderText}>
                      <Text style={styles.chatThreadName}>{selectedChatData?.name}</Text>
                      <Text style={styles.chatThreadStatus}>
                        {selectedChatData?.online ? 'Online' : 'Last seen recently'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chatThreadHeaderActions}>
                    <TouchableOpacity style={styles.chatThreadActionButton}>
                      <Phone size={20} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chatThreadActionButton}>
                      <Video size={20} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chatThreadActionButton}>
                      <MoreVertical size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Messages */}
                <ScrollView 
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedChatData && conversationData[selectedChatData.id]?.map((message, index) => (
                    <View key={message.id} style={styles.messageWrapper}>
                      {index === 0 || conversationData[selectedChatData.id][index - 1].date !== message.date ? (
                        <View style={styles.dateSeparator}>
                          <Text style={styles.dateSeparatorText}>{message.date}</Text>
                        </View>
                      ) : null}
                      <View style={[
                        styles.messageBubble,
                        message.sender === 'me' ? styles.myMessage : styles.theirMessage
                      ]}>
                        <Text style={[
                          styles.messageText,
                          message.sender === 'me' ? styles.myMessageText : styles.theirMessageText
                        ]}>
                          {message.text}
                        </Text>
                        <Text style={[
                          styles.messageTime,
                          message.sender === 'me' ? styles.myMessageTime : styles.theirMessageTime
                        ]}>
                          {message.time}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Message Input */}
                <View style={styles.messageInputContainer}>
                  <View style={styles.messageInputWrapper}>
                    <TouchableOpacity style={styles.messageInputButton}>
                      <Smile size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.messageInput}
                      placeholder="Message"
                      value={newMessage}
                      onChangeText={setNewMessage}
                      multiline
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.messageInputButton}>
                      <Paperclip size={24} color="#6B7280" />
                    </TouchableOpacity>
                    {newMessage.trim() ? (
                      <TouchableOpacity 
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                      >
                        <Send size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.messageInputButton}>
                        <Mic size={24} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pullOutIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 8,
  },
  pullOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backdropFilter: 'blur(10px)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  chatsList: {
    paddingBottom: 100,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  selectedChatCard: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatar: {
    backgroundColor: '#8B5CF6',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  chatTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  chatMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatCompany: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  // Chat Thread Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatThreadModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatThreadContainer: {
    flex: 1,
  },
  chatThreadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  chatThreadHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatThreadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatThreadAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatThreadHeaderText: {
    flex: 1,
  },
  chatThreadName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  chatThreadStatus: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  chatThreadHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatThreadActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateSeparatorText: {
    fontSize: 13,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#6B7280',
  },
  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  messageInputButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});