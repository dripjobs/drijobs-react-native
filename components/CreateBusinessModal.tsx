import { CheckSquare, ChevronLeft, ChevronRight, MapPin, Plus, Search, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateBusinessModalProps {
  visible: boolean;
  onClose: () => void;
  onBusinessCreated?: (business: any) => void;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface AdditionalContact extends ContactFormData {
  id: string;
  isPrimary: boolean;
}

export default function CreateBusinessModal({ visible, onClose, onBusinessCreated }: CreateBusinessModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Business Information
  const [businessData, setBusinessData] = useState({
    name: '',
    dba: '',
    website: '',
    originalLeadSource: '', // NOTE: This is the original lead source for this business
  });

  // Primary Contact
  const [primaryContactMode, setPrimaryContactMode] = useState<'search' | 'create'>('create');
  const [selectedPrimaryContact, setSelectedPrimaryContact] = useState<any>(null);
  const [primaryContactData, setPrimaryContactData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Primary Contact',
  });

  // Billing Address
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [useSameAsBusiness, setUseSameAsBusiness] = useState(true);

  // Additional Contacts
  const [additionalContacts, setAdditionalContacts] = useState<AdditionalContact[]>([]);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactData, setNewContactData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });

  // Search
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const contactRoles = [
    'Primary Contact',
    'Owner',
    'Manager',
    'Billing Manager',
    'Accounts Payable',
    'Accounts Receivable',
    'Operations Manager',
    'Project Manager',
    'Supervisor',
    'Foreman',
    'Sales Representative',
    'Accountant',
    'Administrative Assistant',
    'Other'
  ];

  // Mock contacts for searching
  const allContacts = [
    { id: 101, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '+1 (555) 123-4567', company: 'TechCorp Inc.' },
    { id: 102, name: 'Mike Chen', email: 'mike@email.com', phone: '+1 (555) 987-6543', company: 'StartupXYZ' },
    { id: 103, name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '+1 (555) 456-7890', company: 'InnovateNow' },
    { id: 104, name: 'David Kim', email: 'david.kim@email.com', phone: '+1 (555) 321-0987', company: 'DevSolutions' },
    { id: 105, name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 (555) 654-3210', company: 'GrowthCo' },
  ];

  const filteredContacts = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.phone.includes(contactSearchQuery)
  );

  const resetForm = () => {
    setCurrentStep(1);
    setBusinessData({
      name: '',
      dba: '',
      website: '',
    });
    setPrimaryContactMode('create');
    setSelectedPrimaryContact(null);
    setPrimaryContactData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Primary Contact',
    });
    setBillingAddress({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    });
    setUseSameAsBusiness(true);
    setAdditionalContacts([]);
    setShowAddContactForm(false);
    setNewContactData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
    });
    setContactSearchQuery('');
    setFormErrors({});
  };

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!businessData.name.trim()) {
      errors.name = 'Business name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: {[key: string]: string} = {};
    
    if (primaryContactMode === 'create') {
      if (!primaryContactData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!primaryContactData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      
      if (!primaryContactData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(primaryContactData.email)) {
        errors.email = 'Email is invalid';
      }
      
      if (!primaryContactData.phone.trim()) {
        errors.phone = 'Phone is required';
      }
    } else if (!selectedPrimaryContact) {
      errors.contact = 'Please select a primary contact';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
    setFormErrors({});
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setFormErrors({});
  };

  const handleAddAdditionalContact = () => {
    const errors: {[key: string]: string} = {};
    
    if (!newContactData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!newContactData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!newContactData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newContactData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!newContactData.phone.trim()) {
      errors.phone = 'Phone is required';
    }

    if (!newContactData.role.trim()) {
      errors.role = 'Role is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newContact: AdditionalContact = {
      ...newContactData,
      id: Date.now().toString(),
      isPrimary: false,
    };

    setAdditionalContacts([...additionalContacts, newContact]);
    setNewContactData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
    });
    setShowAddContactForm(false);
    setFormErrors({});
  };

  const handleRemoveContact = (id: string) => {
    setAdditionalContacts(additionalContacts.filter(c => c.id !== id));
  };

  const handleCreate = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Create business object with all data
      const newBusiness = {
        id: Date.now(),
        name: businessData.name,
        dba: businessData.dba,
        website: businessData.website,
        industry: 'Construction', // Default for now
        email: primaryContactMode === 'create' ? primaryContactData.email : selectedPrimaryContact?.email,
        phone: primaryContactMode === 'create' ? primaryContactData.phone : selectedPrimaryContact?.phone,
        primaryContact: primaryContactMode === 'create' 
          ? {
              name: `${primaryContactData.firstName} ${primaryContactData.lastName}`,
              email: primaryContactData.email,
              phone: primaryContactData.phone,
              role: primaryContactData.role,
            }
          : selectedPrimaryContact,
        billingAddress: !useSameAsBusiness ? billingAddress : null,
        lifetimeRevenue: 0,
        openBalance: 0,
        unpaidInvoicesCount: 0,
        contactCount: 1 + additionalContacts.length,
        additionalContacts: additionalContacts,
      };
      
      resetForm();
      onClose();
      
      // Navigate to business details
      if (onBusinessCreated) {
        onBusinessCreated(newBusiness);
      }
    }, 1500);
  };

  const handleClose = () => {
    if (currentStep > 1 || businessData.name) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard this business?',
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
        <Text style={styles.stepLabel}>Business Info</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
      
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Primary Contact</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
      
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Billing</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 4 && styles.stepLineActive]} />
      
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 4 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, currentStep >= 4 && styles.stepNumberActive]}>4</Text>
        </View>
        <Text style={styles.stepLabel}>Contacts</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Business Information</Text>
      <Text style={styles.stepDescription}>
        Enter the basic business details. Contact information will be managed through the primary contact.
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Legal Business Name *</Text>
        <TextInput
          style={[
            styles.formInput, 
            formErrors.name && styles.formInputError,
            focusedInput === 'name' && styles.formInputFocused
          ]}
          value={businessData.name}
          onChangeText={(text) => setBusinessData({...businessData, name: text})}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
          placeholder="e.g., Acme Construction Inc."
        />
        {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>DBA (Doing Business As)</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'dba' && styles.formInputFocused
          ]}
          value={businessData.dba}
          onChangeText={(text) => setBusinessData({...businessData, dba: text})}
          onFocus={() => setFocusedInput('dba')}
          onBlur={() => setFocusedInput(null)}
          placeholder="Optional - e.g., Acme Builders"
        />
        <Text style={styles.formHelper}>The name the business operates under, if different from legal name</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Website</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'website' && styles.formInputFocused
          ]}
          value={businessData.website}
          onChangeText={(text) => setBusinessData({...businessData, website: text})}
          onFocus={() => setFocusedInput('website')}
          onBlur={() => setFocusedInput(null)}
          placeholder="https://www.business.com"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Lead Source</Text>
        <TextInput
          style={[
            styles.formInput,
            focusedInput === 'originalLeadSource' && styles.formInputFocused
          ]}
          value={businessData.originalLeadSource}
          onChangeText={(text) => setBusinessData({...businessData, originalLeadSource: text})}
          onFocus={() => setFocusedInput('originalLeadSource')}
          onBlur={() => setFocusedInput(null)}
          placeholder="e.g., Referral, Website, Trade Show"
        />
        <Text style={styles.formHelper}>How did this business first hear about you?</Text>
      </View>

      <View style={styles.infoBox}>
        <User size={20} color="#6366F1" />
        <Text style={styles.infoBoxText}>
          Email and phone numbers are managed through contacts. The primary contact's information will be used for business communications.
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Primary Contact</Text>
      <Text style={styles.stepDescription}>
        Every business must have a primary contact. This person will receive all communications when the business becomes a deal.
      </Text>

      <View style={styles.modeToggleContainer}>
        <TouchableOpacity 
          style={[styles.modeToggleButton, primaryContactMode === 'create' && styles.modeToggleButtonActive]}
          onPress={() => {
            setPrimaryContactMode('create');
            setFormErrors({});
          }}
        >
          <Plus size={18} color={primaryContactMode === 'create' ? '#FFFFFF' : '#6366F1'} />
          <Text style={[styles.modeToggleButtonText, primaryContactMode === 'create' && styles.modeToggleButtonTextActive]}>
            Create New
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modeToggleButton, primaryContactMode === 'search' && styles.modeToggleButtonActive]}
          onPress={() => {
            setPrimaryContactMode('search');
            setFormErrors({});
          }}
        >
          <Search size={18} color={primaryContactMode === 'search' ? '#FFFFFF' : '#6366F1'} />
          <Text style={[styles.modeToggleButtonText, primaryContactMode === 'search' && styles.modeToggleButtonTextActive]}>
            Search Existing
          </Text>
        </TouchableOpacity>
      </View>

      {primaryContactMode === 'create' ? (
        <View>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>First Name *</Text>
            <TextInput
              style={[
                styles.formInput, 
                formErrors.firstName && styles.formInputError,
                focusedInput === 'firstName' && styles.formInputFocused
              ]}
              value={primaryContactData.firstName}
              onChangeText={(text) => setPrimaryContactData({...primaryContactData, firstName: text})}
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
              value={primaryContactData.lastName}
              onChangeText={(text) => setPrimaryContactData({...primaryContactData, lastName: text})}
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
              value={primaryContactData.email}
              onChangeText={(text) => setPrimaryContactData({...primaryContactData, email: text})}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="john@business.com"
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
              value={primaryContactData.phone}
              onChangeText={(text) => setPrimaryContactData({...primaryContactData, phone: text})}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
            {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
          </View>
        </View>
      ) : (
        <View>
          <View style={[
            styles.searchInputContainer,
            focusedInput === 'contactSearch' && styles.searchInputContainerFocused
          ]}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInputField}
              placeholder="Search by name, email, or phone..."
              value={contactSearchQuery}
              onChangeText={setContactSearchQuery}
              onFocus={() => setFocusedInput('contactSearch')}
              onBlur={() => setFocusedInput(null)}
            />
            {contactSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setContactSearchQuery('')}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {contactSearchQuery.length > 0 && (
            <View style={styles.searchResults}>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={[
                      styles.contactSearchItem,
                      selectedPrimaryContact?.id === contact.id && styles.contactSearchItemSelected
                    ]}
                    onPress={() => setSelectedPrimaryContact(contact)}
                  >
                    <View style={styles.contactSearchAvatar}>
                      <User size={20} color="#6366F1" />
                    </View>
                    <View style={styles.contactSearchInfo}>
                      <Text style={styles.contactSearchName}>{contact.name}</Text>
                      <Text style={styles.contactSearchEmail}>{contact.email}</Text>
                      <Text style={styles.contactSearchPhone}>{contact.phone}</Text>
                    </View>
                    {selectedPrimaryContact?.id === contact.id && (
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

          {formErrors.contact && <Text style={styles.errorText}>{formErrors.contact}</Text>}
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Billing Address</Text>
      <Text style={styles.stepDescription}>
        Add a billing address for invoices and payments (optional)
      </Text>

      <TouchableOpacity 
        style={styles.checkboxRow}
        onPress={() => setUseSameAsBusiness(!useSameAsBusiness)}
      >
        <View style={styles.checkbox}>
          {useSameAsBusiness && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Use business address for billing</Text>
      </TouchableOpacity>

      {!useSameAsBusiness && (
        <>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Street Address</Text>
            <TextInput
              style={[
                styles.formInput,
                focusedInput === 'street' && styles.formInputFocused
              ]}
              value={billingAddress.street}
              onChangeText={(text) => setBillingAddress({...billingAddress, street: text})}
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
                value={billingAddress.city}
                onChangeText={(text) => setBillingAddress({...billingAddress, city: text})}
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
                value={billingAddress.state}
                onChangeText={(text) => setBillingAddress({...billingAddress, state: text})}
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
                value={billingAddress.zip}
                onChangeText={(text) => setBillingAddress({...billingAddress, zip: text})}
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
                value={billingAddress.country}
                onChangeText={(text) => setBillingAddress({...billingAddress, country: text})}
                onFocus={() => setFocusedInput('country')}
                onBlur={() => setFocusedInput(null)}
                placeholder="United States"
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.infoBox}>
        <MapPin size={20} color="#6366F1" />
        <Text style={styles.infoBoxText}>
          You can skip this step and add a billing address later from the business details page.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Additional Contacts</Text>
      <Text style={styles.stepDescription}>
        Add more contacts to this business and assign their roles (optional)
      </Text>

      {additionalContacts.length > 0 && (
        <View style={styles.contactsList}>
          {additionalContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactCardAvatar}>
                <User size={20} color="#6366F1" />
              </View>
              <View style={styles.contactCardInfo}>
                <Text style={styles.contactCardName}>
                  {contact.firstName} {contact.lastName}
                </Text>
                <Text style={styles.contactCardEmail}>{contact.email}</Text>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{contact.role}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemoveContact(contact.id)}>
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {!showAddContactForm ? (
        <TouchableOpacity 
          style={styles.addContactButton}
          onPress={() => setShowAddContactForm(true)}
        >
          <Plus size={20} color="#6366F1" />
          <Text style={styles.addContactButtonText}>Add Contact</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addContactForm}>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>First Name *</Text>
            <TextInput
              style={[
                styles.formInput, 
                formErrors.firstName && styles.formInputError,
                focusedInput === 'addFirstName' && styles.formInputFocused
              ]}
              value={newContactData.firstName}
              onChangeText={(text) => setNewContactData({...newContactData, firstName: text})}
              onFocus={() => setFocusedInput('addFirstName')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Jane"
            />
            {formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Last Name *</Text>
            <TextInput
              style={[
                styles.formInput, 
                formErrors.lastName && styles.formInputError,
                focusedInput === 'addLastName' && styles.formInputFocused
              ]}
              value={newContactData.lastName}
              onChangeText={(text) => setNewContactData({...newContactData, lastName: text})}
              onFocus={() => setFocusedInput('addLastName')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Doe"
            />
            {formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={[
                styles.formInput, 
                formErrors.email && styles.formInputError,
                focusedInput === 'addEmail' && styles.formInputFocused
              ]}
              value={newContactData.email}
              onChangeText={(text) => setNewContactData({...newContactData, email: text})}
              onFocus={() => setFocusedInput('addEmail')}
              onBlur={() => setFocusedInput(null)}
              placeholder="jane@business.com"
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
                focusedInput === 'addPhone' && styles.formInputFocused
              ]}
              value={newContactData.phone}
              onChangeText={(text) => setNewContactData({...newContactData, phone: text})}
              onFocus={() => setFocusedInput('addPhone')}
              onBlur={() => setFocusedInput(null)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
            {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Role *</Text>
            <View style={styles.roleGrid}>
              {contactRoles.filter(r => r !== 'Primary Contact').map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleChip,
                    newContactData.role === role && styles.roleChipActive
                  ]}
                  onPress={() => setNewContactData({...newContactData, role})}
                >
                  <Text style={[
                    styles.roleChipText,
                    newContactData.role === role && styles.roleChipTextActive
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {formErrors.role && <Text style={styles.errorText}>{formErrors.role}</Text>}
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setShowAddContactForm(false);
                setNewContactData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  role: '',
                });
                setFormErrors({});
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddAdditionalContact}
            >
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.infoBox}>
        <User size={20} color="#6366F1" />
        <Text style={styles.infoBoxText}>
          You can add more contacts later. Common roles include Billing Manager, Operations Manager, and Accounts Payable.
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
          <Text style={styles.title}>Create Business</Text>
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
          {currentStep === 4 && renderStep4()}
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

          {currentStep < 4 ? (
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
                {isSaving ? 'Creating...' : 'Create Business'}
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
    width: 40,
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
    marginTop: 6,
    lineHeight: 16,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FAFBFF',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  formRow: {
    flexDirection: 'row',
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
  contactsList: {
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactCardInfo: {
    flex: 1,
  },
  contactCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactCardEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  roleTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  addContactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  addContactForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  addButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
});

