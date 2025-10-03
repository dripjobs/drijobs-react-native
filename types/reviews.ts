export interface ReviewSource {
  id: string;
  name: string;
  type: 'google' | 'facebook' | 'yelp' | 'other';
  url: string;
  isActive: boolean;
  apiKey?: string;
  reviewCount: number;
  averageRating: number;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  sourceId: string;
  sourceName: string;
  externalId: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  content: string;
  isVerified: boolean;
  isResponded: boolean;
  responseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  sourceId: string;
  sourceName: string;
  response: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'textarea';
  question: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface ReviewLink {
  id: string;
  sourceId: string;
  sourceName: string;
  url: string;
  icon: string;
  order: number;
}

export interface HighRatingRedirect {
  enabled: boolean;
  title: string;
  message: string;
  reviewLinks: ReviewLink[];
}

export interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  questions: ReviewQuestion[];
}

export interface LowRatingRedirect {
  enabled: boolean;
  title: string;
  message: string;
  feedbackForm: FeedbackForm;
}

export interface RedirectSettings {
  highRatingRedirect: HighRatingRedirect;
  lowRatingRedirect: LowRatingRedirect;
}

export interface InternalReviewForm {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  questions: ReviewQuestion[];
  redirectSettings: RedirectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSubmissionResponse {
  questionId: string;
  question: string;
  answer: string | number;
  type: string;
}

export interface InternalReviewSubmission {
  id: string;
  formId: string;
  customerEmail: string;
  customerName: string;
  jobId: string;
  responses: ReviewSubmissionResponse[];
  overallRating: number;
  status: 'pending' | 'redirected' | 'completed';
  redirectType?: 'high_rating' | 'low_rating';
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackSubmission {
  id: string;
  formId: string;
  customerEmail: string;
  customerName: string;
  jobId: string;
  responses: ReviewSubmissionResponse[];
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  recentReviews: Review[];
  topReviewSources: {
    sourceId: string;
    sourceName: string;
    reviewCount: number;
    averageRating: number;
  }[];
  responseRate: number;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface NotificationSettings {
  newReviewEmail: boolean;
  newReviewSms: boolean;
  lowRatingAlert: boolean;
  lowRatingThreshold: number;
}

export interface ResponseSettings {
  requireApproval: boolean;
  defaultResponseTemplate: string;
}

export interface ReviewSettings {
  id: string;
  autoRespondEnabled: boolean;
  autoRespondTemplate: string;
  notificationSettings: NotificationSettings;
  responseSettings: ResponseSettings;
}
