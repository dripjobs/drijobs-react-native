// Automation Types for Internal Operations

export interface AutomationWorkflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  trigger: AutomationTrigger;
  filters: AutomationFilter[];
  actions: AutomationAction[];
  totalExecutions: number;
  lastExecuted?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AutomationTrigger {
  type: 'proposal_status' | 'pipeline_change' | 'stage_change' | 'invoice_status' | 'job_status' | 'appointment_status';
  pipeline?: 'leads' | 'opportunities' | 'proposals' | 'jobs' | 'invoices' | 'appointments';
  stage?: string;
  status?: string; // For status-based triggers
  fromStage?: string; // For stage change triggers
  toStage?: string; // For stage change triggers
  fromPipeline?: string; // For pipeline change triggers
  toPipeline?: string; // For pipeline change triggers
  labels?: string[];
}

export interface AutomationFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number;
  logicalOperator?: 'AND' | 'OR';
}

export type FilterOperator = 
  // Text operators
  | 'contains' 
  | 'does_not_contain' 
  | 'equals' 
  | 'does_not_equal' 
  | 'is_empty' 
  | 'is_not_empty'
  // Number operators
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal'
  // Label operators
  | 'has_label' 
  | 'does_not_have_label';

export interface AutomationAction {
  id: string;
  type: ActionType;
  order: number;
  delay: number; // in minutes
  isActive: boolean;
  config: ActionConfig;
  createdAt: string;
  updatedAt: string;
}

export type ActionType = 
  | 'create_team_chat_channel'
  | 'send_team_chat_message'
  | 'create_task'
  | 'send_text_message'
  | 'delay'
  | 'find_team_chat_channel'
  | 'send_email'
  | 'add_note'
  | 'update_stage'
  | 'assign_user';

export interface ActionConfig {
  // Team Chat Channel
  channelName?: string;
  channelDescription?: string;
  channelType?: 'job' | 'team';
  inviteMembers?: string[]; // user IDs
  
  // Team Chat Message
  message?: string;
  channelId?: string;
  
  // Task Creation
  taskName?: string;
  taskDescription?: string;
  assignedUserId?: string;
  assignedUserRole?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  
  // Text Message
  recipient?: string;
  recipientType?: 'salesperson' | 'project_manager' | 'customer' | 'specific_user';
  textMessage?: string;
  
  // Email
  emailSubject?: string;
  emailContent?: string;
  emailRecipient?: string;
  
  // Delay
  delayMinutes?: number;
  delayHours?: number;
  delayDays?: number;
  
  // Find Channel
  searchBy?: 'proposal_id' | 'job_id' | 'customer_name';
  searchValue?: string;
  
  // Note
  noteContent?: string;
  
  // Stage Update
  newStage?: string;
  newPipeline?: string;
  
  // User Assignment
  assignToUserId?: string;
  assignToRole?: string;
}

export interface AutomationExecution {
  id: string;
  automationId: string;
  triggerData: any; // The data that triggered the automation
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  actionResults: ActionExecutionResult[];
}

export interface ActionExecutionResult {
  actionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  executedAt?: string;
  result?: any;
  errorMessage?: string;
}

export interface AutomationAnalytics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number; // in minutes
  lastExecution?: string;
  executionHistory: {
    date: string;
    executions: number;
    successes: number;
    failures: number;
  }[];
  actionPerformance: {
    actionType: ActionType;
    totalExecutions: number;
    successRate: number;
    averageTime: number;
  }[];
}

