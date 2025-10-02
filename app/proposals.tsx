import DrawerMenu from '@/components/DrawerMenu';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    XCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Sample proposal data
const proposalData = [
  {
    id: 1,
    proposalNumber: 'PROP-2001',
    customerName: 'Robert Johnson',
    amount: 45200.00,
    status: 'accepted',
    sentDate: '2025-09-15',
    createdDate: '2025-09-10',
    description: 'Complete kitchen renovation with custom cabinetry and modern appliances',
    items: ['Design & Planning', 'Custom Cabinets', 'Countertops Installation', 'Appliances', 'Labor'],
    statusColor: '#10B981'
  },
  {
    id: 2,
    proposalNumber: 'PROP-2002',
    customerName: 'Sherry Williams',
    amount: 28500.00,
    status: 'sent',
    sentDate: '2025-09-25',
    createdDate: '2025-09-22',
    description: 'Master bathroom remodel with walk-in shower and double vanity',
    items: ['Bathroom Demo', 'Plumbing', 'Tile Work', 'Fixtures', 'Labor'],
    statusColor: '#3B82F6'
  },
  {
    id: 3,
    proposalNumber: 'PROP-2003',
    customerName: 'Billy Thompson',
    amount: 125000.00,
    status: 'sent',
    sentDate: '2025-09-20',
    createdDate: '2025-09-18',
    description: 'Commercial office space renovation - 5,000 sq ft',
    items: ['Demo & Prep', 'Electrical', 'HVAC', 'Flooring', 'Paint & Finish', 'Labor'],
    statusColor: '#3B82F6'
  },
  {
    id: 4,
    proposalNumber: 'PROP-2004',
    customerName: 'Sarah Martinez',
    amount: 18200.00,
    status: 'rejected',
    sentDate: '2025-09-18',
    createdDate: '2025-09-15',
    description: 'Deck construction with pergola and lighting',
    items: ['Materials', 'Deck Construction', 'Pergola', 'Lighting Installation', 'Labor'],
    statusColor: '#EF4444'
  },
  {
    id: 5,
    proposalNumber: 'PROP-2005',
    customerName: 'Michael Davis',
    amount: 67500.00,
    status: 'accepted',
    sentDate: '2025-09-28',
    createdDate: '2025-09-25',
    description: 'Basement finishing with home theater and wet bar',
    items: ['Framing', 'Electrical & Audio/Visual', 'Drywall', 'Bar Installation', 'Flooring', 'Labor'],
    statusColor: '#10B981'
  },
  {
    id: 6,
    proposalNumber: 'PROP-2006',
    customerName: 'Jennifer Lee',
    amount: 12800.00,
    status: 'draft',
    sentDate: null,
    createdDate: '2025-10-01',
    description: 'Garage door replacement and opener installation',
    items: ['Door Removal', 'New Door Installation', 'Opener Installation', 'Labor'],
    statusColor: '#6B7280'
  },
  {
    id: 7,
    proposalNumber: 'PROP-2007',
    customerName: 'David Wilson',
    amount: 156000.00,
    status: 'sent',
    sentDate: '2025-09-30',
    createdDate: '2025-09-27',
    description: 'Whole home remodel - Phase 1 (Kitchen & Living Areas)',
    items: ['Design Consultation', 'Demo', 'Structural Work', 'Kitchen', 'Living Room', 'Labor'],
    statusColor: '#3B82F6'
  },
  {
    id: 8,
    proposalNumber: 'PROP-2008',
    customerName: 'Lisa Anderson',
    amount: 22400.00,
    status: 'rejected',
    sentDate: '2025-09-22',
    createdDate: '2025-09-19',
    description: 'HVAC system replacement with smart thermostat',
    items: ['Old System Removal', 'New HVAC Unit', 'Ductwork', 'Smart Thermostat', 'Labor'],
    statusColor: '#EF4444'
  },
  {
    id: 9,
    proposalNumber: 'PROP-2009',
    customerName: 'James Brown',
    amount: 34500.00,
    status: 'sent',
    sentDate: '2025-10-02',
    createdDate: '2025-09-29',
    description: 'Roof replacement with architectural shingles',
    items: ['Roof Tear-off', 'New Shingles', 'Underlayment', 'Ventilation', 'Labor'],
    statusColor: '#3B82F6'
  },
  {
    id: 10,
    proposalNumber: 'PROP-2010',
    customerName: 'Maria Garcia',
    amount: 29800.00,
    status: 'accepted',
    sentDate: '2025-09-26',
    createdDate: '2025-09-23',
    description: 'Hardwood flooring installation throughout main floor',
    items: ['Floor Prep', 'Hardwood Materials', 'Installation', 'Finishing', 'Labor'],
    statusColor: '#10B981'
  },
  {
    id: 11,
    proposalNumber: 'PROP-2011',
    customerName: 'Thomas Anderson',
    amount: 8900.00,
    status: 'draft',
    sentDate: null,
    createdDate: '2025-10-03',
    description: 'Fence installation - backyard perimeter',
    items: ['Materials', 'Post Installation', 'Panel Installation', 'Gate', 'Labor'],
    statusColor: '#6B7280'
  },
  {
    id: 12,
    proposalNumber: 'PROP-2012',
    customerName: 'Patricia Moore',
    amount: 15600.00,
    status: 'draft',
    sentDate: null,
    createdDate: '2025-10-04',
    description: 'Window replacement - 8 windows',
    items: ['Window Removal', 'New Windows', 'Installation', 'Trim Work', 'Labor'],
    statusColor: '#6B7280'
  }
];

