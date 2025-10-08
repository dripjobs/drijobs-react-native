import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CrewMemberDetail } from '../components/CrewMemberDetail';
import { CrewMemberForm } from '../components/CrewMemberForm';
import { CrewMembersList } from '../components/CrewMembersList';
import { SubcontractorDetail } from '../components/SubcontractorDetail';
import { SubcontractorForm } from '../components/SubcontractorForm';
import { SubcontractorsList } from '../components/SubcontractorsList';
import { TimesheetManagement } from '../components/TimesheetManagement';
import { useTabBar } from '../contexts/TabBarContext';
import { crewService } from '../services/CrewService';
import { CrewMember, CrewMetrics, Subcontractor } from '../types/crew';

type CrewView = 'members' | 'subcontractors' | 'timesheets';
type DetailView = 'list' | 'member_detail' | 'subcontractor_detail';

export default function CrewsScreen() {
  const { setIsTabBarVisible } = useTabBar();
  const [activeView, setActiveView] = useState<CrewView>('members');
  const [detailView, setDetailView] = useState<DetailView>('list');
  const [metrics, setMetrics] = useState<CrewMetrics | null>(null);
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [isCrewFormOpen, setIsCrewFormOpen] = useState(false);
  const [isSubcontractorFormOpen, setIsSubcontractorFormOpen] = useState(false);
  const [crewFormMode, setCrewFormMode] = useState<'create' | 'edit'>('create');
  const [subcontractorFormMode, setSubcontractorFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    setIsTabBarVisible(false);
    loadMetrics();
    return () => setIsTabBarVisible(true);
  }, []);

  const loadMetrics = () => {
    setMetrics(crewService.getMetrics());
  };

  const handleCreateCrewMember = () => {
    setSelectedMember(null);
    setCrewFormMode('create');
    setIsCrewFormOpen(true);
  };

  const handleEditCrewMember = (member: CrewMember) => {
    setSelectedMember(member);
    setCrewFormMode('edit');
    setIsCrewFormOpen(true);
  };

  const handleViewCrewMember = (member: CrewMember) => {
    setSelectedMember(member);
    setDetailView('member_detail');
  };

  const handleSaveCrewMember = (memberData: Omit<CrewMember, 'id' | 'employeeNumber' | 'createdAt' | 'updatedAt'>) => {
    if (crewFormMode === 'create') {
      crewService.createCrewMember(memberData);
    } else if (selectedMember) {
      const updatedMember = crewService.updateCrewMember(selectedMember.id, memberData);
      if (updatedMember) {
        setSelectedMember(updatedMember);
      }
    }
    loadMetrics();
    setIsCrewFormOpen(false);
  };

  const handleCreateSubcontractor = () => {
    setSelectedSubcontractor(null);
    setSubcontractorFormMode('create');
    setIsSubcontractorFormOpen(true);
  };

  const handleEditSubcontractor = (subcontractor: Subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setSubcontractorFormMode('edit');
    setIsSubcontractorFormOpen(true);
  };

  const handleViewSubcontractor = (subcontractor: Subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setDetailView('subcontractor_detail');
  };

  const handleSaveSubcontractor = (subData: Omit<Subcontractor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (subcontractorFormMode === 'create') {
      crewService.createSubcontractor(subData);
    } else if (selectedSubcontractor) {
      const updatedSubcontractor = crewService.updateSubcontractor(selectedSubcontractor.id, subData);
      if (updatedSubcontractor) {
        setSelectedSubcontractor(updatedSubcontractor);
      }
    }
    loadMetrics();
    setIsSubcontractorFormOpen(false);
  };

  const handleBackToList = () => {
    setDetailView('list');
    setSelectedMember(null);
    setSelectedSubcontractor(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderContent = () => {
    if (detailView === 'member_detail' && selectedMember) {
      return (
        <CrewMemberDetail
          member={selectedMember}
          onBack={handleBackToList}
          onEdit={handleEditCrewMember}
        />
      );
    }

    if (detailView === 'subcontractor_detail' && selectedSubcontractor) {
      return (
        <SubcontractorDetail
          subcontractor={selectedSubcontractor}
          onBack={handleBackToList}
          onEdit={handleEditSubcontractor}
        />
      );
    }

    switch (activeView) {
      case 'members':
        return (
          <CrewMembersList
            onCreateMember={handleCreateCrewMember}
            onEditMember={handleEditCrewMember}
            onViewMember={handleViewCrewMember}
          />
        );
      case 'subcontractors':
        return (
          <SubcontractorsList
            onCreateSubcontractor={handleCreateSubcontractor}
            onEditSubcontractor={handleEditSubcontractor}
            onViewSubcontractor={handleViewSubcontractor}
          />
        );
      case 'timesheets':
        return <TimesheetManagement />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Crews',
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.container}>
        {/* Metrics Cards */}
        {metrics && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.metricsScroll}
            contentContainerStyle={styles.metricsContainer}
          >
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="people" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.metricValue}>{metrics.totalActiveMembers}</Text>
              <Text style={styles.metricLabel}>Active Members</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="time" size={20} color="#10b981" />
              </View>
              <Text style={styles.metricValue}>{metrics.totalHoursThisWeek.toFixed(1)}</Text>
              <Text style={styles.metricLabel}>Hours This Week</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: '#e9d5ff' }]}>
                <Ionicons name="cash" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.metricValue}>{formatCurrency(metrics.totalPayrollThisWeek)}</Text>
              <Text style={styles.metricLabel}>Payroll This Week</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: '#fed7aa' }]}>
                <Ionicons name="alert-circle" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.metricValue}>{metrics.expiringCertifications}</Text>
              <Text style={styles.metricLabel}>Expiring Certs</Text>
            </View>
          </ScrollView>
        )}

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TouchableOpacity
              onPress={() => {
                setActiveView('members');
                setDetailView('list');
              }}
              style={[styles.tab, activeView === 'members' && styles.tabActive]}
            >
              <Ionicons 
                name="people" 
                size={18} 
                color={activeView === 'members' ? '#3b82f6' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeView === 'members' && styles.tabTextActive]}>
                Crew Members ({metrics?.totalActiveMembers || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveView('subcontractors');
                setDetailView('list');
              }}
              style={[styles.tab, activeView === 'subcontractors' && styles.tabActive]}
            >
              <Ionicons 
                name="business" 
                size={18} 
                color={activeView === 'subcontractors' ? '#3b82f6' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeView === 'subcontractors' && styles.tabTextActive]}>
                Subcontractors ({metrics?.totalSubcontractors || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveView('timesheets');
                setDetailView('list');
              }}
              style={[styles.tab, activeView === 'timesheets' && styles.tabActive]}
            >
              <Ionicons 
                name="time" 
                size={18} 
                color={activeView === 'timesheets' ? '#3b82f6' : '#6b7280'} 
              />
              <Text style={[styles.tabText, activeView === 'timesheets' && styles.tabTextActive]}>
                Timesheets ({metrics?.pendingTimesheets || 0} pending)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>

        {/* Forms */}
        <CrewMemberForm
          isOpen={isCrewFormOpen}
          onClose={() => setIsCrewFormOpen(false)}
          onSave={handleSaveCrewMember}
          member={selectedMember}
          mode={crewFormMode}
        />

        <SubcontractorForm
          isOpen={isSubcontractorFormOpen}
          onClose={() => setIsSubcontractorFormOpen(false)}
          onSave={handleSaveSubcontractor}
          subcontractor={selectedSubcontractor}
          mode={subcontractorFormMode}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  metricsScroll: {
    flexGrow: 0,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    minWidth: 140,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#dbeafe',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});
