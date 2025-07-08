// Virtual List Implementation for AI News Page
// This dramatically improves performance by only rendering visible items

class VirtualNewsList {
    constructor(container, items, itemHeight = 150) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.buffer = 5; // Number of items to render outside viewport
        this.pool = [];
        this.scrollTop = 0;
        this.isFiltered = false;
        this.visibleItems = items;
        
        this.init();
    }
    
    init() {
        // Clear existing content
        this.container.innerHTML = '';
        
        // Create pool of reusable DOM elements
        const poolSize = Math.ceil(window.innerHeight / this.itemHeight) + (this.buffer * 2);
        
        for (let i = 0; i < poolSize; i++) {
            const el = document.createElement('div');
            el.className = 'news-card virtual-item';
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.right = '0';
            el.style.width = 'calc(100% - 30px)';
            el.style.margin = '0 15px';
            this.pool.push(el);
            this.container.appendChild(el);
        }
        
        // Set container height based on visible items
        this.updateContainerHeight();
        
        // Make container relative positioned
        this.container.style.position = 'relative';
        
        // Bind scroll handler with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => this.render(), 16); // ~60fps
        });
        
        // Initial render
        this.render();
    }
    
    updateContainerHeight() {
        this.container.style.height = `${this.visibleItems.length * this.itemHeight}px`;
    }
    
    filterByCategory(category) {
        if (category === 'all') {
            this.visibleItems = this.items;
            this.isFiltered = false;
        } else {
            this.visibleItems = this.items.filter(item => 
                item.category && item.category.toLowerCase() === category.toLowerCase()
            );
            this.isFiltered = true;
        }
        
        this.updateContainerHeight();
        this.render();
    }
    
    render() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const containerTop = this.container.offsetTop;
        const relativeScroll = Math.max(0, scrollTop - containerTop);
        
        const firstVisible = Math.floor(relativeScroll / this.itemHeight) - this.buffer;
        const lastVisible = firstVisible + this.pool.length;
        
        this.pool.forEach((el, poolIndex) => {
            const itemIndex = firstVisible + poolIndex;
            
            if (itemIndex < 0 || itemIndex >= this.visibleItems.length) {
                el.style.display = 'none';
                return;
            }
            
            const item = this.visibleItems[itemIndex];
            el.style.display = 'block';
            el.style.top = `${itemIndex * this.itemHeight}px`;
            
            // Only update content if it changed
            if (el.dataset.itemId !== item.id) {
                el.dataset.itemId = item.id;
                el.innerHTML = this.renderItem(item);
            }
        });
    }
    
    renderItem(item) {
        const categoryClass = item.category ? `category-${item.category.toLowerCase().replace(/\s+/g, '-')}` : 'category-general';
        
        return `
            <div class="news-card-content">
                ${item.category ? `<span class="category-badge ${categoryClass}">${item.category}</span>` : ''}
                <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                <p class="news-card-excerpt">${item.excerpt || item.summary || ''}</p>
                <div class="news-card-meta">
                    <span class="news-source">${item.source || 'Unknown Source'}</span>
                    <span class="news-date">${item.pubDate || item.date || ''}</span>
                </div>
            </div>
        `;
    }
    
    // Update items without re-initializing
    updateItems(newItems) {
        this.items = newItems;
        this.visibleItems = this.isFiltered ? this.items : newItems;
        this.updateContainerHeight();
        this.render();
    }
}

// Export for use in other scripts
window.VirtualNewsList = VirtualNewsList;
