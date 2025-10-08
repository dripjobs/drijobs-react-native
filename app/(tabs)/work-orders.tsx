import CreateJobModal from '@/components/CreateJobModal';
import CreateLeadModal from '@/components/CreateLeadModal';
import DrawerMenu from '@/components/DrawerMenu';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import NewProposalModal from '@/components/NewProposalModal';
import SendRequestModal from '@/components/SendRequestModal';
import { LinearGradient } from 'expo-linear-gradient';
import {
    AlertCircle,
    Building,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    FileText,
    Filter,
    Search,
    User,
    Users,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  customerName: string;
  businessName: string;
  projectName: string;
  address: string;
  phone: string;
  jobStage: 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  proposalNumber: string;
  contractValue: number;
  startDate: string;
  endDate?: string;
  daysInStage: number;
  assignedTo: {
    projectManager?: string;
    crewLeader?: string;
    salesperson: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completionPercentage?: number;
  lastActivity: string;
  hasIssues?: boolean;
}

type JobStage = 'all' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';

export default function WorkOrders() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStage, setActiveStage] = useState<JobStage>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignedTo: [] as string[],
    hasIssues: false,
    dateRange: 'all' as 'all' | 'this-week' | 'this-month' | 'overdue'
  });
  
  // Quick Actions modal states
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);

  // Mock work orders data
  const mockWorkOrders: WorkOrder[] = [
    {
      id: 'WO-2445',
      workOrderNumber: 'WO-2445',
      customerName: 'David Johnson',
      businessName: 'Johnson Kitchen Remodel',
      projectName: 'Kitchen Remodel',
      address: '123 Oak Street, San Francisco, CA 94102',
      phone: '(555) 123-4567',
      jobStage: 'in-progress',
      proposalNumber: 'P-2445',
      contractValue: 45000,
      startDate: '2025-09-15',
      endDate: '2025-10-30',
      daysInStage: 18,
      assignedTo: {
        projectManager: 'Mike Chen',
        crewLeader: 'Tom Rodriguez',
        salesperson: 'Sarah Martinez'
      },
      priority: 'high',
      completionPercentage: 65,
      lastActivity: '2 hours ago'
    },
    {
      id: 'WO-2448',
      workOrderNumber: 'WO-2448',
      customerName: 'Sarah Wilson',
      businessName: 'Wilson Bathroom Update',
      projectName: 'Master Bathroom Update',
      address: '456 Maple Ave, San Francisco, CA 94103',
      phone: '(555) 234-5678',
      jobStage: 'scheduled',
      proposalNumber: 'P-2448',
      contractValue: 28000,
      startDate: '2025-10-15',
      daysInStage: 5,
      assignedTo: {
        projectManager: 'Mike Chen',
        salesperson: 'Sarah Martinez'
      },
      priority: 'medium',
      lastActivity: '1 day ago'
    },
    {
      id: 'WO-2432',
      workOrderNumber: 'WO-2432',
      customerName: 'Robert Taylor',
      businessName: 'Taylor Deck Addition',
      projectName: 'Deck Addition',
      address: '789 Pine St, Oakland, CA 94607',
      phone: '(555) 345-6789',
      jobStage: 'in-progress',
      proposalNumber: 'P-2432',
      contractValue: 32000,
      startDate: '2025-09-01',
      endDate: '2025-10-10',
      daysInStage: 32,
      assignedTo: {
        projectManager: 'Emily Davis',
        crewLeader: 'John Smith',
        salesperson: 'Michael Brown'
      },
      priority: 'urgent',
      completionPercentage: 85,
      lastActivity: '30 minutes ago',
      hasIssues: true
    },
    {
      id: 'WO-2421',
      workOrderNumber: 'WO-2421',
      customerName: 'Jennifer Martinez',
      businessName: 'Martinez Home Renovation',
      projectName: 'Full Home Renovation',
      address: '321 Elm St, Berkeley, CA 94704',
      phone: '(555) 456-7890',
      jobStage: 'on-hold',
      proposalNumber: 'P-2421',
      contractValue: 125000,
      startDate: '2025-08-15',
      daysInStage: 12,
      assignedTo: {
        projectManager: 'Mike Chen',
        crewLeader: 'Tom Rodriguez',
        salesperson: 'Sarah Martinez'
      },
      priority: 'high',
      completionPercentage: 40,
      lastActivity: '3 days ago',
      hasIssues: true
    },
    {
      id: 'WO-2415',
      workOrderNumber: 'WO-2415',
      customerName: 'Michael Anderson',
      businessName: 'Anderson Roof Replacement',
      projectName: 'Roof Replacement',
      address: '654 Cedar Ln, San Jose, CA 95110',
      phone: '(555) 567-8901',
      jobStage: 'completed',
      proposalNumber: 'P-2415',
      contractValue: 18000,
      startDate: '2025-08-01',
      endDate: '2025-08-28',
      daysInStage: 0,
      assignedTo: {
        projectManager: 'Emily Davis',
        crewLeader: 'John Smith',
        salesperson: 'Michael Brown'
      },
      priority: 'medium',
      completionPercentage: 100,
      lastActivity: '1 week ago'
    },
    {
      id: 'WO-2410',
      workOrderNumber: 'WO-2410',
      customerName: 'Lisa Thompson',
      businessName: 'Thompson Garage Conversion',
      projectName: 'Garage to Office Conversion',
      address: '987 Birch Ave, Palo Alto, CA 94301',
      phone: '(555) 678-9012',
      jobStage: 'scheduled',
      proposalNumber: 'P-2410',
      contractValue: 38000,
      startDate: '2025-10-20',
      daysInStage: 8,
      assignedTo: {
        projectManager: 'Emily Davis',
        salesperson: 'Sarah Martinez'
      },
      priority: 'low',
      lastActivity: '2 days ago'
    }
  ];

  const jobStages = [
    { key: 'all' as JobStage, label: 'All', count: mockWorkOrders.length },
    { key: 'scheduled' as JobStage, label: 'Scheduled', count: mockWorkOrders.filter(wo => wo.jobStage === 'scheduled').length },
    { key: 'in-progress' as JobStage, label: 'In Progress', count: mockWorkOrders.filter(wo => wo.jobStage === 'in-progress').length },
    { key: 'on-hold' as JobStage, label: 'On Hold', count: mockWorkOrders.filter(wo => wo.jobStage === 'on-hold').length },
    { key: 'completed' as JobStage, label: 'Completed', count: mockWorkOrders.filter(wo => wo.jobStage === 'completed').length },
    { key: 'cancelled' as JobStage, label: 'Cancelled', count: mockWorkOrders.filter(wo => wo.jobStage === 'cancelled').length }
  ];

  const getFilteredWorkOrders = () => {
    let filtered = mockWorkOrders;

    // Filter by stage
    if (activeStage !== 'all') {
      filtered = filtered.filter(wo => wo.jobStage === activeStage);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(wo =>
        wo.customerName.toLowerCase().includes(query) ||
        wo.businessName.toLowerCase().includes(query) ||
        wo.workOrderNumber.toLowerCase().includes(query) ||
        wo.projectName.toLowerCase().includes(query)
      );
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(wo => filters.priority.includes(wo.priority));
    }

    // Filter by assigned to
    if (filters.assignedTo.length > 0) {
      filtered = filtered.filter(wo =>
        filters.assignedTo.some(person =>
          wo.assignedTo.projectManager === person ||
          wo.assignedTo.crewLeader === person ||
          wo.assignedTo.salesperson === person
        )
      );
    }

    // Filter by issues
    if (filters.hasIssues) {
      filtered = filtered.filter(wo => wo.hasIssues);
    }

    return filtered;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'scheduled': return '#3B82F6';
      case 'in-progress': return '#10B981';
      case 'on-hold': return '#F59E0B';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleWorkOrderPress = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
  };

  const handleCloseDetail = () => {
    setSelectedWorkOrder(null);
  };

  // Quick Actions handlers
  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleNewProposal = () => {
    setShowNewProposal(true);
  };

  const handleSendRequest = () => {
    setShowSendRequest(true);
  };

  const handleCreateLead = () => {
    setShowCreateLead(true);
  };

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  const toggleFilter = (filterType: 'priority' | 'assignedTo', value: string) => {
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
      hasIssues: false,
      dateRange: 'all'
    });
  };

  const filteredWorkOrders = getFilteredWorkOrders();

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

          <Text style={styles.headerTitle}>Work Orders</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowFilters(true)}
            >
              <Filter size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search work orders..."
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

        {/* Stage Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.stageFilters}
          contentContainerStyle={styles.stageFiltersContent}
        >
          {jobStages.map((stage) => (
            <TouchableOpacity
              key={stage.key}
              style={[
                styles.stageButton,
                activeStage === stage.key && styles.stageButtonActive
              ]}
              onPress={() => setActiveStage(stage.key)}
            >
              <Text style={[
                styles.stageButtonText,
                activeStage === stage.key && styles.stageButtonTextActive
              ]}>
                {stage.label}
              </Text>
              <View style={[
                styles.stageBadge,
                activeStage === stage.key && styles.stageBadgeActive
              ]}>
                <Text style={[
                  styles.stageBadgeText,
                  activeStage === stage.key && styles.stageBadgeTextActive
                ]}>
                  {stage.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Work Orders List */}
      <ScrollView style={styles.content}>
        {filteredWorkOrders.length > 0 ? (
          <>
            {filteredWorkOrders.map((workOrder) => (
              <TouchableOpacity
                key={workOrder.id}
                style={styles.workOrderCard}
                onPress={() => handleWorkOrderPress(workOrder)}
              >
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.workOrderNumber}>{workOrder.workOrderNumber}</Text>
                    <View
                      style={[
                        styles.stagePill,
                        { backgroundColor: `${getStageColor(workOrder.jobStage)}20` }
                      ]}
                    >
                      <Text style={[styles.stagePillText, { color: getStageColor(workOrder.jobStage) }]}>
                        {jobStages.find(s => s.key === workOrder.jobStage)?.label}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardHeaderRight}>
                    {workOrder.hasIssues && (
                      <View style={styles.issueIndicator}>
                        <AlertCircle size={16} color="#EF4444" />
                      </View>
                    )}
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(workOrder.priority) }
                      ]}
                    />
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.customerInfo}>
                  <User size={16} color="#6B7280" />
                  <Text style={styles.customerName}>{workOrder.customerName}</Text>
                </View>

                <View style={styles.businessInfo}>
                  <Building size={16} color="#6B7280" />
                  <Text style={styles.businessName}>{workOrder.businessName}</Text>
                </View>

                {/* Project Name */}
                <Text style={styles.projectName}>{workOrder.projectName}</Text>

                {/* Progress Bar (for in-progress jobs) */}
                {workOrder.completionPercentage !== undefined && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${workOrder.completionPercentage}%`, backgroundColor: getStageColor(workOrder.jobStage) }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{workOrder.completionPercentage}%</Text>
                  </View>
                )}

                {/* Details Row */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#9CA3AF" />
                    <Text style={styles.detailText}>{workOrder.startDate}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <DollarSign size={14} color="#9CA3AF" />
                    <Text style={styles.detailText}>
                      ${workOrder.contractValue.toLocaleString()}
                    </Text>
                  </View>
                  {workOrder.assignedTo.projectManager && (
                    <View style={styles.detailItem}>
                      <Users size={14} color="#9CA3AF" />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {workOrder.assignedTo.projectManager}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.lastActivity}>{workOrder.lastActivity}</Text>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Work Orders Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'No work orders match the selected stage'}
            </Text>
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
            <Text style={styles.filterTitle}>Filter Work Orders</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Priority Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Priority</Text>
              <View style={styles.filterOptions}>
                {['urgent', 'high', 'medium', 'low'].map((priority) => (
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
                        styles.priorityIndicator,
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

            {/* Team Member Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Assigned To</Text>
              <View style={styles.filterOptions}>
                {['Mike Chen', 'Emily Davis', 'Sarah Martinez', 'Michael Brown', 'Tom Rodriguez', 'John Smith'].map((person) => (
                  <TouchableOpacity
                    key={person}
                    style={[
                      styles.filterOption,
                      filters.assignedTo.includes(person) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleFilter('assignedTo', person)}
                  >
                    <View style={styles.personAvatar}>
                      <Text style={styles.personAvatarText}>
                        {person.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <Text style={[
                      styles.filterOptionText,
                      filters.assignedTo.includes(person) && styles.filterOptionTextActive
                    ]}>
                      {person}
                    </Text>
                    {filters.assignedTo.includes(person) && (
                      <CheckCircle size={18} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Issues Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setFilters(prev => ({ ...prev, hasIssues: !prev.hasIssues }))}
              >
                <View style={styles.toggleLeft}>
                  <AlertCircle size={20} color="#EF4444" />
                  <Text style={styles.toggleText}>Show only work orders with issues</Text>
                </View>
                <View style={[
                  styles.toggleSwitch,
                  filters.hasIssues && styles.toggleSwitchActive
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    filters.hasIssues && styles.toggleThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
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

      {/* Work Order Detail Modal */}
      <Modal
        visible={selectedWorkOrder !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        {selectedWorkOrder && (
          <SafeAreaView style={styles.detailModal}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={handleCloseDetail}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.detailTitle}>{selectedWorkOrder.workOrderNumber}</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.detailContent}>
              {/* Status Badge */}
              <View
                style={[
                  styles.detailStageBadge,
                  { backgroundColor: `${getStageColor(selectedWorkOrder.jobStage)}20` }
                ]}
              >
                <Text style={[styles.detailStageBadgeText, { color: getStageColor(selectedWorkOrder.jobStage) }]}>
                  {jobStages.find(s => s.key === selectedWorkOrder.jobStage)?.label}
                </Text>
              </View>

              {/* Customer Info */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Customer Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.customerName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Business</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.businessName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={[styles.detailValue, { flex: 1 }]}>{selectedWorkOrder.address}</Text>
                </View>
              </View>

              {/* Project Info */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Project Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Project Name</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.projectName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Proposal #</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.proposalNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Contract Value</Text>
                  <Text style={styles.detailValue}>${selectedWorkOrder.contractValue.toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>{selectedWorkOrder.startDate}</Text>
                </View>
                {selectedWorkOrder.endDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Date</Text>
                    <Text style={styles.detailValue}>{selectedWorkOrder.endDate}</Text>
                  </View>
                )}
                {selectedWorkOrder.completionPercentage !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Completion</Text>
                    <Text style={styles.detailValue}>{selectedWorkOrder.completionPercentage}%</Text>
                  </View>
                )}
              </View>

              {/* Team */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Assigned Team</Text>
                {selectedWorkOrder.assignedTo.salesperson && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Salesperson</Text>
                    <Text style={styles.detailValue}>{selectedWorkOrder.assignedTo.salesperson}</Text>
                  </View>
                )}
                {selectedWorkOrder.assignedTo.projectManager && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Project Manager</Text>
                    <Text style={styles.detailValue}>{selectedWorkOrder.assignedTo.projectManager}</Text>
                  </View>
                )}
                {selectedWorkOrder.assignedTo.crewLeader && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Crew Leader</Text>
                    <Text style={styles.detailValue}>{selectedWorkOrder.assignedTo.crewLeader}</Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.detailActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <FileText size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>View Work Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <User size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Contact Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Building size={20} color="#6366F1" />
                  <Text style={styles.actionButtonText}>View Deal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      <FloatingActionMenu
        onNewAppointment={handleNewAppointment}
        onNewProposal={handleNewProposal}
        onSendRequest={handleSendRequest}
        onNewLead={handleCreateLead}
        onNewJob={handleCreateJob}
      />

      {/* Quick Actions Modals */}
      <NewAppointmentModal 
        visible={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
      />

      <NewProposalModal 
        visible={showNewProposal}
        onClose={() => setShowNewProposal(false)}
      />

      <SendRequestModal 
        visible={showSendRequest}
        onClose={() => setShowSendRequest(false)}
      />

      <CreateLeadModal 
        visible={showCreateLead}
        onClose={() => setShowCreateLead(false)}
      />

      <CreateJobModal 
        visible={showCreateJob}
        onClose={() => setShowCreateJob(false)}
      />
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
  stageFilters: {
    paddingHorizontal: 20,
  },
  stageFiltersContent: {
    gap: 8,
    paddingRight: 20,
  },
  stageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  stageButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  stageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stageButtonTextActive: {
    color: '#6366F1',
  },
  stageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  stageBadgeActive: {
    backgroundColor: '#EEF2FF',
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stageBadgeTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  workOrderCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workOrderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  stagePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stagePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  issueIndicator: {
    padding: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  businessName: {
    fontSize: 14,
    color: '#6B7280',
  },
  projectName: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 35,
    textAlign: 'right',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastActivity: {
    fontSize: 12,
    color: '#9CA3AF',
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
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  personAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleText: {
    fontSize: 15,
    color: '#374151',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#6366F1',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    marginLeft: 20,
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
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailStageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 24,
  },
  detailStageBadgeText: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  detailActions: {
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
});

