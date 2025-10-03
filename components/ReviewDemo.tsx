import { MessageCircle, Star, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReviewsService } from '../services/ReviewsService';
import { Review, ReviewAnalytics, ReviewSource } from '../types/reviews';

export default function ReviewDemo() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<ReviewSource[]>([]);
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
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
      console.error('Error loading demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    try {
      await ReviewsService.syncReviewSource(sourceId);
      await loadDemoData();
      Alert.alert('Success', 'Review source synced successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync review source');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading review data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Management Demo</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Star size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{analytics?.averageRating.toFixed(1) || '0.0'}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        
        <View style={styles.statItem}>
          <MessageCircle size={24} color="#6366F1" />
          <Text style={styles.statValue}>{reviews.length}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        
        <View style={styles.statItem}>
          <TrendingUp size={24} color="#10B981" />
          <Text style={styles.statValue}>{analytics?.responseRate.toFixed(0) || '0'}%</Text>
          <Text style={styles.statLabel}>Response Rate</Text>
        </View>
      </View>

      <View style={styles.sourcesContainer}>
        <Text style={styles.sectionTitle}>Review Sources</Text>
        {sources.map((source) => (
          <TouchableOpacity
            key={source.id}
            style={styles.sourceItem}
            onPress={() => handleSyncSource(source.id)}
          >
            <Text style={styles.sourceName}>{source.name}</Text>
            <Text style={styles.sourceStats}>
              {source.reviewCount} reviews • {source.averageRating.toFixed(1)} avg
            </Text>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: source.isActive ? '#10B981' : '#EF4444' }
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {reviews.slice(0, 3).map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{review.authorName}</Text>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={14}
                    color={index < review.rating ? '#F59E0B' : '#D1D5DB'}
                    fill={index < review.rating ? '#F59E0B' : 'transparent'}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewContent} numberOfLines={2}>
              {review.content}
            </Text>
            <Text style={styles.reviewSource}>{review.sourceName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sourcesContainer: {
    marginBottom: 30,
  },
  sourceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  sourceStats: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewSource: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
