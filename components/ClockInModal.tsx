import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: string;
}

interface ClockInModalProps {
  visible: boolean;
  jobName: string;
  onConfirm: (notes?: string) => void;
  onCancel: () => void;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({
  visible,
  jobName,
  onConfirm,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch location when modal opens
  useEffect(() => {
    if (visible) {
      fetchLocation();
    } else {
      // Reset state when modal closes
      setNotes('');
      setLocation(null);
      setLocationVerified(false);
      setLocationError(null);
    }
  }, [visible]);

  const fetchLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied. Please enable location access in settings.');
        setLoadingLocation(false);
        return;
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      let address = 'Address lookup in progress...';
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          address = [
            addr.street,
            addr.city,
            addr.region,
            addr.postalCode
          ].filter(Boolean).join(', ');
        }
      } catch (geoError) {
        console.log('Geocoding error:', geoError);
        address = 'Address unavailable';
      }

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address,
        timestamp: new Date().toISOString(),
      });
      setLoadingLocation(false);
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Unable to get your location. Please check your GPS and try again.');
      setLoadingLocation(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes('');
    setLocation(null);
    setLocationVerified(false);
  };

  const handleCancel = () => {
    setNotes('');
    setLocation(null);
    setLocationVerified(false);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="play-circle" size={48} color="#10b981" />
                </View>
                <Text style={styles.title}>Clock In</Text>
                <Text style={styles.subtitle}>Starting work on:</Text>
                <Text style={styles.jobName}>{jobName}</Text>
              </View>

              {/* Location Verification Section */}
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <Ionicons name="location" size={20} color="#3b82f6" />
                  <Text style={styles.locationTitle}>Verify Location</Text>
                </View>

                {loadingLocation && (
                  <View style={styles.locationLoading}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.locationLoadingText}>Getting your location...</Text>
                  </View>
                )}

                {locationError && (
                  <View style={styles.locationError}>
                    <Ionicons name="warning" size={20} color="#ef4444" />
                    <View style={styles.locationErrorTextContainer}>
                      <Text style={styles.locationErrorText}>{locationError}</Text>
                      <TouchableOpacity onPress={fetchLocation} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {location && !loadingLocation && (
                  <View style={styles.locationInfo}>
                    <View style={styles.locationCard}>
                      <View style={styles.locationRow}>
                        <Ionicons name="pin" size={16} color="#6b7280" />
                        <Text style={styles.locationLabel}>Address:</Text>
                      </View>
                      <Text style={styles.locationAddress}>{location.address}</Text>
                      
                      <View style={styles.coordinatesContainer}>
                        <View style={styles.coordinateItem}>
                          <Text style={styles.coordinateLabel}>Latitude:</Text>
                          <Text style={styles.coordinateValue}>
                            {location.latitude.toFixed(6)}°
                          </Text>
                        </View>
                        <View style={styles.coordinateDivider} />
                        <View style={styles.coordinateItem}>
                          <Text style={styles.coordinateLabel}>Longitude:</Text>
                          <Text style={styles.coordinateValue}>
                            {location.longitude.toFixed(6)}°
                          </Text>
                        </View>
                      </View>

                      <View style={styles.timestampRow}>
                        <Ionicons name="time-outline" size={14} color="#9ca3af" />
                        <Text style={styles.timestamp}>
                          Captured at {new Date(location.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>

                    {/* Verification Toggle */}
                    <View style={styles.verificationContainer}>
                      <View style={styles.verificationContent}>
                        <Ionicons 
                          name={locationVerified ? "checkmark-circle" : "checkmark-circle-outline"} 
                          size={24} 
                          color={locationVerified ? "#10b981" : "#9ca3af"} 
                        />
                        <Text style={styles.verificationText}>
                          I verify this is my current location
                        </Text>
                      </View>
                      <Switch
                        value={locationVerified}
                        onValueChange={setLocationVerified}
                        trackColor={{ false: '#d1d5db', true: '#86efac' }}
                        thumbColor={locationVerified ? '#10b981' : '#f3f4f6'}
                        ios_backgroundColor="#d1d5db"
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>
                  Notes (Optional)
                </Text>
                <Text style={styles.notesHint}>
                  Add any notes about your arrival or work start
                </Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Started 10 min early, Traffic delay but arrived on time, etc."
                  placeholderTextColor="#9ca3af"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{notes.length}/300</Text>
              </View>

              <View style={styles.exampleSection}>
                <Text style={styles.exampleTitle}>Example notes:</Text>
                <Text style={styles.exampleText}>• "Started early to prep equipment"</Text>
                <Text style={styles.exampleText}>• "Traffic delay but arrived on time"</Text>
                <Text style={styles.exampleText}>• "Customer not home, using spare key"</Text>
              </View>
            </ScrollView>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.confirmButton,
                  (!locationVerified || loadingLocation) && styles.confirmButtonDisabled
                ]}
                onPress={handleConfirm}
                disabled={!locationVerified || loadingLocation}
              >
                <Ionicons name="play-circle" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.confirmButtonText}>Clock In</Text>
              </TouchableOpacity>
            </View>
            
            {!locationVerified && location && (
              <Text style={styles.verificationWarning}>
                Please verify your location to clock in
              </Text>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
  },
  notesSection: {
    padding: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notesHint: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    backgroundColor: '#f9fafb',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  exampleSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#f9fafb',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  buttonIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  verificationWarning: {
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  // Location Section Styles
  locationSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  locationLoadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationError: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  locationErrorTextContainer: {
    flex: 1,
  },
  locationErrorText: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  locationInfo: {
    gap: 12,
  },
  locationCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 20,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  coordinateItem: {
    flex: 1,
  },
  coordinateDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  coordinateLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coordinateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e40af',
    fontVariant: ['tabular-nums'],
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
});

