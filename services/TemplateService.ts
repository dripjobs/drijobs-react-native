import { Template, TemplateType, TermsAndConditions, TEMPLATE_TYPE_LABELS } from '@/types/templates';
import { getDefaultTemplate } from '@/utils/defaultTemplates';
import { getKeywordsForTemplate } from '@/utils/templateKeywords';

class TemplateService {
  private templates: Map<string, Template> = new Map();
  private termsAndConditions: Map<string, TermsAndConditions> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  // Initialize all templates with default content
  private initializeDefaultTemplates() {
    const templateTypes: TemplateType[] = [
      'terms_and_conditions',
      'proposal_email',
      'proposal_sms',
      'invoice_email',
      'invoice_sms',
      'receipt_email',
      'payment_request_email',
      'payment_request_sms',
      'invoice_fineprint',
      'appointment_scheduled_email',
      'appointment_rescheduled_email',
      'appointment_scheduled_sms',
      'appointment_rescheduled_sms',
      'job_scheduled_email',
      'job_rescheduled_email',
      'job_scheduled_sms',
      'job_rescheduled_sms',
      'work_order_email',
      'work_order_sms',
      'change_order_email',
      'change_order_sms',
      'secret_work_order_email',
      'secret_work_order_sms',
      'on_site_estimate_scheduled_email',
      'on_site_estimate_scheduled_sms',
      'booking_form_email',
      'booking_form_sms',
      'confirmation_email_template',
      'confirmation_sms_template',
      'resolve_email_template',
      'resolve_sms_template',
      'financing_offers_received_email',
      'financing_approved_estimate_accepted_email',
      'financing_approved_estimate_pending_email',
    ];

    const categoryMap: Record<TemplateType, string> = {
      terms_and_conditions: 'terms',
      proposal_email: 'proposals',
      proposal_sms: 'proposals',
      invoice_email: 'invoices',
      invoice_sms: 'invoices',
      receipt_email: 'invoices',
      payment_request_email: 'invoices',
      payment_request_sms: 'invoices',
      invoice_fineprint: 'invoices',
      appointment_scheduled_email: 'appointments',
      appointment_rescheduled_email: 'appointments',
      appointment_scheduled_sms: 'appointments',
      appointment_rescheduled_sms: 'appointments',
      job_scheduled_email: 'jobs',
      job_rescheduled_email: 'jobs',
      job_scheduled_sms: 'jobs',
      job_rescheduled_sms: 'jobs',
      work_order_email: 'work_orders',
      work_order_sms: 'work_orders',
      change_order_email: 'change_orders',
      change_order_sms: 'change_orders',
      secret_work_order_email: 'change_orders',
      secret_work_order_sms: 'change_orders',
      on_site_estimate_scheduled_email: 'estimates',
      on_site_estimate_scheduled_sms: 'estimates',
      booking_form_email: 'booking_forms',
      booking_form_sms: 'booking_forms',
      confirmation_email_template: 'confirmations',
      confirmation_sms_template: 'confirmations',
      resolve_email_template: 'resolutions',
      resolve_sms_template: 'resolutions',
      financing_offers_received_email: 'financing',
      financing_approved_estimate_accepted_email: 'financing',
      financing_approved_estimate_pending_email: 'financing',
    };

    templateTypes.forEach((type) => {
      if (type === 'terms_and_conditions') {
        // Create default T&C
        this.createTermsAndConditions('Standard', getDefaultTemplate(type), true);
      } else {
        const template = this.createTemplate(
          type,
          categoryMap[type] as any,
          getDefaultTemplate(type)
        );
        if (template) {
          this.templates.set(template.id, template);
        }
      }
    });
  }

