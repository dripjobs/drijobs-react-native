import DrawerMenu from '@/components/DrawerMenu';
import { InvoiceDetail } from '@/components/InvoiceDetail';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Building,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    DollarSign,
    Edit,
    FileText,
    Filter,
    Mail,
    MapPin,
    MessageSquare,
    MoreVertical,
    Navigation,
    Phone,
    Plus,
    RefreshCw,
    Repeat,
    Search,
    TrendingUp,
    User,
    X,
    XCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Sample recurring job data
const recurringJobData = [
  {
    id: 1,
    jobNumber: 'REC-3001',
    customerName: 'Sunshine Plaza',
    serviceName: 'Bi-Annual Pressure Wash',
    amount: 850.00,
    frequency: 'bi-annually',
    status: 'active',
    nextService: '2025-12-15',
    lastService: '2025-06-15',
    startDate: '2024-01-15',
    description: 'Pressure washing of building exterior and parking lot',
    statusColor: '#10B981',
    mrr: 70.83,
    arr: 850.00,
    customer: {
      name: 'John Smith',
      email: 'john.smith@sunshineplaza.com',
      phone: '(352) 555-1234',
      company: 'Sunshine Plaza',
      address: '789 Commerce Blvd, Orlando FL 32801'
    }
  },
  {
    id: 2,
    jobNumber: 'REC-3002',
    customerName: 'Green Valley Apartments',
    serviceName: 'Monthly Landscape Maintenance',
    amount: 450.00,
    frequency: 'monthly',
    status: 'active',
    nextService: '2025-11-01',
    lastService: '2025-10-01',
    startDate: '2024-03-01',
    description: 'Complete landscape maintenance including mowing, trimming, and fertilization',
    statusColor: '#10B981',
    mrr: 450.00,
    arr: 5400.00
  },
  {
    id: 3,
    jobNumber: 'REC-3003',
    customerName: 'Downtown Office Complex',
    serviceName: 'Quarterly Window Cleaning',
    amount: 1200.00,
    frequency: 'quarterly',
    status: 'active',
    nextService: '2026-01-05',
    lastService: '2025-10-05',
    startDate: '2023-04-05',
    description: 'Interior and exterior window cleaning for all 3 buildings',
    statusColor: '#10B981',
    mrr: 100.00,
    arr: 1200.00
  },
  {
    id: 4,
    jobNumber: 'REC-3004',
    customerName: 'Riverside Mall',
    serviceName: 'Weekly Parking Lot Sweeping',
    amount: 275.00,
    frequency: 'weekly',
    status: 'active',
    nextService: '2025-10-10',
    lastService: '2025-10-03',
    startDate: '2024-02-10',
    description: 'Power sweeping of parking lot and entrances',
    statusColor: '#10B981',
    mrr: 1192.31,
    arr: 14300.00
  },
  {
    id: 5,
    jobNumber: 'REC-3005',
    customerName: 'Harbor View Condos',
    serviceName: 'Semi-Annual Gutter Cleaning',
    amount: 650.00,
    frequency: 'semi-annually',
    status: 'active',
    nextService: '2026-04-15',
    lastService: '2025-10-15',
    startDate: '2023-10-15',
    description: 'Complete gutter cleaning and inspection for all units',
    statusColor: '#10B981',
    mrr: 54.17,
    arr: 650.00
  },
  {
    id: 6,
    jobNumber: 'REC-3006',
    customerName: 'Tech Park Business Center',
    serviceName: 'Monthly Exterior Painting Touch-ups',
    amount: 550.00,
    frequency: 'monthly',
    status: 'paused',
    nextService: null,
    lastService: '2025-08-20',
    startDate: '2024-01-20',
    description: 'Touch-up painting for exterior common areas',
    statusColor: '#F59E0B',
    mrr: 0,
    arr: 0
  },
  {
    id: 7,
    jobNumber: 'REC-3007',
    customerName: 'Lakeside Restaurant',
    serviceName: 'Monthly Hood Cleaning',
    amount: 380.00,
    frequency: 'monthly',
    status: 'active',
    nextService: '2025-11-05',
    lastService: '2025-10-05',
    startDate: '2024-05-05',
    description: 'Kitchen hood and exhaust system cleaning',
    statusColor: '#10B981',
    mrr: 380.00,
    arr: 4560.00
  },
  {
    id: 8,
    jobNumber: 'REC-3008',
    customerName: 'City Medical Plaza',
    serviceName: 'Quarterly Pressure Wash',
    amount: 950.00,
    frequency: 'quarterly',
    status: 'active',
    nextService: '2025-12-20',
    lastService: '2025-09-20',
    startDate: '2023-12-20',
    description: 'Pressure washing of walkways, building exterior, and parking garage',
    statusColor: '#10B981',
    mrr: 79.17,
    arr: 950.00
  },
  {
    id: 9,
    jobNumber: 'REC-3009',
    customerName: 'Mountain View Estates',
    serviceName: 'Bi-Weekly Lawn Service',
    amount: 325.00,
    frequency: 'bi-weekly',
    status: 'active',
    nextService: '2025-10-17',
    lastService: '2025-10-03',
    startDate: '2024-04-01',
    description: 'Mowing, edging, and blowing for HOA common areas',
    statusColor: '#10B981',
    mrr: 704.17,
    arr: 8450.00
  },
  {
    id: 10,
    jobNumber: 'REC-3010',
    customerName: 'Sunset Shopping Center',
    serviceName: 'Annual Roof Inspection & Maintenance',
    amount: 1800.00,
    frequency: 'annually',
    status: 'active',
    nextService: '2026-03-15',
    lastService: '2025-03-15',
    startDate: '2023-03-15',
    description: 'Complete roof inspection, minor repairs, and preventative maintenance',
    statusColor: '#10B981',
    mrr: 150.00,
    arr: 1800.00
  },
  {
    id: 11,
    jobNumber: 'REC-3011',
    customerName: 'Oceana Resort',
    serviceName: 'Monthly Pool Deck Power Wash',
    amount: 680.00,
    frequency: 'monthly',
    status: 'cancelled',
    nextService: null,
    lastService: '2025-06-10',
    startDate: '2024-01-10',
    description: 'Power washing of pool deck and surrounding areas',
    statusColor: '#EF4444',
    mrr: 0,
    arr: 0
  },
  {
    id: 12,
    jobNumber: 'REC-3012',
    customerName: 'Pine Ridge Office Park',
    serviceName: 'Quarterly HVAC Filter Change',
    amount: 420.00,
    frequency: 'quarterly',
    status: 'active',
    nextService: '2026-01-10',
    lastService: '2025-10-10',
    startDate: '2024-01-10',
    description: 'Filter replacement for all HVAC units',
    statusColor: '#10B981',
    mrr: 35.00,
    arr: 420.00
  }
];

