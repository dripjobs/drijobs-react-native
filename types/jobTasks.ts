export type JobTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type JobTaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type JobTaskCategory = 'preparation' | 'execution' | 'cleanup' | 'inspection' | 'communication' | 'documentation' | 'other';

export interface JobTask {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  status: JobTaskStatus;
  priority: JobTaskPriority;
  category: JobTaskCategory;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  completedDate?: Date;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  notes?: string;
  dependencies?: string[]; // IDs of other tasks that must be completed first
  attachments?: JobTaskAttachment[];
  comments?: JobTaskComment[];
}

export interface JobTaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'document' | 'video' | 'other';
  uploadedBy: string;
  uploadedAt: Date;
}

export interface JobTaskComment {
  id: string;
  taskId: string;
  content: string;
  author: string;
  authorInitials: string;
  createdAt: Date;
  isInternal?: boolean; // Internal notes not visible to customer
}

export interface JobTaskTemplate {
  id: string;
  name: string;
  description: string;
  category: JobTaskCategory;
  estimatedDuration: number;
  isDefault: boolean;
  jobType?: string; // Specific job type this template applies to
  tasks: Omit<JobTask, 'id' | 'jobId' | 'status' | 'assignedTo' | 'assignedBy' | 'dueDate' | 'completedDate' | 'actualDuration' | 'createdAt' | 'updatedAt' | 'createdBy' | 'attachments' | 'comments'>[];
}

export interface JobTaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export interface JobTaskFilter {
  status?: JobTaskStatus[];
  priority?: JobTaskPriority[];
  category?: JobTaskCategory[];
  assignedTo?: string[];
  tags?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface CreateJobTaskRequest {
  jobId: string;
  title: string;
  description?: string;
  priority: JobTaskPriority;
  category: JobTaskCategory;
  assignedTo: string;
  dueDate: Date;
  estimatedDuration?: number;
  tags?: string[];
  notes?: string;
  dependencies?: string[];
}

export interface UpdateJobTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: JobTaskStatus;
  priority?: JobTaskPriority;
  category?: JobTaskCategory;
  assignedTo?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  tags?: string[];
  notes?: string;
  dependencies?: string[];
}

export interface JobTaskActivity {
  id: string;
  taskId: string;
  type: 'created' | 'updated' | 'assigned' | 'completed' | 'cancelled' | 'commented' | 'attachment_added';
  description: string;
  user: string;
  userInitials: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
