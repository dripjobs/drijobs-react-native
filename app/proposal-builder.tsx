import { AddAreaWizard } from '@/components/AddAreaWizard';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Clock,
    Copy,
    Edit3,
    Eye,
    FileText,
    MessageSquare,
    Monitor,
    Package,
    Paperclip,
    Percent,
    Plus,
    Presentation,
    Send,
    Settings,
    Shield,
    Target,
    Trash2
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

export default function ProposalBuilder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse proposal data from params if editing
  const proposalId = params.id as string | undefined;
  const isEditing = !!proposalId;
  const proposalStatus = (params.status as string) || 'draft'; // Get status from params
  const isScheduled = (params.isScheduled as string) === 'true'; // Get scheduled status from params
  
  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'notes' | 'comments' | 'activity' | 'video' | 'presentation'>('overview');
  
  // Public URL state
  const [showUrlModal, setShowUrlModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [crewNotes, setCrewNotes] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  // Line items state
  const [lineItems, setLineItems] = useState<ProposalLineItem[]>([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isAddingOptionalItem, setIsAddingOptionalItem] = useState(false);

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
  const subtotal = standardItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const optionalSubtotal = optionalItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = 0; // TODO: Calculate based on settings
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
    // TODO: Implement send logic
    Alert.alert('Send Proposal', 'Are you sure you want to send this proposal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => console.log('Proposal sent') },
    ]);
  };
  
  const addLineItem = () => {
    setIsAddingOptionalItem(false);
    setShowAddItemModal(true);
  };
  
  const addOptionalItem = () => {
    setIsAddingOptionalItem(true);
    setShowAddItemModal(true);
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
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'notes', label: 'Notes', icon: FileText },
      { id: 'comments', label: 'Comments', icon: MessageSquare },
      { id: 'activity', label: 'Activity', icon: Clock },
      { id: 'video', label: 'Video', icon: Paperclip },
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
        <Text style={styles.sectionTitle}>Terms and Conditions</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter your terms and conditions..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          value={terms}
          onChangeText={setTerms}
          textAlignVertical="top"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add any additional notes or special instructions..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
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
          <Text style={styles.inputLabel}>Contact Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact name"
            placeholderTextColor="#9CA3AF"
            value={contactName}
            onChangeText={setContactName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter business name (optional)"
            placeholderTextColor="#9CA3AF"
            value={businessName}
            onChangeText={setBusinessName}
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

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Payment Terms</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerValue}>{paymentTerms}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNotesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Crew Notes (Shows on Work Order)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Notes for the crew that will appear on the work order..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={crewNotes}
            onChangeText={setCrewNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Company Notes (Internal)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Internal notes for your team..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={companyNotes}
            onChangeText={setCompanyNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Client Notes (Shows on Proposal)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Notes that will be visible to the client on the proposal..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={clientNotes}
            onChangeText={setClientNotes}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderCommentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comments</Text>
        <View style={styles.emptyState}>
          <MessageSquare size={40} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No comments yet</Text>
        </View>
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
      case 'settings':
        return renderSettingsTab();
      case 'notes':
        return renderNotesTab();
      case 'comments':
        return renderCommentsTab();
      case 'activity':
        return renderActivityTab();
      case 'video':
        return renderVideoTab();
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
          <View style={styles.headerSpacer} />
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

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter item description"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Unit Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
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
                onPress={() => {
                  // TODO: Add item logic
                  setShowAddItemModal(false);
                }}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
});

