# Build Your Varahi Farms APK - Step by Step

## 🎯 You've Created Your Expo Account - Great! Now Let's Build the APK

---

## 📝 **Step 1: Login to Expo**

Open PowerShell in your project folder and run:

```powershell
cd "d:\Desktop\projects\Pms lovable\chick-chatter-main\vardhi-farms-app"
npx eas-cli login
```

**Enter your Expo credentials when prompted:**
- Email or username: (the one you used to create account)
- Password: (your expo.dev password)

---

## 📝 **Step 2: Configure EAS Build**

After successful login, run:

```powershell
npx eas-cli build:configure
```

**When prompted:**
- "Would you like to automatically create an EAS project?" → Press **Y** (Yes)
- It will create an `eas.json` file

---

## 📝 **Step 3: Build the APK**

Now build your Android APK:

```powershell
npx eas-cli build -p android --profile preview
```

**What happens:**
1. EAS will ask for confirmation → Press **Y**
2. It uploads your code to Expo servers
3. Builds the APK in the cloud (takes 15-20 minutes)
4. You'll get a download link when complete

**Expected Output:**
```
✔ Build finished
📱 Install the build on an Android device:
https://expo.dev/accounts/[YOUR_USERNAME]/projects/varahi-farms-app/builds/[BUILD_ID]
```

---

## 📝 **Step 4: Download & Install**

1. **Copy the download link** from the terminal
2. **Open it in your browser** or phone
3. **Download the APK** file
4. **Transfer to your phone** (if you downloaded on PC)
5. **Install the APK**:
   - Tap the downloaded file
   - Allow "Install from unknown sources" if prompted
   - Tap "Install"
6. **Done!** Your app is now installed 🎉

---

## 🎯 **Alternative: Build with Expo Online Dashboard**

If the command line doesn't work, you can also build using Expo's website:

1. Go to https://expo.dev
2. Login with your account
3. Click "Create a build"
4. Select your project (varahi-farms-app)
5. Choose "Android" platform
6. Click "Build"
7. Download the APK when ready

---

## ⚡ **Quick Commands Summary**

```powershell
# Navigate to project
cd "d:\Desktop\projects\Pms lovable\chick-chatter-main\vardhi-farms-app"

# Login (one time)
npx eas-cli login

# Configure (one time)
npx eas-cli build:configure

# Build APK
npx eas-cli build -p android --profile preview
```

---

## 🔍 **Troubleshooting**

### "Project not found" error?
Run this first:
```powershell
npx eas-cli init
```

### "Authentication failed"?
- Make sure you're using the correct Expo credentials
- Try logging out first: `npx eas-cli logout`
- Then login again: `npx eas-cli login`

### Build failed?
- Check your internet connection
- Make sure app.json has all required fields
- Check the build logs on expo.dev

---

## 📊 **What You'll Get**

After the build completes, you'll have:

✅ **varahi-farms-app.apk** (installable Android app)
✅ Works without Expo Go
✅ Works completely offline
✅ Syncs to Google Sheets when online
✅ Professional standalone app
✅ Share with unlimited users

---

## 🎨 **Want to Customize?**

Before building, you can customize in `app.json`:
- App name
- App icon
- Splash screen
- Version number
- Package name

---

## ❓ **Need Help?**

If you encounter any errors:
1. Copy the error message
2. Share it with me
3. I'll help you fix it!

**Ready to build? Run the commands above!** 🚀
