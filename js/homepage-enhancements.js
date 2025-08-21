// Homepage Enhancements JavaScript
// Extracted from index.html for better organization and maintainability

// Enhanced Blog Carousel Functionality
class BlogCarousel {
    constructor() {
        this.currentSlide = 0;
        this.posts = [];
        this.autoPlayInterval = null;
        this.slideDuration = 8000; // 8 seconds per slide
        
        this.init();
    }
    
    init() {
        // Sort posts by date (newest first)
        this.posts = blogPostsData.sort((a, b) => b.sortDate - a.sortDate);
        
        // Initialize carousel
        this.renderCarousel();
        this.setupEventListeners();
        
        // Check if animations are enabled
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (animationsEnabled) {
            this.startAutoPlay();
        }
    }
    
    renderCarousel() {
        const track = document.getElementById('carousel-track');
        const dotsContainer = document.getElementById('carousel-dots');
        
        if (!track || !dotsContainer) return;
        
        // Create slides (2 posts per slide, up to 6 posts total)
        const postsToShow = this.posts.slice(0, 6);
        const slides = [];
        
        for (let i = 0; i < postsToShow.length; i += 2) {
            const slidePosts = postsToShow.slice(i, i + 2);
            slides.push(slidePosts);
        }
        
        // Generate carousel HTML with cloned slides for infinite loop
        let carouselHTML = '';
        
        // Add last slide clone at the beginning
        if (slides.length > 0) {
            const lastSlide = slides[slides.length - 1];
            carouselHTML += `
                <div class="carousel-slide clone">
                    <div class="carousel-posts-grid">
                        ${lastSlide.map(post => this.createPostCard(post)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Add all regular slides
        slides.forEach((slidePosts, slideIndex) => {
            carouselHTML += `
                <div class="carousel-slide">
                    <div class="carousel-posts-grid">
                        ${slidePosts.map(post => this.createPostCard(post)).join('')}
                    </div>
                </div>
            `;
        });
        
        // Add first slide clone at the end
        if (slides.length > 0) {
            const firstSlide = slides[0];
            carouselHTML += `
                <div class="carousel-slide clone">
                    <div class="carousel-posts-grid">
                        ${firstSlide.map(post => this.createPostCard(post)).join('')}
                    </div>
                </div>
            `;
        }
        
        track.innerHTML = carouselHTML;
        
        // Start at position 1 (first real slide, not the clone)
        track.style.transform = 'translateX(-100%)';
        
        // Generate dots
        let dotsHTML = '';
        slides.forEach((_, index) => {
            dotsHTML += `
                <button class="carousel-dot ${index === 0 ? 'active' : ''}" 
                        data-slide="${index}" 
                        aria-label="Go to slide ${index + 1}"></button>
            `;
        });
        dotsContainer.innerHTML = dotsHTML;
        
        // Store total slides count
        this.totalSlides = slides.length;
        this.currentSlide = 0;
    }
    
    createPostCard(post) {
        // Check if post is new (within 48 hours)
        const isNew = this.isPostNew(post.sortDate);
        
        return `
            <article class="carousel-post-card" onclick="window.location.href='${post.url}'">
                <div class="post-image-container">
                    <img src="${post.image}" alt="${post.imageAlt || post.title}" class="post-image">
                    ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">
                            <span>📅</span> ${post.date}
                        </span>
                        <span class="reading-time">
                            <span>⏱️</span> ${post.readingTime || '5 min read'}
                        </span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="${post.url}" class="post-link" onclick="event.stopPropagation()">
                        Read More →
                    </a>
                </div>
                ${post.extendedExcerpt ? `
                    <div class="post-excerpt-extended">
                        ${post.extendedExcerpt}
                    </div>
                ` : ''}
            </article>
        `;
    }
    
    isPostNew(postDate) {
        const now = new Date();
        const post = new Date(postDate);
        const diffTime = Math.abs(now - post);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2;
    }
    
    setupEventListeners() {
        // Previous/Next buttons
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Dots navigation
        document.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
        
        // Pause on hover only if animations are enabled
        const carousel = document.getElementById('blog-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
                if (animationsEnabled) {
                    this.pause();
                }
            });
            carousel.addEventListener('mouseleave', () => {
                const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
                if (animationsEnabled) {
                    this.resume();
                }
            });
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (animationsEnabled) {
            this.startAutoPlay();
        }
    }
    
    nextSlide() {
        const track = document.getElementById('carousel-track');
        if (!track) return;
        
        this.currentSlide++;
        
        // Update position (account for clone at beginning)
        const offset = -(this.currentSlide + 1) * 100;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${offset}%)`;
        
        // Handle infinite loop
        if (this.currentSlide >= this.totalSlides) {
            this.currentSlide = 0;
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(-100%)';
            }, 500);
        }
        
