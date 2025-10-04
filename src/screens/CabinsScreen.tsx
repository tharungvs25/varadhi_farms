import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { usePoultry } from '../contexts/PoultryContext';

const CabinsScreen = () => {
  const { cabins, batches, addCabin, deleteCabin } = usePoultry();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalCapacity: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.totalCapacity) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    addCabin({
      name: formData.name,
      totalCapacity: parseInt(formData.totalCapacity),
    });

    Alert.alert('Success', 'Cabin added successfully');
    
    setFormData({ name: '', totalCapacity: '' });
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Cabin',
      'Are you sure you want to delete this cabin? All batches will be unassigned.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteCabin(id);
            Alert.alert('Success', 'Cabin deleted');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cabins</Text>
          <Text style={styles.subtitle}>Manage your poultry cabins</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {cabins.map(cabin => {
          const occupancy = cabin.assignedBatches.reduce((sum, batchId) => {
            const batch = batches.find(b => b.id === batchId);
            return sum + (batch?.numberOfChicks || 0);
          }, 0);
          const available = cabin.totalCapacity - occupancy;
          const percentage = Math.round((occupancy / cabin.totalCapacity) * 100);

          return (
            <View key={cabin.id} style={styles.cabinCard}>
              <View style={styles.cabinHeader}>
                <Text style={styles.cabinName}>{cabin.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(cabin.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.occupancySection}>
                <View style={styles.occupancyHeader}>
                  <Text style={styles.occupancyLabel}>Occupancy</Text>
                  <Text style={styles.occupancyValue}>{percentage}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Capacity</Text>
                  <Text style={styles.statValue}>{cabin.totalCapacity}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Available</Text>
                  <Text style={[styles.statValue, styles.availableValue]}>{available}</Text>
                </View>
              </View>

              <View style={styles.batchesSection}>
                <Text style={styles.batchesTitle}>
                  Assigned Batches ({cabin.assignedBatches.length})
                </Text>
                {cabin.assignedBatches.length > 0 ? (
                  cabin.assignedBatches.map(batchId => {
                    const batch = batches.find(b => b.id === batchId);
                    if (!batch) return null;
                    return (
                      <View key={batchId} style={styles.assignedBatch}>
                        <Text style={styles.assignedBatchId}>{batch.id}</Text>
                        <Text style={styles.assignedBatchChicks}>
                          {batch.numberOfChicks} chicks
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noBatches}>No batches assigned</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Cabin</Text>

            <Text style={styles.inputLabel}>Cabin Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Cabin D"
            />

            <Text style={styles.inputLabel}>Total Capacity *</Text>
            <TextInput
              style={styles.input}
              value={formData.totalCapacity}
              onChangeText={(text) => setFormData({ ...formData, totalCapacity: text })}
              placeholder="e.g., 500"
              keyboardType="numeric"
            />

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
                <Text style={styles.submitButtonText}>Add Cabin</Text>
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
  cabinCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cabinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cabinName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
  occupancySection: {
    marginBottom: 16,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  occupancyLabel: {
    fontSize: 14,
    color: '#666',
  },
  occupancyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  availableValue: {
    color: '#4CAF50',
  },
  batchesSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  batchesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  assignedBatch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  assignedBatchId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  assignedBatchChicks: {
    fontSize: 12,
    color: '#666',
  },
  noBatches: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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
});

export default CabinsScreen;
