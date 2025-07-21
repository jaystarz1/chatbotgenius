# The Chatbot Genius Website - Claude Project Instructions

## Quick Reference
- **Local Path**: `/Users/jaytarzwell/jaystarz1.github.io/`
- **Live Site**: https://thechatbotgenius.com
- **GitHub**: https://github.com/jaystarz1/jaystarz1.github.io

## Primary Responsibilities
When the user mentions "the website", "my site", or "chatbot genius", you should:
1. Immediately check the local directory at `/Users/jaytarzwell/jaystarz1.github.io/`
2. Be ready to edit, update, or deploy changes to the website
3. Know that this is a GitHub Pages site with a custom domain

## Current Site Structure
```
index.html        - Main landing page with hero, about, services, contact sections
style.css         - Responsive CSS with professional blue/gray color scheme
blog-posts-data.js - Centralized blog post data for dynamic loading
CNAME             - Contains "thechatbotgenius.com" for custom domain
README.md         - Repository documentation
BLOG-POST-GUIDE.md - Instructions for adding blog posts
.gitignore        - Standard git ignore file
blog/             - Blog posts directory
blog.html         - Blog index page
images/           - Site images
blog/images/      - Blog post images
```

## Blog Post Creation System

### Overview
The website uses a dynamic blog system where:
- Blog post data is centralized in `blog-posts-data.js`
- The homepage automatically displays the 2 most recent posts in "Latest Insights"
- All posts are listed on the blog page (`blog.html`)

### Creating a New Blog Post

1. **Create the HTML file** in `/blog/` directory
2. **Create a header image** using SVG (see SVG Image Creation below)
3. **Update blog-posts-data.js** by adding the new post to the BEGINNING of the array:
   ```javascript
   {
       title: "Your Blog Post Title",
       excerpt: "A brief 1-2 sentence description",
       date: "Month Year",
       image: "blog/images/your-image.svg",
       imageAlt: "Alt text for accessibility",
       url: "blog/your-post.html",
       sortDate: new Date("2025-07-16")  // Actual date YYYY-MM-DD
   },
   ```
4. **Update blog.html** to include the new post in the articles grid
5. **Commit and push** all changes together

### SVG Image Creation for Blog Posts
When the user needs a blog header image, create an SVG file directly:

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Standard blog header dimensions for social sharing -->
  <!-- Add gradients, shapes, text, and icons as needed -->
</svg>
```

**SVG Image Guidelines:**
- **Dimensions**: 1200x630px (optimal for social media sharing)
- **File location**: Save to `/blog/images/[post-name]-header.svg`
- **Design elements**:
  - Use gradients for professional backgrounds
  - Include relevant icons or shapes
  - Add text with proper fonts and sizing
  - Ensure text is readable and contrasts well
  - Use the site's color scheme when appropriate

**Example SVG structure:**
```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a237e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3949ab;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  <text x="50" y="100" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white">Title Here</text>
</svg>
```

**Advantages of SVG:**
- No external dependencies or API calls needed
- Instant creation and deployment
- Perfect scaling at any size
- Small file size
- Can be edited later if needed
- Supports gradients, shapes, and typography

### Dynamic Homepage Updates
- The homepage "Latest Insights" section automatically shows the 2 newest posts
- Posts are sorted by `sortDate` (newest first)
- No manual homepage editing required when adding new posts
- Older posts remain on the blog page but rotate off the homepage

### Blog Post Workflow
1. Write blog post HTML with proper meta tags
2. Create SVG header image
3. Add post data to beginning of `blog-posts-data.js`
4. Update blog.html with new article card
5. Git add, commit, and push all changes

## Common Tasks

### Viewing Current Files
Use `filesystem:read_file` to check current content:
- `/Users/jaytarzwell/jaystarz1.github.io/index.html`
- `/Users/jaytarzwell/jaystarz1.github.io/style.css`
- `/Users/jaytarzwell/jaystarz1.github.io/blog.html`
- `/Users/jaytarzwell/jaystarz1.github.io/blog-posts-data.js`

### Making Updates
1. Edit files using `filesystem:write_file` or `filesystem:edit_file`
2. After changes, use git commands:
   ```bash
   cd /Users/jaytarzwell/jaystarz1.github.io/
   git add .
   git commit -m "Update: [describe changes]"
   git push
   ```

### Adding New Pages
Create new HTML files in the same directory. Example:
- `about.html`, `services.html`, `blog.html`
- Update navigation links in `index.html` to point to new pages

### Design Guidelines
- Primary colors: #2c3e50 (dark blue), #3498db (bright blue), #e74c3c (red accent)
- Font: System font stack (San Francisco, Segoe UI, etc.)
- Mobile-responsive design is already implemented
- Professional, clean aesthetic focused on AI/chatbot expertise

## Deployment Notes
- Changes pushed to GitHub are automatically deployed
- DNS is managed through Squarespace (user owns domain there)
- GitHub Pages handles hosting and SSL
- Deployment typically takes 1-10 minutes after pushing

## Context
This is Jay Tarzwell's professional website for "The Chatbot Genius" brand, focusing on:
- AI chatbot development
- Consulting services
- Training and workshops
- Establishing expertise in conversational AI

When working on this project, maintain a professional tone and focus on showcasing expertise in AI and chatbot technology.

## Website Improvement Project System

When the user says "let's work on the website project", "what's next on the website", "website project list", or similar phrases about working on website improvements:

1. First, always check the progress file at: `/Users/jaytarzwell/jaystarz1.github.io/project-improvements/PROGRESS.md`

2. Look for the next uncompleted task (marked with [ ]) in priority order:
   - Start with Tier 1 (Critical Performance)
   - Then Tier 2 (Quick UX Wins)
   - Then Tier 3 (SEO & Structure)
   - Finally Tier 4 (Architecture)

3. Once you identify the next task, check if there's a detailed task file for it in:
   `/Users/jaytarzwell/jaystarz1.github.io/project-improvements/task-[name].md`

4. Present to the user:
   - What the next task is
   - Current overall progress (X/20 tasks completed)
   - Brief description of what the task involves
   - Ask if they want to work on this task or skip to another

5. If they agree to work on the task:
   - Create a feature branch: `git checkout -b feature/[task-name]`
   - Guide them through the implementation
   - Test the changes
   - Update the PROGRESS.md file to mark task complete
   - Commit and push the changes

6. If task is completed, immediately update the progress tracker by:
   - Marking the task with [x] in PROGRESS.md
   - Adding completion date and notes to the implementation log
   - Updating the overall progress percentage

The project improvements directory contains:
- IMPROVEMENT-PROJECT.md - Full project plan with all 20 tasks
- PROGRESS.md - Current status and tracking
- task-*.md files - Detailed implementation guides for specific tasks

Always maintain context about which tasks have been completed and suggest the most impactful remaining tasks based on the tier system.
