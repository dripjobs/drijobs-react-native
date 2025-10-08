import { Website, WebsiteContent, WebsiteTemplate, WizardData } from '@/types/website';

// Mock data for development - will be replaced with actual API calls
const MOCK_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Clean, traditional layout perfect for established businesses',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=Classic+Professional',
    previewUrl: 'https://via.placeholder.com/1200x800?text=Classic+Professional',
    category: 'classic',
    features: ['Hero Banner', 'Service Grid', 'Testimonials', 'Contact Form']
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Minimalist design with bold typography and clean lines',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=Modern+Minimal',
    previewUrl: 'https://via.placeholder.com/1200x800?text=Modern+Minimal',
    category: 'modern',
    features: ['Bold Typography', 'Minimalist Layout', 'Smooth Animations', 'Mobile First']
  },
  {
    id: 'bold-dynamic',
    name: 'Bold & Dynamic',
    description: 'High-impact visuals with engaging animations',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=Bold+Dynamic',
    previewUrl: 'https://via.placeholder.com/1200x800?text=Bold+Dynamic',
    category: 'bold',
    features: ['Video Background', 'Dynamic Animations', 'Image Gallery', 'Interactive Elements']
  },
  {
    id: 'service-focused',
    name: 'Service Focused',
    description: 'Showcase your services with detailed grid layout',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=Service+Focused',
    previewUrl: 'https://via.placeholder.com/1200x800?text=Service+Focused',
    category: 'service',
    features: ['Service Showcase', 'Pricing Cards', 'FAQ Section', 'Before/After Gallery']
  },
  {
    id: 'trust-builder',
    name: 'Trust Builder',
    description: 'Build credibility with prominent reviews and testimonials',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=Trust+Builder',
    previewUrl: 'https://via.placeholder.com/1200x800?text=Trust+Builder',
    category: 'trust',
    features: ['Review Showcase', 'Trust Badges', 'Team Photos', 'Case Studies']
  }
];

