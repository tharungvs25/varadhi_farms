# Quick Setup - Google Sheets Integration

## 🚀 5-Minute Setup

### 1️⃣ Create & Setup Google Sheet
- Go to https://sheets.google.com
- Create new blank sheet
- Name it "Varahi Farms Data"

### 2️⃣ Add the Script
- Click **Extensions** → **Apps Script**
- Delete existing code
- Copy & paste code from `GoogleAppsScript.gs` file
- Click **Save** 💾

### 3️⃣ Deploy as Web App
- Click **Deploy** → **New deployment**
- Choose type: **Web app**
- Set "Execute as": **Me**
- Set "Who has access": **Anyone**
- Click **Deploy**
- **Copy the URL** (looks like: https://script.google.com/macros/s/AKfycby.../exec)

### 4️⃣ Configure App
- Open: `src/services/googleSheets.ts`
- Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your copied URL
- Save the file

### 5️⃣ Done! 🎉
- Restart your Expo app
- Add a batch or cabin
- Check your Google Sheet - data appears automatically!

---

## 📋 Your URLs

**Google Sheet URL:** (paste here after creating)
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

**Apps Script Web App URL:** (paste here after deploying)
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## 🔍 Quick Troubleshooting

**No data appearing?**
- Check if you pasted the correct Web App URL
- Make sure "Who has access" is set to "Anyone"
- Check Expo console for errors

**Authorization error?**
- In Apps Script, re-deploy with "Execute as: Me"
- Grant permissions when asked

---

## 📊 What Gets Saved?

### Batches Sheet
- Session ID, Batch ID, Source
- Number of Chicks, Age, Hatched Date
- Cabin ID, Notes, Created At

### Cabins Sheet
- Cabin ID, Cabin Name
- Capacity, Created At

---

## 🔒 Security

✅ Data stored in YOUR Google account
✅ Only YOU control the script
✅ App syncs automatically & securely
✅ Works offline, syncs when online

---

For detailed instructions, see: `GOOGLE_SHEETS_SETUP.md`
