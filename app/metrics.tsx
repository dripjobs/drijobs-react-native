import DrawerMenu from '@/components/DrawerMenu';
import StatCard from '@/components/StatCard';
import StatDetailModal from '@/components/StatDetailModal';
import { useTabBar } from '@/contexts/TabBarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    BarChart3,
    Building,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Filter,
    MapPin,
    Menu,
    Target,
    TrendingUp,
    User,
    Users,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type TimeRange = 'D' | 'W' | 'M' | 'Y';
type MetricType = 'sales' | 'leads' | 'estimates' | 'appointments';
type TabType = 'core' | 'insights';

interface DetailItem {
  id: string;
  customerName: string;
  detail1: string;
  detail2?: string;
  detail3?: string;
}

interface InsightDetailItem {
  name: string;
  value: string;
  detail1?: string;
  detail2?: string;
}

export default function Metrics() {
  const { setIsTransparent } = useTabBar();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('M');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStatDetail, setShowStatDetail] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<MetricType>('sales');
  const [selectedStatTitle, setSelectedStatTitle] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('core');
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [selectedInsightTitle, setSelectedInsightTitle] = useState('');
  const [selectedInsightData, setSelectedInsightData] = useState<InsightDetailItem[]>([]);

  useEffect(() => {
    setIsTransparent(false);
  }, []);

  const getMockDetailData = (type: MetricType): DetailItem[] => {
    switch (type) {
      case 'sales':
        return [
          { id: '1', customerName: 'John Smith', detail1: '$5,250.00' },
          { id: '2', customerName: 'Sarah Johnson', detail1: '$12,450.00' },
          { id: '3', customerName: 'Mike Davis', detail1: '$8,750.00' },
          { id: '4', customerName: 'Emily Wilson', detail1: '$6,500.00' },
          { id: '5', customerName: 'David Brown', detail1: '$9,200.00' },
        ];
      case 'leads':
        return [
          { id: '1', customerName: 'Jane Doe', detail1: 'Google', detail2: '2 days ago' },
          { id: '2', customerName: 'Tom Anderson', detail1: 'Angi Leads', detail2: '1 day ago' },
          { id: '3', customerName: 'Lisa Martin', detail1: 'Website', detail2: '3 hours ago' },
          { id: '4', customerName: 'Chris Taylor', detail1: 'Facebook', detail2: '5 days ago' },
          { id: '5', customerName: 'Amy White', detail1: 'Word of Mouth', detail2: '1 week ago' },
        ];
      case 'appointments':
        return [
          { id: '1', customerName: 'Robert Green', detail1: 'Today 2:00 PM', detail2: 'Estimate' },
          { id: '2', customerName: 'Nancy Lee', detail1: 'Tomorrow 10:00 AM', detail2: 'Consultation' },
          { id: '3', customerName: 'Kevin Hall', detail1: 'Wed 3:00 PM', detail2: 'Follow-up' },
          { id: '4', customerName: 'Patricia King', detail1: 'Thu 1:00 PM', detail2: 'Estimate' },
          { id: '5', customerName: 'Mark Wright', detail1: 'Fri 11:00 AM', detail2: 'Site Visit' },
        ];
      default:
        return [];
    }
  };

  const handleStatPress = (type: MetricType, title: string) => {
    setSelectedStatType(type);
    setSelectedStatTitle(title);
    setShowStatDetail(true);
  };

  const handleInsightPress = (category: string, source: string) => {
    // Generate mock detailed data based on category and source
    let detailData: InsightDetailItem[] = [];
    
    switch (category) {
      case 'leads':
        // Generate mock lead details for this source
        detailData = [
          { name: 'John Smith', value: source, detail1: '2 days ago', detail2: 'New' },
          { name: 'Sarah Johnson', value: source, detail1: '3 days ago', detail2: 'Contacted' },
          { name: 'Mike Davis', value: source, detail1: '5 days ago', detail2: 'Qualified' },
          { name: 'Emily Wilson', value: source, detail1: '1 week ago', detail2: 'Appointment Set' },
          { name: 'David Brown', value: source, detail1: '1 week ago', detail2: 'New' },
        ];
        break;
      case 'sales':
        // Generate mock sales details for this source
        detailData = [
          { name: 'Jane Doe', value: '$8,250', detail1: source, detail2: 'Completed' },
          { name: 'Tom Anderson', value: '$12,100', detail1: source, detail2: 'Completed' },
          { name: 'Lisa Martin', value: '$6,500', detail1: source, detail2: 'In Progress' },
          { name: 'Chris Taylor', value: '$7,103', detail1: source, detail2: 'Completed' },
        ];
        break;
      case 'salesperson':
        // Generate mock salesperson job details
        detailData = [
          { name: 'Interior Painting', value: '$8,500', detail1: 'Completed', detail2: 'Jan 15' },
          { name: 'Exterior Work', value: '$12,200', detail1: 'Completed', detail2: 'Jan 20' },
          { name: 'Cabinet Refinishing', value: '$5,800', detail1: 'In Progress', detail2: 'Jan 25' },
          { name: 'Deck Staining', value: '$4,100', detail1: 'Completed', detail2: 'Feb 1' },
        ];
        break;
      case 'zipcode':
        // Generate mock customer details for this zip code
        detailData = [
          { name: 'Robert Green', value: '$9,200', detail1: source, detail2: 'Completed' },
          { name: 'Nancy Lee', value: '$7,850', detail1: source, detail2: 'Completed' },
          { name: 'Kevin Hall', value: '$5,500', detail1: source, detail2: 'In Progress' },
          { name: 'Patricia King', value: '$10,300', detail1: source, detail2: 'Completed' },
        ];
        break;
      case 'crew':
        // Generate mock job details for this crew
        detailData = [
          { name: 'Smith Residence', value: '$12,500', detail1: 'Interior Paint', detail2: 'Completed' },
          { name: 'Johnson Commercial', value: '$18,200', detail1: 'Exterior Work', detail2: 'Completed' },
          { name: 'Davis Property', value: '$8,300', detail1: 'Cabinet Work', detail2: 'In Progress' },
          { name: 'Wilson Home', value: '$6,400', detail1: 'Touch-up', detail2: 'Completed' },
        ];
        break;
      case 'product':
        // Generate mock job details for this product
        detailData = [
          { name: 'Smith Residence', value: '$3,200', detail1: 'Completed', detail2: 'Jan 10' },
          { name: 'Johnson Home', value: '$4,100', detail1: 'Completed', detail2: 'Jan 18' },
          { name: 'Davis Property', value: '$2,800', detail1: 'In Progress', detail2: 'Jan 22' },
          { name: 'Wilson House', value: '$3,900', detail1: 'Completed', detail2: 'Feb 2' },
        ];
        break;
      default:
        detailData = [];
    }
    
    setSelectedInsightTitle(`${source} - Details`);
    setSelectedInsightData(detailData);
    setShowInsightModal(true);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'D': return 'Today';
      case 'W': return 'This Week';
      case 'M': return 'This Month';
      case 'Y': return 'This Year';
      default: return 'This Month';
    }
  };

  // Mock data - in real app this would come from API
  const getMetricData = () => {
    return {
      sales: {
        value: '$129,254',
        change: 12.5,
        subtitle: 'Total Revenue'
      },
      leads: {
        value: '139',
        change: 15.2,
        subtitle: 'New Leads'
      },
      set_rate: {
        value: '55.4%',
        change: 5.7,
        subtitle: 'Set Rate'
      },
      appointments: {
        value: '77',
        change: 8.3,
        subtitle: 'Appointments'
      },
      avg_job_size: {
        value: '$5,875',
        change: -2.1,
        subtitle: 'Avg. Job Size'
      },
      closing_ratio: {
        value: '31.9%',
        change: -1.8,
        subtitle: 'Closing Ratio'
      }
    };
  };

  const metrics = getMetricData();

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Metrics</Text>
          <TouchableOpacity 
            onPress={() => setDrawerOpen(true)}
            style={styles.menuButton}
          >
            <Menu size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'core' && styles.tabActive]}
          onPress={() => setActiveTab('core')}
        >
          <Text style={[styles.tabText, activeTab === 'core' && styles.tabTextActive]}>
            Core
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.tabActive]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.tabTextActive]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'core' ? (
          <>
            {/* Key Performance Indicators */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
              <Text style={styles.sectionSubtitle}>
                Track your business performance at a glance
              </Text>
            </View>

        {/* Primary Metrics */}
        <View style={styles.metricsGrid}>
          {/* Sales - Featured Large Card */}
          <View style={styles.featuredCard}>
            <StatCard
              title="Total Revenue"
              value={metrics.sales.value}
              subtitle={metrics.sales.subtitle}
              trend={{
                value: `${metrics.sales.change >= 0 ? '+' : ''}${metrics.sales.change}% vs last month`,
                isPositive: metrics.sales.change >= 0
              }}
              icon={DollarSign}
              iconColor="#10B981"
              backgroundColor="#10B981"
              onPress={() => handleStatPress('sales', 'Total Revenue')}
            />
          </View>

          {/* Secondary Metrics - 2 Column Grid */}
          <View style={styles.secondaryMetrics}>
            <View style={styles.metricCard}>
              <StatCard
                title="New Leads"
                value={metrics.leads.value}
                subtitle={metrics.leads.subtitle}
                trend={{
                  value: `${metrics.leads.change >= 0 ? '+' : ''}${metrics.leads.change}%`,
                  isPositive: metrics.leads.change >= 0
                }}
                icon={Users}
                iconColor="#6366F1"
                backgroundColor="#6366F1"
                onPress={() => handleStatPress('leads', 'New Leads')}
              />
            </View>
            <View style={styles.metricCard}>
              <StatCard
                title="Set Rate"
                value={metrics.set_rate.value}
                subtitle={metrics.set_rate.subtitle}
                trend={{
                  value: `${metrics.set_rate.change >= 0 ? '+' : ''}${metrics.set_rate.change}%`,
                  isPositive: metrics.set_rate.change >= 0
                }}
                icon={Target}
                iconColor="#8B5CF6"
                backgroundColor="#8B5CF6"
                onPress={() => handleStatPress('leads', 'Set Rate')}
              />
            </View>
          </View>

          <View style={styles.secondaryMetrics}>
            <View style={styles.metricCard}>
              <StatCard
                title="Appointments"
                value={metrics.appointments.value}
                subtitle={metrics.appointments.subtitle}
                trend={{
                  value: `${metrics.appointments.change >= 0 ? '+' : ''}${metrics.appointments.change}%`,
                  isPositive: metrics.appointments.change >= 0
                }}
                icon={Calendar}
                iconColor="#F59E0B"
                backgroundColor="#F59E0B"
                onPress={() => handleStatPress('appointments', 'Appointments')}
              />
            </View>
            <View style={styles.metricCard}>
              <StatCard
                title="Avg. Job Size"
                value={metrics.avg_job_size.value}
                subtitle={metrics.avg_job_size.subtitle}
                trend={{
                  value: `${metrics.avg_job_size.change >= 0 ? '+' : ''}${metrics.avg_job_size.change}%`,
                  isPositive: metrics.avg_job_size.change >= 0
                }}
                icon={BarChart3}
                iconColor="#10B981"
                backgroundColor="#10B981"
                onPress={() => handleStatPress('sales', 'Average Job Size')}
              />
            </View>
          </View>
        </View>

        {/* Additional Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Metrics</Text>
        </View>

        <View style={styles.additionalMetrics}>
          <View style={styles.fullWidthCard}>
            <StatCard
              title="Closing Ratio"
              value={metrics.closing_ratio.value}
              subtitle={metrics.closing_ratio.subtitle}
              trend={{
                value: `${metrics.closing_ratio.change >= 0 ? '+' : ''}${metrics.closing_ratio.change}%`,
                isPositive: metrics.closing_ratio.change >= 0
              }}
              icon={TrendingUp}
              iconColor="#EF4444"
              backgroundColor="#EF4444"
              onPress={() => handleStatPress('sales', 'Closing Ratio')}
            />
          </View>
        </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>📊 Understanding Your Metrics</Text>
              <Text style={styles.infoText}>
                Tap any metric card to see detailed breakdowns, trends, and insights. 
                Use the time range filter to view different periods.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Insights Tab Content */}
            
            {/* Lead Source Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lead Source Analysis</Text>
              <Text style={styles.sectionSubtitle}>
                Understand where your leads and revenue come from
              </Text>
            </View>

            {/* Leads By Source */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <Building size={20} color="#6366F1" />
                  <Text style={styles.insightTitle}>Leads By Source</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Angi Leads', ratio: '33.09%', count: 46 },
                  { source: 'Google', ratio: '21.58%', count: 30 },
                  { source: 'Website', ratio: '11.51%', count: 16 },
                  { source: 'Facebook', ratio: '7.91%', count: 11 },
                  { source: 'Word of Mouth', ratio: '2.16%', count: 3 },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('leads', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowCount}>{item.count}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sales By Source */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <DollarSign size={20} color="#10B981" />
                  <Text style={styles.insightTitle}>Sales By Source</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Google', ratio: '27.04%', amount: '$34,953.33' },
                  { source: 'Website', ratio: '17.80%', amount: '$23,003.64' },
                  { source: 'Facebook', ratio: '16.13%', amount: '$20,851.08' },
                  { source: 'Word of Mouth', ratio: '11.08%', amount: '$14,318.00' },
                  { source: 'Angi Leads', ratio: '6.04%', amount: '$7,811.97' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('sales', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowAmount}>{item.amount}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sales Performance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sales Performance</Text>
              <Text style={styles.sectionSubtitle}>
                Track team member performance and conversion rates
              </Text>
            </View>

            {/* Closing Ratio by Salesperson */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <User size={20} color="#8B5CF6" />
                  <Text style={styles.insightTitle}>Closing Ratio by Salesperson</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Tanner Mullen', ratio: '57.14%', jobs: '4 jobs' },
                  { source: 'Chris Palmer', ratio: '28.33%', jobs: '17 jobs' },
                  { source: 'Julio Joubert', ratio: '0%', jobs: '0 jobs' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('salesperson', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowCount}>{item.jobs}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sales By Salesperson */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <DollarSign size={20} color="#10B981" />
                  <Text style={styles.insightTitle}>Sales By Salesperson</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Chris Palmer', ratio: '80.88%', amount: '$95,604.33' },
                  { source: 'Tanner Mullen', ratio: '19.12%', amount: '$22,600.00' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('salesperson', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowAmount}>{item.amount}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Geographic Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Geographic Analysis</Text>
              <Text style={styles.sectionSubtitle}>
                Revenue and performance by location
              </Text>
            </View>

            {/* Sales By Zip Code */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <MapPin size={20} color="#06B6D4" />
                  <Text style={styles.insightTitle}>Sales By Zip Code</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: '34480', ratio: '18.62%', amount: '$24,067.77' },
                  { source: '32668', ratio: '16.13%', amount: '$20,851.08' },
                  { source: '32607', ratio: '10.87%', amount: '$14,047.22' },
                  { source: '32601', ratio: '9.09%', amount: '$11,752.29' },
                  { source: '34472', ratio: '8.55%', amount: '$11,050.00' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('zipcode', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowAmount}>{item.amount}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sales By Crew */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <Users size={20} color="#F59E0B" />
                  <Text style={styles.insightTitle}>Sales By Crew</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Beau', ratio: '28.15%', amount: '$32,465.83' },
                  { source: 'Dan', ratio: '27.44%', amount: '$31,645.04' },
                  { source: 'Mitch', ratio: '23.41%', amount: '$27,000.71' },
                  { source: 'Shemel', ratio: '21.00%', amount: '$24,226.44' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('crew', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowAmount}>{item.amount}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Product & Service Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product & Service Analysis</Text>
              <Text style={styles.sectionSubtitle}>
                Revenue breakdown by service type
              </Text>
            </View>

            {/* Sales By Product */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightHeaderLeft}>
                  <BarChart3 size={20} color="#EF4444" />
                  <Text style={styles.insightTitle}>Sales By Product</Text>
                </View>
              </View>
              <View style={styles.insightContent}>
                {[
                  { source: 'Interior Painting (Walls)', ratio: '37.41%', amount: '$24,247.50' },
                  { source: 'Interior Painting (Doors)', ratio: '15.27%', amount: '$9,900.00' },
                  { source: 'Interior Painting (Ceiling)', ratio: '15.13%', amount: '$9,806.00' },
                  { source: 'Interior Painting (Trim)', ratio: '10.82%', amount: '$7,012.00' },
                  { source: 'Exterior Painting', ratio: '9.18%', amount: '$5,950.00' },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.insightRow}
                    onPress={() => handleInsightPress('product', item.source)}
                  >
                    <View style={styles.insightRowLeft}>
                      <Text style={styles.insightRowSource}>{item.source}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: item.ratio }]} />
                      </View>
                    </View>
                    <View style={styles.insightRowRight}>
                      <Text style={styles.insightRowAmount}>{item.amount}</Text>
                      <Text style={styles.insightRowRatio}>{item.ratio}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Insights Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>💡 Key Insights</Text>
              <Text style={styles.infoText}>
                Tap any row to drill down into detailed data. Use these insights to identify top-performing channels, optimize resource allocation, and make data-driven business decisions.
              </Text>
            </View>
          </>
        )}

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
                { value: 'D', label: 'Today', description: 'View today\'s metrics' },
                { value: 'W', label: 'This Week', description: 'Last 7 days' },
                { value: 'M', label: 'This Month', description: 'Current month' },
                { value: 'Y', label: 'This Year', description: 'Year to date' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    timeRange === option.value && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    setTimeRange(option.value as TimeRange);
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

      {/* Stat Detail Modal */}
      <StatDetailModal
        visible={showStatDetail}
        onClose={() => setShowStatDetail(false)}
        type={selectedStatType}
        title={selectedStatTitle}
        data={getMockDetailData(selectedStatType)}
      />

      {/* Insight Detail Modal */}
      <Modal
        visible={showInsightModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInsightModal(false)}
      >
        <SafeAreaView style={styles.insightModalContainer}>
          <View style={styles.insightModalHeader}>
            <Text style={styles.insightModalTitle}>{selectedInsightTitle}</Text>
            <TouchableOpacity 
              onPress={() => setShowInsightModal(false)}
              style={styles.insightModalClose}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.insightModalContent}>
            {selectedInsightData.map((item, index) => (
              <View key={index} style={styles.insightDetailRow}>
                <View style={styles.insightDetailLeft}>
                  <Text style={styles.insightDetailName}>{item.name}</Text>
                  <View style={styles.insightDetailInfo}>
                    {item.detail1 && (
                      <Text style={styles.insightDetailText}>{item.detail1}</Text>
                    )}
                    {item.detail2 && (
                      <>
                        <View style={styles.insightDetailDot} />
                        <Text style={styles.insightDetailText}>{item.detail2}</Text>
                      </>
                    )}
                  </View>
                </View>
                <View style={styles.insightDetailRight}>
                  <Text style={styles.insightDetailValue}>{item.value}</Text>
                  <TouchableOpacity style={styles.insightDetailViewButton}>
                    <Text style={styles.insightDetailViewText}>VIEW</Text>
                    <ChevronRight size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
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
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  infoCard: {
    marginHorizontal: 20,
    marginTop: 8,
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
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  // Insight Card Styles
  insightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  insightHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  insightContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  insightRowLeft: {
    flex: 1,
  },
  insightRowSource: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  insightRowRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  insightRowCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  insightRowAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 2,
  },
  insightRowRatio: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
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
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
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
    color: '#4338CA',
  },
  filterOptionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterOptionDescriptionActive: {
    color: '#6366F1',
  },
  filterOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  filterOptionCheckmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Insight Detail Modal Styles
  insightModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  insightModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  insightModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  insightModalClose: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightModalContent: {
    flex: 1,
    padding: 16,
  },
  insightDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightDetailLeft: {
    flex: 1,
    marginRight: 12,
  },
  insightDetailName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  insightDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  insightDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  insightDetailDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  insightDetailRight: {
    alignItems: 'flex-end',
  },
  insightDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  insightDetailViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
  },
  insightDetailViewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
});

