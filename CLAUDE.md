# The Chatbot Genius - Project Documentation for Claude

## Project Overview
**Website**: https://thechatbotgenius.com  
**Owner**: Jay Tarzwell  
**Purpose**: Professional AI expertise platform featuring blog, books, projects, and medical transcription API  
**Hosting**: Netlify (with automatic deployments from GitHub)  
**Repository**: chatbotgenius (jaytarzwell)  

## Core Technologies
- **Frontend**: Vanilla HTML, CSS, JavaScript (no framework dependencies)
- **Backend**: Netlify Functions (serverless)
- **Deployment**: Netlify CI/CD (auto-deploys on git push)
- **Domain**: Custom domain via CNAME
- **Analytics**: Google Analytics (G-R76R0B7J9B)

## Project Structure

### Key Directories
```
/Users/jaytarzwell/chatbotgenius/
├── netlify/functions/      # Serverless API functions
├── blog/                   # Blog post HTML files
│   └── images/            # Blog header images (SVG format)
├── images/                # Site images (book covers, photos)
├── js/                    # JavaScript modules
├── nato/                  # NATO project (protected section)
├── api/                   # API documentation pages
├── archive/               # Backup/old versions
└── project-improvements/  # Task tracking and improvements
```

### Main Pages
- `index.html` - Homepage with hero, featured content
- `about.html` - About Jay Tarzwell
- `books.html` - Published books showcase
- `blog.html` - Blog listing page
- `projects.html` - Project portfolio
- `ai-news.html` - AI news aggregator
- `ai-insights.html` - AI insights page

### Blog System
- **Data Source**: `blog-posts-data.js` - Central blog post registry
- **Template**: `blog-post-template-PROPER.html` - Correct template with navigation
- **Posts Location**: `/blog/*.html`
- **Image Format**: SVG headers in `/blog/images/`
- **Creation Script**: `new-blog-post.sh` - Automated post creation

## Design System

### Brand Colors (Van Gogh-inspired)
```css
--primary-dark: #1a1f71;    /* Deep indigo */
--primary-blue: #4c5fd5;    /* Bright indigo */
--accent-gold: #f9c74f;     /* Golden yellow */
--accent-orange: #f39c12;   /* Warm orange */
--text-dark: #333;
--text-light: #666;
--bg-light: #f8f9fa;
```

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Navigation Structure
- Fixed top navigation with gradient background
- Logo: 🤖 emoji + "The Chatbot Genius"
- Menu items: Home, About, Books, Blog, Projects, AI News, Contact

## Medical Transcription API

### Production Endpoint
```
POST https://thechatbotgenius.com/.netlify/functions/medical-transcription
```

### Features
- Converts medical dictation to formatted PET/CT reports
- Pure JavaScript processing (no external dependencies)
- Supports multiple tracers (FDG, Ga-68-PSMA, Ga-68-DOTATATE)
- Automatic measurement conversion (cm to mm)
- Medical terminology correction
- Six-section report structure
- ChatGPT Custom Actions compatible

### Report Structure
1. History
2. Comparison
3. Technique
4. Findings (with 4 subcategories)
5. Impression
6. Alternate Impression for Comparison

## Development Workflow

### Local Development
```bash
# Navigate to project
cd /Users/jaytarzwell/chatbotgenius

# Make changes
# Edit files as needed

# Commit and deploy
git add .
git commit -m "Your commit message"
git push

# Automatic deployment via Netlify (2-3 minutes)
```

### Creating New Blog Posts
```bash
./new-blog-post.sh
# Follow prompts for title, excerpt, date
```

### Important Scripts
- `new-blog-post.sh` - Create new blog post
- `update-navigation.js` - Update navigation across site
- `update-rss-feed.js` - Update RSS feed
- `deploy-*.sh` - Various deployment scripts

## Important Files

### Configuration
- `netlify.toml` - Netlify configuration and redirects
- `package.json` - Node.js dependencies and scripts
- `CNAME` - Custom domain configuration
- `feed.xml` - RSS feed for blog

