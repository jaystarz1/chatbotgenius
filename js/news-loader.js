// News Loading States and Error Handling
// Provides skeleton loading and error states

class NewsLoader {
    constructor(container) {
        this.container = container;
    }
    
    // Show skeleton loading cards
    showSkeleton(count = 6) {
        const skeletons = Array(count).fill(0).map(() => `
            <div class="news-card news-skeleton">
                <div class="news-card-content">
                    <div class="skeleton-badge"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-title-short"></div>
                    <div class="skeleton-excerpt"></div>
                    <div class="skeleton-excerpt"></div>
                    <div class="skeleton-meta">
                        <div class="skeleton-source"></div>
                        <div class="skeleton-date"></div>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.container.innerHTML = `
            <div class="skeleton-container">
                ${skeletons}
            </div>
        `;
        
        // Add skeleton styles if not already present
        if (!document.querySelector('#skeleton-styles')) {
            const style = document.createElement('style');
            style.id = 'skeleton-styles';
            style.textContent = `
                .skeleton-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 30px;
                }
                
                .news-skeleton {
                    animation: none;
                }
                
                .skeleton-badge,
                .skeleton-title,
                .skeleton-title-short,
                .skeleton-excerpt,
                .skeleton-source,
                .skeleton-date {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s ease-in-out infinite;
                    border-radius: 4px;
                }
                
                .skeleton-badge {
                    height: 20px;
                    width: 80px;
                    margin-bottom: 15px;
                }
                
                .skeleton-title {
                    height: 24px;
                    width: 90%;
                    margin-bottom: 8px;
                }
                
                .skeleton-title-short {
                    height: 24px;
                    width: 60%;
                    margin-bottom: 20px;
                }
                
                .skeleton-excerpt {
                    height: 16px;
                    width: 100%;
                    margin-bottom: 8px;
                }
                
                .skeleton-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                }
                
                .skeleton-source {
                    height: 14px;
                    width: 120px;
                }
                
                .skeleton-date {
                    height: 14px;
                    width: 80px;
                }
                
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                @media (max-width: 768px) {
                    .skeleton-container {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Show error state with retry option
    showError(message, onRetry) {
        this.container.innerHTML = `
            <div class="news-error-state">
                <div class="error-icon">⚠️</div>
                <h3>Unable to Load News</h3>
                <p>${message || 'There was an error loading the latest AI news. Please try again.'}</p>
                <button class="btn btn-primary retry-button" id="retry-load">
                    <span class="retry-icon">↻</span> Retry
                </button>
                <p class="error-hint">You can also try refreshing the page or checking back later.</p>
            </div>
        `;
        
        // Add error styles if not already present
        if (!document.querySelector('#error-styles')) {
            const style = document.createElement('style');
            style.id = 'error-styles';
            style.textContent = `
                .news-error-state {
                    text-align: center;
                    padding: 80px 20px;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .error-icon {
                    font-size: 48px;
                    margin-bottom: 20px;
                }
                
                .news-error-state h3 {
                    color: #1a1f71;
                    font-size: 1.8rem;
                    margin-bottom: 15px;
                }
                
                .news-error-state p {
                    color: #666;
                    margin-bottom: 25px;
                    line-height: 1.6;
                }
                
                .retry-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.1rem;
                    padding: 15px 30px;
                }
                
                .retry-icon {
                    font-size: 1.2rem;
                    display: inline-block;
                    transition: transform 0.3s ease;
                }
                
                .retry-button:hover .retry-icon {
                    transform: rotate(360deg);
                }
                
                .error-hint {
                    font-size: 0.9rem;
                    color: #999;
                    margin-top: 20px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Attach retry handler
        document.getElementById('retry-load').addEventListener('click', onRetry);
    }
    
    // Show empty state when no items match filter
    showEmptyState(category) {
        this.container.innerHTML = `
            <div class="news-empty-state">
                <div class="empty-icon">📭</div>
                <h3>No News in "${category}" Category</h3>
                <p>There are no recent news items in this category. Try selecting a different category or check back later.</p>
                <button class="btn btn-primary" onclick="window.virtualNewsList && window.virtualNewsList.filterByCategory('all')">
                    Show All News
                </button>
            </div>
        `;
    }
    
    // Show success message briefly
    showSuccess(message) {
        const successEl = document.createElement('div');
        successEl.className = 'news-success-message';
        successEl.textContent = message;
        successEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successEl);
        
        setTimeout(() => {
            successEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => successEl.remove(), 300);
        }, 3000);
    }
}

// Export for use in other scripts
window.NewsLoader = NewsLoader;
