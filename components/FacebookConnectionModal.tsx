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
import FacebookService from '../services/FacebookService';
import { FacebookIntegration, FacebookLeadForm, FacebookPage } from '../types/facebook';

interface FacebookConnectionModalProps {
  visible: boolean;
  onClose: () => void;
  onIntegrationCreated: (integration: FacebookIntegration) => void;
  existingIntegrations?: FacebookIntegration[];
}

const FacebookConnectionModal: React.FC<FacebookConnectionModalProps> = ({
  visible,
  onClose,
  onIntegrationCreated,
  existingIntegrations = [],
}) => {
  const [step, setStep] = useState<'connect' | 'select-page' | 'select-form' | 'mapping' | 'settings'>('connect');
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPages, setUserPages] = useState<FacebookPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [leadForms, setLeadForms] = useState<FacebookLeadForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FacebookLeadForm | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const facebookService = FacebookService.getInstance();

  useEffect(() => {
    if (visible) {
      setStep('connect');
      setAccessToken(null);
      setUserPages([]);
      setSelectedPage(null);
      setLeadForms([]);
      setSelectedForm(null);
      setUserInfo(null);
    }
  }, [visible]);

  const handleConnectFacebook = async () => {
    try {
      setLoading(true);
      const oauthUrl = facebookService.getOAuthUrl();
      
      // In a real app, you'd use a WebView or redirect to browser
      // For now, we'll simulate the OAuth flow
      Alert.alert(
        'Facebook OAuth',
        'In a real implementation, this would open Facebook OAuth in a WebView or browser. For demo purposes, we\'ll simulate the connection.',
        [
          {
            text: 'Simulate Connection',
            onPress: () => simulateOAuthFlow(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error initiating Facebook OAuth:', error);
      Alert.alert('Error', 'Failed to initiate Facebook connection');
    } finally {
      setLoading(false);
    }
  };

  const simulateOAuthFlow = async () => {
    try {
      setLoading(true);
      
      // Simulate getting user info and pages
      const mockUserInfo = {
        id: '123456789',
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      const mockPages: FacebookPage[] = [
        {
          id: 'page1',
          name: 'My Business Page',
          access_token: 'mock_page_token_1',
          category: 'Business',
          tasks: ['MANAGE', 'ADVERTISE'],
        },
        {
          id: 'page2', 
          name: 'My Service Page',
          access_token: 'mock_page_token_2',
          category: 'Service',
          tasks: ['MANAGE', 'ADVERTISE'],
        },
      ];

      setUserInfo(mockUserInfo);
      setUserPages(mockPages);
      setStep('select-page');
    } catch (error) {
      console.error('Error in OAuth simulation:', error);
      Alert.alert('Error', 'Failed to connect to Facebook');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelection = async (page: FacebookPage) => {
    try {
      setLoading(true);
      setSelectedPage(page);
      
      // Simulate getting lead forms for the page
      const mockForms: FacebookLeadForm[] = [
        {
          id: 'form1',
          name: 'Contact Form',
          status: 'ACTIVE',
          leads_count: 25,
          created_time: '2024-01-15T10:00:00Z',
          page_id: page.id,
        },
        {
          id: 'form2',
          name: 'Service Inquiry Form',
          status: 'ACTIVE', 
          leads_count: 12,
          created_time: '2024-01-20T14:30:00Z',
          page_id: page.id,
        },
      ];

      setLeadForms(mockForms);
      setStep('select-form');
    } catch (error) {
      console.error('Error getting lead forms:', error);
      Alert.alert('Error', 'Failed to load lead forms for this page');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSelection = (form: FacebookLeadForm) => {
    setSelectedForm(form);
    setStep('mapping');
  };

  const handleCreateIntegration = async () => {
    if (!selectedPage || !selectedForm) return;

    try {
      setLoading(true);
      
      const integration: Omit<FacebookIntegration, 'id' | 'created_at' | 'updated_at'> = {
        user_id: 'current_user_id', // In real app, get from auth context
        page_id: selectedPage.id,
        page_name: selectedPage.name,
        form_id: selectedForm.id,
        form_name: selectedForm.name,
        access_token: selectedPage.access_token,
        is_active: true,
      };

      // In a real app, this would save to backend
      const mockIntegration: FacebookIntegration = {
        ...integration,
        id: `integration_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onIntegrationCreated(mockIntegration);
      Alert.alert('Success', 'Facebook integration created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating integration:', error);
      Alert.alert('Error', 'Failed to create Facebook integration');
    } finally {
      setLoading(false);
    }
  };

  const renderConnectStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Connect Facebook Account</Text>
      <Text style={styles.stepDescription}>
        Connect your Facebook account to import leads from your Facebook Lead Ads forms directly into your CRM.
      </Text>
      
      <View style={styles.permissionsContainer}>
        <Text style={styles.permissionsTitle}>Required Permissions</Text>
        <View style={styles.permissionsList}>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionBullet}>•</Text>
            <Text style={styles.permissionText}>Access your Facebook pages</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionBullet}>•</Text>
            <Text style={styles.permissionText}>Read lead form data</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionBullet}>•</Text>
            <Text style={styles.permissionText}>Access lead submissions</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionBullet}>•</Text>
            <Text style={styles.permissionText}>Manage ad forms</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.connectButton, loading && styles.buttonDisabled]}
        onPress={handleConnectFacebook}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.connectButtonText}>Connect with Facebook</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSelectPageStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Facebook Page</Text>
      <Text style={styles.stepDescription}>
        Choose which Facebook page you want to connect for lead import.
      </Text>

      <ScrollView style={styles.listContainer}>
        {userPages.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={styles.listItem}
            onPress={() => handlePageSelection(page)}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{page.name}</Text>
              <Text style={styles.listItemSubtitle}>{page.category}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSelectFormStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Lead Form</Text>
      <Text style={styles.stepDescription}>
        Choose which lead form you want to import leads from.
      </Text>

      <ScrollView style={styles.listContainer}>
        {leadForms.map((form) => (
          <TouchableOpacity
            key={form.id}
            style={styles.listItem}
            onPress={() => handleFormSelection(form)}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{form.name}</Text>
              <Text style={styles.listItemSubtitle}>
                {form.leads_count} leads • {form.status}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMappingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Form Mapping</Text>
      <Text style={styles.stepDescription}>
        This step will be implemented in the next component. For now, we'll create the integration.
      </Text>

      <View style={styles.formInfoContainer}>
        <Text style={styles.formInfoTitle}>Selected Form</Text>
        <Text style={styles.formInfoText}>{selectedForm?.name}</Text>
        <Text style={styles.formInfoSubtext}>From: {selectedPage?.name}</Text>
      </View>

      <TouchableOpacity
        style={[styles.connectButton, loading && styles.buttonDisabled]}
        onPress={handleCreateIntegration}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.connectButtonText}>Create Integration</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'connect':
        return renderConnectStep();
      case 'select-page':
        return renderSelectPageStep();
      case 'select-form':
        return renderSelectFormStep();
      case 'mapping':
        return renderMappingStep();
      default:
        return renderConnectStep();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Facebook Integration</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {renderCurrentStep()}
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 16,
  },
  permissionsList: {
    gap: 10,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  permissionBullet: {
    fontSize: 16,
    color: '#0284C7',
    marginRight: 12,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 15,
    color: '#0C4A6E',
    flex: 1,
    lineHeight: 22,
  },
  connectButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  connectButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  listContainer: {
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
    marginLeft: 12,
    fontWeight: '300',
  },
  formInfoContainer: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  formInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInfoText: {
    fontSize: 18,
    color: '#15803D',
    marginBottom: 8,
    fontWeight: '700',
  },
  formInfoSubtext: {
    fontSize: 15,
    color: '#16A34A',
  },
});

export default FacebookConnectionModal;