export default function ProposalsPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const statusFilters = [
    { value: 'all', label: 'All', color: '#6B7280' },
    { value: 'draft', label: 'Draft', color: '#6B7280' },
    { value: 'sent', label: 'Sent', color: '#3B82F6' },
    { value: 'accepted', label: 'Accepted', color: '#10B981' },
    { value: 'rejected', label: 'Rejected', color: '#EF4444' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={20} color="#10B981" />;
      case 'sent':
        return <Clock size={20} color="#3B82F6" />;
      case 'rejected':
        return <XCircle size={20} color="#EF4444" />;
      case 'draft':
        return <Edit size={20} color="#6B7280" />;
      default:
        return <FileText size={20} color="#6B7280" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter proposals based on search, status, and date range
  const filteredProposals = proposalData.filter(proposal => {
    const matchesSearch = proposal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || proposal.status === selectedStatus;
    
    // Date range filter (using createdDate for proposals)
    let matchesDateRange = true;
    const proposalDate = new Date(proposal.createdDate);
    if (startDate && proposalDate < startDate) {
      matchesDateRange = false;
    }
    if (endDate && proposalDate > endDate) {
      matchesDateRange = false;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleProposalPress = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
  };

  const handleOpenProposal = () => {
    if (selectedProposal) {
      setShowDetailModal(false);
      router.push(`/proposal-builder?id=${selectedProposal.proposalNumber}`);
    }
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
          <Text style={styles.headerTitle}>Proposals</Text>
          <TouchableOpacity 
            onPress={() => router.push('/proposal-builder')} 
            style={styles.newProposalButton}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by customer or proposal #"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
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

      {/* Proposal List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.proposalList}>
          {filteredProposals.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No proposals found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search' : 'No proposals match the selected filters'}
              </Text>
            </View>
          ) : (
            filteredProposals.map((proposal) => (
              <TouchableOpacity
                key={proposal.id}
                style={styles.proposalCard}
                onPress={() => handleProposalPress(proposal)}
              >
                <View style={styles.proposalContent}>
                  <View style={styles.proposalLeft}>
                    <View style={[styles.statusIndicator, { backgroundColor: proposal.statusColor }]} />
                    <View style={styles.proposalInfo}>
                      <Text style={styles.customerName}>{proposal.customerName}</Text>
                      <Text style={styles.proposalNumber}>{proposal.proposalNumber}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.proposalRight}>
                    <Text style={styles.proposalAmount}>${proposal.amount.toLocaleString()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: proposal.statusColor }]}>
                      <Text style={styles.statusBadgeText}>{getStatusLabel(proposal.status)}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.openButton}
                  onPress={() => handleProposalPress(proposal)}
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
              <Text style={styles.modalTitle}>Filter Proposals</Text>
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

      {/* Proposal Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proposal Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedProposal && (
              <ScrollView style={styles.detailModalContent}>
                {/* Proposal Header Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailProposalNumber}>{selectedProposal.proposalNumber}</Text>
                  <View style={[styles.detailStatusBadge, { backgroundColor: selectedProposal.statusColor }]}>
                    <Text style={styles.detailStatusText}>{getStatusLabel(selectedProposal.status)}</Text>
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Customer</Text>
                  <Text style={styles.detailCustomerName}>{selectedProposal.customerName}</Text>
                </View>

                {/* Amount */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Amount</Text>
                  <Text style={styles.detailAmount}>${selectedProposal.amount.toLocaleString()}</Text>
                </View>

                {/* Description */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Description</Text>
                  <Text style={styles.detailDescription}>{selectedProposal.description}</Text>
                </View>

                {/* Dates */}
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created:</Text>
                    <Text style={styles.detailValue}>{selectedProposal.createdDate}</Text>
                  </View>
                  {selectedProposal.sentDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sent:</Text>
                      <Text style={styles.detailValue}>{selectedProposal.sentDate}</Text>
                    </View>
                  )}
                </View>

                {/* Items */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Included Items</Text>
                  {selectedProposal.items.map((item: string, index: number) => (
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
                    onPress={handleOpenProposal}
                  >
                    <FileText size={20} color="#FFFFFF" />
                    <Text style={styles.detailPrimaryButtonText}>Open Full Proposal</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
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
  newProposalButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
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
  proposalList: {
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
  proposalCard: {
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
  proposalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proposalLeft: {
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
  proposalInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  proposalNumber: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  proposalRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  proposalAmount: {
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
  detailProposalNumber: {
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
  detailDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
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

