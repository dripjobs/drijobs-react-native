import {
    Check,
    Edit,
    Info,
    List,
    MapPin,
    Package,
    Plus,
    Star,
    Trash2,
    X,
    Zap,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { WebView } from 'react-native-webview';
import { ProposalPackage, ProposalPackageAddOn, ProposalPackageItem } from '../types/proposals';

const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface PackagedPricingSectionProps {
  packages: ProposalPackage[];
  addOns: ProposalPackageAddOn[];
  selectedTierPackageId?: string;
  selectedAddOnPackageIds: string[];
  onUpdate: (
    packages: ProposalPackage[], 
    addOns: ProposalPackageAddOn[], 
    selectedTierPackageId?: string,
    selectedAddOnPackageIds?: string[]
  ) => void;
  lineItems: any[];
  areas?: any[];
}

export const PackagedPricingSection: React.FC<PackagedPricingSectionProps> = ({
  packages,
  addOns,
  selectedTierPackageId,
  selectedAddOnPackageIds,
  onUpdate,
  lineItems,
  areas = []
}) => {
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState<string | null>(null);
  const [packageTypeForNew, setPackageTypeForNew] = useState<'tier' | 'addon'>('tier');

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const tierPackages = packages.filter(pkg => pkg.packageType === 'tier');
  const addonPackages = packages.filter(pkg => pkg.packageType === 'addon');

  const defaultTierPackages: Partial<ProposalPackage>[] = [
    {
      name: 'Bronze',
      description: 'Essential services for basic needs',
      price: 0,
      isRecommended: false,
      items: [],
      features: ['Basic service', 'Standard materials', '1-year warranty'],
      color: '#CD7F32',
      packageType: 'tier',
      pricingModel: 'fixed',
      showLineItemPrices: false,
    },
    {
      name: 'Silver',
      description: 'Enhanced services with premium features',
      price: 0,
      isRecommended: true,
      items: [],
      features: ['Enhanced service', 'Premium materials', '2-year warranty', 'Priority support'],
      color: '#C0C0C0',
      packageType: 'tier',
      pricingModel: 'fixed',
      showLineItemPrices: false,
    },
    {
      name: 'Gold',
      description: 'Premium services with all features included',
      price: 0,
      isRecommended: false,
      items: [],
      features: ['Premium service', 'Top-tier materials', '5-year warranty', 'Priority support', 'Extended coverage'],
      color: '#FFD700',
      packageType: 'tier',
      pricingModel: 'fixed',
      showLineItemPrices: false,
    }
  ];

  const addPackage = (packageData: Partial<ProposalPackage>) => {
    const newPackage: ProposalPackage = {
      id: `package-${Date.now()}`,
      name: packageData.name || 'New Package',
      description: packageData.description || '',
      price: packageData.price || 0,
      isRecommended: packageData.isRecommended || false,
      items: packageData.items || [],
      images: packageData.images || [],
      features: packageData.features || [],
      warranty: packageData.warranty,
      scope: packageData.scope,
      color: packageData.color,
      packageType: packageData.packageType || 'tier',
      pricingModel: packageData.pricingModel || 'fixed',
      packageAdjustment: packageData.packageAdjustment,
      showLineItemPrices: packageData.showLineItemPrices || false,
    };
    onUpdate([...packages, newPackage], addOns, selectedTierPackageId, selectedAddOnPackageIds);
    setShowAddPackage(false);
  };

  const updatePackage = (id: string, updates: Partial<ProposalPackage>) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === id ? { ...pkg, ...updates } : pkg
    );
    onUpdate(updatedPackages, addOns, selectedTierPackageId, selectedAddOnPackageIds);
  };

  const deletePackage = (id: string) => {
    const updatedPackages = packages.filter(pkg => pkg.id !== id);
    // If deleting selected tier, clear selection
    const newSelectedTier = selectedTierPackageId === id ? undefined : selectedTierPackageId;
    // If deleting selected addon, remove from selection
    const newSelectedAddons = selectedAddOnPackageIds.filter(aid => aid !== id);
    onUpdate(updatedPackages, addOns, newSelectedTier, newSelectedAddons);
  };

  const addItemToPackage = (packageId: string, item: ProposalPackageItem) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, items: [...pkg.items, item] }
        : pkg
    );
    onUpdate(updatedPackages, addOns, selectedTierPackageId, selectedAddOnPackageIds);
  };

  const removeItemFromPackage = (packageId: string, itemId: string) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, items: pkg.items.filter(item => item.id !== itemId) }
        : pkg
    );
    onUpdate(updatedPackages, addOns, selectedTierPackageId, selectedAddOnPackageIds);
  };

  const addAddOn = (addOnData: Partial<ProposalPackageAddOn>) => {
    const newAddOn: ProposalPackageAddOn = {
      id: `addon-${Date.now()}`,
      name: addOnData.name || 'New Add-On',
      description: addOnData.description || '',
      price: addOnData.price || 0,
      isSelected: false,
      category: addOnData.category
    };
    onUpdate(packages, [...addOns, newAddOn], selectedTierPackageId, selectedAddOnPackageIds);
    setShowAddOns(false);
  };

  const toggleAddOn = (addOnId: string) => {
    const updatedAddOns = addOns.map(addon => 
      addon.id === addOnId ? { ...addon, isSelected: !addon.isSelected } : addon
    );
    onUpdate(packages, updatedAddOns, selectedTierPackageId, selectedAddOnPackageIds);
  };

  const selectTierPackage = (packageId: string) => {
    // Toggle selection: if already selected, deselect
    const newSelection = selectedTierPackageId === packageId ? undefined : packageId;
    onUpdate(packages, addOns, newSelection, selectedAddOnPackageIds);
  };

  const toggleAddonPackage = (packageId: string) => {
    const newSelection = selectedAddOnPackageIds.includes(packageId)
      ? selectedAddOnPackageIds.filter(id => id !== packageId)
      : [...selectedAddOnPackageIds, packageId];
    onUpdate(packages, addOns, selectedTierPackageId, newSelection);
  };

  const calculatePackageTotal = (pkg: ProposalPackage) => {
    if (pkg.pricingModel === 'fixed') {
      return pkg.price;
    }
    
    const itemsTotal = pkg.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    if (pkg.pricingModel === 'itemized') {
      return itemsTotal;
    }
    
    if (pkg.pricingModel === 'itemized-with-adjustment') {
      return itemsTotal + (pkg.packageAdjustment || 0);
    }
    
    return pkg.price;
  };

  const getTotalSelectedAddOns = () => {
    return addOns.filter(addon => addon.isSelected).reduce((sum, addon) => sum + addon.price, 0);
  };

  const getSelectedTierTotal = () => {
    if (!selectedTierPackageId) return 0;
    const tier = packages.find(p => p.id === selectedTierPackageId);
    return tier ? calculatePackageTotal(tier) : 0;
  };

  const getSelectedAddOnPackagesTotal = () => {
    return selectedAddOnPackageIds.reduce((sum, id) => {
      const pkg = packages.find(p => p.id === id);
      return sum + (pkg ? calculatePackageTotal(pkg) : 0);
    }, 0);
  };

  const getGrandTotal = () => {
    return getSelectedTierTotal() + getSelectedAddOnPackagesTotal() + getTotalSelectedAddOns();
  };

  const openAddItemModal = (packageId: string) => {
    setCurrentPackageId(packageId);
    setShowAddItemModal(true);
  };

  const openAddAreaModal = (packageId: string) => {
    setCurrentPackageId(packageId);
    setShowAddAreaModal(true);
  };

  const handleAddLineItem = (itemData: any) => {
    if (currentPackageId) {
      const newItem: ProposalPackageItem = {
        id: `package-item-${Date.now()}`,
        name: itemData.name || 'New Item',
        description: itemData.description || '',
        quantity: itemData.quantity || 1,
        unitPrice: itemData.unitPrice || 0,
        totalPrice: (itemData.quantity || 1) * (itemData.unitPrice || 0),
        category: itemData.category || 'General',
        isOptional: itemData.isOptional || false
      };
      addItemToPackage(currentPackageId, newItem);
      setShowAddItemModal(false);
      setCurrentPackageId(null);
    }
  };

  const handleAddArea = (areaData: any) => {
    if (currentPackageId) {
      const newItem: ProposalPackageItem = {
        id: `package-area-${Date.now()}`,
        name: areaData.name || 'New Area',
        description: areaData.description || '',
        quantity: 1,
        unitPrice: areaData.totalPrice || 0,
        totalPrice: areaData.totalPrice || 0,
        category: 'Area',
        isOptional: false
      };
      addItemToPackage(currentPackageId, newItem);
      setShowAddAreaModal(false);
      setCurrentPackageId(null);
    }
  };

  const loadDefaultTierPackages = () => {
    const newPackages = defaultTierPackages.map((pkg, index) => ({
      ...pkg,
      id: `tier-${Date.now()}-${index}`,
      items: [],
      images: [],
    } as ProposalPackage));
    onUpdate([...packages, ...newPackages], addOns, selectedTierPackageId, selectedAddOnPackageIds);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Package size={24} color="#8B5CF6" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Packaged Pricing</Text>
            <Text style={styles.headerSubtitle}>
              Create tiered packages and optional add-ons
            </Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowAddOns(true)}
          >
            <Plus size={16} color="#6366F1" />
            <Text style={styles.headerButtonText}>Add-Ons</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview: Items Added to Packages */}
      {packages.some(pkg => pkg.items.length > 0) && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Items in Packages - Preview</Text>
          {packages.filter(pkg => pkg.items.length > 0).map(pkg => (
            <View key={pkg.id} style={styles.previewPackageCard}>
              <View style={styles.previewPackageHeader}>
                <View style={[styles.colorDot, { backgroundColor: pkg.color || '#6B7280' }]} />
                <Text style={styles.previewPackageName}>{pkg.name}</Text>
                <View style={[styles.badge, pkg.packageType === 'tier' ? styles.badgeTier : styles.badgeAddon]}>
                  <Text style={styles.badgeText}>{pkg.packageType === 'tier' ? 'Tier' : 'Add-On'}</Text>
                </View>
              </View>
              {pkg.items.map(item => (
                <View key={item.id} style={styles.previewItem}>
                  <View style={styles.previewItemLeft}>
                    <Text style={styles.previewItemName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.previewItemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                    <Text style={styles.previewItemDetails}>
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </Text>
                  </View>
                  <Text style={styles.previewItemTotal}>{formatCurrency(item.totalPrice)}</Text>
                </View>
              ))}
              <View style={styles.previewPackageTotal}>
                <Text style={styles.previewPackageTotalLabel}>
                  {pkg.pricingModel === 'fixed' ? 'Package Price (Fixed)' : 
                   pkg.pricingModel === 'itemized' ? 'Package Total (Itemized)' : 
                   'Package Total (With Adjustment)'}:
                </Text>
                <Text style={styles.previewPackageTotalValue}>
                  {formatCurrency(calculatePackageTotal(pkg))}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Quick Setup with Default Packages */}
      {tierPackages.length === 0 && addonPackages.length === 0 && (
        <View style={styles.emptyState}>
          <Package size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateTitle}>No Packages Created</Text>
          <Text style={styles.emptyStateText}>Create tiered packages (Good/Better/Best) or optional add-ons</Text>
          <View style={styles.emptyStateButtons}>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={loadDefaultTierPackages}
            >
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.templateButtonText}>Use Tier Template</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.templateButtonSecondary}
              onPress={() => {
                setPackageTypeForNew('tier');
                setShowAddPackage(true);
              }}
            >
              <Plus size={16} color="#6366F1" />
              <Text style={styles.templateButtonSecondaryText}>New Tier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.templateButtonSecondary}
              onPress={() => {
                setPackageTypeForNew('addon');
                setShowAddPackage(true);
              }}
            >
              <Plus size={16} color="#8B5CF6" />
              <Text style={styles.templateButtonSecondaryText}>New Add-On</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tier Packages Section */}
      {tierPackages.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Package Tiers</Text>
              <Text style={styles.sectionSubtitle}>Customer chooses one option</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setPackageTypeForNew('tier');
                setShowAddPackage(true);
              }}
            >
              <Plus size={16} color="#6366F1" />
              <Text style={styles.addButtonText}>Add Tier</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.packagesGrid}>
            {tierPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedTierPackageId === pkg.id}
                onSelect={() => selectTierPackage(pkg.id)}
                onEdit={() => setEditingPackage(editingPackage === pkg.id ? null : pkg.id)}
                onDelete={() => deletePackage(pkg.id)}
                isEditing={editingPackage === pkg.id}
                onUpdate={(updates) => {
                  updatePackage(pkg.id, updates);
                  setEditingPackage(null);
                }}
                onCancelEdit={() => setEditingPackage(null)}
                onAddLineItem={() => openAddItemModal(pkg.id)}
                onAddArea={() => openAddAreaModal(pkg.id)}
                onRemoveItem={(itemId) => removeItemFromPackage(pkg.id, itemId)}
                calculatePackageTotal={calculatePackageTotal}
                formatCurrency={formatCurrency}
                selectionType="radio"
              />
            ))}
          </View>
        </View>
      )}

      {/* Add-On Packages Section */}
      {addonPackages.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Add-On Packages</Text>
              <Text style={styles.sectionSubtitle}>Customer can select multiple</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setPackageTypeForNew('addon');
                setShowAddPackage(true);
              }}
            >
              <Plus size={16} color="#8B5CF6" />
              <Text style={styles.addButtonText}>Add Package</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.packagesGrid}>
            {addonPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedAddOnPackageIds.includes(pkg.id)}
                onSelect={() => toggleAddonPackage(pkg.id)}
                onEdit={() => setEditingPackage(editingPackage === pkg.id ? null : pkg.id)}
                onDelete={() => deletePackage(pkg.id)}
                isEditing={editingPackage === pkg.id}
                onUpdate={(updates) => {
                  updatePackage(pkg.id, updates);
                  setEditingPackage(null);
                }}
                onCancelEdit={() => setEditingPackage(null)}
                onAddLineItem={() => openAddItemModal(pkg.id)}
                onAddArea={() => openAddAreaModal(pkg.id)}
                onRemoveItem={(itemId) => removeItemFromPackage(pkg.id, itemId)}
                calculatePackageTotal={calculatePackageTotal}
                formatCurrency={formatCurrency}
                selectionType="checkbox"
              />
            ))}
          </View>
        </View>
      )}

      {/* Global Add-Ons Section */}
      {addOns.length > 0 && (
        <View style={styles.addOnsCard}>
          <Text style={styles.addOnsTitle}>Additional Options</Text>
          <View style={styles.addOnsGrid}>
            {addOns.map((addon) => (
              <View key={addon.id} style={styles.addOnItem}>
                <View style={styles.addOnInfo}>
                  <Text style={styles.addOnName}>{addon.name}</Text>
                  <Text style={styles.addOnDescription}>{addon.description}</Text>
                  <Text style={styles.addOnPrice}>{formatCurrency(addon.price)}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.addOnButton,
                    addon.isSelected && styles.addOnButtonActive
                  ]}
                  onPress={() => toggleAddOn(addon.id)}
                >
                  {addon.isSelected && (
                    <Check size={14} color="#FFFFFF" />
                  )}
                  <Text style={[
                    styles.addOnButtonText,
                    addon.isSelected && styles.addOnButtonTextActive
                  ]}>
                    {addon.isSelected ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Summary */}
      {(selectedTierPackageId || selectedAddOnPackageIds.length > 0 || addOns.some(a => a.isSelected)) && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Selection Summary</Text>
          <View style={styles.summaryContent}>
            {selectedTierPackageId && (
              <>
                <Text style={styles.summarySectionLabel}>Selected Tier:</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {tierPackages.find(p => p.id === selectedTierPackageId)?.name}
                  </Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(getSelectedTierTotal())}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
              </>
            )}

            {selectedAddOnPackageIds.length > 0 && (
              <>
                <Text style={styles.summarySectionLabel}>Selected Add-On Packages:</Text>
                {selectedAddOnPackageIds.map(id => {
                  const pkg = packages.find(p => p.id === id);
                  if (!pkg) return null;
                  return (
                    <View key={id} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>+ {pkg.name}</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(calculatePackageTotal(pkg))}
                      </Text>
                    </View>
                  );
                })}
                <View style={styles.summaryDivider} />
              </>
            )}

            {addOns.some(a => a.isSelected) && (
              <>
                <Text style={styles.summarySectionLabel}>Selected Options:</Text>
                {addOns.filter(a => a.isSelected).map(addon => (
                  <View key={addon.id} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>+ {addon.name}</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(addon.price)}
                    </Text>
                  </View>
                ))}
                <View style={styles.summaryDivider} />
              </>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>
                {formatCurrency(getGrandTotal())}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Modals */}
      <AddPackageModal
        visible={showAddPackage}
        packageType={packageTypeForNew}
        onAdd={addPackage}
        onCancel={() => setShowAddPackage(false)}
      />

      <AddAddOnModal
        visible={showAddOns}
        onAdd={addAddOn}
        onCancel={() => setShowAddOns(false)}
      />

      <AddLineItemModal
        visible={showAddItemModal}
        onAdd={handleAddLineItem}
        onCancel={() => {
          setShowAddItemModal(false);
          setCurrentPackageId(null);
        }}
        lineItems={lineItems}
      />

      <AddAreaModal
        visible={showAddAreaModal}
        onAdd={handleAddArea}
        onCancel={() => {
          setShowAddAreaModal(false);
          setCurrentPackageId(null);
        }}
      />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

// Package Card Component
interface PackageCardProps {
  package: ProposalPackage;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onUpdate: (updates: Partial<ProposalPackage>) => void;
  onCancelEdit: () => void;
  onAddLineItem: () => void;
  onAddArea: () => void;
  onRemoveItem: (itemId: string) => void;
  calculatePackageTotal: (pkg: ProposalPackage) => number;
  formatCurrency: (amount: number) => string;
  selectionType: 'radio' | 'checkbox';
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isEditing,
  onUpdate,
  onCancelEdit,
  onAddLineItem,
  onAddArea,
  onRemoveItem,
  calculatePackageTotal,
  formatCurrency,
  selectionType,
}) => {
  return (
    <View 
      style={[
        styles.packageCard,
        isSelected && styles.packageCardSelected
      ]}
    >
      {/* Package Header */}
      <View style={styles.packageHeader}>
        <View style={styles.packageHeaderLeft}>
          <View 
            style={[styles.colorDot, { backgroundColor: pkg.color || '#6B7280' }]}
          />
          <Text style={styles.packageName}>{pkg.name}</Text>
          {pkg.isRecommended && (
            <Star size={16} color="#EAB308" fill="#EAB308" />
          )}
        </View>
        <View style={styles.packageHeaderActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onEdit}
          >
            <Edit size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onDelete}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.packageBadges}>
        <View style={[styles.badge, pkg.packageType === 'tier' ? styles.badgeTier : styles.badgeAddon]}>
          <Text style={styles.badgeText}>
            {pkg.packageType === 'tier' ? 'Tier' : 'Add-On'}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {pkg.pricingModel === 'fixed' ? 'Fixed' : pkg.pricingModel === 'itemized' ? 'Itemized' : 'Adjusted'}
          </Text>
        </View>
      </View>

      {/* Package Content */}
      {isEditing ? (
        <PackageEditForm
          package={pkg}
          onSave={onUpdate}
          onCancel={onCancelEdit}
          onAddLineItem={onAddLineItem}
          onAddArea={onAddArea}
          onRemoveItem={onRemoveItem}
          formatCurrency={formatCurrency}
          calculatePackageTotal={calculatePackageTotal}
        />
      ) : (
        <View style={styles.packageContent}>
          <Text style={styles.packageDescription}>{pkg.description}</Text>
          
          <Text style={styles.packagePrice}>
            {formatCurrency(calculatePackageTotal(pkg))}
          </Text>

          {pkg.pricingModel === 'itemized-with-adjustment' && pkg.packageAdjustment !== 0 && (
            <Text style={[styles.packageAdjustment, pkg.packageAdjustment! < 0 ? styles.packageDiscount : styles.packagePremium]}>
              {pkg.packageAdjustment! < 0 ? 'Discount' : 'Premium'}: {formatCurrency(Math.abs(pkg.packageAdjustment || 0))}
            </Text>
          )}

          {/* Features List */}
          <View style={styles.featuresList}>
            {pkg.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check size={16} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Package Items */}
          {pkg.items.length > 0 && (pkg.pricingModel !== 'fixed' || pkg.showLineItemPrices) && (
            <View style={styles.itemsSection}>
              <Text style={styles.itemsSectionTitle}>Included Items:</Text>
              {pkg.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {pkg.showLineItemPrices && (
                    <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Add Items Buttons */}
          <View style={styles.addItemsButtons}>
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={onAddLineItem}
            >
              <List size={14} color="#6366F1" />
              <Text style={styles.addItemButtonText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={onAddArea}
            >
              <Plus size={14} color="#6366F1" />
              <Text style={styles.addItemButtonText}>Add Area</Text>
            </TouchableOpacity>
          </View>

          {/* Select Button */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              isSelected && styles.selectButtonActive
            ]}
            onPress={onSelect}
          >
            {isSelected ? (
              <>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.selectButtonTextActive}>
                  {selectionType === 'radio' ? 'Selected' : 'Added'}
                </Text>
              </>
            ) : (
              <Text style={styles.selectButtonText}>
                {selectionType === 'radio' ? 'Select Package' : 'Add to Proposal'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Package Edit Form Component
interface PackageEditFormProps {
  package: ProposalPackage;
  onSave: (updates: Partial<ProposalPackage>) => void;
  onCancel: () => void;
  onAddLineItem: () => void;
  onAddArea: () => void;
  onRemoveItem: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
  calculatePackageTotal: (pkg: ProposalPackage) => number;
}

const PackageEditForm: React.FC<PackageEditFormProps> = ({
  package: pkg,
  onSave,
  onCancel,
  onAddLineItem,
  onAddArea,
  onRemoveItem,
  formatCurrency,
}) => {
  const [formData, setFormData] = useState({
    name: pkg.name,
    description: pkg.description,
    price: pkg.price.toString(),
    isRecommended: pkg.isRecommended,
    warranty: pkg.warranty || '',
    scope: pkg.scope || '',
    color: pkg.color || '#6B7280',
    pricingModel: pkg.pricingModel,
    packageAdjustment: pkg.packageAdjustment?.toString() || '0',
    showLineItemPrices: pkg.showLineItemPrices || false,
  });

  const [features, setFeatures] = useState(pkg.features);
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...pkg,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      isRecommended: formData.isRecommended,
      warranty: formData.warranty,
      scope: formData.scope,
      color: formData.color,
      features: features,
      pricingModel: formData.pricingModel,
      packageAdjustment: parseFloat(formData.packageAdjustment) || 0,
      showLineItemPrices: formData.showLineItemPrices,
    });
  };

  return (
    <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false}>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Package Name</Text>
        <TextInput
          style={styles.formInput}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="e.g., Bronze, Silver, Gold"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Pricing Model</Text>
        <View style={styles.pricingModelOptions}>
          <TouchableOpacity
            style={[
              styles.pricingModelOption,
              formData.pricingModel === 'fixed' && styles.pricingModelOptionActive
            ]}
            onPress={() => setFormData({ ...formData, pricingModel: 'fixed' })}
          >
            <View style={[
              styles.radio,
              formData.pricingModel === 'fixed' && styles.radioActive
            ]}>
              {formData.pricingModel === 'fixed' && <View style={styles.radioDot} />}
            </View>
            <View style={styles.pricingModelText}>
              <Text style={styles.pricingModelLabel}>Fixed Price</Text>
              <Text style={styles.pricingModelDesc}>Set a single flat price. Line items are for description only and don't affect the total.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pricingModelOption,
              formData.pricingModel === 'itemized' && styles.pricingModelOptionActive
            ]}
            onPress={() => setFormData({ ...formData, pricingModel: 'itemized' })}
          >
            <View style={[
              styles.radio,
              formData.pricingModel === 'itemized' && styles.radioActive
            ]}>
              {formData.pricingModel === 'itemized' && <View style={styles.radioDot} />}
            </View>
            <View style={styles.pricingModelText}>
              <Text style={styles.pricingModelLabel}>Itemized</Text>
              <Text style={styles.pricingModelDesc}>Price is calculated by adding up all line items. Each item's quantity and unit price determine the total.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pricingModelOption,
              formData.pricingModel === 'itemized-with-adjustment' && styles.pricingModelOptionActive
            ]}
            onPress={() => setFormData({ ...formData, pricingModel: 'itemized-with-adjustment' })}
          >
            <View style={[
              styles.radio,
              formData.pricingModel === 'itemized-with-adjustment' && styles.radioActive
            ]}>
              {formData.pricingModel === 'itemized-with-adjustment' && <View style={styles.radioDot} />}
            </View>
            <View style={styles.pricingModelText}>
              <Text style={styles.pricingModelLabel}>Itemized + Adjustment</Text>
              <Text style={styles.pricingModelDesc}>Like itemized, but add a discount or premium to the line items total (use negative for discounts).</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {formData.pricingModel === 'fixed' && (
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Fixed Price</Text>
          <TextInput
            style={styles.formInput}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>
      )}

      {formData.pricingModel === 'itemized-with-adjustment' && (
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Package Adjustment (negative for discount)</Text>
          <TextInput
            style={styles.formInput}
            value={formData.packageAdjustment}
            onChangeText={(text) => setFormData({ ...formData, packageAdjustment: text })}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
      )}

      {formData.pricingModel !== 'fixed' && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.recommendedToggle}
            onPress={() => setFormData({ ...formData, showLineItemPrices: !formData.showLineItemPrices })}
          >
            <View style={[
              styles.recommendedCheckbox,
              formData.showLineItemPrices && styles.recommendedCheckboxActive
            ]}>
              {formData.showLineItemPrices && (
                <Check size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.recommendedLabel}>Show line item prices to customer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Description</Text>
        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Describe what this package includes..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Features</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureEditRow}>
            <TextInput
              style={[styles.formInput, styles.featureInput]}
              value={feature}
              onChangeText={(text) => {
                const newFeatures = [...features];
                newFeatures[index] = text;
                setFeatures(newFeatures);
              }}
            />
            <TouchableOpacity
              style={styles.featureRemoveButton}
              onPress={() => removeFeature(index)}
            >
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.featureEditRow}>
          <TextInput
            style={[styles.formInput, styles.featureInput]}
            value={newFeature}
            onChangeText={setNewFeature}
            placeholder="Add new feature..."
            onSubmitEditing={addFeature}
          />
          <TouchableOpacity
            style={styles.featureAddButton}
            onPress={addFeature}
          >
            <Plus size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Package Items Section */}
      <View style={styles.formGroup}>
        <View style={styles.itemsHeader}>
          <Text style={styles.formLabel}>Package Items</Text>
          <View style={styles.itemsHeaderButtons}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={onAddLineItem}
            >
              <List size={14} color="#6366F1" />
              <Text style={styles.smallButtonText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={onAddArea}
            >
              <MapPin size={14} color="#6366F1" />
              <Text style={styles.smallButtonText}>Add Area</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {pkg.items.length > 0 ? (
          <View style={styles.packageItemsList}>
            {pkg.items.map((item) => (
              <View key={item.id} style={styles.packageItemCard}>
                <View style={styles.packageItemContent}>
                  <View style={styles.packageItemHeader}>
                    <Text style={styles.packageItemName}>{item.name}</Text>
                    <Text style={styles.packageItemTotal}>
                      {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                    </Text>
                  </View>
                  {item.description && (
                    <Text style={styles.packageItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  <View style={styles.packageItemTags}>
                    <View style={styles.packageItemTag}>
                      <Text style={styles.packageItemTagText}>{item.category}</Text>
                    </View>
                    {item.isOptional && (
                      <View style={[styles.packageItemTag, styles.packageItemTagOptional]}>
                        <Text style={[styles.packageItemTagText, styles.packageItemTagTextOptional]}>
                          Optional
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.packageItemRemove}
                  onPress={() => onRemoveItem(item.id)}
                >
                  <Trash2 size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noItemsState}>
            <Package size={32} color="#9CA3AF" />
            <Text style={styles.noItemsText}>No items added to this package yet.</Text>
            <Text style={styles.noItemsSubtext}>Click "Add Item" or "Add Area" to get started</Text>
          </View>
        )}
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.recommendedToggle}
          onPress={() => setFormData({ ...formData, isRecommended: !formData.isRecommended })}
        >
          <View style={[
            styles.recommendedCheckbox,
            formData.isRecommended && styles.recommendedCheckboxActive
          ]}>
            {formData.isRecommended && (
              <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </View>
          <Text style={styles.recommendedLabel}>Mark as Recommended</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity style={styles.formButtonCancel} onPress={onCancel}>
          <Text style={styles.formButtonCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.formButtonSave} onPress={handleSave}>
          <Text style={styles.formButtonSaveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Add Line Item Modal
interface AddLineItemModalProps {
  visible: boolean;
  onAdd: (itemData: any) => void;
  onCancel: () => void;
  lineItems?: any[];
}

// Sample products/services data with HTML descriptions - in real app, this would come from API
const sampleProducts = [
  { id: '1', name: 'Exterior Painting', price: 2500, description: '<p><strong>Complete exterior house painting including:</strong></p><ul><li>Surface preparation and power washing</li><li>Scraping and sanding</li><li>Premium quality primer</li><li>Two coats of premium exterior paint</li><li>Trim and detail work</li><li>5-year warranty</li></ul>', category: 'Painting' },
  { id: '2', name: 'Interior Painting', price: 1800, description: '<p><strong>Interior room painting service:</strong></p><ul><li>Wall preparation and patching</li><li>Masking and protection</li><li>Premium interior paint</li><li>Two coats application</li><li>Trim and ceiling work</li><li>Complete cleanup</li></ul>', category: 'Painting' },
  { id: '3', name: 'Deck Staining', price: 1200, description: '<p><strong>Professional deck staining including:</strong></p><ul><li>Power washing</li><li>Sanding and preparation</li><li>Premium wood stain</li><li>Sealant application</li><li>Railings and stairs</li><li>3-year protection warranty</li></ul>', category: 'Staining' },
  { id: '4', name: 'Pressure Washing', price: 350, description: '<p><strong>High-pressure washing service for:</strong></p><ul><li>House siding</li><li>Decks and patios</li><li>Driveways</li><li>Walkways</li><li>Fences</li><li>Eco-friendly cleaning solutions</li></ul>', category: 'Cleaning' },
  { id: '5', name: 'Trim Work', price: 800, description: '<p><strong>Detailed trim painting including:</strong></p><ul><li>Door frames and doors</li><li>Window frames</li><li>Baseboards</li><li>Crown molding</li><li>Chair rails</li><li>Precision detail work</li></ul>', category: 'Painting' },
  { id: '6', name: 'Cabinet Refinishing', price: 1500, description: '<p><strong>Kitchen or bathroom cabinet refinishing:</strong></p><ul><li>Surface stripping</li><li>Sanding and preparation</li><li>New finish application</li><li>Hardware installation</li><li>Professional spray finish</li><li>Transforms your space</li></ul>', category: 'Refinishing' },
  { id: '7', name: 'Wallpaper Removal', price: 450, description: '<p><strong>Professional wallpaper removal:</strong></p><ul><li>Safe removal techniques</li><li>Wall surface repair</li><li>Smoothing and preparation</li><li>Priming for paint</li><li>Minimal wall damage</li><li>Cleanup included</li></ul>', category: 'Prep Work' },
  { id: '8', name: 'Drywall Repair', price: 300, description: '<p><strong>Comprehensive drywall repair:</strong></p><ul><li>Hole and crack repair</li><li>Mudding and taping</li><li>Sanding and smoothing</li><li>Priming</li><li>Texture matching</li><li>Seamless results</li></ul>', category: 'Repair' },
  { id: '9', name: 'Popcorn Ceiling Removal', price: 900, description: '<p><strong>Popcorn ceiling removal service:</strong></p><ul><li>Careful texture removal</li><li>Surface smoothing</li><li>Refinishing to modern look</li><li>Dust containment</li><li>Complete cleanup</li><li>Modernizes your home</li></ul>', category: 'Ceiling Work' },
  { id: '10', name: 'Fence Staining', price: 650, description: '<p><strong>Wood fence staining service:</strong></p><ul><li>Cleaning and preparation</li><li>Premium wood stain</li><li>Protective sealant</li><li>Posts and pickets</li><li>Weather protection</li><li>Extends fence life</li></ul>', category: 'Staining' },
];

const AddLineItemModal: React.FC<AddLineItemModalProps> = ({ visible, onAdd, onCancel, lineItems = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '1',
    unitPrice: '0',
    category: 'General',
    taxRate: '',
    isOptional: false
  });
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showOverviewItems, setShowOverviewItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const richText = useRef<RichEditor>(null);

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '1',
      unitPrice: '0',
      category: 'General',
      taxRate: '',
      isOptional: false
    });
    setSearchQuery('');
    setShowProductSearch(false);
    setShowOverviewItems(false);
  };

  const handleSelectProduct = (product: typeof sampleProducts[0]) => {
    setFormData({
      ...formData,
      name: product.name,
      description: product.description,
      unitPrice: product.price.toString(),
      category: product.category,
    });
    // Set HTML content in rich editor
    richText.current?.setContentHTML(product.description);
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const handleSelectOverviewItem = (item: any) => {
    setFormData({
      ...formData,
      name: item.name,
      description: item.description,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity.toString(),
      taxRate: item.taxRate ? item.taxRate.toString() : '',
    });
    // Set HTML content in rich editor
    richText.current?.setContentHTML(item.description);
    setShowOverviewItems(false);
  };

  const handleAdd = () => {
    onAdd({
      name: formData.name,
      description: formData.description,
      quantity: parseFloat(formData.quantity) || 1,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      category: formData.category,
      taxRate: parseFloat(formData.taxRate) || 0,
      isOptional: formData.isOptional
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.modalContainerFull}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeaderTight}>
            <Text style={styles.modalTitleCompact}>Add Line Item to Package</Text>
            <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
          >
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Item Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Painting Service"
            />
            
            {/* Products/Services Search Toggle */}
            <TouchableOpacity
              style={styles.searchToggleButton}
              onPress={() => {
                setShowProductSearch(!showProductSearch);
                if (showOverviewItems) setShowOverviewItems(false);
              }}
            >
              <Text style={styles.searchToggleText}>
                {showProductSearch ? 'Hide' : 'Search'} Products & Services
              </Text>
            </TouchableOpacity>

            {/* Search and Product List */}
            {showProductSearch && (
              <View style={styles.productSearchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                />
                <ScrollView style={styles.productList} nestedScrollEnabled={true}>
                  {filteredProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productItem}
                      onPress={() => handleSelectProduct(product)}
                    >
                      <View style={styles.productItemHeader}>
                        <Text style={styles.productItemName}>{product.name}</Text>
                        <Text style={styles.productItemPrice}>{formatCurrency(product.price)}</Text>
                      </View>
                      <View style={styles.productItemDescriptionContainer}>
                        <WebView
                          originWhitelist={['*']}
                          source={{ html: `
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                <style>
                                  body { 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                    font-size: 13px; 
                                    color: #6B7280; 
                                    margin: 0; 
                                    padding: 6px;
                                    line-height: 1.3;
                                  }
                                  p { margin: 0 0 6px 0; }
                                  ul { margin: 2px 0; padding-left: 18px; }
                                  li { margin: 1px 0; }
                                  strong { color: #111827; }
                                </style>
                              </head>
                              <body>${product.description}</body>
                            </html>
                          ` }}
                          style={styles.productItemDescriptionWebView}
                          scrollEnabled={false}
                          showsVerticalScrollIndicator={false}
                        />
                      </View>
                      <Text style={styles.productItemCategory}>{product.category}</Text>
                    </TouchableOpacity>
                  ))}
                  {filteredProducts.length === 0 && (
                    <Text style={styles.noResultsText}>No products found</Text>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Select from Overview Toggle */}
            {lineItems.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.searchToggleButton}
                  onPress={() => {
                    setShowOverviewItems(!showOverviewItems);
                    if (showProductSearch) setShowProductSearch(false);
                  }}
                >
                  <Text style={styles.searchToggleText}>
                    {showOverviewItems ? 'Hide' : 'Select from'} Overview Items
                  </Text>
                </TouchableOpacity>

                {/* Overview Items List */}
                {showOverviewItems && (
                  <View style={styles.productSearchContainer}>
                    <ScrollView style={styles.productList} nestedScrollEnabled={true}>
                      {lineItems.map((item: any) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.productItem}
                          onPress={() => handleSelectOverviewItem(item)}
                        >
                          <View style={styles.productItemHeader}>
                            <Text style={styles.productItemName}>{item.name}</Text>
                            <Text style={styles.productItemPrice}>{formatCurrency(item.totalPrice)}</Text>
                          </View>
                          <Text style={styles.productItemCategory}>
                            Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <View style={styles.richEditorContainer}>
              <RichToolbar
                editor={richText}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.heading1,
                  actions.heading2,
                  'highlight',
                ]}
                iconTint="#6366F1"
                selectedIconTint="#8B5CF6"
                disabledIconTint="#D1D5DB"
                style={styles.richToolbar}
                iconMap={{
                  highlight: () => <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>H</Text>,
                }}
              />
              <ScrollView style={styles.richEditorScroll} nestedScrollEnabled={true}>
                <RichEditor
                  ref={richText}
                  style={styles.richEditor}
                  initialContentHTML={formData.description}
                  onChange={(html) => setFormData({ ...formData, description: html })}
                  placeholder="Provide a detailed description with formatting..."
                  useContainer={false}
                  editorStyle={{
                    backgroundColor: '#FFFFFF',
                    color: '#111827',
                    placeholderColor: '#9CA3AF',
                    contentCSSText: 'font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 12px; min-height: 200px;',
                  }}
                />
              </ScrollView>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupThird}>
              <Text style={styles.formLabel}>Quantity</Text>
              <TextInput
                style={styles.formInput}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                placeholder="1"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.formGroupThird}>
              <Text style={styles.formLabel}>Unit Price</Text>
              <TextInput
                style={styles.formInput}
                value={formData.unitPrice}
                onChangeText={(text) => setFormData({ ...formData, unitPrice: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.formGroupThird}>
              <Text style={styles.formLabel}>Tax Rate (%)</Text>
              <TextInput
                style={styles.formInput}
                value={formData.taxRate}
                onChangeText={(text) => setFormData({ ...formData, taxRate: text })}
                placeholder="0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="General"
            />
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.recommendedToggle}
              onPress={() => setFormData({ ...formData, isOptional: !formData.isOptional })}
            >
              <View style={[
                styles.recommendedCheckbox,
                formData.isOptional && styles.recommendedCheckboxActive
              ]}>
                {formData.isOptional && (
                  <Check size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.recommendedLabel}>Optional Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.modalButtonCancel} onPress={onCancel}>
            <Text style={styles.modalButtonCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButtonPrimary, !formData.name.trim() && styles.modalButtonDisabled]} 
            onPress={handleAdd}
            disabled={!formData.name.trim()}
          >
            <Text style={styles.modalButtonPrimaryText}>Add Item</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

// Add Area Modal
interface AddAreaModalProps {
  visible: boolean;
  onAdd: (areaData: any) => void;
  onCancel: () => void;
}

const AddAreaModal: React.FC<AddAreaModalProps> = ({ visible, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalPrice: '0'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      totalPrice: '0'
    });
  };

  const handleAdd = () => {
    onAdd({
      name: formData.name,
      description: formData.description,
      totalPrice: parseFloat(formData.totalPrice) || 0
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Area to Package</Text>
          <TouchableOpacity onPress={onCancel}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Area Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Living Room, Kitchen"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe this area..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Total Price</Text>
            <TextInput
              style={styles.formInput}
              value={formData.totalPrice}
              onChangeText={(text) => setFormData({ ...formData, totalPrice: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.modalButtonCancel} onPress={onCancel}>
            <Text style={styles.modalButtonCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButtonPrimary, !formData.name.trim() && styles.modalButtonDisabled]} 
            onPress={handleAdd}
            disabled={!formData.name.trim()}
          >
            <Text style={styles.modalButtonPrimaryText}>Add Area</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Add Package Modal
interface AddPackageModalProps {
  visible: boolean;
  packageType: 'tier' | 'addon';
  onAdd: (packageData: Partial<ProposalPackage>) => void;
  onCancel: () => void;
}

const AddPackageModal: React.FC<AddPackageModalProps> = ({ visible, packageType, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0',
    isRecommended: false,
    color: '#6B7280',
    pricingModel: 'fixed' as 'fixed' | 'itemized' | 'itemized-with-adjustment',
    packageAdjustment: '0',
    showLineItemPrices: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '0',
      isRecommended: false,
      color: '#6B7280',
      pricingModel: 'fixed',
      packageAdjustment: '0',
      showLineItemPrices: false,
    });
  };

  const handleAdd = () => {
    onAdd({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      isRecommended: formData.isRecommended,
      color: formData.color,
      features: [],
      packageType: packageType,
      pricingModel: formData.pricingModel,
      packageAdjustment: parseFloat(formData.packageAdjustment) || 0,
      showLineItemPrices: formData.showLineItemPrices,
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Add New {packageType === 'tier' ? 'Tier' : 'Add-On'} Package
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBox}>
            <Info size={18} color="#6366F1" />
            <Text style={styles.infoBoxText}>
              {packageType === 'tier' 
                ? 'Tier packages are mutually exclusive - customer chooses one option (Good/Better/Best)'
                : 'Add-on packages are optional extras - customer can select multiple'
              }
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Package Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder={packageType === 'tier' ? 'e.g., Bronze, Silver, Gold' : 'e.g., Extended Warranty'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe what this package includes..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Pricing Model</Text>
            <View style={styles.pricingModelOptions}>
              <TouchableOpacity
                style={[
                  styles.pricingModelOption,
                  formData.pricingModel === 'fixed' && styles.pricingModelOptionActive
                ]}
                onPress={() => setFormData({ ...formData, pricingModel: 'fixed' })}
              >
                <View style={[
                  styles.radio,
                  formData.pricingModel === 'fixed' && styles.radioActive
                ]}>
                  {formData.pricingModel === 'fixed' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.pricingModelText}>
                  <Text style={styles.pricingModelLabel}>Fixed Price</Text>
                  <Text style={styles.pricingModelDesc}>Set a single flat price. Line items are for description only and don't affect the total.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pricingModelOption,
                  formData.pricingModel === 'itemized' && styles.pricingModelOptionActive
                ]}
                onPress={() => setFormData({ ...formData, pricingModel: 'itemized' })}
              >
                <View style={[
                  styles.radio,
                  formData.pricingModel === 'itemized' && styles.radioActive
                ]}>
                  {formData.pricingModel === 'itemized' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.pricingModelText}>
                  <Text style={styles.pricingModelLabel}>Itemized</Text>
                  <Text style={styles.pricingModelDesc}>Price is calculated by adding up all line items. Each item's quantity and unit price determine the total.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pricingModelOption,
                  formData.pricingModel === 'itemized-with-adjustment' && styles.pricingModelOptionActive
                ]}
                onPress={() => setFormData({ ...formData, pricingModel: 'itemized-with-adjustment' })}
              >
                <View style={[
                  styles.radio,
                  formData.pricingModel === 'itemized-with-adjustment' && styles.radioActive
                ]}>
                  {formData.pricingModel === 'itemized-with-adjustment' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.pricingModelText}>
                  <Text style={styles.pricingModelLabel}>Itemized + Adjustment</Text>
                  <Text style={styles.pricingModelDesc}>Like itemized, but add a discount or premium to the line items total (use negative for discounts).</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {formData.pricingModel === 'fixed' && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Fixed Price</Text>
              <TextInput
                style={styles.formInput}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          )}

          {formData.pricingModel === 'itemized-with-adjustment' && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Package Adjustment (negative for discount)</Text>
              <TextInput
                style={styles.formInput}
                value={formData.packageAdjustment}
                onChangeText={(text) => setFormData({ ...formData, packageAdjustment: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          )}

          {packageType === 'tier' && (
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.recommendedToggle}
                onPress={() => setFormData({ ...formData, isRecommended: !formData.isRecommended })}
              >
                <View style={[
                  styles.recommendedCheckbox,
                  formData.isRecommended && styles.recommendedCheckboxActive
                ]}>
                  {formData.isRecommended && (
                    <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.recommendedLabel}>Mark as Recommended</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.modalButtonCancel} onPress={onCancel}>
            <Text style={styles.modalButtonCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButtonPrimary, !formData.name.trim() && styles.modalButtonDisabled]} 
            onPress={handleAdd}
            disabled={!formData.name.trim()}
          >
            <Text style={styles.modalButtonPrimaryText}>Add Package</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Add Add-On Modal
interface AddAddOnModalProps {
  visible: boolean;
  onAdd: (addOnData: Partial<ProposalPackageAddOn>) => void;
  onCancel: () => void;
}

const AddAddOnModal: React.FC<AddAddOnModalProps> = ({ visible, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0',
    category: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '0',
      category: ''
    });
  };

  const handleAdd = () => {
    onAdd({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add New Option</Text>
          <TouchableOpacity onPress={onCancel}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Option Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Extended Warranty"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe this option..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Price</Text>
            <TextInput
              style={styles.formInput}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="e.g., Warranty, Service"
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.modalButtonCancel} onPress={onCancel}>
            <Text style={styles.modalButtonCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButtonPrimary, !formData.name.trim() && styles.modalButtonDisabled]} 
            onPress={handleAdd}
            disabled={!formData.name.trim()}
          >
            <Text style={styles.modalButtonPrimaryText}>Add Option</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyState: {
    margin: 20,
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    gap: 8,
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  templateButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  templateButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  packagesGrid: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  packageCardSelected: {
    borderColor: '#6366F1',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  packageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  packageHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  packageBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  badgeTier: {
    backgroundColor: '#EEF2FF',
  },
  badgeAddon: {
    backgroundColor: '#F5F3FF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  packageContent: {
    gap: 16,
  },
  packageDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  packageAdjustment: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -8,
  },
  packageDiscount: {
    color: '#10B981',
  },
  packagePremium: {
    color: '#F59E0B',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  itemsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  addItemsButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addItemButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  addItemButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    flexDirection: 'row',
    gap: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  selectButtonTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addOnsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  addOnsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  addOnsGrid: {
    gap: 12,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  addOnInfo: {
    flex: 1,
    marginRight: 12,
  },
  addOnName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addOnDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  addOnPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  addOnButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addOnButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  addOnButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  addOnButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#EFF6FF',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryContent: {
    gap: 8,
  },
  summarySectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
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
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366F1',
  },
  bottomSpacing: {
    height: 120,
  },
  // Edit Form Styles
  editForm: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formTextAreaLarge: {
    height: 140,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  formGroupThird: {
    flex: 1,
  },
  pricingModelOptions: {
    gap: 12,
  },
  pricingModelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  pricingModelOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F0F9FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: '#6366F1',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  pricingModelText: {
    flex: 1,
  },
  pricingModelLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  pricingModelDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  featureEditRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
  },
  featureRemoveButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  featureAddButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsHeaderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  packageItemsList: {
    gap: 12,
  },
  packageItemCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  packageItemContent: {
    flex: 1,
  },
  packageItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  packageItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    minWidth: 120,
  },
  packageItemTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    flexShrink: 0,
  },
  packageItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  packageItemTags: {
    flexDirection: 'row',
    gap: 6,
  },
  packageItemTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  packageItemTagOptional: {
    backgroundColor: '#DBEAFE',
  },
  packageItemTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  packageItemTagTextOptional: {
    color: '#2563EB',
  },
  packageItemRemove: {
    padding: 8,
    marginLeft: 8,
  },
  noItemsState: {
    alignItems: 'center',
    paddingVertical: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  noItemsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  noItemsSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recommendedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendedCheckboxActive: {
    backgroundColor: '#EAB308',
    borderColor: '#EAB308',
  },
  recommendedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  formButtonCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  formButtonCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  formButtonSave: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6366F1',
  },
  formButtonSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6366F1',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 16,
    gap: 10,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  // Enhanced Modal Styles
  modalContainerFull: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeaderTight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitleCompact: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchToggleButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
  },
  searchToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  productSearchContainer: {
    marginTop: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  productList: {
    maxHeight: 300,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  productItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
    marginLeft: 10,
  },
  productItemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  productItemDescriptionContainer: {
    height: 100,
    marginBottom: 8,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  productItemDescriptionWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  productItemCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    paddingVertical: 20,
  },
  formTextAreaRich: {
    height: 180,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    lineHeight: 22,
  },
  formTextAreaExpanded: {
    minHeight: 220,
    maxHeight: 400,
    textAlignVertical: 'top',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    lineHeight: 24,
    fontSize: 15,
  },
  // Rich Text Editor Styles
  richEditorContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  richToolbar: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 50,
  },
  richEditorScroll: {
    maxHeight: 450,
    minHeight: 350,
  },
  richEditor: {
    flex: 1,
    minHeight: 350,
    backgroundColor: '#FFFFFF',
  },
  // Preview Section Styles
  previewSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewPackageCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  previewPackageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    gap: 8,
  },
  previewPackageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    flex: 1,
  },
  previewItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  previewItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  previewItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  previewItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  previewItemDetails: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  previewItemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  previewPackageTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
  },
  previewPackageTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  previewPackageTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
  },
});
