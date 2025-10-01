import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  backgroundColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onPress?: () => void;
  animated?: boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  backgroundColor,
  trend,
  onPress,
  animated = true,
}: StatCardProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <CardComponent
        style={[styles.card, { backgroundColor }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={onPress ? 0.9 : 1}
      >
        {/* Top Row: Icon */}
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            <Icon size={22} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>
        
        {/* Bottom Content: Value, Title, Subtitle, Trend */}
        <View style={styles.bottomContent}>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {trend && (
            <View style={styles.trendContainer}>
              <Text style={styles.trendText}>{trend.value}</Text>
            </View>
          )}
        </View>
      </CardComponent>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  // Top Row with Icon
  topRow: {
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Bottom Content
  bottomContent: {
    gap: 6,
  },
  value: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 36,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 4,
  },
  trendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