### Documentation
- `README.md` - Main project documentation
- `STYLE-GUIDE.md` - Complete style guide
- `BLOG-POST-GUIDE.md` - Blog post creation guide
- `CLAUDE-PROJECT-INSTRUCTIONS.md` - Claude-specific instructions

### Data Files
- `blog-posts-data.js` - Central blog post registry
- `article-database.json` - Article metadata

## Critical Information

### Navigation Bar HTML Structure
The navigation bar MUST follow this exact structure in all pages:
```html
<nav class="navbar" aria-label="Main navigation">
    <div class="container">
        <div class="nav-content">
            <a href="/" class="nav-brand" aria-label="The Chatbot Genius - Home">
                <span class="logo" aria-hidden="true">🤖</span>
                <span>The Chatbot Genius</span>
            </a>
            <nav class="nav-menu" role="navigation">
                <a href="/" class="nav-link">Home</a>
                <a href="/about.html" class="nav-link">About</a>
                <a href="/books.html" class="nav-link">Books</a>
                <a href="/blog.html" class="nav-link">Blog</a>
                <a href="/projects.html" class="nav-link">Projects</a>
                <a href="/ai-news.html" class="nav-link">AI News</a>
                <a href="/#contact" class="nav-link">Contact</a>
            </nav>
        </div>
    </div>
</nav>
```

### Blog Post Header Structure
All blog posts MUST include proper navigation matching the main site.

### Image Handling
- Book covers: Store in `/images/` directory
- Blog headers: Use SVG format in `/blog/images/`
- Favicon: SVG format at root (`/favicon.svg`)

## Testing Commands

### Test Medical API
```bash
curl -X POST https://thechatbotgenius.com/.netlify/functions/medical-transcription \
  -H "Content-Type: application/json" \
  -d '{"dictation": "Test dictation text"}'
```

### Check Site Status
```bash
# Check if site is live
curl -I https://thechatbotgenius.com

# Check specific function
curl -I https://thechatbotgenius.com/.netlify/functions/medical-transcription
```

## Common Tasks

### Add New Book
1. Add book cover image to `/images/`
2. Update `books.html` with book details
3. Include Amazon purchase link

### Add New Project
1. Update `projects.html` with project card
2. Add any related images to `/images/`

### Update Navigation
1. Run `node update-navigation.js` to update all pages
2. Or manually edit navigation in each HTML file

### Fix Broken Styles
1. Check inline CSS in HTML files (takes precedence)
2. Verify `style.css` is linked properly
3. Use browser dev tools to debug

## Environment Variables
Configured in Netlify dashboard:
- No API keys required for medical transcription
- All processing handled internally

## Deployment
- **Auto-deploy**: Every push to main branch
- **Deploy time**: 2-3 minutes typically
- **Build command**: None (static site)
- **Publish directory**: Root (`.`)

## Support Contacts
- **Email**: jay@barkerhrs.com
- **LinkedIn**: https://linkedin.com/in/jaysontarzwell
- **GitHub**: @jaytarzwell

## Notes for Claude

### When Creating/Editing Files
1. Always preserve the existing navigation structure
2. Use the Van Gogh-inspired color palette
3. Follow the established file naming conventions
4. Ensure all blog posts use the proper template
5. Test any JavaScript changes locally first

### When Debugging Issues
1. Check browser console for JavaScript errors
2. Verify file paths are correct (absolute vs relative)
3. Ensure Netlify functions are deployed properly
4. Check network tab for failed resource loads

### Best Practices
1. Keep inline CSS for critical styles (reliability)
2. Use SVG for logos and icons when possible
3. Optimize images before adding to repository
4. Write clear, descriptive commit messages
5. Test on both desktop and mobile views

## Recent Updates
- Medical transcription API fully operational
- Blog system with proper navigation templates
- RSS feed automation
- Google Analytics integration
- NATO project section (protected)

## Known Issues
- None currently reported

---
Last Updated: January 2025
Status: Production Site - Handle with Care