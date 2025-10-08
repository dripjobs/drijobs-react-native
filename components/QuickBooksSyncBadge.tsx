import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SyncStatus } from '../types/quickbooks';

interface QuickBooksSyncBadgeProps {
  syncStatus: SyncStatus;
  lastSyncedAt?: string;
  quickbooksId?: string;
  errorMessage?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onPress?: () => void;
}

export const QuickBooksSyncBadge: React.FC<QuickBooksSyncBadgeProps> = ({
  syncStatus,
  lastSyncedAt,
  quickbooksId,
  errorMessage,
  size = 'medium',
  showLabel = true,
  onPress,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setShowDetails(true);
    }
  };

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: CheckCircle2,
          color: '#10B981',
          bgColor: '#D1FAE5',
          label: 'Synced to QB',
          description: 'Successfully synced to QuickBooks',
        };
      case 'pending':
        return {
          icon: Clock,
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          label: 'Pending Sync',
          description: 'Waiting to sync to QuickBooks',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: '#EF4444',
          bgColor: '#FEE2E2',
          label: 'Sync Error',
          description: errorMessage || 'Failed to sync to QuickBooks',
        };
      case 'not_synced':
      default:
        return {
          icon: XCircle,
          color: '#9CA3AF',
          bgColor: '#F3F4F6',
          label: 'Not Synced',
          description: 'Not synced to QuickBooks',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const iconSize = size === 'small' ? 14 : size === 'medium' ? 16 : 20;
  const fontSize = size === 'small' ? 11 : size === 'medium' ? 12 : 14;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.badge,
          { backgroundColor: config.bgColor },
          size === 'small' && styles.badgeSmall,
          size === 'large' && styles.badgeLarge,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Icon size={iconSize} color={config.color} strokeWidth={2} />
        {showLabel && (
          <Text style={[styles.label, { color: config.color, fontSize }]}>{config.label}</Text>
        )}
      </TouchableOpacity>

      {/* Details Modal */}
      <Modal visible={showDetails} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowDetails(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon size={24} color={config.color} strokeWidth={2} />
              <Text style={styles.modalTitle}>{config.label}</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{config.description}</Text>
              </View>

              {lastSyncedAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Synced:</Text>
                  <Text style={styles.detailValue}>{formatDate(lastSyncedAt)}</Text>
                </View>
              )}

              {quickbooksId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>QuickBooks ID:</Text>
                  <Text style={[styles.detailValue, styles.monoText]}>{quickbooksId}</Text>
                </View>
              )}

              {errorMessage && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Error:</Text>
                  <Text style={[styles.detailValue, styles.errorText]}>{errorMessage}</Text>
                </View>
              )}

              {syncStatus === 'not_synced' && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    This record has not been synced to QuickBooks yet. It will sync automatically based on your sync settings.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDetails(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  label: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 0,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  errorText: {
    color: '#EF4444',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickBooksSyncBadge;
