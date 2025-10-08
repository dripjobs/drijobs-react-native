import WebsiteService from '@/services/WebsiteService';
import { BusinessType, Website, WebsiteTemplate, WizardData } from '@/types/website';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle,
    ChevronDown,
    Image as ImageIcon,
    Loader,
    Sparkles,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BUSINESS_TYPES: BusinessType[] = [
  'Painting',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Landscaping',
  'Cleaning',
  'Roofing',
  'Fencing',
  'Handyman',
  'Pest Control',
  'Flooring',
  'Carpentry',
  'Masonry',
  'Pool Services',
  'Other'
];

interface WebsiteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (website: Website) => void;
}

export default function WebsiteWizard({ isOpen, onClose, onComplete }: WebsiteWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    step: 1,
  });
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false);
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  const totalSteps = 6;

  // Load templates when component mounts or when reaching step 4
  useEffect(() => {
    if (isOpen && (currentStep === 4 || templates.length === 0)) {
      loadTemplates();
    }
  }, [isOpen, currentStep]);

  const handleNext = async () => {
    if (currentStep === 3) {
      // Generate AI content
      await generateAIContent();
    } else if (currentStep === 5) {
      // Generate subdomain if not set
      if (!wizardData.subdomain && wizardData.businessInfo?.businessName) {
        const subdomain = WebsiteService.generateSubdomain(wizardData.businessInfo.businessName);
        setWizardData({ ...wizardData, subdomain });
        // Check availability for the generated subdomain
        await checkSubdomain(subdomain);
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setWizardData({ ...wizardData, step: currentStep + 1 });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setWizardData({ ...wizardData, step: currentStep - 1 });
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // Create website
      const newWebsite = await WebsiteService.createWebsite({
        userId: 'user-1', // TODO: Get from auth context
        businessName: wizardData.businessInfo?.businessName || '',
        businessType: wizardData.businessInfo?.businessType || '',
        subdomain: wizardData.subdomain || '',
        templateId: wizardData.selectedTemplateId || '',
        status: 'ready',
        content: {
          ...wizardData.generatedContent,
          businessName: wizardData.businessInfo?.businessName || '',
          contactInfo: {
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            serviceArea: wizardData.businessInfo?.serviceArea || '',
          },
          brandAssets: wizardData.brandAssets || {
            primaryColor: '#6366F1',
            secondaryColor: '#8B5CF6',
            accentColor: '#A855F7',
            images: [],
          },
        } as any,
      });

      onComplete(newWebsite);
      resetWizard();
    } catch (error) {
      console.error('Failed to create website:', error);
      alert('Failed to create website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setWizardData({ step: 1 });
    setTemplates([]);
    setSubdomainAvailable(null);
  };

  const generateAIContent = async () => {
    try {
      setLoading(true);
      const content = await WebsiteService.generateContent(wizardData);
      setWizardData({ ...wizardData, generatedContent: content });
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await WebsiteService.getTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const checkSubdomain = async (subdomain: string) => {
    if (!subdomain) {
      setSubdomainAvailable(null);
      return;
    }

    try {
      setSubdomainChecking(true);
      const result = await WebsiteService.checkSubdomainAvailability(subdomain);
      setSubdomainAvailable(result.available);
    } catch (error) {
      console.error('Failed to check subdomain:', error);
      setSubdomainAvailable(null);
    } finally {
      setSubdomainChecking(false);
    }
  };

  const canProceed = () => {
    const result = (() => {
      switch (currentStep) {
        case 1:
          return (
            wizardData.businessInfo?.businessName &&
            wizardData.businessInfo?.businessType &&
            wizardData.businessInfo?.serviceArea &&
            wizardData.businessInfo?.description
          );
        case 2:
          return wizardData.brandAssets?.primaryColor;
        case 3:
          return (
            wizardData.aiQuestions?.yearsInBusiness &&
            wizardData.aiQuestions?.uniqueValue &&
            wizardData.aiQuestions?.primaryServices &&
            wizardData.aiQuestions.primaryServices.length > 0
          );
        case 4:
          return wizardData.selectedTemplateId;
        case 5:
          return wizardData.subdomain && (subdomainAvailable === true || subdomainAvailable === null);
        case 6:
          return true;
        default:
          return false;
      }
    })();
    
    // Debug logging for step 5
    if (currentStep === 5) {
      console.log('Step 5 validation:', {
        subdomain: wizardData.subdomain,
        subdomainAvailable,
        canProceed: result
      });
    }
    
    return result;
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(currentStep / totalSteps) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Business Information</Text>
        <Text style={styles.stepSubtitle}>
          Tell us about your business to get started
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Cincinnati Painting Co"
          value={wizardData.businessInfo?.businessName || ''}
          onChangeText={(text) =>
            setWizardData({
              ...wizardData,
              businessInfo: { ...wizardData.businessInfo!, businessName: text },
            })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Business Type *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}
        >
          <Text style={styles.dropdownText}>
            {wizardData.businessInfo?.businessType || 'Select business type'}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
        
        {showBusinessTypeDropdown && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {BUSINESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setWizardData({
                      ...wizardData,
                      businessInfo: { ...wizardData.businessInfo!, businessType: type },
                    });
                    setShowBusinessTypeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                  {wizardData.businessInfo?.businessType === type && (
                    <Check size={18} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Service Area *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Cincinnati, OH"
          value={wizardData.businessInfo?.serviceArea || ''}
          onChangeText={(text) =>
            setWizardData({
              ...wizardData,
              businessInfo: { ...wizardData.businessInfo!, serviceArea: text },
            })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Business Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Brief description of your business..."
          multiline
          numberOfLines={4}
          value={wizardData.businessInfo?.description || ''}
          onChangeText={(text) =>
            setWizardData({
              ...wizardData,
              businessInfo: { ...wizardData.businessInfo!, description: text },
            })
          }
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Brand Assets</Text>
        <Text style={styles.stepSubtitle}>
          Upload your logo and choose brand colors
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Logo (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <ImageIcon size={32} color="#9CA3AF" />
          <Text style={styles.uploadText}>Upload Logo</Text>
          <Text style={styles.uploadHint}>PNG, JPG up to 5MB</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary Color *</Text>
        <View style={styles.colorPicker}>
          {['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                wizardData.brandAssets?.primaryColor === color && styles.colorOptionSelected,
              ]}
              onPress={() =>
                setWizardData({
                  ...wizardData,
                  brandAssets: {
                    ...wizardData.brandAssets!,
                    primaryColor: color,
                    secondaryColor: wizardData.brandAssets?.secondaryColor || color,
                    accentColor: wizardData.brandAssets?.accentColor || color,
                    images: wizardData.brandAssets?.images || [],
                  },
                })
              }
            >
              {wizardData.brandAssets?.primaryColor === color && (
                <Check size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Business Photos (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <ImageIcon size={32} color="#9CA3AF" />
          <Text style={styles.uploadText}>Upload Photos</Text>
          <Text style={styles.uploadHint}>Add photos of your work</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Sparkles size={32} color="#6366F1" style={styles.stepIcon} />
        <Text style={styles.stepTitle}>AI Content Generation</Text>
        <Text style={styles.stepSubtitle}>
          Answer a few questions so AI can create amazing content for you
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Generating content with AI...</Text>
          <Text style={styles.loadingSubtext}>This will take about 10-15 seconds</Text>
        </View>
      ) : wizardData.generatedContent ? (
        <View style={styles.successState}>
          <View style={styles.successIcon}>
            <CheckCircle size={48} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Content Generated!</Text>
          <Text style={styles.successSubtitle}>
            AI has created SEO-optimized content for your website
          </Text>
          
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Hero Headline:</Text>
            <Text style={styles.previewText}>{wizardData.generatedContent.heroHeadline}</Text>
          </View>
          
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Services ({wizardData.generatedContent.services?.length}):</Text>
            {wizardData.generatedContent.services?.slice(0, 3).map((service, index) => (
              <Text key={index} style={styles.previewText}>• {service.title}</Text>
            ))}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>How many years have you been in business? *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 15 years"
              value={wizardData.aiQuestions?.yearsInBusiness || ''}
              onChangeText={(text) =>
                setWizardData({
                  ...wizardData,
                  aiQuestions: { ...wizardData.aiQuestions!, yearsInBusiness: text },
                })
              }
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>What makes your business unique? *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Family-owned, eco-friendly products, 24/7 service..."
              multiline
              numberOfLines={3}
              value={wizardData.aiQuestions?.uniqueValue || ''}
              onChangeText={(text) =>
                setWizardData({
                  ...wizardData,
                  aiQuestions: { ...wizardData.aiQuestions!, uniqueValue: text },
                })
              }
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Primary Services (3-5) *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter each service on a new line..."
              multiline
              numberOfLines={4}
              value={wizardData.aiQuestions?.primaryServices?.join('\n') || ''}
              onChangeText={(text) =>
                setWizardData({
                  ...wizardData,
                  aiQuestions: {
                    ...wizardData.aiQuestions!,
                    primaryServices: text.split('\n').filter(s => s.trim()),
                  },
                })
              }
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Customer Type (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Homeowners, commercial clients..."
              value={wizardData.aiQuestions?.targetCustomer || ''}
              onChangeText={(text) =>
                setWizardData({
                  ...wizardData,
                  aiQuestions: { ...wizardData.aiQuestions!, targetCustomer: text },
                })
              }
            />
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Choose Your Template</Text>
        <Text style={styles.stepSubtitle}>
          Select a design that fits your business style
        </Text>
      </View>

      {templates.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      ) : (
        <View style={styles.templatesGrid}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateCard,
                wizardData.selectedTemplateId === template.id && styles.templateCardSelected,
              ]}
              onPress={() => setWizardData({ ...wizardData, selectedTemplateId: template.id })}
            >
            <View style={styles.templatePreview}>
              <ImageIcon size={32} color="#9CA3AF" />
              <Text style={styles.templatePreviewText}>{template.name}</Text>
            </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription} numberOfLines={2}>
                  {template.description}
                </Text>
              </View>
              {wizardData.selectedTemplateId === template.id && (
                <View style={styles.selectedBadge}>
                  <CheckCircle size={20} color="#10B981" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderStep5 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Domain Setup</Text>
        <Text style={styles.stepSubtitle}>
          Choose your website address
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Subdomain *</Text>
        <View style={styles.subdomainInput}>
          <TextInput
            style={styles.subdomainTextInput}
            placeholder="your-business"
            value={wizardData.subdomain || ''}
            onChangeText={(text) => {
              const sanitized = text.toLowerCase().replace(/[^a-z0-9-]/g, '');
              setWizardData({ ...wizardData, subdomain: sanitized });
              setSubdomainAvailable(null);
            }}
            onBlur={() => wizardData.subdomain && checkSubdomain(wizardData.subdomain)}
            autoCapitalize="none"
          />
          <Text style={styles.subdomainSuffix}>.dripjobs.io</Text>
        </View>
        
        {subdomainChecking && (
          <View style={styles.subdomainStatus}>
            <ActivityIndicator size="small" color="#6366F1" />
            <Text style={styles.subdomainStatusText}>Checking availability...</Text>
          </View>
        )}
        
        {!subdomainChecking && subdomainAvailable === true && (
          <View style={[styles.subdomainStatus, styles.subdomainAvailableStatus]}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={[styles.subdomainStatusText, { color: '#10B981' }]}>
              Available!
            </Text>
          </View>
        )}
        
        {!subdomainChecking && subdomainAvailable === false && (
          <View style={[styles.subdomainStatus, styles.subdomainUnavailableStatus]}>
            <X size={16} color="#EF4444" />
            <Text style={[styles.subdomainStatusText, { color: '#EF4444' }]}>
              Not available. Try another.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.domainPreview}>
        <Text style={styles.domainPreviewLabel}>Your website will be:</Text>
        <Text style={styles.domainPreviewUrl}>
          https://{wizardData.subdomain || 'your-business'}.dripjobs.io
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>Custom Domain</Text>
        <Text style={styles.infoBoxText}>
          You can add your own custom domain (e.g., www.yourbusiness.com) after your website is live.
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep6 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <CheckCircle size={48} color="#10B981" style={styles.stepIcon} />
        <Text style={styles.stepTitle}>Review & Publish</Text>
        <Text style={styles.stepSubtitle}>
          Everything looks great! Ready to make your website live?
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Business Name</Text>
        <Text style={styles.reviewValue}>{wizardData.businessInfo?.businessName}</Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Business Type</Text>
        <Text style={styles.reviewValue}>{wizardData.businessInfo?.businessType}</Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Service Area</Text>
        <Text style={styles.reviewValue}>{wizardData.businessInfo?.serviceArea}</Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Website Address</Text>
        <Text style={styles.reviewValueUrl}>
          {wizardData.subdomain}.dripjobs.io
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Template</Text>
        <Text style={styles.reviewValue}>
          {templates.find(t => t.id === wizardData.selectedTemplateId)?.name}
        </Text>
      </View>

      <View style={styles.publishInfo}>
        <Loader size={20} color="#6366F1" />
        <Text style={styles.publishInfoText}>
          Your website will be live in less than 30 seconds
        </Text>
      </View>
    </ScrollView>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.background}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Website</Text>
            <View style={styles.headerSpacer} />
          </View>

          {renderProgressBar()}
          
          <View style={styles.content}>
            {renderStepContent()}
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                disabled={loading}
              >
                <ArrowLeft size={20} color="#6366F1" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <View style={{ flex: 1 }} />
            
            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
                onPress={handleNext}
                disabled={!canProceed() || loading}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === 3 && !wizardData.generatedContent ? 'Generate Content' : 'Continue'}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.publishButton, loading && styles.publishButtonDisabled]}
                onPress={handleComplete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.publishButtonText}>Make Website Live</Text>
                    <CheckCircle size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepIcon: {
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  successState: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  templatesGrid: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  templateCardSelected: {
    borderColor: '#6366F1',
  },
  templatePreview: {
    height: 120,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templatePreviewText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  templateInfo: {
    padding: 16,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
  },
  subdomainInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  subdomainTextInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  subdomainSuffix: {
    paddingRight: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  subdomainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subdomainStatusText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  subdomainAvailableStatus: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subdomainUnavailableStatus: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  domainPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  domainPreviewLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  domainPreviewUrl: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  reviewValueUrl: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366F1',
  },
  publishInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  publishInfoText: {
    fontSize: 14,
    color: '#6366F1',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366F1',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  publishButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
