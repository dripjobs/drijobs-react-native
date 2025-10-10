import { ProductCategory, ProductImage, ProductMetrics, ProductService } from '../types/products';

class ProductsService {
  private products: ProductService[] = [];
  private categories: ProductCategory[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize categories
    this.categories = [
      {
        id: 'labor',
        name: 'Labor',
        description: 'Work and installation services',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        isActive: true
      },
      {
        id: 'materials',
        name: 'Materials',
        description: 'Physical products and supplies',
        color: 'bg-green-100 text-green-800 border-green-200',
        isActive: true
      },
      {
        id: 'service',
        name: 'Service',
        description: 'Professional services',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        isActive: true
      },
      {
        id: 'equipment',
        name: 'Equipment',
        description: 'Tools and equipment rental',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        isActive: true
      },
      {
        id: 'optional',
        name: 'Optional',
        description: 'Optional add-on services',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        isActive: true
      }
    ];

    // Initialize sample products
    this.products = [
      {
        id: 'prod-1',
        name: 'Exterior House Painting',
        description: 'Complete exterior house painting service',
        detailedDescription: 'Professional exterior painting including surface preparation, primer application, and two coats of premium paint. Includes trim work and cleanup.',
        category: 'Service',
        defaultQuantity: 1,
        unitPrice: 3500,
        taxRate: 8.5,
        isActive: true,
        images: [
          {
            id: 'img-1',
            url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            fileName: 'exterior-painting-1.jpg',
            fileSize: '2.4 MB',
            isPrimary: true,
            uploadedAt: new Date(2024, 0, 15)
          },
          {
            id: 'img-2',
            url: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
            fileName: 'exterior-painting-2.jpg',
            fileSize: '1.8 MB',
            isPrimary: false,
            uploadedAt: new Date(2024, 0, 15)
          }
        ],
        tags: ['Exterior', 'Painting', 'Residential'],
        createdAt: new Date(2024, 0, 15),
        updatedAt: new Date(2024, 0, 15),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 10),
        useCount: 15
      },
      {
        id: 'prod-2',
        name: 'Interior Room Painting',
        description: 'Single room interior painting service',
        detailedDescription: 'Professional interior painting for one room including wall preparation, primer, and two coats of paint. Includes ceiling and trim if requested.',
        category: 'Service',
        defaultQuantity: 1,
        unitPrice: 450,
        taxRate: 8.5,
        isActive: true,
        images: [
          {
            id: 'img-3',
            url: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
            fileName: 'interior-painting.jpg',
            fileSize: '2.1 MB',
            isPrimary: true,
            uploadedAt: new Date(2024, 0, 20)
          }
        ],
        tags: ['Interior', 'Painting', 'Residential'],
        createdAt: new Date(2024, 0, 20),
        updatedAt: new Date(2024, 0, 20),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 8),
        useCount: 22
      },
      {
        id: 'prod-3',
        name: 'Premium Paint (per gallon)',
        description: 'High-quality exterior paint',
        detailedDescription: 'Premium acrylic latex paint suitable for exterior surfaces. Provides excellent coverage and durability with 15-year warranty.',
        category: 'Materials',
        defaultQuantity: 5,
        unitPrice: 65,
        isActive: true,
        images: [],
        tags: ['Paint', 'Materials', 'Premium'],
        createdAt: new Date(2024, 0, 10),
        updatedAt: new Date(2024, 0, 10),
        createdBy: 'Tanner Mullen',
        useCount: 8
      },
      {
        id: 'prod-4',
        name: 'Pressure Washing Service',
        description: 'Complete exterior pressure washing',
        detailedDescription: 'Professional pressure washing of house exterior, driveway, walkways, and deck. Includes pre-treatment for stains and mildew.',
        category: 'Service',
        defaultQuantity: 1,
        unitPrice: 350,
        taxRate: 8.5,
        isActive: true,
        images: [
          {
            id: 'img-4',
            url: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800',
            fileName: 'pressure-washing.jpg',
            fileSize: '1.9 MB',
            isPrimary: true,
            uploadedAt: new Date(2024, 0, 25)
          }
        ],
        tags: ['Pressure Washing', 'Cleaning', 'Exterior'],
        createdAt: new Date(2024, 0, 25),
        updatedAt: new Date(2024, 0, 25),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 5),
        useCount: 12
      },
      {
        id: 'prod-5',
        name: 'Deck Staining',
        description: 'Professional deck staining and sealing',
        detailedDescription: 'Complete deck staining service including cleaning, sanding, and application of premium stain and sealant. Includes 3-year warranty.',
        category: 'Service',
        defaultQuantity: 1,
        unitPrice: 800,
        taxRate: 8.5,
        isActive: true,
        images: [],
        tags: ['Deck', 'Staining', 'Wood'],
        createdAt: new Date(2024, 0, 30),
        updatedAt: new Date(2024, 0, 30),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 12),
        useCount: 6
      },
      {
        id: 'prod-6',
        name: 'Premium Stain (per gallon)',
        description: 'High-quality deck and fence stain',
        detailedDescription: 'Premium oil-based stain for decks, fences, and outdoor wood surfaces. UV resistant with 5-year warranty.',
        category: 'Materials',
        defaultQuantity: 3,
        unitPrice: 45,
        isActive: true,
        images: [],
        tags: ['Stain', 'Materials', 'Wood'],
        createdAt: new Date(2024, 0, 30),
        updatedAt: new Date(2024, 0, 30),
        createdBy: 'Tanner Mullen',
        useCount: 4
      },
      {
        id: 'prod-7',
        name: 'Equipment Rental - Pressure Washer',
        description: 'Commercial pressure washer rental',
        detailedDescription: 'Professional grade pressure washer rental. Includes delivery, setup, and pickup. 3000 PSI, hot water capability.',
        category: 'Equipment',
        defaultQuantity: 1,
        unitPrice: 150,
        isActive: true,
        images: [],
        tags: ['Equipment', 'Rental', 'Pressure Washer'],
        createdAt: new Date(2024, 1, 1),
        updatedAt: new Date(2024, 1, 1),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 15),
        useCount: 3
      },
      {
        id: 'prod-8',
        name: 'Extended Warranty',
        description: 'Additional 2-year warranty extension',
        detailedDescription: 'Extended warranty coverage for all work performed. Covers materials and labor for an additional 2 years beyond standard warranty.',
        category: 'Optional',
        defaultQuantity: 1,
        unitPrice: 250,
        isActive: true,
        images: [],
        tags: ['Warranty', 'Optional', 'Service'],
        createdAt: new Date(2024, 1, 5),
        updatedAt: new Date(2024, 1, 5),
        createdBy: 'Tanner Mullen',
        lastUsed: new Date(2024, 1, 18),
        useCount: 8
      }
    ];
  }

  getProducts(): ProductService[] {
    return [...this.products];
  }

  getProductById(id: string): ProductService | null {
    return this.products.find(p => p.id === id) || null;
  }

  getAllProducts(): ProductService[] {
    return [...this.products];
  }

  getProductsByCategory(category: string): ProductService[] {
    return this.products.filter(p => p.category === category);
  }

  getCategories(): ProductCategory[] {
    return [...this.categories];
  }

  createProduct(productData: Omit<ProductService, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>): ProductService {
    const newProduct: ProductService = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      useCount: 0
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductService>): ProductService | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  addImageToProduct(productId: string, image: Omit<ProductImage, 'id' | 'uploadedAt'>): ProductImage | null {
    const product = this.getProductById(productId);
    if (!product) return null;

    const newImage: ProductImage = {
      ...image,
      id: `img-${Date.now()}`,
      uploadedAt: new Date()
    };

    // If this is set as primary, remove primary from other images
    if (newImage.isPrimary) {
      product.images.forEach(img => img.isPrimary = false);
    }

    product.images.push(newImage);
    product.updatedAt = new Date();
    return newImage;
  }

  removeImageFromProduct(productId: string, imageId: string): boolean {
    const product = this.getProductById(productId);
    if (!product) return false;

    const imageIndex = product.images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return false;

    product.images.splice(imageIndex, 1);
    product.updatedAt = new Date();
    return true;
  }

  incrementUseCount(productId: string): void {
    const product = this.getProductById(productId);
    if (product) {
      product.useCount += 1;
      product.lastUsed = new Date();
      product.updatedAt = new Date();
    }
  }

  getMetrics(): ProductMetrics {
    const activeProducts = this.products.filter(p => p.isActive);
    const services = activeProducts.filter(p => p.category === 'Service');
    const materials = activeProducts.filter(p => p.category !== 'Service');

    const mostUsed = [...activeProducts]
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, 5);

    const recentlyAdded = [...activeProducts]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const totalValue = activeProducts.reduce((sum, p) => sum + (p.unitPrice * p.defaultQuantity), 0);
    const averagePrice = activeProducts.length > 0 ? totalValue / activeProducts.length : 0;

    return {
      totalProducts: materials.length,
      totalServices: services.length,
      mostUsedProducts: mostUsed,
      recentlyAdded,
      averagePrice,
      totalValue
    };
  }

  searchProducts(searchTerm: string): ProductService[] {
    const term = searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
}

export const productsService = new ProductsService();