  // Create a new template
  createTemplate(
    type: TemplateType,
    category: string,
    content: string,
    isActive: boolean = true
  ): Template {
    const id = this.generateId();
    const keywords = getKeywordsForTemplate(type);

    const template: Template = {
      id,
      name: TEMPLATE_TYPE_LABELS[type],
      type,
      category: category as any,
      content,
      availableKeywords: keywords.map((k) => k.key),
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(id, template);
    return template;
  }

  // Get a template by ID
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  // Get a template by type
  getTemplateByType(type: TemplateType): Template | undefined {
    return Array.from(this.templates.values()).find((t) => t.type === type);
  }

  // Get all templates
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // Get templates by category
  getTemplatesByCategory(category: string): Template[] {
    return Array.from(this.templates.values())
      .filter((t) => t.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Update a template
  updateTemplate(id: string, updates: Partial<Template>): Template | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const updatedTemplate: Template = {
      ...template,
      ...updates,
      id: template.id, // Ensure ID doesn't change
      type: template.type, // Ensure type doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  // Delete a template
  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // Reset a template to default content
  resetTemplateToDefault(id: string): Template | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const defaultContent = getDefaultTemplate(template.type);
    return this.updateTemplate(id, { content: defaultContent });
  }

  // Search templates
  searchTemplates(query: string): Template[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.type.toLowerCase().includes(lowerQuery) ||
        t.content.toLowerCase().includes(lowerQuery)
    );
  }

  // Terms & Conditions Management

  // Create a new Terms & Conditions variation
  createTermsAndConditions(
    variationName: string,
    content: string,
    isDefault: boolean = false
  ): TermsAndConditions {
    const id = this.generateId();
    const keywords = getKeywordsForTemplate('terms_and_conditions');

    // If this is set as default, unset all others
    if (isDefault) {
      this.termsAndConditions.forEach((tc) => {
        tc.isDefault = false;
      });
    }

    const termsAndConditions: TermsAndConditions = {
      id,
      name: `Terms and Conditions - ${variationName}`,
      type: 'terms_and_conditions',
      category: 'terms',
      content,
      variationName,
      isDefault,
      availableKeywords: keywords.map((k) => k.key),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.termsAndConditions.set(id, termsAndConditions);
    return termsAndConditions;
  }

  // Get all Terms & Conditions variations
  getAllTermsAndConditions(): TermsAndConditions[] {
    return Array.from(this.termsAndConditions.values()).sort((a, b) => {
      // Default first
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return a.variationName.localeCompare(b.variationName);
    });
  }

  // Get default Terms & Conditions
  getDefaultTermsAndConditions(): TermsAndConditions | undefined {
    return Array.from(this.termsAndConditions.values()).find((tc) => tc.isDefault);
  }

  // Get a Terms & Conditions by ID
  getTermsAndConditionsById(id: string): TermsAndConditions | undefined {
    return this.termsAndConditions.get(id);
  }

  // Update Terms & Conditions
  updateTermsAndConditions(
    id: string,
    updates: Partial<TermsAndConditions>
  ): TermsAndConditions | null {
    const tc = this.termsAndConditions.get(id);
    if (!tc) return null;

    // If setting as default, unset all others
    if (updates.isDefault === true) {
      this.termsAndConditions.forEach((otherTc) => {
        if (otherTc.id !== id) {
          otherTc.isDefault = false;
        }
      });
    }

    const updatedTC: TermsAndConditions = {
      ...tc,
      ...updates,
      id: tc.id, // Ensure ID doesn't change
      type: 'terms_and_conditions', // Ensure type doesn't change
      category: 'terms', // Ensure category doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.termsAndConditions.set(id, updatedTC);
    return updatedTC;
  }

  // Set a Terms & Conditions as default
  setDefaultTermsAndConditions(id: string): TermsAndConditions | null {
    return this.updateTermsAndConditions(id, { isDefault: true });
  }

  // Delete a Terms & Conditions
  deleteTermsAndConditions(id: string): { success: boolean; error?: string } {
    const tc = this.termsAndConditions.get(id);
    if (!tc) {
      return { success: false, error: 'Terms & Conditions not found' };
    }

    // Cannot delete default T&C without setting another as default first
    if (tc.isDefault && this.termsAndConditions.size > 1) {
      return {
        success: false,
        error: 'Cannot delete the default Terms & Conditions. Please set another variation as default first.',
      };
    }

    // Cannot delete the last T&C
    if (this.termsAndConditions.size === 1) {
      return {
        success: false,
        error: 'Cannot delete the last Terms & Conditions. At least one variation must exist.',
      };
    }

    this.termsAndConditions.delete(id);
    return { success: true };
  }

  // Helper: Generate a unique ID
  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Render a template with actual values
  renderTemplate(templateId: string, values: Record<string, string>): string {
    const template = this.templates.get(templateId);
    if (!template) {
      const tc = this.termsAndConditions.get(templateId);
      if (!tc) return '';
      return this.replaceKeywords(tc.content, values);
    }
    return this.replaceKeywords(template.content, values);
  }

  // Replace keywords in content with actual values
  private replaceKeywords(content: string, values: Record<string, string>): string {
    let result = content;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  }
}

// Export singleton instance
const templateService = new TemplateService();
export default templateService;

