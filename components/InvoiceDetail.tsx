import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  User,
  FileText,
  CreditCard,
  MessageSquare,
  Paperclip,
  Settings,
  Edit,
  Send,
  BellRing,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Building2,
  Percent,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react-native';

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
            style={styles.moreButton}
            onPress={() => setShowActionsModal(true)}
          >
            <View style={styles.moreButtonDot} />
            <View style={styles.moreButtonDot} />
            <View style={styles.moreButtonDot} />
          </TouchableOpacity>
        </View>

        {/* Status Badges */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(invoice.status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
              {invoice.status.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(invoice.paymentStatus) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(invoice.paymentStatus) }]}>
              {invoice.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <tab.icon size={16} color={activeTab === tab.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.tabContentContainer}>
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

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionButton}>
                  <CreditCard size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Collect Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <BellRing size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Send Reminder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Download size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Download PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <FileText size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>View Proposal</Text>
                </TouchableOpacity>
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
  moreButton: {
    padding: 8,
    flexDirection: 'row',
    gap: 3,
  },
  moreButtonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabsContainer: {
    maxHeight: 48,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
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
});

