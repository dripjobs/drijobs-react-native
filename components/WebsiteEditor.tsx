import { Website, WebsiteContent } from '@/types/website';
import { Eye, Image as ImageIcon, Plus, Save, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface WebsiteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  onSave: (updatedContent: Partial<WebsiteContent>) => Promise<void>;
  onPreview?: () => void;
}

type Section = 'hero' | 'about' | 'services' | 'contact' | 'colors';

export default function WebsiteEditor({
  isOpen,
  onClose,
  website,
  onSave,
  onPreview,
}: WebsiteEditorProps) {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [editedContent, setEditedContent] = useState<WebsiteContent>(website.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedContent);
      Alert.alert('Success', 'Website updated successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      Alert.alert('Error', 'Failed to update website. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      title: 'New Service',
      description: 'Description of your service',
    };
    setEditedContent({
      ...editedContent,
      services: [...editedContent.services, newService],
    });
  };

  const removeService = (id: string) => {
    setEditedContent({
      ...editedContent,
      services: editedContent.services.filter(s => s.id !== id),
    });
  };

  const updateService = (id: string, field: 'title' | 'description', value: string) => {
    setEditedContent({
      ...editedContent,
      services: editedContent.services.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const renderHeroEditor = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Hero Headline</Text>
        <TextInput
          style={styles.input}
          value={editedContent.heroHeadline}
          onChangeText={(text) =>
            setEditedContent({ ...editedContent, heroHeadline: text })
          }
          multiline
          placeholder="Your main headline"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hero Subheadline</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={editedContent.heroSubheadline}
          onChangeText={(text) =>
            setEditedContent({ ...editedContent, heroSubheadline: text })
          }
          multiline
          numberOfLines={3}
          placeholder="Supporting text for your hero section"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tagline</Text>
        <TextInput
          style={styles.input}
          value={editedContent.tagline}
          onChangeText={(text) =>
            setEditedContent({ ...editedContent, tagline: text })
          }
          placeholder="Your business tagline"
        />
      </View>
    </View>
  );

  const renderAboutEditor = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>About Title</Text>
        <TextInput
          style={styles.input}
          value={editedContent.aboutTitle}
          onChangeText={(text) =>
            setEditedContent({ ...editedContent, aboutTitle: text })
          }
          placeholder="About section title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>About Text</Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          value={editedContent.aboutText}
          onChangeText={(text) =>
            setEditedContent({ ...editedContent, aboutText: text })
          }
          multiline
          numberOfLines={6}
          placeholder="Tell your story..."
        />
      </View>
    </View>
  );

  const renderServicesEditor = () => (
    <View style={styles.sectionContent}>
      <View style={styles.servicesHeader}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={addService}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {editedContent.services.map((service, index) => (
        <View key={service.id} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceNumber}>Service {index + 1}</Text>
            <TouchableOpacity onPress={() => removeService(service.id)}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={service.title}
              onChangeText={(text) => updateService(service.id, 'title', text)}
              placeholder="Service title"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={service.description}
              onChangeText={(text) => updateService(service.id, 'description', text)}
              multiline
              numberOfLines={3}
              placeholder="Service description"
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderContactEditor = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={editedContent.contactInfo.phone}
          onChangeText={(text) =>
            setEditedContent({
              ...editedContent,
              contactInfo: { ...editedContent.contactInfo, phone: text },
            })
          }
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={editedContent.contactInfo.email}
          onChangeText={(text) =>
            setEditedContent({
              ...editedContent,
              contactInfo: { ...editedContent.contactInfo, email: text },
            })
          }
          placeholder="contact@business.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={editedContent.contactInfo.address}
          onChangeText={(text) =>
            setEditedContent({
              ...editedContent,
              contactInfo: { ...editedContent.contactInfo, address: text },
            })
          }
          placeholder="123 Main St"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 2 }]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={editedContent.contactInfo.city}
            onChangeText={(text) =>
              setEditedContent({
                ...editedContent,
                contactInfo: { ...editedContent.contactInfo, city: text },
              })
            }
            placeholder="City"
          />
        </View>

        <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={editedContent.contactInfo.state}
            onChangeText={(text) =>
              setEditedContent({
                ...editedContent,
                contactInfo: { ...editedContent.contactInfo, state: text },
              })
            }
            placeholder="OH"
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>
    </View>
  );

  const renderColorsEditor = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Color</Text>
        <View style={styles.colorPicker}>
          {['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                editedContent.brandAssets.primaryColor === color && styles.colorOptionSelected,
              ]}
              onPress={() =>
                setEditedContent({
                  ...editedContent,
                  brandAssets: {
                    ...editedContent.brandAssets,
                    primaryColor: color,
                  },
                })
              }
            >
              {editedContent.brandAssets.primaryColor === color && (
                <View style={styles.colorCheckmark} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <ImageIcon size={32} color="#9CA3AF" />
          <Text style={styles.uploadText}>Upload New Logo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroEditor();
      case 'about':
        return renderAboutEditor();
      case 'services':
        return renderServicesEditor();
      case 'contact':
        return renderContactEditor();
      case 'colors':
        return renderColorsEditor();
      default:
        return null;
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
          <Text style={styles.headerTitle}>Edit Website</Text>
          <View style={styles.headerActions}>
            {onPreview && (
              <TouchableOpacity onPress={onPreview} style={styles.previewButton}>
                <Eye size={18} color="#6366F1" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Save size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editorContainer}>
          {/* Section Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sectionTabs}
            contentContainerStyle={styles.sectionTabsContent}
          >
            {[
              { key: 'hero', label: 'Hero' },
              { key: 'about', label: 'About' },
              { key: 'services', label: 'Services' },
              { key: 'contact', label: 'Contact' },
              { key: 'colors', label: 'Brand' },
            ].map((section) => (
              <TouchableOpacity
                key={section.key}
                style={[
                  styles.sectionTab,
                  activeSection === section.key && styles.sectionTabActive,
                ]}
                onPress={() => setActiveSection(section.key as Section)}
              >
                <Text
                  style={[
                    styles.sectionTabText,
                    activeSection === section.key && styles.sectionTabTextActive,
                  ]}
                >
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Editor Content */}
          <ScrollView style={styles.editorContent} showsVerticalScrollIndicator={false}>
            {renderSectionContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    flex: 1,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewButton: {
    padding: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editorContainer: {
    flex: 1,
  },
  sectionTabs: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  sectionTabActive: {
    backgroundColor: '#6366F1',
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sectionTabTextActive: {
    color: '#FFFFFF',
  },
  editorContent: {
    flex: 1,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 120,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
  },
});
