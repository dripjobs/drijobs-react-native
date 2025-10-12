/**
 * Revenue Scorecard Component
 * Modal overlay displaying revenue by crew with configurable settings
 */

import { Briefcase, ChevronLeft, ChevronRight, DollarSign, TrendingUp, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { revenueService } from '../services/RevenueService';
import { Job } from '../types/jobs';
import { RevenueCalculationResult, RevenuePeriod, RevenueSettings } from '../types/revenue';

interface RevenueScorecardProps {
  visible: boolean;
  onClose: () => void;
  jobs: Job[];
}

export default function RevenueScorecard({ visible, onClose, jobs }: RevenueScorecardProps) {
  const [period, setPeriod] = useState<RevenuePeriod>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<RevenueSettings>({
    excludeWeekends: false,
    carryOverRevenue: false,
  });
  const [revenueData, setRevenueData] = useState<RevenueCalculationResult | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Calculate revenue when inputs change
  useEffect(() => {
    if (visible) {
      const result = revenueService.getRevenueForPeriod(jobs, period, currentDate, settings);
      setRevenueData(result);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, jobs, period, currentDate, settings]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = revenueService.navigatePeriod(currentDate, period, direction);
    setCurrentDate(newDate);
  };

  const handlePeriodChange = (newPeriod: RevenuePeriod) => {
    setPeriod(newPeriod);
  };

  const handleToggleSetting = (key: keyof RevenueSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const periodLabel = revenueService.formatPeriodLabel(period, currentDate);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Revenue Scorecard</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Exclude Weekends</Text>
                <Text style={styles.settingDescription}>Only count weekday revenue</Text>
              </View>
              <Switch
                value={settings.excludeWeekends}
                onValueChange={() => handleToggleSetting('excludeWeekends')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={settings.excludeWeekends ? '#3B82F6' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Carry Over Revenue</Text>
                <Text style={styles.settingDescription}>Pro-rate revenue across months</Text>
              </View>
              <Switch
                value={settings.carryOverRevenue}
                onValueChange={() => handleToggleSetting('carryOverRevenue')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={settings.carryOverRevenue ? '#3B82F6' : '#F3F4F6'}
              />
            </View>
          </View>

          {/* Period Tabs */}
          <View style={styles.periodTabs}>
            <TouchableOpacity
              style={[styles.periodTab, period === 'day' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('day')}
            >
              <Text style={[styles.periodTabText, period === 'day' && styles.periodTabTextActive]}>
                Day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodTab, period === 'week' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('week')}
            >
              <Text style={[styles.periodTabText, period === 'week' && styles.periodTabTextActive]}>
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodTab, period === 'month' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('month')}
            >
              <Text style={[styles.periodTabText, period === 'month' && styles.periodTabTextActive]}>
                Month
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Navigation */}
          <View style={styles.dateNavigation}>
            <TouchableOpacity onPress={() => handleNavigate('prev')} style={styles.navButton}>
              <ChevronLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.periodLabel}>{periodLabel}</Text>
            <TouchableOpacity onPress={() => handleNavigate('next')} style={styles.navButton}>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Total Revenue Summary */}
          {revenueData && (
            <View style={styles.totalRevenueSection}>
              <Text style={styles.totalRevenueLabel}>Total Revenue</Text>
              <Text style={styles.totalRevenueAmount}>
                ${revenueData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          )}

          {/* Revenue by Crew */}
          <ScrollView style={styles.revenueList} showsVerticalScrollIndicator={false}>
            {revenueData && revenueData.crewRevenues.length > 0 ? (
              <Animated.View style={{ opacity: fadeAnim }}>
                {revenueData.crewRevenues.map((crewRevenue, index) => (
                  <View key={crewRevenue.crewId} style={styles.crewCard}>
                    <View style={styles.crewCardHeader}>
                      <View style={styles.crewRank}>
                        <Text style={styles.crewRankText}>#{index + 1}</Text>
                      </View>
                      <View style={styles.crewInfo}>
                        <Text style={styles.crewName}>{crewRevenue.crewName}</Text>
                        <View style={styles.crewMeta}>
                          <Briefcase size={14} color="#6B7280" />
                          <Text style={styles.crewJobCount}>
                            {crewRevenue.jobCount} job{crewRevenue.jobCount !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.crewRevenueSection}>
                      <View style={styles.revenueIconContainer}>
                        <DollarSign size={24} color="#10B981" />
                      </View>
                      <View style={styles.revenueAmountContainer}>
                        <Text style={styles.revenueAmount}>
                          ${crewRevenue.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                        <Text style={styles.revenuePerJob}>
                          ${(crewRevenue.totalRevenue / crewRevenue.jobCount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per job
                        </Text>
                      </View>
                      {index === 0 && revenueData.crewRevenues.length > 1 && (
                        <View style={styles.topPerformerBadge}>
                          <TrendingUp size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    {/* Progress bar relative to top performer */}
                    {revenueData.crewRevenues.length > 1 && (
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${(crewRevenue.totalRevenue / revenueData.crewRevenues[0].totalRevenue) * 100}%`,
                              backgroundColor: index === 0 ? '#10B981' : '#6366F1',
                            }
                          ]} 
                        />
                      </View>
                    )}
                  </View>
                ))}
              </Animated.View>
            ) : (
              <View style={styles.emptyState}>
                <DollarSign size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No revenue data for this period</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your settings or selecting a different time period
                </Text>
              </View>
            )}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#6366F1',
  },
  periodTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  totalRevenueSection: {
    backgroundColor: '#EEF2FF',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  totalRevenueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 8,
  },
  totalRevenueAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6366F1',
  },
  revenueList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  crewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  crewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  crewRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  crewRankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  crewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  crewJobCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  crewRevenueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  revenueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  revenueAmountContainer: {
    flex: 1,
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  revenuePerJob: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  topPerformerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomSpacing: {
    height: 24,
  },
});