        this.updateDots();
        
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (animationsEnabled) {
            this.startAutoPlay();
        }
    }
    
    previousSlide() {
        const track = document.getElementById('carousel-track');
        if (!track) return;
        
        this.currentSlide--;
        
        // Update position (account for clone at beginning)
        const offset = -(this.currentSlide + 1) * 100;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${offset}%)`;
        
        // Handle infinite loop
        if (this.currentSlide < 0) {
            this.currentSlide = this.totalSlides - 1;
            setTimeout(() => {
                track.style.transition = 'none';
                const newOffset = -(this.currentSlide + 1) * 100;
                track.style.transform = `translateX(${newOffset}%)`;
            }, 500);
        }
        
        this.updateDots();
        
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (animationsEnabled) {
            this.startAutoPlay();
        }
    }
    
    updateCarousel() {
        const track = document.getElementById('carousel-track');
        if (!track) return;
        
        // Account for clone at beginning
        const offset = -(this.currentSlide + 1) * 100;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${offset}%)`;
        
        this.updateDots();
    }
    
    updateDots() {
        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    pause() {
        this.stopAutoPlay();
    }
    
    resume() {
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (animationsEnabled) {
            this.startAutoPlay();
        }
    }
    
    handleAnimationToggle(enabled) {
        if (enabled) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }
}

