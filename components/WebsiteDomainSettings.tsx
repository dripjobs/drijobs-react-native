import WebsiteService from '@/services/WebsiteService';
import { AlertCircle, Check, CheckCircle, Copy, Globe, Lock, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Clipboard,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface WebsiteDomainSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  currentSubdomain: string;
  customDomain?: string;
  onUpdate: (subdomain: string, customDomain?: string) => void;
}

type VerificationStatus = 'pending' | 'verified' | 'failed';

export default function WebsiteDomainSettings({
  isOpen,
  onClose,
  websiteId,
  currentSubdomain,
  customDomain,
  onUpdate,
}: WebsiteDomainSettingsProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain);
  const [newCustomDomain, setNewCustomDomain] = useState(customDomain || '');
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');

  const handleCheckSubdomain = async () => {
    if (!subdomain || subdomain === currentSubdomain) {
      setSubdomainAvailable(null);
      return;
    }

    try {
      setChecking(true);
      const result = await WebsiteService.checkSubdomainAvailability(subdomain);
      setSubdomainAvailable(result.available);
    } catch (error) {
      console.error('Failed to check subdomain:', error);
      setSubdomainAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleSaveSubdomain = async () => {
    if (!subdomain || subdomain === currentSubdomain) {
      Alert.alert('No Changes', 'Subdomain is unchanged.');
      return;
    }

    if (subdomainAvailable !== true) {
      Alert.alert('Invalid Subdomain', 'Please choose an available subdomain.');
      return;
    }

    try {
      setSaving(true);
      await WebsiteService.updateSubdomain(websiteId, subdomain);
      onUpdate(subdomain, newCustomDomain || undefined);
      Alert.alert('Success', 'Subdomain updated successfully!');
    } catch (error) {
      console.error('Failed to update subdomain:', error);
      Alert.alert('Error', 'Failed to update subdomain. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Copied to clipboard!');
  };

  const handleVerifyDomain = () => {
    // Mock verification - in real app, would call API
    setVerificationStatus('verified');
    Alert.alert('Verified', 'Domain verified successfully!');
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Domain Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Subdomain Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>DripJobs Subdomain</Text>
            </View>

            <Text style={styles.sectionDescription}>
              Your free subdomain hosted on DripJobs
            </Text>

            <View style={styles.currentDomain}>
              <Text style={styles.currentDomainLabel}>Current Domain:</Text>
              <View style={styles.domainBadge}>
                <Text style={styles.domainText}>{currentSubdomain}.dripjobs.io</Text>
                <TouchableOpacity
                  onPress={() => handleCopyToClipboard(`https://${currentSubdomain}.dripjobs.io`)}
                >
                  <Copy size={16} color="#6366F1" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Change Subdomain</Text>
              <View style={styles.subdomainInput}>
                <TextInput
                  style={styles.subdomainTextInput}
                  value={subdomain}
                  onChangeText={(text) => {
                    const sanitized = text.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    setSubdomain(sanitized);
                    setSubdomainAvailable(null);
                  }}
                  onBlur={handleCheckSubdomain}
                  autoCapitalize="none"
                  placeholder="your-business"
                />
                <Text style={styles.subdomainSuffix}>.dripjobs.io</Text>
              </View>

              {checking && (
                <View style={styles.statusMessage}>
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text style={styles.statusText}>Checking availability...</Text>
                </View>
              )}

              {!checking && subdomainAvailable === true && subdomain !== currentSubdomain && (
                <View style={[styles.statusMessage, styles.successMessage]}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={[styles.statusText, { color: '#10B981' }]}>Available!</Text>
                </View>
              )}

              {!checking && subdomainAvailable === false && (
                <View style={[styles.statusMessage, styles.errorMessage]}>
                  <AlertCircle size={16} color="#EF4444" />
                  <Text style={[styles.statusText, { color: '#EF4444' }]}>
                    Not available. Try another.
                  </Text>
                </View>
              )}
            </View>

            {subdomain !== currentSubdomain && subdomainAvailable === true && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSubdomain}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Check size={18} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save Subdomain</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Custom Domain Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Custom Domain</Text>
            </View>

            <Text style={styles.sectionDescription}>
              Connect your own domain (e.g., www.yourbusiness.com)
            </Text>

            {customDomain ? (
              <View style={styles.customDomainCard}>
                <View style={styles.customDomainHeader}>
                  <Text style={styles.customDomainLabel}>Active Custom Domain:</Text>
                  <View style={[
                    styles.verificationBadge,
                    verificationStatus === 'verified' ? styles.verifiedBadge : styles.pendingBadge
                  ]}>
                    <Text style={[
                      styles.verificationText,
                      verificationStatus === 'verified' ? styles.verifiedText : styles.pendingText
                    ]}>
                      {verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.customDomainValue}>{customDomain}</Text>
                <TouchableOpacity style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove Custom Domain</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Domain Name</Text>
                  <TextInput
                    style={styles.input}
                    value={newCustomDomain}
                    onChangeText={setNewCustomDomain}
                    placeholder="www.yourbusiness.com"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxTitle}>DNS Configuration Required</Text>
                  <Text style={styles.infoBoxText}>
                    After adding your domain, you'll need to configure your DNS settings.
                  </Text>
                </View>

                {newCustomDomain && (
                  <TouchableOpacity style={styles.addDomainButton}>
                    <Text style={styles.addDomainButtonText}>Add Custom Domain</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* DNS Instructions */}
          {customDomain && verificationStatus !== 'verified' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DNS Configuration</Text>
              <Text style={styles.sectionDescription}>
                Add these records to your domain's DNS settings:
              </Text>

              <View style={styles.dnsCard}>
                <View style={styles.dnsRow}>
                  <Text style={styles.dnsLabel}>Type:</Text>
                  <View style={styles.dnsValueContainer}>
                    <Text style={styles.dnsValue}>CNAME</Text>
                    <TouchableOpacity onPress={() => handleCopyToClipboard('CNAME')}>
                      <Copy size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.dnsRow}>
                  <Text style={styles.dnsLabel}>Name:</Text>
                  <View style={styles.dnsValueContainer}>
                    <Text style={styles.dnsValue}>www</Text>
                    <TouchableOpacity onPress={() => handleCopyToClipboard('www')}>
                      <Copy size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.dnsRow}>
                  <Text style={styles.dnsLabel}>Value:</Text>
                  <View style={styles.dnsValueContainer}>
                    <Text style={styles.dnsValue}>{currentSubdomain}.dripjobs.io</Text>
                    <TouchableOpacity
                      onPress={() => handleCopyToClipboard(`${currentSubdomain}.dripjobs.io`)}
                    >
                      <Copy size={14} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyDomain}>
                <CheckCircle size={18} color="#FFFFFF" />
                <Text style={styles.verifyButtonText}>Verify DNS Configuration</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SSL Certificate Status */}
          {customDomain && verificationStatus === 'verified' && (
            <View style={styles.section}>
              <View style={styles.sslCard}>
                <View style={styles.sslHeader}>
                  <Lock size={20} color="#10B981" />
                  <Text style={styles.sslTitle}>SSL Certificate</Text>
                </View>
                <Text style={styles.sslStatus}>Active & Secure</Text>
                <Text style={styles.sslDescription}>
                  Your website is protected with a free SSL certificate
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  currentDomain: {
    marginBottom: 20,
  },
  currentDomainLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  domainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366F1',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subdomainInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  subdomainTextInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  subdomainSuffix: {
    paddingRight: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  successMessage: {
    backgroundColor: '#D1FAE5',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  customDomainCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customDomainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customDomainLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#065F46',
  },
  pendingText: {
    color: '#92400E',
  },
  customDomainValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  removeButton: {
    paddingVertical: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  addDomainButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addDomainButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dnsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dnsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dnsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dnsValue: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sslCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sslHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sslTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 8,
  },
  sslStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  sslDescription: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
});
