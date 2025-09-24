import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CheckSquare, ChevronRight, Clock, DollarSign, CreditCard as Edit, FileText, Filter, Mail, MapPin, MessageSquare, MoreHorizontal, Navigation, Paperclip, Phone, Plus, Search, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Contacts() {
  const { setIsTransparent } = useTabBar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [expandedContact, setExpandedContact] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showContactCard, setShowContactCard] = useState(false);
  const [activeTab, setActiveTab] = useState('Information');

  const contacts = [
    { 
      id: 1, 
      name: 'Sarah Wilson', 
      title: 'Marketing Director', 
      company: 'TechCorp Inc.', 
      email: 'sarah.wilson@techcorp.com', 
      phone: '+1 (555) 123-4567', 
      address: '123 Business Ave, Suite 100, New York, NY 10001',
      secondaryEmail: 'sarah.personal@gmail.com',
      secondaryPhone: '+1 (555) 123-4568'
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      title: 'CEO', 
      company: 'StartupXYZ', 
      email: 'mike@startupxyz.com', 
      phone: '+1 (555) 987-6543', 
      address: '456 Innovation St, San Francisco, CA 94105',
      secondaryEmail: '',
      secondaryPhone: '+1 (555) 987-6544'
    },
    { 
      id: 3, 
      name: 'Emily Rodriguez', 
      title: 'Product Manager', 
      company: 'InnovateNow', 
      email: 'emily.r@innovatenow.com', 
      phone: '+1 (555) 456-7890', 
      address: '789 Tech Blvd, Austin, TX 78701',
      secondaryEmail: 'emily.rodriguez@gmail.com',
      secondaryPhone: ''
    },
    { 
      id: 4, 
      name: 'David Kim', 
      title: 'CTO', 
      company: 'DevSolutions', 
      email: 'david.kim@devsolutions.com', 
      phone: '+1 (555) 321-0987', 
      address: '321 Code Lane, Seattle, WA 98101',
      secondaryEmail: '',
      secondaryPhone: ''
    },
    { 
      id: 5, 
      name: 'Lisa Thompson', 
      title: 'Sales Manager', 
      company: 'GrowthCo', 
      email: 'lisa.t@growthco.com', 
      phone: '+1 (555) 654-3210', 
      address: '654 Sales Dr, Chicago, IL 60601',
      secondaryEmail: 'lisa.thompson@yahoo.com',
      secondaryPhone: '+1 (555) 654-3211'
    },
    { 
      id: 6, 
      name: 'John Martinez', 
      title: 'Operations Director', 
      company: 'FlowTech', 
      email: 'j.martinez@flowtech.com', 
      phone: '+1 (555) 789-0123', 
      address: '987 Operations Way, Miami, FL 33101',
      secondaryEmail: '',
      secondaryPhone: ''
    },
    { 
      id: 7, 
      name: 'Anna Foster', 
      title: 'VP of Sales', 
      company: 'GrowthMax', 
      email: 'anna.f@growthmax.com', 
      phone: '+1 (555) 456-1234', 
      address: '147 Growth St, Denver, CO 80201',
      secondaryEmail: 'anna.foster@gmail.com',
      secondaryPhone: ''
    },
    { 
      id: 8, 
      name: 'Robert Chang', 
      title: 'Technical Lead', 
      company: 'CodeBase', 
      email: 'r.chang@codebase.com', 
      phone: '+1 (555) 321-7890', 
      address: '258 Developer Ave, Boston, MA 02101',
      secondaryEmail: '',
      secondaryPhone: '+1 (555) 321-7891'
    },
    // Homeowner contacts
    { 
      id: 9, 
      name: 'Jennifer Davis', 
      title: '', 
      company: '', 
      email: 'jennifer.davis@gmail.com', 
      phone: '+1 (555) 234-5678', 
      address: '123 Oak Street, Springfield, IL 62701',
      secondaryEmail: 'jen.davis@yahoo.com',
      secondaryPhone: ''
    },
    { 
      id: 10, 
      name: 'Michael Johnson', 
      title: '', 
      company: '', 
      email: 'mike.johnson@yahoo.com', 
      phone: '+1 (555) 345-6789', 
      address: '456 Maple Drive, Portland, OR 97201',
      secondaryEmail: '',
      secondaryPhone: '+1 (555) 345-6790'
    },
    { 
      id: 11, 
      name: 'Amanda Brown', 
      title: '', 
      company: '', 
      email: 'amanda.brown@hotmail.com', 
      phone: '+1 (555) 456-7890', 
      address: '789 Pine Lane, Phoenix, AZ 85001',
      secondaryEmail: 'amanda.brown@gmail.com',
      secondaryPhone: ''
    },
    { 
      id: 12, 
      name: 'James Wilson', 
      title: '', 
      company: '', 
      email: 'james.wilson@gmail.com', 
      phone: '+1 (555) 567-8901', 
      address: '321 Elm Court, Nashville, TN 37201',
      secondaryEmail: '',
      secondaryPhone: ''
    },
    { 
      id: 13, 
      name: 'Maria Garcia', 
      title: '', 
      company: '', 
      email: 'maria.garcia@outlook.com', 
      phone: '+1 (555) 678-9012', 
      address: '654 Cedar Road, Las Vegas, NV 89101',
      secondaryEmail: 'maria.garcia@gmail.com',
      secondaryPhone: '+1 (555) 678-9013'
    },
    { 
      id: 14, 
      name: 'Thomas Anderson', 
      title: '', 
      company: '', 
      email: 'thomas.anderson@gmail.com', 
      phone: '+1 (555) 789-0123', 
      address: '987 Birch Street, Salt Lake City, UT 84101',
      secondaryEmail: '',
      secondaryPhone: ''
    },
    { 
      id: 15, 
      name: 'Susan Taylor', 
      title: '', 
      company: '', 
      email: 'susan.taylor@yahoo.com', 
      phone: '+1 (555) 890-1234', 
      address: '147 Willow Avenue, Kansas City, MO 64101',
      secondaryEmail: 'susan.taylor@gmail.com',
      secondaryPhone: ''
    },
    { 
      id: 16, 
      name: 'Christopher Lee', 
      title: '', 
      company: '', 
      email: 'chris.lee@gmail.com', 
      phone: '+1 (555) 901-2345', 
      address: '258 Spruce Circle, Columbus, OH 43201',
      secondaryEmail: '',
      secondaryPhone: '+1 (555) 901-2346'
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'prospect': return '#3B82F6';
      case 'lead': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleContactPress = (contact: any) => {
    console.log('Open contact record:', contact.name);
  };

  const handleExpandContact = (contactId: number) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const handleViewContactCard = (contact: any) => {
    setSelectedContact(contact);
    setShowContactCard(true);
  };

  const handleMenuAction = (action: string, contact: any) => {
    setActiveMenu(null);
    console.log(`${action} for ${contact.name}`);
  };

  const ContactMenu = ({ contact, onClose }: { contact: any; onClose: () => void }) => (
    <View style={styles.menuOverlay}>
      <TouchableOpacity style={styles.menuBackdrop} onPress={onClose} />
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuAction('call', contact)}
        >
          <Phone size={18} color="#6366F1" />
          <Text style={styles.menuText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuAction('text', contact)}
        >
          <MessageSquare size={18} color="#6366F1" />
          <Text style={styles.menuText}>Text</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuAction('email', contact)}
        >
          <Mail size={18} color="#6366F1" />
          <Text style={styles.menuText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuAction('proposal', contact)}
        >
          <FileText size={18} color="#6366F1" />
          <Text style={styles.menuText}>Create Proposal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuAction('schedule', contact)}
        >
          <Calendar size={18} color="#6366F1" />
          <Text style={styles.menuText}>Schedule Appointment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.lastMenuItem]}
          onPress={() => handleMenuAction('edit', contact)}
        >
          <Edit size={18} color="#6366F1" />
          <Text style={styles.menuText}>Edit Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      {activeMenu && (
        <ContactMenu 
          contact={contacts.find(c => c.id === activeMenu)} 
          onClose={() => setActiveMenu(null)} 
        />
      )}
      
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contacts</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        onScrollBeginDrag={() => setIsTransparent(true)}
        onScrollEndDrag={() => setIsTransparent(false)}
        onMomentumScrollBegin={() => setIsTransparent(true)}
        onMomentumScrollEnd={() => setIsTransparent(false)}
      >
        <View style={styles.contactsList}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleContactPress(contact)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.title && <Text style={styles.contactTitle}>{contact.title}</Text>}
                  {contact.company && <Text style={styles.contactCompany}>{contact.company}</Text>}
                  {!contact.title && !contact.company && <Text style={styles.contactEmail}>{contact.email}</Text>}
                </View>
                
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleExpandContact(contact.id);
                  }}
                >
                  <ChevronRight 
                    size={20} 
                    color="#6B7280" 
                    style={{ 
                      transform: [{ rotate: expandedContact === contact.id ? '90deg' : '0deg' }] 
                    }} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              
              {expandedContact === contact.id && (
                <View style={styles.expandedContent}>
                  <View style={styles.contactActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Phone size={16} color="#10B981" />
                      <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Mail size={16} color="#3B82F6" />
                      <Text style={styles.actionText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MessageSquare size={16} color="#8B5CF6" />
                      <Text style={styles.actionText}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Navigation size={16} color="#F59E0B" />
                      <Text style={styles.actionText}>Navigate</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.viewContactButton}
                    onPress={() => handleViewContactCard(contact)}
                  >
                    <Text style={styles.viewContactText}>View Contact Card</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <FloatingActionMenu />

      {/* Contact Card Modal */}
      <Modal
        visible={showContactCard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContactCard(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowContactCard(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Details</Text>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Contact Header */}
            <View style={styles.contactHeader}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>
                  {selectedContact?.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{selectedContact?.name}</Text>
                {selectedContact?.title && <Text style={styles.contactTitle}>{selectedContact.title}</Text>}
                {selectedContact?.company && <Text style={styles.contactCompany}>{selectedContact.company}</Text>}
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.contactInfoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.infoLabel}>Primary Email</Text>
                  <Text style={styles.infoValue}>{selectedContact?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Phone size={16} color="#6B7280" />
                  <Text style={styles.infoLabel}>Primary Phone</Text>
                  <Text style={styles.infoValue}>{selectedContact?.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{selectedContact?.address}</Text>
                </View>
                {selectedContact?.secondaryEmail && (
                  <View style={styles.infoRow}>
                    <Mail size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Secondary Email</Text>
                    <Text style={styles.infoValue}>{selectedContact.secondaryEmail}</Text>
                  </View>
                )}
                {selectedContact?.secondaryPhone && (
                  <View style={styles.infoRow}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Secondary Phone</Text>
                    <Text style={styles.infoValue}>{selectedContact.secondaryPhone}</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#6366F1" />
                <Text style={styles.editButtonText}>Edit Contact Details</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
                {['Information', 'Deals', 'Proposals', 'Appointments', 'Invoices', 'Payments', 'Tasks', 'Notes', 'Attachments', 'Call History'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === 'Information' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Contact Number</Text>
                      <Text style={styles.infoValue}>C001</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Full Name</Text>
                      <Text style={styles.infoValue}>{selectedContact?.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Contact Tag</Text>
                      <Text style={styles.infoValue}>Customer</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Lead Source</Text>
                      <Text style={styles.infoValue}>Website</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Status</Text>
                      <Text style={[styles.infoValue, { color: '#10B981' }]}>Active</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Created</Text>
                      <Text style={styles.infoValue}>January 14, 2024</Text>
                    </View>
                  </View>
                </View>
              )}

              {activeTab === 'Deals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Deals</Text>
                  <View style={styles.emptyState}>
                    <TrendingUp size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No deals found</Text>
                    <Text style={styles.emptyStateSubtext}>Create a new deal to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Proposals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Proposals</Text>
                  <View style={styles.emptyState}>
                    <FileText size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No proposals found</Text>
                    <Text style={styles.emptyStateSubtext}>Create a new proposal to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Appointments' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Appointments</Text>
                  <View style={styles.emptyState}>
                    <Calendar size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No appointments found</Text>
                    <Text style={styles.emptyStateSubtext}>Schedule an appointment to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Invoices' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Invoices</Text>
                  <View style={styles.emptyState}>
                    <DollarSign size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No invoices found</Text>
                    <Text style={styles.emptyStateSubtext}>Create a new invoice to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Payments' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Payments</Text>
                  <View style={styles.emptyState}>
                    <CheckSquare size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No payments found</Text>
                    <Text style={styles.emptyStateSubtext}>Record a payment to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Tasks' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Tasks</Text>
                  <View style={styles.emptyState}>
                    <Clock size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No tasks found</Text>
                    <Text style={styles.emptyStateSubtext}>Create a new task to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Notes' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <View style={styles.emptyState}>
                    <FileText size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No notes found</Text>
                    <Text style={styles.emptyStateSubtext}>Add a note to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Attachments' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Attachments</Text>
                  <View style={styles.emptyState}>
                    <Paperclip size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No attachments found</Text>
                    <Text style={styles.emptyStateSubtext}>Upload a file to get started</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Call History' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Call History</Text>
                  <View style={styles.emptyState}>
                    <Phone size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No call history found</Text>
                    <Text style={styles.emptyStateSubtext}>Make a call to get started</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Related Business Section */}
            <View style={styles.businessSection}>
              <View style={styles.businessHeader}>
                <Text style={styles.sectionTitle}>Related Businesses</Text>
                <TouchableOpacity style={styles.addBusinessButton}>
                  <Plus size={16} color="#6366F1" />
                  <Text style={styles.addBusinessText}>Add Business</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.businessCard}>
                <View style={styles.businessItem}>
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>{selectedContact?.company || 'No business associated'}</Text>
                    <Text style={styles.businessIndustry}>Technology</Text>
                    <Text style={styles.businessContact}>{selectedContact?.email}</Text>
                    <Text style={styles.businessPhone}>{selectedContact?.phone}</Text>
                  </View>
                  <TouchableOpacity style={styles.businessActions}>
                    <MoreHorizontal size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 100,
  },
  gradientHeader: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pullOutIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 8,
  },
  pullOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backdropFilter: 'blur(10px)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  contactsList: {
    paddingBottom: 100,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -120 }, { translateY: -150 }],
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  expandButton: {
    padding: 8,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  viewContactButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  viewContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Contact Card Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  moreButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  // Contact Header
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  // Contact Information Section
  contactInfoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  // Tabs
  tabsContainer: {
    marginBottom: 24,
  },
  tabsScrollView: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  // Tab Content
  tabContent: {
    marginBottom: 24,
  },
  tabSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Business Section
  businessSection: {
    marginBottom: 24,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBusinessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addBusinessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  businessIndustry: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  businessContact: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 2,
  },
  businessPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  businessActions: {
    padding: 8,
  },
});