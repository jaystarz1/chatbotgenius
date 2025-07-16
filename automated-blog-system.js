// Automated Blog Post Creation System for Claude
// This file contains the functions I use to automatically create and publish blog posts

/**
 * Generate a complete blog post HTML file with consistent header
 */
function generateBlogPost(options) {
    const {
        title,
        metaDescription,
        excerpt,
        keywords,
        content,
        imageAlt,
        tldr
    } = options;
    
    // Helper function to create URL-friendly slug
    function createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    
    // Get current date in various formats
    const date = new Date();
    const dateISO = date.toISOString().split('T')[0];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const dateDisplay = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    const dateShort = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
    // Generate filenames
    const slug = createSlug(title);
    const filename = `${slug}.html`;
    const imageFilename = `${slug}-header.svg`;
    
    // Generate the blog post HTML with consistent header
    const blogPostHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | The Chatbot Genius</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="Jay Tarzwell">
    
    <!-- Open Graph for social sharing -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="https://thechatbotgenius.com/blog/images/${imageFilename}">
    <meta property="og:url" content="https://thechatbotgenius.com/blog/${filename}">
    <meta property="og:type" content="article">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-R76R0B7J9B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-R76R0B7J9B');
    </script>
    
    <style>
        /* Core styles from main site */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        /* Top Banner */
        .top-banner {
            background: #0a0f51;
            color: white;
            padding: 12px 0;
            text-align: center;
            width: 100%;
            position: relative;
            z-index: 1001;
        }
        
        .banner-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .banner-item {
            font-size: 0.95rem;
            font-weight: 500;
        }
        
        .banner-separator {
            color: #4c5fd5;
            font-weight: bold;
        }
        
        /* Navigation */
        .navbar {
            background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
            color: white;
            padding: 0;
            position: sticky;
            width: 100%;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
        }
        
        .nav-brand {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: white;
        }
        
        .nav-brand:hover {
            opacity: 0.9;
        }
        
        /* Mobile Menu Button */
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: 2px solid white;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 1rem;
            border-radius: 4px;
            margin: auto 0;
        }
        
        .mobile-menu-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
            align-items: center;
            height: 100%;
        }
        
        .nav-links li {
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .nav-links a:not(.btn) {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .nav-links a:not(.btn):hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .btn-book {
            background: #ff8c42;
            color: white;
            font-weight: bold;
            border: 2px solid #ff8c42;
        }
        
        .btn-book:hover {
            background: #ff7329;
            border-color: #ff7329;
        }
        
        /* Main content area */
        main {
            max-width: 800px;
            margin: 4rem auto 2rem;
            padding: 0 2rem;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        article {
            padding: 3rem 2rem;
        }
        
        .article-header {
            margin-bottom: 3rem;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .meta {
            color: #7f8c8d;
            font-size: 1rem;
            margin-bottom: 2rem;
        }
        
        .hero-image {
            width: 100%;
            height: auto;
            border-radius: 10px;
            margin-bottom: 3rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* TL;DR Box */
        .tldr-box {
            background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
            border-left: 4px solid #3498db;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(52, 152, 219, 0.1);
        }
        
        .tldr-box h2 {
            color: #2c3e50;
            font-size: 1.3rem;
            margin-top: 0;
            margin-bottom: 1rem;
            padding-top: 0;
        }
        
        .tldr-box p {
            margin-bottom: 0;
            color: #34495e;
            font-weight: 500;
        }
        
        /* Blog content styles */
        h2 {
            font-size: 2rem;
            color: #2c3e50;
            margin: 3rem 0 1.5rem;
            padding-top: 2rem;
        }
        
        h3 {
            font-size: 1.5rem;
            color: #34495e;
            margin: 2rem 0 1rem;
        }
        
        p {
            margin-bottom: 1.5rem;
            color: #555;
            line-height: 1.8;
        }
        
        ul, ol {
            margin-bottom: 1.5rem;
            padding-left: 2rem;
            color: #555;
        }
        
        li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
        
        em {
            color: #e74c3c;
            font-style: italic;
        }
        
        /* Special sections */
        .highlight-box {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 5px;
        }
        
        .conclusion {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 2rem;
            margin-top: 3rem;
        }
        
        .cta {
            background-color: #3498db;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
            margin-top: 1rem;
            transition: background-color 0.3s;
        }
        
        .cta:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
        
        /* Footer */
        .footer {
            background: #1a1f71;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .banner-content {
                font-size: 0.85rem;
            }
            
            .banner-separator {
                display: none;
            }
            
            .banner-item {
                width: 100%;
                padding: 2px 0;
            }
            
            .mobile-menu-toggle {
                display: block;
            }
            
            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #1a1f71;
                flex-direction: column;
                padding: 20px;
                gap: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                height: auto;
            }
            
            .nav-links li {
                width: 100%;
                height: auto;
            }
            
            .nav-links a:not(.btn) {
                width: 100%;
                justify-content: center;
                padding: 10px;
            }
            
            .nav-links.show {
                display: flex;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            article {
                padding: 2rem 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Top Banner -->
    <div class="top-banner">
        <div class="container">
            <div class="banner-content">
                <span class="banner-item">
                    <span aria-hidden="true">✍️</span> Writer & Publisher
                </span>
                <span class="banner-separator" aria-hidden="true">•</span>
                <span class="banner-item">
                    <span aria-hidden="true">🤖</span> Custom GPT & App Vibe Coder
                </span>
                <span class="banner-separator" aria-hidden="true">•</span>
                <span class="banner-item">
                    <span aria-hidden="true">🎓</span> Generative AI Trainer
                </span>
            </div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="container">
            <div class="nav-content">
                <a href="/" class="nav-brand">
                    <span aria-hidden="true">🤖</span> The Chatbot Genius
                </a>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle navigation menu">
                    Menu
                </button>
                <ul class="nav-links" id="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about.html">About</a></li>
                    <li><a href="/ai-news.html">AI News</a></li>
                    <li><a href="/books.html">Books</a></li>
                    <li><a href="/blog.html">Blog</a></li>
                    <li><a href="/#contact">Contact</a></li>
                    <li><a href="https://calendly.com/jay-barkerhrs/30min" class="btn btn-book" style="padding: 8px 20px; border-radius: 5px;" target="_blank" aria-label="Book a consultation call - opens in new window">Book a Call</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <main>
        <article>
            <div class="article-header">
                <h1>${title}</h1>
                <div class="meta">
                    <time datetime="${dateISO}">${dateDisplay}</time> • By Jay Tarzwell
                </div>
            </div>
            
            <img src="images/${imageFilename}" alt="${imageAlt}" class="hero-image">
            
            <!-- TL;DR Box at the top -->
            <div class="tldr-box">
                <h2>TL;DR</h2>
                <p>${tldr}</p>
            </div>
            
            <!-- Blog content starts here -->
            ${content}
            <!-- Blog content ends here -->
        </article>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 The Chatbot Genius. All rights reserved.</p>
            <p>Building the future of conversational AI, one chatbot at a time.</p>
        </div>
    </footer>
    
    <script>
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-content') && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when pressing Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.focus();
            }
        });
    </script>
</body>
</html>`;

    // Blog data entry for blog-posts-data.js
    const blogDataEntry = {
        title: title,
        excerpt: excerpt,
        date: dateShort,
        image: `blog/images/${imageFilename}`,
        imageAlt: imageAlt,
        url: `blog/${filename}`,
        sortDate: new Date(dateISO)
    };
    
    return {
        filename,
        imageFilename,
        html: blogPostHTML,
        blogDataEntry,
        slug
    };
}

/**
 * Generate an SVG header image for the blog post
 */
function generateBlogHeaderSVG(title, theme = 'gradient') {
    // Split title for multi-line display if needed
    const words = title.split(' ');
    let lines = [];
    let currentLine = [];
    
    words.forEach(word => {
        currentLine.push(word);
        if (currentLine.join(' ').length > 40 || currentLine.length > 5) {
            lines.push(currentLine.join(' '));
            currentLine = [];
        }
    });
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }
    
    // Calculate font size based on number of lines
    const fontSize = lines.length === 1 ? 56 : lines.length === 2 ? 48 : 40;
    const lineHeight = fontSize * 1.3;
    const startY = 315 - ((lines.length - 1) * lineHeight / 2);
    
    // Different themes
    const themes = {
        gradient: {
            background: `<defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a237e;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#3949ab;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#00acc1;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect width="1200" height="630" fill="url(#bgGradient)"/>`,
            textColor: 'white',
            decoration: `<!-- Decorative elements -->
            <circle cx="100" cy="100" r="60" fill="white" opacity="0.1"/>
            <circle cx="1100" cy="530" r="80" fill="white" opacity="0.08"/>
            <circle cx="200" cy="500" r="40" fill="white" opacity="0.06"/>`
        },
        tech: {
            background: `<defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4c5fd5" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            <rect width="1200" height="630" fill="#0a0f51"/>
            <rect width="1200" height="630" fill="url(#grid)"/>`,
            textColor: '#00acc1',
            decoration: `<!-- Tech decoration -->
            <text x="50" y="580" font-family="monospace" font-size="14" fill="#4c5fd5" opacity="0.5">&lt;/&gt;</text>
            <text x="1100" y="50" font-family="monospace" font-size="14" fill="#4c5fd5" opacity="0.5">{...}</text>`
        },
        minimal: {
            background: `<rect width="1200" height="630" fill="#f8f9fa"/>
            <rect x="0" y="0" width="1200" height="10" fill="#4c5fd5"/>`,
            textColor: '#1a1f71',
            decoration: ''
        }
    };
    
    // Select theme
    const selectedTheme = themes[theme] || themes.gradient;
    
    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    ${selectedTheme.background}
    ${selectedTheme.decoration}
    
    <!-- Title text -->
    ${lines.map((line, index) => 
        `<text x="600" y="${startY + (index * lineHeight)}" 
               font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
               font-size="${fontSize}" 
               font-weight="bold" 
               fill="${selectedTheme.textColor}" 
               text-anchor="middle"
               filter="${theme === 'gradient' ? 'url(#glow)' : ''}">${line}</text>`
    ).join('\n    ')}
    
    <!-- Subtitle -->
    <text x="600" y="560" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="20" 
          fill="${selectedTheme.textColor}" 
          opacity="0.8"
          text-anchor="middle">The Chatbot Genius • AI Insights & Innovation</text>
</svg>`;
    
    return svg;
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateBlogPost,
        generateBlogHeaderSVG
    };
}