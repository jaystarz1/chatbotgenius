/* =================================================================
   SHARE-BUTTONS.JS - Social Sharing with Accessibility
   
   This module provides:
   - Accessible share menu toggle
   - Keyboard navigation support
   - Screen reader announcements
   - Multiple social platform support
   ================================================================= */

(function() {
    'use strict';

    // Track menu state
    let isMenuOpen = false;
    let shareToggle = null;
    let shareMenu = null;

    /* =================================================================
       INITIALIZATION
       ================================================================= */
    
    function initShareButtons() {
        shareToggle = document.querySelector('.share-toggle');
        shareMenu = document.getElementById('shareMenu');
        
        if (!shareToggle || !shareMenu) return;
        
        // Add ARIA attributes
        shareToggle.setAttribute('aria-expanded', 'false');
        shareToggle.setAttribute('aria-controls', 'shareMenu');
        shareToggle.setAttribute('aria-label', 'Share this page on social media');
        
        shareMenu.setAttribute('role', 'menu');
        shareMenu.setAttribute('aria-labelledby', 'share-toggle');
        
        // Add role to menu items
        const menuItems = shareMenu.querySelectorAll('.share-option');
        menuItems.forEach(item => {
            item.setAttribute('role', 'menuitem');
            item.setAttribute('tabindex', '-1');
        });
        
        // Setup event listeners
        setupEventListeners();
        
        // Enable keyboard navigation
        if (window.AccessibilityUtils && window.AccessibilityUtils.enableArrowKeyNavigation) {
            window.AccessibilityUtils.enableArrowKeyNavigation(shareMenu);
        }
    }
    
    /* =================================================================
       EVENT LISTENERS
       ================================================================= */
    
    function setupEventListeners() {
        // Toggle button click
        shareToggle.addEventListener('click', toggleShareMenu);
        
        // Keyboard events
        shareToggle.addEventListener('keydown', handleToggleKeydown);
        shareMenu.addEventListener('keydown', handleMenuKeydown);
        
        // Close menu when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Close menu on escape
        document.addEventListener('keydown', handleEscape);
    }
    
    /* =================================================================
       MENU TOGGLE
       ================================================================= */
    
    function toggleShareMenu(e) {
        if (e) e.stopPropagation();
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }
    
    function openMenu() {
        shareMenu.classList.add('active');
        shareToggle.setAttribute('aria-expanded', 'true');
        isMenuOpen = true;
        
        // Focus first menu item
        setTimeout(() => {
            const firstItem = shareMenu.querySelector('.share-option');
            if (firstItem) {
                firstItem.setAttribute('tabindex', '0');
                firstItem.focus();
            }
        }, 100);
        
        // Announce to screen readers
        announceToScreenReader('Share menu opened');
    }
    
    function closeMenu() {
        shareMenu.classList.remove('active');
        shareToggle.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
        
        // Reset tabindex
        const menuItems = shareMenu.querySelectorAll('.share-option');
        menuItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });
        
        // Return focus to toggle button
        shareToggle.focus();
        
        // Announce to screen readers
        announceToScreenReader('Share menu closed');
    }
    
    /* =================================================================
       KEYBOARD HANDLERS
       ================================================================= */
    
    function handleToggleKeydown(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggleShareMenu();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isMenuOpen) {
                    openMenu();
                }
                break;
        }
    }
    
    function handleMenuKeydown(e) {
        const menuItems = Array.from(shareMenu.querySelectorAll('.share-option'));
        const currentIndex = menuItems.indexOf(document.activeElement);
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeMenu();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % menuItems.length;
                menuItems[currentIndex]?.setAttribute('tabindex', '-1');
                menuItems[nextIndex].setAttribute('tabindex', '0');
                menuItems[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
                menuItems[currentIndex]?.setAttribute('tabindex', '-1');
                menuItems[prevIndex].setAttribute('tabindex', '0');
                menuItems[prevIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                menuItems[currentIndex]?.setAttribute('tabindex', '-1');
                menuItems[0].setAttribute('tabindex', '0');
                menuItems[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                menuItems[currentIndex]?.setAttribute('tabindex', '-1');
                menuItems[menuItems.length - 1].setAttribute('tabindex', '0');
                menuItems[menuItems.length - 1].focus();
                break;
        }
    }
    
    function handleOutsideClick(e) {
        const shareButtons = document.querySelector('.share-buttons, .wedding-share-buttons');
        if (shareButtons && !shareButtons.contains(e.target) && isMenuOpen) {
            closeMenu();
        }
    }
    
    function handleEscape(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    }
    
    /* =================================================================
       SHARE FUNCTIONS
       ================================================================= */
    
    window.shareOnFacebook = function(event) {
        event.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            'facebook-share',
            'width=600,height=400,toolbar=no,menubar=no'
        );
        closeMenu();
        announceToScreenReader('Shared on Facebook');
    };
    
    window.shareOnTwitter = function(event) {
        event.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(
            `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            'twitter-share',
            'width=600,height=400,toolbar=no,menubar=no'
        );
        closeMenu();
        announceToScreenReader('Shared on Twitter');
    };
    
    // Alias for X (formerly Twitter)
    window.shareOnX = window.shareOnTwitter;
    
    window.shareOnWhatsApp = function(event) {
        event.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        const shareUrl = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? `whatsapp://send?text=${text}%20${url}`
            : `https://web.whatsapp.com/send?text=${text}%20${url}`;
        window.open(shareUrl, '_blank');
        closeMenu();
        announceToScreenReader('Shared on WhatsApp');
    };
    
    window.shareOnLinkedIn = function(event) {
        event.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            'linkedin-share',
            'width=600,height=400,toolbar=no,menubar=no'
        );
        closeMenu();
        announceToScreenReader('Shared on LinkedIn');
    };
    
    window.shareViaEmail = function(event) {
        event.preventDefault();
        const subject = encodeURIComponent(document.title);
        const body = encodeURIComponent(
            `I thought you might be interested in this:\n\n${document.title}\n${window.location.href}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        closeMenu();
        announceToScreenReader('Email client opened');
    };
    
    window.copyLink = function(event) {
        event.preventDefault();
        
        // Use modern clipboard API with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href).then(function() {
                handleCopySuccess(event.currentTarget);
            }).catch(function() {
                fallbackCopyToClipboard();
            });
        } else {
            fallbackCopyToClipboard();
        }
    };
    
    function handleCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg class="share-icon" viewBox="0 0 24 24" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span>Copied!</span>';
        button.style.color = '#27ae60';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
            closeMenu();
        }, 2000);
        
        announceToScreenReader('Link copied to clipboard');
    }
    
    function fallbackCopyToClipboard() {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            announceToScreenReader('Link copied to clipboard');
        } catch (err) {
            announceToScreenReader('Unable to copy link');
        }
        
        document.body.removeChild(textArea);
        closeMenu();
    }
    
    /* =================================================================
       ACCESSIBILITY HELPERS
       ================================================================= */
    
    function announceToScreenReader(message) {
        // Use AccessibilityUtils if available
        if (window.AccessibilityUtils && window.AccessibilityUtils.announce) {
            window.AccessibilityUtils.announce(message);
        } else {
            // Fallback announcement
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }
    
    /* =================================================================
       PUBLIC API
       ================================================================= */
    
    window.toggleShareMenu = toggleShareMenu;
    
    window.ShareButtons = {
        init: initShareButtons,
        open: openMenu,
        close: closeMenu,
        toggle: toggleShareMenu
    };
    
    /* =================================================================
       AUTO-INITIALIZATION
       ================================================================= */
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShareButtons);
    } else {
        initShareButtons();
    }

})();