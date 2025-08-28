# Quick Start Guide - Client Sites in Minutes

## 🚀 Start Here - Copy These Commands

### Wedding Site
```bash
# Setup
cp demos/wedding-clean.html clients/johnson-wedding.html
cp -r demos/assets clients/johnson-assets

# Quick edits to make:
# Line 6: Title
# Line 77-79: Names, date, venue
# Line 248: Countdown date (MUST BE FUTURE!)
# assets/css/wedding.css: Colors (lines 4-9)
```

### Corporate Event
```bash
# Setup
cp demos/corporate-event.html clients/techsummit.html
cp -r demos/assets clients/techsummit-assets

# Quick edits:
# Event name, date, location
# Speaker names and bios
# Agenda/schedule
# Sponsor logos
```

### Birthday Party
```bash
# Setup
cp demos/birthday.html clients/emma-sweet16.html
cp -r demos/assets clients/emma-assets

# Quick edits:
# Birthday person's name
# Party date and time
# Venue address
# RSVP details
```

## 🎨 Quick Color Changes

### Find & Replace These Variables
```css
/* In assets/css/[demo].css */
--primary: #OLD_COLOR;      →  --primary: #NEW_COLOR;
--secondary: #OLD_COLOR;    →  --secondary: #NEW_COLOR;
--accent: #OLD_COLOR;       →  --accent: #NEW_COLOR;
```

### Popular Color Schemes
```css
/* Romantic Pink */
--rose-gold: #E8B4B8;
--deep-rose: #95626C;
--champagne: #F7E7CE;

/* Classic Gold */
--gold: #D4AF37;
--gold-dark: #B8860B;
--cream: #FFF8F3;

/* Modern Blue */
--blue: #4c5fd5;
--blue-dark: #1a1f71;
--blue-light: #6BA3D9;

/* Nature Green */
--sage: #87A96B;
--forest: #228B22;
--mint: #98FF98;
```

## 📝 Content Replacements Checklist

### Must Replace (All Demos)
- [ ] Page title (line ~6)
- [ ] Meta description (line ~7)
- [ ] Main heading/names
- [ ] Date/time
- [ ] Location/venue
- [ ] Contact information

### Optional Sections
- [ ] RSVP form action URL
- [ ] Map embed code
- [ ] Photo gallery images
- [ ] Social media links
- [ ] Registry/donation links

## ⚡ Speed Optimizations

### Before Launch
```bash
# Optimize images
for img in *.jpg; do
  convert "$img" -resize 1920x -quality 85 "opt-$img"
done

# Minify CSS (optional)
npx csso assets/css/wedding.css -o assets/css/wedding.min.css

# Minify JS (optional)
npx terser assets/js/app.js -o assets/js/app.min.js
```

## 🐛 Common Fixes

### Countdown Shows 00:00:00
```javascript
// Change date to future
initCountdown('December 31, 2026 18:00:00'); // Not 2024!
```

### CSS Not Loading
```html
<!-- Fix paths -->
<link rel="stylesheet" href="assets/css/wedding.css"> <!-- No leading slash -->
```

### Fonts Not Showing
```html
<!-- Google Fonts MUST be before CSS -->
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
<link rel="stylesheet" href="assets/css/wedding.css">
```

### Share Buttons Broken
```html
<!-- JavaScript at END of body -->
<script src="assets/js/share-buttons.js"></script>
</body> <!-- Right before closing body -->
```

## 📱 Mobile Testing URLs

```bash
# Local testing
python -m http.server 8000
# Visit: http://[your-ip]:8000 on phone

# Or use ngrok
ngrok http 8000
# Share the https URL
```

## 🚢 Deployment Options

### Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
netlify deploy --prod
```

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial site"
git remote add origin [repo-url]
git push -u origin main
# Enable Pages in repo settings
```

### FTP Upload
```bash
# Using lftp
lftp ftp://user@host
put -r ./*
```

## 📋 Pre-Launch Checklist

### Content
- [ ] All placeholder text replaced
- [ ] Dates are in future (for countdowns)
- [ ] Contact info correct
- [ ] Links working

### Technical
- [ ] Mobile responsive
- [ ] Forms tested
- [ ] Share buttons work
- [ ] PageSpeed score > 90

### Client
- [ ] Client reviewed staging
- [ ] Client approved content
- [ ] Client tested features
- [ ] Payment received

## 💰 Pricing Quick Reference

| Type | Base | Rush (+50%) | Custom | Total |
|------|------|-------------|---------|-------|
| Event Page | $97 | $145 | +$97 | ~$200-300 |
| Wedding | $497 | $745 | +$197 | ~$700-1000 |
| Corporate | $997 | $1495 | +$297 | ~$1300-1800 |

## 🔥 Pro Tips

1. **Always use future dates** for countdowns
2. **Test on real phone**, not just browser resize
3. **Keep attribution footer** = free marketing
4. **Screenshot everything** before going live
5. **Get 50% upfront**, always

## 📞 Quick Support

### Check These First:
1. Demo README: `/demos/[DEMO]-README.md`
2. Technical Reference: `/docs/TECHNICAL-REFERENCE.md`
3. Original demo file for comparison

### Common Terminal Commands:
```bash
# Find text in files
grep -r "search term" .

# Compare files
diff original.html modified.html

# Check file sizes
du -sh *

# Kill local server
Ctrl+C (or Cmd+C on Mac)
```

---
**Remember**: The client thinks you're a genius. Don't prove them wrong by forgetting to test the countdown timer.

Last Updated: January 2025