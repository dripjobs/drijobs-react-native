import { productsService } from '@/services/ProductsService';
import { ProductCategory, ProductService } from '@/types/products';
import {
    Camera,
    ChevronDown,
    Plus,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product?: ProductService | null;
  onSave?: (product: ProductService) => void;
}

export default function ProductModal({ visible, onClose, product, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    category: '',
    defaultQuantity: 1,
    unitPrice: 0,
    taxRate: 0,
    isActive: true,
    tags: [] as string[],
  });
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newTag, setNewTag] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        detailedDescription: product.detailedDescription || '',
        category: product.category,
        defaultQuantity: product.defaultQuantity,
        unitPrice: product.unitPrice,
        taxRate: product.taxRate || 0,
        isActive: product.isActive,
        tags: [...product.tags],
      });
    } else {
      resetForm();
    }
  }, [product, visible]);

  const loadCategories = () => {
    const allCategories = productsService.getCategories();
    setCategories(allCategories);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      detailedDescription: '',
      category: '',
      defaultQuantity: 1,
      unitPrice: 0,
      taxRate: 0,
      isActive: true,
      tags: [],
    });
    setFormErrors({});
    setNewTag('');
  };

  const handleSave = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (formData.unitPrice <= 0) {
      errors.unitPrice = 'Unit price must be greater than 0';
    }
    
    if (formData.defaultQuantity <= 0) {
      errors.defaultQuantity = 'Default quantity must be greater than 0';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      try {
        let savedProduct: ProductService;
        
        if (product) {
          // Update existing product
          const updatedProduct = productsService.updateProduct(product.id, {
            ...formData,
            images: product.images, // Keep existing images
          });
          if (!updatedProduct) {
            throw new Error('Failed to update product');
          }
          savedProduct = updatedProduct;
        } else {
          // Create new product
          savedProduct = productsService.createProduct({
            ...formData,
            images: [],
            createdBy: 'Current User', // TODO: Get from auth context
          });
        }
        
        setIsSaving(false);
        setFormErrors({});
        onSave?.(savedProduct);
        onClose();
        Alert.alert('Success', `Product ${product ? 'updated' : 'created'} successfully`);
      } catch (error) {
        setIsSaving(false);
        Alert.alert('Error', 'Failed to save product. Please try again.');
      }
    }, 1000);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setShowCategoryPicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {product ? 'Edit Product' : 'Create Product'}
          </Text>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Images Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            <View style={styles.imageUploadArea}>
              <TouchableOpacity style={styles.imageUploadButton}>
                <Camera size={24} color="#6366F1" />
                <Text style={styles.imageUploadText}>Add Images</Text>
              </TouchableOpacity>
              <Text style={styles.imageUploadHelper}>
                Upload product photos to help customers understand your offering
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'name' && styles.inputContainerFocused,
                formErrors.name && styles.inputError
              ]}>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Enter product name"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Short Description *</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'description' && styles.inputContainerFocused,
                formErrors.description && styles.inputError
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholder="Brief description of the product"
                  multiline
                  numberOfLines={2}
                  onFocus={() => setFocusedInput('description')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {formErrors.description && <Text style={styles.errorText}>{formErrors.description}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Detailed Description</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'detailedDescription' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.detailedDescription}
                  onChangeText={(text) => setFormData({...formData, detailedDescription: text})}
                  placeholder="Detailed description with features, benefits, etc."
                  multiline
                  numberOfLines={4}
                  onFocus={() => setFocusedInput('detailedDescription')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity 
                style={[styles.categoryPicker, formErrors.category && styles.inputError]}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={[styles.categoryPickerText, !formData.category && styles.placeholderText]}>
                  {formData.category || 'Select Category'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {formErrors.category && <Text style={styles.errorText}>{formErrors.category}</Text>}
            </View>
          </View>

          {/* Pricing & Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing & Quantity</Text>
            
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Unit Price *</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'unitPrice' && styles.inputContainerFocused,
                  formErrors.unitPrice && styles.inputError
                ]}>
                  <TextInput
                    style={styles.input}
                    value={formData.unitPrice.toString()}
                    onChangeText={(text) => setFormData({...formData, unitPrice: parseFloat(text) || 0})}
                    placeholder="0.00"
                    keyboardType="numeric"
                    onFocus={() => setFocusedInput('unitPrice')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
                {formErrors.unitPrice && <Text style={styles.errorText}>{formErrors.unitPrice}</Text>}
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Default Quantity *</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'defaultQuantity' && styles.inputContainerFocused,
                  formErrors.defaultQuantity && styles.inputError
                ]}>
                  <TextInput
                    style={styles.input}
                    value={formData.defaultQuantity.toString()}
                    onChangeText={(text) => setFormData({...formData, defaultQuantity: parseInt(text) || 1})}
                    placeholder="1"
                    keyboardType="numeric"
                    onFocus={() => setFocusedInput('defaultQuantity')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
                {formErrors.defaultQuantity && <Text style={styles.errorText}>{formErrors.defaultQuantity}</Text>}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tax Rate (%)</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'taxRate' && styles.inputContainerFocused
              ]}>
                <TextInput
                  style={styles.input}
                  value={formData.taxRate.toString()}
                  onChangeText={(text) => setFormData({...formData, taxRate: parseFloat(text) || 0})}
                  placeholder="0.0"
                  keyboardType="numeric"
                  onFocus={() => setFocusedInput('taxRate')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <Text style={styles.helperText}>
              Add tags to help categorize and find your products
            </Text>
            
            <View style={[
              styles.tagInputContainer,
              focusedInput === 'newTag' && styles.inputContainerFocused
            ]}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Add a tag..."
                onSubmitEditing={handleAddTag}
                onFocus={() => setFocusedInput('newTag')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity 
                style={styles.addTagButton}
                onPress={handleAddTag}
              >
                <Plus size={16} color="#6366F1" />
              </TouchableOpacity>
            </View>

            {formData.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {formData.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.tagRemove}
                    >
                      <X size={12} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Category Picker Modal */}
        <Modal
          visible={showCategoryPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <TouchableOpacity 
            style={styles.categoryPickerBackdrop}
            onPress={() => setShowCategoryPicker(false)}
            activeOpacity={1}
          >
            <View style={styles.categoryPickerModal}>
              <Text style={styles.categoryPickerTitle}>Select Category</Text>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryOption}
                  onPress={() => handleCategorySelect(category.name)}
                >
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                  <Text style={styles.categoryOptionDescription}>{category.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
    shadowOpacity: 0.15,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  imageUploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    marginBottom: 12,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  imageUploadHelper: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryPickerText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
  },
  addTagButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tagRemove: {
    padding: 2,
  },
  categoryPickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categoryOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});
