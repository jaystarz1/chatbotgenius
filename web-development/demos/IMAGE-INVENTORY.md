# Demo Pages Image Inventory

## Summary
- **Total Demo Pages**: 9 HTML files
- **Pages Needing Images**: 7 pages
- **Total Images Required**: 24 images
- **Image Format**: JPEG (optimized for web)
- **Default Size**: 1200x800px

## Detailed Inventory

### 1. Wedding Demo (`wedding.html`)
**Images Needed**: 4
- `hero` - Elegant wedding venue with white roses and gold accents
- `couple` - Silhouette of bride and groom at sunset
- `venue` - Beautiful outdoor wedding ceremony setup
- `reception` - Elegant wedding reception table

### 2. Wedding Premium (`wedding-premium.html`)
**Images Needed**: 4
- `hero-premium` - Ultra-luxury wedding venue with crystal chandeliers
- `gallery1` - Romantic couple portrait in garden
- `gallery2` - Close-up of wedding rings on white roses
- `gallery3` - Wedding cake with gold leaf details

### 3. Birthday Demo (`birthday.html`)
**Images Needed**: 3
- `hero` - Colorful birthday party celebration
- `cake` - Spectacular birthday cake with candles
- `party` - Fun birthday party scene with decorations

### 4. Corporate Event (`corporate-event.html`)
**Images Needed**: 4
- `hero` - Modern corporate conference hall
- `networking` - Business professionals networking
- `speaker` - Professional speaker on stage
- `venue` - Luxury hotel conference center

### 5. Anniversary Demo (`anniversary.html`)
**Images Needed**: 3
- `hero` - Golden anniversary celebration
- `couple` - Mature couple celebrating milestone
- `memories` - Vintage photo album and roses

### 6. Fundraiser Demo (`fundraiser.html`)
**Images Needed**: 3
- `hero` - Charity gala event with purple/gold theme
- `cause` - Hands joining together for unity
- `venue` - Elegant banquet hall setup

### 7. Garage Sale Demo (`garage-sale.html`)
**Images Needed**: 3
- `hero` - Neighborhood garage sale scene
- `furniture` - Vintage furniture pieces
- `treasures` - Collection of antiques

## Pages Without Custom Images
- `wedding-clean.html` - Minimal version, no images
- `showcase.html` - Index page, no demo images
- `showcase-premium.html` - Index page, uses placeholders

## Current Status
All demo pages currently use placeholder images from:
- `https://picsum.photos/` - Random placeholder service
- Inline SVG data URLs for decorative elements

## Implementation Plan

### Phase 1: Core Event Pages (Priority)
1. Wedding demos (8 images total)
2. Corporate event (4 images)
3. Birthday (3 images)

### Phase 2: Special Events
1. Anniversary (3 images)
2. Fundraiser (3 images)
3. Garage Sale (3 images)

### Technical Details
- **Generator Script**: `/generate-demo-images.js`
- **Output Directory**: `/web-development/demos/assets/images/`
- **Naming Convention**: `{event-type}-{image-name}.jpg`
- **Optimization**: Sharp library for compression and resizing
- **API**: OpenAI DALL-E 3 for generation

## Usage

To generate images for a specific demo:
```bash
node generate-demo-images.js wedding.html
```

To generate all images (batch):
```bash
for demo in wedding.html birthday.html corporate-event.html anniversary.html fundraiser.html garage-sale.html wedding-premium.html; do
    node generate-demo-images.js $demo
    sleep 5
done
```

## Cost Estimate
- DALL-E 3 HD images: ~$0.080 per image
- Total for all 24 images: ~$1.92
- Time to generate: ~10-15 minutes total

---
Generated: August 29, 2025