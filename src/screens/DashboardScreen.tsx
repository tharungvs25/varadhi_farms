import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePoultry } from '../contexts/PoultryContext';

const DashboardScreen = ({ navigation }: any) => {
  const { batches, cabins } = usePoultry();

  const totalChicks = batches.reduce((sum, batch) => sum + batch.numberOfChicks, 0);
  const totalCapacity = cabins.reduce((sum, cabin) => sum + cabin.totalCapacity, 0);
  const usedCapacity = batches.reduce((sum, batch) => 
    batch.cabinId ? sum + batch.numberOfChicks : sum, 0
  );
  const availableSpace = totalCapacity - usedCapacity;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Poultry Dashboard</Text>
        <Text style={styles.subtitle}>Monitor your farm operations</Text>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Batches')}
        >
          <Text style={styles.navButtonText}>Manage Batches</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Cabins')}
        >
          <Text style={styles.navButtonText}>Manage Cabins</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Chicks</Text>
          <Text style={styles.statValue}>{totalChicks}</Text>
          <Text style={styles.statSubtext}>Across {batches.length} batches</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Cabins</Text>
          <Text style={styles.statValue}>{cabins.length}</Text>
          <Text style={styles.statSubtext}>Total capacity: {totalCapacity}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Available Space</Text>
          <Text style={styles.statValue}>{availableSpace}</Text>
          <Text style={styles.statSubtext}>
            {Math.round((availableSpace / totalCapacity) * 100)}% available
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cabin Occupancy</Text>
        {cabins.map(cabin => {
          // Calculate occupancy based on batches assigned to this cabin
          const occupancy = batches
            .filter(batch => batch.cabinId === cabin.id)
            .reduce((sum, batch) => sum + batch.numberOfChicks, 0);
          const percentage = cabin.totalCapacity > 0 
            ? Math.round((occupancy / cabin.totalCapacity) * 100) 
            : 0;

          return (
            <View key={cabin.id} style={styles.occupancyCard}>
              <View style={styles.occupancyHeader}>
                <Text style={styles.cabinName}>{cabin.name}</Text>
                <Text style={styles.occupancyText}>
                  {occupancy}/{cabin.totalCapacity} ({percentage}%)
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Batches</Text>
        {batches.slice(-5).reverse().map(batch => (
          <View key={batch.id} style={styles.batchCard}>
            <View>
              <Text style={styles.batchId}>{batch.id}</Text>
              <Text style={styles.batchSource}>{batch.source}</Text>
            </View>
            <View style={styles.batchRight}>
              <Text style={styles.batchChicks}>{batch.numberOfChicks}</Text>
              <Text style={styles.batchLabel}>chicks</Text>
            </View>
          </View>
        ))}
        {batches.length === 0 && (
          <Text style={styles.emptyText}>No batches yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  occupancyCard: {
    marginBottom: 20,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cabinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  occupancyText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  batchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  batchId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  batchSource: {
    fontSize: 12,
    color: '#666',
  },
  batchRight: {
    alignItems: 'flex-end',
  },
  batchChicks: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  batchLabel: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
