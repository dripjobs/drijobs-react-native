import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { Circle, Hash, Lock, Mic, MoreVertical, Paperclip, Phone, Plus, Search, Send, Settings, Smile, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Chat() {
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const channels = [
    { 
      id: 'general', 
      name: 'general', 
      description: 'General company discussion',
      unread: 0,
      isPrivate: false,
      lastActivity: '1d'
    },
    { 
      id: 'sales-team', 
      name: 'sales-team', 
      description: 'Sales team coordination',
      unread: 0,
      isPrivate: false,
      lastActivity: '1d'
    },
    { 
      id: 'project-alpha', 
      name: 'project-alpha', 
      description: 'Project Alpha discussions',
      unread: 1,
      isPrivate: true,
      lastActivity: '1d'
    },
    { 
      id: 'support', 
      name: 'support', 
      description: 'Customer support team',
      unread: 3,
      isPrivate: false,
      lastActivity: '1d'
    },
    { 
      id: 'random', 
      name: 'random', 
      description: 'Random discussions',
      unread: 0,
      isPrivate: false,
      lastActivity: '1d'
    },
  ];

  const onlineUsers = [
    { name: 'Sarah Johnson', initials: 'SJ', avatar: null },
    { name: 'Emily Rodriguez', initials: 'ER', avatar: 'https://example.com/avatar.jpg' },
  ];

  const messages = {
    general: [
      {
        id: 1,
        user: 'Sarah Johnson',
        initials: 'SJ',
        message: 'Good morning everyone! Hope you all had a great weekend.',
        time: '09:53 PM',
        date: 'Saturday, September 27, 2025',
        reactions: [
          { emoji: '👍', count: 2 },
          { emoji: '👏', count: 1 }
        ]
      },
      {
        id: 2,
        user: 'Mike Chen',
        initials: 'MC',
        message: 'Morning Sarah! Ready for another productive week 💪',
        time: '09:58 PM',
        date: 'Saturday, September 27, 2025',
        reactions: [
          { emoji: '💪', count: 2 }
        ]
      },
      {
        id: 3,
        user: 'Emily Rodriguez',
        initials: 'ER',
        message: 'Hey team! Quick reminder about the quarterly review meeting tomorrow at 2 PM.',
        time: '10:18 PM',
        date: 'Saturday, September 27, 2025',
        reactions: [
          { emoji: '🎉', count: 3 }
        ]
      }
    ]
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const currentChannel = channels.find(ch => ch.id === selectedChannel);
  const currentMessages = messages[selectedChannel as keyof typeof messages] || [];

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <View style={styles.mainContainer}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Team Chat</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Search size={16} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Q Search channels..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          <ScrollView style={styles.channelsList} showsVerticalScrollIndicator={false}>
            {channels.map((channel) => (
              <TouchableOpacity 
                key={channel.id}
                style={[
                  styles.channelItem,
                  selectedChannel === channel.id && styles.selectedChannel
                ]}
                onPress={() => handleChannelSelect(channel.id)}
              >
                <View style={styles.channelInfo}>
                  <View style={styles.channelIcon}>
                    {channel.isPrivate ? (
                      <Lock size={16} color="#6B7280" />
                    ) : (
                      <Hash size={16} color="#6B7280" />
                    )}
                  </View>
                  <Text style={[
                    styles.channelName,
                    selectedChannel === channel.id && styles.selectedChannelName
                  ]}>
                    #{channel.name}
                  </Text>
                </View>
                <View style={styles.channelMeta}>
                  {channel.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{channel.unread}</Text>
                    </View>
                  )}
                  <Text style={styles.channelTime}>{channel.lastActivity}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sidebarFooter}>
            <View style={styles.onlineStatus}>
              <Circle size={8} color="#10B981" fill="#10B981" />
              <Text style={styles.onlineText}>Online</Text>
            </View>
            <View style={styles.onlineUsers}>
              {onlineUsers.map((user, index) => (
                <View key={index} style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{user.initials}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.moreUsersButton}>
                <Users size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Chat Area */}
        <View style={styles.chatArea}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.channelTitle}>#{currentChannel?.name}</Text>
              <Text style={styles.channelDescription}>{currentChannel?.description}</Text>
            </View>
            <View style={styles.chatHeaderActions}>
              <TouchableOpacity style={styles.headerActionButton}>
                <Settings size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
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
            {currentMessages.map((message: any, index: number) => (
              <View key={message.id} style={styles.messageWrapper}>
                {index === 0 || currentMessages[index - 1].date !== message.date ? (
                  <View style={styles.dateSeparator}>
                    <Text style={styles.dateSeparatorText}>{message.date}</Text>
                  </View>
                ) : null}
                
                <View style={styles.message}>
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>{message.initials}</Text>
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageUser}>{message.user}</Text>
                      <Text style={styles.messageTime}>{message.time}</Text>
                    </View>
                    <Text style={styles.messageText}>{message.message}</Text>
                    {message.reactions && message.reactions.length > 0 && (
                      <View style={styles.messageReactions}>
                        {message.reactions.map((reaction: any, idx: number) => (
                          <TouchableOpacity key={idx} style={styles.reactionButton}>
                            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                            <Text style={styles.reactionCount}>{reaction.count}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.messageInputContainer}
          >
            <View style={styles.messageInputWrapper}>
              <TouchableOpacity style={styles.inputButton}>
                <Paperclip size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputButton}>
                <Smile size={20} color="#6B7280" />
              </TouchableOpacity>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.inputButton}>
                <Text style={styles.mentionButton}>@</Text>
              </TouchableOpacity>
              {newMessage.trim() ? (
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                >
                  <Send size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.inputButton}>
                  <Mic size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingActionButton}>
        <Phone size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <FloatingActionMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  // Sidebar Styles
  sidebar: {
    width: 280,
    backgroundColor: '#2C2C2E',
    borderRightWidth: 1,
    borderRightColor: '#3C3C3E',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  channelsList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 1,
  },
  selectedChannel: {
    backgroundColor: '#007AFF',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelIcon: {
    marginRight: 8,
  },
  channelName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedChannelName: {
    fontWeight: '600',
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
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
  channelTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sidebarFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3E',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  onlineText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  onlineUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreUsersButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3C3C3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chat Area Styles
  chatArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  channelDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageReactions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
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
  inputButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 4,
  },
  mentionButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});