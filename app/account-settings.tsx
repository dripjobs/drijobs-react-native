import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Bell,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    Edit,
    FileText,
    Globe,
    Mail,
    MapPin,
    Palette,
    Phone,
    Plus,
    Save,
    Settings,
    Tag,
    Trash2,
    Users,
    X,
    Zap
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
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

type SettingsTab = 'company' | 'brand' | 'email' | 'general' | 'events' | 'payments' | 'reminders';

interface CompanySettings {
    accountNumber: string;
    companyName: string;
    shortName: string;
    businessType: string;
    timeZone: string;
    licenseNumber: string;
    phone: string;
    taxRate: number;
    isActive: boolean;
    enableGoogleCalendar: boolean;
}

export default function AccountSettings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SettingsTab>('company');
    const [isEditing, setIsEditing] = useState(false);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Mock data - replace with actual state management
    const [companySettings, setCompanySettings] = useState<CompanySettings>({
        accountNumber: 'AC-12345',
        companyName: 'DripJobs Demo Co.',
        shortName: 'DripJobs',
        businessType: 'Painting & Pressure Washing',
        timeZone: 'America/New_York',
        licenseNumber: 'LIC-98765',
        phone: '(555) 123-4567',
        taxRate: 7.5,
        isActive: true,
        enableGoogleCalendar: true,
    });

    const tabs = [
        { id: 'company', label: 'Company Info', icon: Building2 },
        { id: 'brand', label: 'Brand Settings', icon: Palette },
        { id: 'email', label: 'Email Settings', icon: Mail },
        { id: 'general', label: 'General', icon: Settings },
        { id: 'events', label: 'Event Types', icon: Calendar },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'reminders', label: 'Reminders', icon: Bell },
    ];

    const handleSave = () => {
        Alert.alert('Success', 'Settings saved successfully');
        setIsEditing(false);
        setHasChanges(false);
    };

    const handleCancel = () => {
        if (hasChanges) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to discard them?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Discard', 
                        style: 'destructive',
                        onPress: () => {
                            setIsEditing(false);
                            setHasChanges(false);
                        }
                    },
                ]
            );
        } else {
            setIsEditing(false);
        }
    };

    const updateField = (field: keyof CompanySettings, value: any) => {
        setCompanySettings(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const getCurrentTab = () => {
        return tabs.find(tab => tab.id === activeTab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <View style={styles.tabContent}>
                        {/* Account Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account Information</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Account Number</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.accountNumber}
                                    onChangeText={(value) => updateField('accountNumber', value)}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Company Name</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.companyName}
                                    onChangeText={(value) => updateField('companyName', value)}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Short Name</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.shortName}
                                    onChangeText={(value) => updateField('shortName', value)}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Business Type</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.businessType}
                                    onChangeText={(value) => updateField('businessType', value)}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>License Number</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.licenseNumber}
                                    onChangeText={(value) => updateField('licenseNumber', value)}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.phone}
                                    onChangeText={(value) => updateField('phone', value)}
                                    editable={isEditing}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Tax Rate (%)</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.taxRate.toString()}
                                    onChangeText={(value) => updateField('taxRate', parseFloat(value) || 0)}
                                    editable={isEditing}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Options */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Options</Text>
                            
                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Active Company</Text>
                                    <Text style={styles.switchLabelSubtext}>Allow all users to login</Text>
                                </View>
                                <Switch
                                    value={companySettings.isActive}
                                    onValueChange={(value) => updateField('isActive', value)}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={companySettings.isActive ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Google Calendar</Text>
                                    <Text style={styles.switchLabelSubtext}>Enable Google Calendar integration</Text>
                                </View>
                                <Switch
                                    value={companySettings.enableGoogleCalendar}
                                    onValueChange={(value) => updateField('enableGoogleCalendar', value)}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={companySettings.enableGoogleCalendar ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'brand':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Brand Settings</Text>
                            <View style={styles.infoBox}>
                                <Palette size={20} color="#6366F1" />
                                <Text style={styles.infoText}>
                                    Configure your brand colors, logo, and social profiles
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            case 'email':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Email Configuration</Text>
                            <View style={styles.infoBox}>
                                <Mail size={20} color="#6366F1" />
                                <Text style={styles.infoText}>
                                    Configure email settings and domain verification
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            case 'general':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>General Settings</Text>
                            <View style={styles.infoBox}>
                                <Settings size={20} color="#6366F1" />
                                <Text style={styles.infoText}>
                                    Tags, categories, and default times
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            case 'events':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Event Types</Text>
                                {isEditing && (
                                    <TouchableOpacity style={styles.addButton}>
                                        <Plus size={16} color="#6366F1" />
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            <View style={styles.eventTypeCard}>
                                <View style={styles.eventTypeRow}>
                                    <View style={styles.eventTypeInfo}>
                                        <Text style={styles.eventTypeName}>Estimate</Text>
                                        <Text style={styles.eventTypeCalendar}>Appointments</Text>
                                    </View>
                                    <View style={styles.eventTypeColor} />
                                </View>
                            </View>

                            <View style={styles.eventTypeCard}>
                                <View style={styles.eventTypeRow}>
                                    <View style={styles.eventTypeInfo}>
                                        <Text style={styles.eventTypeName}>Job</Text>
                                        <Text style={styles.eventTypeCalendar}>Jobs</Text>
                                    </View>
                                    <View style={[styles.eventTypeColor, { backgroundColor: '#10B981' }]} />
                                </View>
                            </View>
                        </View>
                    </View>
                );

            case 'payments':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Payment Settings</Text>
                            
                            <View style={styles.paymentCard}>
                                <View style={styles.paymentHeader}>
                                    <CreditCard size={20} color="#6366F1" />
                                    <Text style={styles.paymentTitle}>Card Payments</Text>
                                </View>
                                <View style={styles.paymentStatus}>
                                    <Text style={styles.paymentStatusLabel}>Status</Text>
                                    <View style={[styles.badge, styles.badgeSuccess]}>
                                        <CheckCircle size={12} color="#10B981" />
                                        <Text style={styles.badgeSuccessText}>Enabled</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.paymentCard}>
                                <View style={styles.paymentHeader}>
                                    <Building2 size={20} color="#6366F1" />
                                    <Text style={styles.paymentTitle}>ACH Payments</Text>
                                </View>
                                <View style={styles.paymentStatus}>
                                    <Text style={styles.paymentStatusLabel}>Status</Text>
                                    <View style={[styles.badge, styles.badgeSuccess]}>
                                        <CheckCircle size={12} color="#10B981" />
                                        <Text style={styles.badgeSuccessText}>Enabled</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                );

            case 'reminders':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Reminder Settings</Text>
                            <View style={styles.infoBox}>
                                <Bell size={20} color="#6366F1" />
                                <Text style={styles.infoText}>
                                    Configure email and SMS reminders for appointments and jobs
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            default:
                return null;
        }
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
                        <Text style={styles.headerTitle}>Account Settings</Text>
                        <Text style={styles.headerSubtitle}>DripJobs Demo Co.</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.menuButton}
                        onPress={() => setShowTabSelector(true)}
                    >
                        <Settings size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {hasChanges && (
                    <View style={styles.changesIndicator}>
                        <AlertCircle size={14} color="#FEF3C7" />
                        <Text style={styles.changesText}>Unsaved Changes</Text>
                    </View>
                )}
            </LinearGradient>

            {/* Current Tab Indicator */}
            <TouchableOpacity 
                style={styles.tabIndicator}
                onPress={() => setShowTabSelector(true)}
            >
                {React.createElement(getCurrentTab()!.icon, { size: 18, color: '#6366F1' })}
                <Text style={styles.tabIndicatorText}>{getCurrentTab()?.label}</Text>
                <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderTabContent()}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Floating Action Button */}
            {isEditing ? (
                <View style={styles.fabContainer}>
                    <TouchableOpacity 
                        style={[styles.fab, styles.fabSecondary]}
                        onPress={handleCancel}
                    >
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.fab, styles.fabPrimary]}
                        onPress={handleSave}
                    >
                        <Save size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity 
                    style={[styles.fab, styles.fabPrimary, styles.fabSingle]}
                    onPress={() => setIsEditing(true)}
                >
                    <Edit size={24} color="#FFFFFF" />
                </TouchableOpacity>
            )}

            {/* Tab Selector Modal */}
            <Modal
                visible={showTabSelector}
                animationType="slide"
                transparent
                onRequestClose={() => setShowTabSelector(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.tabSelectorModal}>
                        <View style={styles.tabSelectorHeader}>
                            <Text style={styles.tabSelectorTitle}>Settings Sections</Text>
                            <TouchableOpacity onPress={() => setShowTabSelector(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.tabSelectorContent}>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <TouchableOpacity
                                        key={tab.id}
                                        style={[
                                            styles.tabSelectorItem,
                                            activeTab === tab.id && styles.tabSelectorItemActive
                                        ]}
                                        onPress={() => {
                                            setActiveTab(tab.id as SettingsTab);
                                            setShowTabSelector(false);
                                        }}
                                    >
                                        <Icon 
                                            size={20} 
                                            color={activeTab === tab.id ? '#6366F1' : '#6B7280'} 
                                        />
                                        <Text style={[
                                            styles.tabSelectorItemText,
                                            activeTab === tab.id && styles.tabSelectorItemTextActive
                                        ]}>
                                            {tab.label}
                                        </Text>
                                        {activeTab === tab.id && (
                                            <CheckCircle size={20} color="#6366F1" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
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
    menuButton: {
        padding: 8,
    },
    changesIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 8,
    },
    changesText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FEF3C7',
    },
    tabIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tabIndicatorText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        flex: 1,
    },
    tabContent: {
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
    inputDisabled: {
        backgroundColor: '#F9FAFB',
        color: '#6B7280',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#4338CA',
        lineHeight: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    eventTypeCard: {
        padding: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        marginBottom: 12,
    },
    eventTypeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventTypeInfo: {
        flex: 1,
    },
    eventTypeName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    eventTypeCalendar: {
        fontSize: 13,
        color: '#6B7280',
    },
    eventTypeColor: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    paymentCard: {
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        marginBottom: 12,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    paymentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    paymentStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentStatusLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeSuccess: {
        backgroundColor: '#D1FAE5',
    },
    badgeSuccessText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10B981',
    },
    bottomSpacing: {
        height: 100,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        gap: 12,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabPrimary: {
        backgroundColor: '#6366F1',
    },
    fabSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    fabSingle: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    tabSelectorModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    tabSelectorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tabSelectorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    tabSelectorContent: {
        padding: 12,
    },
    tabSelectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    tabSelectorItemActive: {
        backgroundColor: '#EEF2FF',
    },
    tabSelectorItemText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabSelectorItemTextActive: {
        color: '#6366F1',
    },
});

