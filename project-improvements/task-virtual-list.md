# Task: Implement Virtual List for AI-News Page

## Problem
- Loading 200+ news items creates huge DOM
- Initial page load is slow (3+ seconds)
- Memory usage is high
- Scrolling can be janky

## Solution
Implement a virtual list that only renders visible items + small buffer.

## Implementation Steps

### 1. Create Virtual List Manager
```javascript
// news-virtual-list.js
class VirtualNewsList {
    constructor(container, items, itemHeight = 110) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.buffer = 8;
        this.pool = [];
        this.scrollTop = 0;
        
        this.init();
    }
    
    init() {
        // Create pool of reusable DOM elements
        const poolSize = Math.ceil(window.innerHeight / this.itemHeight) + (this.buffer * 2);
        for (let i = 0; i < poolSize; i++) {
            const el = document.createElement('div');
            el.className = 'news-item virtual';
            el.style.position = 'absolute';
            el.style.width = '100%';
            this.pool.push(el);
            this.container.appendChild(el);
        }
        
        // Set container height
        this.container.style.position = 'relative';
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
        
        // Bind scroll handler
        window.addEventListener('scroll', () => this.render());
        this.render();
    }
    
    render() {
        const scrollTop = window.scrollY;
        const containerTop = this.container.offsetTop;
        const relativeScroll = Math.max(0, scrollTop - containerTop);
        
        const firstVisible = Math.floor(relativeScroll / this.itemHeight) - this.buffer;
        const lastVisible = firstVisible + this.pool.length;
        
        this.pool.forEach((el, poolIndex) => {
            const itemIndex = firstVisible + poolIndex;
            
            if (itemIndex < 0 || itemIndex >= this.items.length) {
                el.style.display = 'none';
                return;
            }
            
            const item = this.items[itemIndex];
            el.style.display = 'block';
            el.style.transform = `translateY(${itemIndex * this.itemHeight}px)`;
            el.innerHTML = this.renderItem(item);
        });
    }
    
    renderItem(item) {
        return `
            <article class="news-item-content">
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p class="news-meta">
                    <span class="source">${item.source}</span>
                    <span class="date">${item.date}</span>
                </p>
                <p class="summary">${item.summary}</p>
            </article>
        `;
    }
}
```

### 2. Add Caching with ETag
```javascript
// news-cache.js
class NewsCache {
    constructor() {
        this.CACHE_KEY = 'ai_news_cache';
        this.ETAG_KEY = 'ai_news_etag';
    }
    
    async fetchNews() {
        const cachedEtag = localStorage.getItem(this.ETAG_KEY);
        
        try {
            const response = await fetch('/api/news-feed.json', {
                headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {}
            });
            
            if (response.status === 304) {
                // Not modified, use cache
                return this.getCached();
            }
            
            const newEtag = response.headers.get('ETag');
            const data = await response.json();
            
            // Update cache
            if (newEtag) {
                localStorage.setItem(this.ETAG_KEY, newEtag);
                localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
            }
            
            return data;
        } catch (error) {
            console.error('Fetch failed, trying cache:', error);
            return this.getCached() || [];
        }
    }
    
    getCached() {
        const cached = localStorage.getItem(this.CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    }
}
```

### 3. Add Loading States
```javascript
// news-loader.js
class NewsLoader {
    constructor(container) {
        this.container = container;
    }
    
    showSkeleton(count = 10) {
        this.container.innerHTML = Array(count).fill(0).map(() => `
            <div class="news-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-meta"></div>
                <div class="skeleton-summary"></div>
            </div>
        `).join('');
    }
    
    showError(onRetry) {
        this.container.innerHTML = `
            <div class="news-error">
                <p>Unable to load news items.</p>
                <button id="retry-load" class="btn-primary">Retry</button>
            </div>
        `;
        document.getElementById('retry-load').addEventListener('click', onRetry);
    }
}
```

### 4. Update HTML Structure
```html
<!-- In ai-news.html -->
<div id="news-container" class="news-virtual-container">
    <!-- Virtual list items will be inserted here -->
</div>

<style>
.news-virtual-container {
    position: relative;
    min-height: 500px;
}

.news-item.virtual {
    position: absolute;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.news-skeleton {
    padding: 20px;
    margin-bottom: 20px;
}

.skeleton-title,
.skeleton-meta,
.skeleton-summary {
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 10px;
    animation: pulse 1.5s infinite;
}

.skeleton-title { height: 24px; width: 70%; }
.skeleton-meta { height: 16px; width: 40%; }
.skeleton-summary { height: 48px; width: 100%; }

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
}
</style>
```

### 5. Initialize Everything
```javascript
// In main script
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('news-container');
    const loader = new NewsLoader(container);
    const cache = new NewsCache();
    
    // Show loading state
    loader.showSkeleton();
    
    try {
        // Fetch news (from cache or network)
        const newsItems = await cache.fetchNews();
        
        // Clear container and init virtual list
        container.innerHTML = '';
        new VirtualNewsList(container, newsItems);
        
    } catch (error) {
        loader.showError(async () => {
            // Retry logic
            location.reload();
        });
    }
});
```

## Testing Checklist
- [ ] Verify only visible items are in DOM
- [ ] Test scroll performance with 200+ items
- [ ] Verify cache works on reload
- [ ] Test error states and retry
- [ ] Check mobile scroll behavior
- [ ] Measure memory usage before/after

## Success Metrics
- Initial load time < 500ms (from cache)
- Smooth 60fps scrolling
- DOM nodes < 30 (vs 200+)
- Memory usage reduced by 80%

## Files to Update
1. `ai-news.html` - Add container and scripts
2. Create `js/news-virtual-list.js`
3. Create `js/news-cache.js`
4. Create `js/news-loader.js`
5. Update styles for virtual list

## Rollback Plan
Keep original implementation commented out until virtual list is proven stable.
