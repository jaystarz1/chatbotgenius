/* =================================================================
   LUXURY-ANIMATIONS.JS - Premium Animation Library
   ================================================================= */

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
            offset: 100
        });
    }
});

// Luxury Loading Screen
class LuxuryLoader {
    constructor() {
        this.loader = null;
        this.init();
    }

    init() {
        // Create loader HTML
        const loaderHTML = `
            <div class="luxury-loader" id="luxuryLoader">
                <div class="loader-content">
                    <div class="loader-icon"></div>
                    <h3 style="font-family: 'Playfair Display', serif; font-weight: 400; color: #333;">
                        Preparing Your Experience
                    </h3>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        this.loader = document.getElementById('luxuryLoader');
        
        // Hide loader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoader();
            }, 800);
        });
    }

    hideLoader() {
        if (this.loader) {
            this.loader.classList.add('loaded');
            setTimeout(() => {
                this.loader.remove();
            }, 800);
        }
    }
}

// Parallax Scrolling Effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-bg');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
        
        this.updateParallax();
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Reveal on Scroll
class RevealOnScroll {
    constructor() {
        this.reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.init();
    }

    init() {
        if (this.reveals.length === 0) return;
        
        // Initial check
        this.checkReveals();
        
        // Check on scroll
        window.addEventListener('scroll', () => {
            this.checkReveals();
        });
    }

    checkReveals() {
        this.reveals.forEach(element => {
            if (this.isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;
        
        this.counters.forEach(counter => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter);
                        observer.unobserve(counter);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = +counter.getAttribute('data-duration') || 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }
}

// Rose Petals Animation (for Wedding)
class RosePetals {
    constructor() {
        this.container = document.querySelector('.rose-petals');
        if (!this.container) return;
        
        this.createPetals();
    }

    createPetals() {
        const petalCount = 15;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDelay = Math.random() * 10 + 's';
            petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
            petal.style.opacity = Math.random() * 0.5 + 0.3;
            
            this.container.appendChild(petal);
        }
    }
}

// Smooth Scroll with Offset
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Navigation height
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Magnetic Buttons
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-luxury, .wedding-form-submit');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// Text Splitting for Animation
class TextSplitter {
    constructor() {
        this.elements = document.querySelectorAll('.split-text');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('char');
                element.appendChild(span);
            });
        });
    }
}

// Cursor Trail Effect (optional luxury feature)
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        // Only on desktop
        if (window.innerWidth < 768) return;
        
        for (let i = 0; i < this.maxTrailLength; i++) {
            const dot = document.createElement('div');
            dot.classList.add('cursor-trail-dot');
            dot.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(212, 175, 55, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s, opacity 0.3s;
            `;
            document.body.appendChild(dot);
            this.trail.push(dot);
        }

        document.addEventListener('mousemove', (e) => {
            this.trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.left = e.clientX + 'px';
                    dot.style.top = e.clientY + 'px';
                    dot.style.opacity = 1 - (index / this.maxTrailLength);
                    dot.style.transform = `scale(${1 - (index / this.maxTrailLength)})`;
                }, index * 5);
            });
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    // Core animations
    new LuxuryLoader();
    new ParallaxEffect();
    new RevealOnScroll();
    new CounterAnimation();
    new SmoothScroll();
    new MagneticButtons();
    new TextSplitter();
    
    // Page-specific animations
    if (document.querySelector('.rose-petals')) {
        new RosePetals();
    }
    
    // Optional luxury cursor (can be toggled)
    if (document.body.classList.contains('luxury-cursor')) {
        new CursorTrail();
    }
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
});

// GSAP Animations (if GSAP is loaded)
if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero text animation
    gsap.timeline()
        .from('.wedding-names', {
            opacity: 0,
            y: 50,
            duration: 1.5,
            ease: 'power3.out'
        })
        .from('.wedding-date', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, '-=1')
        .from('.wedding-location', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.wedding-countdown-item', {
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.5');
    
    // Scroll-triggered animations
    gsap.utils.toArray('.wedding-detail-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}