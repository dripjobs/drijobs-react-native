import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Building2, Calendar, CheckSquare, ChevronDown, ChevronRight, Copy, DollarSign, Edit, FileText, Filter, Mail, MapPin, MessageSquare, MoreHorizontal, Navigation, Phone, Plus, Search, Star, Tag, User, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Businesses() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [expandedBusiness, setExpandedBusiness] = useState<number | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [activeTab, setActiveTab] = useState('Information');
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [addContactMode, setAddContactMode] = useState<'search' | 'new'>('search');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [selectedContactToLink, setSelectedContactToLink] = useState<any>(null);
  const [newContactFormData, setNewContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    dba: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    displayDbaOnDocuments: false,
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const industries = [
    'Construction',
    'Roofing',
    'HVAC',
    'Plumbing',
    'Electrical',
    'Landscaping',
    'Painting',
    'Cleaning Services',
    'Home Services',
    'Property Management',
    'Real Estate',
    'Retail',
    'Technology',
    'Healthcare',
    'Education',
    'Food & Beverage',
    'Manufacturing',
    'Professional Services',
    'Other'
  ];

  const contactRoles = [
    'Owner',
    'Manager',
    'Supervisor',
    'Foreman',
    'Project Manager',
    'Operations Manager',
    'Sales Representative',
    'Accountant',
    'Administrative Assistant',
    'Other'
  ];

  // Mock contacts for searching/linking
  const allContacts = [
    { id: 101, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '+1 (555) 123-4567', company: 'TechCorp Inc.' },
    { id: 102, name: 'Mike Chen', email: 'mike@email.com', phone: '+1 (555) 987-6543', company: 'StartupXYZ' },
    { id: 103, name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '+1 (555) 456-7890', company: 'InnovateNow' },
    { id: 104, name: 'David Kim', email: 'david.kim@email.com', phone: '+1 (555) 321-0987', company: 'DevSolutions' },
    { id: 105, name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 (555) 654-3210', company: 'GrowthCo' },
    { id: 106, name: 'John Martinez', email: 'j.martinez@email.com', phone: '+1 (555) 789-0123', company: 'FlowTech' },
    { id: 107, name: 'Anna Foster', email: 'anna.f@email.com', phone: '+1 (555) 456-1234', company: 'GrowthMax' },
    { id: 108, name: 'Robert Chang', email: 'r.chang@email.com', phone: '+1 (555) 321-7890', company: 'CodeBase' },
  ];

  const businesses = [
    { 
      id: 1, 
      name: 'Acme Construction Inc.', 
      dba: 'Acme Builders',
      displayDbaOnDocuments: true,
      industry: 'Construction', 
      email: 'info@acmeconstruction.com', 
      phone: '+1 (555) 100-2000', 
      address: '100 Industrial Way, Austin, TX 78701',
      contactCount: 5,
      primaryContact: { name: 'John Smith', email: 'john@acmeconstruction.com', phone: '+1 (555) 100-2001' },
      openBalance: 15000,
      lifetimeRevenue: 250000,
      unpaidInvoicesCount: 2,
      createdAt: '2024-01-10T10:30:00Z',
      createdBy: 'User',
      deals: [
        { id: 1, name: 'Office Renovation', status: 'In Progress', value: 50000, primaryContactId: 1, createdAt: '2024-02-15T10:30:00Z' }
      ],
      proposals: [
        { id: 1, name: 'Kitchen Remodel', status: 'Sent', value: 25000, createdAt: '2024-03-01T10:30:00Z' }
      ],
      appointments: [
        { id: 1, title: 'Site Inspection', date: '2024-03-15T14:00:00Z', status: 'Scheduled' }
      ],
      invoices: [
        { id: 1, number: 'INV-001', amount: 15000, status: 'Unpaid', dueDate: '2024-03-20T00:00:00Z' }
      ],
      tasks: [
        { id: 1, title: 'Follow up on proposal', status: 'Open', dueDate: '2024-03-10T00:00:00Z' }
      ]
    },
    { 
      id: 2, 
      name: 'Superior Roofing LLC', 
      dba: '',
      displayDbaOnDocuments: false,
      industry: 'Roofing', 
      email: 'contact@superiorroofing.com', 
      phone: '+1 (555) 200-3000', 
      address: '250 Commerce Dr, Dallas, TX 75201',
      contactCount: 3,
      primaryContact: { name: 'Sarah Johnson', email: 'sarah@superiorroofing.com', phone: '+1 (555) 200-3001' },
      openBalance: 8500,
      lifetimeRevenue: 175000,
      unpaidInvoicesCount: 1,
      createdAt: '2024-01-15T14:20:00Z',
      deals: [
        { id: 2, name: 'Commercial Roof Replacement', status: 'Proposal', value: 85000, primaryContactId: 2, createdAt: '2024-02-20T10:30:00Z' }
      ],
      proposals: [],
      appointments: [],
      invoices: [
        { id: 2, number: 'INV-002', amount: 8500, status: 'Unpaid', dueDate: '2024-03-18T00:00:00Z' }
      ],
      tasks: []
    },
    { 
      id: 3, 
      name: 'GreenLeaf Landscaping', 
      dba: 'GreenLeaf Pros',
      displayDbaOnDocuments: true,
      industry: 'Landscaping', 
      email: 'info@greenleaflandscaping.com', 
      phone: '+1 (555) 300-4000', 
      address: '500 Garden Ave, Houston, TX 77001',
      contactCount: 4,
      primaryContact: { name: 'Mike Chen', email: 'mike@greenleaflandscaping.com', phone: '+1 (555) 300-4001' },
      openBalance: 0,
      lifetimeRevenue: 95000,
      unpaidInvoicesCount: 0,
      createdAt: '2024-01-20T09:15:00Z',
      deals: [],
      proposals: [],
      appointments: [
        { id: 2, title: 'Property Assessment', date: '2024-03-12T10:00:00Z', status: 'Scheduled' }
      ],
      invoices: [],
      tasks: [
        { id: 2, title: 'Send maintenance proposal', status: 'Open', dueDate: '2024-03-08T00:00:00Z' }
      ]
    },
    { 
      id: 4, 
      name: 'Elite HVAC Services', 
      dba: '',
      displayDbaOnDocuments: false,
      industry: 'HVAC', 
      email: 'service@elitehvac.com', 
      phone: '+1 (555) 400-5000', 
      address: '750 Industrial Blvd, San Antonio, TX 78201',
      contactCount: 2,
      primaryContact: { name: 'Emily Rodriguez', email: 'emily@elitehvac.com', phone: '+1 (555) 400-5001' },
      openBalance: 12000,
      lifetimeRevenue: 320000,
      unpaidInvoicesCount: 1,
      createdAt: '2024-01-25T11:45:00Z',
      deals: [
        { id: 3, name: 'HVAC System Installation', status: 'In Progress', value: 45000, primaryContactId: 3, createdAt: '2024-02-25T10:30:00Z' }
      ],
      proposals: [
        { id: 2, name: 'Maintenance Contract', status: 'Sent', value: 15000, createdAt: '2024-03-02T10:30:00Z' }
      ],
      appointments: [],
      invoices: [
        { id: 3, number: 'INV-003', amount: 12000, status: 'Unpaid', dueDate: '2024-03-25T00:00:00Z' }
      ],
      tasks: []
    },
    { 
      id: 5, 
      name: 'ProClean Janitorial Inc.', 
      dba: 'ProClean',
      displayDbaOnDocuments: true,
      industry: 'Cleaning Services', 
      email: 'contact@proclean.com', 
      phone: '+1 (555) 500-6000', 
      address: '900 Service Rd, Fort Worth, TX 76101',
      contactCount: 6,
      primaryContact: { name: 'David Kim', email: 'david@proclean.com', phone: '+1 (555) 500-6001' },
      openBalance: 5500,
      lifetimeRevenue: 210000,
      unpaidInvoicesCount: 3,
      createdAt: '2024-02-01T13:20:00Z',
      deals: [],
      proposals: [
        { id: 3, name: 'Monthly Cleaning Contract', status: 'Sent', value: 8000, createdAt: '2024-03-03T10:30:00Z' }
      ],
      appointments: [
        { id: 3, title: 'Walk-through Meeting', date: '2024-03-14T09:00:00Z', status: 'Scheduled' }
      ],
      invoices: [
        { id: 4, number: 'INV-004', amount: 2000, status: 'Unpaid', dueDate: '2024-03-15T00:00:00Z' },
        { id: 5, number: 'INV-005', amount: 2000, status: 'Unpaid', dueDate: '2024-03-22T00:00:00Z' },
        { id: 6, number: 'INV-006', amount: 1500, status: 'Unpaid', dueDate: '2024-03-28T00:00:00Z' }
      ],
      tasks: [
        { id: 3, title: 'Review contract terms', status: 'Open', dueDate: '2024-03-11T00:00:00Z' }
      ]
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const getDisplayName = (business: any) => {
    if (!business) return '';
    if (business.displayDbaOnDocuments && business.dba) {
      return `${business.name} / ${business.dba}`;
    }
    return business.name;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (business.dba && business.dba.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = !selectedIndustry || business.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleBusinessPress = (business: any) => {
    console.log('Open business record:', business.name);
  };

  const handleExpandBusiness = (businessId: number) => {
    setExpandedBusiness(expandedBusiness === businessId ? null : businessId);
  };

  const handleViewBusinessCard = (business: any) => {
    setSelectedBusiness(business);
    setShowBusinessCard(true);
  };

  const handleBusinessAction = (actionType: string, value: string) => {
    setExpandedActionItem(expandedActionItem === actionType ? null : actionType);
  };

  const handleExpandDeal = (dealId: number) => {
    setExpandedDeal(expandedDeal === dealId ? null : dealId);
  };

  const handleEditBusiness = () => {
    if (selectedBusiness) {
      setEditFormData({
        name: selectedBusiness.name,
        dba: selectedBusiness.dba,
        industry: selectedBusiness.industry,
        email: selectedBusiness.email,
        phone: selectedBusiness.phone,
        address: selectedBusiness.address,
        displayDbaOnDocuments: selectedBusiness.displayDbaOnDocuments,
      });
    }
    setShowBusinessCard(false);
    setShowEditModal(true);
  };

  const handleSaveBusiness = () => {
    const errors: {[key: string]: string} = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Business name is required';
    }
    
    if (!editFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setFormErrors({});
      setShowEditModal(false);
      Alert.alert('Success', 'Business updated successfully');
    }, 1000);
  };

  const handleDeleteBusinessAction = () => {
    setShowBusinessMenu(false);
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setShowBusinessCard(false);
            Alert.alert('Success', 'Business deleted successfully');
          }
        }
      ]
    );
  };

  const handleArchiveBusinessAction = () => {
    setShowBusinessMenu(false);
    Alert.alert('Success', 'Business archived successfully');
  };

  const handleShareBusinessAction = () => {
    setShowBusinessMenu(false);
    Alert.alert('Share Business', 'Sharing functionality coming soon');
  };

  const handleCopyBusinessAction = () => {
    setShowBusinessMenu(false);
    Alert.alert('Success', 'Business information copied to clipboard');
  };

  const handleOpenAddContact = () => {
    setShowBusinessCard(false);
    setAddContactMode('search');
    setContactSearchQuery('');
    setSelectedContactToLink(null);
    setNewContactFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
    });
    setFormErrors({});
    setShowAddContactModal(true);
  };

  const handleLinkExistingContact = () => {
    if (!selectedContactToLink) {
      Alert.alert('Error', 'Please select a contact to link');
      return;
    }

    if (!selectedContactToLink.role) {
      Alert.alert('Error', 'Please assign a role to this contact');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowAddContactModal(false);
      
      // Determine if this should be primary (first contact)
      const isPrimary = !selectedBusiness?.primaryContact;
      
      Alert.alert(
        'Success', 
        `${selectedContactToLink.name} has been linked to ${selectedBusiness?.name}${isPrimary ? ' as primary contact' : ''}`
      );
      
      // Reset and reopen business card
      setTimeout(() => {
        setShowBusinessCard(true);
      }, 300);
    }, 1000);
  };

  const handleCreateAndLinkContact = () => {
    const errors: {[key: string]: string} = {};
    
    if (!newContactFormData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!newContactFormData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!newContactFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newContactFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!newContactFormData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    
    if (!newContactFormData.role.trim()) {
      errors.role = 'Role is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowAddContactModal(false);
      
      // Determine if this should be primary (first contact)
      const isPrimary = !selectedBusiness?.primaryContact;
      
      Alert.alert(
        'Success', 
        `${newContactFormData.firstName} ${newContactFormData.lastName} has been created and linked to ${selectedBusiness?.name}${isPrimary ? ' as primary contact' : ''}`
      );
      
      // Reset and reopen business card
      setTimeout(() => {
        setShowBusinessCard(true);
      }, 300);
    }, 1000);
  };

  const filteredContactsForSearch = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.phone.includes(contactSearchQuery)
  );

  React.useEffect(() => {
    setIsTransparent(false);
    return () => setIsTransparent(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.gradientHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.pullOutMenu} onPress={() => setDrawerOpen(true)}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <ChevronRight size={20} color="#FFFFFF" style={styles.pullOutArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Businesses</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search businesses..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          if (currentScrollY > 50) {
            setShowFAB(false);
          } else {
            setShowFAB(true);
          }
          setLastScrollY(currentScrollY);
        }}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setIsTransparent(true)}
        onScrollEndDrag={() => setIsTransparent(false)}
        onMomentumScrollBegin={() => setIsTransparent(true)}
        onMomentumScrollEnd={() => setIsTransparent(false)}
      >
        <View style={styles.businessesList}>
          {filteredBusinesses.map((business) => (
            <View key={business.id} style={styles.businessCard}>
              <TouchableOpacity 
                style={styles.businessRow}
                onPress={() => handleBusinessPress(business)}
              >
                <View style={[styles.avatar, { backgroundColor: '#0EA5E9' }]}>
                  <Building2 size={24} color="#FFFFFF" />
                </View>
                
                <View style={styles.businessInfo}>
                  <Text style={styles.businessName}>{getDisplayName(business)}</Text>
                  <Text style={styles.businessIndustry}>{business.industry}</Text>
                  <View style={styles.businessMetrics}>
                    <View style={styles.metricItem}>
                      <Users size={12} color="#6B7280" />
                      <Text style={styles.metricText}>{business.contactCount} contacts</Text>
                    </View>
                    {business.openBalance > 0 && (
                      <View style={styles.metricItem}>
                        <DollarSign size={12} color="#EF4444" />
                        <Text style={[styles.metricText, { color: '#EF4444' }]}>
                          {formatCurrency(business.openBalance)} due
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleExpandBusiness(business.id);
                  }}
                >
                  <ChevronRight 
                    size={20} 
                    color="#6B7280" 
                    style={{ 
                      transform: [{ rotate: expandedBusiness === business.id ? '90deg' : '0deg' }] 
                    }} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              
              {expandedBusiness === business.id && (
                <View style={styles.expandedContent}>
                  <View style={styles.businessActions}>
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
                    style={styles.viewBusinessButton}
                    onPress={() => handleViewBusinessCard(business)}
                  >
                    <Text style={styles.viewBusinessText}>View Business Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <FloatingActionMenu isVisible={showFAB} />

      {/* Business Card Modal */}
      <Modal
        visible={showBusinessCard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBusinessCard(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowBusinessCard(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Business Details</Text>
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => setShowBusinessMenu(true)}
            >
              <MoreHorizontal size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Business Menu Dropdown */}
          {showBusinessMenu && (
            <>
              <TouchableOpacity 
                style={styles.businessMenuBackdrop}
                onPress={() => setShowBusinessMenu(false)}
                activeOpacity={1}
              />
              <View style={styles.businessMenuDropdown}>
                <View style={styles.dropdownPointerBorder} />
                <View style={styles.dropdownPointer} />
                
                <TouchableOpacity 
                  style={styles.businessMenuDropdownItem}
                  onPress={handleShareBusinessAction}
                >
                  <MessageSquare size={18} color="#10B981" />
                  <Text style={styles.businessMenuDropdownText}>Share Business</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.businessMenuDropdownItem}
                  onPress={handleCopyBusinessAction}
                >
                  <Copy size={18} color="#6366F1" />
                  <Text style={styles.businessMenuDropdownText}>Copy Business</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.businessMenuDropdownItem}
                  onPress={handleArchiveBusinessAction}
                >
                  <FileText size={18} color="#8B5CF6" />
                  <Text style={styles.businessMenuDropdownText}>Archive Business</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.businessMenuDropdownItem, styles.businessMenuDropdownDeleteItem]}
                  onPress={handleDeleteBusinessAction}
                >
                  <X size={18} color="#EF4444" />
                  <Text style={[styles.businessMenuDropdownText, styles.businessMenuDropdownDeleteText]}>Delete Business</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedBusiness && (
              <>
                {/* Business Header */}
                <View style={styles.businessHeader}>
                  <View style={styles.businessAvatar}>
                    <Building2 size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.businessInfoHeader}>
                    <Text style={styles.businessNameHeader}>{getDisplayName(selectedBusiness)}</Text>
                    <Text style={styles.businessIndustryHeader}>{selectedBusiness.industry}</Text>
                    {selectedBusiness.primaryContact && (
                      <View style={styles.primaryContactBadge}>
                        <Star size={12} color="#F59E0B" />
                        <Text style={styles.primaryContactText}>{selectedBusiness.primaryContact.name}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.editBusinessButton}
                    onPress={handleEditBusiness}
                  >
                    <Edit size={16} color="#FFFFFF" />
                    <Text style={styles.editBusinessButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {/* Business Metrics */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <DollarSign size={24} color="#10B981" />
                    <Text style={styles.metricCardValue}>{formatCurrency(selectedBusiness.lifetimeRevenue || 0)}</Text>
                    <Text style={styles.metricCardLabel}>Lifetime Revenue</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <DollarSign size={24} color="#EF4444" />
                    <Text style={styles.metricCardValue}>{formatCurrency(selectedBusiness.openBalance || 0)}</Text>
                    <Text style={styles.metricCardLabel}>Open Balance</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <FileText size={24} color="#F59E0B" />
                    <Text style={styles.metricCardValue}>{selectedBusiness.unpaidInvoicesCount || 0}</Text>
                    <Text style={styles.metricCardLabel}>Unpaid Invoices</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Users size={24} color="#6366F1" />
                    <Text style={styles.metricCardValue}>{selectedBusiness.contactCount || 0}</Text>
                    <Text style={styles.metricCardLabel}>Contacts</Text>
                  </View>
                </View>
              </>
            )}

            {/* Tabs */}
            {selectedBusiness && (
              <>
                <View style={styles.tabsContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
                    {['Information', 'Contacts', 'Deals', 'Proposals', 'Appointments', 'Invoices', 'Tasks', 'Notes', 'Attachments'].map((tab) => (
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
                  <Text style={styles.sectionTitle}>Business Information</Text>
                  
                  <View style={styles.unifiedBusinessCard}>
                    <View style={styles.businessDetailsSection}>
                      <View style={styles.businessDetailItem}>
                        <View style={styles.businessDetailIcon}>
                          <Building2 size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.businessDetailContent}>
                          <Text style={styles.businessDetailLabel}>Legal Name</Text>
                          <Text style={styles.businessDetailText}>{selectedBusiness?.name}</Text>
                        </View>
                      </View>

                      {selectedBusiness?.dba && (
                        <View style={styles.businessDetailItem}>
                          <View style={styles.businessDetailIcon}>
                            <Tag size={20} color="#8E8E93" />
                          </View>
                          <View style={styles.businessDetailContent}>
                            <Text style={styles.businessDetailLabel}>DBA</Text>
                            <Text style={styles.businessDetailText}>{selectedBusiness.dba}</Text>
                          </View>
                        </View>
                      )}
                      
                      <View style={styles.businessDetailItem}>
                        <View style={styles.businessDetailIcon}>
                          <Mail size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.businessDetailContent}>
                          <Text style={styles.businessDetailLabel}>Email</Text>
                          <TouchableOpacity style={styles.businessDetailValue}>
                            <Text style={styles.businessDetailText}>{selectedBusiness?.email}</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                          style={styles.businessActionButton}
                          onPress={() => handleBusinessAction('email', selectedBusiness?.email)}
                        >
                          <MoreHorizontal size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.businessDetailItem}>
                        <View style={styles.businessDetailIcon}>
                          <Phone size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.businessDetailContent}>
                          <Text style={styles.businessDetailLabel}>Phone</Text>
                          <TouchableOpacity style={styles.businessDetailValue}>
                            <Text style={styles.businessDetailText}>{selectedBusiness?.phone}</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                          style={styles.businessActionButton}
                          onPress={() => handleBusinessAction('phone', selectedBusiness?.phone)}
                        >
                          <MoreHorizontal size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      
                      {selectedBusiness?.address && (
                        <View style={styles.businessDetailItem}>
                          <View style={styles.businessDetailIcon}>
                            <MapPin size={20} color="#8E8E93" />
                          </View>
                          <View style={styles.businessDetailContent}>
                            <Text style={styles.businessDetailLabel}>Address</Text>
                            <Text style={styles.businessDetailText}>{selectedBusiness.address}</Text>
                          </View>
                        </View>
                      )}

                      <View style={styles.businessDetailItem}>
                        <View style={styles.businessDetailIcon}>
                          <Calendar size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.businessDetailContent}>
                          <Text style={styles.businessDetailLabel}>Created</Text>
                          <Text style={styles.businessDetailText}>{formatDate(selectedBusiness?.createdAt || '')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {activeTab === 'Contacts' && (
                <View style={styles.tabSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Associated Contacts</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleOpenAddContact}>
                      <Plus size={20} color="#6366F1" />
                      <Text style={styles.addButtonText}>Add Contact</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {selectedBusiness?.primaryContact && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactAvatar}>
                        <User size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.contactInfo}>
                        <View style={styles.contactNameRow}>
                          <Text style={styles.contactNameText}>{selectedBusiness.primaryContact.name}</Text>
                          <View style={styles.primaryBadge}>
                            <Star size={10} color="#F59E0B" />
                            <Text style={styles.primaryBadgeText}>Primary</Text>
                          </View>
                        </View>
                        <Text style={styles.contactEmail}>{selectedBusiness.primaryContact.email}</Text>
                        <Text style={styles.contactPhone}>{selectedBusiness.primaryContact.phone}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.emptyState}>
                    <Users size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateTitle}>No additional contacts</Text>
                    <Text style={styles.emptyStateText}>Add more contacts to this business</Text>
                  </View>
                </View>
              )}

              {activeTab === 'Deals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Active Deals</Text>
                  {selectedBusiness?.deals && selectedBusiness.deals.length > 0 ? (
                    selectedBusiness.deals.map((deal: any) => (
                      <View key={deal.id} style={styles.dealItem}>
                        <View style={styles.dealHeader}>
                          <View style={styles.dealInfo}>
                            <Text style={styles.dealName}>{deal.name}</Text>
                            <Text style={styles.dealValue}>{formatCurrency(deal.value)}</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: deal.status === 'In Progress' ? '#DBEAFE' : '#FEF3C7' }]}>
                            <Text style={[styles.statusBadgeText, { color: deal.status === 'In Progress' ? '#1E40AF' : '#92400E' }]}>
                              {deal.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.dealDate}>Created: {formatDate(deal.createdAt)}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <FileText size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No deals yet</Text>
                      <Text style={styles.emptyStateText}>Deals with this business will appear here</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'Proposals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Proposals</Text>
                  {selectedBusiness?.proposals && selectedBusiness.proposals.length > 0 ? (
                    selectedBusiness.proposals.map((proposal: any) => (
                      <View key={proposal.id} style={styles.dealItem}>
                        <View style={styles.dealHeader}>
                          <View style={styles.dealInfo}>
                            <Text style={styles.dealName}>{proposal.name}</Text>
                            <Text style={styles.dealValue}>{formatCurrency(proposal.value)}</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: '#E0E7FF' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#3730A3' }]}>{proposal.status}</Text>
                          </View>
                        </View>
                        <Text style={styles.dealDate}>Created: {formatDate(proposal.createdAt)}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <FileText size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No proposals yet</Text>
                      <Text style={styles.emptyStateText}>Proposals sent to this business will appear here</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'Appointments' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                  {selectedBusiness?.appointments && selectedBusiness.appointments.length > 0 ? (
                    selectedBusiness.appointments.map((appointment: any) => (
                      <View key={appointment.id} style={styles.appointmentItem}>
                        <View style={styles.appointmentIcon}>
                          <Calendar size={20} color="#6366F1" />
                        </View>
                        <View style={styles.appointmentInfo}>
                          <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                          <Text style={styles.appointmentDate}>{formatDate(appointment.date)}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#166534' }]}>{appointment.status}</Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Calendar size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No appointments scheduled</Text>
                      <Text style={styles.emptyStateText}>Schedule a meeting with this business</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'Invoices' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Invoices</Text>
                  {selectedBusiness?.invoices && selectedBusiness.invoices.length > 0 ? (
                    selectedBusiness.invoices.map((invoice: any) => (
                      <View key={invoice.id} style={styles.invoiceItem}>
                        <View style={styles.invoiceHeader}>
                          <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                          <Text style={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</Text>
                        </View>
                        <View style={styles.invoiceFooter}>
                          <Text style={styles.invoiceDue}>Due: {formatDate(invoice.dueDate)}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: invoice.status === 'Unpaid' ? '#FEE2E2' : '#DCFCE7' }]}>
                            <Text style={[styles.statusBadgeText, { color: invoice.status === 'Unpaid' ? '#991B1B' : '#166534' }]}>
                              {invoice.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <FileText size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No invoices yet</Text>
                      <Text style={styles.emptyStateText}>Invoices for this business will appear here</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'Tasks' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Open Tasks</Text>
                  {selectedBusiness?.tasks && selectedBusiness.tasks.length > 0 ? (
                    selectedBusiness.tasks.map((task: any) => (
                      <View key={task.id} style={styles.taskItem}>
                        <CheckSquare size={20} color="#6366F1" />
                        <View style={styles.taskInfo}>
                          <Text style={styles.taskTitle}>{task.title}</Text>
                          <Text style={styles.taskDue}>Due: {formatDate(task.dueDate)}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
                          <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>{task.status}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <CheckSquare size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No open tasks</Text>
                      <Text style={styles.emptyStateText}>Tasks related to this business will appear here</Text>
                    </View>
                  )}
                </View>
              )}

              {(activeTab === 'Notes' || activeTab === 'Attachments') && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>{activeTab}</Text>
                  <View style={styles.emptyState}>
                    <FileText size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateTitle}>No {activeTab.toLowerCase()} yet</Text>
                    <Text style={styles.emptyStateText}>Add {activeTab.toLowerCase()} to keep track of important information</Text>
                  </View>
                </View>
              )}
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Business Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Business</Text>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveBusiness}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Business Name *</Text>
              <TextInput
                style={[styles.formInput, formErrors.name && styles.formInputError]}
                value={editFormData.name}
                onChangeText={(text) => setEditFormData({...editFormData, name: text})}
                placeholder="Enter business name"
              />
              {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>DBA (Doing Business As)</Text>
              <TextInput
                style={styles.formInput}
                value={editFormData.dba}
                onChangeText={(text) => setEditFormData({...editFormData, dba: text})}
                placeholder="Enter DBA"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Industry</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{editFormData.industry || 'Select Industry'}</Text>
                <ChevronDown size={20} color="#6B7280" />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={[styles.formInput, formErrors.email && styles.formInputError]}
                value={editFormData.email}
                onChangeText={(text) => setEditFormData({...editFormData, email: text})}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={editFormData.phone}
                onChangeText={(text) => setEditFormData({...editFormData, phone: text})}
                placeholder="Enter phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={[styles.formInput, { height: 80 }]}
                value={editFormData.address}
                onChangeText={(text) => setEditFormData({...editFormData, address: text})}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowAddContactModal(false);
          setTimeout(() => setShowBusinessCard(true), 300);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowAddContactModal(false);
                setTimeout(() => setShowBusinessCard(true), 300);
              }}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Contact to Business</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Mode Toggle */}
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity 
                style={[styles.modeToggleButton, addContactMode === 'search' && styles.modeToggleButtonActive]}
                onPress={() => {
                  setAddContactMode('search');
                  setFormErrors({});
                }}
              >
                <Search size={18} color={addContactMode === 'search' ? '#FFFFFF' : '#6366F1'} />
                <Text style={[styles.modeToggleButtonText, addContactMode === 'search' && styles.modeToggleButtonTextActive]}>
                  Link Existing
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeToggleButton, addContactMode === 'new' && styles.modeToggleButtonActive]}
                onPress={() => {
                  setAddContactMode('new');
                  setFormErrors({});
                }}
              >
                <Plus size={18} color={addContactMode === 'new' ? '#FFFFFF' : '#6366F1'} />
                <Text style={[styles.modeToggleButtonText, addContactMode === 'new' && styles.modeToggleButtonTextActive]}>
                  Create New
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Existing Contacts */}
            {addContactMode === 'search' && (
              <View>
                <Text style={styles.sectionTitle}>Search for Existing Contact</Text>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInputField}
                    placeholder="Search by name, email, or phone..."
                    value={contactSearchQuery}
                    onChangeText={setContactSearchQuery}
                  />
                  {contactSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setContactSearchQuery('')}>
                      <X size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                {contactSearchQuery.length > 0 && (
                  <View style={styles.searchResults}>
                    {filteredContactsForSearch.length > 0 ? (
                      filteredContactsForSearch.map((contact) => (
                        <TouchableOpacity
                          key={contact.id}
                          style={[
                            styles.contactSearchItem,
                            selectedContactToLink?.id === contact.id && styles.contactSearchItemSelected
                          ]}
                          onPress={() => setSelectedContactToLink({ ...contact, role: selectedContactToLink?.id === contact.id ? selectedContactToLink?.role : '' })}
                        >
                          <View style={styles.contactSearchAvatar}>
                            <User size={20} color="#6366F1" />
                          </View>
                          <View style={styles.contactSearchInfo}>
                            <Text style={styles.contactSearchName}>{contact.name}</Text>
                            <Text style={styles.contactSearchEmail}>{contact.email}</Text>
                            <Text style={styles.contactSearchPhone}>{contact.phone}</Text>
                          </View>
                          {selectedContactToLink?.id === contact.id && (
                            <View style={styles.selectedCheckmark}>
                              <CheckSquare size={20} color="#6366F1" />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>No contacts found</Text>
                      </View>
                    )}
                  </View>
                )}

                {selectedContactToLink && (
                  <View style={styles.roleSection}>
                    <Text style={styles.formLabel}>Assign Role to Contact *</Text>
                    <Text style={styles.formHelper}>
                      {!selectedBusiness?.primaryContact ? 'This will be set as the primary contact (first contact)' : 'Select the role for this contact at this business'}
                    </Text>
                    <View style={styles.roleGrid}>
                      {contactRoles.map((role) => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleChip,
                            selectedContactToLink.role === role && styles.roleChipActive
                          ]}
                          onPress={() => setSelectedContactToLink({ ...selectedContactToLink, role })}
                        >
                          <Text style={[
                            styles.roleChipText,
                            selectedContactToLink.role === role && styles.roleChipTextActive
                          ]}>
                            {role}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
                      onPress={handleLinkExistingContact}
                      disabled={isSaving}
                    >
                      <Text style={styles.submitButtonText}>
                        {isSaving ? 'Linking...' : 'Link Contact to Business'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Create New Contact */}
            {addContactMode === 'new' && (
              <View>
                <Text style={styles.sectionTitle}>Create New Contact</Text>
                <Text style={styles.formHelper}>
                  {!selectedBusiness?.primaryContact ? 'This will be set as the primary contact (first contact)' : 'This contact will be added to the business'}
                </Text>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>First Name *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.firstName && styles.formInputError]}
                    value={newContactFormData.firstName}
                    onChangeText={(text) => setNewContactFormData({...newContactFormData, firstName: text})}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Last Name *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.lastName && styles.formInputError]}
                    value={newContactFormData.lastName}
                    onChangeText={(text) => setNewContactFormData({...newContactFormData, lastName: text})}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Email *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.email && styles.formInputError]}
                    value={newContactFormData.email}
                    onChangeText={(text) => setNewContactFormData({...newContactFormData, email: text})}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Phone *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.phone && styles.formInputError]}
                    value={newContactFormData.phone}
                    onChangeText={(text) => setNewContactFormData({...newContactFormData, phone: text})}
                    placeholder="Enter phone"
                    keyboardType="phone-pad"
                  />
                  {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Role at Business *</Text>
                  <View style={styles.roleGrid}>
                    {contactRoles.map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleChip,
                          newContactFormData.role === role && styles.roleChipActive
                        ]}
                        onPress={() => setNewContactFormData({...newContactFormData, role})}
                      >
                        <Text style={[
                          styles.roleChipText,
                          newContactFormData.role === role && styles.roleChipTextActive
                        ]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {formErrors.role && <Text style={styles.errorText}>{formErrors.role}</Text>}
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
                  onPress={handleCreateAndLinkContact}
                  disabled={isSaving}
                >
                  <Text style={styles.submitButtonText}>
                    {isSaving ? 'Creating...' : 'Create and Link Contact'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    zIndex: 10,
    elevation: 10,
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
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
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
    zIndex: 1,
  },
  businessesList: {
    paddingBottom: 100,
  },
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  businessIndustry: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  businessMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#6B7280',
  },
  expandButton: {
    padding: 4,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  businessActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewBusinessButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewBusinessText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
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
  moreButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  businessAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessInfoHeader: {
    flex: 1,
  },
  businessNameHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  businessIndustryHeader: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  primaryContactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  primaryContactText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  editBusinessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editBusinessButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  metricCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 12,
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
  tabContent: {
    paddingBottom: 40,
  },
  tabSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  unifiedBusinessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  businessDetailsSection: {
    padding: 16,
  },
  businessDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  businessDetailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  businessDetailContent: {
    flex: 1,
  },
  businessDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  businessDetailText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  businessDetailValue: {
    marginTop: 2,
  },
  businessActionButton: {
    padding: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  contactNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  contactEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  dealItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealInfo: {
    flex: 1,
  },
  dealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dealValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  dealDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  invoiceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceDue: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskDue: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  businessMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  businessMenuDropdown: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 999,
    minWidth: 220,
    overflow: 'visible',
  },
  dropdownPointerBorder: {
    position: 'absolute',
    top: -9,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownPointer: {
    position: 'absolute',
    top: -8,
    right: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 9,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  businessMenuDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  businessMenuDropdownText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  businessMenuDropdownDeleteItem: {
    borderBottomWidth: 0,
  },
  businessMenuDropdownDeleteText: {
    color: '#EF4444',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  formInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingTop: 8,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  modeToggleButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  modeToggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  modeToggleButtonTextActive: {
    color: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInputField: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchResults: {
    marginBottom: 20,
  },
  contactSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactSearchItemSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F3FF',
  },
  contactSearchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactSearchInfo: {
    flex: 1,
  },
  contactSearchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactSearchEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactSearchPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedCheckmark: {
    marginLeft: 12,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  roleSection: {
    marginTop: 24,
  },
  formHelper: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  roleChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  roleChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

