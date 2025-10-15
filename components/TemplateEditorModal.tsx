import { Template, TermsAndConditions } from '@/types/templates';
import {
  extractKeywordsFromContent,
  formatKeyword,
  getKeywordsByCategory,
  getKeywordsForTemplate,
  TemplateKeyword,
} from '@/utils/templateKeywords';
import { ChevronDown, Code, Eye, Save, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface TemplateEditorModalProps {
  visible: boolean;
  onClose: () => void;
  template: Template | TermsAndConditions | null;
  onSave: (content: string) => void;
}

export default function TemplateEditorModal({
  visible,
  onClose,
  template,
  onSave,
}: TemplateEditorModalProps) {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeywordPicker, setShowKeywordPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible && template) {
      setContent(template.content);
      setHasChanges(false);
      setShowPreview(false);
    }
  }, [visible, template]);

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setContent('');
              setHasChanges(false);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate save delay
    setTimeout(() => {
      onSave(content);
      setSaving(false);
      setHasChanges(false);
      Alert.alert('Success', 'Template saved successfully!', [
        { text: 'OK', onPress: onClose },
      ]);
    }, 500);
  };

  const insertKeyword = (keyword: TemplateKeyword) => {
    const formattedKeyword = formatKeyword(keyword.key);
    setContent((prev) => prev + formattedKeyword);
    setHasChanges(true);
    setShowKeywordPicker(false);
  };

  const getAvailableKeywords = (): TemplateKeyword[] => {
    if (!template) return [];
    
    const keywords = getKeywordsForTemplate(template.type);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return keywords.filter(
        (k) =>
          k.label.toLowerCase().includes(query) ||
          k.key.toLowerCase().includes(query) ||
          k.description.toLowerCase().includes(query)
      );
    }
    
    return keywords;
  };

  const renderKeywordPicker = () => {
    const availableKeywords = getAvailableKeywords();
    const groupedKeywords = getKeywordsByCategory().map((group) => ({
      ...group,
      keywords: group.keywords.filter((k) =>
        availableKeywords.some((ak) => ak.key === k.key)
      ),
    })).filter((group) => group.keywords.length > 0);

    return (
      <Modal
        visible={showKeywordPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowKeywordPicker(false)}
      >
        <SafeAreaView style={styles.keywordPickerContainer}>
          <View style={styles.keywordPickerHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowKeywordPicker(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.keywordPickerTitle}>Insert Keyword</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search keywords..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView style={styles.keywordList}>
            {groupedKeywords.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.keywordGroup}>
                <Text style={styles.keywordGroupTitle}>{group.category}</Text>
                {group.keywords.map((keyword) => (
                  <TouchableOpacity
                    key={keyword.key}
                    style={styles.keywordItem}
                    onPress={() => insertKeyword(keyword)}
                  >
                    <View style={styles.keywordItemLeft}>
                      <Text style={styles.keywordLabel}>{keyword.label}</Text>
                      <Text style={styles.keywordDescription}>
                        {keyword.description}
                      </Text>
                      <Text style={styles.keywordKey}>
                        {formatKeyword(keyword.key)}
                      </Text>
                    </View>
                    <View style={styles.keywordItemRight}>
                      <Text style={styles.keywordExample}>{keyword.example}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderPreview = () => {
    // Create HTML wrapper for preview
    const previewHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 16px;
              background-color: #f9fafb;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    return (
      <Modal
        visible={showPreview}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowPreview(false)}
      >
        <SafeAreaView style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPreview(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={{ width: 40 }} />
          </View>

          <WebView
            originWhitelist={['*']}
            source={{ html: previewHTML }}
            style={styles.webview}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  if (!template) return null;

  const usedKeywords = extractKeywordsFromContent(content);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title} numberOfLines={1}>
                {template.name}
              </Text>
              {hasChanges && (
                <Text style={styles.unsavedIndicator}>• Unsaved changes</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || !hasChanges}
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

          {/* Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setShowKeywordPicker(true)}
            >
              <Code size={18} color="#6366F1" />
              <Text style={styles.toolbarButtonText}>Insert Keyword</Text>
              <ChevronDown size={16} color="#6366F1" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setShowPreview(true)}
            >
              <Eye size={18} color="#6366F1" />
              <Text style={styles.toolbarButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>

          {/* Editor */}
          <View style={styles.editorContainer}>
            <ScrollView style={styles.editorScroll}>
              <TextInput
                style={styles.editor}
                value={content}
                onChangeText={handleContentChange}
                multiline
                placeholder="Enter your template content here..."
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
            </ScrollView>

            {/* Keywords Info */}
            {usedKeywords.length > 0 && (
              <View style={styles.keywordsInfo}>
                <Text style={styles.keywordsInfoTitle}>
                  Keywords used ({usedKeywords.length}):
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.keywordTags}
                >
                  {usedKeywords.map((keyword, index) => (
                    <View key={index} style={styles.keywordTag}>
                      <Text style={styles.keywordTagText}>
                        {formatKeyword(keyword)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {renderKeywordPicker()}
      {renderPreview()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unsavedIndicator: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    gap: 6,
  },
  toolbarButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  editorContainer: {
    flex: 1,
  },
  editorScroll: {
    flex: 1,
  },
  editor: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Courier',
    color: '#111827',
    lineHeight: 20,
    minHeight: 400,
  },
  keywordsInfo: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  keywordsInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  keywordTags: {
    flexDirection: 'row',
  },
  keywordTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  keywordTagText: {
    fontSize: 11,
    color: '#4F46E5',
    fontFamily: 'Courier',
  },

  // Keyword Picker
  keywordPickerContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keywordPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  keywordPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    color: '#111827',
  },
  keywordList: {
    flex: 1,
  },
  keywordGroup: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  keywordGroupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  keywordItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  keywordItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  keywordLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  keywordDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  keywordKey: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  keywordItemRight: {
    justifyContent: 'center',
  },
  keywordExample: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

