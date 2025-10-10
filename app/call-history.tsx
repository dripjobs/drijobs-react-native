import DrawerMenu from '@/components/DrawerMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Clock, Filter, MoreVertical, Phone, PhoneIncoming, PhoneMissed, PhoneOutgoing, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CallRecord {
  id: number;
  name: string;
  company: string;
  number: string;
  type: 'outgoing' | 'incoming' | 'missed';
  time: string;
  duration: string;
  date: string;
  agent?: string;
  recording?: boolean;
  aiSummary?: string;
  transcript?: boolean;
}

export default function CallHistory() {
  const router = useRouter();
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'outgoing' | 'incoming' | 'missed'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  React.useEffect(() => {
    setIsTransparent(false);
  }, []);

  const recentCalls: CallRecord[] = [
    { id: 1, name: 'Sarah Wilson', company: 'TechCorp Inc.', number: '+1 (555) 123-4567', type: 'outgoing', time: '2m ago', duration: '5:23', date: 'Today', agent: 'Mike Stewart', recording: true },
    { id: 2, name: 'Mike Chen', company: 'StartupXYZ', number: '+1 (555) 987-6543', type: 'incoming', time: '1h ago', duration: '12:45', date: 'Today', agent: 'Sarah Johnson', recording: true },
    { id: 3, name: 'Emily Rodriguez', company: 'InnovateNow', number: '+1 (555) 456-7890', type: 'missed', time: '3h ago', duration: '0:00', date: 'Today' },
    { id: 4, name: 'David Kim', company: 'DevSolutions', number: '+1 (555) 321-0987', type: 'outgoing', time: '1d ago', duration: '8:12', date: 'Yesterday', agent: 'Tanner Mullen', recording: true },
    { id: 5, name: 'Lisa Thompson', company: 'GrowthCo', number: '+1 (555) 654-3210', type: 'incoming', time: '2d ago', duration: '15:30', date: 'Jan 28', agent: 'Mike Stewart', recording: true },
    { id: 6, name: 'John Martinez', company: 'FlowTech', number: '+1 (555) 789-0123', type: 'outgoing', time: '3d ago', duration: '6:45', date: 'Jan 27', agent: 'Sarah Johnson' },
    { id: 7, name: 'Anna Foster', company: 'GrowthMax', number: '+1 (555) 456-1234', type: 'missed', time: '4d ago', duration: '0:00', date: 'Jan 26' },
    { id: 8, name: 'Robert Chang', company: 'CodeBase', number: '+1 (555) 321-7890', type: 'incoming', time: '5d ago', duration: '22:15', date: 'Jan 25', agent: 'Tanner Mullen', recording: true },
  ];

  const filteredCalls = recentCalls.filter(call => {
    const matchesSearch = call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.number.includes(searchQuery);
    const matchesFilter = filterType === 'all' || call.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'outgoing':
        return <PhoneOutgoing size={16} color="#10B981" />;
      case 'incoming':
        return <PhoneIncoming size={16} color="#6366F1" />;
      case 'missed':
        return <PhoneMissed size={16} color="#EF4444" />;
      default:
        return <Phone size={16} color="#6B7280" />;
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'outgoing':
        return '#10B981';
      case 'incoming':
        return '#6366F1';
      case 'missed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Call History</Text>
            <Text style={styles.headerSubtitle}>{filteredCalls.length} calls</Text>
          </View>

          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => setDrawerOpen(true)}
          >
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search calls..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
          contentContainerStyle={styles.filterChipsContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'outgoing' && styles.filterChipActive]}
            onPress={() => setFilterType('outgoing')}
          >
            <PhoneOutgoing size={14} color={filterType === 'outgoing' ? '#10B981' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, filterType === 'outgoing' && styles.filterChipTextActive]}>
              Outgoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'incoming' && styles.filterChipActive]}
            onPress={() => setFilterType('incoming')}
          >
            <PhoneIncoming size={14} color={filterType === 'incoming' ? '#6366F1' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, filterType === 'incoming' && styles.filterChipTextActive]}>
              Incoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'missed' && styles.filterChipActive]}
            onPress={() => setFilterType('missed')}
          >
            <PhoneMissed size={14} color={filterType === 'missed' ? '#EF4444' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, filterType === 'missed' && styles.filterChipTextActive]}>
              Missed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Call List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredCalls.map((call, index) => {
          const showDateHeader = index === 0 || call.date !== filteredCalls[index - 1].date;
          
          return (
            <View key={call.id}>
              {showDateHeader && (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>{call.date}</Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.callCard}
                onPress={() => setSelectedCall(call)}
              >
                <View style={styles.callIcon}>
                  {getCallIcon(call.type)}
                </View>

                <View style={styles.callInfo}>
                  <View style={styles.callHeader}>
                    <Text style={styles.callName}>{call.name}</Text>
                    <Text style={styles.callTime}>{call.time}</Text>
                  </View>
                  
                  <Text style={styles.callCompany}>{call.company}</Text>
                  <Text style={styles.callNumber}>{call.number}</Text>
                  
                  <View style={styles.callMeta}>
                    <View style={[styles.callTypeBadge, { backgroundColor: getCallTypeColor(call.type) + '20' }]}>
                      <Text style={[styles.callTypeBadgeText, { color: getCallTypeColor(call.type) }]}>
                        {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                      </Text>
                    </View>
                    {call.duration !== '0:00' && (
                      <View style={styles.callDurationBadge}>
                        <Clock size={12} color="#6B7280" />
                        <Text style={styles.callDurationText}>{call.duration}</Text>
                      </View>
                    )}
                    {call.agent && (
                      <Text style={styles.callAgent}>with {call.agent}</Text>
                    )}
                  </View>

                  {call.recording && (
                    <View style={styles.recordingBadge}>
                      <View style={styles.recordingDot} />
                      <Text style={styles.recordingText}>Recording Available</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color="#6B7280" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.filterModal}>
            <Text style={styles.filterModalTitle}>Filter Calls</Text>
            
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setFilterType('all');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>All Calls</Text>
              {filterType === 'all' && <View style={styles.filterOptionCheck} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setFilterType('outgoing');
                setShowFilterModal(false);
              }}
            >
              <PhoneOutgoing size={16} color="#10B981" />
              <Text style={styles.filterOptionText}>Outgoing Only</Text>
              {filterType === 'outgoing' && <View style={styles.filterOptionCheck} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setFilterType('incoming');
                setShowFilterModal(false);
              }}
            >
              <PhoneIncoming size={16} color="#6366F1" />
              <Text style={styles.filterOptionText}>Incoming Only</Text>
              {filterType === 'incoming' && <View style={styles.filterOptionCheck} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setFilterType('missed');
                setShowFilterModal(false);
              }}
            >
              <PhoneMissed size={16} color="#EF4444" />
              <Text style={styles.filterOptionText}>Missed Only</Text>
              {filterType === 'missed' && <View style={styles.filterOptionCheck} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Call Detail Modal */}
      {selectedCall && (
        <Modal
          visible={!!selectedCall}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedCall(null)}
        >
          <View style={styles.detailModalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>Call Details</Text>
                <TouchableOpacity onPress={() => setSelectedCall(null)}>
                  <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.detailContent}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Contact</Text>
                  <Text style={styles.detailValue}>{selectedCall.name}</Text>
                  <Text style={styles.detailSubvalue}>{selectedCall.company}</Text>
                  <Text style={styles.detailSubvalue}>{selectedCall.number}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Call Info</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Type:</Text>
                    <View style={[styles.callTypeBadge, { backgroundColor: getCallTypeColor(selectedCall.type) + '20' }]}>
                      <Text style={[styles.callTypeBadgeText, { color: getCallTypeColor(selectedCall.type) }]}>
                        {selectedCall.type.charAt(0).toUpperCase() + selectedCall.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Duration:</Text>
                    <Text style={styles.detailRowValue}>{selectedCall.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Time:</Text>
                    <Text style={styles.detailRowValue}>{selectedCall.time} - {selectedCall.date}</Text>
                  </View>
                  {selectedCall.agent && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailRowLabel}>Agent:</Text>
                      <Text style={styles.detailRowValue}>{selectedCall.agent}</Text>
                    </View>
                  )}
                </View>

                {selectedCall.recording && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Recording</Text>
                    <TouchableOpacity style={styles.playRecordingButton}>
                      <Text style={styles.playRecordingText}>▶ Play Recording</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Phone size={20} color="#6366F1" />
                    <Text style={styles.detailActionText}>Call Back</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pullOutIndicator: {
    flexDirection: 'row',
    gap: 3,
  },
  pullOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filterChips: {
    marginBottom: 8,
  },
  filterChipsContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  filterChipTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  callCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  callName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  callTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  callCompany: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  callNumber: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  callTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  callDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callDurationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  callAgent: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  moreButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailSubvalue: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailRowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 100,
  },
  detailRowValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  playRecordingButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  playRecordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailActions: {
    marginTop: 8,
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
});

