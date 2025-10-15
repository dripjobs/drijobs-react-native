import { AddAreaWizard } from '@/components/AddAreaWizard';
import DealCommandCenter from '@/components/DealCommandCenter';
import { getSchedulingPresets } from '@/utils/schedulingPresets';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertCircle,
    Building2,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    CreditCard,
    DollarSign,
    Edit2,
    Edit3,
    Eye,
    FileText,
    Mail,
    MapPin,
    MessageSquare,
    Monitor,
    MoreHorizontal,
    Package,
    Paperclip,
    Percent,
    Phone,
    PhoneCall,
    Plus,
    Presentation,
    Send,
    Settings,
    Shield,
    Star,
    Target,
    Trash2,
    TrendingUp,
    User,
    UserCircle,
    Users,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    Linking as RNLinking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProposalLineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  taxAmount?: number;
  totalPrice: number;
  isOptional: boolean;
}

interface ProposalMilestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: Date;
  isCompleted: boolean;
  percentage: number;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
  receiveProposals?: boolean;
}

export default function ProposalBuilder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse proposal data from params if editing
  const proposalId = params.id as string | undefined;
  const isEditing = !!proposalId;
  const proposalStatus = (params.status as string) || 'draft'; // Get status from params
  const isScheduled = (params.isScheduled as string) === 'true'; // Get scheduled status from params
  const scheduledDate = params.scheduledDate ? new Date(params.scheduledDate as string) : null;
  const isBusiness = (params.isBusiness as string) === 'true'; // Business or individual proposal
  
  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'stakeholders' | 'info' | 'settings' | 'notes' | 'comments' | 'feedback' | 'activity' | 'presentation'>('overview');
  
  // Public URL state
  const [showUrlModal, setShowUrlModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('Robert Johnson');
  const [contactEmail, setContactEmail] = useState('robert@greenenergy.co');
  const [contactPhone, setContactPhone] = useState('(555) 456-7890');
  const [businessName, setBusinessName] = useState(isBusiness ? 'Green Energy Solutions' : '');
  const [billingAddress, setBillingAddress] = useState('123 Business Plaza, Suite 100');
  const [jobAddress, setJobAddress] = useState('456 Project Site Rd');
  const [validUntil, setValidUntil] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [crewNotes, setCrewNotes] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  // Job Info state
  const [salesperson, setSalesperson] = useState('Chris Palmer');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [jobType, setJobType] = useState('Commercial Installation');
  const [priority, setPriority] = useState('High');
  
  // Stakeholders state (for business proposals)
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(isBusiness ? [
    { id: '1', name: 'Robert Johnson', role: 'CEO', email: 'robert@greenenergy.co', phone: '(555) 456-7890', isPrimary: true, receiveProposals: true },
    { id: '2', name: 'Sarah Martinez', role: 'CFO', email: 'sarah@greenenergy.co', phone: '(555) 456-7891', receiveProposals: true },
    { id: '3', name: 'Michael Chen', role: 'Project Manager', email: 'michael@greenenergy.co', phone: '(555) 456-7892', receiveProposals: false }
  ] : []);
  const [primaryContactId, setPrimaryContactId] = useState('1');
  
  // Deposit payment settings state
  const [depositPaymentSettings, setDepositPaymentSettings] = useState({
    allowCreditCard: true,
    waiveCreditCardFee: false,
    allowACH: true,
    waiveACHFee: false,
    allowOfflinePayment: true,
  });
  
  // Related deal info
  const [relatedDealId, setRelatedDealId] = useState('deal-solar-12345');
  const [relatedDealTitle, setRelatedDealTitle] = useState('Commercial Solar Installation - Green Energy Solutions');
  const [relatedDealStage, setRelatedDealStage] = useState('Proposal Sent');
  const [relatedDealAmount, setRelatedDealAmount] = useState(125000);
  const [relatedDealProbability, setRelatedDealProbability] = useState(75);
  
  // Send Modal state
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaText, setSendViaText] = useState(false);
  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState<string[]>([]);
  const [manualRecipients, setManualRecipients] = useState<any[]>([]);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('Your Proposal from DripJobs');
  const [customEmailBody, setCustomEmailBody] = useState('');
  const [customTextBody, setCustomTextBody] = useState('');
  const [editingEmailMessage, setEditingEmailMessage] = useState(false);
  const [editingTextMessage, setEditingTextMessage] = useState(false);
  const [sendNow, setSendNow] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [scheduledSendDate, setScheduledSendDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Contact Modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  
  // Proposal Number
  const [proposalNumber, setProposalNumber] = useState('PROP-2025-001');
  
  // Acorn Financing Integration
  const [acornFinancingEnabled, setAcornFinancingEnabled] = useState(false);
  
  // Related Deal
  const [relatedDeal, setRelatedDeal] = useState<any | null>({ 
    id: '123', 
    name: 'Kitchen Renovation', 
    contact: 'Mike Stewart',
    status: 'Proposal Sent', 
    value: 15000,
    tags: ['Needs HOA'],
    email: 'mike@example.com',
    phone: '(555) 123-4567'
  });
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  
  // Note Templates
  const [noteTemplates] = useState<{crew: string[], company: string[], client: string[]}>({
    crew: ['Standard crew instructions', 'Safety requirements template', 'Equipment checklist'],
    company: ['Project notes template', 'Internal coordination notes'],
    client: ['Welcome message', 'Project timeline overview', 'Maintenance instructions']
  });
  const [selectedCrewTemplate, setSelectedCrewTemplate] = useState<string | null>(null);
  const [selectedCompanyTemplate, setSelectedCompanyTemplate] = useState<string | null>(null);
  const [selectedClientTemplate, setSelectedClientTemplate] = useState<string | null>(null);
  const [showCrewTemplates, setShowCrewTemplates] = useState(false);
  const [showCompanyTemplates, setShowCompanyTemplates] = useState(false);
  const [showClientTemplates, setShowClientTemplates] = useState(false);
  
  // Comments (Internal Team)
  interface Comment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: Date;
    mentions?: string[];
  }
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'Tanner Mullen', avatar: 'TM', text: 'Updated the pricing based on client feedback', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', author: 'Chris Palmer', avatar: 'CP', text: 'Client wants to see financing options included', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Feedback (Customer Comments)
  interface Feedback {
    id: string;
    customerName: string;
    comment: string;
    lineItemId?: string;
    timestamp: Date;
    status: 'pending' | 'resolved';
  }
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([
    { id: '1', customerName: 'Robert Johnson', comment: 'Can we add an option for solar panel maintenance?', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), status: 'pending' },
    { id: '2', customerName: 'Robert Johnson', comment: 'The timeline seems too long, can we expedite?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'pending' }
  ]);
  
  // Terms & Conditions Templates
  const [termsTemplates] = useState<{name: string, content: string}[]>([
    { name: 'Standard Terms', content: 'These are the standard terms and conditions for all projects...' },
    { name: 'Commercial Terms', content: 'Commercial project terms including liability and insurance requirements...' },
    { name: 'Residential Terms', content: 'Residential project terms including homeowner responsibilities...' }
  ]);
  const [selectedTermsTemplate, setSelectedTermsTemplate] = useState<string | null>('Standard Terms');
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Job Info editing modal state
  const [showJobInfoModal, setShowJobInfoModal] = useState(false);
  const [editAddressLine1, setEditAddressLine1] = useState('');
  const [editAddressLine2, setEditAddressLine2] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [editSalesperson, setEditSalesperson] = useState(salesperson);
  const [editJobType, setEditJobType] = useState(jobType);
  const [editStartDate, setEditStartDate] = useState<Date | null>(startDate);
  const [editCompletionDate, setEditCompletionDate] = useState<Date | null>(completionDate);
  const [showJobStartDatePicker, setShowJobStartDatePicker] = useState(false);
  const [showJobCompletionDatePicker, setShowJobCompletionDatePicker] = useState(false);
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [salespersonSearch, setSalespersonSearch] = useState('');
  
  // Line items state
  const [lineItems, setLineItems] = useState<ProposalLineItem[]>([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isAddingOptionalItem, setIsAddingOptionalItem] = useState(false);
  
  // Add line item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState('');
  const [newItemTax, setNewItemTax] = useState('');
  const [showItemNameDropdown, setShowItemNameDropdown] = useState(false);

  // Initialize with line item from job creation if provided
  React.useEffect(() => {
    const lineItemName = params.lineItemName as string | undefined;
    const lineItemQuantity = params.lineItemQuantity as string | undefined;
    const lineItemPrice = params.lineItemPrice as string | undefined;

    if (lineItemName && lineItemQuantity && lineItemPrice && lineItems.length === 0) {
      const quantity = parseFloat(lineItemQuantity);
      const unitPrice = parseFloat(lineItemPrice);
      const newItem: ProposalLineItem = {
        id: Date.now().toString(),
        name: lineItemName,
        description: '',
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: quantity * unitPrice,
        isOptional: false,
      };
      setLineItems([newItem]);
    }
  }, [params.lineItemName, params.lineItemQuantity, params.lineItemPrice]);
  
  // Area wizard state
  const [showAreaWizard, setShowAreaWizard] = useState(false);
  
  // Deposit state
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositType, setDepositType] = useState<'amount' | 'percentage'>('amount');
  const [depositValue, setDepositValue] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  // Discount state
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  
  // Milestone payments
  const [milestonePayments, setMilestonePayments] = useState<ProposalMilestone[]>([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  
  // Calculations
  const standardItems = lineItems.filter(item => !item.isOptional);
  const optionalItems = lineItems.filter(item => item.isOptional);
  
  const subtotal = standardItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const taxAmount = standardItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemTax = item.taxRate ? itemSubtotal * (item.taxRate / 100) : 0;
    return sum + itemTax;
  }, 0);
  
  const optionalSubtotal = optionalItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const totalAmount = subtotal - discountAmount + taxAmount;
  const depositAmount = depositRequired
    ? depositType === 'amount'
      ? depositValue
      : (totalAmount * depositValue) / 100
    : 0;
  const remainingAmount = totalAmount - depositAmount;
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return { bg: '#F3F4F6', text: '#6B7280' };
      case 'sent': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'accepted': return { bg: '#D1FAE5', text: '#059669' };
      case 'rejected': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };
  
  // Generate public URL for proposal
  const getPublicUrl = () => {
    const baseUrl = 'https://app.dripjobs.com/proposal';
    const proposalSlug = proposalId || `draft-${Date.now()}`;
    return `${baseUrl}/${proposalSlug}`;
  };
  
  const handleCopyUrl = async () => {
    const url = getPublicUrl();
    await Clipboard.setStringAsync(url);
    Alert.alert('Success', 'Public URL copied to clipboard!');
  };
  
  const handlePresent = () => {
    setShowUrlModal(true);
  };
  
  const handleOpenPublicUrl = async () => {
    const url = getPublicUrl();
    const canOpen = await RNLinking.canOpenURL(url);
    if (canOpen) {
      await RNLinking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open URL');
    }
  };
  
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  
  const handleSend = () => {
    setShowSendModal(true);
  };
  
  const handleToggleStakeholder = (stakeholderId: string) => {
    if (selectedStakeholderIds.includes(stakeholderId)) {
      setSelectedStakeholderIds(selectedStakeholderIds.filter(id => id !== stakeholderId));
    } else {
      setSelectedStakeholderIds([...selectedStakeholderIds, stakeholderId]);
    }
  };
  
  const handleSendProposal = () => {
    // In real app, this would call an API
    console.log('Sending proposal...');
    console.log('Send via email:', sendViaEmail);
    console.log('Send via text:', sendViaText);
    console.log('Selected stakeholders:', selectedStakeholderIds);
    console.log('Send now:', sendNow);
    console.log('Scheduled date:', scheduledSendDate);
    
    setShowSendModal(false);
    
    if (!sendNow && scheduledSendDate) {
      Alert.alert('Proposal Scheduled', `Your proposal will be sent on ${formatDate(scheduledSendDate)} at ${formatTime(scheduledSendDate)}`);
    } else {
      Alert.alert('Success', 'Your proposal has been sent!');
    }
  };

  // Sample salespeople data
  const availableSalespeople = [
    'John Smith',
    'Sarah Johnson', 
    'Michael Chen',
    'Emily Rodriguez',
    'David Wilson',
    'Jessica Martinez',
    'Robert Taylor',
    'Amanda Brown'
  ];

  const filteredSalespeople = availableSalespeople.filter(person =>
    person.toLowerCase().includes(salespersonSearch.toLowerCase())
  );

  const handleEditJobInfo = () => {
    // Initialize edit state with current values
    // Parse existing job address if available
    setEditAddressLine1('');
    setEditAddressLine2('');
    setEditCity('');
    setEditState('');
    setEditPostalCode('');
    setEditSalesperson(salesperson);
    setSalespersonSearch(salesperson);
    setEditJobType(jobType);
    setEditStartDate(startDate);
    setEditCompletionDate(completionDate);
    setShowSalespersonDropdown(false);
    setShowJobInfoModal(true);
  };

  const handleSaveJobInfo = () => {
    // In production, this would update the backend
    // Combine address fields into jobAddress
    const fullAddress = [
      editAddressLine1,
      editAddressLine2,
      `${editCity}, ${editState} ${editPostalCode}`.trim()
    ].filter(Boolean).join(', ');
    
    setJobAddress(fullAddress || jobAddress);
    setSalesperson(editSalesperson);
    setJobType(editJobType);
    setStartDate(editStartDate);
    setCompletionDate(editCompletionDate);
    
    Alert.alert('Success', 'Job information updated successfully');
    setShowJobInfoModal(false);
  };
  
  const addLineItem = () => {
    setIsAddingOptionalItem(false);
    setNewItemName('');
    setNewItemDescription('');
    setNewItemQuantity('1');
    setNewItemUnitPrice('');
    setNewItemTax('');
    setShowItemNameDropdown(false);
    setShowAddItemModal(true);
  };
  
  const addOptionalItem = () => {
    setIsAddingOptionalItem(true);
    setNewItemName('');
    setNewItemDescription('');
    setNewItemQuantity('1');
    setNewItemUnitPrice('');
    setNewItemTax('');
    setShowItemNameDropdown(false);
    setShowAddItemModal(true);
  };
  
  const handleAddLineItem = () => {
    const quantity = parseFloat(newItemQuantity) || 0;
    const unitPrice = parseFloat(newItemUnitPrice) || 0;
    const taxRate = parseFloat(newItemTax) || 0;
    const itemSubtotal = quantity * unitPrice;
    const taxAmount = taxRate ? itemSubtotal * (taxRate / 100) : 0;
    const totalPrice = itemSubtotal + taxAmount;
    
    const newItem: ProposalLineItem = {
      id: Date.now().toString(),
      name: newItemName,
      description: newItemDescription,
      quantity,
      unitPrice,
      taxRate: taxRate > 0 ? taxRate : undefined,
      taxAmount: taxAmount > 0 ? taxAmount : undefined,
      totalPrice,
      isOptional: isAddingOptionalItem,
    };
    
    setLineItems([...lineItems, newItem]);
    setShowAddItemModal(false);
  };
  
  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };
  
  const addMilestone = () => {
    const newMilestone: ProposalMilestone = {
      id: `milestone-${Date.now()}`,
      name: '',
      description: '',
      amount: 0,
      dueDate: new Date(),
      isCompleted: false,
      percentage: 0,
    };
    setMilestonePayments([...milestonePayments, newMilestone]);
    setShowMilestoneModal(true);
  };
  
  const removeMilestone = (id: string) => {
    setMilestonePayments(milestonePayments.filter(m => m.id !== id));
  };
  
  const handleAddArea = (area: any) => {
    // Convert area to line item
    const newLineItem: ProposalLineItem = {
      id: area.id,
      name: area.name,
      description: `${area.type} - ${area.categories.join(', ')}`,
      quantity: 1,
      unitPrice: 0, // Calculate from substrates
      totalPrice: 0, // Calculate from substrates
      isOptional: area.isOptional,
    };
    
    setLineItems([...lineItems, newLineItem]);
    Alert.alert('Success', 'Area added successfully!');
  };

  const renderTabBar = () => {
    const tabs = [
      { id: 'overview', label: 'Overview', icon: FileText },
      ...(isBusiness ? [{ id: 'stakeholders', label: 'Stakeholders', icon: Users }] : []),
      { id: 'info', label: 'Info', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'notes', label: 'Notes', icon: FileText },
      { id: 'comments', label: 'Comments', icon: MessageSquare },
      { id: 'feedback', label: 'Feedback', icon: AlertCircle },
      { id: 'activity', label: 'Activity', icon: Clock },
      { id: 'presentation', label: 'Present', icon: Presentation },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <tab.icon
              size={16}
              color={activeTab === tab.id ? '#6366F1' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderPreviewMode = () => (
    <View style={styles.tabContent}>
      {/* Customer View Header */}
      <View style={styles.previewHeader}>
        <Text style={styles.previewCompanyName}>DripJobs Inc.</Text>
        <Text style={styles.previewProposalTitle}>{title || 'Untitled Proposal'}</Text>
        <Text style={styles.previewContactName}>For: {contactName || 'Contact Name'}</Text>
        {businessName && <Text style={styles.previewBusinessName}>{businessName}</Text>}
        {validUntil && (
          <Text style={styles.previewValidUntil}>Valid Until: {validUntil}</Text>
        )}
      </View>

      {/* Line Items Preview */}
      {standardItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proposal Items</Text>
          {standardItems.map((item) => (
            <View key={item.id} style={styles.previewLineItem}>
              <View style={styles.lineItemHeader}>
                <Text style={styles.lineItemName}>{item.name}</Text>
                <Text style={styles.lineItemTotal}>{formatCurrency(item.totalPrice)}</Text>
              </View>
              <Text style={styles.lineItemDescription}>{item.description}</Text>
              <Text style={styles.lineItemText}>
                Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Optional Items Preview */}
      {optionalItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Add-Ons</Text>
          <Text style={styles.optionalDescription}>
            The following items can be added to your proposal:
          </Text>
          {optionalItems.map((item) => (
            <View key={item.id} style={[styles.previewLineItem, styles.optionalItem]}>
              <View style={styles.lineItemHeader}>
                <Text style={styles.lineItemName}>{item.name}</Text>
                <Text style={styles.lineItemTotal}>{formatCurrency(item.totalPrice)}</Text>
              </View>
              <Text style={styles.lineItemDescription}>{item.description}</Text>
              <Text style={styles.lineItemText}>
                Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Preview Summary */}
      <View style={[styles.section, styles.summarySection]}>
        <Text style={styles.sectionTitle}>Proposal Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>

        {discountAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryDiscount]}>Discount:</Text>
            <Text style={[styles.summaryValue, styles.summaryDiscount]}>
              -{formatCurrency(discountAmount)}
            </Text>
          </View>
        )}

        {taxAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
          <Text style={styles.summaryTotalValue}>{formatCurrency(totalAmount)}</Text>
        </View>

        {depositRequired && (
          <>
            <View style={[styles.summaryRow, styles.summaryDeposit]}>
              <Text style={styles.summaryDepositLabel}>Deposit Required:</Text>
              <Text style={styles.summaryDepositValue}>{formatCurrency(depositAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Remaining Balance:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(remainingAmount)}</Text>
            </View>
          </>
        )}
      </View>

      {/* Client Notes */}
      {clientNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.previewNotes}>{clientNotes}</Text>
        </View>
      )}

      {/* Terms and Conditions */}
      {terms && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.previewTerms}>{terms}</Text>
        </View>
      )}

      {/* Payment Terms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Terms</Text>
        <Text style={styles.previewPaymentTerms}>{paymentTerms}</Text>
      </View>
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Line Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.addButtonSecondary} onPress={() => setShowAreaWizard(true)}>
              <Package size={14} color="#6366F1" />
              <Text style={styles.addButtonSecondaryText}>Area</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addLineItem}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        {lineItems.filter(item => !item.isOptional).map((item) => (
          <View key={item.id} style={styles.lineItem}>
            <View style={styles.lineItemHeader}>
              <Text style={styles.lineItemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeLineItem(item.id)}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.lineItemDescription}>{item.description}</Text>
            <View style={styles.lineItemDetails}>
              <Text style={styles.lineItemText}>
                Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={styles.lineItemTotal}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          </View>
        ))}

        {lineItems.filter(item => !item.isOptional).length === 0 && (
          <View style={styles.emptyState}>
            <Package size={40} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No line items added yet</Text>
          </View>
        )}
      </View>

      {/* Optional Items Section */}
      {optionalItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Optional Items</Text>
          </View>

          {optionalItems.map((item) => (
            <View key={item.id} style={[styles.lineItem, styles.optionalItem]}>
              <View style={styles.lineItemHeader}>
                <Text style={styles.lineItemName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeLineItem(item.id)}>
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.lineItemDescription}>{item.description}</Text>
              <View style={styles.lineItemDetails}>
                <Text style={styles.lineItemText}>
                  Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.lineItemTotal}>{formatCurrency(item.totalPrice)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.optionalButton} onPress={addOptionalItem}>
        <Plus size={16} color="#6366F1" />
        <Text style={styles.optionalButtonText}>Add Optional Item</Text>
      </TouchableOpacity>

      {/* Proposal Summary */}
      <View style={[styles.section, styles.summarySection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proposal Summary</Text>
          <TouchableOpacity
            style={styles.discountButton}
            onPress={() => setShowDiscountModal(true)}
          >
            <Percent size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>

        {optionalSubtotal > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Optional Items:</Text>
            <Text style={[styles.summaryValue, styles.summaryOptional]}>
              {formatCurrency(optionalSubtotal)}
            </Text>
          </View>
        )}

        {discountAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryDiscount]}>Discount:</Text>
            <Text style={[styles.summaryValue, styles.summaryDiscount]}>
              -{formatCurrency(discountAmount)}
            </Text>
          </View>
        )}

        {taxAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
          <Text style={styles.summaryTotalValue}>{formatCurrency(totalAmount)}</Text>
        </View>

        {depositRequired && (
          <>
            <View style={[styles.summaryRow, styles.summaryDeposit]}>
              <Text style={styles.summaryDepositLabel}>Deposit Required:</Text>
              <Text style={styles.summaryDepositValue}>{formatCurrency(depositAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Remaining Balance:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(remainingAmount)}</Text>
            </View>
          </>
        )}
      </View>

      {/* Payment Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Settings</Text>

        {/* Deposit Section */}
        <TouchableOpacity
          style={styles.settingCard}
          onPress={() => setShowDepositModal(true)}
        >
          <View style={styles.settingIcon}>
            <Shield size={20} color="#6366F1" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Deposit</Text>
            <Text style={styles.settingDescription}>
              {depositRequired
                ? `${depositType === 'amount' ? formatCurrency(depositValue) : `${depositValue}%`} deposit required`
                : 'No deposit required'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Payment Schedule */}
        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <Target size={20} color="#10B981" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Payment Schedule</Text>
            <Text style={styles.settingDescription}>
              {milestonePayments.length} milestone{milestonePayments.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.addIconButton} onPress={addMilestone}>
            <Plus size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {milestonePayments.map((milestone) => (
          <View key={milestone.id} style={styles.milestoneItem}>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneName}>{milestone.name || 'Unnamed Milestone'}</Text>
              <Text style={styles.milestoneAmount}>{formatCurrency(milestone.amount)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeMilestone(milestone.id)}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Terms and Conditions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <TouchableOpacity 
            style={styles.editIconButton}
            onPress={() => setShowTermsModal(true)}
          >
            <Edit2 size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
        
        {selectedTermsTemplate ? (
          <TouchableOpacity 
            style={styles.termsCard}
            onPress={() => setShowTermsModal(true)}
          >
            <View style={styles.termsCardHeader}>
              <Shield size={20} color="#6366F1" />
              <Text style={styles.termsCardTitle}>{selectedTermsTemplate}</Text>
            </View>
            <Text style={styles.termsCardPreview} numberOfLines={3}>
              {termsTemplates.find(t => t.name === selectedTermsTemplate)?.content}
            </Text>
            <View style={styles.termsCardFooter}>
              <Text style={styles.termsCardViewText}>Tap to view full text</Text>
              <Eye size={16} color="#6366F1" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.addTermsButton}
            onPress={() => setShowTermsModal(true)}
          >
            <Plus size={20} color="#6366F1" />
            <Text style={styles.addTermsText}>Select Terms & Conditions</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proposal Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Proposal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter proposal title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Valid Until</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#9CA3AF"
            value={validUntil}
            onChangeText={setValidUntil}
          />
        </View>
        </View>

      {/* Deposit Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deposit Payment Methods</Text>
        <View style={styles.settingsCard}>
          {/* Credit Card */}
          <View style={styles.paymentOptionRow}>
            <View style={styles.paymentOptionLeft}>
              <CreditCard size={20} color="#6366F1" />
              <View>
                <Text style={styles.paymentOptionLabel}>Credit Card</Text>
                <Text style={styles.paymentOptionFee}>2.9% + $0.30 fee</Text>
              </View>
            </View>
            <Switch
              value={depositPaymentSettings.allowCreditCard}
              onValueChange={(value) => 
                setDepositPaymentSettings(prev => ({ ...prev, allowCreditCard: value }))
              }
          />
        </View>

          {depositPaymentSettings.allowCreditCard && (
            <View style={styles.paymentOptionSubRow}>
              <Text style={styles.paymentOptionSubLabel}>Waive convenience fee</Text>
              <Switch
                value={depositPaymentSettings.waiveCreditCardFee}
                onValueChange={(value) => 
                  setDepositPaymentSettings(prev => ({ ...prev, waiveCreditCardFee: value }))
                }
          />
        </View>
          )}
          
          {/* ACH */}
          <View style={styles.paymentOptionRow}>
            <View style={styles.paymentOptionLeft}>
              <Building2 size={20} color="#10B981" />
              <View>
                <Text style={styles.paymentOptionLabel}>ACH / Bank Transfer</Text>
                <Text style={styles.paymentOptionFee}>1% fee (max $10)</Text>
          </View>
        </View>
            <Switch
              value={depositPaymentSettings.allowACH}
              onValueChange={(value) => 
                setDepositPaymentSettings(prev => ({ ...prev, allowACH: value }))
              }
            />
          </View>
          
          {depositPaymentSettings.allowACH && (
            <View style={styles.paymentOptionSubRow}>
              <Text style={styles.paymentOptionSubLabel}>Waive ACH fee</Text>
              <Switch
                value={depositPaymentSettings.waiveACHFee}
                onValueChange={(value) => 
                  setDepositPaymentSettings(prev => ({ ...prev, waiveACHFee: value }))
                }
              />
            </View>
          )}
          
          {/* Offline Payment */}
          <View style={styles.paymentOptionRow}>
            <View style={styles.paymentOptionLeft}>
              <DollarSign size={20} color="#6B7280" />
              <View>
                <Text style={styles.paymentOptionLabel}>Offline Payment</Text>
                <Text style={styles.paymentOptionFee}>Cash, Check, Venmo, etc.</Text>
              </View>
            </View>
            <Switch
              value={depositPaymentSettings.allowOfflinePayment}
              onValueChange={(value) => 
                setDepositPaymentSettings(prev => ({ ...prev, allowOfflinePayment: value }))
              }
            />
          </View>
        </View>
      </View>

      {/* Acorn Financing Integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financing Integration</Text>
        <View style={styles.settingsCard}>
          <View style={styles.paymentOptionRow}>
            <View style={styles.paymentOptionLeft}>
              <CreditCard size={20} color="#F59E0B" />
              <View>
                <Text style={styles.paymentOptionLabel}>Acorn Financing</Text>
                <Text style={styles.paymentOptionFee}>Offer financing options to customers</Text>
              </View>
            </View>
            <Switch
              value={acornFinancingEnabled}
              onValueChange={setAcornFinancingEnabled}
            />
          </View>
          
          {acornFinancingEnabled && (
            <View style={styles.financingInfoBox}>
              <Text style={styles.financingInfoText}>
                When enabled, customers will see financing options in the proposal.
                Acorn Financing offers flexible payment plans with competitive rates.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderNotesTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Crew Notes */}
      <View style={styles.section}>
        <View style={styles.noteHeader}>
          <View>
            <Text style={styles.noteTitle}>Crew Notes</Text>
            <Text style={styles.noteSubtitle}>Shows on work order</Text>
          </View>
          <TouchableOpacity 
            style={styles.templateButton}
            onPress={() => setShowCrewTemplates(!showCrewTemplates)}
          >
            <FileText size={16} color="#6366F1" />
            <Text style={styles.templateButtonText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {showCrewTemplates && (
          <View style={styles.templateDropdown}>
            {noteTemplates.crew.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateItem}
                onPress={() => {
                  setCrewNotes(template);
                  setShowCrewTemplates(false);
                }}
              >
                <Text style={styles.templateItemText}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.noteCard}>
          <TextInput
            style={styles.richTextArea}
            placeholder="Add instructions for the crew..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={crewNotes}
            onChangeText={setCrewNotes}
            textAlignVertical="top"
          />
          <View style={styles.noteFooter}>
            <Text style={styles.characterCount}>{crewNotes.length} characters</Text>
          </View>
        </View>
      </View>

      {/* Company Notes */}
      <View style={styles.section}>
        <View style={styles.noteHeader}>
          <View>
            <Text style={styles.noteTitle}>Company Notes</Text>
            <Text style={styles.noteSubtitle}>Internal only</Text>
          </View>
          <TouchableOpacity 
            style={styles.templateButton}
            onPress={() => setShowCompanyTemplates(!showCompanyTemplates)}
          >
            <FileText size={16} color="#6366F1" />
            <Text style={styles.templateButtonText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {showCompanyTemplates && (
          <View style={styles.templateDropdown}>
            {noteTemplates.company.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateItem}
                onPress={() => {
                  setCompanyNotes(template);
                  setShowCompanyTemplates(false);
                }}
              >
                <Text style={styles.templateItemText}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.noteCard}>
          <TextInput
            style={styles.richTextArea}
            placeholder="Internal notes for your team..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={companyNotes}
            onChangeText={setCompanyNotes}
            textAlignVertical="top"
          />
          <View style={styles.noteFooter}>
            <Text style={styles.characterCount}>{companyNotes.length} characters</Text>
          </View>
        </View>
      </View>

      {/* Client Notes */}
      <View style={styles.section}>
        <View style={styles.noteHeader}>
          <View>
            <Text style={styles.noteTitle}>Client Notes</Text>
            <Text style={styles.noteSubtitle}>Visible on proposal</Text>
          </View>
          <TouchableOpacity 
            style={styles.templateButton}
            onPress={() => setShowClientTemplates(!showClientTemplates)}
          >
            <FileText size={16} color="#6366F1" />
            <Text style={styles.templateButtonText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {showClientTemplates && (
          <View style={styles.templateDropdown}>
            {noteTemplates.client.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateItem}
                onPress={() => {
                  setClientNotes(template);
                  setShowClientTemplates(false);
                }}
              >
                <Text style={styles.templateItemText}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.noteCard}>
          <TextInput
            style={styles.richTextArea}
            placeholder="Notes that will be visible to the client..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={clientNotes}
            onChangeText={setClientNotes}
            textAlignVertical="top"
          />
          <View style={styles.noteFooter}>
            <Text style={styles.characterCount}>{clientNotes.length} characters</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderStakeholdersTab = () => (
    <View style={styles.tabContentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stakeholders</Text>
        <View style={{ height: 16 }} />
        <View style={styles.stakeholdersList}>
          {stakeholders.map((stakeholder) => (
            <View key={stakeholder.id} style={styles.stakeholderCard}>
              <View style={styles.stakeholderHeader}>
                <View style={styles.stakeholderAvatar}>
                  <Text style={styles.stakeholderAvatarText}>
                    {stakeholder.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.stakeholderInfo}>
                  <View style={styles.stakeholderNameRow}>
                    <Text style={styles.stakeholderName}>{stakeholder.name}</Text>
                    {stakeholder.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.stakeholderRole}>{stakeholder.role}</Text>
                </View>
              </View>
              <View style={styles.stakeholderContactInfo}>
                <Text style={styles.stakeholderEmail}>{stakeholder.email}</Text>
                {stakeholder.phone && (
                  <Text style={styles.stakeholderPhone}>{stakeholder.phone}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.stakeholderActionButton}
                onPress={() => {
                  if (expandedActionItem === stakeholder.id) {
                    setExpandedActionItem(null);
                  } else {
                    setExpandedActionItem(stakeholder.id);
                  }
                }}
              >
                <MoreHorizontal size={20} color="#6366F1" />
                <Text style={styles.stakeholderActionText}>Actions</Text>
              </TouchableOpacity>
              
              {/* Action Menu */}
              {expandedActionItem === stakeholder.id && (
                <View style={styles.stakeholderActionMenu}>
                  <TouchableOpacity 
                    style={styles.stakeholderMenuItem}
                    onPress={() => {
                      setShowContactModal(true);
                      setExpandedActionItem(null);
                    }}
                  >
                    <User size={18} color="#374151" />
                    <Text style={styles.stakeholderMenuText}>View Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.stakeholderMenuItem}
                    onPress={() => {
                      setSelectedStakeholderIds([stakeholder.id]);
                      setShowSendModal(true);
                      setExpandedActionItem(null);
                    }}
                  >
                    <FileText size={18} color="#374151" />
                    <Text style={styles.stakeholderMenuText}>Send Proposal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.stakeholderMenuItem}
                    onPress={() => {
                      Alert.alert('Email', `Send email to ${stakeholder.email}`);
                      setExpandedActionItem(null);
                    }}
                  >
                    <Mail size={18} color="#374151" />
                    <Text style={styles.stakeholderMenuText}>Send Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.stakeholderMenuItem}
                    onPress={() => {
                      Alert.alert('Text', `Send text to ${stakeholder.phone}`);
                      setExpandedActionItem(null);
                    }}
                  >
                    <MessageSquare size={18} color="#374151" />
                    <Text style={styles.stakeholderMenuText}>Send Text</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Related Deal */}
      {relatedDeal && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Deal</Text>
          <TouchableOpacity 
            style={styles.relatedDealCard}
            onPress={() => setShowCommandCenter(true)}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.relatedDealGradient}
            >
              <View style={styles.relatedDealHeader}>
                <View>
                  <Text style={styles.relatedDealName}>{relatedDeal.name}</Text>
                  <Text style={styles.relatedDealStatus}>{relatedDeal.status}</Text>
                </View>
                <ChevronRight size={20} color="#FFFFFF" />
              </View>
              <View style={styles.relatedDealValue}>
                <DollarSign size={18} color="#FFFFFF" />
                <Text style={styles.relatedDealAmount}>${relatedDeal.value.toLocaleString()}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        
        {businessName && (
          <View style={styles.contactInfoRow}>
            <Building2 size={18} color="#6B7280" />
            <Text style={styles.contactInfoText}>{businessName}</Text>
          </View>
        )}
        
        <View style={styles.contactInfoRow}>
          <User size={18} color="#6B7280" />
          <Text style={styles.contactInfoText}>{contactName}</Text>
        </View>
        
        <View style={styles.contactInfoRow}>
          <Mail size={18} color="#6B7280" />
          <Text style={styles.contactInfoText}>{contactEmail}</Text>
        </View>
        
        {contactPhone && (
          <View style={styles.contactInfoRow}>
            <Phone size={18} color="#6B7280" />
            <Text style={styles.contactInfoText}>{contactPhone}</Text>
          </View>
        )}
        
        {jobAddress && (
          <View style={styles.contactInfoRow}>
            <MapPin size={18} color="#6B7280" />
            <Text style={styles.contactInfoText}>{jobAddress}</Text>
          </View>
        )}
      </View>

      {/* Job Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <TouchableOpacity 
            style={styles.editIconButton}
            onPress={handleEditJobInfo}
          >
            <Edit2 size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.jobInfoCard}>
          {/* Proposal Number */}
          <View style={styles.jobInfoRow}>
            <View style={styles.jobInfoIcon}>
              <FileText size={18} color="#6366F1" />
            </View>
            <View style={styles.jobInfoContent}>
              <Text style={styles.jobInfoLabel}>Proposal Number</Text>
              <Text style={[styles.jobInfoValue, { color: '#6366F1', fontWeight: '600' }]}>{proposalNumber}</Text>
            </View>
          </View>

          {/* Job Address */}
          <View style={styles.jobInfoRow}>
            <View style={styles.jobInfoIcon}>
              <MapPin size={18} color="#6B7280" />
            </View>
            <View style={styles.jobInfoContent}>
              <Text style={styles.jobInfoLabel}>Job Address</Text>
              <Text style={styles.jobInfoValue}>{jobAddress}</Text>
            </View>
          </View>

          {/* Salesperson */}
          <View style={styles.jobInfoRow}>
            <View style={styles.jobInfoIcon}>
              <User size={18} color="#6B7280" />
            </View>
            <View style={styles.jobInfoContent}>
              <Text style={styles.jobInfoLabel}>Salesperson</Text>
              <Text style={styles.jobInfoValue}>{salesperson}</Text>
            </View>
          </View>

          {/* Job Type */}
          <View style={styles.jobInfoRow}>
            <View style={styles.jobInfoIcon}>
              <FileText size={18} color="#6B7280" />
            </View>
            <View style={styles.jobInfoContent}>
              <Text style={styles.jobInfoLabel}>Job Type</Text>
              <Text style={styles.jobInfoValue}>{jobType}</Text>
            </View>
          </View>

          {/* Date Range */}
          {(startDate || completionDate) && (
            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIcon}>
                <Clock size={18} color="#6B7280" />
              </View>
              <View style={styles.jobInfoContent}>
                <Text style={styles.jobInfoLabel}>Estimated Schedule</Text>
                <Text style={styles.jobInfoValue}>
                  {startDate ? formatDate(startDate) : 'TBD'}
                  {completionDate && ` - ${formatDate(completionDate)}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const addComment = () => {
    if (!newCommentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Tanner Mullen', // Current user
      avatar: 'TM',
      text: newCommentText,
      timestamp: new Date()
    };
    
    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  const deleteComment = (id: string) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setComments(comments.filter(c => c.id !== id)) }
    ]);
  };

  const renderCommentsTab = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.commentsContainer}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
              </View>
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteComment(comment.id)}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}
        
        {comments.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={40} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No comments yet</Text>
            <Text style={styles.emptyStateSubtext}>Start a conversation with your team</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#9CA3AF"
          value={newCommentText}
          onChangeText={setNewCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendCommentButton, !newCommentText.trim() && styles.sendCommentButtonDisabled]}
          onPress={addComment}
          disabled={!newCommentText.trim()}
        >
          <Send size={20} color={newCommentText.trim() ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActivityTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Log</Text>
        <View style={styles.emptyState}>
          <Clock size={40} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No activity recorded yet</Text>
        </View>
      </View>
    </View>
  );

  const markFeedbackAsResolved = (id: string) => {
    setFeedbackItems(feedbackItems.map(item => 
      item.id === id ? { ...item, status: 'resolved' } : item
    ));
  };

  const renderFeedbackTab = () => {
    const pendingFeedback = feedbackItems.filter(f => f.status === 'pending');
    const resolvedFeedback = feedbackItems.filter(f => f.status === 'resolved');

    return (
      <ScrollView style={styles.tabContent}>
        {/* Pending Feedback */}
        {pendingFeedback.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Feedback</Text>
            {pendingFeedback.map((feedback) => (
              <View key={feedback.id} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View>
                    <Text style={styles.feedbackAuthor}>{feedback.customerName}</Text>
                    <Text style={styles.feedbackTime}>{formatTimeAgo(feedback.timestamp)}</Text>
                  </View>
                  <View style={styles.feedbackPendingBadge}>
                    <Text style={styles.feedbackPendingText}>PENDING</Text>
                  </View>
                </View>
                <Text style={styles.feedbackText}>{feedback.comment}</Text>
                <TouchableOpacity 
                  style={styles.resolveButton}
                  onPress={() => markFeedbackAsResolved(feedback.id)}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Resolved Feedback */}
        {resolvedFeedback.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolved Feedback</Text>
            {resolvedFeedback.map((feedback) => (
              <View key={feedback.id} style={[styles.feedbackCard, styles.feedbackCardResolved]}>
                <View style={styles.feedbackHeader}>
                  <View>
                    <Text style={styles.feedbackAuthor}>{feedback.customerName}</Text>
                    <Text style={styles.feedbackTime}>{formatTimeAgo(feedback.timestamp)}</Text>
                  </View>
                  <View style={styles.feedbackResolvedBadge}>
                    <Check size={12} color="#10B981" />
                    <Text style={styles.feedbackResolvedText}>RESOLVED</Text>
                  </View>
                </View>
                <Text style={[styles.feedbackText, { color: '#9CA3AF' }]}>{feedback.comment}</Text>
              </View>
            ))}
          </View>
        )}

        {feedbackItems.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={40} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No customer feedback yet</Text>
            <Text style={styles.emptyStateSubtext}>Customer comments will appear here</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderVideoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Content</Text>
        <View style={styles.emptyState}>
          <Paperclip size={40} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No videos added yet</Text>
        </View>
      </View>
    </View>
  );

  const renderPresentationTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Presentation Wizard</Text>
        <View style={styles.emptyState}>
          <Presentation size={40} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No presentation created</Text>
          <Text style={styles.emptyStateSubtext}>
            Create a professional presentation to showcase your proposal
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'stakeholders':
        return renderStakeholdersTab();
      case 'info':
        return renderInfoTab();
      case 'settings':
        return renderSettingsTab();
      case 'notes':
        return renderNotesTab();
      case 'comments':
        return renderCommentsTab();
      case 'feedback':
        return renderFeedbackTab();
      case 'activity':
        return renderActivityTab();
      case 'presentation':
        return renderPresentationTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Proposal' : 'New Proposal'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditing ? proposalId : 'Create a new business proposal'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proposalStatus).bg }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(proposalStatus).text }]}>
                {proposalStatus.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => setShowContactModal(true)}
            >
              <User size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.headerActions}>
          {isPreviewMode ? (
            <>
              <TouchableOpacity style={styles.headerActionButton} onPress={togglePreviewMode}>
                <Edit3 size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton} onPress={handleSend}>
                <Send size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>Send</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.headerActionButton} onPress={togglePreviewMode}>
                <Eye size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton} onPress={handlePresent}>
                <Monitor size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton} onPress={handleSend}>
                <Send size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>Send</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>

      {/* Scheduled Send Banner */}
      {isScheduled && scheduledDate && (
        <View style={styles.scheduledBanner}>
          <Clock size={18} color="#F59E0B" />
          <View style={styles.scheduledBannerContent}>
            <Text style={styles.scheduledBannerText}>
              Scheduled to send on {formatDate(scheduledDate)} at {formatTime(scheduledDate)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.scheduledBannerButton}
            onPress={() => setShowSendModal(true)}
          >
            <Text style={styles.scheduledBannerButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Schedule Job Banner */}
      {proposalStatus === 'accepted' && !isScheduled && (
        <TouchableOpacity 
          style={styles.scheduleJobBanner}
          onPress={() => {
            // In real app, navigate to scheduling page
            Alert.alert(
              'Schedule Job',
              'This job has been accepted but not scheduled yet. Would you like to schedule it now?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Schedule Now', onPress: () => {
                  // Navigate to job schedule page or open schedule modal
                  console.log('Navigate to scheduling');
                }}
              ]
            );
          }}
        >
          <View style={styles.scheduleJobContent}>
            <Clock size={20} color="#D97706" />
            <View style={styles.scheduleJobText}>
              <Text style={styles.scheduleJobTitle}>Job Not Scheduled</Text>
              <Text style={styles.scheduleJobDescription}>Tap here to schedule this accepted job</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Tab Bar - Hidden in preview mode */}
      {!isPreviewMode && renderTabBar()}

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {isPreviewMode ? renderPreviewMode() : renderTabContent()}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {isAddingOptionalItem ? 'Optional' : ''} Item
              </Text>
              <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Item Name with Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <View style={[
                  styles.input,
                  focusedInput === 'itemName' && styles.inputFocused
                ]}>
                <TextInput
                    style={styles.inputText}
                    value={newItemName}
                    onChangeText={setNewItemName}
                    placeholder="Enter item name or select from products below"
                  placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('itemName')}
                    onBlur={() => setFocusedInput(null)}
                />
              </View>

                {/* Products/Services Quick Select */}
                <TouchableOpacity
                  style={styles.quickSelectToggle}
                  onPress={() => setShowItemNameDropdown(!showItemNameDropdown)}
                >
                  <Text style={styles.quickSelectText}>
                    {showItemNameDropdown ? 'Hide' : 'Show'} Products/Services
                  </Text>
                  <ChevronRight 
                    size={16} 
                    color="#6366F1" 
                    style={{ transform: [{ rotate: showItemNameDropdown ? '90deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
                
                {showItemNameDropdown && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Exterior Painting');
                        setNewItemUnitPrice('2500');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Exterior Painting</Text>
                      <Text style={styles.dropdownItemPrice}>$2,500.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Interior Painting');
                        setNewItemUnitPrice('1800');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Interior Painting</Text>
                      <Text style={styles.dropdownItemPrice}>$1,800.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Deck Staining');
                        setNewItemUnitPrice('1200');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Deck Staining</Text>
                      <Text style={styles.dropdownItemPrice}>$1,200.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Pressure Washing');
                        setNewItemUnitPrice('350');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Pressure Washing</Text>
                      <Text style={styles.dropdownItemPrice}>$350.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Trim Work');
                        setNewItemUnitPrice('800');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Trim Work</Text>
                      <Text style={styles.dropdownItemPrice}>$800.00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewItemName('Cabinet Refinishing');
                        setNewItemUnitPrice('1500');
                        setShowItemNameDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Cabinet Refinishing</Text>
                      <Text style={styles.dropdownItemPrice}>$1,500.00</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Quantity and Price Row */}
              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <View style={[
                    styles.input,
                    focusedInput === 'itemQuantity' && styles.inputFocused
                  ]}>
                  <TextInput
                      style={styles.inputText}
                      value={newItemQuantity}
                      onChangeText={setNewItemQuantity}
                      placeholder="1"
                      keyboardType="decimal-pad"
                      onFocus={() => setFocusedInput('itemQuantity')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Unit Price</Text>
                  <View style={[
                    styles.input,
                    focusedInput === 'itemUnitPrice' && styles.inputFocused
                  ]}>
                    <View style={styles.currencyInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                        style={styles.currencyInput}
                        value={newItemUnitPrice}
                        onChangeText={setNewItemUnitPrice}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        onFocus={() => setFocusedInput('itemUnitPrice')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Tax Field */}
              <View style={styles.inputGroup}>
                <View style={styles.taxHeaderRow}>
                  <Text style={styles.inputLabel}>Tax Rate (Optional)</Text>
                  <Text style={styles.taxHelpText}>e.g., 8.5 for 8.5%</Text>
                </View>
                <View style={[
                  styles.input,
                  focusedInput === 'itemTax' && styles.inputFocused
                ]}>
                  <TextInput
                    style={styles.inputText}
                    value={newItemTax}
                    onChangeText={setNewItemTax}
                    placeholder="0"
                    keyboardType="decimal-pad"
                    onFocus={() => setFocusedInput('itemTax')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {newItemTax ? (
                    <Text style={styles.taxPercentDisplay}>{newItemTax}%</Text>
                  ) : null}
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.textArea}
                  value={newItemDescription}
                  onChangeText={setNewItemDescription}
                  placeholder="Enter item description"
                    placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  />
                </View>

              {/* Item Total Preview */}
              {newItemQuantity && newItemUnitPrice && (
                <View style={styles.itemTotalPreview}>
                  <View style={styles.itemTotalRow}>
                    <Text style={styles.itemTotalLabel}>Subtotal:</Text>
                    <Text style={styles.itemTotalValue}>
                      {formatCurrency(parseFloat(newItemQuantity) * parseFloat(newItemUnitPrice))}
                    </Text>
              </View>
                  {newItemTax && parseFloat(newItemTax) > 0 && (
                    <>
                      <View style={styles.itemTotalRow}>
                        <Text style={styles.itemTotalLabel}>Tax ({newItemTax}%):</Text>
                        <Text style={styles.itemTotalValue}>
                          {formatCurrency((parseFloat(newItemQuantity) * parseFloat(newItemUnitPrice)) * (parseFloat(newItemTax) / 100))}
                        </Text>
                      </View>
                      <View style={[styles.itemTotalRow, styles.itemTotalRowFinal]}>
                        <Text style={styles.itemTotalLabelFinal}>Total:</Text>
                        <Text style={styles.itemTotalValueFinal}>
                          {formatCurrency(
                            (parseFloat(newItemQuantity) * parseFloat(newItemUnitPrice)) * 
                            (1 + parseFloat(newItemTax) / 100)
                          )}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowAddItemModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleAddLineItem}
                disabled={!newItemName || !newItemQuantity || !newItemUnitPrice}
              >
                <Text style={styles.modalButtonPrimaryText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        visible={showDepositModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDepositModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deposit Settings</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Require Deposit</Text>
                <TouchableOpacity
                  style={[styles.toggle, depositRequired && styles.toggleActive]}
                  onPress={() => setDepositRequired(!depositRequired)}
                >
                  <View style={[styles.toggleThumb, depositRequired && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>

              {depositRequired && (
                <>
                  <View style={styles.radioGroup}>
                    <Text style={styles.inputLabel}>Deposit Type</Text>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setDepositType('amount')}
                    >
                      <View style={styles.radioCircle}>
                        {depositType === 'amount' && <View style={styles.radioCircleSelected} />}
                      </View>
                      <Text style={styles.radioLabel}>Fixed Amount ($)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setDepositType('percentage')}
                    >
                      <View style={styles.radioCircle}>
                        {depositType === 'percentage' && <View style={styles.radioCircleSelected} />}
                      </View>
                      <Text style={styles.radioLabel}>Percentage (%)</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Deposit {depositType === 'amount' ? 'Amount' : 'Percentage'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={depositType === 'amount' ? '$0.00' : '0'}
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={depositValue.toString()}
                      onChangeText={(text) => setDepositValue(parseFloat(text) || 0)}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowDepositModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => setShowDepositModal(false)}
              >
                <Text style={styles.modalButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Discount Modal */}
      <Modal
        visible={showDiscountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDiscountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply Discount</Text>
              <TouchableOpacity onPress={() => setShowDiscountModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.radioGroup}>
                <Text style={styles.inputLabel}>Discount Type</Text>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setDiscountType('percentage')}
                >
                  <View style={styles.radioCircle}>
                    {discountType === 'percentage' && <View style={styles.radioCircleSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Percentage (%)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setDiscountType('fixed')}
                >
                  <View style={styles.radioCircle}>
                    {discountType === 'fixed' && <View style={styles.radioCircleSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Fixed Amount ($)</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Discount Value</Text>
                <TextInput
                  style={styles.input}
                  placeholder={discountType === 'percentage' ? '0' : '$0.00'}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={discountValue.toString()}
                  onChangeText={(text) => setDiscountValue(parseFloat(text) || 0)}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowDiscountModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => {
                  if (discountType === 'percentage') {
                    setDiscountAmount((subtotal * discountValue) / 100);
                  } else {
                    setDiscountAmount(discountValue);
                  }
                  setShowDiscountModal(false);
                }}
              >
                <Text style={styles.modalButtonPrimaryText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Area Wizard */}
      <AddAreaWizard
        visible={showAreaWizard}
        onClose={() => setShowAreaWizard(false)}
        onAddArea={handleAddArea}
      />

      {/* Present / Public URL Modal */}
      <Modal
        visible={showUrlModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUrlModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Present Proposal</Text>
              <TouchableOpacity onPress={() => setShowUrlModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.presentDescription}>
                Share this public link with your customer or open it on another device to present your proposal in person.
              </Text>

              <View style={styles.urlContainer}>
                <Text style={styles.urlLabel}>Public URL:</Text>
                <View style={styles.urlBox}>
                  <Text style={styles.urlText} numberOfLines={1}>
                    {getPublicUrl()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.presentButton} onPress={handleCopyUrl}>
                <Copy size={20} color="#6366F1" />
                <Text style={styles.presentButtonText}>Copy URL</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.presentButtonPrimary} onPress={handleOpenPublicUrl}>
                <Monitor size={20} color="#FFFFFF" />
                <Text style={styles.presentButtonPrimaryText}>Open in Browser</Text>
              </TouchableOpacity>

              <View style={styles.presentInfo}>
                <Text style={styles.presentInfoText}>
                  💡 This URL will show your proposal in a clean, customer-friendly format without any editing controls.
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowUrlModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Proposal Modal - Comprehensive */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        onRequestClose={() => setShowSendModal(false)}
      >
        <SafeAreaView style={styles.sendModalContainer}>
          <View style={styles.sendModalHeader}>
            <TouchableOpacity onPress={() => setShowSendModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.sendModalTitle}>Send Proposal</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.sendModalContent} showsVerticalScrollIndicator={false}>
            {/* Send Method */}
            <View style={styles.sendModalSection}>
              <Text style={styles.sendModalSectionTitle}>Send Via</Text>
              <View style={styles.sendMethodOptions}>
                <TouchableOpacity 
                  style={[styles.sendMethodButton, sendViaEmail && styles.sendMethodButtonActive]}
                  onPress={() => setSendViaEmail(!sendViaEmail)}
                >
                  <Mail size={20} color={sendViaEmail ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.sendMethodButtonText,
                    sendViaEmail && styles.sendMethodButtonTextActive
                  ]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sendMethodButton, sendViaText && styles.sendMethodButtonActive]}
                  onPress={() => setSendViaText(!sendViaText)}
                >
                  <MessageSquare size={20} color={sendViaText ? '#FFFFFF' : '#8B5CF6'} />
                  <Text style={[
                    styles.sendMethodButtonText,
                    sendViaText && styles.sendMethodButtonTextActive
                  ]}>Text</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recipients */}
            <View style={styles.sendModalSection}>
              <Text style={styles.sendModalSectionTitle}>
                {isBusiness ? 'Recipients (Select Stakeholders)' : 'Recipient'}
              </Text>
              
              {isBusiness && stakeholders.length > 0 ? (
                <View style={styles.stakeholderSelectionList}>
                  {stakeholders.map((stakeholder) => {
                    const isSelected = selectedStakeholderIds.includes(stakeholder.id);
                    const isPrimary = stakeholder.id === primaryContactId;
                    
                    return (
                      <TouchableOpacity
                        key={stakeholder.id}
                        style={[
                          styles.stakeholderSelectionCard,
                          isSelected && styles.stakeholderSelectionCardActive
                        ]}
                        onPress={() => handleToggleStakeholder(stakeholder.id)}
                      >
                        <View style={styles.stakeholderSelectionMain}>
                          <View style={[
                            styles.stakeholderCheckbox,
                            isSelected && styles.stakeholderCheckboxActive
                          ]}>
                            {isSelected && <Check size={16} color="#FFFFFF" />}
                          </View>
                          <View style={styles.stakeholderSelectionInfo}>
                            <View style={styles.stakeholderSelectionNameRow}>
                              <Text style={styles.stakeholderSelectionName}>{stakeholder.name}</Text>
                              {isPrimary && (
                                <View style={styles.primaryBadgeSmall}>
                                  <Star size={10} color="#F59E0B" fill="#F59E0B" />
                                  <Text style={styles.primaryBadgeTextSmall}>Primary</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.stakeholderSelectionRole}>{stakeholder.role}</Text>
                            <Text style={styles.stakeholderSelectionEmail}>{stakeholder.email}</Text>
                            {stakeholder.receiveProposals && (
                              <View style={styles.receivesProposalsBadgeSmall}>
                                <Text style={styles.receivesProposalsTextSmall}>Usually receives proposals</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.recipientCard}>
                  <View style={styles.recipientIcon}>
                    <User size={20} color="#6366F1" />
                  </View>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientName}>{contactName}</Text>
                    <Text style={styles.recipientEmail}>{contactEmail}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Email Message Preview */}
            {sendViaEmail && (
              <View style={styles.sendModalSection}>
                <View style={styles.messagePreviewHeader}>
                  <Text style={styles.sendModalSectionTitle}>Email Message Preview</Text>
                  <TouchableOpacity 
                    style={styles.editMessageButton}
                    onPress={() => {
                      if (!editingEmailMessage && !customEmailBody) {
                        setCustomEmailBody(`Hi${isBusiness ? ' there' : ` ${contactName}`},\n\nPlease find your proposal for ${title || 'your project'}.\n\nTotal Amount: ${formatCurrency(totalAmount)}\n\nYou can view and accept your proposal here:\n{proposal-link}\n\nThank you for your business!`);
                      }
                      setEditingEmailMessage(!editingEmailMessage);
                    }}
                  >
                    <Text style={styles.editMessageButtonText}>
                      {editingEmailMessage ? 'Cancel' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.emailPreviewCard}>
                  {editingEmailMessage ? (
                    <View style={styles.messageEditMode}>
                      <View style={styles.editFieldGroup}>
                        <Text style={styles.editFieldLabel}>Subject:</Text>
                        <TextInput
                          style={styles.editFieldInput}
                          value={messageSubject}
                          onChangeText={setMessageSubject}
                          placeholder="Email subject"
                        />
                      </View>
                      <View style={styles.editFieldGroup}>
                        <Text style={styles.editFieldLabel}>Message:</Text>
                        <TextInput
                          style={[styles.editFieldInput, styles.editFieldTextarea]}
                          value={customEmailBody}
                          onChangeText={setCustomEmailBody}
                          placeholder="Email message"
                          multiline
                          numberOfLines={8}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.saveEditButton}
                        onPress={() => setEditingEmailMessage(false)}
                      >
                        <Text style={styles.saveEditButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.emailPreviewHeader}>
                        <Mail size={18} color="#6366F1" />
                        <Text style={styles.emailPreviewSubject}>{messageSubject}</Text>
                      </View>
                      <View style={styles.emailPreviewBody}>
                        <Text style={styles.emailPreviewText}>
                          {customEmailBody || `Hi${isBusiness ? ' there' : ` ${contactName}`},\n\nPlease find your proposal for ${title || 'your project'}.\n\nTotal Amount: ${formatCurrency(totalAmount)}\n\nYou can view and accept your proposal here:\n{proposal-link}\n\nThank you for your business!`}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Text Message Preview */}
            {sendViaText && (
              <View style={styles.sendModalSection}>
                <View style={styles.messagePreviewHeader}>
                  <Text style={styles.sendModalSectionTitle}>Text Message Preview</Text>
                  <TouchableOpacity 
                    style={styles.editMessageButton}
                    onPress={() => {
                      if (!editingTextMessage && !customTextBody) {
                        setCustomTextBody(`Hi${isBusiness ? '' : ` ${contactName.split(' ')[0]}`}, your proposal for ${formatCurrency(totalAmount)} is ready. View & accept: {proposal-link}`);
                      }
                      setEditingTextMessage(!editingTextMessage);
                    }}
                  >
                    <Text style={styles.editMessageButtonText}>
                      {editingTextMessage ? 'Cancel' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.textPreviewCard}>
                  {editingTextMessage ? (
                    <View style={styles.messageEditMode}>
                      <View style={styles.editFieldGroup}>
                        <Text style={styles.editFieldLabel}>Message:</Text>
                        <TextInput
                          style={[styles.editFieldInput, styles.editFieldTextarea]}
                          value={customTextBody}
                          onChangeText={setCustomTextBody}
                          placeholder="Text message"
                          multiline
                          numberOfLines={4}
                        />
                        <Text style={styles.textPreviewCount}>
                          {customTextBody.length} characters
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.saveEditButton}
                        onPress={() => setEditingTextMessage(false)}
                      >
                        <Text style={styles.saveEditButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.textPreviewHeader}>
                        <MessageSquare size={18} color="#8B5CF6" />
                        <Text style={styles.textPreviewLabel}>SMS</Text>
                      </View>
                      <View style={styles.textPreviewBody}>
                        <Text style={styles.textPreviewText}>
                          {customTextBody || `Hi${isBusiness ? '' : ` ${contactName.split(' ')[0]}`}, your proposal for ${formatCurrency(totalAmount)} is ready. View & accept: {proposal-link}`}
                        </Text>
                        <Text style={styles.textPreviewCount}>
                          {(customTextBody || `Hi${isBusiness ? '' : ` ${contactName.split(' ')[0]}`}, your proposal for ${formatCurrency(totalAmount)} is ready. View & accept: {proposal-link}`).length} characters
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Send Timing Section */}
            <View style={styles.sendModalSection}>
              <Text style={styles.sendModalSectionTitle}>Send Timing</Text>
              <View style={styles.sendTimingOptions}>
                <TouchableOpacity 
                  style={[
                    styles.sendTimingOption,
                    sendNow && styles.sendTimingOptionActive
                  ]}
                  onPress={() => {
                    setSendNow(true);
                    setSelectedPreset(null);
                    setScheduledSendDate(null);
                  }}
                >
                  <Send size={16} color={sendNow ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.sendTimingOptionText,
                    sendNow && styles.sendTimingOptionTextActive
                  ]}>Send Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sendTimingOption,
                    !sendNow && styles.sendTimingOptionActive
                  ]}
                  onPress={() => setSendNow(false)}
                >
                  <Clock size={16} color={!sendNow ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.sendTimingOptionText,
                    !sendNow && styles.sendTimingOptionTextActive
                  ]}>Schedule</Text>
                </TouchableOpacity>
              </View>
              
              {!sendNow && (
                <View style={styles.scheduleSection}>
                  <Text style={styles.scheduleSectionLabel}>Select Time</Text>
                  <View style={styles.schedulePresets}>
                    {getSchedulingPresets().map((preset) => (
                      <TouchableOpacity
                        key={preset.id}
                        style={[
                          styles.schedulePresetButton,
                          selectedPreset === preset.id && styles.schedulePresetButtonActive
                        ]}
                        onPress={() => {
                          setSelectedPreset(preset.id);
                          setScheduledSendDate(preset.date);
                        }}
                      >
                        <Text style={[
                          styles.schedulePresetText,
                          selectedPreset === preset.id && styles.schedulePresetTextActive
                        ]}>{preset.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.customDateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar size={18} color="#6366F1" />
                    <Text style={styles.customDateButtonText}>
                      {scheduledSendDate && !selectedPreset
                        ? `${formatDate(scheduledSendDate)} at ${formatTime(scheduledSendDate)}`
                        : 'Custom Date & Time'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.sendModalFooter}>
            <TouchableOpacity
              style={styles.sendModalButtonSecondary}
              onPress={() => setShowSendModal(false)}
            >
              <Text style={styles.sendModalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendModalButtonPrimary}
              onPress={handleSendProposal}
              disabled={!sendViaEmail && !sendViaText}
            >
              <Send size={18} color="#FFFFFF" />
              <Text style={styles.sendModalButtonPrimaryText}>
                {sendNow ? 'Send Now' : 'Schedule Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <SafeAreaView style={styles.contactModalContainer}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.contactModalHeader}>
            <TouchableOpacity onPress={() => setShowContactModal(false)} style={styles.backButton}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.contactModalTitle}>Customer Details</Text>
            <View style={{ width: 40 }} />
          </LinearGradient>

          <ScrollView style={styles.contactModalContent}>
            {/* Avatar and Name */}
            <View style={styles.contactModalAvatar}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>
                  {contactName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </View>
              <Text style={styles.contactModalName}>{contactName}</Text>
              {contactPhone && (
                <Text style={styles.contactModalSubtext}>{contactPhone}</Text>
              )}
              <Text style={styles.contactModalSubtext}>{contactEmail}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.contactModalActions}>
              <TouchableOpacity style={styles.contactModalActionButton}>
                <PhoneCall size={22} color="#6366F1" />
                <Text style={styles.contactModalActionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactModalActionButton}>
                <Mail size={22} color="#6366F1" />
                <Text style={styles.contactModalActionText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactModalActionButton}>
                <MapPin size={22} color="#6366F1" />
                <Text style={styles.contactModalActionText}>Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactModalActionButton}>
                <MessageSquare size={22} color="#6366F1" />
                <Text style={styles.contactModalActionText}>Text</Text>
              </TouchableOpacity>
            </View>

            {/* Customer Information */}
            <View style={styles.contactModalSection}>
              <Text style={styles.contactModalSectionTitle}>Contact Information</Text>
              <View style={styles.contactInfoCard}>
                {businessName && (
                  <View style={styles.contactInfoRow}>
                    <Building2 size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Business</Text>
                      <Text style={styles.contactInfoValue}>{businessName}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.contactInfoRow}>
                  <User size={20} color="#6366F1" />
                  <View style={styles.contactInfoTextContainer}>
                    <Text style={styles.contactInfoLabel}>Name</Text>
                    <Text style={styles.contactInfoValue}>{contactName}</Text>
                  </View>
                </View>
                <View style={styles.contactInfoRow}>
                  <Mail size={20} color="#6366F1" />
                  <View style={styles.contactInfoTextContainer}>
                    <Text style={styles.contactInfoLabel}>Email</Text>
                    <Text style={styles.contactInfoValue}>{contactEmail}</Text>
                  </View>
                </View>
                {contactPhone && (
                  <View style={styles.contactInfoRow}>
                    <Phone size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Phone</Text>
                      <Text style={styles.contactInfoValue}>{contactPhone}</Text>
                    </View>
                  </View>
                )}
                {billingAddress && (
                  <View style={styles.contactInfoRow}>
                    <MapPin size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Billing Address</Text>
                      <Text style={styles.contactInfoValue}>{billingAddress}</Text>
                    </View>
                  </View>
                )}
                {jobAddress && jobAddress !== billingAddress && (
                  <View style={styles.contactInfoRow}>
                    <MapPin size={20} color="#8B5CF6" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Job Address</Text>
                      <Text style={styles.contactInfoValue}>{jobAddress}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Business Stakeholders */}
            {isBusiness && stakeholders && stakeholders.length > 0 && (
              <View style={styles.contactModalSection}>
                <Text style={styles.contactModalSectionTitle}>Business Stakeholders</Text>
                <View style={styles.stakeholdersList}>
                  {stakeholders.map((stakeholder) => (
                    <View key={stakeholder.id} style={styles.stakeholderCard}>
                      <View style={styles.stakeholderMain}>
                        <View style={styles.stakeholderAvatar}>
                          <Text style={styles.stakeholderInitials}>
                            {stakeholder.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </Text>
                        </View>
                        <View style={styles.stakeholderInfo}>
                          <View style={styles.stakeholderNameRow}>
                            <Text style={styles.stakeholderName}>{stakeholder.name}</Text>
                            {stakeholder.id === primaryContactId && (
                              <View style={styles.primaryBadge}>
                                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                              </View>
                            )}
                          </View>
                          <Text style={styles.stakeholderRole}>{stakeholder.role}</Text>
                          <Text style={styles.stakeholderEmail}>{stakeholder.email}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Related Deals */}
            {relatedDealId && (
              <View style={styles.contactModalSection}>
                <Text style={styles.contactModalSectionTitle}>Related Deals</Text>
                <TouchableOpacity 
                  style={styles.dealCard}
                  onPress={() => {
                    if (relatedDealId) {
                      router.push('/(tabs)/team-chat');
                      setShowContactModal(false);
                    }
                  }}
                >
                  <View style={styles.dealHeader}>
                    <View style={styles.dealIconContainer}>
                      <Building2 size={20} color="#6366F1" />
                    </View>
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealTitle}>{relatedDealTitle || 'Related Deal'}</Text>
                      <Text style={styles.dealStage}>{relatedDealStage || 'In Progress'}</Text>
                    </View>
                  </View>
                  <View style={styles.dealMeta}>
                    <View style={styles.dealMetaItem}>
                      <DollarSign size={16} color="#10B981" />
                      <Text style={styles.dealMetaText}>
                        {formatCurrency(relatedDealAmount || totalAmount)}
                      </Text>
                    </View>
                    {relatedDealProbability && (
                      <View style={styles.dealMetaItem}>
                        <TrendingUp size={16} color="#6366F1" />
                        <Text style={styles.dealMetaText}>{relatedDealProbability}% Probability</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* View Contact Card Button */}
            <View style={styles.contactModalFooter}>
              <TouchableOpacity style={styles.viewContactButton}>
                <UserCircle size={20} color="#6366F1" />
                <Text style={styles.viewContactButtonText}>View Full Contact Card</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Job Information Edit Modal */}
      <Modal
        visible={showJobInfoModal}
        animationType="slide"
        onRequestClose={() => setShowJobInfoModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowJobInfoModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Job Information</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentInner} showsVerticalScrollIndicator={false}>
            {/* Street Address Line 1 */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Street Address</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'addressLine1' && styles.inputContainerFocused
              ]}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={editAddressLine1}
                  onChangeText={setEditAddressLine1}
                  placeholder="Street address"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('addressLine1')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Street Address Line 2 (Optional) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Apt, Suite, etc. (Optional)</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'addressLine2' && styles.inputContainerFocused
              ]}>
                <MapPin size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={editAddressLine2}
                  onChangeText={setEditAddressLine2}
                  placeholder="Apartment, suite, unit, etc."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('addressLine2')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* City, State, Postal in a row */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>City, State, ZIP</Text>
              <View style={styles.addressRowContainer}>
                {/* City */}
                <View style={[styles.addressFieldContainer, { flex: 2 }]}>
                  <TextInput
                    style={styles.addressInput}
                    value={editCity}
                    onChangeText={setEditCity}
                    placeholder="City"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                {/* State */}
                <View style={[styles.addressFieldContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.addressInput}
                    value={editState}
                    onChangeText={setEditState}
                    placeholder="State"
                    placeholderTextColor="#9CA3AF"
                    maxLength={2}
                  />
                </View>
                
                {/* ZIP */}
                <View style={[styles.addressFieldContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.addressInput}
                    value={editPostalCode}
                    onChangeText={setEditPostalCode}
                    placeholder="ZIP"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            </View>

            {/* Salesperson */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Salesperson</Text>
              <View style={[
                styles.inputContainer,
                (focusedInput === 'salesperson' || showSalespersonDropdown) && styles.inputContainerFocused
              ]}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={salespersonSearch}
                  onChangeText={(text) => {
                    setSalespersonSearch(text);
                    setShowSalespersonDropdown(true);
                  }}
                  placeholder="Search or select salesperson"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => {
                    setFocusedInput('salesperson');
                    setShowSalespersonDropdown(true);
                  }}
                  onBlur={() => {
                    setFocusedInput(null);
                    // Delay to allow dropdown selection
                    setTimeout(() => setShowSalespersonDropdown(false), 200);
                  }}
                />
              </View>
              
              {/* Salesperson Dropdown */}
              {showSalespersonDropdown && filteredSalespeople.length > 0 && (
                <ScrollView 
                  style={styles.salespersonDropdown}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredSalespeople.map((person, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.salespersonDropdownItem,
                        index === filteredSalespeople.length - 1 && { borderBottomWidth: 0 }
                      ]}
                      onPress={() => {
                        setEditSalesperson(person);
                        setSalespersonSearch(person);
                        setShowSalespersonDropdown(false);
                      }}
                    >
                      <User size={16} color="#6B7280" />
                      <Text style={styles.salespersonDropdownText}>{person}</Text>
                      {editSalesperson === person && (
                        <Check size={16} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Job Type */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Job Type</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'jobType' && styles.inputContainerFocused
              ]}>
                <FileText size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={editJobType}
                  onChangeText={setEditJobType}
                  placeholder="Enter job type"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('jobType')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Estimated Start Date */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Estimated Start Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowJobStartDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.datePickerButtonText}>
                  {editStartDate ? formatDate(editStartDate.toISOString()) : 'Select estimated start date'}
                </Text>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
              {showJobStartDatePicker && (
                <DateTimePicker
                  value={editStartDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowJobStartDatePicker(false);
                    if (selectedDate) {
                      setEditStartDate(selectedDate);
                    }
                  }}
                />
              )}
              {editStartDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setEditStartDate(null)}
                >
                  <Text style={styles.clearDateButtonText}>Clear Start Date</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Estimated End Date */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Estimated End Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowJobCompletionDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.datePickerButtonText}>
                  {editCompletionDate ? formatDate(editCompletionDate.toISOString()) : 'Select estimated end date'}
                </Text>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
              {showJobCompletionDatePicker && (
                <DateTimePicker
                  value={editCompletionDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowJobCompletionDatePicker(false);
                    if (selectedDate) {
                      setEditCompletionDate(selectedDate);
                    }
                  }}
                />
              )}
              {editCompletionDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setEditCompletionDate(null)}
                >
                  <Text style={styles.clearDateButtonText}>Clear End Date</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handleSaveJobInfo}
            >
              <Text style={styles.modalActionButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Terms & Conditions Selection Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.termsModal}>
            <View style={styles.termsModalHeader}>
              <Text style={styles.termsModalTitle}>Select Terms & Conditions</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.termsModalContent}>
              {termsTemplates.map((template) => (
                <TouchableOpacity
                  key={template.name}
                  style={[
                    styles.termsTemplateOption,
                    selectedTermsTemplate === template.name && styles.termsTemplateOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedTermsTemplate(template.name);
                    setTerms(template.content);
                    setShowTermsModal(false);
                  }}
                >
                  <View style={styles.termsTemplateHeader}>
                    <Shield size={20} color={selectedTermsTemplate === template.name ? "#6366F1" : "#6B7280"} />
                    <Text style={[
                      styles.termsTemplateName,
                      selectedTermsTemplate === template.name && styles.termsTemplateNameSelected
                    ]}>{template.name}</Text>
                    {selectedTermsTemplate === template.name && (
                      <Check size={20} color="#6366F1" />
                    )}
                  </View>
                  <Text style={styles.termsTemplatePreview} numberOfLines={2}>{template.content}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.termsModalFooter}>
              <TouchableOpacity 
                style={styles.termsModalButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.termsModalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deal Command Center */}
      <DealCommandCenter
        visible={showCommandCenter}
        onClose={() => setShowCommandCenter(false)}
        dealData={relatedDeal}
      />

      {/* Date Picker for Send Scheduling */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerModalOverlay}>
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.datePickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.datePickerTitle}>Select Date & Time</Text>
                  <TouchableOpacity onPress={() => {
                    setShowDatePicker(false);
                    setSelectedPreset(null);
                  }}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={scheduledSendDate || new Date()}
                  mode="datetime"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setScheduledSendDate(date);
                  }}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={scheduledSendDate || new Date()}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setScheduledSendDate(date);
                setSelectedPreset(null);
              }
            }}
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  headerActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 48,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    gap: 4,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height: 48,
  },
  tabActive: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  tabContent: {
    gap: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonSecondaryText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  lineItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  optionalItem: {
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderStyle: 'dashed',
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lineItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  lineItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  lineItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineItemText: {
    fontSize: 14,
    color: '#6B7280',
  },
  lineItemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  optionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 16,
  },
  optionalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  summarySection: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  summaryOptional: {
    color: '#F59E0B',
  },
  summaryDiscount: {
    color: '#10B981',
  },
  summaryTotal: {
    borderTopWidth: 2,
    borderTopColor: '#C7D2FE',
    marginTop: 8,
    paddingTop: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
  },
  summaryDeposit: {
    borderTopWidth: 1,
    borderTopColor: '#C7D2FE',
    marginTop: 8,
    paddingTop: 8,
  },
  summaryDepositLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  summaryDepositValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  discountButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  addIconButton: {
    padding: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  milestoneAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerValue: {
    fontSize: 16,
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroupHalf: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D5DB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#6366F1',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioLabel: {
    fontSize: 16,
    color: '#111827',
  },
  // Preview Mode Styles
  previewHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewCompanyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewProposalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  previewContactName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewBusinessName: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  previewValidUntil: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    fontWeight: '600',
  },
  previewLineItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  previewNotes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  previewTerms: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  previewPaymentTerms: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  // Present Modal Styles
  presentDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  urlContainer: {
    marginBottom: 16,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  urlBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  urlText: {
    fontSize: 14,
    color: '#6366F1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  presentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 12,
  },
  presentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  presentButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  presentButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  presentInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  presentInfoText: {
    fontSize: 13,
    color: '#15803D',
    lineHeight: 18,
  },
  scheduleJobBanner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  scheduleJobContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleJobText: {
    flex: 1,
  },
  scheduleJobTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  scheduleJobDescription: {
    fontSize: 13,
    color: '#78350F',
  },
  // Header enhancements
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Scheduled Banner
  scheduledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
    gap: 12,
  },
  scheduledBannerContent: {
    flex: 1,
  },
  scheduledBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  scheduledBannerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  scheduledBannerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  // Stakeholders Tab Styles
  stakeholdersList: {
    gap: 12,
  },
  stakeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stakeholderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stakeholderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakeholderAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  stakeholderInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stakeholderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stakeholderInfo: {
    flex: 1,
  },
  stakeholderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stakeholderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  stakeholderRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stakeholderEmail: {
    fontSize: 14,
    color: '#374151',
  },
  stakeholderPhone: {
    fontSize: 14,
    color: '#374151',
  },
  stakeholderContactInfo: {
    gap: 4,
    marginBottom: 12,
  },
  primaryBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeTextSmall: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
  },
  receivesProposalsBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  receivesProposalsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  receivesProposalsBadgeSmall: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  receivesProposalsTextSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  stakeholderActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  stakeholderActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  stakeholderActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  stakeholderActionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  stakeholderMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stakeholderMenuText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  // Info Tab Styles - Contact Info
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactInfoText: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  // Info Tab Styles - Job Info
  jobInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  jobInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobInfoContent: {
    flex: 1,
  },
  jobInfoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  jobInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  // Enhanced Add Item Modal Styles
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  inputFocused: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  quickSelectToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginTop: 8,
  },
  quickSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  dropdownItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  currencyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  taxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taxHelpText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  taxPercentDisplay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  itemTotalPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemTotalRowFinal: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
    marginTop: 8,
    paddingTop: 12,
  },
  itemTotalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemTotalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemTotalLabelFinal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemTotalValueFinal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  // Payment Settings Styles
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  paymentOptionFee: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  paymentOptionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 44,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  paymentOptionSubLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Send Modal Styles
  sendModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  sendModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sendModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sendModalContent: {
    flex: 1,
  },
  sendModalSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  sendModalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sendMethodOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sendMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  sendMethodButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  sendMethodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendMethodButtonTextActive: {
    color: '#FFFFFF',
  },
  stakeholderSelectionList: {
    gap: 12,
  },
  stakeholderSelectionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  stakeholderSelectionCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  stakeholderSelectionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stakeholderCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakeholderCheckboxActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  stakeholderSelectionInfo: {
    flex: 1,
  },
  stakeholderSelectionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stakeholderSelectionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  stakeholderSelectionRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stakeholderSelectionEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  recipientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  recipientEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  messagePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  editMessageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  editMessageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  emailPreviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emailPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emailPreviewSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emailPreviewBody: {
    paddingTop: 12,
  },
  emailPreviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },
  textPreviewCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  textPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textPreviewLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  textPreviewBody: {
  },
  textPreviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 8,
  },
  textPreviewCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageEditMode: {
    gap: 16,
  },
  editFieldGroup: {
    gap: 8,
  },
  editFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  editFieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  editFieldTextarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveEditButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveEditButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sendTimingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sendTimingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  sendTimingOptionActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  sendTimingOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendTimingOptionTextActive: {
    color: '#FFFFFF',
  },
  scheduleSection: {
    marginTop: 16,
    gap: 12,
  },
  scheduleSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  schedulePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  schedulePresetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  schedulePresetButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  schedulePresetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  schedulePresetTextActive: {
    color: '#6366F1',
  },
  customDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  customDateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  sendModalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sendModalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  sendModalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendModalButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
  },
  sendModalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Contact Modal Styles
  contactModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contactModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactModalContent: {
    flex: 1,
  },
  contactModalAvatar: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactModalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  contactModalSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  contactModalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  contactModalActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  contactModalActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  contactModalSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  contactModalSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  contactInfoCard: {
    gap: 12,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactInfoTextContainer: {
    flex: 1,
  },
  contactInfoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  contactInfoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  dealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealInfo: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  dealStage: {
    fontSize: 14,
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
  contactModalFooter: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  viewContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  viewContactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  bottomSpacing: {
    height: 40,
  },
  // Date Picker Modal Styles
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  datePickerDone: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  // Job Info Edit Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalContent: {
    flex: 1,
  },
  modalContentInner: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  editIconButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  datePickerButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  clearDateButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearDateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  modalActionButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addressRowContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addressFieldContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  addressInput: {
    fontSize: 15,
    color: '#111827',
  },
  salespersonDropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 250,
  },
  salespersonDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  salespersonDropdownText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  // Related Deal Card Styles
  relatedDealCard: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  relatedDealGradient: {
    padding: 20,
  },
  relatedDealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  relatedDealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  relatedDealStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  relatedDealValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  relatedDealAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Financing Info Box
  financingInfoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  financingInfoText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  // Notes Tab Enhanced Styles
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  noteSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  templateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  templateDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  templateItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  templateItemText: {
    fontSize: 14,
    color: '#374151',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  richTextArea: {
    minHeight: 120,
    fontSize: 15,
    color: '#111827',
    padding: 16,
    textAlignVertical: 'top',
  },
  noteFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  // Comments Styles
  commentsContainer: {
    flex: 1,
    padding: 16,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  commentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },
  sendCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCommentButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  // Feedback Styles
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  feedbackCardResolved: {
    borderLeftColor: '#10B981',
    opacity: 0.7,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  feedbackTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  feedbackPendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
  },
  feedbackPendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  feedbackResolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
  },
  feedbackResolvedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  resolveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Terms Card Styles
  termsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  termsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  termsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  termsCardPreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  termsCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  termsCardViewText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  addTermsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginTop: 12,
  },
  addTermsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Terms Modal Styles
  termsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    marginTop: 'auto',
  },
  termsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  termsModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  termsModalContent: {
    padding: 20,
  },
  termsTemplateOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  termsTemplateOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F3FF',
  },
  termsTemplateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  termsTemplateName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  termsTemplateNameSelected: {
    color: '#6366F1',
  },
  termsTemplatePreview: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  termsModalButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  termsModalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

