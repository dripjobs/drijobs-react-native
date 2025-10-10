import DrawerMenu from '@/components/DrawerMenu';
import { LinearGradient } from 'expo-linear-gradient';
import {
    BarChart3,
    ChevronRight,
    Filter,
    MessageCircle,
    Plus,
    Search,
    Settings,
    Star,
    Star as StarIcon,
    TrendingUp,
    Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReviewAnalyticsCard from '../components/ReviewAnalyticsCard';
import ReviewCard from '../components/ReviewCard';
import ReviewSourceCard from '../components/ReviewSourceCard';
import { ReviewsService } from '../services/ReviewsService';
import { Review, ReviewAnalytics, ReviewSource } from '../types/reviews';

type TabType = 'overview' | 'reviews' | 'sources' | 'analytics';

export default function ReviewsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<ReviewSource[]>([]);
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'reviews' as TabType, label: 'Reviews', icon: MessageCircle },
    { id: 'sources' as TabType, label: 'Sources', icon: Star },
    { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, sourcesData, analyticsData] = await Promise.all([
        ReviewsService.getReviews(),
        ReviewsService.getReviewSources(),
        ReviewsService.getReviewAnalytics(),
      ]);
      
      setReviews(reviewsData);
      setSources(sourcesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleReviewPress = (review: Review) => {
    // Navigate to review detail or open response modal
    console.log('Review pressed:', review.id);
  };

  const handleReviewRespond = (review: Review) => {
    // Open response modal
    console.log('Respond to review:', review.id);
  };

  const handleSourcePress = (source: ReviewSource) => {
    // Navigate to source settings
    console.log('Source pressed:', source.id);
  };

  const handleSourceSync = async (source: ReviewSource) => {
    try {
      await ReviewsService.syncReviewSource(source.id);
      await loadData();
      Alert.alert('Success', 'Review source synced successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync review source');
    }
  };

  const handleSourceEdit = (source: ReviewSource) => {
    // Open source edit modal
    console.log('Edit source:', source.id);
  };

  const handleSourceDelete = (source: ReviewSource) => {
    Alert.alert(
      'Delete Source',
      'Are you sure you want to delete this review source?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ReviewsService.deleteReviewSource(source.id);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete review source');
            }
          }
        }
      ]
    );
  };

  const filteredReviews = reviews.filter(review => 
    review.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.sourceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {analytics && <ReviewAnalyticsCard analytics={analytics} />}
      
      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MessageCircle size={20} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <StarIcon size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>
              {analytics ? analytics.averageRating.toFixed(1) : '0.0'}
            </Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{sources.length}</Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>
              {analytics ? `${analytics.responseRate.toFixed(0)}%` : '0%'}
            </Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {reviews.slice(0, 3).map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onPress={() => handleReviewPress(review)}
            onRespond={() => handleReviewRespond(review)}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderReviews = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onPress={() => handleReviewPress(review)}
            onRespond={() => handleReviewRespond(review)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderSources = () => (
    <View style={styles.content}>
      <View style={styles.sourcesHeader}>
        <Text style={styles.sectionTitle}>Review Sources</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddSource(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Source</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sources.map((source) => (
          <ReviewSourceCard
            key={source.id}
            source={source}
            onPress={() => handleSourcePress(source)}
            onSync={() => handleSourceSync(source)}
            onEdit={() => handleSourceEdit(source)}
            onDelete={() => handleSourceDelete(source)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {analytics && <ReviewAnalyticsCard analytics={analytics} />}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'reviews':
        return renderReviews();
      case 'sources':
        return renderSources();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Management</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <tab.icon 
                size={18} 
                color={activeTab === tab.id ? '#6366F1' : '#6B7280'} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#6366F1',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickStats: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourcesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
