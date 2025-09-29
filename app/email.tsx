/*
 * TOAST NOTIFICATION SYSTEM RULES
 * ==============================
 * 
 * DESIGN PRINCIPLES:
 * - All toasts float up from the bottom of the screen
 * - Position: 100px from bottom, 20px margins on sides
 * - Auto-hide after 4 seconds (configurable)
 * - Smooth spring animation in, fade out
 * - Manual close button available
 * 
 * TOAST TYPES:
 * - success: Green left border, check icon, for positive actions
 * - error: Red left border, X icon, for errors/failures  
 * - info: Blue left border, mail icon, for informational messages
 * 
 * USAGE PATTERN:
 * showToast('Your message here', 'success' | 'error' | 'info');
 * 
 * EXAMPLES:
 * showToast('Email sent successfully', 'success');
 * showToast('Failed to send email', 'error');
 * showToast('Email marked as unread', 'info');
 * 
 * STYLING:
 * - White background with subtle shadow
 * - 16px border radius for modern look
 * - 56px minimum height for touch targets
 * - Left border accent color by type
 * - Consistent spacing and typography
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bold,
    Building,
    Calendar,
    Check,
    ChevronDown,
    Copy,
    Download,
    Filter,
    Image,
    Italic,
    Link,
    Mail,
    MapPin,
    MessageCircle,
    Paperclip,
    Phone,
    Plus,
    Reply,
    Search,
    Settings,
    Share,
    Star,
    Tag,
    User,
    X
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function Email() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [emailViewerTranslateY] = useState(new Animated.Value(0));
  const [detailsPanelTranslateX] = useState(new Animated.Value(width));
  const [selectedEmailData, setSelectedEmailData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All emails');
  const [activeUser, setActiveUser] = useState('All users');
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [showSendSuccess, setShowSendSuccess] = useState(false);
  const [sendTimeout, setSendTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentThread, setCurrentThread] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showArchiveToast, setShowArchiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const toastAnimation = useRef(new Animated.Value(0)).current;

  const emails = [
    { 
      id: 1, 
      from: 'David Wilson', 
      email: 'david.wilson@techstartup.com',
      subject: 'Re: Follow-up on our conversation', 
      snippet: 'Hi John, Thanks for the follow-up email. I\'ve been thinking about our conversation and I think we might be ready to move forward with the project.',
      time: '620d ago', 
      unread: false,
      starred: false,
      tag: 'Drip Reply',
      tagColor: '#8B5CF6',
      date: 'Jan 18, 2024, 04:00 AM',
      to: 'John Smith',
      thread: [
        {
          id: 1,
          from: 'John Smith',
          to: 'David Wilson',
          subject: 'Follow-up on our conversation',
          content: `Hi David,

I hope this email finds you well. I wanted to follow up on our conversation from last week about the potential project collaboration.

As discussed, I believe our services could really help streamline your current processes and improve efficiency. I'd love to schedule a call to discuss the details further.

Please let me know your availability for next week.

Best regards,
John`,
          date: 'Jan 17, 2024, 02:30 PM',
          time: '621d ago'
        },
        {
          id: 2,
          from: 'David Wilson',
          to: 'John Smith',
          subject: 'Re: Follow-up on our conversation',
          content: `Hi John,

Thanks for the follow-up email. I've been thinking about our conversation and I think we might be ready to move forward with the project.

Could we schedule a call to discuss the details?

Best regards,
David`,
          date: 'Jan 18, 2024, 04:00 AM',
          time: '620d ago'
        }
      ],
      contact: {
        name: 'David Wilson',
        company: 'Global Finance Corp',
        role: 'Customer',
        phone: '(813) 892-2205',
        email: 'david.wilson@techstartup.com',
        address: '123 Main St, Tampa, FL 33601',
        lastContact: '620d ago',
        creator: 'Tanner Mullen You',
        access: '1 member',
        avatar: 'DW'
      }
    },
    { 
      id: 2, 
      from: 'Lisa Chen', 
      email: 'lisa.chen@innovate.com',
      subject: 'Re: Your proposal looks great', 
      snippet: 'Hi John, I\'ve reviewed your proposal and it looks excellent. The timeline and budget are exactly what we were looking for.',
      time: '620d ago', 
      unread: false,
      starred: false,
      tag: null,
      tagColor: null,
      date: 'Jan 18, 2024, 03:45 AM',
      to: 'John Smith',
      thread: [
        {
          id: 1,
          from: 'Lisa Chen',
          to: 'John Smith',
          subject: 'Re: Your proposal looks great',
          content: `Hi John,

I've reviewed your proposal and it looks excellent. The timeline and budget are exactly what we were looking for.

Let's move forward with the next steps.

Best,
Lisa`,
          date: 'Jan 18, 2024, 03:45 AM',
          time: '620d ago'
        }
      ],
      contact: {
        name: 'Lisa Chen',
        company: 'Innovate Corp',
        role: 'Decision Maker',
        phone: '(555) 123-4567',
        email: 'lisa.chen@innovate.com',
        address: '456 Business Ave, New York, NY 10001',
        lastContact: '620d ago',
        creator: 'Tanner Mullen You',
        access: '1 member',
        avatar: 'LC'
      }
    },
    { 
      id: 3, 
      from: 'Sarah Johnson', 
      email: 'sarah.johnson@webdesign.com',
      subject: 'Re: Website Redesign Inquiry', 
      snippet: 'Hi John, I\'m interested in discussing a website redesign for our company. Could we schedule a call this week?',
      time: '621d ago', 
      unread: true,
      starred: false,
      tag: null,
      tagColor: null,
      date: 'Jan 17, 2024, 02:30 PM',
      to: 'John Smith',
      thread: [
        {
          id: 1,
          from: 'Sarah Johnson',
          to: 'John Smith',
          subject: 'Website Redesign Inquiry',
          content: `Hi John,

I'm interested in discussing a website redesign for our company. Could we schedule a call this week?

I'd love to hear about your process and see some examples of your work.

Thanks,
Sarah`,
          date: 'Jan 17, 2024, 02:30 PM',
          time: '621d ago'
        }
      ],
      contact: {
        name: 'Sarah Johnson',
        company: 'WebDesign Pro',
        role: 'Marketing Manager',
        phone: '(555) 987-6543',
        email: 'sarah.johnson@webdesign.com',
        address: '789 Design St, Los Angeles, CA 90210',
        lastContact: '621d ago',
        creator: 'Tanner Mullen You',
        access: '1 member',
        avatar: 'SJ'
      }
    }
  ];

  const folders = [
    { name: 'Inbox', count: 1, active: true },
    { name: 'Sent', count: 0, active: false },
    { name: 'Drafts', count: 0, active: false },
    { name: 'Templates', count: 2, active: false }
  ];

  const [emailList, setEmailList] = useState(emails);

  // Mock users for tagging
  const systemUsers = [
    { id: 1, name: 'John Smith', email: 'john@company.com', avatar: 'JS' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', avatar: 'SJ' },
    { id: 3, name: 'Mike Chen', email: 'mike@company.com', avatar: 'MC' },
    { id: 4, name: 'Lisa Davis', email: 'lisa@company.com', avatar: 'LD' },
    { id: 5, name: 'Tom Wilson', email: 'tom@company.com', avatar: 'TW' }
  ];

  const handleEmailPress = (email: any) => {
    setSelectedEmail(email.id);
    setSelectedEmailData(email);
    setCurrentThread([...email.thread]); // Initialize thread with existing messages
    setShowEmailViewer(true);
    setShowReplyBox(false);
    setShowDetailsPanel(false);
    
    // Mark email as read when opened
    if (email.unread) {
      setEmailList(prevList => 
        prevList.map(e => 
          e.id === email.id ? { ...e, unread: false } : e
        )
      );
    }
    
    Animated.timing(emailViewerTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseEmailViewer = () => {
    Animated.timing(emailViewerTranslateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEmailViewer(false);
      setSelectedEmailData(null);
      setShowReplyBox(false);
      setShowDetailsPanel(false);
    });
  };

  const handleShowDetailsPanel = () => {
    try {
      setShowDetailsPanel(true);
      Animated.timing(detailsPanelTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log('Error showing details panel:', error);
    }
  };

  const handleCloseDetailsPanel = () => {
    try {
      Animated.timing(detailsPanelTranslateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowDetailsPanel(false);
      });
    } catch (error) {
      console.log('Error closing details panel:', error);
      setShowDetailsPanel(false);
    }
  };

  const handleReply = () => {
    setShowReplyBox(true);
    setReplyText('');
    console.log('Reply to email');
  };

  const handleReplyAll = () => {
    setShowReplyBox(true);
    setReplyText('');
    console.log('Reply all to email');
  };

  const handleForward = () => {
    setShowReplyBox(true);
    setReplyText(`\n\n--- Forwarded message ---\nFrom: ${selectedEmailData?.from}\nSubject: ${selectedEmailData?.subject}\n\n${selectedEmailData?.thread?.[0]?.content || ''}`);
    console.log('Forward email');
  };

  const handleAIReply = () => {
    const aiReply = `Thank you for your email. I appreciate your interest and will get back to you shortly with more details. 

Best regards,
John Smith`;
    setReplyText(aiReply);
    setShowReplyBox(true);
    console.log('AI Reply generated');
  };

  const handleArchive = () => {
    console.log('Email archived successfully');
    // In a real app, this would update the email status in the backend
    handleCloseEmailViewer();
  };

  const handleDelete = () => {
    console.log('Email deleted successfully');
    // In a real app, this would delete the email from the backend
    handleCloseEmailViewer();
  };

  const handleTagUser = () => {
    setShowUserSelection(true);
    console.log('Tag user functionality');
  };

  const handleUserSelect = (user: any) => {
    if (!taggedUsers.includes(user.name)) {
      setTaggedUsers([...taggedUsers, user.name]);
      console.log(`Tagged user: ${user.name}`);
    }
    setShowUserSelection(false);
  };

  const handleRemoveTag = (userName: string) => {
    setTaggedUsers(taggedUsers.filter(name => name !== userName));
    console.log(`Removed tag: ${userName}`);
  };

  const handleAddAttachment = () => {
    // In a real app, this would open the image picker
    const newAttachment = `attachment_${Date.now()}.jpg`;
    setAttachments([...attachments, newAttachment]);
    console.log('Added attachment:', newAttachment);
  };

  const handleRemoveAttachment = (attachment: string) => {
    setAttachments(attachments.filter(att => att !== attachment));
    console.log('Removed attachment:', attachment);
  };

  const handleAddLink = () => {
    setShowLinkModal(true);
  };

  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      setReplyText(replyText + linkMarkdown);
      setLinkUrl('');
      setLinkText('');
      setShowLinkModal(false);
      console.log('Inserted link:', linkMarkdown);
    }
  };

  const handleToggleBold = () => {
    setIsBold(!isBold);
    // In a real app, this would apply bold formatting to selected text
    console.log('Toggle bold:', !isBold);
  };

  const handleToggleItalic = () => {
    setIsItalic(!isItalic);
    // In a real app, this would apply italic formatting to selected text
    console.log('Toggle italic:', !isItalic);
  };

  const handleShareThread = () => {
    // Generate a unique shareable link for the thread
    const threadId = selectedEmailData?.id || Date.now();
    const generatedLink = `https://dripjobs.app/email/thread/${threadId}`;
    setShareLink(generatedLink);
    setShowShareModal(true);
    setLinkCopied(false);
    showToast('Share link copied to clipboard', 'success');
    console.log('Share thread:', generatedLink);
  };

  const handleCopyLink = () => {
    // In a real app, this would copy to clipboard
    setLinkCopied(true);
    showToast('Share link copied to clipboard', 'success');
    console.log('Link copied to clipboard:', shareLink);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setLinkCopied(false);
  };

  // Toast System - Reusable function for all toasts
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowArchiveToast(true);
    
    // Animate in
    Animated.spring(toastAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      hideToast();
    }, 4000);
  };

  const hideToast = () => {
    Animated.timing(toastAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowArchiveToast(false);
    });
  };

  const handleArchiveEmail = (emailId: number) => {
    setEmailList(prevList => prevList.filter(email => email.id !== emailId));
    showToast('Email archived successfully', 'success');
    console.log('Email archived:', emailId);
  };

  const handleMarkAsUnread = (emailId: number) => {
    setEmailList(prevList => 
      prevList.map(email => 
        email.id === emailId ? { ...email, unread: true } : email
      )
    );
    console.log('Email marked as unread:', emailId);
  };

  const renderLeftActions = (email: any) => (
    <View style={styles.leftActionContainer}>
      <TouchableOpacity 
        style={styles.archiveAction}
        onPress={() => handleArchiveEmail(email.id)}
      >
        <Download size={20} color="#6B7280" />
        <Text style={styles.archiveActionText}>Archive</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = (email: any, swipeableRef: any) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity 
        style={styles.unreadAction}
        onPress={() => {
          handleMarkAsUnread(email.id);
          // Close the swipeable immediately
          swipeableRef.close();
        }}
      >
        <Mail size={20} color="#6B7280" />
        <Text style={styles.unreadActionText}>Mark Unread</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSendReply = () => {
    if (replyText.trim() && !isSending) {
      setIsSending(true);
      setSendProgress(0);
      
      // Simulate sending progress over 3 seconds
      const progressInterval = setInterval(() => {
        setSendProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      // Set timeout for 3 seconds
      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        setIsSending(false);
        setSendProgress(100);
        setShowSendSuccess(true);
        
        // Add the sent email to the thread
        const newMessage = {
          id: Date.now(), // Unique ID for the new message
          from: 'John Smith', // Current user
          to: selectedEmailData?.from || 'Recipient',
          subject: `Re: ${selectedEmailData?.subject || ''}`,
          content: replyText,
          date: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          time: 'Just now',
          isFromCurrentUser: true
        };
        
        // Add new message to thread
        setCurrentThread(prevThread => [...prevThread, newMessage]);
        
        setReplyText('');
        setAttachments([]);
        setTaggedUsers([]);
        
        // Hide success message after 2 seconds
        setTimeout(() => {
          setShowSendSuccess(false);
          setShowReplyBox(false);
        }, 2000);
        
        console.log('Email sent successfully:', replyText);
      }, 3000);
      
      setSendTimeout(timeout);
    }
  };

  const handleCancelSend = () => {
    if (sendTimeout) {
      clearTimeout(sendTimeout);
      setSendTimeout(null);
    }
    setIsSending(false);
    setSendProgress(0);
    console.log('Send cancelled');
  };

  const handleCall = () => {
    console.log('Call contact');
  };

  const handleChat = () => {
    console.log('Chat with contact');
  };

  const handleEmailContact = () => {
    console.log('Email contact');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Email</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <User size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.composeButton}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.composeText}>Compose</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search emails..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{activeFilter}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{activeUser}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.foldersContainer}
          contentContainerStyle={styles.foldersContent}
        >
          {folders.map((folder, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.folderButton,
                folder.active && styles.activeFolderButton
              ]}
            >
              <Text style={[
                styles.folderText,
                folder.active && styles.activeFolderText
              ]}>
                {folder.name}
              </Text>
              {folder.count > 0 && (
                <View style={styles.folderBadge}>
                  <Text style={styles.folderBadgeText}>{folder.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.emailsList}>
          {emailList.map((email) => (
        <Swipeable
          key={email.id}
          renderLeftActions={() => renderLeftActions(email)}
          renderRightActions={(progress, dragX, swipeableRef) => renderRightActions(email, swipeableRef)}
          overshootLeft={false}
          overshootRight={false}
          friction={2}
          leftThreshold={120}
          rightThreshold={120}
        >
              <TouchableOpacity 
                style={[
                  styles.emailCard,
                  email.unread && styles.unreadEmailCard
                ]}
                onPress={() => handleEmailPress(email)}
              >
                <View style={styles.emailRow}>
                  <View style={styles.emailIcon}>
                    <Mail size={16} color="#6B7280" />
                  </View>
                  
                  <View style={styles.emailInfo}>
                    <View style={styles.emailHeader}>
                      <Text style={[
                        styles.emailFrom,
                        email.unread && styles.unreadText
                      ]}>
                        {email.from}
                      </Text>
                      <Text style={styles.emailTime}>{email.time}</Text>
                    </View>
                    
                    {email.tag && (
                      <View style={[styles.emailTag, { backgroundColor: email.tagColor }]}>
                        <Text style={styles.emailTagText}>{email.tag}</Text>
                      </View>
                    )}
                    
                    <Text style={[
                      styles.emailSubject,
                      email.unread && styles.unreadText
                    ]}>
                      {email.subject}
                    </Text>
                    
                    <Text style={styles.emailSnippet} numberOfLines={2}>
                      {email.snippet}
                    </Text>
                    
                    {email.starred && (
                      <Star size={16} color="#F59E0B" style={styles.starIcon} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      </ScrollView>

      {/* Email Viewer Modal */}
      <Modal
        visible={showEmailViewer}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseEmailViewer}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.emailViewerModal,
              { transform: [{ translateY: emailViewerTranslateY }] }
            ]}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.emailViewerContainer}
            >
              {/* Email Header */}
              <View style={styles.emailViewerHeader}>
                <TouchableOpacity onPress={handleCloseEmailViewer} style={styles.closeButton}>
                  <X size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.emailViewerTitle}>
                  {selectedEmailData?.subject}
                </Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={handleShareThread} style={styles.shareButton}>
                    <Share size={20} color="#6366F1" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShowDetailsPanel} style={styles.detailsButton}>
                    <User size={24} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Email Actions Bar */}
              <View style={styles.emailActionsBar}>
                <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
                  <Reply size={18} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleReplyAll}>
                  <Text style={styles.actionButtonText}>Reply All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.aiActionButton]} onPress={handleAIReply}>
                  <Text style={[styles.actionButtonText, styles.aiActionButtonText]}>AI Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleForward}>
                  <Text style={styles.actionButtonText}>Forward</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleArchive}>
                  <Text style={styles.actionButtonText}>Archive</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleTagUser}>
                  <Tag size={18} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Tag</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>

              {/* Tagged Users Display */}
              {taggedUsers.length > 0 && (
                <View style={styles.taggedUsersContainer}>
                  <Text style={styles.taggedUsersTitle}>Tagged Users:</Text>
                  <View style={styles.taggedUsersList}>
                    {taggedUsers.map((userName, index) => (
                      <View key={index} style={styles.taggedUserChip}>
                        <Text style={styles.taggedUserText}>{userName}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(userName)}>
                          <X size={14} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <ScrollView style={styles.emailViewerContent}>
                {/* Email Thread */}
                <View style={styles.emailThread}>
                  {currentThread.map((message, index) => (
                    <View key={message.id} style={[
                      styles.threadMessage,
                      message.isFromCurrentUser && styles.currentUserMessage
                    ]}>
                      <View style={styles.messageHeader}>
                        <View style={styles.messageSender}>
                          <View style={[
                            styles.senderAvatar,
                            message.isFromCurrentUser && styles.currentUserAvatar
                          ]}>
                            <Text style={styles.senderAvatarText}>
                              {message.from.split(' ').map(n => n[0]).join('')}
                            </Text>
                          </View>
                          <View style={styles.senderInfo}>
                            <Text style={[
                              styles.senderName,
                              message.isFromCurrentUser && styles.currentUserName
                            ]}>
                              {message.from}
                            </Text>
                            <Text style={styles.senderEmail}>To: {message.to}</Text>
                          </View>
                        </View>
                        <View style={styles.messageTime}>
                          <Text style={styles.messageDate}>{message.date}</Text>
                          <Text style={styles.messageTimeAgo}>{message.time}</Text>
                        </View>
                      </View>
                      
                      <View style={[
                        styles.messageContent,
                        message.isFromCurrentUser && styles.currentUserContent
                      ]}>
                        <Text style={[
                          styles.messageText,
                          message.isFromCurrentUser && styles.currentUserText
                        ]}>
                          {message.content}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Reply Box */}
              {showReplyBox && (
                <View style={styles.replyBox}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyTitle}>Reply to {selectedEmailData?.from}</Text>
                    <TouchableOpacity onPress={() => setShowReplyBox(false)}>
                      <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Formatting Toolbar */}
                  <View style={styles.formattingToolbar}>
                    <TouchableOpacity 
                      style={[styles.formatButton, isBold && styles.formatButtonActive]} 
                      onPress={handleToggleBold}
                    >
                      <Bold size={16} color={isBold ? "#FFFFFF" : "#6B7280"} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.formatButton, isItalic && styles.formatButtonActive]} 
                      onPress={handleToggleItalic}
                    >
                      <Italic size={16} color={isItalic ? "#FFFFFF" : "#6B7280"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.formatButton} onPress={handleAddLink}>
                      <Link size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.formatButton} onPress={handleAddAttachment}>
                      <Paperclip size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.formatButton} onPress={handleAddAttachment}>
                      <Image size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Attachments Display */}
                  {attachments.length > 0 && (
                    <View style={styles.attachmentsContainer}>
                      <Text style={styles.attachmentsTitle}>Attachments:</Text>
                      <View style={styles.attachmentsList}>
                        {attachments.map((attachment, index) => (
                          <View key={index} style={styles.attachmentItem}>
                            <Paperclip size={14} color="#6B7280" />
                            <Text style={styles.attachmentText}>{attachment}</Text>
                            <TouchableOpacity onPress={() => handleRemoveAttachment(attachment)}>
                              <X size={14} color="#6B7280" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <TextInput
                    style={[
                      styles.replyInput,
                      isBold && styles.replyInputBold,
                      isItalic && styles.replyInputItalic
                    ]}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChangeText={setReplyText}
                    multiline
                    numberOfLines={4}
                  />
                  <View style={styles.replyActions}>
                    {isSending ? (
                      <View style={styles.sendingContainer}>
                        <View style={styles.sendingInfo}>
                          <Text style={styles.sendingText}>Sending email...</Text>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${sendProgress}%` }]} />
                          </View>
                          <Text style={styles.progressText}>{sendProgress}%</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.cancelButton}
                          onPress={handleCancelSend}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : showSendSuccess ? (
                      <View style={styles.successContainer}>
                        <Check size={20} color="#10B981" />
                        <Text style={styles.successText}>Email sent successfully!</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Text style={styles.sendButtonText}>Send</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>

            {/* Details Panel */}
            {showDetailsPanel && (
              <Animated.View 
                style={[
                  styles.detailsPanel,
                  { transform: [{ translateX: detailsPanelTranslateX }] }
                ]}
              >
                <View style={styles.detailsPanelHeader}>
                  <Text style={styles.detailsPanelTitle}>Contact Details</Text>
                  <TouchableOpacity onPress={handleCloseDetailsPanel}>
                    <X size={24} color="#1F2937" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailsPanelContent}>
                  <View style={styles.contactCard}>
                    <View style={styles.contactHeader}>
                      <View style={styles.contactAvatar}>
                        <Text style={styles.contactAvatarText}>
                          {selectedEmailData?.contact?.avatar}
                        </Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{selectedEmailData?.contact?.name}</Text>
                        <Text style={styles.contactPhone}>{selectedEmailData?.contact?.phone}</Text>
                      </View>
                    </View>

                    <View style={styles.contactActions}>
                      <TouchableOpacity style={styles.contactActionButton} onPress={handleCall}>
                        <Phone size={16} color="#FFFFFF" />
                        <Text style={styles.contactActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactActionButton} onPress={handleChat}>
                        <MessageCircle size={16} color="#FFFFFF" />
                        <Text style={styles.contactActionText}>Chat</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactActionButton} onPress={handleEmailContact}>
                        <Mail size={16} color="#FFFFFF" />
                        <Text style={styles.contactActionText}>Email</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.contactDetails}>
                      <View style={styles.contactDetailRow}>
                        <Building size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Company:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.company}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <User size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Role:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.role}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <Phone size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Phone:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.phone}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <Mail size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Email:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.email}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Address:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.address}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Last Contact:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.lastContact}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <User size={16} color="#6B7280" />
                        <Text style={styles.contactDetailLabel}>Creator:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.creator}</Text>
                      </View>
                      <View style={styles.contactDetailRow}>
                        <Text style={styles.contactDetailLabel}>Access:</Text>
                        <Text style={styles.contactDetailValue}>{selectedEmailData?.contact?.access}</Text>
                      </View>
                    </View>

                    <View style={styles.activeDealsSection}>
                      <Text style={styles.activeDealsTitle}>Active Deals</Text>
                      <View style={styles.activeDealsContent}>
                        <View style={styles.activeDealsIcon}>
                          <Building size={48} color="#9CA3AF" />
                        </View>
                        <Text style={styles.activeDealsText}>No active deals</Text>
                        <Text style={styles.activeDealsSubtext}>Deals in active pipeline stages will appear here</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* User Selection Modal for Tagging */}
      <Modal
        visible={showUserSelection}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUserSelection(false)}
      >
        <View style={styles.userSelectionOverlay}>
          <View style={styles.userSelectionModal}>
            <View style={styles.userSelectionHeader}>
              <Text style={styles.userSelectionTitle}>Tag Users</Text>
              <TouchableOpacity onPress={() => setShowUserSelection(false)}>
                <X size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.userSelectionContent}>
              {systemUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userSelectionItem,
                    taggedUsers.includes(user.name) && styles.userSelectionItemSelected
                  ]}
                  onPress={() => handleUserSelect(user)}
                >
                  <View style={styles.userSelectionAvatar}>
                    <Text style={styles.userSelectionAvatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.userSelectionInfo}>
                    <Text style={styles.userSelectionName}>{user.name}</Text>
                    <Text style={styles.userSelectionEmail}>{user.email}</Text>
                  </View>
                  {taggedUsers.includes(user.name) && (
                    <View style={styles.userSelectionCheckmark}>
                      <Text style={styles.userSelectionCheckmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.userSelectionActions}>
              <TouchableOpacity 
                style={styles.userSelectionDoneButton}
                onPress={() => setShowUserSelection(false)}
              >
                <Text style={styles.userSelectionDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Link Insertion Modal */}
      <Modal
        visible={showLinkModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLinkModal(false)}
      >
        <View style={styles.linkModalOverlay}>
          <View style={styles.linkModal}>
            <View style={styles.linkModalHeader}>
              <Text style={styles.linkModalTitle}>Insert Link</Text>
              <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                <X size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.linkModalContent}>
              <Text style={styles.linkModalLabel}>Link Text:</Text>
              <TextInput
                style={styles.linkModalInput}
                placeholder="Enter link text..."
                value={linkText}
                onChangeText={setLinkText}
              />
              
              <Text style={styles.linkModalLabel}>URL:</Text>
              <TextInput
                style={styles.linkModalInput}
                placeholder="https://example.com"
                value={linkUrl}
                onChangeText={setLinkUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.linkModalActions}>
              <TouchableOpacity 
                style={styles.linkModalCancelButton}
                onPress={() => setShowLinkModal(false)}
              >
                <Text style={styles.linkModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.linkModalInsertButton, (!linkUrl || !linkText) && styles.linkModalInsertButtonDisabled]}
                onPress={handleInsertLink}
                disabled={!linkUrl || !linkText}
              >
                <Text style={styles.linkModalInsertText}>Insert Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Thread Modal */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseShareModal}
      >
        <View style={styles.shareModalOverlay}>
          <View style={styles.shareModal}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>Share Thread</Text>
              <TouchableOpacity onPress={handleCloseShareModal}>
                <X size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.shareModalContent}>
              <Text style={styles.shareModalDescription}>
                Share this email thread with other users. They'll be able to view the complete conversation.
              </Text>
              
              <View style={styles.shareLinkContainer}>
                <Text style={styles.shareLinkLabel}>Shareable Link:</Text>
                <View style={styles.shareLinkBox}>
                  <Text style={styles.shareLinkText} numberOfLines={2}>
                    {shareLink}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.copyButton, linkCopied && styles.copyButtonSuccess]}
                    onPress={handleCopyLink}
                  >
                    {linkCopied ? (
                      <Check size={16} color="#FFFFFF" />
                    ) : (
                      <Copy size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>
                {linkCopied && (
                  <Text style={styles.copiedText}>Link copied to clipboard!</Text>
                )}
              </View>
            </View>
            
            <View style={styles.shareModalActions}>
              <TouchableOpacity 
                style={styles.shareModalCloseButton}
                onPress={handleCloseShareModal}
              >
                <Text style={styles.shareModalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast Notification System */}
      {showArchiveToast && (
        <Animated.View 
          style={[
            styles.toastContainer,
            {
              transform: [
                {
                  translateY: toastAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
                {
                  scale: toastAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: toastAnimation,
            },
          ]}
        >
          <View style={[
            styles.toastContent,
            toastType === 'success' && styles.toastSuccess,
            toastType === 'error' && styles.toastError,
            toastType === 'info' && styles.toastInfo,
          ]}>
            {toastType === 'success' && <Check size={20} color="#10B981" />}
            {toastType === 'error' && <X size={20} color="#EF4444" />}
            {toastType === 'info' && <Mail size={20} color="#3B82F6" />}
            <Text style={styles.toastText}>{toastMessage}</Text>
            <TouchableOpacity onPress={hideToast} style={styles.toastCloseButton}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  composeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  foldersContainer: {
    paddingHorizontal: 20,
  },
  foldersContent: {
    flexDirection: 'row',
    gap: 12,
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  activeFolderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  folderText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeFolderText: {
    fontWeight: '600',
  },
  folderBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  folderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  contentContainer: {
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  emailsList: {
    paddingBottom: 100,
  },
  emailCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  unreadEmailCard: {
    backgroundColor: '#F0F9FF',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  emailInfo: {
    flex: 1,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  emailFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  unreadText: {
    fontWeight: '700',
  },
  emailTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  emailTag: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  emailTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emailSubject: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 4,
  },
  emailSnippet: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  starIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  // Email Viewer Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emailViewerModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  emailViewerContainer: {
    flex: 1,
  },
  emailViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  emailViewerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  detailsButton: {
    padding: 4,
    marginLeft: 12,
  },
  emailActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aiActionButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366F1',
  },
  aiActionButtonText: {
    color: '#FFFFFF',
  },
  emailViewerContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emailThread: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  threadMessage: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  messageSender: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  senderAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  senderEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  messageTime: {
    alignItems: 'flex-end',
  },
  messageDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageTimeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  messageContent: {
    paddingLeft: 52,
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  replyBox: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  replyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Details Panel Styles
  detailsPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.85,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailsPanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  detailsPanelContent: {
    flex: 1,
  },
  contactCard: {
    padding: 20,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  contactPhone: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  contactActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactDetails: {
    marginBottom: 24,
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    minWidth: 80,
  },
  contactDetailValue: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  activeDealsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  activeDealsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  activeDealsContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  activeDealsIcon: {
    marginBottom: 16,
  },
  activeDealsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  activeDealsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Tagged Users Styles
  taggedUsersContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taggedUsersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  taggedUsersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  taggedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  taggedUserText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // User Selection Modal Styles
  userSelectionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  userSelectionModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  userSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  userSelectionContent: {
    maxHeight: height * 0.5,
  },
  userSelectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userSelectionItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  userSelectionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userSelectionAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userSelectionInfo: {
    flex: 1,
  },
  userSelectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  userSelectionEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  userSelectionCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSelectionCheckmarkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userSelectionActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  userSelectionDoneButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  userSelectionDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Formatting Toolbar Styles
  formattingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  formatButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formatButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  // Attachments Styles
  attachmentsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  attachmentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachmentText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Text Formatting Styles
  replyInputBold: {
    fontWeight: 'bold',
  },
  replyInputItalic: {
    fontStyle: 'italic',
  },
  // Link Modal Styles
  linkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
  },
  linkModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  linkModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  linkModalContent: {
    padding: 20,
  },
  linkModalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  linkModalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
  },
  linkModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  linkModalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  linkModalInsertButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkModalInsertButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  linkModalInsertText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Sending State Styles
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendingInfo: {
    flex: 1,
    marginRight: 12,
  },
  sendingText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  // Current User Message Styles
  currentUserMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 40,
    marginRight: 0,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
    paddingLeft: 16,
  },
  currentUserAvatar: {
    backgroundColor: '#6366F1',
  },
  currentUserName: {
    color: '#6366F1',
    fontWeight: '600',
  },
  currentUserContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    marginLeft: 0,
  },
  currentUserText: {
    color: '#1F2937',
    fontWeight: '400',
  },
  // Share Button Styles
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  // Share Modal Styles
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  shareModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  shareModalContent: {
    padding: 20,
  },
  shareModalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  shareLinkContainer: {
    marginBottom: 20,
  },
  shareLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  shareLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareLinkText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
  },
  copyButton: {
    backgroundColor: '#6366F1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: '#10B981',
  },
  copiedText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 8,
    textAlign: 'center',
  },
  shareModalActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  shareModalCloseButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareModalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Swipe Actions Styles
  leftActionContainer: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  rightActionContainer: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  archiveAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  unreadActionText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  archiveActionText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Toast Notification System - Comprehensive Design
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 56,
  },
  toastSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  toastError: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  toastInfo: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  toastText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  toastCloseButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
});