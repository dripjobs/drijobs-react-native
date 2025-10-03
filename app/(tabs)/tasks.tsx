import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Filter,
    MessageSquare,
    Plus,
    Search,
    Tag,
    TrendingUp,
    User,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type TaskStatus = 'open' | 'in_progress' | 'completed';
type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  completedDate?: Date;
  contactId?: string;
  contactName?: string;
  businessId?: string;
  businessName?: string;
  dealId?: string;
  dealType?: 'lead' | 'opportunity' | 'proposal' | 'job';
  dealTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
}

interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

type FilterView = 'all' | 'my-tasks' | 'open' | 'in-progress' | 'completed' | 'overdue';

export default function Tasks() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterView>('my-tasks');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignedTo: [] as string[],
    tags: [] as string[]
  });

  // Create Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [newTaskType, setNewTaskType] = useState('');
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [newTaskEstimatedHours, setNewTaskEstimatedHours] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [newTaskContactId, setNewTaskContactId] = useState('');
  const [newTaskContactName, setNewTaskContactName] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [newTaskDealId, setNewTaskDealId] = useState('');
  const [newTaskDealTitle, setNewTaskDealTitle] = useState('');
  const [dealSearchQuery, setDealSearchQuery] = useState('');

  const currentUser = 'Tanner Mullen';

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Follow up on bathroom renovation estimate',
      description: 'Call customer to discuss estimate details and answer any questions',
      status: 'open',
      priority: 'high',
      assignedTo: 'Tanner Mullen',
      assignedBy: 'Tanner Mullen',
      dueDate: new Date(2025, 1, 25),
      contactId: '3',
      contactName: 'Mike Stewart',
      dealId: 'lead-1',
      dealType: 'lead',
      dealTitle: 'Bathroom Renovation Inquiry',
      createdAt: new Date(2025, 1, 20),
      updatedAt: new Date(2025, 1, 20),
      createdBy: 'Tanner Mullen',
      tags: ['Follow Up', 'Estimate'],
      estimatedHours: 0.5,
      notes: 'Customer seemed very interested during initial call'
    },
    {
      id: 'task-2',
      title: 'Prepare kitchen renovation proposal',
      description: 'Create detailed proposal with material specifications and timeline',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'John Doe',
      assignedBy: 'Tanner Mullen',
      dueDate: new Date(2025, 1, 22),
      contactId: '2',
      contactName: 'Sarah Johnson',
      businessId: '1',
      businessName: 'Tech Solutions Inc.',
      dealId: 'opp-2',
      dealType: 'opportunity',
      dealTitle: 'Kitchen Renovation Estimate',
      createdAt: new Date(2025, 1, 18),
      updatedAt: new Date(2025, 1, 21),
      createdBy: 'Tanner Mullen',
      tags: ['Proposal', 'Kitchen'],
      estimatedHours: 3,
      actualHours: 1.5
    },
    {
      id: 'task-3',
      title: 'Schedule final walkthrough',
      description: 'Coordinate with customer for final project inspection',
      status: 'open',
      priority: 'medium',
      assignedTo: 'Jane Smith',
      assignedBy: 'John Doe',
      dueDate: new Date(2025, 1, 28),
      contactId: '5',
      contactName: 'David Wilson',
      dealId: 'job-1',
      dealType: 'job',
      dealTitle: 'Basement Finishing Project',
      createdAt: new Date(2025, 1, 15),
      updatedAt: new Date(2025, 1, 15),
      createdBy: 'John Doe',
      tags: ['Scheduling', 'Final Inspection'],
      estimatedHours: 1
    },
    {
      id: 'task-4',
      title: 'Order materials for Anderson project',
      description: 'Order paint and supplies for upcoming exterior painting job',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Mike Johnson',
      assignedBy: 'Tanner Mullen',
      dueDate: new Date(2025, 1, 15),
      completedDate: new Date(2025, 1, 14),
      contactId: '6',
      contactName: 'Lisa Anderson',
      dealId: 'job-2',
      dealType: 'job',
      dealTitle: 'Bathroom Renovation Project',
      createdAt: new Date(2025, 1, 10),
      updatedAt: new Date(2025, 1, 14),
      createdBy: 'Tanner Mullen',
      tags: ['Materials', 'Procurement'],
      estimatedHours: 2,
      actualHours: 1.5
    },
    {
      id: 'task-5',
      title: 'Send contract for signature',
      description: 'Email signed contract to customer for basement finishing project',
      status: 'open',
      priority: 'high',
      assignedTo: 'Tanner Mullen',
      assignedBy: 'Jane Smith',
      dueDate: new Date(2025, 1, 24),
      contactId: '5',
      contactName: 'David Wilson',
      dealId: 'prop-2',
      dealType: 'proposal',
      dealTitle: 'Basement Finishing Proposal',
      createdAt: new Date(2025, 1, 19),
      updatedAt: new Date(2025, 1, 19),
      createdBy: 'Jane Smith',
      tags: ['Contract', 'Legal'],
      estimatedHours: 0.5
    },
    {
      id: 'task-6',
      title: 'Update CRM with customer feedback',
      description: 'Log customer satisfaction survey results in system',
      status: 'open',
      priority: 'low',
      assignedTo: 'Sarah Wilson',
      assignedBy: 'Tanner Mullen',
      dueDate: new Date(2025, 2, 1),
      contactId: '4',
      contactName: 'Emily Davis',
      businessId: '3',
      businessName: 'Creative Marketing Agency',
      createdAt: new Date(2025, 1, 16),
      updatedAt: new Date(2025, 1, 16),
      createdBy: 'Tanner Mullen',
      tags: ['CRM', 'Follow Up'],
      estimatedHours: 1
    }
  ];

  const availableUsers = [
    'Tanner Mullen',
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
  ];

  const taskTypes = [
    'Follow Up',
    'Call',
    'Email',
    'Meeting',
    'Estimate',
    'Proposal',
    'Contract',
    'Site Visit',
    'Inspection',
    'Materials',
    'Scheduling',
    'Documentation',
    'Research',
    'General'
  ];

  // Mock contacts data
  const mockContacts = [
    { id: '1', name: 'John Smith', phone: '(555) 123-4567' },
    { id: '2', name: 'Sarah Johnson', phone: '(555) 234-5678' },
    { id: '3', name: 'Mike Stewart', phone: '(555) 345-6789' },
    { id: '4', name: 'Emily Davis', phone: '(555) 456-7890' },
    { id: '5', name: 'David Wilson', phone: '(555) 567-8901' },
    { id: '6', name: 'Lisa Anderson', phone: '(555) 678-9012' },
  ];

  // Mock deals data (related to contacts)
  const mockDeals = [
    { id: 'lead-1', contactId: '3', title: 'Bathroom Renovation Inquiry', type: 'lead', value: '$15,000' },
    { id: 'opp-1', contactId: '2', title: 'Kitchen Renovation Estimate', type: 'opportunity', value: '$25,000' },
    { id: 'opp-2', contactId: '1', title: 'Basement Finishing', type: 'opportunity', value: '$18,500' },
    { id: 'prop-1', contactId: '5', title: 'Basement Finishing Proposal', type: 'proposal', value: '$22,000' },
    { id: 'prop-2', contactId: '2', title: 'Kitchen Cabinet Refinishing', type: 'proposal', value: '$8,500' },
    { id: 'job-1', contactId: '5', title: 'Basement Finishing Project', type: 'job', value: '$22,000' },
    { id: 'job-2', contactId: '6', title: 'Exterior Painting', type: 'job', value: '$12,500' },
    { id: 'lead-2', contactId: '4', title: 'Deck Renovation', type: 'lead', value: '$10,000' },
    { id: 'opp-3', contactId: '1', title: 'Garage Conversion', type: 'opportunity', value: '$30,000' },
  ];

  // Get deals for selected contact
  const getDealsForContact = (contactId: string) => {
    if (!contactId) return [];
    return mockDeals.filter(deal => deal.contactId === contactId);
  };

  // Filter contacts by search query
  const getFilteredContacts = () => {
    if (!contactSearchQuery.trim()) return [];
    
    const query = contactSearchQuery.toLowerCase();
    return mockContacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query)
    );
  };

  // Filter deals by search query
  const getFilteredDeals = () => {
    if (!newTaskContactId) return [];
    const contactDeals = getDealsForContact(newTaskContactId);
    if (!dealSearchQuery.trim()) return contactDeals;
    
    const query = dealSearchQuery.toLowerCase();
    return contactDeals.filter(deal =>
      deal.title.toLowerCase().includes(query) ||
      deal.type.toLowerCase().includes(query)
    );
  };

  const filterViews = [
    { key: 'my-tasks' as FilterView, label: 'My Tasks', count: mockTasks.filter(t => t.assignedTo === currentUser && t.status !== 'completed').length },
    { key: 'all' as FilterView, label: 'All', count: mockTasks.length },
    { key: 'open' as FilterView, label: 'Open', count: mockTasks.filter(t => t.status === 'open').length },
    { key: 'in-progress' as FilterView, label: 'In Progress', count: mockTasks.filter(t => t.status === 'in_progress').length },
    { key: 'completed' as FilterView, label: 'Completed', count: mockTasks.filter(t => t.status === 'completed').length },
    { key: 'overdue' as FilterView, label: 'Overdue', count: mockTasks.filter(t => t.status !== 'completed' && t.dueDate < new Date()).length }
  ];

  const getFilteredTasks = () => {
    let filtered = mockTasks;

    // Apply view filter
    switch (activeFilter) {
      case 'my-tasks':
        filtered = filtered.filter(t => t.assignedTo === currentUser && t.status !== 'completed');
        break;
      case 'open':
        filtered = filtered.filter(t => t.status === 'open');
        break;
      case 'in-progress':
        filtered = filtered.filter(t => t.status === 'in_progress');
        break;
      case 'completed':
        filtered = filtered.filter(t => t.status === 'completed');
        break;
      case 'overdue':
        filtered = filtered.filter(t => t.status !== 'completed' && t.dueDate < new Date());
        break;
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.contactName?.toLowerCase().includes(query) ||
        t.dealTitle?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.priority.length > 0) {
      filtered = filtered.filter(t => filters.priority.includes(t.priority));
    }

    if (filters.assignedTo.length > 0) {
      filtered = filtered.filter(t => filters.assignedTo.includes(t.assignedTo));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(t => t.tags.some(tag => filters.tags.includes(tag)));
    }

    return filtered;
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6B7280';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'open': return '#3B82F6';
      case 'in_progress': return '#10B981';
      case 'completed': return '#6B7280';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'lead': return '#3B82F6';
      case 'opportunity': return '#10B981';
      case 'proposal': return '#F59E0B';
      case 'job': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && task.dueDate < new Date();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days < 7) return `In ${days} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const toggleFilter = (filterType: 'priority' | 'assignedTo' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: [],
      assignedTo: [],
      tags: []
    });
  };

  const resetCreateForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskAssignedTo('');
    setNewTaskDueDate(new Date());
    setNewTaskType('');
    setNewTaskTags([]);
    setNewTaskEstimatedHours('');
    setNewTaskNotes('');
    setNewTaskContactId('');
    setNewTaskContactName('');
    setContactSearchQuery('');
    setNewTaskDealId('');
    setNewTaskDealTitle('');
    setDealSearchQuery('');
  };

  const handleContactSelect = (contactId: string, contactName: string) => {
    setNewTaskContactId(contactId);
    setNewTaskContactName(contactName);
    setContactSearchQuery(contactName);
    // Reset deal selection when contact changes
    setNewTaskDealId('');
    setNewTaskDealTitle('');
    setDealSearchQuery('');
  };

  const handleDealSelect = (dealId: string, dealTitle: string) => {
    setNewTaskDealId(dealId);
    setNewTaskDealTitle(dealTitle);
    setDealSearchQuery(dealTitle);
  };

  const handleSaveTask = () => {
    // Validation
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    if (!newTaskAssignedTo) {
      alert('Please select an assignee');
      return;
    }
    if (!newTaskType) {
      alert('Please select a task type');
      return;
    }

    // In a real app, this would save to the database
    console.log('Creating new task:', {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      assignedTo: newTaskAssignedTo,
      dueDate: newTaskDueDate,
      type: newTaskType,
      tags: newTaskTags,
      estimatedHours: newTaskEstimatedHours ? parseFloat(newTaskEstimatedHours) : undefined,
      notes: newTaskNotes,
      contactId: newTaskContactId || null,
      contactName: newTaskContactName || null,
      dealId: newTaskDealId || null,
      dealTitle: newTaskDealTitle || null,
    });

    // Reset form and close modal
    resetCreateForm();
    setShowCreateTask(false);
  };

  const handleCancelCreate = () => {
    resetCreateForm();
    setShowCreateTask(false);
  };

  const toggleTag = (tag: string) => {
    setNewTaskTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredTasks = getFilteredTasks();

  // Get all unique tags
  const allTags = Array.from(new Set(mockTasks.flatMap(t => t.tags)));

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.pullOutMenu}>
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
            <View style={styles.pullOutArrow}>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tasks</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowFilters(true)}
            >
              <Filter size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowCreateTask(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* View Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.viewFilters}
          contentContainerStyle={styles.viewFiltersContent}
        >
          {filterViews.map((view) => (
            <TouchableOpacity
              key={view.key}
              style={[
                styles.viewButton,
                activeFilter === view.key && styles.viewButtonActive
              ]}
              onPress={() => setActiveFilter(view.key)}
            >
              <Text style={[
                styles.viewButtonText,
                activeFilter === view.key && styles.viewButtonTextActive
              ]}>
                {view.label}
              </Text>
              <View style={[
                styles.viewBadge,
                activeFilter === view.key && styles.viewBadgeActive
              ]}>
                <Text style={[
                  styles.viewBadgeText,
                  activeFilter === view.key && styles.viewBadgeTextActive
                ]}>
                  {view.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Tasks List */}
      <ScrollView style={styles.content}>
        {filteredTasks.length > 0 ? (
          <>
            {filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => handleTaskPress(task)}
              >
                {/* Header */}
                <View style={styles.taskHeader}>
                  <View style={styles.taskHeaderLeft}>
                    <View
                      style={[
                        styles.priorityIndicator,
                        { backgroundColor: getPriorityColor(task.priority) }
                      ]}
                    />
                    <Text style={styles.taskTitle} numberOfLines={2}>
                      {task.title}
                    </Text>
                  </View>
                  {task.status === 'completed' ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(task.status) }
                      ]}
                    />
                  )}
                </View>

                {/* Description */}
                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}

                {/* Deal/Contact Info */}
                {(task.contactName || task.dealTitle) && (
                  <View style={styles.taskContext}>
                    {task.contactName && (
                      <View style={styles.contextItem}>
                        <User size={14} color="#6B7280" />
                        <Text style={styles.contextText}>{task.contactName}</Text>
                      </View>
                    )}
                    {task.dealTitle && (
                      <View style={styles.contextItem}>
                        <TrendingUp size={14} color="#6B7280" />
                        <Text style={styles.contextText} numberOfLines={1}>
                          {task.dealTitle}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {task.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {task.tags.length > 2 && (
                      <Text style={styles.moreTagsText}>+{task.tags.length - 2}</Text>
                    )}
                  </View>
                )}

                {/* Footer */}
                <View style={styles.taskFooter}>
                  <View style={styles.taskFooterLeft}>
                    <View style={styles.footerItem}>
                      <Calendar size={14} color={isOverdue(task) ? '#EF4444' : '#9CA3AF'} />
                      <Text style={[
                        styles.footerText,
                        isOverdue(task) && styles.overdueText
                      ]}>
                        {formatDate(task.dueDate)}
                      </Text>
                    </View>
                    {task.assignedTo !== currentUser && (
                      <View style={styles.footerItem}>
                        <View style={styles.assigneeAvatar}>
                          <Text style={styles.assigneeAvatarText}>
                            {task.assignedTo.split(' ').map(n => n[0]).join('')}
                          </Text>
                        </View>
                        <Text style={styles.footerText} numberOfLines={1}>
                          {task.assignedTo}
                        </Text>
                      </View>
                    )}
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Tasks Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create a new task to get started'}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateTask(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Tasks</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Priority Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Priority</Text>
              <View style={styles.filterOptions}>
                {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.filterOption,
                      filters.priority.includes(priority) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleFilter('priority', priority)}
                  >
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(priority) }
                      ]}
                    />
                    <Text style={[
                      styles.filterOptionText,
                      filters.priority.includes(priority) && styles.filterOptionTextActive
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                    {filters.priority.includes(priority) && (
                      <CheckCircle size={18} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Assigned To Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Assigned To</Text>
              <View style={styles.filterOptions}>
                {availableUsers.map((user) => (
                  <TouchableOpacity
                    key={user}
                    style={[
                      styles.filterOption,
                      filters.assignedTo.includes(user) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleFilter('assignedTo', user)}
                  >
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {user.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <Text style={[
                      styles.filterOptionText,
                      filters.assignedTo.includes(user) && styles.filterOptionTextActive
                    ]}>
                      {user}
                    </Text>
                    {filters.assignedTo.includes(user) && (
                      <CheckCircle size={18} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tags</Text>
              <View style={styles.filterOptions}>
                {allTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.filterOption,
                      filters.tags.includes(tag) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleFilter('tags', tag)}
                  >
                    <Tag size={18} color="#6366F1" />
                    <Text style={[
                      styles.filterOptionText,
                      filters.tags.includes(tag) && styles.filterOptionTextActive
                    ]}>
                      {tag}
                    </Text>
                    {filters.tags.includes(tag) && (
                      <CheckCircle size={18} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        visible={selectedTask !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        {selectedTask && (
          <SafeAreaView style={styles.detailModal}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={handleCloseDetail}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>Task Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.detailContent}>
              {/* Status & Priority */}
              <View style={styles.detailBadges}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(selectedTask.status)}20` }
                  ]}
                >
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedTask.status) }]}>
                    {getStatusLabel(selectedTask.status)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: `${getPriorityColor(selectedTask.priority)}20` }
                  ]}
                >
                  <Text style={[styles.priorityBadgeText, { color: getPriorityColor(selectedTask.priority) }]}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                  </Text>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.detailTitle}>{selectedTask.title}</Text>

              {/* Description */}
              {selectedTask.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Description</Text>
                  <Text style={styles.detailSectionText}>{selectedTask.description}</Text>
                </View>
              )}

              {/* Task Info */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Task Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={[
                    styles.detailValue,
                    isOverdue(selectedTask) && styles.overdueText
                  ]}>
                    {formatDate(selectedTask.dueDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned To</Text>
                  <Text style={styles.detailValue}>{selectedTask.assignedTo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned By</Text>
                  <Text style={styles.detailValue}>{selectedTask.assignedBy}</Text>
                </View>
                {selectedTask.estimatedHours && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Est. Hours</Text>
                    <Text style={styles.detailValue}>{selectedTask.estimatedHours}h</Text>
                  </View>
                )}
                {selectedTask.actualHours && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Actual Hours</Text>
                    <Text style={styles.detailValue}>{selectedTask.actualHours}h</Text>
                  </View>
                )}
              </View>

              {/* Related Info */}
              {(selectedTask.contactName || selectedTask.dealTitle) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Related To</Text>
                  {selectedTask.contactName && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Contact</Text>
                      <Text style={styles.detailValue}>{selectedTask.contactName}</Text>
                    </View>
                  )}
                  {selectedTask.businessName && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Business</Text>
                      <Text style={styles.detailValue}>{selectedTask.businessName}</Text>
                    </View>
                  )}
                  {selectedTask.dealTitle && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Deal</Text>
                      <Text style={styles.detailValue}>{selectedTask.dealTitle}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Tags */}
              {selectedTask.tags.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Tags</Text>
                  <View style={styles.detailTagsContainer}>
                    {selectedTask.tags.map((tag, index) => (
                      <View key={index} style={styles.detailTag}>
                        <Tag size={14} color="#6366F1" />
                        <Text style={styles.detailTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Notes */}
              {selectedTask.notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Notes</Text>
                  <Text style={styles.detailSectionText}>{selectedTask.notes}</Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.detailActions}>
                {selectedTask.status !== 'completed' && (
                  <TouchableOpacity style={styles.actionButtonPrimary}>
                    <CheckCircle size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonPrimaryText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButtonSecondary}>
                  <MessageSquare size={20} color="#6366F1" />
                  <Text style={styles.actionButtonSecondaryText}>Add Comment</Text>
                </TouchableOpacity>
                {selectedTask.dealId && (
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <TrendingUp size={20} color="#6366F1" />
                    <Text style={styles.actionButtonSecondaryText}>View Deal</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        visible={showCreateTask}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelCreate}
      >
        <SafeAreaView style={styles.createModal}>
          <View style={styles.createHeader}>
            <TouchableOpacity onPress={handleCancelCreate}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.createHeaderTitle}>Create Task</Text>
            <TouchableOpacity onPress={handleSaveTask}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.createContent}>
            {/* Title */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter task title"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Enter task description"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Task Type */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Task Type <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.formDropdown}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text style={[styles.formDropdownText, !newTaskType && styles.formDropdownPlaceholder]}>
                  {newTaskType || 'Select task type'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showTypeDropdown && (
                <View style={styles.dropdownList}>
                  {taskTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewTaskType(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        newTaskType === type && styles.dropdownItemTextActive
                      ]}>
                        {type}
                      </Text>
                      {newTaskType === type && (
                        <CheckCircle size={18} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Priority */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      newTaskPriority === priority && styles.priorityOptionActive
                    ]}
                    onPress={() => setNewTaskPriority(priority)}
                  >
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(priority) }
                      ]}
                    />
                    <Text style={[
                      styles.priorityOptionText,
                      newTaskPriority === priority && styles.priorityOptionTextActive
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Assign To */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Assign To <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.formDropdown}
                onPress={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                <Text style={[styles.formDropdownText, !newTaskAssignedTo && styles.formDropdownPlaceholder]}>
                  {newTaskAssignedTo || 'Select team member'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {showAssigneeDropdown && (
                <View style={styles.dropdownList}>
                  {availableUsers.map((user) => (
                    <TouchableOpacity
                      key={user}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewTaskAssignedTo(user);
                        setShowAssigneeDropdown(false);
                      }}
                    >
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {user.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </View>
                      <Text style={[
                        styles.dropdownItemText,
                        newTaskAssignedTo === user && styles.dropdownItemTextActive
                      ]}>
                        {user}
                      </Text>
                      {newTaskAssignedTo === user && (
                        <CheckCircle size={18} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Related Contact */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Related Contact</Text>
              <View style={styles.searchableField}>
                <User size={18} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  value={contactSearchQuery}
                  onChangeText={setContactSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
                {contactSearchQuery && (
                  <TouchableOpacity onPress={() => {
                    setContactSearchQuery('');
                    setNewTaskContactId('');
                    setNewTaskContactName('');
                    setNewTaskDealId('');
                    setNewTaskDealTitle('');
                    setDealSearchQuery('');
                  }}>
                    <X size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Contact Search Results */}
              {contactSearchQuery.length > 0 && (
                <View style={styles.dealResults}>
                  {getFilteredContacts().length > 0 ? (
                    getFilteredContacts().map((contact) => (
                      <TouchableOpacity
                        key={contact.id}
                        style={[
                          styles.dealResultItem,
                          newTaskContactId === contact.id && styles.dealResultItemActive
                        ]}
                        onPress={() => handleContactSelect(contact.id, contact.name)}
                      >
                        <User size={18} color="#6366F1" />
                        <View style={styles.dealResultLeft}>
                          <Text style={styles.dealResultTitle}>{contact.name}</Text>
                          <Text style={styles.dropdownItemSubtext}>{contact.phone}</Text>
                        </View>
                        {newTaskContactId === contact.id && (
                          <CheckCircle size={18} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>No contacts found</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Related Deal (shows only when contact is selected) */}
            {newTaskContactId && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Related Deal</Text>
                <View style={styles.searchableField}>
                  <Search size={18} color="#6B7280" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search deals for this contact..."
                    value={dealSearchQuery}
                    onChangeText={setDealSearchQuery}
                    placeholderTextColor="#9CA3AF"
                  />
                  {dealSearchQuery && (
                    <TouchableOpacity onPress={() => {
                      setDealSearchQuery('');
                      setNewTaskDealId('');
                      setNewTaskDealTitle('');
                    }}>
                      <X size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Deal Results */}
                {dealSearchQuery.length > 0 && (
                  <View style={styles.dealResults}>
                    {getFilteredDeals().length > 0 ? (
                      getFilteredDeals().map((deal) => (
                        <TouchableOpacity
                          key={deal.id}
                          style={[
                            styles.dealResultItem,
                            newTaskDealId === deal.id && styles.dealResultItemActive
                          ]}
                          onPress={() => handleDealSelect(deal.id, deal.title)}
                        >
                          <View style={styles.dealResultLeft}>
                            <Text style={styles.dealResultTitle}>{deal.title}</Text>
                            <View style={styles.dealResultMeta}>
                              <View style={[
                                styles.dealTypeBadge,
                                { backgroundColor: getDealTypeColor(deal.type) }
                              ]}>
                                <Text style={styles.dealTypeBadgeText}>
                                  {deal.type.charAt(0).toUpperCase() + deal.type.slice(1)}
                                </Text>
                              </View>
                              <Text style={styles.dealResultValue}>{deal.value}</Text>
                            </View>
                          </View>
                          {newTaskDealId === deal.id && (
                            <CheckCircle size={18} color="#6366F1" />
                          )}
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>No deals found</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Show all deals when not searching */}
                {!dealSearchQuery && getDealsForContact(newTaskContactId).length > 0 && (
                  <View style={styles.dealHint}>
                    <Text style={styles.dealHintText}>
                      {getDealsForContact(newTaskContactId).length} {getDealsForContact(newTaskContactId).length === 1 ? 'deal' : 'deals'} available. Start typing to search.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Due Date */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Due Date</Text>
              <TouchableOpacity
                style={styles.formDropdown}
                onPress={() => setShowDueDatePicker(true)}
              >
                <Calendar size={18} color="#6B7280" />
                <Text style={styles.formDropdownText}>
                  {newTaskDueDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>

              {showDueDatePicker && (
                <DateTimePicker
                  value={newTaskDueDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowDueDatePicker(false);
                    if (selectedDate) {
                      setNewTaskDueDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            {/* Estimated Hours */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Estimated Hours</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 2.5"
                value={newTaskEstimatedHours}
                onChangeText={setNewTaskEstimatedHours}
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>

            {/* Tags */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Tags</Text>
              <View style={styles.tagSelector}>
                {allTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagSelectorItem,
                      newTaskTags.includes(tag) && styles.tagSelectorItemActive
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagSelectorText,
                      newTaskTags.includes(tag) && styles.tagSelectorTextActive
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Add any additional notes"
                value={newTaskNotes}
                onChangeText={setNewTaskNotes}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <FloatingActionMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientHeader: {
    paddingTop: 8,
    paddingBottom: 16,
    zIndex: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pullOutIndicator: {
    width: 6,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pullOutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pullOutArrow: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },
  viewFilters: {
    paddingHorizontal: 20,
  },
  viewFiltersContent: {
    gap: 8,
    paddingRight: 20,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  viewButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewButtonTextActive: {
    color: '#6366F1',
  },
  viewBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  viewBadgeActive: {
    backgroundColor: '#EEF2FF',
  },
  viewBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewBadgeTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  priorityIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginTop: 2,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskContext: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 120,
  },
  contextText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingVertical: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  taskFooterLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  filterOptionActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  filterOptionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  filterOptionTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    lineHeight: 30,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  detailSectionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  detailTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  detailActions: {
    gap: 12,
    marginTop: 12,
  },
  actionButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  actionButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  createModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  createHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  createContent: {
    flex: 1,
    padding: 20,
  },
  // Form Styles
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  formTextArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  formDropdownText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  formDropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  dropdownItemTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  priorityOptionTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tagSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagSelectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelectorItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  tagSelectorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  tagSelectorTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  searchableField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },
  dealResults: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dealResultItemActive: {
    backgroundColor: '#EEF2FF',
  },
  dealResultLeft: {
    flex: 1,
    marginRight: 12,
  },
  dealResultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  dealResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dealTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dealTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dealResultValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  noResults: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  dealHint: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  dealHintText: {
    fontSize: 13,
    color: '#0369A1',
  },
});

