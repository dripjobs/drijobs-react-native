import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { crewService } from '../services/CrewService';
import { Subcontractor } from '../types/crew';

interface SubcontractorsListProps {
  onCreateSubcontractor: () => void;
  onEditSubcontractor: (subcontractor: Subcontractor) => void;
  onViewSubcontractor: (subcontractor: Subcontractor) => void;
}

export const SubcontractorsList: React.FC<SubcontractorsListProps> = ({
  onCreateSubcontractor,
  onEditSubcontractor,
  onViewSubcontractor,
}) => {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadSubcontractors();
  }, []);

  const loadSubcontractors = () => {
    const allSubcontractors = crewService.getSubcontractors();
    setSubcontractors(allSubcontractors);
  };

  const handleDelete = (subcontractor: Subcontractor) => {
    Alert.alert(
      'Delete Subcontractor',
      `Are you sure you want to delete ${subcontractor.companyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            crewService.deleteSubcontractor(subcontractor.id);
            loadSubcontractors();
          },
        },
      ]
    );
  };

  const filteredSubcontractors = subcontractors.filter(sub => {
    const matchesSearch = 
      sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
            size={14}
            color="#fbbf24"
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by company name or contact person"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={onCreateSubcontractor}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'all' && styles.filterTabActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
            All ({subcontractors.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'active' && styles.filterTabActive]}
          onPress={() => setFilterStatus('active')}
        >
          <Text style={[styles.filterText, filterStatus === 'active' && styles.filterTextActive]}>
            Active ({subcontractors.filter(s => s.status === 'active').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === 'inactive' && styles.filterTabActive]}
          onPress={() => setFilterStatus('inactive')}
        >
          <Text style={[styles.filterText, filterStatus === 'inactive' && styles.filterTextActive]}>
            Inactive ({subcontractors.filter(s => s.status === 'inactive').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subcontractors List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredSubcontractors.map((subcontractor) => (
          <TouchableOpacity
            key={subcontractor.id}
            style={styles.subCard}
            onPress={() => onViewSubcontractor(subcontractor)}
          >
            <View style={styles.subHeader}>
              <View style={styles.subInfo}>
                <Text style={styles.companyName}>{subcontractor.companyName}</Text>
                <Text style={styles.contactPerson}>{subcontractor.contactPerson}</Text>
              </View>
              <View style={styles.subActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => onEditSubcontractor(subcontractor)}
                >
                  <Ionicons name="pencil" size={18} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDelete(subcontractor)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.subDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color="#6b7280" />
                <Text style={styles.detailText}>{subcontractor.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color="#6b7280" />
                <Text style={styles.detailText}>{subcontractor.phone}</Text>
              </View>
            </View>

            <View style={styles.subFooter}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subcontractor.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(subcontractor.status) }]}>
                  {subcontractor.status.charAt(0).toUpperCase() + subcontractor.status.slice(1)}
                </Text>
              </View>
              {subcontractor.rating && renderStars(subcontractor.rating)}
              {subcontractor.hourlyRate && (
                <Text style={styles.rateText}>${subcontractor.hourlyRate}/hr</Text>
              )}
            </View>

            {subcontractor.specialties.length > 0 && (
              <View style={styles.specialtiesContainer}>
                {subcontractor.specialties.slice(0, 3).map((specialty, index) => (
                  <View key={index} style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
                {subcontractor.specialties.length > 3 && (
                  <Text style={styles.moreSpecialties}>+{subcontractor.specialties.length - 3} more</Text>
                )}
              </View>
            )}

            {subcontractor.totalJobsCompleted !== undefined && (
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.statText}>{subcontractor.totalJobsCompleted} jobs completed</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredSubcontractors.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No subcontractors found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first subcontractor to get started'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#111827',
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#3b82f6',
  },
  listContainer: {
    flex: 1,
  },
  subCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactPerson: {
    fontSize: 14,
    color: '#6b7280',
  },
  subActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  subDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
  },
  subFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 'auto',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  specialtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  specialtyText: {
    fontSize: 12,
    color: '#4b5563',
  },
  moreSpecialties: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
