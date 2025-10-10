/**
 * Offline Indicator Component
 * Shows a banner at the top of the screen when the device is offline
 */

import { useNetwork } from '@/contexts/NetworkContext';
import { WifiOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function OfflineIndicator() {
  const { isConnected, isInternetReachable } = useNetwork();
  const [slideAnim] = useState(new Animated.Value(-80));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shouldShow = !isConnected || isInternetReachable === false;
    
    if (shouldShow && !visible) {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else if (!shouldShow && visible) {
      Animated.timing(slideAnim, {
        toValue: -80,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [isConnected, isInternetReachable, visible, slideAnim]);

  if (!visible && (!isConnected || isInternetReachable === false)) {
    setVisible(true);
  }

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.content}>
        <WifiOff size={18} color="#FFF" strokeWidth={2.5} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.subtitle}>You're viewing cached data</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DC2626',
    paddingTop: 50, // Account for status bar
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

