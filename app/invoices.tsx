import DrawerMenu from '@/components/DrawerMenu';
import { InvoiceDetail } from '@/components/InvoiceDetail';
import NewInvoiceModal from '@/components/NewInvoiceModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Filter,
    Plus,
    Search,
    XCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Sample invoice data
const invoiceData = [
  {
    id: 1,
    invoiceNumber: 'INV-1001',
    customerName: 'Robert Johnson',
    amount: 5200.00,
    status: 'paid',
    dueDate: '2025-09-15',
    issueDate: '2025-09-01',
    items: ['Kitchen Renovation - Design Phase', 'Materials Deposit'],
    statusColor: '#10B981'
  },
  {
    id: 2,
    invoiceNumber: 'INV-1002',
    customerName: 'Sherry Williams',
    amount: 3800.00,
    status: 'pending',
    dueDate: '2025-10-10',
    issueDate: '2025-09-25',
    items: ['Bathroom Remodel - Labor', 'Plumbing Fixtures'],
    statusColor: '#F59E0B'
  },
  {
    id: 3,
    invoiceNumber: 'INV-1003',
    customerName: 'Billy Thompson',
    amount: 12500.00,
    status: 'overdue',
    dueDate: '2025-09-20',
    issueDate: '2025-09-05',
    items: ['Commercial Office Renovation', 'Electrical Work'],
    statusColor: '#EF4444'
  },
  {
    id: 4,
    invoiceNumber: 'INV-1004',
    customerName: 'Sarah Martinez',
    amount: 2100.00,
    status: 'paid',
    dueDate: '2025-09-30',
    issueDate: '2025-09-15',
    items: ['Consultation Fee', 'Design Review'],
    statusColor: '#10B981'
  },
  {
    id: 5,
    invoiceNumber: 'INV-1005',
    customerName: 'Michael Davis',
    amount: 8750.00,
    status: 'pending',
    dueDate: '2025-10-15',
    issueDate: '2025-09-28',
    items: ['Deck Construction', 'Materials'],
    statusColor: '#F59E0B'
  },
  {
    id: 6,
    invoiceNumber: 'INV-1006',
    customerName: 'Jennifer Lee',
    amount: 4200.00,
    status: 'draft',
    dueDate: '2025-10-20',
    issueDate: '2025-10-01',
    items: ['Garage Door Installation', 'Labor'],
    statusColor: '#6B7280'
  },
  {
    id: 7,
    invoiceNumber: 'INV-1007',
    customerName: 'David Wilson',
    amount: 15600.00,
    status: 'paid',
    dueDate: '2025-09-25',
    issueDate: '2025-09-10',
    items: ['Complete Home Remodel - Phase 1', 'Materials & Labor'],
    statusColor: '#10B981'
  },
  {
    id: 8,
    invoiceNumber: 'INV-1008',
    customerName: 'Lisa Anderson',
    amount: 3200.00,
    status: 'overdue',
    dueDate: '2025-09-18',
    issueDate: '2025-09-03',
    items: ['HVAC Installation', 'Equipment'],
    statusColor: '#EF4444'
  },
  {
    id: 9,
    invoiceNumber: 'INV-1009',
    customerName: 'James Brown',
    amount: 6500.00,
    status: 'pending',
    dueDate: '2025-10-12',
    issueDate: '2025-09-27',
    items: ['Roofing Repair', 'Materials'],
    statusColor: '#F59E0B'
  },
  {
    id: 10,
    invoiceNumber: 'INV-1010',
    customerName: 'Maria Garcia',
    amount: 4800.00,
    status: 'paid',
    dueDate: '2025-09-28',
    issueDate: '2025-09-13',
    items: ['Flooring Installation', 'Labor & Materials'],
    statusColor: '#10B981'
  },
  {
    id: 11,
    invoiceNumber: 'INV-1011',
    customerName: 'Acme Construction Inc.',
    businessName: 'Acme Construction Inc.',
    amount: 24500.00,
    status: 'pending',
    dueDate: '2025-10-25',
    issueDate: '2025-10-05',
    items: ['Commercial Building Project - Phase 1', 'Materials & Labor'],
    statusColor: '#F59E0B',
    isBusiness: true
  },
  {
    id: 12,
    invoiceNumber: 'INV-1012',
    customerName: 'TechStart Solutions LLC',
    businessName: 'TechStart Solutions LLC',
    amount: 18750.00,
    status: 'overdue',
    dueDate: '2025-09-22',
    issueDate: '2025-09-08',
    items: ['Office Renovation', 'IT Infrastructure Setup'],
    statusColor: '#EF4444',
    isBusiness: true
  },
  {
    id: 13,
    invoiceNumber: 'INV-1013',
    customerName: 'Green Valley Developers',
    businessName: 'Green Valley Developers',
    amount: 32000.00,
    status: 'paid',
    dueDate: '2025-09-30',
    issueDate: '2025-09-16',
    items: ['Residential Complex - Foundation Work', 'Site Preparation'],
    statusColor: '#10B981',
    isBusiness: true
  }
];

