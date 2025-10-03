import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Grid,
    List,
    Plus,
    Save,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
    options?: string[];
}

interface BookingFormData {
    id?: string;
    title: string;
    description: string;
    status: FormStatus;
    style: FormStyle;
    isDefault: boolean;
    assignedLeadSource?: string; // Auto-assign lead source (e.g., "Website", "Facebook")
    customQuestions: CustomQuestion[];
    thankYouMessage: string;
}

export default function BookingFormEditor() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditing = !!params.id;

    const [formData, setFormData] = useState<BookingFormData>({
        title: '',
        description: '',
        status: 'draft',
        style: 'card',
        isDefault: false,
        assignedLeadSource: '',
        customQuestions: [],
        thankYouMessage: 'Thank you for booking! We\'ll be in touch soon.'
    });

    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [showLeadSourcePicker, setShowLeadSourcePicker] = useState(false);
    const [showCustomLeadSourceInput, setShowCustomLeadSourceInput] = useState(false);
    const [customLeadSourceValue, setCustomLeadSourceValue] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Mock lead sources from settings - in real app, fetch from account settings
    const availableLeadSources = [
        'Website',
        'Facebook',
        'Google',
        'Instagram',
        'Referral',
        'Yard Sign',
        'Direct Mail',
        'Other'
    ];

    useEffect(() => {
        // Load form data if editing
        if (isEditing) {
            // In real app, fetch from API/storage
            // For now, mock data
            setFormData({
                id: params.id as string,
                title: 'Sample Form',
                description: 'Edit this form',
                status: 'draft',
                style: 'card',
                isDefault: false,
                customQuestions: [],
                thankYouMessage: 'Thank you!'
            });
        }
    }, [params.id]);

    const handleSave = () => {
        if (!formData.title.trim()) {
            Alert.alert('Error', 'Please enter a form title');
            return;
        }

        // Save logic here
        Alert.alert('Success', 'Form saved successfully!', [
            {
                text: 'OK',
                onPress: () => router.back()
            }
        ]);
    };

    const handleUpdateField = (field: keyof BookingFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
        setHasChanges(true);
    };

    const handleSelectLeadSource = (source: string) => {
        handleUpdateField('assignedLeadSource', source);
        setShowLeadSourcePicker(false);
    };

    const handleAddCustomLeadSource = () => {
        if (customLeadSourceValue.trim()) {
            handleUpdateField('assignedLeadSource', customLeadSourceValue.trim());
            setCustomLeadSourceValue('');
            setShowCustomLeadSourceInput(false);
            setShowLeadSourcePicker(false);
        }
    };

    const handleClearLeadSource = () => {
        handleUpdateField('assignedLeadSource', '');
    };

    const handleQuestionsUpdate = (questions: CustomQuestion[]) => {
        setFormData({ ...formData, customQuestions: questions });
        setHasChanges(true);
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
                        <Text style={styles.headerTitle}>
                            {isEditing ? 'Edit Form' : 'Create Form'}
                        </Text>
                        {hasChanges && (
                            <Text style={styles.headerSubtitle}>Unsaved changes</Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Save size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Basic Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Form Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.title}
                            onChangeText={(value) => handleUpdateField('title', value)}
                            placeholder="e.g., General Service Request"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.description}
                            onChangeText={(value) => handleUpdateField('description', value)}
                            placeholder="Brief description of this booking form"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Assigned Lead Source (Optional)</Text>
                        <TouchableOpacity
                            style={styles.leadSourceSelector}
                            onPress={() => setShowLeadSourcePicker(true)}
                        >
                            <View style={styles.leadSourceSelectorContent}>
                                {formData.assignedLeadSource ? (
                                    <>
                                        <Text style={styles.leadSourceSelectorIcon}>🎯</Text>
                                        <Text style={styles.leadSourceSelectorText}>
                                            {formData.assignedLeadSource}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={styles.leadSourceSelectorPlaceholder}>
                                        Select or add custom lead source
                                    </Text>
                                )}
                            </View>
                            <ChevronDown size={20} color="#6B7280" />
                        </TouchableOpacity>
                        {formData.assignedLeadSource && (
                            <TouchableOpacity
                                style={styles.clearLeadSourceButton}
                                onPress={handleClearLeadSource}
                            >
                                <X size={14} color="#EF4444" />
                                <Text style={styles.clearLeadSourceText}>Clear</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.inputHint}>
                            This automatically assigns a lead source to all submissions. Lead source question will be hidden.
                        </Text>
                    </View>

                    <View style={styles.switchRow}>
                        <View style={styles.switchLabel}>
                            <Text style={styles.switchLabelText}>Set as Default Form</Text>
                            <Text style={styles.switchLabelSubtext}>This will be your main booking form</Text>
                        </View>
                        <Switch
                            value={formData.isDefault}
                            onValueChange={(value) => handleUpdateField('isDefault', value)}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.isDefault ? '#3B82F6' : '#F3F4F6'}
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
                                formData.style === 'card' && styles.styleOptionActive
                            ]}
                            onPress={() => handleUpdateField('style', 'card')}
                        >
                            <Grid size={24} color={formData.style === 'card' ? '#6366F1' : '#6B7280'} />
                            <Text style={[
                                styles.styleOptionText,
                                formData.style === 'card' && styles.styleOptionTextActive
                            ]}>
                                Card Style
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.styleOption,
                                formData.style === 'form' && styles.styleOptionActive
                            ]}
                            onPress={() => handleUpdateField('style', 'form')}
                        >
                            <List size={24} color={formData.style === 'form' ? '#6366F1' : '#6B7280'} />
                            <Text style={[
                                styles.styleOptionText,
                                formData.style === 'form' && styles.styleOptionTextActive
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
                        <Text style={styles.questionCount}>{formData.customQuestions.length} questions</Text>
                    </View>

                    {formData.assignedLeadSource && formData.assignedLeadSource.trim() !== '' && (
                        <View style={styles.leadSourceInfo}>
                            <Text style={styles.leadSourceInfoIcon}>🎯</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.leadSourceInfoTitle}>Lead Source: {formData.assignedLeadSource}</Text>
                                <Text style={styles.leadSourceInfoText}>This will be automatically assigned to all form submissions</Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity 
                        style={styles.manageQuestionsButton}
                        onPress={() => setShowQuestionsModal(true)}
                    >
                        <Plus size={20} color="#6366F1" />
                        <Text style={styles.manageQuestionsText}>Add & Manage Questions</Text>
                    </TouchableOpacity>

                    {formData.customQuestions.length > 0 && (
                        <View style={styles.questionsList}>
                            {formData.customQuestions.map((q, index) => (
                                <View key={q.id} style={styles.questionPreview}>
                                    <Text style={styles.questionPreviewNumber}>{index + 1}.</Text>
                                    <View style={styles.questionPreviewContent}>
                                        <Text style={styles.questionPreviewLabel}>{q.label}</Text>
                                        <Text style={styles.questionPreviewType}>{q.type}</Text>
                                    </View>
                                    {q.required && (
                                        <View style={styles.requiredTag}>
                                            <Text style={styles.requiredText}>Required</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Thank You Message */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thank You Message</Text>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.thankYouMessage}
                            onChangeText={(value) => handleUpdateField('thankYouMessage', value)}
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
                                formData.status === 'draft' && styles.statusOptionActive
                            ]}
                            onPress={() => handleUpdateField('status', 'draft')}
                        >
                            <AlertCircle size={20} color={formData.status === 'draft' ? '#F59E0B' : '#6B7280'} />
                            <Text style={[
                                styles.statusOptionText,
                                formData.status === 'draft' && styles.statusOptionTextActive
                            ]}>
                                Save as Draft
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.statusOption,
                                formData.status === 'published' && styles.statusOptionActive
                            ]}
                            onPress={() => handleUpdateField('status', 'published')}
                        >
                            <CheckCircle size={20} color={formData.status === 'published' ? '#10B981' : '#6B7280'} />
                            <Text style={[
                                styles.statusOptionText,
                                formData.status === 'published' && styles.statusOptionTextActive
                            ]}>
                                Publish Form
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {formData.status === 'published' && (
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

            {/* Questions Manager Modal */}
            {showQuestionsModal && (
                <QuestionsManagerModal
                    visible={showQuestionsModal}
                    questions={formData.customQuestions}
                    assignedLeadSource={formData.assignedLeadSource}
                    onClose={() => setShowQuestionsModal(false)}
                    onSave={handleQuestionsUpdate}
                />
            )}

            {/* Lead Source Picker Modal */}
            <Modal
                visible={showLeadSourcePicker}
                animationType="slide"
                transparent
                onRequestClose={() => setShowLeadSourcePicker(false)}
            >
                <View style={styles.leadSourceModalOverlay}>
                    <View style={styles.leadSourceModal}>
                        <View style={styles.leadSourceModalHeader}>
                            <Text style={styles.leadSourceModalTitle}>Select Lead Source</Text>
                            <TouchableOpacity onPress={() => setShowLeadSourcePicker(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.leadSourceModalContent}>
                            {availableLeadSources.map((source) => (
                                <TouchableOpacity
                                    key={source}
                                    style={[
                                        styles.leadSourceOption,
                                        formData.assignedLeadSource === source && styles.leadSourceOptionSelected
                                    ]}
                                    onPress={() => handleSelectLeadSource(source)}
                                >
                                    <Text style={styles.leadSourceOptionIcon}>🎯</Text>
                                    <Text style={[
                                        styles.leadSourceOptionText,
                                        formData.assignedLeadSource === source && styles.leadSourceOptionTextSelected
                                    ]}>
                                        {source}
                                    </Text>
                                    {formData.assignedLeadSource === source && (
                                        <CheckCircle size={20} color="#6366F1" />
                                    )}
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={styles.addCustomLeadSourceButton}
                                onPress={() => setShowCustomLeadSourceInput(true)}
                            >
                                <Plus size={20} color="#6366F1" />
                                <Text style={styles.addCustomLeadSourceText}>Add Custom Lead Source</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Custom Lead Source Input Modal */}
            <Modal
                visible={showCustomLeadSourceInput}
                animationType="fade"
                transparent
                onRequestClose={() => setShowCustomLeadSourceInput(false)}
            >
                <View style={styles.customLeadSourceModalOverlay}>
                    <View style={styles.customLeadSourceModal}>
                        <Text style={styles.customLeadSourceModalTitle}>Add Custom Lead Source</Text>
                        <TextInput
                            style={styles.customLeadSourceInput}
                            value={customLeadSourceValue}
                            onChangeText={setCustomLeadSourceValue}
                            placeholder="e.g., Trade Show, Partner Referral"
                            autoFocus
                        />
                        <View style={styles.customLeadSourceModalButtons}>
                            <TouchableOpacity
                                style={[styles.customLeadSourceModalButton, styles.customLeadSourceModalButtonCancel]}
                                onPress={() => {
                                    setShowCustomLeadSourceInput(false);
                                    setCustomLeadSourceValue('');
                                }}
                            >
                                <Text style={styles.customLeadSourceModalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.customLeadSourceModalButton, styles.customLeadSourceModalButtonAdd]}
                                onPress={handleAddCustomLeadSource}
                            >
                                <Text style={styles.customLeadSourceModalButtonAddText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Questions Manager Modal Component
interface QuestionsManagerModalProps {
    visible: boolean;
    questions: CustomQuestion[];
    assignedLeadSource?: string;
    onClose: () => void;
    onSave: (questions: CustomQuestion[]) => void;
}

function QuestionsManagerModal({ visible, questions, assignedLeadSource, onClose, onSave }: QuestionsManagerModalProps) {
    const [localQuestions, setLocalQuestions] = useState<CustomQuestion[]>(questions);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [showQuestionEditor, setShowQuestionEditor] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
    const [selectedType, setSelectedType] = useState<QuestionType>('text');

    const questionTypes = [
        { value: 'text', label: 'Text Field', icon: '📝' },
        { value: 'shortAnswer', label: 'Short Answer', icon: '✏️' },
        { value: 'projectDescription', label: 'Project Description', icon: '📋' },
        { value: 'dropdown', label: 'Dropdown', icon: '⬇️' },
        { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
        { value: 'leadSource', label: 'Lead Source', icon: '🎯' },
        { value: 'image', label: 'Image Upload', icon: '🖼️' },
    ];

    const handleAddQuestion = (type: QuestionType) => {
        // Check if trying to add lead source when form already has one assigned
        if (type === 'leadSource' && assignedLeadSource && assignedLeadSource.trim() !== '') {
            Alert.alert(
                'Lead Source Already Assigned',
                `This form automatically assigns "${assignedLeadSource}" as the lead source. You cannot add a lead source question.\n\nTo add this question, remove the assigned lead source from the form settings.`,
                [{ text: 'OK' }]
            );
            setShowTypeSelector(false);
            return;
        }

        setSelectedType(type);
        setEditingQuestion(null);
        setShowTypeSelector(false);
        setShowQuestionEditor(true);
    };

    const handleEditQuestion = (question: CustomQuestion) => {
        setEditingQuestion(question);
        setSelectedType(question.type);
        setShowQuestionEditor(true);
    };

    const handleSaveQuestion = (question: CustomQuestion) => {
        if (editingQuestion) {
            setLocalQuestions(localQuestions.map(q => q.id === question.id ? question : q));
        } else {
            setLocalQuestions([...localQuestions, question]);
        }
        setShowQuestionEditor(false);
    };

    const handleDeleteQuestion = (id: string) => {
        Alert.alert(
            'Delete Question',
            'Are you sure you want to delete this question?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setLocalQuestions(localQuestions.filter(q => q.id !== id))
                }
            ]
        );
    };

    const handleSaveAll = () => {
        onSave(localQuestions);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.questionsModalContainer}>
                <View style={styles.questionsModalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.questionsModalTitle}>Custom Questions</Text>
                    <TouchableOpacity onPress={handleSaveAll}>
                        <Text style={styles.saveText}>Done</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.questionsModalContent}>
                    {localQuestions.map((question, index) => (
                        <TouchableOpacity
                            key={question.id}
                            style={styles.questionItem}
                            onPress={() => handleEditQuestion(question)}
                        >
                            <View style={styles.questionItemContent}>
                                <View style={styles.questionItemHeader}>
                                    <Text style={styles.questionItemNumber}>{index + 1}</Text>
                                    <Text style={styles.questionItemType}>
                                        {questionTypes.find(t => t.value === question.type)?.icon}{' '}
                                        {questionTypes.find(t => t.value === question.type)?.label}
                                    </Text>
                                </View>
                                <Text style={styles.questionItemLabel}>{question.label}</Text>
                                <View style={styles.questionItemFooter}>
                                    {question.required && (
                                        <Text style={styles.questionItemRequired}>Required</Text>
                                    )}
                                    {question.options && (
                                        <Text style={styles.questionItemOptions}>
                                            {question.options.length} options
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteQuestionButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleDeleteQuestion(question.id);
                                }}
                            >
                                <X size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.addQuestionButton}
                        onPress={() => setShowTypeSelector(true)}
                    >
                        <Plus size={20} color="#6366F1" />
                        <Text style={styles.addQuestionText}>Add New Question</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Type Selector Modal */}
                <Modal
                    visible={showTypeSelector}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTypeSelector(false)}
                >
                    <View style={styles.typeModalOverlay}>
                        <View style={styles.typeModal}>
                            <View style={styles.typeModalHeader}>
                                <Text style={styles.typeModalTitle}>Select Question Type</Text>
                                <TouchableOpacity onPress={() => setShowTypeSelector(false)}>
                                    <X size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.typeModalContent}>
                                {questionTypes.map((type) => {
                                    const isDisabled = type.value === 'leadSource' && assignedLeadSource && assignedLeadSource.trim() !== '';
                                    return (
                                        <TouchableOpacity
                                            key={type.value}
                                            style={[
                                                styles.typeOption,
                                                isDisabled && styles.typeOptionDisabled
                                            ]}
                                            onPress={() => handleAddQuestion(type.value as QuestionType)}
                                            disabled={isDisabled}
                                        >
                                            <Text style={[
                                                styles.typeOptionIcon,
                                                isDisabled && styles.typeOptionDisabledText
                                            ]}>{type.icon}</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[
                                                    styles.typeOptionLabel,
                                                    isDisabled && styles.typeOptionDisabledText
                                                ]}>{type.label}</Text>
                                                {isDisabled && (
                                                    <Text style={styles.typeOptionDisabledNote}>
                                                        Already assigned: {assignedLeadSource}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Question Editor Modal */}
                {showQuestionEditor && (
                    <QuestionEditorModal
                        visible={showQuestionEditor}
                        question={editingQuestion}
                        type={selectedType}
                        onClose={() => setShowQuestionEditor(false)}
                        onSave={handleSaveQuestion}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
}

// Question Editor Modal Component
interface QuestionEditorModalProps {
    visible: boolean;
    question: CustomQuestion | null;
    type: QuestionType;
    onClose: () => void;
    onSave: (question: CustomQuestion) => void;
}

function QuestionEditorModal({ visible, question, type, onClose, onSave }: QuestionEditorModalProps) {
    const [label, setLabel] = useState(question?.label || '');
    const [required, setRequired] = useState(question?.required || false);
    const [options, setOptions] = useState<string[]>(question?.options || ['Option 1', 'Option 2']);

    const questionTypes = [
        { value: 'text', label: 'Text Field', icon: '📝' },
        { value: 'shortAnswer', label: 'Short Answer', icon: '✏️' },
        { value: 'projectDescription', label: 'Project Description', icon: '📋' },
        { value: 'dropdown', label: 'Dropdown', icon: '⬇️' },
        { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
        { value: 'leadSource', label: 'Lead Source', icon: '🎯' },
        { value: 'image', label: 'Image Upload', icon: '🖼️' },
    ];

    const handleSave = () => {
        if (!label.trim()) {
            Alert.alert('Error', 'Please enter a question label');
            return;
        }

        const questionData: CustomQuestion = {
            id: question?.id || Date.now().toString(),
            type,
            label,
            required,
            options: (type === 'dropdown' || type === 'checkbox') ? options.filter(o => o.trim()) : undefined
        };

        onSave(questionData);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.editorModalContainer}>
                <View style={styles.editorModalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.editorModalTitle}>
                        {question ? 'Edit Question' : 'Add Question'}
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.editorModalContent}>
                    <View style={styles.typeDisplay}>
                        <Text style={styles.typeDisplayIcon}>
                            {questionTypes.find(t => t.value === type)?.icon}
                        </Text>
                        <Text style={styles.typeDisplayLabel}>
                            {questionTypes.find(t => t.value === type)?.label}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Question Label *</Text>
                        <TextInput
                            style={styles.input}
                            value={label}
                            onChangeText={setLabel}
                            placeholder="Enter your question"
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <View style={styles.switchLabel}>
                            <Text style={styles.switchLabelText}>Required Field</Text>
                            <Text style={styles.switchLabelSubtext}>Customers must answer</Text>
                        </View>
                        <Switch
                            value={required}
                            onValueChange={setRequired}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={required ? '#3B82F6' : '#F3F4F6'}
                        />
                    </View>

                    {(type === 'dropdown' || type === 'checkbox') && (
                        <View style={styles.optionsSection}>
                            <Text style={styles.optionsTitle}>Options</Text>
                            {options.map((option, index) => (
                                <View key={index} style={styles.optionRow}>
                                    <TextInput
                                        style={styles.optionInput}
                                        value={option}
                                        onChangeText={(value) => {
                                            const newOptions = [...options];
                                            newOptions[index] = value;
                                            setOptions(newOptions);
                                        }}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    {options.length > 1 && (
                                        <TouchableOpacity
                                            onPress={() => setOptions(options.filter((_, i) => i !== index))}
                                        >
                                            <X size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                            <TouchableOpacity
                                style={styles.addOptionBtn}
                                onPress={() => setOptions([...options, `Option ${options.length + 1}`])}
                            >
                                <Plus size={16} color="#6366F1" />
                                <Text style={styles.addOptionText}>Add Option</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
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
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    content: {
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
    questionCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
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
    inputHint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 16,
    },
    leadSourceSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    leadSourceSelectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    leadSourceSelectorIcon: {
        fontSize: 18,
    },
    leadSourceSelectorText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    leadSourceSelectorPlaceholder: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    clearLeadSourceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginTop: 8,
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2',
        borderRadius: 6,
    },
    clearLeadSourceText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EF4444',
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
    leadSourceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: '#DBEAFE',
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#93C5FD',
    },
    leadSourceInfoIcon: {
        fontSize: 24,
    },
    leadSourceInfoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 2,
    },
    leadSourceInfoText: {
        fontSize: 12,
        color: '#1E3A8A',
    },
    manageQuestionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#6366F1',
        borderStyle: 'dashed',
    },
    manageQuestionsText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6366F1',
    },
    questionsList: {
        marginTop: 16,
        gap: 8,
    },
    questionPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    questionPreviewNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6366F1',
    },
    questionPreviewContent: {
        flex: 1,
    },
    questionPreviewLabel: {
        fontSize: 14,
        color: '#111827',
        marginBottom: 4,
    },
    questionPreviewType: {
        fontSize: 12,
        color: '#6B7280',
    },
    requiredTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#FEE2E2',
        borderRadius: 4,
    },
    requiredText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EF4444',
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
    bottomSpacing: {
        height: 100,
    },
    // Questions Manager Modal
    questionsModalContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    questionsModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    questionsModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
    },
    questionsModalContent: {
        flex: 1,
        padding: 16,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    questionItemContent: {
        flex: 1,
    },
    questionItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    questionItemNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6366F1',
    },
    questionItemType: {
        fontSize: 12,
        color: '#6B7280',
    },
    questionItemLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    questionItemFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    questionItemRequired: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EF4444',
    },
    questionItemOptions: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    deleteQuestionButton: {
        padding: 8,
        marginLeft: 8,
    },
    addQuestionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6366F1',
        borderStyle: 'dashed',
    },
    addQuestionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6366F1',
    },
    // Type Selector Modal
    typeModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    typeModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    typeModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    typeModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    typeModalContent: {
        padding: 16,
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
    },
    typeOptionDisabled: {
        opacity: 0.5,
        backgroundColor: '#F3F4F6',
    },
    typeOptionIcon: {
        fontSize: 24,
    },
    typeOptionLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    typeOptionDisabledText: {
        color: '#9CA3AF',
    },
    typeOptionDisabledNote: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
        fontWeight: '500',
    },
    // Question Editor Modal
    editorModalContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    editorModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    editorModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    editorModalContent: {
        flex: 1,
        padding: 20,
    },
    typeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        marginBottom: 20,
    },
    typeDisplayIcon: {
        fontSize: 28,
    },
    typeDisplayLabel: {
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
    optionsTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
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
    addOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    addOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    // Lead Source Picker Modal
    leadSourceModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    leadSourceModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    leadSourceModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    leadSourceModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    leadSourceModalContent: {
        padding: 16,
    },
    leadSourceOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    leadSourceOptionSelected: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366F1',
    },
    leadSourceOptionIcon: {
        fontSize: 20,
    },
    leadSourceOptionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    leadSourceOptionTextSelected: {
        color: '#6366F1',
    },
    addCustomLeadSourceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 2,
        borderColor: '#6366F1',
        borderStyle: 'dashed',
    },
    addCustomLeadSourceText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6366F1',
    },
    // Custom Lead Source Input Modal
    customLeadSourceModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    customLeadSourceModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    customLeadSourceModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
        textAlign: 'center',
    },
    customLeadSourceInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        marginBottom: 20,
    },
    customLeadSourceModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    customLeadSourceModalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    customLeadSourceModalButtonCancel: {
        backgroundColor: '#F3F4F6',
    },
    customLeadSourceModalButtonAdd: {
        backgroundColor: '#6366F1',
    },
    customLeadSourceModalButtonCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    customLeadSourceModalButtonAddText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

