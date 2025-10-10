import { useCall } from '@/contexts/CallContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActiveCallModal from './ActiveCallModal';
import CondensedCallBar from './CondensedCallBar';

export default function GlobalCallOverlay() {
  const { 
    isCallActive, 
    isCallMinimized, 
    activeCallContact, 
    callDuration,
    isMuted,
    isSpeakerOn,
    isOnHold,
    endCall, 
    minimizeCall, 
    expandCall,
    toggleMute,
    toggleSpeaker,
  } = useCall();

  if (!isCallActive || !activeCallContact) {
    return null;
  }

  return (
    <>
      {/* Full Screen Call Modal */}
      {!isCallMinimized && (
        <ActiveCallModal
          visible={true}
          onClose={endCall}
          contactName={activeCallContact.name}
          phoneNumber={activeCallContact.phoneNumber}
          onMinimize={minimizeCall}
          isMinimized={false}
        />
      )}

      {/* Condensed Call Bar */}
      {isCallMinimized && (
        <View style={styles.condensedBarContainer}>
          <CondensedCallBar
            contactName={activeCallContact.name}
            callDuration={callDuration}
            isMuted={isMuted}
            isSpeakerOn={isSpeakerOn}
            isOnHold={isOnHold}
            onMuteToggle={toggleMute}
            onSpeakerToggle={toggleSpeaker}
            onKeypadPress={() => {}}
            onExpand={expandCall}
            onEndCall={endCall}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  condensedBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000, // For Android
  },
});
