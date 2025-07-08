# Task: Image Optimization & Performance

## Problem
- Large image files (JPGs) slow down page load
- No lazy loading for below-fold images
- Missing modern formats (WebP)
- No responsive image sizing

## Current Images
- `chatbot-genius-cover-final.jpg` - Book cover
- `maggie-christmas-elf-cover-new.jpg` - Book cover
- `last-algorithm-cover-new.jpg` - Book cover
- `jay-tarzwell-headshot.jpg` - Profile photo

## Solution Steps

### 1. Convert Images to WebP
```bash
# Install cwebp (if not already installed)
brew install webp

# Convert each image
cd /Users/jaytarzwell/jaystarz1.github.io/images/
for img in *.jpg; do
    cwebp -q 85 "$img" -o "${img%.jpg}.webp"
done

# Create smaller sizes for responsive
for img in *.jpg; do
    # Small (mobile)
    convert "$img" -resize 400x "$img%-small.jpg"
    cwebp -q 85 "${img%-small.jpg}" -o "${img%.jpg}-small.webp"
    
    # Medium (tablet)
    convert "$img" -resize 800x "${img%-medium.jpg}"
    cwebp -q 85 "${img%-medium.jpg}" -o "${img%.jpg}-medium.webp"
done
```

### 2. Implement Picture Elements
```html
<!-- Replace current img tags with: -->
<picture>
    <source type="image/webp" 
            srcset="images/chatbot-genius-cover-final-small.webp 400w,
                    images/chatbot-genius-cover-final-medium.webp 800w,
                    images/chatbot-genius-cover-final.webp 1200w"
            sizes="(max-width: 768px) 100vw, 50vw">
    <source type="image/jpeg" 
            srcset="images/chatbot-genius-cover-final-small.jpg 400w,
                    images/chatbot-genius-cover-final-medium.jpg 800w,
                    images/chatbot-genius-cover-final.jpg 1200w"
            sizes="(max-width: 768px) 100vw, 50vw">
    <img src="images/chatbot-genius-cover-final.jpg" 
         alt="Chatbot Genius Book Cover"
         loading="lazy"
         width="300"
         height="450">
</picture>
```

### 3. Add Lazy Loading Script
```javascript
// lazy-load.js
class LazyImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        // Use native lazy loading if supported
        if ('loading' in HTMLImageElement.prototype) {
            console.log('Native lazy loading supported');
            return;
        }
        
        // Fallback to Intersection Observer
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        this.images.forEach(img => this.imageObserver.observe(img));
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        img.src = src;
        img.removeAttribute('data-src');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new LazyImageLoader();
});
```

### 4. Optimize Loading Priority
```html
<!-- In <head> for above-fold images -->
<link rel="preload" as="image" href="images/jay-tarzwell-headshot.webp" type="image/webp">
<link rel="preload" as="image" href="images/chatbot-genius-cover-final.webp" type="image/webp">

<!-- Add resource hints -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
```

### 5. Create Image Component Helper
```javascript
// image-helper.js
function createResponsiveImage(imageName, alt, className = '') {
    const baseUrl = 'images/';
    const sizes = ['small', 'medium', ''];
    const widths = [400, 800, 1200];
    
    const webpSrcset = sizes.map((size, i) => {
        const suffix = size ? `-${size}` : '';
        return `${baseUrl}${imageName}${suffix}.webp ${widths[i]}w`;
    }).join(', ');
    
    const jpgSrcset = sizes.map((size, i) => {
        const suffix = size ? `-${size}` : '';
        return `${baseUrl}${imageName}${suffix}.jpg ${widths[i]}w`;
    }).join(', ');
    
    return `
        <picture class="${className}">
            <source type="image/webp" srcset="${webpSrcset}" sizes="(max-width: 768px) 100vw, 50vw">
            <source type="image/jpeg" srcset="${jpgSrcset}" sizes="(max-width: 768px) 100vw, 50vw">
            <img src="${baseUrl}${imageName}.jpg" alt="${alt}" loading="lazy">
        </picture>
    `;
}
```

### 6. Update Book Gallery Section
```html
<!-- In books.html -->
<div class="book-gallery">
    <div class="book-item">
        <picture>
            <source type="image/webp" 
                    srcset="images/chatbot-genius-cover-final-small.webp 400w,
                            images/chatbot-genius-cover-final.webp 800w">
            <img src="images/chatbot-genius-cover-final.jpg" 
                 alt="Chatbot Genius: Transform Your Business with AI"
                 loading="lazy"
                 class="book-cover">
        </picture>
        <h3>Chatbot Genius</h3>
        <p>Transform Your Business with AI in 10 Hours</p>
        <a href="https://www.amazon.ca/Chatbot-Genius-10-Hour-Beginners-Transforming-ebook/dp/B0DB3GS284" 
           class="buy-button">View on Amazon</a>
    </div>
    <!-- Repeat for other books -->
</div>
```

### 7. Add Loading Placeholders
```css
/* loading-placeholders.css */
.book-cover {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Blur-up technique */
.lazyload,
.lazyloading {
    filter: blur(5px);
    transition: filter 0.3s;
}

.lazyloaded {
    filter: blur(0);
}
```

## Testing Checklist
- [ ] Verify WebP images are served to supported browsers
- [ ] Test fallback to JPEG in Safari/older browsers
- [ ] Confirm lazy loading works (network tab)
- [ ] Check responsive image selection at different sizes
- [ ] Validate loading performance metrics
- [ ] Test on slow 3G connection

## Expected Results
- 60-70% reduction in image file sizes
- Lazy loading saves ~1MB on initial load
- First Contentful Paint improved by 1-2 seconds
- Better Core Web Vitals scores

## Files to Update
1. All HTML files with images
2. Create `js/lazy-load.js`
3. Create `js/image-helper.js`
4. Update inline styles for placeholders
5. Add WebP images to `images/` directory

## Measurement
```javascript
// Add to page for testing
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page Load Time:', pageLoadTime + 'ms');
    
    // Log image loading performance
    const images = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('.jpg') || entry.name.includes('.webp'));
    
    console.table(images.map(img => ({
        name: img.name.split('/').pop(),
        duration: Math.round(img.duration),
        size: Math.round(img.transferSize / 1024) + 'KB'
    })));
});
```
