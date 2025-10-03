import {
    FeedbackSubmission,
    InternalReviewForm,
    InternalReviewSubmission,
    Review,
    ReviewAnalytics,
    ReviewResponse,
    ReviewSettings,
    ReviewSource
} from '../types/reviews';

// Mock data for demonstration
const mockReviewSources: ReviewSource[] = [
  {
    id: '1',
    name: 'Google My Business',
    type: 'google',
    url: 'https://google.com/business',
    isActive: true,
    apiKey: 'google_api_key_123',
    reviewCount: 45,
    averageRating: 4.2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Facebook',
    type: 'facebook',
    url: 'https://facebook.com/business',
    isActive: true,
    reviewCount: 32,
    averageRating: 4.5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Yelp',
    type: 'yelp',
    url: 'https://yelp.com/business',
    isActive: false,
    reviewCount: 18,
    averageRating: 3.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    sourceId: '1',
    sourceName: 'Google My Business',
    externalId: 'google_123',
    authorName: 'John Smith',
    authorEmail: 'john@example.com',
    rating: 5,
    title: 'Excellent Service',
    content: 'Amazing work! The team was professional and completed the job on time.',
    isVerified: true,
    isResponded: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    sourceId: '2',
    sourceName: 'Facebook',
    externalId: 'fb_456',
    authorName: 'Sarah Johnson',
    authorEmail: 'sarah@example.com',
    rating: 4,
    title: 'Good Experience',
    content: 'Good service overall. Would recommend to others.',
    isVerified: true,
    isResponded: true,
    responseId: 'resp_1',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    sourceId: '1',
    sourceName: 'Google My Business',
    externalId: 'google_789',
    authorName: 'Mike Wilson',
    authorEmail: 'mike@example.com',
    rating: 2,
    title: 'Disappointed',
    content: 'The work was not up to my expectations. Poor communication.',
    isVerified: true,
    isResponded: false,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

const mockInternalReviewForms: InternalReviewForm[] = [
  {
    id: '1',
    name: 'Standard Customer Satisfaction Survey',
    description: 'Our standard survey to measure customer satisfaction after job completion',
    isActive: true,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How would you rate the overall quality of our work?',
        required: true,
        order: 1
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'How would you rate our communication throughout the project?',
        required: true,
        order: 2
      },
      {
        id: 'q3',
        type: 'text',
        question: 'What did you like most about our service?',
        required: false,
        order: 3
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'Would you recommend us to friends and family?',
        required: true,
        options: ['Yes', 'No', 'Maybe'],
        order: 4
      }
    ],
    redirectSettings: {
      highRatingRedirect: {
        enabled: true,
        title: 'Thank you for your feedback!',
        message: 'We\'re thrilled you had a great experience. Would you mind leaving us a review on one of these platforms?',
        reviewLinks: [
          {
            id: 'link1',
            sourceId: '1',
            sourceName: 'Google',
            url: 'https://google.com/review',
            icon: 'google',
            order: 1
          },
          {
            id: 'link2',
            sourceId: '2',
            sourceName: 'Facebook',
            url: 'https://facebook.com/review',
            icon: 'facebook',
            order: 2
          }
        ]
      },
      lowRatingRedirect: {
        enabled: true,
        title: 'We\'d like to hear more',
        message: 'We\'re sorry your experience wasn\'t perfect. Please let us know how we can improve.',
        feedbackForm: {
          id: 'feedback1',
          title: 'Help Us Improve',
          description: 'Your feedback helps us provide better service to future customers.',
          questions: [
            {
              id: 'fq1',
              type: 'textarea',
              question: 'What could we have done better?',
              required: true,
              order: 1
            },
            {
              id: 'fq2',
              type: 'text',
              question: 'What was the main issue you encountered?',
              required: true,
              order: 2
            },
            {
              id: 'fq3',
              type: 'multiple_choice',
              question: 'How likely are you to give us another chance?',
              required: true,
              options: ['Very likely', 'Somewhat likely', 'Not likely', 'Definitely not'],
              order: 3
            }
          ]
        }
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockReviewResponses: ReviewResponse[] = [
  {
    id: 'resp_1',
    reviewId: '2',
    sourceId: '2',
    sourceName: 'Facebook',
    response: 'Thank you for your feedback, Sarah! We\'re glad you had a good experience with us.',
    isPublic: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  }
];

const mockInternalReviewSubmissions: InternalReviewSubmission[] = [
  {
    id: 'sub1',
    formId: '1',
    customerEmail: 'customer@example.com',
    customerName: 'Jane Doe',
    jobId: 'job_123',
    responses: [
      {
        questionId: 'q1',
        question: 'How would you rate the overall quality of our work?',
        answer: 5,
        type: 'rating'
      },
      {
        questionId: 'q2',
        question: 'How would you rate our communication throughout the project?',
        answer: 4,
        type: 'rating'
      },
      {
        questionId: 'q3',
        question: 'What did you like most about our service?',
        answer: 'The team was very professional and completed the work on time.',
        type: 'text'
      },
      {
        questionId: 'q4',
        question: 'Would you recommend us to friends and family?',
        answer: 'Yes',
        type: 'multiple_choice'
      }
    ],
    overallRating: 4.5,
    status: 'redirected',
    redirectType: 'high_rating',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockFeedbackSubmissions: FeedbackSubmission[] = [
  {
    id: 'feedback1',
    formId: 'feedback1',
    customerEmail: 'unhappy@example.com',
    customerName: 'Bob Wilson',
    jobId: 'job_456',
    responses: [
      {
        questionId: 'fq1',
        question: 'What could we have done better?',
        answer: 'Better communication about project timeline',
        type: 'textarea'
      },
      {
        questionId: 'fq2',
        question: 'What was the main issue you encountered?',
        answer: 'Delays in project completion',
        type: 'text'
      },
      {
        questionId: 'fq3',
        question: 'How likely are you to give us another chance?',
        answer: 'Somewhat likely',
        type: 'multiple_choice'
      }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  }
];

export class ReviewsService {
  // Review Sources
  static async getReviewSources(): Promise<ReviewSource[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReviewSources;
  }

  static async createReviewSource(source: Omit<ReviewSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewSource> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSource: ReviewSource = {
      ...source,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockReviewSources.push(newSource);
    return newSource;
  }

  static async updateReviewSource(id: string, updates: Partial<ReviewSource>): Promise<ReviewSource> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockReviewSources.findIndex(source => source.id === id);
    if (index === -1) throw new Error('Review source not found');
    
    mockReviewSources[index] = {
      ...mockReviewSources[index],
      ...updates,
      updatedAt: new Date()
    };
    return mockReviewSources[index];
  }

  static async deleteReviewSource(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockReviewSources.findIndex(source => source.id === id);
    if (index === -1) throw new Error('Review source not found');
    mockReviewSources.splice(index, 1);
  }

  static async syncReviewSource(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const source = mockReviewSources.find(s => s.id === id);
    if (source) {
      source.lastSync = new Date();
      source.reviewCount += Math.floor(Math.random() * 5);
    }
  }

  // Reviews
  static async getReviews(filters?: {
    sourceId?: string;
    rating?: number;
    isResponded?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Review[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredReviews = [...mockReviews];
    
    if (filters?.sourceId) {
      filteredReviews = filteredReviews.filter(review => review.sourceId === filters.sourceId);
    }
    if (filters?.rating) {
      filteredReviews = filteredReviews.filter(review => review.rating === filters.rating);
    }
    if (filters?.isResponded !== undefined) {
      filteredReviews = filteredReviews.filter(review => review.isResponded === filters.isResponded);
    }
    if (filters?.dateFrom) {
      filteredReviews = filteredReviews.filter(review => review.createdAt >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      filteredReviews = filteredReviews.filter(review => review.createdAt <= filters.dateTo!);
    }
    
    return filteredReviews;
  }

  static async getReview(id: string): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const review = mockReviews.find(r => r.id === id);
    if (!review) throw new Error('Review not found');
    return review;
  }

  // Review Responses
  static async getReviewResponses(reviewId?: string): Promise<ReviewResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (reviewId) {
      return mockReviewResponses.filter(response => response.reviewId === reviewId);
    }
    return mockReviewResponses;
  }

  static async createReviewResponse(response: Omit<ReviewResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newResponse: ReviewResponse = {
      ...response,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockReviewResponses.push(newResponse);
    
    // Update review as responded
    const review = mockReviews.find(r => r.id === response.reviewId);
    if (review) {
      review.isResponded = true;
      review.responseId = newResponse.id;
    }
    
    return newResponse;
  }

  // Internal Review Forms
  static async getInternalReviewForms(): Promise<InternalReviewForm[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInternalReviewForms;
  }

  static async createInternalReviewForm(form: Omit<InternalReviewForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<InternalReviewForm> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newForm: InternalReviewForm = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockInternalReviewForms.push(newForm);
    return newForm;
  }

  static async updateInternalReviewForm(id: string, updates: Partial<InternalReviewForm>): Promise<InternalReviewForm> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockInternalReviewForms.findIndex(form => form.id === id);
    if (index === -1) throw new Error('Review form not found');
    
    mockInternalReviewForms[index] = {
      ...mockInternalReviewForms[index],
      ...updates,
      updatedAt: new Date()
    };
    return mockInternalReviewForms[index];
  }

  static async deleteInternalReviewForm(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockInternalReviewForms.findIndex(form => form.id === id);
    if (index === -1) throw new Error('Review form not found');
    mockInternalReviewForms.splice(index, 1);
  }

  // Internal Review Submissions
  static async getInternalReviewSubmissions(): Promise<InternalReviewSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInternalReviewSubmissions;
  }

  static async createInternalReviewSubmission(submission: Omit<InternalReviewSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<InternalReviewSubmission> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSubmission: InternalReviewSubmission = {
      ...submission,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockInternalReviewSubmissions.push(newSubmission);
    return newSubmission;
  }

  // Feedback Submissions
  static async getFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFeedbackSubmissions;
  }

  static async updateFeedbackSubmission(id: string, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockFeedbackSubmissions.findIndex(submission => submission.id === id);
    if (index === -1) throw new Error('Feedback submission not found');
    
    mockFeedbackSubmissions[index] = {
      ...mockFeedbackSubmissions[index],
      ...updates,
      updatedAt: new Date()
    };
    return mockFeedbackSubmissions[index];
  }

  // Analytics
  static async getReviewAnalytics(): Promise<ReviewAnalytics> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalReviews = mockReviews.length;
    const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = mockReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });
    
    const recentReviews = mockReviews
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    
    const topReviewSources = mockReviewSources
      .map(source => ({
        sourceId: source.id,
        sourceName: source.name,
        reviewCount: source.reviewCount,
        averageRating: source.averageRating
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);
    
    const responseRate = (mockReviews.filter(r => r.isResponded).length / totalReviews) * 100;
    
    const sentimentAnalysis = {
      positive: mockReviews.filter(r => r.rating >= 4).length,
      neutral: mockReviews.filter(r => r.rating === 3).length,
      negative: mockReviews.filter(r => r.rating <= 2).length
    };
    
    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews,
      topReviewSources,
      responseRate,
      sentimentAnalysis
    };
  }

  // Settings
  static async getReviewSettings(): Promise<ReviewSettings> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 'settings1',
      autoRespondEnabled: false,
      autoRespondTemplate: 'Thank you for your review! We appreciate your feedback.',
      notificationSettings: {
        newReviewEmail: true,
        newReviewSms: false,
        lowRatingAlert: true,
        lowRatingThreshold: 3
      },
      responseSettings: {
        requireApproval: true,
        defaultResponseTemplate: 'Thank you for your feedback. We value your input and will use it to improve our services.'
      }
    };
  }

  static async updateReviewSettings(settings: Partial<ReviewSettings>): Promise<ReviewSettings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentSettings = await this.getReviewSettings();
    return {
      ...currentSettings,
      ...settings
    };
  }
}
