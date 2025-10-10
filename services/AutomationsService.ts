import {
    AutomationAnalytics,
    AutomationExecution,
    AutomationWorkflow,
    PIPELINE_CONFIGS,
    TeamMember
} from '@/types/automations';

// Mock team members
const mockTeamMembers: TeamMember[] = [
  { id: 'amber', name: 'Amber Johnson', email: 'amber@company.com', role: 'Project Manager', initials: 'AJ', isActive: true },
  { id: 'joe', name: 'Joe Smith', email: 'joe@company.com', role: 'Salesperson', initials: 'JS', isActive: true },
  { id: 'sarah', name: 'Sarah Martinez', email: 'sarah@company.com', role: 'Project Manager', initials: 'SM', isActive: true },
  { id: 'mike', name: 'Mike Johnson', email: 'mike@company.com', role: 'Salesperson', initials: 'MJ', isActive: true },
  { id: 'emily', name: 'Emily Chen', email: 'emily@company.com', role: 'Project Manager', initials: 'EC', isActive: true },
  { id: 'david', name: 'David Wilson', email: 'david@company.com', role: 'Salesperson', initials: 'DW', isActive: true }
];

// Mock automation workflows
const mockAutomations: AutomationWorkflow[] = [
  {
    id: 'auto-1',
    name: 'Exterior Job Project Kickoff',
    description: 'Complete automation for exterior job projects when proposal is accepted',
    status: 'active',
    trigger: {
      pipeline: 'proposals',
      stage: 'accepted',
      event: 'moved_to_stage',
      labels: ['exterior', 'high-value']
    },
    filters: [
      {
        id: 'filter-1',
        field: 'job_type',
        operator: 'contains',
        value: 'exterior'
      }
    ],
    actions: [
      {
        id: 'action-1',
        type: 'create_team_chat_channel',
        order: 1,
        delay: 0,
        isActive: true,
        config: {
          channelName: 'Project {{proposal_id}} - {{customer_name}}',
          channelDescription: 'Project channel for {{customer_name}} - {{job_address}}',
          channelType: 'job',
          inviteMembers: ['amber', 'joe']
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-2',
        type: 'send_team_chat_message',
        order: 2,
        delay: 5,
        isActive: true,
        config: {
          message: 'Great job team! Project accepted! 🎉\n\nCustomer: {{customer_name}}\nJob: {{job_type}}\nAddress: {{job_address}}',
          channelId: '{{channel_id}}'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-3',
        type: 'create_task',
        order: 3,
        delay: 10,
        isActive: true,
        config: {
          taskName: 'Schedule color consultation',
          taskDescription: 'Schedule color consultation with {{customer_name}} for {{job_address}}',
          assignedUserId: 'amber',
          assignedUserRole: 'Project Manager',
          priority: 'high'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-4',
        type: 'create_task',
        order: 4,
        delay: 15,
        isActive: true,
        config: {
          taskName: 'Schedule pressure wash',
          taskDescription: 'Schedule pressure wash for {{job_address}}',
          assignedUserId: 'amber',
          assignedUserRole: 'Project Manager',
          priority: 'medium'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-5',
        type: 'send_text_message',
        order: 5,
        delay: 20,
        isActive: true,
        config: {
          recipient: '{{salesperson}}',
          recipientType: 'salesperson',
          textMessage: 'Great job {{salesperson}}! Project accepted for {{customer_name}} 🎉'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-6',
        type: 'send_text_message',
        order: 6,
        delay: 25,
        isActive: true,
        config: {
          recipient: '{{project_manager}}',
          recipientType: 'project_manager',
          textMessage: 'Hey {{project_manager}}, we have a new job! Click here: {{job_link}}'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-7',
        type: 'create_task',
        order: 7,
        delay: 30,
        isActive: true,
        config: {
          taskName: 'Schedule job',
          taskDescription: 'Schedule the main job work for {{customer_name}} at {{job_address}}',
          assignedUserId: 'amber',
          assignedUserRole: 'Project Manager',
          priority: 'high'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-8',
        type: 'delay',
        order: 8,
        delay: 4320, // 3 days
        isActive: true,
        config: {
          delayDays: 3
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-9',
        type: 'find_team_chat_channel',
        order: 9,
        delay: 4325,
        isActive: true,
        config: {
          searchBy: 'proposal_id',
          searchValue: '{{proposal_id}}'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-10',
        type: 'send_team_chat_message',
        order: 10,
        delay: 4330,
        isActive: true,
        config: {
          message: 'Hey guys, remember to call the customer!! 📞\n\nFollow up on: {{customer_name}}\nJob: {{job_type}}\nAddress: {{job_address}}',
          channelId: '{{found_channel_id}}'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    totalExecutions: 47,
    lastExecuted: '2024-01-15T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    isActive: true
  },
  {
    id: 'auto-2',
    name: 'New Lead Welcome',
    description: 'Automation for new leads entering the system',
    status: 'active',
    trigger: {
      pipeline: 'leads',
      stage: 'new_leads',
      event: 'created_in_stage'
    },
    filters: [],
    actions: [
      {
        id: 'action-11',
        type: 'create_task',
        order: 1,
        delay: 0,
        isActive: true,
        config: {
          taskName: 'Call new lead',
          taskDescription: 'Call {{customer_name}} to introduce our services',
          assignedUserId: 'joe',
          assignedUserRole: 'Salesperson',
          priority: 'high'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'action-12',
        type: 'send_email',
        order: 2,
        delay: 60,
        isActive: true,
        config: {
          emailSubject: 'Welcome to our services!',
          emailContent: 'Hi {{customer_name}},\n\nThank you for your interest in our services. We look forward to working with you!\n\nBest regards,\nThe Team',
          emailRecipient: '{{customer_email}}'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    totalExecutions: 23,
    lastExecuted: '2024-01-14T09:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    isActive: true
  },
  {
    id: 'auto-3',
    name: 'Job Completion Follow-up',
    description: 'Automation for completed jobs',
    status: 'draft',
    trigger: {
      pipeline: 'jobs',
      stage: 'completed',
      event: 'moved_to_stage'
    },
    filters: [
      {
        id: 'filter-2',
        field: 'job_type',
        operator: 'contains',
        value: 'exterior'
      }
    ],
    actions: [
      {
        id: 'action-13',
        type: 'create_task',
        order: 1,
        delay: 0,
        isActive: true,
        config: {
          taskName: 'Request customer review',
          taskDescription: 'Request review from {{customer_name}} for completed job',
          assignedUserId: 'amber',
          assignedUserRole: 'Project Manager',
          priority: 'medium'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    totalExecutions: 0,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    isActive: false
  }
];

// Mock execution data
const mockExecutions: AutomationExecution[] = [
  {
    id: 'exec-1',
    automationId: 'auto-1',
    triggerData: {
      proposalId: 'prop-123',
      customerName: 'John Smith',
      jobType: 'exterior painting',
      jobAddress: '123 Main St, City, State',
      salesperson: 'Joe Smith',
      projectManager: 'Amber Johnson'
    },
    status: 'completed',
    startedAt: '2024-01-15T14:30:00Z',
    completedAt: '2024-01-15T14:35:00Z',
    actionResults: [
      { actionId: 'action-1', status: 'completed', executedAt: '2024-01-15T14:30:05Z' },
      { actionId: 'action-2', status: 'completed', executedAt: '2024-01-15T14:30:10Z' },
      { actionId: 'action-3', status: 'completed', executedAt: '2024-01-15T14:30:15Z' },
      { actionId: 'action-4', status: 'completed', executedAt: '2024-01-15T14:30:20Z' },
      { actionId: 'action-5', status: 'completed', executedAt: '2024-01-15T14:30:25Z' },
      { actionId: 'action-6', status: 'completed', executedAt: '2024-01-15T14:30:30Z' },
      { actionId: 'action-7', status: 'completed', executedAt: '2024-01-15T14:30:35Z' },
      { actionId: 'action-8', status: 'pending', executedAt: undefined },
      { actionId: 'action-9', status: 'pending', executedAt: undefined },
      { actionId: 'action-10', status: 'pending', executedAt: undefined }
    ]
  }
];

// Mock service class
export class AutomationsService {
  // Get all automations
  static getAllAutomations(): AutomationWorkflow[] {
    return mockAutomations;
  }

  // Get automation by ID
  static getAutomationById(id: string): AutomationWorkflow | null {
    return mockAutomations.find(auto => auto.id === id) || null;
  }

  // Get automations by status
  static getAutomationsByStatus(status: 'active' | 'paused' | 'draft'): AutomationWorkflow[] {
    return mockAutomations.filter(auto => auto.status === status);
  }

  // Get automations by pipeline
  static getAutomationsByPipeline(pipeline: string): AutomationWorkflow[] {
    return mockAutomations.filter(auto => auto.trigger.pipeline === pipeline);
  }

  // Create new automation
  static createAutomation(automation: Omit<AutomationWorkflow, 'id' | 'createdAt' | 'updatedAt'>): AutomationWorkflow {
    const newAutomation: AutomationWorkflow = {
      ...automation,
      id: `auto-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockAutomations.push(newAutomation);
    return newAutomation;
  }

  // Update automation
  static updateAutomation(id: string, updates: Partial<AutomationWorkflow>): AutomationWorkflow | null {
    const index = mockAutomations.findIndex(auto => auto.id === id);
    if (index === -1) return null;

    mockAutomations[index] = {
      ...mockAutomations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockAutomations[index];
  }

  // Delete automation
  static deleteAutomation(id: string): boolean {
    const index = mockAutomations.findIndex(auto => auto.id === id);
    if (index === -1) return false;

    mockAutomations.splice(index, 1);
    return true;
  }

  // Get team members
  static getTeamMembers(): TeamMember[] {
    return mockTeamMembers;
  }

  // Get team member by ID
  static getTeamMemberById(id: string): TeamMember | null {
    return mockTeamMembers.find(member => member.id === id) || null;
  }

  // Get executions for automation
  static getAutomationExecutions(automationId: string): AutomationExecution[] {
    return mockExecutions.filter(exec => exec.automationId === automationId);
  }

  // Get analytics for automation
  static getAutomationAnalytics(automationId: string): AutomationAnalytics {
    const executions = this.getAutomationExecutions(automationId);
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(exec => exec.status === 'completed').length;
    const failedExecutions = executions.filter(exec => exec.status === 'failed').length;
    
    const averageExecutionTime = executions.length > 0 
      ? executions.reduce((sum, exec) => {
          const start = new Date(exec.startedAt).getTime();
          const end = exec.completedAt ? new Date(exec.completedAt).getTime() : Date.now();
          return sum + (end - start) / (1000 * 60); // Convert to minutes
        }, 0) / executions.length
      : 0;

    // Generate execution history for last 30 days
    const executionHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExecutions = executions.filter(exec => 
        exec.startedAt.startsWith(dateStr)
      );
      
      executionHistory.push({
        date: dateStr,
        executions: dayExecutions.length,
        successes: dayExecutions.filter(exec => exec.status === 'completed').length,
        failures: dayExecutions.filter(exec => exec.status === 'failed').length
      });
    }

    // Calculate action performance
    const actionPerformance = [];
    const actionTypes = ['create_team_chat_channel', 'send_team_chat_message', 'create_task', 'send_text_message'];
    
    actionTypes.forEach(actionType => {
      const actionExecutions = executions.flatMap(exec => 
        exec.actionResults.filter(result => result.status === 'completed')
      );
      
      actionPerformance.push({
        actionType: actionType as any,
        totalExecutions: actionExecutions.length,
        successRate: actionExecutions.length > 0 ? 100 : 0,
        averageTime: 2.5 // Mock average time in minutes
      });
    });

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime,
      lastExecution: executions.length > 0 ? executions[executions.length - 1].startedAt : undefined,
      executionHistory,
      actionPerformance
    };
  }

  // Execute automation (mock)
  static async executeAutomation(automationId: string, triggerData: any): Promise<AutomationExecution> {
    const automation = this.getAutomationById(automationId);
    if (!automation) {
      throw new Error('Automation not found');
    }

    const execution: AutomationExecution = {
      id: `exec-${Date.now()}`,
      automationId,
      triggerData,
      status: 'running',
      startedAt: new Date().toISOString(),
      actionResults: automation.actions.map(action => ({
        actionId: action.id,
        status: 'pending'
      }))
    };

    // Simulate execution
    setTimeout(() => {
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      execution.actionResults.forEach(result => {
        result.status = 'completed';
        result.executedAt = new Date().toISOString();
      });
    }, 5000);

    mockExecutions.push(execution);
    return execution;
  }

  // Get pipeline configurations
  static getPipelineConfigs() {
    return PIPELINE_CONFIGS;
  }
}

export default AutomationsService;
