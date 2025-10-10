import DrawerMenu from '@/components/DrawerMenu';
import ProductModal from '@/components/ProductModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { productsService } from '@/services/ProductsService';
import { ProductCategory, ProductService } from '@/types/products';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ChevronRight,
    Edit,
    Filter,
    Package,
    Plus,
    Search,
    TrendingUp,
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

export default function Products() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<ProductService[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductService[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductService | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products, activeTab]);

  const loadProducts = () => {
    const allProducts = productsService.getAllProducts();
    setProducts(allProducts);
  };

  const loadCategories = () => {
    const allCategories = productsService.getCategories();
    setCategories(allCategories);
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by type (products vs services)
    if (activeTab === 'products') {
      filtered = filtered.filter(product => product.category !== 'Service');
    } else {
      filtered = filtered.filter(product => product.category === 'Service');
    }

    if (searchQuery) {
      filtered = productsService.searchProducts(searchQuery);
      // Re-apply type filter after search
      if (activeTab === 'products') {
        filtered = filtered.filter(product => product.category !== 'Service');
      } else {
        filtered = filtered.filter(product => product.category === 'Service');
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Service':
        return <TrendingUp size={20} color="#6366F1" />;
      case 'Materials':
        return <Package size={20} color="#10B981" />;
      case 'Labor':
        return <TrendingUp size={20} color="#F59E0B" />;
      case 'Equipment':
        return <Package size={20} color="#8B5CF6" />;
      case 'Optional':
        return <Package size={20} color="#6B7280" />;
      default:
        return <Package size={20} color="#6B7280" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case 'Service':
        return '#6366F1';
      case 'Materials':
        return '#10B981';
      case 'Labor':
        return '#F59E0B';
      case 'Equipment':
        return '#8B5CF6';
      case 'Optional':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const handleProductPress = (product: ProductService) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = () => {
    if (selectedProduct) {
      setShowProductDetailModal(false);
      setShowProductModal(true);
    }
  };

  const handleSaveProduct = (product: ProductService) => {
    loadProducts();
    setShowProductModal(false);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            productsService.deleteProduct(selectedProduct.id);
            loadProducts();
            setShowProductDetailModal(false);
            Alert.alert('Success', 'Product deleted successfully');
          }
        }
      ]
    );
  };

  React.useEffect(() => {
    setIsTransparent(false);
    return () => setIsTransparent(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.gradientHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products & Services</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Products/Services Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'products' && styles.toggleButtonActive]}
            onPress={() => setActiveTab('products')}
          >
            <Package size={16} color={activeTab === 'products' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.toggleButtonText, activeTab === 'products' && styles.toggleButtonTextActive]}>
              Products
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'services' && styles.toggleButtonActive]}
            onPress={() => setActiveTab('services')}
          >
            <TrendingUp size={16} color={activeTab === 'services' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} />
            <Text style={[styles.toggleButtonText, activeTab === 'services' && styles.toggleButtonTextActive]}>
              Services
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            onPress={() => setSelectedCategory('')}
          >
            <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryChip, selectedCategory === category.name && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category.name && styles.categoryChipTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Create New Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateProduct}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>
            Create New {activeTab === 'products' ? 'Product' : 'Service'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products/Services List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        onScrollBeginDrag={() => setIsTransparent(true)}
        onScrollEndDrag={() => setIsTransparent(false)}
        onMomentumScrollBegin={() => setIsTransparent(true)}
        onMomentumScrollEnd={() => setIsTransparent(false)}
      >
        <View style={styles.itemsList}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              {activeTab === 'products' ? (
                <Package size={48} color="#9CA3AF" />
              ) : (
                <TrendingUp size={48} color="#9CA3AF" />
              )}
              <Text style={styles.emptyStateTitle}>
                No {activeTab} found
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search' : `No ${activeTab} match the selected filters`}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.productContent}>
                  <View style={styles.productLeft}>
                    <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(product.category) }]}>
                      {getCategoryIcon(product.category)}
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {product.description}
                      </Text>
                      <View style={styles.productMeta}>
                        <Text style={styles.productCategory}>{product.category}</Text>
                        <Text style={styles.productPrice}>{formatCurrency(product.unitPrice)}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.productRight}>
                    <View style={styles.useCountContainer}>
                      <TrendingUp size={14} color="#6366F1" />
                      <Text style={styles.useCountText}>{product.useCount}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.openButton}
                  onPress={() => handleProductPress(product)}
                >
                  <Text style={styles.openButtonText}>View Details</Text>
                  <ChevronRight size={14} color="#6366F1" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Product Creation/Edit Modal */}
      <ProductModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      {/* Product Detail Modal */}
      <Modal
        visible={showProductDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProductDetailModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowProductDetailModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Product Details</Text>
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={handleEditProduct}
            >
              <Edit size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedProduct && (
              <>
                {/* Product Header */}
                <View style={styles.productHeader}>
                  <View style={[styles.productHeaderIcon, { backgroundColor: getCategoryColor(selectedProduct.category) }]}>
                    {getCategoryIcon(selectedProduct.category)}
                  </View>
                  <View style={styles.productHeaderInfo}>
                    <Text style={styles.productHeaderName}>{selectedProduct.name}</Text>
                    <Text style={styles.productHeaderCategory}>{selectedProduct.category}</Text>
                    <Text style={styles.productHeaderPrice}>
                      {formatCurrency(selectedProduct.unitPrice)}
                    </Text>
                  </View>
                </View>

                {/* Product Stats */}
                <View style={styles.productStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedProduct.useCount}</Text>
                    <Text style={styles.statLabel}>Times Used</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedProduct.defaultQuantity}</Text>
                    <Text style={styles.statLabel}>Default Qty</Text>
                  </View>
                </View>

                {/* Product Description */}
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedProduct.detailedDescription || selectedProduct.description}
                  </Text>
                </View>

                {/* Tags */}
                {selectedProduct.tags.length > 0 && (
                  <View style={styles.tagsSection}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagsContainer}>
                      {selectedProduct.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradientHeader: {
    paddingBottom: 20,
    zIndex: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backdropFilter: 'blur(10px)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryFilter: {
    marginBottom: 0,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
    zIndex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  itemsList: {
    paddingTop: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  productRight: {
    alignItems: 'flex-end',
  },
  useCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  useCountText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    gap: 6,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
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
  moreButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  productHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productHeaderInfo: {
    flex: 1,
  },
  productHeaderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  productHeaderCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  productHeaderPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});