const RecurringJobsScreen: React.FC = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<'nextService' | 'lastService'>('nextService');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate stats
  const stats = recurringJobData.reduce((acc, job) => {
    if (job.status === 'active') {
      acc.mrr += job.mrr;
      acc.arr += job.arr;
    }
    // Count new business (jobs started in last 3 months)
    const startDate = new Date(job.startDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    if (startDate >= threeMonthsAgo) {
      acc.newBusiness += job.amount;
    }
    return acc;
  }, { mrr: 0, arr: 0, newBusiness: 0 });

  const filteredJobs = recurringJobData.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleJobPress = (job: any) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleEditJob = () => {
    if (selectedJob) {
      setShowDetailModal(false);
      // Navigate to edit screen (to be implemented)
      console.log('Edit job:', selectedJob.jobNumber);
    }
  };

  const handleOpenInvoice = (invoiceNumber: string) => {
    // Create mock invoice data based on the selected job and invoice
    const mockInvoice = {
      id: invoiceNumber,
      invoiceNumber: invoiceNumber,
      subject: selectedJob?.serviceName || 'Recurring Service',
      status: 'paid',
      paymentStatus: 'paid',
      issueDate: '2025-10-01',
      dueDate: '2025-10-15',
      createdBy: 'System',
      sentAt: '2025-10-01',
      items: [
        {
          description: selectedJob?.serviceName || 'Recurring Service',
          quantity: 1,
          unitPrice: selectedJob?.amount || 0,
        }
      ],
      subtotal: selectedJob?.amount || 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: selectedJob?.amount || 0,
      amountPaid: selectedJob?.amount || 0,
      balanceDue: 0,
      payments: [
        {
          amount: selectedJob?.amount || 0,
          method: 'Credit Card',
          status: 'completed',
          processedAt: '2025-10-03',
          transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        }
      ],
      attachments: [],
      notes: [],
      settings: {
        allowCardPayment: true,
        waiveCardConvenienceFee: false,
        allowBankPayment: true,
        alternativePayment: false,
        lineItemQuantityOnly: false,
      },
      contactName: selectedJob?.customer?.name || selectedJob?.customerName || 'Customer',
      contactEmail: selectedJob?.customer?.email || 'customer@email.com',
      contactPhone: selectedJob?.customer?.phone || '',
      businessName: selectedJob?.customer?.company || selectedJob?.customerName || '',
      businessAddress: selectedJob?.customer?.address || '',
    };
    
    setSelectedInvoice(mockInvoice);
    // Close all modals first, then open invoice detail with slight delay
    setShowInvoicesModal(false);
    setShowDetailModal(false);
    setTimeout(() => {
      setShowInvoiceDetail(true);
    }, 300);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      'weekly': 'Weekly',
      'bi-weekly': 'Bi-Weekly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'semi-annually': 'Semi-Annual',
      'bi-annually': 'Bi-Annual',
      'annually': 'Annual'
    };
    return labels[frequency] || frequency;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="#10B981" />;
      case 'paused':
        return <Clock size={16} color="#F59E0B" />;
      case 'cancelled':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recurring Jobs</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.calendarButton}
              onPress={() => setShowCalendarModal(true)}
            >
              <Calendar size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <DollarSign size={20} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>${stats.mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.statLabel}>Total MRR</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <TrendingUp size={20} color="#3B82F6" strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>${stats.arr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.statLabel}>Total ARR</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <RefreshCw size={20} color="#F59E0B" strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>${stats.newBusiness.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.statLabel}>New Business</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recurring jobs..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={18} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Jobs List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => handleJobPress(job)}
          >
            <View style={styles.jobHeader}>
              <View style={styles.jobHeaderLeft}>
                <View style={[styles.statusDot, { backgroundColor: job.statusColor }]} />
                <Text style={styles.jobNumber}>{job.jobNumber}</Text>
              </View>
              <Repeat size={16} color="#6366F1" />
            </View>

            <Text style={styles.customerName}>{job.customerName}</Text>
            <Text style={styles.serviceName}>{job.serviceName}</Text>

            <View style={styles.jobDetails}>
              <View style={styles.jobDetail}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.jobDetailText}>{getFrequencyLabel(job.frequency)}</Text>
              </View>
              {job.nextService && (
                <View style={styles.jobDetail}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>Next: {new Date(job.nextService).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                </View>
              )}
            </View>

            <View style={styles.jobFooter}>
              <View style={styles.statusBadge}>
                {getStatusIcon(job.status)}
                <Text style={[styles.statusText, { color: job.statusColor }]}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.amount}>${job.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>

            <View style={styles.revenueInfo}>
              <Text style={styles.revenueText}>MRR: ${job.mrr.toFixed(2)}</Text>
              <Text style={styles.revenueDivider}>•</Text>
              <Text style={styles.revenueText}>ARR: ${job.arr.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Jobs</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              {['all', 'active', 'paused', 'cancelled'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedFilter(filter);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={styles.filterOptionText}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                  {selectedFilter === filter && (
                    <CheckCircle size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Job Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.fullScreenModalOverlay}>
          <View style={styles.fullScreenModalContainer}>
            {selectedJob && (
              <View style={styles.fullScreenContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <X size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Recurring Job Details</Text>
                  <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                  style={styles.fullScreenScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Status Section */}
                  <View style={styles.statusSectionTop}>
                    <Text style={styles.statusLabel}>Status</Text>
                    <TouchableOpacity style={[styles.statusDropdown, { backgroundColor: selectedJob.statusColor }]}>
                      <Text style={styles.statusDropdownText}>
                        {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                      </Text>
                      <ChevronDown size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  {/* Service Location */}
                  {selectedJob.customer && (
                    <View style={styles.addressSection}>
                      <View style={styles.addressHeaderRow}>
                        <MapPin size={20} color="#EF4444" />
                        <Text style={styles.addressLabelText}>Service Location</Text>
                      </View>
                      <Text style={styles.addressText}>{selectedJob.customer.address}</Text>
                      <View style={styles.addressButtonsRow}>
                        <TouchableOpacity 
                          style={styles.navigateButton}
                          onPress={() => console.log('Navigate')}
                        >
                          <Navigation size={16} color="#FFFFFF" />
                          <Text style={styles.navigateButtonText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.copyAddressButton}
                          onPress={() => console.log('Copy')}
                        >
                          <Copy size={16} color="#6B7280" />
                          <Text style={styles.copyAddressButtonText}>Copy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Edit Job Button */}
                  <View style={styles.editJobSection}>
                    <TouchableOpacity 
                      style={styles.editJobButton}
                      onPress={handleEditJob}
                    >
                      <Edit size={20} color="#FFFFFF" />
                      <Text style={styles.editJobButtonText}>Edit Recurring Job</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Customer Information */}
                  {selectedJob.customer && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Customer Information</Text>
                      
                      {/* Email */}
                      <View style={styles.contactItem}>
                        <Mail size={16} color="#6B7280" />
                        <Text style={styles.contactItemText}>{selectedJob.customer.email}</Text>
                        <TouchableOpacity style={styles.contactMenuButton}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      {/* Phone */}
                      <View style={styles.contactItem}>
                        <Phone size={16} color="#6B7280" />
                        <Text style={styles.contactItemText}>{selectedJob.customer.phone}</Text>
                        <TouchableOpacity style={styles.contactMenuButton}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      {/* Company */}
                      <View style={styles.contactItem}>
                        <Building size={16} color="#6B7280" />
                        <Text style={styles.contactItemText}>{selectedJob.customer.company}</Text>
                        <TouchableOpacity style={styles.contactMenuButton}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      {/* Address */}
                      <View style={styles.contactItem}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.contactItemText}>{selectedJob.customer.address}</Text>
                        <TouchableOpacity style={styles.contactMenuButton}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>

                      {/* Contact Name */}
                      <View style={styles.contactItem}>
                        <User size={16} color="#6B7280" />
                        <Text style={styles.contactItemText}>{selectedJob.customer.name}</Text>
                        <TouchableOpacity style={styles.contactMenuButton}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Quick Actions - Contact Customer */}
                  {selectedJob.customer && (
                    <View style={styles.quickActionsRow}>
                      <TouchableOpacity style={styles.quickActionCall}>
                        <Phone size={20} color="#FFFFFF" />
                        <Text style={styles.quickActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickActionText2}>
                        <MessageSquare size={20} color="#FFFFFF" />
                        <Text style={styles.quickActionText}>Text</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickActionEmail}>
                        <Mail size={20} color="#FFFFFF" />
                        <Text style={styles.quickActionText}>Email</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Schedule Information */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Schedule Information</Text>
                    
                    <View style={styles.jobDetailRow}>
                      <Text style={styles.jobDetailLabel}>Frequency</Text>
                      <Text style={styles.jobDetailValue}>{getFrequencyLabel(selectedJob.frequency)}</Text>
                    </View>
                    <View style={styles.jobDetailRow}>
                      <Text style={styles.jobDetailLabel}>Contract Start Date</Text>
                      <Text style={styles.jobDetailValue}>
                        {new Date(selectedJob.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                    {selectedJob.lastService && (
                      <View style={styles.jobDetailRow}>
                        <Text style={styles.jobDetailLabel}>Last Service</Text>
                        <Text style={styles.jobDetailValue}>
                          {new Date(selectedJob.lastService).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                    )}
                    {selectedJob.nextService && (
                      <View style={styles.jobDetailRow}>
                        <Text style={styles.jobDetailLabel}>Next Service</Text>
                        <Text style={[styles.jobDetailValue, styles.nextServiceHighlight]}>
                          {new Date(selectedJob.nextService).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                    )}
                    <View style={styles.jobDetailRow}>
                      <Text style={styles.jobDetailLabel}>Contract Length</Text>
                      <Text style={styles.jobDetailValue}>
                        {Math.floor((new Date().getTime() - new Date(selectedJob.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </Text>
                    </View>
                  </View>

                  {/* Financial Details */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Financial Details</Text>
                    
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Service Amount</Text>
                      <Text style={styles.financialValueLarge}>${selectedJob.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Monthly Recurring Revenue (MRR)</Text>
                      <Text style={styles.financialValue}>${selectedJob.mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Annual Recurring Revenue (ARR)</Text>
                      <Text style={styles.financialValue}>${selectedJob.arr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Total Revenue Collected</Text>
                      <Text style={[styles.financialValue, styles.totalRevenueHighlight]}>
                        ${(selectedJob.mrr * Math.floor((new Date().getTime() - new Date(selectedJob.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    
                    <View style={styles.financialButtonsRow}>
                      <TouchableOpacity 
                        style={styles.financialButton}
                        onPress={() => {
                          setShowDetailModal(false);
                          setShowInvoicesModal(true);
                        }}
                      >
                        <DollarSign size={18} color="#6366F1" />
                        <Text style={styles.financialButtonText}>View Invoices</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.financialButton}>
                        <FileText size={18} color="#6366F1" />
                        <Text style={styles.financialButtonText}>View Proposal</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Invoice History */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Invoice History</Text>
                    
                    <View style={styles.invoiceHistoryItem}>
                      <View style={styles.invoiceHistoryIcon}>
                        <CheckCircle size={16} color="#10B981" />
                      </View>
                      <View style={styles.invoiceHistoryInfo}>
                        <Text style={styles.invoiceHistoryDate}>October 2025</Text>
                        <Text style={styles.invoiceHistoryStatus}>Paid • Oct 1, 2025</Text>
                      </View>
                      <Text style={styles.invoiceHistoryAmount}>${selectedJob.amount.toFixed(2)}</Text>
                    </View>

                    <View style={styles.invoiceHistoryItem}>
                      <View style={styles.invoiceHistoryIcon}>
                        <CheckCircle size={16} color="#10B981" />
                      </View>
                      <View style={styles.invoiceHistoryInfo}>
                        <Text style={styles.invoiceHistoryDate}>September 2025</Text>
                        <Text style={styles.invoiceHistoryStatus}>Paid • Sep 1, 2025</Text>
                      </View>
                      <Text style={styles.invoiceHistoryAmount}>${selectedJob.amount.toFixed(2)}</Text>
                    </View>

                    <View style={styles.invoiceHistoryItem}>
                      <View style={styles.invoiceHistoryIcon}>
                        <CheckCircle size={16} color="#10B981" />
                      </View>
                      <View style={styles.invoiceHistoryInfo}>
                        <Text style={styles.invoiceHistoryDate}>August 2025</Text>
                        <Text style={styles.invoiceHistoryStatus}>Paid • Aug 1, 2025</Text>
                      </View>
                      <Text style={styles.invoiceHistoryAmount}>${selectedJob.amount.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.viewAllInvoicesButton}
                      onPress={() => {
                        setShowDetailModal(false);
                        setShowInvoicesModal(true);
                      }}
                    >
                      <Text style={styles.viewAllInvoicesText}>View All Invoices</Text>
                      <ChevronRight size={16} color="#6366F1" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bottomSpacing} />
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Invoices Modal */}
      <Modal
        visible={showInvoicesModal}
        animationType="slide"
        onRequestClose={() => setShowInvoicesModal(false)}
      >
        <SafeAreaView style={styles.invoicesModalContainer}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.invoicesHeaderGradient}>
            <View style={styles.invoicesHeader}>
              <TouchableOpacity onPress={() => {
                setShowInvoicesModal(false);
                setShowDetailModal(true);
              }}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.invoicesHeaderTitle}>Invoices</Text>
              <TouchableOpacity style={styles.addInvoiceButton}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <View style={styles.invoiceJobInfo}>
                <Text style={styles.invoiceJobName}>{selectedJob.serviceName}</Text>
                <Text style={styles.invoiceJobCustomer}>{selectedJob.customerName}</Text>
              </View>
            )}
          </LinearGradient>

          <ScrollView style={styles.invoicesContent} showsVerticalScrollIndicator={false}>
            {/* Auto-Invoice Toggle */}
            <View style={styles.autoInvoiceSection}>
              <View style={styles.autoInvoiceHeader}>
                <View style={styles.autoInvoiceInfo}>
                  <Text style={styles.autoInvoiceTitle}>Automatic Invoicing</Text>
                  <Text style={styles.autoInvoiceDescription}>
                    Automatically create and send invoices based on service frequency
                  </Text>
                </View>
                <View style={[styles.autoInvoiceToggle, styles.autoInvoiceToggleOn]}>
                  <View style={styles.autoInvoiceToggleCircle} />
                </View>
              </View>
              <View style={styles.autoInvoiceStatus}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.autoInvoiceStatusText}>Automatic invoicing is ON</Text>
              </View>
            </View>

            {/* Most Recent Invoice */}
            {selectedJob && (
              <View style={styles.recentInvoiceSection}>
                <Text style={styles.sectionTitle}>Most Recent Invoice</Text>
                
                <View style={styles.recentInvoiceCard}>
                  <View style={styles.recentInvoiceHeader}>
                    <View>
                      <Text style={styles.recentInvoiceNumber}>INV-1245</Text>
                      <Text style={styles.recentInvoiceDate}>October 1, 2025</Text>
                    </View>
                    <View style={styles.recentInvoiceStatusBadge}>
                      <Text style={styles.recentInvoiceStatusText}>Paid</Text>
                    </View>
                  </View>

                  <View style={styles.recentInvoiceDetails}>
                    <View style={styles.recentInvoiceDetailRow}>
                      <Text style={styles.recentInvoiceDetailLabel}>Amount</Text>
                      <Text style={styles.recentInvoiceDetailValue}>
                        ${selectedJob.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    <View style={styles.recentInvoiceDetailRow}>
                      <Text style={styles.recentInvoiceDetailLabel}>Paid Date</Text>
                      <Text style={styles.recentInvoiceDetailValue}>October 3, 2025</Text>
                    </View>
                    <View style={styles.recentInvoiceDetailRow}>
                      <Text style={styles.recentInvoiceDetailLabel}>Payment Method</Text>
                      <Text style={styles.recentInvoiceDetailValue}>Credit Card</Text>
                    </View>
                  </View>

                  <View style={styles.recentInvoiceButtons}>
                    <TouchableOpacity 
                      style={styles.recentInvoiceButtonPrimary}
                      onPress={() => handleOpenInvoice('INV-1245')}
                    >
                      <FileText size={18} color="#FFFFFF" />
                      <Text style={styles.recentInvoiceButtonPrimaryText}>Open Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recentInvoiceButtonSecondary}>
                      <Mail size={18} color="#6366F1" />
                      <Text style={styles.recentInvoiceButtonSecondaryText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* All Invoices List */}
            <View style={styles.allInvoicesSection}>
              <Text style={styles.sectionTitle}>All Invoices</Text>

              {selectedJob && [
                { month: 'October 2025', date: 'Oct 1, 2025', status: 'paid', number: 'INV-1245', paidDate: 'Oct 3, 2025' },
                { month: 'September 2025', date: 'Sep 1, 2025', status: 'paid', number: 'INV-1198', paidDate: 'Sep 2, 2025' },
                { month: 'August 2025', date: 'Aug 1, 2025', status: 'paid', number: 'INV-1156', paidDate: 'Aug 5, 2025' },
                { month: 'July 2025', date: 'Jul 1, 2025', status: 'paid', number: 'INV-1102', paidDate: 'Jul 1, 2025' },
                { month: 'June 2025', date: 'Jun 1, 2025', status: 'paid', number: 'INV-1058', paidDate: 'Jun 3, 2025' },
                { month: 'May 2025', date: 'May 1, 2025', status: 'overdue', number: 'INV-1012', paidDate: null },
                { month: 'April 2025', date: 'Apr 1, 2025', status: 'paid', number: 'INV-965', paidDate: 'Apr 15, 2025' },
              ].map((invoice, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.invoiceListItem}
                  onPress={() => handleOpenInvoice(invoice.number)}
                >
                  <View style={styles.invoiceListIcon}>
                    {invoice.status === 'paid' ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : invoice.status === 'overdue' ? (
                      <XCircle size={20} color="#EF4444" />
                    ) : (
                      <Clock size={20} color="#F59E0B" />
                    )}
                  </View>
                  <View style={styles.invoiceListInfo}>
                    <Text style={styles.invoiceListMonth}>{invoice.month}</Text>
                    <Text style={styles.invoiceListNumber}>{invoice.number}</Text>
                    <Text style={[
                      styles.invoiceListStatus,
                      invoice.status === 'paid' && styles.invoiceListStatusPaid,
                      invoice.status === 'overdue' && styles.invoiceListStatusOverdue
                    ]}>
                      {invoice.status === 'paid' 
                        ? `Paid • ${invoice.paidDate}` 
                        : invoice.status === 'overdue'
                        ? 'Overdue'
                        : 'Pending'}
                    </Text>
                  </View>
                  <View style={styles.invoiceListRight}>
                    <Text style={styles.invoiceListAmount}>
                      ${selectedJob.amount.toFixed(2)}
                    </Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Invoice Detail Modal - Render separately to ensure clean navigation */}
      <Modal
        visible={showInvoiceDetail && selectedInvoice !== null}
        animationType="slide"
        onRequestClose={() => {
          setShowInvoiceDetail(false);
          setSelectedInvoice(null);
        }}
      >
        {selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onBack={() => {
              setShowInvoiceDetail(false);
              setSelectedInvoice(null);
              // Optionally reopen invoices modal
              setTimeout(() => {
                setShowInvoicesModal(true);
              }, 300);
            }}
            onUpdate={() => {
              // Handle invoice update
              console.log('Invoice updated');
            }}
          />
        )}
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        animationType="slide"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <SafeAreaView style={styles.calendarModalContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
              <ChevronLeft size={24} color="#6366F1" />
            </TouchableOpacity>
            <Text style={styles.calendarHeaderTitle}>Recurring Jobs Calendar</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.calendarPlaceholder}>Calendar view coming soon...</Text>
        </SafeAreaView>
      </Modal>

      <DrawerMenu isOpen={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    gap: 4,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  jobNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  customerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  revenueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  revenueText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  revenueDivider: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '50%',
  },
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fullScreenContent: {
    flex: 1,
  },
  fullScreenScrollView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  filterOptions: {
    gap: 8,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  statusSectionTop: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  statusDropdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addressSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addressLabelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  addressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  addressButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  copyAddressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  copyAddressButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  editJobSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  editJobButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItemText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  contactMenuButton: {
    padding: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickActionCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionEmail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jobDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  jobDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  nextServiceHighlight: {
    color: '#6366F1',
    fontWeight: '700',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  financialLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  financialValueLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  totalRevenueHighlight: {
    color: '#10B981',
    fontSize: 18,
  },
  financialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  financialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  financialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  invoiceHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  invoiceHistoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceHistoryInfo: {
    flex: 1,
  },
  invoiceHistoryDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  invoiceHistoryStatus: {
    fontSize: 13,
    color: '#6B7280',
  },
  invoiceHistoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllInvoicesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    marginTop: 8,
  },
  viewAllInvoicesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  bottomSpacing: {
    height: 40,
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  calendarPlaceholder: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#6B7280',
  },
  // Invoices Modal Styles
  invoicesModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  invoicesHeaderGradient: {
    paddingBottom: 20,
  },
  invoicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  invoicesHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addInvoiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceJobInfo: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  invoiceJobName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  invoiceJobCustomer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  invoicesContent: {
    flex: 1,
  },
  autoInvoiceSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  autoInvoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  autoInvoiceInfo: {
    flex: 1,
    paddingRight: 16,
  },
  autoInvoiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  autoInvoiceDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  autoInvoiceToggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  autoInvoiceToggleOn: {
    backgroundColor: '#10B981',
    alignItems: 'flex-end',
  },
  autoInvoiceToggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  autoInvoiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  autoInvoiceStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  recentInvoiceSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  recentInvoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentInvoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentInvoiceNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  recentInvoiceDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  recentInvoiceStatusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  recentInvoiceStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  recentInvoiceDetails: {
    gap: 12,
    marginBottom: 16,
  },
  recentInvoiceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentInvoiceDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  recentInvoiceDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  recentInvoiceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  recentInvoiceButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  recentInvoiceButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recentInvoiceButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  recentInvoiceButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  allInvoicesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  invoiceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  invoiceListIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceListInfo: {
    flex: 1,
  },
  invoiceListMonth: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  invoiceListNumber: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  invoiceListStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  invoiceListStatusPaid: {
    color: '#10B981',
  },
  invoiceListStatusOverdue: {
    color: '#EF4444',
  },
  invoiceListRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invoiceListAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

export default RecurringJobsScreen;

