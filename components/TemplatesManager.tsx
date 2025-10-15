import templateService from '@/services/TemplateService';
import {
  Template,
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
  TermsAndConditions,
} from '@/types/templates';
import { getDefaultTemplate } from '@/utils/defaultTemplates';
import {
  AlertCircle,
  Badge,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
  Plus,
  Search,
  Shield,
  Trash2,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TemplateEditorModal from './TemplateEditorModal';

export default function TemplatesManager() {
  const [termsAndConditions, setTermsAndConditions] = useState<TermsAndConditions[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['terms', 'proposals', 'invoices'])
  );
  const [editingTemplate, setEditingTemplate] = useState<Template | TermsAndConditions | null>(
    null
  );
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTermsAndConditions(templateService.getAllTermsAndConditions());
    setTemplates(templateService.getAllTemplates());
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateNewTC = () => {
    Alert.prompt(
      'Create Terms & Conditions',
      'Enter a name for this variation (e.g., "Residential", "Commercial")',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: (variationName) => {
            if (variationName && variationName.trim()) {
              const newTC = templateService.createTermsAndConditions(
                variationName.trim(),
                getDefaultTemplate('terms_and_conditions'),
                termsAndConditions.length === 0
              );
              loadTemplates();
              Alert.alert('Success', 'Terms & Conditions created successfully!');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleEditTemplate = (template: Template | TermsAndConditions) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = (content: string) => {
    if (!editingTemplate) return;

    if ('variationName' in editingTemplate) {
      // It's a Terms & Conditions
      templateService.updateTermsAndConditions(editingTemplate.id, { content });
    } else {
      // It's a regular template
      templateService.updateTemplate(editingTemplate.id, { content });
    }

    loadTemplates();
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleSetDefaultTC = (id: string) => {
    Alert.alert(
      'Set as Default',
      'This will replace the current default Terms & Conditions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set as Default',
          onPress: () => {
            templateService.setDefaultTermsAndConditions(id);
            loadTemplates();
          },
        },
      ]
    );
  };

  const handleDeleteTC = (id: string) => {
    Alert.alert(
      'Delete Terms & Conditions',
      'Are you sure you want to delete this variation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = templateService.deleteTermsAndConditions(id);
            if (result.success) {
              loadTemplates();
              Alert.alert('Success', 'Terms & Conditions deleted successfully!');
            } else {
              Alert.alert('Error', result.error || 'Failed to delete Terms & Conditions');
            }
          },
        },
      ]
    );
  };

  const handleToggleTemplateActive = (template: Template) => {
    templateService.updateTemplate(template.id, { isActive: !template.isActive });
    loadTemplates();
  };

  const handleResetToDefault = (template: Template) => {
    Alert.alert(
      'Reset to Default',
      'This will replace your custom content with the default template. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            templateService.resetTemplateToDefault(template.id);
            loadTemplates();
            Alert.alert('Success', 'Template reset to default!');
          },
        },
      ]
    );
  };

  const getFilteredTemplates = () => {
    if (!searchQuery.trim()) return templates;
    return templateService.searchTemplates(searchQuery);
  };

  const getTemplatesByCategory = (category: TemplateCategory) => {
    const filtered = getFilteredTemplates();
    return filtered.filter((t) => t.category === category);
  };

  const categories: TemplateCategory[] = [
    'proposals',
    'invoices',
    'appointments',
    'jobs',
    'work_orders',
    'change_orders',
    'estimates',
    'booking_forms',
    'confirmations',
    'resolutions',
    'financing',
  ];

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Terms & Conditions Section */}
        <View style={styles.termsSection}>
          <View style={styles.termsSectionHeader}>
            <Shield size={24} color="#6366F1" />
            <Text style={styles.termsSectionTitle}>Terms & Conditions</Text>
          </View>
          <Text style={styles.termsSectionDescription}>
            Manage your Terms & Conditions variations. Create different versions for residential,
            commercial, or other service types.
          </Text>

          {termsAndConditions.map((tc) => (
            <View key={tc.id} style={styles.termsCard}>
              <View style={styles.termsCardHeader}>
                <View style={styles.termsCardTitleRow}>
                  <Text style={styles.termsCardTitle}>{tc.variationName}</Text>
                  {tc.isDefault && (
                    <View style={styles.defaultBadge}>
                      <CheckCircle size={14} color="#FFFFFF" />
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.termsCardDate}>
                  Last updated: {new Date(tc.updatedAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.termsCardActions}>
                <TouchableOpacity
                  style={styles.termsCardButton}
                  onPress={() => handleEditTemplate(tc)}
                >
                  <Edit size={16} color="#6366F1" />
                  <Text style={styles.termsCardButtonText}>Edit</Text>
                </TouchableOpacity>

                {!tc.isDefault && (
                  <>
                    <TouchableOpacity
                      style={styles.termsCardButton}
                      onPress={() => handleSetDefaultTC(tc.id)}
                    >
                      <Badge size={16} color="#10B981" />
                      <Text style={[styles.termsCardButtonText, { color: '#10B981' }]}>
                        Set as Default
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.termsCardButton}
                      onPress={() => handleDeleteTC(tc.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={[styles.termsCardButtonText, { color: '#EF4444' }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.createTCButton} onPress={handleCreateNewTC}>
            <Plus size={20} color="#6366F1" />
            <Text style={styles.createTCButtonText}>Create New Variation</Text>
          </TouchableOpacity>
        </View>

        {/* Template Categories */}
        <View style={styles.templatesSection}>
          <Text style={styles.templatesSectionTitle}>Email & SMS Templates</Text>

          {categories.map((category) => {
            const categoryTemplates = getTemplatesByCategory(category);
            if (categoryTemplates.length === 0 && searchQuery.trim()) return null;

            const isExpanded = expandedCategories.has(category);

            return (
              <View key={category} style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <FileText size={20} color="#6B7280" />
                    <Text style={styles.categoryTitle}>
                      {TEMPLATE_CATEGORY_LABELS[category]}
                    </Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{categoryTemplates.length}</Text>
                    </View>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color="#6B7280" />
                  ) : (
                    <ChevronDown size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.categoryContent}>
                    {categoryTemplates.map((template) => (
                      <View key={template.id} style={styles.templateItem}>
                        <View style={styles.templateItemLeft}>
                          <View style={styles.templateItemHeader}>
                            <Text style={styles.templateName}>{template.name}</Text>
                            {!template.isActive && (
                              <View style={styles.inactiveBadge}>
                                <Text style={styles.inactiveBadgeText}>Inactive</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.templateDate}>
                            Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                          </Text>
                        </View>

                        <View style={styles.templateItemRight}>
                          <Switch
                            value={template.isActive}
                            onValueChange={() => handleToggleTemplateActive(template)}
                            trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
                            thumbColor={template.isActive ? '#6366F1' : '#F3F4F6'}
                          />
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditTemplate(template)}
                          >
                            <Edit size={18} color="#6366F1" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <AlertCircle size={20} color="#6366F1" />
          <Text style={styles.infoBoxText}>
            Templates use keywords like {'{{contact.firstName}}'} and {'{{view-invoice}}'} that are
            automatically replaced with real data when sent.
          </Text>
        </View>
      </ScrollView>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        visible={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    color: '#111827',
  },
  content: {
    flex: 1,
  },

  // Terms & Conditions Section
  termsSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  termsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  termsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  termsSectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  termsCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  termsCardHeader: {
    marginBottom: 12,
  },
  termsCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  termsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  termsCardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  termsCardActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  termsCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  termsCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  createTCButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    gap: 8,
  },
  createTCButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },

  // Templates Section
  templatesSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  templatesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryContent: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  templateItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  templateItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  templateName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  inactiveBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactiveBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  templateDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  templateItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#4F46E5',
    lineHeight: 18,
  },
});

