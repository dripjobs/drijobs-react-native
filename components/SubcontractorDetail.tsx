import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Subcontractor } from '../types/crew';

interface SubcontractorDetailProps {
  subcontractor: Subcontractor;
  onBack: () => void;
  onEdit: (subcontractor: Subcontractor) => void;
}

export const SubcontractorDetail: React.FC<SubcontractorDetailProps> = ({
  subcontractor,
  onBack,
  onEdit,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
            size={20}
            color="#fbbf24"
          />
        ))}
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const checkInsuranceExpiry = () => {
    if (!subcontractor.insuranceInfo) return null;
    
    const expiryDate = new Date(subcontractor.insuranceInfo.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return { status: 'expired', color: '#ef4444', text: 'Expired' };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'expiring', color: '#f59e0b', text: 'Expiring Soon' };
    }
    return { status: 'valid', color: '#10b981', text: 'Valid' };
  };

  const insuranceStatus = checkInsuranceExpiry();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subcontractor Details</Text>
        <TouchableOpacity onPress={() => onEdit(subcontractor)} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={40} color="white" />
            </View>
          </View>
          
          <Text style={styles.companyName}>{subcontractor.companyName}</Text>
          <Text style={styles.contactPerson}>{subcontractor.contactPerson}</Text>
          
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(subcontractor.status) + '20' }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(subcontractor.status) }]}>
                {subcontractor.status.charAt(0).toUpperCase() + subcontractor.status.slice(1)}
              </Text>
            </View>
          </View>

          {subcontractor.rating && (
            <View style={styles.ratingSection}>
              {renderStars(subcontractor.rating)}
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {subcontractor.totalJobsCompleted !== undefined && (
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
              <Text style={styles.statValue}>{subcontractor.totalJobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
          )}
          {subcontractor.hourlyRate && (
            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>${subcontractor.hourlyRate}</Text>
              <Text style={styles.statLabel}>Hourly Rate</Text>
            </View>
          )}
          <View style={styles.statCard}>
            <Ionicons name="ribbon-outline" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{subcontractor.specialties.length}</Text>
            <Text style={styles.statLabel}>Specialties</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Contact Person</Text>
              <Text style={styles.infoValue}>{subcontractor.contactPerson}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{subcontractor.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{subcontractor.phone}</Text>
            </View>
          </View>
          {subcontractor.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{subcontractor.address}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Specialties */}
        {subcontractor.specialties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {subcontractor.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyBadge}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          {subcontractor.taxId && (
            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tax ID / EIN</Text>
                <Text style={styles.infoValue}>{subcontractor.taxId}</Text>
              </View>
            </View>
          )}
          {subcontractor.hourlyRate && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hourly Rate</Text>
                <Text style={styles.infoValue}>${subcontractor.hourlyRate.toFixed(2)}/hr</Text>
              </View>
            </View>
          )}
        </View>

        {/* Insurance Information */}
        {subcontractor.insuranceInfo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Insurance Information</Text>
              {insuranceStatus && (
                <View style={[styles.insuranceStatus, { backgroundColor: insuranceStatus.color + '20' }]}>
                  <Text style={[styles.insuranceStatusText, { color: insuranceStatus.color }]}>
                    {insuranceStatus.text}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.insuranceCard}>
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Provider</Text>
                  <Text style={styles.infoValue}>{subcontractor.insuranceInfo.provider}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="document-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Policy Number</Text>
                  <Text style={styles.infoValue}>{subcontractor.insuranceInfo.policyNumber}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Expiry Date</Text>
                  <Text style={styles.infoValue}>{formatDate(subcontractor.insuranceInfo.expiryDate)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Coverage Amount</Text>
                  <Text style={styles.infoValue}>
                    ${subcontractor.insuranceInfo.coverageAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        {subcontractor.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{subcontractor.notes}</Text>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Added:</Text>
            <Text style={styles.metadataValue}>{formatDate(subcontractor.createdAt)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Last Updated:</Text>
            <Text style={styles.metadataValue}>{formatDate(subcontractor.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactPerson: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingSection: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insuranceStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insuranceStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3b82f6',
  },
  insuranceCard: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
  },
  notesCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  metadataValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});
