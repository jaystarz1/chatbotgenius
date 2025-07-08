// AI News Virtual List Integration
// This script integrates the virtual list, caching, and loading states

(function() {
    'use strict';
    
    // Global variables
    let virtualNewsList = null;
    let newsCache = null;
    let newsLoader = null;
    let allNewsItems = [];
    let activeCategory = 'all';
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeNewsPage();
    });
    
    async function initializeNewsPage() {
        // Get containers
        const newsGrid = document.getElementById('news-grid');
        const newsStats = document.getElementById('news-stats');
        
        if (!newsGrid) {
            console.error('News grid container not found');
            return;
        }
        
        // Initialize modules
        newsCache = new NewsCache();
        newsLoader = new NewsLoader(newsGrid);
        
        // Show loading state
        newsLoader.showSkeleton(9);
        updateStats('Loading latest AI news...');
        
        try {
            // Load news items
            await loadAllNews();
            
            // Initialize virtual list with loaded items
            if (allNewsItems.length > 0) {
                virtualNewsList = new VirtualNewsList(newsGrid, allNewsItems);
                window.virtualNewsList = virtualNewsList; // Make globally accessible
                
                // Set up category filters
                setupCategoryFilters();
                
                // Update stats
                updateStats(`Displaying ${allNewsItems.length} AI news articles`);
                
                // Show success message if from cache
                const fromCache = newsCache.isCacheValid();
                if (fromCache) {
                    newsLoader.showSuccess('News loaded from cache for instant display!');
                }
            } else {
                throw new Error('No news items loaded');
            }
            
        } catch (error) {
            console.error('Error initializing news page:', error);
            newsLoader.showError(
                'Unable to load news articles. Please check your connection and try again.',
                () => location.reload()
            );
            updateStats('Error loading news');
        }
    }
    
    async function loadAllNews() {
        // In a real implementation, this would fetch from your RSS aggregator
        // For now, we'll simulate loading news items
        
        try {
            // Check cache first
            const cached = newsCache.getCached();
            if (cached && newsCache.isCacheValid()) {
                allNewsItems = cached;
                console.log('Loaded', allNewsItems.length, 'items from cache');
                return;
            }
            
            // Simulate fetching news (replace with actual RSS feed fetching)
            allNewsItems = await fetchNewsFromFeeds();
            
            // Save to cache
            newsCache.saveToCache(allNewsItems);
            
            console.log('Loaded', allNewsItems.length, 'fresh items');
            
        } catch (error) {
            console.error('Error loading news:', error);
            // Try to use cached data even if expired
            const cached = newsCache.getCached();
            if (cached) {
                allNewsItems = cached;
                console.log('Using expired cache due to error');
            } else {
                throw error;
            }
        }
    }
    
    async function fetchNewsFromFeeds() {
        // This is a placeholder - replace with actual RSS feed fetching
        // For demonstration, creating sample data
        
        const categories = ['AI', 'Business', 'Microsoft', 'OpenAI', 'Ethics', 'Healthcare', 'Tech', 'Policy'];
        const sources = ['TechCrunch', 'The Verge', 'Wired', 'MIT Review', 'AI News', 'VentureBeat'];
        
        const sampleItems = [];
        const now = new Date();
        
        // Generate sample news items
        for (let i = 0; i < 200; i++) {
            const hoursAgo = Math.floor(Math.random() * 72);
            const pubDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
            
            sampleItems.push({
                id: `news-${i}`,
                title: `AI Development ${i + 1}: Breaking News in ${categories[i % categories.length]}`,
                excerpt: `This is a sample news excerpt discussing the latest developments in artificial intelligence and machine learning. The article covers important updates and insights about ${categories[i % categories.length].toLowerCase()} applications.`,
                link: `https://example.com/news/${i}`,
                source: sources[i % sources.length],
                category: categories[i % categories.length],
                pubDate: pubDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                })
            });
        }
        
        // Sort by date (newest first)
        sampleItems.sort((a, b) => {
            const dateA = new Date(a.pubDate);
            const dateB = new Date(b.pubDate);
            return dateB - dateA;
        });
        
        return sampleItems;
    }
    
    function setupCategoryFilters() {
        const filterContainer = document.getElementById('category-filters');
        if (!filterContainer) return;
        
        // Get unique categories
        const categories = ['all', ...new Set(allNewsItems.map(item => item.category).filter(Boolean))];
        
        // Clear existing filters
        filterContainer.innerHTML = '';
        
        // Create filter buttons
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            if (category === 'all') {
                button.classList.add('active');
            }
            button.textContent = category === 'all' ? 'All Categories' : category;
            button.onclick = () => filterByCategory(category);
            filterContainer.appendChild(button);
        });
        
        // Setup mobile category panel
        setupMobileCategoryPanel(categories);
    }
    
    function setupMobileCategoryPanel(categories) {
        const mobileGrid = document.getElementById('mobile-category-grid');
        if (!mobileGrid) return;
        
        mobileGrid.innerHTML = '';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'mobile-category-item';
            if (category === activeCategory) {
                button.classList.add('active');
            }
            button.textContent = category === 'all' ? 'All Categories' : category;
            button.onclick = () => {
                filterByCategory(category);
                closeCategoryPanel();
            };
            mobileGrid.appendChild(button);
        });
    }
    
    function filterByCategory(category) {
        activeCategory = category;
        
        // Update desktop filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === (category === 'all' ? 'All Categories' : category)) {
                btn.classList.add('active');
            }
        });
        
        // Update mobile filter buttons
        document.querySelectorAll('.mobile-category-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === (category === 'all' ? 'All Categories' : category)) {
                btn.classList.add('active');
            }
        });
        
        // Update mobile button label
        const mobileCategoryLabel = document.getElementById('current-category-label');
        if (mobileCategoryLabel) {
            mobileCategoryLabel.textContent = category === 'all' ? 'All Categories' : category;
        }
        
        // Filter items using virtual list
        if (virtualNewsList) {
            virtualNewsList.filterByCategory(category);
            
            // Update stats
            const count = virtualNewsList.visibleItems.length;
            if (count === 0) {
                newsLoader.showEmptyState(category);
            } else {
                updateStats(`Showing ${count} articles${category !== 'all' ? ` in ${category}` : ''}`);
            }
        }
    }
    
    function updateStats(message) {
        const statsEl = document.getElementById('news-stats');
        if (statsEl) {
            statsEl.textContent = message;
        }
    }
    
    // Make filter function globally accessible
    window.filterByCategory = filterByCategory;
    
    // Mobile category panel functions
    window.openCategoryPanel = function() {
        document.getElementById('mobile-category-backdrop').style.display = 'block';
        document.getElementById('mobile-category-panel').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('mobile-category-backdrop').classList.add('show');
            document.getElementById('mobile-category-panel').classList.add('show');
        }, 10);
    };
    
    window.closeCategoryPanel = function() {
        document.getElementById('mobile-category-backdrop').classList.remove('show');
        document.getElementById('mobile-category-panel').classList.remove('show');
        
        setTimeout(() => {
            document.getElementById('mobile-category-backdrop').style.display = 'none';
            document.getElementById('mobile-category-panel').style.display = 'none';
        }, 300);
    };
    
    // Set up mobile category button
    const mobileCategoryButton = document.getElementById('mobile-category-button');
    if (mobileCategoryButton) {
        mobileCategoryButton.onclick = openCategoryPanel;
    }
    
    // Refresh news every 3 hours
    setInterval(async () => {
        try {
            await loadAllNews();
            if (virtualNewsList) {
                virtualNewsList.updateItems(allNewsItems);
                updateStats(`Updated: ${allNewsItems.length} AI news articles`);
                newsLoader.showSuccess('News updated successfully!');
            }
        } catch (error) {
            console.error('Error refreshing news:', error);
        }
    }, 3 * 60 * 60 * 1000);
    
})();
