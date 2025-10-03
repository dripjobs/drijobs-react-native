import { CheckCircle, MessageCircle, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Review } from '../types/reviews';

interface ReviewCardProps {
  review: Review;
  onPress?: () => void;
  onRespond?: () => void;
}

export default function ReviewCard({ review, onPress, onRespond }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? '#F59E0B' : '#D1D5DB'}
        fill={index < rating ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#10B981';
    if (rating >= 3) return '#F59E0B';
    return '#EF4444';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{review.authorName}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(review.rating)}
            </View>
            <Text style={[styles.rating, { color: getRatingColor(review.rating) }]}>
              {review.rating}/5
            </Text>
          </View>
        </View>
        <View style={styles.metaInfo}>
          <Text style={styles.sourceName}>{review.sourceName}</Text>
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      {review.title && (
        <Text style={styles.title}>{review.title}</Text>
      )}

      <Text style={styles.content} numberOfLines={3}>
        {review.content}
      </Text>

      <View style={styles.footer}>
        <View style={styles.badges}>
          {review.isVerified && (
            <View style={styles.badge}>
              <CheckCircle size={14} color="#10B981" />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          )}
          {review.isResponded && (
            <View style={[styles.badge, styles.respondedBadge]}>
              <MessageCircle size={14} color="#6366F1" />
              <Text style={[styles.badgeText, styles.respondedText]}>Responded</Text>
            </View>
          )}
        </View>

        {!review.isResponded && onRespond && (
          <TouchableOpacity style={styles.respondButton} onPress={onRespond}>
            <MessageCircle size={16} color="#6366F1" />
            <Text style={styles.respondText}>Respond</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaInfo: {
    alignItems: 'flex-end',
  },
  sourceName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  respondedBadge: {
    backgroundColor: '#EEF2FF',
  },
  badgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  respondedText: {
    color: '#6366F1',
  },
  respondButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  respondText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
});
