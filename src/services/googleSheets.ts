import axios from 'axios';

// Configuration - Connected to your Google Sheet
const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets URL
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1vVTHCKVaq86cBRGJRNPGObv_zybFEEK7gRH7XPb1vkE/edit',
  // Google Apps Script Web App URL
  scriptUrl: 'https://script.google.com/macros/s/AKfycbxk_dXr0RdqBa5T67VS8T2mB53jV6otN5KJzsZywh_qjfNxHeIdf0YNwGhGq27Eqj0oQA/exec'
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
    console.log('🔄 Sending request to Google Sheets API...');
    console.log('📍 URL:', GOOGLE_SHEETS_CONFIG.scriptUrl);
    console.log('📦 Data:', JSON.stringify({ type: 'batch', data: batch }, null, 2));
    
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
      timeout: 30000, // 30 second timeout
    });
    
    console.log('📥 Response received:', JSON.stringify(response.data, null, 2));
    console.log('📥 Response status:', response.status);
    
    return response.data.success === true;
  } catch (error: any) {
    console.error('❌ Error saving batch to Google Sheets:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error);
    }
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
