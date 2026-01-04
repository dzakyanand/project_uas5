import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors } from '../../constants/colors';

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

interface DropdownMultiSelectProps {
  label?: string;
  options: DropdownOption[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  maxSelections?: number;
  style?: any;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  label,
  options,
  selectedValues = [],
  onValueChange,
  placeholder = 'Pilih opsi',
  error,
  maxSelections,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOptions = options.filter(opt => 
    selectedValues.includes(opt.value)
  );

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    let newValues;
    if (selectedValues.includes(value)) {
      // Hapus jika sudah dipilih
      newValues = selectedValues.filter(v => v !== value);
    } else {
      // Tambah jika belum dipilih
      if (maxSelections && selectedValues.length >= maxSelections) {
        // Tidak bisa pilih lagi jika sudah mencapai maksimum
        return;
      }
      newValues = [...selectedValues, value];
    }
    onValueChange(newValues);
  };

  const removeSelected = (value: string) => {
    const newValues = selectedValues.filter(v => v !== value);
    onValueChange(newValues);
  };

  const clearAll = () => {
    onValueChange([]);
  };

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
          {selectedOptions.length === 0 ? (
            <Text style={styles.placeholderText}>
              {placeholder}
            </Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.selectedScrollView}
            >
              {selectedOptions.map((option) => (
                <View key={option.value} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>
                    {option.icon && `${option.icon} `}
                    {option.label}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      removeSelected(option.value);
                    }}
                    style={styles.removeTagButton}
                  >
                    <Text style={styles.removeTagText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        <Text style={styles.dropdownArrow}>
          {modalVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {selectedOptions.length > 0 && (
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            Terpilih: {selectedOptions.length}
            {maxSelections && ` / ${maxSelections}`}
          </Text>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearAllText}>Hapus semua</Text>
          </TouchableOpacity>
        </View>
      )}

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
              <View>
                <Text style={styles.modalTitle}>
                  {label || 'Pilih Opsi'}
                </Text>
                {maxSelections && (
                  <Text style={styles.modalSubtitle}>
                    Maksimum {maxSelections} pilihan
                  </Text>
                )}
              </View>
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
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = selectedValues.includes(item.value);
                const isDisabled = maxSelections && 
                  selectedValues.length >= maxSelections && 
                  !isSelected;

                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                      isDisabled && styles.disabledOptionItem,
                    ]}
                    onPress={() => handleSelect(item.value)}
                    disabled={isDisabled}
                  >
                    <View style={styles.optionContent}>
                      {item.icon && (
                        <Text style={styles.optionIcon}>{item.icon}</Text>
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                          isDisabled && styles.disabledOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                    {isDisabled && (
                      <Text style={styles.maxReachedText}>🔒</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.optionsList}
              showsVerticalScrollIndicator={false}
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
    paddingVertical: 12,
    minHeight: 50,
  },
  dropdownButtonFocused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: colors.error[500],
  },
  selectedContainer: {
    flex: 1,
  },
  selectedScrollView: {
    flexDirection: 'row',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.neutral[500],
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedTagText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
  removeTagButton: {
    marginLeft: 6,
    padding: 2,
  },
  removeTagText: {
    fontSize: 10,
    color: colors.primary[700],
    fontWeight: 'bold',
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.neutral[500],
    marginLeft: 8,
  },
  selectedCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  selectedCountText: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  clearAllText: {
    fontSize: 12,
    color: colors.error[500],
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: colors.error[500],
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
  modalSubtitle: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 2,
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
  optionsList: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  selectedOptionItem: {
    backgroundColor: colors.primary[50],
  },
  disabledOptionItem: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
    color: colors.neutral[600],
  },
  optionText: {
    fontSize: 16,
    color: colors.neutral[800],
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  disabledOptionText: {
    color: colors.neutral[500],
  },
  checkIcon: {
    fontSize: 18,
    color: colors.primary[500],
    fontWeight: 'bold',
  },
  maxReachedText: {
    fontSize: 14,
    color: colors.neutral[500],
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

export default DropdownMultiSelect;