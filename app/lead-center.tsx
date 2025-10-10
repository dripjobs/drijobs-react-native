import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Copy,
    ExternalLink,
    Globe,
    Mail,
    MessageSquare,
    Phone,
    Save,
    Star,
    Zap
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface LeadSource {
  id: string;
  name: string;
  icon: any;
  iconColor: string;
  description: string;
  isConnected: boolean;
  apiKey?: string;
  instructions: string[];
  setupUrl?: string;
  stage: string;
  dripSequenceId: string | null;
}

interface DripSequence {
  id: string;
  name: string;
  description?: string;
  stage: string;
}

const stages = [
  { value: 'new-leads', label: 'New Leads' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal-sent', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiation' },
];

// Mock drip sequences - in production, this would come from a service/API
const mockDripSequences: DripSequence[] = [
  { id: 'drip-1', name: 'Welcome New Leads', description: 'Initial welcome sequence for new leads', stage: 'new-leads' },
  { id: 'drip-2', name: 'Follow Up Sequence', description: 'Follow up with prospects who showed interest', stage: 'new-leads' },
  { id: 'drip-3', name: 'Re-engagement Campaign', description: 'Re-engage cold leads', stage: 'contacted' },
  { id: 'drip-4', name: 'Qualification Nurture', description: 'Nurture qualified leads', stage: 'qualified' },
  { id: 'drip-5', name: 'Proposal Follow-up', description: 'Follow up after proposal sent', stage: 'proposal-sent' },
  { id: 'drip-6', name: 'Negotiation Support', description: 'Support during negotiation phase', stage: 'negotiation' },
];

