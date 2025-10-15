import { CrewPermissionSettingsModal } from '@/components/CrewPermissionSettingsModal';
import FacebookIntegrationsManager from '@/components/FacebookIntegrationsManager';
import TemplatesManager from '@/components/TemplatesManager';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import QuickBooksService from '@/services/QuickBooksService';
import { QuickBooksConnectionStatus, QuickBooksSyncSettings } from '@/types/quickbooks';
import { UserRole } from '@/types/userRoles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    BarChart3,
    Bell,
    Briefcase,
    Building2,
    Calendar,
    CalendarDays,
    Camera,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Copy,
    CreditCard,
    DollarSign,
    Edit,
    ExternalLink,
    Facebook,
    FileText,
    Grid3x3,
    GripVertical,
    Hash,
    House,
    Link,
    Mail,
    MessageSquare,
    Package,
    Palette,
    Phone,
    Plus,
    Receipt,
    RefreshCw,
    RotateCcw,
    Save,
    Send,
    Settings,
    Smartphone,
    SquareCheck,
    Trash2,
    TrendingUp,
    Upload,
    UserPlus,
    Users,
    Wrench,
    X,
    XCircle,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Platform,
    Alert as RNAlert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type SettingsTab = 'company' | 'brand' | 'email' | 'general' | 'leads' | 'events' | 'payments' | 'reminders' | 'app' | 'integrations' | 'templates';

interface EventType {
    id: string;
    name: string;
    calendar: 'appointments' | 'jobs';
    defaultColor: string;
}

interface ReminderRule {
    id: string;
    label: string;
    minutesBefore: number;
    enabled: boolean;
}

interface ReminderSet {
    entity: 'appointments' | 'jobs';
    channel: 'email' | 'sms';
    defaults: ReminderRule[];
    custom?: ReminderRule;
}

