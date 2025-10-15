import { formatScheduledTime, getSchedulingPresets } from '@/utils/schedulingPresets';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Bell,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    Edit2,
    Eye,
    FileText,
    Link2,
    List,
    Mail,
    MapPin,
    MessageSquare,
    Monitor,
    MoreHorizontal,
    Paperclip,
    Percent,
    Phone,
    PhoneCall,
    Plus,
    RefreshCw,
    Send,
    Settings,
    Star,
    Trash2,
    TrendingUp,
    User,
    UserCircle,
    Users,
    X,
    XCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
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

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  receiveInvoices?: boolean;
}

interface ReminderRule {
  id: string;
  days: number;
  timing: 'before' | 'after';
  sendVia: 'email' | 'text' | 'both';
}

interface PaymentRequest {
  id: string;
  amount: number;
  status: 'pending' | 'sent' | 'paid';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  dueDate?: string;
  type: 'full' | 'partial' | 'percentage';
  percentage?: number;
}

interface JobInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  salesperson: string;
  startDate: string;  // Read-only (from job schedule)
  endDate?: string;   // Read-only (from job schedule)
  crew?: string;
  teamMembers?: Array<{name: string, role: string}>;
}

interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  icon: 'send' | 'payment' | 'edit' | 'view' | 'receipt' | 'request';
}

