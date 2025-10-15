import { TemplateType } from '@/types/templates';

// Default subject lines for email templates
export const DEFAULT_SUBJECTS: Partial<Record<TemplateType, string>> = {
  terms_and_conditions: 'Terms and Conditions',
  proposal_email: 'Your Proposal from {{company.name}} is Ready',
  invoice_email: 'Invoice #{{invoice.number}} from {{company.name}}',
  receipt_email: 'Payment Receipt - {{company.name}}',
  payment_request_email: 'Payment Reminder - Invoice #{{invoice.number}}',
  appointment_scheduled_email: 'Appointment Confirmed - {{appointment.date}}',
  appointment_rescheduled_email: 'Appointment Rescheduled - {{appointment.date}}',
  job_scheduled_email: 'Job Scheduled - {{job.title}}',
  job_rescheduled_email: 'Job Rescheduled - {{job.title}}',
  work_order_email: 'Work Order - {{job.title}}',
  change_order_email: 'Change Order Request - {{job.title}}',
  secret_work_order_email: 'Work Order Update',
  on_site_estimate_scheduled_email: 'On-Site Estimate Scheduled',
  booking_form_email: 'Schedule Your Service with {{company.name}}',
  confirmation_email_template: 'Confirmation - {{company.name}}',
  resolve_email_template: 'Issue Resolution Update',
  financing_offers_received_email: 'Financing Options Available',
  financing_approved_estimate_accepted_email: 'Financing Approved!',
  financing_approved_estimate_pending_email: 'Financing Approved - Next Steps',
};

