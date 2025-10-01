import { ChevronRight, X } from 'lucide-react-native';
import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DetailItem {
  id: string;
  customerName: string;
  detail1: string;
  detail2?: string;
  detail3?: string;
}

interface StatDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  type: 'sales' | 'leads' | 'estimates' | 'appointments';
  data: DetailItem[];
}

export default function StatDetailModal({
  visible,
  onClose,
  title,
  type,
  data,
}: StatDetailModalProps) {
  const renderDetailRow = (item: DetailItem) => {
    switch (type) {
      case 'sales':
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{item.detail1}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>VIEW</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        );

      case 'leads':
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{item.detail1}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>VIEW</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        );

      case 'estimates':
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{item.detail1}</Text>
                <View style={styles.separator} />
                <Text style={styles.statusBadge}>{item.detail2}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>VIEW</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        );

      case 'appointments':
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{item.detail1}</Text>
                {item.detail2 && (
                  <>
                    <View style={styles.separator} />
                    <Text style={styles.detailText}>{item.detail2}</Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>VIEW</Text>
              <ChevronRight size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerCount}>{data.length} {data.length === 1 ? 'item' : 'items'}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {data.map((item) => renderDetailRow(item))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowContent: {
    flex: 1,
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
});

