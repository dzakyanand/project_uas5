import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SectionList,
} from 'react-native';
import { colors } from '../../constants/colors';

interface DropdownSection {
  title: string;
  data: DropdownOption[];
}

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

interface DropdownWithSectionsProps {
  label?: string;
  sections: DropdownSection[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  style?: any;
}

const DropdownWithSections: React.FC<DropdownWithSectionsProps> = ({
  label,
  sections,
  selectedValue,
  onValueChange,
  placeholder = 'Pilih opsi',
  error,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten semua options untuk mencari selected option
  const allOptions = sections.flatMap(section => section.data);
  const selectedOption = allOptions.find(opt => opt.value === selectedValue);

  // Filter sections berdasarkan search query
  const filteredSections = sections.map(section => ({
    ...section,
    data: searchQuery
      ? section.data.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : section.data,
  })).filter(section => section.data.length > 0);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderSectionHeader = ({ section }: { section: DropdownSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderOptionItem = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item.value && styles.selectedOptionItem,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <View style={styles.optionContent}>
        {item.icon && (
          <View style={styles.optionIconContainer}>
            <Text style={styles.optionIcon}>{item.icon}</Text>
          </View>
        )}
        <View style={styles.optionTextContainer}>
          <Text
            style={[
              styles.optionLabel,
              selectedValue === item.value && styles.selectedOptionLabel,
            ]}
          >
            {item.label}
          </Text>
          {item.description && (
            <Text style={styles.optionDescription}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      {selectedValue === item.value && (
        <Text style={styles.checkIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.errorBorder,
          modalVisible && styles.dropdownButtonFocused,
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectedContainer}>
          {selectedOption?.icon && (
            <Text style={styles.buttonIcon}>{selectedOption.icon}</Text>
          )}
          <Text
            style={[
              styles.selectedText,
              !selectedOption && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <Text style={styles.dropdownArrow}>
          {modalVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setSearchQuery('');
          }}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Pilih Opsi'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari opsi..."
                placeholderTextColor={colors.neutral[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchButton}
                >
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <SectionList
              sections={filteredSections}
              keyExtractor={(item) => item.value}
              renderSectionHeader={renderSectionHeader}
              renderItem={renderOptionItem}
              contentContainerStyle={styles.optionsList}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Tidak ada opsi ditemukan</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownButtonFocused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
    color: colors.neutral[500],
  },
  selectedText: {
    fontSize: 16,
    color: colors.neutral[800],
    flex: 1,
  },
  placeholderText: {
    color: colors.neutral[500],
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.neutral[500],
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.neutral[600],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchIcon: {
    fontSize: 16,
    color: colors.neutral[500],
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[800],
    paddingVertical: 0,
  },
  clearSearchButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  optionsList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: colors.neutral[50],
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  selectedOptionItem: {
    backgroundColor: colors.primary[50],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  optionIcon: {
    fontSize: 20,
    color: colors.neutral[600],
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.neutral[800],
    marginBottom: 4,
  },
  selectedOptionLabel: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 12,
    color: colors.neutral[500],
    lineHeight: 16,
  },
  checkIcon: {
    position: 'absolute',
    right: 20,
    top: 16,
    fontSize: 18,
    color: colors.primary[500],
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[500],
  },
});

export default DropdownWithSections;