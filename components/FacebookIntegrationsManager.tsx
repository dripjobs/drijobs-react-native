import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FacebookService from '../services/FacebookService';
import { FacebookAutomationSettings, FacebookIntegration } from '../types/facebook';
import FacebookAutomationSettingsModal from './FacebookAutomationSettingsModal';
import FacebookConnectionModal from './FacebookConnectionModal';
import FacebookFormMappingModal from './FacebookFormMappingModal';

interface FacebookIntegrationsManagerProps {
  userId: string;
}

const FacebookIntegrationsManager: React.FC<FacebookIntegrationsManagerProps> = ({
  userId,
}) => {
  const [integrations, setIntegrations] = useState<FacebookIntegration[]>([]);
  const [automationSettings, setAutomationSettings] = useState<FacebookAutomationSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<FacebookIntegration | null>(null);
  const [selectedSettings, setSelectedSettings] = useState<FacebookAutomationSettings | null>(null);

  const facebookService = FacebookService.getInstance();

  useEffect(() => {
    loadIntegrations();
  }, [userId]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the API
      const mockIntegrations: FacebookIntegration[] = [
        {
          id: 'integration1',
          user_id: userId,
          page_id: 'page1',
          page_name: 'My Business Page',
          form_id: 'form1',
          form_name: 'Contact Form',
          access_token: 'mock_token_1',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'integration2',
          user_id: userId,
          page_id: 'page2',
          page_name: 'My Service Page',
          form_id: 'form2',
          form_name: 'Service Inquiry Form',
          access_token: 'mock_token_2',
          is_active: false,
          created_at: '2024-01-20T14:30:00Z',
          updated_at: '2024-01-20T14:30:00Z',
        },
      ];

      const mockSettings: FacebookAutomationSettings[] = [
        {
          id: 'settings1',
          integration_id: 'integration1',
          default_user_id: 'user1',
          default_stage_id: 'stage1',
          default_sequence_id: 'seq1',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ];

      setIntegrations(mockIntegrations);
      setAutomationSettings(mockSettings);
    } catch (error) {
      console.error('Error loading integrations:', error);
      Alert.alert('Error', 'Failed to load Facebook integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadIntegrations();
    setRefreshing(false);
  };

  const handleCreateIntegration = (integration: FacebookIntegration) => {
    setIntegrations(prev => [...prev, integration]);
    setShowConnectionModal(false);
    Alert.alert('Success', 'Facebook integration created successfully!');
  };

  const handleToggleIntegration = async (integration: FacebookIntegration) => {
    try {
      const newStatus = !integration.is_active;
      await facebookService.updateIntegrationStatus(integration.id, newStatus);
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { ...int, is_active: newStatus }
            : int
        )
      );
      
      Alert.alert('Success', `Integration ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling integration:', error);
      Alert.alert('Error', 'Failed to update integration status');
    }
  };

  const handleDeleteIntegration = async (integration: FacebookIntegration) => {
    Alert.alert(
      'Delete Integration',
      `Are you sure you want to delete the integration for "${integration.form_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await facebookService.deleteIntegration(integration.id);
              setIntegrations(prev => prev.filter(int => int.id !== integration.id));
              Alert.alert('Success', 'Integration deleted successfully!');
            } catch (error) {
              console.error('Error deleting integration:', error);
              Alert.alert('Error', 'Failed to delete integration');
            }
          },
        },
      ]
    );
  };

  const handleOpenMapping = (integration: FacebookIntegration) => {
    setSelectedIntegration(integration);
    setShowMappingModal(true);
  };

  const handleOpenSettings = (integration: FacebookIntegration) => {
    setSelectedIntegration(integration);
    const settings = automationSettings.find(s => s.integration_id === integration.id);
    setSelectedSettings(settings || null);
    setShowSettingsModal(true);
  };

  const handleMappingComplete = (mapping: any[]) => {
    setShowMappingModal(false);
    Alert.alert('Success', 'Field mapping saved successfully!');
  };

  const handleSettingsSaved = (settings: FacebookAutomationSettings) => {
    setAutomationSettings(prev => {
      const existing = prev.find(s => s.id === settings.id);
      if (existing) {
        return prev.map(s => s.id === settings.id ? settings : s);
      } else {
        return [...prev, settings];
      }
    });
    setShowSettingsModal(false);
    Alert.alert('Success', 'Automation settings saved successfully!');
  };

  const getSettingsForIntegration = (integrationId: string): FacebookAutomationSettings | null => {
    return automationSettings.find(s => s.integration_id === integrationId) || null;
  };

  const renderIntegrationCard = (integration: FacebookIntegration) => {
    const settings = getSettingsForIntegration(integration.id);
    
    return (
      <View key={integration.id} style={styles.integrationCard}>
        {/* Header with title and status */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{integration.form_name}</Text>
            <Text style={styles.cardSubtitle}>{integration.page_name}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            integration.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive,
          ]}>
            <View style={[
              styles.statusDot,
              integration.is_active ? styles.statusDotActive : styles.statusDotInactive,
            ]} />
            <Text style={[
              styles.statusText,
              integration.is_active ? styles.statusTextActive : styles.statusTextInactive,
            ]}>
              {integration.is_active ? 'Active' : 'Paused'}
            </Text>
          </View>
        </View>

        {/* Info section */}
        <View style={styles.cardContent}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>CREATED</Text>
              <Text style={styles.infoValue}>
                {new Date(integration.created_at).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>AUTOMATION</Text>
              <Text style={[
                styles.infoValue,
                settings?.is_active ? styles.infoValueSuccess : styles.infoValueWarning,
              ]}>
                {settings?.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.cardActions}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={() => handleOpenMapping(integration)}
            >
              <Text style={styles.primaryActionText}>Map Fields</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryActionButton]}
              onPress={() => handleOpenSettings(integration)}
            >
              <Text style={styles.secondaryActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.toggleActionButton]}
              onPress={() => handleToggleIntegration(integration)}
            >
              <Text style={styles.toggleActionText}>
                {integration.is_active ? 'Pause' : 'Activate'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerActionButton]}
              onPress={() => handleDeleteIntegration(integration)}
            >
              <Text style={styles.dangerActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Facebook Integrations</Text>
      <Text style={styles.emptyStateDescription}>
        Connect your Facebook pages to automatically import leads from your Facebook Lead Ads forms.
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => setShowConnectionModal(true)}
      >
        <Text style={styles.emptyStateButtonText}>Connect Facebook</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877f2" />
        <Text style={styles.loadingText}>Loading Facebook integrations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Facebook Lead Integrations</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowConnectionModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Integration</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {integrations.length === 0 ? (
          renderEmptyState()
        ) : (
          integrations.map(renderIntegrationCard)
        )}
      </ScrollView>

      <FacebookConnectionModal
        visible={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onIntegrationCreated={handleCreateIntegration}
        existingIntegrations={integrations}
      />

      {selectedIntegration && (
        <FacebookFormMappingModal
          visible={showMappingModal}
          onClose={() => setShowMappingModal(false)}
          onMappingComplete={handleMappingComplete}
          formId={selectedIntegration.form_id}
          pageAccessToken={selectedIntegration.access_token}
        />
      )}

      {selectedIntegration && (
        <FacebookAutomationSettingsModal
          visible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSettingsSaved={handleSettingsSaved}
          integration={selectedIntegration}
          existingSettings={selectedSettings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
  },
  integrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 24,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusDotInactive: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#065F46',
  },
  statusTextInactive: {
    color: '#991B1B',
  },
  cardContent: {
    marginBottom: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 20,
  },
  infoValueSuccess: {
    color: '#10B981',
  },
  infoValueWarning: {
    color: '#F59E0B',
  },
  cardActions: {
    flexDirection: 'column',
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryActionButton: {
    backgroundColor: '#1877F2',
  },
  secondaryActionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  toggleActionButton: {
    backgroundColor: '#FBBF24',
  },
  dangerActionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dangerActionText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 400,
  },
  emptyStateButton: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default FacebookIntegrationsManager;