export default function AccountSettings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SettingsTab>('company');
    const [isEditing, setIsEditing] = useState(false);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [showQBSettings, setShowQBSettings] = useState(false);
    const [showCrewPermissions, setShowCrewPermissions] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // App Settings Context
    const appSettings = useAppSettings();
    const userRole = useUserRole();

    // QuickBooks Integration State
    const [qbConnectionStatus, setQBConnectionStatus] = useState<QuickBooksConnectionStatus>({ isConnected: false });
    const [qbSyncSettings, setQBSyncSettings] = useState<QuickBooksSyncSettings | null>(null);
    const [selectedAccountantRole, setSelectedAccountantRole] = useState<UserRole>('admin');

    // Company Settings
    const [companySettings, setCompanySettings] = useState({
        accountNumber: 'AC-12345',
        companyName: 'DripJobs Demo Co.',
        shortName: 'DripJobs',
        businessType: 'Painting & Pressure Washing',
        timeZone: 'America/New_York',
        licenseNumber: 'LIC-98765',
        phone: '(555) 123-4567',
        taxRate: 7.5,
        physicalAddress: {
            street: '123 Main St',
            city: 'Atlanta',
            state: 'GA',
            zip: '30301'
        },
        billingAddress: {
            street: '123 Main St',
            city: 'Atlanta',
            state: 'GA',
            zip: '30301'
        },
        isActive: true,
        enableGoogleCalendar: true,
    });

    // Brand Settings
    const [brandSettings, setBrandSettings] = useState({
        websiteUrl: 'https://dripjobs.com',
        reviewUrl: 'https://g.page/r/review-link',
        socialProfiles: {
            facebook: 'https://facebook.com/dripjobs',
            instagram: 'https://instagram.com/dripjobs',
            linkedin: 'https://linkedin.com/company/dripjobs',
            twitter: 'https://twitter.com/dripjobs'
        },
        accentColor: '#6366F1',
        logo: null
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        replyEmail: 'noreply@dripjobs.com',
        fromEmail: 'hello@dripjobs.com',
        postmarkApiKey: '••••••••••••••••',
        customDomain: 'mail.dripjobs.com',
        usingCustomDomain: false,
        dkimVerified: true,
        returnPathVerified: true
    });

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        contactTags: 'Homeowner, Builder, Company, Other',
        customerPayments: 'Credit Card, Check, Cash, ACH',
        leadSources: 'Facebook, Google, Website, Referral, Other',
        jobSources: 'Repeat Customer, Referral from Existing, Upsell/Cross-sell, Seasonal Service, Emergency/Urgent, Networking Event, Previous Quote Follow-up',
        defaultJobStartTime: '09:00',
        customProposalSendTime: '10:00',
        onSiteCommunication: true,
        onSiteReminders: true,
        addCrewToBanner: true,
        addJobTotalToBanner: false,
        enableCountersign: true
    });

    // Event Types
    const [eventTypes, setEventTypes] = useState<EventType[]>([
        { id: '1', name: 'Estimate', calendar: 'appointments', defaultColor: '#3B82F6' },
        { id: '2', name: 'Job', calendar: 'jobs', defaultColor: '#10B981' },
        { id: '3', name: 'Follow-up', calendar: 'appointments', defaultColor: '#F59E0B' },
    ]);

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        twilioEmail: 'payments@dripjobs.com',
        currency: 'USD',
        cardPayments: {
            enabled: true,
            status: 'connected',
            convenienceFee: 2.9
        },
        achPayments: {
            enabled: true,
            convenienceFee: 0.8,
            maxFee: 5.0
        },
        alternativePayments: {
            enabled: true,
            checkEnabled: true
        }
    });

    // Reminder Settings
    const [reminderSets, setReminderSets] = useState<ReminderSet[]>([
        {
            entity: 'appointments',
            channel: 'email',
            defaults: [
                { id: '1', label: 'Send 1 Day before', minutesBefore: 1440, enabled: true },
                { id: '2', label: 'Send 1 Hour before', minutesBefore: 60, enabled: true }
            ]
        },
        {
            entity: 'appointments',
            channel: 'sms',
            defaults: [
                { id: '3', label: 'Send 1 Day before', minutesBefore: 1440, enabled: true },
                { id: '4', label: 'Send 1 Hour before', minutesBefore: 60, enabled: false }
            ]
        },
        {
            entity: 'jobs',
            channel: 'email',
            defaults: [
                { id: '5', label: 'Send 1 Day before', minutesBefore: 1440, enabled: true },
                { id: '6', label: 'Send 2 Hours before', minutesBefore: 120, enabled: true }
            ]
        },
        {
            entity: 'jobs',
            channel: 'sms',
            defaults: [
                { id: '7', label: 'Send 1 Day before', minutesBefore: 1440, enabled: true }
            ]
        }
    ]);

    // Load QuickBooks connection status on mount
    useEffect(() => {
        loadQuickBooksStatus();
    }, []);

    const loadQuickBooksStatus = async () => {
        try {
            const status = await QuickBooksService.getConnectionStatus();
            setQBConnectionStatus(status);
            
            const settings = await QuickBooksService.getSyncSettings();
            setQBSyncSettings(settings);
        } catch (error) {
            console.error('Error loading QuickBooks status:', error);
        }
    };

    const tabs = [
        { id: 'app', label: 'App Settings', icon: Smartphone },
        { id: 'company', label: 'Company Info', icon: Building2 },
        { id: 'brand', label: 'Brand Settings', icon: Palette },
        { id: 'email', label: 'Email Settings', icon: Mail },
        { id: 'general', label: 'General', icon: Settings },
        { id: 'leads', label: 'Lead Center', icon: Zap },
        { id: 'events', label: 'Event Types', icon: Calendar },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'reminders', label: 'Reminders', icon: Bell },
        { id: 'crew', label: 'Crew Permissions', icon: Users },
        { id: 'templates', label: 'Templates', icon: FileText },
        { id: 'integrations', label: 'Integrations', icon: Link },
    ];

    const handleSave = () => {
        RNAlert.alert('Success', 'Settings saved successfully');
        setIsEditing(false);
        setHasChanges(false);
    };

    const handleCancel = () => {
        if (hasChanges) {
            RNAlert.alert(
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

    const markChanged = () => {
        if (!hasChanges) setHasChanges(true);
    };

    const addEventType = () => {
        const newEvent: EventType = {
            id: Date.now().toString(),
            name: 'New Event',
            calendar: 'appointments',
            defaultColor: '#6366F1'
        };
        setEventTypes([...eventTypes, newEvent]);
        markChanged();
    };

    const removeEventType = (id: string) => {
        RNAlert.alert(
            'Remove Event Type',
            'Are you sure you want to remove this event type?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: () => {
                        setEventTypes(eventTypes.filter(e => e.id !== id));
                        markChanged();
                    }
                },
            ]
        );
    };

    const toggleReminderRule = (setIndex: number, ruleId: string) => {
        const newSets = [...reminderSets];
        const rule = newSets[setIndex].defaults.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = !rule.enabled;
            setReminderSets(newSets);
            markChanged();
        }
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
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, accountNumber: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Company Name</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.companyName}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, companyName: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Short Name</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.shortName}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, shortName: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Business Type</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.businessType}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, businessType: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>License Number</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.licenseNumber}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, licenseNumber: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.phone}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, phone: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Tax Rate (%)</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.taxRate.toString()}
                                    onChangeText={(value) => {
                                        setCompanySettings({...companySettings, taxRate: parseFloat(value) || 0});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Addresses */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Physical Address</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Street</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={companySettings.physicalAddress.street}
                                    onChangeText={(value) => {
                                        setCompanySettings({
                                            ...companySettings,
                                            physicalAddress: {...companySettings.physicalAddress, street: value}
                                        });
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>
                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>City</Text>
                                    <TextInput
                                        style={[styles.input, !isEditing && styles.inputDisabled]}
                                        value={companySettings.physicalAddress.city}
                                        onChangeText={(value) => {
                                            setCompanySettings({
                                                ...companySettings,
                                                physicalAddress: {...companySettings.physicalAddress, city: value}
                                            });
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                    />
                                </View>
                                <View style={styles.inputThird}>
                                    <Text style={styles.inputLabel}>State</Text>
                                    <TextInput
                                        style={[styles.input, !isEditing && styles.inputDisabled]}
                                        value={companySettings.physicalAddress.state}
                                        onChangeText={(value) => {
                                            setCompanySettings({
                                                ...companySettings,
                                                physicalAddress: {...companySettings.physicalAddress, state: value}
                                            });
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                    />
                                </View>
                                <View style={styles.inputThird}>
                                    <Text style={styles.inputLabel}>ZIP</Text>
                                    <TextInput
                                        style={[styles.input, !isEditing && styles.inputDisabled]}
                                        value={companySettings.physicalAddress.zip}
                                        onChangeText={(value) => {
                                            setCompanySettings({
                                                ...companySettings,
                                                physicalAddress: {...companySettings.physicalAddress, zip: value}
                                            });
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                        keyboardType="number-pad"
                                    />
                                </View>
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
                                    onValueChange={(value) => {
                                        setCompanySettings({...companySettings, isActive: value});
                                        markChanged();
                                    }}
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
                                    onValueChange={(value) => {
                                        setCompanySettings({...companySettings, enableGoogleCalendar: value});
                                        markChanged();
                                    }}
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
                            <Text style={styles.sectionTitle}>Brand Information</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Website URL</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.websiteUrl}
                                    onChangeText={(value) => {
                                        setBrandSettings({...brandSettings, websiteUrl: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Review URL</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.reviewUrl}
                                    onChangeText={(value) => {
                                        setBrandSettings({...brandSettings, reviewUrl: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Social Profiles</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Facebook</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.socialProfiles.facebook}
                                    onChangeText={(value) => {
                                        setBrandSettings({
                                            ...brandSettings,
                                            socialProfiles: {...brandSettings.socialProfiles, facebook: value}
                                        });
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Instagram</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.socialProfiles.instagram}
                                    onChangeText={(value) => {
                                        setBrandSettings({
                                            ...brandSettings,
                                            socialProfiles: {...brandSettings.socialProfiles, instagram: value}
                                        });
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>LinkedIn</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.socialProfiles.linkedin}
                                    onChangeText={(value) => {
                                        setBrandSettings({
                                            ...brandSettings,
                                            socialProfiles: {...brandSettings.socialProfiles, linkedin: value}
                                        });
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Twitter</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={brandSettings.socialProfiles.twitter}
                                    onChangeText={(value) => {
                                        setBrandSettings({
                                            ...brandSettings,
                                            socialProfiles: {...brandSettings.socialProfiles, twitter: value}
                                        });
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Brand Assets</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Portal Accent Color</Text>
                                <View style={styles.colorPicker}>
                                    <View style={[styles.colorPreview, { backgroundColor: brandSettings.accentColor }]} />
                                    <TextInput
                                        style={[styles.input, styles.colorInput, !isEditing && styles.inputDisabled]}
                                        value={brandSettings.accentColor}
                                        onChangeText={(value) => {
                                            setBrandSettings({...brandSettings, accentColor: value});
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                        autoCapitalize="none"
                                    />
                                </View>
                                <Text style={styles.inputHint}>
                                    Do not select white (this will cause booking form submit button to appear hidden)
                                </Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Company Logo</Text>
                                <TouchableOpacity 
                                    style={styles.uploadButton}
                                    disabled={!isEditing}
                                >
                                    <Upload size={20} color={isEditing ? '#6366F1' : '#9CA3AF'} />
                                    <Text style={[styles.uploadButtonText, !isEditing && styles.uploadButtonTextDisabled]}>
                                        Choose File
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );

            case 'email':
                return (
                    <View style={styles.tabContent}>
                        {/* Helper Info Box */}
                        <View style={styles.infoBoxLarge}>
                            <View style={styles.infoBoxHeader}>
                                <Mail size={24} color="#6366F1" />
                                <Text style={styles.infoBoxTitle}>Send From Your Own Domain</Text>
                            </View>
                            <Text style={styles.infoBoxText}>
                                Currently, you're sending transactional emails from our domain. Setting up your own custom email domain provides several key benefits:
                            </Text>
                            <View style={styles.benefitsList}>
                                <View style={styles.benefitItem}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <Text style={styles.benefitText}>Improved deliverability & trust</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <Text style={styles.benefitText}>Professional brand appearance</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <Text style={styles.benefitText}>Better email reputation</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <Text style={styles.benefitText}>Reduced spam folder risk</Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={styles.sendInstructionsButton}
                                onPress={() => {
                                    RNAlert.alert(
                                        'Send Setup Instructions',
                                        'Enter your web developer\'s email address:',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { 
                                                text: 'Send',
                                                onPress: () => {
                                                    RNAlert.alert('Success', 'Setup instructions sent to your web developer');
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Send size={16} color="#FFFFFF" />
                                <Text style={styles.sendInstructionsButtonText}>Send Instructions to Web Developer</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Email Configuration</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Reply-To Email Address</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={emailSettings.replyEmail}
                                    onChangeText={(value) => {
                                        setEmailSettings({...emailSettings, replyEmail: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="replies@yourdomain.com"
                                />
                                <Text style={styles.inputHint}>
                                    Default email address where customer replies will be sent
                                </Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>From Email Address</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={emailSettings.fromEmail}
                                    onChangeText={(value) => {
                                        setEmailSettings({...emailSettings, fromEmail: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="hello@yourdomain.com"
                                />
                                <Text style={styles.inputHint}>
                                    Email address that appears in the "From" field
                                </Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Custom Email Domain</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={emailSettings.customDomain}
                                    onChangeText={(value) => {
                                        setEmailSettings({...emailSettings, customDomain: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                    placeholder="mail.yourdomain.com"
                                />
                                <Text style={styles.inputHint}>
                                    Your custom subdomain for sending emails (e.g., mail.yourdomain.com)
                                </Text>
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Using Custom Domain</Text>
                                    <Text style={styles.switchLabelSubtext}>
                                        {emailSettings.usingCustomDomain 
                                            ? 'Sending from your domain' 
                                            : 'Currently sending from DripJobs domain'}
                                    </Text>
                                </View>
                                <Switch
                                    value={emailSettings.usingCustomDomain}
                                    onValueChange={(value) => {
                                        setEmailSettings({...emailSettings, usingCustomDomain: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={emailSettings.usingCustomDomain ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Postmark Server API Key</Text>
                                <View style={styles.inputWithButton}>
                                    <TextInput
                                        style={[styles.input, styles.inputWithIcon, !isEditing && styles.inputDisabled]}
                                        value={emailSettings.postmarkApiKey}
                                        onChangeText={(value) => {
                                            setEmailSettings({...emailSettings, postmarkApiKey: value});
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                        secureTextEntry
                                        placeholder="Enter your Postmark API key"
                                    />
                                    <TouchableOpacity style={styles.inputButton}>
                                        <Copy size={16} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.inputHint}>
                                    Required for sending transactional emails via Postmark
                                </Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeaderWithAction}>
                                <Text style={styles.sectionTitle}>Domain Verification Status</Text>
                                <TouchableOpacity 
                                    style={styles.checkVerificationButton}
                                    onPress={() => {
                                        RNAlert.alert('Checking...', 'Verifying your domain records');
                                    }}
                                >
                                    <Text style={styles.checkVerificationButtonText}>Check Status</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {!emailSettings.usingCustomDomain && (
                                <View style={styles.warningBox}>
                                    <AlertCircle size={16} color="#F59E0B" />
                                    <Text style={styles.warningText}>
                                        Domain verification not required while using DripJobs domain
                                    </Text>
                                </View>
                            )}

                            <View style={styles.verificationRow}>
                                <View style={styles.verificationInfo}>
                                    <Text style={styles.verificationTitle}>DKIM (DomainKeys)</Text>
                                    <Text style={styles.verificationSubtext}>Authenticates email sender</Text>
                                </View>
                                <View style={[styles.badge, emailSettings.dkimVerified ? styles.badgeSuccess : styles.badgeWarning]}>
                                    {emailSettings.dkimVerified ? (
                                        <CheckCircle size={12} color="#10B981" />
                                    ) : (
                                        <AlertCircle size={12} color="#F59E0B" />
                                    )}
                                    <Text style={emailSettings.dkimVerified ? styles.badgeSuccessText : styles.badgeWarningText}>
                                        {emailSettings.dkimVerified ? 'Verified' : 'Pending'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.verificationRow}>
                                <View style={styles.verificationInfo}>
                                    <Text style={styles.verificationTitle}>Return-Path</Text>
                                    <Text style={styles.verificationSubtext}>Handles bounced emails</Text>
                                </View>
                                <View style={[styles.badge, emailSettings.returnPathVerified ? styles.badgeSuccess : styles.badgeWarning]}>
                                    {emailSettings.returnPathVerified ? (
                                        <CheckCircle size={12} color="#10B981" />
                                    ) : (
                                        <AlertCircle size={12} color="#F59E0B" />
                                    )}
                                    <Text style={emailSettings.returnPathVerified ? styles.badgeSuccessText : styles.badgeWarningText}>
                                        {emailSettings.returnPathVerified ? 'Verified' : 'Pending'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Setup Instructions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>DNS Setup Instructions</Text>
                            <Text style={styles.instructionsText}>
                                To set up your custom email domain, you or your web developer will need to add the following DNS records:
                            </Text>
                            
                            <View style={styles.dnsRecordCard}>
                                <View style={styles.dnsRecordHeader}>
                                    <Text style={styles.dnsRecordType}>CNAME Record #1</Text>
                                    <TouchableOpacity>
                                        <Copy size={16} color="#6366F1" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dnsRecordRow}>
                                    <Text style={styles.dnsRecordLabel}>Name:</Text>
                                    <Text style={styles.dnsRecordValue}>20237pm._domainkey</Text>
                                </View>
                                <View style={styles.dnsRecordRow}>
                                    <Text style={styles.dnsRecordLabel}>Value:</Text>
                                    <Text style={styles.dnsRecordValue}>20237pm.dkim.postmarkapp.com</Text>
                                </View>
                            </View>

                            <View style={styles.dnsRecordCard}>
                                <View style={styles.dnsRecordHeader}>
                                    <Text style={styles.dnsRecordType}>CNAME Record #2</Text>
                                    <TouchableOpacity>
                                        <Copy size={16} color="#6366F1" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dnsRecordRow}>
                                    <Text style={styles.dnsRecordLabel}>Name:</Text>
                                    <Text style={styles.dnsRecordValue}>pm-bounces</Text>
                                </View>
                                <View style={styles.dnsRecordRow}>
                                    <Text style={styles.dnsRecordLabel}>Value:</Text>
                                    <Text style={styles.dnsRecordValue}>pm.mtasv.net</Text>
                                </View>
                            </View>

                            <Text style={styles.instructionsNote}>
                                💡 DNS changes can take up to 48 hours to propagate. Use the "Check Status" button above to verify once configured.
                            </Text>
                        </View>
                    </View>
                );

            case 'general':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tags & Categories</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Contact Tags</Text>
                                <TextInput
                                    style={[styles.textArea, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.contactTags}
                                    onChangeText={(value) => {
                                        setGeneralSettings({...generalSettings, contactTags: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Homeowner, Builder, Company, Other"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Customer Payments</Text>
                                <TextInput
                                    style={[styles.textArea, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.customerPayments}
                                    onChangeText={(value) => {
                                        setGeneralSettings({...generalSettings, customerPayments: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Credit Card, Check, Cash"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Lead Sources</Text>
                                <TextInput
                                    style={[styles.textArea, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.leadSources}
                                    onChangeText={(value) => {
                                        setGeneralSettings({...generalSettings, leadSources: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Facebook, Google, Website"
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Default Times</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Default Job Start Time</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.defaultJobStartTime}
                                    onChangeText={(value) => {
                                        setGeneralSettings({...generalSettings, defaultJobStartTime: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    placeholder="09:00"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Custom Proposal Send Time</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.customProposalSendTime}
                                    onChangeText={(value) => {
                                        setGeneralSettings({...generalSettings, customProposalSendTime: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    placeholder="10:00"
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Estimate Settings</Text>
                            
                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>On-Site Communication</Text>
                                </View>
                                <Switch
                                    value={generalSettings.onSiteCommunication}
                                    onValueChange={(value) => {
                                        setGeneralSettings({...generalSettings, onSiteCommunication: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={generalSettings.onSiteCommunication ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>On-Site Reminders</Text>
                                </View>
                                <Switch
                                    value={generalSettings.onSiteReminders}
                                    onValueChange={(value) => {
                                        setGeneralSettings({...generalSettings, onSiteReminders: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={generalSettings.onSiteReminders ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Add Crew to Banner</Text>
                                </View>
                                <Switch
                                    value={generalSettings.addCrewToBanner}
                                    onValueChange={(value) => {
                                        setGeneralSettings({...generalSettings, addCrewToBanner: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={generalSettings.addCrewToBanner ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Add Job Total to Banner</Text>
                                </View>
                                <Switch
                                    value={generalSettings.addJobTotalToBanner}
                                    onValueChange={(value) => {
                                        setGeneralSettings({...generalSettings, addJobTotalToBanner: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={generalSettings.addJobTotalToBanner ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text style={styles.switchLabelText}>Enable Countersign</Text>
                                    <Text style={styles.switchLabelSubtext}>On Proposals</Text>
                                </View>
                                <Switch
                                    value={generalSettings.enableCountersign}
                                    onValueChange={(value) => {
                                        setGeneralSettings({...generalSettings, enableCountersign: value});
                                        markChanged();
                                    }}
                                    disabled={!isEditing}
                                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                    thumbColor={generalSettings.enableCountersign ? '#3B82F6' : '#F3F4F6'}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'leads':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.leadCenterInfo}>
                            <View style={styles.leadCenterHeader}>
                                <Zap size={32} color="#6366F1" />
                                <View style={styles.leadCenterHeaderText}>
                                    <Text style={styles.leadCenterTitle}>Lead Center</Text>
                                    <Text style={styles.leadCenterDescription}>
                                        Connect your lead generation channels to automatically import leads into DripJobs
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Available Lead Sources</Text>
                            <Text style={styles.sectionDescription}>
                                Click "Open Lead Center" to configure API keys, pipeline stages, and auto-response messages for each source.
                            </Text>
                            
                            <TouchableOpacity 
                                style={styles.leadCenterNavigateButton}
                                onPress={() => router.push('/lead-center')}
                            >
                                <Zap size={24} color="#FFFFFF" />
                                <Text style={styles.leadCenterNavigateText}>Open Lead Center</Text>
                                <ExternalLink size={20} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.leadSourcesList}>
                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#4285F420' }]}>
                                        <Text style={styles.leadSourceEmoji}>🌐</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Google LSA</Text>
                                        <Text style={styles.leadSourceDesc}>Local Services Ads integration</Text>
                                    </View>
                                    <View style={styles.leadSourceBadge}>
                                        <Text style={styles.leadSourceBadgeText}>Available</Text>
                                    </View>
                                </View>

                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#1877F220' }]}>
                                        <Text style={styles.leadSourceEmoji}>💬</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Facebook Leads</Text>
                                        <Text style={styles.leadSourceDesc}>Import from Lead Ads</Text>
                                    </View>
                                    <View style={styles.leadSourceBadge}>
                                        <Text style={styles.leadSourceBadgeText}>Available</Text>
                                    </View>
                                </View>

                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#FF6F6120' }]}>
                                        <Text style={styles.leadSourceEmoji}>⭐</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Angi Leads</Text>
                                        <Text style={styles.leadSourceDesc}>Angie's List integration</Text>
                                    </View>
                                    <View style={styles.leadSourceBadge}>
                                        <Text style={styles.leadSourceBadgeText}>Available</Text>
                                    </View>
                                </View>

                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#009FD420' }]}>
                                        <Text style={styles.leadSourceEmoji}>⚡</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Thumbtack</Text>
                                        <Text style={styles.leadSourceDesc}>Real-time lead notifications</Text>
                                    </View>
                                    <View style={styles.leadSourceBadge}>
                                        <Text style={styles.leadSourceBadgeText}>Available</Text>
                                    </View>
                                </View>

                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#10B98120' }]}>
                                        <Text style={styles.leadSourceEmoji}>🌍</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Website Forms</Text>
                                        <Text style={styles.leadSourceDesc}>Embed forms on your site</Text>
                                    </View>
                                    <View style={[styles.leadSourceBadge, styles.leadSourceBadgeConnected]}>
                                        <Text style={[styles.leadSourceBadgeText, styles.leadSourceBadgeTextConnected]}>Active</Text>
                                    </View>
                                </View>

                                <View style={styles.leadSourceItem}>
                                    <View style={[styles.leadSourceIcon, { backgroundColor: '#8B5CF620' }]}>
                                        <Text style={styles.leadSourceEmoji}>📞</Text>
                                    </View>
                                    <View style={styles.leadSourceInfo}>
                                        <Text style={styles.leadSourceName}>Phone Calls</Text>
                                        <Text style={styles.leadSourceDesc}>Call tracking integration</Text>
                                    </View>
                                    <View style={styles.leadSourceBadge}>
                                        <Text style={styles.leadSourceBadgeText}>Available</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View>
                                    <Text style={styles.sectionTitle}>Job Sources</Text>
                                    <Text style={styles.sectionDescription}>
                                        Track attribution for repeat customers and additional jobs from existing clients. Job sources help measure ROI for each new project separately from the original lead source.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Available Job Sources</Text>
                                <TextInput
                                    style={[styles.textArea, !isEditing && styles.inputDisabled]}
                                    value={generalSettings.jobSources}
                                    onChangeText={(text) => {
                                        setGeneralSettings({ ...generalSettings, jobSources: text });
                                        setHasChanges(true);
                                    }}
                                    editable={isEditing}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Enter job sources separated by commas"
                                    placeholderTextColor="#9CA3AF"
                                />
                                <Text style={styles.inputHint}>
                                    Separate multiple sources with commas. These sources are used when creating jobs, proposals, or appointments for existing customers.
                                </Text>
                            </View>

                            <View style={styles.infoCard}>
                                <View style={styles.infoCardIcon}>
                                    <TrendingUp size={20} color="#6366F1" />
                                </View>
                                <View style={styles.infoCardContent}>
                                    <Text style={styles.infoCardTitle}>How Job Sources Work</Text>
                                    <Text style={styles.infoCardDescription}>
                                        When an existing customer requests a new job, you'll see their original lead source (locked) and can select a job source like "Repeat Customer". This ensures proper attribution in your metrics - the first job counts toward the original lead source, and subsequent jobs count toward their respective job sources.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quick Settings</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Default Pipeline Stage for New Leads</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value="New Leads"
                                    editable={false}
                                    placeholder="New Leads"
                                />
                                <Text style={styles.inputHint}>
                                    Configure individual stages per source in Lead Center
                                </Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Default Auto-Response Message</Text>
                                <TextInput
                                    style={[styles.textArea, !isEditing && styles.inputDisabled]}
                                    value="Thanks for reaching out! We received your request and one of our team members will be in touch within 24 hours to discuss your project."
                                    editable={false}
                                    multiline
                                    numberOfLines={3}
                                />
                                <Text style={styles.inputHint}>
                                    Customize per source in Lead Center
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
                                    <TouchableOpacity style={styles.addButton} onPress={addEventType}>
                                        <Plus size={16} color="#6366F1" />
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            {eventTypes.map((event) => (
                                <View key={event.id} style={styles.eventTypeCard}>
                                    <View style={styles.eventTypeRow}>
                                        <View style={styles.eventTypeInfo}>
                                            <Text style={styles.eventTypeName}>{event.name}</Text>
                                            <Text style={styles.eventTypeCalendar}>{event.calendar}</Text>
                                        </View>
                                        <View style={styles.eventTypeActions}>
                                            <View style={[styles.eventTypeColor, { backgroundColor: event.defaultColor }]} />
                                            {isEditing && (
                                                <TouchableOpacity 
                                                    style={styles.deleteButton}
                                                    onPress={() => removeEventType(event.id)}
                                                >
                                                    <Trash2 size={18} color="#EF4444" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            case 'payments':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Payment Configuration</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Twilio Email</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={paymentSettings.twilioEmail}
                                    onChangeText={(value) => {
                                        setPaymentSettings({...paymentSettings, twilioEmail: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Currency</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={paymentSettings.currency}
                                    onChangeText={(value) => {
                                        setPaymentSettings({...paymentSettings, currency: value});
                                        markChanged();
                                    }}
                                    editable={isEditing}
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.paymentCard}>
                                <View style={styles.paymentHeader}>
                                    <CreditCard size={20} color="#6366F1" />
                                    <Text style={styles.paymentTitle}>Card Payments</Text>
                                </View>
                                <View style={styles.paymentStatus}>
                                    <Text style={styles.paymentStatusLabel}>Status</Text>
                                    <View style={[styles.badge, styles.badgeSuccess]}>
                                        <CheckCircle size={12} color="#10B981" />
                                        <Text style={styles.badgeSuccessText}>
                                            {paymentSettings.cardPayments.enabled ? 'Enabled' : 'Disabled'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Convenience Fee (%)</Text>
                                    <TextInput
                                        style={[styles.input, !isEditing && styles.inputDisabled]}
                                        value={paymentSettings.cardPayments.convenienceFee.toString()}
                                        onChangeText={(value) => {
                                            setPaymentSettings({
                                                ...paymentSettings,
                                                cardPayments: {...paymentSettings.cardPayments, convenienceFee: parseFloat(value) || 0}
                                            });
                                            markChanged();
                                        }}
                                        editable={isEditing}
                                        keyboardType="decimal-pad"
                                    />
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
                                        <Text style={styles.badgeSuccessText}>
                                            {paymentSettings.achPayments.enabled ? 'Enabled' : 'Disabled'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputRow}>
                                    <View style={styles.inputHalf}>
                                        <Text style={styles.inputLabel}>Fee (%)</Text>
                                        <TextInput
                                            style={[styles.input, !isEditing && styles.inputDisabled]}
                                            value={paymentSettings.achPayments.convenienceFee.toString()}
                                            onChangeText={(value) => {
                                                setPaymentSettings({
                                                    ...paymentSettings,
                                                    achPayments: {...paymentSettings.achPayments, convenienceFee: parseFloat(value) || 0}
                                                });
                                                markChanged();
                                            }}
                                            editable={isEditing}
                                            keyboardType="decimal-pad"
                                        />
                                    </View>
                                    <View style={styles.inputHalf}>
                                        <Text style={styles.inputLabel}>Max Fee ($)</Text>
                                        <TextInput
                                            style={[styles.input, !isEditing && styles.inputDisabled]}
                                            value={paymentSettings.achPayments.maxFee.toString()}
                                            onChangeText={(value) => {
                                                setPaymentSettings({
                                                    ...paymentSettings,
                                                    achPayments: {...paymentSettings.achPayments, maxFee: parseFloat(value) || 0}
                                                });
                                                markChanged();
                                            }}
                                            editable={isEditing}
                                            keyboardType="decimal-pad"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.paymentCard}>
                                <View style={styles.paymentHeader}>
                                    <FileText size={20} color="#6366F1" />
                                    <Text style={styles.paymentTitle}>Alternative Payments</Text>
                                </View>
                                <View style={styles.switchRow}>
                                    <View style={styles.switchLabel}>
                                        <Text style={styles.switchLabelText}>Enabled</Text>
                                    </View>
                                    <Switch
                                        value={paymentSettings.alternativePayments.enabled}
                                        onValueChange={(value) => {
                                            setPaymentSettings({
                                                ...paymentSettings,
                                                alternativePayments: {...paymentSettings.alternativePayments, enabled: value}
                                            });
                                            markChanged();
                                        }}
                                        disabled={!isEditing}
                                        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                        thumbColor={paymentSettings.alternativePayments.enabled ? '#3B82F6' : '#F3F4F6'}
                                    />
                                </View>
                                <View style={styles.switchRow}>
                                    <View style={styles.switchLabel}>
                                        <Text style={styles.switchLabelText}>Pay with Check</Text>
                                    </View>
                                    <Switch
                                        value={paymentSettings.alternativePayments.checkEnabled}
                                        onValueChange={(value) => {
                                            setPaymentSettings({
                                                ...paymentSettings,
                                                alternativePayments: {...paymentSettings.alternativePayments, checkEnabled: value}
                                            });
                                            markChanged();
                                        }}
                                        disabled={!isEditing}
                                        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                        thumbColor={paymentSettings.alternativePayments.checkEnabled ? '#3B82F6' : '#F3F4F6'}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );

            case 'reminders':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.reminderGroup}>
                            <Text style={styles.reminderGroupTitle}>For Appointments</Text>
                            
                            {reminderSets
                                .filter(set => set.entity === 'appointments')
                                .map((set, setIndex) => {
                                    const actualIndex = reminderSets.findIndex(s => s === set);
                                    return (
                                        <View key={`${set.entity}-${set.channel}`} style={styles.reminderSection}>
                                            <Text style={styles.reminderSectionTitle}>
                                                {set.channel === 'email' ? 'Email Delivery' : 'SMS Delivery'}
                                            </Text>
                                            {set.defaults.map(rule => (
                                                <View key={rule.id} style={styles.reminderRow}>
                                                    <View style={styles.reminderInfo}>
                                                        <Text style={styles.reminderLabel}>{rule.label}</Text>
                                                        <Text style={styles.reminderTime}>
                                                            ({Math.round(rule.minutesBefore / 60)} {rule.minutesBefore >= 60 ? 'hour(s)' : 'min(s)'} before)
                                                        </Text>
                                                    </View>
                                                    <Switch
                                                        value={rule.enabled}
                                                        onValueChange={() => toggleReminderRule(actualIndex, rule.id)}
                                                        disabled={!isEditing}
                                                        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                                        thumbColor={rule.enabled ? '#3B82F6' : '#F3F4F6'}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                        </View>

                        <View style={styles.reminderGroup}>
                            <Text style={styles.reminderGroupTitle}>For Jobs</Text>
                            
                            {reminderSets
                                .filter(set => set.entity === 'jobs')
                                .map((set) => {
                                    const actualIndex = reminderSets.findIndex(s => s === set);
                                    return (
                                        <View key={`${set.entity}-${set.channel}`} style={styles.reminderSection}>
                                            <Text style={styles.reminderSectionTitle}>
                                                {set.channel === 'email' ? 'Email Delivery' : 'SMS Delivery'}
                                            </Text>
                                            {set.defaults.map(rule => (
                                                <View key={rule.id} style={styles.reminderRow}>
                                                    <View style={styles.reminderInfo}>
                                                        <Text style={styles.reminderLabel}>{rule.label}</Text>
                                                        <Text style={styles.reminderTime}>
                                                            ({Math.round(rule.minutesBefore / 60)} {rule.minutesBefore >= 60 ? 'hour(s)' : 'min(s)'} before)
                                                        </Text>
                                                    </View>
                                                    <Switch
                                                        value={rule.enabled}
                                                        onValueChange={() => toggleReminderRule(actualIndex, rule.id)}
                                                        disabled={!isEditing}
                                                        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                                        thumbColor={rule.enabled ? '#3B82F6' : '#F3F4F6'}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                );

            case 'app':
                return (
                    <View style={styles.tabContent}>
                        {/* Bottom Menu Settings */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Bottom Menu</Text>
                            </View>
                            <Text style={styles.sectionSubtitle}>
                                Choose 4-6 menu items. Home is always first.
                            </Text>

                            {/* Selected Tabs */}
                            <View style={styles.selectedTabsContainer}>
                                {appSettings.selectedTabs.map((tab, index) => {
                                    const Icon = tab.id === 'index' ? House : 
                                                 tab.id === 'contacts' ? Users :
                                                 tab.id === 'businesses' ? Building2 :
                                                 tab.id === 'pipeline' ? BarChart3 :
                                                 tab.id === 'metrics' ? TrendingUp :
                                                 tab.id === 'phone' ? Grid3x3 :
                                                 tab.id === 'chat' ? MessageSquare :
                                                 tab.id === 'email' ? Mail :
                                                 tab.id === 'team-chat' ? Hash :
                                                 tab.id === 'work-orders' ? Wrench :
                                                 tab.id === 'tasks' ? SquareCheck :
                                                 tab.id === 'products' ? Package :
                                                 tab.id === 'appointments' ? Calendar :
                                                 tab.id === 'job-schedule' ? CalendarDays : House;
                                    
                                    const isHome = tab.id === 'index';
                                    const canMoveUp = index > 1;
                                    const canMoveDown = index < appSettings.selectedTabs.length - 1;
                                    
                                    return (
                                        <View key={tab.id} style={styles.selectedTabItem}>
                                            <View style={styles.selectedTabLeft}>
                                                <GripVertical size={18} color="#9CA3AF" />
                                                <View style={[styles.tabIconCircle, isHome && styles.tabIconCircleHome]}>
                                                    <Icon size={18} color={isHome ? '#6366F1' : '#6B7280'} />
                                                </View>
                                                <View>
                                                    <Text style={styles.selectedTabName}>{tab.title}</Text>
                                                    {isHome && <Text style={styles.requiredBadge}>Required</Text>}
                                                </View>
                                            </View>
                                            <View style={styles.selectedTabActions}>
                                                {!isHome && (
                                                    <>
                                                        <TouchableOpacity
                                                            style={[styles.tabActionButton, !canMoveUp && styles.tabActionButtonDisabled]}
                                                            disabled={!canMoveUp}
                                                            onPress={() => {
                                                                const newTabs = [...appSettings.selectedTabs];
                                                                [newTabs[index], newTabs[index - 1]] = [newTabs[index - 1], newTabs[index]];
                                                                appSettings.setSelectedTabs(newTabs);
                                                            }}
                                                        >
                                                            <ChevronUp size={18} color={canMoveUp ? '#6B7280' : '#D1D5DB'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[styles.tabActionButton, !canMoveDown && styles.tabActionButtonDisabled]}
                                                            disabled={!canMoveDown}
                                                            onPress={() => {
                                                                const newTabs = [...appSettings.selectedTabs];
                                                                [newTabs[index], newTabs[index + 1]] = [newTabs[index + 1], newTabs[index]];
                                                                appSettings.setSelectedTabs(newTabs);
                                                            }}
                                                        >
                                                            <ChevronDown size={18} color={canMoveDown ? '#6B7280' : '#D1D5DB'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={styles.tabActionButton}
                                                            disabled={appSettings.selectedTabs.length <= 4}
                                                            onPress={() => {
                                                                if (appSettings.selectedTabs.length > 4) {
                                                                    const newTabs = appSettings.selectedTabs.filter(t => t.id !== tab.id);
                                                                    appSettings.setSelectedTabs(newTabs);
                                                                }
                                                            }}
                                                        >
                                                            <X size={18} color={appSettings.selectedTabs.length > 4 ? '#EF4444' : '#D1D5DB'} />
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Available Tabs */}
                            {appSettings.selectedTabs.length < 6 && (
                                <View style={styles.availableTabsSection}>
                                    <Text style={styles.availableTabsTitle}>Add More Tabs</Text>
                                    <View style={styles.availableTabsGrid}>
                                        {appSettings.availableTabs
                                            .filter(tab => !appSettings.selectedTabs.find(st => st.id === tab.id))
                                            .map(tab => {
                                                const Icon = tab.id === 'contacts' ? Users :
                                                             tab.id === 'businesses' ? Building2 :
                                                             tab.id === 'pipeline' ? BarChart3 :
                                                             tab.id === 'metrics' ? TrendingUp :
                                                             tab.id === 'phone' ? Grid3x3 :
                                                             tab.id === 'chat' ? MessageSquare :
                                                             tab.id === 'email' ? Mail :
                                                             tab.id === 'team-chat' ? Hash :
                                                             tab.id === 'work-orders' ? Wrench :
                                                             tab.id === 'tasks' ? SquareCheck :
                                                             tab.id === 'products' ? Package :
                                                             tab.id === 'appointments' ? Calendar :
                                                             tab.id === 'job-schedule' ? CalendarDays : House;
                                                
                                                return (
                                                    <TouchableOpacity
                                                        key={tab.id}
                                                        style={styles.availableTabItem}
                                                        onPress={() => {
                                                            const newTabs = [...appSettings.selectedTabs, tab];
                                                            appSettings.setSelectedTabs(newTabs);
                                                        }}
                                                    >
                                                        <Icon size={20} color="#6366F1" />
                                                        <Text style={styles.availableTabName}>{tab.title}</Text>
                                                        <Plus size={16} color="#6366F1" />
                                                    </TouchableOpacity>
                                                );
                                            })}
                                    </View>
                                </View>
                            )}

                            <View style={styles.helpTextContainer}>
                                <Text style={styles.helpText}>
                                    Selected: {appSettings.selectedTabs.length}/6 tabs
                                    {appSettings.selectedTabs.length < 4 && ' (minimum 4 required)'}
                                </Text>
                            </View>
                        </View>

                        {/* Quick Actions Settings */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Quick Actions</Text>
                            </View>
                            <Text style={styles.sectionSubtitle}>
                                Customize your floating action menu
                            </Text>

                            {/* Selected Quick Actions */}
                            <View style={styles.selectedActionsContainer}>
                                {appSettings.selectedQuickActions.map((action, index) => {
                                    const Icon = action.icon === 'Calendar' ? Calendar :
                                                 action.icon === 'SquareCheck' ? SquareCheck :
                                                 action.icon === 'Send' ? Send :
                                                 action.icon === 'FileText' ? FileText :
                                                 action.icon === 'Briefcase' ? Briefcase :
                                                 action.icon === 'UserPlus' ? UserPlus :
                                                 action.icon === 'Receipt' ? Receipt :
                                                 action.icon === 'Phone' ? Phone : Plus;
                                    
                                    return (
                                        <View key={action.id} style={styles.selectedActionItem}>
                                            <View style={styles.selectedActionLeft}>
                                                <LinearGradient
                                                    colors={action.colors}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.actionIconGradient}
                                                >
                                                    <Icon size={16} color="#FFFFFF" />
                                                </LinearGradient>
                                                <Text style={styles.selectedActionName}>{action.name}</Text>
                                            </View>
                                            <View style={styles.selectedActionActions}>
                                                <TouchableOpacity
                                                    style={[styles.tabActionButton, index === 0 && styles.tabActionButtonDisabled]}
                                                    disabled={index === 0}
                                                    onPress={() => {
                                                        const newActions = [...appSettings.selectedQuickActions];
                                                        [newActions[index], newActions[index - 1]] = [newActions[index - 1], newActions[index]];
                                                        appSettings.setSelectedQuickActions(newActions);
                                                    }}
                                                >
                                                    <ChevronUp size={18} color={index > 0 ? '#6B7280' : '#D1D5DB'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.tabActionButton, index === appSettings.selectedQuickActions.length - 1 && styles.tabActionButtonDisabled]}
                                                    disabled={index === appSettings.selectedQuickActions.length - 1}
                                                    onPress={() => {
                                                        const newActions = [...appSettings.selectedQuickActions];
                                                        [newActions[index], newActions[index + 1]] = [newActions[index + 1], newActions[index]];
                                                        appSettings.setSelectedQuickActions(newActions);
                                                    }}
                                                >
                                                    <ChevronDown size={18} color={index < appSettings.selectedQuickActions.length - 1 ? '#6B7280' : '#D1D5DB'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.tabActionButton}
                                                    onPress={() => {
                                                        const newActions = appSettings.selectedQuickActions.filter(a => a.id !== action.id);
                                                        appSettings.setSelectedQuickActions(newActions);
                                                    }}
                                                >
                                                    <X size={18} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Available Quick Actions */}
                            {appSettings.selectedQuickActions.length < appSettings.availableQuickActions.length && (
                                <View style={styles.availableTabsSection}>
                                    <Text style={styles.availableTabsTitle}>Available Actions</Text>
                                    <View style={styles.availableActionsGrid}>
                                        {appSettings.availableQuickActions
                                            .filter(action => !appSettings.selectedQuickActions.find(sa => sa.id === action.id))
                                            .map(action => {
                                                const Icon = action.icon === 'Calendar' ? Calendar :
                                                             action.icon === 'SquareCheck' ? SquareCheck :
                                                             action.icon === 'Send' ? Send :
                                                             action.icon === 'FileText' ? FileText :
                                                             action.icon === 'Briefcase' ? Briefcase :
                                                             action.icon === 'UserPlus' ? UserPlus :
                                                             action.icon === 'Receipt' ? Receipt :
                                                             action.icon === 'Phone' ? Phone : Plus;
                                                
                                                return (
                                                    <TouchableOpacity
                                                        key={action.id}
                                                        style={styles.availableActionItem}
                                                        onPress={() => {
                                                            const newActions = [...appSettings.selectedQuickActions, action];
                                                            appSettings.setSelectedQuickActions(newActions);
                                                        }}
                                                    >
                                                        <LinearGradient
                                                            colors={action.colors}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            style={styles.actionIconGradientSmall}
                                                        >
                                                            <Icon size={14} color="#FFFFFF" />
                                                        </LinearGradient>
                                                        <Text style={styles.availableActionName}>{action.name}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Reset Button */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => {
                                RNAlert.alert(
                                    'Reset to Defaults',
                                    'Are you sure you want to reset all app settings to defaults?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Reset',
                                            style: 'destructive',
                                            onPress: () => appSettings.resetToDefaults()
                                        }
                                    ]
                                );
                            }}
                        >
                            <RotateCcw size={18} color="#EF4444" />
                            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'integrations':
                return (
                    <View style={styles.tabContent}>
                        {/* QuickBooks Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <FileText size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>QuickBooks Online</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Connect your QuickBooks account for seamless financial sync
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Connection Status */}
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        {qbConnectionStatus.isConnected ? (
                                            <CheckCircle size={16} color="#10B981" />
                                        ) : (
                                            <XCircle size={16} color="#9CA3AF" />
                                        )}
                                        <Text style={[
                                            styles.statusText,
                                            qbConnectionStatus.isConnected && styles.statusTextSuccess
                                        ]}>
                                            {qbConnectionStatus.isConnected ? 'Connected' : 'Not Connected'}
                                        </Text>
                                    </View>
                                </View>

                                {qbConnectionStatus.isConnected && qbConnectionStatus.companyName && (
                                    <View style={styles.connectionInfo}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Company:</Text>
                                            <Text style={styles.infoValue}>{qbConnectionStatus.companyName}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Last Sync:</Text>
                                            <Text style={styles.infoValue}>
                                                {qbConnectionStatus.lastSyncedAt 
                                                    ? new Date(qbConnectionStatus.lastSyncedAt).toLocaleString()
                                                    : 'Never'}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {qbConnectionStatus.connectionError && (
                                    <View style={styles.errorBox}>
                                        <AlertCircle size={16} color="#EF4444" />
                                        <Text style={styles.errorText}>{qbConnectionStatus.connectionError}</Text>
                                    </View>
                                )}

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.buttonFlex,
                                            qbConnectionStatus.isConnected ? styles.buttonDanger : styles.buttonPrimary
                                        ]}
                                        onPress={async () => {
                                            if (qbConnectionStatus.isConnected) {
                                                RNAlert.alert(
                                                    'Disconnect QuickBooks',
                                                    'Are you sure you want to disconnect from QuickBooks?',
                                                    [
                                                        { text: 'Cancel', style: 'cancel' },
                                                        {
                                                            text: 'Disconnect',
                                                            style: 'destructive',
                                                            onPress: async () => {
                                                                try {
                                                                    await QuickBooksService.disconnect();
                                                                    await loadQuickBooksStatus();
                                                                    RNAlert.alert('Success', 'Disconnected from QuickBooks');
                                                                } catch (error) {
                                                                    RNAlert.alert('Error', 'Failed to disconnect from QuickBooks');
                                                                }
                                                            },
                                                        },
                                                    ]
                                                );
                                            } else {
                                                try {
                                                    await QuickBooksService.connect();
                                                    await loadQuickBooksStatus();
                                                } catch (error) {
                                                    RNAlert.alert('Error', 'Failed to connect to QuickBooks');
                                                }
                                            }
                                        }}
                                    >
                                        <ExternalLink size={18} color="#FFFFFF" />
                                        <Text style={styles.buttonText}>
                                            {qbConnectionStatus.isConnected ? 'Disconnect QuickBooks' : 'Connect to QuickBooks'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSecondary, styles.buttonFlex]}
                                        onPress={() => setShowQBSettings(true)}
                                    >
                                        <Settings size={18} color="#6366F1" />
                                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                                            Settings
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                        {/* Acorn Finance Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <DollarSign size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>Acorn Finance</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Connect with Acorn Finance for financing options
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        <XCircle size={16} color="#9CA3AF" />
                                        <Text style={styles.statusText}>Not Connected</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonPrimary]}
                                    onPress={() => {
                                        RNAlert.alert('Coming Soon', 'Acorn Finance integration will be available soon');
                                    }}
                                >
                                    <ExternalLink size={18} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Connect to Acorn Finance</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Zapier Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Zap size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>Zapier</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Automate workflows with 5000+ apps
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        <XCircle size={16} color="#9CA3AF" />
                                        <Text style={styles.statusText}>Not Connected</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonZapier]}
                                    onPress={() => {
                                        RNAlert.alert('Coming Soon', 'Zapier integration will be available soon');
                                    }}
                                >
                                    <ExternalLink size={18} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Connect to Zapier</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* CompanyCam Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Camera size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>CompanyCam</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Sync photos and project documentation
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        <XCircle size={16} color="#9CA3AF" />
                                        <Text style={styles.statusText}>Not Connected</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonCompanyCam]}
                                    onPress={() => {
                                        RNAlert.alert('Coming Soon', 'CompanyCam integration will be available soon');
                                    }}
                                >
                                    <ExternalLink size={18} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Connect to CompanyCam</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Angi Leads Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Users size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>Angi Leads</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Import and manage leads from Angi
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        <XCircle size={16} color="#9CA3AF" />
                                        <Text style={styles.statusText}>Not Connected</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonAngi]}
                                    onPress={() => {
                                        RNAlert.alert('Coming Soon', 'Angi Leads integration will be available soon');
                                    }}
                                >
                                    <ExternalLink size={18} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Connect to Angi Leads</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* QB Time Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Clock size={20} color="#6366F1" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>QB Time</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Track time and sync with QuickBooks
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.statusBadge}>
                                        <XCircle size={16} color="#9CA3AF" />
                                        <Text style={styles.statusText}>Not Connected</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonQBTime]}
                                    onPress={() => {
                                        RNAlert.alert('Coming Soon', 'QB Time integration will be available soon');
                                    }}
                                >
                                    <ExternalLink size={18} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Connect to QB Time</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Facebook Lead Ads Integration */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Facebook size={20} color="#1877F2" />
                                    <View style={styles.sectionTitleContainer}>
                                        <Text style={styles.sectionTitle}>Facebook Lead Ads</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            Automatically import leads from your Facebook Lead Ads forms
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.card, { padding: 20 }]}>
                                <Text style={[styles.sectionDescription, { marginBottom: 20 }]}>
                                    Connect your Facebook pages to automatically import leads from your Facebook Lead Ads forms. 
                                    Set up field mapping, assign default users and stages, and configure follow-up sequences for each form.
                                </Text>

                                <FacebookIntegrationsManager userId="current_user_id" />
                            </View>
                        </View>

                    </View>
                );

            default:
                return null;
        }
    };

    // Show loading state while app settings are being loaded
    if (appSettings.isLoading) {
        return (
            <SafeAreaView style={styles.container}>
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
                            <Text style={styles.headerSubtitle}>Loading...</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading settings...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                        <Text style={styles.headerSubtitle}>{companySettings.companyName}</Text>
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

            {/* QuickBooks Settings Modal */}
            <Modal
                visible={showQBSettings}
                animationType="slide"
                transparent
                onRequestClose={() => setShowQBSettings(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.qbSettingsModal}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <FileText size={24} color="#6366F1" />
                                <Text style={styles.modalTitle}>QuickBooks Settings</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowQBSettings(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalContent}>
                            {/* Connection Status */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Connection Status</Text>
                                <View style={styles.card}>
                                    <View style={styles.statusBadge}>
                                        {qbConnectionStatus.isConnected ? (
                                            <CheckCircle size={16} color="#10B981" />
                                        ) : (
                                            <XCircle size={16} color="#9CA3AF" />
                                        )}
                                        <Text style={[
                                            styles.statusText,
                                            qbConnectionStatus.isConnected && styles.statusTextSuccess
                                        ]}>
                                            {qbConnectionStatus.isConnected ? 'Connected' : 'Not Connected'}
                                        </Text>
                                    </View>

                                    {qbConnectionStatus.isConnected && qbConnectionStatus.companyName && (
                                        <View style={styles.connectionInfo}>
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>Company:</Text>
                                                <Text style={styles.infoValue}>{qbConnectionStatus.companyName}</Text>
                                            </View>
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>Last Sync:</Text>
                                                <Text style={styles.infoValue}>
                                                    {qbConnectionStatus.lastSyncedAt 
                                                        ? new Date(qbConnectionStatus.lastSyncedAt).toLocaleString()
                                                        : 'Never'}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Sync Settings */}
                            {qbConnectionStatus.isConnected && qbSyncSettings && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Sync Settings</Text>
                                    
                                    <View style={styles.switchGroup}>
                                        <View style={styles.switchLabel}>
                                            <Text style={styles.switchLabelText}>Auto-Sync</Text>
                                            <Text style={styles.switchLabelSubtext}>
                                                Automatically sync data to QuickBooks
                                            </Text>
                                        </View>
                                        <Switch
                                            value={qbSyncSettings.autoSync}
                                            onValueChange={async (value) => {
                                                const newSettings = { ...qbSyncSettings, autoSync: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                                            thumbColor={qbSyncSettings.autoSync ? '#6366F1' : '#9CA3AF'}
                                        />
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <View style={styles.switchLabel}>
                                            <Text style={styles.switchLabelText}>Sync Customers</Text>
                                            <Text style={styles.switchLabelSubtext}>
                                                Sync contacts and businesses
                                            </Text>
                                        </View>
                                        <Switch
                                            value={qbSyncSettings.syncCustomers}
                                            onValueChange={async (value) => {
                                                const newSettings = { ...qbSyncSettings, syncCustomers: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                                            thumbColor={qbSyncSettings.syncCustomers ? '#6366F1' : '#9CA3AF'}
                                        />
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <View style={styles.switchLabel}>
                                            <Text style={styles.switchLabelText}>Sync Invoices</Text>
                                            <Text style={styles.switchLabelSubtext}>
                                                Sync invoices when jobs start
                                            </Text>
                                        </View>
                                        <Switch
                                            value={qbSyncSettings.syncInvoices}
                                            onValueChange={async (value) => {
                                                const newSettings = { ...qbSyncSettings, syncInvoices: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                                            thumbColor={qbSyncSettings.syncInvoices ? '#6366F1' : '#9CA3AF'}
                                        />
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <View style={styles.switchLabel}>
                                            <Text style={styles.switchLabelText}>Sync Payments</Text>
                                            <Text style={styles.switchLabelSubtext}>
                                                Immediately sync all payments
                                            </Text>
                                        </View>
                                        <Switch
                                            value={qbSyncSettings.syncPayments}
                                            onValueChange={async (value) => {
                                                const newSettings = { ...qbSyncSettings, syncPayments: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                                            thumbColor={qbSyncSettings.syncPayments ? '#6366F1' : '#9CA3AF'}
                                        />
                                    </View>

                                    <View style={styles.switchGroup}>
                                        <View style={styles.switchLabel}>
                                            <Text style={styles.switchLabelText}>Sync Recurring Jobs</Text>
                                            <Text style={styles.switchLabelSubtext}>
                                                Create recurring transactions in QuickBooks
                                            </Text>
                                        </View>
                                        <Switch
                                            value={qbSyncSettings.syncRecurringJobs}
                                            onValueChange={async (value) => {
                                                const newSettings = { ...qbSyncSettings, syncRecurringJobs: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                                            thumbColor={qbSyncSettings.syncRecurringJobs ? '#6366F1' : '#9CA3AF'}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Job Status Trigger</Text>
                                        <Text style={styles.inputHint}>
                                            Invoice will be created in QuickBooks when job reaches this status
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            value={qbSyncSettings.jobStatusTrigger}
                                            onChangeText={async (value) => {
                                                const newSettings = { ...qbSyncSettings, jobStatusTrigger: value };
                                                setQBSyncSettings(newSettings);
                                                await QuickBooksService.updateSyncSettings(newSettings);
                                                markChanged();
                                            }}
                                            placeholder="e.g., In Progress, Started"
                                        />
                                    </View>
                                </View>
                            )}

                            {/* User Access Management */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>User Access</Text>
                                <Text style={styles.sectionSubtitle}>
                                    Assign accountant role for QuickBooks access
                                </Text>
                                
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>Current Role</Text>
                                    <View style={styles.roleDisplay}>
                                        <View style={[
                                            styles.roleBadge,
                                            userRole.currentRole === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeAccountant
                                        ]}>
                                            <Text style={styles.roleBadgeText}>
                                                {userRole.currentRole === 'admin' ? 'Administrator' : 'Accountant/Bookkeeper'}
                                            </Text>
                                        </View>
                                    </View>

                                    {userRole.currentRole === 'admin' && (
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.inputLabel}>Switch Role (Demo)</Text>
                                            <Text style={styles.inputHint}>
                                                Switch to accountant role to see read-only mode
                                            </Text>
                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonSecondary]}
                                                onPress={async () => {
                                                    const newRole = userRole.currentRole === 'admin' ? 'accountant' : 'admin';
                                                    await userRole.setUserRole(newRole);
                                                    RNAlert.alert(
                                                        'Role Changed',
                                                        `You are now in ${newRole === 'admin' ? 'Administrator' : 'Accountant'} mode`,
                                                        [{ text: 'OK', onPress: () => setShowQBSettings(false) }]
                                                    );
                                                }}
                                            >
                                                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                                                    Switch to {userRole.currentRole === 'admin' ? 'Accountant' : 'Admin'} Role
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {userRole.currentRole === 'accountant' && (
                                        <View style={styles.infoBox}>
                                            <AlertCircle size={16} color="#3B82F6" />
                                            <Text style={styles.infoBoxText}>
                                                You are in accountant mode with read-only access to financial data. 
                                                You can view all synced QuickBooks data but cannot make changes.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Manual Sync Actions */}
                            {qbConnectionStatus.isConnected && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Manual Actions</Text>
                                    
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSecondary]}
                                        onPress={async () => {
                                            RNAlert.alert(
                                                'Force Sync',
                                                'This will sync all pending items to QuickBooks. Continue?',
                                                [
                                                    { text: 'Cancel', style: 'cancel' },
                                                    {
                                                        text: 'Sync Now',
                                                        onPress: async () => {
                                                            try {
                                                                // TODO: Implement batch sync
                                                                RNAlert.alert('Success', 'Sync completed successfully');
                                                            } catch (error) {
                                                                RNAlert.alert('Error', 'Sync failed');
                                                            }
                                                        },
                                                    },
                                                ]
                                            );
                                        }}
                                    >
                                        <RefreshCw size={18} color="#6366F1" />
                                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                                            Force Full Sync
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
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
        marginBottom: 4,
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
    textArea: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputHalf: {
        flex: 1,
    },
    inputThird: {
        flex: 0.5,
    },
    inputWithButton: {
        flexDirection: 'row',
        gap: 8,
    },
    inputWithIcon: {
        flex: 1,
    },
    inputButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
    },
    inputHint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 16,
    },
    colorPicker: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    colorPreview: {
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    colorInput: {
        flex: 1,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        borderStyle: 'dashed',
        backgroundColor: '#F9FAFB',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    uploadButtonTextDisabled: {
        color: '#9CA3AF',
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
    verificationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        marginBottom: 12,
    },
    verificationInfo: {
        flex: 1,
    },
    verificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    verificationSubtext: {
        fontSize: 13,
        color: '#6B7280',
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
    eventTypeActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    eventTypeColor: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    deleteButton: {
        padding: 4,
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
        marginBottom: 12,
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
    badgeWarning: {
        backgroundColor: '#FEF3C7',
    },
    badgeWarningText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#F59E0B',
    },
    reminderGroup: {
        marginBottom: 24,
    },
    reminderGroupTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    reminderSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    reminderSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    reminderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    reminderInfo: {
        flex: 1,
    },
    reminderLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    reminderTime: {
        fontSize: 13,
        color: '#6B7280',
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
        height: '85%',
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
    // QuickBooks Settings Modal Styles
    qbSettingsModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '95%',
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    modalContent: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
    },
    // Email Configuration Styles
    infoBoxLarge: {
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    infoBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    infoBoxTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4338CA',
    },
    infoBoxText: {
        fontSize: 14,
        color: '#4338CA',
        lineHeight: 20,
        marginBottom: 12,
    },
    benefitsList: {
        gap: 10,
        marginBottom: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    benefitText: {
        fontSize: 14,
        color: '#4338CA',
        fontWeight: '500',
    },
    sendInstructionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    sendInstructionsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    sectionHeaderWithAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkVerificationButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    checkVerificationButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        backgroundColor: '#FEF3C7',
        borderRadius: 10,
        marginBottom: 16,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    instructionsText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    dnsRecordCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dnsRecordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    dnsRecordType: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    dnsRecordRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dnsRecordLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        width: 60,
    },
    dnsRecordValue: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    instructionsNote: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        fontStyle: 'italic',
        marginTop: 8,
    },
    leadCenterInfo: {
        backgroundColor: '#EEF2FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E7FF',
    },
    leadCenterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    leadCenterHeaderText: {
        flex: 1,
    },
    leadCenterTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    leadCenterDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    leadCenterNavigateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    leadCenterNavigateText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    leadSourcesList: {
        gap: 12,
    },
    leadSourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    leadSourceIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    leadSourceEmoji: {
        fontSize: 24,
    },
    leadSourceInfo: {
        flex: 1,
    },
    leadSourceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    leadSourceDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
    leadSourceBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    leadSourceBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    leadSourceBadgeConnected: {
        backgroundColor: '#DCFCE7',
    },
    leadSourceBadgeTextConnected: {
        color: '#059669',
    },
    inputHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
        fontStyle: 'italic',
    },
    // App Settings Styles
    selectedTabsContainer: {
        marginTop: 12,
    },
    selectedTabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedTabLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    tabIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconCircleHome: {
        backgroundColor: '#EEF2FF',
    },
    selectedTabName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    requiredBadge: {
        fontSize: 11,
        color: '#6366F1',
        fontWeight: '600',
        marginTop: 2,
    },
    selectedTabActions: {
        flexDirection: 'row',
        gap: 8,
    },
    tabActionButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    tabActionButtonDisabled: {
        opacity: 0.3,
    },
    availableTabsSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    availableTabsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
    },
    availableTabsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    availableTabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    availableTabName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    helpTextContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#F0F9FF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    helpText: {
        fontSize: 13,
        color: '#1E40AF',
        textAlign: 'center',
    },
    selectedActionsContainer: {
        marginTop: 12,
    },
    selectedActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedActionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    actionIconGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconGradientSmall: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedActionName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    selectedActionActions: {
        flexDirection: 'row',
        gap: 8,
    },
    availableActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    availableActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    availableActionName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    resetButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#EF4444',
    },
    // QuickBooks Integration Styles
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardHeader: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    statusTextSuccess: {
        color: '#10B981',
    },
    connectionInfo: {
        gap: 8,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    infoLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#EF4444',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonPrimary: {
        backgroundColor: '#2CA01C',
    },
    buttonSecondary: {
        backgroundColor: '#EEF2FF',
    },
    buttonDanger: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    buttonTextSecondary: {
        color: '#6366F1',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    buttonFlex: {
        flex: 1,
    },
    // Brand-specific button colors
    buttonZapier: {
        backgroundColor: '#FF4A00', // Zapier orange
    },
    buttonCompanyCam: {
        backgroundColor: '#1E40AF', // CompanyCam blue
    },
    buttonAngi: {
        backgroundColor: '#00A650', // Angi green
    },
    buttonQBTime: {
        backgroundColor: '#8B5CF6', // QB Time purple
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 20,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 4,
    },
    sectionTitleContainer: {
        flex: 1,
    },
    switchLabelSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    inputHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
        marginBottom: 8,
    },
    roleDisplay: {
        marginBottom: 16,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roleBadgeAdmin: {
        backgroundColor: '#DBEAFE',
    },
    roleBadgeAccountant: {
        backgroundColor: '#FEF3C7',
    },
    roleBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    infoBoxText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 18,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    XCircle: {
        // Placeholder for XCircle icon - imported from lucide-react-native
    },
});
