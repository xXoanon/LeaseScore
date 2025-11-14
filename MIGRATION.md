# Migration Guide

## Moving from Single-File to Multi-File Structure

This guide helps you transition from `lease-calculator.html` to the new professional structure.

## What Changed?

### Old Structure (Single File)
```
lease-calculator.html (everything in one file)
├── HTML
├── <style> CSS </style>
└── <script> JavaScript </script>
```

### New Structure (Separated Files)
```
index.html          → HTML structure only
styles.css          → All CSS styling
calculator.js       → All JavaScript logic
```

## Benefits of New Structure

1. **Better Organization** - Each file has a single responsibility
2. **Easier Maintenance** - Find and fix issues faster
3. **Improved Performance** - Browser can cache CSS and JS separately
4. **Team Collaboration** - Multiple people can work on different files
5. **Scalability** - Easy to add new features without cluttering
6. **Professional Standard** - Industry best practice

## How to Use the New Version

### Option 1: Start Fresh (Recommended)
1. Use `index.html` as your main file
2. Keep `styles.css` and `calculator.js` in the same directory
3. Open `index.html` in your browser

### Option 2: Keep Both Versions
- `lease-calculator.html` - Legacy single-file version
- `index.html` + `styles.css` + `calculator.js` - New version
- Choose which to deploy

## File Locations

All files must be in the **same directory**:
```
your-project/
├── index.html
├── styles.css
├── calculator.js
├── README.md
├── SETUP.md
├── FEATURES.md
├── MIGRATION.md
└── PROJECT-SUMMARY.md
```

## Linking Files

The new `index.html` links to external files:

```html
<!-- In <head> -->
<link rel="stylesheet" href="styles.css">

<!-- Before </body> -->
<script src="calculator.js"></script>
```

**Important:** File paths are relative. Keep all files in the same folder.

## What's Preserved?

All original features are maintained:
- ✅ Ad slots (header, sidebar, footer)
- ✅ Buy Me a Coffee button
- ✅ SEO meta tags
- ✅ 1% Rule evaluation
- ✅ Deal scoring system
- ✅ Real-time calculations

## What's New?

Enhanced features added:
- ✅ Three calculation tabs
- ✅ Simple/Advanced mode toggle
- ✅ Lease vs Buy comparison
- ✅ Detailed payment breakdown
- ✅ Money Factor or Interest Rate input
- ✅ Additional fields (residual, trade-in, fees)
- ✅ Improved calculations
- ✅ Better UI/UX

## Configuration Changes

### Ad Slots
**Location:** `index.html`  
**Same as before:** Three ad slots with same classes

```html
<div class="ad-slot ad-header">Advertisement - 728x90</div>
<div class="ad-slot ad-sidebar">Advertisement - 300x250</div>
<div class="ad-slot ad-footer">Advertisement - 728x90</div>
```

### Buy Me a Coffee
**Location:** `calculator.js` (line ~380)  
**Change:** Now in JavaScript instead of HTML

```javascript
// Find this in calculator.js
<a href="#" class="coffee-button" target="_blank" rel="noopener">
```

Replace `#` with your link.

### SEO Meta Tags
**Location:** `index.html` (in `<head>`)  
**Same as before:** Update domain URLs and image paths

```html
<meta property="og:url" content="https://yourdomain.com/">
<link rel="canonical" href="https://yourdomain.com/">
```

## Testing Checklist

After migration, test these features:

- [ ] Page loads correctly
- [ ] CSS styling appears
- [ ] JavaScript calculations work
- [ ] Sliders sync with inputs
- [ ] All three tabs work
- [ ] Simple/Advanced mode toggle works
- [ ] Money Factor/Interest Rate toggle works
- [ ] Results display correctly
- [ ] Mobile responsive layout works
- [ ] Ad slots appear in correct positions
- [ ] Buy Me a Coffee button works (after adding link)

## Troubleshooting

### CSS Not Loading
**Problem:** Page has no styling  
**Solution:** Check that `styles.css` is in the same folder as `index.html`

### JavaScript Not Working
**Problem:** Calculator doesn't calculate  
**Solution:** 
1. Check that `calculator.js` is in the same folder
2. Open browser console (F12) to see errors
3. Verify file paths in `index.html`

### Files in Different Folders
**Problem:** Files are in subdirectories  
**Solution:** Update paths in `index.html`:

```html
<!-- If CSS is in a 'css' folder -->
<link rel="stylesheet" href="css/styles.css">

<!-- If JS is in a 'js' folder -->
<script src="js/calculator.js"></script>
```

## Deployment

### Local Testing
1. Open `index.html` directly in browser
2. All files must be in same directory

### Web Server
1. Upload all three files to your server
2. Keep them in the same directory
3. Link to `index.html` (or rename to match your needs)

### GitHub Pages
1. Push all files to repository
2. Enable GitHub Pages
3. Set source to main branch
4. Access via `https://username.github.io/repo-name/`

## ~~Reverting to Old Version~~

**Note:** The old `lease-calculator.html` file has been removed as all features have been successfully migrated to the new multi-file structure. The new version includes all original functionality plus many enhancements.

## Questions?

See [SETUP.md](SETUP.md) for detailed configuration instructions.

---

**Recommendation:** Use the new multi-file structure for better maintainability and professional development practices.
