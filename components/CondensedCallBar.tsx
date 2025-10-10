import { Mic, MicOff, Minimize2, Phone, Volume2, VolumeX } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CondensedCallBarProps {
  contactName: string;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isOnHold: boolean;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
  onKeypadPress: () => void;
  onExpand: () => void;
  onEndCall: () => void;
}

export default function CondensedCallBar({
  contactName,
  callDuration,
  isMuted,
  isSpeakerOn,
  isOnHold,
  onMuteToggle,
  onSpeakerToggle,
  onKeypadPress,
  onExpand,
  onEndCall,
}: CondensedCallBarProps) {
  const insets = useSafeAreaInsets();
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.callBar}>
        <View style={styles.info}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contactName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{contactName}</Text>
            <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
          </View>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={onMuteToggle}
          >
            {isMuted ? (
              <MicOff size={16} color="#FFFFFF" />
            ) : (
              <Mic size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={onSpeakerToggle}
          >
            {isSpeakerOn ? (
              <Volume2 size={16} color="#FFFFFF" />
            ) : (
              <VolumeX size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onKeypadPress}
          >
            <View style={styles.keypadIcon}>
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
              <View style={styles.keypadDot} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={onExpand}
          >
            <Minimize2 size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.endButton}
            onPress={onEndCall}
          >
            <Phone size={16} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  callBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#10B981',
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadIcon: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  keypadDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
    margin: 1,
  },
});
