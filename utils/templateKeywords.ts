import { TemplateKeyword, TemplateKeywordGroup, TemplateType } from '@/types/templates';

// All available keywords grouped by category
export const TEMPLATE_KEYWORDS: TemplateKeyword[] = [
  // Contact Keywords
  {
    key: 'contact.firstName',
    label: 'Contact First Name',
    description: "The contact's first name",
    example: 'John',
    category: 'contact',
  },
  {
    key: 'contact.lastName',
    label: 'Contact Last Name',
    description: "The contact's last name",
    example: 'Smith',
    category: 'contact',
  },
  {
    key: 'contact.fullName',
    label: 'Contact Full Name',
    description: "The contact's full name",
    example: 'John Smith',
    category: 'contact',
  },
  {
    key: 'contact.email',
    label: 'Contact Email',
    description: "The contact's email address",
    example: 'john.smith@example.com',
    category: 'contact',
  },
  {
    key: 'contact.phone',
    label: 'Contact Phone',
    description: "The contact's phone number",
    example: '(555) 123-4567',
    category: 'contact',
  },
  {
    key: 'contact.address',
    label: 'Contact Address',
    description: "The contact's full address",
    example: '123 Main St, Atlanta, GA 30301',
    category: 'contact',
  },

  // Business Keywords
  {
    key: 'business.name',
    label: 'Business Name',
    description: 'The business name for this contact',
    example: 'Acme Corporation',
    category: 'business',
  },
  {
    key: 'business.phone',
    label: 'Business Phone',
    description: 'The business phone number',
    example: '(555) 987-6543',
    category: 'business',
  },
  {
    key: 'business.address',
    label: 'Business Address',
    description: 'The business full address',
    example: '456 Business Blvd, Atlanta, GA 30302',
    category: 'business',
  },

  // Company/System Keywords
  {
    key: 'company.name',
    label: 'Company Name',
    description: 'Your company name',
    example: 'DripJobs Demo Co.',
    category: 'system',
  },
  {
    key: 'company.phone',
    label: 'Company Phone',
    description: 'Your company phone number',
    example: '(555) 123-4567',
    category: 'system',
  },
  {
    key: 'company.email',
    label: 'Company Email',
    description: 'Your company email address',
    example: 'hello@dripjobs.com',
    category: 'system',
  },
  {
    key: 'company.website',
    label: 'Company Website',
    description: 'Your company website URL',
    example: 'https://dripjobs.com',
    category: 'system',
  },
  {
    key: 'company.address',
    label: 'Company Address',
    description: 'Your company physical address',
    example: '123 Main St, Atlanta, GA 30301',
    category: 'system',
  },

  // Invoice Keywords
  {
    key: 'invoice.number',
    label: 'Invoice Number',
    description: 'The invoice number',
    example: 'INV-1234',
    category: 'invoice',
  },
  {
    key: 'invoice.date',
    label: 'Invoice Date',
    description: 'The invoice creation date',
    example: 'January 15, 2025',
    category: 'invoice',
  },
  {
    key: 'invoice.dueDate',
    label: 'Invoice Due Date',
    description: 'The invoice payment due date',
    example: 'January 30, 2025',
    category: 'invoice',
  },
  {
    key: 'invoice.total',
    label: 'Invoice Total',
    description: 'The total invoice amount',
    example: '$1,250.00',
    category: 'invoice',
  },
  {
    key: 'invoice.subtotal',
    label: 'Invoice Subtotal',
    description: 'The invoice subtotal (before tax)',
    example: '$1,150.00',
    category: 'invoice',
  },
  {
    key: 'invoice.tax',
    label: 'Invoice Tax',
    description: 'The invoice tax amount',
    example: '$100.00',
    category: 'invoice',
  },
  {
    key: 'invoice.balance',
    label: 'Invoice Balance',
    description: 'The remaining balance due',
    example: '$500.00',
    category: 'invoice',
  },

  // Payment Keywords
  {
    key: 'payment.amount',
    label: 'Payment Amount',
    description: 'The payment amount',
    example: '$750.00',
    category: 'payment',
  },
  {
    key: 'payment.method',
    label: 'Payment Method',
    description: 'The payment method used',
    example: 'Credit Card',
    category: 'payment',
  },
  {
    key: 'payment.date',
    label: 'Payment Date',
    description: 'The payment date',
    example: 'January 20, 2025',
    category: 'payment',
  },

  // Appointment Keywords
  {
    key: 'appointment.date',
    label: 'Appointment Date',
    description: 'The appointment date',
    example: 'January 25, 2025',
    category: 'appointment',
  },
  {
    key: 'appointment.time',
    label: 'Appointment Time',
    description: 'The appointment time',
    example: '2:00 PM',
    category: 'appointment',
  },
  {
    key: 'appointment.duration',
    label: 'Appointment Duration',
    description: 'The appointment expected duration',
    example: '1 hour',
    category: 'appointment',
  },
  {
    key: 'appointment.type',
    label: 'Appointment Type',
    description: 'The type of appointment',
    example: 'Estimate',
    category: 'appointment',
  },
  {
    key: 'appointment.address',
    label: 'Appointment Address',
    description: 'The appointment location address',
    example: '123 Main St, Atlanta, GA 30301',
    category: 'appointment',
  },
  {
    key: 'appointment.notes',
    label: 'Appointment Notes',
    description: 'Any notes about the appointment',
    example: 'Please bring paint samples',
    category: 'appointment',
  },

  // Job Keywords
  {
    key: 'job.number',
    label: 'Job Number',
    description: 'The job number',
    example: 'JOB-5678',
    category: 'job',
  },
  {
    key: 'job.title',
    label: 'Job Title',
    description: 'The job title or description',
    example: 'Exterior Painting',
    category: 'job',
  },
  {
    key: 'job.date',
    label: 'Job Date',
    description: 'The scheduled job date',
    example: 'February 1, 2025',
    category: 'job',
  },
  {
    key: 'job.time',
    label: 'Job Time',
    description: 'The scheduled job time',
    example: '8:00 AM',
    category: 'job',
  },
  {
    key: 'job.address',
    label: 'Job Address',
    description: 'The job location address',
    example: '123 Main St, Atlanta, GA 30301',
    category: 'job',
  },
  {
    key: 'job.crew',
    label: 'Job Crew',
    description: 'The crew assigned to the job',
    example: 'Team Alpha',
    category: 'job',
  },
  {
    key: 'job.estimatedDuration',
    label: 'Job Estimated Duration',
    description: 'The estimated job duration',
    example: '2 days',
    category: 'job',
  },
  {
    key: 'job.total',
    label: 'Job Total',
    description: 'The total job amount',
    example: '$2,500.00',
    category: 'job',
  },

  // Action Keywords (special links/buttons)
  {
    key: 'view-invoice',
    label: 'View Invoice Link',
    description: 'A clickable link to view the invoice',
    example: '<a href="...">View Invoice</a>',
    category: 'actions',
  },
  {
    key: 'pay-invoice',
    label: 'Pay Invoice Link',
    description: 'A clickable link to pay the invoice',
    example: '<a href="...">Pay Now</a>',
    category: 'actions',
  },
  {
    key: 'view-proposal',
    label: 'View Proposal Link',
    description: 'A clickable link to view the proposal',
    example: '<a href="...">View Proposal</a>',
    category: 'actions',
  },
  {
    key: 'accept-proposal',
    label: 'Accept Proposal Link',
    description: 'A clickable link to accept the proposal',
    example: '<a href="...">Accept Proposal</a>',
    category: 'actions',
  },
  {
    key: 'reschedule-link',
    label: 'Reschedule Link',
    description: 'A clickable link to reschedule',
    example: '<a href="...">Reschedule</a>',
    category: 'actions',
  },
  {
    key: 'confirm-appointment',
    label: 'Confirm Appointment Link',
    description: 'A clickable link to confirm the appointment',
    example: '<a href="...">Confirm Appointment</a>',
    category: 'actions',
  },
  {
    key: 'payment-link',
    label: 'Payment Link',
    description: 'A clickable link to make a payment',
    example: '<a href="...">Make Payment</a>',
    category: 'actions',
  },
  {
    key: 'booking-form-link',
    label: 'Booking Form Link',
    description: 'A clickable link to the booking form',
    example: '<a href="...">Book Now</a>',
    category: 'actions',
  },
];

