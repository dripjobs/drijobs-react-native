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
  const [selectedCrewForAudit, setSelectedCrewForAudit] = useState<string | null>(null);

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

  const handleCrewCardPress = (crewId: string) => {
    setSelectedCrewForAudit(crewId);
  };

  const handleCloseAuditModal = () => {
    setSelectedCrewForAudit(null);
  };

  const periodLabel = revenueService.formatPeriodLabel(period, currentDate);
  const selectedCrewData = revenueData?.crewRevenues.find(crew => crew.crewId === selectedCrewForAudit);

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
                  <TouchableOpacity 
                    key={crewRevenue.crewId} 
                    style={styles.crewCard}
                    onPress={() => handleCrewCardPress(crewRevenue.crewId)}
                    activeOpacity={0.7}
                  >
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
                  </TouchableOpacity>
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

      {/* Audit Trail Modal */}
      <Modal
        visible={selectedCrewForAudit !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseAuditModal}
      >
        <View style={styles.auditModalOverlay}>
          <View style={styles.auditModalContainer}>
            {/* Audit Modal Header */}
            <View style={styles.auditHeader}>
              <TouchableOpacity onPress={handleCloseAuditModal} style={styles.auditBackButton}>
                <ChevronLeft size={24} color="#6B7280" />
              </TouchableOpacity>
              <View style={styles.auditHeaderContent}>
                <Text style={styles.auditHeaderTitle}>Job Breakdown</Text>
                {selectedCrewData && (
                  <Text style={styles.auditHeaderSubtitle}>{selectedCrewData.crewName}</Text>
                )}
              </View>
              <View style={styles.headerSpacer} />
            </View>

            {/* Audit Summary Card */}
            {selectedCrewData && (
              <View style={styles.auditSummaryCard}>
                <View style={styles.auditSummaryRow}>
                  <View style={styles.auditSummaryItem}>
                    <Text style={styles.auditSummaryLabel}>Total Revenue</Text>
                    <Text style={styles.auditSummaryValue}>
                      ${selectedCrewData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <View style={styles.auditSummaryDivider} />
                  <View style={styles.auditSummaryItem}>
                    <Text style={styles.auditSummaryLabel}>Total Jobs</Text>
                    <Text style={styles.auditSummaryValue}>{selectedCrewData.jobCount}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Job List */}
            <ScrollView style={styles.auditJobList} showsVerticalScrollIndicator={false}>
              {selectedCrewData && selectedCrewData.jobs.length > 0 ? (
                <>
                  <Text style={styles.jobListHeader}>
                    All Jobs for {periodLabel}
                  </Text>
                  {selectedCrewData.jobs.map((job, index) => (
                    <View key={job.jobId} style={styles.auditJobCard}>
                      <View style={styles.auditJobHeader}>
                        <View style={styles.auditJobNumber}>
                          <Text style={styles.auditJobNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.auditJobInfo}>
                          <Text style={styles.auditJobName}>{job.jobName}</Text>
                          <Text style={styles.auditJobId}>Job ID: {job.jobId}</Text>
                        </View>
                      </View>
                      <View style={styles.auditJobRevenue}>
                        <View style={styles.auditRevenueIconContainer}>
                          <DollarSign size={20} color="#10B981" />
                        </View>
                        <Text style={styles.auditJobRevenueAmount}>
                          ${job.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.bottomSpacing} />
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No jobs found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Audit Modal Styles
  auditModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  auditModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  auditBackButton: {
    padding: 4,
  },
  auditHeaderContent: {
    flex: 1,
    alignItems: 'center',
  },
  auditHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  auditHeaderSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  auditSummaryCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  auditSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  auditSummaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 16,
  },
  auditSummaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  auditSummaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  auditJobList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobListHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 12,
  },
  auditJobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  auditJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  auditJobNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  auditJobNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  auditJobInfo: {
    flex: 1,
  },
  auditJobName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  auditJobId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  auditJobRevenue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  auditRevenueIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  auditJobRevenueAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
});

