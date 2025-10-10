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

import CallInitiationModal from '@/components/CallInitiationModal';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bold,
    Building,
    Calendar,
    Check,
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
  const [isReplyAll, setIsReplyAll] = useState(false);
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
  const [showCallInitiation, setShowCallInitiation] = useState(false);
  const [callContact, setCallContact] = useState({ name: '', phone: '' });
  const [currentThread, setCurrentThread] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showArchiveToast, setShowArchiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const toastAnimation = useRef(new Animated.Value(0)).current;
  
  // Filter System State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dripReplies: false,
    unreadOnly: false,
    activeDeal: false,
    hasAttachments: false,
    priority: 'all',
    dateRange: 'all',
    assignedTo: 'all',
    customerType: 'all',
    selectedTeamMembers: [] as string[],
  });
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  
  // Compose Email State
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState<string[]>([]);
  const [composeCc, setComposeCc] = useState<string[]>([]);
  const [composeBcc, setComposeBcc] = useState<string[]>([]);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [searchField, setSearchField] = useState<'to' | 'cc' | 'bcc'>('to');
  const [isBoldCompose, setIsBoldCompose] = useState(false);
  const [isItalicCompose, setIsItalicCompose] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendEmailProgress, setSendEmailProgress] = useState(0);
  const [sendEmailTimeout, setSendEmailTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [showForwardBox, setShowForwardBox] = useState(false);
  const [forwardTo, setForwardTo] = useState<string[]>([]);
  const [forwardSearchQuery, setForwardSearchQuery] = useState('');
  const [showForwardSearchResults, setShowForwardSearchResults] = useState(false);
  const [forwardMessage, setForwardMessage] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [forwardProgress, setForwardProgress] = useState(0);
  const [forwardTimeout, setForwardTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showForwardSuccess, setShowForwardSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<Array<{id: number, name: string, subject: string, body: string}>>([]);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{id: number, name: string, subject: string, body: string} | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [templateBodyCursorPosition, setTemplateBodyCursorPosition] = useState(0);
  const [emailSignature, setEmailSignature] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureTitle, setSignatureTitle] = useState('');
  const [signaturePhone, setSignaturePhone] = useState('');
  const [signatureEmail, setSignatureEmail] = useState('');
  
  // Mock contacts for search
  const allContacts = [
    { id: '1', name: 'David Wilson', email: 'david.wilson@techstartup.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: '3', name: 'Mike Chen', email: 'mike@company.com' },
    { id: '4', name: 'Lisa Davis', email: 'lisa@company.com' },
    { id: '5', name: 'Tom Wilson', email: 'tom@company.com' },
    { id: '6', name: 'John Smith', email: 'john@company.com' },
  ];
  
  // Mock team members data
  const teamMembers = [
    { id: '1', name: 'John Smith', email: 'john@company.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com' },
    { id: '3', name: 'Mike Chen', email: 'mike@company.com' },
    { id: '4', name: 'Lisa Davis', email: 'lisa@company.com' },
    { id: '5', name: 'Tom Wilson', email: 'tom@company.com' },
  ];

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
      isSent: false,
      isDraft: false,
      isArchived: false,
      isImportant: false,
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
      isSent: false,
      isDraft: false,
      isArchived: false,
      isImportant: false,
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
      isSent: false,
      isDraft: false,
      isArchived: false,
      isImportant: false,
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
    },
    { 
      id: 4, 
      from: 'You', 
      email: 'you@company.com',
      subject: 'Project proposal and timeline', 
      snippet: 'Hi Michael, I wanted to share our proposal for the upcoming project. Please review and let me know your thoughts.',
      time: '2d ago', 
      unread: false,
      starred: false,
      tag: 'Sent',
      tagColor: '#10B981',
      date: 'Jan 28, 2024, 10:00 AM',
      to: 'Michael Brown',
      isSent: true,
      isDraft: false,
      isArchived: false,
      thread: [
        {
          id: 1,
          from: 'You',
          to: 'Michael Brown',
          subject: 'Project proposal and timeline',
          content: `Hi Michael,

I wanted to share our proposal for the upcoming project. Please review and let me know your thoughts.

I've attached the timeline and budget breakdown for your review.

Looking forward to your feedback.

Best regards,
You`,
          date: 'Jan 28, 2024, 10:00 AM',
          time: '2d ago',
          isCurrentUser: true
        }
      ],
      contact: {
        name: 'Michael Brown',
        company: 'Tech Solutions Inc',
        role: 'CTO',
        phone: '(555) 234-5678',
        email: 'michael@techsolutions.com',
        address: '321 Tech Blvd, San Francisco, CA 94102',
        lastContact: '2d ago',
        creator: 'Tanner Mullen You',
        access: '1 member',
        avatar: 'MB'
      }
    },
    { 
      id: 5, 
      from: 'You', 
      email: 'you@company.com',
      subject: 'Draft: Marketing campaign ideas', 
      snippet: 'Here are some initial ideas for the Q2 marketing campaign...',
      time: '1h ago', 
      unread: false,
      starred: true,
      tag: 'Draft',
      tagColor: '#F59E0B',
      date: 'Jan 30, 2024, 09:00 AM',
      to: 'Marketing Team',
      isSent: false,
      isDraft: true,
      isArchived: false,
      thread: [
        {
          id: 1,
          from: 'You',
          to: 'Marketing Team',
          subject: 'Draft: Marketing campaign ideas',
          content: `Hi Team,

Here are some initial ideas for the Q2 marketing campaign. Still working on this, but wanted to capture my thoughts.

- Social media push
- Email newsletters
- Partnership opportunities

(Draft in progress...)

Best,
You`,
          date: 'Jan 30, 2024, 09:00 AM',
          time: '1h ago',
          isCurrentUser: true
        }
      ],
      contact: {
        name: 'Marketing Team',
        company: 'Your Company',
        role: 'Team',
        phone: '(555) 000-0000',
        email: 'marketing@company.com',
        address: '123 Company St, City, State',
        lastContact: '1h ago',
        creator: 'Tanner Mullen You',
        access: '5 members',
        avatar: 'MT'
      }
    },
    { 
      id: 6, 
      from: 'Old Client', 
      email: 'oldclient@example.com',
      subject: 'Re: Past project discussion', 
      snippet: 'Thanks for all your help on the previous project. It was a great success!',
      time: '30d ago', 
      unread: false,
      starred: false,
      tag: 'Archived',
      tagColor: '#6B7280',
      date: 'Dec 31, 2023, 03:00 PM',
      to: 'John Smith',
      isSent: false,
      isDraft: false,
      isArchived: true,
      thread: [
        {
          id: 1,
          from: 'Old Client',
          to: 'John Smith',
          subject: 'Re: Past project discussion',
          content: `Hi John,

Thanks for all your help on the previous project. It was a great success!

We'll definitely reach out for future opportunities.

Best regards,
Old Client`,
          date: 'Dec 31, 2023, 03:00 PM',
          time: '30d ago'
        }
      ],
      contact: {
        name: 'Old Client',
        company: 'Past Company',
        role: 'Former Customer',
        phone: '(555) 111-2222',
        email: 'oldclient@example.com',
        address: '999 Past Ln, Old City, State',
        lastContact: '30d ago',
        creator: 'Tanner Mullen You',
        access: '1 member',
        avatar: 'OC'
      }
    }
  ];

  const [emailList, setEmailList] = useState(emails);

  // Calculate folder counts dynamically
  const getFolderCounts = () => {
    return {
      Inbox: emailList.filter(e => !e.isSent && !e.isDraft && !e.isArchived).length,
      Sent: emailList.filter(e => e.isSent).length,
      Drafts: emailList.filter(e => e.isDraft).length,
      Archived: emailList.filter(e => e.isArchived).length,
    };
  };

  const folderCounts = getFolderCounts();
  const folders = [
    { name: 'Inbox', count: folderCounts.Inbox },
    { name: 'Sent', count: folderCounts.Sent },
    { name: 'Drafts', count: folderCounts.Drafts },
    { name: 'Archived', count: folderCounts.Archived }
  ];

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
    
    // If it's a draft, set up editing mode
    if (email.isDraft) {
      setIsEditingDraft(true);
      setDraftContent(email.thread[0]?.content || '');
      setDraftSubject(email.subject);
      setDraftTo(email.to);
    } else {
      setIsEditingDraft(false);
    }
    
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
    // Close other boxes
    setShowForwardBox(false);
    setShowReplyBox(true);
    setIsReplyAll(false);
    setReplyText('');
    console.log('Reply to email');
  };

  const handleReplyAll = () => {
    // Close other boxes
    setShowForwardBox(false);
    setShowReplyBox(true);
    setIsReplyAll(true);
    setReplyText('');
    console.log('Reply all to email');
  };

  const getReplyToText = () => {
    if (!selectedEmailData) return '';
    
    if (!isReplyAll) {
      return selectedEmailData.from;
    }
    
    // For Reply All, get all recipients
    const recipients = [];
    
    // Add the original sender
    recipients.push(selectedEmailData.from);
    
    // If there's a 'to' field with multiple recipients, add them
    if (selectedEmailData.to && selectedEmailData.to !== 'John Smith') {
      const toRecipients = selectedEmailData.to.split(',').map((r: string) => r.trim());
      recipients.push(...toRecipients);
    }
    
    // Format the recipients list
    if (recipients.length === 1) {
      return recipients[0];
    } else if (recipients.length === 2) {
      return `${recipients[0]} and ${recipients[1]}`;
    } else {
      // For 3+ recipients, show first two and count
      const remaining = recipients.length - 2;
      return `${recipients[0]}, ${recipients[1]} and ${remaining} other${remaining > 1 ? 's' : ''}`;
    }
  };

  const handleForward = () => {
    // Close other boxes
    setShowReplyBox(false);
    setShowForwardBox(true);
    setForwardTo([]);
    setForwardSearchQuery('');
    setShowForwardSearchResults(false);
    // Set empty message initially so user can add their own text
    setForwardMessage('');
    console.log('Forward box opened');
  };

  const handleAddForwardRecipient = (email: string, name?: string) => {
    const recipient = name ? `${name} <${email}>` : email;
    if (!forwardTo.includes(recipient)) {
      setForwardTo([...forwardTo, recipient]);
    }
    setForwardSearchQuery('');
    setShowForwardSearchResults(false);
  };

  const handleRemoveForwardRecipient = (recipient: string) => {
    setForwardTo(forwardTo.filter(r => r !== recipient));
  };

  const handleForwardSearchChange = (text: string) => {
    setForwardSearchQuery(text);
    setShowForwardSearchResults(text.length > 0);
  };

  const getForwardSearchResults = () => {
    if (!forwardSearchQuery) return [];
    
    const query = forwardSearchQuery.toLowerCase();
    const results: any[] = [];
    
    // Search system users (team members)
    const matchingUsers = systemUsers.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    results.push(...matchingUsers.map(u => ({ ...u, type: 'Team Member' })));
    
    // Search contacts from email list
    const uniqueContacts = new Map();
    emailList.forEach(email => {
      if (email.contact && 
          (email.contact.name.toLowerCase().includes(query) ||
           email.contact.email.toLowerCase().includes(query))) {
        uniqueContacts.set(email.contact.email, {
          name: email.contact.name,
          email: email.contact.email,
          type: 'Contact'
        });
      }
    });
    results.push(...Array.from(uniqueContacts.values()));
    
    return results;
  };

  const handleSendForward = () => {
    if (forwardTo.length === 0 && !forwardSearchQuery.trim()) {
      showToast('Please add at least one recipient', 'error');
      return;
    }
    
    setIsForwarding(true);
    setForwardProgress(0);
    
    // Simulate sending progress over 3 seconds
    const progressInterval = setInterval(() => {
      setForwardProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    
    // Set timeout for actual sending
    const timeout = setTimeout(() => {
      clearInterval(progressInterval);
      
      const recipientCount = forwardTo.length + (forwardSearchQuery.includes('@') ? 1 : 0);
      
      setIsForwarding(false);
      setShowForwardSuccess(true);
      showToast(`Email forwarded to ${recipientCount} recipient(s)`, 'success');
      
      // Close forward box after showing success
      setTimeout(() => {
        setShowForwardSuccess(false);
        setShowForwardBox(false);
        setForwardTo([]);
        setForwardSearchQuery('');
        setForwardMessage('');
      }, 2000);
    }, 3000);
    
    setForwardTimeout(timeout);
  };

  const handleCancelForward = () => {
    if (forwardTimeout) {
      clearTimeout(forwardTimeout);
      setForwardTimeout(null);
    }
    setIsForwarding(false);
    setForwardProgress(0);
    showToast('Forward cancelled', 'info');
  };

  // Template Management Functions
  const handleCreateTemplate = () => {
    setShowSettings(false); // Close settings modal first
    setTimeout(() => {
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateSubject('');
      setTemplateBody('');
      setShowTemplateEditor(true);
    }, 300); // Wait for settings modal to close
  };

  const handleEditTemplate = (template: any) => {
    setShowSettings(false); // Close settings modal first
    setTimeout(() => {
      setEditingTemplate(template);
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTemplateBody(template.body);
      setShowTemplateEditor(true);
    }, 300); // Wait for settings modal to close
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateBody.trim()) {
      showToast('Please provide template name and body', 'error');
      return;
    }

    if (editingTemplate) {
      // Update existing template
      setEmailTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, name: templateName, subject: templateSubject, body: templateBody }
          : t
      ));
      showToast('Template updated successfully', 'success');
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        subject: templateSubject,
        body: templateBody
      };
      setEmailTemplates(prev => [...prev, newTemplate]);
      showToast('Template created successfully', 'success');
    }

    // Close template editor
    setShowTemplateEditor(false);
    setTemplateName('');
    setTemplateSubject('');
    setTemplateBody('');
    setEditingTemplate(null);
    
    // Reopen settings modal after a delay
    setTimeout(() => {
      setShowSettings(true);
    }, 300);
  };

  const handleDeleteTemplate = (templateId: number) => {
    setEmailTemplates(prev => prev.filter(t => t.id !== templateId));
    showToast('Template deleted', 'success');
  };

  const handleUseTemplate = (template: any) => {
    setReplyText(template.body);
    setShowSettings(false);
    setShowReplyBox(true);
    showToast('Template loaded', 'success');
  };

  // Dynamic field options for template editor
  const dynamicFields = [
    { tag: '{first-name}', label: 'First Name', description: 'Contact\'s first name' },
    { tag: '{last-name}', label: 'Last Name', description: 'Contact\'s last name' },
    { tag: '{full-name}', label: 'Full Name', description: 'Contact\'s full name' },
    { tag: '{email}', label: 'Email', description: 'Contact\'s email address' },
    { tag: '{company}', label: 'Company', description: 'Contact\'s company name' },
    { tag: '{phone}', label: 'Phone', description: 'Contact\'s phone number' },
    { tag: '{job-title}', label: 'Job Title', description: 'Contact\'s job title' },
    { tag: '{deal-value}', label: 'Deal Value', description: 'Deal amount/value' },
    { tag: '{deal-stage}', label: 'Deal Stage', description: 'Current deal stage' },
    { tag: '{assigned-to}', label: 'Assigned To', description: 'Team member assigned' },
    { tag: '{today}', label: 'Today\'s Date', description: 'Current date' },
    { tag: '{time}', label: 'Current Time', description: 'Current time' },
  ];

  const handleInsertField = (field: { tag: string, label: string, description: string }) => {
    const beforeCursor = templateBody.substring(0, templateBodyCursorPosition);
    const afterCursor = templateBody.substring(templateBodyCursorPosition);
    const newBody = beforeCursor + field.tag + afterCursor;
    setTemplateBody(newBody);
    setTemplateBodyCursorPosition(templateBodyCursorPosition + field.tag.length);
    setShowFieldDropdown(false);
    showToast(`${field.label} field inserted`, 'success');
  };

  const handleAIReply = () => {
    // Close other boxes
    setShowForwardBox(false);
    
    const aiReply = `Thank you for your email. I appreciate your interest and will get back to you shortly with more details. 

Best regards,
John Smith`;
    setReplyText(aiReply);
    setShowReplyBox(true);
    setIsReplyAll(false);
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

  const handleMarkImportant = (emailId: number) => {
    setEmailList(prevList => prevList.map(email => {
      if (email.id === emailId) {
        const isImportant = !email.isImportant;
        return { ...email, isImportant };
      }
      return email;
    }));
    
    // Show toast based on action
    const email = emailList.find(e => e.id === emailId);
    if (email?.isImportant) {
      showToast('Marked as not important', 'info');
    } else {
      showToast('Marked as important', 'success');
    }
  };

  // Filter System Functions
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateFilter = (key: string, value: any) => {
    if (key === 'assignedTo') {
      if (value === 'team') {
        setShowTeamDropdown(true);
      } else {
        setShowTeamDropdown(false);
        setFilters(prev => ({
          ...prev,
          selectedTeamMembers: []
        }));
      }
    }
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleTeamMember = (memberId: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedTeamMembers.includes(memberId);
      return {
        ...prev,
        selectedTeamMembers: isSelected
          ? prev.selectedTeamMembers.filter(id => id !== memberId)
          : [...prev.selectedTeamMembers, memberId]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      dripReplies: false,
      unreadOnly: false,
      activeDeal: false,
      hasAttachments: false,
      priority: 'all',
      dateRange: 'all',
      assignedTo: 'all',
      customerType: 'all',
      selectedTeamMembers: [],
    });
    setShowTeamDropdown(false);
  };
  
  // Compose Email Functions
  const openCompose = () => {
    setShowCompose(true);
  };
  
  const closeCompose = () => {
    setShowCompose(false);
    // Reset compose fields
    setComposeTo([]);
    setComposeCc([]);
    setComposeBcc([]);
    setComposeSubject('');
    setComposeBody('');
    setShowCc(false);
    setShowBcc(false);
    setContactSearch('');
    setShowContactSearch(false);
  };
  
  const addRecipient = (contact: any, field: 'to' | 'cc' | 'bcc') => {
    const email = contact.email;
    if (field === 'to' && !composeTo.includes(email)) {
      setComposeTo([...composeTo, email]);
    } else if (field === 'cc' && !composeCc.includes(email)) {
      setComposeCc([...composeCc, email]);
    } else if (field === 'bcc' && !composeBcc.includes(email)) {
      setComposeBcc([...composeBcc, email]);
    }
    setContactSearch('');
    setShowContactSearch(false);
  };
  
  const removeRecipient = (email: string, field: 'to' | 'cc' | 'bcc') => {
    if (field === 'to') {
      setComposeTo(composeTo.filter(e => e !== email));
    } else if (field === 'cc') {
      setComposeCc(composeCc.filter(e => e !== email));
    } else if (field === 'bcc') {
      setComposeBcc(composeBcc.filter(e => e !== email));
    }
  };
  
  const handleSendEmail = () => {
    if (composeTo.length === 0 || !composeSubject || !composeBody) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setIsSendingEmail(true);
    setSendEmailProgress(0);
    
    // Simulate sending progress
    const progressInterval = setInterval(() => {
      setSendEmailProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Set timeout for 3 seconds
    const timeout = setTimeout(() => {
      clearInterval(progressInterval);
      
      // Create new sent email
      const newEmail = {
        id: Date.now(),
        from: 'You',
        email: 'you@company.com',
        to: composeTo.join(', '),
        subject: composeSubject,
        snippet: composeBody.substring(0, 100) + (composeBody.length > 100 ? '...' : ''),
        time: 'Just now',
        unread: false,
        starred: false,
        tag: 'Sent',
        tagColor: '#10B981',
        date: new Date().toLocaleString(),
        thread: [{
          id: 1,
          from: 'You',
          to: composeTo.join(', '),
          subject: composeSubject,
          content: composeBody,
          timestamp: new Date().toLocaleTimeString(),
          isCurrentUser: true,
        }],
        isSent: true,
      };
      
      // Add to email list
      setEmailList(prev => [newEmail, ...prev]);
      
      setIsSendingEmail(false);
      showToast('Email sent successfully', 'success');
      closeCompose();
    }, 3000);
    
    setSendEmailTimeout(timeout);
  };
  
  const handleCancelSendEmail = () => {
    if (sendEmailTimeout) {
      clearTimeout(sendEmailTimeout);
      setSendEmailTimeout(null);
    }
    setIsSendingEmail(false);
    setSendEmailProgress(0);
    showToast('Email send cancelled', 'info');
  };

  const handleEditDraft = () => {
    setIsEditingDraft(true);
    setShowReplyBox(true);
    setReplyText(draftContent);
  };

  const handleSendDraft = () => {
    if (!selectedEmailData) return;
    
    setIsSending(true);
    setSendProgress(0);
    
    const progressInterval = setInterval(() => {
      setSendProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    const timeout = setTimeout(() => {
      clearInterval(progressInterval);
      
      // Convert draft to sent email
      const sentEmail = {
        ...selectedEmailData,
        isDraft: false,
        isSent: true,
        tag: 'Sent',
        tagColor: '#10B981',
        time: 'Just now',
        thread: [{
          ...selectedEmailData.thread[0],
          content: draftContent,
          date: new Date().toLocaleString(),
          timestamp: new Date().toLocaleTimeString(),
        }]
      };
      
      // Remove draft and add as sent
      setEmailList(prev => [
        sentEmail,
        ...prev.filter(e => e.id !== selectedEmailData.id)
      ]);
      
      setIsSending(false);
      setShowSendSuccess(true);
      showToast('Email sent successfully', 'success');
      
      setTimeout(() => {
        setShowSendSuccess(false);
        setShowEmailViewer(false);
        setIsEditingDraft(false);
      }, 2000);
    }, 3000);
    
    setSendTimeout(timeout);
  };

  const handleDeleteDraft = () => {
    if (!selectedEmailData) return;
    
    setEmailList(prev => prev.filter(e => e.id !== selectedEmailData.id));
    setShowEmailViewer(false);
    setIsEditingDraft(false);
    showToast('Draft deleted', 'success');
  };
  
  const filteredContacts = contactSearch
    ? allContacts.filter(contact =>
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.email.toLowerCase().includes(contactSearch.toLowerCase())
      )
    : allContacts;

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
        style={styles.importantAction}
        onPress={() => {
          handleMarkImportant(email.id);
          swipeableRef.close();
        }}
      >
        <Star size={24} color="#F59E0B" fill={email.isImportant ? "#F59E0B" : "none"} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.unreadAction}
        onPress={() => {
          handleMarkAsUnread(email.id);
          swipeableRef.close();
        }}
      >
        <Mail size={24} color="#6B7280" />
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
    console.log('Call button clicked in email slideout');
    if (selectedEmailData?.contact) {
      console.log('Setting call contact:', selectedEmailData.contact.name, selectedEmailData.contact.phone);
      setCallContact({ 
        name: selectedEmailData.contact.name, 
        phone: selectedEmailData.contact.phone 
      });
      setShowCallInitiation(true);
      console.log('CallInitiationModal should now be visible');
    } else {
      console.log('No contact data available');
    }
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
            <TouchableOpacity style={styles.headerButton} onPress={toggleFilters}>
              <Filter size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.composeButton} onPress={openCompose}>
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
                activeFolder === folder.name && styles.activeFolderButton
              ]}
              onPress={() => setActiveFolder(folder.name)}
            >
              <Text style={[
                styles.folderText,
                activeFolder === folder.name && styles.activeFolderText
              ]}>
                {folder.name}
              </Text>
              {folder.count > 0 && folder.name !== 'Sent' && folder.name !== 'Archived' && (
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
          {emailList
            .filter(email => {
              // Filter by folder
              if (activeFolder === 'Inbox') return !email.isSent && !email.isDraft && !email.isArchived;
              if (activeFolder === 'Sent') return email.isSent;
              if (activeFolder === 'Drafts') return email.isDraft;
              if (activeFolder === 'Archived') return email.isArchived;
              return true;
            })
            .map((email) => (
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
                      <View style={styles.emailHeaderLeft}>
                        <Text style={[
                          styles.emailFrom,
                          email.unread && styles.unreadText
                        ]}>
                          {email.from}
                        </Text>
                        {email.starred && (
                          <Star size={14} color="#F59E0B" fill="#F59E0B" style={styles.starIconInline} />
                        )}
                        {email.isImportant && (
                          <View style={styles.importantBadge}>
                            <Text style={styles.importantBadgeText}>!</Text>
                          </View>
                        )}
                      </View>
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
              <View style={styles.emailActionsBarContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.emailActionsBar}
                >
                  {selectedEmailData?.isDraft ? (
                    /* Draft Actions */
                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.primaryActionButton]} 
                        onPress={handleEditDraft}
                      >
                        <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>Edit Draft</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.sendActionButton]} 
                        onPress={handleSendDraft}
                      >
                        <Text style={[styles.actionButtonText, styles.sendActionButtonText]}>Send</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteActionButton]} 
                        onPress={handleDeleteDraft}
                      >
                        <Text style={[styles.actionButtonText, styles.deleteActionButtonText]}>Delete Draft</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* Regular Email Actions */
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
                        <Reply size={18} color="#6366F1" />
                        <Text style={styles.actionButtonText}>Reply</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton} onPress={handleReplyAll}>
                        <Text style={styles.actionButtonText}>Reply All</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={handleAIReply}
                      >
                        <LinearGradient
                          colors={['#EC4899', '#A855F7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.aiGradientButton}
                        >
                          <Text style={styles.aiActionButtonText}>AI Reply</Text>
                        </LinearGradient>
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
                  )}
                </ScrollView>
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

              {/* Forward Box */}
              {showForwardBox && (
                <View style={styles.replyBox}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyTitle}>Forward Email</Text>
                    <TouchableOpacity onPress={() => setShowForwardBox(false)}>
                      <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Selected Recipients */}
                  {forwardTo.length > 0 && (
                    <View style={styles.forwardRecipientsList}>
                      {forwardTo.map((recipient, index) => (
                        <View key={index} style={styles.forwardRecipientChip}>
                          <Text style={styles.forwardRecipientText}>{recipient}</Text>
                          <TouchableOpacity onPress={() => handleRemoveForwardRecipient(recipient)}>
                            <X size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Search Input */}
                  <TextInput
                    style={styles.forwardSearchInput}
                    placeholder="Search team members, contacts, or enter email..."
                    value={forwardSearchQuery}
                    onChangeText={handleForwardSearchChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  {/* Search Results */}
                  {showForwardSearchResults && forwardSearchQuery.length > 0 && (
                    <View style={styles.forwardSearchResults}>
                      {getForwardSearchResults().length > 0 ? (
                        <ScrollView style={styles.forwardSearchScroll}>
                          {getForwardSearchResults().map((result, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.forwardSearchResultItem}
                              onPress={() => handleAddForwardRecipient(result.email, result.name)}
                              activeOpacity={0.7}
                            >
                              <View style={styles.forwardResultAvatar}>
                                <Text style={styles.forwardResultAvatarText}>
                                  {result.name.charAt(0)}
                                </Text>
                              </View>
                              <View style={styles.forwardResultInfo}>
                                <Text style={styles.forwardResultName}>{result.name}</Text>
                                <Text style={styles.forwardResultEmail}>{result.email}</Text>
                                <Text style={styles.forwardResultType}>{result.type}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      ) : (
                        // Show option to add custom email
                        forwardSearchQuery.includes('@') && (
                          <TouchableOpacity
                            style={styles.forwardSearchResultItem}
                            onPress={() => handleAddForwardRecipient(forwardSearchQuery)}
                            activeOpacity={0.7}
                          >
                            <View style={[styles.forwardResultAvatar, styles.customEmailAvatar]}>
                              <Mail size={16} color="#FFFFFF" />
                            </View>
                            <View style={styles.forwardResultInfo}>
                              <Text style={styles.forwardResultName}>Add custom email</Text>
                              <Text style={styles.forwardResultEmail}>{forwardSearchQuery}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  )}

                  <View style={styles.forwardMessageContainer}>
                    <Text style={styles.forwardMessageLabel}>Your message (optional):</Text>
                    <TextInput
                      style={styles.forwardMessageInput}
                      placeholder="Add a message to include with the forwarded email..."
                      value={forwardMessage}
                      onChangeText={setForwardMessage}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    <Text style={styles.forwardNoteText}>
                      The original email will be included below your message.
                    </Text>
                  </View>

                  <View style={styles.replyActions}>
                    {isForwarding ? (
                      <View style={styles.sendingContainer}>
                        <View style={styles.sendingInfo}>
                          <Text style={styles.sendingText}>Forwarding email...</Text>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${forwardProgress}%` }]} />
                          </View>
                          <Text style={styles.progressText}>{forwardProgress}%</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.cancelButton}
                          onPress={handleCancelForward}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : showForwardSuccess ? (
                      <View style={styles.successContainer}>
                        <Check size={20} color="#10B981" />
                        <Text style={styles.successText}>Email forwarded successfully!</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.sendButton, forwardTo.length === 0 && !forwardSearchQuery.includes('@') && styles.sendButtonDisabled]}
                        onPress={handleSendForward}
                        disabled={forwardTo.length === 0 && !forwardSearchQuery.includes('@')}
                      >
                        <Text style={styles.sendButtonText}>Forward</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Reply Box */}
              {showReplyBox && (
                <View style={styles.replyBox}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyTitle}>Reply to {getReplyToText()}</Text>
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

      {/* Bottom Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={toggleFilters}
      >
        <SafeAreaView style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <TouchableOpacity onPress={toggleFilters}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Quick Filters</Text>
              
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => updateFilter('dripReplies', !filters.dripReplies)}
              >
                <View style={styles.filterOptionLeft}>
                  <Text style={styles.filterOptionText}>Drip Replies</Text>
                  <Text style={styles.filterOptionSubtext}>Filter messages that are replies to drips</Text>
                </View>
                <View style={[styles.checkbox, filters.dripReplies && styles.checkboxChecked]}>
                  {filters.dripReplies && <Check size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => updateFilter('unreadOnly', !filters.unreadOnly)}
              >
                <View style={styles.filterOptionLeft}>
                  <Text style={styles.filterOptionText}>Unread Only</Text>
                  <Text style={styles.filterOptionSubtext}>Show only unread messages</Text>
                </View>
                <View style={[styles.checkbox, filters.unreadOnly && styles.checkboxChecked]}>
                  {filters.unreadOnly && <Check size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => updateFilter('activeDeal', !filters.activeDeal)}
              >
                <View style={styles.filterOptionLeft}>
                  <Text style={styles.filterOptionText}>Active Deal</Text>
                  <Text style={styles.filterOptionSubtext}>Messages with active deals</Text>
                </View>
                <View style={[styles.checkbox, filters.activeDeal && styles.checkboxChecked]}>
                  {filters.activeDeal && <Check size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => updateFilter('hasAttachments', !filters.hasAttachments)}
              >
                <View style={styles.filterOptionLeft}>
                  <Text style={styles.filterOptionText}>Has Attachments</Text>
                  <Text style={styles.filterOptionSubtext}>Messages with file attachments</Text>
                </View>
                <View style={[styles.checkbox, filters.hasAttachments && styles.checkboxChecked]}>
                  {filters.hasAttachments && <Check size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Priority</Text>
                <View style={styles.filterButtons}>
                  {['all', 'high', 'medium', 'low'].map(priority => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.filterOptionButton,
                        filters.priority === priority && styles.filterOptionButtonActive
                      ]}
                      onPress={() => updateFilter('priority', priority)}
                    >
                      <Text style={[
                        styles.filterOptionButtonText,
                        filters.priority === priority && styles.filterOptionButtonTextActive
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Date Received</Text>
                <View style={styles.filterButtons}>
                  {['all', 'today', 'week', 'month'].map(range => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterOptionButton,
                        filters.dateRange === range && styles.filterOptionButtonActive
                      ]}
                      onPress={() => updateFilter('dateRange', range)}
                    >
                      <Text style={[
                        styles.filterOptionButtonText,
                        filters.dateRange === range && styles.filterOptionButtonTextActive
                      ]}>
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Assigned To</Text>
                <View style={styles.filterButtons}>
                  {['all', 'me', 'team', 'unassigned'].map(assigned => (
                    <TouchableOpacity
                      key={assigned}
                      style={[
                        styles.filterOptionButton,
                        filters.assignedTo === assigned && styles.filterOptionButtonActive
                      ]}
                      onPress={() => updateFilter('assignedTo', assigned)}
                    >
                      <Text style={[
                        styles.filterOptionButtonText,
                        filters.assignedTo === assigned && styles.filterOptionButtonTextActive
                      ]}>
                        {assigned.charAt(0).toUpperCase() + assigned.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {showTeamDropdown && (
                  <View style={styles.teamMembersContainer}>
                    <Text style={styles.teamMembersTitle}>Select Team Members:</Text>
                    {teamMembers.map(member => (
                      <TouchableOpacity
                        key={member.id}
                        style={styles.teamMemberOption}
                        onPress={() => toggleTeamMember(member.id)}
                      >
                        <View style={styles.teamMemberInfo}>
                          <Text style={styles.teamMemberName}>{member.name}</Text>
                          <Text style={styles.teamMemberEmail}>{member.email}</Text>
                        </View>
                        <View style={[
                          styles.checkbox,
                          filters.selectedTeamMembers.includes(member.id) && styles.checkboxChecked
                        ]}>
                          {filters.selectedTeamMembers.includes(member.id) && <Check size={16} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Customer Type</Text>
                <View style={styles.filterButtons}>
                  {['all', 'customers', 'prospects', 'leads'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOptionButton,
                        filters.customerType === type && styles.filterOptionButtonActive
                      ]}
                      onPress={() => updateFilter('customerType', type)}
                    >
                      <Text style={[
                        styles.filterOptionButtonText,
                        filters.customerType === type && styles.filterOptionButtonTextActive
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.filterFooter}>
            <TouchableOpacity 
              style={styles.applyFiltersButton}
              onPress={toggleFilters}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettings(false)}
      >
        <SafeAreaView style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Email Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.settingsContent}>
            {/* Signature Settings Section */}
            <View style={styles.settingsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Email Signature</Text>
              </View>

              <View style={styles.signatureForm}>
                <View style={styles.signatureField}>
                  <Text style={styles.signatureFieldLabel}>Name</Text>
                  <TextInput
                    style={styles.signatureInput}
                    placeholder="Your full name"
                    value={signatureName}
                    onChangeText={setSignatureName}
                  />
                </View>

                <View style={styles.signatureField}>
                  <Text style={styles.signatureFieldLabel}>Title</Text>
                  <TextInput
                    style={styles.signatureInput}
                    placeholder="Your job title"
                    value={signatureTitle}
                    onChangeText={setSignatureTitle}
                  />
                </View>

                <View style={styles.signatureField}>
                  <Text style={styles.signatureFieldLabel}>Phone</Text>
                  <TextInput
                    style={styles.signatureInput}
                    placeholder="(555) 123-4567"
                    value={signaturePhone}
                    onChangeText={setSignaturePhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.signatureField}>
                  <Text style={styles.signatureFieldLabel}>Email</Text>
                  <TextInput
                    style={styles.signatureInput}
                    placeholder="your@email.com"
                    value={signatureEmail}
                    onChangeText={setSignatureEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.signaturePreview}>
                  <Text style={styles.signaturePreviewLabel}>Preview:</Text>
                  <View style={styles.signaturePreviewBox}>
                    {signatureName || signatureTitle || signaturePhone || signatureEmail ? (
                      <>
                        {signatureName && <Text style={styles.signaturePreviewName}>{signatureName}</Text>}
                        {signatureTitle && <Text style={styles.signaturePreviewTitle}>{signatureTitle}</Text>}
                        {signaturePhone && <Text style={styles.signaturePreviewContact}>📱 {signaturePhone}</Text>}
                        {signatureEmail && <Text style={styles.signaturePreviewContact}>✉️ {signatureEmail}</Text>}
                      </>
                    ) : (
                      <Text style={styles.signaturePreviewEmpty}>Your signature will appear here</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.saveSignatureButton}
                  onPress={() => showToast('Signature saved successfully', 'success')}
                >
                  <Text style={styles.saveSignatureText}>Save Signature</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.sectionDivider} />

            {/* Templates Section */}
            <View style={styles.settingsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Email Templates</Text>
                <TouchableOpacity 
                  style={styles.createTemplateButton}
                  onPress={handleCreateTemplate}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.createTemplateText}>New Template</Text>
                </TouchableOpacity>
              </View>

              {emailTemplates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No templates yet</Text>
                  <Text style={styles.emptyStateSubtext}>Create your first email template to save time</Text>
                </View>
              ) : (
                <View style={styles.templatesList}>
                  {emailTemplates.map((template) => (
                    <View key={template.id} style={styles.templateCard}>
                      <View style={styles.templateInfo}>
                        <Text style={styles.templateName}>{template.name}</Text>
                        {template.subject && (
                          <Text style={styles.templateSubject}>Subject: {template.subject}</Text>
                        )}
                        <Text style={styles.templatePreview} numberOfLines={2}>{template.body}</Text>
                      </View>
                      <View style={styles.templateActions}>
                        <TouchableOpacity 
                          style={styles.templateActionButton}
                          onPress={() => handleUseTemplate(template)}
                        >
                          <Text style={styles.useTemplateText}>Use</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.templateActionButton}
                          onPress={() => handleEditTemplate(template)}
                        >
                          <Text style={styles.editTemplateText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteTemplateButton}
                          onPress={() => handleDeleteTemplate(template.id)}
                        >
                          <X size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Template Editor Modal */}
      <Modal
        visible={showTemplateEditor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTemplateEditor(false)}
      >
        <SafeAreaView style={styles.templateEditorModal}>
          <View style={styles.templateEditorHeader}>
            <TouchableOpacity onPress={() => setShowTemplateEditor(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.templateEditorTitle}>
              {editingTemplate ? 'Edit Template' : 'New Template'}
            </Text>
            <TouchableOpacity 
              style={styles.saveTemplateButton}
              onPress={handleSaveTemplate}
            >
              <Text style={styles.saveTemplateText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.templateEditorContent}>
            <View style={styles.templateField}>
              <Text style={styles.templateFieldLabel}>Template Name*</Text>
              <TextInput
                style={styles.templateInput}
                placeholder="e.g., Follow-up Email, Thank You"
                value={templateName}
                onChangeText={setTemplateName}
              />
            </View>

            <View style={styles.templateField}>
              <Text style={styles.templateFieldLabel}>Subject (optional)</Text>
              <TextInput
                style={styles.templateInput}
                placeholder="Email subject line"
                value={templateSubject}
                onChangeText={setTemplateSubject}
              />
            </View>

            <View style={styles.templateField}>
              <View style={styles.templateBodyHeader}>
                <Text style={styles.templateFieldLabel}>Email Body*</Text>
                <TouchableOpacity 
                  style={styles.insertFieldButton}
                  onPress={() => setShowFieldDropdown(!showFieldDropdown)}
                >
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.insertFieldButtonText}>Insert Field</Text>
                </TouchableOpacity>
              </View>
              
              {showFieldDropdown && (
                <View style={styles.fieldDropdown}>
                  <ScrollView style={styles.fieldDropdownScroll} nestedScrollEnabled>
                    {dynamicFields.map((field, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.fieldOption}
                        onPress={() => handleInsertField(field)}
                      >
                        <View style={styles.fieldOptionLeft}>
                          <Text style={styles.fieldTag}>{field.tag}</Text>
                          <Text style={styles.fieldLabel}>{field.label}</Text>
                        </View>
                        <Text style={styles.fieldDescription}>{field.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TextInput
                style={styles.templateBodyInput}
                placeholder="Write your email template..."
                value={templateBody}
                onChangeText={setTemplateBody}
                onSelectionChange={(event) => {
                  setTemplateBodyCursorPosition(event.nativeEvent.selection.start);
                }}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
              
              {/* Preview with highlighted fields */}
              {templateBody.length > 0 && (
                <View style={styles.templatePreviewBox}>
                  <Text style={styles.templatePreviewLabel}>Preview:</Text>
                  <View style={styles.templatePreviewContent}>
                    {templateBody.split(/(\{[^}]+\})/g).map((part, index) => {
                      const isDynamicField = part.match(/^\{[^}]+\}$/);
                      return (
                        <Text
                          key={index}
                          style={[
                            styles.templatePreviewText,
                            isDynamicField && styles.dynamicFieldHighlight
                          ]}
                        >
                          {part}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            <Text style={styles.templateNote}>
              💡 Tip: Click "Insert Field" to add dynamic fields like {'{first-name}'}, {'{company}'}, etc.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Compose Email Modal */}
      <Modal
        visible={showCompose}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCompose}
      >
        <SafeAreaView style={styles.composeModal}>
          <View style={styles.composeHeader}>
            <TouchableOpacity onPress={closeCompose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.composeTitle}>New Message</Text>
            <TouchableOpacity onPress={handleSendEmail} style={styles.sendButton} disabled={isSendingEmail}>
              <Text style={styles.sendButtonText}>{isSendingEmail ? 'Sending...' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sending Progress */}
          {isSendingEmail && (
            <View style={styles.sendingProgressContainer}>
              <View style={styles.sendingProgressBar}>
                <View style={[styles.sendingProgressFill, { width: `${sendEmailProgress}%` }]} />
              </View>
              <TouchableOpacity onPress={handleCancelSendEmail} style={styles.cancelSendButton}>
                <Text style={styles.cancelSendText}>Cancel Send</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <ScrollView style={styles.composeContent}>
            {/* To Field */}
            <View style={styles.composeField}>
              <Text style={styles.composeLabel}>To:</Text>
              <View style={styles.recipientsContainer}>
                {composeTo.map((email, index) => (
                  <View key={index} style={styles.recipientChip}>
                    <Text style={styles.recipientChipText}>{email}</Text>
                    <TouchableOpacity onPress={() => removeRecipient(email, 'to')}>
                      <X size={14} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={styles.recipientInput}
                  placeholder="Search contacts..."
                  value={contactSearch}
                  onChangeText={(text) => {
                    setContactSearch(text);
                    setShowContactSearch(text.length > 0);
                    setSearchField('to');
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            {/* Contact Search Results */}
            {showContactSearch && (
              <View style={styles.contactSearchResults}>
                <ScrollView>
                  {filteredContacts.map((contact) => (
                    <TouchableOpacity
                      key={contact.id}
                      style={styles.contactResult}
                      onPress={() => addRecipient(contact, searchField)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactAvatar}>
                        <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactEmail}>{contact.email}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* CC/BCC Buttons */}
            <View style={styles.ccBccContainer}>
              {!showCc && (
                <TouchableOpacity onPress={() => setShowCc(true)}>
                  <Text style={styles.ccBccButton}>Cc</Text>
                </TouchableOpacity>
              )}
              {!showBcc && (
                <TouchableOpacity onPress={() => setShowBcc(true)} style={{ marginLeft: 16 }}>
                  <Text style={styles.ccBccButton}>Bcc</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* CC Field */}
            {showCc && (
              <View style={styles.composeField}>
                <Text style={styles.composeLabel}>Cc:</Text>
                <View style={styles.recipientsContainer}>
                  {composeCc.map((email, index) => (
                    <View key={index} style={styles.recipientChip}>
                      <Text style={styles.recipientChipText}>{email}</Text>
                      <TouchableOpacity onPress={() => removeRecipient(email, 'cc')}>
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TextInput
                    style={styles.recipientInput}
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChangeText={(text) => {
                      setContactSearch(text);
                      setShowContactSearch(text.length > 0);
                      setSearchField('cc');
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}
            
            {/* BCC Field */}
            {showBcc && (
              <View style={styles.composeField}>
                <Text style={styles.composeLabel}>Bcc:</Text>
                <View style={styles.recipientsContainer}>
                  {composeBcc.map((email, index) => (
                    <View key={index} style={styles.recipientChip}>
                      <Text style={styles.recipientChipText}>{email}</Text>
                      <TouchableOpacity onPress={() => removeRecipient(email, 'bcc')}>
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TextInput
                    style={styles.recipientInput}
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChangeText={(text) => {
                      setContactSearch(text);
                      setShowContactSearch(text.length > 0);
                      setSearchField('bcc');
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}
            
            {/* Subject Field */}
            <View style={styles.composeField}>
              <Text style={styles.composeLabel}>Subject:</Text>
              <TextInput
                style={styles.subjectInput}
                placeholder="Email subject"
                value={composeSubject}
                onChangeText={setComposeSubject}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            {/* Rich Text Toolbar */}
            <View style={styles.richTextToolbar}>
              <TouchableOpacity
                style={[styles.toolbarButton, isBoldCompose && styles.toolbarButtonActive]}
                onPress={() => setIsBoldCompose(!isBoldCompose)}
              >
                <Bold size={20} color={isBoldCompose ? "#6366F1" : "#6B7280"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolbarButton, isItalicCompose && styles.toolbarButtonActive]}
                onPress={() => setIsItalicCompose(!isItalicCompose)}
              >
                <Italic size={20} color={isItalicCompose ? "#6366F1" : "#6B7280"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Link size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Paperclip size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Image size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Body Field */}
            <TextInput
              style={styles.bodyInput}
              placeholder="Write your message..."
              value={composeBody}
              onChangeText={setComposeBody}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </ScrollView>
        </SafeAreaView>
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

      {/* Call Initiation Modal */}
      <CallInitiationModal
        visible={showCallInitiation}
        onClose={() => setShowCallInitiation(false)}
        contactName={callContact.name}
        phoneNumber={callContact.phone}
      />
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
  emailHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  starIconInline: {
    marginLeft: 4,
  },
  importantBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  importantBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  emailActionsBarContainer: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emailActionsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  aiGradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366F1',
  },
  aiActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryActionButton: {
    backgroundColor: '#EEF2FF',
  },
  primaryActionButtonText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  sendActionButton: {
    backgroundColor: '#10B981',
  },
  sendActionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteActionButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteActionButtonText: {
    color: '#EF4444',
    fontWeight: '600',
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
    minHeight: 200,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
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
  importantAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    borderWidth: 1,
    borderColor: '#FCD34D',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 8,
  },
  importantActionText: {
    color: '#F59E0B',
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
  // Filter Modal Styles
  filterModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearFiltersText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionLeft: {
    flex: 1,
    paddingRight: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  filterOptionSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  filterOptionButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterOptionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterOptionButtonTextActive: {
    color: '#FFFFFF',
  },
  filterFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  applyFiltersButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Team Members Dropdown Styles
  teamMembersContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  teamMembersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  teamMemberOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  teamMemberEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  // Compose Modal Styles
  composeModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  composeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  composeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  composeContent: {
    flex: 1,
    padding: 20,
  },
  composeField: {
    marginBottom: 16,
  },
  composeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recipientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    minHeight: 44,
  },
  recipientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  recipientChipText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 6,
  },
  recipientInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    minWidth: 120,
    paddingVertical: 4,
  },
  contactSearchResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
    maxHeight: 200,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  contactResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  ccBccContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ccBccButton: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  subjectInput: {
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  richTextToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  toolbarButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 6,
  },
  toolbarButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  bodyInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 200,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  sendingProgressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sendingProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sendingProgressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  cancelSendButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  cancelSendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Forward Box Styles
  forwardRecipientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  forwardRecipientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  forwardRecipientText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  forwardSearchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  forwardSearchResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    maxHeight: 250,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  forwardSearchScroll: {
    maxHeight: 250,
  },
  forwardSearchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  forwardResultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customEmailAvatar: {
    backgroundColor: '#10B981',
  },
  forwardResultAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  forwardResultInfo: {
    flex: 1,
  },
  forwardResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  forwardResultEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  forwardResultType: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    marginTop: 2,
  },
  forwardMessageContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  forwardMessageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  forwardMessageInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  forwardNoteText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  // Settings Modal Styles
  settingsModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  createTemplateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  createTemplateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },
  signatureForm: {
    gap: 16,
  },
  signatureField: {
    gap: 8,
  },
  signatureFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  signatureInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  signaturePreview: {
    marginTop: 8,
  },
  signaturePreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  signaturePreviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
  },
  signaturePreviewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  signaturePreviewTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  signaturePreviewContact: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  signaturePreviewEmpty: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 40,
  },
  saveSignatureButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveSignatureText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  templatesList: {
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateInfo: {
    marginBottom: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  templateSubject: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  templatePreview: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  templateActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  useTemplateText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  editTemplateText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteTemplateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  // Template Editor Modal Styles
  templateEditorModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  templateEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  templateEditorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveTemplateButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveTemplateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  templateEditorContent: {
    flex: 1,
    padding: 20,
  },
  templateField: {
    marginBottom: 20,
  },
  templateFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  templateInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  templateBodyInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  templateNote: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  templateBodyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insertFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  insertFieldButtonText: {
    color: '#6366F1',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldDropdownScroll: {
    maxHeight: 250,
  },
  fieldOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldOptionLeft: {
    flex: 1,
  },
  fieldTag: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  fieldDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  templatePreviewBox: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templatePreviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  templatePreviewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  templatePreviewText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
  },
  dynamicFieldHighlight: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  // Old Forward Modal Styles (deprecated - can be removed later)
  forwardModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  forwardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  forwardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  forwardContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  forwardRecipientSection: {
    marginBottom: 24,
  },
  forwardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  forwardRecipientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  forwardRecipientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  forwardRecipientText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  forwardSearchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  forwardSearchResults: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 300,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  forwardSearchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  forwardResultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customEmailAvatar: {
    backgroundColor: '#10B981',
  },
  forwardResultAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  forwardResultInfo: {
    flex: 1,
  },
  forwardResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  forwardResultEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  forwardResultType: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    marginTop: 2,
  },
  forwardPreviewSection: {
    marginTop: 24,
  },
  forwardPreviewLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  forwardPreviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  forwardPreviewText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});