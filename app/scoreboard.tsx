import DrawerMenu from '@/components/DrawerMenu';
import StatCard from '@/components/StatCard';
import { useTabBar } from '@/contexts/TabBarContext';
import { useIsSalesperson, useUserRole } from '@/contexts/UserRoleContext';
import { salespersonService } from '@/services/SalespersonService';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    BarChart3,
    Calendar,
    ChevronDown,
    DollarSign,
    FileText,
    Filter,
    Target,
    TrendingUp,
    X
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type TimeRange = 'day' | 'week' | 'month' | 'year';

export default function Scoreboard() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const isSalesperson = useIsSalesperson();
  const { impersonatingSalespersonId } = useUserRole();

  useEffect(() => {
    setIsTransparent(false);
  }, []);

  // Redirect if not salesperson
  useEffect(() => {
    if (!isSalesperson) {
      router.push('/metrics');
    }
  }, [isSalesperson]);

  // Get salesperson metrics
  const salespersonId = impersonatingSalespersonId || 'sp1';
  const metrics = salespersonService.getSalespersonMetrics(salespersonId, timeRange);
  const salesperson = salespersonService.getSalespersonById(salespersonId);
  const salesProgress = salesperson ? salespersonService.getSalesProgress(salespersonId) : 0;

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => setDrawerOpen(true)}
            style={styles.pullOutMenu}
          >
            <View style={styles.pullOutIndicator}>
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
              <View style={styles.pullOutDot} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Scoreboard</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.headerSubtitle}>
          {salesperson ? `${salesperson.firstName} ${salesperson.lastName}` : 'Your Performance'}
        </Text>

        {/* Time Range & Filter */}
        <View style={styles.filterRow}>
          <View style={styles.timeRangeContainer}>
            <Text style={styles.timeRangeLabel}>{getTimeRangeLabel()}</Text>
            <TouchableOpacity 
              style={styles.timeRangeButton}
              onPress={() => setShowFilterModal(true)}
            >
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sales Target Progress */}
        {salesperson && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sales Target Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Target: ${(salesperson.salesTarget / 1000).toFixed(0)}k</Text>
                <Text style={styles.progressPercentage}>{salesProgress.toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${Math.min(salesProgress, 100)}%` }]} />
              </View>
              <Text style={styles.progressSubtext}>
                ${(salesperson.currentSales / 1000).toFixed(1)}k / ${(salesperson.salesTarget / 1000).toFixed(0)}k
              </Text>
            </View>
          </View>
        )}

        {/* Key Performance Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Performance</Text>
          <Text style={styles.sectionSubtitle}>
            Track your sales metrics and achievements
          </Text>
        </View>

        {/* Primary Metrics */}
        <View style={styles.metricsGrid}>
          {/* Total Sales - Featured Large Card */}
          <View style={styles.featuredCard}>
            <StatCard
              title="Total Sales"
              value={`$${(metrics.totalSales / 1000).toFixed(1)}k`}
              subtitle="Revenue Generated"
              trend={{
                value: `${metrics.salesTrend >= 0 ? '+' : ''}${metrics.salesTrend.toFixed(1)}% vs last period`,
                isPositive: metrics.salesTrend >= 0
              }}
              icon={DollarSign}
              iconColor="#10B981"
              backgroundColor="#10B981"
            />
          </View>

          {/* Secondary Metrics - 2 Column Grid */}
          <View style={styles.secondaryMetrics}>
            <View style={styles.metricCard}>
              <StatCard
                title="Closing Ratio"
                value={`${metrics.closingRatio.toFixed(1)}%`}
                subtitle="Win Rate"
                trend={{
                  value: `${metrics.closingRatioTrend >= 0 ? '+' : ''}${metrics.closingRatioTrend.toFixed(1)}%`,
                  isPositive: metrics.closingRatioTrend >= 0
                }}
                icon={Target}
                iconColor="#8B5CF6"
                backgroundColor="#8B5CF6"
              />
            </View>
            <View style={styles.metricCard}>
              <StatCard
                title="Proposals Sent"
                value={metrics.proposalsSent.toString()}
                subtitle="Active Proposals"
                trend={{
                  value: `${metrics.proposalsTrend >= 0 ? '+' : ''}${metrics.proposalsTrend.toFixed(1)}%`,
                  isPositive: metrics.proposalsTrend >= 0
                }}
                icon={FileText}
                iconColor="#F59E0B"
                backgroundColor="#F59E0B"
              />
            </View>
          </View>

          <View style={styles.secondaryMetrics}>
            <View style={styles.metricCard}>
              <StatCard
                title="Appointments Set"
                value={metrics.appointmentsSet.toString()}
                subtitle="This Period"
                trend={{
                  value: `${metrics.appointmentsTrend >= 0 ? '+' : ''}${metrics.appointmentsTrend.toFixed(1)}%`,
                  isPositive: metrics.appointmentsTrend >= 0
                }}
                icon={Calendar}
                iconColor="#6366F1"
                backgroundColor="#6366F1"
              />
            </View>
            <View style={styles.metricCard}>
              <StatCard
                title="Pipeline Value"
                value={`$${(metrics.pipelineValue / 1000).toFixed(1)}k`}
                subtitle="Potential Revenue"
                trend={{
                  value: `${metrics.dealsWon} won, ${metrics.dealsLost} lost`,
                  isPositive: true
                }}
                icon={TrendingUp}
                iconColor="#10B981"
                backgroundColor="#10B981"
              />
            </View>
          </View>
        </View>

        {/* Additional Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Insights</Text>
        </View>

        <View style={styles.additionalMetrics}>
          <View style={styles.fullWidthCard}>
            <StatCard
              title="Average Deal Size"
              value={`$${(metrics.averageDealSize / 1000).toFixed(1)}k`}
              subtitle="Per Closed Deal"
              trend={{
                value: `${metrics.dealsWon} deals closed`,
                isPositive: true
              }}
              icon={BarChart3}
              iconColor="#EF4444"
              backgroundColor="#EF4444"
            />
          </View>
        </View>

        {/* Motivational Card */}
        <View style={styles.motivationalCard}>
          <Text style={styles.motivationalTitle}>
            {salesProgress >= 100 
              ? '🎉 Target Achieved!'
              : salesProgress >= 75
              ? '🔥 Almost There!'
              : salesProgress >= 50
              ? '💪 Keep Going!'
              : '🚀 Let\'s Do This!'}
          </Text>
          <Text style={styles.motivationalText}>
            {salesProgress >= 100 
              ? 'Congratulations! You\'ve exceeded your sales target. Outstanding work!'
              : salesProgress >= 75
              ? `You're ${(100 - salesProgress).toFixed(0)}% away from your target. Finish strong!`
              : salesProgress >= 50
              ? `You're halfway there! ${(100 - salesProgress).toFixed(0)}% more to reach your goal.`
              : `You've got this! Focus on ${Math.ceil((salesperson?.salesTarget || 0 - (salesperson?.currentSales || 0)) / metrics.averageDealSize)} more deals.`}
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📊 Your Performance Dashboard</Text>
          <Text style={styles.infoText}>
            This scoreboard shows your personal sales metrics. All data is filtered to show only your performance. Keep up the great work!
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Time Range Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Select Time Range</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              {[
                { value: 'day' as TimeRange, label: 'Today', description: 'View today\'s metrics' },
                { value: 'week' as TimeRange, label: 'This Week', description: 'Last 7 days' },
                { value: 'month' as TimeRange, label: 'This Month', description: 'Current month' },
                { value: 'year' as TimeRange, label: 'This Year', description: 'Year to date' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    timeRange === option.value && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    setTimeRange(option.value);
                    setShowFilterModal(false);
                  }}
                >
                  <View style={styles.filterOptionContent}>
                    <Text style={[
                      styles.filterOptionLabel,
                      timeRange === option.value && styles.filterOptionLabelActive
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.filterOptionDescription,
                      timeRange === option.value && styles.filterOptionDescriptionActive
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                  {timeRange === option.value && (
                    <View style={styles.filterOptionCheck}>
                      <Text style={styles.filterOptionCheckmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pullOutMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  timeRangeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeRangeButton: {
    padding: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f59e0b',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricsGrid: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    marginBottom: 16,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
  },
  additionalMetrics: {
    paddingHorizontal: 20,
  },
  fullWidthCard: {
    marginBottom: 16,
  },
  motivationalCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  motivationalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4F46E5',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  filterOptions: {
    padding: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterOptionActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#f59e0b',
  },
  filterOptionContent: {
    flex: 1,
  },
  filterOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  filterOptionLabelActive: {
    color: '#92400E',
  },
  filterOptionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterOptionDescriptionActive: {
    color: '#92400E',
  },
  filterOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  filterOptionCheckmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


