import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FacebookAutomationSettings, FacebookIntegration } from '../types/facebook';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface Sequence {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface FacebookAutomationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSettingsSaved: (settings: FacebookAutomationSettings) => void;
  integration: FacebookIntegration;
  existingSettings?: FacebookAutomationSettings;
}

const FacebookAutomationSettingsModal: React.FC<FacebookAutomationSettingsModalProps> = ({
  visible,
  onClose,
  onSettingsSaved,
  integration,
  existingSettings,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (visible) {
      loadInitialData();
      if (existingSettings) {
        loadExistingSettings();
      }
    }
  }, [visible, existingSettings]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in a real app, these would be API calls
      const mockUsers: User[] = [
        { id: 'user1', name: 'John Smith', email: 'john@company.com' },
        { id: 'user2', name: 'Sarah Johnson', email: 'sarah@company.com' },
        { id: 'user3', name: 'Mike Wilson', email: 'mike@company.com' },
      ];

      const mockStages: Stage[] = [
        { id: 'stage1', name: 'New Lead', color: '#10b981' },
        { id: 'stage2', name: 'Qualified', color: '#3b82f6' },
        { id: 'stage3', name: 'Proposal Sent', color: '#f59e0b' },
        { id: 'stage4', name: 'Closed Won', color: '#10b981' },
        { id: 'stage5', name: 'Closed Lost', color: '#ef4444' },
      ];

      const mockSequences: Sequence[] = [
        { id: 'seq1', name: 'New Lead Follow-up', description: 'Initial contact sequence for new leads', is_active: true },
        { id: 'seq2', name: 'Service Inquiry', description: 'Follow-up for service inquiries', is_active: true },
        { id: 'seq3', name: 'Quote Request', description: 'Follow-up for quote requests', is_active: true },
        { id: 'seq4', name: 'General Follow-up', description: 'General lead nurturing sequence', is_active: false },
      ];

      setUsers(mockUsers);
      setStages(mockStages);
      setSequences(mockSequences);

      // Set defaults
      setSelectedUser(mockUsers[0]);
      setSelectedStage(mockStages[0]);
      setSelectedSequence(mockSequences[0]);

    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load automation settings data');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSettings = () => {
    if (!existingSettings) return;

    const user = users.find(u => u.id === existingSettings.default_user_id);
    const stage = stages.find(s => s.id === existingSettings.default_stage_id);
    const sequence = sequences.find(s => s.id === existingSettings.default_sequence_id);

    if (user) setSelectedUser(user);
    if (stage) setSelectedStage(stage);
    if (sequence) setSelectedSequence(sequence);
    setIsActive(existingSettings.is_active);
  };

  const handleSaveSettings = async () => {
    if (!selectedUser || !selectedStage || !selectedSequence) {
      Alert.alert('Error', 'Please select a user, stage, and sequence');
      return;
    }

    try {
      setSaving(true);

      const settings: FacebookAutomationSettings = {
        id: existingSettings?.id || `settings_${Date.now()}`,
        integration_id: integration.id,
        default_user_id: selectedUser.id,
        default_stage_id: selectedStage.id,
        default_sequence_id: selectedSequence.id,
        is_active: isActive,
        created_at: existingSettings?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onSettingsSaved(settings);
      Alert.alert('Success', 'Automation settings saved successfully!');
      onClose();

    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save automation settings');
    } finally {
      setSaving(false);
    }
  };

  const renderUserSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Default User</Text>
      <Text style={styles.sectionDescription}>
        Select which user will be assigned to new leads from this Facebook form.
      </Text>

      <ScrollView style={styles.listContainer}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.listItem,
              selectedUser?.id === user.id && styles.selectedListItem,
            ]}
            onPress={() => setSelectedUser(user)}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{user.name}</Text>
              <Text style={styles.listItemSubtitle}>{user.email}</Text>
            </View>
            {selectedUser?.id === user.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStageSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Default Stage</Text>
      <Text style={styles.sectionDescription}>
        Choose the initial stage for new leads from this Facebook form.
      </Text>

      <ScrollView style={styles.listContainer}>
        {stages.map((stage) => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.listItem,
              selectedStage?.id === stage.id && styles.selectedListItem,
            ]}
            onPress={() => setSelectedStage(stage)}
          >
            <View style={styles.listItemContent}>
              <View style={styles.stageHeader}>
                <View style={[styles.stageColor, { backgroundColor: stage.color }]} />
                <Text style={styles.listItemTitle}>{stage.name}</Text>
              </View>
            </View>
            {selectedStage?.id === stage.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSequenceSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Default Sequence</Text>
      <Text style={styles.sectionDescription}>
        Select the follow-up sequence that will be triggered for new leads.
      </Text>

      <ScrollView style={styles.listContainer}>
        {sequences.map((sequence) => (
          <TouchableOpacity
            key={sequence.id}
            style={[
              styles.listItem,
              selectedSequence?.id === sequence.id && styles.selectedListItem,
            ]}
            onPress={() => setSelectedSequence(sequence)}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{sequence.name}</Text>
              <Text style={styles.listItemSubtitle}>{sequence.description}</Text>
              <View style={styles.sequenceStatus}>
                <Text style={[
                  styles.statusText,
                  sequence.is_active ? styles.statusActive : styles.statusInactive,
                ]}>
                  {sequence.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            {selectedSequence?.id === sequence.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderActiveToggle = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Automation Status</Text>
      <Text style={styles.sectionDescription}>
        Enable or disable this Facebook lead automation.
      </Text>

      <TouchableOpacity
        style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
        onPress={() => setIsActive(!isActive)}
      >
        <Text style={[styles.toggleButtonText, isActive && styles.toggleButtonTextActive]}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderIntegrationInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Integration Details</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Facebook Page:</Text>
          <Text style={styles.infoValue}>{integration.page_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Form:</Text>
          <Text style={styles.infoValue}>{integration.form_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[
            styles.infoValue,
            integration.is_active ? styles.statusActive : styles.statusInactive,
          ]}>
            {integration.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Automation Settings</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSettings}
            disabled={saving || loading}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#1877f2" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1877f2" />
              <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
          ) : (
            <>
              {renderIntegrationInfo()}
              {renderUserSelection()}
              {renderStageSelection()}
              {renderSequenceSelection()}
              {renderActiveToggle()}
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
  listContainer: {
    maxHeight: 220,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedListItem: {
    borderColor: '#1877F2',
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkmark: {
    fontSize: 20,
    color: '#1877F2',
    fontWeight: 'bold',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sequenceStatus: {
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10B981',
  },
  statusInactive: {
    color: '#EF4444',
  },
  toggleButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  infoContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#B45309',
    flex: 1,
    fontWeight: '500',
  },
});

export default FacebookAutomationSettingsModal;
