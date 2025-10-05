import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveBatchToSheets, saveCabinToSheets, deleteBatchFromSheets, deleteCabinFromSheets } from '../services/googleSheets';

export interface Batch {
  id: string;
  source: string;
  numberOfChicks: number;
  lifeSpan: number;
  dateOfBirth: string;
  notes: string;
  cabinId: string | null;
  createdAt: string;
}

export interface Cabin {
  id: string;
  name: string;
  totalCapacity: number;
  assignedBatches: string[];
}

interface PoultryContextType {
  batches: Batch[];
  cabins: Cabin[];
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt'>, customId?: string) => Promise<void>;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => Promise<void>;
  addCabin: (cabin: Omit<Cabin, 'id' | 'assignedBatches'>) => Promise<void>;
  updateCabin: (id: string, cabin: Partial<Cabin>) => void;
  deleteCabin: (id: string) => Promise<void>;
  assignBatchToCabin: (batchId: string, cabinId: string | null) => void;
}

const PoultryContext = createContext<PoultryContextType | undefined>(undefined);

export const PoultryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cabins, setCabins] = useState<Cabin[]>([
    { id: 'cabin-1', name: 'Cabin A', totalCapacity: 500, assignedBatches: [] },
    { id: 'cabin-2', name: 'Cabin B', totalCapacity: 500, assignedBatches: [] },
    { id: 'cabin-3', name: 'Cabin C', totalCapacity: 300, assignedBatches: [] },
  ]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedBatches = await AsyncStorage.getItem('poultry_batches');
        const savedCabins = await AsyncStorage.getItem('poultry_cabins');
        
        if (savedBatches) {
          setBatches(JSON.parse(savedBatches));
        }
        if (savedCabins) {
          setCabins(JSON.parse(savedCabins));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save batches to AsyncStorage
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('poultry_batches', JSON.stringify(batches));
      } catch (error) {
        console.error('Error saving batches:', error);
      }
    };
    saveData();
  }, [batches]);

  // Save cabins to AsyncStorage
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('poultry_cabins', JSON.stringify(cabins));
      } catch (error) {
        console.error('Error saving cabins:', error);
      }
    };
    saveData();
  }, [cabins]);

  const addBatch = async (batch: Omit<Batch, 'id' | 'createdAt'>, customId?: string) => {
    const newBatch: Batch = {
      ...batch,
      id: customId || `BATCH-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBatches(prev => [...prev, newBatch]);
    
    // Save to Google Sheets
    try {
      console.log('📤 Syncing batch to Google Sheets...', {
        sessionId: customId || newBatch.id,
        batchId: newBatch.id,
      });
      
      const success = await saveBatchToSheets({
        sessionId: customId || newBatch.id,
        batchId: newBatch.id,
        source: newBatch.source,
        numberOfChicks: newBatch.numberOfChicks,
        age: newBatch.lifeSpan,
        hatchedDate: newBatch.dateOfBirth,
        cabinId: newBatch.cabinId || '',
        notes: newBatch.notes,
        createdAt: newBatch.createdAt,
      });
      
      if (success) {
        console.log('✅ Successfully synced to Google Sheets!');
      } else {
        console.warn('⚠️ Google Sheets sync returned false');
      }
    } catch (error) {
      console.error('❌ Could not sync to Google Sheets:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBatch = async (id: string) => {
    const batch = batches.find(b => b.id === id);
    if (batch?.cabinId) {
      setCabins(prev => prev.map(c => 
        c.id === batch.cabinId 
          ? { ...c, assignedBatches: c.assignedBatches.filter(bid => bid !== id) }
          : c
      ));
    }
    setBatches(prev => prev.filter(b => b.id !== id));
    
    // Delete from Google Sheets
    try {
      await deleteBatchFromSheets(id);
    } catch (error) {
      console.log('Could not sync deletion to Google Sheets (offline mode):', error);
    }
  };

  const addCabin = async (cabin: Omit<Cabin, 'id' | 'assignedBatches'>) => {
    const newCabin: Cabin = {
      ...cabin,
      id: `cabin-${Date.now()}`,
      assignedBatches: [],
    };
    setCabins(prev => [...prev, newCabin]);
    
    // Save to Google Sheets
    try {
      await saveCabinToSheets({
        id: newCabin.id,
        name: newCabin.name,
        capacity: newCabin.totalCapacity,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.log('Could not sync to Google Sheets (offline mode):', error);
    }
  };

  const updateCabin = (id: string, updates: Partial<Cabin>) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCabin = async (id: string) => {
    setBatches(prev => prev.map(b => 
      b.cabinId === id ? { ...b, cabinId: null } : b
    ));
    setCabins(prev => prev.filter(c => c.id !== id));
    
    // Delete from Google Sheets
    try {
      await deleteCabinFromSheets(id);
    } catch (error) {
      console.log('Could not sync deletion to Google Sheets (offline mode):', error);
    }
  };

  const assignBatchToCabin = (batchId: string, cabinId: string | null) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    if (batch.cabinId) {
      setCabins(prev => prev.map(c => 
        c.id === batch.cabinId
          ? { ...c, assignedBatches: c.assignedBatches.filter(bid => bid !== batchId) }
          : c
      ));
    }

    if (cabinId) {
      setCabins(prev => prev.map(c => 
        c.id === cabinId
          ? { ...c, assignedBatches: [...c.assignedBatches, batchId] }
          : c
      ));
    }

    updateBatch(batchId, { cabinId });
  };

  return (
    <PoultryContext.Provider value={{
      batches,
      cabins,
      addBatch,
      updateBatch,
      deleteBatch,
      addCabin,
      updateCabin,
      deleteCabin,
      assignBatchToCabin,
    }}>
      {children}
    </PoultryContext.Provider>
  );
};

export const usePoultry = () => {
  const context = useContext(PoultryContext);
  if (!context) {
    throw new Error('usePoultry must be used within PoultryProvider');
  }
  return context;
};
