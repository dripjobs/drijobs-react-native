import { LinearGradient } from 'expo-linear-gradient';
import {
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Home,
    Info,
    Plus,
    Square,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AreaSubstrate {
  substrate: string;
  clientLabel: string;
  quantity: number;
  coats: number;
  product: string;
  unitPrice: number;
  coverage: number;
  prepHrs: number;
  spreadRate: number;
  laborRate: number;
}

interface AreaElement {
  id: string;
  name: string;
  clientLabel: string;
  type: 'Area' | 'Wall' | 'Surface';
  measurements: {
    length: number;
    height: number;
    width: number;
    squareFt: number;
    wallSpace: number;
    linearFootage: number;
    prepHrs: number;
  };
  categories: string[];
  substrates: Record<string, AreaSubstrate>;
  isOptional: boolean;
  crewNotes: string;
  clientNotes: string;
}

interface AddAreaWizardProps {
  visible: boolean;
  onClose: () => void;
  onAddArea: (area: AreaElement) => void;
}

type Step = 'element-type' | 'area-selection' | 'element-details' | 'categories' | 'substrates' | 'summary';

const interiorAreas = [
  'Living Room', 'Dining Room', 'Kitchen', 'Foyer', 'Laundry Room', 'Bedroom',
  'Bathroom', 'Hallway', 'Staircase', 'Basement', 'Attic', 'Garage', 'Office',
  'Family Room', 'Mudroom', 'Pantry', 'Custom'
];

const exteriorAreas = [
  'Siding', 'Trim', 'Doors', 'Windows', 'Deck', 'Porch',
  'Fence', 'Driveway', 'Walkway', 'Roof', 'Gutters',
  'Shutters', 'Shingles', 'Custom'
];

const categories = [
  'Walls', 'Ceilings', 'Trim', 'Doors', 'Windows', 'Floors',
  'Stairs', 'Cabinets', 'Countertops', 'Fixtures'
];

const substratesByCategory: Record<string, string[]> = {
  'Walls': ['Drywall', 'Plaster', 'Brick', 'Concrete', 'Stucco', 'Stone', 'Tile', 'Fiber Cement'],
  'Ceilings': ['Drywall', 'Plaster', 'Popcorn', 'Textured', 'Wood Paneling', 'Metal Tiles'],
  'Trim': ['Wood', 'MDF', 'PVC', 'Composite', 'Metal'],
  'Doors': ['French Door', '6-Panel Door', 'Metal Door', 'Sliding Door', 'Pocket Door', 'Bifold Door', 'Barn Door'],
  'Windows': ['Single Hung', 'Double Hung', 'Casement', 'Awning', 'Sliding', 'Picture Window', 'Bay Window'],
  'Floors': ['Hardwood', 'Laminate', 'Tile', 'Carpet', 'Vinyl', 'Concrete', 'Stone'],
  'Stairs': ['Wood', 'Metal', 'Carpet', 'Tile', 'Concrete'],
  'Cabinets': ['Wood', 'MDF', 'Particle Board', 'Metal', 'Laminate'],
  'Countertops': ['Granite', 'Quartz', 'Laminate', 'Butcher Block', 'Concrete', 'Tile'],
  'Fixtures': ['Metal', 'Plastic', 'Ceramic', 'Glass', 'Wood']
};

const spreadRates: Record<string, {
  baseRate: number;
  unit: 'sqft/hr' | 'hrs/item';
  defaultProduct: string;
  defaultPrice: number;
  defaultCoverage: number;
}> = {
  'Drywall': { baseRate: 50, unit: 'sqft/hr', defaultProduct: 'Promar 200 Flat', defaultPrice: 28.50, defaultCoverage: 400 },
  'Plaster': { baseRate: 40, unit: 'sqft/hr', defaultProduct: 'Promar 200 Flat', defaultPrice: 28.50, defaultCoverage: 400 },
  'Wood': { baseRate: 60, unit: 'sqft/hr', defaultProduct: 'Pro Classic Semi-Gloss', defaultPrice: 32.22, defaultCoverage: 350 },
  'MDF': { baseRate: 55, unit: 'sqft/hr', defaultProduct: 'Pro Classic Semi-Gloss', defaultPrice: 32.22, defaultCoverage: 350 },
  // Add more as needed
};

const paintProducts = [
  { name: 'Promar 200 Flat', price: 28.50, coverage: 400, type: 'Interior' },
  { name: 'Promar 200 Eggshell', price: 29.50, coverage: 400, type: 'Interior' },
  { name: 'Pro Classic Semi-Gloss', price: 34.22, coverage: 350, type: 'Interior' },
  { name: 'Sherwin Williams Duration', price: 45.00, coverage: 350, type: 'Interior' },
];

export const AddAreaWizard: React.FC<AddAreaWizardProps> = ({
  visible,
  onClose,
  onAddArea
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('element-type');
  const [elementType, setElementType] = useState<'interior' | 'exterior' | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaDetails, setAreaDetails] = useState<Record<string, any>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({});
  const [areaSubstrates, setAreaSubstrates] = useState<Record<string, Record<string, AreaSubstrate>>>({});
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const stepScrollViewRef = React.useRef<ScrollView>(null);

  const steps: { key: Step; label: string }[] = [
    { key: 'element-type', label: 'Type' },
    { key: 'area-selection', label: 'Areas' },
    { key: 'element-details', label: 'Details' },
    { key: 'categories', label: 'Categories' },
    { key: 'substrates', label: 'Substrates' },
    { key: 'summary', label: 'Summary' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  // Auto-scroll step indicator when step changes
  React.useEffect(() => {
    if (currentStepIndex >= 3 && stepScrollViewRef.current) {
      // Scroll to center the current step when past step 3
      const scrollX = (currentStepIndex - 2) * 110; // 70px step + 40px connector
      stepScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
    } else if (currentStepIndex < 3 && stepScrollViewRef.current) {
      // Scroll back to start for early steps
      stepScrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [currentStepIndex]);

  const resetForm = () => {
    setCurrentStep('element-type');
    setElementType(null);
    setSelectedAreas([]);
    setAreaDetails({});
    setSelectedCategories({});
    setAreaSubstrates({});
    setCurrentAreaIndex(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const handleAddArea = () => {
    selectedAreas.forEach((areaName, index) => {
      const details = areaDetails[areaName];
      if (!details) return;

      const area: AreaElement = {
        id: `area-${Date.now()}-${index}`,
        name: details.name,
        clientLabel: details.clientLabel,
        type: details.type,
        measurements: details.measurements,
        categories: selectedCategories[areaName] || [],
        substrates: areaSubstrates[areaName] || {},
        isOptional: details.isOptional,
        crewNotes: details.crewNotes,
        clientNotes: details.clientNotes
      };

      onAddArea(area);
    });

    handleClose();
  };

  const isStepValid = (step: Step): boolean => {
    switch (step) {
      case 'element-type':
        return elementType !== null;
      case 'area-selection':
        return selectedAreas.length > 0;
      case 'element-details':
        return selectedAreas.every(area => {
          const details = areaDetails[area];
          return details && details.name.trim() !== '' && details.measurements.length >= 0;
        });
      case 'categories':
        return Object.keys(selectedCategories).length > 0;
      case 'substrates':
        return true; // Optional step
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Add Areas</Text>
              <Text style={styles.headerSubtitle}>
                Step {currentStepIndex + 1} of {steps.length}
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Step Indicator */}
          <View style={styles.stepIndicatorWrapper}>
            <ScrollView
              ref={stepScrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.stepIndicator}
              contentContainerStyle={styles.stepIndicatorContent}
            >
              {steps.map((step, index) => (
                <View key={step.key} style={styles.stepItemWrapper}>
                  <View style={styles.stepItem}>
                    <View style={[
                      styles.stepCircle,
                      index < currentStepIndex && styles.stepCircleCompleted,
                      index === currentStepIndex && styles.stepCircleCurrent,
                      index > currentStepIndex && styles.stepCircleUpcoming
                    ]}>
                      {index < currentStepIndex ? (
                        <CheckCircle size={20} color="#6366F1" strokeWidth={3} />
                      ) : (
                        <Text style={[
                          styles.stepNumber,
                          index < currentStepIndex && styles.stepNumberCompleted,
                          index === currentStepIndex && styles.stepNumberCurrent,
                          index > currentStepIndex && styles.stepNumberUpcoming
                        ]}>
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <Text style={[
                      styles.stepLabel,
                      index < currentStepIndex && styles.stepLabelCompleted,
                      index === currentStepIndex && styles.stepLabelCurrent,
                      index > currentStepIndex && styles.stepLabelUpcoming
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <View style={styles.stepConnectorContainer}>
                      <View style={[
                        styles.stepConnector,
                        index < currentStepIndex && styles.stepConnectorCompleted
                      ]} />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 'element-type' && (
            <ElementTypeStep
              selectedType={elementType}
              onSelectType={setElementType}
            />
          )}

          {currentStep === 'area-selection' && (
            <AreaSelectionStep
              elementType={elementType}
              selectedAreas={selectedAreas}
              onSelectAreas={setSelectedAreas}
            />
          )}

          {currentStep === 'element-details' && (
            <ElementDetailsStep
              selectedAreas={selectedAreas}
              areaDetails={areaDetails}
              onAreaDetailsChange={setAreaDetails}
              currentAreaIndex={currentAreaIndex}
              onCurrentAreaIndexChange={setCurrentAreaIndex}
            />
          )}

          {currentStep === 'categories' && (
            <CategoriesStep
              selectedAreas={selectedAreas}
              selectedCategories={selectedCategories}
              onSelectCategories={setSelectedCategories}
            />
          )}

          {currentStep === 'substrates' && (
            <SubstratesStep
              selectedAreas={selectedAreas}
              selectedCategories={selectedCategories}
              areaDetails={areaDetails}
              areaSubstrates={areaSubstrates}
              onAreaSubstratesChange={setAreaSubstrates}
            />
          )}

          {currentStep === 'summary' && (
            <SummaryStep
              selectedAreas={selectedAreas}
              areaDetails={areaDetails}
              selectedCategories={selectedCategories}
              areaSubstrates={areaSubstrates}
            />
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.footerButtonSecondary, currentStepIndex === 0 && styles.footerButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft size={20} color={currentStepIndex === 0 ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.footerButtonText, currentStepIndex === 0 && styles.footerButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>

          {currentStep === 'summary' ? (
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonPrimary]}
              onPress={handleAddArea}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.footerButtonTextPrimary}>Add Areas</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonPrimary, !canProceed && styles.footerButtonDisabled]}
              onPress={handleNext}
              disabled={!canProceed}
            >
              <Text style={styles.footerButtonTextPrimary}>Next</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Step Components
const ElementTypeStep: React.FC<{
  selectedType: 'interior' | 'exterior' | null;
  onSelectType: (type: 'interior' | 'exterior') => void;
}> = ({ selectedType, onSelectType }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Element Type</Text>
      <Text style={styles.stepDescription}>
        Choose whether this is an interior or exterior element
      </Text>

      <View style={styles.typeGrid}>
        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedType === 'interior' && styles.typeCardActive
          ]}
          onPress={() => onSelectType('interior')}
        >
          <Home size={32} color={selectedType === 'interior' ? '#6366F1' : '#6B7280'} />
          <Text style={[styles.typeCardTitle, selectedType === 'interior' && styles.typeCardTitleActive]}>
            Interior
          </Text>
          <Text style={styles.typeCardDescription}>
            Indoor spaces like rooms, hallways, etc.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedType === 'exterior' && styles.typeCardActive
          ]}
          onPress={() => onSelectType('exterior')}
        >
          <Building2 size={32} color={selectedType === 'exterior' ? '#10B981' : '#6B7280'} />
          <Text style={[styles.typeCardTitle, selectedType === 'exterior' && styles.typeCardTitleActive]}>
            Exterior
          </Text>
          <Text style={styles.typeCardDescription}>
            Outdoor surfaces like siding, trim, etc.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AreaSelectionStep: React.FC<{
  elementType: 'interior' | 'exterior' | null;
  selectedAreas: string[];
  onSelectAreas: (areas: string[]) => void;
}> = ({ elementType, selectedAreas, onSelectAreas }) => {
  const areas = elementType === 'interior' ? interiorAreas : exteriorAreas;

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      onSelectAreas(selectedAreas.filter(a => a !== area));
    } else {
      onSelectAreas([...selectedAreas, area]);
    }
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Areas</Text>
      <Text style={styles.stepDescription}>
        Choose the areas you want to configure
      </Text>

      {selectedAreas.length > 0 && (
        <View style={styles.selectedBadgeContainer}>
          <Text style={styles.selectedBadgeText}>
            {selectedAreas.length} area{selectedAreas.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      <View style={styles.areaGrid}>
        {areas.map(area => {
          const isSelected = selectedAreas.includes(area);
          return (
            <TouchableOpacity
              key={area}
              style={[styles.areaCard, isSelected && styles.areaCardActive]}
              onPress={() => handleAreaToggle(area)}
            >
              {isSelected ? (
                <CheckCircle size={16} color="#6366F1" />
              ) : (
                <Square size={16} color="#9CA3AF" />
              )}
              <Text style={[styles.areaCardText, isSelected && styles.areaCardTextActive]}>
                {area}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const ElementDetailsStep: React.FC<{
  selectedAreas: string[];
  areaDetails: Record<string, any>;
  onAreaDetailsChange: (details: Record<string, any>) => void;
  currentAreaIndex: number;
  onCurrentAreaIndexChange: (index: number) => void;
}> = ({ selectedAreas, areaDetails, onAreaDetailsChange, currentAreaIndex, onCurrentAreaIndexChange }) => {
  const currentArea = selectedAreas[currentAreaIndex];
  const currentDetails = areaDetails[currentArea] || {
    name: currentArea,
    clientLabel: currentArea,
    type: 'Area' as const,
    measurements: { length: 0, height: 0, width: 0, squareFt: 0, wallSpace: 0, linearFootage: 0, prepHrs: 0 },
    crewNotes: '',
    clientNotes: '',
    isOptional: false
  };

  const updateDetails = (field: string, value: any) => {
    onAreaDetailsChange({
      ...areaDetails,
      [currentArea]: { ...currentDetails, [field]: value }
    });
  };

  const updateMeasurements = (field: string, value: number) => {
    const newMeasurements = { ...currentDetails.measurements, [field]: value };

    if (field === 'length' || field === 'width' || field === 'height') {
      const length = field === 'length' ? value : currentDetails.measurements.length;
      const width = field === 'width' ? value : currentDetails.measurements.width;
      const height = field === 'height' ? value : currentDetails.measurements.height;

      if (length && width) {
        newMeasurements.squareFt = length * width;
      }
      if (length && width && height) {
        newMeasurements.wallSpace = 2 * (length + width) * height;
      }
      if (length && width) {
        newMeasurements.linearFootage = 2 * (length + width);
      }
    }

    updateDetails('measurements', newMeasurements);
  };

  return (
    <View style={styles.stepContent}>
      <View style={styles.areaNavigation}>
        <Text style={styles.stepTitle}>Element Details</Text>
        <View style={styles.areaNavigationControls}>
          <Text style={styles.areaNavigationText}>
            {currentAreaIndex + 1} of {selectedAreas.length}
          </Text>
          <View style={styles.areaNavigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, currentAreaIndex === 0 && styles.navButtonDisabled]}
              onPress={() => onCurrentAreaIndexChange(Math.max(0, currentAreaIndex - 1))}
              disabled={currentAreaIndex === 0}
            >
              <ChevronLeft size={20} color={currentAreaIndex === 0 ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, currentAreaIndex === selectedAreas.length - 1 && styles.navButtonDisabled]}
              onPress={() => onCurrentAreaIndexChange(Math.min(selectedAreas.length - 1, currentAreaIndex + 1))}
              disabled={currentAreaIndex === selectedAreas.length - 1}
            >
              <ChevronRight size={20} color={currentAreaIndex === selectedAreas.length - 1 ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsCardTitle}>Area: {currentArea}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Area Name</Text>
          <TextInput
            style={styles.input}
            value={currentDetails.name}
            onChangeText={(text) => updateDetails('name', text)}
            placeholder="e.g., Living Room"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Client Label</Text>
          <TextInput
            style={styles.input}
            value={currentDetails.clientLabel}
            onChangeText={(text) => updateDetails('clientLabel', text)}
            placeholder="e.g., Living Room"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Element Type</Text>
          <View style={styles.radioGroup}>
            {(['Area', 'Wall', 'Surface'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={styles.radioOption}
                onPress={() => updateDetails('type', type)}
              >
                <View style={styles.radioCircle}>
                  {currentDetails.type === type && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioLabel}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.measurementsGrid}>
          <View style={styles.measurementInput}>
            <Text style={styles.inputLabel}>Length (ft)</Text>
            <TextInput
              style={styles.input}
              value={currentDetails.measurements.length?.toString() || ''}
              onChangeText={(text) => updateMeasurements('length', parseFloat(text) || 0)}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.measurementInput}>
            <Text style={styles.inputLabel}>Width (ft)</Text>
            <TextInput
              style={styles.input}
              value={currentDetails.measurements.width?.toString() || ''}
              onChangeText={(text) => updateMeasurements('width', parseFloat(text) || 0)}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.measurementInput}>
            <Text style={styles.inputLabel}>Height (ft)</Text>
            <TextInput
              style={styles.input}
              value={currentDetails.measurements.height?.toString() || ''}
              onChangeText={(text) => updateMeasurements('height', parseFloat(text) || 0)}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.measurementInput}>
            <Text style={styles.inputLabel}>Prep (hrs)</Text>
            <TextInput
              style={styles.input}
              value={currentDetails.measurements.prepHrs?.toString() || ''}
              onChangeText={(text) => updateMeasurements('prepHrs', parseFloat(text) || 0)}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {(currentDetails.measurements.squareFt > 0 || currentDetails.measurements.wallSpace > 0) && (
          <View style={styles.calculatedMeasurements}>
            <Text style={styles.calculatedTitle}>Calculated Measurements:</Text>
            {currentDetails.measurements.squareFt > 0 && (
              <Text style={styles.calculatedText}>
                Square Footage: {currentDetails.measurements.squareFt.toFixed(2)} sq ft
              </Text>
            )}
            {currentDetails.measurements.wallSpace > 0 && (
              <Text style={styles.calculatedText}>
                Wall Space: {currentDetails.measurements.wallSpace.toFixed(2)} sq ft
              </Text>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Client Note</Text>
          <TextInput
            style={styles.textArea}
            value={currentDetails.clientNotes}
            onChangeText={(text) => updateDetails('clientNotes', text)}
            placeholder="Notes visible to the client..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {300 - currentDetails.clientNotes.length} characters remaining
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Crew Note</Text>
          <TextInput
            style={styles.textArea}
            value={currentDetails.crewNotes}
            onChangeText={(text) => updateDetails('crewNotes', text)}
            placeholder="Notes for the work order..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            maxLength={300}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => updateDetails('isOptional', !currentDetails.isOptional)}
        >
          <View style={styles.checkbox}>
            {currentDetails.isOptional && <CheckCircle size={20} color="#6366F1" />}
            {!currentDetails.isOptional && <Square size={20} color="#9CA3AF" />}
          </View>
          <Text style={styles.checkboxLabel}>Optional Area</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CategoriesStep: React.FC<{
  selectedAreas: string[];
  selectedCategories: Record<string, string[]>;
  onSelectCategories: (categories: Record<string, string[]>) => void;
}> = ({ selectedAreas, selectedCategories, onSelectCategories }) => {
  const handleCategoryToggle = (area: string, category: string) => {
    const areaCategories = selectedCategories[area] || [];
    const newCategories = areaCategories.includes(category)
      ? areaCategories.filter(c => c !== category)
      : [...areaCategories, category];

    onSelectCategories({
      ...selectedCategories,
      [area]: newCategories
    });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Categories</Text>
      <Text style={styles.stepDescription}>
        Choose surface categories for each area
      </Text>

      {selectedAreas.map(area => (
        <View key={area} style={styles.categoryAreaCard}>
          <Text style={styles.categoryAreaTitle}>{area}</Text>
          <View style={styles.categoryGrid}>
            {categories.map(category => {
              const isSelected = (selectedCategories[area] || []).includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                  onPress={() => handleCategoryToggle(area, category)}
                >
                  {isSelected ? (
                    <CheckCircle size={14} color="#10B981" />
                  ) : (
                    <Square size={14} color="#9CA3AF" />
                  )}
                  <Text style={[styles.categoryCardText, isSelected && styles.categoryCardTextActive]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const SubstratesStep: React.FC<{
  selectedAreas: string[];
  selectedCategories: Record<string, string[]>;
  areaDetails: Record<string, any>;
  areaSubstrates: Record<string, Record<string, AreaSubstrate>>;
  onAreaSubstratesChange: (substrates: Record<string, Record<string, AreaSubstrate>>) => void;
}> = ({ selectedAreas, selectedCategories, areaDetails, areaSubstrates, onAreaSubstratesChange }) => {
  const [selectedArea, setSelectedArea] = useState(selectedAreas[0] || '');
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'product' | 'crew' | 'client'>('product');

  // Auto-populate substrates based on categories
  React.useEffect(() => {
    const newAreaSubstrates = { ...areaSubstrates };
    let hasChanges = false;

    selectedAreas.forEach(area => {
      const areaCategories = selectedCategories[area] || [];
      const currentAreaSubstrates = newAreaSubstrates[area] || {};
      const measurements = areaDetails[area]?.measurements || {};

      areaCategories.forEach(category => {
        const categorySubstrates = substratesByCategory[category] || [];
        
        let selectedSubstrate = null;
        for (const substrate of categorySubstrates) {
          if (!currentAreaSubstrates[substrate]) {
            selectedSubstrate = substrate;
            break;
          }
        }

        if (selectedSubstrate) {
          const spreadRate = spreadRates[selectedSubstrate];
          if (spreadRate) {
            const quantity = spreadRate.unit === 'hrs/item' ? 1 : (measurements.squareFt || measurements.wallSpace || 0);

            const newSubstrate: AreaSubstrate = {
              substrate: selectedSubstrate,
              clientLabel: selectedSubstrate,
              quantity,
              coats: 2,
              product: spreadRate.defaultProduct,
              unitPrice: spreadRate.defaultPrice,
              coverage: spreadRate.defaultCoverage,
              prepHrs: 0,
              spreadRate: spreadRate.baseRate,
              laborRate: 80
            };

            if (!newAreaSubstrates[area]) {
              newAreaSubstrates[area] = {};
            }

            newAreaSubstrates[area][selectedSubstrate] = newSubstrate;
            hasChanges = true;
          }
        }
      });
    });

    if (hasChanges) {
      onAreaSubstratesChange(newAreaSubstrates);
    }
  }, [selectedCategories, selectedAreas, areaDetails]);

  const currentAreaSubstrates = areaSubstrates[selectedArea] || {};
  const currentSubstrateData = selectedSubstrate ? currentAreaSubstrates[selectedSubstrate] : null;

  const updateSubstrate = (field: keyof AreaSubstrate, value: any) => {
    if (!selectedSubstrate || !currentSubstrateData) return;

    onAreaSubstratesChange({
      ...areaSubstrates,
      [selectedArea]: {
        ...currentAreaSubstrates,
        [selectedSubstrate]: { ...currentSubstrateData, [field]: value }
      }
    });
  };

  const getMeasurementDisplay = () => {
    const measurements = areaDetails[selectedArea]?.measurements;
    if (!measurements) return '';
    
    if (measurements.squareFt > 0) return `${measurements.squareFt.toFixed(0)} sqft`;
    if (measurements.wallSpace > 0) return `${measurements.wallSpace.toFixed(0)} sqft`;
    return '';
  };

  return (
    <View style={styles.stepContent}>
      <View style={styles.substratesHeader}>
        <View>
          <Text style={styles.stepTitle}>Substrates</Text>
          <Text style={styles.stepDescription}>Configure substrates for each area</Text>
        </View>
        
        {/* Area Picker */}
        <View style={styles.areaPicker}>
          <Text style={styles.areaPickerLabel}>Area:</Text>
          <View style={styles.areaPickerButton}>
            <Text style={styles.areaPickerText}>{selectedArea}</Text>
          </View>
        </View>
      </View>

      {/* Two Column Layout */}
      <View style={styles.substrateColumns}>
        {/* Left Column - Substrate List */}
        <View style={styles.substrateLeftColumn}>
          <View style={styles.substrateListHeader}>
            <Text style={styles.substrateListTitle}>{selectedArea}</Text>
            <Text style={styles.substrateListMeasurement}>{getMeasurementDisplay()}</Text>
          </View>

          <ScrollView style={styles.substrateList}>
            {Object.entries(currentAreaSubstrates).map(([substrateKey, substrate]) => (
              <TouchableOpacity
                key={substrateKey}
                style={[
                  styles.substrateListItem,
                  selectedSubstrate === substrateKey && styles.substrateListItemActive
                ]}
                onPress={() => setSelectedSubstrate(substrateKey)}
              >
                <View style={styles.substrateListItemContent}>
                  <Text style={styles.substrateListItemName}>{substrate.substrate}</Text>
                  <Text style={styles.substrateListItemCategory}>
                    {Object.entries(substratesByCategory).find(([cat, subs]) =>
                      subs.includes(substrate.substrate)
                    )?.[0] || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.substrateListItemDetails}>
                  <Text style={styles.substrateListItemQuantity}>
                    {substrate.quantity} {spreadRates[substrate.substrate]?.unit === 'hrs/item' ? 'x' : 'sqft'}
                  </Text>
                  <Text style={styles.substrateListItemRate}>
                    {substrate.spreadRate} {spreadRates[substrate.substrate]?.unit || 'sqft/hr'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {Object.keys(currentAreaSubstrates).length === 0 && (
            <View style={styles.emptySubstrateList}>
              <Package size={40} color="#9CA3AF" />
              <Text style={styles.emptySubstrateListText}>
                Select categories to add substrates
              </Text>
            </View>
          )}
        </View>

        {/* Right Column - Substrate Details */}
        <ScrollView style={styles.substrateRightColumn}>
          {currentSubstrateData ? (
            <View style={styles.substrateDetails}>
              <View style={styles.substrateDetailsHeader}>
                <Text style={styles.substrateDetailsTitle}>{currentSubstrateData.substrate}</Text>
                <Text style={styles.substrateDetailsCategory}>
                  {Object.entries(substratesByCategory).find(([cat, subs]) =>
                    subs.includes(currentSubstrateData.substrate)
                  )?.[0] || 'Unknown'}
                </Text>
              </View>

              {/* Configuration Inputs */}
              <View style={styles.substrateConfig}>
                <View style={styles.substrateConfigRow}>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Substrate</Text>
                    <TextInput
                      style={styles.input}
                      value={currentSubstrateData.substrate}
                      onChangeText={(text) => updateSubstrate('substrate', text)}
                    />
                  </View>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Client Label</Text>
                    <TextInput
                      style={styles.input}
                      value={currentSubstrateData.clientLabel}
                      onChangeText={(text) => updateSubstrate('clientLabel', text)}
                    />
                  </View>
                </View>

                <View style={styles.substrateConfigRow}>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Prep (hrs)</Text>
                    <TextInput
                      style={styles.input}
                      value={currentSubstrateData.prepHrs?.toString() || '0'}
                      onChangeText={(text) => updateSubstrate('prepHrs', parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Spreadrate</Text>
                    <TextInput
                      style={styles.input}
                      value={currentSubstrateData.spreadRate?.toString() || ''}
                      onChangeText={(text) => updateSubstrate('spreadRate', parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <View style={styles.substrateConfigRow}>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Measurement (sqft)</Text>
                    <TextInput
                      style={styles.input}
                      value={currentSubstrateData.quantity?.toString() || ''}
                      onChangeText={(text) => updateSubstrate('quantity', parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.substrateConfigInput}>
                    <Text style={styles.inputLabel}>Coats</Text>
                    <View style={styles.coatsSelector}>
                      {[1, 2, 3].map(coats => (
                        <TouchableOpacity
                          key={coats}
                          style={[
                            styles.coatsButton,
                            currentSubstrateData.coats === coats && styles.coatsButtonActive
                          ]}
                          onPress={() => updateSubstrate('coats', coats)}
                        >
                          <Text style={[
                            styles.coatsButtonText,
                            currentSubstrateData.coats === coats && styles.coatsButtonTextActive
                          ]}>
                            {coats}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Tabs */}
              <View style={styles.substrateTabs}>
                <TouchableOpacity
                  style={[styles.substrateTab, activeTab === 'product' && styles.substrateTabActive]}
                  onPress={() => setActiveTab('product')}
                >
                  <Text style={[styles.substrateTabText, activeTab === 'product' && styles.substrateTabTextActive]}>
                    Product
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.substrateTab, activeTab === 'crew' && styles.substrateTabActive]}
                  onPress={() => setActiveTab('crew')}
                >
                  <Text style={[styles.substrateTabText, activeTab === 'crew' && styles.substrateTabTextActive]}>
                    Crew Note
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.substrateTab, activeTab === 'client' && styles.substrateTabActive]}
                  onPress={() => setActiveTab('client')}
                >
                  <Text style={[styles.substrateTabText, activeTab === 'client' && styles.substrateTabTextActive]}>
                    Client Note
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              <View style={styles.substrateTabContent}>
                {activeTab === 'product' && (
                  <View style={styles.productTab}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Product</Text>
                      <View style={styles.pickerContainer}>
                        <Text style={styles.pickerValue}>{currentSubstrateData.product}</Text>
                      </View>
                    </View>

                    <View style={styles.substrateConfigRow}>
                      <View style={styles.substrateConfigInput}>
                        <Text style={styles.inputLabel}>Unit Price</Text>
                        <TextInput
                          style={styles.input}
                          value={`$${currentSubstrateData.unitPrice?.toFixed(2) || '0.00'}`}
                          onChangeText={(text) => updateSubstrate('unitPrice', parseFloat(text.replace('$', '')) || 0)}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View style={styles.substrateConfigInput}>
                        <Text style={styles.inputLabel}>Coverage (sqft/gal)</Text>
                        <TextInput
                          style={styles.input}
                          value={currentSubstrateData.coverage?.toString() || ''}
                          onChangeText={(text) => updateSubstrate('coverage', parseFloat(text) || 0)}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {activeTab === 'crew' && (
                  <View style={styles.noteTab}>
                    <TextInput
                      style={styles.textArea}
                      placeholder="Crew notes for work order..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                )}

                {activeTab === 'client' && (
                  <View style={styles.noteTab}>
                    <TextInput
                      style={styles.textArea}
                      placeholder="Client notes for proposal..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptySubstrateDetails}>
              <Package size={48} color="#9CA3AF" />
              <Text style={styles.emptySubstrateDetailsText}>
                Select a substrate to configure its details
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const SummaryStep: React.FC<{
  selectedAreas: string[];
  areaDetails: Record<string, any>;
  selectedCategories: Record<string, string[]>;
  areaSubstrates: Record<string, Record<string, AreaSubstrate>>;
}> = ({ selectedAreas, areaDetails, selectedCategories, areaSubstrates }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Summary</Text>
      <Text style={styles.stepDescription}>
        Review your areas before adding to proposal
      </Text>

      {selectedAreas.map(area => {
        const details = areaDetails[area];
        const categories = selectedCategories[area] || [];
        const substrates = areaSubstrates[area] || {};

        return (
          <View key={area} style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>{details?.name || area}</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Client Label:</Text>
              <Text style={styles.summaryValue}>{details?.clientLabel || area}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>{details?.type || 'Area'}</Text>
            </View>

            {details?.measurements?.squareFt > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Square Footage:</Text>
                <Text style={styles.summaryValue}>{details.measurements.squareFt.toFixed(2)} sq ft</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categories:</Text>
              <Text style={styles.summaryValue}>{categories.join(', ') || 'None'}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Substrates:</Text>
              <Text style={styles.summaryValue}>{Object.keys(substrates).length}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  stepIndicatorWrapper: {
    marginTop: 16,
    paddingBottom: 12,
  },
  stepIndicator: {
    flexGrow: 0,
  },
  stepIndicatorContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stepItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    width: 70,
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
  },
  stepCircleCompleted: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  stepCircleCurrent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  stepCircleUpcoming: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepNumberCompleted: {
    color: '#6366F1',
  },
  stepNumberCurrent: {
    color: '#6366F1',
  },
  stepNumberUpcoming: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: '#FFFFFF',
  },
  stepLabelCurrent: {
    color: '#FFFFFF',
  },
  stepLabelUpcoming: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stepConnectorContainer: {
    width: 40,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  stepConnectorCompleted: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  stepContent: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
  },
  typeGrid: {
    gap: 12,
    marginTop: 8,
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  typeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  typeCardTitleActive: {
    color: '#6366F1',
  },
  typeCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedBadgeContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    minWidth: '47%',
  },
  areaCardActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  areaCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  areaCardTextActive: {
    color: '#6366F1',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  detailsCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  areaNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaNavigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  areaNavigationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  areaNavigationButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  navButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioLabel: {
    fontSize: 14,
    color: '#111827',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  measurementInput: {
    flex: 1,
    minWidth: '45%',
    gap: 8,
  },
  calculatedMeasurements: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  calculatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  calculatedText: {
    fontSize: 13,
    color: '#3B82F6',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoryAreaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  categoryAreaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    minWidth: '30%',
  },
  categoryCardActive: {
    borderColor: '#A855F7',
    backgroundColor: '#F3E8FF',
  },
  categoryCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  categoryCardTextActive: {
    color: '#A855F7',
  },
  substratesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  areaPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  areaPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  areaPickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 120,
  },
  areaPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  substrateColumns: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  substrateLeftColumn: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  substrateListHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  substrateListTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  substrateListMeasurement: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  substrateList: {
    flex: 1,
  },
  substrateListItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  substrateListItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  substrateListItemContent: {
    marginBottom: 6,
  },
  substrateListItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  substrateListItemCategory: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  substrateListItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  substrateListItemQuantity: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  substrateListItemRate: {
    fontSize: 11,
    color: '#6B7280',
  },
  emptySubstrateList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptySubstrateListText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  substrateRightColumn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  substrateDetails: {
    gap: 16,
  },
  substrateDetailsHeader: {
    marginBottom: 8,
  },
  substrateDetailsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  substrateDetailsCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  substrateConfig: {
    gap: 12,
  },
  substrateConfigRow: {
    flexDirection: 'row',
    gap: 12,
  },
  substrateConfigInput: {
    flex: 1,
    gap: 6,
  },
  coatsSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  coatsButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  coatsButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  coatsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  coatsButtonTextActive: {
    color: '#FFFFFF',
  },
  substrateTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginTop: 8,
  },
  substrateTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  substrateTabActive: {
    borderBottomColor: '#6366F1',
  },
  substrateTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  substrateTabTextActive: {
    color: '#6366F1',
  },
  substrateTabContent: {
    marginTop: 12,
  },
  productTab: {
    gap: 12,
  },
  noteTab: {
    gap: 8,
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerValue: {
    fontSize: 14,
    color: '#111827',
  },
  emptySubstrateDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptySubstrateDetailsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  footerButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  footerButtonPrimary: {
    backgroundColor: '#6366F1',
  },
  footerButtonDisabled: {
    opacity: 0.4,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  footerButtonTextDisabled: {
    color: '#9CA3AF',
  },
  footerButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

