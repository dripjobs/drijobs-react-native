import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CrewMember, CrewMemberRole, CrewMemberStatus } from '../types/crew';

interface CrewMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<CrewMember, 'id' | 'employeeNumber' | 'createdAt' | 'updatedAt'>) => void;
  member: CrewMember | null;
  mode: 'create' | 'edit';
}

export const CrewMemberForm: React.FC<CrewMemberFormProps> = ({
  isOpen,
  onClose,
  onSave,
  member,
  mode,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<CrewMemberRole>('technician');
  const [status, setStatus] = useState<CrewMemberStatus>('active');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [skills, setSkills] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  useEffect(() => {
    if (member && mode === 'edit') {
      setFirstName(member.firstName);
      setLastName(member.lastName);
      setEmail(member.email);
      setPhone(member.phone);
      setRole(member.role);
      setStatus(member.status);
      setHourlyRate(member.hourlyRate.toString());
      setHireDate(member.hireDate);
      setSkills(member.skills.join(', '));
      setAddress(member.address || '');
      setNotes(member.notes || '');
      setEmergencyContactName(member.emergencyContact?.name || '');
      setEmergencyContactRelationship(member.emergencyContact?.relationship || '');
      setEmergencyContactPhone(member.emergencyContact?.phone || '');
    } else {
      resetForm();
    }
  }, [member, mode, isOpen]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('technician');
    setStatus('active');
    setHourlyRate('');
    setHireDate(new Date().toISOString().split('T')[0]);
    setSkills('');
    setAddress('');
    setNotes('');
    setEmergencyContactName('');
    setEmergencyContactRelationship('');
    setEmergencyContactPhone('');
  };

  const handleSave = () => {
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const emergencyContact = emergencyContactName ? {
      name: emergencyContactName,
      relationship: emergencyContactRelationship,
      phone: emergencyContactPhone,
    } : undefined;

    const data = {
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      hourlyRate: parseFloat(hourlyRate) || 0,
      hireDate,
      skills: skillsArray,
      certifications: member?.certifications || [],
      address: address || undefined,
      notes: notes || undefined,
      emergencyContact,
    };

    onSave(data);
    resetForm();
  };

  const roles: { value: CrewMemberRole; label: string }[] = [
    { value: 'technician', label: 'Technician' },
    { value: 'foreman', label: 'Foreman' },
    { value: 'apprentice', label: 'Apprentice' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'manager', label: 'Manager' },
  ];

  const statuses: { value: CrewMemberStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
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
            {mode === 'create' ? 'New Crew Member' : 'Edit Crew Member'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
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
            <Text style={styles.sectionTitle}>Employment Details</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Role *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsRow}>
                  {roles.map((roleOption) => (
                    <TouchableOpacity
                      key={roleOption.value}
                      style={[
                        styles.optionButton,
                        role === roleOption.value && styles.optionButtonActive,
                      ]}
                      onPress={() => setRole(roleOption.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          role === roleOption.value && styles.optionTextActive,
                        ]}
                      >
                        {roleOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

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

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Hourly Rate *</Text>
                <TextInput
                  style={styles.input}
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Hire Date *</Text>
                <TextInput
                  style={styles.input}
                  value={hireDate}
                  onChangeText={setHireDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Skills (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={skills}
                onChangeText={setSkills}
                placeholder="e.g., Plumbing, HVAC, Electrical"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Street address"
                placeholderTextColor="#9ca3af"
                multiline
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
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                value={emergencyContactName}
                onChangeText={setEmergencyContactName}
                placeholder="Full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyContactRelationship}
                  onChangeText={setEmergencyContactRelationship}
                  placeholder="e.g., Spouse"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyContactPhone}
                  onChangeText={setEmergencyContactPhone}
                  placeholder="(555) 123-4567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
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