interface ManualRecipient {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  scheduledSendDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  proposalDiscountAmount?: number;
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
  isBusiness?: boolean;
  primaryContactId?: string;
  stakeholders?: Stakeholder[];
  billingAddress?: string;
  jobAddress?: string;
  relatedDealId?: string;
  relatedDealTitle?: string;
  relatedDealStage?: string;
  relatedDealAmount?: number;
  relatedDealProbability?: number;
  relatedProposalId?: string;
  relatedProposalNumber?: string;
  paymentRequest?: PaymentRequest; // Single request (backward compatibility, shown in banner)
  paymentRequests?: PaymentRequest[]; // Multiple requests (managed in Payments tab)
  jobInfo?: JobInfo;
  activityLog?: ActivityLogItem[];
}

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onUpdate: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onBack, onUpdate }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'items' | 'stakeholders' | 'integrations' | 'activity' | 'attachments' | 'notes' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPresentModal, setShowPresentModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showJobInfoModal, setShowJobInfoModal] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showPaymentRequestDueDatePicker, setShowPaymentRequestDueDatePicker] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(new Date(invoice.dueDate));
  const [paymentRequestDueDate, setPaymentRequestDueDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  );
  
  // Job Info editing state
  const [editAddressLine1, setEditAddressLine1] = useState(invoice.jobInfo?.addressLine1 || '');
  const [editAddressLine2, setEditAddressLine2] = useState(invoice.jobInfo?.addressLine2 || '');
  const [editCity, setEditCity] = useState(invoice.jobInfo?.city || '');
  const [editState, setEditState] = useState(invoice.jobInfo?.state || '');
  const [editPostalCode, setEditPostalCode] = useState(invoice.jobInfo?.postalCode || '');
  const [editSalesperson, setEditSalesperson] = useState(invoice.jobInfo?.salesperson || '');
  const [editStartDate, setEditStartDate] = useState<Date>(
    invoice.jobInfo?.startDate ? new Date(invoice.jobInfo.startDate) : new Date()
  );
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(
    invoice.jobInfo?.endDate ? new Date(invoice.jobInfo.endDate) : undefined
  );
  const [editCrew, setEditCrew] = useState(invoice.jobInfo?.crew || '');
  const [editTeamMembers, setEditTeamMembers] = useState<Array<{name: string, role: string}>>(
    invoice.jobInfo?.teamMembers || []
  );
  const [showJobStartDatePicker, setShowJobStartDatePicker] = useState(false);
  const [showJobEndDatePicker, setShowJobEndDatePicker] = useState(false);
  const [jobAssignmentType, setJobAssignmentType] = useState<'crew' | 'individual'>(
    invoice.jobInfo?.crew ? 'crew' : 'individual'
  );
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  
  // Payment request settings
  const [paymentRequestSettings, setPaymentRequestSettings] = useState({
    allowCreditCard: true,
    waiveCreditCardFee: false,
    allowACH: true,
    waiveACHFee: false,
    allowOfflinePayment: true,
  });
  
  // Invoice payment settings
  const [invoicePaymentSettings, setInvoicePaymentSettings] = useState({
    allowCreditCard: invoice.settings.allowCardPayment,
    waiveCreditCardFee: invoice.settings.waiveCardConvenienceFee,
    allowACH: invoice.settings.allowBankPayment,
    waiveACHFee: false,
    allowOfflinePayment: invoice.settings.alternativePayment,
  });
  
  // Add recipient dropdown
  const [showAddRecipientDropdown, setShowAddRecipientDropdown] = useState(false);
  
  // Reminder system state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  
  // Inline editing state
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editItemDescription, setEditItemDescription] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [editItemUnitPrice, setEditItemUnitPrice] = useState('');
  
  // Preview device type
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>(invoice.discountAmount.toString());
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaText, setSendViaText] = useState(false);
  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState<string[]>(
    invoice.stakeholders ? [invoice.primaryContactId || invoice.stakeholders[0].id] : []
  );
  const [messageSubject, setMessageSubject] = useState(`Invoice ${invoice.invoiceNumber} - ${invoice.subject}`);
  const [messageBody, setMessageBody] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Payment Request State
  const [showPaymentRequestModal, setShowPaymentRequestModal] = useState(false);
  const [paymentRequestStep, setPaymentRequestStep] = useState<1 | 2>(1);
  const [paymentRequestType, setPaymentRequestType] = useState<'full' | 'partial' | 'percentage'>('full');
  const [paymentRequestAmount, setPaymentRequestAmount] = useState('');
  const [paymentRequestPercentage, setPaymentRequestPercentage] = useState('100');
  
  // Send Later State
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  // Manual Recipients State
  const [manualRecipients, setManualRecipients] = useState<ManualRecipient[]>([]);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState('');
  
  // Message Editing State
  const [editingEmailMessage, setEditingEmailMessage] = useState(false);
  const [editingTextMessage, setEditingTextMessage] = useState(false);
  const [customEmailBody, setCustomEmailBody] = useState('');
  const [customTextBody, setCustomTextBody] = useState('');
  
  // Payment Requests State (multiple requests)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(
    invoice.paymentRequests || []
  );
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<PaymentRequest | null>(null);
  const [markAsPaidAmount, setMarkAsPaidAmount] = useState('');
  const [markAsPaidMethod, setMarkAsPaidMethod] = useState('Credit Card');
  const [markAsPaidDate, setMarkAsPaidDate] = useState(new Date());
  const [markAsPaidTransactionId, setMarkAsPaidTransactionId] = useState('');
  
  // Stakeholder State
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptSendViaEmail, setReceiptSendViaEmail] = useState(true);
  const [receiptSendViaText, setReceiptSendViaText] = useState(false);
  
  // Payment Success State
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [lastProcessedPayment, setLastProcessedPayment] = useState<InvoicePayment | null>(null);
  
  // Edit Payment State
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('Credit Card');
  const [editPaymentDate, setEditPaymentDate] = useState(new Date());
  const [editPaymentTransactionId, setEditPaymentTransactionId] = useState('');
  const [showEditPaymentDatePicker, setShowEditPaymentDatePicker] = useState(false);
  
  // Add Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState('');
  const [newItemTax, setNewItemTax] = useState('');
  const [showItemNameDropdown, setShowItemNameDropdown] = useState(false);
  
  // Payment Collection State
  const [paymentCollectionType, setPaymentCollectionType] = useState<'choice' | 'log' | 'card'>('choice');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'check' | 'cash' | 'venmo' | 'cashapp' | 'other'>('cash');
  const [otherPaymentMethod, setOtherPaymentMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [sendReceipt, setSendReceipt] = useState(true);
  const [receiptViaEmail, setReceiptViaEmail] = useState(true);
  const [receiptViaText, setReceiptViaText] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Local invoice items state for real-time updates
  const [localInvoiceItems, setLocalInvoiceItems] = useState<InvoiceItem[]>(invoice.items);
  const [localPayments, setLocalPayments] = useState<InvoicePayment[]>(invoice.payments);

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${dateStr} at ${timeStr}`;
  };

  const calculateSubtotal = () => {
    return localInvoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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
  
  const calculateAmountPaid = () => {
    return localPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };
  
  const calculateBalanceDue = () => {
    return calculateTotal() - calculateAmountPaid();
  };
  
  const handleAddItem = () => {
    if (!newItemDescription || !newItemQuantity || !newItemUnitPrice) {
      Alert.alert('Error', 'Please fill in all item fields');
      return;
    }
    
    const newItem: InvoiceItem = {
      description: newItemDescription,
      quantity: parseFloat(newItemQuantity),
      unitPrice: parseFloat(newItemUnitPrice),
    };
    
    setLocalInvoiceItems([...localInvoiceItems, newItem]);
    
    // Reset form
    setNewItemDescription('');
    setNewItemQuantity('1');
    setNewItemUnitPrice('');
    setShowAddItemModal(false);
    
    Alert.alert('Success', 'Line item added successfully');
  };
  
  const handleDeleteItem = (index: number) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedItems = localInvoiceItems.filter((_, i) => i !== index);
            setLocalInvoiceItems(updatedItems);
          },
        },
      ]
    );
  };
  
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };
  
  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };
  
  const getPaymentMethodLabel = () => {
    if (manualPaymentMethod === 'other') {
      return otherPaymentMethod || 'Other';
    }
    return manualPaymentMethod.charAt(0).toUpperCase() + manualPaymentMethod.slice(1);
  };
  
  const generateReceiptMessage = () => {
    const amount = parseFloat(paymentAmount);
    const paymentMethod = getPaymentMethodLabel();
    const newBalance = Math.max(0, calculateBalanceDue() - amount);
    
    return {
      subject: `Payment Receipt - Invoice ${invoice.invoiceNumber}`,
      body: `Hi ${invoice.contactName},

Thank you for your payment!

Payment Details:
• Amount Received: ${formatCurrency(amount)}
• Payment Method: ${paymentMethod}
• Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Invoice Information:
• Invoice Number: ${invoice.invoiceNumber}
• Invoice Total: ${formatCurrency(calculateTotal())}
• Previous Balance: ${formatCurrency(calculateBalanceDue())}
• New Balance: ${formatCurrency(newBalance)}

${newBalance > 0 ? `Remaining balance due: ${formatCurrency(newBalance)}` : 'Your invoice is now paid in full. Thank you!'}

${paymentNotes ? `\nNotes: ${paymentNotes}` : ''}

If you have any questions about this payment, please don't hesitate to contact us.

Best regards`,
    };
  };
  
  const handleLogPayment = async () => {
    // Validation
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    const balanceDue = calculateBalanceDue();
    
    if (amount > balanceDue) {
      Alert.alert('Error', `Payment amount cannot exceed balance due of ${formatCurrency(balanceDue)}`);
      return;
    }
    
    if (manualPaymentMethod === 'other' && !otherPaymentMethod) {
      Alert.alert('Error', 'Please specify the payment method');
      return;
    }
    
    // If user wants to send receipt, show preview first
    if (sendReceipt && (receiptViaEmail || receiptViaText)) {
      setShowReceiptPreview(true);
      return;
    }
    
    // Otherwise, log payment directly
    await completePaymentLogging();
  };
  
  const completePaymentLogging = async () => {
    const amount = parseFloat(paymentAmount);
    const paymentMethod = getPaymentMethodLabel();
    
    const newPayment: InvoicePayment = {
      amount: amount,
      method: paymentMethod,
      status: 'completed',
      processedAt: new Date().toISOString(),
      transactionId: 'PMT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
    
    setLocalPayments([...localPayments, newPayment]);
    
    // Reset form and close modal - return to invoice
    resetPaymentForm();
    setShowPaymentModal(false);
    setShowReceiptPreview(false);
    
    // Switch to payments tab to show the logged payment
    setActiveTab('payments');
    
    Alert.alert('Success', 'Payment has been logged successfully');
  };
  
  const handleProcessPayment = async () => {
    // Validation
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }
    
    if (!cardExpiry || cardExpiry.length < 5) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (!cardCvc || cardCvc.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVC');
      return;
    }
    
    if (!cardholderName) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    const balanceDue = calculateBalanceDue();
    
    if (amount > balanceDue) {
      Alert.alert('Error', `Payment amount cannot exceed balance due of ${formatCurrency(balanceDue)}`);
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Simulate Stripe payment processing
      // In production, you would call your backend API which communicates with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPayment: InvoicePayment = {
        amount: amount,
        method: 'Credit Card',
        status: 'completed',
        processedAt: new Date().toISOString(),
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      };
      
      setLocalPayments([...localPayments, newPayment]);
      setLastProcessedPayment(newPayment);
      
      // Reset form and close payment modal
      resetPaymentForm();
      setShowPaymentModal(false);
      
      // Show success screen with receipt option
      setShowPaymentSuccess(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const resetPaymentForm = () => {
    setPaymentAmount('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardholderName('');
    setManualPaymentMethod('cash');
    setOtherPaymentMethod('');
    setPaymentNotes('');
    setSendReceipt(true);
    setReceiptViaEmail(true);
    setReceiptViaText(false);
    setPaymentCollectionType('choice');
  };
  
  const handleClosePaymentModal = () => {
    resetPaymentForm();
    setShowPaymentModal(false);
    setShowReceiptPreview(false);
  };

  const handleApplyDiscount = () => {
    Alert.alert('Success', 'Discount applied successfully');
    setShowDiscountModal(false);
  };
  
  // New helper functions for invoice improvements
  const handleCopyInvoiceLink = () => {
    const invoiceUrl = `https://app.dripjobs.com/invoices/view/${invoice.invoiceNumber}`;
    // In production, use Clipboard API: Clipboard.setString(invoiceUrl);
    Alert.alert('Link Copied', 'Invoice link copied to clipboard');
    setShowPresentModal(false);
  };
  
  const handlePresentInvoice = () => {
    const invoiceUrl = `https://app.dripjobs.com/invoices/view/${invoice.invoiceNumber}`;
    // In production: Linking.openURL(invoiceUrl);
    Alert.alert('Opening Invoice', 'Invoice will open in browser');
    setShowPresentModal(false);
  };
  
  const handleStartEditItem = (index: number) => {
    const item = localInvoiceItems[index];
    setEditingItemIndex(index);
    setEditItemDescription(item.description);
    setEditItemQuantity(item.quantity.toString());
    setEditItemUnitPrice(item.unitPrice.toString());
  };
  
  const handleSaveEditItem = () => {
    if (editingItemIndex === null) return;
    
    if (!editItemDescription || !editItemQuantity || !editItemUnitPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const quantity = parseFloat(editItemQuantity);
    const unitPrice = parseFloat(editItemUnitPrice);
    
    if (quantity <= 0 || unitPrice < 0) {
      Alert.alert('Error', 'Quantity must be greater than 0 and price cannot be negative');
      return;
    }
    
    const updatedItems = [...localInvoiceItems];
    updatedItems[editingItemIndex] = {
      description: editItemDescription,
      quantity,
      unitPrice,
    };
    
    setLocalInvoiceItems(updatedItems);
    setEditingItemIndex(null);
    Alert.alert('Success', 'Line item updated');
  };
  
  const handleCancelEditItem = () => {
    setEditingItemIndex(null);
    setEditItemDescription('');
    setEditItemQuantity('');
    setEditItemUnitPrice('');
  };
  
  const handleAddReminderRule = () => {
    if (reminderRules.length >= 3) {
      Alert.alert('Limit Reached', 'You can only have 3 reminder rules');
      return;
    }
    
    const newRule: ReminderRule = {
      id: Date.now().toString(),
      days: 5,
      timing: 'before',
      sendVia: 'email',
    };
    
    setReminderRules([...reminderRules, newRule]);
  };
  
  const handleDeleteReminderRule = (ruleId: string) => {
    setReminderRules(reminderRules.filter(rule => rule.id !== ruleId));
  };

  const handleToggleStakeholder = (stakeholderId: string) => {
    if (selectedStakeholderIds.includes(stakeholderId)) {
      // Don't allow deselecting if it's the only one selected
      if (selectedStakeholderIds.length > 1) {
        setSelectedStakeholderIds(selectedStakeholderIds.filter(id => id !== stakeholderId));
      }
    } else {
      setSelectedStakeholderIds([...selectedStakeholderIds, stakeholderId]);
    }
  };

  const handleSendInvoice = () => {
    const methods = [];
    if (sendViaEmail) methods.push('Email');
    if (sendViaText) methods.push('Text');
    
    const recipientCount = invoice.isBusiness ? selectedStakeholderIds.length : 1;
    const methodText = methods.join(' and ');
    
    Alert.alert(
      'Success',
      `Invoice sent via ${methodText} to ${recipientCount} recipient(s)`
    );
    setShowSendModal(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'items', label: 'Items', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    ...(invoice.isBusiness && invoice.stakeholders ? [{ id: 'stakeholders', label: 'Stakeholders', icon: Users }] : []),
    { id: 'integrations', label: 'Integrations', icon: RefreshCw },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleToggleActionMenu = (item: string) => {
    setExpandedActionItem(expandedActionItem === item ? null : item);
  };

  const handleEditPayment = (index: number) => {
    const payment = localPayments[index];
    setEditingPaymentIndex(index);
    setEditPaymentAmount(payment.amount.toString());
    setEditPaymentMethod(payment.method);
    setEditPaymentDate(new Date(payment.processedAt));
    setEditPaymentTransactionId(payment.transactionId || '');
    setShowEditPaymentModal(true);
  };

  const handleSaveEditedPayment = () => {
    if (editingPaymentIndex === null) return;
    
    const updatedPayments = [...localPayments];
    updatedPayments[editingPaymentIndex] = {
      ...updatedPayments[editingPaymentIndex],
      id: updatedPayments[editingPaymentIndex].id || `PAY-${Date.now()}`,
      amount: parseFloat(editPaymentAmount),
      method: editPaymentMethod,
      processedAt: editPaymentDate.toISOString(),
      transactionId: editPaymentTransactionId || undefined,
      processedBy: updatedPayments[editingPaymentIndex].processedBy || 'Current User',
      status: 'completed',
    };
    
    setLocalPayments(updatedPayments);
    
    Alert.alert('Success', 'Payment updated successfully');
    setShowEditPaymentModal(false);
    setEditingPaymentIndex(null);
  };

  const handleDeletePayment = (index: number) => {
    Alert.alert(
      'Delete Payment',
      'Are you sure you want to delete this payment? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPayments = localPayments.filter((_, i) => i !== index);
            setLocalPayments(updatedPayments);
            Alert.alert('Success', 'Payment deleted successfully');
          },
        },
      ]
    );
  };

  const handleEditJobInfo = () => {
    // Initialize edit state with current values
    if (invoice.jobInfo) {
      setEditAddressLine1(invoice.jobInfo.addressLine1 || '');
      setEditAddressLine2(invoice.jobInfo.addressLine2 || '');
      setEditCity(invoice.jobInfo.city || '');
      setEditState(invoice.jobInfo.state || '');
      setEditPostalCode(invoice.jobInfo.postalCode || '');
      setEditSalesperson(invoice.jobInfo.salesperson || '');
      setEditStartDate(invoice.jobInfo.startDate ? new Date(invoice.jobInfo.startDate) : new Date());
      setEditEndDate(invoice.jobInfo.endDate ? new Date(invoice.jobInfo.endDate) : undefined);
      setEditCrew(invoice.jobInfo.crew || '');
      setEditTeamMembers(invoice.jobInfo.teamMembers || []);
      setJobAssignmentType(invoice.jobInfo.crew ? 'crew' : 'individual');
    }
    setShowJobInfoModal(true);
  };

  const handleAddTeamMember = () => {
    Alert.alert('Add Team Member', 'This will sync from Job Schedule');
  };

  const handleRemoveTeamMember = (index: number) => {
    setEditTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveJobInfo = () => {
    // In production, this would update the backend
    Alert.alert('Success', 'Job information updated successfully');
    setShowJobInfoModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Scheduled Send Banner */}
      {invoice.scheduledSendDate && !invoice.sentAt && (
        <View style={styles.scheduledBanner}>
          <View style={styles.scheduledBannerContent}>
            <Clock size={18} color="#D97706" />
            <Text style={styles.scheduledBannerText}>
              Scheduled to send on {formatScheduledTime(new Date(invoice.scheduledSendDate))}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.scheduledBannerButton}
            onPress={() => {
              Alert.alert(
                'Cancel Scheduled Send',
                'Do you want to cancel the scheduled send?',
                [
                  { text: 'No', style: 'cancel' },
                  { text: 'Yes, Cancel', style: 'destructive' },
                ]
              );
            }}
          >
            <X size={16} color="#D97706" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{invoice.invoiceNumber}</Text>
            <Text style={styles.headerSubtitle}>
              {invoice.isBusiness && invoice.businessName ? invoice.businessName : invoice.subject}
            </Text>
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
          {calculateBalanceDue() > 0 && invoice.paymentStatus !== 'paid' && (
            <View style={styles.amountDueWrapper}>
              <Text style={styles.amountDueLabel}>Amount Due</Text>
              <Text style={styles.amountDueValue}>{formatCurrency(calculateBalanceDue())}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Payment Request Banner */}
      {invoice.paymentRequest && (
        <View style={styles.paymentRequestBanner}>
          <View style={styles.paymentRequestHeader}>
            <View style={styles.paymentRequestTitleRow}>
              <DollarSign size={20} color="#F59E0B" />
              <Text style={styles.paymentRequestTitle}>Payment Request</Text>
            </View>
            <View style={[
              styles.paymentRequestStatusBadge,
              invoice.paymentRequest.status === 'pending' && styles.paymentRequestStatusPending,
              invoice.paymentRequest.status === 'sent' && styles.paymentRequestStatusSent,
              invoice.paymentRequest.status === 'paid' && styles.paymentRequestStatusPaid
            ]}>
              <Text style={[
                styles.paymentRequestStatusText,
                invoice.paymentRequest.status === 'pending' && styles.paymentRequestStatusTextPending,
                invoice.paymentRequest.status === 'sent' && styles.paymentRequestStatusTextSent,
                invoice.paymentRequest.status === 'paid' && styles.paymentRequestStatusTextPaid
              ]}>
                {invoice.paymentRequest.status.charAt(0).toUpperCase() + invoice.paymentRequest.status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.paymentRequestContent}>
            <View style={styles.paymentRequestInfo}>
              <Text style={styles.paymentRequestAmount}>{formatCurrency(invoice.paymentRequest.amount)}</Text>
              {invoice.paymentRequest.sentAt && (
                <Text style={styles.paymentRequestDate}>
                  Sent: {formatDate(invoice.paymentRequest.sentAt)}
                </Text>
              )}
            </View>
            <View style={styles.paymentRequestActions}>
              <TouchableOpacity style={styles.paymentRequestButton}>
                <Text style={styles.paymentRequestButtonText}>View Details</Text>
              </TouchableOpacity>
              {invoice.paymentRequest.status === 'pending' && (
                <TouchableOpacity style={styles.paymentRequestButtonDanger}>
                  <Text style={styles.paymentRequestButtonDangerText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

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
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionRequest]}
                  onPress={() => setShowPaymentRequestModal(true)}
                >
                  <DollarSign size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Request Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionProposal]}
                  onPress={() => setShowPreviewModal(true)}
                >
                  <Eye size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.quickActionButton, 
                    styles.quickActionDeal,
                    !invoice.relatedDealId && styles.quickActionDisabled
                  ]}
                  onPress={() => {
                    if (invoice.relatedDealId) {
                      // Navigate to deal command center
                      router.push('/(tabs)/team-chat');
                      // Note: In production, this should navigate to specific deal
                      // router.push(`/(tabs)/team-chat?dealId=${invoice.relatedDealId}`);
                    }
                  }}
                  disabled={!invoice.relatedDealId}
                  activeOpacity={invoice.relatedDealId ? 0.7 : 1}
                >
                  <Briefcase size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>View Deal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.quickActionButton, 
                    styles.quickActionProposal,
                    !invoice.relatedProposalId && styles.quickActionDisabled
                  ]}
                  onPress={() => {
                    if (invoice.relatedProposalId) {
                      // Navigate to proposal builder
                      router.push(`/proposal-builder?id=${invoice.relatedProposalId}`);
                    }
                  }}
                  disabled={!invoice.relatedProposalId}
                  activeOpacity={invoice.relatedProposalId ? 0.7 : 1}
                >
                  <FileText size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>View Proposal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionMore]}
                  onPress={() => setShowPresentModal(true)}
                >
                  <MoreHorizontal size={20} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>More Actions</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>

              {/* Business Name */}
              {invoice.businessName && (
                <View style={styles.contactInfoRow}>
                  <Building2 size={18} color="#6B7280" />
                  <Text style={styles.contactInfoText}>{invoice.businessName}</Text>
                    </View>
              )}
              
              {/* Contact Name */}
              <View style={styles.contactInfoRow}>
                <User size={18} color="#6B7280" />
                <Text style={styles.contactInfoText}>{invoice.contactName}</Text>
              </View>

              {/* Email */}
              <View style={styles.contactInfoRow}>
                <Mail size={18} color="#6B7280" />
                <Text style={styles.contactInfoText}>{invoice.contactEmail}</Text>
              </View>

              {/* Phone */}
              {invoice.contactPhone && (
                <View style={styles.contactInfoRow}>
                  <Phone size={18} color="#6B7280" />
                  <Text style={styles.contactInfoText}>{invoice.contactPhone}</Text>
                    </View>
              )}

              {/* Address */}
              {invoice.jobAddress && (
                <View style={styles.contactInfoRow}>
                  <MapPin size={18} color="#6B7280" />
                  <Text style={styles.contactInfoText}>{invoice.jobAddress}</Text>
                    </View>
              )}
            </View>

            {/* Job Information */}
            {invoice.jobInfo && (
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
                  {/* Job Address */}
                  <View style={styles.jobInfoRow}>
                    <View style={styles.jobInfoIcon}>
                      <MapPin size={18} color="#6B7280" />
                    </View>
                    <View style={styles.jobInfoContent}>
                      <Text style={styles.jobInfoLabel}>Job Address</Text>
                      <Text style={styles.jobInfoValue}>
                        {invoice.jobInfo.addressLine1}
                        {invoice.jobInfo.addressLine2 && `, ${invoice.jobInfo.addressLine2}`}
                        {'\n'}
                        {invoice.jobInfo.city}, {invoice.jobInfo.state} {invoice.jobInfo.postalCode}
                      </Text>
                    </View>
                  </View>

                  {/* Salesperson */}
                  <View style={styles.jobInfoRow}>
                    <View style={styles.jobInfoIcon}>
                      <User size={18} color="#6B7280" />
                    </View>
                    <View style={styles.jobInfoContent}>
                      <Text style={styles.jobInfoLabel}>Salesperson</Text>
                      <Text style={styles.jobInfoValue}>{invoice.jobInfo.salesperson}</Text>
                    </View>
                  </View>

                  {/* Date Range */}
                  <View style={styles.jobInfoRow}>
                    <View style={styles.jobInfoIcon}>
                      <Calendar size={18} color="#6B7280" />
                    </View>
                    <View style={styles.jobInfoContent}>
                      <Text style={styles.jobInfoLabel}>Schedule</Text>
                      <Text style={styles.jobInfoValue}>
                        {invoice.jobInfo.startDate}
                        {invoice.jobInfo.endDate && ` - ${invoice.jobInfo.endDate}`}
                      </Text>
                    </View>
                  </View>

                  {/* Crew or Team Members */}
                  {invoice.jobInfo.crew && (
                    <View style={styles.jobInfoRow}>
                      <View style={styles.jobInfoIcon}>
                        <Users size={18} color="#6B7280" />
                      </View>
                      <View style={styles.jobInfoContent}>
                        <Text style={styles.jobInfoLabel}>Crew</Text>
                        <Text style={styles.jobInfoValue}>{invoice.jobInfo.crew}</Text>
                      </View>
                    </View>
                  )}
                  {invoice.jobInfo.teamMembers && invoice.jobInfo.teamMembers.length > 0 && (
                    <View style={styles.jobInfoRow}>
                      <View style={styles.jobInfoIcon}>
                        <Users size={18} color="#6B7280" />
                      </View>
                      <View style={styles.jobInfoContent}>
                        <Text style={styles.jobInfoLabel}>Team Members</Text>
                        {invoice.jobInfo.teamMembers.map((member, idx) => (
                          <Text key={idx} style={styles.jobInfoValue}>
                            {member.name} - {member.role}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Invoice Items */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Invoice Items</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAddItemModal(true)}
                >
                    <Plus size={16} color="#6366F1" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.itemsList}>
                {localInvoiceItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemCard}
                    onPress={() => editingItemIndex !== index && handleStartEditItem(index)}
                    activeOpacity={editingItemIndex === index ? 1 : 0.7}
                  >
                    {editingItemIndex === index ? (
                      // Edit Mode
                      <View style={styles.itemEditMode}>
                        <View style={styles.itemEditRow}>
                          <Text style={styles.itemEditLabel}>Description</Text>
                          <TextInput
                            style={styles.itemEditInput}
                            value={editItemDescription}
                            onChangeText={setEditItemDescription}
                            placeholder="Item description"
                          />
                        </View>
                        <View style={styles.itemEditRow}>
                          <View style={styles.itemEditHalf}>
                            <Text style={styles.itemEditLabel}>Quantity</Text>
                            <TextInput
                              style={styles.itemEditInput}
                              value={editItemQuantity}
                              onChangeText={setEditItemQuantity}
                              placeholder="1"
                              keyboardType="decimal-pad"
                            />
                          </View>
                          <View style={styles.itemEditHalf}>
                            <Text style={styles.itemEditLabel}>Unit Price</Text>
                            <View style={styles.itemEditCurrencyInput}>
                              <Text style={styles.currencySymbol}>$</Text>
                              <TextInput
                                style={[styles.itemEditInput, { flex: 1 }]}
                                value={editItemUnitPrice}
                                onChangeText={setEditItemUnitPrice}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                              />
                            </View>
                          </View>
                        </View>
                        <View style={styles.itemEditRow}>
                          <Text style={styles.itemEditTotal}>
                            Total: {formatCurrency((parseFloat(editItemQuantity) || 0) * (parseFloat(editItemUnitPrice) || 0))}
                          </Text>
                        </View>
                        <View style={styles.itemEditActions}>
                          <TouchableOpacity
                            style={styles.itemEditCancel}
                            onPress={handleCancelEditItem}
                          >
                            <X size={18} color="#EF4444" />
                            <Text style={styles.itemEditCancelText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.itemEditSave}
                            onPress={handleSaveEditItem}
                          >
                            <Check size={18} color="#FFFFFF" />
                            <Text style={styles.itemEditSaveText}>Save</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      // Display Mode
                      <>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(index);
                            }}
                          >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemDetailText}>
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </Text>
                      <Text style={styles.itemTotal}>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </Text>
                    </View>
                      </>
                    )}
                  </TouchableOpacity>
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
                    <View style={styles.discountLabelWrapper}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                      {invoice.proposalDiscountAmount && invoice.proposalDiscountAmount !== invoice.discountAmount && (
                        <Text style={styles.discountAuditText}>
                          (Original: {formatCurrency(invoice.proposalDiscountAmount)})
                        </Text>
                      )}
                    </View>
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
                    {formatCurrency(calculateAmountPaid())}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Balance Due</Text>
                  <Text style={[styles.summaryValue, styles.dueValue]}>
                    {formatCurrency(calculateBalanceDue())}
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

            {/* Invoice Reminders */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Invoice Reminders</Text>
                <TouchableOpacity 
                  style={styles.reminderToggleContainer}
                  onPress={() => setReminderEnabled(!reminderEnabled)}
                >
                  <View style={reminderEnabled ? styles.toggleOn : styles.toggleOff}>
                    <View style={styles.toggleCircle} />
                  </View>
                </TouchableOpacity>
              </View>

              {reminderEnabled ? (
                <View style={styles.reminderContent}>
                  {reminderRules.length === 0 ? (
                    <View style={styles.reminderEmptyState}>
                      <Bell size={32} color="#9CA3AF" />
                      <Text style={styles.reminderEmptyText}>No reminder rules set</Text>
                      <Text style={styles.reminderEmptySubtext}>Add rules to automatically remind customers</Text>
                    </View>
                  ) : (
                    <View style={styles.reminderRules}>
                      {reminderRules.map((rule) => (
                        <View key={rule.id} style={styles.reminderRuleCard}>
                          <View style={styles.reminderRuleMain}>
                            <Clock size={18} color="#6366F1" />
                            <View style={styles.reminderRuleInfo}>
                              <Text style={styles.reminderRuleText}>
                                {rule.days} days {rule.timing === 'before' ? 'before' : 'after'} due date
                              </Text>
                              <Text style={styles.reminderRuleSubtext}>
                                Send via: {rule.sendVia === 'both' ? 'Email & Text' : rule.sendVia === 'email' ? 'Email' : 'Text'}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.reminderRuleDelete}
                            onPress={() => handleDeleteReminderRule(rule.id)}
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.addReminderButton,
                      reminderRules.length >= 3 && styles.addReminderButtonDisabled
                    ]}
                    onPress={handleAddReminderRule}
                    disabled={reminderRules.length >= 3}
                  >
                    <Plus size={18} color={reminderRules.length >= 3 ? '#9CA3AF' : '#6366F1'} />
                    <Text style={[
                      styles.addReminderButtonText,
                      reminderRules.length >= 3 && styles.addReminderButtonTextDisabled
                    ]}>
                      Add Reminder Rule {reminderRules.length >= 3 && '(Max 3)'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderInfoText}>
                      💡 Reminders will be sent automatically via DripJobs email and text messaging.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.reminderDisabledState}>
                  <Text style={styles.reminderDisabledText}>
                    Automated reminders are currently off. Enable the toggle above to set up reminder rules.
                  </Text>
                </View>
              )}
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
                    <Text style={styles.detailValue}>{formatDateTime(invoice.sentAt)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'payments' && (
          <View style={styles.tabContentContainer}>
            {/* Payment Requests Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment Requests</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowPaymentRequestModal(true)}
                >
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Create</Text>
                </TouchableOpacity>
                  </View>

              {paymentRequests.filter(r => r.status === 'pending' || r.status === 'sent').length === 0 ? (
                <View style={styles.emptyState}>
                  <DollarSign size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No payment requests yet</Text>
                  <Text style={styles.emptyStateSubtext}>Create a payment request to ask your customer for payment</Text>
                </View>
              ) : (
                <View style={styles.paymentRequestsList}>
                  {paymentRequests
                    .filter(request => request.status === 'pending' || request.status === 'sent')
                    .map((request, index) => (
                    <View key={request.id} style={styles.paymentRequestCard}>
                      <View style={styles.paymentRequestCardHeader}>
                        <Text style={styles.paymentRequestAmount}>{formatCurrency(request.amount)}</Text>
                        <View style={[
                          styles.paymentRequestStatusBadge, 
                          { 
                            backgroundColor: request.status === 'paid' ? '#D1FAE5' : request.status === 'sent' ? '#DBEAFE' : '#FEF3C7'
                          }
                        ]}>
                          <Text style={[
                            styles.paymentRequestStatusText, 
                            { 
                              color: request.status === 'paid' ? '#065F46' : request.status === 'sent' ? '#1E40AF' : '#92400E'
                            }
                          ]}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Text>
                </View>
                      </View>
                      <View style={styles.paymentRequestCardDetails}>
                        <View style={styles.paymentRequestCardRow}>
                          <Text style={styles.paymentRequestCardLabel}>Created:</Text>
                          <Text style={styles.paymentRequestCardValue}>{formatDate(request.createdAt)}</Text>
                        </View>
                        {request.sentAt && (
                          <View style={styles.paymentRequestCardRow}>
                            <Text style={styles.paymentRequestCardLabel}>Sent:</Text>
                            <Text style={styles.paymentRequestCardValue}>{formatDate(request.sentAt)}</Text>
                  </View>
                )}
                        {request.dueDate && (
                          <View style={styles.paymentRequestCardRow}>
                            <Text style={styles.paymentRequestCardLabel}>Due:</Text>
                            <Text style={styles.paymentRequestCardValue}>{formatDate(request.dueDate)}</Text>
                          </View>
                        )}
                        {request.paidAt && (
                          <View style={styles.paymentRequestCardRow}>
                            <Text style={styles.paymentRequestCardLabel}>Paid:</Text>
                            <Text style={styles.paymentRequestCardValue}>{formatDate(request.paidAt)}</Text>
                  </View>
                )}
              </View>
                      
                      {/* Action Buttons */}
                      <View style={styles.paymentRequestActions}>
                        {request.status === 'sent' && (
                          <TouchableOpacity
                            style={styles.paymentRequestActionButton}
                            onPress={() => {
                              setSelectedPaymentRequest(request);
                              setMarkAsPaidAmount(request.amount.toString());
                              setShowMarkAsPaidModal(true);
                            }}
                          >
                            <Check size={16} color="#059669" />
                            <Text style={[styles.paymentRequestActionText, { color: '#059669' }]}>Mark as Paid</Text>
                          </TouchableOpacity>
                        )}
                        {request.status !== 'paid' && (
                          <TouchableOpacity
                            style={styles.paymentRequestActionButton}
                            onPress={() => {
                              Alert.alert('Payment request resent', 'The payment request has been sent again.');
                              const updatedRequests = paymentRequests.map(r => 
                                r.id === request.id ? { ...r, sentAt: new Date().toISOString(), status: 'sent' as const } : r
                              );
                              setPaymentRequests(updatedRequests);
                            }}
                          >
                            <Send size={16} color="#3B82F6" />
                            <Text style={[styles.paymentRequestActionText, { color: '#3B82F6' }]}>Re-send</Text>
                          </TouchableOpacity>
                        )}
                        {request.status === 'pending' && (
                          <TouchableOpacity
                            style={styles.paymentRequestActionButton}
                            onPress={() => {
                              // Open edit modal (could expand to full edit flow)
                              Alert.alert('Edit Request', 'Edit functionality coming soon');
                            }}
                          >
                            <Edit2 size={16} color="#F59E0B" />
                            <Text style={[styles.paymentRequestActionText, { color: '#F59E0B' }]}>Edit</Text>
                          </TouchableOpacity>
                        )}
                        {request.status !== 'paid' && (
                          <TouchableOpacity
                            style={styles.paymentRequestActionButton}
                            onPress={() => {
                              Alert.alert(
                                'Delete Payment Request',
                                'Are you sure you want to delete this payment request?',
                                [
                                  { text: 'Cancel', style: 'cancel' },
                                  {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {
                                      setPaymentRequests(paymentRequests.filter(r => r.id !== request.id));
                                    }
                                  }
                                ]
                              );
                            }}
                          >
                            <Trash2 size={16} color="#DC2626" />
                            <Text style={[styles.paymentRequestActionText, { color: '#DC2626' }]}>Delete</Text>
                          </TouchableOpacity>
                        )}
            </View>
                    </View>
                  ))}
          </View>
        )}
            </View>

            {/* Payment History Section */}
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

              {localPayments.length === 0 ? (
                <View style={styles.emptyState}>
                  <CreditCard size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No payments recorded yet</Text>
                </View>
              ) : (
                <View style={styles.paymentsList}>
                  {localPayments.map((payment, index) => (
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
                      
                      {/* Payment Actions */}
                      <View style={styles.paymentActions}>
                        <TouchableOpacity 
                          style={styles.paymentActionButton}
                          onPress={() => handleEditPayment(index)}
                        >
                          <Edit2 size={16} color="#6366F1" />
                          <Text style={styles.paymentActionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.paymentActionButton, styles.paymentActionButtonDanger]}
                          onPress={() => handleDeletePayment(index)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                          <Text style={[styles.paymentActionText, styles.paymentActionTextDanger]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
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
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAddItemModal(true)}
                >
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.itemsList}>
                {localInvoiceItems.map((item, index) => (
                  <View key={index} style={styles.editableItemCard}>
                    <View style={styles.itemCardHeader}>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <View style={styles.itemActions}>
                        <TouchableOpacity 
                          style={styles.iconButton}
                          onPress={() => handleDeleteItem(index)}
                        >
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

        {activeTab === 'stakeholders' && invoice.isBusiness && invoice.stakeholders && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stakeholders</Text>
              <View style={styles.stakeholdersList}>
                {invoice.stakeholders.map((stakeholder) => (
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
                        // Set expanded action item to show action menu
                        handleToggleActionMenu(stakeholder.id);
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
                            setSelectedStakeholder(stakeholder);
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
                            setSelectedStakeholder(stakeholder);
                            setSelectedStakeholderIds([stakeholder.id]);
                            setShowSendModal(true);
                            setExpandedActionItem(null);
                          }}
                        >
                          <FileText size={18} color="#374151" />
                          <Text style={styles.stakeholderMenuText}>Send Invoice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.stakeholderMenuItem}
                          onPress={() => {
                            setSelectedStakeholder(stakeholder);
                            setSelectedStakeholderIds([stakeholder.id]);
                            setShowPaymentRequestModal(true);
                            setExpandedActionItem(null);
                          }}
                        >
                          <DollarSign size={18} color="#374151" />
                          <Text style={styles.stakeholderMenuText}>Request Payment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.stakeholderMenuItem}
                          onPress={() => {
                            setSelectedStakeholder(stakeholder);
                            setShowReceiptModal(true);
                            setExpandedActionItem(null);
                          }}
                        >
                          <CheckCircle2 size={18} color="#374151" />
                          <Text style={styles.stakeholderMenuText}>Send Receipt</Text>
                        </TouchableOpacity>
                      </View>
                    )}
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

        {activeTab === 'integrations' && (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QuickBooks Sync Status</Text>
              
              {/* Sync Summary Card */}
              <View style={styles.syncSummaryCard}>
                <View style={styles.syncSummaryHeader}>
                  <View style={styles.qbLogoContainer}>
                    <DollarSign size={24} color="#2CA01C" />
                  </View>
                  <View style={styles.syncSummaryInfo}>
                    <Text style={styles.syncSummaryTitle}>Connected to QuickBooks</Text>
                    <Text style={styles.syncSummarySubtext}>Last synced 2 minutes ago</Text>
                  </View>
                  <View style={styles.syncStatusBadge}>
                    <CheckCircle2 size={16} color="#059669" />
                  </View>
                </View>
              </View>
              
              {/* Sync Timeline */}
              <View style={styles.syncTimeline}>
                <Text style={styles.timelineTitle}>Sync History</Text>
                
                {/* Invoice Creation Sync */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    <FileText size={14} color="#6366F1" />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineAction}>Invoice Created</Text>
                      <CheckCircle2 size={16} color="#059669" />
                    </View>
                    <Text style={styles.timelineDetail}>
                      Invoice {invoice.invoiceNumber} synced to QuickBooks
                    </Text>
                    <Text style={styles.timelineTimestamp}>
                      {formatDateTime(invoice.issueDate)} by {invoice.createdBy || 'System'}
                    </Text>
                    <TouchableOpacity style={styles.viewInQBButton}>
                      <Text style={styles.viewInQBText}>View in QuickBooks</Text>
                      <ChevronRight size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Line Items Sync */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    <List size={14} color="#6366F1" />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineAction}>Line Items Synced</Text>
                      <CheckCircle2 size={16} color="#059669" />
                    </View>
                    <Text style={styles.timelineDetail}>
                      {localInvoiceItems.length} items synced to QuickBooks
                    </Text>
                    {localInvoiceItems.map((item, idx) => (
                      <Text key={idx} style={styles.timelineSubItem}>
                        • {item.description} - {formatCurrency(item.quantity * item.unitPrice)}
                      </Text>
                    ))}
                    <Text style={styles.timelineTimestamp}>
                      {formatDateTime(invoice.issueDate)}
                    </Text>
                  </View>
                </View>
                
                {/* Payment Syncs */}
                {localPayments.map((payment, index) => (
                  <View key={payment.id} style={styles.timelineItem}>
                    <View style={styles.timelineDot}>
                      <DollarSign size={14} color="#059669" />
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <Text style={styles.timelineAction}>Payment Received</Text>
                        <CheckCircle2 size={16} color="#059669" />
                      </View>
                      <Text style={styles.timelineDetail}>
                        Payment of {formatCurrency(payment.amount)} synced to QuickBooks
                      </Text>
                      <Text style={styles.timelineSubItem}>
                        Method: {payment.method}
                      </Text>
                      {payment.transactionId && (
                        <Text style={styles.timelineSubItem}>
                          Transaction ID: {payment.transactionId}
                        </Text>
                      )}
                      <Text style={styles.timelineTimestamp}>
                        {formatDateTime(payment.processedAt)} by {payment.processedBy || 'System'}
                      </Text>
                      <TouchableOpacity style={styles.viewInQBButton}>
                        <Text style={styles.viewInQBText}>View in QuickBooks</Text>
                        <ChevronRight size={14} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                {/* Sent to Customer (if applicable) */}
                {invoice.sentAt && (
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot}>
                      <Send size={14} color="#6366F1" />
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <Text style={styles.timelineAction}>Invoice Sent</Text>
                        <CheckCircle2 size={16} color="#6B7280" />
                      </View>
                      <Text style={styles.timelineDetail}>
                        Invoice sent to customer (tracked in QuickBooks)
                      </Text>
                      <Text style={styles.timelineTimestamp}>
                        {formatDateTime(invoice.sentAt)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              
              {/* Sync Actions */}
              <View style={styles.syncActionsCard}>
                <TouchableOpacity style={styles.syncActionButton}>
                  <RefreshCw size={18} color="#FFFFFF" />
                  <Text style={styles.syncActionText}>Force Sync Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.syncActionButtonSecondary}>
                  <AlertCircle size={18} color="#6B7280" />
                  <Text style={styles.syncActionTextSecondary}>View Sync Logs</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}

        {activeTab === 'activity' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Log</Text>
              
              {invoice.activityLog && invoice.activityLog.length > 0 ? (
                <View style={styles.activityLogContainer}>
                  {invoice.activityLog.map((activity) => (
                    <View key={activity.id} style={styles.activityLogItem}>
                      <View style={styles.activityIcon}>
                        {activity.icon === 'send' && <Send size={16} color="#6366F1" />}
                        {activity.icon === 'payment' && <DollarSign size={16} color="#10B981" />}
                        {activity.icon === 'edit' && <Edit size={16} color="#F59E0B" />}
                        {activity.icon === 'view' && <Eye size={16} color="#8B5CF6" />}
                        {activity.icon === 'receipt' && <FileText size={16} color="#06B6D4" />}
                        {activity.icon === 'request' && <MessageSquare size={16} color="#EF4444" />}
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          {activity.action} by {activity.user}
                        </Text>
                        {activity.details && (
                          <Text style={styles.activityDetails}>{activity.details}</Text>
                        )}
                        <Text style={styles.activityTime}>{activity.timestamp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Clock size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No activity yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Actions taken on this invoice will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.tabContentContainer}>
            {/* Invoice Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invoice Details</Text>
              <View style={styles.settingsCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Due Date</Text>
                    <Text style={styles.settingDescription}>
                      {new Date(editingDueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setShowDueDatePicker(true)}
                  >
                    <Edit2 size={16} color="#6366F1" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Payment Methods Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
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
                    value={invoicePaymentSettings.allowCreditCard}
                    onValueChange={(value) => 
                      setInvoicePaymentSettings(prev => ({ ...prev, allowCreditCard: value }))
                    }
                  />
                </View>
                
                {invoicePaymentSettings.allowCreditCard && (
                  <View style={styles.paymentOptionSubRow}>
                    <Text style={styles.paymentOptionSubLabel}>Waive convenience fee</Text>
                    <Switch
                      value={invoicePaymentSettings.waiveCreditCardFee}
                      onValueChange={(value) => 
                        setInvoicePaymentSettings(prev => ({ ...prev, waiveCreditCardFee: value }))
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
                    value={invoicePaymentSettings.allowACH}
                    onValueChange={(value) => 
                      setInvoicePaymentSettings(prev => ({ ...prev, allowACH: value }))
                    }
                  />
                </View>
                
                {invoicePaymentSettings.allowACH && (
                  <View style={styles.paymentOptionSubRow}>
                    <Text style={styles.paymentOptionSubLabel}>Waive ACH fee</Text>
                    <Switch
                      value={invoicePaymentSettings.waiveACHFee}
                      onValueChange={(value) => 
                        setInvoicePaymentSettings(prev => ({ ...prev, waiveACHFee: value }))
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
                    value={invoicePaymentSettings.allowOfflinePayment}
                    onValueChange={(value) => 
                      setInvoicePaymentSettings(prev => ({ ...prev, allowOfflinePayment: value }))
                    }
                  />
                </View>
              </View>
            </View>
            
            {/* Line Item Display Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Display Settings</Text>
              <View style={styles.settingsCard}>
                <View style={styles.paymentOptionRow}>
                  <View style={styles.paymentOptionLeft}>
                    <FileText size={20} color="#6B7280" />
                    <View>
                      <Text style={styles.paymentOptionLabel}>Line Item Quantity Only</Text>
                      <Text style={styles.paymentOptionFee}>Show only quantities, not unit prices</Text>
                    </View>
                  </View>
                  <Switch
                    value={invoice.settings.lineItemQuantityOnly}
                    onValueChange={() => {}}
                  />
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
              <Text style={styles.modalSectionTitle}>Send Via</Text>
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
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                {invoice.isBusiness ? 'Recipients (Select Stakeholders)' : 'Recipient'}
              </Text>
              
              {invoice.isBusiness && invoice.stakeholders ? (
                <View style={styles.stakeholderSelectionList}>
                  {invoice.stakeholders.map((stakeholder) => {
                    const isSelected = selectedStakeholderIds.includes(stakeholder.id);
                    const isPrimary = stakeholder.id === invoice.primaryContactId;
                    
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
                                  <Text style={styles.primaryBadgeText}>Primary</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.stakeholderSelectionRole}>{stakeholder.role}</Text>
                            <Text style={styles.stakeholderSelectionEmail}>{stakeholder.email}</Text>
                            {stakeholder.receiveInvoices && (
                              <View style={styles.receivesInvoicesBadge}>
                                <Text style={styles.receivesInvoicesText}>Usually receives invoices</Text>
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
                  <Text style={styles.recipientName}>{invoice.contactName}</Text>
                  <Text style={styles.recipientEmail}>{invoice.contactEmail}</Text>
                </View>
              </View>
              )}
              
              {/* Manual Recipients */}
              {manualRecipients.length > 0 && (
                <View style={styles.manualRecipientsList}>
                  {manualRecipients.map((recipient) => (
                    <View key={recipient.id} style={styles.manualRecipientCard}>
                      <View style={styles.manualRecipientInfo}>
                        <Text style={styles.manualRecipientName}>{recipient.name}</Text>
                        <Text style={styles.manualRecipientEmail}>{recipient.email}</Text>
            </View>
                      <TouchableOpacity
                        onPress={() => setManualRecipients(manualRecipients.filter(r => r.id !== recipient.id))}
                      >
                        <X size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <TouchableOpacity
                style={styles.addRecipientButton}
                onPress={() => setShowAddRecipientModal(true)}
              >
                <Plus size={18} color="#6366F1" />
                <Text style={styles.addRecipientButtonText}>Add Another Recipient</Text>
              </TouchableOpacity>
            </View>

            {/* Email Message Preview */}
            {sendViaEmail && (
            <View style={styles.modalSection}>
                <View style={styles.messagePreviewHeader}>
                  <Text style={styles.modalSectionTitle}>Email Message Preview</Text>
                  <TouchableOpacity 
                    style={styles.editMessageButton}
                    onPress={() => {
                      if (!editingEmailMessage) {
                        // Initialize custom body if not set
                        if (!customEmailBody) {
                          setCustomEmailBody(`Hi${invoice.isBusiness ? ' there' : ` ${invoice.contactName}`},\n\nPlease find your invoice ${invoice.invoiceNumber} for ${invoice.subject}.\n\nAmount Due: ${formatCurrency(calculateBalanceDue())}\nDue Date: ${formatDate(invoice.dueDate)}\n\nYou can view and pay your invoice here:\n{invoice-link}\n\nThank you for your business!`);
                        }
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
                          {customEmailBody || `Hi${invoice.isBusiness ? ' there' : ` ${invoice.contactName}`},\n\nPlease find your invoice ${invoice.invoiceNumber} for ${invoice.subject}.\n\nAmount Due: ${formatCurrency(calculateBalanceDue())}\nDue Date: ${formatDate(invoice.dueDate)}\n\nYou can view and pay your invoice here:\n{invoice-link}\n\nThank you for your business!`}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Text Message Preview */}
            {sendViaText && (
            <View style={styles.modalSection}>
                <View style={styles.messagePreviewHeader}>
                  <Text style={styles.modalSectionTitle}>Text Message Preview</Text>
                  <TouchableOpacity 
                    style={styles.editMessageButton}
                    onPress={() => {
                      if (!editingTextMessage) {
                        // Initialize custom body if not set
                        if (!customTextBody) {
                          setCustomTextBody(`Hi${invoice.isBusiness ? '' : ` ${invoice.contactName.split(' ')[0]}`}, your invoice ${invoice.invoiceNumber} for ${formatCurrency(calculateBalanceDue())} is ready. View & pay: {invoice-link}`);
                        }
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
                          {customTextBody || `Hi${invoice.isBusiness ? '' : ` ${invoice.contactName.split(' ')[0]}`}, your invoice ${invoice.invoiceNumber} for ${formatCurrency(calculateBalanceDue())} is ready. View & pay: {invoice-link}`}
                        </Text>
                        <Text style={styles.textPreviewCount}>
                          {(customTextBody || `Hi${invoice.isBusiness ? '' : ` ${invoice.contactName.split(' ')[0]}`}, your invoice ${invoice.invoiceNumber} for ${formatCurrency(calculateBalanceDue())} is ready. View & pay: {invoice-link}`).length} characters
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Send Timing Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Send Timing</Text>
              <View style={styles.sendTimingOptions}>
            <TouchableOpacity 
                  style={[
                    styles.sendTimingOption,
                    sendNow && styles.sendTimingOptionActive
                  ]}
                  onPress={() => {
                    setSendNow(true);
                    setSelectedPreset(null);
                    setScheduledDate(null);
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
                          setScheduledDate(preset.date);
                        }}
                      >
                        <Clock size={16} color={selectedPreset === preset.id ? '#FFFFFF' : '#6366F1'} />
                        <Text style={[
                          styles.schedulePresetText,
                          selectedPreset === preset.id && styles.schedulePresetTextActive
                        ]}>
                          {preset.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={[
                        styles.schedulePresetButton,
                        selectedPreset === 'custom' && styles.schedulePresetButtonActive
                      ]}
                      onPress={() => {
                        setSelectedPreset('custom');
                        setShowDatePicker(!showDatePicker);
                      }}
                    >
                      <Calendar size={16} color={selectedPreset === 'custom' ? '#FFFFFF' : '#6366F1'} />
                      <Text style={[
                        styles.schedulePresetText,
                        selectedPreset === 'custom' && styles.schedulePresetTextActive
                      ]}>
                        Custom
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Inline DateTimePicker */}
                  {selectedPreset === 'custom' && showDatePicker && (
                    <View style={styles.inlineDatePickerContainer}>
                      <DateTimePicker
                        value={scheduledDate || new Date()}
                        mode="datetime"
                        display="inline"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setScheduledDate(selectedDate);
                          }
                        }}
                        minimumDate={new Date()}
                        themeVariant="light"
                      />
                    </View>
                  )}
                  
                  {scheduledDate && (
                    <View style={styles.scheduledTimeDisplay}>
                      <Text style={styles.scheduledTimeText}>
                        Scheduled for: {formatScheduledTime(scheduledDate)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!sendViaEmail && !sendViaText) && styles.sendButtonDisabled
              ]}
              onPress={handleSendInvoice}
              disabled={!sendViaEmail && !sendViaText}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>
                {sendNow ? 'Send' : 'Schedule'} to {invoice.isBusiness ? `${selectedStakeholderIds.length + manualRecipients.length} Recipient(s)` : invoice.contactName}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Date Picker for Invoice Due Date */}
      {showDueDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={editingDueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false);
            if (selectedDate) {
              setEditingDueDate(selectedDate);
              Alert.alert('Success', 'Due date updated successfully');
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Date Picker for Payment Request Due Date */}
      {showPaymentRequestDueDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={paymentRequestDueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPaymentRequestDueDatePicker(false);
            if (selectedDate) {
              setPaymentRequestDueDate(selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Date Picker for Edit Payment Date */}
      {showEditPaymentDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={editPaymentDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEditPaymentDatePicker(false);
            if (selectedDate) {
              setEditPaymentDate(selectedDate);
            }
          }}
        />
      )}

      {/* Add Recipient Modal */}
      <Modal
        visible={showAddRecipientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddRecipientModal(false)}
      >
        <View style={styles.addRecipientModalOverlay}>
          <View style={styles.addRecipientModalContent}>
            <View style={styles.addRecipientModalHeader}>
              <Text style={styles.addRecipientModalTitle}>Add Recipient</Text>
              <TouchableOpacity onPress={() => setShowAddRecipientModal(false)}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.addRecipientSearchContainer}>
                <TextInput
                style={styles.addRecipientSearch}
                placeholder="Search by name, email, or phone..."
                value={recipientSearchQuery}
                onChangeText={setRecipientSearchQuery}
                />
              </View>

            <ScrollView style={styles.addRecipientList}>
              {/* Placeholder contacts - in production, this would search actual contacts */}
              {[
                { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567' },
                { id: '2', name: 'Mike Chen', email: 'mike.chen@email.com', phone: '(555) 234-5678' },
                { id: '3', name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 345-6789' },
              ]
                .filter(contact => 
                  recipientSearchQuery === '' ||
                  contact.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) ||
                  contact.email.toLowerCase().includes(recipientSearchQuery.toLowerCase())
                )
                .map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={styles.addRecipientItem}
                    onPress={() => {
                      setManualRecipients([...manualRecipients, contact]);
                      setShowAddRecipientModal(false);
                      setRecipientSearchQuery('');
                    }}
                  >
                    <View style={styles.addRecipientAvatar}>
                      <Text style={styles.addRecipientAvatarText}>
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Text>
            </View>
                    <View style={styles.addRecipientItemInfo}>
                      <Text style={styles.addRecipientItemName}>{contact.name}</Text>
                      <Text style={styles.addRecipientItemEmail}>{contact.email}</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Request Modal */}
      <Modal
        visible={showPaymentRequestModal}
        animationType="slide"
        onRequestClose={() => {
          setShowPaymentRequestModal(false);
          setPaymentRequestStep(1);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setShowPaymentRequestModal(false);
              setPaymentRequestStep(1);
            }}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {paymentRequestStep === 1 ? 'Request Payment' : 'Send Payment Request'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {paymentRequestStep === 1 ? (
              // Step 1: Select Amount
              <>
            <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Request Amount</Text>
                  <View style={styles.paymentRequestTypeOptions}>
                    <TouchableOpacity
                      style={[
                        styles.paymentRequestTypeOption,
                        paymentRequestType === 'full' && styles.paymentRequestTypeOptionActive
                      ]}
                      onPress={() => setPaymentRequestType('full')}
                    >
              <View style={[
                        styles.paymentRequestRadio,
                        paymentRequestType === 'full' && styles.paymentRequestRadioActive
                      ]}>
                        {paymentRequestType === 'full' && <View style={styles.paymentRequestRadioInner} />}
                      </View>
                      <View style={styles.paymentRequestTypeContent}>
                        <Text style={styles.paymentRequestTypeLabel}>Full Balance</Text>
                        <Text style={styles.paymentRequestTypeValue}>{formatCurrency(calculateBalanceDue())}</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.paymentRequestTypeOption,
                        paymentRequestType === 'partial' && styles.paymentRequestTypeOptionActive
                      ]}
                      onPress={() => setPaymentRequestType('partial')}
                    >
                      <View style={[
                        styles.paymentRequestRadio,
                        paymentRequestType === 'partial' && styles.paymentRequestRadioActive
                      ]}>
                        {paymentRequestType === 'partial' && <View style={styles.paymentRequestRadioInner} />}
                      </View>
                      <View style={styles.paymentRequestTypeContent}>
                        <Text style={styles.paymentRequestTypeLabel}>Partial Amount</Text>
                        {paymentRequestType === 'partial' && (
                          <View style={styles.paymentRequestAmountInput}>
                            <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                              style={styles.paymentRequestInput}
                              value={paymentRequestAmount}
                              onChangeText={setPaymentRequestAmount}
                              placeholder="0.00"
                              keyboardType="decimal-pad"
                />
              </View>
                        )}
            </View>
                    </TouchableOpacity>

            <TouchableOpacity 
                      style={[
                        styles.paymentRequestTypeOption,
                        paymentRequestType === 'percentage' && styles.paymentRequestTypeOptionActive
                      ]}
                      onPress={() => setPaymentRequestType('percentage')}
                    >
                      <View style={[
                        styles.paymentRequestRadio,
                        paymentRequestType === 'percentage' && styles.paymentRequestRadioActive
                      ]}>
                        {paymentRequestType === 'percentage' && <View style={styles.paymentRequestRadioInner} />}
                      </View>
                      <View style={styles.paymentRequestTypeContent}>
                        <Text style={styles.paymentRequestTypeLabel}>Percentage of Balance</Text>
                        {paymentRequestType === 'percentage' && (
                          <View style={styles.paymentRequestPercentageInput}>
                            <TextInput
                              style={styles.paymentRequestInput}
                              value={paymentRequestPercentage}
                              onChangeText={setPaymentRequestPercentage}
                              placeholder="100"
                              keyboardType="decimal-pad"
                            />
                            <Text style={styles.percentSymbol}>%</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.paymentRequestSummary}>
                  <Text style={styles.paymentRequestSummaryLabel}>Requesting:</Text>
                  <Text style={styles.paymentRequestSummaryAmount}>
                    {formatCurrency(
                      paymentRequestType === 'full' 
                        ? calculateBalanceDue()
                        : paymentRequestType === 'partial'
                        ? parseFloat(paymentRequestAmount) || 0
                        : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                    )}
                  </Text>
                </View>

                {/* Payment Due Date */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Due Date</Text>
                  <TouchableOpacity 
                    style={styles.dueDateButton}
                    onPress={() => setShowPaymentRequestDueDatePicker(true)}
                  >
                    <Calendar size={20} color="#6366F1" />
                    <Text style={styles.dueDateButtonText}>
                      {paymentRequestDueDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Payment Options */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Options</Text>
                  
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
                      value={paymentRequestSettings.allowCreditCard}
                      onValueChange={(value) => 
                        setPaymentRequestSettings(prev => ({ ...prev, allowCreditCard: value }))
                      }
                    />
                  </View>
                  
                  {paymentRequestSettings.allowCreditCard && (
                    <View style={styles.paymentOptionSubRow}>
                      <Text style={styles.paymentOptionSubLabel}>Waive convenience fee</Text>
                      <Switch
                        value={paymentRequestSettings.waiveCreditCardFee}
                        onValueChange={(value) => 
                          setPaymentRequestSettings(prev => ({ ...prev, waiveCreditCardFee: value }))
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
                      value={paymentRequestSettings.allowACH}
                      onValueChange={(value) => 
                        setPaymentRequestSettings(prev => ({ ...prev, allowACH: value }))
                      }
                    />
                  </View>
                  
                  {paymentRequestSettings.allowACH && (
                    <View style={styles.paymentOptionSubRow}>
                      <Text style={styles.paymentOptionSubLabel}>Waive ACH fee</Text>
                      <Switch
                        value={paymentRequestSettings.waiveACHFee}
                        onValueChange={(value) => 
                          setPaymentRequestSettings(prev => ({ ...prev, waiveACHFee: value }))
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
                      value={paymentRequestSettings.allowOfflinePayment}
                      onValueChange={(value) => 
                        setPaymentRequestSettings(prev => ({ ...prev, allowOfflinePayment: value }))
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.paymentRequestContinueButton}
                  onPress={() => setPaymentRequestStep(2)}
                >
                  <Text style={styles.paymentRequestContinueButtonText}>Continue</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              // Step 2: Send Request (matches send invoice modal)
              <>
                {/* Send Method */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Send Via</Text>
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

                {/* Recipients Section */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Recipients</Text>
                  {invoice.isBusiness && invoice.stakeholders ? (
                    // Business: Show stakeholders
                    <View style={styles.stakeholdersList}>
                      {invoice.stakeholders.map((stakeholder) => (
                        <TouchableOpacity
                          key={stakeholder.id}
                          style={styles.stakeholderOption}
                          onPress={() => handleToggleStakeholder(stakeholder.id)}
                        >
                          <View style={styles.stakeholderCheckbox}>
                            {selectedStakeholderIds.includes(stakeholder.id) && (
                              <Check size={16} color="#6366F1" />
                            )}
                          </View>
                          <View style={styles.stakeholderInfo}>
                            <Text style={styles.stakeholderName}>{stakeholder.name}</Text>
                            <Text style={styles.stakeholderDetail}>
                              {stakeholder.role} • {stakeholder.email}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    // Individual: Show contact card
                    <View style={styles.contactCard}>
                      <User size={20} color="#6366F1" />
                      <View style={styles.contactCardInfo}>
                        <Text style={styles.contactCardName}>{invoice.contactName}</Text>
                        <Text style={styles.contactCardEmail}>{invoice.email}</Text>
                      </View>
                    </View>
                  )}
                  
                  {/* Manual Recipients */}
                  {manualRecipients.map((recipient) => (
                    <View key={recipient.id} style={styles.manualRecipientCard}>
                      <User size={18} color="#8B5CF6" />
                      <View style={styles.manualRecipientInfo}>
                        <Text style={styles.manualRecipientName}>{recipient.name}</Text>
                        <Text style={styles.manualRecipientEmail}>{recipient.email}</Text>
                      </View>
                      <TouchableOpacity onPress={() => {
                        setManualRecipients(manualRecipients.filter(r => r.id !== recipient.id));
                      }}>
                        <X size={18} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity 
                    style={styles.addRecipientButton}
                    onPress={() => setShowAddRecipientModal(true)}
                  >
                    <Plus size={18} color="#6366F1" />
                    <Text style={styles.addRecipientButtonText}>Add Another Recipient</Text>
                  </TouchableOpacity>
                </View>

                {/* Email Message Preview */}
                {sendViaEmail && (
                  <View style={styles.modalSection}>
                    <View style={styles.messagePreviewHeader}>
                      <Text style={styles.modalSectionTitle}>Email Message Preview</Text>
                      <TouchableOpacity 
                        style={styles.editMessageButton}
                        onPress={() => {
                          if (!editingEmailMessage) {
                            if (!customEmailBody) {
                              const requestAmount = formatCurrency(
                                paymentRequestType === 'full' 
                                  ? calculateBalanceDue()
                                  : paymentRequestType === 'partial'
                                  ? parseFloat(paymentRequestAmount) || 0
                                  : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                              );
                              setCustomEmailBody(`Hi${invoice.isBusiness ? ' there' : ` ${invoice.contactName}`},\n\nYou have a payment request for ${requestAmount} on invoice ${invoice.invoiceNumber}.\n\nView invoice and pay: {view-invoice}\n\nThank you!`);
                            }
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
                            <Text style={styles.emailPreviewSubject}>
                              {`Payment Request - Invoice ${invoice.invoiceNumber}`}
                            </Text>
                          </View>
                          <View style={styles.emailPreviewBody}>
                            <Text style={styles.emailPreviewText}>
                              {customEmailBody || `Hi${invoice.isBusiness ? ' there' : ` ${invoice.contactName}`},\n\nYou have a payment request for ${formatCurrency(
                                paymentRequestType === 'full' 
                                  ? calculateBalanceDue()
                                  : paymentRequestType === 'partial'
                                  ? parseFloat(paymentRequestAmount) || 0
                                  : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                              )} on invoice ${invoice.invoiceNumber}.\n\nView invoice and pay: {view-invoice}\n\nThank you!`}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                )}

                {/* Text Message Preview */}
                {sendViaText && (
                  <View style={styles.modalSection}>
                    <View style={styles.messagePreviewHeader}>
                      <Text style={styles.modalSectionTitle}>Text Message Preview</Text>
            <TouchableOpacity 
                        style={styles.editMessageButton}
                        onPress={() => {
                          if (!editingTextMessage) {
                            if (!customTextBody) {
                              const requestAmount = formatCurrency(
                                paymentRequestType === 'full' 
                                  ? calculateBalanceDue()
                                  : paymentRequestType === 'partial'
                                  ? parseFloat(paymentRequestAmount) || 0
                                  : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                              );
                              setCustomTextBody(`Payment request: ${requestAmount} for invoice ${invoice.invoiceNumber}. Pay now: {view-invoice}`);
                            }
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
                              {customTextBody || `Payment request: ${formatCurrency(
                                paymentRequestType === 'full' 
                                  ? calculateBalanceDue()
                                  : paymentRequestType === 'partial'
                                  ? parseFloat(paymentRequestAmount) || 0
                                  : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                              )} for invoice ${invoice.invoiceNumber}. Pay now: {view-invoice}`}
                            </Text>
                            <Text style={styles.textPreviewCount}>
                              {(customTextBody || `Payment request: ${formatCurrency(
                                paymentRequestType === 'full' 
                                  ? calculateBalanceDue()
                                  : paymentRequestType === 'partial'
                                  ? parseFloat(paymentRequestAmount) || 0
                                  : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100
                              )} for invoice ${invoice.invoiceNumber}. Pay now: {view-invoice}`).length} characters
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                )}

                {/* Send Timing Section */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Send Timing</Text>
                  <View style={styles.sendTimingOptions}>
                    <TouchableOpacity
                      style={[
                        styles.sendTimingOption,
                        sendNow && styles.sendTimingOptionActive
                      ]}
                      onPress={() => {
                        setSendNow(true);
                        setSelectedPreset(null);
                        setScheduledDate(null);
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
                              setScheduledDate(preset.date);
                            }}
                          >
                            <Text style={[
                              styles.schedulePresetButtonText,
                              selectedPreset === preset.id && styles.schedulePresetButtonTextActive
                            ]}>
                              {preset.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                          style={[
                            styles.schedulePresetButton,
                            selectedPreset === 'custom' && styles.schedulePresetButtonActive
                          ]}
                          onPress={() => {
                            setSelectedPreset('custom');
                            setShowDatePicker(!showDatePicker);
                          }}
                        >
                          <Calendar size={16} color={selectedPreset === 'custom' ? '#FFFFFF' : '#6366F1'} />
                          <Text style={[
                            styles.schedulePresetButtonText,
                            selectedPreset === 'custom' && styles.schedulePresetButtonTextActive
                          ]}>
                            Custom
                          </Text>
                        </TouchableOpacity>
                      </View>
                      
                      {/* Inline DateTimePicker */}
                      {selectedPreset === 'custom' && showDatePicker && (
                        <View style={styles.inlineDatePickerContainer}>
                          <DateTimePicker
                            value={scheduledDate || new Date()}
                            mode="datetime"
                            display="inline"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                setScheduledDate(selectedDate);
                              }
                            }}
                            minimumDate={new Date()}
                            themeVariant="light"
                          />
                        </View>
                      )}
                      
                      {scheduledDate && (
                        <View style={styles.selectedScheduleInfo}>
                          <Clock size={16} color="#6366F1" />
                          <Text style={styles.selectedScheduleText}>
                            Scheduled for {formatScheduledTime(scheduledDate)}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.sendPaymentRequestButton}
                  onPress={() => {
                    // Create the payment request
                    const requestAmount = paymentRequestType === 'full' 
                      ? calculateBalanceDue()
                      : paymentRequestType === 'partial'
                      ? parseFloat(paymentRequestAmount) || 0
                      : (calculateBalanceDue() * (parseFloat(paymentRequestPercentage) || 0)) / 100;
                    
                    const newRequest: PaymentRequest = {
                      id: `PR-${Date.now()}`,
                      amount: requestAmount,
                      status: sendNow ? 'sent' : 'pending',
                      createdAt: new Date().toISOString(),
                      sentAt: sendNow ? new Date().toISOString() : undefined,
                      dueDate: paymentRequestDueDate.toISOString(),
                      type: paymentRequestType,
                      percentage: paymentRequestType === 'percentage' ? parseFloat(paymentRequestPercentage) : undefined,
                    };
                    
                    setPaymentRequests([...paymentRequests, newRequest]);
                    Alert.alert('Success', sendNow ? 'Payment request sent successfully' : 'Payment request scheduled');
                    setShowPaymentRequestModal(false);
                    setPaymentRequestStep(1);
                    
                    // Reset form
                    setCustomEmailBody('');
                    setCustomTextBody('');
                    setSendNow(true);
                    setScheduledDate(null);
                    setSelectedPreset(null);
                  }}
            >
              <Send size={20} color="#FFFFFF" />
                  <Text style={styles.sendPaymentRequestButtonText}>
                    {sendNow ? 'Send Payment Request' : 'Schedule Payment Request'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Mark as Paid Modal */}
      <Modal
        visible={showMarkAsPaidModal}
        animationType="slide"
        onRequestClose={() => setShowMarkAsPaidModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMarkAsPaidModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Mark as Paid</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Amount</Text>
              <View style={[
                styles.currencyInputContainer,
                focusedInput === 'markAsPaidAmount' && styles.inputContainerFocused
              ]}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={markAsPaidAmount}
                  onChangeText={setMarkAsPaidAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('markAsPaidAmount')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Method</Text>
              <View style={styles.methodOptions}>
                {['Credit Card', 'Cash', 'Check', 'Bank Transfer', 'Other'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodOption,
                      markAsPaidMethod === method && styles.methodOptionActive
                    ]}
                    onPress={() => setMarkAsPaidMethod(method)}
                  >
                    <View style={[
                      styles.methodRadio,
                      markAsPaidMethod === method && styles.methodRadioActive
                    ]}>
                      {markAsPaidMethod === method && <View style={styles.methodRadioInner} />}
                    </View>
                    <Text style={styles.methodOptionText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.datePickerButtonText}>{formatDate(markAsPaidDate.toISOString())}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Transaction ID (Optional)</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'markAsPaidTransactionId' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={markAsPaidTransactionId}
                  onChangeText={setMarkAsPaidTransactionId}
                  placeholder="Enter transaction ID..."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('markAsPaidTransactionId')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.recordPaymentButton}
              onPress={() => {
                if (selectedPaymentRequest) {
                  // Add to payment history
                  const newPayment: any = {
                    id: `PAY-${Date.now()}`,
                    amount: parseFloat(markAsPaidAmount),
                    processedAt: markAsPaidDate.toISOString(),
                    method: markAsPaidMethod,
                    status: 'completed',
                    processedBy: 'Current User',
                    transactionId: markAsPaidTransactionId || undefined,
                  };
                  setLocalPayments([...localPayments, newPayment]);
                  
                  // Update payment request status
                  const updatedRequests = paymentRequests.map(r => 
                    r.id === selectedPaymentRequest.id 
                      ? { ...r, status: 'paid' as const, paidAt: new Date().toISOString() } 
                      : r
                  );
                  setPaymentRequests(updatedRequests);
                  
                  Alert.alert('Success', 'Payment recorded successfully');
                  setShowMarkAsPaidModal(false);
                  setSelectedPaymentRequest(null);
                  setMarkAsPaidAmount('');
                  setMarkAsPaidTransactionId('');
                }
              }}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.recordPaymentButtonText}>Record Payment</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal
        visible={showEditPaymentModal}
        animationType="slide"
        onRequestClose={() => {
          setShowEditPaymentModal(false);
          setEditingPaymentIndex(null);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setShowEditPaymentModal(false);
              setEditingPaymentIndex(null);
            }}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Payment</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Amount */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Amount</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'editPaymentAmount' && styles.inputContainerFocused
              ]}>
                <View style={styles.currencyInputWrapper}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.input, styles.currencyInput]}
                    value={editPaymentAmount}
                    onChangeText={setEditPaymentAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    onFocus={() => setFocusedInput('editPaymentAmount')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Method</Text>
              <View style={styles.methodOptions}>
                {['Credit Card', 'Cash', 'Check', 'Bank Transfer', 'Venmo', 'CashApp', 'Other'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodOption,
                      editPaymentMethod === method && styles.methodOptionActive
                    ]}
                    onPress={() => setEditPaymentMethod(method)}
                  >
                    <View style={[
                      styles.methodRadio,
                      editPaymentMethod === method && styles.methodRadioActive
                    ]}>
                      {editPaymentMethod === method && <View style={styles.methodRadioInner} />}
                    </View>
                    <Text style={styles.methodOptionText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Date */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Date</Text>
              <TouchableOpacity 
                style={styles.dueDateButton}
                onPress={() => setShowEditPaymentDatePicker(true)}
              >
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.dueDateButtonText}>
                  {editPaymentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Transaction ID (Optional) */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Transaction ID (Optional)</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'editTransactionId' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={editPaymentTransactionId}
                  onChangeText={setEditPaymentTransactionId}
                  placeholder="TXN-ABC123"
                  onFocus={() => setFocusedInput('editTransactionId')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.recordPaymentButton}
              onPress={handleSaveEditedPayment}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.recordPaymentButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        visible={showReceiptModal}
        animationType="slide"
        onRequestClose={() => setShowReceiptModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReceiptModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Send Receipt</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Send Method */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Send Via</Text>
              <View style={styles.sendMethodOptions}>
                <TouchableOpacity 
                  style={[styles.sendMethodButton, receiptSendViaEmail && styles.sendMethodButtonActive]}
                  onPress={() => setReceiptSendViaEmail(!receiptSendViaEmail)}
                >
                  <Mail size={20} color={receiptSendViaEmail ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.sendMethodButtonText,
                    receiptSendViaEmail && styles.sendMethodButtonTextActive
                  ]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sendMethodButton, receiptSendViaText && styles.sendMethodButtonActive]}
                  onPress={() => setReceiptSendViaText(!receiptSendViaText)}
                >
                  <MessageSquare size={20} color={receiptSendViaText ? '#FFFFFF' : '#8B5CF6'} />
                  <Text style={[
                    styles.sendMethodButtonText,
                    receiptSendViaText && styles.sendMethodButtonTextActive
                  ]}>Text</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recipient Info */}
            {selectedStakeholder && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Recipient</Text>
                <View style={styles.contactCard}>
                  <User size={20} color="#6366F1" />
                  <View style={styles.contactCardInfo}>
                    <Text style={styles.contactCardName}>{selectedStakeholder.name}</Text>
                    <Text style={styles.contactCardEmail}>{selectedStakeholder.email}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Receipt Preview */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Receipt Preview</Text>
              <View style={styles.receiptPreview}>
                <View style={styles.receiptHeader}>
                  <CheckCircle2 size={24} color="#059669" />
                  <Text style={styles.receiptTitle}>Payment Received</Text>
                </View>
                <View style={styles.receiptDetails}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Invoice:</Text>
                    <Text style={styles.receiptValue}>{invoice.invoiceNumber}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount Paid:</Text>
                    <Text style={styles.receiptValue}>{formatCurrency(calculateAmountPaid())}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Date:</Text>
                    <Text style={styles.receiptValue}>{formatDate(new Date().toISOString())}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Method:</Text>
                    <Text style={styles.receiptValue}>
                      {localPayments.length > 0 ? localPayments[localPayments.length - 1].method : 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.receiptMessage}>
                  Thank you for your payment! View your invoice: {'{invoice-link}'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.sendReceiptButton}
              onPress={() => {
                Alert.alert('Success', 'Receipt sent successfully');
                setShowReceiptModal(false);
                setSelectedStakeholder(null);
              }}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.sendReceiptButtonText}>Send Receipt</Text>
            </TouchableOpacity>

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

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
                focusedInput === 'salesperson' && styles.inputContainerFocused
              ]}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={editSalesperson}
                  onChangeText={setEditSalesperson}
                  placeholder="Enter salesperson name"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setFocusedInput('salesperson')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Start Date */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Start Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowJobStartDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.datePickerButtonText}>
                  {formatDate(editStartDate.toISOString())}
                </Text>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
              {showJobStartDatePicker && (
                <DateTimePicker
                  value={editStartDate}
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
            </View>

            {/* End Date */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>End Date (Optional)</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowJobEndDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.datePickerButtonText}>
                  {editEndDate ? formatDate(editEndDate.toISOString()) : 'Select end date'}
                </Text>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
              {showJobEndDatePicker && (
                <DateTimePicker
                  value={editEndDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowJobEndDatePicker(false);
                    if (selectedDate) {
                      setEditEndDate(selectedDate);
                    }
                  }}
                />
              )}
              {editEndDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setEditEndDate(undefined)}
                >
                  <Text style={styles.clearDateButtonText}>Clear End Date</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Assignment Type Toggle */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Assignment Type</Text>
              <View style={styles.assignmentTypeToggle}>
                <TouchableOpacity
                  style={[
                    styles.assignmentTypeButton,
                    jobAssignmentType === 'crew' && styles.assignmentTypeButtonActive
                  ]}
                  onPress={() => setJobAssignmentType('crew')}
                >
                  <Users size={20} color={jobAssignmentType === 'crew' ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.assignmentTypeText,
                    jobAssignmentType === 'crew' && styles.assignmentTypeTextActive
                  ]}>Crew</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.assignmentTypeButton,
                    jobAssignmentType === 'individual' && styles.assignmentTypeButtonActive
                  ]}
                  onPress={() => setJobAssignmentType('individual')}
                >
                  <User size={20} color={jobAssignmentType === 'individual' ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.assignmentTypeText,
                    jobAssignmentType === 'individual' && styles.assignmentTypeTextActive
                  ]}>Individual</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Crew or Team Members input based on type */}
            {jobAssignmentType === 'crew' ? (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Crew Name</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'crew' && styles.inputContainerFocused
                ]}>
                  <Users size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={editCrew}
                    onChangeText={setEditCrew}
                    placeholder="Enter crew name"
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('crew')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.modalSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.modalSectionTitle}>Team Members</Text>
                  <TouchableOpacity 
                    style={styles.addTeamMemberButton}
                    onPress={handleAddTeamMember}
                  >
                    <Plus size={16} color="#6366F1" />
                    <Text style={styles.addTeamMemberText}>Add Member</Text>
                  </TouchableOpacity>
                </View>
                
                {/* List of team members */}
                {editTeamMembers.map((member, index) => (
                  <View key={index} style={styles.teamMemberItem}>
                    <View style={styles.teamMemberInfo}>
                      <User size={18} color="#6B7280" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.teamMemberName}>{member.name}</Text>
                        <Text style={styles.teamMemberRole}>{member.role}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveTeamMember(index)}
                      style={styles.removeTeamMemberButton}
                    >
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {/* Note about syncing from job schedule */}
                <Text style={styles.helpText}>
                  Team members sync from Job Schedule
                </Text>
              </View>
            )}

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
              <View style={[
                styles.inputContainer,
                focusedInput === 'discountValue' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={discountValue}
                  onChangeText={setDiscountValue}
                  placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                  keyboardType="decimal-pad"
                  onFocus={() => setFocusedInput('discountValue')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
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

      {/* Payment Collection Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        onRequestClose={handleClosePaymentModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[
            styles.modalHeader,
            paymentCollectionType === 'card' && styles.securePaymentHeader
          ]}>
            <TouchableOpacity onPress={handleClosePaymentModal}>
              <ChevronLeft size={24} color={paymentCollectionType === 'card' ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
            <View style={styles.headerTitleSection}>
              {paymentCollectionType === 'card' && (
                <View style={styles.secureBadge}>
                  <AlertCircle size={16} color="#FFFFFF" />
                  <Text style={styles.secureBadgeText}>SECURE</Text>
                </View>
              )}
              <Text style={[
                styles.modalTitle,
                paymentCollectionType === 'card' && styles.secureModalTitle
              ]}>
                {paymentCollectionType === 'card' ? 'Process Card Payment' : 'Collect Payment'}
            </Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {paymentCollectionType === 'choice' && (
              <>
                {/* Balance Summary */}
                <View style={styles.paymentBalanceCard}>
                  <View style={styles.paymentBalanceRow}>
                    <Text style={styles.paymentBalanceLabel}>Invoice Total</Text>
                    <Text style={styles.paymentBalanceValue}>{formatCurrency(calculateTotal())}</Text>
                  </View>
                  <View style={styles.paymentBalanceRow}>
                    <Text style={styles.paymentBalanceLabel}>Amount Paid</Text>
                    <Text style={[styles.paymentBalanceValue, { color: '#10B981' }]}>
                      {formatCurrency(calculateAmountPaid())}
            </Text>
                  </View>
                  <View style={[styles.paymentBalanceRow, styles.paymentBalanceDueRow]}>
                    <Text style={styles.paymentBalanceDueLabel}>Balance Due</Text>
                    <Text style={styles.paymentBalanceDueValue}>{formatCurrency(calculateBalanceDue())}</Text>
                  </View>
                </View>

                {/* Payment Type Selection */}
                <View style={styles.modalSection}>
                  <Text style={styles.paymentTypeTitle}>How would you like to collect this payment?</Text>
                  
              <TouchableOpacity 
                    style={styles.paymentTypeCard}
                    onPress={() => setPaymentCollectionType('log')}
                  >
                    <View style={[styles.paymentTypeIcon, { backgroundColor: '#DBEAFE' }]}>
                      <FileText size={28} color="#3B82F6" />
                    </View>
                    <View style={styles.paymentTypeContent}>
                      <Text style={styles.paymentTypeLabel}>Log a Payment</Text>
                      <Text style={styles.paymentTypeDescription}>
                        Record a payment received via check, cash, Venmo, CashApp, or other method
                      </Text>
                    </View>
                    <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.paymentTypeCard}
                    onPress={() => setPaymentCollectionType('card')}
                  >
                    <View style={[styles.paymentTypeIcon, { backgroundColor: '#D1FAE5' }]}>
                      <CreditCard size={28} color="#10B981" />
            </View>
                    <View style={styles.paymentTypeContent}>
                      <Text style={styles.paymentTypeLabel}>Run a Card Payment</Text>
                      <Text style={styles.paymentTypeDescription}>
                        Process a credit or debit card payment securely through Stripe
                      </Text>
          </View>
                    <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                  </TouchableOpacity>
        </View>
              </>
            )}

            {paymentCollectionType === 'log' && (
              <>
                {/* Balance Summary */}
                <View style={styles.paymentBalanceCard}>
                  <View style={styles.paymentBalanceRow}>
                    <Text style={styles.paymentBalanceLabel}>Balance Due</Text>
                    <Text style={styles.paymentBalanceDueValue}>{formatCurrency(calculateBalanceDue())}</Text>
                  </View>
                </View>

                {/* Payment Amount */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Amount</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'paymentAmount' && styles.inputContainerFocused
                  ]}>
                    <View style={styles.currencyInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.currencyInput}
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        onFocus={() => setFocusedInput('paymentAmount')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  {paymentAmount && parseFloat(paymentAmount) > 0 && (
                    <View style={styles.newBalancePreview}>
                      <Text style={styles.newBalanceLabel}>New Balance</Text>
                      <Text style={styles.newBalanceValue}>
                        {formatCurrency(Math.max(0, calculateBalanceDue() - parseFloat(paymentAmount)))}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Payment Method */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Method</Text>
                  <View style={styles.paymentMethodGrid}>
                    {['cash', 'check', 'venmo', 'cashapp', 'other'].map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.paymentMethodOption,
                          manualPaymentMethod === method && styles.paymentMethodOptionActive
                        ]}
                        onPress={() => setManualPaymentMethod(method as any)}
                      >
                        <Text style={[
                          styles.paymentMethodText,
                          manualPaymentMethod === method && styles.paymentMethodTextActive
                        ]}>
                          {method === 'cashapp' ? 'CashApp' : method.charAt(0).toUpperCase() + method.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {manualPaymentMethod === 'other' && (
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'otherPaymentMethod' && styles.inputContainerFocused,
                      { marginTop: 12 }
                    ]}>
                      <TextInput
                        style={styles.input}
                        value={otherPaymentMethod}
                        onChangeText={setOtherPaymentMethod}
                        placeholder="Specify payment method"
                        onFocus={() => setFocusedInput('otherPaymentMethod')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  )}
                </View>

                {/* Notes (Optional) */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Notes (Optional)</Text>
                  <View style={[
                    styles.textAreaContainer,
                    focusedInput === 'paymentNotes' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.textArea}
                      value={paymentNotes}
                      onChangeText={setPaymentNotes}
                      placeholder="Add any notes about this payment..."
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      onFocus={() => setFocusedInput('paymentNotes')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Send Receipt Options */}
                <View style={styles.modalSection}>
                  <TouchableOpacity 
                    style={styles.receiptHeaderRow}
                    onPress={() => setSendReceipt(!sendReceipt)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.receiptHeaderLeft}>
                      <View style={[styles.checkbox, sendReceipt && styles.checkboxActive]}>
                        {sendReceipt && <Check size={16} color="#FFFFFF" />}
                      </View>
                      <Text style={styles.modalSectionTitle}>Send Payment Receipt</Text>
                    </View>
                  </TouchableOpacity>

                  {sendReceipt && (
                    <View style={styles.receiptOptionsCard}>
                      <Text style={styles.receiptOptionsLabel}>Send receipt via:</Text>
                      
                      <TouchableOpacity 
                        style={styles.receiptOptionRow}
                        onPress={() => setReceiptViaEmail(!receiptViaEmail)}
                      >
                        <View style={[styles.checkbox, receiptViaEmail && styles.checkboxActive]}>
                          {receiptViaEmail && <Check size={16} color="#FFFFFF" />}
                        </View>
                        <Mail size={18} color="#6B7280" />
                        <Text style={styles.receiptOptionText}>Email to {invoice.contactEmail}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.receiptOptionRow}
                        onPress={() => setReceiptViaText(!receiptViaText)}
                      >
                        <View style={[styles.checkbox, receiptViaText && styles.checkboxActive]}>
                          {receiptViaText && <Check size={16} color="#FFFFFF" />}
                        </View>
                        <MessageSquare size={18} color="#6B7280" />
                        <Text style={styles.receiptOptionText}>
                          Text to {invoice.contactPhone || 'phone number'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.logPaymentButton}
                  onPress={handleLogPayment}
                >
                  <FileText size={20} color="#FFFFFF" />
                  <Text style={styles.logPaymentButtonText}>Log Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.backToChoiceButton}
                  onPress={() => setPaymentCollectionType('choice')}
                >
                  <Text style={styles.backToChoiceText}>Back to Options</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
              </>
            )}

            {paymentCollectionType === 'card' && (
              <>
                {/* Balance Summary */}
                <View style={styles.paymentBalanceCard}>
                  <View style={styles.paymentBalanceRow}>
                    <Text style={styles.paymentBalanceLabel}>Invoice Total</Text>
                    <Text style={styles.paymentBalanceValue}>{formatCurrency(calculateTotal())}</Text>
                  </View>
                  <View style={styles.paymentBalanceRow}>
                    <Text style={styles.paymentBalanceLabel}>Amount Paid</Text>
                    <Text style={[styles.paymentBalanceValue, { color: '#10B981' }]}>
                      {formatCurrency(calculateAmountPaid())}
                    </Text>
                  </View>
                  <View style={[styles.paymentBalanceRow, styles.paymentBalanceDueRow]}>
                    <Text style={styles.paymentBalanceDueLabel}>Balance Due</Text>
                    <Text style={styles.paymentBalanceDueValue}>{formatCurrency(calculateBalanceDue())}</Text>
                  </View>
                </View>

                {/* Payment Amount */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Amount</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'paymentAmount' && styles.inputContainerFocused
                  ]}>
                    <View style={styles.currencyInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.currencyInput}
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        onFocus={() => setFocusedInput('paymentAmount')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  {paymentAmount && parseFloat(paymentAmount) > 0 && (
                    <View style={styles.newBalancePreview}>
                      <Text style={styles.newBalanceLabel}>New Balance</Text>
                      <Text style={styles.newBalanceValue}>
                        {formatCurrency(Math.max(0, calculateBalanceDue() - parseFloat(paymentAmount)))}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Card Details */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Card Details</Text>
              
                  <View style={styles.cardDetailGroup}>
                    <Text style={styles.cardDetailLabel}>Card Number</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'cardNumber' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        value={cardNumber}
                        onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                        placeholder="1234 5678 9012 3456"
                        keyboardType="number-pad"
                        maxLength={19}
                        onFocus={() => setFocusedInput('cardNumber')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>

                  <View style={styles.cardRowGroup}>
                    <View style={styles.cardDetailHalf}>
                      <Text style={styles.cardDetailLabel}>Expiry Date</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedInput === 'cardExpiry' && styles.inputContainerFocused
                      ]}>
                        <TextInput
                          style={styles.input}
                          value={cardExpiry}
                          onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                          placeholder="MM/YY"
                          keyboardType="number-pad"
                          maxLength={5}
                          onFocus={() => setFocusedInput('cardExpiry')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    <View style={styles.cardDetailHalf}>
                      <Text style={styles.cardDetailLabel}>CVC</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedInput === 'cardCvc' && styles.inputContainerFocused
                      ]}>
                        <TextInput
                          style={styles.input}
                          value={cardCvc}
                          onChangeText={setCardCvc}
                          placeholder="123"
                          keyboardType="number-pad"
                          maxLength={4}
                          secureTextEntry
                          onFocus={() => setFocusedInput('cardCvc')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardDetailGroup}>
                    <Text style={styles.cardDetailLabel}>Cardholder Name</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'cardholderName' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        value={cardholderName}
                        onChangeText={setCardholderName}
                        placeholder="John Smith"
                        autoCapitalize="words"
                        onFocus={() => setFocusedInput('cardholderName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.processPaymentButton,
                    isProcessingPayment && styles.processPaymentButtonDisabled
                  ]}
                  onPress={handleProcessPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <Text style={styles.processPaymentButtonText}>Processing...</Text>
                  ) : (
                    <>
                      <CreditCard size={20} color="#FFFFFF" />
                      <Text style={styles.processPaymentButtonText}>
                        Process Payment {paymentAmount && `- ${formatCurrency(parseFloat(paymentAmount))}`}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.stripeNotice}>
                  🔒 Payments are processed securely through Stripe
                </Text>

                <TouchableOpacity 
                  style={styles.backToChoiceButton}
                  onPress={() => setPaymentCollectionType('choice')}
                >
                  <Text style={styles.backToChoiceText}>Back to Options</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Receipt Preview Modal */}
      <Modal
        visible={showReceiptPreview}
        animationType="slide"
        onRequestClose={() => setShowReceiptPreview(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReceiptPreview(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Receipt Preview</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.receiptPreviewCard}>
              <View style={styles.receiptPreviewHeader}>
                <Mail size={24} color="#6366F1" />
                <Text style={styles.receiptPreviewTitle}>Payment Receipt</Text>
              </View>

              {receiptViaEmail && (
                <View style={styles.receiptDeliveryInfo}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.receiptDeliveryText}>Email: {invoice.contactEmail}</Text>
                </View>
              )}

              {receiptViaText && (
                <View style={styles.receiptDeliveryInfo}>
                  <MessageSquare size={16} color="#6B7280" />
                  <Text style={styles.receiptDeliveryText}>Text: {invoice.contactPhone || 'N/A'}</Text>
                </View>
              )}

              <View style={styles.receiptDivider} />

              <Text style={styles.receiptSubject}>{generateReceiptMessage().subject}</Text>

              <View style={styles.receiptBodyContainer}>
                <Text style={styles.receiptBody}>{generateReceiptMessage().body}</Text>
              </View>
            </View>

            <View style={styles.receiptPreviewActions}>
              <TouchableOpacity 
                style={styles.sendReceiptButton}
                onPress={completePaymentLogging}
              >
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.sendReceiptButtonText}>Send Receipt & Log Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipReceiptButton}
                onPress={async () => {
                  setSendReceipt(false);
                  await completePaymentLogging();
                }}
              >
                <Text style={styles.skipReceiptButtonText}>Skip Receipt</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Payment Success Modal */}
      <Modal
        visible={showPaymentSuccess}
        animationType="slide"
        onRequestClose={() => setShowPaymentSuccess(false)}
      >
        <SafeAreaView style={styles.successModalContainer}>
          <View style={styles.successContent}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={64} color="#059669" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>
              ${lastProcessedPayment?.amount.toFixed(2)} has been processed
            </Text>
            
            {lastProcessedPayment && (
              <View style={styles.successDetails}>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Transaction ID:</Text>
                  <Text style={styles.successDetailValue}>{lastProcessedPayment.transactionId}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Payment Method:</Text>
                  <Text style={styles.successDetailValue}>{lastProcessedPayment.method}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Date:</Text>
                  <Text style={styles.successDetailValue}>{formatDate(lastProcessedPayment.processedAt)}</Text>
                </View>
              </View>
            )}

            {/* Send Receipt Section */}
            <View style={styles.receiptSection}>
              <Text style={styles.receiptSectionTitle}>Send Receipt</Text>
              <View style={styles.receiptToggleRow}>
                <TouchableOpacity 
                  style={[styles.receiptToggle, receiptSendViaEmail && styles.receiptToggleActive]}
                  onPress={() => setReceiptSendViaEmail(!receiptSendViaEmail)}
                >
                  <Mail size={20} color={receiptSendViaEmail ? '#FFFFFF' : '#6366F1'} />
                  <Text style={[
                    styles.receiptToggleText,
                    receiptSendViaEmail && styles.receiptToggleTextActive
                  ]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.receiptToggle, receiptSendViaText && styles.receiptToggleActive]}
                  onPress={() => setReceiptSendViaText(!receiptSendViaText)}
                >
                  <MessageSquare size={20} color={receiptSendViaText ? '#FFFFFF' : '#8B5CF6'} />
                  <Text style={[
                    styles.receiptToggleText,
                    receiptSendViaText && styles.receiptToggleTextActive
                  ]}>Text</Text>
                </TouchableOpacity>
              </View>
              
              {(receiptSendViaEmail || receiptSendViaText) && (
                <TouchableOpacity
                  style={styles.sendReceiptButtonSuccess}
                  onPress={() => {
                    const methods = [];
                    if (receiptSendViaEmail) methods.push('email');
                    if (receiptSendViaText) methods.push('text');
                    Alert.alert('Success', `Receipt sent via ${methods.join(' and ')}`);
                  }}
                >
                  <Send size={20} color="#FFFFFF" />
                  <Text style={styles.sendReceiptButtonSuccessText}>Send Receipt</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setShowPaymentSuccess(false);
                setActiveTab('payments');
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        visible={showAddItemModal}
        animationType="slide"
        onRequestClose={() => setShowAddItemModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Line Item</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Item Name with Dropdown */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Item Name</Text>
              
              {/* Custom name input - always shown */}
              <View style={[
                styles.inputContainer,
                focusedInput === 'itemName' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={newItemName}
                  onChangeText={setNewItemName}
                  placeholder="Enter item name or select from products below"
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
                  {/* Sample products/services - would come from API */}
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewItemName('Lawn Mowing Service');
                      setNewItemUnitPrice('75.00');
                      setShowItemNameDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Lawn Mowing Service</Text>
                    <Text style={styles.dropdownItemPrice}>$75.00</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewItemName('Tree Trimming');
                      setNewItemUnitPrice('150.00');
                      setShowItemNameDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Tree Trimming</Text>
                    <Text style={styles.dropdownItemPrice}>$150.00</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewItemName('Fertilizer Application');
                      setNewItemUnitPrice('85.00');
                      setShowItemNameDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Fertilizer Application</Text>
                    <Text style={styles.dropdownItemPrice}>$85.00</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Quantity and Price Row */}
            <View style={styles.itemRowFields}>
              <View style={[styles.modalSection, styles.halfWidth]}>
                <Text style={styles.modalSectionTitle}>Quantity</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'itemQuantity' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    value={newItemQuantity}
                    onChangeText={setNewItemQuantity}
                    placeholder="1"
                    keyboardType="decimal-pad"
                    onFocus={() => setFocusedInput('itemQuantity')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={[styles.modalSection, styles.halfWidth]}>
                <Text style={styles.modalSectionTitle}>Unit Price</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'itemUnitPrice' && styles.inputContainerFocused
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
            <View style={styles.modalSection}>
              <View style={styles.taxHeaderRow}>
                <Text style={styles.modalSectionTitle}>Tax Rate (Optional)</Text>
                <Text style={styles.taxHelpText}>e.g., 8.5 for 8.5%</Text>
              </View>
              <View style={[
                styles.inputContainer,
                focusedInput === 'itemTax' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
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

            {/* Detailed Description with HTML Formatting */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Detailed Description</Text>
              
              {/* HTML Formatting Buttons */}
              <View style={styles.formattingToolbar}>
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    const cursor = newItemDescription.length;
                    setNewItemDescription(newItemDescription + '<b></b>');
                  }}
                >
                  <Text style={styles.formatButtonText}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    const cursor = newItemDescription.length;
                    setNewItemDescription(newItemDescription + '<i></i>');
                  }}
                >
                  <Text style={[styles.formatButtonText, styles.italic]}>I</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    const cursor = newItemDescription.length;
                    setNewItemDescription(newItemDescription + '<u></u>');
                  }}
                >
                  <Text style={[styles.formatButtonText, styles.underline]}>U</Text>
                </TouchableOpacity>
                <View style={styles.formatDivider} />
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    setNewItemDescription(newItemDescription + '\n• ');
                  }}
                >
                  <Text style={styles.formatButtonText}>•</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    setNewItemDescription(newItemDescription + '\n<ul>\n  <li></li>\n</ul>');
                  }}
                >
                  <Text style={styles.formatButtonText}>≡</Text>
                </TouchableOpacity>
                <View style={styles.formatDivider} />
                <TouchableOpacity 
                  style={styles.formatButton}
                  onPress={() => {
                    setNewItemDescription(newItemDescription + '<br/>');
                  }}
                >
                  <Text style={styles.formatButtonText}>↵</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.inputContainer,
                styles.textareaContainer,
                focusedInput === 'itemDescription' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textareaInput]}
                  value={newItemDescription}
                  onChangeText={setNewItemDescription}
                  placeholder="Enter detailed description..."
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  onFocus={() => setFocusedInput('itemDescription')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              
              <Text style={styles.descriptionHelpText}>
                Tip: Use formatting buttons above or type HTML directly
              </Text>
            </View>

            {newItemQuantity && newItemUnitPrice && (
              <View style={styles.itemTotalPreview}>
                <Text style={styles.itemTotalPreviewLabel}>Item Total</Text>
                <Text style={styles.itemTotalPreviewValue}>
                  {formatCurrency(parseFloat(newItemQuantity) * parseFloat(newItemUnitPrice))}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={handleAddItem}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addItemButtonText}>Add Item</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Present/Share Modal */}
      <Modal
        visible={showPresentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPresentModal(false)}
      >
        <View style={styles.presentModalOverlay}>
          <View style={styles.presentModalContent}>
            <View style={styles.presentModalHeader}>
              <Text style={styles.presentModalTitle}>Share Invoice</Text>
              <TouchableOpacity onPress={() => setShowPresentModal(false)}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.presentOption}
              onPress={handlePresentInvoice}
            >
              <View style={styles.presentOptionIcon}>
                <Monitor size={24} color="#6366F1" />
              </View>
              <View style={styles.presentOptionContent}>
                <Text style={styles.presentOptionTitle}>Present Invoice</Text>
                <Text style={styles.presentOptionDescription}>
                  Open invoice in browser to show customer
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presentOption}
              onPress={handleCopyInvoiceLink}
            >
              <View style={styles.presentOptionIcon}>
                <Link2 size={24} color="#8B5CF6" />
              </View>
              <View style={styles.presentOptionContent}>
                <Text style={styles.presentOptionTitle}>Copy Invoice Link</Text>
                <Text style={styles.presentOptionDescription}>
                  Copy shareable link to clipboard
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Invoice Preview Modal - Professional Full-Screen */}
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <SafeAreaView style={styles.previewModalContainer}>
          {/* Header with Actions */}
          <View style={styles.previewModalHeader}>
            <TouchableOpacity 
              style={styles.previewCloseButton}
              onPress={() => setShowPreviewModal(false)}
            >
              <X size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.previewModalTitle}>Invoice Preview</Text>
            <TouchableOpacity 
              style={styles.previewDownloadButton}
              onPress={() => {
                Alert.alert('Download PDF', 'PDF download functionality will be integrated with your preferred PDF library (e.g., react-native-pdf, expo-print)');
              }}
            >
              <Download size={20} color="#6366F1" />
              <Text style={styles.previewDownloadText}>PDF</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.previewFullContent} showsVerticalScrollIndicator={false}>
            {/* Professional Invoice Document */}
            <View style={styles.invoiceDocument}>
              {/* Company Header with Logo */}
              <View style={styles.invoiceHeader}>
                <View style={styles.companyLogoSection}>
                  {/* Placeholder for company logo */}
                  <View style={styles.companyLogoPlaceholder}>
                    <Briefcase size={32} color="#6366F1" />
                  </View>
                  <View>
                    <Text style={styles.companyName}>DripJobs Inc.</Text>
                    <Text style={styles.companyTagline}>Professional Services</Text>
                  </View>
                </View>
                <View style={styles.invoiceHeaderRight}>
                  <Text style={styles.invoiceTitle}>INVOICE</Text>
                  <Text style={styles.invoiceNumberLarge}>{invoice.invoiceNumber}</Text>
                </View>
              </View>

              {/* From Section */}
              <View style={styles.fromSection}>
                <Text style={styles.partySectionLabel}>FROM</Text>
                <Text style={styles.partyCompanyName}>DripJobs Inc.</Text>
                <Text style={styles.partyDetail}>123 Business Ave, Suite 100</Text>
                <Text style={styles.partyDetail}>City, ST 12345</Text>
                <Text style={styles.partyDetail}>contact@dripjobs.com • (555) 123-4567</Text>
              </View>

              {/* Bill To Section */}
              <View style={styles.billToSection}>
                <Text style={styles.partySectionLabel}>BILL TO</Text>
                {invoice.businessName ? (
                  <>
                    <Text style={styles.partyBusinessName}>{invoice.businessName}</Text>
                    <Text style={styles.partyAttn}>ATTN: {invoice.contactName}</Text>
                    {invoice.billingAddress && (
                      <Text style={styles.partyDetail}>{invoice.billingAddress}</Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.partyContactName}>{invoice.contactName}</Text>
                    {invoice.billingAddress && (
                      <Text style={styles.partyDetail}>{invoice.billingAddress}</Text>
                    )}
                  </>
                )}
                <Text style={styles.partyDetail}>{invoice.contactEmail}</Text>
                {invoice.contactPhone && (
                  <Text style={styles.partyDetail}>{invoice.contactPhone}</Text>
                )}
              </View>

              {/* Invoice Details Bar */}
              <View style={styles.invoiceDetailsBar}>
                <View style={styles.invoiceDetailItem}>
                  <Text style={styles.invoiceDetailLabel}>Issue Date</Text>
                  <Text style={styles.invoiceDetailValue}>{formatDate(invoice.issueDate)}</Text>
                </View>
                <View style={styles.invoiceDetailItem}>
                  <Text style={styles.invoiceDetailLabel}>Due Date</Text>
                  <Text style={styles.invoiceDetailValueDue}>{formatDate(invoice.dueDate)}</Text>
                </View>
              </View>

              {/* Job Address Section (if applicable) */}
              {invoice.jobAddress && (
                <View style={styles.jobAddressSection}>
                  <Text style={styles.jobAddressLabel}>PROJECT/JOB LOCATION</Text>
                  <View style={styles.jobAddressCard}>
                    <MapPin size={18} color="#6366F1" />
                    <Text style={styles.jobAddressText}>{invoice.jobAddress}</Text>
                  </View>
                </View>
              )}

              {/* Line Items Table */}
              <View style={styles.invoiceTable}>
                <View style={styles.invoiceTableHeader}>
                  <Text style={[styles.invoiceTableHeaderText, { flex: 3 }]}>DESCRIPTION</Text>
                  <Text style={[styles.invoiceTableHeaderText, { flex: 0.7, textAlign: 'center' }]}>QTY</Text>
                  <Text style={[styles.invoiceTableHeaderText, { flex: 1.3, textAlign: 'right', paddingRight: 16 }]}>RATE</Text>
                  <Text style={[styles.invoiceTableHeaderText, { flex: 1.5, textAlign: 'right' }]}>AMOUNT</Text>
                </View>
                {localInvoiceItems.map((item, index) => (
                  <View key={index} style={styles.invoiceTableRow}>
                    <Text style={[styles.invoiceTableCell, { flex: 3 }]} numberOfLines={2}>{item.description}</Text>
                    <Text style={[styles.invoiceTableCell, { flex: 0.7, textAlign: 'center' }]}>{item.quantity}</Text>
                    <Text style={[styles.invoiceTableCell, { flex: 1.3, textAlign: 'right', paddingRight: 16 }]} numberOfLines={1}>
                      {formatCurrency(item.unitPrice)}
                    </Text>
                    <Text style={[styles.invoiceTableCell, { flex: 1.5, textAlign: 'right', fontWeight: '600' }]} numberOfLines={1}>
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Totals Section */}
              <View style={styles.invoiceTotalsSection}>
                <View style={styles.totalsRows}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalRowLabel}>Subtotal</Text>
                    <Text style={styles.totalRowValue}>{formatCurrency(calculateSubtotal())}</Text>
                  </View>
                  {invoice.discountAmount > 0 && (
                    <View style={styles.totalRow}>
                      <Text style={styles.totalRowLabel}>Discount</Text>
                      <Text style={[styles.totalRowValue, styles.discountText]}>
                        -{formatCurrency(invoice.discountAmount)}
                      </Text>
                    </View>
                  )}
                  {invoice.taxAmount > 0 && (
                    <View style={styles.totalRow}>
                      <Text style={styles.totalRowLabel}>Tax</Text>
                      <Text style={styles.totalRowValue}>{formatCurrency(invoice.taxAmount)}</Text>
                    </View>
                  )}
                  <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>TOTAL</Text>
                    <Text style={styles.grandTotalValue}>{formatCurrency(calculateTotal())}</Text>
                  </View>
                  {calculateAmountPaid() > 0 && (
                    <>
                      <View style={styles.totalRow}>
                        <Text style={styles.totalRowLabel}>Amount Paid</Text>
                        <Text style={[styles.totalRowValue, styles.paidText]}>
                          -{formatCurrency(calculateAmountPaid())}
                        </Text>
                      </View>
                      <View style={styles.balanceDueRow}>
                        <Text style={styles.balanceDueLabel}>BALANCE DUE</Text>
                        <Text style={styles.balanceDueValue}>{formatCurrency(calculateBalanceDue())}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Payment History Section */}
              {localPayments.length > 0 && (
                <View style={styles.paymentHistorySection}>
                  <Text style={styles.paymentHistorySectionTitle}>PAYMENT HISTORY</Text>
                  <View style={styles.paymentHistoryTable}>
                    <View style={styles.paymentHistoryHeader}>
                      <Text style={[styles.paymentHistoryHeaderText, { flex: 1.8 }]}>DATE</Text>
                      <Text style={[styles.paymentHistoryHeaderText, { flex: 1.5 }]}>METHOD</Text>
                      <Text style={[styles.paymentHistoryHeaderText, { flex: 1.2, textAlign: 'right', paddingRight: 12 }]}>AMOUNT</Text>
                      <Text style={[styles.paymentHistoryHeaderText, { flex: 1.5 }]}>REFERENCE</Text>
                    </View>
                    {localPayments.map((payment, index) => (
                      <View key={index} style={styles.paymentHistoryRow}>
                        <Text style={[styles.paymentHistoryCell, { flex: 1.8 }]}>
                          {formatDate(payment.processedAt)}
                        </Text>
                        <Text style={[styles.paymentHistoryCell, { flex: 1.5 }]}>{payment.method}</Text>
                        <Text style={[styles.paymentHistoryCell, { flex: 1.2, textAlign: 'right', fontWeight: '600', paddingRight: 12 }]}>
                          {formatCurrency(payment.amount)}
                        </Text>
                        <Text style={[styles.paymentHistoryCell, { flex: 1.5, color: '#6B7280' }]}>
                          {payment.transactionId || '—'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Payment Terms */}
              {invoice.settings.paymentTerms && (
                <View style={styles.paymentTermsSection}>
                  <Text style={styles.paymentTermsTitle}>PAYMENT TERMS</Text>
                  <Text style={styles.paymentTermsText}>{invoice.settings.paymentTerms}</Text>
                </View>
              )}

              {/* Footer */}
              <View style={styles.invoiceFooter}>
                <Text style={styles.invoiceFooterText}>
                  Thank you for your business!
                </Text>
                <Text style={styles.invoiceFooterSubtext}>
                  Questions? Contact us at contact@dripjobs.com or (555) 123-4567
                </Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View style={styles.previewModalActions}>
            <TouchableOpacity
              style={styles.previewModalActionButton}
              onPress={() => {
                setShowPreviewModal(false);
                setShowSendModal(true);
              }}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.previewModalActionText}>Send Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewModalActionButtonSecondary}
              onPress={() => {
                setShowPreviewModal(false);
                setShowPresentModal(true);
              }}
            >
              <Monitor size={20} color="#6366F1" />
              <Text style={styles.previewModalActionTextSecondary}>Present</Text>
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
                  {invoice.contactName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </View>
              <Text style={styles.contactModalName}>{invoice.contactName}</Text>
              {invoice.contactPhone && (
                <Text style={styles.contactModalSubtext}>{invoice.contactPhone}</Text>
              )}
              <Text style={styles.contactModalSubtext}>{invoice.contactEmail}</Text>
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
                {invoice.businessName && (
                  <View style={styles.contactInfoRow}>
                    <Building2 size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Business</Text>
                      <Text style={styles.contactInfoValue}>{invoice.businessName}</Text>
                    </View>
                  </View>
                )}
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
                {invoice.billingAddress && (
                  <View style={styles.contactInfoRow}>
                    <MapPin size={20} color="#6366F1" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Billing Address</Text>
                      <Text style={styles.contactInfoValue}>{invoice.billingAddress}</Text>
                    </View>
                  </View>
                )}
                {invoice.jobAddress && invoice.jobAddress !== invoice.billingAddress && (
                  <View style={styles.contactInfoRow}>
                    <MapPin size={20} color="#8B5CF6" />
                    <View style={styles.contactInfoTextContainer}>
                      <Text style={styles.contactInfoLabel}>Job Address</Text>
                      <Text style={styles.contactInfoValue}>{invoice.jobAddress}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Business Stakeholders */}
            {invoice.isBusiness && invoice.stakeholders && invoice.stakeholders.length > 0 && (
            <View style={styles.contactModalSection}>
                <Text style={styles.contactModalSectionTitle}>Business Stakeholders</Text>
                <View style={styles.stakeholdersList}>
                  {invoice.stakeholders.map((stakeholder) => (
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
                            {stakeholder.id === invoice.primaryContactId && (
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
            {invoice.relatedDealId && (
              <View style={styles.contactModalSection}>
                <Text style={styles.contactModalSectionTitle}>Related Deals</Text>
                <TouchableOpacity 
                  style={styles.dealCard}
                  onPress={() => {
                    if (invoice.relatedDealId) {
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
                      <Text style={styles.dealTitle}>{invoice.relatedDealTitle || 'Related Deal'}</Text>
                      <Text style={styles.dealStage}>{invoice.relatedDealStage || 'In Progress'}</Text>
                    </View>
                  </View>
                  <View style={styles.dealMeta}>
                    <View style={styles.dealMetaItem}>
                      <DollarSign size={16} color="#10B981" />
                      <Text style={styles.dealMetaText}>
                        {invoice.relatedDealAmount ? formatCurrency(invoice.relatedDealAmount) : formatCurrency(invoice.totalAmount)}
                      </Text>
                    </View>
                    {invoice.relatedDealProbability && (
                      <View style={styles.dealMetaItem}>
                        <TrendingUp size={16} color="#6366F1" />
                        <Text style={styles.dealMetaText}>{invoice.relatedDealProbability}% Probability</Text>
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
  paymentActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paymentActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  paymentActionButtonDanger: {
    backgroundColor: '#FEE2E2',
  },
  paymentActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  paymentActionTextDanger: {
    color: '#EF4444',
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
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggleOff: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 1,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
    shadowOpacity: 0.15,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    backgroundColor: 'transparent',
    padding: 0,
  },
  textAreaContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 150,
    backgroundColor: 'transparent',
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
  // Payment Collection Styles
  paymentBalanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  paymentBalanceDueRow: {
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
  },
  paymentBalanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentBalanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  paymentBalanceDueLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  paymentBalanceDueValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  currencyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: 'transparent',
  },
  newBalancePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  newBalanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  newBalanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  cardDetailGroup: {
    marginBottom: 16,
  },
  cardDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardRowGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cardDetailHalf: {
    flex: 1,
  },
  processPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  processPaymentButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  processPaymentButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stripeNotice: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  // Add Item Styles
  itemTotalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  itemTotalPreviewLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  itemTotalPreviewValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  addItemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Payment Type Selection Styles
  paymentTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTypeContent: {
    flex: 1,
  },
  paymentTypeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  paymentTypeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  // Manual Payment Method Styles
  paymentMethodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  paymentMethodOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  paymentMethodOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  paymentMethodTextActive: {
    color: '#6366F1',
  },
  // Receipt Options Styles
  receiptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  receiptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  receiptOptionsCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  receiptOptionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  receiptOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  receiptOptionText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logPaymentButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backToChoiceButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  backToChoiceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Receipt Preview Styles
  receiptPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  receiptPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  receiptPreviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  receiptDeliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  receiptDeliveryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  receiptSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  receiptBodyContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 10,
  },
  receiptBody: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  receiptPreviewActions: {
    gap: 12,
  },
  sendReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendReceiptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipReceiptButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipReceiptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Contact Info Row Styles
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  contactInfoText: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  contactActionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  contactActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  // Quick Action 6-Grid Styles
  quickActionDeal: {
    backgroundColor: '#8B5CF6',
  },
  quickActionMore: {
    backgroundColor: '#64748B',
  },
  quickActionDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  // Discount Audit Trail Styles
  discountLabelWrapper: {
    flexDirection: 'column',
    gap: 4,
  },
  discountAuditText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // Invoice Reminder Styles
  reminderToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderContent: {
    marginTop: 16,
  },
  reminderEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  reminderEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  reminderEmptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  reminderRules: {
    gap: 12,
  },
  reminderRuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reminderRuleMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderRuleInfo: {
    flex: 1,
    gap: 4,
  },
  reminderRuleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  reminderRuleSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  reminderRuleDelete: {
    padding: 8,
  },
  addReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  addReminderButtonDisabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  addReminderButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  addReminderButtonTextDisabled: {
    color: '#9CA3AF',
  },
  reminderInfo: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  reminderInfoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
  reminderDisabledState: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
  },
  reminderDisabledText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Inline Edit Mode Styles
  itemEditMode: {
    gap: 12,
  },
  itemEditRow: {
    gap: 8,
  },
  itemEditLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  itemEditInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  itemEditHalf: {
    flex: 1,
  },
  itemEditCurrencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  itemEditTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
    textAlign: 'right',
  },
  itemEditActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  itemEditCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  itemEditCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  itemEditSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  itemEditSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Present/Share Modal Styles
  presentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  presentModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  presentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  presentModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  presentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F9FAFB',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  presentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presentOptionContent: {
    flex: 1,
    gap: 4,
  },
  presentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  presentOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Preview Modal Styles
  previewDeviceToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  deviceToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deviceToggleButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  deviceToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  deviceToggleTextActive: {
    color: '#6366F1',
  },
  // Professional Invoice Preview Styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewCloseButton: {
    padding: 8,
  },
  previewModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  previewDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  previewDownloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  previewFullContent: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  invoiceDocument: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginTop: 0,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    marginBottom: 24,
  },
  companyLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  companyTagline: {
    fontSize: 13,
    color: '#6B7280',
  },
  invoiceHeaderRight: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 2,
  },
  invoiceNumberLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 4,
  },
  fromSection: {
    marginBottom: 20,
    gap: 4,
  },
  billToSection: {
    marginBottom: 24,
    gap: 4,
  },
  partySectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 8,
  },
  partyCompanyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  partyBusinessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  partyAttn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  partyContactName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  partyDetail: {
    fontSize: 13,
    color: '#6B7280',
  },
  invoiceDetailsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  invoiceDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  invoiceDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  invoiceDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  invoiceDetailValueDue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F59E0B',
  },
  jobAddressSection: {
    marginBottom: 24,
  },
  jobAddressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 10,
  },
  jobAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  jobAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  invoiceTable: {
    marginBottom: 24,
  },
  invoiceTableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  invoiceTableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  invoiceTableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  invoiceTableCell: {
    fontSize: 14,
    color: '#111827',
  },
  invoiceTotalsSection: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  totalsRows: {
    width: '55%',
    minWidth: 320,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalRowLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 0,
  },
  discountText: {
    color: '#059669',
  },
  paidText: {
    color: '#059669',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
    flexShrink: 0,
  },
  balanceDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  balanceDueLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  balanceDueValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    flexShrink: 0,
  },
  paymentHistorySection: {
    marginTop: 12,
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  paymentHistorySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1,
    marginBottom: 16,
  },
  paymentHistoryTable: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  paymentHistoryHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#E5E7EB',
  },
  paymentHistoryHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  paymentHistoryRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paymentHistoryCell: {
    fontSize: 13,
    color: '#111827',
  },
  paymentTermsSection: {
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paymentTermsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  paymentTermsText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  invoiceFooter: {
    alignItems: 'center',
    paddingTop: 32,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  invoiceFooterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  invoiceFooterSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  previewModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  previewModalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
  },
  previewModalActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewModalActionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  previewModalActionTextSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Enhanced Contact Modal Styles
  contactModalAvatar: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactModalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  contactModalSubtext: {
    fontSize: 15,
    color: '#6B7280',
  },
  contactModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactModalActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  contactModalActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  stakeholdersList: {
    gap: 12,
  },
  stakeholderCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stakeholderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stakeholderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakeholderInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stakeholderInfo: {
    flex: 1,
    gap: 4,
  },
  stakeholderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stakeholderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  primaryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stakeholderRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  stakeholderEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  dealCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  dealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dealCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dealCardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
  },
  dealCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealCardLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  contactModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  viewContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  viewContactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Enhanced Send Modal Styles
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
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  sendMethodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  sendMethodButtonTextActive: {
    color: '#FFFFFF',
  },
  stakeholderSelectionList: {
    gap: 12,
  },
  stakeholderSelectionCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stakeholderSelectionCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  stakeholderSelectionMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stakeholderCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stakeholderCheckboxActive: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  stakeholderSelectionInfo: {
    flex: 1,
    gap: 4,
  },
  stakeholderSelectionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  stakeholderSelectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  primaryBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  stakeholderSelectionRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  stakeholderSelectionEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  receivesInvoicesBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  receivesInvoicesText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  messagePreviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  messagePreviewHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  messagePreviewSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  messagePreviewBody: {
    padding: 16,
  },
  messagePreviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  // Email and Text Message Preview Styles
  emailPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  emailPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emailPreviewSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  emailPreviewBody: {
    padding: 16,
  },
  emailPreviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  textPreviewCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
  },
  textPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textPreviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textPreviewBody: {
    gap: 8,
  },
  textPreviewText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  textPreviewCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Manual Recipients Styles
  manualRecipientsList: {
    gap: 10,
    marginTop: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  contactCardInfo: {
    flex: 1,
  },
  contactCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactCardEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  manualRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  manualRecipientInfo: {
    flex: 1,
  },
  manualRecipientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  manualRecipientEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  addRecipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    marginTop: 12,
  },
  addRecipientButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Send Later Styles
  sendLaterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sendLaterToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  sendLaterToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sendLaterToggleTextActive: {
    color: '#FFFFFF',
  },
  scheduleSection: {
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  scheduleSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  schedulePresets: {
    gap: 10,
  },
  schedulePresetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  schedulePresetButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  schedulePresetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  schedulePresetTextActive: {
    color: '#FFFFFF',
  },
  inlineDatePickerContainer: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
    overflow: 'hidden',
  },
  scheduledTimeDisplay: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  scheduledTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    textAlign: 'center',
  },
  // Add Recipient Modal Styles
  addRecipientModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  addRecipientModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  addRecipientModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addRecipientModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addRecipientSearchContainer: {
    padding: 16,
  },
  addRecipientSearch: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  addRecipientList: {
    maxHeight: 400,
  },
  addRecipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addRecipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRecipientAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addRecipientItemInfo: {
    flex: 1,
  },
  addRecipientItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  addRecipientItemEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  // Payment Request Banner Styles
  paymentRequestBanner: {
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    padding: 16,
  },
  paymentRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentRequestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentRequestTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  paymentRequestStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentRequestStatusPending: {
    backgroundColor: '#FEF3C7',
  },
  paymentRequestStatusSent: {
    backgroundColor: '#DBEAFE',
  },
  paymentRequestStatusPaid: {
    backgroundColor: '#D1FAE5',
  },
  paymentRequestStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentRequestStatusTextPending: {
    color: '#92400E',
  },
  paymentRequestStatusTextSent: {
    color: '#1E40AF',
  },
  paymentRequestStatusTextPaid: {
    color: '#065F46',
  },
  paymentRequestContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentRequestInfo: {
    flex: 1,
  },
  paymentRequestAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400E',
  },
  paymentRequestDate: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 4,
  },
  paymentRequestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentRequestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
  },
  paymentRequestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentRequestButtonDanger: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  paymentRequestButtonDangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  // Payment Request Modal Styles
  paymentRequestTypeOptions: {
    gap: 12,
  },
  paymentRequestTypeOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  paymentRequestTypeOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  paymentRequestRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  paymentRequestRadioActive: {
    borderColor: '#6366F1',
  },
  paymentRequestRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
  paymentRequestTypeContent: {
    flex: 1,
    gap: 8,
  },
  paymentRequestTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  paymentRequestTypeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  paymentRequestAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentRequestInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  paymentRequestPercentageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  paymentRequestSummary: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  paymentRequestSummaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  paymentRequestSummaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
  },
  paymentRequestContinueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  paymentRequestContinueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paymentRequestPreview: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentRequestPreviewText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  sendPaymentRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  sendPaymentRequestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Quick Action Request Payment Style
  quickActionRequest: {
    backgroundColor: '#F59E0B',
  },
  // Message Editing Styles
  messagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editMessageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  editMessageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
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
    color: '#111827',
  },
  editFieldInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  editFieldTextarea: {
    minHeight: 100,
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
  // Send Timing Styles
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  sendTimingOptionActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  sendTimingOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  sendTimingOptionTextActive: {
    color: '#FFFFFF',
  },
  // Payment Requests List Styles (Payments Tab)
  paymentRequestsList: {
    gap: 12,
  },
  paymentRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  paymentRequestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentRequestAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  paymentRequestStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentRequestStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  paymentRequestCardDetails: {
    gap: 8,
  },
  paymentRequestCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentRequestCardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentRequestCardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  paymentRequestActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  paymentRequestActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  paymentRequestActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  // Mark as Paid Modal Styles
  methodOptions: {
    gap: 10,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  methodOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  methodRadioActive: {
    borderColor: '#6366F1',
  },
  methodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  methodOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  datePickerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  clearDateButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clearDateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  assignmentTypeToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  assignmentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  assignmentTypeButtonActive: {
    backgroundColor: '#6366F1',
  },
  assignmentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  assignmentTypeTextActive: {
    color: '#FFFFFF',
  },
  recordPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  recordPaymentButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
  stakeholderContactInfo: {
    gap: 4,
    marginBottom: 12,
  },
  stakeholderEmail: {
    fontSize: 14,
    color: '#374151',
  },
  stakeholderPhone: {
    fontSize: 14,
    color: '#374151',
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
  // Receipt Modal Styles
  receiptPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
  receiptDetails: {
    gap: 12,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  receiptMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sendReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  sendReceiptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Secure Payment Header Styles
  securePaymentHeader: {
    backgroundColor: '#4F46E5',
  },
  headerTitleSection: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  secureModalTitle: {
    color: '#FFFFFF',
  },
  // Payment Success Modal Styles
  successModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 12,
    marginBottom: 24,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  successDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  receiptSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  receiptSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  receiptToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  receiptToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  receiptToggleActive: {
    backgroundColor: '#6366F1',
  },
  receiptToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  receiptToggleTextActive: {
    color: '#FFFFFF',
  },
  sendReceiptButtonSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
  },
  sendReceiptButtonSuccessText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Add Item Modal New Styles
  quickSelectToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  quickSelectText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  dropdownItemPrice: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  itemRowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  taxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taxHelpText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  taxPercentDisplay: {
    position: 'absolute',
    right: 16,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  descriptionHelpText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  textareaContainer: {
    minHeight: 140,
  },
  textareaInput: {
    minHeight: 140,
    paddingTop: 12,
  },
  // HTML Formatting Toolbar
  formattingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 6,
    marginBottom: 8,
    gap: 4,
  },
  formatButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  formatButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  formatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  // Job Info Styles
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
  // Activity Log Styles
  activityLogContainer: {
    gap: 16,
  },
  activityLogItem: {
    flexDirection: 'row',
    gap: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activityDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Related Deals Styles (from chat.tsx)
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
  // Due Date Button
  dueDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
  },
  dueDateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  // Edit Icon Button Style
  editIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  // Scheduled Send Banner Styles
  scheduledBanner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduledBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  scheduledBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },
  scheduledBannerButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  // Job Info Modal Address Styles
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
  // Team Member Styles
  addTeamMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  addTeamMemberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  teamMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  teamMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamMemberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  teamMemberRole: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  removeTeamMemberButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  helpText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Integrations Tab Styles
  syncSummaryCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: 24,
  },
  syncSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qbLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncSummaryInfo: {
    flex: 1,
  },
  syncSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  syncSummarySubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  syncStatusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTimeline: {
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingLeft: 8,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timelineAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timelineDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  timelineSubItem: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 12,
    marginBottom: 2,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  viewInQBButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  viewInQBText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  syncActionsCard: {
    flexDirection: 'row',
    gap: 12,
  },
  syncActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
  },
  syncActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  syncActionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  syncActionTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  // Payment Options Styles
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
  // Currency Input Styles
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    padding: 0,
  },
  // Recipient Dropdown Styles
  recipientDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
    maxHeight: 400,
    overflow: 'hidden',
  },
  recipientDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  recipientDropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  contactList: {
    maxHeight: 300,
  },
  contactListHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  contactListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactListInfo: {
    flex: 1,
  },
  contactListName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  contactListEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  // Schedule Styles
  schedulePresetTextActive: {
    color: '#FFFFFF',
  },
  scheduledTimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  scheduledTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  // Payment Request Button Styles
  paymentRequestActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  paymentRequestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentRequestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  paymentRequestButtonDanger: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

