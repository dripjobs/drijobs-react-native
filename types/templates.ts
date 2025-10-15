export type TemplateType =
  // Terms & Conditions
  | 'terms_and_conditions'
  // Proposals
  | 'proposal_email'
  | 'proposal_sms'
  // Invoices
  | 'invoice_email'
  | 'invoice_sms'
  | 'receipt_email'
  | 'payment_request_email'
  | 'payment_request_sms'
  | 'invoice_fineprint'
  // Appointments
  | 'appointment_scheduled_email'
  | 'appointment_rescheduled_email'
  | 'appointment_scheduled_sms'
  | 'appointment_rescheduled_sms'
  // Jobs
  | 'job_scheduled_email'
  | 'job_rescheduled_email'
  | 'job_scheduled_sms'
  | 'job_rescheduled_sms'
  // Work Orders
  | 'work_order_email'
  | 'work_order_sms'
  // Change Orders
  | 'change_order_email'
  | 'change_order_sms'
  | 'secret_work_order_email'
  | 'secret_work_order_sms'
  // Estimates
  | 'on_site_estimate_scheduled_email'
  | 'on_site_estimate_scheduled_sms'
  // Booking Forms
  | 'booking_form_email'
  | 'booking_form_sms'
  // Confirmations
  | 'confirmation_email_template'
  | 'confirmation_sms_template'
  // Resolutions
  | 'resolve_email_template'
  | 'resolve_sms_template'
  // Financing
  | 'financing_offers_received_email'
  | 'financing_approved_estimate_accepted_email'
  | 'financing_approved_estimate_pending_email';

export type TemplateCategory =
  | 'terms'
  | 'proposals'
  | 'invoices'
  | 'appointments'
  | 'jobs'
  | 'work_orders'
  | 'change_orders'
  | 'estimates'
  | 'booking_forms'
  | 'confirmations'
  | 'resolutions'
  | 'financing';

export interface TemplateKeyword {
  key: string;
  label: string;
  description: string;
  example: string;
  category: 'contact' | 'business' | 'invoice' | 'appointment' | 'job' | 'payment' | 'system' | 'actions';
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  category: TemplateCategory;
  content: string; // HTML content
  availableKeywords: string[]; // Array of keyword keys available for this template
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermsAndConditions extends Template {
  variationName: string; // e.g., "Standard", "Residential", "Commercial"
  isDefault: boolean;
}

export interface TemplateKeywordGroup {
  category: string;
  keywords: TemplateKeyword[];
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  terms: 'Terms & Conditions',
  proposals: 'Proposals',
  invoices: 'Invoices & Payments',
  appointments: 'Appointments',
  jobs: 'Job Scheduling',
  work_orders: 'Work Orders',
  change_orders: 'Change Orders',
  estimates: 'Estimates',
  booking_forms: 'Booking Forms',
  confirmations: 'Confirmations',
  resolutions: 'Resolutions',
  financing: 'Financing',
};

export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  terms_and_conditions: 'Terms and Conditions',
  proposal_email: 'Proposal Email',
  proposal_sms: 'Proposal SMS',
  invoice_email: 'Invoice Email',
  invoice_sms: 'Invoice SMS',
  receipt_email: 'Receipt Email',
  payment_request_email: 'Payment Request Email',
  payment_request_sms: 'Payment Request SMS',
  invoice_fineprint: 'Invoice Fineprint',
  appointment_scheduled_email: 'Appointment Scheduled Email',
  appointment_rescheduled_email: 'Appointment Re-Scheduled Email',
  appointment_scheduled_sms: 'Appointment Scheduled SMS',
  appointment_rescheduled_sms: 'Appointment Re-Scheduled SMS',
  job_scheduled_email: 'Job Scheduled Email',
  job_rescheduled_email: 'Job Re-Scheduled Email',
  job_scheduled_sms: 'Job Scheduled SMS',
  job_rescheduled_sms: 'Job Re-Scheduled SMS',
  work_order_email: 'Work Order Email',
  work_order_sms: 'Work Order SMS',
  change_order_email: 'Change Order Email',
  change_order_sms: 'Change Order SMS',
  secret_work_order_email: 'Secret Work Order Email',
  secret_work_order_sms: 'Secret Work Order SMS',
  on_site_estimate_scheduled_email: 'On Site Estimate Scheduled Email',
  on_site_estimate_scheduled_sms: 'On Site Estimate Scheduled SMS',
  booking_form_email: 'Booking Form Email',
  booking_form_sms: 'Booking Form SMS',
  confirmation_email_template: 'Confirmation Email Template',
  confirmation_sms_template: 'Confirmation SMS Template',
  resolve_email_template: 'Resolve Email Template',
  resolve_sms_template: 'Resolve SMS Template',
  financing_offers_received_email: 'Financing Offers Received Email',
  financing_approved_estimate_accepted_email: 'Financing Approved (Estimate Accepted) Email',
  financing_approved_estimate_pending_email: 'Financing Approved (Estimate Pending) Email',
};

