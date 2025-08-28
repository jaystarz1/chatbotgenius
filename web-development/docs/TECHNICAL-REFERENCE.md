# Technical Reference - CSS/JS Patterns & Components

## CSS Architecture

### Color System
```css
/* Base color variables - ALWAYS define these */
:root {
  /* Primary Palette */
  --primary: #4c5fd5;      /* Main brand color */
  --primary-dark: #1a1f71;  /* Darker variant */
  --primary-light: #6BA3D9; /* Lighter variant */
  
  /* Accent Colors */
  --accent: #f9c74f;        /* Call-to-action */
  --accent-hover: #f39c12;  /* Hover state */
  
  /* Neutrals */
  --text-dark: #333333;
  --text-light: #666666;
  --bg-light: #f8f9fa;
  --white: #ffffff;
  
  /* Semantic Colors */
  --success: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --info: #17a2b8;
}
```

### Glassmorphism Effect
```css
/* Modern glass effect - looks premium as fuck */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

/* Dark glass variant */
.glass-dark {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradient Patterns
```css
/* Linear gradients */
.gradient-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

/* Multi-color gradient */
.gradient-sunset {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

/* Animated gradient */
.gradient-animated {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Animation Patterns

#### Fade In on Scroll
```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### Floating Elements
```css
.floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

#### Pulse Effect
```css
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### Particle Background
```css
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: particle-float 20s infinite linear;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}
```

### Responsive Grid System
```css
/* Fluid grid that doesn't suck on mobile */
.grid {
  display: grid;
  gap: 30px;
  padding: 20px;
}

/* Auto-fit with minimum size */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Fixed columns with responsive breakpoints */
.grid-responsive {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 968px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}
```

### Button Styles
```css
/* Base button */
.btn {
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;
}

/* Primary button with hover effect */
.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Ripple effect on click */
.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:active::before {
  width: 300px;
  height: 300px;
}
```

## JavaScript Modules

### Countdown Timer
```javascript
// Flexible countdown timer
function initCountdown(targetDate, options = {}) {
  const config = {
    daysId: options.daysId || 'days',
    hoursId: options.hoursId || 'hours',
    minutesId: options.minutesId || 'minutes',
    secondsId: options.secondsId || 'seconds',
    onComplete: options.onComplete || null,
    format: options.format || 'full' // 'full', 'days', 'hours'
  };
  
  const target = new Date(targetDate).getTime();
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = target - now;
    
    if (distance < 0) {
      if (config.onComplete) config.onComplete();
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM
    if (config.format === 'full') {
      document.getElementById(config.daysId).textContent = days.toString().padStart(2, '0');
      document.getElementById(config.hoursId).textContent = hours.toString().padStart(2, '0');
      document.getElementById(config.minutesId).textContent = minutes.toString().padStart(2, '0');
      document.getElementById(config.secondsId).textContent = seconds.toString().padStart(2, '0');
    }
  };
  
  updateTimer();
  return setInterval(updateTimer, 1000);
}
```

### Intersection Observer for Animations
```javascript
// Trigger animations when elements enter viewport
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-up');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initScrollAnimations);
```

### Smooth Scroll Navigation
```javascript
// Smooth scroll to sections
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed header
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
```

### Dynamic Particle System
```javascript
// Create animated particles
function createParticles(container, count = 50) {
  const particlesContainer = document.querySelector(container);
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }
}
```

### Form Validation
```javascript
// Client-side form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const errors = [];
    
    // Check required fields
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        errors.push(`${field.name} is required`);
      }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('[type="email"]');
    emailFields.forEach(field => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (field.value && !emailRegex.test(field.value)) {
        isValid = false;
        field.classList.add('error');
        errors.push('Invalid email address');
      }
    });
    
    if (isValid) {
      // Submit form or handle submission
      console.log('Form is valid');
      // form.submit();
    } else {
      // Show errors
      alert(errors.join('\n'));
    }
  });
}
```

### Local Storage Manager
```javascript
// Save and retrieve user preferences
const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// Example: Save theme preference
storage.set('theme', 'dark');
const theme = storage.get('theme'); // 'dark'
```

## Performance Optimizations

### Image Loading
```html
<!-- Lazy loading -->
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" alt="Description">

<!-- Responsive images -->
<picture>
  <source media="(max-width: 640px)" srcset="small.jpg">
  <source media="(max-width: 1024px)" srcset="medium.jpg">
  <img src="large.jpg" alt="Description">
</picture>
```

### CSS Performance
```css
/* Use transform for animations (GPU accelerated) */
.smooth-animation {
  transform: translateX(0);
  transition: transform 0.3s;
}

.smooth-animation:hover {
  transform: translateX(10px); /* Better than left: 10px */
}

/* Reduce repaints with will-change */
.will-animate {
  will-change: transform, opacity;
}

/* Use CSS containment */
.card {
  contain: layout style paint;
}
```

### JavaScript Performance
```javascript
// Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
window.addEventListener('resize', debounce(() => {
  console.log('Resized');
}, 250));

// Throttle for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

## Browser Compatibility

### CSS Fallbacks
```css
/* Backdrop filter fallback */
.glass {
  background: rgba(255, 255, 255, 0.95); /* Fallback */
  backdrop-filter: blur(20px); /* Modern browsers */
}

/* Grid fallback */
.grid {
  display: flex; /* Fallback */
  flex-wrap: wrap;
  display: grid; /* Modern browsers */
}

/* Custom properties fallback */
.button {
  background: #4c5fd5; /* Fallback */
  background: var(--primary, #4c5fd5);
}
```

### JavaScript Polyfills
```javascript
// IntersectionObserver polyfill check
if (!('IntersectionObserver' in window)) {
  // Load polyfill
  const script = document.createElement('script');
  script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
  document.head.appendChild(script);
}

// Smooth scroll polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
  // Load smooth scroll polyfill
}
```

## Common Patterns

### Hero Section with Video Background
```html
<section class="hero">
  <video autoplay muted loop class="hero-video">
    <source src="hero.mp4" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1>Title</h1>
  </div>
</section>
```

```css
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
```

### Sticky Navigation with Scroll Effect
```javascript
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add background on scroll
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Hide/show on scroll direction
  if (currentScroll > lastScroll && currentScroll > 500) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }
  
  lastScroll = currentScroll;
});
```

## Accessibility Guidelines

```css
/* Focus styles */
*:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

## Testing Checklist

### Performance
- [ ] PageSpeed Insights score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Total bundle size < 300KB

### Functionality
- [ ] All forms submit correctly
- [ ] Countdown timer accurate
- [ ] Animations smooth (60fps)
- [ ] Share buttons working
- [ ] Maps loading

### Cross-browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Samsung Internet

### Responsive
- [ ] 320px (minimum)
- [ ] 375px (iPhone SE)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)
- [ ] 1920px (full HD)

---
Last Updated: January 2025
Reference Version: 1.0