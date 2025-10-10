import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClockInOutButtonProps {
  isClockedIn: boolean;
  isLoading?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const ClockInOutButton: React.FC<ClockInOutButtonProps> = ({
  isClockedIn,
  isLoading = false,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isClockedIn ? styles.clockOutButton : styles.clockInButton,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={isClockedIn ? 'stop-circle' : 'play-circle'}
              size={64}
              color="white"
            />
          </View>
          <Text style={styles.buttonText}>
            {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
          </Text>
          <Text style={styles.buttonSubtext}>
            {isClockedIn ? 'End your shift' : 'Start your shift'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  clockInButton: {
    backgroundColor: '#10b981',
  },
  clockOutButton: {
    backgroundColor: '#ef4444',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  buttonSubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
  },
});

