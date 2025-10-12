import { timeTrackingService } from '@/services/TimeTrackingService';
import { ActiveClockSession } from '@/types/crew';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ClockedInBannerProps {
  crewMemberId: string;
}

export const ClockedInBanner: React.FC<ClockedInBannerProps> = ({ crewMemberId }) => {
  const [session, setSession] = useState<ActiveClockSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState('');

  const loadSession = useCallback(() => {
    const activeSession = timeTrackingService.getActiveSessionByCrewMember(crewMemberId);
    if (activeSession) {
      setSession(activeSession);
      const formatted = formatElapsedTime(activeSession.elapsedMinutes);
      setElapsedTime(formatted);
    } else {
      setSession(null);
    }
  }, [crewMemberId]);

  // Reload session when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSession();
    }, [loadSession])
  );

  useEffect(() => {
    loadSession();
    const interval = setInterval(() => {
      loadSession();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [crewMemberId, loadSession]);

  const formatElapsedTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!session) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push('/timesheets')}
      activeOpacity={0.8}
    >
      <View style={styles.pulsingDot} />
      <View style={styles.content}>
        <Text style={styles.title}>Clocked In</Text>
        <Text style={styles.jobName} numberOfLines={1}>
          {session.jobName}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={16} color="#047857" />
        <Text style={styles.time}>{elapsedTime}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#047857" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
    gap: 12,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  jobName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
  },
});