export default function InvoicesPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);
  const [invoiceForEditor, setInvoiceForEditor] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  const statusFilters = [
    { value: 'all', label: 'All', color: '#6B7280' },
    { value: 'paid', label: 'Paid', color: '#10B981' },
    { value: 'pending', label: 'Pending', color: '#F59E0B' },
    { value: 'overdue', label: 'Overdue', color: '#EF4444' },
    { value: 'draft', label: 'Draft', color: '#6B7280' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} color="#10B981" />;
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      case 'overdue':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'draft':
        return <FileText size={20} color="#6B7280" />;
      default:
        return <FileText size={20} color="#6B7280" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter invoices based on search, status, and date range
  const filteredInvoices = invoiceData.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (invoice.businessName && invoice.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || invoice.status === selectedStatus;
    
    // Date range filter
    let matchesDateRange = true;
    const invoiceDate = new Date(invoice.issueDate);
    if (startDate && invoiceDate < startDate) {
      matchesDateRange = false;
    }
    if (endDate && invoiceDate > endDate) {
      matchesDateRange = false;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Calculate totals
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const handleInvoicePress = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleOpenInvoice = () => {
    if (!selectedInvoice) return;
    
    // Create business-specific data
    const isBusinessInvoice = selectedInvoice.isBusiness === true;
    const businessStakeholders = isBusinessInvoice ? [
      {
        id: '1',
        name: 'John Anderson',
        email: 'john.anderson@' + selectedInvoice.businessName.toLowerCase().replace(/ /g, '') + '.com',
        phone: '(555) 123-4567',
        role: 'CEO',
        receiveInvoices: false,
      },
      {
        id: '2',
        name: 'Emily Roberts',
        email: 'emily.roberts@' + selectedInvoice.businessName.toLowerCase().replace(/ /g, '') + '.com',
        phone: '(555) 234-5678',
        role: 'Billing Manager',
        receiveInvoices: true,
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael.chen@' + selectedInvoice.businessName.toLowerCase().replace(/ /g, '') + '.com',
        phone: '(555) 345-6789',
        role: 'Operations Manager',
        receiveInvoices: false,
      },
    ] : undefined;
    
    // Create full invoice data for the editor
    const fullInvoice = {
      id: selectedInvoice.id.toString(),
      invoiceNumber: selectedInvoice.invoiceNumber,
      subject: selectedInvoice.items.join(', '),
      status: selectedInvoice.status,
      paymentStatus: selectedInvoice.status === 'paid' ? 'paid' : selectedInvoice.status === 'overdue' ? 'overdue' : 'unpaid',
      issueDate: selectedInvoice.issueDate,
      dueDate: selectedInvoice.dueDate,
      createdBy: 'System',
      sentAt: selectedInvoice.status !== 'draft' ? selectedInvoice.issueDate : undefined,
      items: selectedInvoice.items.map((item: string) => ({
        description: item,
        quantity: 1,
        unitPrice: selectedInvoice.amount / selectedInvoice.items.length,
      })),
      subtotal: selectedInvoice.amount,
      taxAmount: 0,
      discountAmount: 0,
      proposalDiscountAmount: isBusinessInvoice ? 500 : undefined,
      totalAmount: selectedInvoice.amount,
      amountPaid: selectedInvoice.status === 'paid' ? selectedInvoice.amount : 0,
      balanceDue: selectedInvoice.status === 'paid' ? 0 : selectedInvoice.amount,
      payments: selectedInvoice.status === 'paid' ? [{
        amount: selectedInvoice.amount,
        method: 'Credit Card',
        status: 'completed',
        processedAt: selectedInvoice.dueDate,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      }] : [],
      attachments: [],
      notes: [],
      settings: {
        allowCardPayment: true,
        waiveCardConvenienceFee: false,
        allowBankPayment: true,
        alternativePayment: false,
        lineItemQuantityOnly: false,
        paymentTerms: isBusinessInvoice ? 'Net 30 - Payment due within 30 days of invoice date.' : undefined,
      },
      contactName: isBusinessInvoice ? businessStakeholders![0].name : selectedInvoice.customerName,
      contactEmail: isBusinessInvoice ? businessStakeholders![0].email : selectedInvoice.customerName.toLowerCase().replace(' ', '.') + '@email.com',
      contactPhone: isBusinessInvoice ? businessStakeholders![0].phone : '(555) 987-6543',
      businessName: selectedInvoice.businessName || '',
      businessAddress: isBusinessInvoice ? '123 Corporate Plaza, Business District, City, ST 12345' : '',
      isBusiness: isBusinessInvoice,
      primaryContactId: isBusinessInvoice ? '1' : undefined,
      stakeholders: businessStakeholders,
      billingAddress: isBusinessInvoice ? '456 Billing Ave, Suite 200, City, ST 12345' : undefined,
      jobAddress: isBusinessInvoice ? '789 Project Site Rd, Industrial Park, City, ST 12345' : '321 Residential St, City, ST 12345',
      relatedDealId: isBusinessInvoice ? 'DEAL-' + selectedInvoice.id : undefined,
      relatedDealTitle: isBusinessInvoice ? selectedInvoice.businessName + ' - ' + selectedInvoice.items[0] : undefined,
      relatedDealStage: isBusinessInvoice ? 'Proposal Stage' : undefined,
      relatedDealAmount: isBusinessInvoice ? selectedInvoice.amount * 1.2 : undefined,
      relatedDealProbability: isBusinessInvoice ? 75 : undefined,
      relatedProposalId: isBusinessInvoice ? 'PROP-' + selectedInvoice.id : undefined,
      relatedProposalNumber: isBusinessInvoice ? 'PROP-200' + selectedInvoice.id : undefined,
      jobInfo: {
        addressLine1: isBusinessInvoice ? '789 Project Site Rd' : '321 Residential St',
        addressLine2: isBusinessInvoice ? 'Suite 200' : undefined,
        city: 'Springfield',
        state: 'CA',
        postalCode: isBusinessInvoice ? '94105' : '94102',
        salesperson: isBusinessInvoice ? 'Sarah Martinez' : 'Mike Johnson',
        startDate: selectedInvoice.issueDate,
        endDate: selectedInvoice.status === 'paid' ? selectedInvoice.dueDate : undefined,
        crew: isBusinessInvoice ? 'Team Alpha' : undefined,
        teamMembers: isBusinessInvoice ? undefined : [
          { name: 'John Doe', role: 'Lead Painter' },
          { name: 'Jane Smith', role: 'Assistant' }
        ],
      },
      scheduledSendDate: selectedInvoice.invoiceNumber === 'INV-1013' ? '2025-10-15T20:00:00.000Z' : undefined,
      activityLog: [
        {
          id: '1',
          action: 'Invoice created',
          details: 'Initial invoice generated from proposal',
          user: 'System',
          timestamp: selectedInvoice.issueDate + ' at 9:30 AM',
          icon: 'edit' as const,
        },
        ...(selectedInvoice.status !== 'draft' ? [{
          id: '2',
          action: 'Invoice sent',
          details: `Sent to ${isBusinessInvoice ? businessStakeholders![0].email : selectedInvoice.customerName.toLowerCase().replace(' ', '.') + '@email.com'}`,
          user: 'Sarah Martinez',
          timestamp: selectedInvoice.issueDate + ' at 10:15 AM',
          icon: 'send' as const,
        }] : []),
        ...(selectedInvoice.status === 'paid' ? [{
          id: '3',
          action: 'Payment received',
          details: `$${selectedInvoice.amount.toFixed(2)} paid via Credit Card`,
          user: 'System',
          timestamp: selectedInvoice.dueDate + ' at 2:45 PM',
          icon: 'payment' as const,
        }] : []),
      ],
    };
    
    setInvoiceForEditor(fullInvoice);
    setShowDetailModal(false);
    setTimeout(() => {
      setShowInvoiceEditor(true);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
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
          <Text style={styles.headerTitle}>Invoices</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => setShowCreateInvoiceModal(true)}
            >
              <Plus size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by customer or invoice #"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Status Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedStatus === filter.value && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(selectedStatus === filter.value ? null : filter.value)}
            >
              <Text style={[
                styles.filterChipText,
                selectedStatus === filter.value && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Invoice List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.invoiceList}>
          {filteredInvoices.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No invoices found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search' : 'No invoices match the selected filters'}
              </Text>
            </View>
          ) : (
            filteredInvoices.map((invoice) => (
              <TouchableOpacity
                key={invoice.id}
                style={[styles.invoiceCard, invoice.isBusiness && styles.invoiceCardBusiness]}
                onPress={() => handleInvoicePress(invoice)}
              >
                <View style={styles.invoiceContent}>
                  <View style={styles.invoiceLeft}>
                    <View style={[styles.statusIndicator, { backgroundColor: invoice.statusColor }]} />
                    <View style={styles.invoiceInfo}>
                      <View style={styles.customerNameRow}>
                        {invoice.isBusiness && (
                          <Building2 size={18} color="#8B5CF6" style={{ marginRight: 6 }} />
                        )}
                        <Text style={styles.customerName}>
                          {invoice.businessName || invoice.customerName}
                        </Text>
                      </View>
                      <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.invoiceRight}>
                    <Text style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: invoice.statusColor }]}>
                      <Text style={styles.statusBadgeText}>{getStatusLabel(invoice.status)}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.openButton}
                  onPress={() => handleInvoicePress(invoice)}
                >
                  <Text style={styles.openButtonText}>Open</Text>
                  <ChevronRight size={14} color="#6366F1" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Invoices</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalSectionTitle}>Status</Text>
              {statusFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={styles.modalFilterOption}
                  onPress={() => {
                    setSelectedStatus(filter.value === 'all' ? null : filter.value);
                  }}
                >
                  <View style={[styles.filterOptionColor, { backgroundColor: filter.color }]} />
                  <Text style={styles.filterOptionText}>{filter.label}</Text>
                  {selectedStatus === filter.value && <CheckCircle size={20} color="#6366F1" />}
                </TouchableOpacity>
              ))}

              {/* Date Range Filter */}
              <Text style={[styles.modalSectionTitle, { marginTop: 24 }]}>Date Range</Text>
              
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Calendar size={18} color="#6366F1" />
                  <View style={styles.datePickerTextContainer}>
                    <Text style={styles.datePickerLabel}>Start Date</Text>
                    <Text style={styles.datePickerValue}>
                      {startDate ? startDate.toLocaleDateString() : 'Select date'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Calendar size={18} color="#6366F1" />
                  <View style={styles.datePickerTextContainer}>
                    <Text style={styles.datePickerLabel}>End Date</Text>
                    <Text style={styles.datePickerValue}>
                      {endDate ? endDate.toLocaleDateString() : 'Select date'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {(startDate || endDate) && (
                <TouchableOpacity
                  style={styles.clearDatesButton}
                  onPress={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <Text style={styles.clearDatesText}>Clear Dates</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedStatus(null);
                  setStartDate(null);
                  setEndDate(null);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
            
            {/* Date Pickers */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setStartDate(selectedDate);
                  }
                }}
              />
            )}
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedInvoice && (
              <ScrollView style={styles.detailModalContent}>
                {/* Invoice Header Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailInvoiceNumber}>{selectedInvoice.invoiceNumber}</Text>
                  <View style={[styles.detailStatusBadge, { backgroundColor: selectedInvoice.statusColor }]}>
                    <Text style={styles.detailStatusText}>{getStatusLabel(selectedInvoice.status)}</Text>
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Customer</Text>
                  <Text style={styles.detailCustomerName}>{selectedInvoice.customerName}</Text>
                </View>

                {/* Amount */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Amount</Text>
                  <Text style={styles.detailAmount}>${selectedInvoice.amount.toLocaleString()}</Text>
                </View>

                {/* Dates */}
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Issue Date:</Text>
                    <Text style={styles.detailValue}>{selectedInvoice.issueDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date:</Text>
                    <Text style={[
                      styles.detailValue,
                      selectedInvoice.status === 'overdue' && { color: '#EF4444' }
                    ]}>
                      {selectedInvoice.dueDate}
                    </Text>
                  </View>
                </View>

                {/* Items */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Items</Text>
                  {selectedInvoice.items.map((item: string, index: number) => (
                    <View key={index} style={styles.detailItemRow}>
                      <View style={styles.detailItemBullet} />
                      <Text style={styles.detailItemText}>{item}</Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.detailActions}>
                  <TouchableOpacity 
                    style={styles.detailPrimaryButton}
                    onPress={handleOpenInvoice}
                  >
                    <FileText size={20} color="#FFFFFF" />
                    <Text style={styles.detailPrimaryButtonText}>Open Full Invoice</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Invoice Editor Modal */}
      <Modal
        visible={showInvoiceEditor && invoiceForEditor !== null}
        animationType="slide"
        onRequestClose={() => {
          setShowInvoiceEditor(false);
          setInvoiceForEditor(null);
        }}
      >
        {invoiceForEditor && (
          <InvoiceDetail
            invoice={invoiceForEditor}
            onBack={() => {
              setShowInvoiceEditor(false);
              setInvoiceForEditor(null);
            }}
            onUpdate={() => {
              // Handle invoice update
              console.log('Invoice updated');
            }}
          />
        )}
      </Modal>

      {/* Create Invoice Modal */}
      <NewInvoiceModal
        visible={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        onInvoiceCreated={(invoiceId) => {
          setShowCreateInvoiceModal(false);
          // In production, fetch the created invoice and open it
          console.log('Invoice created:', invoiceId);
          // For now, just show a success message
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipsContainer: {
    paddingHorizontal: 20,
  },
  filterChipsContent: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterChipTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  invoiceList: {
    padding: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  invoiceCardBusiness: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  invoiceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
  },
  invoiceInfo: {
    flex: 1,
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  invoiceNumber: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  openButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  bottomSpacing: {
    height: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  modalFilterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  filterOptionColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clearFiltersButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  applyFiltersButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateRangeContainer: {
    gap: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePickerTextContainer: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  clearDatesButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  clearDatesText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  detailModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  detailModalContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailInvoiceNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  detailStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  detailStatusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailCustomerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  detailAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  detailItemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginTop: 7,
  },
  detailItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 20,
  },
  detailActions: {
    marginTop: 8,
    gap: 12,
  },
  detailPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  detailPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

