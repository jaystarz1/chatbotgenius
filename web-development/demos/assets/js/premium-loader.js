/**
 * Premium Loader System
 * Handles loading animations, lazy loading, and page transitions
 */

class PremiumLoader {
    constructor() {
        this.init();
    }

    init() {
        // Add loading overlay to body
        this.createLoadingOverlay();
        
        // Initialize page transitions
        this.initPageTransitions();
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Initialize smooth reveal animations
        this.initRevealAnimations();
        
        // Handle page load
        window.addEventListener('load', () => {
            this.hideLoader();
            this.startPageAnimations();
        });
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'premium-loader-overlay';
        overlay.innerHTML = `
            <div class="premium-loader">
                <div class="loader-logo">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="35" stroke="url(#gradient)" stroke-width="4" fill="none" stroke-linecap="round">
                            <animate attributeName="stroke-dasharray" from="0 220" to="220 220" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#667eea"/>
                                <stop offset="100%" stop-color="#764ba2"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="loader-text">Loading Experience...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .premium-loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.6s ease, visibility 0.6s ease;
            }

            .premium-loader-overlay.hide {
                opacity: 0;
                visibility: hidden;
            }

            .premium-loader {
                text-align: center;
            }

            .loader-logo {
                margin-bottom: 1rem;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .loader-text {
                font-size: 1.1rem;
                color: #667eea;
                font-weight: 500;
                letter-spacing: 2px;
                text-transform: uppercase;
                opacity: 0.8;
                animation: fadeInOut 2s ease-in-out infinite;
            }

            @keyframes fadeInOut {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    hideLoader() {
        setTimeout(() => {
            const overlay = document.querySelector('.premium-loader-overlay');
            if (overlay) {
                overlay.classList.add('hide');
                setTimeout(() => overlay.remove(), 600);
            }
        }, 800);
    }

    initPageTransitions() {
        // Add smooth transitions for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.includes(window.location.host) && !link.href.includes('#')) {
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });
    }

    transitionToPage(url) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 99999;
            transform: translateX(-100%);
            transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1);
        `;
        document.body.appendChild(transition);

        setTimeout(() => {
            transition.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
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

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
        };
        tempImg.src = src;
    }

    initRevealAnimations() {
        const elements = document.querySelectorAll('[data-reveal]');
        
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = element.dataset.revealDelay || 0;
                        
                        setTimeout(() => {
                            element.classList.add('revealed');
                        }, delay * 100);
                        
                        revealObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            });

            elements.forEach(element => {
                element.classList.add('reveal-element');
                revealObserver.observe(element);
            });
        }

        // Add reveal styles
        const style = document.createElement('style');
        style.textContent = `
            .reveal-element {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s cubic-bezier(0.23, 1, 0.320, 1), 
                            transform 0.8s cubic-bezier(0.23, 1, 0.320, 1);
            }

            .reveal-element.revealed {
                opacity: 1;
                transform: translateY(0);
            }

            [data-reveal="fade-left"] {
                transform: translateX(30px);
            }

            [data-reveal="fade-right"] {
                transform: translateX(-30px);
            }

            [data-reveal="scale"] {
                transform: scale(0.9);
            }

            [data-reveal="fade-left"].revealed,
            [data-reveal="fade-right"].revealed {
                transform: translateX(0);
            }

            [data-reveal="scale"].revealed {
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    startPageAnimations() {
        // Animate hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'scale(1.05)';
            hero.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'scale(1)';
            }, 100);
        }

        // Stagger animations for sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (!section.classList.contains('hero')) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 200 + (index * 100));
            }
        });

        // Animate buttons with ripple effect on hover
        const buttons = document.querySelectorAll('.btn-luxury, .btn-primary');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Preload critical assets
    preloadAssets(assets) {
        assets.forEach(asset => {
            if (asset.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = asset;
                document.head.appendChild(link);
            } else if (asset.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
                const img = new Image();
                img.src = asset;
            }
        });
    }

    // Show notification toast
    showNotification(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-premium toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${type === 'success' ? '✓' : '✕'}
            </div>
            <div class="toast-content">
                <h4>${type === 'success' ? 'Success!' : 'Error'}</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumLoader = new PremiumLoader();
    });
} else {
    window.premiumLoader = new PremiumLoader();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumLoader;
}