// Group keywords by category for display
export function getKeywordsByCategory(): TemplateKeywordGroup[] {
  const groups: Record<string, TemplateKeyword[]> = {};

  TEMPLATE_KEYWORDS.forEach((keyword) => {
    if (!groups[keyword.category]) {
      groups[keyword.category] = [];
    }
    groups[keyword.category].push(keyword);
  });

  const categoryLabels: Record<string, string> = {
    contact: 'Contact Information',
    business: 'Business Information',
    system: 'Company Information',
    invoice: 'Invoice Details',
    payment: 'Payment Details',
    appointment: 'Appointment Details',
    job: 'Job Details',
    actions: 'Action Links',
  };

  return Object.entries(groups).map(([category, keywords]) => ({
    category: categoryLabels[category] || category,
    keywords,
  }));
}

// Get keywords relevant to a specific template type
export function getKeywordsForTemplate(templateType: TemplateType): TemplateKeyword[] {
  const keywordMap: Record<TemplateType, string[]> = {
    terms_and_conditions: ['company.name', 'company.phone', 'company.email', 'company.address'],
    
    proposal_email: [
      'contact.firstName',
      'contact.fullName',
      'company.name',
      'view-proposal',
      'accept-proposal',
    ],
    proposal_sms: ['contact.firstName', 'company.name', 'view-proposal'],
    
    invoice_email: [
      'contact.firstName',
      'contact.fullName',
      'invoice.number',
      'invoice.date',
      'invoice.dueDate',
      'invoice.total',
      'invoice.balance',
      'view-invoice',
      'pay-invoice',
      'company.name',
    ],
    invoice_sms: [
      'contact.firstName',
      'invoice.number',
      'invoice.total',
      'invoice.balance',
      'pay-invoice',
      'company.name',
    ],
    receipt_email: [
      'contact.firstName',
      'contact.fullName',
      'invoice.number',
      'payment.amount',
      'payment.method',
      'payment.date',
      'invoice.balance',
      'company.name',
    ],
    payment_request_email: [
      'contact.firstName',
      'invoice.number',
      'invoice.balance',
      'payment-link',
      'company.name',
    ],
    payment_request_sms: [
      'contact.firstName',
      'invoice.number',
      'invoice.balance',
      'payment-link',
    ],
    invoice_fineprint: ['company.name', 'company.phone', 'company.email', 'invoice.dueDate'],
    
    appointment_scheduled_email: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.type',
      'appointment.address',
      'appointment.duration',
      'appointment.notes',
      'reschedule-link',
      'confirm-appointment',
      'company.name',
      'company.phone',
    ],
    appointment_rescheduled_email: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.type',
      'appointment.address',
      'reschedule-link',
      'company.name',
      'company.phone',
    ],
    appointment_scheduled_sms: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.address',
      'company.name',
    ],
    appointment_rescheduled_sms: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.address',
      'company.name',
    ],
    
    job_scheduled_email: [
      'contact.firstName',
      'job.number',
      'job.title',
      'job.date',
      'job.time',
      'job.address',
      'job.crew',
      'job.estimatedDuration',
      'company.name',
      'company.phone',
    ],
    job_rescheduled_email: [
      'contact.firstName',
      'job.number',
      'job.title',
      'job.date',
      'job.time',
      'job.address',
      'company.name',
      'company.phone',
    ],
    job_scheduled_sms: [
      'contact.firstName',
      'job.number',
      'job.date',
      'job.time',
      'job.address',
      'company.name',
    ],
    job_rescheduled_sms: [
      'contact.firstName',
      'job.number',
      'job.date',
      'job.time',
      'company.name',
    ],
    
    work_order_email: [
      'contact.firstName',
      'job.number',
      'job.title',
      'job.date',
      'job.address',
      'job.crew',
      'company.name',
    ],
    work_order_sms: ['contact.firstName', 'job.number', 'job.date', 'company.name'],
    
    change_order_email: [
      'contact.firstName',
      'job.number',
      'job.title',
      'invoice.total',
      'company.name',
    ],
    change_order_sms: ['contact.firstName', 'job.number', 'company.name'],
    secret_work_order_email: [
      'contact.firstName',
      'job.number',
      'job.title',
      'job.date',
      'company.name',
    ],
    secret_work_order_sms: ['contact.firstName', 'job.number', 'company.name'],
    
    on_site_estimate_scheduled_email: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.address',
      'confirm-appointment',
      'reschedule-link',
      'company.name',
      'company.phone',
    ],
    on_site_estimate_scheduled_sms: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'appointment.address',
      'company.name',
    ],
    
    booking_form_email: [
      'contact.firstName',
      'booking-form-link',
      'company.name',
      'company.phone',
    ],
    booking_form_sms: ['contact.firstName', 'booking-form-link', 'company.name'],
    
    confirmation_email_template: [
      'contact.firstName',
      'appointment.date',
      'appointment.time',
      'company.name',
    ],
    confirmation_sms_template: ['contact.firstName', 'appointment.date', 'appointment.time'],
    
    resolve_email_template: ['contact.firstName', 'company.name', 'company.phone'],
    resolve_sms_template: ['contact.firstName', 'company.name'],
    
    financing_offers_received_email: [
      'contact.firstName',
      'job.title',
      'job.total',
      'company.name',
    ],
    financing_approved_estimate_accepted_email: [
      'contact.firstName',
      'job.title',
      'job.total',
      'company.name',
    ],
    financing_approved_estimate_pending_email: [
      'contact.firstName',
      'job.title',
      'job.total',
      'company.name',
    ],
  };

  const relevantKeywordKeys = keywordMap[templateType] || [];
  return TEMPLATE_KEYWORDS.filter((keyword) =>
    relevantKeywordKeys.includes(keyword.key)
  );
}

// Format a keyword for insertion (with double curly braces)
export function formatKeyword(key: string): string {
  return `{{${key}}}`;
}

// Extract keywords from template content
export function extractKeywordsFromContent(content: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = content.matchAll(regex);
  return Array.from(matches, (match) => match[1]);
}

// Validate that a template has required keywords
export function validateTemplateKeywords(
  content: string,
  requiredKeywords: string[]
): { valid: boolean; missing: string[] } {
  const usedKeywords = extractKeywordsFromContent(content);
  const missing = requiredKeywords.filter((key) => !usedKeywords.includes(key));
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Replace keywords in template with actual values
export function replaceKeywords(
  content: string,
  values: Record<string, string>
): string {
  let result = content;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
}


