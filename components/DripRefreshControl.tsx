import React, { useState } from 'react';
import { Animated, Image, Platform, RefreshControl, RefreshControlProps, StyleSheet, View } from 'react-native';

interface DripRefreshControlProps extends Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> {
  refreshing: boolean;
  onRefresh: () => void;
  onPulling?: (isPulling: boolean) => void;
}

export default function DripRefreshControl({ refreshing, onRefresh, onPulling, ...props }: DripRefreshControlProps) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      // iOS specific - make the spinner transparent so logo shows better
      tintColor="transparent"
      title=""
      titleColor="#6B7280"
      // Android specific - use brand colors
      colors={['#6366F1', '#8B5CF6', '#A855F7']}
      progressBackgroundColor="#FFFFFF"
      // Enable proper behavior
      enabled={true}
      {...props}
    />
  );
}

// Logo component to display during refresh
export function RefreshLogo({ visible }: { visible: boolean }) {
  const [spinValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      // Start spinning animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;
  
  return (
    <View style={styles.refreshLogoContainer}>
      <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}>
        <View style={styles.spinnerSegment} />
      </Animated.View>
      <View style={styles.logoCircle}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.refreshLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  refreshLogoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  spinnerRing: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#6366F1',
    borderRightColor: '#8B5CF6',
  },
  spinnerSegment: {
    width: '100%',
    height: '100%',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  refreshLogo: {
    width: 45,
    height: 45,
  },
});
