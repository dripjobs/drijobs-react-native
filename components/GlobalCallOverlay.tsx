import { useCall } from '@/contexts/CallContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActiveCallModal from './ActiveCallModal';

export default function GlobalCallOverlay() {
  const { isCallActive, isCallMinimized, activeCallContact, endCall, minimizeCall, expandCall } = useCall();

  if (!isCallActive || !activeCallContact) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActiveCallModal
        visible={!isCallMinimized}
        onClose={endCall}
        contactName={activeCallContact.name}
        phoneNumber={activeCallContact.phoneNumber}
        onMinimize={minimizeCall}
        isMinimized={isCallMinimized}
      />
      {isCallMinimized && (
        <ActiveCallModal
          visible={false}
          onClose={endCall}
          contactName={activeCallContact.name}
          phoneNumber={activeCallContact.phoneNumber}
          onMinimize={expandCall}
          isMinimized={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
