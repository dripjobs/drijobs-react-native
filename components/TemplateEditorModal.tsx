import { Template, TermsAndConditions } from '@/types/templates';
import { getDefaultSubject, getDefaultTemplate, isEmailTemplate } from '@/utils/defaultTemplates';
import {
    extractKeywordsFromContent,
    formatKeyword,
    getKeywordsByCategory,
    getKeywordsForTemplate,
    TemplateKeyword,
} from '@/utils/templateKeywords';
import { ChevronDown, Code, Eye, RotateCcw, Save, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { WebView } from 'react-native-webview';

interface TemplateEditorModalProps {
  visible: boolean;
  onClose: () => void;
  template: Template | TermsAndConditions | null;
  onSave: (content: string, subject?: string) => void;
}

// Demo data for preview
const DEMO_DATA: Record<string, string> = {
  'contact.firstName': 'John',
  'contact.lastName': 'Smith',
  'contact.fullName': 'John Smith',
  'contact.email': 'john.smith@example.com',
  'contact.phone': '(555) 123-4567',
  'contact.address': '123 Main St, Atlanta, GA 30301',
  'business.name': 'Acme Corporation',
  'business.phone': '(555) 987-6543',
  'business.address': '456 Business Blvd, Atlanta, GA 30302',
  'company.name': 'DripJobs Demo Co.',
  'company.phone': '(555) 123-4567',
  'company.email': 'hello@dripjobs.com',
  'company.website': 'https://dripjobs.com',
  'company.address': '123 Main St, Atlanta, GA 30301',
  'invoice.number': 'INV-1234',
  'invoice.date': 'January 15, 2025',
  'invoice.dueDate': 'January 30, 2025',
  'invoice.total': '$1,250.00',
  'invoice.subtotal': '$1,150.00',
  'invoice.tax': '$100.00',
  'invoice.balance': '$500.00',
  'payment.amount': '$750.00',
  'payment.method': 'Credit Card',
  'payment.date': 'January 20, 2025',
  'appointment.date': 'January 25, 2025',
  'appointment.time': '2:00 PM',
  'appointment.duration': '1 hour',
  'appointment.type': 'Estimate',
  'appointment.address': '123 Main St, Atlanta, GA 30301',
  'appointment.notes': 'Please bring paint samples',
  'job.number': 'JOB-5678',
  'job.title': 'Exterior Painting',
  'job.date': 'February 1, 2025',
  'job.time': '8:00 AM',
  'job.address': '123 Main St, Atlanta, GA 30301',
  'job.crew': 'Team Alpha',
  'job.estimatedDuration': '2 days',
  'job.total': '$2,500.00',
};

// Action keywords that should render as buttons
const ACTION_KEYWORDS: Record<string, string> = {
  'view-invoice': 'View Invoice',
  'pay-invoice': 'Pay Now',
  'view-proposal': 'View Proposal',
  'accept-proposal': 'Accept Proposal',
  'reschedule-link': 'Reschedule',
  'confirm-appointment': 'Confirm Appointment',
  'payment-link': 'Make Payment',
  'booking-form-link': 'Book Now',
};

export default function TemplateEditorModal({
  visible,
  onClose,
  template,
  onSave,
}: TemplateEditorModalProps) {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeywordPicker, setShowKeywordPicker] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showHTMLSource, setShowHTMLSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubjectFocused, setIsSubjectFocused] = useState(false);
  const richText = useRef<RichEditor>(null);

  useEffect(() => {
    if (visible && template) {
      setContent(template.content);
      setHtmlSource(template.content);
      setSubject(template.subject || getDefaultSubject(template.type) || '');
      setHasChanges(false);
      setIsPreviewMode(false);
      setShowHTMLSource(false);
    }
  }, [visible, template]);

  const handleContentChange = (html: string) => {
    setContent(html);
    setHtmlSource(html);
    setHasChanges(true);
  };

  const handleHTMLSourceChange = (html: string) => {
    setHtmlSource(html);
    setContent(html);
    setHasChanges(true);
  };

  const handleSubjectChange = (text: string) => {
    setSubject(text);
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
              setHtmlSource('');
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
      onSave(content, template && isEmailTemplate(template.type) ? subject : undefined);
      setSaving(false);
      setHasChanges(false);
      Alert.alert('Success', 'Template saved successfully!', [
        { text: 'OK', onPress: onClose },
      ]);
    }, 500);
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Reset to Default',
      'This will replace your current content with the default template. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            if (template) {
              const defaultContent = getDefaultTemplate(template.type);
              const defaultSubject = getDefaultSubject(template.type);
              setContent(defaultContent);
              setHtmlSource(defaultContent);
              if (defaultSubject) {
                setSubject(defaultSubject);
              }
              setHasChanges(true);
              if (richText.current && !showHTMLSource) {
                richText.current.setContentHTML(defaultContent);
              }
              Alert.alert('Success', 'Template has been reset to default content.');
            }
          },
        },
      ]
    );
  };

  const handlePreview = () => {
    console.log('Preview button clicked, content length:', content.length);
    setIsPreviewMode(!isPreviewMode);
  };

  const insertKeyword = (keyword: TemplateKeyword) => {
    const formattedKeyword = formatKeyword(keyword.key);
    
    // If subject is focused, insert into subject
    if (isSubjectFocused) {
      setSubject(prev => prev + formattedKeyword);
      setHasChanges(true);
    } else {
      // Otherwise insert into editor
      richText.current?.insertHTML(formattedKeyword);
      setHasChanges(true);
    }
    
    setShowKeywordPicker(false);
  };

  const toggleHTMLSource = () => {
    if (showHTMLSource) {
      // Switching back to visual editor
      setContent(htmlSource);
    }
    setShowHTMLSource(!showHTMLSource);
  };

  const renderPreviewContent = (html: string): string => {
    let previewContent = html;

    // First replace regular keywords with demo data
    Object.entries(DEMO_DATA).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      previewContent = previewContent.replace(regex, value);
    });

    // Then replace action keywords with styled buttons
    Object.entries(ACTION_KEYWORDS).forEach(([key, label]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      const buttonHTML = `<a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">${label}</a>`;
      previewContent = previewContent.replace(regex, buttonHTML);
    });

    return previewContent;
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
            <View style={styles.keywordPickerHeaderCenter}>
              <Text style={styles.keywordPickerTitle}>Insert Keyword</Text>
              {isSubjectFocused && (
                <Text style={styles.keywordPickerSubtitle}>
                  Will insert into subject line
                </Text>
              )}
            </View>
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

  const getPreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f9fafb;
              line-height: 1.6;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            a {
              color: #6366f1;
              text-decoration: none;
            }
            /* Ensure content doesn't overflow */
            * {
              max-width: 100%;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
          </style>
        </head>
        <body>
          ${renderPreviewContent(content)}
        </body>
      </html>
    `;
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

          {/* Subject Line (Email Templates Only) */}
          {template && isEmailTemplate(template.type) && (
            <View style={styles.subjectContainer}>
              <Text style={styles.subjectLabel}>Subject:</Text>
              <TextInput
                style={[styles.subjectInput, isSubjectFocused && styles.subjectInputFocused]}
                value={subject}
                onChangeText={handleSubjectChange}
                onFocus={() => setIsSubjectFocused(true)}
                onBlur={() => setIsSubjectFocused(false)}
                placeholder="Email subject line..."
                placeholderTextColor="#9CA3AF"
                autoCorrect={true}
                spellCheck={true}
              />
            </View>
          )}

          {/* Toolbar */}
          <View style={styles.toolbarContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolbar}
            >
              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => setShowKeywordPicker(true)}
              >
                <Code size={18} color="#6366F1" />
                <Text style={styles.toolbarButtonText}>Insert Keyword</Text>
                <ChevronDown size={16} color="#6366F1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolbarButton, isPreviewMode && styles.toolbarButtonActive]}
                onPress={handlePreview}
              >
                <Eye size={18} color={isPreviewMode ? '#FFFFFF' : '#6366F1'} />
                <Text style={[styles.toolbarButtonText, isPreviewMode && styles.toolbarButtonTextActive]}>
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolbarButton, showHTMLSource && styles.toolbarButtonActive]}
                onPress={toggleHTMLSource}
              >
                <RotateCcw size={18} color={showHTMLSource ? '#FFFFFF' : '#6366F1'} />
                <Text style={[styles.toolbarButtonText, showHTMLSource && styles.toolbarButtonTextActive]}>
                  {showHTMLSource ? 'Visual' : 'HTML'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolbarButtonReset}
                onPress={handleResetToDefault}
              >
                <RotateCcw size={18} color="#EF4444" />
                <Text style={styles.toolbarButtonTextReset}>Reset to Default</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Editor */}
          <View style={styles.editorContainer}>
            {isPreviewMode ? (
              // Preview View
              <>
                <View style={styles.previewNotice}>
                  <Text style={styles.previewNoticeText}>
                    Preview with Demo Data - Keywords are replaced with sample values
                  </Text>
                </View>
                <WebView
                  originWhitelist={['*']}
                  source={{ html: getPreviewHTML() }}
                  style={styles.webview}
                  scalesPageToFit={false}
                  scrollEnabled={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </>
            ) : showHTMLSource ? (
              // HTML Source View
              <ScrollView style={styles.htmlSourceScroll}>
                <TextInput
                  style={styles.htmlSourceEditor}
                  value={htmlSource}
                  onChangeText={handleHTMLSourceChange}
                  multiline
                  placeholder="Enter HTML source..."
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                  autoCorrect={true}
                  spellCheck={true}
                />
              </ScrollView>
            ) : (
              // Rich Text Editor View
              <>
                <RichToolbar
                  editor={richText}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.heading1,
                    actions.heading2,
                    actions.insertLink,
                    actions.undo,
                    actions.redo,
                  ]}
                  iconTint="#6366F1"
                  selectedIconTint="#8B5CF6"
                  disabledIconTint="#D1D5DB"
                  style={styles.richToolbar}
                />
                <ScrollView style={styles.richEditorScroll} contentContainerStyle={styles.richEditorScrollContent}>
                  <RichEditor
                    ref={richText}
                    style={styles.richEditor}
                    initialContentHTML={content}
                    onChange={handleContentChange}
                    placeholder="Start typing your template..."
                    useContainer={false}
                    editorStyle={{
                      backgroundColor: '#FFFFFF',
                      color: '#111827',
                      placeholderColor: '#9CA3AF',
                      contentCSSText: 'font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; min-height: 300px;',
                    }}
                  />
                </ScrollView>
              </>
            )}

            {/* Keywords Info */}
            {!isPreviewMode && usedKeywords.length > 0 && (
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
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  subjectLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  subjectInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subjectInputFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6366F1',
  },
  toolbarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  toolbarButtonActive: {
    backgroundColor: '#6366F1',
  },
  toolbarButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  toolbarButtonTextActive: {
    color: '#FFFFFF',
  },
  toolbarButtonReset: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  toolbarButtonTextReset: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  editorContainer: {
    flex: 1,
  },
  richToolbar: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  richEditorScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  richEditorScrollContent: {
    flexGrow: 1,
  },
  richEditor: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  htmlSourceScroll: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  htmlSourceEditor: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Courier',
    color: '#F9FAFB',
    lineHeight: 20,
    minHeight: 400,
  },
  previewNotice: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C7D2FE',
  },
  previewNoticeText: {
    fontSize: 13,
    color: '#4F46E5',
    textAlign: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  keywordPickerHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  keywordPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  keywordPickerSubtitle: {
    fontSize: 12,
    color: '#6366F1',
    marginTop: 2,
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
});
