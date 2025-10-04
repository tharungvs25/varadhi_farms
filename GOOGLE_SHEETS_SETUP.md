# Google Sheets Integration Setup Guide

This guide will help you integrate your Varahi Farms app with Google Sheets to automatically save all your data.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name it "Varahi Farms Data" or any name you prefer
4. The script will automatically create two sheets:
   - **Batches**: Will store all batch data
   - **Cabins**: Will store all cabin data

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Open the file `GoogleAppsScript.gs` in your project folder
4. **Copy ALL the code** from that file
5. **Paste it** into the Apps Script editor
6. Click the **💾 Save** icon (or press Ctrl+S)
7. Name the project "Varahi Farms API" (or any name you prefer)

## Step 3: Deploy the Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the ⚙️ gear icon next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Varahi Farms Data API"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. You may need to authorize the app:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to Varahi Farms API (unsafe)**
   - Click **Allow**
7. **Copy the Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Configure Your React Native App

1. Open the file: `src/services/googleSheets.ts`
2. Find the `GOOGLE_SHEETS_CONFIG` object at the top:
   ```typescript
   const GOOGLE_SHEETS_CONFIG = {
     spreadsheetUrl: 'YOUR_GOOGLE_SHEETS_URL_HERE',
     scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
   };
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web app URL you copied
4. Replace `YOUR_GOOGLE_SHEETS_URL_HERE` with your Google Sheet URL (from the browser address bar)
5. Save the file

## Step 5: Share Your Google Sheet (Optional)

If you want others to view the data:
1. Click the **Share** button in the top-right of your Google Sheet
2. Add email addresses or get a shareable link
3. Set permissions:
   - **Viewer**: Can only view data
   - **Editor**: Can edit data directly in the sheet

## Step 6: Test the Integration

1. Open your Expo app
2. Add a new batch or cabin
3. Check your Google Sheet - the data should appear automatically!
4. Try deleting a batch - it should be removed from the sheet too

## Data Structure

### Batches Sheet
| Session ID | Batch ID | Source | Number of Chicks | Age (Days) | Hatched Date | Cabin ID | Notes | Created At |
|------------|----------|--------|------------------|------------|--------------|----------|-------|------------|
| Data will appear here automatically... |

### Cabins Sheet
| Cabin ID | Cabin Name | Capacity | Created At |
|----------|------------|----------|------------|
| Data will appear here automatically... |

## Features

✅ **Automatic Sync**: Every time you add/delete data in the app, it syncs to Google Sheets
✅ **Offline Support**: App works offline, will try to sync when online
✅ **Real-time Updates**: Data appears in Google Sheets within seconds
✅ **No Login Required**: Uses Google Apps Script as a secure bridge
✅ **Free Forever**: No API costs, uses Google's free tier

## Troubleshooting

### Data Not Appearing in Google Sheets?

1. **Check the Script URL**: Make sure you copied the correct Web app URL to `googleSheets.ts`
2. **Check Deployment**: In Apps Script, go to Deploy → Manage deployments → Make sure it's deployed
3. **Check Permissions**: Make sure "Who has access" is set to "Anyone"
4. **Check Console**: Look for errors in the Expo app console

### "Authorization Required" Error?

1. Go back to Apps Script
2. Click Deploy → Manage deployments
3. Click the pencil icon to edit
4. Make sure "Execute as" is set to "Me"
5. Click "Deploy"

### Want to Re-deploy?

If you make changes to the Apps Script:
1. Click Deploy → Manage deployments
2. Click the pencil icon
3. Click "Deploy"
4. Use the **same URL** - no need to update your app!

## Advanced: View Logs

To see what's happening in the background:
1. In Apps Script, click **Executions** (clock icon on the left)
2. You'll see all API calls and any errors

## Security Notes

- The Apps Script runs under YOUR Google account
- Only YOU can see the script code
- The Web app URL is public but doesn't expose your data
- All data is stored in YOUR Google Sheet
- You can revoke access anytime by undeploying the script

## Need Help?

If you encounter any issues:
1. Check the Apps Script executions log for errors
2. Check the Expo console for error messages
3. Make sure your internet connection is working
4. Try re-deploying the Apps Script

---

**Congratulations!** 🎉 Your Varahi Farms app is now connected to Google Sheets!

All your batch and cabin data will be automatically saved and you can access it from anywhere via Google Sheets.