// Hero Spotlight System
function initializeHeroSpotlight() {
    console.log('Initializing hero spotlight...');
    const track = document.getElementById('spotlight-track');
    const indicators = document.getElementById('spotlight-indicators');
    
    if (!track || !indicators) {
        console.warn('Spotlight elements not found');
        return;
    }
    
    // Clear any placeholder content
    track.innerHTML = '';
    
    const spotlightContent = [
        {
            type: 'blog',
            badge: 'Latest Post',
            title: blogPostsData[0] ? blogPostsData[0].title : 'Latest AI Insights',
            subtitle: 'Fresh Insights from The Chatbot Genius',
            description: blogPostsData[0] ? blogPostsData[0].excerpt : 'Discover the latest in AI technology',
            cta: [{text: 'Read Article', url: blogPostsData[0] ? blogPostsData[0].url : '#', primary: true}],
            visual: blogPostsData[0] ? blogPostsData[0].image : 'images/jay-tarzwell-photo-new.jpg'
        },
        {
            type: 'book',
            badge: 'Bestseller',
            title: 'The Last Algorithm',
            subtitle: 'A Mind-Bending Journey into AI\'s Future',
            description: 'Explore the philosophical and practical implications of advanced AI in this thought-provoking bestseller that\'s captivating readers worldwide.',
            cta: [
                {text: 'Learn More', url: 'books.html#book3', primary: true},
                {text: 'Buy on Amazon', url: 'https://www.amazon.com/dp/B0FB46WG8R', primary: false}
            ],
            visual: 'images/last-algorithm-cover-new.jpg',
            testimonial: {
                text: 'The Last Algorithm isn\'t just another book about artificial intelligence—it\'s a mind-bending blend of fiction and non-fiction... Original and thought-provoking.',
                author: '— Elizabeth, Verified Reader'
            }
        },
        {
            type: 'service',
            badge: 'Transform Your Business',
            title: 'AI Consulting That Delivers',
            subtitle: 'From Idea to Implementation in 10 Hours',
            description: 'Get expert guidance on implementing ChatGPT, Claude, and custom AI solutions. Privacy-focused, practical, and proven to deliver ROI.',
            cta: [
                {text: 'Book Free Consultation', url: 'https://calendly.com/jay-barkerhrs/30min', primary: true},
                {text: 'View Success Stories', url: 'projects.html', primary: false}
            ],
            visual: 'images/jay-tarzwell-photo-new.jpg'
        },
        {
            type: 'news',
            badge: 'Breaking AI News',
            title: 'Claude 3.5 Sonnet Changes Everything',
            subtitle: 'The New Standard in AI Assistance',
            description: 'Anthropic\'s latest model sets new benchmarks for coding, analysis, and creative tasks. Here\'s what it means for your business.',
            cta: [{text: 'Read Analysis', url: 'ai-news.html', primary: true}],
            visual: 'blog/images/claude-desktop-mcp-header.svg'
        }
    ];
    
    // Generate slides
    let slidesHTML = '';
    spotlightContent.forEach((content, index) => {
        slidesHTML += `
            <div class="spotlight-slide">
                <div class="spotlight-content">
                    <div class="spotlight-text">
                        <span class="spotlight-badge">${content.badge}</span>
                        <h1 class="spotlight-title">${content.title}</h1>
                        <p class="spotlight-subtitle">${content.subtitle}</p>
                        <p class="spotlight-description">${content.description}</p>
                        ${content.testimonial ? `
                            <div class="spotlight-testimonial">
                                <p class="testimonial-text">"${content.testimonial.text}"</p>
                                <p class="testimonial-author">${content.testimonial.author}</p>
                            </div>
                        ` : ''}
                        <div class="spotlight-cta">
                            ${content.cta.map(btn => `
                                <a href="${btn.url}" class="btn ${btn.primary ? 'btn-primary' : 'btn-secondary'}" 
                                   ${btn.url.startsWith('http') ? 'target="_blank"' : ''}>
                                    ${btn.text}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    <div class="spotlight-visual">
                        ${content.type === 'book' ? 
                            `<img src="${content.visual}" alt="${content.title}" class="spotlight-book-cover">` :
                            `<img src="${content.visual}" alt="${content.title}" class="spotlight-image">`
                        }
                    </div>
                </div>
            </div>
        `;
    });
    
    track.innerHTML = slidesHTML;
    
    // Generate indicators
    let indicatorsHTML = '';
    spotlightContent.forEach((_, index) => {
        indicatorsHTML += `<button class="spotlight-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`;
    });
    indicators.innerHTML = indicatorsHTML;
    
    // Setup navigation
    let currentSpotlight = 0;
    const totalSpotlights = spotlightContent.length;
    
    function updateSpotlight() {
        track.style.transform = `translateX(-${currentSpotlight * 100}%)`;
        document.querySelectorAll('.spotlight-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSpotlight);
        });
    }
    
    // Navigation controls
    const prevBtn = document.getElementById('spotlight-prev');
    const nextBtn = document.getElementById('spotlight-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSpotlight = (currentSpotlight - 1 + totalSpotlights) % totalSpotlights;
            updateSpotlight();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSpotlight = (currentSpotlight + 1) % totalSpotlights;
            updateSpotlight();
        });
    }
    
    // Dot navigation
    document.querySelectorAll('.spotlight-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSpotlight = parseInt(e.target.dataset.slide);
            updateSpotlight();
        });
    });
    
    // Auto-rotate if animations enabled
    const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    if (animationsEnabled) {
        setInterval(() => {
            currentSpotlight = (currentSpotlight + 1) % totalSpotlights;
            updateSpotlight();
        }, 10000); // 10 seconds per slide
    }
}

