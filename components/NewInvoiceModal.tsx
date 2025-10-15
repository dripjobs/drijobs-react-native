import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText,
    Search,
    UserCircle,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface NewInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onInvoiceCreated?: (invoiceId: string) => void;
}

export default function NewInvoiceModal({ visible, onClose, onInvoiceCreated }: NewInvoiceModalProps) {
  const router = useRouter();
  const [invoiceStep, setInvoiceStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showRecurringEndDatePicker, setShowRecurringEndDatePicker] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    // Customer Type
    customerType: '', // 'individual' or 'business'
    customerStatus: '', // 'new' or 'existing'
    
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
    contactTitle: '',
    
    // Address fields (optional)
    street: '',
    city: '',
    state: '',
    zip: '',
    
    // Billing address fields (optional)
    useDifferentBilling: false,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    
    // Invoice settings
    isOneOff: true, // Always true for this flow
    isRecurring: false, // Can be toggled
    recurringFrequency: '', // 'weekly', 'monthly', 'quarterly', 'yearly'
    recurringEndType: 'never', // 'never', 'after', 'on'
    recurringEndCount: 0,
    recurringEndDate: new Date(),
  });

  // Mock existing customers (in production, fetch from API)
  const existingIndividuals = [
    { id: 1, name: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 123-4567' },
    { id: 2, name: 'Sarah Martinez', email: 'sarah@example.com', phone: '(555) 234-5678' },
    { id: 3, name: 'Michael Davis', email: 'michael@example.com', phone: '(555) 345-6789' },
  ];

  const existingBusinesses = [
    { id: 101, name: 'Acme Corp', email: 'info@acmecorp.com', phone: '(555) 111-2222' },
    { id: 102, name: 'Tech Solutions Inc', email: 'contact@techsolutions.com', phone: '(555) 222-3333' },
    { id: 103, name: 'Green Energy LLC', email: 'hello@greenenergy.com', phone: '(555) 333-4444' },
  ];

  const filteredCustomers = invoiceData.customerType === 'business' ? existingBusinesses : existingIndividuals;
  const searchFilteredCustomers = filteredCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const validateInvoiceData = () => {
    const errors: {[key: string]: string} = {};

    if (invoiceData.customerStatus === 'new') {
      if (invoiceData.customerType === 'individual') {
        if (!invoiceData.firstName.trim()) errors.firstName = 'First name is required';
        if (!invoiceData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!invoiceData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(invoiceData.email)) errors.email = 'Email is invalid';
        if (!invoiceData.phone.trim()) errors.phone = 'Phone is required';
      } else {
        if (!invoiceData.businessName.trim()) errors.businessName = 'Business name is required';
        if (!invoiceData.contactFirstName.trim()) errors.contactFirstName = 'Contact first name is required';
        if (!invoiceData.contactLastName.trim()) errors.contactLastName = 'Contact last name is required';
        if (!invoiceData.contactEmail.trim()) errors.contactEmail = 'Contact email is required';
        else if (!/\S+@\S+\.\S+/.test(invoiceData.contactEmail)) errors.contactEmail = 'Email is invalid';
        if (!invoiceData.contactPhone.trim()) errors.contactPhone = 'Contact phone is required';
      }
    } else {
      if (!selectedCustomer) errors.customer = 'Please select a customer';
    }

    if (invoiceData.isRecurring) {
      if (!invoiceData.recurringFrequency) errors.recurringFrequency = 'Frequency is required';
      if (invoiceData.recurringEndType === 'after' && invoiceData.recurringEndCount <= 0) {
        errors.recurringEndCount = 'Must be greater than 0';
      }
    }

    return errors;
  };

  const handleCreateInvoice = async () => {
    const errors = validateInvoiceData();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsCreating(true);

    try {
      // In production, create customer and invoice via API
      const invoiceId = `INV-${Date.now()}`;
      
      Alert.alert('Success', 'Invoice created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            onInvoiceCreated?.(invoiceId);
            handleClose();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create invoice. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setInvoiceStep(1);
    setSearchQuery('');
    setSelectedCustomer(null);
    setFormErrors({});
    setInvoiceData({
      customerType: '',
      customerStatus: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      contactFirstName: '',
      contactLastName: '',
      contactEmail: '',
      contactPhone: '',
      contactTitle: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      useDifferentBilling: false,
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      isOneOff: true,
      isRecurring: false,
      recurringFrequency: '',
      recurringEndType: 'never',
      recurringEndCount: 0,
      recurringEndDate: new Date(),
    });
    onClose();
  };

  const canProceedToStep2 = invoiceData.customerType !== '';
  const canProceedToStep3 = canProceedToStep2 && invoiceData.customerStatus !== '';
  const canProceedToStep4 = canProceedToStep3 && (
    invoiceData.customerStatus === 'existing' ? selectedCustomer !== null : true
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepDotContainer}>
          <View style={[
            styles.stepDot,
            invoiceStep >= step && styles.stepDotActive
          ]} />
          {step < 4 && <View style={[
            styles.stepLine,
            invoiceStep > step && styles.stepLineActive
          ]} />}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (invoiceStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Who is this invoice for?</Text>
            <Text style={styles.stepDescription}>
              Select whether this invoice is for an individual or a business
            </Text>

            <View style={styles.customerTypeSection}>
              {/* Individual Option */}
              <TouchableOpacity
                style={[
                  styles.customerTypeCard,
                  invoiceData.customerType === 'individual' && styles.customerTypeCardActive
                ]}
                onPress={() => setInvoiceData({...invoiceData, customerType: 'individual'})}
              >
                <UserCircle size={40} color={invoiceData.customerType === 'individual' ? '#6366F1' : '#9CA3AF'} />
                <Text style={styles.customerTypeTitle}>Individual Contact</Text>
                <Text style={styles.customerTypeDescription}>
                  Create an invoice for a person
                </Text>
              </TouchableOpacity>

              {/* Business Option */}
              <TouchableOpacity
                style={[
                  styles.customerTypeCard,
                  invoiceData.customerType === 'business' && styles.customerTypeCardActive
                ]}
                onPress={() => setInvoiceData({...invoiceData, customerType: 'business'})}
              >
                <Building2 size={40} color={invoiceData.customerType === 'business' ? '#10B981' : '#9CA3AF'} />
                <Text style={styles.customerTypeTitle}>Business</Text>
                <Text style={styles.customerTypeDescription}>
                  Create an invoice for a company
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <AlertCircle size={16} color="#6366F1" />
              <Text style={styles.infoBannerText}>
                This is a one-off invoice and won't create a job
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              {invoiceData.customerType === 'business' ? 'Select or Create Business' : 'Select or Create Contact'}
            </Text>
            
            {/* Toggle Buttons */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  invoiceData.customerStatus === 'new' && styles.toggleButtonActive
                ]}
                onPress={() => {
                  setInvoiceData({...invoiceData, customerStatus: 'new'});
                  setSelectedCustomer(null);
                }}
              >
                <Text style={[
                  styles.toggleButtonText,
                  invoiceData.customerStatus === 'new' && styles.toggleButtonTextActive
                ]}>
                  New {invoiceData.customerType === 'business' ? 'Business' : 'Contact'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  invoiceData.customerStatus === 'existing' && styles.toggleButtonActive
                ]}
                onPress={() => setInvoiceData({...invoiceData, customerStatus: 'existing'})}
              >
                <Text style={[
                  styles.toggleButtonText,
                  invoiceData.customerStatus === 'existing' && styles.toggleButtonTextActive
                ]}>
                  Existing {invoiceData.customerType === 'business' ? 'Business' : 'Contact'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Conditional Content */}
            {invoiceData.customerStatus === 'existing' ? (
              <View>
                {/* Search Bar */}
                <View style={[
                  styles.searchContainer,
                  focusedInput === 'search' && styles.searchContainerFocused
                ]}>
                  <Search size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={`Search ${invoiceData.customerType === 'business' ? 'businesses' : 'contacts'}...`}
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('search')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {/* Customer List */}
                <ScrollView style={styles.customerList} nestedScrollEnabled>
                  {searchFilteredCustomers.map((customer) => (
                    <TouchableOpacity
                      key={customer.id}
                      style={[
                        styles.customerCard,
                        selectedCustomer?.id === customer.id && styles.customerCardSelected
                      ]}
                      onPress={() => setSelectedCustomer(customer)}
                    >
                      <Text style={styles.customerName}>{customer.name}</Text>
                      <Text style={styles.customerDetails}>
                        {customer.email} • {customer.phone}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text style={styles.nextStepHint}>
                Click Next to enter {invoiceData.customerType === 'business' ? 'business' : 'contact'} information
              </Text>
            )}
          </View>
        );

      case 3:
        if (invoiceData.customerStatus === 'existing') {
          // For existing customers, skip directly to settings (step 4)
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Selected: {selectedCustomer?.name || 'No customer selected'}
              </Text>
              <Text style={styles.stepDescription}>
                Click Next to continue to invoice settings
              </Text>
            </View>
          );
        }

        return (
          <ScrollView style={styles.stepContent} nestedScrollEnabled>
            <Text style={styles.stepTitle}>
              {invoiceData.customerType === 'business' ? 'Business Information' : 'Contact Information'}
            </Text>

            {invoiceData.customerType === 'individual' ? (
              // Individual Contact Form
              <View>
                <View style={styles.formSection}>
                  {/* First Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <TextInput
                      style={[styles.input, formErrors.firstName && styles.inputError]}
                      value={invoiceData.firstName}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, firstName: text});
                        if (formErrors.firstName) {
                          const newErrors = {...formErrors};
                          delete newErrors.firstName;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="Enter first name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {formErrors.firstName && (
                      <Text style={styles.errorText}>{formErrors.firstName}</Text>
                    )}
                  </View>

                  {/* Last Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Last Name *</Text>
                    <TextInput
                      style={[styles.input, formErrors.lastName && styles.inputError]}
                      value={invoiceData.lastName}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, lastName: text});
                        if (formErrors.lastName) {
                          const newErrors = {...formErrors};
                          delete newErrors.lastName;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="Enter last name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {formErrors.lastName && (
                      <Text style={styles.errorText}>{formErrors.lastName}</Text>
                    )}
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email *</Text>
                    <TextInput
                      style={[styles.input, formErrors.email && styles.inputError]}
                      value={invoiceData.email}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, email: text});
                        if (formErrors.email) {
                          const newErrors = {...formErrors};
                          delete newErrors.email;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="email@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {formErrors.email && (
                      <Text style={styles.errorText}>{formErrors.email}</Text>
                    )}
                  </View>

                  {/* Phone */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone *</Text>
                    <TextInput
                      style={[styles.input, formErrors.phone && styles.inputError]}
                      value={invoiceData.phone}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, phone: text});
                        if (formErrors.phone) {
                          const newErrors = {...formErrors};
                          delete newErrors.phone;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="(555) 555-5555"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                    {formErrors.phone && (
                      <Text style={styles.errorText}>{formErrors.phone}</Text>
                    )}
                  </View>
                </View>

                {/* Address Section (Optional) */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Address (Optional)</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Street</Text>
                    <TextInput
                      style={styles.input}
                      value={invoiceData.street}
                      onChangeText={(text) => setInvoiceData({...invoiceData, street: text})}
                      placeholder="123 Main Street"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.addressRow}>
                    <View style={[styles.inputGroup, {flex: 2}]}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.city}
                        onChangeText={(text) => setInvoiceData({...invoiceData, city: text})}
                        placeholder="City"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={[styles.inputGroup, {flex: 1}]}>
                      <Text style={styles.inputLabel}>State</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.state}
                        onChangeText={(text) => setInvoiceData({...invoiceData, state: text})}
                        placeholder="ST"
                        placeholderTextColor="#9CA3AF"
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>

                    <View style={[styles.inputGroup, {flex: 1}]}>
                      <Text style={styles.inputLabel}>ZIP</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.zip}
                        onChangeText={(text) => setInvoiceData({...invoiceData, zip: text})}
                        placeholder="12345"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              // Business Form
              <View>
                <View style={styles.formSection}>
                  {/* Business Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Business Name *</Text>
                    <TextInput
                      style={[styles.input, formErrors.businessName && styles.inputError]}
                      value={invoiceData.businessName}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, businessName: text});
                        if (formErrors.businessName) {
                          const newErrors = {...formErrors};
                          delete newErrors.businessName;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="Enter business name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {formErrors.businessName && (
                      <Text style={styles.errorText}>{formErrors.businessName}</Text>
                    )}
                  </View>

                  <Text style={styles.subsectionTitle}>Primary Contact</Text>

                  {/* Contact First Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <TextInput
                      style={[styles.input, formErrors.contactFirstName && styles.inputError]}
                      value={invoiceData.contactFirstName}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, contactFirstName: text});
                        if (formErrors.contactFirstName) {
                          const newErrors = {...formErrors};
                          delete newErrors.contactFirstName;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="Enter first name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {formErrors.contactFirstName && (
                      <Text style={styles.errorText}>{formErrors.contactFirstName}</Text>
                    )}
                  </View>

                  {/* Contact Last Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Last Name *</Text>
                    <TextInput
                      style={[styles.input, formErrors.contactLastName && styles.inputError]}
                      value={invoiceData.contactLastName}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, contactLastName: text});
                        if (formErrors.contactLastName) {
                          const newErrors = {...formErrors};
                          delete newErrors.contactLastName;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="Enter last name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {formErrors.contactLastName && (
                      <Text style={styles.errorText}>{formErrors.contactLastName}</Text>
                    )}
                  </View>

                  {/* Contact Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email *</Text>
                    <TextInput
                      style={[styles.input, formErrors.contactEmail && styles.inputError]}
                      value={invoiceData.contactEmail}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, contactEmail: text});
                        if (formErrors.contactEmail) {
                          const newErrors = {...formErrors};
                          delete newErrors.contactEmail;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="email@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {formErrors.contactEmail && (
                      <Text style={styles.errorText}>{formErrors.contactEmail}</Text>
                    )}
                  </View>

                  {/* Contact Phone */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone *</Text>
                    <TextInput
                      style={[styles.input, formErrors.contactPhone && styles.inputError]}
                      value={invoiceData.contactPhone}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, contactPhone: text});
                        if (formErrors.contactPhone) {
                          const newErrors = {...formErrors};
                          delete newErrors.contactPhone;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="(555) 555-5555"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                    {formErrors.contactPhone && (
                      <Text style={styles.errorText}>{formErrors.contactPhone}</Text>
                    )}
                  </View>

                  {/* Contact Title */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={invoiceData.contactTitle}
                      onChangeText={(text) => setInvoiceData({...invoiceData, contactTitle: text})}
                      placeholder="e.g., Owner, Manager"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Billing Address Section (Optional) */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Billing Address (Optional)</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Street</Text>
                    <TextInput
                      style={styles.input}
                      value={invoiceData.billingStreet}
                      onChangeText={(text) => setInvoiceData({...invoiceData, billingStreet: text})}
                      placeholder="123 Business Avenue"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.addressRow}>
                    <View style={[styles.inputGroup, {flex: 2}]}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.billingCity}
                        onChangeText={(text) => setInvoiceData({...invoiceData, billingCity: text})}
                        placeholder="City"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={[styles.inputGroup, {flex: 1}]}>
                      <Text style={styles.inputLabel}>State</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.billingState}
                        onChangeText={(text) => setInvoiceData({...invoiceData, billingState: text})}
                        placeholder="ST"
                        placeholderTextColor="#9CA3AF"
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>

                    <View style={[styles.inputGroup, {flex: 1}]}>
                      <Text style={styles.inputLabel}>ZIP</Text>
                      <TextInput
                        style={styles.input}
                        value={invoiceData.billingZip}
                        onChangeText={(text) => setInvoiceData({...invoiceData, billingZip: text})}
                        placeholder="12345"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        );

      case 4:
        return (
          <ScrollView style={styles.stepContent} nestedScrollEnabled>
            <Text style={styles.stepTitle}>Invoice Settings</Text>

            {/* One-Off Invoice Badge */}
            <View style={styles.infoBadge}>
              <FileText size={16} color="#6366F1" />
              <View style={{flex: 1}}>
                <Text style={styles.infoBadgeText}>One-Off Invoice</Text>
                <Text style={styles.infoBadgeSubtext}>
                  This invoice won't create a job
                </Text>
              </View>
            </View>

            {/* Recurring Invoice Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Make this a recurring invoice</Text>
                <Text style={styles.settingDescription}>
                  Automatically generate this invoice on a schedule
                </Text>
              </View>
              <Switch
                value={invoiceData.isRecurring}
                onValueChange={(value) => setInvoiceData({...invoiceData, isRecurring: value})}
              />
            </View>

            {/* Recurring Settings (if enabled) */}
            {invoiceData.isRecurring && (
              <View style={styles.recurringSettings}>
                {/* Frequency */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Frequency *</Text>
                  <View style={styles.frequencyButtons}>
                    {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyButton,
                          invoiceData.recurringFrequency === freq.toLowerCase() && styles.frequencyButtonActive
                        ]}
                        onPress={() => setInvoiceData({...invoiceData, recurringFrequency: freq.toLowerCase()})}
                      >
                        <Text style={[
                          styles.frequencyButtonText,
                          invoiceData.recurringFrequency === freq.toLowerCase() && styles.frequencyButtonTextActive
                        ]}>
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {formErrors.recurringFrequency && (
                    <Text style={styles.errorText}>{formErrors.recurringFrequency}</Text>
                  )}
                </View>

                {/* End Type */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ends</Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setInvoiceData({...invoiceData, recurringEndType: 'never'})}
                    >
                      <View style={[
                        styles.radio,
                        invoiceData.recurringEndType === 'never' && styles.radioActive
                      ]}>
                        {invoiceData.recurringEndType === 'never' && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>Never</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setInvoiceData({...invoiceData, recurringEndType: 'after'})}
                    >
                      <View style={[
                        styles.radio,
                        invoiceData.recurringEndType === 'after' && styles.radioActive
                      ]}>
                        {invoiceData.recurringEndType === 'after' && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>After</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setInvoiceData({...invoiceData, recurringEndType: 'on'})}
                    >
                      <View style={[
                        styles.radio,
                        invoiceData.recurringEndType === 'on' && styles.radioActive
                      ]}>
                        {invoiceData.recurringEndType === 'on' && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>On date</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Conditional inputs */}
                {invoiceData.recurringEndType === 'after' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Number of invoices</Text>
                    <TextInput
                      style={[styles.input, formErrors.recurringEndCount && styles.inputError]}
                      value={invoiceData.recurringEndCount > 0 ? invoiceData.recurringEndCount.toString() : ''}
                      onChangeText={(text) => {
                        setInvoiceData({...invoiceData, recurringEndCount: parseInt(text) || 0});
                        if (formErrors.recurringEndCount) {
                          const newErrors = {...formErrors};
                          delete newErrors.recurringEndCount;
                          setFormErrors(newErrors);
                        }
                      }}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                    />
                    {formErrors.recurringEndCount && (
                      <Text style={styles.errorText}>{formErrors.recurringEndCount}</Text>
                    )}
                  </View>
                )}

                {invoiceData.recurringEndType === 'on' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>End date</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowRecurringEndDatePicker(true)}
                    >
                      <Calendar size={20} color="#6B7280" />
                      <Text style={styles.dateButtonText}>
                        {invoiceData.recurringEndDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Create Invoice Button */}
            <TouchableOpacity
              style={[styles.createButton, isCreating && styles.createButtonDisabled]}
              onPress={handleCreateInvoice}
              disabled={isCreating}
            >
              <Text style={styles.createButtonText}>
                {isCreating ? 'Creating...' : 'Create Invoice'}
              </Text>
              {!isCreating && <ChevronRight size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Invoice</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {invoiceStep < 4 && (
          <View style={styles.navigationButtons}>
            {invoiceStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setInvoiceStep(invoiceStep - 1)}
              >
                <ChevronLeft size={20} color="#6366F1" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.nextButton,
                invoiceStep === 1 && !canProceedToStep2 && styles.nextButtonDisabled,
                invoiceStep === 2 && !canProceedToStep3 && styles.nextButtonDisabled,
                invoiceStep === 3 && !canProceedToStep4 && styles.nextButtonDisabled,
              ]}
              onPress={() => {
                if (invoiceStep === 1 && !canProceedToStep2) return;
                if (invoiceStep === 2 && !canProceedToStep3) return;
                if (invoiceStep === 3 && invoiceData.customerStatus === 'existing' && !selectedCustomer) {
                  Alert.alert('Selection Required', 'Please select a customer to continue.');
                  return;
                }
                setInvoiceStep(invoiceStep + 1);
              }}
              disabled={
                (invoiceStep === 1 && !canProceedToStep2) ||
                (invoiceStep === 2 && !canProceedToStep3) ||
                (invoiceStep === 3 && !canProceedToStep4)
              }
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Date Pickers */}
        {showRecurringEndDatePicker && (
          <DateTimePicker
            value={invoiceData.recurringEndDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowRecurringEndDatePicker(false);
              if (selectedDate) {
                setInvoiceData({...invoiceData, recurringEndDate: selectedDate});
              }
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  stepDotActive: {
    backgroundColor: '#6366F1',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#6366F1',
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
  },
  customerTypeSection: {
    gap: 16,
    marginBottom: 24,
  },
  customerTypeCard: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  customerTypeCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  customerTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  customerTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    flex: 1,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 2,
  },
  infoBadgeSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  toggleButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#6366F1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  searchContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  customerList: {
    maxHeight: 400,
  },
  customerCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 12,
  },
  customerCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  nextStepHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  recurringSettings: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  frequencyButtonTextActive: {
    color: '#6366F1',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#6366F1',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioLabel: {
    fontSize: 15,
    color: '#111827',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

