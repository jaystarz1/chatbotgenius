/**
 * Gallery Module - Photo gallery functionality for event pages
 * Provides lightbox, lazy loading, and accessibility features
 */

(function() {
    'use strict';

    // Gallery configuration
    const config = {
        lazyLoadOffset: 50,
        animationDuration: 300,
        swipeThreshold: 50
    };

    // State management
    let currentImageIndex = 0;
    let galleryImages = [];
    let lightboxOpen = false;

    /**
     * Initialize gallery functionality
     */
    function initGallery() {
        setupGalleryItems();
        setupLazyLoading();
        setupKeyboardNavigation();
        setupTouchSupport();
    }

    /**
     * Setup gallery items with click handlers
     */
    function setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item img, .photo-grid img');
        
        if (galleryItems.length === 0) return;

        galleryItems.forEach((img, index) => {
            // Store images for lightbox navigation
            galleryImages.push({
                src: img.src,
                alt: img.alt || 'Gallery image'
            });

            // Add click handler for lightbox
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));
            
            // Add keyboard accessibility
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `Open ${img.alt || 'image'} in fullscreen`);
            
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
    }

    /**
     * Open lightbox with specific image
     */
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxOpen = true;

        // Create lightbox if it doesn't exist
        let lightbox = document.getElementById('galleryLightbox');
        if (!lightbox) {
            lightbox = createLightbox();
        }

        // Update image
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        img.src = galleryImages[index].src;
        img.alt = galleryImages[index].alt;
        caption.textContent = galleryImages[index].alt;

        // Show lightbox
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);

        // Trap focus
        lightbox.focus();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Create lightbox element
     */
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image viewer');
        lightbox.setAttribute('tabindex', '-1');
        
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close image viewer">&times;</button>
            <button class="lightbox-prev" aria-label="Previous image">‹</button>
            <button class="lightbox-next" aria-label="Next image">›</button>
            <div class="lightbox-content">
                <img class="lightbox-image" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .gallery-lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .gallery-lightbox.active {
                opacity: 1;
            }
            
            .lightbox-content {
                max-width: 90%;
                max-height: 90%;
                text-align: center;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
            }
            
            .lightbox-caption {
                color: white;
                margin-top: 1rem;
                font-size: 1rem;
            }
            
            .lightbox-close,
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid white;
                color: white;
                font-size: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .lightbox-close {
                top: 20px;
                right: 20px;
            }
            
            .lightbox-prev {
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .lightbox-next {
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .lightbox-close:hover,
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .lightbox-prev:hover,
            .lightbox-next:hover {
                transform: translateY(-50%) scale(1.1);
            }
            
            @media (max-width: 768px) {
                .lightbox-prev,
                .lightbox-next {
                    width: 40px;
                    height: 40px;
                    font-size: 1.5rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(lightbox);

        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
        
        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        return lightbox;
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        }
        
        lightboxOpen = false;
        document.body.style.overflow = '';
    }

    /**
     * Navigate lightbox images
     */
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        openLightbox(currentImageIndex);
    }

    /**
     * Setup lazy loading for gallery images
     */
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: `${config.lazyLoadOffset}px`
            });

            document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!lightboxOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        });
    }

    /**
     * Setup touch support for mobile
     */
    function setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            if (!lightboxOpen) return;
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (!lightboxOpen) return;
            touchEndX = e.changedTouches[0].clientX;
            
            const swipeDistance = touchStartX - touchEndX;
            
            if (Math.abs(swipeDistance) > config.swipeThreshold) {
                if (swipeDistance > 0) {
                    navigateLightbox(1); // Swipe left = next
                } else {
                    navigateLightbox(-1); // Swipe right = previous
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    // Export for use in other modules
    window.GalleryModule = {
        init: initGallery,
        open: openLightbox,
        close: closeLightbox
    };

})();