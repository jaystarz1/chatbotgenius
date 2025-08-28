/**
 * Micro Interactions Library
 * Adds delightful micro-interactions and animations throughout the site
 */

class MicroInteractions {
    constructor() {
        this.init();
        this.mousePosition = { x: 0, y: 0 };
        this.particlesEnabled = true;
    }

    init() {
        // Initialize all micro-interactions
        this.initCursorEffects();
        this.initHoverEffects();
        this.initScrollEffects();
        this.initClickEffects();
        this.initTextEffects();
        this.initFormInteractions();
        this.initImageEffects();
        this.initCounterAnimations();
        this.initParallaxEffects();
        this.initMagneticButtons();
    }

    // Custom cursor with trail effect
    initCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorTrail);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                width: 20px;
                height: 20px;
                border: 2px solid #667eea;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                transition: transform 0.1s ease, opacity 0.3s ease;
                mix-blend-mode: difference;
            }

            .cursor-trail {
                width: 8px;
                height: 8px;
                background: #764ba2;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            .custom-cursor.hover {
                transform: scale(2);
                background: rgba(102, 126, 234, 0.1);
                border-color: #764ba2;
            }

            @media (max-width: 768px) {
                .custom-cursor, .cursor-trail {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.clientX, y: e.clientY };
            
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            
            setTimeout(() => {
                cursorTrail.style.left = e.clientX - 4 + 'px';
                cursorTrail.style.top = e.clientY - 4 + 'px';
            }, 50);
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .card, .gallery-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Enhanced hover effects
    initHoverEffects() {
        // 3D card tilt effect
        const cards = document.querySelectorAll('.premium-card, .pricing-card, .testimonial-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Button glow effect
        const buttons = document.querySelectorAll('.btn-luxury, .btn-primary');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--glow-x', `${x}px`);
                button.style.setProperty('--glow-y', `${y}px`);
            });
        });
    }

    // Smooth scroll effects
    initScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Parallax for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
            }
            
            // Fade in elements on scroll
            const fadeElements = document.querySelectorAll('[data-fade-in]:not(.faded)');
            fadeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    el.classList.add('faded');
                    el.style.animation = 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.320, 1) forwards';
                }
            });
            
            // Progress bar
            const progress = (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.updateProgressBar(progress);
            
            lastScrollTop = scrollTop;
        });
    }

    updateProgressBar(progress) {
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                z-index: 10000;
                transition: width 0.3s ease;
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = progress + '%';
    }

    // Click ripple effects
    initClickEffects() {
        document.addEventListener('click', (e) => {
            // Create particle explosion on click
            if (this.particlesEnabled && !e.target.closest('input, textarea, select')) {
                this.createParticles(e.clientX, e.clientY);
            }
            
            // Ripple effect for buttons
            const button = e.target.closest('.btn-luxury, .btn-primary, .premium-card');
            if (button) {
                this.createRipple(button, e);
            }
        });
    }

    createParticles(x, y) {
        const particleCount = 12;
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            
            const angle = (360 / particleCount) * i;
            const velocity = 50 + Math.random() * 50;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9999;
                animation: particle-explode 0.6s ease-out forwards;
                --angle: ${angle}deg;
                --velocity: ${velocity}px;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
        
        // Add animation if not exists
        if (!document.querySelector('#particle-animation')) {
            const style = document.createElement('style');
            style.id = 'particle-animation';
            style.textContent = `
                @keyframes particle-explode {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(cos(var(--angle)) * var(--velocity)),
                            calc(sin(var(--angle)) * var(--velocity))
                        ) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createRipple(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Text animation effects
    initTextEffects() {
        // Typewriter effect for headings
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        typewriterElements.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            el.style.minHeight = el.offsetHeight + 'px';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    el.textContent += text[index];
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        });
        
        // Glitch effect on hover
        const glitchElements = document.querySelectorAll('[data-glitch]');
        glitchElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'glitch 0.3s infinite';
            });
            el.addEventListener('mouseleave', () => {
                el.style.animation = 'none';
            });
        });
    }

    // Form field animations
    initFormInteractions() {
        const formInputs = document.querySelectorAll('.form-input-premium, input, textarea');
        
        formInputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Character count animation
            if (input.tagName === 'TEXTAREA') {
                const counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.textContent = '0 / 500';
                input.parentElement.appendChild(counter);
                
                input.addEventListener('input', () => {
                    counter.textContent = `${input.value.length} / 500`;
                    counter.style.color = input.value.length > 450 ? '#f5576c' : '#667eea';
                });
            }
        });
    }

    // Image hover effects
    initImageEffects() {
        const images = document.querySelectorAll('.gallery-item img, .image-hover');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.filter = 'brightness(1.1) contrast(1.05)';
                img.style.transform = 'scale(1.05)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.filter = 'brightness(1) contrast(1)';
                img.style.transform = 'scale(1)';
            });
        });
    }

    // Animated counters
    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    
                    this.animateCounter(counter, target, duration);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element, target, duration) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Parallax scrolling effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Magnetic button effect
    initMagneticButtons() {
        const magneticElements = document.querySelectorAll('.btn-luxury, .magnetic');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Toggle particle effects
    toggleParticles() {
        this.particlesEnabled = !this.particlesEnabled;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.microInteractions = new MicroInteractions();
    });
} else {
    window.microInteractions = new MicroInteractions();
}

// Add required styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes glitch {
        0%, 100% {
            text-shadow: 0 0 2px #667eea, 0 0 4px #764ba2;
            transform: translate(0);
        }
        20% {
            text-shadow: 2px 0 2px #f093fb, -2px 0 2px #f5576c;
            transform: translate(2px, -2px);
        }
        40% {
            text-shadow: -2px 0 2px #667eea, 2px 0 2px #764ba2;
            transform: translate(-2px, 2px);
        }
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .char-counter {
        position: absolute;
        bottom: -20px;
        right: 0;
        font-size: 0.85rem;
        color: #667eea;
        transition: color 0.3s ease;
    }

    * {
        cursor: none !important;
    }

    @media (max-width: 768px) {
        * {
            cursor: auto !important;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MicroInteractions;
}