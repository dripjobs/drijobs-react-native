import WebsiteWizard from '@/components/WebsiteWizard';
import WebsiteService from '@/services/WebsiteService';
import { Website } from '@/types/website';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    BarChart3,
    Edit,
    ExternalLink,
    Eye,
    Globe,
    Plus,
    Power,
    Settings,
    TrendingUp,
    Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function WebsiteScreen() {
  const router = useRouter();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    loadWebsite();
  }, []);

  const loadWebsite = async () => {
    try {
      setLoading(true);
      // TODO: Get actual user ID from auth context
      const userWebsite = await WebsiteService.getUserWebsite('user-1');
      setWebsite(userWebsite);
    } catch (error) {
      console.error('Failed to load website:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardComplete = async (newWebsite: Website) => {
    setWebsite(newWebsite);
    setShowWizard(false);
  };

  const handlePublish = async () => {
    if (!website) return;
    
    try {
      const result = await WebsiteService.publishWebsite(website.id);
      if (result.success) {
        setWebsite({
          ...website,
          status: 'published',
          publishedAt: new Date().toISOString()
        });
        alert('Website published successfully!');
      }
    } catch (error) {
      console.error('Failed to publish website:', error);
      alert('Failed to publish website. Please try again.');
    }
  };

  const handleToggleStatus = async () => {
    if (!website) return;
    
    const newStatus = website.status === 'published' ? 'offline' : 'published';
    try {
      await WebsiteService.updateWebsite(website.id, { status: newStatus });
      setWebsite({ ...website, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Website</Text>
        <Text style={styles.headerSubtitle}>
          {website ? 'Manage your website' : 'Create your professional website'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Globe size={64} color="#6366F1" />
      </View>
      <Text style={styles.emptyTitle}>Create Your Website</Text>
      <Text style={styles.emptySubtitle}>
        Launch a professional website in under 10 minutes with AI-powered content and modern templates
      </Text>
      
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <View style={styles.featureBullet} />
          <Text style={styles.featureText}>AI-generated SEO content</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureBullet} />
          <Text style={styles.featureText}>5 professional templates</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureBullet} />
          <Text style={styles.featureText}>Integrated booking forms</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureBullet} />
          <Text style={styles.featureText}>Free subdomain hosting</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.getStartedButton} onPress={() => setShowWizard(true)}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWebsiteDashboard = () => {
    if (!website) return null;

    const statusColors = {
      draft: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      generating: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
      ready: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      published: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      offline: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    };

    const statusColor = statusColors[website.status];

    return (
      <ScrollView style={styles.dashboard} showsVerticalScrollIndicator={false}>
        {/* Website Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>{website.businessName}</Text>
              <Text style={styles.previewUrl}>
                {website.subdomain}.dripjobs.io
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {website.status}
              </Text>
            </View>
          </View>

          <View style={styles.previewPlaceholder}>
            <Globe size={48} color="#D1D5DB" />
            <Text style={styles.previewPlaceholderText}>Website Preview</Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Edit size={18} color="#6366F1" />
              <Text style={styles.quickActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Eye size={18} color="#6366F1" />
              <Text style={styles.quickActionText}>Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Settings size={18} color="#6366F1" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickActionButton, styles.quickActionButtonPrimary]}
              onPress={website.status === 'published' ? handleToggleStatus : handlePublish}
            >
              <Power size={18} color="#FFFFFF" />
              <Text style={[styles.quickActionText, styles.quickActionTextPrimary]}>
                {website.status === 'published' ? 'Offline' : 'Publish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <BarChart3 size={20} color="#3B82F6" />
              </View>
              <Text style={styles.statLabel}>Total Visits</Text>
            </View>
            <Text style={styles.statValue}>{website.analytics.totalVisits.toLocaleString()}</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={14} color="#10B981" />
              <Text style={styles.statTrendText}>+12.5%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <Users size={20} color="#10B981" />
              </View>
              <Text style={styles.statLabel}>Form Submissions</Text>
            </View>
            <Text style={styles.statValue}>{website.analytics.totalFormSubmissions}</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={14} color="#10B981" />
              <Text style={styles.statTrendText}>+8.3%</Text>
            </View>
          </View>
        </View>

        {/* Analytics Summary */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <Text style={styles.analyticsTitle}>Analytics Summary</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.analyticsRow}>
            <Text style={styles.analyticsLabel}>Bounce Rate</Text>
            <Text style={styles.analyticsValue}>{website.analytics.bounceRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.analyticsRow}>
            <Text style={styles.analyticsLabel}>Avg. Time on Site</Text>
            <Text style={styles.analyticsValue}>{Math.floor(website.analytics.averageTimeOnSite / 60)}m {website.analytics.averageTimeOnSite % 60}s</Text>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksCard}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <TouchableOpacity style={styles.quickLink}>
            <ExternalLink size={18} color="#6366F1" />
            <Text style={styles.quickLinkText}>View Live Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink}>
            <Settings size={18} color="#6366F1" />
            <Text style={styles.quickLinkText}>Domain Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink}>
            <BarChart3 size={18} color="#6366F1" />
            <Text style={styles.quickLinkText}>Advanced Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.background}>
          {renderHeader()}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.background}>
        {renderHeader()}
        {website ? renderWebsiteDashboard() : renderEmptyState()}
        
        <WebsiteWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dashboard: {
    flex: 1,
    padding: 20,
  },
  previewCard: {
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
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  previewUrl: {
    fontSize: 14,
    color: '#6366F1',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    textTransform: 'capitalize',
  },
  previewPlaceholder: {
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionButtonPrimary: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 6,
  },
  quickActionTextPrimary: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  quickLinksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLinksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickLinkText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
});
