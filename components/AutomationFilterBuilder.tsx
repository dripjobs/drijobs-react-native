import { AutomationFilter, FILTER_FIELDS, FilterOperator } from '@/types/automations';
import {
    ChevronDown,
    ChevronUp,
    Filter,
    Plus,
    Trash2,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AutomationFilterBuilderProps {
  pipeline: string;
  filters: AutomationFilter[];
  onFiltersChange: (filters: AutomationFilter[]) => void;
  onClose?: () => void;
}

export default function AutomationFilterBuilder({
  pipeline,
  filters,
  onFiltersChange,
  onClose
}: AutomationFilterBuilderProps) {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const availableFields = FILTER_FIELDS[pipeline as keyof typeof FILTER_FIELDS] || [];

  const getOperatorsForField = (fieldType: string): FilterOperator[] => {
    switch (fieldType) {
      case 'text':
        return ['contains', 'does_not_contain', 'equals', 'does_not_equal', 'is_empty', 'is_not_empty'];
      case 'number':
        return ['equals', 'does_not_equal', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'];
      case 'labels':
        return ['has_label', 'does_not_have_label'];
      default:
        return ['contains', 'equals'];
    }
  };

  const getOperatorLabel = (operator: FilterOperator): string => {
    const labels: Record<FilterOperator, string> = {
      'contains': 'Contains',
      'does_not_contain': 'Does not contain',
      'equals': 'Equals',
      'does_not_equal': 'Does not equal',
      'is_empty': 'Is empty',
      'is_not_empty': 'Is not empty',
      'greater_than': 'Greater than',
      'less_than': 'Less than',
      'greater_than_or_equal': 'Greater than or equal',
      'less_than_or_equal': 'Less than or equal',
      'has_label': 'Has label',
      'does_not_have_label': 'Does not have label'
    };
    return labels[operator] || operator;
  };

  const addFilter = () => {
    const newFilter: AutomationFilter = {
      id: `filter-${Date.now()}`,
      field: availableFields[0]?.key || '',
      operator: 'contains',
      value: '',
      logicalOperator: filters.length > 0 ? 'AND' : undefined
    };
    onFiltersChange([...filters, newFilter]);
    setExpandedFilter(newFilter.id);
  };

  const updateFilter = (filterId: string, updates: Partial<AutomationFilter>) => {
    const updatedFilters = filters.map(filter => 
      filter.id === filterId ? { ...filter, ...updates } : filter
    );
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (filterId: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    onFiltersChange(updatedFilters);
    if (expandedFilter === filterId) {
      setExpandedFilter(null);
    }
  };

  const getFieldType = (fieldKey: string): string => {
    const field = availableFields.find(f => f.key === fieldKey);
    return field?.type || 'text';
  };

  const renderFilterValue = (filter: AutomationFilter) => {
    const fieldType = getFieldType(filter.field);
    
    if (['is_empty', 'is_not_empty'].includes(filter.operator)) {
      return null; // No value needed for these operators
    }

    if (fieldType === 'labels') {
      return (
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Label name:</Text>
          <TextInput
            style={[
              styles.valueInput,
              focusedInput === `value-${filter.id}` && styles.valueInputFocused
            ]}
            value={filter.value as string}
            onChangeText={(text) => updateFilter(filter.id, { value: text })}
            placeholder="Enter label name..."
            placeholderTextColor="#9CA3AF"
            onFocus={() => setFocusedInput(`value-${filter.id}`)}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      );
    }

    if (fieldType === 'number') {
      return (
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <TextInput
            style={[
              styles.valueInput,
              focusedInput === `value-${filter.id}` && styles.valueInputFocused
            ]}
            value={filter.value?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseFloat(text);
              updateFilter(filter.id, { value: isNaN(numValue) ? text : numValue });
            }}
            placeholder="Enter number..."
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            onFocus={() => setFocusedInput(`value-${filter.id}`)}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      );
    }

    // Text field
    return (
      <View style={styles.valueContainer}>
        <Text style={styles.valueLabel}>Value:</Text>
        <TextInput
          style={[
            styles.valueInput,
            focusedInput === `value-${filter.id}` && styles.valueInputFocused
          ]}
          value={filter.value as string}
          onChangeText={(text) => updateFilter(filter.id, { value: text })}
          placeholder="Enter text..."
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocusedInput(`value-${filter.id}`)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    );
  };

  const renderFilter = (filter: AutomationFilter, index: number) => {
    const isExpanded = expandedFilter === filter.id;
    const fieldType = getFieldType(filter.field);
    const operators = getOperatorsForField(fieldType);
    const selectedField = availableFields.find(f => f.key === filter.field);

    return (
      <View key={filter.id} style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View style={styles.filterHeaderLeft}>
            {index > 0 && (
              <View style={styles.logicalOperatorContainer}>
                <TouchableOpacity
                  style={[
                    styles.logicalOperatorButton,
                    filter.logicalOperator === 'AND' && styles.logicalOperatorButtonActive
                  ]}
                  onPress={() => updateFilter(filter.id, { 
                    logicalOperator: filter.logicalOperator === 'AND' ? 'OR' : 'AND' 
                  })}
                >
                  <Text style={[
                    styles.logicalOperatorText,
                    filter.logicalOperator === 'AND' && styles.logicalOperatorTextActive
                  ]}>
                    {filter.logicalOperator}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.filterSummary}
              onPress={() => setExpandedFilter(isExpanded ? null : filter.id)}
            >
              <View style={styles.filterSummaryContent}>
                <Text style={styles.filterSummaryText}>
                  {selectedField?.label || filter.field} {getOperatorLabel(filter.operator)} {filter.value}
                </Text>
                {isExpanded ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeFilterButton}
            onPress={() => removeFilter(filter.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.filterDetails}>
            {/* Field Selection */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>Field</Text>
              <View style={styles.fieldSelector}>
                {availableFields.map(field => (
                  <TouchableOpacity
                    key={field.key}
                    style={[
                      styles.fieldOption,
                      filter.field === field.key && styles.fieldOptionActive
                    ]}
                    onPress={() => {
                      updateFilter(filter.id, { field: field.key, operator: 'contains' });
                    }}
                  >
                    <Text style={[
                      styles.fieldOptionText,
                      filter.field === field.key && styles.fieldOptionTextActive
                    ]}>
                      {field.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Operator Selection */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>Condition</Text>
              <View style={styles.operatorSelector}>
                {operators.map(operator => (
                  <TouchableOpacity
                    key={operator}
                    style={[
                      styles.operatorOption,
                      filter.operator === operator && styles.operatorOptionActive
                    ]}
                    onPress={() => updateFilter(filter.id, { operator })}
                  >
                    <Text style={[
                      styles.operatorOptionText,
                      filter.operator === operator && styles.operatorOptionTextActive
                    ]}>
                      {getOperatorLabel(operator)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Value Input */}
            {renderFilterValue(filter)}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={20} color="#6366F1" />
          <Text style={styles.headerTitle}>Filter Conditions</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filters.length === 0 ? (
          <View style={styles.emptyState}>
            <Filter size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No filters configured</Text>
            <Text style={styles.emptySubtitle}>
              Add filter conditions to control when this automation runs
            </Text>
          </View>
        ) : (
          <View style={styles.filtersList}>
            {filters.map((filter, index) => renderFilter(filter, index))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addFilterButton}
          onPress={addFilter}
        >
          <Plus size={20} color="#6366F1" />
          <Text style={styles.addFilterButtonText}>Add Filter Condition</Text>
        </TouchableOpacity>

        {filters.length > 0 && (
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Filter Logic</Text>
            <Text style={styles.helpText}>
              Filters are combined with AND logic. All conditions must be true for the automation to run.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  filtersList: {
    padding: 20,
    gap: 12,
  },
  filterCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  filterHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logicalOperatorContainer: {
    marginRight: 8,
  },
  logicalOperatorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  logicalOperatorButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  logicalOperatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  logicalOperatorTextActive: {
    color: '#FFFFFF',
  },
  filterSummary: {
    flex: 1,
  },
  filterSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSummaryText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  removeFilterButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  fieldSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fieldOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  fieldOptionActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  fieldOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  fieldOptionTextActive: {
    color: '#FFFFFF',
  },
  operatorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  operatorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  operatorOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  operatorOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  operatorOptionTextActive: {
    color: '#FFFFFF',
  },
  valueContainer: {
    marginTop: 8,
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  valueInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  valueInputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },
  addFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    backgroundColor: '#F5F7FF',
  },
  addFilterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  helpSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
  },
});
