import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Job } from '../types/jobs';

interface JobPickerForTimeTrackingProps {
  visible: boolean;
  jobs: Job[];
  onSelect: (job: Job) => void;
  onClose: () => void;
  selectedJobId?: string;
}

export const JobPickerForTimeTracking: React.FC<JobPickerForTimeTrackingProps> = ({
  visible,
  jobs,
  onSelect,
  onClose,
  selectedJobId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.projectName.toLowerCase().includes(query) ||
      job.customerName.toLowerCase().includes(query) ||
      job.workOrderNumber.toLowerCase().includes(query) ||
      job.address.toLowerCase().includes(query)
    );
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'scheduled':
        return '#3b82f6';
      case 'in-progress':
        return '#10b981';
      case 'on-hold':
        return '#f59e0b';
      case 'completed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStageLabel = (stage: string) => {
    return stage
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Job</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Jobs List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No jobs found' : 'No assigned jobs'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'You have no jobs assigned to you at this time'}
              </Text>
            </View>
          ) : (
            <>
              {/* Active/In-Progress Jobs First */}
              {filteredJobs
                .filter(job => job.jobStage === 'in-progress' || job.jobStage === 'scheduled')
                .map(job => (
                  <TouchableOpacity
                    key={job.id}
                    style={[
                      styles.jobCard,
                      selectedJobId === job.id && styles.jobCardSelected,
                    ]}
                    onPress={() => {
                      onSelect(job);
                      onClose();
                    }}
                  >
                    <View style={styles.jobHeader}>
                      <View style={styles.jobTitleContainer}>
                        <Text style={styles.jobTitle}>{job.projectName}</Text>
                        <Text style={styles.jobCustomer}>{job.customerName}</Text>
                      </View>
                      {selectedJobId === job.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                      )}
                    </View>

                    <View style={styles.jobDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text-outline" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>WO #{job.workOrderNumber}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#6b7280" />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {job.address}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <View
                          style={[
                            styles.stageBadge,
                            { backgroundColor: `${getStageColor(job.jobStage)}20` },
                          ]}
                        >
                          <View
                            style={[
                              styles.stageDot,
                              { backgroundColor: getStageColor(job.jobStage) },
                            ]}
                          />
                          <Text
                            style={[
                              styles.stageText,
                              { color: getStageColor(job.jobStage) },
                            ]}
                          >
                            {getStageLabel(job.jobStage)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

              {/* Other Jobs */}
              {filteredJobs
                .filter(job => job.jobStage !== 'in-progress' && job.jobStage !== 'scheduled')
                .length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Other Jobs</Text>
                </View>
              )}

              {filteredJobs
                .filter(job => job.jobStage !== 'in-progress' && job.jobStage !== 'scheduled')
                .map(job => (
                  <TouchableOpacity
                    key={job.id}
                    style={[
                      styles.jobCard,
                      styles.jobCardInactive,
                      selectedJobId === job.id && styles.jobCardSelected,
                    ]}
                    onPress={() => {
                      onSelect(job);
                      onClose();
                    }}
                  >
                    <View style={styles.jobHeader}>
                      <View style={styles.jobTitleContainer}>
                        <Text style={styles.jobTitle}>{job.projectName}</Text>
                        <Text style={styles.jobCustomer}>{job.customerName}</Text>
                      </View>
                      {selectedJobId === job.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                      )}
                    </View>

                    <View style={styles.jobDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text-outline" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>WO #{job.workOrderNumber}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <View
                          style={[
                            styles.stageBadge,
                            { backgroundColor: `${getStageColor(job.jobStage)}20` },
                          ]}
                        >
                          <View
                            style={[
                              styles.stageDot,
                              { backgroundColor: getStageColor(job.jobStage) },
                            ]}
                          />
                          <Text
                            style={[
                              styles.stageText,
                              { color: getStageColor(job.jobStage) },
                            ]}
                          >
                            {getStageLabel(job.jobStage)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobCardInactive: {
    opacity: 0.7,
  },
  jobCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

