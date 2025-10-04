/**
 * Google Apps Script for Varahi Farms - Google Sheets Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click the disk icon to save
 * 5. Click "Deploy" > "New deployment"
 * 6. Choose type: "Web app"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click "Deploy" and copy the Web app URL
 * 10. Use that URL in your React Native app's googleSheets.ts file
 */

// Get the active spreadsheet
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Get or create the "Batches" sheet
function getBatchesSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Batches');
  
  if (!sheet) {
    sheet = ss.insertSheet('Batches');
    // Add headers
    sheet.appendRow([
      'Session ID',
      'Batch ID',
      'Source',
      'Number of Chicks',
      'Age (Days)',
      'Hatched Date',
      'Cabin ID',
      'Notes',
      'Created At'
    ]);
    // Format header row
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  return sheet;
}

// Get or create the "Cabins" sheet
function getCabinsSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cabins');
  
  if (!sheet) {
    sheet = ss.insertSheet('Cabins');
    // Add headers
    sheet.appendRow([
      'Cabin ID',
      'Cabin Name',
      'Capacity',
      'Created At'
    ]);
    // Format header row
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#34a853').setFontColor('#ffffff');
  }
  
  return sheet;
}

// Handle POST requests
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var type = data.type;
    var result;
    
    switch(type) {
      case 'batch':
        result = addBatch(data.data);
        break;
      case 'cabin':
        result = addCabin(data.data);
        break;
      case 'deleteBatch':
        result = deleteBatch(data.data.batchId);
        break;
      case 'deleteCabin':
        result = deleteCabin(data.data.id);
        break;
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Unknown operation type'
        })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Add a new batch
function addBatch(batch) {
  var sheet = getBatchesSheet();
  
  // Check if batch ID already exists
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === batch.batchId) {
      // Update existing batch
      sheet.getRange(i + 1, 1, 1, 9).setValues([[
        batch.sessionId,
        batch.batchId,
        batch.source,
        batch.numberOfChicks,
        batch.age,
        batch.hatchedDate,
        batch.cabinId,
        batch.notes,
        batch.createdAt
      ]]);
      return { message: 'Batch updated', batchId: batch.batchId };
    }
  }
  
  // Add new batch
  sheet.appendRow([
    batch.sessionId,
    batch.batchId,
    batch.source,
    batch.numberOfChicks,
    batch.age,
    batch.hatchedDate,
    batch.cabinId,
    batch.notes,
    batch.createdAt
  ]);
  
  return { message: 'Batch added', batchId: batch.batchId };
}

// Add a new cabin
function addCabin(cabin) {
  var sheet = getCabinsSheet();
  
  // Check if cabin ID already exists
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === cabin.id) {
      // Update existing cabin
      sheet.getRange(i + 1, 1, 1, 4).setValues([[
        cabin.id,
        cabin.name,
        cabin.capacity,
        cabin.createdAt
      ]]);
      return { message: 'Cabin updated', cabinId: cabin.id };
    }
  }
  
  // Add new cabin
  sheet.appendRow([
    cabin.id,
    cabin.name,
    cabin.capacity,
    cabin.createdAt
  ]);
  
  return { message: 'Cabin added', cabinId: cabin.id };
}

// Delete a batch
function deleteBatch(batchId) {
  var sheet = getBatchesSheet();
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === batchId) {
      sheet.deleteRow(i + 1);
      return { message: 'Batch deleted', batchId: batchId };
    }
  }
  
  return { message: 'Batch not found', batchId: batchId };
}

// Delete a cabin
function deleteCabin(cabinId) {
  var sheet = getCabinsSheet();
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === cabinId) {
      sheet.deleteRow(i + 1);
      return { message: 'Cabin deleted', cabinId: cabinId };
    }
  }
  
  return { message: 'Cabin not found', cabinId: cabinId };
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'Varahi Farms Google Sheets API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
