import { useRouter } from 'expo-router';
import { Building, Check, FileText, Info, Search, User as UserIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface NewProposalModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewProposalModal({ visible, onClose }: NewProposalModalProps) {
  const router = useRouter();
  const [proposalStep, setProposalStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [proposalData, setProposalData] = useState({
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
    // Billing address fields
    useDifferentBilling: false,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    // Salesperson & sources
    salesperson: '',
    leadSource: '',
    jobSource: '',
    // Template selection
    proposalType: '', // 'blank' or 'template'
    // Recurring job settings
    jobFrequency: '', // 'one-time' or 'recurring'
    createDealForRecurring: false
  });

  // Sample data
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

  const salespeople = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'Sales Representative', isCurrent: true },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Senior Sales Rep' },
    { id: '3', name: 'Mike Davis', email: 'mike@company.com', role: 'Sales Manager' }
  ];

  const leadSources = [
    { id: '1', name: 'Website', category: 'Digital' },
    { id: '2', name: 'Referral', category: 'Word of Mouth' },
    { id: '3', name: 'Social Media', category: 'Digital' },
    { id: '4', name: 'Cold Call', category: 'Outbound' }
  ];

  const jobSources = [
    { id: '1', name: 'Existing Customer', category: 'Retention' },
    { id: '2', name: 'Repeat Project', category: 'Retention' },
    { id: '3', name: 'Upgrade/Add-on', category: 'Expansion' }
  ];

  const proposalTemplates = [
    { id: '1', name: 'Standard Pressure Washing', description: 'Basic pressure washing service template', lastUsed: '2 days ago' },
    { id: '2', name: 'Roof Cleaning Package', description: 'Complete roof cleaning with warranty', lastUsed: '1 week ago' },
    { id: '3', name: 'Commercial Building Wash', description: 'Multi-story commercial building service', lastUsed: '3 weeks ago' },
    { id: '4', name: 'Driveway & Sidewalk', description: 'Concrete surface cleaning', lastUsed: '1 month ago' },
    { id: '5', name: 'Fleet Vehicle Washing', description: 'Commercial vehicle cleaning service', lastUsed: '2 months ago' }
  ];

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const canProceedToNext = () => {
    switch (proposalStep) {
      case 1:
        return proposalData.customerType && proposalData.customerStatus;
      case 2:
        // Validate customer info
        let hasCustomerInfo = false;
        if (proposalData.customerStatus === 'existing') {
          hasCustomerInfo = selectedCustomer !== null;
        } else {
          if (proposalData.customerType === 'business') {
            hasCustomerInfo = proposalData.businessName.trim() !== '' &&
                   proposalData.contactFirstName.trim() !== '' &&
                   proposalData.contactLastName.trim() !== '' &&
                   proposalData.contactEmail.trim() !== '' &&
                   proposalData.contactPhone.trim() !== '';
          } else {
            hasCustomerInfo = proposalData.firstName.trim() !== '' &&
                   proposalData.lastName.trim() !== '';
          }
        }
        
        // Validate job address
        const hasJobAddress = proposalData.jobStreet.trim() !== '' && proposalData.jobCity.trim() !== '';
        
        // Validate billing address if different
        if (proposalData.useDifferentBilling) {
          const hasBillingAddress = proposalData.billingStreet.trim() !== '' &&
                                   proposalData.billingCity.trim() !== '' &&
                                   proposalData.billingState.trim() !== '' &&
                                   proposalData.billingZip.trim() !== '';
          return hasCustomerInfo && hasJobAddress && hasBillingAddress;
        }
        
        return hasCustomerInfo && hasJobAddress;
      case 3:
        return selectedSalesperson !== null && selectedSource !== null;
      case 4:
        if (proposalData.proposalType === 'template') {
          return selectedTemplate !== null;
        }
        return proposalData.proposalType !== '';
      case 5:
        return proposalData.jobFrequency !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && proposalStep < 5) {
      setProposalStep(proposalStep + 1);
    }
  };

  const handleBack = () => {
    if (proposalStep > 1) {
      setProposalStep(proposalStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setProposalStep(1);
    setSearchQuery('');
    setTemplateSearchQuery('');
    setSelectedCustomer(null);
    setSelectedAddress(null);
    setSelectedSalesperson(null);
    setSelectedSource(null);
    setSelectedTemplate(null);
    setProposalData({
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
      useDifferentBilling: false,
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      salesperson: '',
      leadSource: '',
      jobSource: '',
      proposalType: '',
      jobFrequency: '',
      createDealForRecurring: false
    });
  };

  const handleCreateProposal = () => {
    // Generate a mock proposal ID
    const proposalId = `prop_${Date.now()}`;
    
    // Close modal and navigate to proposal builder
    handleClose();
    router.push(`/proposal-builder?id=${proposalId}`);
  };

  const filterItems = () => {
    const items = proposalData.customerType === 'business' ? existingBusinesses : existingCustomers;
    if (!searchQuery) return items;
    
    return items.filter(item => {
      if (proposalData.customerType === 'business') {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item as any).email.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item as any).phone.includes(searchQuery);
      }
    });
  };

  const filterTemplates = () => {
    if (!templateSearchQuery) return proposalTemplates;
    return proposalTemplates.filter(template =>
      template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchQuery.toLowerCase())
    );
  };

  const getStepTitle = () => {
    switch (proposalStep) {
      case 1: return 'Select Proposal Type';
      case 2: return 'Customer Information & Job Address';
      case 3: return 'Salesperson & Sources';
      case 4: return 'Proposal Setup';
      case 5: return 'Job Frequency';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (proposalStep) {
      case 1: return 'Choose whether this proposal is for a business or individual customer';
      case 2: return 'Enter customer details and job address';
      case 3: return 'Assign a salesperson and select the appropriate source';
      case 4: return 'Choose to start from scratch or use a template';
      case 5: return 'Specify if this is a one-time or recurring job';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (proposalStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            {/* Customer Type Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Customer Type</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    proposalData.customerType === 'individual' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, customerType: 'individual'})}
                >
                  <UserIcon size={24} color={proposalData.customerType === 'individual' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.customerType === 'individual' && styles.selectionTitleSelected
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
                    proposalData.customerType === 'business' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, customerType: 'business'})}
                >
                  <Building size={24} color={proposalData.customerType === 'business' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.customerType === 'business' && styles.selectionTitleSelected
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
              <Text style={styles.sectionLabel}>Customer Status</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    proposalData.customerStatus === 'existing' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, customerStatus: 'existing'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.customerStatus === 'existing' && styles.selectionTitleSelected
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
                    proposalData.customerStatus === 'new' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, customerStatus: 'new'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.customerStatus === 'new' && styles.selectionTitleSelected
                  ]}>
                    New
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Not in your database yet
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Info size={20} color="#3B82F6" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>What happens next?</Text>
                <Text style={styles.infoText}>
                  {proposalData.customerStatus === 'new' 
                    ? `You'll enter ${proposalData.customerType === 'business' ? 'business' : 'customer'} details and create a new record.`
                    : `You'll select from existing ${proposalData.customerType === 'business' ? 'businesses' : 'customers'} and add a job source.`
                  }
                </Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Customer Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {proposalData.customerType === 'business' ? 'Business Information' : 'Customer Information'}
              </Text>
              
              {proposalData.customerStatus === 'new' ? (
                proposalData.customerType === 'business' ? (
                  <>
                    {/* Business Name */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Business Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={proposalData.businessName}
                        onChangeText={(text) => setProposalData({...proposalData, businessName: text})}
                        placeholder="Enter business name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    {/* Primary Contact Section */}
                    <Text style={styles.subSectionTitle}>Primary Contact</Text>
                    <Text style={styles.subSectionDescription}>
                      This contact will receive all communications
                    </Text>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>First Name *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.contactFirstName}
                          onChangeText={(text) => setProposalData({...proposalData, contactFirstName: text})}
                          placeholder="First name"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Last Name *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.contactLastName}
                          onChangeText={(text) => setProposalData({...proposalData, contactLastName: text})}
                          placeholder="Last name"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.contactEmail}
                          onChangeText={(text) => setProposalData({...proposalData, contactEmail: text})}
                          placeholder="contact@email.com"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Phone *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.contactPhone}
                          onChangeText={(text) => setProposalData({...proposalData, contactPhone: text})}
                          placeholder="(555) 123-4567"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Title (Optional)</Text>
                      <TextInput
                        style={styles.input}
                        value={proposalData.contactTitle}
                        onChangeText={(text) => setProposalData({...proposalData, contactTitle: text})}
                        placeholder="e.g., CEO, Manager, Owner"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>First Name *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.firstName}
                          onChangeText={(text) => setProposalData({...proposalData, firstName: text})}
                          placeholder="First name"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Last Name *</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.lastName}
                          onChangeText={(text) => setProposalData({...proposalData, lastName: text})}
                          placeholder="Last name"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.email}
                          onChangeText={(text) => setProposalData({...proposalData, email: text})}
                          placeholder="customer@email.com"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>Phone</Text>
                        <TextInput
                          style={styles.input}
                          value={proposalData.phone}
                          onChangeText={(text) => setProposalData({...proposalData, phone: text})}
                          placeholder="(555) 123-4567"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="phone-pad"
                        />
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
                      placeholder={`Search ${proposalData.customerType === 'business' ? 'businesses' : 'contacts'}...`}
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
                        {proposalData.customerType === 'individual' && (
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
              {proposalData.customerStatus === 'existing' && selectedCustomer?.addresses && selectedCustomer.addresses.length > 0 && (
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
                        setProposalData({
                          ...proposalData,
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
                <TextInput
                  style={styles.input}
                  value={proposalData.jobStreet}
                  onChangeText={(text) => setProposalData({...proposalData, jobStreet: text})}
                  placeholder="123 Main Street"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={proposalData.jobCity}
                    onChangeText={(text) => setProposalData({...proposalData, jobCity: text})}
                    placeholder="Anytown"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput
                    style={styles.input}
                    value={proposalData.jobState}
                    onChangeText={(text) => setProposalData({...proposalData, jobState: text})}
                    placeholder="CA"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>ZIP *</Text>
                  <TextInput
                    style={styles.input}
                    value={proposalData.jobZip}
                    onChangeText={(text) => setProposalData({...proposalData, jobZip: text})}
                    placeholder="90210"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Billing Address Toggle */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setProposalData({...proposalData, useDifferentBilling: !proposalData.useDifferentBilling})}
              >
                <View style={[styles.checkbox, proposalData.useDifferentBilling && styles.checkboxChecked]}>
                  {proposalData.useDifferentBilling && <Check size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Use different billing address</Text>
              </TouchableOpacity>

              {proposalData.useDifferentBilling && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Billing Street Address *</Text>
                    <TextInput
                      style={styles.input}
                      value={proposalData.billingStreet}
                      onChangeText={(text) => setProposalData({...proposalData, billingStreet: text})}
                      placeholder="456 Billing Street"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 2 }]}>
                      <Text style={styles.inputLabel}>City *</Text>
                      <TextInput
                        style={styles.input}
                        value={proposalData.billingCity}
                        onChangeText={(text) => setProposalData({...proposalData, billingCity: text})}
                        placeholder="Billing City"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>State *</Text>
                      <TextInput
                        style={styles.input}
                        value={proposalData.billingState}
                        onChangeText={(text) => setProposalData({...proposalData, billingState: text})}
                        placeholder="CA"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>ZIP *</Text>
                      <TextInput
                        style={styles.input}
                        value={proposalData.billingZip}
                        onChangeText={(text) => setProposalData({...proposalData, billingZip: text})}
                        placeholder="90210"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </>
              )}

              {!proposalData.useDifferentBilling && (
                <View style={styles.infoBox}>
                  <Info size={18} color="#3B82F6" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Using job address for billing</Text>
                    <Text style={styles.infoText}>
                      Invoices will be sent to the job address
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Salesperson Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Salesperson *</Text>
              {salespeople.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  style={[
                    styles.listCard,
                    selectedSalesperson?.id === person.id && styles.listCardSelected
                  ]}
                  onPress={() => setSelectedSalesperson(person)}
                >
                  <View style={styles.listCardContent}>
                    <Text style={styles.listCardTitle}>{person.name}</Text>
                    <Text style={styles.listCardSubtitle}>{person.email}</Text>
                  </View>
                  {person.isCurrent && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>You</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Source Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>
                {proposalData.customerStatus === 'new' ? 'Lead Source *' : 'Job Source *'}
              </Text>
              {(proposalData.customerStatus === 'new' ? leadSources : jobSources).map((source) => (
                <TouchableOpacity
                  key={source.id}
                  style={[
                    styles.listCard,
                    selectedSource?.id === source.id && styles.listCardSelected
                  ]}
                  onPress={() => setSelectedSource(source)}
                >
                  <View style={styles.listCardContent}>
                    <Text style={styles.listCardTitle}>{source.name}</Text>
                    <Text style={styles.listCardSubtitle}>{source.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      case 4:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Proposal Type Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Start Proposal</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    proposalData.proposalType === 'blank' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, proposalType: 'blank'})}
                >
                  <FileText size={24} color={proposalData.proposalType === 'blank' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.proposalType === 'blank' && styles.selectionTitleSelected
                  ]}>
                    Blank Proposal
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Start from scratch
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    proposalData.proposalType === 'template' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, proposalType: 'template'})}
                >
                  <FileText size={24} color={proposalData.proposalType === 'template' ? '#6366F1' : '#6B7280'} />
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.proposalType === 'template' && styles.selectionTitleSelected
                  ]}>
                    Use Template
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Start from a saved template
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Template Selection (shown if template is selected) */}
            {proposalData.proposalType === 'template' && (
              <View style={styles.selectionContainer}>
                <Text style={styles.sectionLabel}>Select Template</Text>
                
                {/* Template Search */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    value={templateSearchQuery}
                    onChangeText={setTemplateSearchQuery}
                    placeholder="Search templates..."
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Template List */}
                <View style={styles.templateList}>
                  {filterTemplates().map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateCard,
                        selectedTemplate?.id === template.id && styles.templateCardSelected
                      ]}
                      onPress={() => setSelectedTemplate(template)}
                    >
                      <View style={styles.templateCardContent}>
                        <Text style={styles.templateCardTitle}>{template.name}</Text>
                        <Text style={styles.templateCardDescription}>{template.description}</Text>
                        <Text style={styles.templateCardLastUsed}>Last used: {template.lastUsed}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        );

      case 5:
        return (
          <ScrollView style={styles.stepContent}>
            {/* Job Frequency Selection */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionLabel}>Job Frequency</Text>
              <View style={styles.selectionRow}>
                <TouchableOpacity
                  style={[
                    styles.selectionCard,
                    proposalData.jobFrequency === 'one-time' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, jobFrequency: 'one-time'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.jobFrequency === 'one-time' && styles.selectionTitleSelected
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
                    proposalData.jobFrequency === 'recurring' && styles.selectionCardSelected
                  ]}
                  onPress={() => setProposalData({...proposalData, jobFrequency: 'recurring'})}
                >
                  <Text style={[
                    styles.selectionTitle,
                    proposalData.jobFrequency === 'recurring' && styles.selectionTitleSelected
                  ]}>
                    Recurring Job
                  </Text>
                  <Text style={styles.selectionDescription}>
                    Repeat service schedule
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* One-Time Job Info */}
            {proposalData.jobFrequency === 'one-time' && (
              <View style={[styles.infoBox, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
                <Info size={20} color="#10B981" />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: '#047857' }]}>Deal will be created</Text>
                  <Text style={[styles.infoText, { color: '#065F46' }]}>
                    A deal card will be automatically created in "In Draft" status in the Opportunity stage of your pipeline.
                  </Text>
                </View>
              </View>
            )}

            {/* Recurring Job Options */}
            {proposalData.jobFrequency === 'recurring' && (
              <>
                <View style={styles.infoBox}>
                  <Info size={20} color="#3B82F6" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Recurring Job</Text>
                    <Text style={styles.infoText}>
                      This job will be set up with a recurring schedule. You can configure the frequency and billing cycle in the proposal builder.
                    </Text>
                  </View>
                </View>

                <View style={styles.selectionContainer}>
                  <Text style={styles.sectionLabel}>Deal Creation</Text>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setProposalData({...proposalData, createDealForRecurring: !proposalData.createDealForRecurring})}
                  >
                    <View style={[styles.checkbox, proposalData.createDealForRecurring && styles.checkboxChecked]}>
                      {proposalData.createDealForRecurring && <Check size={16} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.checkboxLabel}>Create a deal for this recurring job</Text>
                      <Text style={styles.checkboxDescription}>
                        Optional: Track this as an opportunity in your pipeline
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Ready to Create Info Box */}
            <View style={[styles.infoBox, { backgroundColor: '#D1FAE5', borderColor: '#10B981', marginTop: 24 }]}>
              <Info size={20} color="#10B981" />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: '#047857' }]}>Ready to create proposal!</Text>
                <Text style={[styles.infoText, { color: '#065F46' }]}>
                  Click "Create Proposal" to start building your proposal in the editor.
                </Text>
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
            <Text style={styles.headerTitle}>New Proposal</Text>
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
                step === proposalStep && styles.progressStepActive,
                step < proposalStep && styles.progressStepCompleted
              ]}>
                <Text style={[
                  styles.progressStepText,
                  (step === proposalStep || step < proposalStep) && styles.progressStepTextActive
                ]}>
                  {step < proposalStep ? '✓' : step}
                </Text>
              </View>
              {step < 5 && (
                <View style={[
                  styles.progressLine,
                  step < proposalStep && styles.progressLineCompleted
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
            disabled={proposalStep === 1}
            style={[styles.footerButton, styles.backButton, proposalStep === 1 && styles.footerButtonDisabled]}
          >
            <Text style={[styles.footerButtonText, styles.backButtonText, proposalStep === 1 && styles.footerButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRightButtons}>
            <TouchableOpacity onPress={handleClose} style={[styles.footerButton, styles.cancelButton]}>
              <Text style={[styles.footerButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            {proposalStep === 5 ? (
              <TouchableOpacity
                onPress={handleCreateProposal}
                disabled={!canProceedToNext()}
                style={[
                  styles.footerButton,
                  styles.nextButton,
                  !canProceedToNext() && styles.footerButtonDisabled
                ]}
              >
                <Text style={[styles.footerButtonText, styles.nextButtonText]}>
                  Create Proposal
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
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
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  listCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  listCardContent: {
    flex: 1,
  },
  listCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  listCardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  templateList: {
    gap: 12,
    marginTop: 8,
  },
  templateCard: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  templateCardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  templateCardContent: {
    gap: 6,
  },
  templateCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  templateCardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  templateCardLastUsed: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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