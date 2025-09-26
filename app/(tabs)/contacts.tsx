import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, CheckSquare, ChevronRight, Clock, Copy, DollarSign, Edit, FileText, Filter, Mail, MapPin, MessageSquare, MoreHorizontal, Navigation, Paperclip, Phone, Plus, Search, Tag, Target, TrendingUp, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Contacts() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [expandedContact, setExpandedContact] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showContactCard, setShowContactCard] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Information');
  const [expandedActionItem, setExpandedActionItem] = useState<string | null>(null);
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    secondaryEmail: '',
    secondaryPhone: '',
    address: '',
    contactTag: '',
    originalLeadSource: '',
    status: '',
    createdBy: '',
    customFields: [] as Array<{id: string, label: string, value: string}>
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);

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
      secondaryPhone: '+1 (555) 123-4568',
      addresses: [
        { id: 1, address: '123 Business Ave, Suite 100, New York, NY 10001', isPrimary: true, type: 'Office' },
        { id: 2, address: '456 Home St, New York, NY 10002', isPrimary: false, type: 'Residential' }
      ],
      createdAt: '2024-01-14T10:30:00Z',
      createdBy: 'User',
      customFields: [
        { id: 1, label: 'Preferred Contact Method', value: 'Email' },
        { id: 2, label: 'Industry', value: 'Technology' },
        { id: 3, label: 'Company Size', value: '50-100 employees' }
      ]
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
      secondaryPhone: '+1 (555) 987-6544',
      addresses: [
        { id: 1, address: '456 Innovation St, San Francisco, CA 94105', isPrimary: true, type: 'Office' }
      ],
      createdAt: '2024-01-15T14:20:00Z'
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
      secondaryPhone: '',
      addresses: [
        { id: 1, address: '789 Tech Blvd, Austin, TX 78701', isPrimary: true, type: 'Office' }
      ],
      createdAt: '2024-01-16T09:15:00Z'
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
      secondaryPhone: '',
      addresses: [
        { id: 1, address: '321 Code Lane, Seattle, WA 98101', isPrimary: true, type: 'Office' }
      ],
      createdAt: '2024-01-17T11:45:00Z'
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
  ].map(contact => ({
    ...contact,
    addresses: contact.addresses || [{ id: 1, address: contact.address, isPrimary: true, type: 'Office' }],
    createdAt: contact.createdAt || '2024-01-14T10:30:00Z',
    createdBy: contact.createdBy || 'User',
    customFields: contact.customFields || []
  })).sort((a, b) => a.name.localeCompare(b.name));

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

  const handleContactAction = (actionType: string, value: string) => {
    setExpandedActionItem(expandedActionItem === actionType ? null : actionType);
  };

  const handleExpandDeal = (dealId: number) => {
    setExpandedDeal(expandedDeal === dealId ? null : dealId);
  };

  const handleViewAppointmentDetails = (appointment: any) => {
    // Close the contact card modal
    setShowContactCard(false);
    
    // Set up the meeting data for the modal
    const meetingData = {
      id: appointment.id || 1,
      name: appointment.customer || 'Mike Stewart',
      type: appointment.type || 'consultation',
      address: appointment.address || '123 Main St, Orlando FL 32801',
      phone: appointment.phone || '(555) 123-4567',
      status: appointment.status || 'scheduled',
      assignee: appointment.assignee || 'Tanner Mullen',
      time: appointment.time || '10:00 AM',
      duration: 90,
      color: '#3B82F6',
      appointmentNotes: appointment.appointmentNotes || 'Initial consultation for kitchen renovation project.',
      adminNotes: appointment.adminNotes || 'Customer seems very interested and ready to move forward.',
      photos: []
    };
    
    setSelectedMeeting(meetingData);
    setShowMeetingDetails(true);
  };

  const handleEditContact = () => {
    console.log('Edit contact button pressed');
    if (selectedContact) {
      console.log('Setting edit form data for:', selectedContact.name);
      setEditFormData({
        name: selectedContact.name || '',
        title: selectedContact.title || '',
        company: selectedContact.company || '',
        email: selectedContact.email || '',
        phone: selectedContact.phone || '',
        secondaryEmail: selectedContact.secondaryEmail || '',
        secondaryPhone: selectedContact.secondaryPhone || '',
        address: selectedContact.addresses?.find(addr => addr.isPrimary)?.address || selectedContact.address || '',
        contactTag: selectedContact.contactTag || 'Customer',
        originalLeadSource: selectedContact.originalLeadSource || 'Website',
        status: selectedContact.status || 'Active',
        createdBy: selectedContact.createdBy || 'User',
        customFields: selectedContact.customFields || []
      });
      setFormErrors({});
      
      // Close the contact details modal first
      setShowContactCard(false);
      
      // Then open the edit modal after a short delay
      setTimeout(() => {
        console.log('Setting showEditModal to true');
        setShowEditModal(true);
      }, 300);
    } else {
      console.log('No selected contact');
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (editFormData.email && !/\S+@\S+\.\S+/.test(editFormData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (editFormData.secondaryEmail && !/\S+@\S+\.\S+/.test(editFormData.secondaryEmail)) {
      errors.secondaryEmail = 'Please enter a valid email';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveContact = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically save to your backend
      console.log('Saving contact:', editFormData);
      
      // Update the selected contact with new data
      if (selectedContact) {
        // Update the selectedContact state with the new data
        setSelectedContact({
          ...selectedContact,
          name: editFormData.name,
          title: editFormData.title,
          company: editFormData.company,
          email: editFormData.email,
          phone: editFormData.phone,
          secondaryEmail: editFormData.secondaryEmail,
          secondaryPhone: editFormData.secondaryPhone,
          address: editFormData.address,
          contactTag: editFormData.contactTag,
          originalLeadSource: editFormData.originalLeadSource,
          status: editFormData.status,
          createdBy: editFormData.createdBy,
          customFields: editFormData.customFields,
          // Update addresses array if needed
          addresses: selectedContact.addresses?.map(addr => 
            addr.isPrimary ? { ...addr, address: editFormData.address } : addr
          ) || [{ id: '1', address: editFormData.address, isPrimary: true, type: 'Primary' }]
        });
      }
      
      setShowEditModal(false);
      setFormErrors({});
      
      // Show success message
      alert('Contact updated successfully!');
      
      // Return to contact details modal
      setTimeout(() => {
        setShowContactCard(true);
      }, 100);
      
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      value: ''
    };
    setEditFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const removeCustomField = (id: string) => {
    setEditFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
  };

  const updateCustomField = (id: string, field: 'label' | 'value', newValue: string) => {
    setEditFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(fieldItem => 
        fieldItem.id === id ? { ...fieldItem, [field]: newValue } : fieldItem
      )
    }));
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
            
            {/* Edit Button */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditContact}
            >
              <Edit size={18} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Contact Details</Text>
            </TouchableOpacity>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
                {['Information', 'Addresses', 'Deals', 'Proposals', 'Appointments', 'Invoices', 'Payments', 'Tasks', 'Notes', 'Attachments', 'Call History'].map((tab) => (
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
                  
                  {/* Unified Contact Information Card */}
                  <View style={styles.unifiedContactCard}>
                    {/* Contact Details Section */}
                    <View style={styles.contactDetailsSection}>
                      <View style={styles.contactDetailItem}>
                        <View style={styles.contactDetailIcon}>
                          <Mail size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.contactDetailContent}>
                          <Text style={styles.contactDetailLabel}>Email</Text>
                          <TouchableOpacity style={styles.contactDetailValue}>
                            <Text style={styles.contactDetailText}>{selectedContact?.email}</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                          style={styles.contactActionButton}
                          onPress={() => handleContactAction('email', selectedContact?.email)}
                        >
                          <MoreHorizontal size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      
                      {expandedActionItem === 'email' && (
                        <View style={styles.inlineActionMenu}>
                          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <Mail size={16} color="#6366F1" />
                            <Text style={styles.inlineActionText}>Send Email</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <FileText size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Copy Email</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <Edit size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Edit Email</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      <View style={styles.contactDetailItem}>
                        <View style={styles.contactDetailIcon}>
                          <Phone size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.contactDetailContent}>
                          <Text style={styles.contactDetailLabel}>Phone</Text>
                          <TouchableOpacity style={styles.contactDetailValue}>
                            <Text style={styles.contactDetailText}>{selectedContact?.phone}</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                          style={styles.contactActionButton}
                          onPress={() => handleContactAction('phone', selectedContact?.phone)}
                        >
                          <MoreHorizontal size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      
                      {expandedActionItem === 'phone' && (
                        <View style={styles.inlineActionMenu}>
                          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <Phone size={16} color="#10B981" />
                            <Text style={styles.inlineActionText}>Call</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <MessageSquare size={16} color="#3B82F6" />
                            <Text style={styles.inlineActionText}>Send Text</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <FileText size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Copy Number</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <Edit size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Edit Phone</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      <View style={styles.contactDetailItem}>
                        <View style={styles.contactDetailIcon}>
                          <MapPin size={20} color="#8E8E93" />
                        </View>
                        <View style={styles.contactDetailContent}>
                          <Text style={styles.contactDetailLabel}>Primary Address</Text>
                          <TouchableOpacity style={styles.contactDetailValue}>
                            <Text style={styles.contactDetailText}>
                              {selectedContact?.addresses?.find(addr => addr.isPrimary)?.address || selectedContact?.address}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                          style={styles.contactActionButton}
                          onPress={() => handleContactAction('address', selectedContact?.addresses?.find(addr => addr.isPrimary)?.address || selectedContact?.address)}
                        >
                          <MoreHorizontal size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                      
                      {expandedActionItem === 'address' && (
                        <View style={styles.inlineActionMenu}>
                          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <MapPin size={16} color="#007AFF" />
                            <Text style={styles.inlineActionText}>Navigate</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <FileText size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Copy Address</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.inlineActionItem}>
                            <Edit size={16} color="#6B7280" />
                            <Text style={styles.inlineActionText}>Edit Address</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      {selectedContact?.secondaryEmail && (
                        <View style={styles.contactDetailItem}>
                          <View style={styles.contactDetailIcon}>
                            <Mail size={20} color="#8E8E93" />
                          </View>
                          <View style={styles.contactDetailContent}>
                            <Text style={styles.contactDetailLabel}>Secondary Email</Text>
                            <TouchableOpacity style={styles.contactDetailValue}>
                              <Text style={styles.contactDetailText}>{selectedContact.secondaryEmail}</Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity 
                            style={styles.contactActionButton}
                            onPress={() => handleContactAction('email', selectedContact?.secondaryEmail)}
                          >
                            <MoreHorizontal size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      {selectedContact?.secondaryPhone && (
                        <View style={styles.contactDetailItem}>
                          <View style={styles.contactDetailIcon}>
                            <Phone size={20} color="#8E8E93" />
                          </View>
                          <View style={styles.contactDetailContent}>
                            <Text style={styles.contactDetailLabel}>Secondary Phone</Text>
                            <TouchableOpacity style={styles.contactDetailValue}>
                              <Text style={styles.contactDetailText}>{selectedContact.secondaryPhone}</Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity 
                            style={styles.contactActionButton}
                            onPress={() => handleContactAction('phone', selectedContact?.secondaryPhone)}
                          >
                            <MoreHorizontal size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    
                    {/* Divider */}
                    <View style={styles.contactDivider} />
                    
                    {/* Additional Information Section */}
                    <View style={styles.additionalInfoSection}>
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <User size={18} color="#8E8E93" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Contact ID</Text>
                          <Text style={styles.additionalInfoValue}>C001</Text>
                        </View>
                      </View>
                      
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <Tag size={18} color="#8E8E93" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Tag</Text>
                          <Text style={styles.additionalInfoValue}>Customer</Text>
                        </View>
                      </View>
                      
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <TrendingUp size={18} color="#8E8E93" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Original Lead Source</Text>
                          <Text style={styles.additionalInfoValue}>Website</Text>
                        </View>
                      </View>
                      
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <CheckSquare size={18} color="#34C759" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Status</Text>
                          <Text style={[styles.additionalInfoValue, { color: '#34C759' }]}>Active</Text>
                        </View>
                      </View>
                      
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <Clock size={18} color="#8E8E93" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Created</Text>
                          <Text style={styles.additionalInfoValue}>
                            {selectedContact?.createdAt ? 
                              new Date(selectedContact.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'January 14, 2024 at 10:30 AM'
                            }
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.additionalInfoItem}>
                        <View style={styles.additionalInfoIcon}>
                          <User size={18} color="#8E8E93" />
                        </View>
                        <View style={styles.additionalInfoContent}>
                          <Text style={styles.additionalInfoLabel}>Created By</Text>
                          <Text style={styles.additionalInfoValue}>{selectedContact?.createdBy || 'User'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  {/* Custom Fields Section */}
                  {selectedContact?.customFields && selectedContact.customFields.length > 0 && (
                    <View style={styles.customFieldsSection}>
                      <Text style={styles.sectionTitle}>Custom Fields</Text>
                      <View style={styles.customFieldsCard}>
                        {selectedContact.customFields.map((field: any) => (
                          <View key={field.id} style={styles.customFieldItem}>
                            <Text style={styles.customFieldLabel}>{field.label}</Text>
                            <Text style={styles.customFieldValue}>{field.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {/* Related Business Section */}
                  <View style={styles.businessSection}>
                    <View style={styles.businessHeader}>
                      <Text style={styles.sectionTitle}>Related Businesses</Text>
                      <TouchableOpacity style={styles.addBusinessButton}>
                        <Plus size={16} color="#007AFF" />
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
                  
                </View>
              )}

              {activeTab === 'Addresses' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Job Addresses</Text>
                  
                  {selectedContact?.addresses && selectedContact.addresses.length > 0 ? (
                    <View style={styles.addressesList}>
                      {selectedContact.addresses.map((address: any, index: number) => (
                        <View key={address.id} style={styles.addressCard}>
                          <View style={styles.addressHeader}>
                            <View style={styles.addressInfo}>
                              <Text style={styles.addressType}>{address.type}</Text>
                              {address.isPrimary && (
                                <View style={styles.primaryBadge}>
                                  <Text style={styles.primaryBadgeText}>Primary</Text>
                                </View>
                              )}
                            </View>
                            <TouchableOpacity style={styles.addressActions}>
                              <MoreHorizontal size={20} color="#8E8E93" />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.addressText}>{address.address}</Text>
                          <View style={styles.addressActions}>
                            <TouchableOpacity style={styles.addressActionButton}>
                              <MapPin size={16} color="#007AFF" />
                              <Text style={styles.addressActionText}>Navigate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addressActionButton}>
                              <Edit size={16} color="#8E8E93" />
                              <Text style={styles.addressActionText}>Edit</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <MapPin size={48} color="#D1D5DB" />
                      <Text style={styles.emptyStateText}>No addresses found</Text>
                      <Text style={styles.emptyStateSubtext}>Add a job address to get started</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.addAddressButton}>
                    <Plus size={20} color="#007AFF" />
                    <Text style={styles.addAddressText}>Add Job Address</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === 'Deals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Deals</Text>
                  
                  {/* Example Deal Card - Condensed Style */}
                  <View style={styles.condensedDealCard}>
                    <TouchableOpacity 
                      style={styles.condensedDealContent}
                      onPress={() => handleExpandDeal(1)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.condensedDealHeader}>
                        <View style={styles.condensedDealTitleRow}>
                          <Text style={styles.condensedDealTitle}>Bathroom Renovation Inquiry</Text>
                          <View style={styles.condensedDealStageBadge}>
                            <Text style={styles.condensedDealStageText}>Proposal Sent</Text>
                          </View>
                        </View>
                        <View style={styles.condensedDealContactRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.condensedDealContact}>Mike Stewart</Text>
                        </View>
                      </View>
                      
                      <View style={styles.condensedDealMeta}>
                        <View style={styles.condensedDealMetaItem}>
                          <Clock size={12} color="#6B7280" />
                          <Text style={styles.condensedDealMetaText}>2 days</Text>
                        </View>
                        <View style={styles.condensedDealMetaItem}>
                          <Tag size={12} color="#6B7280" />
                          <Text style={styles.condensedDealMetaText}>Website Form</Text>
                        </View>
                        <View style={styles.condensedDealMetaItem}>
                          <DollarSign size={12} color="#10B981" />
                          <Text style={[styles.condensedDealMetaText, { color: '#10B981', fontWeight: '600' }]}>
                            $45,000
                          </Text>
                        </View>
                        <View style={styles.condensedDealDripIndicator}>
                          <TrendingUp size={14} color="#10B981" />
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.condensedDealExpandIndicator}>
                      <ChevronRight 
                        size={16} 
                        color="#6B7280" 
                        style={{ 
                          transform: [{ rotate: expandedDeal === 1 ? '90deg' : '0deg' }] 
                        }} 
                      />
                    </View>
                  </View>

                  {/* Expanded Deal Content */}
                  {expandedDeal === 1 && (
                    <View style={styles.expandedDealContent}>
                      {/* Quick Actions */}
                      <View style={styles.dealQuickActionsSection}>
                        <Text style={styles.dealQuickActionsTitle}>Quick Actions</Text>
                        <View style={styles.dealQuickActions}>
                          <TouchableOpacity style={[styles.dealQuickActionButton, styles.dealCallButton]}>
                            <Phone size={18} color="#FFFFFF" />
                            <Text style={styles.dealQuickActionText}>Call</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.dealQuickActionButton, styles.dealTextButton]}>
                            <MessageSquare size={18} color="#FFFFFF" />
                            <Text style={styles.dealQuickActionText}>Text</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.dealQuickActionButton, styles.dealEmailButton]}>
                            <Mail size={18} color="#FFFFFF" />
                            <Text style={styles.dealQuickActionText}>Email</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Deal Details */}
                      <View style={styles.dealDetailsSection}>
                        <View style={styles.dealDetailRow}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.dealDetailLabel}>In Stage:</Text>
                          <Text style={styles.dealDetailValue}>2 days</Text>
                        </View>
                        <View style={styles.dealDetailRow}>
                          <Tag size={14} color="#6B7280" />
                          <Text style={styles.dealDetailLabel}>Source:</Text>
                          <Text style={styles.dealDetailValue}>Website Form</Text>
                        </View>
                        <View style={styles.dealDetailRow}>
                          <User size={14} color="#6B7280" />
                          <Text style={styles.dealDetailLabel}>Assigned:</Text>
                          <Text style={styles.dealDetailValue}>Tanner Mullen</Text>
                        </View>
                        <View style={styles.dealDetailRow}>
                          <Target size={14} color="#6B7280" />
                          <Text style={styles.dealDetailLabel}>Last Activity:</Text>
                          <Text style={styles.dealDetailValue}>Email sent 2 hours ago</Text>
                        </View>
                        <View style={styles.dealDetailRow}>
                          <TrendingUp size={14} color="#10B981" />
                          <Text style={styles.dealDetailLabel}>Drip Campaign:</Text>
                          <View style={styles.dealDripStatusBadge}>
                            <TrendingUp size={12} color="#10B981" />
                            <Text style={styles.dealDripStatusText}>5 remaining</Text>
                          </View>
                        </View>
                      </View>

                      {/* Labels */}
                      <View style={styles.dealLabelsSection}>
                        <View style={styles.dealLabels}>
                          <View style={[styles.dealLabel, { backgroundColor: '#EF4444' }]}>
                            <Text style={[styles.dealLabelText, { color: '#FFFFFF' }]}>Hot Lead</Text>
                          </View>
                          <View style={[styles.dealLabel, { backgroundColor: '#EF4444' }]}>
                            <Text style={[styles.dealLabelText, { color: '#FFFFFF' }]}>Urgent</Text>
                          </View>
                          <TouchableOpacity style={styles.addDealLabelButton}>
                            <Plus size={12} color="#6B7280" />
                            <Text style={styles.addDealLabelText}>Add Label</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Other Actions */}
                      <View style={styles.dealOtherActions}>
                        <TouchableOpacity style={styles.dealOtherActionButton}>
                          <Calendar size={16} color="#6366F1" />
                          <Text style={styles.dealOtherActionText}>Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dealOtherActionButton, styles.dealCommandCenterButton]}>
                          <TrendingUp size={16} color="#FFFFFF" />
                          <Text style={[styles.dealOtherActionText, { color: '#FFFFFF' }]}>Command Center</Text>
                        </TouchableOpacity>
                  </View>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.addDealButton}>
                    <Plus size={20} color="#007AFF" />
                    <Text style={styles.addDealText}>Add New Deal</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === 'Proposals' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Proposals</Text>
                  
                  {/* Example Proposal Cards */}
                  <View style={styles.proposalCard}>
                    <View style={styles.proposalHeader}>
                      <View style={styles.proposalTitleSection}>
                        <Text style={styles.proposalTitle}>Kitchen Renovation Proposal</Text>
                        <View style={[styles.proposalStatusBadge, { backgroundColor: '#10B981' }]}>
                          <Text style={styles.proposalStatusText}>Active</Text>
                  </View>
                      </View>
                      <View style={styles.proposalAmount}>
                        <Text style={styles.proposalAmountText}>$45,000</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalDetails}>
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <FileText size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Deal ID:</Text>
                        <Text style={styles.proposalDetailValue}>#DEAL-001</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Salesperson:</Text>
                        <Text style={styles.proposalDetailValue}>Tanner Mullen</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <Calendar size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Sent:</Text>
                        <Text style={styles.proposalDetailValue}>Jan 15, 2024</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalActions}>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <FileText size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>View Proposal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <Edit size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.proposalCard}>
                    <View style={styles.proposalHeader}>
                      <View style={styles.proposalTitleSection}>
                        <Text style={styles.proposalTitle}>Bathroom Remodel Proposal</Text>
                        <View style={[styles.proposalStatusBadge, { backgroundColor: '#F59E0B' }]}>
                          <Text style={styles.proposalStatusText}>Pending</Text>
                        </View>
                      </View>
                      <View style={styles.proposalAmount}>
                        <Text style={styles.proposalAmountText}>$28,500</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalDetails}>
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <FileText size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Deal ID:</Text>
                        <Text style={styles.proposalDetailValue}>#DEAL-002</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Salesperson:</Text>
                        <Text style={styles.proposalDetailValue}>Sarah Johnson</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <Calendar size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Sent:</Text>
                        <Text style={styles.proposalDetailValue}>Jan 20, 2024</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalActions}>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <FileText size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>View Proposal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <Edit size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.proposalCard}>
                    <View style={styles.proposalHeader}>
                      <View style={styles.proposalTitleSection}>
                        <Text style={styles.proposalTitle}>Office Renovation Proposal</Text>
                        <View style={[styles.proposalStatusBadge, { backgroundColor: '#EF4444' }]}>
                          <Text style={styles.proposalStatusText}>Expired</Text>
                        </View>
                      </View>
                      <View style={styles.proposalAmount}>
                        <Text style={styles.proposalAmountText}>$75,000</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalDetails}>
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <FileText size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Deal ID:</Text>
                        <Text style={styles.proposalDetailValue}>#DEAL-003</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Salesperson:</Text>
                        <Text style={styles.proposalDetailValue}>Mike Chen</Text>
                      </View>
                      
                      <View style={styles.proposalDetailRow}>
                        <View style={styles.proposalDetailIcon}>
                          <Calendar size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.proposalDetailLabel}>Sent:</Text>
                        <Text style={styles.proposalDetailValue}>Dec 10, 2023</Text>
                      </View>
                    </View>
                    
                    <View style={styles.proposalActions}>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <FileText size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>View Proposal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.proposalActionButton}>
                        <Edit size={16} color="#6366F1" />
                        <Text style={styles.proposalActionText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.addProposalButton}>
                    <Plus size={20} color="#007AFF" />
                    <Text style={styles.addProposalText}>Add New Proposal</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === 'Appointments' && (
                <View style={styles.tabSection}>
                  <Text style={styles.sectionTitle}>Appointments</Text>
                  
                  {/* Example Appointment Cards */}
                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentTitleSection}>
                        <Text style={styles.appointmentTitle}>Kitchen Renovation Consultation</Text>
                        <View style={[styles.appointmentStatusBadge, { backgroundColor: '#3B82F6' }]}>
                          <Text style={styles.appointmentStatusText}>Scheduled</Text>
                  </View>
                      </View>
                      <View style={styles.appointmentDateTime}>
                        <Text style={styles.appointmentDate}>Jan 25, 2024</Text>
                        <Text style={styles.appointmentTime}>10:00 AM - 11:30 AM</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <MapPin size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Address:</Text>
                        <Text style={styles.appointmentDetailValue}>123 Main St, Orlando FL 32801</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Assigned:</Text>
                        <Text style={styles.appointmentDetailValue}>Tanner Mullen</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Co-host:</Text>
                        <Text style={styles.appointmentDetailValue}>Sarah Johnson</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentActions}>
                      <TouchableOpacity 
                        style={styles.appointmentViewButton}
                        onPress={() => handleViewAppointmentDetails({
                          id: 1,
                          customer: 'Mike Stewart',
                          type: 'consultation',
                          address: '123 Main St, Orlando FL 32801',
                          phone: '(555) 123-4567',
                          status: 'scheduled',
                          assignee: 'Tanner Mullen',
                          time: '10:00 AM',
                          appointmentNotes: 'Customer mentioned they have a budget of $50,000 and prefer modern design.',
                          adminNotes: 'Customer seems very interested and ready to move forward.'
                        })}
                      >
                        <Calendar size={16} color="#6366F1" />
                        <Text style={styles.appointmentViewText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentTitleSection}>
                        <Text style={styles.appointmentTitle}>Bathroom Remodel Estimate</Text>
                        <View style={[styles.appointmentStatusBadge, { backgroundColor: '#10B981' }]}>
                          <Text style={styles.appointmentStatusText}>Complete</Text>
                        </View>
                      </View>
                      <View style={styles.appointmentDateTime}>
                        <Text style={styles.appointmentDate}>Jan 20, 2024</Text>
                        <Text style={styles.appointmentTime}>2:00 PM - 3:00 PM</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <MapPin size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Address:</Text>
                        <Text style={styles.appointmentDetailValue}>456 Oak Ave, Tampa FL 33602</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Assigned:</Text>
                        <Text style={styles.appointmentDetailValue}>Mike Chen</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Co-host:</Text>
                        <Text style={styles.appointmentDetailValue}>Emily Rodriguez</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentActions}>
                      <TouchableOpacity 
                        style={styles.appointmentViewButton}
                        onPress={() => handleViewAppointmentDetails({
                          id: 2,
                          customer: 'Jennifer Davis',
                          type: 'estimate',
                          address: '456 Oak Ave, Tampa FL 33602',
                          phone: '(555) 987-6543',
                          status: 'completed',
                          assignee: 'Mike Chen',
                          time: '2:00 PM',
                          appointmentNotes: 'Customer wants a walk-in shower and double vanity. Budget is flexible.',
                          adminNotes: 'Customer is very responsive and has been planning this remodel for months.'
                        })}
                      >
                        <Calendar size={16} color="#6366F1" />
                        <Text style={styles.appointmentViewText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <View style={styles.appointmentTitleSection}>
                        <Text style={styles.appointmentTitle}>Office Renovation Site Visit</Text>
                        <View style={[styles.appointmentStatusBadge, { backgroundColor: '#EF4444' }]}>
                          <Text style={styles.appointmentStatusText}>Cancelled</Text>
                        </View>
                      </View>
                      <View style={styles.appointmentDateTime}>
                        <Text style={styles.appointmentDate}>Jan 18, 2024</Text>
                        <Text style={styles.appointmentTime}>9:00 AM - 10:00 AM</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <MapPin size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Address:</Text>
                        <Text style={styles.appointmentDetailValue}>789 Business Blvd, Miami FL 33101</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Assigned:</Text>
                        <Text style={styles.appointmentDetailValue}>David Kim</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailRow}>
                        <View style={styles.appointmentDetailIcon}>
                          <User size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.appointmentDetailLabel}>Co-host:</Text>
                        <Text style={styles.appointmentDetailValue}>Lisa Thompson</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentActions}>
                      <TouchableOpacity 
                        style={styles.appointmentViewButton}
                        onPress={() => handleViewAppointmentDetails({
                          id: 3,
                          customer: 'Robert Chang',
                          type: 'site-visit',
                          address: '789 Business Blvd, Miami FL 33101',
                          phone: '(555) 456-7890',
                          status: 'cancelled',
                          assignee: 'David Kim',
                          time: '9:00 AM',
                          appointmentNotes: 'Client needs to reschedule for next week.',
                          adminNotes: 'Follow up with client to reschedule.'
                        })}
                      >
                        <Calendar size={16} color="#6366F1" />
                        <Text style={styles.appointmentViewText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.addAppointmentButton}>
                    <Plus size={20} color="#007AFF" />
                    <Text style={styles.addAppointmentText}>Add New Appointment</Text>
                  </TouchableOpacity>
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

          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Contact Modal */}
      {showEditModal && (
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="fullScreen"
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
            <Text style={styles.modalTitle}>Edit Contact</Text>
            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveContact}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.editForm}>
              <Text style={styles.formSectionTitle}>Basic Information</Text>
              
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name *</Text>
                  <TextInput 
                    style={[styles.formInput, formErrors.name && styles.formInputError]}
                    value={editFormData.name}
                    onChangeText={(text) => setEditFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
                </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Title</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.title}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, title: text }))}
                  placeholder="Enter job title"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Company</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.company}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, company: text }))}
                  placeholder="Enter company name"
                />
              </View>

              <Text style={styles.formSectionTitle}>Contact Information</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Primary Email</Text>
                <TextInput 
                  style={[styles.formInput, formErrors.email && styles.formInputError]}
                  value={editFormData.email}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
                {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Primary Phone</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.phone}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Secondary Email</Text>
                <TextInput 
                  style={[styles.formInput, formErrors.secondaryEmail && styles.formInputError]}
                  value={editFormData.secondaryEmail}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, secondaryEmail: text }))}
                  placeholder="Enter secondary email"
                  keyboardType="email-address"
                />
                {formErrors.secondaryEmail && <Text style={styles.errorText}>{formErrors.secondaryEmail}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Secondary Phone</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.secondaryPhone}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, secondaryPhone: text }))}
                  placeholder="Enter secondary phone"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Primary Address</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.address}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, address: text }))}
                  placeholder="Enter primary address"
                  multiline
                  numberOfLines={2}
                />
              </View>

              <Text style={styles.formSectionTitle}>Additional Information</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Contact Tag</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.contactTag}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, contactTag: text }))}
                  placeholder="Enter contact tag"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Original Lead Source</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.originalLeadSource}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, originalLeadSource: text }))}
                  placeholder="Enter lead source"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.status}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, status: text }))}
                  placeholder="Enter status"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Created By</Text>
                <TextInput 
                  style={styles.formInput}
                  value={editFormData.createdBy}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, createdBy: text }))}
                  placeholder="User or API"
                />
              </View>

              <Text style={styles.formSectionTitle}>Custom Fields</Text>
              
              {editFormData.customFields.map((field, index) => (
                <View key={field.id} style={styles.customFieldRow}>
                  <View style={styles.customFieldInputs}>
                    <TextInput 
                      style={[styles.formInput, styles.customFieldLabelInput]}
                      value={field.label}
                      onChangeText={(text) => updateCustomField(field.id, 'label', text)}
                      placeholder="Field name"
                    />
                    <TextInput 
                      style={[styles.formInput, styles.customFieldValueInput]}
                      value={field.value}
                      onChangeText={(text) => updateCustomField(field.id, 'value', text)}
                      placeholder="Field value"
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.removeCustomFieldButton}
                    onPress={() => removeCustomField(field.id)}
                  >
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.addCustomFieldButton}
                onPress={addCustomField}
              >
                <Plus size={16} color="#007AFF" />
                <Text style={styles.addCustomFieldText}>Add Custom Field</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      )}

      {/* Meeting Details Modal */}
      <Modal
        visible={showMeetingDetails}
        transparent
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMeetingDetails(false)}
      >
        <SafeAreaView style={styles.meetingModalContainer}>
          <View style={styles.meetingModalHeader}>
            <TouchableOpacity 
              style={styles.meetingCloseButton}
              onPress={() => setShowMeetingDetails(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.meetingModalTitle}>Appointment Details</Text>
            <View style={styles.meetingStatusBadge}>
              <Text style={styles.meetingStatusText}>
                {selectedMeeting?.status === 'scheduled' ? 'Scheduled' :
                 selectedMeeting?.status === 'completed' ? 'Completed' :
                 selectedMeeting?.status === 'cancelled' ? 'Cancelled' :
                 selectedMeeting?.status === 'no-show' ? 'No Show' : 'Scheduled'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.meetingModalContent} showsVerticalScrollIndicator={false}>
            {selectedMeeting && (
              <>
                {/* Location Section */}
                <View style={styles.meetingLocationSection}>
                  <View style={styles.meetingLocationHeader}>
                    <MapPin size={20} color="#EF4444" />
                    <Text style={styles.meetingLocationLabel}>Location</Text>
                  </View>
                  <Text style={styles.meetingAddress}>{selectedMeeting.address}</Text>
                  <View style={styles.meetingAddressActions}>
                    <TouchableOpacity style={styles.meetingNavigateButton}>
                      <Navigation size={16} color="#FFFFFF" />
                      <Text style={styles.meetingNavigateText}>Navigate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.meetingCopyButton}>
                      <Copy size={16} color="#6B7280" />
                      <Text style={styles.meetingCopyText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* View Deal Button */}
                <TouchableOpacity style={styles.meetingViewDealButton}>
                  <Text style={styles.meetingViewDealText}>View Deal</Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.meetingActionButtons}>
                  <TouchableOpacity style={styles.meetingCallButton}>
                    <Phone size={20} color="#FFFFFF" />
                    <Text style={styles.meetingActionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.meetingTextButton}>
                    <MessageSquare size={20} color="#FFFFFF" />
                    <Text style={styles.meetingActionText}>Text</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.meetingEmailButton}>
                    <Mail size={20} color="#FFFFFF" />
                    <Text style={styles.meetingActionText}>Email</Text>
                  </TouchableOpacity>
                </View>

                {/* Appointment Information Card */}
                <View style={styles.meetingInfoCard}>
                  <View style={styles.meetingInfoHeader}>
                    <Calendar size={20} color="#6366F1" />
                    <Text style={styles.meetingInfoTitle}>Appointment Details</Text>
                  </View>
                  
                  <View style={styles.meetingInfoGrid}>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Customer</Text>
                      <TouchableOpacity style={styles.meetingCustomerRow}>
                        <Text style={styles.meetingCustomerText}>{selectedMeeting.name}</Text>
                        <User size={16} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Type</Text>
                      <Text style={styles.meetingInfoValue}>{selectedMeeting.type}</Text>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Date</Text>
                      <Text style={styles.meetingInfoValue}>September 3, 2025</Text>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Start Time</Text>
                      <Text style={styles.meetingInfoValue}>9:00AM</Text>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>End Time</Text>
                      <Text style={styles.meetingInfoValue}>10:00AM</Text>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Assignee</Text>
                      <Text style={styles.meetingInfoValue}>{selectedMeeting.assignee}</Text>
                    </View>
                    <View style={styles.meetingInfoItem}>
                      <Text style={styles.meetingInfoLabel}>Phone</Text>
                      <Text style={styles.meetingInfoValue}>{selectedMeeting.phone}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.meetingBottomSpacing} />
              </>
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
  clickableValue: {
    flex: 1,
  },
  clickableText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  // Unified Contact Card Styles
  unifiedContactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactDetailsSection: {
    padding: 16,
  },
  contactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  contactDetailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactDetailContent: {
    flex: 1,
  },
  contactDetailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactDetailValue: {
    flex: 1,
  },
  contactDetailText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  contactActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 16,
  },
  additionalInfoSection: {
    padding: 16,
  },
  additionalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  additionalInfoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  additionalInfoContent: {
    flex: 1,
  },
  additionalInfoLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  additionalInfoValue: {
    fontSize: 15,
    color: '#1D1D1F',
    fontWeight: '400',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Addresses Tab Styles
  addressesList: {
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  primaryBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addressText: {
    fontSize: 15,
    color: '#1D1D1F',
    marginBottom: 12,
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addressActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressActionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    alignSelf: 'center',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Edit Modal Styles
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editForm: {
    padding: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginTop: 24,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  // Custom Fields Styles
  customFieldsSection: {
    marginBottom: 24,
  },
  customFieldsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customFieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  customFieldLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    flex: 1,
  },
  customFieldValue: {
    fontSize: 14,
    color: '#1D1D1F',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  // Inline Action Menu Styles
  inlineActionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inlineActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 12,
    borderRadius: 8,
  },
  inlineActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  // Tabs
  tabsContainer: {
    marginBottom: 24,
    marginTop: 0,
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
  // Form Validation Styles
  formInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  customFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  customFieldInputs: {
    flex: 1,
    gap: 8,
  },
  customFieldLabelInput: {
    flex: 1,
  },
  customFieldValueInput: {
    flex: 1,
  },
  removeCustomFieldButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addCustomFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addCustomFieldText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  // Condensed Deal Card Styles
  condensedDealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  condensedDealContent: {
    flex: 1,
    marginRight: 12,
  },
  condensedDealHeader: {
    marginBottom: 8,
  },
  condensedDealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  condensedDealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  condensedDealStageBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  condensedDealStageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  condensedDealContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  condensedDealContact: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  condensedDealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  condensedDealMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  condensedDealMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  condensedDealDripIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  condensedDealExpandIndicator: {
    padding: 4,
  },
  // Expanded Deal Content Styles
  expandedDealContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dealQuickActionsSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dealQuickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dealQuickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dealQuickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  dealCallButton: {
    backgroundColor: '#10B981', // Green for call
  },
  dealTextButton: {
    backgroundColor: '#3B82F6', // Blue for text
  },
  dealEmailButton: {
    backgroundColor: '#8B5CF6', // Purple for email
  },
  dealQuickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dealDetailsSection: {
    marginBottom: 16,
  },
  dealDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dealDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  dealDetailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  dealDripStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dealDripStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  dealLabelsSection: {
    marginBottom: 16,
  },
  dealLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dealLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealLabelText: {
    fontSize: 11,
    fontWeight: '500',
  },
  addDealLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addDealLabelText: {
    fontSize: 11,
    color: '#6B7280',
  },
  dealOtherActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dealOtherActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  dealOtherActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  dealCommandCenterButton: {
    backgroundColor: '#6366F1',
  },
  addDealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  addDealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Proposal Card Styles
  proposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  proposalTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  proposalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  proposalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  proposalStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  proposalAmount: {
    alignItems: 'flex-end',
  },
  proposalAmountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  proposalDetails: {
    marginBottom: 16,
  },
  proposalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  proposalDetailIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposalDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 100,
  },
  proposalDetailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  proposalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  proposalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  addProposalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  addProposalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Appointment Card Styles
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appointmentTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  appointmentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  appointmentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appointmentDateTime: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  appointmentDetailIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 80,
  },
  appointmentDetailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  appointmentActions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  appointmentViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  appointmentViewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  addAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  addAppointmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Meeting Details Modal Styles
  meetingModalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  meetingModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  meetingCloseButton: {
    padding: 4,
  },
  meetingModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  meetingStatusBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  meetingStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  meetingModalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Location Section
  meetingLocationSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  meetingLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  meetingLocationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  meetingAddress: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  meetingAddressActions: {
    flexDirection: 'row',
    gap: 12,
  },
  meetingNavigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  meetingNavigateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  meetingCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  meetingCopyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  // View Deal Button
  meetingViewDealButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  meetingViewDealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Action Buttons
  meetingActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  meetingCallButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  meetingTextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  meetingEmailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  meetingActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Info Card
  meetingInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  meetingInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  meetingInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  meetingInfoGrid: {
    gap: 12,
  },
  meetingInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetingInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  meetingInfoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  meetingCustomerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  meetingCustomerText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  meetingBottomSpacing: {
    height: 40,
  },
});