// Content Ticker
function initializeContentTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;
    
    const tickerItems = [
        {text: '🚀 NEW: CanLII Search Tool - AI-Powered Legal Research', badge: 'NEW'},
        {text: '📚 The Last Algorithm - Now a Bestseller on Amazon'},
        {text: '💡 Transform Your Business with AI in Just 10 Hours'},
        {text: '🎯 Free 30-Minute AI Consultation Available'},
        {text: '📰 Latest: AI Jobs Paradox - Why CEOs Are Wrong'},
        {text: '🔥 Medical Dictation Tool Saves Doctors 2+ Hours Daily'},
        {text: '🤖 ChatGPT & Claude Expert - Privacy-Focused Solutions'},
        {text: '📈 400% Productivity Boost with AI Implementation'}
    ];
    
    // Duplicate items for seamless loop
    const allItems = [...tickerItems, ...tickerItems];
    
    let tickerHTML = '';
    allItems.forEach((item, index) => {
        tickerHTML += `
            <span class="ticker-item">
                ${item.text}
                ${item.badge ? `<span class="ticker-badge">${item.badge}</span>` : ''}
            </span>
            ${index < allItems.length - 1 ? '<span class="ticker-separator">•</span>' : ''}
        `;
    });
    
    tickerContent.innerHTML = tickerHTML;
}

// Featured Story
function initializeFeaturedStory() {
    const featuredContent = document.getElementById('featured-content');
    if (!featuredContent) return;
    
    // Rotate featured story weekly
    const stories = [
        {
            title: 'Building My Entire Website with Claude Desktop',
            image: 'blog/images/claude-desktop-mcp-header.svg',
            meta: {date: 'This Week', readTime: '10 min read'},
            description: 'From zero to fully functional website in 6 hours. This case study reveals how Claude Desktop and MCP servers transformed a non-coder into a website owner.',
            url: 'blog/claude-desktop-mcp-website-experiment.html',
            hasVideo: false
        }
    ];
    
    const featured = stories[0];
    
    featuredContent.innerHTML = `
        <div class="featured-media">
            <img src="${featured.image}" alt="${featured.title}" class="featured-image">
            ${featured.hasVideo ? '<div class="featured-video-badge">🎥 Video</div>' : ''}
        </div>
        <div class="featured-details">
            <h3>${featured.title}</h3>
            <div class="featured-meta">
                <span>📅 ${featured.meta.date}</span>
                <span>⏱️ ${featured.meta.readTime}</span>
            </div>
            <p class="featured-description">${featured.description}</p>
            <a href="${featured.url}" class="btn btn-primary">Read Full Story →</a>
        </div>
    `;
}

// Metrics Dashboard
function initializeMetricsDashboard() {
    const metricsGrid = document.getElementById('metrics-grid');
    if (!metricsGrid) return;
    
    // Calculate dynamic metrics
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
    let postsThisMonth = 0;
    
    if (typeof blogPostsData !== 'undefined' && blogPostsData.length > 0) {
        postsThisMonth = blogPostsData.filter(post => {
            const postDate = new Date(post.sortDate);
            const now = new Date();
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        }).length;
    }
    
    const metrics = [
        {icon: '📝', value: postsThisMonth, label: `Posts in ${currentMonth}`, trend: '+20%'},
        {icon: '📰', value: '150+', label: 'AI News Curated', trend: '+15%'},
        {icon: '📚', value: '3', label: 'Books Published'},
        {icon: '🎯', value: '5', label: 'Consultation Slots', trend: 'This Week'}
    ];
    
    let metricsHTML = '';
    metrics.forEach(metric => {
        metricsHTML += `
            <div class="metric-card">
                ${metric.trend ? `<span class="metric-trend">${metric.trend}</span>` : ''}
                <div class="metric-icon">${metric.icon}</div>
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
            </div>
        `;
    });
    
    metricsGrid.innerHTML = metricsHTML;
}

