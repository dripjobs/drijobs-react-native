import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    Copy,
    Edit,
    Eye,
    Grid,
    List,
    MoreVertical,
    Plus,
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
    Text,
    TouchableOpacity,
    View
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
    const [showPreview, setShowPreview] = useState(false);
    const [previewForm, setPreviewForm] = useState<BookingForm | null>(null);

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


    const handleCreateForm = () => {
        router.push('/booking-form-editor');
    };

    const handleEditForm = (form: BookingForm) => {
        router.push(`/booking-form-editor?id=${form.id}`);
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
                                        setPreviewForm(form);
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
                            <Text style={styles.previewFormTitle}>{previewForm?.title}</Text>
                            <Text style={styles.previewFormDescription}>{previewForm?.description}</Text>
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
    questionFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
    },
    requiredTag: {
        flexDirection: 'row',
    },
    requiredBadge: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EF4444',
    },
    optionsCount: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6366F1',
    },
    emptyState: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    questionTypeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        marginBottom: 20,
    },
    questionTypeDisplayIcon: {
        fontSize: 28,
    },
    questionTypeDisplayLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4338CA',
    },
    optionsSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionsTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    addOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    addOptionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    optionInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    removeOptionButton: {
        padding: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
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