// Pipeline and Stage configurations
export const PIPELINE_CONFIGS = {
  leads: {
    title: 'Lead Pipeline',
    stages: ['new_leads', 'cold_leads', 'on_hold', 'warm_leads', 'not_a_fit', 'qualified'],
    stageLabels: {
      new_leads: 'New Leads',
      cold_leads: 'Cold Leads',
      on_hold: 'On Hold',
      warm_leads: 'Warm Leads',
      not_a_fit: 'Not a Fit',
      qualified: 'Qualified'
    }
  },
  opportunities: {
    title: 'Opportunities',
    stages: ['estimate_requested', 'virtual_estimate', 'estimate_scheduled', 'estimate_cancelled', 'not_a_fit', 'qualified'],
    stageLabels: {
      estimate_requested: 'Estimate Requested',
      virtual_estimate: 'Virtual Estimate',
      estimate_scheduled: 'Estimate Scheduled',
      estimate_cancelled: 'Estimate Cancelled',
      not_a_fit: 'Not a Fit',
      qualified: 'Qualified'
    }
  },
  proposals: {
    title: 'Proposals',
    stages: ['in_draft', 'proposal_sent', 'on_hold', 'proposal_rejected', 'proposal_approved'],
    stageLabels: {
      in_draft: 'In Draft',
      proposal_sent: 'Proposal Sent',
      on_hold: 'On Hold',
      proposal_rejected: 'Proposal Rejected',
      proposal_approved: 'Proposal Approved'
    }
  },
  jobs: {
    title: 'Jobs',
    stages: ['pending_schedule', 'in_progress', 'project_scheduled', 'project_complete'],
    stageLabels: {
      pending_schedule: 'Pending Schedule',
      in_progress: 'In Progress',
      project_scheduled: 'Project Scheduled',
      project_complete: 'Project Complete'
    }
  },
  invoices: {
    title: 'Invoices',
    stages: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    stageLabels: {
      draft: 'Draft',
      sent: 'Sent',
      viewed: 'Viewed',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled'
    }
  },
  appointments: {
    title: 'Appointments',
    stages: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    stageLabels: {
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      no_show: 'No Show'
    }
  }
};

// Available filter fields by pipeline
export const FILTER_FIELDS = {
  leads: [
    { key: 'name', label: 'Lead Name', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'source', label: 'Source', type: 'text' },
    { key: 'value', label: 'Deal Value', type: 'number' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ],
  opportunities: [
    { key: 'name', label: 'Opportunity Name', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'value', label: 'Deal Value', type: 'number' },
    { key: 'probability', label: 'Probability', type: 'number' },
    { key: 'close_date', label: 'Close Date', type: 'date' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ],
  proposals: [
    { key: 'title', label: 'Proposal Title', type: 'text' },
    { key: 'customer_name', label: 'Customer Name', type: 'text' },
    { key: 'value', label: 'Proposal Value', type: 'number' },
    { key: 'job_type', label: 'Job Type', type: 'text' },
    { key: 'job_address', label: 'Job Address', type: 'text' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ],
  jobs: [
    { key: 'job_number', label: 'Job Number', type: 'text' },
    { key: 'customer_name', label: 'Customer Name', type: 'text' },
    { key: 'job_address', label: 'Job Address', type: 'text' },
    { key: 'job_type', label: 'Job Type', type: 'text' },
    { key: 'value', label: 'Job Value', type: 'number' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ],
  invoices: [
    { key: 'invoice_number', label: 'Invoice Number', type: 'text' },
    { key: 'customer_name', label: 'Customer Name', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'due_date', label: 'Due Date', type: 'date' },
    { key: 'payment_terms', label: 'Payment Terms', type: 'text' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ],
  appointments: [
    { key: 'title', label: 'Appointment Title', type: 'text' },
    { key: 'customer_name', label: 'Customer Name', type: 'text' },
    { key: 'appointment_type', label: 'Appointment Type', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'duration', label: 'Duration (minutes)', type: 'number' },
    { key: 'labels', label: 'Labels', type: 'labels' }
  ]
};

// Team members for user assignment
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  isActive: boolean;
}

// Variables/placeholders that can be used in messages
export const AUTOMATION_VARIABLES = [
  { key: 'salesperson', label: 'Salesperson', description: 'Deal salesperson name' },
  { key: 'project_manager', label: 'Project Manager', description: 'Assigned project manager' },
  { key: 'customer_name', label: 'Customer Name', description: 'Customer name' },
  { key: 'job_address', label: 'Job Address', description: 'Job address' },
  { key: 'proposal_id', label: 'Proposal ID', description: 'Proposal ID' },
  { key: 'job_number', label: 'Job Number', description: 'Job number' },
  { key: 'deal_value', label: 'Deal Value', description: 'Deal value' },
  { key: 'company_name', label: 'Company Name', description: 'Company name' }
];
