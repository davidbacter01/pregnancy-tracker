# 💕 Pregnancy Tracker PWA

A beautiful, client-side Progressive Web App for tracking your pregnancy journey. Built with React and Chakra UI with a warm, nurturing aesthetic.

## ✨ Features

### Daily Tracking
- **Vitals Monitoring**: Blood pressure (systolic/diastolic), blood sugar levels, weight
- **Lifestyle Logging**: Food intake, water consumption, mood tracking
- **Pregnancy-Specific**: Fetal movement tracking, symptoms, custom notes
- **Date-based entries**: Easy daily logging with date picker

### Dashboard & Analytics
- **Visual Trends**: Beautiful charts showing weight, blood pressure, and blood sugar over time
- **7-Day Averages**: Quick stats for recent health metrics
- **Comprehensive History**: View all past entries with full details

### PWA Features
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile/desktop
- **Fast & Responsive**: Optimized for all devices
- **Data Privacy**: All data stored locally using IndexedDB

## 🎨 Design

The app features a distinctive warm, organic aesthetic:
- **Custom Fonts**: Playfair Display (headings) + Crimson Text (body)
- **Color Palette**: Soft pinks and sage greens for a nurturing feel
- **Smooth Animations**: Polished interactions and transitions
- **Beautiful Charts**: Powered by Recharts for data visualization

## 🚀 Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `pregnancy-tracker` (or any name you prefer)
3. Make it public or private (your choice)
4. Don't initialize with README (we'll push existing files)

### Step 2: Prepare Your Files

All necessary files are included:
- `index.html` - Complete app (HTML + React code inline)
- `service-worker.js` - PWA offline functionality
- `manifest.json` - PWA configuration
- `icon-192.png` & `icon-512.png` - App icons

### Step 3: Update File Paths (if needed)

If you're deploying to a repository that's NOT at the root (e.g., `username.github.io/pregnancy-tracker`), you need to update the paths:

In `index.html`, change:
```html
<link rel="manifest" href="./manifest.json">
```
to:
```html
<link rel="manifest" href="/pregnancy-tracker/manifest.json">
```

And update `manifest.json`:
```json
"start_url": "/pregnancy-tracker/"
```

### Step 4: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Pregnancy Tracker PWA"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll to **Pages** in the left sidebar
4. Under "Source", select **main** branch
5. Select **/ (root)** folder
6. Click **Save**
7. Wait a few minutes for deployment

Your app will be available at:
`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Step 6: Test PWA Installation

1. Visit your deployed site on mobile or desktop
2. Look for "Install" prompt or "Add to Home Screen"
3. Install the app for offline use!

## 📱 Using the App

### Adding an Entry

1. Go to the "📝 New Entry" tab
2. Fill in your daily metrics:
   - Date
   - Blood pressure (systolic/diastolic)
   - Blood sugar level
   - Weight
   - Water intake
   - Mood
   - Food intake
   - Symptoms
   - Fetal movements
   - Additional notes
3. Click "💕 Save Entry"

### Viewing Dashboard

1. Go to "📊 Dashboard" tab
2. View 7-day averages for key metrics
3. Explore trend charts for:
   - Weight progression
   - Blood pressure over time
   - Blood sugar levels

### Browsing History

1. Go to "📖 History" tab
2. View all your entries in chronological order
3. Each entry shows full details
4. Delete entries if needed

## 💾 Data Storage

- **All data is stored locally** in your browser using IndexedDB
- **No cloud storage** - your data never leaves your device
- **Privacy-first** - completely private and secure
- **Persistent** - data survives page refreshes and app restarts
- **Backup recommendation**: Export important data periodically (future feature)

## 🔧 Technical Stack

- **React 18** - UI framework
- **Recharts** - Data visualization
- **IndexedDB** - Local data storage
- **Service Worker** - Offline functionality
- **PWA Manifest** - Installable app capabilities
- **Inline styling** - No external CSS dependencies

## 🌐 Browser Support

Works on all modern browsers that support:
- IndexedDB
- Service Workers
- ES6+
- PWA features

Tested on:
- Chrome/Edge (desktop & mobile)
- Safari (desktop & iOS)
- Firefox

## 📋 Future Enhancements

Potential features to add:
- Export data to PDF/CSV
- Import/backup functionality
- Week-by-week pregnancy information
- Appointment reminders
- Photo diary
- Contraction timer
- Kick counter
- Partner access

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

Free to use and modify for personal use.

## 💝 Disclaimer

This app is for personal tracking purposes only. Always consult with your healthcare provider for medical advice and decisions regarding your pregnancy.

---

Made with 💕 for expecting mothers everywhere