class WebsiteService {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Get all templates
  async getTemplates(): Promise<WebsiteTemplate[]> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/templates`).then(res => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TEMPLATES), 300);
    });
  }

  // Get user's website
  async getUserWebsite(userId: string): Promise<Website | null> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites?userId=${userId}`).then(res => res.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 300);
    });
  }

  // Create new website
  async createWebsite(data: Partial<Website>): Promise<Website> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    const newWebsite: Website = {
      id: `website-${Date.now()}`,
      userId: data.userId || 'user-1',
      businessName: data.businessName || '',
      businessType: data.businessType || '',
      subdomain: data.subdomain || '',
      templateId: data.templateId || '',
      status: 'draft',
      content: data.content || this.getEmptyContent(),
      settings: data.settings || this.getDefaultSettings(),
      analytics: data.analytics || this.getEmptyAnalytics(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newWebsite), 500);
    });
  }

  // Update website
  async updateWebsite(id: string, data: Partial<Website>): Promise<Website> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...data, id, updatedAt: new Date().toISOString() } as Website), 500);
    });
  }

  // Generate AI content
  async generateContent(wizardData: WizardData): Promise<Partial<WebsiteContent>> {
    // TODO: Replace with actual AI API call (OpenAI/Anthropic)
    // const response = await fetch(`${this.baseUrl}/websites/generate-content`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(wizardData)
    // });
    // return response.json();

    const { businessInfo, aiQuestions } = wizardData;
    
    // Mock AI-generated content
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          businessName: businessInfo?.businessName || '',
          tagline: `${businessInfo?.serviceArea}'s Most Trusted ${businessInfo?.businessType} Experts`,
          heroHeadline: `Professional ${businessInfo?.businessType} Services in ${businessInfo?.serviceArea}`,
          heroSubheadline: `${aiQuestions?.yearsInBusiness || '10+'} years of excellence. ${aiQuestions?.uniqueValue || 'Quality workmanship guaranteed.'} Book your free consultation today!`,
          aboutTitle: `About ${businessInfo?.businessName}`,
          aboutText: `${businessInfo?.businessName} has been proudly serving ${businessInfo?.serviceArea} for ${aiQuestions?.yearsInBusiness || 'over 10'} years. ${businessInfo?.description || 'We specialize in delivering top-quality service.'} ${aiQuestions?.uniqueValue || 'Our commitment to excellence and customer satisfaction sets us apart.'}`,
          services: (aiQuestions?.primaryServices || []).map((service, index) => ({
            id: `service-${index}`,
            title: service,
            description: `Expert ${service.toLowerCase()} services tailored to your needs. Our experienced team delivers quality results on time and within budget.`,
          })),
          testimonials: [
            {
              id: 'test-1',
              name: 'John Smith',
              text: `Outstanding service! ${businessInfo?.businessName} exceeded our expectations. Professional, reliable, and great quality work.`,
              rating: 5,
              date: new Date().toISOString(),
            },
            {
              id: 'test-2',
              name: 'Sarah Johnson',
              text: 'Highly recommend! The team was professional, on-time, and did an excellent job. Will definitely use them again.',
              rating: 5,
              date: new Date().toISOString(),
            }
          ],
          seoMeta: {
            title: `${businessInfo?.businessName} | ${businessInfo?.businessType} Services in ${businessInfo?.serviceArea}`,
            description: `Professional ${businessInfo?.businessType?.toLowerCase()} services in ${businessInfo?.serviceArea}. ${aiQuestions?.yearsInBusiness || '10+'} years of experience. Free quotes. Call today!`,
            keywords: [
              businessInfo?.businessType?.toLowerCase() || '',
              businessInfo?.serviceArea?.toLowerCase() || '',
              `${businessInfo?.businessType?.toLowerCase()} services`,
              `${businessInfo?.serviceArea?.toLowerCase()} ${businessInfo?.businessType?.toLowerCase()}`,
              ...(aiQuestions?.primaryServices || []).map(s => s.toLowerCase())
            ],
            ogTitle: `${businessInfo?.businessName} - ${businessInfo?.businessType} Experts`,
            ogDescription: `Trusted ${businessInfo?.businessType?.toLowerCase()} services in ${businessInfo?.serviceArea}. Book your free consultation today!`,
          }
        });
      }, 2000); // Simulate AI generation time
    });
  }

  // Publish website
  async publishWebsite(id: string): Promise<{ success: boolean; url: string }> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites/${id}/publish`, {
    //   method: 'POST'
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          url: `https://${id}.dripjobs.io`
        });
      }, 1500);
    });
  }

  // Delete website
  async deleteWebsite(id: string): Promise<{ success: boolean }> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  }

  // Check subdomain availability
  async checkSubdomainAvailability(subdomain: string): Promise<{ available: boolean }> {
    // TODO: Replace with actual API call
    // return fetch(`${this.baseUrl}/websites/check-subdomain?subdomain=${subdomain}`)
    //   .then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: Subdomains with numbers are "taken"
        const available = !subdomain.match(/\d/);
        resolve({ available });
      }, 300);
    });
  }

  // Update subdomain
  async updateSubdomain(id: string, subdomain: string): Promise<Website> {
    // TODO: Replace with actual API call
    return this.updateWebsite(id, { subdomain });
  }

  // Get website analytics
  async getAnalytics(id: string): Promise<any> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalVisits: 1247,
          totalFormSubmissions: 89,
          bounceRate: 32.5,
          averageTimeOnSite: 145,
          topPages: [
            { path: '/', views: 856, averageTime: 120 },
            { path: '/services', views: 324, averageTime: 180 },
            { path: '/contact', views: 234, averageTime: 90 }
          ],
          trafficSources: [
            { source: 'Direct', visits: 498, percentage: 40 },
            { source: 'Google', visits: 374, percentage: 30 },
            { source: 'Facebook', visits: 249, percentage: 20 },
            { source: 'Other', visits: 126, percentage: 10 }
          ],
          deviceBreakdown: {
            mobile: 623,
            desktop: 498,
            tablet: 126
          },
          last30Days: this.generateMockDailyAnalytics()
        });
      }, 500);
    });
  }

  // Generate subdomain from business name
  generateSubdomain(businessName: string): string {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30);
  }

  // Helper methods for default data
  private getEmptyContent(): WebsiteContent {
    return {
      businessName: '',
      tagline: '',
      heroHeadline: '',
      heroSubheadline: '',
      aboutTitle: '',
      aboutText: '',
      services: [],
      testimonials: [],
      contactInfo: {
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        serviceArea: '',
      },
      brandAssets: {
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',
        accentColor: '#A855F7',
        images: [],
      },
      seoMeta: {
        title: '',
        description: '',
        keywords: [],
        ogTitle: '',
        ogDescription: '',
      },
    };
  }

  private getDefaultSettings() {
    return {
      enableChat: false,
      enableBooking: true,
      maintenanceMode: false,
    };
  }

  private getEmptyAnalytics() {
    return {
      totalVisits: 0,
      totalFormSubmissions: 0,
      bounceRate: 0,
      averageTimeOnSite: 0,
      topPages: [],
      trafficSources: [],
      deviceBreakdown: {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      },
      last30Days: [],
    };
  }

  private generateMockDailyAnalytics() {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        visits: Math.floor(Math.random() * 100) + 20,
        submissions: Math.floor(Math.random() * 10),
      });
    }
    return data;
  }
}

export default new WebsiteService();
