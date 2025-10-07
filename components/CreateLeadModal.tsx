import { Check, ChevronRight, User, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface CreateLeadModalProps {
  visible: boolean;
  onClose: () => void;
}

interface LeadStage {
  id: string;
  name: string;
  description: string;
  dripSequence?: string;
  color: string;
}

interface LeadSource {
  id: string;
  name: string;
  color: string;
}

interface UserOption {
  id: string;
  name: string;
  role: string;
}

export default function CreateLeadModal({ visible, onClose }: CreateLeadModalProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [leadStep, setLeadStep] = useState(1);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [dripEnabled, setDripEnabled] = useState(true);

  // Form data
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal: '',
  });

  const [selectedStage, setSelectedStage] = useState<LeadStage | null>(null);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<UserOption | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<UserOption | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Mock data - In real app, these would come from API/database
  const leadStages: LeadStage[] = [
    { 
      id: 'new', 
      name: 'New Lead', 
      description: 'Fresh lead that needs initial contact',
      dripSequence: 'New Lead Nurture (5 emails over 2 weeks)',
      color: '#3B82F6'
    },
    { 
      id: 'contacted', 
      name: 'Contacted', 
      description: 'Initial contact made, awaiting response',
      dripSequence: 'Follow-up Sequence (3 emails over 1 week)',
      color: '#8B5CF6'
    },
    { 
      id: 'proposal_sent', 
      name: 'Proposal Sent', 
      description: 'Proposal sent, awaiting decision',
      dripSequence: 'Proposal Follow-up (4 emails over 2 weeks)',
      color: '#F59E0B'
    },
  ];

  const leadSources: LeadSource[] = [
    { id: 'website', name: 'Website', color: '#3B82F6' },
    { id: 'google', name: 'Google', color: '#10B981' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'referral', name: 'Referral', color: '#8B5CF6' },
    { id: 'cold_call', name: 'Cold Call', color: '#F59E0B' },
    { id: 'angi', name: 'Angi Leads', color: '#EF4444' },
    { id: 'trade_show', name: 'Trade Show', color: '#06B6D4' },
    { id: 'other', name: 'Other', color: '#6B7280' },
  ];

  const adminUsers: UserOption[] = [
    { id: 'admin1', name: 'Tanner Mullen', role: 'Admin' },
    { id: 'admin2', name: 'Chris Palmer', role: 'Admin' },
  ];

  const salespersonUsers: UserOption[] = [
    { id: 'sales1', name: 'Tanner Mullen', role: 'Sales Manager' },
    { id: 'sales2', name: 'Chris Palmer', role: 'Sales Rep' },
    { id: 'sales3', name: 'Julio Joubert', role: 'Sales Rep' },
  ];

  // Set default admin and salesperson when modal opens
  useEffect(() => {
    if (visible && !selectedAdmin && !selectedSalesperson) {
      setSelectedAdmin(adminUsers[0]);
      setSelectedSalesperson(salespersonUsers[0]);
    }
  }, [visible]);

  const handleClose = () => {
    setLeadStep(1);
    setContactData({ firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', postal: '' });
    setSelectedStage(null);
    setSelectedSource(null);
    setSelectedAdmin(adminUsers[0]); // Reset to default
    setSelectedSalesperson(salespersonUsers[0]); // Reset to default
    setShowStageDropdown(false);
    setShowSourceDropdown(false);
    setShowAdminDropdown(false);
    setShowSalespersonDropdown(false);
    setDripEnabled(true);
    onClose();
  };

  const handleNext = () => {
    if (leadStep === 1) {
      // Validate contact data
      if (!contactData.firstName || !contactData.lastName) {
        Toast.show({
          type: 'error',
          text1: 'Required Fields',
          text2: 'First name and last name are required',
        });
        return;
      }
      if (!contactData.email && !contactData.phone) {
        Toast.show({
          type: 'error',
          text1: 'Contact Required',
          text2: 'Phone number or email is required',
        });
        return;
      }
      if (!selectedSource) {
        Toast.show({
          type: 'error',
          text1: 'Lead Source Required',
          text2: 'Please select a lead source',
        });
        return;
      }
    }

    if (leadStep === 2) {
      if (!selectedStage) {
        Toast.show({
          type: 'error',
          text1: 'Lead Stage Required',
          text2: 'Please select a lead stage',
        });
        return;
      }
    }

    if (leadStep < 4) {
      setLeadStep(leadStep + 1);
    }
  };

  const handleBack = () => {
    if (leadStep > 1) {
      setLeadStep(leadStep - 1);
    }
  };

  const handleCreateLead = () => {
    // In real app, this would create the lead
    Toast.show({
      type: 'success',
      text1: 'Lead Created!',
      text2: 'Lead has been added to the pipeline',
    });

    handleClose();
  };

  const getStepTitle = () => {
    switch (leadStep) {
      case 1: return 'Contact Information';
      case 2: return 'Lead Stage & Drip';
      case 3: return 'User Assignment';
      case 4: return 'Review & Create';
      default: return 'Create Lead';
    }
  };

  const getStepDescription = () => {
    switch (leadStep) {
      case 1: return 'Enter contact details and select lead source';
      case 2: return 'Select lead stage from pipeline';
      case 3: return 'Assign admin and salesperson';
      case 4: return 'Review details and create the lead';
      default: return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Create Lead</Text>
            <Text style={styles.subtitle}>{getStepDescription()}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.progressStep}>
              <View style={[
                styles.progressCircle,
                leadStep >= step && styles.progressCircleActive
              ]}>
                {leadStep > step ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.progressNumber,
                    leadStep < step && styles.progressNumberInactive
                  ]}>{step}</Text>
                )}
              </View>
              {step < 4 && (
                <View style={[
                  styles.progressLine,
                  leadStep > step && styles.progressLineActive
                ]} />
              )}
            </View>
          ))}
        </View>

        <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Contact Information */}
          {leadStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              
              <View style={styles.contactForm}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'firstName' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter first name"
                        placeholderTextColor="#9CA3AF"
                        value={contactData.firstName}
                        onChangeText={(text) => setContactData({...contactData, firstName: text})}
                        onFocus={() => setFocusedInput('firstName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Last Name *</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'lastName' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter last name"
                        placeholderTextColor="#9CA3AF"
                        value={contactData.lastName}
                        onChangeText={(text) => setContactData({...contactData, lastName: text})}
                        onFocus={() => setFocusedInput('lastName')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'email' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter email address"
                      placeholderTextColor="#9CA3AF"
                      value={contactData.email}
                      onChangeText={(text) => setContactData({...contactData, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'phone' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter phone number"
                      placeholderTextColor="#9CA3AF"
                      value={contactData.phone}
                      onChangeText={(text) => setContactData({...contactData, phone: text})}
                      keyboardType="phone-pad"
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <Text style={styles.fieldHelperText}>* Phone OR Email is required</Text>

                <Text style={styles.sectionTitle}>Address (Optional)</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Street Address</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'street' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter street address"
                      placeholderTextColor="#9CA3AF"
                      value={contactData.street}
                      onChangeText={(text) => setContactData({...contactData, street: text})}
                      onFocus={() => setFocusedInput('street')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>City</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'city' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter city"
                        placeholderTextColor="#9CA3AF"
                        value={contactData.city}
                        onChangeText={(text) => setContactData({...contactData, city: text})}
                        onFocus={() => setFocusedInput('city')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'state' && styles.inputContainerFocused
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter state"
                        placeholderTextColor="#9CA3AF"
                        value={contactData.state}
                        onChangeText={(text) => setContactData({...contactData, state: text})}
                        autoCapitalize="characters"
                        maxLength={2}
                        onFocus={() => setFocusedInput('state')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Postal Code</Text>
                  <View style={[
                    styles.inputContainer,
                    focusedInput === 'postal' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter postal code"
                      placeholderTextColor="#9CA3AF"
                      value={contactData.postal}
                      onChangeText={(text) => setContactData({...contactData, postal: text})}
                      keyboardType="number-pad"
                      onFocus={() => setFocusedInput('postal')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Lead Source *</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      setShowSourceDropdown(!showSourceDropdown);
                      if (!showSourceDropdown) {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                      }
                    }}
                  >
                    <View style={styles.dropdownButtonContent}>
                      {selectedSource && (
                        <View style={[styles.sourceDot, { backgroundColor: selectedSource.color }]} />
                      )}
                      <Text style={[
                        styles.dropdownButtonText,
                        !selectedSource && styles.dropdownButtonTextPlaceholder
                      ]}>
                        {selectedSource ? selectedSource.name : 'Select lead source'}
                      </Text>
                    </View>
                    <ChevronRight 
                      size={20} 
                      color="#6B7280" 
                      style={[
                        styles.dropdownIcon,
                        showSourceDropdown && styles.dropdownIconRotated
                      ]}
                    />
                  </TouchableOpacity>

                  {showSourceDropdown && (
                    <View style={styles.dropdownList}>
                      {leadSources.map((source) => (
                        <TouchableOpacity
                          key={source.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedSource(source);
                            setShowSourceDropdown(false);
                          }}
                        >
                          <View style={styles.dropdownItemContent}>
                            <View style={[styles.sourceDot, { backgroundColor: source.color }]} />
                            <Text style={styles.dropdownItemName}>{source.name}</Text>
                          </View>
                          {selectedSource?.id === source.id && (
                            <Check size={20} color="#6366F1" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Step 2: Lead Stage & Drip */}
          {leadStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              
              {/* Lead Stage Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lead Pipeline Stage *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowStageDropdown(!showStageDropdown)}
                >
                  <View style={styles.dropdownButtonContent}>
                    {selectedStage && (
                      <View style={[styles.stageDot, { backgroundColor: selectedStage.color }]} />
                    )}
                    <Text style={[
                      styles.dropdownButtonText,
                      !selectedStage && styles.dropdownButtonTextPlaceholder
                    ]}>
                      {selectedStage ? selectedStage.name : 'Select pipeline stage'}
                    </Text>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color="#6B7280" 
                    style={[
                      styles.dropdownIcon,
                      showStageDropdown && styles.dropdownIconRotated
                    ]}
                  />
                </TouchableOpacity>

                {showStageDropdown && (
                  <View style={styles.dropdownList}>
                    {leadStages.map((stage) => (
                      <TouchableOpacity
                        key={stage.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedStage(stage);
                          setShowStageDropdown(false);
                          setDripEnabled(true); // Reset drip to enabled when stage changes
                        }}
                      >
                        <View style={styles.dropdownItemContent}>
                          <View style={[styles.stageDot, { backgroundColor: stage.color }]} />
                          <View style={styles.dropdownItemTextContainer}>
                            <Text style={styles.dropdownItemName}>{stage.name}</Text>
                            <Text style={styles.dropdownItemDescription}>{stage.description}</Text>
                          </View>
                        </View>
                        {selectedStage?.id === stage.id && (
                          <Check size={20} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Drip Sequence Section */}
              {selectedStage && (
                <View style={styles.dripSection}>
                  <View style={styles.dripHeader}>
                    <Text style={styles.sectionTitle}>Drip Sequence</Text>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        !dripEnabled && styles.toggleButtonDisabled
                      ]}
                      onPress={() => setDripEnabled(!dripEnabled)}
                    >
                      <Text style={[
                        styles.toggleButtonText,
                        !dripEnabled && styles.toggleButtonTextDisabled
                      ]}>
                        {dripEnabled ? 'Enabled' : 'Disabled'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {dripEnabled ? (
                    <View style={styles.dripCard}>
                      <Text style={styles.dripSequenceName}>{selectedStage.dripSequence}</Text>
                      <Text style={styles.dripSequenceDescription}>
                        This sequence will automatically start when the lead is created.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.dripDisabledCard}>
                      <Text style={styles.dripDisabledText}>
                        No drip sequence will be activated. You'll need to follow up manually.
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Step 3: User Assignment */}
          {leadStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              
              {/* Admin Assignment */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assign Admin</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowAdminDropdown(!showAdminDropdown)}
                >
                  <View style={styles.dropdownButtonContent}>
                    {selectedAdmin && <User size={18} color="#6366F1" />}
                    <Text style={[
                      styles.dropdownButtonText,
                      !selectedAdmin && styles.dropdownButtonTextPlaceholder
                    ]}>
                      {selectedAdmin ? selectedAdmin.name : 'Select admin (optional)'}
                    </Text>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color="#6B7280" 
                    style={[
                      styles.dropdownIcon,
                      showAdminDropdown && styles.dropdownIconRotated
                    ]}
                  />
                </TouchableOpacity>

                {showAdminDropdown && (
                  <View style={styles.dropdownList}>
                    {adminUsers.map((user) => (
                      <TouchableOpacity
                        key={user.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedAdmin(user);
                          setShowAdminDropdown(false);
                        }}
                      >
                        <View style={styles.dropdownItemContent}>
                          <User size={18} color="#6366F1" />
                          <View style={styles.dropdownItemTextContainer}>
                            <Text style={styles.dropdownItemName}>{user.name}</Text>
                            <Text style={styles.dropdownItemDescription}>{user.role}</Text>
                          </View>
                        </View>
                        {selectedAdmin?.id === user.id && (
                          <Check size={20} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Salesperson Assignment */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assign Salesperson</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowSalespersonDropdown(!showSalespersonDropdown)}
                >
                  <View style={styles.dropdownButtonContent}>
                    {selectedSalesperson && <User size={18} color="#10B981" />}
                    <Text style={[
                      styles.dropdownButtonText,
                      !selectedSalesperson && styles.dropdownButtonTextPlaceholder
                    ]}>
                      {selectedSalesperson ? selectedSalesperson.name : 'Select salesperson (optional)'}
                    </Text>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color="#6B7280" 
                    style={[
                      styles.dropdownIcon,
                      showSalespersonDropdown && styles.dropdownIconRotated
                    ]}
                  />
                </TouchableOpacity>

                {showSalespersonDropdown && (
                  <View style={styles.dropdownList}>
                    {salespersonUsers.map((user) => (
                      <TouchableOpacity
                        key={user.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedSalesperson(user);
                          setShowSalespersonDropdown(false);
                        }}
                      >
                        <View style={styles.dropdownItemContent}>
                          <User size={18} color="#10B981" />
                          <View style={styles.dropdownItemTextContainer}>
                            <Text style={styles.dropdownItemName}>{user.name}</Text>
                            <Text style={styles.dropdownItemDescription}>{user.role}</Text>
                          </View>
                        </View>
                        {selectedSalesperson?.id === user.id && (
                          <Check size={20} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Step 4: Review & Create */}
          {leadStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Lead Summary</Text>
                
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Contact</Text>
                  <Text style={styles.reviewValue}>
                    {contactData.firstName} {contactData.lastName}
                  </Text>
                  {contactData.email && (
                    <Text style={styles.reviewSubValue}>{contactData.email}</Text>
                  )}
                  {contactData.phone && (
                    <Text style={styles.reviewSubValue}>{contactData.phone}</Text>
                  )}
                  {(contactData.street || contactData.city || contactData.state || contactData.postal) && (
                    <Text style={styles.reviewSubValue}>
                      {[contactData.street, contactData.city, contactData.state, contactData.postal]
                        .filter(Boolean)
                        .join(', ')}
                    </Text>
                  )}
                </View>

                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Lead Source</Text>
                  <View style={styles.reviewValueWithDot}>
                    {selectedSource && (
                      <View style={[styles.sourceDot, { backgroundColor: selectedSource.color }]} />
                    )}
                    <Text style={styles.reviewValue}>{selectedSource?.name}</Text>
                  </View>
                </View>

                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Pipeline Stage</Text>
                  <View style={styles.reviewValueWithDot}>
                    {selectedStage && (
                      <View style={[styles.stageDot, { backgroundColor: selectedStage.color }]} />
                    )}
                    <Text style={styles.reviewValue}>{selectedStage?.name}</Text>
                  </View>
                </View>

                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Drip Sequence</Text>
                  <Text style={styles.reviewValue}>
                    {dripEnabled ? selectedStage?.dripSequence : 'Disabled'}
                  </Text>
                  {dripEnabled && (
                    <Text style={styles.reviewSubValue}>
                      Next email: {selectedStage?.id === 'new' ? 'Immediately' : 'In 1 hour'} after deal creation
                    </Text>
                  )}
                </View>

                {selectedAdmin && (
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewLabel}>Admin</Text>
                    <Text style={styles.reviewValue}>{selectedAdmin.name}</Text>
                  </View>
                )}

                {selectedSalesperson && (
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewLabel}>Salesperson</Text>
                    <Text style={styles.reviewValue}>{selectedSalesperson.name}</Text>
                  </View>
                )}
              </View>

              {/* Deal Creation Notice */}
              <View style={styles.noticeCard}>
                <Text style={styles.noticeTitle}>📋 Deal Creation</Text>
                <Text style={styles.noticeText}>
                  A new deal will be automatically created in your pipeline when this lead is added. 
                  The deal will be linked to the contact and follow the assigned drip sequence.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {leadStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.nextButton,
              leadStep === 4 && styles.createButton,
              leadStep === 1 && styles.fullWidthButton
            ]} 
            onPress={leadStep === 4 ? handleCreateLead : handleNext}
          >
            <Text style={styles.nextButtonText}>
              {leadStep === 4 ? 'Create Lead' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  progressCircleActive: {
    backgroundColor: '#6366F1',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressNumberInactive: {
    color: '#9CA3AF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingTop: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
  },
  contactForm: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
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
  fieldHelperText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 8,
  },
  dropdownButton: {
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
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  dropdownButtonTextPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownIcon: {
    transform: [{ rotate: '90deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '270deg' }],
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownItemTextContainer: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  dropdownItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sourceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dripSection: {
    marginTop: 24,
  },
  dripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonDisabled: {
    backgroundColor: '#EF4444',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleButtonTextDisabled: {
    color: '#FFFFFF',
  },
  dripCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  dripSequenceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  dripSequenceDescription: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  dripDisabledCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dripDisabledText: {
    fontSize: 14,
    color: '#991B1B',
  },
  noticeCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  reviewSection: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  reviewValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  reviewSubValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewValueWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 2,
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});