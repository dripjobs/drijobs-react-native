import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, CheckSquare, Clock, MapPin, Phone, Search, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - in a real app, this would come from your data service
const mockAppointments = [
  {
    id: 1,
    type: 'appointment',
    customer: 'Robert Johnson',
    title: 'Kitchen Renovation Consultation',
    time: '02:30 PM',
    date: 'Today',
    address: '4214 SE 11 PL, Ocala FL 34471',
    phone: '(352) 895-5224',
    status: 'confirmed',
  },
  {
    id: 2,
    type: 'appointment',
    customer: 'Sherry Williams',
    title: 'Bathroom Remodel Estimate',
    time: '09:00 AM',
    date: 'Today',
    address: '123 Main St, Orlando FL 32801',
    phone: '(555) 123-4567',
    status: 'scheduled',
  },
  {
    id: 3,
    type: 'appointment',
    customer: 'Billy Thompson',
    title: 'Commercial Office Site Visit',
    time: '02:30 PM',
    date: 'Today',
    address: '456 Oak Ave, Tampa FL 33602',
    phone: '(407) 987-6543',
    status: 'in-progress',
  },
];

const mockTasks = [
  {
    id: 1,
    type: 'task',
    title: 'Check equipment and materials',
    description: 'Verify all tools and materials are ready for the day',
    priority: 'high',
    dueDate: 'Today',
    assignedBy: 'Tanner Mullen',
  },
  {
    id: 2,
    type: 'task',
    title: 'Follow up with pending proposals',
    description: 'Call clients who received proposals last week',
    priority: 'medium',
    dueDate: 'Today',
    assignedBy: 'Sarah Johnson',
  },
  {
    id: 3,
    type: 'task',
    title: 'Update project timeline',
    description: 'Review and update timeline for Johnson kitchen project',
    priority: 'low',
    dueDate: 'Tomorrow',
    assignedBy: 'Mike Wilson',
  },
];

const mockContacts = [
  {
    id: 1,
    type: 'contact',
    name: 'Robert Johnson',
    email: 'robert.j@email.com',
    phone: '(352) 895-5224',
    company: 'Johnson Residence',
    tags: ['Active', 'High Value'],
  },
  {
    id: 2,
    type: 'contact',
    name: 'Sherry Williams',
    email: 'sherry.w@email.com',
    phone: '(555) 123-4567',
    company: 'Williams Property',
    tags: ['Lead'],
  },
  {
    id: 3,
    type: 'contact',
    name: 'Billy Thompson',
    email: 'billy.t@commercial.com',
    phone: '(407) 987-6543',
    company: 'Thompson Commercial',
    tags: ['Commercial', 'Active'],
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter all data based on search query - show everything that matches
  const getFilteredResults = () => {
    const query = searchQuery.toLowerCase();
    
    const filteredAppointments = mockAppointments.filter(item =>
      item.customer.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query)
    );

    const filteredTasks = mockTasks.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );

    const filteredContacts = mockContacts.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      item.company.toLowerCase().includes(query)
    );

    // Return all matching results combined
    return [...filteredAppointments, ...filteredTasks, ...filteredContacts];
  };

  const results = getFilteredResults();

  const renderAppointmentResult = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultIconContainer}>
          <Calendar size={20} color="#6366F1" />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>{item.customer}</Text>
          <Text style={styles.resultSubtitle}>{item.title}</Text>
          <View style={styles.resultDetails}>
            <View style={styles.resultDetailItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.resultDetailText}>{item.time} • {item.date}</Text>
            </View>
            <View style={styles.resultDetailItem}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.resultDetailText} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'confirmed' ? '#DCFCE7' : '#DBEAFE' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'confirmed' ? '#059669' : '#2563EB' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTaskResult = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultIconContainer}>
          <CheckSquare size={20} color="#F59E0B" />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultSubtitle}>{item.description}</Text>
          <View style={styles.resultDetails}>
            <View style={styles.resultDetailItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.resultDetailText}>Due: {item.dueDate}</Text>
            </View>
            <View style={styles.resultDetailItem}>
              <User size={14} color="#6B7280" />
              <Text style={styles.resultDetailText}>{item.assignedBy}</Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.priorityBadge,
          { 
            backgroundColor: item.priority === 'high' ? '#FEE2E2' : 
                           item.priority === 'medium' ? '#FEF3C7' : '#F3F4F6'
          }
        ]}>
          <Text style={[
            styles.priorityText,
            { 
              color: item.priority === 'high' ? '#DC2626' : 
                     item.priority === 'medium' ? '#D97706' : '#6B7280'
            }
          ]}>
            {item.priority}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContactResult = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultIconContainer}>
          <User size={20} color="#10B981" />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>{item.name}</Text>
          <Text style={styles.resultSubtitle}>{item.company}</Text>
          <View style={styles.resultDetails}>
            <View style={styles.resultDetailItem}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.resultDetailText}>{item.phone}</Text>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderResult = (item: any) => {
    switch (item.type) {
      case 'appointment':
        return renderAppointmentResult(item);
      case 'task':
        return renderTaskResult(item);
      case 'contact':
        return renderContactResult(item);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search everything..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {searchQuery.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Start searching</Text>
            <Text style={styles.emptyStateText}>
              Search for appointments, tasks, contacts, and more
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </Text>
            {results.map((item) => renderResult(item))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resultDetails: {
    gap: 4,
  },
  resultDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    maxWidth: 280,
  },
});

