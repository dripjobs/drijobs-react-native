import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Subcontractor, SubcontractorStatus } from '../types/crew';

interface SubcontractorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subcontractor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  subcontractor: Subcontractor | null;
  mode: 'create' | 'edit';
}

export const SubcontractorForm: React.FC<SubcontractorFormProps> = ({
  isOpen,
  onClose,
  onSave,
  subcontractor,
  mode,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<SubcontractorStatus>('active');
  const [specialties, setSpecialties] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [notes, setNotes] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [insuranceCoverage, setInsuranceCoverage] = useState('');

  useEffect(() => {
    if (subcontractor && mode === 'edit') {
      setCompanyName(subcontractor.companyName);
      setContactPerson(subcontractor.contactPerson);
      setEmail(subcontractor.email);
      setPhone(subcontractor.phone);
      setStatus(subcontractor.status);
      setSpecialties(subcontractor.specialties.join(', '));
      setHourlyRate(subcontractor.hourlyRate?.toString() || '');
      setAddress(subcontractor.address || '');
      setTaxId(subcontractor.taxId || '');
      setNotes(subcontractor.notes || '');
      setInsuranceProvider(subcontractor.insuranceInfo?.provider || '');
      setInsurancePolicyNumber(subcontractor.insuranceInfo?.policyNumber || '');
      setInsuranceExpiryDate(subcontractor.insuranceInfo?.expiryDate || '');
      setInsuranceCoverage(subcontractor.insuranceInfo?.coverageAmount.toString() || '');
    } else {
      resetForm();
    }
  }, [subcontractor, mode, isOpen]);

  const resetForm = () => {
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setStatus('active');
    setSpecialties('');
    setHourlyRate('');
    setAddress('');
    setTaxId('');
    setNotes('');
    setInsuranceProvider('');
    setInsurancePolicyNumber('');
    setInsuranceExpiryDate('');
    setInsuranceCoverage('');
  };

  const handleSave = () => {
    const specialtiesArray = specialties.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const insuranceInfo = insuranceProvider ? {
      provider: insuranceProvider,
      policyNumber: insurancePolicyNumber,
      expiryDate: insuranceExpiryDate,
      coverageAmount: parseFloat(insuranceCoverage) || 0,
    } : undefined;

    const data = {
      companyName,
      contactPerson,
      email,
      phone,
      status,
      specialties: specialtiesArray,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      address: address || undefined,
      taxId: taxId || undefined,
      notes: notes || undefined,
      insuranceInfo,
      rating: subcontractor?.rating,
      totalJobsCompleted: subcontractor?.totalJobsCompleted,
    };

    onSave(data);
    resetForm();
  };

  const statuses: { value: SubcontractorStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'create' ? 'New Subcontractor' : 'Edit Subcontractor'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Enter company name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contact Person *</Text>
              <TextInput
                style={styles.input}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="Primary contact name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@company.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Status *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsRow}>
                  {statuses.map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption.value}
                      style={[
                        styles.optionButton,
                        status === statusOption.value && styles.optionButtonActive,
                      ]}
                      onPress={() => setStatus(statusOption.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          status === statusOption.value && styles.optionTextActive,
                        ]}
                      >
                        {statusOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Specialties (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={specialties}
                onChangeText={setSpecialties}
                placeholder="e.g., Roofing, Painting, Drywall"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Hourly Rate</Text>
              <TextInput
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Business address"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tax ID / EIN</Text>
              <TextInput
                style={styles.input}
                value={taxId}
                onChangeText={setTaxId}
                placeholder="XX-XXXXXXX"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Insurance Provider</Text>
              <TextInput
                style={styles.input}
                value={insuranceProvider}
                onChangeText={setInsuranceProvider}
                placeholder="Provider name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Policy Number</Text>
              <TextInput
                style={styles.input}
                value={insurancePolicyNumber}
                onChangeText={setInsurancePolicyNumber}
                placeholder="Policy number"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={insuranceExpiryDate}
                  onChangeText={setInsuranceExpiryDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Coverage Amount</Text>
                <TextInput
                  style={styles.input}
                  value={insuranceCoverage}
                  onChangeText={setInsuranceCoverage}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  closeButton: {
    padding: 4,
    width: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 4,
    width: 60,
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  form: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  optionTextActive: {
    color: '#3b82f6',
  },
  bottomPadding: {
    height: 40,
  },
});