export default function LeadCenter() {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    {
      id: 'google-lsa',
      name: 'Google LSA',
      icon: Globe,
      iconColor: '#4285F4',
      description: 'Connect Google Local Services Ads to automatically import qualified leads',
      isConnected: false,
      instructions: [
        'Log into your Google Local Services account',
        'Navigate to Settings > Integrations',
        'Generate a new API key for DripJobs',
        'Copy and paste the API key below',
        'Click "Test Connection" to verify',
      ],
      setupUrl: 'https://ads.google.com/localservices',
      stage: 'new-leads',
      dripSequenceId: null,
    },
    {
      id: 'facebook',
      name: 'Facebook Leads',
      icon: MessageSquare,
      iconColor: '#1877F2',
      description: 'Import leads from Facebook Lead Ads campaigns directly into your pipeline',
      isConnected: false,
      instructions: [
        'Go to Facebook Business Manager',
        'Select your business page',
        'Navigate to Settings > Lead Access',
        'Add DripJobs as an integrated CRM',
        'Grant permission to access lead forms',
        'Copy the access token provided',
      ],
      setupUrl: 'https://business.facebook.com',
      stage: 'new-leads',
      dripSequenceId: null,
    },
    {
      id: 'angi',
      name: 'Angi Leads',
      icon: Star,
      iconColor: '#FF6F61',
      description: 'Automatically sync leads from Angi (formerly Angie\'s List) to your pipeline',
      isConnected: false,
      instructions: [
        'Log into your Angi Pro account',
        'Go to Account Settings > Integrations',
        'Find DripJobs in the integration marketplace',
        'Click "Connect" and authorize access',
        'Your API key will be generated automatically',
        'Leads will sync every 15 minutes',
      ],
      setupUrl: 'https://pro.angi.com',
      stage: 'new-leads',
      dripSequenceId: null,
    },
    {
      id: 'thumbtack',
      name: 'Thumbtack',
      icon: Zap,
      iconColor: '#009FD4',
      description: 'Connect Thumbtack to receive instant notifications when you get a new lead',
      isConnected: false,
      instructions: [
        'Log into your Thumbtack Pro account',
        'Navigate to Settings > Integrations',
        'Search for DripJobs',
        'Click "Enable Integration"',
        'Copy the webhook URL below to Thumbtack',
        'Test the connection by sending a test lead',
      ],
      setupUrl: 'https://www.thumbtack.com/pro',
      stage: 'new-leads',
      dripSequenceId: null,
    },
    {
      id: 'website',
      name: 'Website Forms',
      icon: Globe,
      iconColor: '#10B981',
      description: 'Embed our form on your website or use our API to capture website leads',
      isConnected: true,
      instructions: [
        'Copy the embed code below',
        'Paste it into your website\'s HTML where you want the form',
        'Or use our REST API to submit leads programmatically',
        'Customize form fields in the advanced settings',
        'Set up notifications for new submissions',
      ],
      stage: 'new-leads',
      dripSequenceId: null,
    },
    {
      id: 'phone',
      name: 'Phone Calls',
      icon: Phone,
      iconColor: '#8B5CF6',
      description: 'Automatically create leads from incoming calls using our call tracking',
      isConnected: false,
      instructions: [
        'Get your dedicated tracking phone number',
        'Forward your existing number to the tracking number',
        'Or update your marketing materials with the new number',
        'Calls will be recorded and transcribed',
        'Leads are created automatically from call data',
      ],
      stage: 'new-leads',
      dripSequenceId: null,
    },
  ]);

  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState('');
  const [editingStage, setEditingStage] = useState('new-leads');
  const [editingDripSequenceId, setEditingDripSequenceId] = useState<string | null>(null);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showDripSequenceDropdown, setShowDripSequenceDropdown] = useState(false);
  const [availableDripSequences, setAvailableDripSequences] = useState<DripSequence[]>([]);

  const handleConfigureSource = (source: LeadSource) => {
    setSelectedSource(source);
    setEditingApiKey(source.apiKey || '');
    setEditingStage(source.stage);
    setEditingDripSequenceId(source.dripSequenceId);
    // Load available drip sequences for the selected stage
    const sequencesForStage = mockDripSequences.filter(seq => seq.stage === source.stage);
    setAvailableDripSequences(sequencesForStage);
    setShowConfigModal(true);
  };

  const handleSaveConfiguration = () => {
    if (selectedSource) {
      setLeadSources(prev => prev.map(source => 
        source.id === selectedSource.id 
          ? { 
              ...source, 
              apiKey: editingApiKey,
              stage: editingStage,
              dripSequenceId: editingDripSequenceId,
              isConnected: editingApiKey.length > 0 
            }
          : source
      ));
      setShowConfigModal(false);
      Alert.alert('Success', 'Lead source configuration saved successfully!');
    }
  };

  const handleTestConnection = () => {
    // Simulate API test
    Alert.alert('Testing Connection', 'Verifying your credentials...', [
      { 
        text: 'OK', 
        onPress: () => {
          setTimeout(() => {
            Alert.alert('Success', 'Connection successful! Leads will now sync automatically.');
          }, 1000);
        }
      }
    ]);
  };

  const handleCopyToClipboard = (text: string) => {
    Alert.alert('Copied', 'Copied to clipboard!');
  };

  const connectedCount = leadSources.filter(s => s.isConnected).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lead Center</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{connectedCount}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{leadSources.length - connectedCount}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Connect Your Lead Sources</Text>
          <Text style={styles.introText}>
            Connect your lead generation channels to automatically import leads into DripJobs. 
            Set up each source once and leads will flow into your pipeline automatically.
          </Text>
        </View>

        <View style={styles.sourcesGrid}>
          {leadSources.map((source) => (
            <TouchableOpacity
              key={source.id}
              style={styles.sourceCard}
              onPress={() => handleConfigureSource(source)}
            >
              <View style={styles.sourceHeader}>
                <View style={[styles.sourceIcon, { backgroundColor: source.iconColor + '20' }]}>
                  <source.icon size={24} color={source.iconColor} />
                </View>
                {source.isConnected && (
                  <View style={styles.connectedBadge}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.connectedText}>Connected</Text>
                  </View>
                )}
              </View>

              <Text style={styles.sourceName}>{source.name}</Text>
              <Text style={styles.sourceDescription}>{source.description}</Text>

              <View style={styles.sourceFooter}>
                <View style={styles.stageTag}>
                  <Text style={styles.stageTagText}>
                    {stages.find(s => s.value === source.stage)?.label}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.helpSection}>
          <View style={styles.helpHeader}>
            <AlertCircle size={20} color="#6366F1" />
            <Text style={styles.helpTitle}>Need Help?</Text>
          </View>
          <Text style={styles.helpText}>
            Having trouble connecting a lead source? Our support team is here to help you get set up.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Mail size={16} color="#6366F1" />
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Configuration Modal */}
      <Modal
        visible={showConfigModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  {selectedSource && (
                    <View style={[styles.modalIcon, { backgroundColor: selectedSource.iconColor + '20' }]}>
                      <selectedSource.icon size={24} color={selectedSource.iconColor} />
                    </View>
                  )}
                  <View>
                    <Text style={styles.modalTitle}>{selectedSource?.name}</Text>
                    <Text style={styles.modalSubtitle}>Configure lead source</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowConfigModal(false)}
                  style={styles.modalCloseButton}
                >
                  <ArrowLeft size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Instructions */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Setup Instructions</Text>
                <View style={styles.instructionsList}>
                  {selectedSource?.instructions.map((instruction, index) => (
                    <View key={index} style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
                {selectedSource?.setupUrl && (
                  <TouchableOpacity style={styles.externalLink}>
                    <ExternalLink size={16} color="#6366F1" />
                    <Text style={styles.externalLinkText}>Open {selectedSource.name} Settings</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* API Key */}
              {selectedSource?.id !== 'website' && selectedSource?.id !== 'phone' && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>API Key / Access Token</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Paste your API key here..."
                      value={editingApiKey}
                      onChangeText={setEditingApiKey}
                      secureTextEntry={editingApiKey.length > 0}
                    />
                    {editingApiKey.length > 0 && (
                      <TouchableOpacity 
                        style={styles.inputIcon}
                        onPress={handleTestConnection}
                      >
                        <CheckCircle size={20} color="#10B981" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.inputHint}>
                    Keep this secure. Never share your API key publicly.
                  </Text>
                </View>
              )}

              {/* Webhook URL for specific sources */}
              {(selectedSource?.id === 'website' || selectedSource?.id === 'thumbtack') && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>
                    {selectedSource?.id === 'website' ? 'Embed Code' : 'Webhook URL'}
                  </Text>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeText}>
                      {selectedSource?.id === 'website' 
                        ? '<script src="https://api.dripjobs.com/embed.js" data-key="YOUR_KEY"></script>'
                        : 'https://api.dripjobs.com/webhooks/leads/YOUR_KEY'
                      }
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={() => handleCopyToClipboard('code')}
                  >
                    <Copy size={16} color="#6366F1" />
                    <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Stage Selection */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Default Pipeline Stage</Text>
                <Text style={styles.sectionDescription}>
                  Choose which stage new leads from this source will be added to
                </Text>
                <TouchableOpacity 
                  style={styles.dropdown}
                  onPress={() => setShowStageDropdown(!showStageDropdown)}
                >
                  <Text style={styles.dropdownText}>
                    {stages.find(s => s.value === editingStage)?.label}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
                {showStageDropdown && (
                  <View style={styles.dropdownMenu}>
                    {stages.map((stage) => (
                      <TouchableOpacity
                        key={stage.value}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setEditingStage(stage.value);
                          setShowStageDropdown(false);
                          // Update available drip sequences when stage changes
                          const sequencesForStage = mockDripSequences.filter(seq => seq.stage === stage.value);
                          setAvailableDripSequences(sequencesForStage);
                          // Reset drip sequence selection if current selection is not valid for new stage
                          if (editingDripSequenceId && !sequencesForStage.find(seq => seq.id === editingDripSequenceId)) {
                            setEditingDripSequenceId(null);
                          }
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          editingStage === stage.value && styles.dropdownItemTextActive
                        ]}>
                          {stage.label}
                        </Text>
                        {editingStage === stage.value && (
                          <CheckCircle size={16} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Drip Sequence Selection */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Drip Sequence</Text>
                <Text style={styles.sectionDescription}>
                  Select which drip sequence will be automatically triggered when a lead comes in from this source
                </Text>
                <TouchableOpacity 
                  style={styles.dropdown}
                  onPress={() => setShowDripSequenceDropdown(!showDripSequenceDropdown)}
                >
                  <Text style={[
                    styles.dropdownText,
                    !editingDripSequenceId && { color: '#9CA3AF' }
                  ]}>
                    {editingDripSequenceId 
                      ? availableDripSequences.find(seq => seq.id === editingDripSequenceId)?.name || 'Select a sequence...'
                      : 'Select a sequence...'}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
                {showDripSequenceDropdown && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setEditingDripSequenceId(null);
                        setShowDripSequenceDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        !editingDripSequenceId && styles.dropdownItemTextActive
                      ]}>
                        None (No automatic sequence)
                      </Text>
                      {!editingDripSequenceId && (
                        <CheckCircle size={16} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                    {availableDripSequences.length === 0 ? (
                      <View style={styles.dropdownItem}>
                        <Text style={styles.dropdownItemText}>
                          No sequences available for this stage
                        </Text>
                      </View>
                    ) : (
                      availableDripSequences.map((sequence) => (
                        <TouchableOpacity
                          key={sequence.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setEditingDripSequenceId(sequence.id);
                            setShowDripSequenceDropdown(false);
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[
                              styles.dropdownItemText,
                              editingDripSequenceId === sequence.id && styles.dropdownItemTextActive
                            ]}>
                              {sequence.name}
                            </Text>
                            {sequence.description && (
                              <Text style={styles.dropdownItemDescription}>
                                {sequence.description}
                              </Text>
                            )}
                          </View>
                          {editingDripSequenceId === sequence.id && (
                            <CheckCircle size={16} color="#6366F1" />
                          )}
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveConfiguration}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Configuration</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introSection: {
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  sourcesGrid: {
    gap: 16,
    marginBottom: 24,
  },
  sourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sourceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  sourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  helpSection: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  helpText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  externalLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputIcon: {
    padding: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  codeContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 13,
    color: '#10B981',
    fontFamily: 'monospace',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#6B7280',
  },
  dropdownItemTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  dropdownItemDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    lineHeight: 16,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'right',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    margin: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

