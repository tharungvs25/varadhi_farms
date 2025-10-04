import axios from 'axios';

// Configuration - You'll need to update these values
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Sheets URL after sharing with edit access
  spreadsheetUrl: 'YOUR_GOOGLE_SHEETS_URL_HERE',
  // We'll use Google Apps Script as a bridge to write data
  scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
};

export interface BatchData {
  sessionId: string;
  batchId: string;
  source: string;
  numberOfChicks: number;
  age: number;
  hatchedDate: string;
  cabinId: string;
  notes: string;
  createdAt: string;
}

export interface CabinData {
  id: string;
  name: string;
  capacity: number;
  createdAt: string;
}

/**
 * Save batch data to Google Sheets
 */
export const saveBatchToSheets = async (batch: BatchData): Promise<boolean> => {
  try {
    const response = await axios.post(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      type: 'batch',
      data: {
        sessionId: batch.sessionId,
        batchId: batch.batchId,
        source: batch.source,
        numberOfChicks: batch.numberOfChicks,
        age: batch.age,
        hatchedDate: batch.hatchedDate,
        cabinId: batch.cabinId,
        notes: batch.notes,
        createdAt: batch.createdAt,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.success === true;
  } catch (error) {
    console.error('Error saving batch to Google Sheets:', error);
    return false;
  }
};

/**
 * Save cabin data to Google Sheets
 */
export const saveCabinToSheets = async (cabin: CabinData): Promise<boolean> => {
  try {
    const response = await axios.post(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      type: 'cabin',
      data: {
        id: cabin.id,
        name: cabin.name,
        capacity: cabin.capacity,
        createdAt: cabin.createdAt,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.success === true;
  } catch (error) {
    console.error('Error saving cabin to Google Sheets:', error);
    return false;
  }
};

/**
 * Delete batch from Google Sheets
 */
export const deleteBatchFromSheets = async (batchId: string): Promise<boolean> => {
  try {
    const response = await axios.post(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      type: 'deleteBatch',
      data: {
        batchId: batchId,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.success === true;
  } catch (error) {
    console.error('Error deleting batch from Google Sheets:', error);
    return false;
  }
};

/**
 * Delete cabin from Google Sheets
 */
export const deleteCabinFromSheets = async (cabinId: string): Promise<boolean> => {
  try {
    const response = await axios.post(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      type: 'deleteCabin',
      data: {
        id: cabinId,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.success === true;
  } catch (error) {
    console.error('Error deleting cabin from Google Sheets:', error);
    return false;
  }
};
