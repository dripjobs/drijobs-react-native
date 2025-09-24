import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { X, Check, Calendar, Clock, MapPin, ChevronRight, User as UserIcon, Building, Search } from 'lucide-react-native';

interface NewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewAppointmentModal({ visible, onClose }: NewAppointmentModalProps) {
  const [appointmentStep, setAppointmentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState({
    customerType: '', // 'individual' or 'business'
    customerStatus: '', // 'new' or 'existing'
    eventType: '',
    user: '',
    startDate: '09/19/2025',
    startTime: '09:00 AM',
    duration: '1 hour',
    appointmentAddress: '',
    billingAddress: '',
    notes: '',
    reminders: true,
    reminderType: 'both',
    // Individual customer fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Business customer fields
    businessName: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactTitle: ''
  });

  // Sample data for existing customers and businesses
  const existingCustomers = [
    { id: 1, name: 'Jane Doe', email: 'jane@email.com', phone: '(555) 123-4567' },
    { id: 2, name: 'Bob Johnson', email: 'bob@email.com', phone: '(555) 987-6543' },
    { id: 3, name: 'Sarah Wilson', email: 'sarah@email.com', phone: '(555) 456-7890' },
    { id: 4, name: 'Mike Davis', email: 'mike@email.com', phone: '(555) 321-0987' },
  ];

  const existingBusinesses = [
    { id: 1, name: 'ABC Construction', email: 'contact@abcconstruction.com', phone: '(555) 111-2222' },
    { id: 2, name: 'XYZ Builders', email: 'info@xyzbuilders.com', phone: '(555) 333-4444' },
    { id: 3, name: 'TechCorp Solutions', email: 'hello@techcorp.com', phone: '(555) 555-6666' },
  ];

  const getCustomerName = () => {
    if (appointmentData.customerStatus === 'existing' && selectedCustomer) {
      return selectedCustomer.name;
    } else if (appointmentData.customerStatus === 'new') {
      if (appointmentData.customerType === 'individual') {
        const firstName = appointmentData.firstName || '';
        const lastName = appointmentData.lastName || '';
        return firstName && lastName ? `${firstName} ${lastName}` : '';
      } else if (appointmentData.customerType === 'business') {
        return appointmentData.businessName || '';
      }
    }
    return '';
  };

  const canProceedToNext = () => {
    switch (appointmentStep) {
      case 1:
        return appointmentData.customerType && appointmentData.customerStatus;
      case 2:
        if (appointmentData.customerStatus === 'existing') {
          return selectedCustomer !== null;
        }
        return true; // For new customers, we'll validate required fields later
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && appointmentStep < 7) {
      setAppointmentStep(appointmentStep + 1);
    }
  };

  const handleBack = () => {
    if (appointmentStep > 1) {
      setAppointmentStep(appointmentStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setAppointmentStep(1);
    setSearchQuery('');
    setSelectedCustomer(null);
    setAppointmentData({
      customerType: '',
      customerStatus: '',
      eventType: '',
      user: '',
      startDate: '09/19/2025',
      startTime: '09:00 AM',
      duration: '1 hour',
      appointmentAddress: '',
      billingAddress: '',
      notes: '',
      reminders: true,
      reminderType: 'both',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      contactFirstName: '',
      contactLastName: '',
      contactEmail: '',
      contactPhone: '',
      contactTitle: ''
    });
  };

  const renderStepContent = () => {
    switch (appointmentStep) {
      case 1:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Select Proposal Type</Text>
            
            {/* Customer Type Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.selectionLabel}>Customer Type</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    appointmentData.customerType === 'individual' && styles.selectionCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, customerType: 'individual'})}
                >
                  <View style={styles.selectionIcon}>
                    <UserIcon size={24} color={appointmentData.customerType === 'individual' ? '#6366F1' : '#6B7280'} />
                  </View>
                  <Text style={[
                    styles.selectionTitle,
                    appointmentData.customerType === 'individual' && styles.selectionTitleSelected
                  ]}>
                    Individual Customer
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Proposal for a person or household
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    appointmentData.customerType === 'business' && styles.selectionCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, customerType: 'business'})}
                >
                  <View style={styles.selectionIcon}>
                    <Building size={24} color={appointmentData.customerType === 'business' ? '#6366F1' : '#6B7280'} />
                  </View>
                  <Text style={[
                    styles.selectionTitle,
                    appointmentData.customerType === 'business' && styles.selectionTitleSelected
                  ]}>
                    Business
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Proposal for a company or organization
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Status Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.selectionLabel}>Customer Status</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    appointmentData.customerStatus === 'existing' && styles.selectionCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, customerStatus: 'existing'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    appointmentData.customerStatus === 'existing' && styles.selectionTitleSelected
                  ]}>
                    Existing
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Already in your database
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    appointmentData.customerStatus === 'new' && styles.selectionCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, customerStatus: 'new'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    appointmentData.customerStatus === 'new' && styles.selectionTitleSelected
                  ]}>
                    New
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Not in your database yet
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* What happens next info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What happens next?</Text>
              <Text style={styles.infoText}>
                You'll enter customer details and create a new contact record in your database. 
                You'll also be able to select from existing addresses and add a job source.
              </Text>
            </View>
          </View>
        );

      case 2:
        // Show different forms based on customer type and status
        if (appointmentData.customerType === 'individual' && appointmentData.customerStatus === 'new') {
          return (
            <View style={styles.appointmentStep}>
              <Text style={styles.stepTitle}>Customer Information</Text>
              <Text style={styles.stepSubtitle}>Enter customer details or select an existing customer from your database</Text>
              
              <View style={styles.formContainer}>
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>First Name *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.firstName || 'Enter first name'}</Text>
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Last Name *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.lastName || 'Enter last name'}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>{appointmentData.email || 'customer@email.com'}</Text>
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Phone</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>{appointmentData.phone || '(555) 123-4567'}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        } else if (appointmentData.customerType === 'business' && appointmentData.customerStatus === 'new') {
          return (
            <View style={styles.appointmentStep}>
              <Text style={styles.stepTitle}>Business Information</Text>
              <Text style={styles.stepSubtitle}>Enter business details or select an existing business from your database</Text>
              
              <View style={styles.formContainer}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Business Name *</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>{appointmentData.businessName || 'Enter business name'}</Text>
                  </View>
                </View>
                
                <Text style={styles.sectionTitle}>Primary Contact</Text>
                <Text style={styles.sectionDescription}>
                  This contact will receive all communications related to this appointment. 
                  Additional contacts can be added later in the business record.
                </Text>
                
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>First Name *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.contactFirstName || 'Enter first name'}</Text>
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Last Name *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.contactLastName || 'Enter last name'}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Email *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.contactEmail || 'contact@email.com'}</Text>
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Phone *</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputText}>{appointmentData.contactPhone || '(555) 123-4567'}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Title (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>{appointmentData.contactTitle || 'e.g., CEO, Manager, Owner'}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        } else {
          // Existing customer - show selection interface
          const isBusiness = appointmentData.customerType === 'business';
          const data = isBusiness ? existingBusinesses : existingCustomers;
          const filteredData = data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <View style={styles.appointmentStep}>
              <Text style={styles.stepTitle}>
                {isBusiness ? 'Business Information' : 'Customer Information'}
              </Text>
              <Text style={styles.stepSubtitle}>
                {isBusiness ? 'Enter business details or select an existing business from your database' : 'Enter customer details or select an existing customer from your database'}
              </Text>
              
              <View style={styles.formContainer}>
                <Text style={styles.fieldLabel}>
                  {isBusiness ? 'Select Business' : 'Select Customer'}
                </Text>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#6B7280" />
                  <Text style={styles.searchPlaceholder}>
                    {isBusiness ? 'Search businesses...' : 'Search contacts...'}
                  </Text>
                </View>
                
                {/* Customer/Business List */}
                <View style={styles.customerList}>
                  {filteredData.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.customerCard,
                        selectedCustomer?.id === item.id && styles.customerCardSelected
                      ]}
                      onPress={() => setSelectedCustomer(item)}
                    >
                      <Text style={[
                        styles.customerName,
                        selectedCustomer?.id === item.id && styles.customerNameSelected
                      ]}>
                        {item.name}
                      </Text>
                      <View style={styles.customerDetails}>
                        <Text style={styles.customerDetail}>{item.email}</Text>
                        <Text style={styles.customerDetailSeparator}>•</Text>
                        <Text style={styles.customerDetail}>{item.phone}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          );
        }

      case 3:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Event Details & Scheduling</Text>
            <Text style={styles.fieldLabel}>Event Type *</Text>
            
            <View style={styles.eventTypeContainer}>
              {[
                {
                  type: 'Estimate',
                  description: 'On-site visit to assess project requirements and provide estimate',
                  duration: '60 minutes',
                  location: 'On-Site at Location',
                  createsDeal: true
                },
                {
                  type: 'Consultation',
                  description: 'Meeting to discuss project details or provide advice',
                  duration: '30 minutes',
                  location: 'On-Site at Location',
                  createsDeal: false
                },
                {
                  type: 'Service Call',
                  description: 'Service call or maintenance visit',
                  duration: '90 minutes',
                  location: 'On-Site at Location',
                  createsDeal: false
                },
                {
                  type: 'Follow-up Meeting',
                  description: 'Follow-up meeting after previous interaction',
                  duration: '45 minutes',
                  location: 'On-Site at Location',
                  createsDeal: false
                },
                {
                  type: 'Project Review',
                  description: 'Meeting to discuss project details or provide advice',
                  duration: '45 minutes',
                  location: 'On-Site at Location',
                  createsDeal: false
                }
              ].map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.eventTypeCard,
                    appointmentData.eventType === event.type && styles.eventTypeCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, eventType: event.type})}
                >
                  <View style={styles.eventTypeContent}>
                    <Text style={styles.eventTypeTitle}>{event.type}</Text>
                    <Text style={styles.eventTypeDescription}>{event.description}</Text>
                    <View style={styles.eventTypeDetails}>
                      <View style={styles.eventTypeDetail}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.eventTypeDetailText}>{event.duration}</Text>
                      </View>
                      <View style={styles.eventTypeDetail}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.eventTypeDetailText}>{event.location}</Text>
                      </View>
                    </View>
                  </View>
                  {event.createsDeal && (
                    <View style={styles.createsDealBadge}>
                      <Text style={styles.createsDealText}>Creates Deal</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>User *</Text>
            <Text style={styles.stepSubtitle}>Select the user who will be assigned to this appointment</Text>
            
            <View style={styles.userContainer}>
              {[
                { name: 'John Smith', email: 'john@company.com', isYou: true },
                { name: 'Sarah Wilson', email: 'sarah@company.com', isYou: false },
                { name: 'Mike Davis', email: 'mike@company.com', isYou: false }
              ].map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.userCard,
                    appointmentData.user === user.name && styles.userCardSelected
                  ]}
                  onPress={() => setAppointmentData({...appointmentData, user: user.name})}
                >
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  {user.isYou && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Schedule Details</Text>
            <Text style={styles.stepSubtitle}>Set the date, time, and duration for your appointment</Text>
            
            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Start Date *</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>{appointmentData.startDate}</Text>
                  <Calendar size={20} color="#6B7280" />
                </View>
              </View>
              
              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Start Time *</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>{appointmentData.startTime}</Text>
                  <Clock size={20} color="#6B7280" />
                </View>
              </View>
              
              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Duration</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>{appointmentData.duration}</Text>
                  <ChevronRight size={20} color="#6B7280" />
                </View>
              </View>
              
              <Text style={styles.durationNote}>Event will end at 10:00 AM</Text>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Appointment Notes</Text>
            <Text style={styles.stepSubtitle}>Add any additional details or special instructions for this appointment</Text>
            
            <View style={styles.notesContainer}>
              <View style={styles.textAreaContainer}>
                <Text style={styles.textAreaPlaceholder}>
                  Enter any notes, special requirements, or additional information for this appointment...
                </Text>
              </View>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Reminders & Notes</Text>
            
            <View style={styles.remindersContainer}>
              <View style={styles.reminderToggle}>
                <Text style={styles.reminderLabel}>Enable Reminders</Text>
                <View style={[styles.toggle, appointmentData.reminders && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, appointmentData.reminders && styles.toggleThumbActive]} />
                </View>
              </View>
              
              {appointmentData.reminders && (
                <View style={styles.reminderTypeContainer}>
                  <Text style={styles.fieldLabel}>Reminder Type</Text>
                  {['Email only', 'SMS only', 'Both email and SMS'].map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.reminderOption}
                      onPress={() => setAppointmentData({...appointmentData, reminderType: type.toLowerCase().replace(' ', '')})}
                    >
                      <View style={[
                        styles.radioButton,
                        appointmentData.reminderType === type.toLowerCase().replace(' ', '') && styles.radioButtonSelected
                      ]} />
                      <Text style={styles.reminderOptionText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryHeader}>
                  <View style={styles.summaryIcon}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.summaryTitle}>Ready to create appointment!</Text>
                </View>
                <Text style={styles.summaryText}>
                  • Create the appointment in your calendar{'\n'}
                  • Set location to 321 Home St, Residential{'\n'}
                  • Create a deal card in the "Estimate Scheduled" stage{'\n'}
                  • Set up both reminders based on your settings{'\n'}
                  • Send confirmation to the customer
                </Text>
              </View>
            </View>
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
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.appointmentModalContainer}>
        {/* Header */}
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentHeaderLeft}>
            <Text style={styles.appointmentTitle}>New Appointment</Text>
            <Text style={styles.appointmentSubtitle}>
              {appointmentStep === 1 && "Choose whether this proposal is for a business or individual customer, and whether they are new or existing."}
              {appointmentStep === 2 && "Enter customer details or select an existing customer from your database."}
              {appointmentStep === 3 && `Choose the event type, assign a salesperson, and schedule the appointment date and time${getCustomerName() ? ` for ${getCustomerName()}` : ''}.`}
              {appointmentStep === 4 && `Choose the user who will be assigned to this appointment${getCustomerName() ? ` with ${getCustomerName()}` : ''}.`}
              {appointmentStep === 5 && `Choose whether this is an on-site appointment or virtual meeting${getCustomerName() ? ` for ${getCustomerName()}` : ''}.`}
              {appointmentStep === 6 && `Add any additional details or special instructions for this appointment${getCustomerName() ? ` with ${getCustomerName()}` : ''}.`}
              {appointmentStep === 7 && `Set up reminders and review your appointment details${getCustomerName() ? ` for ${getCustomerName()}` : ''}.`}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.appointmentCloseButton}
            onPress={handleClose}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <View key={step} style={styles.progressStep}>
              <View style={[
                styles.progressCircle,
                step < appointmentStep && styles.progressCircleCompleted,
                step === appointmentStep && styles.progressCircleActive
              ]}>
                {step < appointmentStep ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.progressText,
                    step === appointmentStep && styles.progressTextActive
                  ]}>
                    {step}
                  </Text>
                )}
              </View>
              {step < 6 && <View style={styles.progressLine} />}
            </View>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.appointmentContent}>
          {/* Customer Info Banner - Show from step 3 onwards if customer is selected */}
          {appointmentStep >= 3 && getCustomerName() && (
            <View style={styles.customerInfoBanner}>
              <View style={styles.customerInfoContent}>
                <View style={styles.customerInfoIcon}>
                  {appointmentData.customerType === 'individual' ? (
                    <UserIcon size={16} color="#6366F1" />
                  ) : (
                    <Building size={16} color="#6366F1" />
                  )}
                </View>
                <View style={styles.customerInfoText}>
                  <Text style={styles.customerInfoLabel}>
                    {appointmentData.customerType === 'individual' ? 'Customer' : 'Business'}
                  </Text>
                  <Text style={styles.customerInfoName}>{getCustomerName()}</Text>
                </View>
              </View>
            </View>
          )}
          {renderStepContent()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.appointmentFooter}>
          <TouchableOpacity 
            style={[styles.footerButton, appointmentStep === 1 && styles.footerButtonDisabled]}
            onPress={handleBack}
            disabled={appointmentStep === 1}
          >
            <Text style={[styles.footerButtonText, appointmentStep === 1 && styles.footerButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>
          
          <View style={styles.footerRight}>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={handleClose}
            >
              <Text style={styles.footerButtonText}>Cancel</Text>
            </TouchableOpacity>
            
              <TouchableOpacity 
                style={[
                  styles.footerButton, 
                  styles.footerButtonPrimary,
                  appointmentStep === 7 && styles.footerButtonCreate,
                  !canProceedToNext() && styles.footerButtonDisabled
                ]}
                onPress={appointmentStep === 7 ? handleClose : handleNext}
                disabled={!canProceedToNext()}
              >
                <Text style={[
                  styles.footerButtonText, 
                  styles.footerButtonPrimaryText,
                  !canProceedToNext() && styles.footerButtonTextDisabled
                ]}>
                  {appointmentStep === 7 ? 'Create Appointment' : 'Next'}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  appointmentModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appointmentHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  appointmentCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleCompleted: {
    backgroundColor: '#10B981',
  },
  progressCircleActive: {
    backgroundColor: '#6366F1',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  appointmentContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentStep: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  // Event Type Styles
  eventTypeContainer: {
    gap: 12,
  },
  eventTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  eventTypeCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  eventTypeContent: {
    flex: 1,
  },
  eventTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventTypeDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  eventTypeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventTypeDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  createsDealBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  createsDealText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // User Selection Styles
  userContainer: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  youBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  youBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Schedule Styles
  scheduleContainer: {
    gap: 16,
  },
  scheduleField: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  durationNote: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // Notes Styles
  notesContainer: {
    gap: 12,
  },
  textAreaContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
  },
  textAreaPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
  },
  // Reminders Styles
  remindersContainer: {
    gap: 20,
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#6366F1',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  reminderTypeContainer: {
    gap: 12,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioButtonSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  reminderOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  // Summary Styles
  summaryContainer: {
    marginTop: 20,
  },
  summaryBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  summaryText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  // Footer Styles
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonTextDisabled: {
    color: '#9CA3AF',
  },
  footerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButtonPrimary: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  footerButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerButtonCreate: {
    backgroundColor: '#10B981',
  },
  // New Step 1 & 2 Styles
  selectionContainer: {
    marginBottom: 24,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 120,
  },
  selectionCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  selectionIcon: {
    marginBottom: 8,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectionTitleSelected: {
    color: '#6366F1',
  },
  selectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    flex: 1,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  customerList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // Search and Customer Selection Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    marginBottom: 16,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  customerList: {
    gap: 8,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customerCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  customerNameSelected: {
    color: '#1F2937',
  },
  customerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  customerDetailSeparator: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Customer Info Banner Styles
  customerInfoBanner: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  customerInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfoText: {
    flex: 1,
  },
  customerInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  customerInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
