export interface Website {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  subdomain: string;
  customDomain?: string;
  templateId: string;
  status: 'draft' | 'generating' | 'ready' | 'published' | 'offline';
  content: WebsiteContent;
  settings: WebsiteSettings;
  analytics: WebsiteAnalytics;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface WebsiteContent {
  businessName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutText: string;
  services: Service[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
  brandAssets: BrandAssets;
  seoMeta: SEOMeta;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceArea: string;
}

export interface BrandAssets {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  images: string[];
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}

export interface WebsiteSettings {
  bookingFormId?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customCSS?: string;
  enableChat: boolean;
  enableBooking: boolean;
  maintenanceMode: boolean;
}

export interface WebsiteAnalytics {
  totalVisits: number;
  totalFormSubmissions: number;
  bounceRate: number;
  averageTimeOnSite: number;
  topPages: PageAnalytics[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown;
  last30Days: DailyAnalytics[];
}

export interface PageAnalytics {
  path: string;
  views: number;
  averageTime: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface DailyAnalytics {
  date: string;
  visits: number;
  submissions: number;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  previewUrl: string;
  category: 'classic' | 'modern' | 'bold' | 'service' | 'trust';
  features: string[];
}

export interface WizardData {
  step: number;
  businessInfo?: {
    businessName: string;
    businessType: string;
    serviceArea: string;
    description: string;
  };
  brandAssets?: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    images: string[];
  };
  aiQuestions?: {
    yearsInBusiness: string;
    uniqueValue: string;
    primaryServices: string[];
    targetCustomer: string;
  };
  selectedTemplateId?: string;
  subdomain?: string;
  generatedContent?: Partial<WebsiteContent>;
}

export type BusinessType =
  | 'Painting'
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Landscaping'
  | 'Cleaning'
  | 'Roofing'
  | 'Fencing'
  | 'Handyman'
  | 'Pest Control'
  | 'Flooring'
  | 'Carpentry'
  | 'Masonry'
  | 'Pool Services'
  | 'Other';
