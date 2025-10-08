import { AlertCircle, Building, Check, DollarSign, FileText, Info, Search, User as UserIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface CreateJobModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToProposal?: (proposalId: string, jobDetails: { jobName: string; jobType: string; jobAmount: string }) => void;
  onOpenProposalModal?: () => void;
}

export default function CreateJobModal({ visible, onClose, onNavigateToProposal, onOpenProposalModal }: CreateJobModalProps) {
  const [jobStep, setJobStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [jobData, setJobData] = useState({
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
    // Job address fields
    jobStreet: '',
    jobCity: '',
    jobState: '',
    jobZip: '',
    // Job type
    jobFrequency: '', // 'one-time' or 'recurring'
    // Job details
    jobName: '',
    jobType: '',
    jobAmount: '',
    // Invoice options
    createInvoice: false,
  });

  // Sample data (same as proposal)
  const existingCustomers = [
    { id: 1, name: 'Jane Doe', email: 'jane@email.com', phone: '(555) 123-4567', addresses: [
      { id: '1', street: '321 Home St', city: 'Residential', state: 'CA', zipCode: '90214' }
    ]},
    { id: 2, name: 'Bob Johnson', email: 'bob@email.com', phone: '(555) 987-6543', addresses: [] },
    { id: 3, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '(555) 456-7890', addresses: [
      { id: '2', street: '654 Oak Ave', city: 'Suburbia', state: 'CA', zipCode: '90215' }
    ]},
  ];

  const existingBusinesses = [
    { id: 1, name: 'ABC Construction', addresses: [
      { id: '1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210' },
      { id: '2', street: '456 Job Site Ave', city: 'Somewhere', state: 'CA', zipCode: '90211' }
    ]},
    { id: 2, name: 'XYZ Builders', addresses: [
      { id: '3', street: '789 Business Blvd', city: 'Elsewhere', state: 'CA', zipCode: '90212' }
    ]},
    { id: 3, name: 'TechCorp Solutions', addresses: [
      { id: '4', street: '321 Innovation Dr', city: 'Tech City', state: 'CA', zipCode: '90213' }
    ]},
  ];

  const jobTypes = [
    { id: '1', name: 'Pressure Washing', category: 'Exterior' },
    { id: '2', name: 'Painting', category: 'Interior/Exterior' },
    { id: '3', name: 'Drywall Repair', category: 'Interior' },
    { id: '4', name: 'Landscaping', category: 'Exterior' },
    { id: '5', name: 'Window Cleaning', category: 'Interior/Exterior' },
  ];

  const canProceedToNext = () => {
    switch (jobStep) {
      case 1:
        return jobData.customerType && jobData.customerStatus;
      case 2:
        // Validate customer info
        let hasCustomerInfo = false;
        if (jobData.customerStatus === 'existing') {
          hasCustomerInfo = selectedCustomer !== null;
        } else {
          if (jobData.customerType === 'business') {
            // Business requires: name, contact first/last, and email OR phone
            const hasContactMethod = jobData.contactEmail.trim() !== '' || jobData.contactPhone.trim() !== '';
            hasCustomerInfo = jobData.businessName.trim() !== '' &&
                   jobData.contactFirstName.trim() !== '' &&
                   jobData.contactLastName.trim() !== '' &&
                   hasContactMethod;
          } else {
            // Individual requires: first/last name and email OR phone
            const hasContactMethod = jobData.email.trim() !== '' || jobData.phone.trim() !== '';
            hasCustomerInfo = jobData.firstName.trim() !== '' &&
                   jobData.lastName.trim() !== '' &&
                   hasContactMethod;
          }
        }
        
        // Validate job address
        const hasJobAddress = jobData.jobStreet.trim() !== '' && jobData.jobCity.trim() !== '';
        
        return hasCustomerInfo && hasJobAddress;
      case 3:
        return jobData.jobFrequency !== '';
      case 4:
        return jobData.jobName.trim() !== '' && 
               jobData.jobType.trim() !== '' && 
               jobData.jobAmount.trim() !== '';
      case 5:
        return true; // Invoice is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && jobStep < 5) {
      setJobStep(jobStep + 1);
    }
  };

  const handleBack = () => {
    if (jobStep > 1) {
      setJobStep(jobStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setJobStep(1);
    setSearchQuery('');
    setSelectedCustomer(null);
    setSelectedAddress(null);
    setJobData({
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
      jobStreet: '',
      jobCity: '',
      jobState: '',
      jobZip: '',
      jobFrequency: '',
      jobName: '',
      jobType: '',
      jobAmount: '',
      createInvoice: false,
    });
  };

  const handleCreateJob = () => {
    // In real app, this would create the job, deal, proposal, and optionally invoice
    const mockProposalId = 'proposal-' + Date.now(); // This would come from the API
    
    Toast.show({
      type: 'success',
      text1: 'Job Created!',
      text2: jobData.createInvoice ? 'Job, deal, proposal, and invoice created' : 'Job, deal, and proposal created',
      visibilityTime: 3000,
    });
    
    handleClose();
    
    // Navigate to the created proposal after a brief delay
    setTimeout(() => {
      if (onNavigateToProposal) {
        onNavigateToProposal(mockProposalId, {
          jobName: jobData.jobName,
          jobType: jobData.jobType,
          jobAmount: jobData.jobAmount
        });
      }
    }, 500);
  };

  const filterItems = () => {
    const items = jobData.customerType === 'business' ? existingBusinesses : existingCustomers;
    if (!searchQuery) return items;
    
    return items.filter(item => {
      if (jobData.customerType === 'business') {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item as any).email.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item as any).phone.includes(searchQuery);
      }
    });
  };

  const getStepTitle = () => {
    switch (jobStep) {
      case 1: return 'Select Customer Type';
      case 2: return 'Customer Information & Job Address';
      case 3: return 'Job Frequency';
      case 4: return 'Job Details';
      case 5: return 'Invoice Options';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (jobStep) {
      case 1: return 'Choose whether this job is for a business or individual customer';
      case 2: return 'Enter customer details and job location';
      case 3: return 'Specify if this is a one-time or recurring job';
      case 4: return 'Enter job name, type, and amount';
      case 5: return 'Optionally create an invoice for this job';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (jobStep) {
      case 1:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            {/* Customer Type Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Customer Type</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    jobData.customerType === 'individual' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, customerType: 'individual'})}
                >
                  <UserIcon size={24} color={jobData.customerType === 'individual' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    jobData.customerType === 'individual' && styles.selectionTitleSelected
                  ]}>
                    Individual Customer
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Job for a person or household
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    jobData.customerType === 'business' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, customerType: 'business'})}
                >
                  <Building size={24} color={jobData.customerType === 'business' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    jobData.customerType === 'business' && styles.selectionTitleSelected
                  ]}>
                    Business
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Job for a company or organization
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Status Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Customer Status</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    jobData.customerStatus === 'existing' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, customerStatus: 'existing'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    jobData.customerStatus === 'existing' && styles.selectionTitleSelected
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
                    jobData.customerStatus === 'new' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, customerStatus: 'new'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    jobData.customerStatus === 'new' && styles.selectionTitleSelected
                  ]}>
                    New
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Not in your database yet
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Prominent Warning Box */}
            <View style={[styles.infoBox, { backgroundColor: '#FEF3C7', borderColor: '#FCD34D', marginBottom: 16 }]}>
              <AlertCircle size={20} color="#D97706" />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: '#92400E' }]}>Quick Job Creation</Text>
                <Text style={[styles.infoText, { color: '#78350F' }]}>
                  This creates an accepted job without detailed proposal or deposit collection. 
                  Perfect for quick, simple jobs where you set a price upfront.
                </Text>
                {onOpenProposalModal && (
                  <TouchableOpacity 
                    onPress={() => {
                      handleClose();
                      onOpenProposalModal();
                    }}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ color: '#D97706', fontWeight: '600', textDecorationLine: 'underline' }}>
                      Need a detailed proposal? Click here →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Info size={20} color="#3B82F6" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>What happens next?</Text>
                <Text style={styles.infoText}>
                  {jobData.customerStatus === 'new' 
                    ? `You'll enter ${jobData.customerType === 'business' ? 'business' : 'customer'} details and create a new record.`
                    : `You'll select from existing ${jobData.customerType === 'business' ? 'businesses' : 'customers'}.`
                  }
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Customer Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {jobData.customerType === 'business' ? 'Business Information' : 'Customer Information'}
              </Text>
              
              {jobData.customerStatus === 'new' ? (
                jobData.customerType === 'business' ? (
                  <>
                    {/* Business Name */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Business Name *</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedInput === 'businessName' && styles.inputContainerFocused
                      ]}>
                        <TextInput
                          style={styles.input}
                          value={jobData.businessName}
                          onChangeText={(text) => setJobData({...jobData, businessName: text})}
                          placeholder="Enter business name"
                          placeholderTextColor="#9CA3AF"
                          onFocus={() => setFocusedInput('businessName')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    {/* Primary Contact Section */}
                    <Text style={styles.subSectionTitle}>Primary Contact</Text>
                    <Text style={styles.subSectionDescription}>
                      This contact will receive all communications
                    </Text>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>First Name *</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'contactFirstName' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.contactFirstName}
                            onChangeText={(text) => setJobData({...jobData, contactFirstName: text})}
                            placeholder="First name"
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setFocusedInput('contactFirstName')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Last Name *</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'contactLastName' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.contactLastName}
                            onChangeText={(text) => setJobData({...jobData, contactLastName: text})}
                            placeholder="Last name"
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setFocusedInput('contactLastName')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Email (Email OR Phone Required)</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'contactEmail' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.contactEmail}
                            onChangeText={(text) => setJobData({...jobData, contactEmail: text})}
                            placeholder="contact@email.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => setFocusedInput('contactEmail')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Phone (Email OR Phone Required)</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'contactPhone' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.contactPhone}
                            onChangeText={(text) => setJobData({...jobData, contactPhone: text})}
                            placeholder="(555) 123-4567"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            onFocus={() => setFocusedInput('contactPhone')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Title (Optional)</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedInput === 'contactTitle' && styles.inputContainerFocused
                      ]}>
                        <TextInput
                          style={styles.input}
                          value={jobData.contactTitle}
                          onChangeText={(text) => setJobData({...jobData, contactTitle: text})}
                          placeholder="e.g., CEO, Manager, Owner"
                          placeholderTextColor="#9CA3AF"
                          onFocus={() => setFocusedInput('contactTitle')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>First Name *</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'firstName' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.firstName}
                            onChangeText={(text) => setJobData({...jobData, firstName: text})}
                            placeholder="First name"
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setFocusedInput('firstName')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Last Name *</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'lastName' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.lastName}
                            onChangeText={(text) => setJobData({...jobData, lastName: text})}
                            placeholder="Last name"
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setFocusedInput('lastName')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Email (Email OR Phone Required)</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'email' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.email}
                            onChangeText={(text) => setJobData({...jobData, email: text})}
                            placeholder="customer@email.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Phone (Email OR Phone Required)</Text>
                        <View style={[
                          styles.inputContainer,
                          focusedInput === 'phone' && styles.inputContainerFocused
                        ]}>
                          <TextInput
                            style={styles.input}
                            value={jobData.phone}
                            onChangeText={(text) => setJobData({...jobData, phone: text})}
                            placeholder="(555) 123-4567"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            onFocus={() => setFocusedInput('phone')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </View>
                      </View>
                    </View>
                  </>
                )
              ) : (
                <>
                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                    <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder={`Search ${jobData.customerType === 'business' ? 'businesses' : 'contacts'}...`}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  {/* Customer List */}
                  <View style={styles.customerList}>
                    {filterItems().map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.customerCard,
                          selectedCustomer?.id === item.id && styles.customerCardSelected
                        ]}
                        onPress={() => setSelectedCustomer(item)}
                      >
                        <Text style={styles.customerName}>{item.name}</Text>
                        {jobData.customerType === 'individual' && (
                          <Text style={styles.customerDetails}>
                            {(item as any).email} • {(item as any).phone}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Job Address Section */}
            <View style={[styles.section, styles.addressSection]}>
              <Text style={styles.sectionTitle}>Job Address</Text>
              <Text style={styles.subSectionDescription}>Where the work will be performed</Text>
              
              {/* Show existing addresses for existing customers */}
              {jobData.customerStatus === 'existing' && selectedCustomer?.addresses && selectedCustomer.addresses.length > 0 && (
                <View style={styles.existingAddresses}>
                  <Text style={styles.inputLabel}>Use existing address:</Text>
                  {selectedCustomer.addresses.map((addr: any) => (
                    <TouchableOpacity
                      key={addr.id}
                      style={[
                        styles.addressCard,
                        selectedAddress?.id === addr.id && styles.addressCardSelected
                      ]}
                      onPress={() => {
                        setSelectedAddress(addr);
                        setJobData({
                          ...jobData,
                          jobStreet: addr.street,
                          jobCity: addr.city,
                          jobState: addr.state,
                          jobZip: addr.zipCode
                        });
                      }}
                    >
                      <Text style={styles.addressStreet}>{addr.street}</Text>
                      <Text style={styles.addressCity}>{addr.city}, {addr.state} {addr.zipCode}</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Or create new address:</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street Address *</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'jobStreet' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    value={jobData.jobStreet}
                    onChangeText={(text) => setJobData({...jobData, jobStreet: text})}
                    placeholder="123 Main Street"
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('jobStreet')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'jobCity' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      value={jobData.jobCity}
                      onChangeText={(text) => setJobData({...jobData, jobCity: text})}
                      placeholder="Anytown"
                      placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocusedInput('jobCity')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'jobState' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      value={jobData.jobState}
                      onChangeText={(text) => setJobData({...jobData, jobState: text})}
                      placeholder="CA"
                      placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocusedInput('jobState')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>ZIP *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'jobZip' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      value={jobData.jobZip}
                      onChangeText={(text) => setJobData({...jobData, jobZip: text})}
                      placeholder="90210"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      onFocus={() => setFocusedInput('jobZip')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Job Frequency Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Job Frequency</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    jobData.jobFrequency === 'one-time' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, jobFrequency: 'one-time'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    jobData.jobFrequency === 'one-time' && styles.selectionTitleSelected
                  ]}>
                    One-Time Job
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Single service job
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    jobData.jobFrequency === 'recurring' && styles.selectionCardSelected
                  ]}
                  onPress={() => setJobData({...jobData, jobFrequency: 'recurring'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    jobData.jobFrequency === 'recurring' && styles.selectionTitleSelected
                  ]}>
                    Recurring Job
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Repeat service schedule
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Job Frequency Specific Info */}
            {jobData.jobFrequency === 'one-time' && (
              <View style={[styles.infoBox, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
                <Info size={20} color="#10B981" />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: '#047857' }]}>One-Time Job</Text>
                  <Text style={[styles.infoText, { color: '#065F46' }]}>
                    A deal card will be automatically created in "Project Accepted" status. 
                    This is a single service job that bypasses the proposal and approval process.
                  </Text>
                </View>
              </View>
            )}

            {jobData.jobFrequency === 'recurring' && (
              <View style={[styles.infoBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Info size={20} color="#3B82F6" />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: '#1E40AF' }]}>Recurring Job</Text>
                  <Text style={[styles.infoText, { color: '#1E40AF' }]}>
                    A deal will be created in "Project Accepted" status. This job will be set up with a recurring schedule. 
                    You can configure the frequency (monthly, quarterly, etc.) and billing cycle in the job details after creation.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        );

      case 4:
        return (
          <ScrollView style={styles.stepContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Job Name *</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'jobName' && styles.inputContainerFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    value={jobData.jobName}
                    onChangeText={(text) => setJobData({...jobData, jobName: text})}
                    placeholder="e.g., House Exterior Painting"
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setFocusedInput('jobName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Job Type *</Text>
                <View style={styles.jobTypeList}>
                  {jobTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.jobTypeCard,
                        jobData.jobType === type.name && styles.jobTypeCardSelected
                      ]}
                      onPress={() => setJobData({...jobData, jobType: type.name})}
                    >
                      <Text style={[
                        styles.jobTypeName,
                        jobData.jobType === type.name && styles.jobTypeNameSelected
                      ]}>
                        {type.name}
                      </Text>
                      <Text style={styles.jobTypeCategory}>{type.category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Job Amount *</Text>
                <View style={[
                  styles.amountInputContainer,
                  focusedInput === 'jobAmount' && styles.inputContainerFocused
                ]}>
                  <DollarSign size={20} color="#6B7280" style={styles.dollarIcon} />
                  <TextInput
                    style={styles.amountInput}
                    value={jobData.jobAmount}
                    onChangeText={(text) => setJobData({...jobData, jobAmount: text})}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    onFocus={() => setFocusedInput('jobAmount')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Auto-Proposal Info */}
              <View style={[styles.infoBox, { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }]}>
                <FileText size={20} color="#D97706" />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: '#92400E' }]}>Proposal Auto-Created</Text>
                  <Text style={[styles.infoText, { color: '#78350F' }]}>
                    A proposal will be automatically generated for this job and marked as "Accepted". 
                    This streamlines the workflow by bypassing the proposal creation and approval process.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 5:
        return (
          <ScrollView style={styles.stepContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invoice Options</Text>
              <Text style={styles.subSectionDescription}>
                Optionally create an invoice when the job is created
              </Text>
              
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setJobData({...jobData, createInvoice: !jobData.createInvoice})}
              >
                <View style={[styles.checkbox, jobData.createInvoice && styles.checkboxChecked]}>
                  {jobData.createInvoice && <Check size={16} color="#FFFFFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkboxLabel}>Create Invoice Now</Text>
                  <Text style={styles.checkboxDescription}>
                    Generate an invoice immediately for this job. The invoice will be in "Draft" status 
                    and can be sent to the customer when ready.
                  </Text>
                </View>
              </TouchableOpacity>

              {jobData.createInvoice && (
                <View style={[styles.infoBox, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
                  <Info size={20} color="#10B981" />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoTitle, { color: '#047857' }]}>Invoice will be created</Text>
                    <Text style={[styles.infoText, { color: '#065F46' }]}>
                      An invoice will be generated with the job amount (${ jobData.jobAmount || '0.00'}) and saved in draft status. 
                      You can review and send it to the customer from the invoices page.
                    </Text>
                  </View>
                </View>
              )}

              {!jobData.createInvoice && (
                <View style={styles.infoBox}>
                  <Info size={20} color="#3B82F6" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>No invoice will be created</Text>
                    <Text style={styles.infoText}>
                      You can create an invoice later from the job details page when you're ready to bill the customer.
                    </Text>
                  </View>
                </View>
              )}

              {/* Ready to Create Summary */}
              <View style={[styles.infoBox, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', marginTop: 24 }]}>
                <Check size={20} color="#6366F1" />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: '#4338CA' }]}>Ready to create job!</Text>
                  <Text style={[styles.infoText, { color: '#4338CA' }]}>
                    The following will be created:
                    {'\n'}• Job in "Project Accepted" stage
                    {'\n'}• Auto-accepted proposal
                    {'\n'}• Pending project to be scheduled
                    {jobData.createInvoice && '\n• Draft invoice ready to send'}
                  </Text>
                </View>
              </View>
            </View>
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
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Create Job</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerDescription}>{getStepDescription()}</Text>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View key={step} style={styles.progressWrapper}>
              <View style={[
                styles.progressStep,
                step === jobStep && styles.progressStepActive,
                step < jobStep && styles.progressStepCompleted
              ]}>
                <Text style={[
                  styles.progressStepText,
                  (step === jobStep || step < jobStep) && styles.progressStepTextActive
                ]}>
                  {step < jobStep ? '✓' : step}
                </Text>
              </View>
              {step < 5 && (
                <View style={[
                  styles.progressLine,
                  step < jobStep && styles.progressLineCompleted
                ]} />
              )}
            </View>
          ))}
        </View>

        {/* Step Title */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderStepContent()}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            disabled={jobStep === 1}
            style={[styles.footerButton, styles.backButton, jobStep === 1 && styles.footerButtonDisabled]}
          >
            <Text style={[styles.footerButtonText, styles.backButtonText, jobStep === 1 && styles.footerButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRightButtons}>
            <TouchableOpacity onPress={handleClose} style={[styles.footerButton, styles.cancelButton]}>
              <Text style={[styles.footerButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            {jobStep === 5 ? (
              <TouchableOpacity
                onPress={handleCreateJob}
                disabled={!canProceedToNext()}
                style={[
                  styles.footerButton,
                  styles.nextButton,
                  !canProceedToNext() && styles.footerButtonDisabled
                ]}
              >
                <Text style={[styles.footerButtonText, styles.nextButtonText]}>
                  Create Job
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                disabled={!canProceedToNext()}
                style={[
                  styles.footerButton,
                  styles.nextButton,
                  !canProceedToNext() && styles.footerButtonDisabled
                ]}
              >
                <Text style={[styles.footerButtonText, styles.nextButtonText]}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#6366F1',
  },
  progressStepCompleted: {
    backgroundColor: '#10B981',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressStepTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: '#10B981',
  },
  stepHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  selectionContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 4,
  },
  subSectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionCard: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  selectionCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  selectionTitleSelected: {
    color: '#6366F1',
  },
  selectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 12,
    marginTop: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
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
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  customerList: {
    gap: 8,
  },
  customerCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  customerCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  addressSection: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  existingAddresses: {
    marginBottom: 16,
  },
  addressCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  addressCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  addressStreet: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressCity: {
    fontSize: 13,
    color: '#6B7280',
  },
  jobTypeList: {
    gap: 8,
  },
  jobTypeCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  jobTypeCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  jobTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  jobTypeNameSelected: {
    color: '#6366F1',
  },
  jobTypeCategory: {
    fontSize: 13,
    color: '#6B7280',
  },
  amountInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  dollarIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  amountInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'transparent',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  footerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: '#374151',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#374151',
  },
  nextButton: {
    backgroundColor: '#6366F1',
  },
  nextButtonText: {
    color: '#FFFFFF',
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
