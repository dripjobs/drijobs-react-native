import JobTasksService from '@/services/JobTasksService';
import { JobTask, JobTaskCategory, JobTaskFilter, JobTaskPriority, JobTaskStats, JobTaskStatus } from '@/types/jobTasks';
import {
    AlertCircle,
    Calendar,
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    Filter,
    MessageSquare,
    Play,
    Plus,
    Search,
    SquareCheck,
    Tag,
    User,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface JobTasksModalProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export default function JobTasksModal({ visible, onClose, jobId, jobTitle }: JobTasksModalProps) {
  const [tasks, setTasks] = useState<JobTask[]>([]);
  const [stats, setStats] = useState<JobTaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<JobTaskFilter>({});
  
  // Create task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<JobTaskPriority>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState<JobTaskCategory>('preparation');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('Chris Palmer');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [newTaskEstimatedDuration, setNewTaskEstimatedDuration] = useState('');
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const jobTasksService = JobTasksService.getInstance();

  useEffect(() => {
    if (visible) {
      loadTasks();
    }
  }, [visible, jobId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        jobTasksService.getJobTasks(jobId, filter),
        jobTasksService.getJobTaskStats(jobId)
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading job tasks:', error);
      Alert.alert('Error', 'Failed to load job tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await jobTasksService.createJobTask({
        jobId,
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        category: newTaskCategory,
        assignedTo: newTaskAssignedTo,
        dueDate: newTaskDueDate,
        estimatedDuration: newTaskEstimatedDuration ? parseFloat(newTaskEstimatedDuration) : undefined,
        tags: newTaskTags,
        notes: newTaskNotes
      });

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskCategory('preparation');
      setNewTaskAssignedTo('Chris Palmer');
      setNewTaskDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setNewTaskEstimatedDuration('');
      setNewTaskTags([]);
      setNewTaskNotes('');
      setShowCreateTask(false);

      // Reload tasks
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: JobTaskStatus) => {
    try {
      await jobTasksService.updateJobTask({
        id: taskId,
        status
      });
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const getStatusColor = (status: JobTaskStatus) => {
    switch (status) {
      case 'pending': return '#6B7280';
      case 'in_progress': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: JobTaskPriority) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: JobTaskCategory) => {
    switch (category) {
      case 'preparation': return Clock;
      case 'execution': return Play;
      case 'cleanup': return SquareCheck;
      case 'inspection': return AlertCircle;
      case 'communication': return MessageSquare;
      case 'documentation': return Tag;
      default: return Clock;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate: Date, status: JobTaskStatus) => {
    return status !== 'completed' && dueDate < new Date();
  };

  const renderTaskItem = ({ item: task }: { item: JobTask }) => {
    const isExpanded = expandedTask === task.id;
    const overdue = isOverdue(task.dueDate, task.status);
    const CategoryIcon = getCategoryIcon(task.category);

    return (
      <View style={styles.taskItem}>
        <TouchableOpacity 
          style={styles.taskHeader}
          onPress={() => setExpandedTask(isExpanded ? null : task.id)}
        >
          <View style={styles.taskMainInfo}>
            <View style={styles.taskTitleRow}>
              <TouchableOpacity 
                style={styles.taskCheckbox}
                onPress={() => {
                  const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                  handleUpdateTaskStatus(task.id, newStatus);
                }}
              >
                {task.status === 'completed' ? (
                  <Check size={16} color="#10B981" />
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </TouchableOpacity>
              
              <View style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  task.status === 'completed' && styles.taskTitleCompleted
                ]}>
                  {task.title}
                </Text>
                
                <View style={styles.taskMeta}>
                  <View style={styles.taskMetaItem}>
                    <CategoryIcon size={12} color="#6B7280" />
                    <Text style={styles.taskMetaText}>{task.category}</Text>
                  </View>
                  
                  <View style={styles.taskMetaItem}>
                    <User size={12} color="#6B7280" />
                    <Text style={styles.taskMetaText}>{task.assignedTo}</Text>
                  </View>
                  
                  <View style={[styles.taskMetaItem, overdue && styles.overdueMeta]}>
                    <Calendar size={12} color={overdue ? "#EF4444" : "#6B7280"} />
                    <Text style={[styles.taskMetaText, overdue && styles.overdueText]}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.taskActions}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                {task.status.replace('_', ' ')}
              </Text>
            </View>
            
            {isExpanded ? <ChevronDown size={16} color="#6B7280" /> : <ChevronRight size={16} color="#6B7280" />}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.taskDetails}>
            {task.description && (
              <Text style={styles.taskDescription}>{task.description}</Text>
            )}
            
            {task.notes && (
              <View style={styles.taskNotes}>
                <Text style={styles.taskNotesLabel}>Notes:</Text>
                <Text style={styles.taskNotesText}>{task.notes}</Text>
              </View>
            )}
            
            {task.tags.length > 0 && (
              <View style={styles.taskTags}>
                {task.tags.map((tag, index) => (
                  <View key={index} style={styles.taskTag}>
                    <Text style={styles.taskTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.taskActions}>
              {task.status === 'pending' && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                >
                  <Play size={14} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Start</Text>
                </TouchableOpacity>
              )}
              
              {task.status === 'in_progress' && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleUpdateTaskStatus(task.id, 'completed')}
                >
                  <Check size={14} color="#10B981" />
                  <Text style={styles.actionButtonText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Job Tasks</Text>
            <Text style={styles.headerSubtitle}>{jobTitle}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowCreateTask(true)}
          >
            <Plus size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats.overdue}</Text>
                <Text style={styles.statLabel}>Overdue</Text>
              </View>
            </View>
          </View>
        )}

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
        />

        {/* Create Task Modal */}
        {showCreateTask && (
          <View style={styles.createTaskOverlay}>
            <View style={styles.createTaskModal}>
              <View style={styles.createTaskHeader}>
                <Text style={styles.createTaskTitle}>Create New Task</Text>
                <TouchableOpacity onPress={() => setShowCreateTask(false)}>
                  <X size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.createTaskContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Enter task description"
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                    multiline
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Priority</Text>
                    <TouchableOpacity 
                      style={styles.dropdownButton}
                      onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                      <Text style={styles.dropdownText}>{newTaskPriority}</Text>
                      <ChevronDown size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Category</Text>
                    <TouchableOpacity 
                      style={styles.dropdownButton}
                      onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                      <Text style={styles.dropdownText}>{newTaskCategory}</Text>
                      <ChevronDown size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Assigned To</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  >
                    <Text style={styles.dropdownText}>{newTaskAssignedTo}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Due Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formatDate(newTaskDueDate)}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Estimated Duration (hours)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 2.5"
                    value={newTaskEstimatedDuration}
                    onChangeText={setNewTaskEstimatedDuration}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Additional notes..."
                    value={newTaskNotes}
                    onChangeText={setNewTaskNotes}
                    multiline
                  />
                </View>
              </ScrollView>

              <View style={styles.createTaskActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowCreateTask(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreateTask}
                >
                  <Text style={styles.createButtonText}>Create Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskMainInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxEmpty: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  overdueMeta: {
    // Override styles for overdue items
  },
  overdueText: {
    color: '#EF4444',
  },
  taskActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  taskDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  taskDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskNotes: {
    marginBottom: 12,
  },
  taskNotesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  taskNotesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  taskTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  taskTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskTagText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  createTaskOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createTaskModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  createTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  createTaskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  createTaskContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  createTaskActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