// Time-Based Content
function initializeTimeBasedContent() {
    const hour = new Date().getHours();
    const greeting = document.getElementById('time-greeting');
    const suggestion = document.getElementById('time-suggestion');
    const grid = document.getElementById('time-grid');
    
    if (!greeting || !suggestion || !grid) return;
    
    let greetingText, suggestionText, content;
    
    if (hour >= 5 && hour < 12) {
        greetingText = '☀️ Good Morning!';
        suggestionText = 'Start your day with these AI productivity tips';
        content = [
            {title: '5-Minute AI Brief', desc: 'Quick wins to boost your morning productivity', url: '#'},
            {title: 'ChatGPT Morning Prompts', desc: 'Templates to kickstart your workday', url: '#'},
            {title: 'AI News Digest', desc: "What happened while you were sleeping", url: 'ai-news.html'}
        ];
    } else if (hour >= 12 && hour < 17) {
        greetingText = '🌤️ Good Afternoon!';
        suggestionText = 'Deep-dive into these case studies and implementations';
        content = [
            {title: 'Medical Dictation Success', desc: 'How AI saved a doctor 2+ hours daily', url: 'blog/medical-dictation-tool.html'},
            {title: 'CanLII Search Tool', desc: 'Revolutionizing legal research', url: 'blog/canlii-search-tool.html'},
            {title: 'Implementation Guide', desc: 'Step-by-step AI integration', url: 'projects.html'}
        ];
    } else {
        greetingText = '🌙 Good Evening!';
        suggestionText = 'Perfect time for in-depth reading and learning';
        content = [
            {title: 'The Last Algorithm', desc: 'Dive into the future of AI', url: 'books.html#book3'},
            {title: 'AI Jobs Paradox', desc: 'Why the experts are wrong', url: 'blog/ai-jobs-paradox-ceos-wrong.html'},
            {title: 'Building with Claude', desc: 'Complete website in 6 hours', url: 'blog/claude-desktop-mcp-website-experiment.html'}
        ];
    }
    
    greeting.textContent = greetingText;
    suggestion.textContent = suggestionText;
    
    let gridHTML = '';
    content.forEach(item => {
        gridHTML += `
            <a href="${item.url}" class="time-card" style="text-decoration: none; color: inherit;">
                <h4 style="color: #1a1f71; margin-bottom: 10px;">${item.title}</h4>
                <p style="color: #666; margin: 0;">${item.desc}</p>
            </a>
        `;
    });
    
    grid.innerHTML = gridHTML;
}

// Initialize all features when DOM is ready
let blogCarousel;

// Function to initialize everything
function initializeHomepageFeatures() {
    console.log('Initializing homepage features...');
    console.log('blogPostsData exists?', typeof blogPostsData !== 'undefined');
    if (typeof blogPostsData !== 'undefined') {
        console.log('blogPostsData length:', blogPostsData.length);
    }
    
    try {
        // Initialize blog carousel if data exists
        if (typeof blogPostsData !== 'undefined' && blogPostsData.length > 0) {
            console.log('Blog data found, initializing carousel and spotlight...');
            blogCarousel = new BlogCarousel();
            window.blogCarousel = blogCarousel; // Make it globally accessible
            
            // Initialize hero spotlight (needs blog data)
            initializeHeroSpotlight();
        } else {
            console.warn('Blog data not found, retrying in 500ms...');
            setTimeout(initializeHomepageFeatures, 500);
            return;
        }
        
        // Initialize features that don't need blog data
        console.log('Initializing other features...');
        initializeContentTicker();
        initializeFeaturedStory();
        initializeMetricsDashboard();
        initializeTimeBasedContent();
        
        console.log('All features initialized successfully!');
    } catch (error) {
        console.error('Error initializing homepage features:', error);
        // Try again in case of race condition
        setTimeout(initializeHomepageFeatures, 1000);
    }
}

// Try multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomepageFeatures);
} else {
    // DOM already loaded
    initializeHomepageFeatures();
}

// Also try on window load as backup
window.addEventListener('load', function() {
    if (!blogCarousel) {
        console.log('Backup initialization on window load...');
        initializeHomepageFeatures();
    }
});