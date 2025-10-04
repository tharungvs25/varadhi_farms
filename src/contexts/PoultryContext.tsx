import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt'>, customId?: string) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  addCabin: (cabin: Omit<Cabin, 'id' | 'assignedBatches'>) => void;
  updateCabin: (id: string, cabin: Partial<Cabin>) => void;
  deleteCabin: (id: string) => void;
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

  const addBatch = (batch: Omit<Batch, 'id' | 'createdAt'>, customId?: string) => {
    const newBatch: Batch = {
      ...batch,
      id: customId || `BATCH-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBatches(prev => [...prev, newBatch]);
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBatch = (id: string) => {
    const batch = batches.find(b => b.id === id);
    if (batch?.cabinId) {
      setCabins(prev => prev.map(c => 
        c.id === batch.cabinId 
          ? { ...c, assignedBatches: c.assignedBatches.filter(bid => bid !== id) }
          : c
      ));
    }
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  const addCabin = (cabin: Omit<Cabin, 'id' | 'assignedBatches'>) => {
    const newCabin: Cabin = {
      ...cabin,
      id: `cabin-${Date.now()}`,
      assignedBatches: [],
    };
    setCabins(prev => [...prev, newCabin]);
  };

  const updateCabin = (id: string, updates: Partial<Cabin>) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCabin = (id: string) => {
    setBatches(prev => prev.map(b => 
      b.cabinId === id ? { ...b, cabinId: null } : b
    ));
    setCabins(prev => prev.filter(c => c.id !== id));
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
