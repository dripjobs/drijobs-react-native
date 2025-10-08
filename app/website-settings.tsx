import WebsiteService from '@/services/WebsiteService';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Download,
    Globe,
    Lock,
    Search,
    Settings,
    Trash2,
    TrendingUp,
    Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function WebsiteSettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enableBooking: true,
    enableChat: false,
    maintenanceMode: false,
  });
  const [analytics, setAnalytics] = useState({
    totalVisits: 1247,
    totalFormSubmissions: 89,
    bounceRate: 32.5,
    averageTimeOnSite: 145,
    topPages: [
      { path: '/', views: 856, averageTime: 120 },
      { path: '/services', views: 324, averageTime: 180 },
      { path: '/contact', views: 234, averageTime: 90 }
    ],
    trafficSources: [
      { source: 'Direct', visits: 498, percentage: 40 },
      { source: 'Google', visits: 374, percentage: 30 },
      { source: 'Facebook', visits: 249, percentage: 20 },
      { source: 'Other', visits: 126, percentage: 10 }
    ],
  });

  const handleToggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleExportAnalytics = () => {
    Alert.alert('Export Analytics', 'Analytics report will be sent to your email.');
  };

  const handleDeleteWebsite = () => {
    Alert.alert(
      'Delete Website',
      'Are you sure you want to delete your website? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await WebsiteService.deleteWebsite('website-id');
              Alert.alert('Success', 'Website deleted successfully.');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete website.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Website Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your website configuration</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.background}>
        {renderHeader()}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Analytics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Analytics</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <TrendingUp size={20} color="#3B82F6" />
                </View>
                <Text style={styles.statValue}>{analytics.totalVisits.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Visits</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Users size={20} color="#10B981" />
                </View>
                <Text style={styles.statValue}>{analytics.totalFormSubmissions}</Text>
                <Text style={styles.statLabel}>Form Submissions</Text>
              </View>
            </View>

            <View style={styles.analyticsDetails}>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Bounce Rate</Text>
                <Text style={styles.analyticsValue}>{analytics.bounceRate.toFixed(1)}%</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Avg. Time on Site</Text>
                <Text style={styles.analyticsValue}>
                  {Math.floor(analytics.averageTimeOnSite / 60)}m {analytics.averageTimeOnSite % 60}s
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.exportButton} onPress={handleExportAnalytics}>
              <Download size={18} color="#6366F1" />
              <Text style={styles.exportButtonText}>Export Full Report</Text>
            </TouchableOpacity>
          </View>

          {/* Traffic Sources */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Traffic Sources</Text>
            {analytics.trafficSources.map((source, index) => (
              <View key={index} style={styles.trafficRow}>
                <View style={styles.trafficInfo}>
                  <Text style={styles.trafficSource}>{source.source}</Text>
                  <Text style={styles.trafficVisits}>{source.visits} visits</Text>
                </View>
                <View style={styles.trafficBar}>
                  <View style={[styles.trafficBarFill, { width: `${source.percentage}%` }]} />
                </View>
                <Text style={styles.trafficPercentage}>{source.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* SEO Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Search size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>SEO Settings</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Page Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Your business name | Services in Area"
                defaultValue="Cincinnati Painting Co | Painting Services in Cincinnati"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Meta Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief description for search engines"
                multiline
                numberOfLines={3}
                defaultValue="Professional painting services in Cincinnati. 15+ years experience. Free quotes. Call today!"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Keywords (comma separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="painting, cincinnati, house painter..."
                multiline
                numberOfLines={2}
                defaultValue="painting, cincinnati, house painter, commercial painting"
              />
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save SEO Settings</Text>
            </TouchableOpacity>
          </View>

          {/* General Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Settings size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>General Settings</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Booking Form</Text>
                <Text style={styles.settingDescription}>
                  Allow customers to submit booking requests
                </Text>
              </View>
              <Switch
                value={settings.enableBooking}
                onValueChange={() => handleToggleSetting('enableBooking')}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Live Chat</Text>
                <Text style={styles.settingDescription}>
                  Add live chat widget to your website
                </Text>
              </View>
              <Switch
                value={settings.enableChat}
                onValueChange={() => handleToggleSetting('enableChat')}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Maintenance Mode</Text>
                <Text style={styles.settingDescription}>
                  Show maintenance page to visitors
                </Text>
              </View>
              <Switch
                value={settings.maintenanceMode}
                onValueChange={() => handleToggleSetting('maintenanceMode')}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Domain & Security */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Domain & Security</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SSL Certificate</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.statusText, { color: '#065F46' }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.infoDescription}>
                Your website is secured with a free SSL certificate
              </Text>
            </View>

            <TouchableOpacity style={styles.linkButton}>
              <Globe size={18} color="#6366F1" />
              <Text style={styles.linkButtonText}>Manage Domain Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={[styles.section, styles.dangerSection]}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
            </View>

            <View style={styles.dangerCard}>
              <Text style={styles.dangerTitle}>Delete Website</Text>
              <Text style={styles.dangerDescription}>
                Permanently delete your website and all associated data. This action cannot be undone.
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteWebsite}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Trash2 size={18} color="#FFFFFF" />
                    <Text style={styles.deleteButtonText}>Delete Website</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.dangerCard}>
              <Text style={styles.dangerTitle}>Export Data</Text>
              <Text style={styles.dangerDescription}>
                Download a copy of all your website data before deleting
              </Text>
              <TouchableOpacity style={styles.exportDataButton}>
                <Download size={18} color="#6366F1" />
                <Text style={styles.exportDataButtonText}>Export Website Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  analyticsDetails: {
    marginBottom: 16,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  analyticsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trafficInfo: {
    width: 100,
  },
  trafficSource: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  trafficVisits: {
    fontSize: 12,
    color: '#6B7280',
  },
  trafficBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  trafficBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  trafficPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 8,
  },
  dangerSection: {
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  dangerCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#B91C1C',
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  exportDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  exportDataButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
});
