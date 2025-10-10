import {
    CreateJobTaskRequest,
    JobTask,
    JobTaskActivity,
    JobTaskComment,
    JobTaskFilter,
    JobTaskStats,
    JobTaskTemplate,
    UpdateJobTaskRequest
} from '@/types/jobTasks';

class JobTasksService {
  private static instance: JobTasksService;
  private tasks: Map<string, JobTask> = new Map();
  private activities: Map<string, JobTaskActivity[]> = new Map();
  private templates: JobTaskTemplate[] = [];

  private constructor() {
    this.initializeDefaultTemplates();
    this.initializeMockData();
  }

  static getInstance(): JobTasksService {
    if (!JobTasksService.instance) {
      JobTasksService.instance = new JobTasksService();
    }
    return JobTasksService.instance;
  }

  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: 'template-1',
        name: 'Kitchen Renovation Tasks',
        description: 'Standard tasks for kitchen renovation projects',
        category: 'preparation',
        estimatedDuration: 8,
        isDefault: true,
        jobType: 'kitchen_renovation',
        tasks: [
          {
            title: 'Schedule pressure washing',
            description: 'Schedule exterior pressure washing before painting',
            priority: 'medium',
            category: 'preparation',
            estimatedDuration: 2,
            tags: ['exterior', 'cleaning'],
            notes: 'Coordinate with customer for access'
          },
          {
            title: 'Order materials',
            description: 'Order all required materials and supplies',
            priority: 'high',
            category: 'preparation',
            estimatedDuration: 1,
            tags: ['materials', 'ordering'],
            notes: 'Double-check measurements before ordering'
          },
          {
            title: 'Schedule final walkthrough',
            description: 'Schedule final walkthrough with customer',
            priority: 'high',
            category: 'inspection',
            estimatedDuration: 1,
            tags: ['inspection', 'customer'],
            notes: 'Ensure all work meets customer expectations'
          }
        ]
      },
      {
        id: 'template-2',
        name: 'Bathroom Remodel Tasks',
        description: 'Standard tasks for bathroom remodel projects',
        category: 'preparation',
        estimatedDuration: 6,
        isDefault: true,
        jobType: 'bathroom_remodel',
        tasks: [
          {
            title: 'Schedule pressure washing',
            description: 'Schedule exterior pressure washing before painting',
            priority: 'medium',
            category: 'preparation',
            estimatedDuration: 2,
            tags: ['exterior', 'cleaning'],
            notes: 'Coordinate with customer for access'
          },
          {
            title: 'Coordinate with plumber',
            description: 'Schedule plumbing work with licensed plumber',
            priority: 'high',
            category: 'preparation',
            estimatedDuration: 1,
            tags: ['plumbing', 'coordination'],
            notes: 'Ensure proper permits are obtained'
          },
          {
            title: 'Final inspection',
            description: 'Conduct final quality inspection',
            priority: 'high',
            category: 'inspection',
            estimatedDuration: 1,
            tags: ['inspection', 'quality'],
            notes: 'Check all fixtures and finishes'
          }
        ]
      }
    ];
  }

  private initializeMockData(): void {
    // Mock job tasks for existing jobs
    const mockTasks: JobTask[] = [
      {
        id: 'job-task-1',
        jobId: '1',
        title: 'Schedule pressure washing',
        description: 'Schedule exterior pressure washing before painting',
        status: 'pending',
        priority: 'medium',
        category: 'preparation',
        assignedTo: 'Chris Palmer',
        assignedBy: 'Tanner Mullen',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        estimatedDuration: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Tanner Mullen',
        tags: ['exterior', 'cleaning'],
        notes: 'Coordinate with customer for access'
      },
      {
        id: 'job-task-2',
        jobId: '1',
        title: 'Order materials',
        description: 'Order all required materials and supplies',
        status: 'in_progress',
        priority: 'high',
        category: 'preparation',
        assignedTo: 'Chris Palmer',
        assignedBy: 'Tanner Mullen',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        estimatedDuration: 1,
        actualDuration: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Tanner Mullen',
        tags: ['materials', 'ordering'],
        notes: 'Double-check measurements before ordering'
      },
      {
        id: 'job-task-3',
        jobId: '2',
        title: 'Schedule final walkthrough',
        description: 'Schedule final walkthrough with customer',
        status: 'completed',
        priority: 'high',
        category: 'inspection',
        assignedTo: 'Tanner Mullen',
        assignedBy: 'Tanner Mullen',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedDuration: 1,
        actualDuration: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: 'Tanner Mullen',
        tags: ['inspection', 'customer'],
        notes: 'Customer was very satisfied with the work'
      }
    ];

    mockTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  // Get all tasks for a specific job
  async getJobTasks(jobId: string, filter?: JobTaskFilter): Promise<JobTask[]> {
    let tasks = Array.from(this.tasks.values()).filter(task => task.jobId === jobId);

    if (filter) {
      tasks = this.applyFilters(tasks, filter);
    }

    return tasks.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  // Get task statistics for a job
  async getJobTaskStats(jobId: string): Promise<JobTaskStats> {
    const tasks = await this.getJobTasks(jobId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      overdue: tasks.filter(t => t.status !== 'completed' && t.dueDate < today).length,
      dueToday: tasks.filter(t => t.status !== 'completed' && t.dueDate.toDateString() === today.toDateString()).length,
      dueThisWeek: tasks.filter(t => t.status !== 'completed' && t.dueDate >= today && t.dueDate <= weekFromNow).length
    };
  }

  // Create a new job task
  async createJobTask(request: CreateJobTaskRequest): Promise<JobTask> {
    const task: JobTask = {
      id: `job-task-${Date.now()}`,
      jobId: request.jobId,
      title: request.title,
      description: request.description,
      status: 'pending',
      priority: request.priority,
      category: request.category,
      assignedTo: request.assignedTo,
      assignedBy: 'Tanner Mullen', // Current user
      dueDate: request.dueDate,
      estimatedDuration: request.estimatedDuration,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Tanner Mullen',
      tags: request.tags || [],
      notes: request.notes,
      dependencies: request.dependencies || []
    };

    this.tasks.set(task.id, task);
    this.addActivity(task.id, 'created', `Task "${task.title}" was created`, 'Tanner Mullen', 'TM');

    return task;
  }

  // Update an existing job task
  async updateJobTask(request: UpdateJobTaskRequest): Promise<JobTask> {
    const existingTask = this.tasks.get(request.id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedTask: JobTask = {
      ...existingTask,
      ...request,
      updatedAt: new Date()
    };

    // Add completion date if status changed to completed
    if (request.status === 'completed' && existingTask.status !== 'completed') {
      updatedTask.completedDate = new Date();
    }

    this.tasks.set(request.id, updatedTask);

    // Add activity log
    if (request.status && request.status !== existingTask.status) {
      this.addActivity(request.id, 'updated', `Task status changed to ${request.status}`, 'Tanner Mullen', 'TM');
    }

    return updatedTask;
  }

  // Delete a job task
  async deleteJobTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    this.tasks.delete(taskId);
    this.activities.delete(taskId);
  }

  // Get available templates
  async getTemplates(jobType?: string): Promise<JobTaskTemplate[]> {
    if (jobType) {
      return this.templates.filter(template => 
        template.jobType === jobType || template.isDefault
      );
    }
    return this.templates;
  }

  // Create tasks from template
  async createTasksFromTemplate(jobId: string, templateId: string, assignedTo: string): Promise<JobTask[]> {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const tasks: JobTask[] = [];
    const now = new Date();

    for (const templateTask of template.tasks) {
      const task: JobTask = {
        id: `job-task-${Date.now()}-${Math.random()}`,
        jobId,
        title: templateTask.title,
        description: templateTask.description,
        status: 'pending',
        priority: templateTask.priority,
        category: templateTask.category,
        assignedTo,
        assignedBy: 'Tanner Mullen',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        estimatedDuration: templateTask.estimatedDuration,
        createdAt: now,
        updatedAt: now,
        createdBy: 'Tanner Mullen',
        tags: templateTask.tags,
        notes: templateTask.notes
      };

      this.tasks.set(task.id, task);
      this.addActivity(task.id, 'created', `Task "${task.title}" was created from template`, 'Tanner Mullen', 'TM');
      tasks.push(task);
    }

    return tasks;
  }

  // Get task activities
  async getTaskActivities(taskId: string): Promise<JobTaskActivity[]> {
    return this.activities.get(taskId) || [];
  }

  // Add comment to task
  async addTaskComment(taskId: string, content: string, author: string, authorInitials: string, isInternal: boolean = false): Promise<JobTaskComment> {
    const comment: JobTaskComment = {
      id: `comment-${Date.now()}`,
      taskId,
      content,
      author,
      authorInitials,
      createdAt: new Date(),
      isInternal
    };

    const task = this.tasks.get(taskId);
    if (task) {
      if (!task.comments) {
        task.comments = [];
      }
      task.comments.push(comment);
      this.tasks.set(taskId, task);
      this.addActivity(taskId, 'commented', 'Added a comment', author, authorInitials);
    }

    return comment;
  }

  private applyFilters(tasks: JobTask[], filter: JobTaskFilter): JobTask[] {
    let filtered = tasks;

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(task => filter.status!.includes(task.status));
    }

    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(task => filter.priority!.includes(task.priority));
    }

    if (filter.category && filter.category.length > 0) {
      filtered = filtered.filter(task => filter.category!.includes(task.category));
    }

    if (filter.assignedTo && filter.assignedTo.length > 0) {
      filtered = filtered.filter(task => filter.assignedTo!.includes(task.assignedTo));
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags.some(tag => filter.tags!.includes(tag))
      );
    }

    if (filter.dueDateRange) {
      filtered = filtered.filter(task => 
        task.dueDate >= filter.dueDateRange!.start && 
        task.dueDate <= filter.dueDateRange!.end
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  private addActivity(taskId: string, type: JobTaskActivity['type'], description: string, user: string, userInitials: string, metadata?: Record<string, any>): void {
    const activity: JobTaskActivity = {
      id: `activity-${Date.now()}`,
      taskId,
      type,
      description,
      user,
      userInitials,
      timestamp: new Date(),
      metadata
    };

    if (!this.activities.has(taskId)) {
      this.activities.set(taskId, []);
    }
    this.activities.get(taskId)!.push(activity);
  }
}

export default JobTasksService;
