import { MessageCircle, Star, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReviewAnalytics } from '../types/reviews';

interface ReviewAnalyticsCardProps {
  analytics: ReviewAnalytics;
}

export default function ReviewAnalyticsCard({ analytics }: ReviewAnalyticsCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
        fill={index < Math.floor(rating) ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  const getSentimentColor = (type: 'positive' | 'neutral' | 'negative') => {
    switch (type) {
      case 'positive':
        return '#10B981';
      case 'neutral':
        return '#F59E0B';
      case 'negative':
        return '#EF4444';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Analytics</Text>
      
      <View style={styles.overview}>
        <View style={styles.overviewItem}>
          <View style={styles.overviewIcon}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
          </View>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewValue}>{analytics.averageRating.toFixed(1)}</Text>
            <Text style={styles.overviewLabel}>Average Rating</Text>
          </View>
        </View>
        
        <View style={styles.overviewItem}>
          <View style={styles.overviewIcon}>
            <MessageCircle size={20} color="#6366F1" />
          </View>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewValue}>{analytics.totalReviews}</Text>
            <Text style={styles.overviewLabel}>Total Reviews</Text>
          </View>
        </View>
        
        <View style={styles.overviewItem}>
          <View style={styles.overviewIcon}>
            <TrendingUp size={20} color="#10B981" />
          </View>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewValue}>{analytics.responseRate.toFixed(0)}%</Text>
            <Text style={styles.overviewLabel}>Response Rate</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating Distribution</Text>
        <View style={styles.ratingDistribution}>
          {Object.entries(analytics.ratingDistribution)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([rating, count]) => (
              <View key={rating} style={styles.ratingBar}>
                <View style={styles.ratingBarHeader}>
                  <View style={styles.ratingStars}>
                    {renderStars(Number(rating))}
                  </View>
                  <Text style={styles.ratingCount}>{count}</Text>
                </View>
                <View style={styles.ratingBarTrack}>
                  <View 
                    style={[
                      styles.ratingBarFill,
                      { 
                        width: `${(count / analytics.totalReviews) * 100}%`,
                        backgroundColor: getSentimentColor(
                          Number(rating) >= 4 ? 'positive' : 
                          Number(rating) >= 3 ? 'neutral' : 'negative'
                        )
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sentiment Analysis</Text>
        <View style={styles.sentimentGrid}>
          <View style={styles.sentimentItem}>
            <View style={[styles.sentimentDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.sentimentLabel}>Positive</Text>
            <Text style={styles.sentimentValue}>{analytics.sentimentAnalysis.positive}</Text>
          </View>
          <View style={styles.sentimentItem}>
            <View style={[styles.sentimentDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.sentimentLabel}>Neutral</Text>
            <Text style={styles.sentimentValue}>{analytics.sentimentAnalysis.neutral}</Text>
          </View>
          <View style={styles.sentimentItem}>
            <View style={[styles.sentimentDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.sentimentLabel}>Negative</Text>
            <Text style={styles.sentimentValue}>{analytics.sentimentAnalysis.negative}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Review Sources</Text>
        <View style={styles.sourcesList}>
          {analytics.topReviewSources.map((source, index) => (
            <View key={source.sourceId} style={styles.sourceItem}>
              <View style={styles.sourceRank}>
                <Text style={styles.sourceRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceName}>{source.sourceName}</Text>
                <Text style={styles.sourceStats}>
                  {source.reviewCount} reviews • {source.averageRating.toFixed(1)} avg
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  overviewContent: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ratingDistribution: {
    gap: 8,
  },
  ratingBar: {
    marginBottom: 8,
  },
  ratingBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingBarTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sentimentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  sentimentLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  sentimentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sourcesList: {
    gap: 8,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sourceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sourceRankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sourceStats: {
    fontSize: 12,
    color: '#6B7280',
  },
});
