import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import FacebookService from '../services/FacebookService';
import { FacebookLead, FacebookLeadMapping } from '../types/facebook';

interface FacebookFormMappingModalProps {
  visible: boolean;
  onClose: () => void;
  onMappingComplete: (mapping: FacebookLeadMapping[]) => void;
  formId: string;
  pageAccessToken: string;
}

interface FieldMapping {
  facebookField: string;
  dripField: string;
  isRequired: boolean;
}

const DRIP_FIELDS = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zip', label: 'ZIP Code' },
  { value: 'country', label: 'Country' },
  { value: 'website', label: 'Website' },
  { value: 'notes', label: 'Notes' },
  { value: 'source', label: 'Lead Source' },
  { value: 'custom_field_1', label: 'Custom Field 1' },
  { value: 'custom_field_2', label: 'Custom Field 2' },
];

const FacebookFormMappingModal: React.FC<FacebookFormMappingModalProps> = ({
  visible,
  onClose,
  onMappingComplete,
  formId,
  pageAccessToken,
}) => {
  const [loading, setLoading] = useState(false);
  const [testLeads, setTestLeads] = useState<FacebookLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<FacebookLead | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [facebookFields, setFacebookFields] = useState<string[]>([]);

  const facebookService = FacebookService.getInstance();

  useEffect(() => {
    if (visible && formId && pageAccessToken) {
      loadTestLeads();
    }
  }, [visible, formId, pageAccessToken]);

  const loadTestLeads = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the Facebook API
      const mockLeads: FacebookLead[] = [
        {
          id: 'lead1',
          created_time: '2024-01-15T10:00:00Z',
          field_data: [
            { name: 'full_name', values: ['John Doe'] },
            { name: 'email', values: ['john@example.com'] },
            { name: 'phone_number', values: ['555-1234'] },
            { name: 'company_name', values: ['Acme Corp'] },
            { name: 'job_title', values: ['Manager'] },
            { name: 'message', values: ['Interested in your services'] },
          ],
          form_id: formId,
        },
        {
          id: 'lead2',
          created_time: '2024-01-14T15:30:00Z',
          field_data: [
            { name: 'first_name', values: ['Jane'] },
            { name: 'last_name', values: ['Smith'] },
            { name: 'email', values: ['jane@company.com'] },
            { name: 'phone', values: ['555-5678'] },
            { name: 'company', values: ['Tech Solutions'] },
            { name: 'inquiry', values: ['Need consultation'] },
          ],
          form_id: formId,
        },
      ];

      setTestLeads(mockLeads);
      
      // Extract unique Facebook field names
      const allFields = new Set<string>();
      mockLeads.forEach(lead => {
        lead.field_data.forEach(field => {
          allFields.add(field.name);
        });
      });
      setFacebookFields(Array.from(allFields));

      // Initialize field mappings
      const initialMappings: FieldMapping[] = Array.from(allFields).map(field => ({
        facebookField: field,
        dripField: '',
        isRequired: false,
      }));
      setFieldMappings(initialMappings);

    } catch (error) {
      console.error('Error loading test leads:', error);
      Alert.alert('Error', 'Failed to load test leads');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelection = (lead: FacebookLead) => {
    setSelectedLead(lead);
  };

  const handleFieldMappingChange = (index: number, dripField: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index].dripField = dripField;
    setFieldMappings(newMappings);
  };

  const handleRequiredToggle = (index: number) => {
    const newMappings = [...fieldMappings];
    newMappings[index].isRequired = !newMappings[index].isRequired;
    setFieldMappings(newMappings);
  };

  const handleSaveMapping = () => {
    const validMappings = fieldMappings.filter(mapping => mapping.dripField !== '');
    
    if (validMappings.length === 0) {
      Alert.alert('Error', 'Please map at least one field');
      return;
    }

    const mappingData: FacebookLeadMapping[] = validMappings.map(mapping => ({
      id: `mapping_${Date.now()}_${mapping.facebookField}`,
      integration_id: 'temp_integration_id',
      facebook_field: mapping.facebookField,
      drip_field: mapping.dripField,
      is_required: mapping.isRequired,
      created_at: new Date().toISOString(),
    }));

    onMappingComplete(mappingData);
    onClose();
  };

  const getFieldValue = (lead: FacebookLead, fieldName: string): string => {
    const field = lead.field_data.find(f => f.name === fieldName);
    return field ? field.values[0] : '';
  };

  const renderTestLeads = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select a Test Lead</Text>
      <Text style={styles.sectionDescription}>
        Choose a recent lead to see the actual field data and set up your mapping.
      </Text>

      <ScrollView style={styles.leadsContainer}>
        {testLeads.map((lead) => (
          <TouchableOpacity
            key={lead.id}
            style={[
              styles.leadItem,
              selectedLead?.id === lead.id && styles.selectedLeadItem,
            ]}
            onPress={() => handleLeadSelection(lead)}
          >
            <View style={styles.leadHeader}>
              <Text style={styles.leadId}>Lead #{lead.id}</Text>
              <Text style={styles.leadDate}>
                {new Date(lead.created_time).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.leadFields}>
              {lead.field_data.slice(0, 3).map((field, index) => (
                <Text key={index} style={styles.leadField}>
                  {field.name}: {field.values[0]}
                </Text>
              ))}
              {lead.field_data.length > 3 && (
                <Text style={styles.leadFieldMore}>
                  +{lead.field_data.length - 3} more fields
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFieldMapping = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Field Mapping</Text>
      <Text style={styles.sectionDescription}>
        Map Facebook form fields to your Drip CRM fields.
      </Text>

      <ScrollView style={styles.mappingContainer}>
        {fieldMappings.map((mapping, index) => (
          <View key={index} style={styles.mappingRow}>
            <View style={styles.mappingField}>
              <Text style={styles.mappingLabel}>Facebook Field:</Text>
              <Text style={styles.mappingValue}>{mapping.facebookField}</Text>
            </View>

            <View style={styles.mappingField}>
              <Text style={styles.mappingLabel}>Drip Field:</Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={styles.dropdown}
                  value={mapping.dripField}
                  placeholder="Select field..."
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    // In a real app, this would open a picker
                    Alert.alert(
                      'Select Field',
                      'Choose a Drip field to map to',
                      DRIP_FIELDS.map(field => ({
                        text: field.label,
                        onPress: () => handleFieldMappingChange(index, field.value),
                      }))
                    );
                  }}
                >
                  <Text style={styles.dropdownButtonText}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.requiredToggle,
                mapping.isRequired && styles.requiredToggleActive,
              ]}
              onPress={() => handleRequiredToggle(index)}
            >
              <Text style={[
                styles.requiredToggleText,
                mapping.isRequired && styles.requiredToggleTextActive,
              ]}>
                Required
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderSelectedLeadData = () => {
    if (!selectedLead) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Lead Data</Text>
        <View style={styles.leadDataContainer}>
          {selectedLead.field_data.map((field, index) => (
            <View key={index} style={styles.leadDataField}>
              <Text style={styles.leadDataLabel}>{field.name}:</Text>
              <Text style={styles.leadDataValue}>{field.values[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Form Field Mapping</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveMapping}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1877f2" />
              <Text style={styles.loadingText}>Loading test leads...</Text>
            </View>
          ) : (
            <>
              {renderTestLeads()}
              {selectedLead && renderSelectedLeadData()}
              {renderFieldMapping()}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#1877F2',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 18,
    lineHeight: 22,
  },
  leadsContainer: {
    maxHeight: 220,
  },
  leadItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedLeadItem: {
    borderColor: '#1877F2',
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leadId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  leadDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  leadFields: {
    gap: 5,
  },
  leadField: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  leadFieldMore: {
    fontSize: 12,
    color: '#1877F2',
    fontWeight: '600',
    marginTop: 2,
  },
  leadDataContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  leadDataField: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  leadDataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    width: 130,
  },
  leadDataValue: {
    fontSize: 14,
    color: '#15803D',
    flex: 1,
  },
  mappingContainer: {
    maxHeight: 450,
  },
  mappingRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mappingField: {
    marginBottom: 14,
  },
  mappingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  mappingValue: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownButton: {
    padding: 12,
    backgroundColor: '#1877F2',
    borderRadius: 6,
    marginLeft: 8,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  requiredToggle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  requiredToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  requiredToggleText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  requiredToggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FacebookFormMappingModal;
