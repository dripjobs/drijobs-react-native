import { LinearGradient } from 'expo-linear-gradient';
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Contact {
  id: number;
  name: string;
  phone: string;
  company?: string;
  title?: string;
}

interface ContactPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

// Mock contacts data - in a real app this would come from your contacts API
const mockContacts: Contact[] = [
  { id: 1, name: 'John Smith', phone: '+1 (555) 123-4567', company: 'TechCorp', title: 'CEO' },
  { id: 2, name: 'Sarah Johnson', phone: '+1 (555) 234-5678', company: 'DesignCo', title: 'Designer' },
  { id: 3, name: 'Mike Davis', phone: '+1 (555) 345-6789', company: 'BuildCorp', title: 'Manager' },
  { id: 4, name: 'Emily Wilson', phone: '+1 (555) 456-7890', company: 'InnovateNow', title: 'Product Manager' },
  { id: 5, name: 'David Brown', phone: '+1 (555) 567-8901', company: 'DevSolutions', title: 'CTO' },
  { id: 6, name: 'Lisa Thompson', phone: '+1 (555) 678-9012', company: 'GrowthCo', title: 'Sales Manager' },
  { id: 7, name: 'Robert Green', phone: '+1 (555) 789-0123', company: 'FlowTech', title: 'Operations Director' },
  { id: 8, name: 'Nancy Lee', phone: '+1 (555) 890-1234', company: 'ShopCo', title: 'Owner' },
  { id: 9, name: 'Kevin Hall', phone: '+1 (555) 901-2345', company: 'RetailCorp', title: 'Manager' },
  { id: 10, name: 'Patricia King', phone: '+1 (555) 012-3456', company: 'ServicePro', title: 'Director' },
];

export default function ContactPickerModal({ 
  visible, 
  onClose, 
  onSelectContact 
}: ContactPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(mockContacts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredContacts(mockContacts);
    } else {
      const filtered = mockContacts.filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.company?.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query)
      );
      setFilteredContacts(filtered);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    onSelectContact(contact);
    onClose();
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => handleContactSelect(item)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.company && (
          <Text style={styles.contactCompany}>{item.company}</Text>
        )}
      </View>
      <View style={styles.contactAction}>
        <Text style={styles.callText}>Call</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Select Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        </View>

        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id.toString()}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  contactAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  callText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
});
