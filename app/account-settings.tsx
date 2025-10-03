import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    Bell,
    Building2,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    Edit,
    FileText,
    Mail,
    Palette,
    Plus,
    Save,
    Send,
    Settings,
    Trash2,
    Upload,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
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

type SettingsTab = 'company' | 'brand' | 'email' | 'general' | 'events' | 'payments' | 'reminders';

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
    const [hasChanges, setHasChanges] = useState(false);

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
});
