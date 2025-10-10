import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActiveClockSession } from '../types/crew';

interface ActiveTimerDisplayProps {
  session: ActiveClockSession;
  onBreakToggle?: () => void;
  showBreakButton?: boolean;
}

export const ActiveTimerDisplay: React.FC<ActiveTimerDisplayProps> = ({
  session,
  onBreakToggle,
  showBreakButton = true,
}) => {
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    // Update timer every second
    const interval = setInterval(() => {
      const now = new Date();
      const clockIn = new Date(session.clockInTime);
      const elapsed = Math.floor((now.getTime() - clockIn.getTime()) / 1000);

      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;

      setDisplayTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      setTotalMinutes(Math.floor(elapsed / 60));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.clockInTime]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const estimatedCost = (totalMinutes / 60) * session.hourlyRate;

  return (
    <View style={styles.container}>
      {/* Timer Display */}
      <View style={styles.timerCard}>
        <View style={styles.timerHeader}>
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>
        </View>

        <Text style={styles.timerText}>{displayTime}</Text>

        <View style={styles.timerInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>
              Started at {new Date(session.clockInTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Job Info */}
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Ionicons name="briefcase" size={20} color="#3b82f6" />
          <Text style={styles.jobTitle}>{session.jobName}</Text>
        </View>
        {session.jobAddress && (
          <View style={styles.jobAddress}>
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text style={styles.jobAddressText}>{session.jobAddress}</Text>
          </View>
        )}
      </View>

      {/* Cost Estimate */}
      <View style={styles.costCard}>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Estimated Labor Cost</Text>
          <Text style={styles.costValue}>{formatCurrency(estimatedCost)}</Text>
        </View>
        <View style={styles.costBreakdown}>
          <Text style={styles.costBreakdownText}>
            {(totalMinutes / 60).toFixed(2)} hrs × ${session.hourlyRate}/hr
          </Text>
        </View>
      </View>

      {/* Break Button */}
      {showBreakButton && onBreakToggle && (
        <TouchableOpacity
          style={[
            styles.breakButton,
            session.currentBreak && styles.breakButtonActive,
          ]}
          onPress={onBreakToggle}
        >
          <Ionicons
            name={session.currentBreak ? 'play' : 'pause'}
            size={20}
            color={session.currentBreak ? '#10b981' : '#f59e0b'}
          />
          <Text
            style={[
              styles.breakButtonText,
              session.currentBreak && styles.breakButtonTextActive,
            ]}
          >
            {session.currentBreak ? 'End Break' : 'Take Break'}
          </Text>
          {session.currentBreak && (
            <Text style={styles.breakDuration}>
              ({Math.floor(session.currentBreak.elapsedMinutes)} min)
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  timerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#111827',
    fontVariant: ['tabular-nums'],
    marginVertical: 8,
  },
  timerInfo: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  jobAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobAddressText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  costCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
  },
  costValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
  },
  costBreakdown: {
    alignItems: 'flex-end',
  },
  costBreakdownText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  breakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  breakButtonActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  breakButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
  },
  breakButtonTextActive: {
    color: '#10b981',
  },
  breakDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
});

