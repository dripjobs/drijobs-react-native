import DateTimePicker from '@react-native-community/datetimepicker';
import { Building, Calendar, Check, ChevronRight, Clock, Lock, MapPin, Search, User as UserIcon, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface NewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (appointmentData?: any) => void;
  initialData?: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerType: 'individual' | 'business';
    companyName?: string;
    eventType?: string;
    leadSource?: string;
    notes?: string;
  };
  startAtStep?: number;
}

export default function NewAppointmentModal({ visible, onClose, onSuccess, initialData, startAtStep }: NewAppointmentModalProps) {
  const [appointmentStep, setAppointmentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date | null>(null);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [pickerTime, setPickerTime] = useState(new Date());
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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
    gateCode: '',
    reminders: true,
    reminderType: 'both',
    leadSource: '',
    jobSource: '',
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
    { id: 1, name: 'Jane Doe', email: 'jane@email.com', phone: '(555) 123-4567', originalLeadSource: 'Website' },
    { id: 2, name: 'Bob Johnson', email: 'bob@email.com', phone: '(555) 987-6543', originalLeadSource: 'Referral' },
    { id: 3, name: 'Sarah Wilson', email: 'sarah@email.com', phone: '(555) 456-7890', originalLeadSource: 'Social Media' },
    { id: 4, name: 'Mike Davis', email: 'mike@email.com', phone: '(555) 321-0987', originalLeadSource: 'Google' },
  ];

  const existingBusinesses = [
    { id: 1, name: 'ABC Construction', email: 'contact@abcconstruction.com', phone: '(555) 111-2222', originalLeadSource: 'BNI Networking Group' },
    { id: 2, name: 'XYZ Builders', email: 'info@xyzbuilders.com', phone: '(555) 333-4444', originalLeadSource: 'Trade Show' },
    { id: 3, name: 'TechCorp Solutions', email: 'hello@techcorp.com', phone: '(555) 555-6666', originalLeadSource: 'Cold Call' },
  ];

  const leadSources = [
    { id: '1', name: 'Website', category: 'Digital' },
    { id: '2', name: 'Referral', category: 'Word of Mouth' },
    { id: '3', name: 'Social Media', category: 'Digital' },
    { id: '4', name: 'Cold Call', category: 'Outbound' },
    { id: '5', name: 'Google', category: 'Digital' }
  ];

  const jobSources = [
    { id: '1', name: 'Repeat Customer', category: 'Retention' },
    { id: '2', name: 'Referral from Existing', category: 'Retention' },
    { id: '3', name: 'Upsell/Cross-sell', category: 'Expansion' },
    { id: '4', name: 'Seasonal Service', category: 'Recurring' },
    { id: '5', name: 'Emergency/Urgent', category: 'Reactive' },
    { id: '6', name: 'Networking Event', category: 'Outreach' },
    { id: '7', name: 'Previous Quote Follow-up', category: 'Follow-up' }
  ];

  const [selectedSource, setSelectedSource] = useState<any>(null);

  // Initialize with pre-populated data from request if provided
  useEffect(() => {
    if (initialData && visible) {
      // Parse customer name
      const nameParts = initialData.customerName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setAppointmentStep(startAtStep || 1);
      setAppointmentData({
        customerType: initialData.customerType,
        customerStatus: 'new',
        eventType: initialData.eventType || '',
        user: '',
        startDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        startTime: '09:00 AM',
        duration: '1 hour',
        appointmentAddress: '',
        billingAddress: '',
        notes: initialData.notes || '',
        gateCode: '',
        reminders: true,
        reminderType: 'both',
        leadSource: initialData.leadSource || '',
        jobSource: '',
        firstName: initialData.customerType === 'individual' ? firstName : '',
        lastName: initialData.customerType === 'individual' ? lastName : '',
        email: initialData.customerEmail,
        phone: initialData.customerPhone,
        businessName: initialData.customerType === 'business' ? initialData.companyName || '' : '',
        contactFirstName: initialData.customerType === 'business' ? firstName : '',
        contactLastName: initialData.customerType === 'business' ? lastName : '',
        contactEmail: initialData.customerType === 'business' ? initialData.customerEmail : '',
        contactPhone: initialData.customerType === 'business' ? initialData.customerPhone : '',
        contactTitle: ''
      });

      // Pre-select source if provided
      if (initialData.leadSource) {
        const source = leadSources.find(s => s.name === initialData.leadSource);
        if (source) {
          setSelectedSource(source);
        }
      }
    }
  }, [initialData, visible, startAtStep]);

  // Auto-populate job source when existing customer is selected
  useEffect(() => {
    if (appointmentData.customerStatus === 'existing' && selectedCustomer && selectedCustomer.originalLeadSource) {
      // Set the default job source to "Repeat Customer"
      const repeatCustomerSource = jobSources.find(source => source.name === 'Repeat Customer');
      if (repeatCustomerSource && !selectedSource) {
        setSelectedSource(repeatCustomerSource);
        setAppointmentData(prev => ({ ...prev, jobSource: repeatCustomerSource.name }));
      }
    }
  }, [selectedCustomer, appointmentData.customerStatus]);

  // Sample appointment data for calendar
  const sampleAppointments = [
    { id: 1, date: 15, time: '09:00 AM', duration: '1 hour', name: 'Client Meeting', assignee: 'Chris Palmer', status: 'confirmed', address: '123 Oak Street, Ocala, FL 34471' },
    { id: 2, date: 15, time: '02:00 PM', duration: '2 hours', name: 'Site Visit - Kitchen Remodel', assignee: 'Chris Palmer', status: 'scheduled', address: '456 Maple Avenue, Gainesville, FL 32601' },
    { id: 3, date: 18, time: '10:30 AM', duration: '1 hour', name: 'Estimate Consultation', assignee: 'Tanner Mullen', status: 'scheduled', address: '789 Pine Road, Ocala, FL 34480' },
    { id: 4, date: 20, time: '01:00 PM', duration: '30 min', name: 'Follow-up Call', assignee: 'Chris Palmer', status: 'confirmed', address: '321 Elm Drive, The Villages, FL 32162' },
    { id: 5, date: 22, time: '11:00 AM', duration: '1.5 hours', name: 'Project Review', assignee: 'Tanner Mullen', status: 'confirmed', address: '654 Cedar Lane, Ocala, FL 34472' },
    { id: 6, date: 22, time: '03:00 PM', duration: '1 hour', name: 'New Client Consultation', assignee: 'Chris Palmer', status: 'scheduled', address: '987 Birch Court, Gainesville, FL 32607' },
    { id: 7, date: 25, time: '09:00 AM', duration: '2 hours', name: 'Paint Estimate', assignee: 'Chris Palmer', status: 'confirmed', address: '147 Willow Way, Ocala, FL 34476' },
    { id: 8, date: 25, time: '01:00 PM', duration: '1 hour', name: 'Site Inspection', assignee: 'Tanner Mullen', status: 'scheduled', address: '258 Spruce Street, Silver Springs, FL 34488' },
    { id: 9, date: 28, time: '10:00 AM', duration: '1 hour', name: 'Final Walkthrough', assignee: 'Chris Palmer', status: 'confirmed', address: '369 Hickory Boulevard, Ocala, FL 34471' },
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

  // Calculate display step for UI (adjust when starting from request)
  const getDisplayStep = () => {
    const stepOffset = (startAtStep || 1) - 1;
    return appointmentStep - stepOffset;
  };

  // Get total steps for progress indicator
  const getTotalSteps = () => {
    return initialData ? 3 : 5; // 3 steps when from request, 5 when normal flow
  };

  // Get steps array for progress indicator
  const getStepsArray = () => {
    const totalSteps = getTotalSteps();
    const stepOffset = (startAtStep || 1) - 1;
    return Array.from({ length: totalSteps }, (_, i) => i + 1 + stepOffset);
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
      case 3:
        return appointmentData.eventType !== '';
      case 4:
        return selectedSource !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const maxStep = initialData ? 5 : 5; // Both flows end at step 5
    if (canProceedToNext() && appointmentStep < maxStep) {
      setAppointmentStep(appointmentStep + 1);
    }
  };

  const handleBack = () => {
    const minStep = startAtStep || 1;
    if (appointmentStep > minStep) {
      setAppointmentStep(appointmentStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
    // Only reset if not coming from initialData, otherwise parent will handle
    if (!initialData) {
      setAppointmentStep(1);
      setSearchQuery('');
      setSelectedCustomer(null);
      setSelectedSource(null);
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
        gateCode: '',
        reminders: true,
        reminderType: 'both',
        leadSource: '',
        jobSource: '',
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
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickerDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      setAppointmentData({...appointmentData, startDate: formattedDate});
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPickerTime(selectedTime);
      const formattedTime = selectedTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setAppointmentData({...appointmentData, startTime: formattedTime});
    }
  };

  const handleDurationSelect = (duration: string) => {
    setAppointmentData({...appointmentData, duration});
    setShowDurationPicker(false);
  };

  // Calendar helper functions
  const navigateCalendarMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCalendarDate(newDate);
  };

  const getEventsForDay = (day: number) => {
    return sampleAppointments.filter(event => event.date === day);
  };

  const generateCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const events = isCurrentMonth ? getEventsForDay(date.getDate()) : [];
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        events,
      });
    }
    
    return days;
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      'scheduled': '#BFDBFE',
      'confirmed': '#BBF7D0',
      'complete': '#16A34A',
      'no-show': '#D1D5DB',
      'cancelled': '#FECACA',
      'in-progress': '#FED7AA',
    };
    return statusColors[status as keyof typeof statusColors] || '#D1D5DB';
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
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'firstName' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="Enter first name"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.firstName}
                        onChangeText={(text) => setAppointmentData({...appointmentData, firstName: text})}
                        onFocus={() => setFocusedInput('firstName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Last Name *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'lastName' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="Enter last name"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.lastName}
                        onChangeText={(text) => setAppointmentData({...appointmentData, lastName: text})}
                        onFocus={() => setFocusedInput('lastName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'email' && styles.inputContainerFocused
                  ]}>
                    <TextInput 
                      style={styles.inputText}
                      placeholder="customer@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={appointmentData.email}
                      onChangeText={(text) => setAppointmentData({...appointmentData, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Phone</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'phone' && styles.inputContainerFocused
                  ]}>
                    <TextInput 
                      style={styles.inputText}
                      placeholder="(555) 123-4567"
                      placeholderTextColor="#9CA3AF"
                      value={appointmentData.phone}
                      onChangeText={(text) => setAppointmentData({...appointmentData, phone: text})}
                      keyboardType="phone-pad"
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                    />
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
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'businessName' && styles.inputContainerFocused
                  ]}>
                    <TextInput 
                      style={styles.inputText}
                      placeholder="Enter business name"
                      placeholderTextColor="#9CA3AF"
                      value={appointmentData.businessName}
                      onChangeText={(text) => setAppointmentData({...appointmentData, businessName: text})}
                      onFocus={() => setFocusedInput('businessName')}
                      onBlur={() => setFocusedInput(null)}
                    />
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
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'contactFirstName' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="Enter first name"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.contactFirstName}
                        onChangeText={(text) => setAppointmentData({...appointmentData, contactFirstName: text})}
                        onFocus={() => setFocusedInput('contactFirstName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Last Name *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'contactLastName' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="Enter last name"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.contactLastName}
                        onChangeText={(text) => setAppointmentData({...appointmentData, contactLastName: text})}
                        onFocus={() => setFocusedInput('contactLastName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Email *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'contactEmail' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="contact@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.contactEmail}
                        onChangeText={(text) => setAppointmentData({...appointmentData, contactEmail: text})}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocusedInput('contactEmail')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Phone *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'contactPhone' && styles.inputContainerFocused
                    ]}>
                      <TextInput 
                        style={styles.inputText}
                        placeholder="(555) 123-4567"
                        placeholderTextColor="#9CA3AF"
                        value={appointmentData.contactPhone}
                        onChangeText={(text) => setAppointmentData({...appointmentData, contactPhone: text})}
                        keyboardType="phone-pad"
                        onFocus={() => setFocusedInput('contactPhone')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Title (Optional)</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'contactTitle' && styles.inputContainerFocused
                  ]}>
                    <TextInput 
                      style={styles.inputText}
                      placeholder="e.g., CEO, Manager, Owner"
                      placeholderTextColor="#9CA3AF"
                      value={appointmentData.contactTitle}
                      onChangeText={(text) => setAppointmentData({...appointmentData, contactTitle: text})}
                      onFocus={() => setFocusedInput('contactTitle')}
                      onBlur={() => setFocusedInput(null)}
                    />
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
                <View style={[
                  styles.searchContainer,
                  focusedInput === 'search' && styles.inputContainerFocused
                ]}>
                  <Search size={20} color="#6B7280" />
                  <TextInput
                    style={styles.searchPlaceholder}
                    placeholder={isBusiness ? 'Search businesses...' : 'Search contacts...'}
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setFocusedInput('search')}
                    onBlur={() => setFocusedInput(null)}
                  />
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
              ].filter(event => {
                // Only show Estimate when coming from request
                if (initialData) {
                  return event.type === 'Estimate';
                }
                return true;
              }).map((event, index) => (
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
                      <Text style={styles.createsDealText}>{initialData ? 'Moves Deal' : 'Creates Deal'}</Text>
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
            <Text style={styles.stepTitle}>Source Attribution</Text>
            <Text style={styles.stepSubtitle}>Track where this appointment came from</Text>
            
            {/* Show Original Lead Source Badge for Existing Customers */}
            {appointmentData.customerStatus === 'existing' && selectedCustomer?.originalLeadSource && (
              <View style={styles.originalLeadSourceBadge}>
                <Lock size={16} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={styles.originalLeadSourceText}>
                  Original Lead Source: <Text style={styles.originalLeadSourceValue}>{selectedCustomer.originalLeadSource}</Text>
                </Text>
              </View>
            )}
            
            <Text style={styles.fieldLabel}>
              {appointmentData.customerStatus === 'new' ? 'Lead Source *' : 'Job Source *'}
            </Text>
            
            {/* Helper Text for Job Source */}
            {appointmentData.customerStatus === 'existing' && (
              <Text style={styles.helperText}>
                Track where this specific appointment came from. The original lead source shows how this customer first found you.
              </Text>
            )}
            
            <View style={styles.sourceContainer}>
              {(appointmentData.customerStatus === 'new' ? leadSources : jobSources).map((source) => (
                <TouchableOpacity
                  key={source.id}
                  style={[
                    styles.sourceCard,
                    selectedSource?.id === source.id && styles.sourceCardSelected
                  ]}
                  onPress={() => {
                    setSelectedSource(source);
                    if (appointmentData.customerStatus === 'new') {
                      setAppointmentData({...appointmentData, leadSource: source.name});
                    } else {
                      setAppointmentData({...appointmentData, jobSource: source.name});
                    }
                  }}
                >
                  <View style={styles.sourceCardContent}>
                    <Text style={styles.sourceCardTitle}>{source.name}</Text>
                    <Text style={styles.sourceCardSubtitle}>{source.category}</Text>
                  </View>
                  {selectedSource?.id === source.id && (
                    <Check size={20} color="#6366F1" />
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
            
            {/* Show preferred schedule when coming from request */}
            {initialData && (
              <View style={styles.preferredScheduleCard}>
                <Text style={styles.preferredScheduleTitle}>Customer Preference</Text>
                <View style={styles.preferredScheduleItem}>
                  <View style={styles.preferredScheduleIcon}>
                    <Calendar size={16} color="#10B981" />
                  </View>
                  <View style={styles.preferredScheduleInfo}>
                    <Text style={styles.preferredScheduleLabel}>Preferred Date</Text>
                    <Text style={styles.preferredScheduleValue}>Monday, August 25, 2025</Text>
                  </View>
                </View>
                <View style={styles.preferredScheduleItem}>
                  <View style={styles.preferredScheduleIcon}>
                    <Clock size={16} color="#10B981" />
                  </View>
                  <View style={styles.preferredScheduleInfo}>
                    <Text style={styles.preferredScheduleLabel}>Preferred Time</Text>
                    <Text style={styles.preferredScheduleValue}>1:00 PM</Text>
                  </View>
                </View>
                <View style={styles.preferredScheduleItem}>
                  <View style={styles.preferredScheduleIcon}>
                    <Calendar size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.preferredScheduleInfo}>
                    <Text style={styles.preferredScheduleLabel}>Secondary Date</Text>
                    <Text style={styles.preferredScheduleValue}>Tuesday, August 26, 2025 at 2:00 PM</Text>
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.scheduleContainer}>
              {/* View Calendar Button */}
              <TouchableOpacity 
                style={styles.viewCalendarButton}
                onPress={() => setShowCalendarModal(true)}
              >
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.viewCalendarButtonText}>View Calendar</Text>
                <Text style={styles.viewCalendarButtonSubtext}>Check availability</Text>
              </TouchableOpacity>

              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Start Date *</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.inputText}>{appointmentData.startDate}</Text>
                  <Calendar size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Start Time *</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.inputText}>{appointmentData.startTime}</Text>
                  <Clock size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Event Duration</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowDurationPicker(!showDurationPicker)}
                >
                  <Text style={styles.inputText}>{appointmentData.duration}</Text>
                  <ChevronRight size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Duration Picker Dropdown */}
              {showDurationPicker && (
                <View style={styles.durationDropdown}>
                  {['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', '4 hours'].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={styles.durationOption}
                      onPress={() => handleDurationSelect(duration)}
                    >
                      <Text style={[
                        styles.durationOptionText,
                        appointmentData.duration === duration && styles.durationOptionTextSelected
                      ]}>
                        {duration}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <Text style={styles.durationNote}>Event will end at 10:00 AM</Text>
            </View>

            {/* User Selection */}
            <View style={styles.scheduleField}>
              <Text style={styles.fieldLabel}>Assigned User *</Text>
              <Text style={styles.fieldHelperText}>Select the user who will be assigned to this appointment</Text>
            </View>

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

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={pickerTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Appointment Notes</Text>
            <Text style={styles.stepSubtitle}>Add any additional details or special instructions for this appointment</Text>
            
            <View style={styles.notesContainer}>
              <View style={[
                styles.textAreaContainer,
                focusedInput === 'notes' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.textAreaPlaceholder}
                  placeholder="Enter any notes, special requirements, or additional information for this appointment..."
                  placeholderTextColor="#9CA3AF"
                  value={appointmentData.notes}
                  onChangeText={(text) => setAppointmentData({...appointmentData, notes: text})}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  onFocus={() => setFocusedInput('notes')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={styles.scheduleField}>
                <Text style={styles.fieldLabel}>Gate or Lockbox Code (Optional)</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'gateCode' && styles.inputContainerFocused
                ]}>
                  <TextInput 
                    style={styles.inputText}
                    placeholder="Enter gate or lockbox code"
                    placeholderTextColor="#9CA3AF"
                    value={appointmentData.gateCode}
                    onChangeText={(text) => setAppointmentData({...appointmentData, gateCode: text})}
                    onFocus={() => setFocusedInput('gateCode')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.appointmentStep}>
            <Text style={styles.stepTitle}>Reminders & Review</Text>
            
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
            <Text style={styles.appointmentTitle}>
              {initialData ? `Schedule Appointment${getCustomerName() ? ` with ${getCustomerName()}` : ''}` : 'New Appointment'}
            </Text>
            <Text style={styles.appointmentSubtitle}>
              {appointmentStep === 1 && !initialData && "Choose whether this proposal is for a business or individual customer, and whether they are new or existing."}
              {appointmentStep === 2 && !initialData && "Enter customer details or select an existing customer from your database."}
              {appointmentStep === 3 && `Choose the event type for this appointment${!initialData && getCustomerName() ? ` with ${getCustomerName()}` : ''}.`}
              {appointmentStep === 4 && `Select the source where this appointment came from.`}
              {appointmentStep === 5 && `Set the date, time, duration, and assign the user who will handle this appointment.`}
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
          {getStepsArray().map((step, index) => {
            const displayStep = index + 1;
            const totalSteps = getTotalSteps();
            return (
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
                      {displayStep}
                    </Text>
                  )}
                </View>
                {index < totalSteps - 1 && <View style={styles.progressLine} />}
              </View>
            );
          })}
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
                  (appointmentStep === 6 || (appointmentStep === 5 && initialData)) && styles.footerButtonCreate,
                  !canProceedToNext() && styles.footerButtonDisabled
                ]}
                onPress={() => {
                  const isLastStep = appointmentStep === 6 || (appointmentStep === 5 && initialData);
                  if (isLastStep) {
                    // Call onSuccess callback if provided with appointment data
                    if (onSuccess) {
                      onSuccess(appointmentData);
                    }
                    handleClose();
                  } else {
                    handleNext();
                  }
                }}
                disabled={!canProceedToNext()}
              >
                <Text style={[
                  styles.footerButtonText, 
                  styles.footerButtonPrimaryText,
                  !canProceedToNext() && styles.footerButtonTextDisabled
                ]}>
                  {appointmentStep === 6 ? 'Create Appointment' : appointmentStep === 5 && initialData ? 'Schedule Appointment' : 'Next'}
                </Text>
              </TouchableOpacity>
          </View>
        </View>

        {/* Calendar View Modal */}
        <Modal
          visible={showCalendarModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <SafeAreaView style={styles.calendarModalContainer}>
            {/* Calendar Header */}
            <View style={styles.calendarModalHeader}>
              <View style={styles.calendarModalHeaderLeft}>
                <Text style={styles.calendarModalTitle}>Availability Calendar</Text>
                <Text style={styles.calendarModalSubtitle}>View your scheduled appointments</Text>
              </View>
              <TouchableOpacity 
                style={styles.calendarModalCloseButton}
                onPress={() => setShowCalendarModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Month Navigation */}
            <View style={styles.calendarMonthNav}>
              <TouchableOpacity 
                style={styles.calendarNavButton}
                onPress={() => navigateCalendarMonth('prev')}
              >
                <ChevronRight size={24} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              <Text style={styles.calendarMonthTitle}>
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity 
                style={styles.calendarNavButton}
                onPress={() => navigateCalendarMonth('next')}
              >
                <ChevronRight size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Calendar Content */}
            <ScrollView style={styles.calendarModalContent}>
              {/* Day Headers */}
              <View style={styles.calendarDayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.calendarDayHeader}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGridContainer}>
                {generateCalendarDays().map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDayCell,
                      !day.isCurrentMonth && styles.calendarDayCellInactive,
                      day.isToday && styles.calendarDayCellToday,
                      selectedCalendarDay?.toDateString() === day.date.toDateString() && styles.calendarDayCellSelected,
                    ]}
                    onPress={() => {
                      if (day.isCurrentMonth) {
                        setSelectedCalendarDay(day.date);
                      }
                    }}
                    disabled={!day.isCurrentMonth}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        !day.isCurrentMonth && styles.calendarDayTextInactive,
                        day.isToday && styles.calendarDayTextToday,
                        selectedCalendarDay?.toDateString() === day.date.toDateString() && styles.calendarDayTextSelected,
                      ]}
                    >
                      {day.day}
                    </Text>
                    
                    {/* Event indicators */}
                    {day.events && day.events.length > 0 && (
                      <View style={styles.calendarDayEvents}>
                        {day.events.slice(0, 2).map((event: any, i: number) => (
                          <View
                            key={i}
                            style={[
                              styles.calendarEventDot,
                              { backgroundColor: getStatusColor(event.status) }
                            ]}
                          />
                        ))}
                        {day.events.length > 2 && (
                          <Text style={styles.calendarMoreEventsText}>+{day.events.length - 2}</Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Selected Day Events */}
              {selectedCalendarDay && getEventsForDay(selectedCalendarDay.getDate()).length > 0 && (
                <View style={styles.selectedDaySection}>
                  <Text style={styles.selectedDayTitle}>
                    {selectedCalendarDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                  <Text style={styles.selectedDaySubtitle}>
                    {getEventsForDay(selectedCalendarDay.getDate()).length} appointment{getEventsForDay(selectedCalendarDay.getDate()).length !== 1 ? 's' : ''} scheduled
                  </Text>
                  
                  <View style={styles.calendarEventsList}>
                    {getEventsForDay(selectedCalendarDay.getDate()).map((event: any) => (
                      <View key={event.id} style={styles.calendarEventCard}>
                        <View style={styles.calendarEventTimeSection}>
                          <Text style={styles.calendarEventTime}>{event.time}</Text>
                          <Text style={styles.calendarEventDuration}>{event.duration}</Text>
                        </View>
                        <View style={styles.calendarEventDetails}>
                          <Text style={styles.calendarEventName}>{event.name}</Text>
                          <Text style={styles.calendarEventAssignee}>{event.assignee}</Text>
                          {event.address && (
                            <View style={styles.calendarEventAddressRow}>
                              <MapPin size={14} color="#6B7280" />
                              <Text style={styles.calendarEventAddress}>{event.address}</Text>
                            </View>
                          )}
                          <View style={[
                            styles.calendarEventStatusBadge,
                            { backgroundColor: getStatusColor(event.status) }
                          ]}>
                            <Text style={styles.calendarEventStatusText}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Legend */}
              <View style={styles.calendarLegend}>
                <Text style={styles.calendarLegendTitle}>Legend</Text>
                <View style={styles.calendarLegendItems}>
                  <View style={styles.calendarLegendItem}>
                    <View style={[styles.calendarLegendDot, { backgroundColor: '#BBF7D0' }]} />
                    <Text style={styles.calendarLegendText}>Confirmed</Text>
                  </View>
                  <View style={styles.calendarLegendItem}>
                    <View style={[styles.calendarLegendDot, { backgroundColor: '#BFDBFE' }]} />
                    <Text style={styles.calendarLegendText}>Scheduled</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
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
  fieldHelperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: -8,
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
  // Preferred Schedule Styles
  preferredScheduleCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  preferredScheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 12,
  },
  preferredScheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  preferredScheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preferredScheduleInfo: {
    flex: 1,
  },
  preferredScheduleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 2,
  },
  preferredScheduleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803D',
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
    shadowOpacity: 0.15,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
  durationNote: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  durationDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    overflow: 'hidden',
  },
  durationOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  durationOptionTextSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  // Notes Styles
  notesContainer: {
    gap: 12,
  },
  textAreaContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 120,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  textAreaPlaceholder: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    flex: 1,
    backgroundColor: 'transparent',
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    backgroundColor: 'transparent',
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
  // View Calendar Button
  viewCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginBottom: 20,
  },
  viewCalendarButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
  viewCalendarButtonSubtext: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    marginLeft: -8,
  },
  // Calendar Modal Styles
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarModalHeaderLeft: {
    flex: 1,
  },
  calendarModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  calendarModalCloseButton: {
    padding: 8,
  },
  calendarMonthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarModalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarDayHeaders: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    padding: 4,
  },
  calendarDayCellInactive: {
    opacity: 0.3,
  },
  calendarDayCellToday: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  calendarDayCellSelected: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarDayTextInactive: {
    color: '#9CA3AF',
  },
  calendarDayTextToday: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  calendarDayEvents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  calendarEventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  calendarMoreEventsText: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  calendarLegend: {
    marginTop: 24,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  calendarLegendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  calendarLegendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  calendarLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  calendarLegendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Selected Day Section
  selectedDaySection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedDaySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  calendarEventsList: {
    gap: 12,
  },
  calendarEventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  calendarEventTimeSection: {
    width: 80,
  },
  calendarEventTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  calendarEventDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  calendarEventDetails: {
    flex: 1,
  },
  calendarEventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  calendarEventAssignee: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  calendarEventAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  calendarEventAddress: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  calendarEventStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  calendarEventStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  originalLeadSourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  originalLeadSourceText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  originalLeadSourceValue: {
    color: '#111827',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  sourceContainer: {
    gap: 12,
    marginTop: 12,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  sourceCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  sourceCardContent: {
    flex: 1,
  },
  sourceCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sourceCardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
