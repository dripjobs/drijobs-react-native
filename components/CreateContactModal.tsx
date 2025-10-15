import { Building2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, MapPin, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateContactModalProps {
  visible: boolean;
  onClose: () => void;
  onContactCreated?: (contact: any) => void;
  onNavigateToBusiness?: () => void;
}

export default function CreateContactModal({ visible, onClose, onContactCreated, onNavigateToBusiness }: CreateContactModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Contact Information
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    secondaryEmail: '',
    secondaryPhone: '',
  });

  // Address Information
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  // Additional Information
  const [additionalData, setAdditionalData] = useState({
    leadSource: '', // NOTE: This becomes originalLeadSource when the contact is saved
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showLeadSourceDropdown, setShowLeadSourceDropdown] = useState(false);

  const leadSources = [
    'Website',
    'Referral',
    'Google Search',
    'Social Media',
    'Cold Call',
    'Trade Show',
    'Advertisement',
    'Email Campaign',
    'Walk-in',
    'Other'
  ];

  const resetForm = () => {
    setCurrentStep(1);
    setContactData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      secondaryEmail: '',
      secondaryPhone: '',
    });
    setAddressData({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    });
    setAdditionalData({
      leadSource: '',
      notes: '',
    });
    setFormErrors({});
    setFocusedInput(null);
  };

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!contactData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!contactData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Require at least one: email OR phone
    const hasEmail = contactData.email.trim();
    const hasPhone = contactData.phone.trim();
    
    if (!hasEmail && !hasPhone) {
      errors.email = 'Either email or phone is required';
      errors.phone = 'Either email or phone is required';
    } else {
      // If email is provided, validate format
      if (hasEmail && !/\S+@\S+\.\S+/.test(contactData.email)) {
        errors.email = 'Email is invalid';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
    setFormErrors({});
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setFormErrors({});
  };

  const handleCreate = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Create contact object with all data
      const newContact = {
        id: Date.now(),
        name: `${contactData.firstName} ${contactData.lastName}`,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        secondaryEmail: contactData.secondaryEmail,
        secondaryPhone: contactData.secondaryPhone,
        company: '',
        address: addressData.street ? 
          `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zip}` : 
          '',
        fullAddress: addressData,
        leadSource: additionalData.leadSource,
        originalLeadSource: additionalData.leadSource,
        notes: additionalData.notes,
        createdAt: new Date().toISOString(),
        deals: [],
        proposals: [],
        appointments: [],
        invoices: [],
        tasks: [],
        lifetimeValue: 0,
        status: 'Active',
      };
      
      resetForm();
      onClose();
      
      // Call the callback with the new contact
      if (onContactCreated) {
        onContactCreated(newContact);
      }
    }, 1500);
  };

  const handleClose = () => {
    if (currentStep > 1 || contactData.firstName || contactData.lastName || contactData.email) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard this contact?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            }
          }
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Contact Info</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
      
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Address</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
      
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Details</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepDescription}>
        Enter the contact's basic information
      </Text>

      {/* Business Creation Helper */}
      {onNavigateToBusiness && (
        <TouchableOpacity 
          style={styles.businessHelperBanner}
          onPress={() => {
            resetForm();
            onClose();
            onNavigateToBusiness();
          }}
        >
          <Building2 size={20} color="#6366F1" />
          <Text style={styles.businessHelperText}>
            Need to add a new business? <Text style={styles.businessHelperLink}>Click here</Text>
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>First Name *</Text>
        <TextInput
          style={[
            styles.formInput, 
            formErrors.firstName && styles.formInputError,
            focusedInput === 'firstName' && styles.formInputFocused
          ]}
          value={contactData.firstName}
          onChangeText={(text) => setContactData({...contactData, firstName: text})}
          onFocus={() => setFocusedInput('firstName')}
          onBlur={() => setFocusedInput(null)}
          placeholder="John"
        />
        {formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Last Name *</Text>
        <TextInput
          style={[
            styles.formInput, 
            formErrors.lastName && styles.formInputError,
            focusedInput === 'lastName' && styles.formInputFocused
          ]}
          value={contactData.lastName}
          onChangeText={(text) => setContactData({...contactData, lastName: text})}
          onFocus={() => setFocusedInput('lastName')}
          onBlur={() => setFocusedInput(null)}
          placeholder="Smith"
        />
        {formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Email *</Text>
        <TextInput
          style={[
            styles.formInput, 
            formErrors.email && styles.formInputError,
            focusedInput === 'email' && styles.formInputFocused
          ]}
          value={contactData.email}
          onChangeText={(text) => setContactData({...contactData, email: text})}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
          placeholder="john.smith@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Phone *</Text>
        <TextInput
          style={[
            styles.formInput, 
            formErrors.phone && styles.formInputError,
            focusedInput === 'phone' && styles.formInputFocused
          ]}
          value={contactData.phone}
          onChangeText={(text) => setContactData({...contactData, phone: text})}
          onFocus={() => setFocusedInput('phone')}
          onBlur={() => setFocusedInput(null)}
          placeholder="+1 (555) 123-4567"
          keyboardType="phone-pad"
        />
        {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Secondary Email</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'secondaryEmail' && styles.formInputFocused
          ]}
          value={contactData.secondaryEmail}
          onChangeText={(text) => setContactData({...contactData, secondaryEmail: text})}
          onFocus={() => setFocusedInput('secondaryEmail')}
          onBlur={() => setFocusedInput(null)}
          placeholder="john.alternate@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Secondary Phone</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'secondaryPhone' && styles.formInputFocused
          ]}
          value={contactData.secondaryPhone}
          onChangeText={(text) => setContactData({...contactData, secondaryPhone: text})}
          onFocus={() => setFocusedInput('secondaryPhone')}
          onBlur={() => setFocusedInput(null)}
          placeholder="+1 (555) 987-6543"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Address</Text>
      <Text style={styles.stepDescription}>
        Add the contact's address (optional)
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Street Address</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'street' && styles.formInputFocused
          ]}
          value={addressData.street}
          onChangeText={(text) => setAddressData({...addressData, street: text})}
          onFocus={() => setFocusedInput('street')}
          onBlur={() => setFocusedInput(null)}
          placeholder="123 Main St"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>City</Text>
          <TextInput
            style={[
              styles.formInput,
              focusedInput === 'city' && styles.formInputFocused
            ]}
            value={addressData.city}
            onChangeText={(text) => setAddressData({...addressData, city: text})}
            onFocus={() => setFocusedInput('city')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Austin"
          />
        </View>

        <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>State</Text>
          <TextInput
            style={[
              styles.formInput,
              focusedInput === 'state' && styles.formInputFocused
            ]}
            value={addressData.state}
            onChangeText={(text) => setAddressData({...addressData, state: text})}
            onFocus={() => setFocusedInput('state')}
            onBlur={() => setFocusedInput(null)}
            placeholder="TX"
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>ZIP Code</Text>
          <TextInput
            style={[
              styles.formInput,
              focusedInput === 'zip' && styles.formInputFocused
            ]}
            value={addressData.zip}
            onChangeText={(text) => setAddressData({...addressData, zip: text})}
            onFocus={() => setFocusedInput('zip')}
            onBlur={() => setFocusedInput(null)}
            placeholder="78701"
            keyboardType="number-pad"
          />
        </View>

        <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>Country</Text>
          <TextInput
            style={[
              styles.formInput,
              focusedInput === 'country' && styles.formInputFocused
            ]}
            value={addressData.country}
            onChangeText={(text) => setAddressData({...addressData, country: text})}
            onFocus={() => setFocusedInput('country')}
            onBlur={() => setFocusedInput(null)}
            placeholder="United States"
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <MapPin size={20} color="#6366F1" />
        <Text style={styles.infoBoxText}>
          You can skip this step and add an address later from the contact details page.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Additional Details</Text>
      <Text style={styles.stepDescription}>
        Add extra information about this contact (optional)
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Lead Source</Text>
        <Text style={styles.formHelper}>How did you find this contact?</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={[
              styles.dropdownButton,
              showLeadSourceDropdown && styles.dropdownButtonActive
            ]}
            onPress={() => setShowLeadSourceDropdown(!showLeadSourceDropdown)}
          >
            <Text style={[
              styles.dropdownText,
              !additionalData.leadSource && styles.dropdownPlaceholder
            ]}>
              {additionalData.leadSource || 'Select lead source'}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
          
          {showLeadSourceDropdown && (
            <View style={styles.dropdownMenu}>
              <ScrollView 
                style={styles.dropdownScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {leadSources.map((source) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.dropdownOption,
                      additionalData.leadSource === source && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setAdditionalData({...additionalData, leadSource: source});
                      setShowLeadSourceDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      additionalData.leadSource === source && styles.dropdownOptionTextSelected
                    ]}>
                      {source}
                    </Text>
                    {additionalData.leadSource === source && (
                      <CheckSquare size={18} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Notes</Text>
        <TextInput
          style={[
            styles.formInput, 
            styles.textArea,
            focusedInput === 'notes' && styles.formInputFocused
          ]}
          value={additionalData.notes}
          onChangeText={(text) => setAdditionalData({...additionalData, notes: text})}
          onFocus={() => setFocusedInput('notes')}
          onBlur={() => setFocusedInput(null)}
          placeholder="Add any notes about this contact..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.infoBox}>
        <User size={20} color="#6366F1" />
        <Text style={styles.infoBoxText}>
          Additional information helps you track and manage your relationships with contacts effectively.
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Contact</Text>
          <View style={{ width: 40 }} />
        </View>

        {renderStepIndicator()}

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <ChevronLeft size={20} color="#6366F1" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          {currentStep < 3 ? (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.createButton, isSaving && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={isSaving}
            >
              <Text style={styles.createButtonText}>
                {isSaving ? 'Creating...' : 'Create Contact'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#6366F1',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
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
    lineHeight: 22,
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  formInputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FAFBFF',
  },
  formInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  formHelper: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  // Dropdown Styles
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dropdownButtonActive: {
    borderColor: '#6366F1',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1D1D1F',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  dropdownOptionTextSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  businessHelperBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  businessHelperText: {
    flex: 1,
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 20,
  },
  businessHelperLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

