import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { usePoultry } from '../contexts/PoultryContext';

const BatchesScreen = () => {
  const { batches, cabins, addBatch, deleteBatch, assignBatchToCabin } = usePoultry();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    sessionId: '',
    batchId: '',
    source: '',
    numberOfChicks: '',
    age: '',
    hatchedDate: '',
    notes: '',
    cabinId: '',
  });

  const handleSubmit = () => {
    if (!formData.sessionId || !formData.batchId || !formData.source || !formData.numberOfChicks || !formData.age || !formData.hatchedDate || !formData.cabinId) {
      Alert.alert('Missing fields', 'Please fill in all required fields including cabin selection');
      return;
    }

    // Add batch with user-provided ID
    addBatch({
      source: formData.source,
      numberOfChicks: parseInt(formData.numberOfChicks),
      lifeSpan: parseInt(formData.age),
      dateOfBirth: formData.hatchedDate,
      notes: formData.notes,
      cabinId: formData.cabinId,
    }, formData.batchId); // Pass custom batch ID

    Alert.alert('Success', `Batch ${formData.batchId} added successfully and assigned to cabin`);
    
    setFormData({
      sessionId: '',
      batchId: '',
      source: '',
      numberOfChicks: '',
      age: '',
      hatchedDate: '',
      notes: '',
      cabinId: '',
    });
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Batch',
      'Are you sure you want to delete this batch?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteBatch(id);
            Alert.alert('Success', 'Batch deleted');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chick Batches</Text>
          <Text style={styles.subtitle}>Manage your chick batches</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {batches.map(batch => {
          const cabin = cabins.find(c => c.id === batch.cabinId);
          return (
            <View key={batch.id} style={styles.batchCard}>
              <View style={styles.batchHeader}>
                <Text style={styles.batchId}>{batch.id}</Text>
                <TouchableOpacity onPress={() => handleDelete(batch.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.batchInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Source:</Text>
                  <Text style={styles.value}>{batch.source}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Number of Chicks:</Text>
                  <Text style={styles.value}>{batch.numberOfChicks}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{batch.lifeSpan}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Hatched Date:</Text>
                  <Text style={styles.value}>{batch.dateOfBirth}</Text>
                </View>
                {cabin && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Cabin:</Text>
                    <Text style={styles.value}>{cabin.name}</Text>
                  </View>
                )}
                {batch.notes && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Notes:</Text>
                    <Text style={styles.value}>{batch.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {batches.length === 0 && (
          <Text style={styles.emptyText}>No batches yet. Add your first batch!</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Batch</Text>
            
            <ScrollView>
              <Text style={styles.inputLabel}>Session ID *</Text>
              <TextInput
                style={styles.input}
                value={formData.sessionId}
                onChangeText={(text) => setFormData({ ...formData, sessionId: text })}
                placeholder="e.g., SESSION-2025-001"
              />

              <Text style={styles.inputLabel}>Batch ID *</Text>
              <TextInput
                style={styles.input}
                value={formData.batchId}
                onChangeText={(text) => setFormData({ ...formData, batchId: text })}
                placeholder="e.g., BATCH-001"
              />

              <Text style={styles.inputLabel}>Source *</Text>
              <TextInput
                style={styles.input}
                value={formData.source}
                onChangeText={(text) => setFormData({ ...formData, source: text })}
                placeholder="e.g., ABC Hatchery"
              />

              <Text style={styles.inputLabel}>Number of Chicks *</Text>
              <TextInput
                style={styles.input}
                value={formData.numberOfChicks}
                onChangeText={(text) => setFormData({ ...formData, numberOfChicks: text })}
                placeholder="e.g., 100"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="e.g., 8"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Hatched Date *</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={formData.hatchedDate}
                  onChangeText={(text) => setFormData({ ...formData, hatchedDate: text })}
                  placeholder="DD/MM/YYYY (e.g., 24/12/2026)"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.todayButton}
                  onPress={() => {
                    const today = new Date();
                    const day = String(today.getDate()).padStart(2, '0');
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const year = today.getFullYear();
                    const dateStr = `${day}/${month}/${year}`;
                    setFormData({ ...formData, hatchedDate: dateStr });
                  }}
                >
                  <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.dateHint}>
                📅 Enter date in DD/MM/YYYY format or click "Today"
              </Text>

              <Text style={styles.inputLabel}>Select Cabin *</Text>
              <View style={styles.cabinSelector}>
                {cabins.map(cabin => {
                  const isSelected = formData.cabinId === cabin.id;
                  // Calculate current occupancy for this cabin
                  const currentOccupancy = batches
                    .filter(batch => batch.cabinId === cabin.id)
                    .reduce((sum, batch) => sum + batch.numberOfChicks, 0);
                  const available = cabin.totalCapacity - currentOccupancy;
                  
                  return (
                    <TouchableOpacity
                      key={cabin.id}
                      style={[
                        styles.cabinOption,
                        isSelected && styles.cabinOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, cabinId: cabin.id })}
                    >
                      <Text style={[
                        styles.cabinOptionText,
                        isSelected && styles.cabinOptionTextSelected
                      ]}>
                        {cabin.name}
                      </Text>
                      <Text style={styles.cabinCapacity}>
                        Capacity: {cabin.totalCapacity}
                      </Text>
                      <Text style={[styles.cabinCapacity, { color: available > 0 ? '#4CAF50' : '#f44336' }]}>
                        Available: {available}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes"
                multiline
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Add Batch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  batchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  batchId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
  batchInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  datePickerField: {
    flex: 1,
    justifyContent: 'center',
  },
  todayButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cabinSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cabinOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cabinOptionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  cabinOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cabinOptionTextSelected: {
    color: '#4CAF50',
  },
  cabinCapacity: {
    fontSize: 12,
    color: '#666',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginTop: 8,
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  datePickerCloseButton: {
    backgroundColor: '#666',
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BatchesScreen;
