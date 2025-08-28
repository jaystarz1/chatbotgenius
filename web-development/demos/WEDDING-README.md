# Wedding Demo Documentation

## Overview
This wedding demo is the flagship template for creating premium wedding websites.

**Template File: `wedding-clean.html`** - Modular template version (287 lines)

## Quick Start for New Wedding Site

```bash
# 1. Copy the template
cp wedding-clean.html /path/to/client/smith-wedding.html
cp -r assets /path/to/client/assets

# 2. Update in HTML:
- Line 6: Title → "Jane & John | October 20, 2026 | Forever Begins"
- Line 77: Names → "Jane & John"
- Line 78: Date → "OCTOBER 20, 2026"
- Line 79: Venue → "Your Venue Name"
- Line 248: Date in countdown → "October 20, 2026 15:00:00"

# 3. Update CSS Variables (assets/css/wedding.css):
--rose-gold: #E8B4B8;    → Client's primary color
--deep-rose: #95626C;    → Client's accent color
--champagne: #F7E7CE;    → Client's light accent
--cream: #FFF8F3;        → Background color
```

## File Structure

```
wedding-demo/
├── wedding-clean.html      # Template
└── assets/
    ├── css/
    │   ├── base.css        # Common styles (200 lines)
    │   ├── components.css  # Reusable components (170 lines)
    │   └── wedding.css     # Wedding-specific (1339 lines)
    └── js/
        ├── share-buttons.js # Social sharing
        ├── countdown.js     # Timer functionality
        └── animations.js    # Scroll effects

Total: 287 HTML + 1417 CSS + 220 JS = 1924 lines (modular and maintainable!)
```

## Key Features

### 1. Glassmorphism Design
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
```

### 2. Animated Elements
- **Floating Hearts**: Continuous animation in hero
- **Scroll Reveals**: Fade-in on scroll using Intersection Observer
- **Hover Effects**: Transform and shadow transitions

### 3. Countdown Timer
```javascript
// Must use FUTURE date or shows 00:00:00
initCountdown('June 15, 2026 15:00:00');
```

### 4. Share Buttons
- Facebook, Twitter, LinkedIn, Email, Copy Link
- Fixed position (bottom-left)
- Auto-initializes on page load

### 5. Premium Design Standards
**NEVER USE EMOJI ICONS IN PRODUCTION**
- Replace emojis with styled text icons or SVGs
- Use gradient backgrounds on icon containers
- All sections must have consistent premium styling
- Every element needs hover effects and transitions

## Sections Included

### Template Sections (wedding-clean.html)
1. Hero with countdown
2. Our Story (3 milestones)
3. Event Details
4. RSVP Form
5. Accommodations (1 hotel)
6. Footer
7. Attribution

**Note**: Add custom sections as needed for specific clients

## Premium Section Examples

### Transport/Getting Around Section (CORRECT WAY)
```html
<!-- Premium styled icons, NOT emojis -->
<div class="transport-item">
    <div class="transport-icon-wrapper">LRT</div>
    <strong>O-Train (LRT)</strong>
    <p>Rideau Station - 2 min walk from hotel</p>
</div>
```

```css
.transport-icon-wrapper {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--rose-gold), var(--deep-rose));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    box-shadow: 0 10px 30px rgba(149, 98, 108, 0.3);
}
```

**NEVER DO THIS:**
```html
<!-- WRONG - Cheap emoji icons -->
<span class="transport-icon">🚇</span>
<span class="transport-icon">🚕</span>
```

## Common Customizations

### Change Color Scheme
```css
/* In assets/css/wedding.css */
:root {
    /* Romantic Pink (default) */
    --rose-gold: #E8B4B8;
    --deep-rose: #95626C;
    
    /* Classic Gold */
    --rose-gold: #D4AF37;
    --deep-rose: #B8860B;
    
    /* Modern Blue */
    --rose-gold: #6BA3D9;
    --deep-rose: #2C5985;
    
    /* Rustic Green */
    --rose-gold: #8B9467;
    --deep-rose: #4A5D3A;
}
```

### Add/Remove Sections
```html
<!-- To add custom sections -->
<!-- Add new section HTML between existing sections -->

<!-- To remove RSVP section -->
<!-- Delete lines 170-201 from wedding-clean.html -->
```

### Update Countdown Date
```javascript
// MUST be future date or displays 00:00:00
initCountdown('December 31, 2026 18:00:00');
```

### Customize Share Text
```javascript
// In share-buttons.js, line 38
const text = 'Check out our wedding website!'; // Customize message
```

## Common Issues & Solutions

### Problem: Countdown shows 00:00:00
**Solution**: Date is in the past. Use date at least 1 day in future.

### Problem: CSS not loading
**Solution**: Check paths - must be relative to HTML file location
```html
<!-- If HTML is in subfolder -->
<link rel="stylesheet" href="../assets/css/wedding.css">
```

### Problem: Fonts not loading
**Solution**: Google Fonts link must be before CSS links
```html
<!-- Correct order -->
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
<link rel="stylesheet" href="assets/css/wedding.css">
```

### Problem: Share buttons not working
**Solution**: JavaScript must be at bottom of body
```html
<!-- Before closing </body> -->
<script src="assets/js/share-buttons.js"></script>
```

## Performance Notes

- **Modular**: 287 lines HTML + cached CSS/JS
- **First Load**: ~95KB total
- **Repeat Load**: ~15KB (CSS/JS cached)
- **Google PageSpeed**: 95+ mobile, 98+ desktop

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- IE 11 ❌ (fuck IE)

## SEO Optimizations

```html
<!-- Required meta tags -->
<title>Names | Date | Tagline</title>
<meta name="description" content="Join us as we celebrate...">
<meta property="og:image" content="path/to/hero-image.jpg">
```

## Client Delivery Checklist

- [ ] All placeholder content replaced
- [ ] Date is in future for countdown
- [ ] Colors match client preference
- [ ] All links working (venue, hotels, registry)
- [ ] RSVP form connected (if needed)
- [ ] Mobile responsive tested
- [ ] Share buttons tested
- [ ] Attribution footer intact
- [ ] Deployed to staging for review

## Advanced Customizations

### Add Photo Gallery
```javascript
// Add lightbox library
<script src="https://cdn.jsdelivr.net/npm/lightbox2@2.11.3/dist/js/lightbox.min.js"></script>
```

### Add Music Player
```html
<audio id="bgMusic" loop>
    <source src="song.mp3" type="audio/mpeg">
</audio>
```

### Add Map
```html
<iframe src="https://maps.google.com/..." width="100%" height="400"></iframe>
```

## Notes from Jay

"This wedding demo is premium as fuck. Don't let it render with basic shit styling. Always test the countdown with a future date. The Ottawa tourism section is optional but shows we go above and beyond. Keep the attribution - it's how we get referrals."

## Support

Issues? Check:
1. This README
2. `/web-development/docs/TECHNICAL-REFERENCE.md`
3. Working demo at `/demos/wedding-clean.html`

---
Last Updated: January 2025
Template Version: 2.0 (Modular)