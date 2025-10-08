import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import SendRequestModal from '@/components/SendRequestModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    BellOff,
    Briefcase,
    ChevronDown,
    ChevronRight,
    DollarSign,
    FileText,
    Hash,
    Lock,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Paperclip,
    Phone,
    Plus,
    Search,
    Send,
    Settings,
    Smile,
    Star,
    Users,
    Video,
    X
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
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

const { width: screenWidth } = Dimensions.get('window');

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'admin' | 'member';
  lastSeen?: string;
}

interface TeamChannel {
  id: string;
  name: string;
  type: 'public' | 'private';
  channelType: 'team' | 'job';
  description?: string;
  memberCount: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isStarred?: boolean;
  isMuted?: boolean;
  jobNumber?: string;
  jobAddress?: string;
}

interface TeamDirectMessage {
  id: string;
  member: TeamMember;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
}

interface TeamMessage {
  id: string;
  text: string;
  sender: TeamMember;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'file';
    url: string;
    size?: string;
  }>;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  thread?: {
    count: number;
    lastMessage: string;
    lastMessageTime: string;
  };
  isEdited?: boolean;
  isPinned?: boolean;
}

export default function TeamChat() {
  const { setIsTransparent, setIsVisible } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<TeamChannel | null>(null);
  const [selectedDM, setSelectedDM] = useState<TeamDirectMessage | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showUserMention, setShowUserMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState(0);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [isPrivateChannel, setIsPrivateChannel] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [createChannelType, setCreateChannelType] = useState<'job' | 'team'>('job');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [showDMModal, setShowDMModal] = useState(false);
  const [showComposeDM, setShowComposeDM] = useState(false);
  const [composeDMRecipient, setComposeDMRecipient] = useState('');
  const [composeDMMessage, setComposeDMMessage] = useState('');
  const [composeDMSearchQuery, setComposeDMSearchQuery] = useState('');
  const [jobChannelSearchQuery, setJobChannelSearchQuery] = useState('');
  const [showAllJobChannels, setShowAllJobChannels] = useState(false);
  const [jobChannelFilter, setJobChannelFilter] = useState<'all' | 'active' | 'unread'>('active');
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Quick Actions modal states
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');
  const [channelView, setChannelView] = useState<'job' | 'team'>('job');
  const [showDealInfo, setShowDealInfo] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [showEditMembers, setShowEditMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearchQuery, setAddMemberSearchQuery] = useState('');
  const [channelMembers, setChannelMembers] = useState<string[]>(['1', '2', '3']); // Member IDs in channel
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock active jobs in the system
  const activeJobs = [
    { id: 'J2445', name: 'Johnson Kitchen Remodel', address: '123 Oak Street', customer: 'David Johnson', status: 'In Progress' },
    { id: 'J2448', name: 'Wilson Bathroom Update', address: '456 Maple Ave', customer: 'Sarah Wilson', status: 'In Progress' },
    { id: 'J2450', name: 'Smith Basement Finishing', address: '789 Pine Road', customer: 'Mike Smith', status: 'In Progress' },
    { id: 'J2451', name: 'Martinez Deck Build', address: '234 Cedar Lane', customer: 'Maria Martinez', status: 'In Progress' },
    { id: 'J2452', name: 'Anderson Roof Replacement', address: '567 Birch Street', customer: 'Tom Anderson', status: 'In Progress' },
    { id: 'J2453', name: 'Thompson Garage Addition', address: '890 Elm Drive', customer: 'Lisa Thompson', status: 'In Progress' },
    { id: 'J2454', name: 'Davis Master Suite Remodel', address: '345 Willow Court', customer: 'Robert Davis', status: 'In Progress' },
    { id: 'J2455', name: 'Main St Retail Buildout', address: '123 Main Street', customer: 'Tech Corp', status: 'In Progress' },
    { id: 'J2456', name: 'Garcia Pool Installation', address: '678 Sunset Blvd', customer: 'Carlos Garcia', status: 'Starting Soon' },
    { id: 'J2457', name: 'Tech Corp Office Renovation', address: '456 Business Park Dr', customer: 'Tech Corp', status: 'Starting Soon' },
  ];

  // Mock team members
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Martinez',
      initials: 'SM',
      status: 'online',
      role: 'admin',
      lastSeen: 'now'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      initials: 'MJ',
      status: 'away',
      role: 'member',
      lastSeen: '5m ago'
    },
    {
      id: '3',
      name: 'Emily Chen',
      initials: 'EC',
      status: 'online',
      role: 'member',
      lastSeen: 'now'
    },
    {
      id: '4',
      name: 'David Wilson',
      initials: 'DW',
      status: 'busy',
      role: 'member',
      lastSeen: '1h ago'
    },
    {
      id: '5',
      name: 'Lisa Rodriguez',
      initials: 'LR',
      status: 'offline',
      role: 'member',
      lastSeen: '2h ago'
    }
  ];

  // Mock channels
  const channels: TeamChannel[] = [
    // Team Channels
    {
      id: '1',
      name: 'general',
      type: 'public',
      channelType: 'team',
      description: 'General team discussions',
      memberCount: 5,
      unreadCount: 3,
      lastMessage: 'Hey team, great work on the project!',
      lastMessageTime: '2m ago',
      isStarred: true
    },
    {
      id: '2',
      name: 'development',
      type: 'public',
      channelType: 'team',
      description: 'Development discussions',
      memberCount: 3,
      unreadCount: 0,
      lastMessage: 'The new feature is ready for testing',
      lastMessageTime: '1h ago',
      isMuted: true
    },
    {
      id: '3',
      name: 'marketing',
      type: 'private',
      channelType: 'team',
      description: 'Marketing team only',
      memberCount: 2,
      unreadCount: 1,
      lastMessage: 'Campaign is ready to launch',
      lastMessageTime: '30m ago'
    },
    // Job Channels (Active Jobs)
    {
      id: '4',
      name: 'kitchen-renovation',
      type: 'public',
      channelType: 'job',
      description: 'Johnson Kitchen Remodel - #J2445',
      memberCount: 4,
      unreadCount: 2,
      lastMessage: 'Materials arriving tomorrow',
      lastMessageTime: '15m ago',
      jobNumber: '#J2445',
      jobAddress: '123 Oak Street'
    },
    {
      id: '5',
      name: 'bathroom-update',
      type: 'public',
      channelType: 'job',
      description: 'Wilson Bathroom Update - #J2448',
      memberCount: 3,
      unreadCount: 0,
      lastMessage: 'Plumbing inspection passed',
      lastMessageTime: '1h ago',
      jobNumber: '#J2448',
      jobAddress: '456 Maple Ave'
    },
    {
      id: '6',
      name: 'basement-finishing',
      type: 'public',
      channelType: 'job',
      description: 'Smith Basement Finishing - #J2450',
      memberCount: 5,
      unreadCount: 5,
      lastMessage: 'Framing complete, ready for drywall',
      lastMessageTime: '30m ago',
      jobNumber: '#J2450',
      jobAddress: '789 Pine Road'
    },
    {
      id: '7',
      name: 'deck-construction',
      type: 'public',
      channelType: 'job',
      description: 'Martinez Deck Build - #J2451',
      memberCount: 3,
      unreadCount: 1,
      lastMessage: 'Post footings done',
      lastMessageTime: '2h ago',
      jobNumber: '#J2451',
      jobAddress: '234 Cedar Lane'
    },
    {
      id: '8',
      name: 'roof-replacement',
      type: 'public',
      channelType: 'job',
      description: 'Anderson Roof Replacement - #J2452',
      memberCount: 6,
      unreadCount: 8,
      lastMessage: 'Weather delay until Monday',
      lastMessageTime: '3h ago',
      jobNumber: '#J2452',
      jobAddress: '567 Birch Street'
    },
    {
      id: '9',
      name: 'garage-addition',
      type: 'public',
      channelType: 'job',
      description: 'Thompson Garage Addition - #J2453',
      memberCount: 4,
      unreadCount: 0,
      lastMessage: 'Foundation inspection scheduled',
      lastMessageTime: '4h ago',
      jobNumber: '#J2453',
      jobAddress: '890 Elm Drive'
    },
    {
      id: '10',
      name: 'master-suite-remodel',
      type: 'public',
      channelType: 'job',
      description: 'Davis Master Suite Remodel - #J2454',
      memberCount: 5,
      unreadCount: 3,
      lastMessage: 'Tile selection finalized',
      lastMessageTime: '5h ago',
      jobNumber: '#J2454',
      jobAddress: '345 Willow Court'
    },
    {
      id: '11',
      name: 'commercial-buildout',
      type: 'public',
      channelType: 'job',
      description: 'Main St Retail Buildout - #J2455',
      memberCount: 8,
      unreadCount: 0,
      lastMessage: 'HVAC rough-in complete',
      lastMessageTime: '6h ago',
      jobNumber: '#J2455',
      jobAddress: '123 Main Street'
    },
    {
      id: '12',
      name: 'pool-installation',
      type: 'public',
      channelType: 'job',
      description: 'Garcia Pool Installation - #J2456',
      memberCount: 4,
      unreadCount: 2,
      lastMessage: 'Excavation starts tomorrow',
      lastMessageTime: '1d ago',
      jobNumber: '#J2456',
      jobAddress: '678 Sunset Blvd'
    },
    {
      id: '13',
      name: 'office-renovation',
      type: 'public',
      channelType: 'job',
      description: 'Tech Corp Office Reno - #J2457',
      memberCount: 6,
      unreadCount: 0,
      lastMessage: 'Flooring samples approved',
      lastMessageTime: '1d ago',
      jobNumber: '#J2457',
      jobAddress: '456 Business Park Dr'
    }
  ];

  // Mock direct messages
  const directMessages: TeamDirectMessage[] = [
    {
      id: '1',
      member: teamMembers[0],
      unreadCount: 2,
      lastMessage: 'Can you review the proposal?',
      lastMessageTime: '5m ago',
      isOnline: true
    },
    {
      id: '2',
      member: teamMembers[1],
      unreadCount: 0,
      lastMessage: 'Thanks for the help!',
      lastMessageTime: '1h ago',
      isOnline: false
    }
  ];

  // Mock messages for selected channel/DM
  const mockMessages: { [key: string]: TeamMessage[] } = {
    '1': [ // General channel
      {
        id: '1',
        text: 'Welcome to the team chat! 🎉',
        sender: teamMembers[0],
        timestamp: '10:30 AM',
        type: 'text'
      },
      {
        id: '2',
        text: 'Hey everyone! Excited to be working with you all.',
        sender: teamMembers[1],
        timestamp: '10:32 AM',
        type: 'text',
        reactions: [
          { emoji: '👍', count: 3, users: ['1', '2', '3'] },
          { emoji: '🎉', count: 1, users: ['4'] }
        ]
      },
      {
        id: '3',
        text: 'Just uploaded the project files to the shared drive',
        sender: teamMembers[2],
        timestamp: '10:35 AM',
        type: 'text',
        attachments: [
          {
            id: '1',
            name: 'project-files.zip',
            type: 'file',
            url: '#',
            size: '2.4 MB'
          }
        ]
      }
    ],
    '4': [ // Johnson Kitchen Remodel job channel
      {
        id: '1',
        text: 'Morning team! Starting demo today. Customer is onsite and excited to get started.',
        sender: teamMembers[0],
        timestamp: '8:15 AM',
        type: 'text'
      },
      {
        id: '2',
        text: 'Old cabinets removed. Check out the condition of the walls behind them.',
        sender: teamMembers[0],
        timestamp: '9:42 AM',
        type: 'text',
        attachments: [
          {
            id: '1',
            name: 'demo-progress-1.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
            size: '1.2 MB'
          }
        ]
      },
      {
        id: '3',
        text: 'Found some water damage on the left wall. Going to need to replace drywall before we install new cabinets.',
        sender: teamMembers[1],
        timestamp: '10:05 AM',
        type: 'text',
        reactions: [
          { emoji: '👀', count: 2, users: ['2', '3'] }
        ]
      },
      {
        id: '4',
        text: 'Good catch. Adding $450 to the quote for drywall replacement. I\'ll call the customer now.',
        sender: teamMembers[2],
        timestamp: '10:12 AM',
        type: 'text'
      },
      {
        id: '5',
        text: 'Customer approved the additional work. Let\'s get the drywall ordered.',
        sender: teamMembers[2],
        timestamp: '10:28 AM',
        type: 'text',
        reactions: [
          { emoji: '✅', count: 3, users: ['1', '2', '3'] }
        ]
      },
      {
        id: '6',
        text: 'Drywall repair complete. Wall is ready for cabinets.',
        sender: teamMembers[1],
        timestamp: '2:35 PM',
        type: 'text',
        attachments: [
          {
            id: '2',
            name: 'wall-repair.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800',
            size: '1.8 MB'
          }
        ]
      },
      {
        id: '7',
        text: 'New cabinets delivered! Unloading now.',
        sender: teamMembers[0],
        timestamp: 'Yesterday 9:15 AM',
        type: 'text',
        attachments: [
          {
            id: '3',
            name: 'cabinet-delivery.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
            size: '2.1 MB'
          }
        ]
      },
      {
        id: '8',
        text: 'Base cabinets installed. Working on uppers tomorrow.',
        sender: teamMembers[1],
        timestamp: 'Yesterday 4:20 PM',
        type: 'text'
      },
      {
        id: '9',
        text: 'All cabinets installed! Customer loves them. Just need countertops and backsplash now.',
        sender: teamMembers[0],
        timestamp: 'Today 11:30 AM',
        type: 'text',
        attachments: [
          {
            id: '4',
            name: 'cabinets-installed.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800',
            size: '2.3 MB'
          }
        ],
        reactions: [
          { emoji: '🔥', count: 4, users: ['1', '2', '3', '4'] },
          { emoji: '👏', count: 2, users: ['2', '4'] }
        ]
      },
      {
        id: '10',
        text: 'Countertop template scheduled for tomorrow at 10am. Don\'t forget to bring the template kit!',
        sender: teamMembers[2],
        timestamp: 'Today 12:05 PM',
        type: 'text'
      }
    ],
    'dm-1': [ // DM with Sarah
      {
        id: '1',
        text: 'Hey! Can you review the proposal I sent?',
        sender: teamMembers[0],
        timestamp: '2:15 PM',
        type: 'text'
      },
      {
        id: '2',
        text: 'Sure! I\'ll take a look at it this afternoon.',
        sender: teamMembers[1],
        timestamp: '2:18 PM',
        type: 'text'
      }
    ]
  };

  const [messages, setMessages] = useState<{ [key: string]: TeamMessage[] }>({});

  // Initialize messages from mock data
  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  // Hide tab bar when in team chat thread
  useEffect(() => {
    if (selectedChannel || selectedDM) {
      setIsVisible(false);
      // Scroll to bottom when thread is opened
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } else {
      setIsVisible(true);
    }
    
    return () => setIsVisible(true);
  }, [selectedChannel, selectedDM]);

  const handleChannelPress = (channel: TeamChannel) => {
    setSelectedChannel(channel);
    setSelectedDM(null);
  };

  const handleDMPress = (dm: TeamDirectMessage) => {
    setSelectedDM(dm);
    setSelectedChannel(null);
  };

  const handleBackToList = () => {
    setSelectedChannel(null);
    setSelectedDM(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && (selectedChannel || selectedDM)) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const currentUser = teamMembers[0]; // Current user
      const threadId = selectedChannel ? selectedChannel.id : `dm-${selectedDM?.id}`;
      
      const newMsg: TeamMessage = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: currentUser,
        timestamp: timestamp,
        type: 'text'
      };

      setMessages(prevMessages => {
        const threadMessages = prevMessages[threadId] || [];
        return {
          ...prevMessages,
          [threadId]: [...threadMessages, newMsg]
        };
      });

      setNewMessage('');
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
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

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      console.log('Creating channel:', {
        type: createChannelType,
        name: newChannelName,
        description: newChannelDescription,
        isPrivate: isPrivateChannel,
        members: selectedMembers,
        job: selectedJob
      });
      
      // Reset form
      setNewChannelName('');
      setNewChannelDescription('');
      setIsPrivateChannel(false);
      setSelectedMembers([]);
      setMemberSearchQuery('');
      setCreateChannelType('job');
      setSelectedJob(null);
      setJobSearchQuery('');
      setShowCreateChannel(false);
    }
  };

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setNewChannelName(job.name.toLowerCase().replace(/\s+/g, '-'));
    setNewChannelDescription(`${job.name} - #${job.id}`);
    setJobSearchQuery('');
  };

  const filteredJobs = activeJobs.filter(job =>
    job.name.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.id.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.customer.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.address.toLowerCase().includes(jobSearchQuery.toLowerCase())
  );

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleOpenCompose = () => {
    setShowDMModal(false);
    setTimeout(() => {
      setShowComposeDM(true);
    }, 300);
  };

  const handleSendComposeDM = () => {
    if (composeDMRecipient && composeDMMessage.trim()) {
      console.log('Sending DM to:', composeDMRecipient, 'Message:', composeDMMessage);
      setComposeDMRecipient('');
      setComposeDMMessage('');
      setComposeDMSearchQuery('');
      setShowComposeDM(false);
    }
  };

  const handleAddMember = (memberId: string) => {
    if (!channelMembers.includes(memberId)) {
      setChannelMembers([...channelMembers, memberId]);
      setShowAddMember(false);
      setAddMemberSearchQuery('');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setChannelMembers(channelMembers.filter(id => id !== memberId));
  };

  const getEligibleMembers = () => {
    return teamMembers.filter(member => 
      !channelMembers.includes(member.id) &&
      (addMemberSearchQuery === '' || 
       member.name.toLowerCase().includes(addMemberSearchQuery.toLowerCase()) ||
       member.role.toLowerCase().includes(addMemberSearchQuery.toLowerCase()))
    );
  };

  const getCurrentMembers = () => {
    return teamMembers.filter(member => channelMembers.includes(member.id));
  };

  // Filter job channels
  const getFilteredJobChannels = () => {
    let filtered = channels.filter(c => c.channelType === 'job');
    
    // Apply status filter
    if (jobChannelFilter === 'unread') {
      filtered = filtered.filter(c => c.unreadCount > 0);
    } else if (jobChannelFilter === 'active') {
      // Show channels with recent activity (< 1 day)
      filtered = filtered.filter(c => 
        !c.lastMessageTime?.includes('d ago')
      );
    }
    
    // Limit display if not showing all
    if (!showAllJobChannels) {
      return filtered.slice(0, 5);
    }
    
    return filtered;
  };

  const filteredJobChannels = getFilteredJobChannels();
  const totalJobChannels = channels.filter(c => c.channelType === 'job').length;

  const currentMessages = (selectedChannel || selectedDM) ? 
    (messages[selectedChannel ? selectedChannel.id : `dm-${selectedDM?.id}`] || []) : [];

  const currentThread = selectedChannel || selectedDM;

  // Quick Actions handlers
  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleNewProposal = () => {
    setShowNewProposal(true);
  };

  const handleSendRequest = () => {
    setShowSendRequest(true);
  };

  const handleCreateLead = () => {
    setShowCreateLead(true);
  };

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {!currentThread ? (
        // Team Chat List View
        <>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
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
              
              <Text style={styles.headerTitle}>Team Chat</Text>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => setShowDMModal(true)}
                >
                  <MessageCircle size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => setShowSearchModal(true)}
                >
                  <Search size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                  <Settings size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Channel View Toggle */}
          <View style={styles.channelViewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                channelView === 'job' && styles.toggleButtonActive
              ]}
              onPress={() => setChannelView('job')}
            >
              <Text style={[
                styles.toggleButtonText,
                channelView === 'job' && styles.toggleButtonTextActive
              ]}>
                Job Channels
              </Text>
              <View style={[
                styles.toggleBadge,
                channelView === 'job' && styles.toggleBadgeActive
              ]}>
                <Text style={[
                  styles.toggleBadgeText,
                  channelView === 'job' && styles.toggleBadgeTextActive
                ]}>
                  {totalJobChannels}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                channelView === 'team' && styles.toggleButtonActive
              ]}
              onPress={() => setChannelView('team')}
            >
              <Text style={[
                styles.toggleButtonText,
                channelView === 'team' && styles.toggleButtonTextActive
              ]}>
                Team Channels
              </Text>
              <View style={[
                styles.toggleBadge,
                channelView === 'team' && styles.toggleBadgeActive
              ]}>
                <Text style={[
                  styles.toggleBadgeText,
                  channelView === 'team' && styles.toggleBadgeTextActive
                ]}>
                  {channels.filter(c => c.channelType === 'team').length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            onScroll={(e) => {
              const currentScrollY = e.nativeEvent.contentOffset.y;
              setShowFAB(currentScrollY <= lastScrollY || currentScrollY < 10);
              setLastScrollY(currentScrollY);
            }}
            scrollEventThrottle={16}
          >
            {/* Job Channels Section */}
            {channelView === 'job' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>JOB CHANNELS</Text>
                  <View style={styles.jobChannelBadge}>
                    <Text style={styles.jobChannelBadgeText}>
                      {totalJobChannels}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowCreateChannel(true)}
                >
                  <Plus size={16} color="#6366F1" />
                </TouchableOpacity>
              </View>

              {/* Filter Tabs */}
              <View style={styles.jobFilterTabs}>
                <TouchableOpacity
                  style={[
                    styles.jobFilterTab,
                    jobChannelFilter === 'active' && styles.jobFilterTabActive
                  ]}
                  onPress={() => setJobChannelFilter('active')}
                >
                  <Text style={[
                    styles.jobFilterTabText,
                    jobChannelFilter === 'active' && styles.jobFilterTabTextActive
                  ]}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.jobFilterTab,
                    jobChannelFilter === 'unread' && styles.jobFilterTabActive
                  ]}
                  onPress={() => setJobChannelFilter('unread')}
                >
                  <Text style={[
                    styles.jobFilterTabText,
                    jobChannelFilter === 'unread' && styles.jobFilterTabTextActive
                  ]}>
                    Unread
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.jobFilterTab,
                    jobChannelFilter === 'all' && styles.jobFilterTabActive
                  ]}
                  onPress={() => setJobChannelFilter('all')}
                >
                  <Text style={[
                    styles.jobFilterTabText,
                    jobChannelFilter === 'all' && styles.jobFilterTabTextActive
                  ]}>
                    All Jobs
                  </Text>
                </TouchableOpacity>
              </View>
              
              {filteredJobChannels.map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  style={styles.channelItem}
                  onPress={() => handleChannelPress(channel)}
                >
                  <View style={styles.jobChannelIcon}>
                    <Hash size={16} color="#FFFFFF" />
                  </View>
                  
                  <View style={styles.channelInfo}>
                    <View style={styles.channelHeader}>
                      <Text style={styles.channelName}>#{channel.name}</Text>
                      {channel.jobNumber && (
                        <View style={styles.jobNumberBadge}>
                          <Text style={styles.jobNumberText}>{channel.jobNumber}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.channelDescription}>{channel.description}</Text>
                    {channel.jobAddress && (
                      <Text style={styles.jobAddress}>📍 {channel.jobAddress}</Text>
                    )}
                    <Text style={styles.channelMeta}>
                      {channel.memberCount} members • {channel.lastMessageTime}
                    </Text>
                  </View>
                  
                  {channel.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{channel.unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {/* Show More/Less Button */}
              {totalJobChannels > 5 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllJobChannels(!showAllJobChannels)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllJobChannels 
                      ? 'Show Less' 
                      : `Show ${totalJobChannels - 5} More Jobs`}
                  </Text>
                  <ChevronDown 
                    size={16} 
                    color="#6366F1" 
                    style={showAllJobChannels ? styles.chevronUp : {}}
                  />
                </TouchableOpacity>
              )}
            </View>
            )}

            {/* Team Channels Section */}
            {channelView === 'team' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>TEAM CHANNELS</Text>
                  <View style={styles.teamChannelBadge}>
                    <Text style={styles.teamChannelBadgeText}>
                      {channels.filter(c => c.channelType === 'team').length}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowCreateChannel(true)}
                >
                  <Plus size={16} color="#6366F1" />
                </TouchableOpacity>
              </View>
              
              {channels.filter(channel => channel.channelType === 'team').map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  style={styles.channelItem}
                  onPress={() => handleChannelPress(channel)}
                >
                  <View style={styles.channelIcon}>
                    {channel.type === 'private' ? (
                      <Lock size={16} color="#6B7280" />
                    ) : (
                      <Hash size={16} color="#6B7280" />
                    )}
                  </View>
                  
                  <View style={styles.channelInfo}>
                    <View style={styles.channelHeader}>
                      <Text style={styles.channelName}>#{channel.name}</Text>
                      {channel.isStarred && (
                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      )}
                      {channel.isMuted && (
                        <BellOff size={14} color="#6B7280" />
                      )}
                    </View>
                    <Text style={styles.channelDescription}>{channel.description}</Text>
                    <Text style={styles.channelMeta}>
                      {channel.memberCount} members • {channel.lastMessageTime}
                    </Text>
                  </View>
                  
                  {channel.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{channel.unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            )}
          </ScrollView>

          <FloatingActionMenu
            onNewAppointment={handleNewAppointment}
            onNewProposal={handleNewProposal}
            onSendRequest={handleSendRequest}
            onNewLead={handleCreateLead}
            onNewJob={handleCreateJob}
            isVisible={showFAB}
          />

          {/* Quick Actions Modals */}
          <NewAppointmentModal 
            visible={showNewAppointment}
            onClose={() => setShowNewAppointment(false)}
          />

          <NewProposalModal 
            visible={showNewProposal}
            onClose={() => setShowNewProposal(false)}
          />

          <SendRequestModal 
            visible={showSendRequest}
            onClose={() => setShowSendRequest(false)}
          />

          <CreateLeadModal 
            visible={showCreateLead}
            onClose={() => setShowCreateLead(false)}
          />

          <CreateJobModal 
            visible={showCreateJob}
            onClose={() => setShowCreateJob(false)}
          />

          {/* Search Modal */}
          <Modal
            visible={showSearchModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSearchModal(false)}
          >
            <View style={styles.searchModalOverlay}>
              <TouchableOpacity 
                style={styles.searchModalBackdrop}
                activeOpacity={1}
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchModalQuery('');
                }}
              />
              <View style={styles.searchModalContainer}>
                <View style={styles.searchModalHandle} />
                
                <View style={styles.searchModalHeader}>
                  <Text style={styles.searchModalTitle}>Search Channels</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowSearchModal(false);
                      setSearchModalQuery('');
                    }}
                    style={styles.searchModalCloseButton}
                  >
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.searchModalInputContainer}>
                  <Search size={20} color="#6B7280" />
                  <TextInput
                    style={styles.searchModalInput}
                    placeholder="Search in team and job channels..."
                    value={searchModalQuery}
                    onChangeText={setSearchModalQuery}
                    autoFocus={true}
                    placeholderTextColor="#9CA3AF"
                  />
                  {searchModalQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchModalQuery('')}>
                      <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView style={styles.searchModalResults}>
                  {searchModalQuery.length === 0 ? (
                    <View style={styles.searchModalEmptyState}>
                      <Search size={48} color="#D1D5DB" />
                      <Text style={styles.searchModalEmptyTitle}>Search channels</Text>
                      <Text style={styles.searchModalEmptyText}>
                        Find team channels, job channels, and conversations
                      </Text>
                    </View>
                  ) : (
                    <>
                      {(() => {
                        const query = searchModalQuery.toLowerCase();
                        const results = channels.filter(channel =>
                          channel.name.toLowerCase().includes(query) ||
                          channel.description?.toLowerCase().includes(query) ||
                          channel.jobNumber?.toLowerCase().includes(query) ||
                          channel.jobAddress?.toLowerCase().includes(query)
                        );

                        if (results.length === 0) {
                          return (
                            <View style={styles.searchModalEmptyState}>
                              <Search size={48} color="#D1D5DB" />
                              <Text style={styles.searchModalEmptyTitle}>No results found</Text>
                              <Text style={styles.searchModalEmptyText}>
                                Try searching with different keywords
                              </Text>
                            </View>
                          );
                        }

                        return (
                          <>
                            <Text style={styles.searchModalResultsCount}>
                              {results.length} {results.length === 1 ? 'result' : 'results'} found
                            </Text>
                            {results.map((channel) => (
                              <TouchableOpacity
                                key={channel.id}
                                style={styles.searchModalResultItem}
                                onPress={() => {
                                  setSelectedChannel(channel);
                                  setSelectedDM(null);
                                  setShowSearchModal(false);
                                  setSearchModalQuery('');
                                }}
                              >
                                <View style={styles.searchModalResultIcon}>
                                  {channel.type === 'private' ? (
                                    <Lock size={18} color="#6B7280" />
                                  ) : channel.channelType === 'job' ? (
                                    <Briefcase size={18} color="#6366F1" />
                                  ) : (
                                    <Hash size={18} color="#6B7280" />
                                  )}
                                </View>
                                <View style={styles.searchModalResultContent}>
                                  <Text style={styles.searchModalResultName}>{channel.name}</Text>
                                  {channel.description && (
                                    <Text style={styles.searchModalResultDescription} numberOfLines={1}>
                                      {channel.description}
                                    </Text>
                                  )}
                                  {channel.channelType === 'job' && channel.jobAddress && (
                                    <Text style={styles.searchModalResultJob}>
                                      {channel.jobNumber && `#${channel.jobNumber} • `}{channel.jobAddress}
                                    </Text>
                                  )}
                                </View>
                                {channel.unreadCount > 0 && (
                                  <View style={styles.searchModalResultBadge}>
                                    <Text style={styles.searchModalResultBadgeText}>
                                      {channel.unreadCount}
                                    </Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            ))}
                          </>
                        );
                      })()}
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Create Channel Modal */}
          <Modal
            visible={showCreateChannel}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowCreateChannel(false)}
          >
            <View style={styles.createChannelOverlay}>
              <TouchableOpacity 
                style={styles.createChannelBackdrop}
                activeOpacity={1}
                onPress={() => setShowCreateChannel(false)}
              />
              <View style={styles.createChannelModal}>
                <View style={styles.createChannelHeader}>
                  <Text style={styles.createChannelTitle}>Create Channel</Text>
                  <TouchableOpacity 
                    onPress={() => setShowCreateChannel(false)}
                    style={styles.closeCreateChannelButton}
                  >
                    <X size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.createChannelContent}>
                  {/* Channel Category Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>What type of channel?</Text>
                    <View style={styles.channelCategoryContainer}>
                      <TouchableOpacity
                        style={[
                          styles.channelCategoryOption,
                          createChannelType === 'job' && styles.channelCategorySelected
                        ]}
                        onPress={() => {
                          setCreateChannelType('job');
                          setSelectedJob(null);
                          setNewChannelName('');
                          setNewChannelDescription('');
                        }}
                      >
                        <View style={[
                          styles.channelCategoryIcon,
                          createChannelType === 'job' && styles.channelCategoryIconSelected
                        ]}>
                          <Hash size={20} color={createChannelType === 'job' ? "#FFFFFF" : "#6366F1"} />
                        </View>
                        <Text style={[
                          styles.channelCategoryText,
                          createChannelType === 'job' && styles.channelCategoryTextSelected
                        ]}>
                          Job Channel
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.channelCategoryOption,
                          createChannelType === 'team' && styles.channelCategorySelected
                        ]}
                        onPress={() => {
                          setCreateChannelType('team');
                          setSelectedJob(null);
                          setNewChannelName('');
                          setNewChannelDescription('');
                        }}
                      >
                        <View style={[
                          styles.channelCategoryIcon,
                          createChannelType === 'team' && styles.channelCategoryIconSelected
                        ]}>
                          <Users size={20} color={createChannelType === 'team' ? "#FFFFFF" : "#10B981"} />
                        </View>
                        <Text style={[
                          styles.channelCategoryText,
                          createChannelType === 'team' && styles.channelCategoryTextSelected
                        ]}>
                          Team Channel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Job Search (only for job channels) */}
                  {createChannelType === 'job' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Select Active Job</Text>
                      {!selectedJob ? (
                        <>
                          <View style={styles.jobSearchInputContainer}>
                            <Search size={16} color="#9CA3AF" />
                            <TextInput
                              style={styles.jobSearchInput}
                              placeholder="Search for an active job..."
                              value={jobSearchQuery}
                              onChangeText={setJobSearchQuery}
                              placeholderTextColor="#9CA3AF"
                            />
                          </View>
                          
                          {jobSearchQuery && (
                            <View style={styles.jobResultsContainer}>
                              {filteredJobs.map((job) => (
                                <TouchableOpacity
                                  key={job.id}
                                  style={styles.jobResultItem}
                                  onPress={() => handleSelectJob(job)}
                                >
                                  <View style={styles.jobResultIcon}>
                                    <Hash size={16} color="#6366F1" />
                                  </View>
                                  <View style={styles.jobResultInfo}>
                                    <Text style={styles.jobResultName}>{job.name}</Text>
                                    <Text style={styles.jobResultMeta}>
                                      #{job.id} • {job.customer} • {job.address}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              ))}
                              {filteredJobs.length === 0 && (
                                <Text style={styles.noJobResults}>No jobs found</Text>
                              )}
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.selectedJobContainer}>
                          <View style={styles.selectedJobCard}>
                            <View style={styles.selectedJobIcon}>
                              <Hash size={16} color="#FFFFFF" />
                            </View>
                            <View style={styles.selectedJobInfo}>
                              <Text style={styles.selectedJobName}>{selectedJob.name}</Text>
                              <Text style={styles.selectedJobMeta}>
                                #{selectedJob.id} • {selectedJob.customer}
                              </Text>
                            </View>
                            <TouchableOpacity 
                              onPress={() => {
                                setSelectedJob(null);
                                setNewChannelName('');
                                setNewChannelDescription('');
                              }}
                              style={styles.removeJobButton}
                            >
                              <X size={18} color="#6B7280" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Channel Name (only for team channels or after job selected) */}
                  {(createChannelType === 'team' || selectedJob) && (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Channel Name</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={createChannelType === 'job' ? "Auto-generated from job" : "e.g. marketing, development"}
                          value={newChannelName}
                          onChangeText={setNewChannelName}
                          placeholderTextColor="#9CA3AF"
                          editable={createChannelType === 'team'}
                        />
                      </View>

                      {/* Channel Description */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Description (optional)</Text>
                        <TextInput
                          style={[styles.textInput, styles.textArea]}
                          placeholder="What's this channel about?"
                          value={newChannelDescription}
                          onChangeText={setNewChannelDescription}
                          multiline
                          numberOfLines={3}
                          placeholderTextColor="#9CA3AF"
                          editable={createChannelType === 'team'}
                        />
                      </View>
                    </>
                  )}

                  {/* Channel Type (Public/Private) */}
                  {(createChannelType === 'team' || selectedJob) && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Channel Type</Text>
                    <View style={styles.channelTypeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.channelTypeOption,
                          !isPrivateChannel && styles.channelTypeSelected
                        ]}
                        onPress={() => setIsPrivateChannel(false)}
                      >
                        <View style={styles.channelTypeIcon}>
                          <Hash size={20} color={!isPrivateChannel ? "#6366F1" : "#6B7280"} />
                        </View>
                        <View style={styles.channelTypeContent}>
                          <Text style={[
                            styles.channelTypeTitle,
                            !isPrivateChannel && styles.channelTypeTitleSelected
                          ]}>
                            Public
                          </Text>
                          <Text style={styles.channelTypeDescription}>
                            Anyone in the workspace can join
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.channelTypeOption,
                          isPrivateChannel && styles.channelTypeSelected
                        ]}
                        onPress={() => setIsPrivateChannel(true)}
                      >
                        <View style={styles.channelTypeIcon}>
                          <Lock size={20} color={isPrivateChannel ? "#6366F1" : "#6B7280"} />
                        </View>
                        <View style={styles.channelTypeContent}>
                          <Text style={[
                            styles.channelTypeTitle,
                            isPrivateChannel && styles.channelTypeTitleSelected
                          ]}>
                            Private
                          </Text>
                          <Text style={styles.channelTypeDescription}>
                            Only invited members can join
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  )}

                  {/* Member Selection (for private channels) */}
                  {(createChannelType === 'team' || selectedJob) && isPrivateChannel && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Invite Members</Text>
                      <Text style={styles.inputSubtext}>
                        Select team members to invite to this private channel
                      </Text>
                      
                      {/* Member Search Bar */}
                      <View style={styles.memberSearchContainer}>
                        <Search size={16} color="#9CA3AF" />
                        <TextInput
                          style={styles.memberSearchInput}
                          placeholder="Search team members..."
                          value={memberSearchQuery}
                          onChangeText={setMemberSearchQuery}
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                      
                      <View style={styles.memberList}>
                        {teamMembers
                          .filter(member => 
                            member.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
                          )
                          .map((member) => (
                            <TouchableOpacity
                              key={member.id}
                              style={[
                                styles.memberOption,
                                selectedMembers.includes(member.id) && styles.memberOptionSelected
                              ]}
                              onPress={() => handleToggleMember(member.id)}
                            >
                              <View style={styles.memberAvatar}>
                                <Text style={styles.memberAvatarText}>{member.initials}</Text>
                              </View>
                              <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberRole}>{member.role}</Text>
                              </View>
                              {selectedMembers.includes(member.id) && (
                                <View style={styles.memberCheck}>
                                  <Text style={styles.memberCheckText}>✓</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ))
                        }
                      </View>
                    </View>
                  )}
                  )}
                </ScrollView>

                <View style={styles.createChannelFooter}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowCreateChannel(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      (!newChannelName.trim() || (createChannelType === 'job' && !selectedJob)) && styles.createButtonDisabled
                    ]}
                    onPress={handleCreateChannel}
                    disabled={!newChannelName.trim() || (createChannelType === 'job' && !selectedJob)}
                  >
                    <Text style={styles.createButtonText}>Create Channel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Direct Messages Modal */}
          <Modal
            visible={showDMModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowDMModal(false)}
          >
            <SafeAreaView style={styles.dmModalFull}>
              <View style={styles.dmModalHeader}>
                <Text style={styles.dmModalTitle}>Direct Messages</Text>
                <View style={styles.dmModalHeaderActions}>
                  <TouchableOpacity 
                    style={styles.composeButton}
                    onPress={handleOpenCompose}
                  >
                    <Plus size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowDMModal(false)}
                    style={styles.closeDMModalButton}
                  >
                    <X size={24} color="#111827" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.dmModalContent}>
                  {directMessages.map((dm) => (
                    <TouchableOpacity
                      key={dm.id}
                      style={styles.dmModalItem}
                      onPress={() => {
                        setShowDMModal(false);
                        handleDMPress(dm);
                      }}
                    >
                      <View style={styles.dmAvatar}>
                        <Text style={styles.dmAvatarText}>{dm.member.initials}</Text>
                        {dm.isOnline && <View style={styles.onlineIndicator} />}
                      </View>
                      
                      <View style={styles.dmInfo}>
                        <View style={styles.dmHeader}>
                          <Text style={styles.dmName}>{dm.member.name}</Text>
                          <Text style={styles.dmTime}>{dm.lastMessageTime}</Text>
                        </View>
                        <Text style={styles.dmLastMessage} numberOfLines={1}>
                          {dm.lastMessage}
                        </Text>
                      </View>
                      
                      {dm.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{dm.unreadCount}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </SafeAreaView>
          </Modal>

          {/* Compose DM Modal */}
          <Modal
            visible={showComposeDM}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowComposeDM(false)}
          >
            <SafeAreaView style={styles.composeDMModal}>
              <View style={styles.composeDMHeader}>
                <Text style={styles.composeDMTitle}>New Message</Text>
                <TouchableOpacity 
                  onPress={() => setShowComposeDM(false)}
                  style={styles.closeComposeDMButton}
                >
                  <X size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={styles.composeDMContent}>
                {/* Recipient Search */}
                <View style={styles.composeDMInputGroup}>
                  <Text style={styles.composeDMLabel}>To:</Text>
                  <View style={styles.composeDMSearchContainer}>
                    <Search size={16} color="#9CA3AF" />
                    <TextInput
                      style={styles.composeDMSearchInput}
                      placeholder="Search team members..."
                      value={composeDMSearchQuery}
                      onChangeText={setComposeDMSearchQuery}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Selected Recipient */}
                {composeDMRecipient && (
                  <View style={styles.selectedRecipient}>
                    <View style={styles.selectedRecipientChip}>
                      <Text style={styles.selectedRecipientText}>{composeDMRecipient}</Text>
                      <TouchableOpacity onPress={() => setComposeDMRecipient('')}>
                        <X size={14} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Team Members List (when searching) */}
                {composeDMSearchQuery && !composeDMRecipient && (
                  <ScrollView style={styles.composeDMResults}>
                    {teamMembers
                      .filter(member => 
                        member.name.toLowerCase().includes(composeDMSearchQuery.toLowerCase())
                      )
                      .map((member) => (
                        <TouchableOpacity
                          key={member.id}
                          style={styles.composeDMResultItem}
                          onPress={() => {
                            setComposeDMRecipient(member.name);
                            setComposeDMSearchQuery('');
                          }}
                        >
                          <View style={styles.composeDMResultAvatar}>
                            <Text style={styles.composeDMResultAvatarText}>{member.initials}</Text>
                          </View>
                          <View style={styles.composeDMResultInfo}>
                            <Text style={styles.composeDMResultName}>{member.name}</Text>
                            <Text style={styles.composeDMResultRole}>{member.role}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    }
                  </ScrollView>
                )}

                {/* Message Input */}
                {composeDMRecipient && (
                  <View style={styles.composeDMMessageSection}>
                    <Text style={styles.composeDMLabel}>Message:</Text>
                    <TextInput
                      style={styles.composeDMMessageInput}
                      placeholder="Type your message..."
                      value={composeDMMessage}
                      onChangeText={setComposeDMMessage}
                      multiline
                      numberOfLines={8}
                      placeholderTextColor="#9CA3AF"
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </View>

              {/* Send Button */}
              {composeDMRecipient && (
                <View style={styles.composeDMFooter}>
                  <TouchableOpacity
                    style={styles.composeDMCancelButton}
                    onPress={() => setShowComposeDM(false)}
                  >
                    <Text style={styles.composeDMCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.composeDMSendButton,
                      !composeDMMessage.trim() && styles.composeDMSendButtonDisabled
                    ]}
                    onPress={handleSendComposeDM}
                    disabled={!composeDMMessage.trim()}
                  >
                    <Text style={styles.composeDMSendText}>Send</Text>
                  </TouchableOpacity>
                </View>
              )}
            </SafeAreaView>
          </Modal>
        </>
      ) : (
        // Individual Team Chat Thread
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chatHeader}
          >
            <View style={styles.chatHeaderContent}>
              <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.chatHeaderInfo}>
                {selectedChannel ? (
                  <>
                    <View style={styles.channelHeaderIcon}>
                      {selectedChannel.type === 'private' ? (
                        <Lock size={16} color="#FFFFFF" />
                      ) : (
                        <Hash size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.chatHeaderTextContainer}>
                      <Text style={styles.chatHeaderName}>#{selectedChannel.name}</Text>
                      <Text style={styles.chatHeaderSubtitle}>
                        {selectedChannel.memberCount} members
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.chatHeaderAvatar}>
                      <Text style={styles.chatHeaderAvatarText}>
                        {selectedDM?.member.initials}
                      </Text>
                      {selectedDM?.member.status === 'online' && <View style={styles.chatOnlineIndicator} />}
                    </View>
                    <View style={styles.chatHeaderTextContainer}>
                      <Text style={styles.chatHeaderName}>{selectedDM?.member.name}</Text>
                      <Text style={styles.chatHeaderSubtitle}>
                        {selectedDM?.member.status === 'online' ? 'Online' : 
                         selectedDM?.member.status === 'away' ? 'Away' :
                         selectedDM?.member.status === 'busy' ? 'Busy' : 'Offline'}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.chatHeaderActions}>
                {selectedChannel?.channelType === 'job' ? (
                  <>
                    <TouchableOpacity 
                      style={styles.chatHeaderButton}
                      onPress={() => setShowDealInfo(true)}
                    >
                      <Briefcase size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.chatHeaderButton}
                      onPress={() => setShowChannelSettings(true)}
                    >
                      <MoreHorizontal size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.chatHeaderButton}
                      onPress={() => setShowChannelSettings(true)}
                    >
                      <MoreHorizontal size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
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
              <View key={message.id} style={styles.messageContainer}>
                <View style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarText}>{message.sender.initials}</Text>
                  {message.sender.status === 'online' && <View style={styles.messageOnlineIndicator} />}
                </View>
                
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>{message.sender.name}</Text>
                    <Text style={styles.messageTime}>{message.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.messageText}>{message.text}</Text>
                  
                  {message.attachments && (
                    <View style={styles.attachmentsContainer}>
                      {message.attachments.map((attachment) => (
                        <TouchableOpacity key={attachment.id} style={styles.attachmentItem}>
                          <Paperclip size={16} color="#6366F1" />
                          <Text style={styles.attachmentName}>{attachment.name}</Text>
                          <Text style={styles.attachmentSize}>{attachment.size}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {message.reactions && (
                    <View style={styles.reactionsContainer}>
                      {message.reactions.map((reaction, index) => (
                        <TouchableOpacity key={index} style={styles.reactionItem}>
                          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                          <Text style={styles.reactionCount}>{reaction.count}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {message.thread && (
                    <TouchableOpacity style={styles.threadButton}>
                      <MessageCircle size={14} color="#6366F1" />
                      <Text style={styles.threadText}>
                        {message.thread.count} replies
                      </Text>
                    </TouchableOpacity>
                  )}
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
              <TouchableOpacity style={styles.inputIconButton}>
                <Plus size={22} color="#6B7280" />
              </TouchableOpacity>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder={`Message ${selectedChannel ? `#${selectedChannel.name}` : selectedDM?.member.name}`}
                  value={newMessage}
                  onChangeText={handleTextChange}
                  multiline
                  placeholderTextColor="#9CA3AF"
                />
                
                {/* User Mention Dropdown */}
                {showUserMention && (
                  <View style={styles.mentionDropdown}>
                    {teamMembers
                      .filter(member => 
                        member.name.toLowerCase().includes(mentionQuery.toLowerCase())
                      )
                      .map((member) => (
                        <TouchableOpacity
                          key={member.id}
                          style={styles.mentionOption}
                          onPress={() => handleUserMention(member.name)}
                        >
                          <View style={styles.mentionAvatar}>
                            <Text style={styles.mentionAvatarText}>{member.initials}</Text>
                          </View>
                          <Text style={styles.mentionName}>{member.name}</Text>
                          <Text style={styles.mentionStatus}>{member.status}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.inputIconButton}>
                <Paperclip size={22} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.inputIconButton}>
                <Smile size={22} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !newMessage.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* Channel Settings Modal */}
      <Modal
        visible={showChannelSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChannelSettings(false)}
      >
        <View style={styles.channelSettingsOverlay}>
          <TouchableOpacity 
            style={styles.channelSettingsBackdrop}
            activeOpacity={1}
            onPress={() => setShowChannelSettings(false)}
          />
          <View style={styles.channelSettingsModal}>
            <View style={styles.channelSettingsHeader}>
              <View style={styles.channelSettingsHandle} />
            </View>

            <View style={styles.channelSettingsContent}>
              <TouchableOpacity 
                style={styles.channelSettingsOption}
                onPress={() => {
                  setShowChannelSettings(false);
                  setTimeout(() => setShowEditMembers(true), 300);
                }}
              >
                <Users size={22} color="#111827" />
                <Text style={styles.channelSettingsOptionText}>Edit Members</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.channelSettingsOption}
                onPress={() => {
                  setShowChannelSettings(false);
                  console.log('Archive channel');
                }}
              >
                <FileText size={22} color="#F59E0B" />
                <Text style={styles.channelSettingsOptionText}>Archive</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.channelSettingsOption, styles.channelSettingsOptionDanger]}
                onPress={() => {
                  setShowChannelSettings(false);
                  console.log('Delete channel');
                }}
              >
                <X size={22} color="#EF4444" />
                <Text style={styles.channelSettingsOptionTextDanger}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Members Modal */}
      <Modal
        visible={showEditMembers}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditMembers(false)}
      >
        <SafeAreaView style={styles.editMembersModal}>
          <View style={styles.editMembersHeader}>
            <Text style={styles.editMembersTitle}>Edit Members</Text>
            <TouchableOpacity 
              onPress={() => setShowEditMembers(false)}
              style={styles.closeEditMembersButton}
            >
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editMembersContent}>
            <Text style={styles.editMembersSubtitle}>Current Members</Text>
            
            {getCurrentMembers().map((member) => (
              <View key={member.id} style={styles.editMemberRow}>
                <View style={styles.editMemberAvatar}>
                  <Text style={styles.editMemberAvatarText}>{member.initials}</Text>
                </View>
                <View style={styles.editMemberInfo}>
                  <Text style={styles.editMemberName}>{member.name}</Text>
                  <Text style={styles.editMemberRole}>{member.role === 'admin' ? 'Admin' : 'Member'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeMemberButtonLarge}
                  onPress={() => handleRemoveMember(member.id)}
                >
                  <Text style={styles.removeMemberButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addMemberButtonLarge}
              onPress={() => setShowAddMember(true)}
            >
              <Plus size={20} color="#6366F1" />
              <Text style={styles.addMemberButtonText}>Add Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMember}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddMember(false)}
      >
        <SafeAreaView style={styles.addMemberModal}>
          <View style={styles.addMemberHeader}>
            <Text style={styles.addMemberTitle}>Add Member</Text>
            <TouchableOpacity 
              onPress={() => {
                setShowAddMember(false);
                setAddMemberSearchQuery('');
              }}
              style={styles.closeAddMemberButton}
            >
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.addMemberSearchContainer}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.addMemberSearchInput}
              placeholder="Search team members..."
              value={addMemberSearchQuery}
              onChangeText={setAddMemberSearchQuery}
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            {addMemberSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setAddMemberSearchQuery('')}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.addMemberContent}>
            {getEligibleMembers().length > 0 ? (
              <>
                <Text style={styles.addMemberSubtitle}>
                  Available Team Members ({getEligibleMembers().length})
                </Text>
                
                {getEligibleMembers().map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.addMemberRow}
                    onPress={() => handleAddMember(member.id)}
                  >
                    <View style={styles.addMemberAvatar}>
                      <Text style={styles.addMemberAvatarText}>{member.initials}</Text>
                    </View>
                    <View style={styles.addMemberInfo}>
                      <Text style={styles.addMemberName}>{member.name}</Text>
                      <Text style={styles.addMemberRole}>{member.role === 'admin' ? 'Admin' : 'Member'}</Text>
                    </View>
                    <View style={styles.addButtonSmall}>
                      <Plus size={18} color="#6366F1" />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {addMemberSearchQuery ? 'No members found' : 'All team members are already in this channel'}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Deal Info Modal */}
      <Modal
        visible={showDealInfo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDealInfo(false)}
      >
        <SafeAreaView style={styles.dealInfoModal}>
          <View style={styles.dealInfoHeader}>
            <Text style={styles.dealInfoTitle}>Job Details</Text>
            <TouchableOpacity 
              onPress={() => setShowDealInfo(false)}
              style={styles.closeDealInfoButton}
            >
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.dealInfoContent}>
            {/* Customer Information */}
            <View style={styles.dealInfoCard}>
              <Text style={styles.dealInfoSectionTitle}>Customer Information</Text>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Name</Text>
                <Text style={styles.dealInfoValue}>David Johnson</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.dealInfoAddress}>123 Oak Street, Suite 100</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Phone size={14} color="#6B7280" />
                <Text style={styles.dealInfoContact}>(555) 123-4567</Text>
              </View>
            </View>

            {/* Quick Actions - Contact */}
            <View style={styles.quickActionsSection}>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={[styles.quickActionButton, styles.callButton]}>
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.quickActionButton, styles.textButton]}>
                  <MessageCircle size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Text</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.quickActionButton, styles.emailButton]}>
                  <Send size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Job Information */}
            <View style={styles.dealInfoCard}>
              <Text style={styles.dealInfoSectionTitle}>Job Information</Text>
              
              {/* View Work Order Button */}
              <TouchableOpacity style={styles.workOrderButton}>
                <FileText size={18} color="#6366F1" />
                <Text style={styles.workOrderButtonText}>View Work Order</Text>
              </TouchableOpacity>

              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Job Start Date</Text>
                <Text style={styles.dealInfoValue}>Oct 15, 2024</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Job End Date</Text>
                <Text style={styles.dealInfoValue}>Nov 5, 2024</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Salesperson</Text>
                <Text style={styles.dealInfoValue}>Sarah Martinez</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Project Manager</Text>
                <Text style={styles.dealInfoValue}>Mike Chen</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Crew Leader</Text>
                <Text style={styles.dealInfoValue}>John Davis</Text>
              </View>
            </View>

            {/* Deal Information */}
            <View style={styles.dealInfoCard}>
              <Text style={styles.dealInfoSectionTitle}>Deal Information</Text>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Pipeline</Text>
                <Text style={styles.dealInfoValue}>Jobs</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Stage</Text>
                <Text style={styles.dealInfoValue}>In Progress</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>In Stage</Text>
                <Text style={styles.dealInfoValue}>2 days</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Job Source</Text>
                <Text style={styles.dealInfoValue}>Facebook May 2025</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Last Activity</Text>
                <Text style={styles.dealInfoValue}>Email sent 2 hours ago</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Drip Campaign</Text>
                <View style={styles.dripBadge}>
                  <Text style={styles.dripBadgeText}>⚡ 5 remaining</Text>
                </View>
              </View>

              {/* Command Center Button */}
              <TouchableOpacity style={styles.commandCenterButtonInline}>
                <Text style={styles.commandCenterButtonTextInline}>⚡ View Deal Command Center</Text>
              </TouchableOpacity>
            </View>

            {/* Financial Details */}
            <View style={styles.dealInfoCard}>
              <Text style={styles.dealInfoSectionTitle}>Financial Details</Text>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Contract Value</Text>
                <Text style={styles.dealInfoValueHighlight}>$24,500</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Paid to Date</Text>
                <Text style={styles.dealInfoValue}>$12,250</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Balance Due</Text>
                <Text style={styles.dealInfoValue}>$12,250</Text>
              </View>
              <View style={styles.dealInfoRow}>
                <Text style={styles.dealInfoLabel}>Change Order Value</Text>
                <Text style={styles.dealInfoValue}>+$450</Text>
              </View>

              {/* Financial Action Buttons */}
              <View style={styles.financialActionsRow}>
                <TouchableOpacity style={styles.financialActionButton}>
                  <DollarSign size={18} color="#6366F1" />
                  <Text style={styles.financialActionText}>View Invoice</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.financialActionButton}>
                  <FileText size={18} color="#6366F1" />
                  <Text style={styles.financialActionText}>View Proposal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Team Members */}
            <View style={styles.dealInfoCard}>
              <View style={styles.teamMembersHeader}>
                <Text style={styles.dealInfoSectionTitle}>Team Members</Text>
                <TouchableOpacity style={styles.addMemberButton}>
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addMemberText}>Add</Text>
                </TouchableOpacity>
              </View>
              
              {teamMembers.slice(0, 3).map((member) => (
                <View key={member.id} style={styles.teamMemberRow}>
                  <View style={styles.teamMemberAvatar}>
                    <Text style={styles.teamMemberAvatarText}>{member.initials}</Text>
                  </View>
                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>{member.name}</Text>
                    <Text style={styles.teamMemberRole}>{member.role === 'admin' ? 'Project Lead' : 'Crew Member'}</Text>
                  </View>
                  <TouchableOpacity style={styles.removeMemberButton}>
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  channelViewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#111827',
  },
  toggleBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 24,
    alignItems: 'center',
  },
  toggleBadgeActive: {
    backgroundColor: '#6366F1',
  },
  toggleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  toggleBadgeTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobChannelBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  jobChannelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teamChannelBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  teamChannelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  jobChannelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  jobNumberBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  jobNumberText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  jobAddress: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  jobSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  jobSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  jobFilterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  jobFilterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  jobFilterTabActive: {
    backgroundColor: '#6366F1',
  },
  jobFilterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  jobFilterTabTextActive: {
    color: '#FFFFFF',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 6,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  channelDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  channelMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dmAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  dmAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dmInfo: {
    flex: 1,
  },
  dmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dmName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dmTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dmLastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  chatHeaderTextContainer: {
    flex: 1,
  },
  channelHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  chatHeaderAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#111827',
    marginBottom: 8,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  threadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  threadText: {
    fontSize: 12,
    color: '#6366F1',
    marginLeft: 4,
  },
  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  inputIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  messageInput: {
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
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
    flex: 1,
  },
  mentionStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Create Channel Modal Styles
  createChannelOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  createChannelBackdrop: {
    flex: 1,
  },
  createChannelModal: {
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  createChannelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  createChannelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  channelCategoryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  channelCategoryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  channelCategorySelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  channelCategoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelCategoryIconSelected: {
    backgroundColor: '#6366F1',
  },
  channelCategoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  channelCategoryTextSelected: {
    color: '#6366F1',
  },
  jobSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  jobSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  jobResultsContainer: {
    marginTop: 8,
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  jobResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobResultInfo: {
    flex: 1,
  },
  jobResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  jobResultMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  noJobResults: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedJobContainer: {
    marginTop: 8,
  },
  selectedJobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  selectedJobIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedJobInfo: {
    flex: 1,
  },
  selectedJobName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  selectedJobMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  removeJobButton: {
    padding: 4,
  },
  closeCreateChannelButton: {
    padding: 8,
  },
  createChannelContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  channelTypeContainer: {
    gap: 12,
  },
  channelTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  channelTypeSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  channelTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  channelTypeContent: {
    flex: 1,
  },
  channelTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  channelTypeTitleSelected: {
    color: '#6366F1',
  },
  channelTypeDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  memberSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  memberList: {
    gap: 8,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  memberOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  memberCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCheckText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  createChannelFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // DM Modal Styles
  dmModalFull: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dmModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dmModalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  composeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDMModalButton: {
    padding: 8,
  },
  dmModalContent: {
    flex: 1,
    padding: 20,
  },
  dmModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Compose DM Modal Styles
  composeDMModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  composeDMHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  composeDMTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeComposeDMButton: {
    padding: 8,
  },
  composeDMContent: {
    flex: 1,
    padding: 20,
  },
  composeDMInputGroup: {
    marginBottom: 16,
  },
  composeDMLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  composeDMSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  composeDMSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  selectedRecipient: {
    marginBottom: 16,
  },
  selectedRecipientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  selectedRecipientText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  composeDMResults: {
    maxHeight: 300,
    marginBottom: 16,
  },
  composeDMResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  composeDMResultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  composeDMResultAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  composeDMResultInfo: {
    flex: 1,
  },
  composeDMResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  composeDMResultRole: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  composeDMMessageSection: {
    flex: 1,
  },
  composeDMMessageInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    height: 200,
    textAlignVertical: 'top',
  },
  composeDMFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  composeDMCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeDMCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  composeDMSendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeDMSendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  composeDMSendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Deal Info Modal Styles
  dealInfoModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dealInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dealInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeDealInfoButton: {
    padding: 8,
  },
  dealInfoContent: {
    flex: 1,
    padding: 20,
  },
  dealInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dealInfoSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  dealInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 8,
  },
  dealInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  dealInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
  },
  dealInfoValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
    textAlign: 'right',
  },
  dealInfoAddress: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    marginLeft: 4,
  },
  dealInfoContact: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    marginLeft: 4,
  },
  dealStatusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dealStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  teamMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamMemberAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  teamMemberRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callButton: {
    backgroundColor: '#10B981',
  },
  textButton: {
    backgroundColor: '#3B82F6',
  },
  emailButton: {
    backgroundColor: '#8B5CF6',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dealInfoSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  labelsSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  hotLeadBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hotLeadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  urgentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  dripBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dripBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  workOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  workOrderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  commandCenterButtonInline: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  commandCenterButtonTextInline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  financialActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  financialActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  financialActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  teamMembersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  addMemberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  removeMemberButton: {
    padding: 4,
  },
  // Channel Settings Modal Styles
  channelSettingsOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  channelSettingsBackdrop: {
    flex: 1,
  },
  channelSettingsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  channelSettingsHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  channelSettingsHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  channelSettingsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  channelSettingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  channelSettingsOptionDanger: {
    borderBottomWidth: 0,
  },
  channelSettingsOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  channelSettingsOptionTextDanger: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  // Edit Members Modal Styles
  editMembersModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editMembersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editMembersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeEditMembersButton: {
    padding: 8,
  },
  editMembersContent: {
    flex: 1,
    padding: 20,
  },
  editMembersSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  editMemberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editMemberAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editMemberInfo: {
    flex: 1,
  },
  editMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  editMemberRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  removeMemberButtonLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  removeMemberButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  addMemberButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  addMemberButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Add Member Modal Styles
  addMemberModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addMemberTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeAddMemberButton: {
    padding: 8,
  },
  addMemberSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  addMemberSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  addMemberContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addMemberSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addMemberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemberAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addMemberInfo: {
    flex: 1,
  },
  addMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  addMemberRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  addButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchModalBackdrop: {
    flex: 1,
  },
  searchModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    height: '95%',
  },
  searchModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  searchModalCloseButton: {
    padding: 4,
  },
  searchModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchModalResults: {
    flex: 1,
  },
  searchModalResultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchModalResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchModalResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchModalResultContent: {
    flex: 1,
  },
  searchModalResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  searchModalResultDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  searchModalResultJob: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  searchModalResultBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  searchModalResultBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchModalEmptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  searchModalEmptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  searchModalEmptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
