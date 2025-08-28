/* =================================================================
   NAVIGATION.JS - Navigation and Menu Management
   
   This module provides:
   - Mobile menu toggle functionality
   - Keyboard navigation for menus
   - Smooth scroll for anchor links
   - Active section highlighting
   - Responsive navigation management
   ================================================================= */

(function() {
    'use strict';

    /* =================================================================
       MOBILE NAVIGATION
       ================================================================= */
    
    function initMobileNav() {
        // Find all navigation toggles
        const navToggles = document.querySelectorAll('.nav-toggle, .nav-mobile-toggle');
        const navMenus = document.querySelectorAll('.nav-menu, .nav-links');
        
        navToggles.forEach((toggle, index) => {
            const menu = navMenus[index];
            if (!menu) return;
            
            // Handle toggle click
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle active states
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
                
                // Update ARIA
                const isOpen = menu.classList.contains('active');
                toggle.setAttribute('aria-expanded', isOpen);
                
                // Manage body scroll
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                    // Focus first menu item
                    const firstLink = menu.querySelector('a');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Add ARIA attributes
            toggle.setAttribute('aria-label', 'Toggle navigation menu');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', menu.id || 'navigation-menu');
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navToggles.forEach(toggle => {
                    if (toggle.classList.contains('active')) {
                        toggle.click();
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            navMenus.forEach((menu, index) => {
                if (menu.classList.contains('active')) {
                    const toggle = navToggles[index];
                    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                        toggle.click();
                    }
                }
            });
        });
        
        // Close menu when clicking on a link (for single-page navigation)
        navMenus.forEach(menu => {
            const links = menu.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function() {
                    // Find associated toggle and close menu
                    navToggles.forEach(toggle => {
                        if (toggle.classList.contains('active')) {
                            toggle.click();
                        }
                    });
                });
            });
        });
    }
    
    /* =================================================================
       SMOOTH SCROLL
       ================================================================= */
    
    function initSmoothScroll() {
        // Handle all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignore if just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                // Calculate offset for sticky nav
                const nav = document.querySelector('.elegant-nav, .nav-primary');
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL
                history.pushState(null, null, href);
                
                // Move focus to target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
                
                // Announce to screen readers
                if (window.AccessibilityUtils && window.AccessibilityUtils.announce) {
                    window.AccessibilityUtils.announce(`Navigated to ${target.id || 'section'}`);
                }
            });
        });
    }
    
    /* =================================================================
       ACTIVE SECTION HIGHLIGHTING
       ================================================================= */
    
    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-menu a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        // Get nav height for offset
        const nav = document.querySelector('.elegant-nav, .nav-primary');
        const navHeight = nav ? nav.offsetHeight : 0;
        
        function updateActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionHeight = section.offsetHeight;
                const scrollY = window.scrollY;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Update active classes
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }
        
        // Throttle scroll event
        let scrollTimer;
        window.addEventListener('scroll', function() {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(updateActiveLink, 50);
        });
        
        // Initial check
        updateActiveLink();
    }
    
    /* =================================================================
       STICKY NAVIGATION
       ================================================================= */
    
    function initStickyNav() {
        const nav = document.querySelector('.elegant-nav, .nav-primary');
        if (!nav) return;
        
        // Some navs are already position: sticky in CSS
        // This is for navs that need JS-based sticky behavior
        if (getComputedStyle(nav).position === 'sticky') return;
        
        const navTop = nav.offsetTop;
        let lastScrollY = 0;
        let ticking = false;
        
        function updateNav() {
            const scrollY = window.scrollY;
            
            if (scrollY > navTop) {
                nav.classList.add('sticky');
                document.body.style.paddingTop = nav.offsetHeight + 'px';
            } else {
                nav.classList.remove('sticky');
                document.body.style.paddingTop = '';
            }
            
            // Hide/show nav on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                // Scrolling down
                nav.classList.add('nav-hidden');
            } else {
                // Scrolling up
                nav.classList.remove('nav-hidden');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    /* =================================================================
       KEYBOARD NAVIGATION
       ================================================================= */
    
    function initKeyboardNav() {
        const navMenus = document.querySelectorAll('.nav-menu, .nav-links');
        
        navMenus.forEach(menu => {
            const links = menu.querySelectorAll('a');
            
            // Add tabindex for better keyboard control
            links.forEach((link, index) => {
                link.setAttribute('tabindex', '0');
                
                // Arrow key navigation
                link.addEventListener('keydown', function(e) {
                    let nextIndex;
                    
                    switch(e.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                            e.preventDefault();
                            nextIndex = (index + 1) % links.length;
                            links[nextIndex].focus();
                            break;
                            
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            e.preventDefault();
                            nextIndex = index === 0 ? links.length - 1 : index - 1;
                            links[nextIndex].focus();
                            break;
                            
                        case 'Home':
                            e.preventDefault();
                            links[0].focus();
                            break;
                            
                        case 'End':
                            e.preventDefault();
                            links[links.length - 1].focus();
                            break;
                    }
                });
            });
        });
    }
    
    /* =================================================================
       BREADCRUMB NAVIGATION
       ================================================================= */
    
    function initBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return;
        
        // Add ARIA attributes
        breadcrumbs.setAttribute('role', 'navigation');
        breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
        
        // Mark current page
        const currentPage = breadcrumbs.querySelector('li:last-child');
        if (currentPage) {
            currentPage.setAttribute('aria-current', 'page');
        }
    }
    
    /* =================================================================
       BACK TO TOP BUTTON
       ================================================================= */
    
    function initBackToTop() {
        // Create button if it doesn't exist
        let backToTop = document.querySelector('.back-to-top');
        if (!backToTop) {
            backToTop = document.createElement('button');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '<span aria-hidden="true">↑</span><span class="sr-only">Back to top</span>';
            backToTop.setAttribute('aria-label', 'Back to top');
            backToTop.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
                z-index: 9997;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            `;
            document.body.appendChild(backToTop);
        }
        
        // Show/hide based on scroll position
        function toggleBackToTop() {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        }
        
        // Throttle scroll event
        let scrollTimer;
        window.addEventListener('scroll', function() {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(toggleBackToTop, 50);
        });
        
        // Handle click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Move focus to top for accessibility
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            } else {
                document.body.setAttribute('tabindex', '-1');
                document.body.focus();
            }
        });
        
        // Initial check
        toggleBackToTop();
    }
    
    /* =================================================================
       RESPONSIVE HELPERS
       ================================================================= */
    
    function getBreakpoint() {
        const width = window.innerWidth;
        if (width < 480) return 'xs';
        if (width < 768) return 'sm';
        if (width < 1024) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    }
    
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    function isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    
    function isDesktop() {
        return window.innerWidth >= 1024;
    }
    
    /* =================================================================
       INITIALIZATION
       ================================================================= */
    
    function init() {
        initMobileNav();
        initSmoothScroll();
        initActiveSection();
        initStickyNav();
        initKeyboardNav();
        initBreadcrumbs();
        initBackToTop();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    /* =================================================================
       PUBLIC API
       ================================================================= */
    
    window.NavigationUtils = {
        init: init,
        initMobileNav: initMobileNav,
        initSmoothScroll: initSmoothScroll,
        initActiveSection: initActiveSection,
        initStickyNav: initStickyNav,
        initKeyboardNav: initKeyboardNav,
        initBackToTop: initBackToTop,
        getBreakpoint: getBreakpoint,
        isMobile: isMobile,
        isTablet: isTablet,
        isDesktop: isDesktop
    };

})();