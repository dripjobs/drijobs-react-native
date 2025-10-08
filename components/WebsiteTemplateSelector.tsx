import { WebsiteTemplate } from '@/types/website';
import { Check, Eye, Palette, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface WebsiteTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  templates: WebsiteTemplate[];
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
}

export default function WebsiteTemplateSelector({
  isOpen,
  onClose,
  templates,
  selectedTemplateId,
  onSelect,
}: WebsiteTemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);

  const handleSelect = (templateId: string) => {
    onSelect(templateId);
    onClose();
  };

  const renderTemplatePreview = () => {
    if (!previewTemplate) return null;

    return (
      <Modal visible={!!previewTemplate} animationType="slide" onRequestClose={() => setPreviewTemplate(null)}>
        <SafeAreaView style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={() => setPreviewTemplate(null)} style={styles.closeButton}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>{previewTemplate.name}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                handleSelect(previewTemplate.id);
                setPreviewTemplate(null);
              }}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.previewPlaceholder}>
            <Palette size={64} color="#D1D5DB" />
            <Text style={styles.previewPlaceholderText}>Template Preview</Text>
            <Text style={styles.previewPlaceholderSubtext}>{previewTemplate.description}</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Template</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Select a design that best represents your business
          </Text>

          <View style={styles.templatesGrid}>
            {templates.map((template) => (
              <View key={template.id} style={styles.templateCard}>
                <View style={styles.templatePreviewArea}>
                  <Palette size={48} color="#D1D5DB" />
                  {selectedTemplateId === template.id && (
                    <View style={styles.selectedBadge}>
                      <Check size={20} color="#10B981" />
                    </View>
                  )}
                </View>

                <View style={styles.templateInfo}>
                  <View style={styles.templateHeader}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <View style={[styles.categoryBadge, getCategoryStyle(template.category)]}>
                      <Text style={[styles.categoryText, getCategoryTextStyle(template.category)]}>
                        {template.category}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  
                  <View style={styles.featuresList}>
                    {template.features.slice(0, 3).map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.templateActions}>
                    <TouchableOpacity
                      style={styles.previewButton}
                      onPress={() => setPreviewTemplate(template)}
                    >
                      <Eye size={16} color="#6366F1" />
                      <Text style={styles.previewButtonText}>Preview</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.chooseButton,
                        selectedTemplateId === template.id && styles.chooseButtonSelected
                      ]}
                      onPress={() => handleSelect(template.id)}
                    >
                      <Text style={[
                        styles.chooseButtonText,
                        selectedTemplateId === template.id && styles.chooseButtonTextSelected
                      ]}>
                        {selectedTemplateId === template.id ? 'Selected' : 'Choose'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {renderTemplatePreview()}
      </SafeAreaView>
    </Modal>
  );
}

const getCategoryStyle = (category: string) => {
  const styles = {
    classic: { backgroundColor: '#DBEAFE' },
    modern: { backgroundColor: '#F3E8FF' },
    bold: { backgroundColor: '#FEE2E2' },
    service: { backgroundColor: '#D1FAE5' },
    trust: { backgroundColor: '#FEF3C7' },
  };
  return styles[category] || styles.classic;
};

const getCategoryTextStyle = (category: string) => {
  const styles = {
    classic: { color: '#1E40AF' },
    modern: { color: '#6B21A8' },
    bold: { color: '#991B1B' },
    service: { color: '#065F46' },
    trust: { color: '#92400E' },
  };
  return styles[category] || styles.classic;
};

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
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  templatesGrid: {
    gap: 20,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  templatePreviewArea: {
    height: 180,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    padding: 20,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 6,
  },
  chooseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseButtonSelected: {
    backgroundColor: '#10B981',
  },
  chooseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chooseButtonTextSelected: {
    color: '#FFFFFF',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  previewPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  previewPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
