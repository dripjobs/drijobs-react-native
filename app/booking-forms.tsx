import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Copy,
    Edit,
    Eye,
    Grid,
    List,
    MoreVertical,
    Plus,
    Save,
    Settings,
    Trash2,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type QuestionType = 'text' | 'image' | 'leadSource' | 'projectDescription' | 'dropdown' | 'shortAnswer' | 'checkbox';
type FormStyle = 'card' | 'form';
type FormStatus = 'draft' | 'published';

interface CustomQuestion {
    id: string;
    type: QuestionType;
    label: string;
    required: boolean;
    options?: string[]; // For dropdown and checkbox
}

interface BookingForm {
    id: string;
    title: string;
    description: string;
    status: FormStatus;
    style: FormStyle;
    url?: string;
    isDefault: boolean;
    availability: string[];
    assignedUsers: string[];
    customQuestions: CustomQuestion[];
    thankYouMessage: string;
    createdAt: string;
}

export default function BookingForms() {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingForm, setEditingForm] = useState<BookingForm | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('text');

    const [forms, setForms] = useState<BookingForm[]>([
        {
            id: '1',
            title: 'General Service Request',
            description: 'Book an appointment for any of our services',
            status: 'published',
            style: 'card',
            url: 'https://book.dripjobs.com/demo-co/general',
            isDefault: true,
            availability: ['Mon-Fri 9AM-5PM'],
            assignedUsers: ['John Doe', 'Jane Smith'],
            customQuestions: [],
            thankYouMessage: 'Thank you! We\'ll be in touch soon.',
            createdAt: '2025-01-15'
        },
        {
            id: '2',
            title: 'Pressure Washing Quote',
            description: 'Get a quote for pressure washing services',
            status: 'draft',
            style: 'form',
            url: undefined,
            isDefault: false,
            availability: ['Mon-Fri 8AM-6PM'],
            assignedUsers: ['John Doe'],
            customQuestions: [
                { id: 'q1', type: 'projectDescription', label: 'Describe your project', required: true },
                { id: 'q2', type: 'leadSource', label: 'How did you hear about us?', required: false }
            ],
            thankYouMessage: 'Thanks for your interest!',
            createdAt: '2025-02-01'
        }
    ]);

    // Current form being created/edited
    const [currentForm, setCurrentForm] = useState<Partial<BookingForm>>({
        title: '',
        description: '',
        status: 'draft',
        style: 'card',
        isDefault: false,
        availability: [],
        assignedUsers: [],
        customQuestions: [],
        thankYouMessage: 'Thank you for booking! We\'ll be in touch soon.'
    });

    const questionTypes = [
        { value: 'text', label: 'Text Field', icon: '📝' },
        { value: 'shortAnswer', label: 'Short Answer', icon: '✏️' },
        { value: 'projectDescription', label: 'Project Description', icon: '📋' },
        { value: 'dropdown', label: 'Dropdown', icon: '⬇️' },
        { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
        { value: 'leadSource', label: 'Lead Source', icon: '🎯' },
        { value: 'image', label: 'Image Upload', icon: '🖼️' },
    ];

    const handleCreateForm = () => {
        setCurrentForm({
            title: '',
            description: '',
            status: 'draft',
            style: 'card',
            isDefault: false,
            availability: [],
            assignedUsers: [],
            customQuestions: [],
            thankYouMessage: 'Thank you for booking! We\'ll be in touch soon.'
        });
        setEditingForm(null);
        setShowCreateModal(true);
    };

    const handleEditForm = (form: BookingForm) => {
        setCurrentForm(form);
        setEditingForm(form);
        setShowCreateModal(true);
    };

    const handleSaveForm = () => {
        if (!currentForm.title) {
            Alert.alert('Error', 'Please enter a form title');
            return;
        }

        const newForm: BookingForm = {
            id: editingForm?.id || Date.now().toString(),
            title: currentForm.title || '',
            description: currentForm.description || '',
            status: currentForm.status || 'draft',
            style: currentForm.style || 'card',
            url: currentForm.status === 'published' 
                ? `https://book.dripjobs.com/demo-co/${currentForm.title?.toLowerCase().replace(/\s+/g, '-')}`
                : undefined,
            isDefault: currentForm.isDefault || false,
            availability: currentForm.availability || [],
            assignedUsers: currentForm.assignedUsers || [],
            customQuestions: currentForm.customQuestions || [],
            thankYouMessage: currentForm.thankYouMessage || '',
            createdAt: editingForm?.createdAt || new Date().toISOString()
        };

        if (editingForm) {
            setForms(forms.map(f => f.id === editingForm.id ? newForm : f));
        } else {
            setForms([...forms, newForm]);
        }

        setShowCreateModal(false);
        Alert.alert('Success', `Form ${editingForm ? 'updated' : 'created'} successfully!`);
    };

    const handleDeleteForm = (id: string) => {
        Alert.alert(
            'Delete Form',
            'Are you sure you want to delete this booking form?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setForms(forms.filter(f => f.id !== id))
                }
            ]
        );
    };

    const handleAddQuestion = (type: QuestionType) => {
        const newQuestion: CustomQuestion = {
            id: Date.now().toString(),
            type,
            label: `New ${type} question`,
            required: false,
            options: type === 'dropdown' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
        };

        setCurrentForm({
            ...currentForm,
            customQuestions: [...(currentForm.customQuestions || []), newQuestion]
        });
        setShowQuestionModal(false);
    };

    const handleRemoveQuestion = (questionId: string) => {
        setCurrentForm({
            ...currentForm,
            customQuestions: currentForm.customQuestions?.filter(q => q.id !== questionId)
        });
    };

    const handleCopyUrl = (url: string) => {
        Alert.alert('Copied', 'Booking form URL copied to clipboard');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Booking Forms</Text>
                        <Text style={styles.headerSubtitle}>{forms.length} forms</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={handleCreateForm}
                    >
                        <Plus size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {forms.map((form) => (
                    <View key={form.id} style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <View style={styles.formInfo}>
                                <View style={styles.formTitleRow}>
                                    <Text style={styles.formTitle}>{form.title}</Text>
                                    {form.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultBadgeText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.formDescription}>{form.description}</Text>
                            </View>
                            <TouchableOpacity style={styles.menuButton}>
                                <MoreVertical size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formMeta}>
                            <View style={styles.metaItem}>
                                <View style={[
                                    styles.statusBadge, 
                                    form.status === 'published' ? styles.statusPublished : styles.statusDraft
                                ]}>
                                    {form.status === 'published' ? (
                                        <CheckCircle size={12} color="#10B981" />
                                    ) : (
                                        <AlertCircle size={12} color="#F59E0B" />
                                    )}
                                    <Text style={[
                                        styles.statusText,
                                        form.status === 'published' ? styles.statusTextPublished : styles.statusTextDraft
                                    ]}>
                                        {form.status === 'published' ? 'Published' : 'Draft'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.metaItem}>
                                <View style={styles.styleBadge}>
                                    {form.style === 'card' ? <Grid size={12} color="#6366F1" /> : <List size={12} color="#6366F1" />}
                                    <Text style={styles.styleText}>{form.style === 'card' ? 'Card' : 'Form'}</Text>
                                </View>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaText}>{form.customQuestions.length} questions</Text>
                            </View>
                        </View>

                        {form.url && (
                            <View style={styles.urlContainer}>
                                <Text style={styles.urlLabel}>URL:</Text>
                                <Text style={styles.urlText} numberOfLines={1}>{form.url}</Text>
                                <TouchableOpacity 
                                    style={styles.copyButton}
                                    onPress={() => handleCopyUrl(form.url!)}
                                >
                                    <Copy size={14} color="#6366F1" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.formActions}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.actionButtonSecondary]}
                                onPress={() => handleEditForm(form)}
                            >
                                <Edit size={16} color="#6366F1" />
                                <Text style={styles.actionButtonSecondaryText}>Edit</Text>
                            </TouchableOpacity>
                            {form.status === 'published' && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.actionButtonSecondary]}
                                    onPress={() => {
                                        setEditingForm(form);
                                        setShowPreview(true);
                                    }}
                                >
                                    <Eye size={16} color="#6366F1" />
                                    <Text style={styles.actionButtonSecondaryText}>Preview</Text>
                                </TouchableOpacity>
                            )}
                            {!form.isDefault && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.actionButtonDanger]}
                                    onPress={() => handleDeleteForm(form.id)}
                                >
                                    <Trash2 size={16} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Create/Edit Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {editingForm ? 'Edit Form' : 'Create Form'}
                        </Text>
                        <TouchableOpacity onPress={handleSaveForm}>
                            <Save size={24} color="#6366F1" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                        {/* Basic Settings */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Form Title *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentForm.title}
                                    onChangeText={(value) => setCurrentForm({...currentForm, title: value})}
                                    placeholder="e.g., General Service Request"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={currentForm.description}
                                    onChangeText={(value) => setCurrentForm({...currentForm, description: value})}
                                    placeholder="Brief description of this booking form"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Set as Default Form</Text>
                                    <Text style={styles.switchLabelSubtext}>This will be your main booking form</Text>
                                </View>
                                <Switch
                                    value={currentForm.isDefault}
                                    onValueChange={(value) => setCurrentForm({...currentForm, isDefault: value})}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={currentForm.isDefault ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>
                        </View>

                        {/* Form Style */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Form Style</Text>
                            <View style={styles.styleSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.styleOption,
                                        currentForm.style === 'card' && styles.styleOptionActive
                                    ]}
                                    onPress={() => setCurrentForm({...currentForm, style: 'card'})}
                                >
                                    <Grid size={24} color={currentForm.style === 'card' ? '#6366F1' : '#6B7280'} />
                                    <Text style={[
                                        styles.styleOptionText,
                                        currentForm.style === 'card' && styles.styleOptionTextActive
                                    ]}>
                                        Card Style
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.styleOption,
                                        currentForm.style === 'form' && styles.styleOptionActive
                                    ]}
                                    onPress={() => setCurrentForm({...currentForm, style: 'form'})}
                                >
                                    <List size={24} color={currentForm.style === 'form' ? '#6366F1' : '#6B7280'} />
                                    <Text style={[
                                        styles.styleOptionText,
                                        currentForm.style === 'form' && styles.styleOptionTextActive
                                    ]}>
                                        Form Style
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Custom Questions */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Custom Questions</Text>
                                <TouchableOpacity 
                                    style={styles.addQuestionButton}
                                    onPress={() => setShowQuestionModal(true)}
                                >
                                    <Plus size={16} color="#FFFFFF" />
                                    <Text style={styles.addQuestionButtonText}>Add</Text>
                                </TouchableOpacity>
                            </View>

                            {currentForm.customQuestions && currentForm.customQuestions.length > 0 ? (
                                currentForm.customQuestions.map((question, index) => (
                                    <View key={question.id} style={styles.questionCard}>
                                        <View style={styles.questionHeader}>
                                            <Text style={styles.questionType}>
                                                {questionTypes.find(t => t.value === question.type)?.icon} {questionTypes.find(t => t.value === question.type)?.label}
                                            </Text>
                                            <TouchableOpacity onPress={() => handleRemoveQuestion(question.id)}>
                                                <X size={18} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.questionLabel}>{question.label}</Text>
                                        {question.required && (
                                            <Text style={styles.requiredBadge}>Required</Text>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>No custom questions added</Text>
                                </View>
                            )}
                        </View>

                        {/* Thank You Message */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Thank You Message</Text>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={currentForm.thankYouMessage}
                                    onChangeText={(value) => setCurrentForm({...currentForm, thankYouMessage: value})}
                                    placeholder="Message shown after form submission"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </View>

                        {/* Status */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Publish Status</Text>
                            <View style={styles.statusSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.statusOption,
                                        currentForm.status === 'draft' && styles.statusOptionActive
                                    ]}
                                    onPress={() => setCurrentForm({...currentForm, status: 'draft'})}
                                >
                                    <AlertCircle size={20} color={currentForm.status === 'draft' ? '#F59E0B' : '#6B7280'} />
                                    <Text style={[
                                        styles.statusOptionText,
                                        currentForm.status === 'draft' && styles.statusOptionTextActive
                                    ]}>
                                        Save as Draft
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.statusOption,
                                        currentForm.status === 'published' && styles.statusOptionActive
                                    ]}
                                    onPress={() => setCurrentForm({...currentForm, status: 'published'})}
                                >
                                    <CheckCircle size={20} color={currentForm.status === 'published' ? '#10B981' : '#6B7280'} />
                                    <Text style={[
                                        styles.statusOptionText,
                                        currentForm.status === 'published' && styles.statusOptionTextActive
                                    ]}>
                                        Publish Form
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {currentForm.status === 'published' && (
                                <View style={styles.publishNote}>
                                    <AlertCircle size={16} color="#6366F1" />
                                    <Text style={styles.publishNoteText}>
                                        A booking URL will be generated when you save
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.bottomSpacing} />
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Add Question Modal */}
            <Modal
                visible={showQuestionModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowQuestionModal(false)}
            >
                <View style={styles.questionModalOverlay}>
                    <View style={styles.questionModal}>
                        <View style={styles.questionModalHeader}>
                            <Text style={styles.questionModalTitle}>Add Custom Question</Text>
                            <TouchableOpacity onPress={() => setShowQuestionModal(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.questionModalContent}>
                            {questionTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={styles.questionTypeCard}
                                    onPress={() => handleAddQuestion(type.value as QuestionType)}
                                >
                                    <Text style={styles.questionTypeIcon}>{type.icon}</Text>
                                    <Text style={styles.questionTypeLabel}>{type.label}</Text>
                                    <ChevronRight size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Preview Modal */}
            <Modal
                visible={showPreview}
                animationType="slide"
                onRequestClose={() => setShowPreview(false)}
            >
                <SafeAreaView style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <TouchableOpacity onPress={() => setShowPreview(false)}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                        <Text style={styles.previewTitle}>Form Preview</Text>
                        <View style={{ width: 24 }} />
                    </View>
                    <ScrollView style={styles.previewContent}>
                        <View style={styles.previewCard}>
                            <Text style={styles.previewFormTitle}>{editingForm?.title}</Text>
                            <Text style={styles.previewFormDescription}>{editingForm?.description}</Text>
                            <Text style={styles.previewNote}>📱 This is a preview of how your form will appear to customers</Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },
    backButton: {
        padding: 8,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    createButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    formInfo: {
        flex: 1,
    },
    formTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    defaultBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    defaultBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1E40AF',
    },
    formDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    menuButton: {
        padding: 4,
    },
    formMeta: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusPublished: {
        backgroundColor: '#D1FAE5',
    },
    statusDraft: {
        backgroundColor: '#FEF3C7',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextPublished: {
        color: '#10B981',
    },
    statusTextDraft: {
        color: '#F59E0B',
    },
    styleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
    },
    styleText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    metaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    urlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        marginBottom: 12,
    },
    urlLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    urlText: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
    },
    copyButton: {
        padding: 4,
    },
    formActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
    },
    actionButtonSecondary: {
        backgroundColor: '#EEF2FF',
    },
    actionButtonSecondaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    actionButtonDanger: {
        backgroundColor: '#FEE2E2',
        flex: 0,
        paddingHorizontal: 16,
    },
    bottomSpacing: {
        height: 100,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    switchLabel: {
        flex: 1,
    },
    switchLabelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    switchLabelSubtext: {
        fontSize: 13,
        color: '#6B7280',
    },
    styleSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    styleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    styleOptionActive: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },
    styleOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    styleOptionTextActive: {
        color: '#6366F1',
    },
    addQuestionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#6366F1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addQuestionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    questionCard: {
        padding: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    questionType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    questionLabel: {
        fontSize: 14,
        color: '#111827',
        marginBottom: 6,
    },
    requiredBadge: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EF4444',
    },
    emptyState: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    statusSelector: {
        gap: 12,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    statusOptionActive: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },
    statusOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    statusOptionTextActive: {
        color: '#111827',
    },
    publishNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: 12,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    publishNoteText: {
        flex: 1,
        fontSize: 13,
        color: '#4338CA',
    },
    questionModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    questionModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    questionModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    questionModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    questionModalContent: {
        padding: 12,
    },
    questionTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
    },
    questionTypeIcon: {
        fontSize: 24,
    },
    questionTypeLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    previewContent: {
        flex: 1,
        padding: 20,
    },
    previewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
    },
    previewFormTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    previewFormDescription: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 20,
    },
    previewNote: {
        fontSize: 14,
        color: '#6366F1',
        fontStyle: 'italic',
    },
});