// Default HTML templates for all template types
export const DEFAULT_TEMPLATES: Record<TemplateType, string> = {
  // Terms & Conditions
  terms_and_conditions: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
      <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Terms and Conditions</h1>
      
      <h2 style="color: #34495e; margin-top: 30px;">1. Payment Terms</h2>
      <p>Payment is due upon completion of work unless otherwise agreed in writing. We accept cash, check, credit card, and ACH transfers. A deposit may be required for larger projects.</p>
      
      <h2 style="color: #34495e; margin-top: 30px;">2. Warranty</h2>
      <p>All work is guaranteed for one year from the date of completion. This warranty covers defects in workmanship but does not cover damage from normal wear and tear, improper use, or external factors.</p>
      
      <h2 style="color: #34495e; margin-top: 30px;">3. Cancellation Policy</h2>
      <p>Cancellations must be made at least 48 hours in advance. Late cancellations may be subject to a cancellation fee.</p>
      
      <h2 style="color: #34495e; margin-top: 30px;">4. Liability</h2>
      <p>{{company.name}} carries full liability insurance. We are not responsible for damage to property caused by pre-existing conditions or factors beyond our control.</p>
      
      <h2 style="color: #34495e; margin-top: 30px;">5. Changes to Work</h2>
      <p>Any changes to the agreed scope of work must be approved in writing and may result in additional charges.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #7f8c8d;">
        <p><strong>{{company.name}}</strong><br>
        {{company.phone}}<br>
        {{company.email}}<br>
        {{company.address}}</p>
      </div>
    </div>
  `,

  // Proposals
  proposal_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">New Proposal Available</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you for considering {{company.name}} for your project. We've prepared a detailed proposal for you based on our discussion.</p>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 6px; margin: 25px 0; text-align: center;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Your proposal is ready to review</p>
          <a href="{{view-proposal}}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Proposal</a>
        </div>
        
        <p>The proposal includes:</p>
        <ul style="line-height: 1.8;">
          <li>Detailed scope of work</li>
          <li>Itemized pricing</li>
          <li>Project timeline</li>
          <li>Terms and conditions</li>
        </ul>
        
        <p>If you have any questions or would like to discuss the proposal, please don't hesitate to reach out. We're here to help!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            Best regards,<br>
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  proposal_sms: `Hi {{contact.firstName}}, your proposal from {{company.name}} is ready! View it here: {{view-proposal}}`,

  // Invoices
  invoice_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Invoice #{{invoice.number}}</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you for choosing {{company.name}}! Your invoice is now ready.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Invoice Number:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{invoice.number}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Invoice Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{invoice.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Due Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{invoice.dueDate}}</td>
            </tr>
            <tr style="border-top: 2px solid #ddd;">
              <td style="padding: 12px 0 8px 0; font-size: 18px; font-weight: bold;">Amount Due:</td>
              <td style="padding: 12px 0 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #27ae60;">{{invoice.balance}}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{view-invoice}}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">View Invoice</a>
          <a href="{{pay-invoice}}" style="display: inline-block; background-color: #27ae60; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay Now</a>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d; margin-top: 25px;">If you have any questions about this invoice, please don't hesitate to contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            Thank you for your business!<br>
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  invoice_sms: `Hi {{contact.firstName}}, your invoice #{{invoice.number}} for {{invoice.total}} is ready. Balance due: {{invoice.balance}}. Pay now: {{pay-invoice}} - {{company.name}}`,

  receipt_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold;">✓ PAYMENT RECEIVED</div>
        </div>
        
        <h2 style="color: #2c3e50; text-align: center;">Payment Receipt</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you! We've received your payment.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Invoice Number:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">{{invoice.number}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Payment Amount:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #27ae60;">{{payment.amount}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Payment Method:</td>
              <td style="padding: 8px 0; text-align: right;">{{payment.method}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d;">Payment Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{payment.date}}</td>
            </tr>
            <tr style="border-top: 2px solid #ddd;">
              <td style="padding: 12px 0 8px 0; font-size: 16px;">Remaining Balance:</td>
              <td style="padding: 12px 0 8px 0; text-align: right; font-size: 16px; font-weight: bold;">{{invoice.balance}}</td>
            </tr>
          </table>
        </div>
        
        <p>This serves as your receipt. Please keep it for your records.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            Thank you for your business!<br>
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  payment_request_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Payment Request</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>This is a friendly reminder that you have an outstanding balance on invoice #{{invoice.number}}.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #856404;">Balance Due: {{invoice.balance}}</p>
        </div>
        
        <p>We make it easy to pay online:</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{payment-link}}" style="display: inline-block; background-color: #27ae60; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Pay Now</a>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">If you've already sent payment, please disregard this notice. If you have any questions, feel free to reach out to us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  payment_request_sms: `Hi {{contact.firstName}}, you have an outstanding balance of {{invoice.balance}} on invoice #{{invoice.number}}. Pay securely here: {{payment-link}}`,

  invoice_fineprint: `
    <div style="font-size: 11px; color: #666; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; line-height: 1.5;">
      <p style="margin: 8px 0;"><strong>Payment Terms:</strong> Payment is due by {{invoice.dueDate}}. Late payments may be subject to interest charges.</p>
      <p style="margin: 8px 0;"><strong>Accepted Payment Methods:</strong> We accept credit cards, ACH transfers, checks, and cash.</p>
      <p style="margin: 8px 0;"><strong>Questions?</strong> Contact us at {{company.phone}} or {{company.email}}</p>
      <p style="margin: 8px 0; font-size: 10px;">{{company.name}} - All rights reserved.</p>
    </div>
  `,

  // Appointments
  appointment_scheduled_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Appointment Confirmed</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Your {{appointment.type}} appointment with {{company.name}} has been scheduled!</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">📅 Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">🕐 Time:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.time}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">⏱️ Duration:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.duration}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">📍 Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.address}}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Notes:</strong> {{appointment.notes}}</p>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{confirm-appointment}}" style="display: inline-block; background-color: #27ae60; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Confirm</a>
          <a href="{{reschedule-link}}" style="display: inline-block; background-color: #7f8c8d; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reschedule</a>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">We look forward to seeing you! If you need to make any changes, please let us know at least 24 hours in advance.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  appointment_rescheduled_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Appointment Rescheduled</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Your appointment has been rescheduled to a new date and time.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📅 New Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">🕐 New Time:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.time}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📍 Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.address}}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{reschedule-link}}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Need to Reschedule Again?</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  appointment_scheduled_sms: `Hi {{contact.firstName}}! Your appointment is confirmed for {{appointment.date}} at {{appointment.time}}. Location: {{appointment.address}}. See you soon! - {{company.name}}`,

  appointment_rescheduled_sms: `Hi {{contact.firstName}}, your appointment has been rescheduled to {{appointment.date}} at {{appointment.time}}. Location: {{appointment.address}} - {{company.name}}`,

  // Jobs
  job_scheduled_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Job Scheduled - {{job.title}}</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Great news! Your job has been scheduled and our team is ready to get started.</p>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">Job #:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.number}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">📅 Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">🕐 Start Time:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.time}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">📍 Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.address}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">👷 Crew:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.crew}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1565c0; font-weight: bold;">⏱️ Est. Duration:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.estimatedDuration}}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>What to expect:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Our crew will arrive at the scheduled time</li>
            <li>They'll introduce themselves and review the work</li>
            <li>We'll keep you updated throughout the project</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">If you have any questions or concerns, please don't hesitate to contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  job_rescheduled_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Job Rescheduled</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Your job ({{job.title}}) has been rescheduled to a new date.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Job #:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.number}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📅 New Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">🕐 New Time:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.time}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📍 Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.address}}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">We apologize for any inconvenience. If you have questions, please contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  job_scheduled_sms: `Hi {{contact.firstName}}! Your job #{{job.number}} is scheduled for {{job.date}} at {{job.time}}. Location: {{job.address}}. - {{company.name}}`,

  job_rescheduled_sms: `Hi {{contact.firstName}}, job #{{job.number}} has been rescheduled to {{job.date}} at {{job.time}}. - {{company.name}}`,

  // Work Orders
  work_order_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Work Order - {{job.title}}</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>This is your work order for the upcoming job. Please review the details below.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Work Order #:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.number}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Scheduled Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.address}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Assigned Crew:</td>
              <td style="padding: 8px 0; text-align: right;">{{job.crew}}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">Our crew will have all the necessary materials and equipment. If you have any special instructions, please let us know in advance.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  work_order_sms: `Work Order for {{job.number}} scheduled on {{job.date}}. Our crew will be on-site as planned. - {{company.name}}`,

  // Change Orders
  change_order_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Change Order Request</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>We've identified some changes to the original scope of work for job #{{job.number}} ({{job.title}}).</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">Additional Work Requested</p>
          <p style="margin: 0; font-size: 14px;">Please review the attached change order for details on the additional work and associated costs.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">Total Additional Cost: {{invoice.total}}</p>
        </div>
        
        <p>Your approval is required before we can proceed with this additional work. Please review and let us know if you have any questions.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  change_order_sms: `Change order for job #{{job.number}}. Please review and approve the additional work. Contact us with questions. - {{company.name}}`,

  secret_work_order_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Confidential Work Order</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>This is a confidential work order for job #{{job.number}} ({{job.title}}).</p>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 14px;"><strong>🔒 Confidential:</strong> This work order contains sensitive information and should be treated as confidential.</p>
        </div>
        
        <p>Scheduled for: {{job.date}}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  secret_work_order_sms: `Confidential work order for job #{{job.number}}. Details sent via secure channel. - {{company.name}}`,

  // Estimates
  on_site_estimate_scheduled_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">On-Site Estimate Scheduled</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you for your interest in {{company.name}}! We've scheduled an on-site visit to provide you with a detailed estimate.</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">📅 Date:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.date}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">🕐 Time:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.time}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">📍 Location:</td>
              <td style="padding: 8px 0; text-align: right;">{{appointment.address}}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>What to expect:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Visit typically takes 30-45 minutes</li>
            <li>We'll assess the work area and discuss your needs</li>
            <li>You'll receive a detailed estimate within 24 hours</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{confirm-appointment}}" style="display: inline-block; background-color: #27ae60; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Confirm</a>
          <a href="{{reschedule-link}}" style="display: inline-block; background-color: #7f8c8d; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reschedule</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  on_site_estimate_scheduled_sms: `Hi {{contact.firstName}}! On-site estimate scheduled for {{appointment.date}} at {{appointment.time}}. Location: {{appointment.address}}. - {{company.name}}`,

  // Booking Forms
  booking_form_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Schedule Your Service</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you for your interest in {{company.name}}! We make it easy to schedule your service online.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{booking-form-link}}" style="display: inline-block; background-color: #3498db; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Book Your Appointment</a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Quick & Easy:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Choose your preferred date and time</li>
            <li>Select the services you need</li>
            <li>Get instant confirmation</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d;">Prefer to book over the phone? Call us at {{company.phone}}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  booking_form_sms: `Hi {{contact.firstName}}! Ready to schedule? Book your appointment online: {{booking-form-link}} - {{company.name}}`,

  // Confirmations
  confirmation_email_template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold;">✓ CONFIRMED</div>
        </div>
        
        <h2 style="color: #2c3e50; text-align: center;">Appointment Confirmed</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Thank you for confirming your appointment!</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 16px;"><strong>{{appointment.date}} at {{appointment.time}}</strong></p>
        </div>
        
        <p style="text-align: center; color: #7f8c8d; font-size: 14px;">We'll see you soon!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  confirmation_sms_template: `Thanks for confirming! We'll see you on {{appointment.date}} at {{appointment.time}}. - {{company.name}}`,

  // Resolutions
  resolve_email_template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Issue Resolution Update</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>We wanted to update you on the issue you reported. Your satisfaction is our top priority, and we're committed to making things right.</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #2e7d32;">We're on it!</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Our team is working to resolve this issue as quickly as possible.</p>
        </div>
        
        <p>If you have any additional concerns or questions, please don't hesitate to reach out to us directly.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong><br>
            {{company.phone}}
          </p>
        </div>
      </div>
    </div>
  `,

  resolve_sms_template: `Hi {{contact.firstName}}, we're working on resolving your issue. We'll keep you updated. Thank you for your patience. - {{company.name}}`,

  // Financing
  financing_offers_received_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin-top: 0;">Financing Options Available</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Great news! We've received financing offers for your project: {{job.title}}</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #27ae60; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 14px;">Project Total</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #27ae60;">{{job.total}}</p>
        </div>
        
        <p>Multiple financing options are now available to help make your project more affordable. Review the offers and choose the plan that works best for you.</p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Benefits:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Flexible payment plans</li>
            <li>Competitive rates</li>
            <li>Quick approval process</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  financing_approved_estimate_accepted_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold;">✓ FINANCING APPROVED</div>
        </div>
        
        <h2 style="color: #2c3e50; text-align: center;">You're All Set!</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Excellent news! Your financing has been approved and your estimate has been accepted. We're ready to start your project!</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <p style="margin: 0 0 5px 0; font-size: 14px;">Project: {{job.title}}</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #27ae60;">{{job.total}}</p>
        </div>
        
        <p>Our team will be in touch shortly to schedule your project start date.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,

  financing_approved_estimate_pending_email: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold;">✓ FINANCING APPROVED</div>
        </div>
        
        <h2 style="color: #2c3e50; text-align: center;">Financing Approved!</h2>
        
        <p>Hi {{contact.firstName}},</p>
        
        <p>Great news! Your financing has been approved for your project: {{job.title}}</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 14px;"><strong>Next Step:</strong> Please review and accept your estimate to proceed with scheduling.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <p style="margin: 0 0 5px 0; font-size: 14px;">Approved Amount</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #27ae60;">{{job.total}}</p>
        </div>
        
        <p>Once you accept the estimate, we'll schedule your project start date.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            <strong>{{company.name}}</strong>
          </p>
        </div>
      </div>
    </div>
  `,
};

// Get default template content by type
export function getDefaultTemplate(type: TemplateType): string {
  return DEFAULT_TEMPLATES[type] || '';
}

// Get default subject line by type
export function getDefaultSubject(type: TemplateType): string | undefined {
  return DEFAULT_SUBJECTS[type];
}

// Check if a template type is an email (not SMS)
export function isEmailTemplate(type: TemplateType): boolean {
  return !type.includes('_sms') && type !== 'invoice_fineprint';
}

// Get default Terms & Conditions variations
export function getDefaultTermsVariations(): Array<{ name: string; content: string }> {
  return [
    {
      name: 'Standard',
      content: DEFAULT_TEMPLATES.terms_and_conditions,
    },
  ];
}

