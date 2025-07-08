// News Cache Implementation with ETag support
// Enables instant loading for repeat visitors

class NewsCache {
    constructor() {
        this.CACHE_KEY = 'ai_news_cache';
        this.ETAG_KEY = 'ai_news_etag';
        this.TIMESTAMP_KEY = 'ai_news_timestamp';
        this.CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    }
    
    // Check if cache is still valid
    isCacheValid() {
        const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
        if (!timestamp) return false;
        
        const cacheAge = Date.now() - parseInt(timestamp);
        return cacheAge < this.CACHE_DURATION;
    }
    
    // Get cached news items
    getCached() {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Error parsing cached news:', error);
            return null;
        }
    }
    
    // Save news items to cache
    saveToCache(items, etag) {
        try {
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
            localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
            if (etag) {
                localStorage.setItem(this.ETAG_KEY, etag);
            }
        } catch (error) {
            console.error('Error saving to cache:', error);
            // Clear cache if storage is full
            this.clearCache();
        }
    }
    
    // Clear all cached data
    clearCache() {
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.ETAG_KEY);
        localStorage.removeItem(this.TIMESTAMP_KEY);
    }
    
    // Fetch news with caching support
    async fetchNews(url) {
        // Check if we have valid cached data
        if (this.isCacheValid()) {
            const cached = this.getCached();
            if (cached) {
                console.log('Serving news from cache');
                return { items: cached, fromCache: true };
            }
        }
        
        const cachedEtag = localStorage.getItem(this.ETAG_KEY);
        
        try {
            const headers = {};
            if (cachedEtag) {
                headers['If-None-Match'] = cachedEtag;
            }
            
            const response = await fetch(url, { headers });
            
            // If not modified, use cache
            if (response.status === 304) {
                console.log('News not modified, using cache');
                const cached = this.getCached();
                if (cached) {
                    // Update timestamp even though content hasn't changed
                    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
                    return { items: cached, fromCache: true };
                }
            }
            
            // Parse new data
            const data = await response.json();
            const newEtag = response.headers.get('ETag');
            
            // Save to cache
            this.saveToCache(data, newEtag);
            
            console.log('Fetched fresh news data');
            return { items: data, fromCache: false };
            
        } catch (error) {
            console.error('Fetch failed, trying cache:', error);
            const cached = this.getCached();
            if (cached) {
                return { items: cached, fromCache: true, error: true };
            }
            throw error;
        }
    }
}

// Export for use in other scripts
window.NewsCache = NewsCache;
