import DrawerMenu from '@/components/DrawerMenu';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    Clock,
    DollarSign,
    Edit,
    Filter,
    Plus,
    RefreshCw,
    Repeat,
    Search,
    TrendingUp,
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
    arr: 850.00
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
  const [selectedJob, setSelectedJob] = useState<any>(null);
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
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Job Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Job Number</Text>
                    <Text style={styles.detailValue}>{selectedJob.jobNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{selectedJob.customerName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service</Text>
                    <Text style={styles.detailValue}>{selectedJob.serviceName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Frequency</Text>
                    <Text style={styles.detailValue}>{getFrequencyLabel(selectedJob.frequency)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.detailValue}>${selectedJob.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      {getStatusIcon(selectedJob.status)}
                      <Text style={[styles.statusText, { color: selectedJob.statusColor }]}>
                        {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Schedule</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Date</Text>
                    <Text style={styles.detailValue}>{new Date(selectedJob.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                  </View>
                  {selectedJob.lastService && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Service</Text>
                      <Text style={styles.detailValue}>{new Date(selectedJob.lastService).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                    </View>
                  )}
                  {selectedJob.nextService && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Next Service</Text>
                      <Text style={styles.detailValue}>{new Date(selectedJob.nextService).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Revenue</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monthly Recurring Revenue</Text>
                    <Text style={styles.detailValue}>${selectedJob.mrr.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Annual Recurring Revenue</Text>
                    <Text style={styles.detailValue}>${selectedJob.arr.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>{selectedJob.description}</Text>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={handleEditJob}>
                  <Edit size={18} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>Edit Recurring Job</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
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
  detailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
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
  detailContent: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
});

export default RecurringJobsScreen;

