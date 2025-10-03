import { ExternalLink, RefreshCw, Settings, Star, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReviewSource } from '../types/reviews';

interface ReviewSourceCardProps {
  source: ReviewSource;
  onPress?: () => void;
  onSync?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ReviewSourceCard({ 
  source, 
  onPress, 
  onSync, 
  onEdit, 
  onDelete 
}: ReviewSourceCardProps) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'google':
        return '🔍';
      case 'facebook':
        return '📘';
      case 'yelp':
        return '📍';
      default:
        return '⭐';
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'google':
        return '#4285F4';
      case 'facebook':
        return '#1877F2';
      case 'yelp':
        return '#FF1A1A';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.sourceInfo}>
          <View style={[styles.iconContainer, { backgroundColor: getSourceColor(source.type) + '20' }]}>
            <Text style={styles.icon}>{getSourceIcon(source.type)}</Text>
          </View>
          <View style={styles.sourceDetails}>
            <Text style={styles.sourceName}>{source.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: source.isActive ? '#10B981' : '#EF4444' }
              ]} />
              <Text style={[
                styles.statusText,
                { color: source.isActive ? '#10B981' : '#EF4444' }
              ]}>
                {source.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          {onSync && (
            <TouchableOpacity style={styles.actionButton} onPress={onSync}>
              <RefreshCw size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Settings size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{source.reviewCount}</Text>
          <Text style={styles.metricLabel}>Reviews</Text>
        </View>
        <View style={styles.metric}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.metricValue}>{source.averageRating.toFixed(1)}</Text>
          </View>
          <Text style={styles.metricLabel}>Avg Rating</Text>
        </View>
        {source.lastSync && (
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {formatDate(source.lastSync)}
            </Text>
            <Text style={styles.metricLabel}>Last Sync</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.urlButton} onPress={() => {}}>
          <ExternalLink size={14} color="#6366F1" />
          <Text style={styles.urlText}>View Profile</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  sourceDetails: {
    flex: 1,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  urlButton: {
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
  urlText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
});
