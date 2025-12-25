# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages in 5 Minutes

### 1️⃣ Create GitHub Repository
- Go to https://github.com/new
- Name: `pregnancy-tracker` (or your choice)
- Make it Public
- Don't check any boxes
- Click "Create repository"

### 2️⃣ Upload Files
You have two options:

#### Option A: Upload via GitHub Web Interface (Easiest)
1. On your new repo page, click "uploading an existing file"
2. Drag all 7 files into the upload area:
   - `.gitignore`
   - `index.html`
   - `service-worker.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
   - `README.md`
3. Write commit message: "Initial commit"
4. Click "Commit changes"

#### Option B: Use Git Command Line
```bash
# In the folder with your files, run:
git init
git add .
git commit -m "Initial commit: Pregnancy Tracker PWA"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pregnancy-tracker.git
git push -u origin main
```

### 3️⃣ Enable GitHub Pages
1. Go to your repo Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Select "/ (root)" folder
5. Click "Save"
6. Wait 2-3 minutes ⏰

### 4️⃣ Access Your App
Your app will be live at:
```
https://YOUR-USERNAME.github.io/pregnancy-tracker/
```

### 5️⃣ Install as PWA
- Visit the URL on your phone or computer
- Look for "Install" button in address bar
- Or use browser menu → "Install Pregnancy Tracker"
- App now works offline! 📱

## 🎯 Important Notes

### If Deploying to a Subfolder
If your repo name is NOT `pregnancy-tracker`, update these files:

**In `index.html`** (line 12):
```html
<link rel="manifest" href="./YOUR-REPO-NAME/manifest.json">
```

**In `manifest.json`** (line 5):
```json
"start_url": "./YOUR-REPO-NAME/"
```

### Custom Domain (Optional)
If you want a custom domain like `pregnancy.yourdomain.com`:
1. In repo Settings → Pages
2. Add your custom domain
3. Follow GitHub's DNS instructions
4. Wait for DNS propagation (can take 24 hours)

## 🔍 Troubleshooting

**App not loading?**
- Check GitHub Pages is enabled in Settings → Pages
- Wait a few minutes after enabling
- Check browser console (F12) for errors
- Ensure all 7 files were uploaded
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**PWA not installing?**
- Make sure you're using HTTPS (GitHub Pages uses HTTPS automatically)
- Try a different browser (Chrome works best)
- Check manifest.json and service-worker.js are accessible

**Data not saving?**
- Check browser supports IndexedDB
- Clear browser cache and try again
- Check browser console for errors

## 📱 Share Your App

Once deployed, share the URL with:
- Your partner
- Healthcare provider
- Support group
- Anyone who needs pregnancy tracking!

## 💡 Tips

1. **Bookmark the URL** on your phone for quick access
2. **Install as PWA** for the best experience
3. **Back up regularly** by taking screenshots (until export feature is added)
4. **Customize** by editing the code to add your own features!

---

Need help? Check the full README.md for more details!
