/* =================================================================
   ACCESSIBILITY.JS - Core Accessibility Features
   
   This module provides:
   - Focus management
   - Keyboard navigation handlers
   - ARIA live regions
   - Skip link functionality
   - Focus trap for modals
   ================================================================= */

(function() {
    'use strict';

    /* =================================================================
       FOCUS MANAGEMENT
       ================================================================= */
    
    // Track the last focused element before modal opens
    let lastFocusedElement = null;
    
    // Get all focusable elements within a container
    function getFocusableElements(container) {
        const elements = container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"]), [contenteditable]'
        );
        return Array.from(elements).filter(el => {
            // Filter out invisible elements
            return el.offsetParent !== null && 
                   getComputedStyle(el).visibility !== 'hidden';
        });
    }
    
    // Focus trap for modals and dropdowns
    function createFocusTrap(container) {
        const focusableElements = getFocusableElements(container);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        // Store the currently focused element
        lastFocusedElement = document.activeElement;
        
        // Focus the first element
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Handle tab key
        function handleTab(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Handle escape key
        function handleEscape(e) {
            if (e.key === 'Escape') {
                releaseFocusTrap();
                // Close the modal/dropdown
                if (container.classList.contains('modal')) {
                    container.classList.remove('active');
                } else if (container.classList.contains('dropdown-menu')) {
                    container.classList.remove('show');
                }
            }
        }
        
        // Add event listeners
        container.addEventListener('keydown', handleTab);
        container.addEventListener('keydown', handleEscape);
        
        // Clean up function
        function releaseFocusTrap() {
            container.removeEventListener('keydown', handleTab);
            container.removeEventListener('keydown', handleEscape);
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
        
        return releaseFocusTrap;
    }
    
    /* =================================================================
       KEYBOARD NAVIGATION
       ================================================================= */
    
    // Add arrow key navigation for menus
    function enableArrowKeyNavigation(menu) {
        const items = menu.querySelectorAll('a, button');
        let currentIndex = -1;
        
        menu.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                items[currentIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                items[currentIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                currentIndex = 0;
                items[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                currentIndex = items.length - 1;
                items[currentIndex].focus();
            }
        });
    }
    
    // Enable keyboard navigation for all nav menus
    document.addEventListener('DOMContentLoaded', function() {
        // Navigation menus
        const navMenus = document.querySelectorAll('.nav-menu, .nav-links');
        navMenus.forEach(menu => enableArrowKeyNavigation(menu));
        
        // Share menu
        const shareMenu = document.getElementById('shareMenu');
        if (shareMenu) {
            enableArrowKeyNavigation(shareMenu);
        }
        
        // Dropdown menus
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(menu => enableArrowKeyNavigation(menu));
    });
    
    /* =================================================================
       SKIP LINKS
       ================================================================= */
    
    // Make skip links work properly
    document.addEventListener('DOMContentLoaded', function() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.tabIndex = -1;
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });
    
    /* =================================================================
       ARIA LIVE REGIONS
       ================================================================= */
    
    // Create an ARIA live region for announcements
    let liveRegion = null;
    
    function createLiveRegion() {
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        return liveRegion;
    }
    
    // Announce message to screen readers
    function announce(message, priority = 'polite') {
        const region = createLiveRegion();
        region.setAttribute('aria-live', priority);
        region.textContent = message;
        
        // Clear the message after announcement
        setTimeout(() => {
            region.textContent = '';
        }, 1000);
    }
    
    /* =================================================================
       MODAL ACCESSIBILITY
       ================================================================= */
    
    // Setup modal accessibility
    function setupModal(modal) {
        // Add ARIA attributes
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Find the close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.setAttribute('aria-label', 'Close dialog');
        }
        
        // Create focus trap when modal opens
        let releaseTrap = null;
        
        // Watch for modal activation
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        // Modal opened
                        releaseTrap = createFocusTrap(modal);
                        document.body.style.overflow = 'hidden';
                    } else if (releaseTrap) {
                        // Modal closed
                        releaseTrap();
                        releaseTrap = null;
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }
    
    // Setup all modals on page load
    document.addEventListener('DOMContentLoaded', function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(setupModal);
    });
    
    /* =================================================================
       FORM ACCESSIBILITY
       ================================================================= */
    
    // Enhanced form validation with ARIA
    function setupFormAccessibility(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add aria-required for required fields
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Add aria-invalid for validation
            input.addEventListener('blur', function() {
                if (!this.checkValidity()) {
                    this.setAttribute('aria-invalid', 'true');
                    // Find or create error message
                    let errorId = this.id + '-error';
                    let errorMsg = document.getElementById(errorId);
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.id = errorId;
                        errorMsg.className = 'form-error';
                        this.parentNode.appendChild(errorMsg);
                    }
                    errorMsg.textContent = this.validationMessage;
                    this.setAttribute('aria-describedby', errorId);
                } else {
                    this.setAttribute('aria-invalid', 'false');
                    let errorId = this.id + '-error';
                    let errorMsg = document.getElementById(errorId);
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                    this.removeAttribute('aria-describedby');
                }
            });
        });
        
        // Announce form submission results
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check validity
            if (form.checkValidity()) {
                announce('Form submitted successfully');
            } else {
                announce('Please correct the errors in the form', 'assertive');
                // Focus first invalid field
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }
    
    // Setup all forms on page load
    document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('.event-form, .rsvp-form');
        forms.forEach(setupFormAccessibility);
    });
    
    /* =================================================================
       DROPDOWN ACCESSIBILITY
       ================================================================= */
    
    function setupDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        // Add ARIA attributes
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('role', 'menu');
        
        // Handle toggle click
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = menu.classList.contains('show');
            
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });
        
        // Handle keyboard events
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                openDropdown();
                // Focus first menu item
                const firstItem = menu.querySelector('a, button');
                if (firstItem) firstItem.focus();
            }
        });
        
        function openDropdown() {
            menu.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
            createFocusTrap(menu);
        }
        
        function closeDropdown() {
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
        
        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }
    
    // Setup all dropdowns on page load
    document.addEventListener('DOMContentLoaded', function() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(setupDropdown);
    });
    
    /* =================================================================
       COUNTDOWN TIMER ACCESSIBILITY
       ================================================================= */
    
    function makeCountdownAccessible() {
        const countdown = document.querySelector('.countdown');
        if (!countdown) return;
        
        // Add ARIA label
        countdown.setAttribute('aria-label', 'Countdown to event');
        countdown.setAttribute('aria-live', 'polite');
        
        // Announce time remaining periodically
        let lastAnnouncement = '';
        setInterval(function() {
            const days = document.getElementById('countdown-days');
            const hours = document.getElementById('countdown-hours');
            if (days && hours) {
                const announcement = `${days.textContent} days and ${hours.textContent} hours remaining`;
                if (announcement !== lastAnnouncement) {
                    lastAnnouncement = announcement;
                    // Only announce significant changes
                    if (parseInt(hours.textContent) === 0) {
                        announce(announcement);
                    }
                }
            }
        }, 3600000); // Every hour
    }
    
    document.addEventListener('DOMContentLoaded', makeCountdownAccessible);
    
    /* =================================================================
       EXPORT PUBLIC API
       ================================================================= */
    
    window.AccessibilityUtils = {
        createFocusTrap: createFocusTrap,
        getFocusableElements: getFocusableElements,
        announce: announce,
        enableArrowKeyNavigation: enableArrowKeyNavigation,
        setupModal: setupModal,
        setupFormAccessibility: setupFormAccessibility,
        setupDropdown: setupDropdown
    };

})();