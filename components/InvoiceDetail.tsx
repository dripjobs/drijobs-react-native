import { LinearGradient } from 'expo-linear-gradient';
import {
    AlertCircle,
    BellRing,
    Building2,
    CheckCircle2,
    ChevronLeft,
    Copy,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    Eye,
    FileText,
    Mail,
    MapPin,
    MessageSquare,
    MoreVertical,
    Navigation,
    Paperclip,
    Percent,
    Phone,
    Plus,
    Send,
    Settings,
    Trash2,
    User,
    UserCircle,
    XCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoicePayment {
  amount: number;
  method: string;
  status: string;
  processedAt: string;
  transactionId?: string;
}

interface InvoiceAttachment {
  name: string;
  size: string;
  url: string;
}

interface InvoiceNote {
  content: string;
  createdBy: string;
  createdAt: string;
}

interface InvoiceSettings {
  allowCardPayment: boolean;
  waiveCardConvenienceFee: boolean;
  allowBankPayment: boolean;
  alternativePayment: boolean;
  lineItemQuantityOnly: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  subject: string;
  status: string;
  paymentStatus: string;
  issueDate: string;
  dueDate: string;
  createdBy: string;
  sentAt?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  payments: InvoicePayment[];
  attachments: InvoiceAttachment[];
  notes: InvoiceNote[];
  settings: InvoiceSettings;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  businessName?: string;
  businessAddress?: string;
}

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onUpdate: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'items' | 'attachments' | 'notes' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>(invoice.discountAmount.toString());
  const [sendMethod, setSendMethod] = useState<'email' | 'text'>('email');
  const [messageSubject, setMessageSubject] = useState(`Invoice ${invoice.invoiceNumber} - ${invoice.subject}`);
  const [messageBody, setMessageBody] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6B7280';
      case 'sent': return '#3B82F6';
      case 'viewed': return '#F59E0B';
      case 'paid': return '#10B981';
      case 'overdue': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'draft': return '#F3F4F6';
      case 'sent': return '#DBEAFE';
      case 'viewed': return '#FEF3C7';
      case 'paid': return '#D1FAE5';
      case 'overdue': return '#FEE2E2';
      case 'cancelled': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return FileText;
      case 'sent': return Send;
      case 'viewed': return Eye;
      case 'paid': return CheckCircle2;
      case 'overdue': return AlertCircle;
      case 'cancelled': return XCircle;
      default: return FileText;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'sent': return 'Sent';
      case 'viewed': return 'Viewed';
      case 'paid': return 'Paid';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * parseFloat(discountValue || '0')) / 100;
    }
    return parseFloat(discountValue || '0');
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + invoice.taxAmount;
  };

  const handleApplyDiscount = () => {
    Alert.alert('Success', 'Discount applied successfully');
    setShowDiscountModal(false);
  };

  const handleSendInvoice = () => {
    Alert.alert('Success', 'Invoice sent successfully');
    setShowSendModal(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'items', label: 'Items', icon: DollarSign },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleToggleActionMenu = (item: string) => {
    setExpandedActionItem(expandedActionItem === item ? null : item);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{invoice.invoiceNumber}</Text>
            <Text style={styles.headerSubtitle}>{invoice.subject}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactIconButton}
            onPress={() => setShowContactModal(true)}
          >
            <UserCircle size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={styles.statusBadgeWrapper}>
            {React.createElement(getStatusIcon(invoice.paymentStatus), { 
              size: 18, 
              color: '#FFFFFF' 
            })}
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>{getStatusLabel(invoice.paymentStatus)}</Text>
            </View>
          </View>
          {invoice.balanceDue > 0 && invoice.paymentStatus !== 'paid' && (
            <View style={styles.amountDueWrapper}>
              <Text style={styles.amountDueLabel}>Amount Due</Text>
              <Text style={styles.amountDueValue}>{formatCurrency(invoice.balanceDue)}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Tabs - White Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <tab.icon size={16} color={activeTab === tab.id ? '#6366F1' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.tabContentContainer}>
            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionCollect]}
                  onPress={() => setShowPaymentModal(true)}
                >
                  <CreditCard size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Collect Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickActionButton, styles.quickActionReminder]}>
                  <BellRing size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Send Reminder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickActionButton, styles.quickActionProposal]}>
                  <Eye size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>View Proposal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionRequest]}
                  onPress={() => setShowSendModal(true)}
                >
                  <DollarSign size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Request Payment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              
              {/* Customer Name */}
              <View style={styles.contactItem}>
                <User size={16} color="#6B7280" />
                <Text style={styles.contactItemText}>{invoice.contactName}</Text>
                <TouchableOpacity 
                  style={styles.contactMenuButton}
                  onPress={() => handleToggleActionMenu('name')}
                >
                  <MoreVertical size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {expandedActionItem === 'name' && (
                <View style={styles.inlineActionMenu}>
                  <TouchableOpacity style={styles.inlineActionItem}>
                    <Copy size={16} color="#6B7280" />
                    <Text style={styles.inlineActionText}>Copy Name</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Business Name */}
              {invoice.businessName && (
                <>
                  <View style={styles.contactItem}>
                    <Building2 size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>{invoice.businessName}</Text>
                    <TouchableOpacity 
                      style={styles.contactMenuButton}
                      onPress={() => handleToggleActionMenu('business')}
                    >
                      <MoreVertical size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {expandedActionItem === 'business' && (
                    <View style={styles.inlineActionMenu}>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <Copy size={16} color="#6B7280" />
                        <Text style={styles.inlineActionText}>Copy Business Name</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {/* Email */}
              <View style={styles.contactItem}>
                <Mail size={16} color="#6B7280" />
                <Text style={styles.contactItemText}>{invoice.contactEmail}</Text>
                <TouchableOpacity 
                  style={styles.contactMenuButton}
                  onPress={() => handleToggleActionMenu('email')}
                >
                  <MoreVertical size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {expandedActionItem === 'email' && (
                <View style={styles.inlineActionMenu}>
                  <TouchableOpacity style={styles.inlineActionItem}>
                    <Mail size={16} color="#6366F1" />
                    <Text style={styles.inlineActionText}>Send Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inlineActionItem}>
                    <Copy size={16} color="#6B7280" />
                    <Text style={styles.inlineActionText}>Copy Email</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Phone */}
              {invoice.contactPhone && (
                <>
                  <View style={styles.contactItem}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>{invoice.contactPhone}</Text>
                    <TouchableOpacity 
                      style={styles.contactMenuButton}
                      onPress={() => handleToggleActionMenu('phone')}
                    >
                      <MoreVertical size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {expandedActionItem === 'phone' && (
                    <View style={styles.inlineActionMenu}>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <Phone size={16} color="#10B981" />
                        <Text style={styles.inlineActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <MessageSquare size={16} color="#3B82F6" />
                        <Text style={styles.inlineActionText}>Text</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <Copy size={16} color="#6B7280" />
                        <Text style={styles.inlineActionText}>Copy Phone</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {/* Address */}
              {invoice.businessAddress && (
                <>
                  <View style={styles.contactItem}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.contactItemText}>{invoice.businessAddress}</Text>
                    <TouchableOpacity 
                      style={styles.contactMenuButton}
                      onPress={() => handleToggleActionMenu('address')}
                    >
                      <MoreVertical size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {expandedActionItem === 'address' && (
                    <View style={styles.inlineActionMenu}>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <Navigation size={16} color="#EF4444" />
                        <Text style={styles.inlineActionText}>Navigate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.inlineActionItem}>
                        <Copy size={16} color="#6B7280" />
                        <Text style={styles.inlineActionText}>Copy Address</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Invoice Items */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Invoice Items</Text>
                {isEditing && (
                  <TouchableOpacity style={styles.addButton}>
                    <Plus size={16} color="#6366F1" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.itemsList}>
                {invoice.items.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      {isEditing && (
                        <TouchableOpacity style={styles.deleteButton}>
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemDetailText}>
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </Text>
                      <Text style={styles.itemTotal}>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Summary */}
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
                </View>

                {invoice.discountAmount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discountValue]}>
                      -{formatCurrency(invoice.discountAmount)}
                    </Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.totalAmount)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                  <Text style={[styles.summaryValue, styles.paidValue]}>
                    {formatCurrency(invoice.amountPaid)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Balance Due</Text>
                  <Text style={[styles.summaryValue, styles.dueValue]}>
                    {formatCurrency(invoice.balanceDue)}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.discountButton}
                  onPress={() => setShowDiscountModal(true)}
                >
                  <Percent size={16} color="#6366F1" />
                  <Text style={styles.discountButtonText}>
                    {invoice.discountAmount > 0 ? 'Edit Discount' : 'Add Discount'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Invoice Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invoice Details</Text>
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issue Date</Text>
                  <Text style={styles.detailValue}>{formatDate(invoice.issueDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created By</Text>
                  <Text style={styles.detailValue}>{invoice.createdBy}</Text>
                </View>
                {invoice.sentAt && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sent</Text>
                    <Text style={styles.detailValue}>{formatDate(invoice.sentAt)}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <View style={styles.customerCard}>
                {invoice.businessName && (
                  <View style={styles.customerRow}>
                    <Building2 size={16} color="#6B7280" />
                    <Text style={styles.customerText}>{invoice.businessName}</Text>
                  </View>
                )}
                <View style={styles.customerRow}>
                  <User size={16} color="#6B7280" />
                  <Text style={styles.customerText}>{invoice.contactName}</Text>
                </View>
                <View style={styles.customerRow}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.customerText}>{invoice.contactEmail}</Text>
                </View>
                {invoice.contactPhone && (
                  <View style={styles.customerRow}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.customerText}>{invoice.contactPhone}</Text>
                  </View>
                )}
                {invoice.businessAddress && (
                  <View style={styles.customerRow}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.customerText}>{invoice.businessAddress}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'payments' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment History</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowPaymentModal(true)}
                >
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {invoice.payments.length === 0 ? (
                <View style={styles.emptyState}>
                  <CreditCard size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No payments recorded yet</Text>
                </View>
              ) : (
                <View style={styles.paymentsList}>
                  {invoice.payments.map((payment, index) => (
                    <View key={index} style={styles.paymentCard}>
                      <View style={styles.paymentHeader}>
                        <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                        <View style={[styles.paymentStatusBadge, { backgroundColor: getStatusBgColor(payment.status) }]}>
                          <Text style={[styles.paymentStatusText, { color: getStatusColor(payment.status) }]}>
                            {payment.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.paymentMethod}>{payment.method}</Text>
                      <Text style={styles.paymentDate}>{formatDate(payment.processedAt)}</Text>
                      {payment.transactionId && (
                        <Text style={styles.paymentRef}>Ref: {payment.transactionId}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'items' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Invoice Items</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.itemsList}>
                {invoice.items.map((item, index) => (
                  <View key={index} style={styles.editableItemCard}>
                    <View style={styles.itemCardHeader}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <View style={styles.itemActions}>
                        <TouchableOpacity style={styles.iconButton}>
                          <Edit size={16} color="#6366F1" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.itemDetailsRow}>
                      <Text style={styles.itemDetailLabel}>Quantity: {item.quantity}</Text>
                      <Text style={styles.itemDetailLabel}>
                        Unit Price: {formatCurrency(item.unitPrice)}
                      </Text>
                    </View>
                    <View style={styles.itemTotalRow}>
                      <Text style={styles.itemTotalLabel}>Total</Text>
                      <Text style={styles.itemTotalAmount}>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'attachments' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Attachments</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {invoice.attachments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Paperclip size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No attachments uploaded yet</Text>
                </View>
              ) : (
                <View style={styles.attachmentsList}>
                  {invoice.attachments.map((attachment, index) => (
                    <View key={index} style={styles.attachmentCard}>
                      <View style={styles.attachmentIcon}>
                        <Paperclip size={20} color="#6366F1" />
                      </View>
                      <View style={styles.attachmentInfo}>
                        <Text style={styles.attachmentName}>{attachment.name}</Text>
                        <Text style={styles.attachmentSize}>{attachment.size}</Text>
                      </View>
                      <View style={styles.attachmentActions}>
                        <TouchableOpacity style={styles.iconButton}>
                          <Download size={16} color="#6366F1" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'notes' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {invoice.notes.length === 0 ? (
                <View style={styles.emptyState}>
                  <MessageSquare size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No notes added yet</Text>
                </View>
              ) : (
                <View style={styles.notesList}>
                  {invoice.notes.map((note, index) => (
                    <View key={index} style={styles.noteCard}>
                      <Text style={styles.noteContent}>{note.content}</Text>
                      <View style={styles.noteMeta}>
                        <Text style={styles.noteAuthor}>{note.createdBy}</Text>
                        <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invoice Settings</Text>
              <View style={styles.settingsCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Allow Card Payment</Text>
                    <Text style={styles.settingDescription}>
                      Enable credit card payments for this invoice
                    </Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <View style={invoice.settings.allowCardPayment ? styles.toggleOn : styles.toggleOff}>
                      <View style={styles.toggleCircle} />
                    </View>
                  </View>
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Waive Card Convenience Fee</Text>
                    <Text style={styles.settingDescription}>
                      Remove convenience fee for card payments
                    </Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <View style={invoice.settings.waiveCardConvenienceFee ? styles.toggleOn : styles.toggleOff}>
                      <View style={styles.toggleCircle} />
                    </View>
                  </View>
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Allow Bank (ACH) Payment</Text>
                    <Text style={styles.settingDescription}>
                      Enable bank transfer payments
                    </Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <View style={invoice.settings.allowBankPayment ? styles.toggleOn : styles.toggleOff}>
                      <View style={styles.toggleCircle} />
                    </View>
                  </View>
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Line Item Quantity Only</Text>
                    <Text style={styles.settingDescription}>
                      Show only quantities, not unit prices
                    </Text>
                  </View>
                  <View style={styles.settingToggle}>
                    <View style={invoice.settings.lineItemQuantityOnly ? styles.toggleOn : styles.toggleOff}>
                      <View style={styles.toggleCircle} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowSendModal(true)}
      >
        <Send size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Actions Modal */}
      <Modal
        visible={showActionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionsModal(false)}
        >
          <View style={styles.actionsModal}>
            <TouchableOpacity 
              style={styles.actionModalItem}
              onPress={() => {
                setShowActionsModal(false);
                setIsEditing(!isEditing);
              }}
            >
              <Edit size={20} color="#111827" />
              <Text style={styles.actionModalText}>{isEditing ? 'Cancel Edit' : 'Edit Invoice'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionModalItem}
              onPress={() => {
                setShowActionsModal(false);
                Alert.alert('Download', 'Downloading invoice...');
              }}
            >
              <Download size={20} color="#111827" />
              <Text style={styles.actionModalText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionModalItem, styles.actionModalItemDanger]}
              onPress={() => {
                setShowActionsModal(false);
                Alert.alert('Delete', 'Are you sure you want to delete this invoice?');
              }}
            >
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.actionModalText, styles.actionModalTextDanger]}>Delete Invoice</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Send Invoice Modal */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        onRequestClose={() => setShowSendModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSendModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Send Invoice</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Send Method */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Send Method</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setSendMethod('email')}
                >
                  <View style={styles.radio}>
                    {sendMethod === 'email' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setSendMethod('text')}
                >
                  <View style={styles.radio}>
                    {sendMethod === 'text' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Text Message</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recipients */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Recipient</Text>
              <View style={styles.recipientCard}>
                <View style={styles.recipientIcon}>
                  <User size={20} color="#6366F1" />
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{invoice.contactName}</Text>
                  <Text style={styles.recipientEmail}>{invoice.contactEmail}</Text>
                </View>
              </View>
            </View>

            {/* Message */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Subject</Text>
              <TextInput
                style={styles.input}
                value={messageSubject}
                onChangeText={setMessageSubject}
                placeholder="Invoice subject..."
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Message</Text>
              <TextInput
                style={styles.textArea}
                value={messageBody}
                onChangeText={setMessageBody}
                placeholder={`Hi ${invoice.contactName},\n\nPlease find attached invoice ${invoice.invoiceNumber}...`}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendInvoice}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Invoice</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Discount Modal */}
      <Modal
        visible={showDiscountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDiscountModal(false)}
      >
        <View style={styles.discountModalOverlay}>
          <View style={styles.discountModal}>
            <Text style={styles.discountModalTitle}>Apply Discount</Text>

            <View style={styles.discountSection}>
              <Text style={styles.discountLabel}>Discount Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setDiscountType('percentage')}
                >
                  <View style={styles.radio}>
                    {discountType === 'percentage' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Percentage (%)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setDiscountType('fixed')}
                >
                  <View style={styles.radio}>
                    {discountType === 'fixed' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Fixed Amount ($)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.discountSection}>
              <Text style={styles.discountLabel}>Discount Value</Text>
              <TextInput
                style={styles.input}
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.discountPreview}>
              <View style={styles.discountPreviewRow}>
                <Text style={styles.discountPreviewLabel}>Subtotal</Text>
                <Text style={styles.discountPreviewValue}>{formatCurrency(calculateSubtotal())}</Text>
              </View>
              <View style={styles.discountPreviewRow}>
                <Text style={styles.discountPreviewLabel}>Discount</Text>
                <Text style={styles.discountPreviewValue}>-{formatCurrency(calculateDiscount())}</Text>
              </View>
              <View style={styles.discountPreviewRow}>
                <Text style={styles.discountPreviewLabelBold}>New Total</Text>
                <Text style={styles.discountPreviewValueBold}>{formatCurrency(calculateTotal())}</Text>
              </View>
            </View>

            <View style={styles.discountModalButtons}>
              <TouchableOpacity 
                style={styles.discountCancelButton}
                onPress={() => setShowDiscountModal(false)}
              >
                <Text style={styles.discountCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.discountApplyButton}
                onPress={handleApplyDiscount}
              >
                <Text style={styles.discountApplyText}>Apply Discount</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.discountModalOverlay}>
          <View style={styles.discountModal}>
            <Text style={styles.discountModalTitle}>Record Payment</Text>
            <Text style={styles.paymentModalSubtitle}>
              Payment collection form will be implemented
            </Text>
            <View style={styles.discountModalButtons}>
              <TouchableOpacity 
                style={[styles.discountCancelButton, { flex: 1 }]}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.discountCancelText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
            {/* Customer Information */}
            <View style={styles.contactModalSection}>
              <Text style={styles.contactModalSectionTitle}>Contact Information</Text>
              <View style={styles.contactInfoCard}>
                <View style={styles.contactInfoRow}>
                  <User size={20} color="#6366F1" />
                  <View style={styles.contactInfoTextContainer}>
                    <Text style={styles.contactInfoLabel}>Name</Text>
                    <Text style={styles.contactInfoValue}>{invoice.contactName}</Text>
                  </View>
                </View>
                <View style={styles.contactInfoRow}>
                  <Mail size={20} color="#6366F1" />
                  <View style={styles.contactInfoTextContainer}>
                    <Text style={styles.contactInfoLabel}>Email</Text>
                    <Text style={styles.contactInfoValue}>{invoice.contactEmail}</Text>
                  </View>
                </View>
                {invoice.contactPhone && (
                  <View style={styles.contactInfoRow}>
                    <Phone size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Phone</Text>
                      <Text style={styles.contactInfoValue}>{invoice.contactPhone}</Text>
                    </View>
                  </View>
                )}
                {invoice.businessName && (
                  <View style={styles.contactInfoRow}>
                    <Building2 size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Business</Text>
                      <Text style={styles.contactInfoValue}>{invoice.businessName}</Text>
                    </View>
                  </View>
                )}
                {invoice.businessAddress && (
                  <View style={styles.contactInfoRow}>
                    <MapPin size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Address</Text>
                      <Text style={styles.contactInfoValue}>{invoice.businessAddress}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Deal Information */}
            <View style={styles.contactModalSection}>
              <Text style={styles.contactModalSectionTitle}>Deal Information</Text>
              <View style={styles.dealInfoCard}>
                <View style={styles.dealInfoRow}>
                  <Text style={styles.dealInfoLabel}>Invoice Number</Text>
                  <Text style={styles.dealInfoValue}>{invoice.invoiceNumber}</Text>
                </View>
                <View style={styles.dealInfoRow}>
                  <Text style={styles.dealInfoLabel}>Status</Text>
                  <Text style={styles.dealInfoValue}>{invoice.status.toUpperCase()}</Text>
                </View>
                <View style={styles.dealInfoRow}>
                  <Text style={styles.dealInfoLabel}>Issue Date</Text>
                  <Text style={styles.dealInfoValue}>{formatDate(invoice.issueDate)}</Text>
                </View>
                <View style={styles.dealInfoRow}>
                  <Text style={styles.dealInfoLabel}>Due Date</Text>
                  <Text style={styles.dealInfoValue}>{formatDate(invoice.dueDate)}</Text>
                </View>
                <View style={styles.dealInfoRow}>
                  <Text style={styles.dealInfoLabel}>Total Amount</Text>
                  <Text style={[styles.dealInfoValue, { fontWeight: '700' }]}>{formatCurrency(invoice.totalAmount)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  contactIconButton: {
    padding: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  statusBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  amountDueWrapper: {
    alignItems: 'flex-end',
  },
  amountDueLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  amountDueValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
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
  tabContentContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  discountValue: {
    color: '#10B981',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
  },
  paidValue: {
    color: '#10B981',
  },
  dueValue: {
    color: '#EF4444',
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  discountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  customerText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
  },
  paymentsList: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  paymentRef: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editableItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemDetailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  itemTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  itemTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  itemTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  attachmentsList: {
    gap: 12,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  attachmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  notesList: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteContent: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  noteAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  noteDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  settingToggle: {
    width: 52,
    height: 32,
  },
  toggleOn: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggleOff: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  actionModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionModalItemDanger: {
    borderBottomWidth: 0,
  },
  actionModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionModalTextDanger: {
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
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
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioLabel: {
    fontSize: 14,
    color: '#111827',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recipientEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 150,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discountModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  discountModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  discountModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  discountSection: {
    marginBottom: 20,
  },
  discountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  discountPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  discountPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  discountPreviewLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  discountPreviewValue: {
    fontSize: 14,
    color: '#111827',
  },
  discountPreviewLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  discountPreviewValueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  discountModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  discountCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  discountCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  discountApplyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  discountApplyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paymentModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionCollect: {
    backgroundColor: '#10B981',
  },
  quickActionReminder: {
    backgroundColor: '#F59E0B',
  },
  quickActionProposal: {
    backgroundColor: '#6366F1',
  },
  quickActionRequest: {
    backgroundColor: '#8B5CF6',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Contact Items
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItemText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  contactMenuButton: {
    padding: 4,
  },
  inlineActionMenu: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    marginLeft: 28,
    marginBottom: 8,
  },
  inlineActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inlineActionText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  // Contact Modal
  contactModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contactModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  contactModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactModalContent: {
    flex: 1,
    padding: 20,
  },
  contactModalSection: {
    marginBottom: 24,
  },
  contactModalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  contactInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactInfoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  dealInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  dealInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dealInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  dealInfoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    textAlign: 'right',
  },
});

