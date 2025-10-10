export interface ProductImage {
  id: string;
  url: string;
  fileName: string;
  fileSize: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

export interface ProductService {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  category: string;
  defaultQuantity: number;
  unitPrice: number;
  taxRate?: number;
  isActive: boolean;
  images: ProductImage[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUsed?: Date;
  useCount: number;
}

export interface ProductMetrics {
  totalProducts: number;
  totalServices: number;
  mostUsedProducts: ProductService[];
  recentlyAdded: ProductService[];
  averagePrice: number;
  totalValue: number;
}

export interface ProductFilters {
  category?: string;
  searchTerm?: string;
  isActive?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}
