import { Edit, Monitor, Share2, Smartphone, Tablet, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WebView } from 'react-native-webview';

interface WebsitePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  onEdit?: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export default function WebsitePreview({
  isOpen,
  onClose,
  websiteUrl,
  onEdit,
}: WebsitePreviewProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my website: ${websiteUrl}`,
        url: websiteUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getDeviceWidth = () => {
    switch (deviceType) {
      case 'mobile':
        return 375;
      case 'tablet':
        return 768;
      case 'desktop':
        return '100%';
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Share2 size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Device Toggle */}
        <View style={styles.deviceToggle}>
          <TouchableOpacity
            style={[styles.deviceButton, deviceType === 'mobile' && styles.deviceButtonActive]}
            onPress={() => setDeviceType('mobile')}
          >
            <Smartphone size={18} color={deviceType === 'mobile' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.deviceButtonText, deviceType === 'mobile' && styles.deviceButtonTextActive]}>
              Mobile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deviceButton, deviceType === 'tablet' && styles.deviceButtonActive]}
            onPress={() => setDeviceType('tablet')}
          >
            <Tablet size={18} color={deviceType === 'tablet' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.deviceButtonText, deviceType === 'tablet' && styles.deviceButtonTextActive]}>
              Tablet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deviceButton, deviceType === 'desktop' && styles.deviceButtonActive]}
            onPress={() => setDeviceType('desktop')}
          >
            <Monitor size={18} color={deviceType === 'desktop' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.deviceButtonText, deviceType === 'desktop' && styles.deviceButtonTextActive]}>
              Desktop
            </Text>
          </TouchableOpacity>
        </View>

        {/* URL Bar */}
        <View style={styles.urlBar}>
          <Text style={styles.urlText} numberOfLines={1}>
            {websiteUrl}
          </Text>
        </View>

        {/* WebView */}
        <View style={styles.previewContainer}>
          <View style={[styles.webviewWrapper, { width: getDeviceWidth() }]}>
            <WebView
              source={{ uri: websiteUrl }}
              style={styles.webview}
              startInLoadingState
              scalesPageToFit
            />
          </View>
        </View>

        {/* Edit Button */}
        {onEdit && (
          <TouchableOpacity style={styles.floatingEditButton} onPress={onEdit}>
            <Edit size={20} color="#FFFFFF" />
            <Text style={styles.floatingEditButtonText}>Edit Website</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    padding: 8,
  },
  deviceToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  deviceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deviceButtonActive: {
    backgroundColor: '#6366F1',
  },
  deviceButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  deviceButtonTextActive: {
    color: '#FFFFFF',
  },
  urlBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  urlText: {
    fontSize: 14,
    color: '#6366F1',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  webview: {
    flex: 1,
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingEditButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
