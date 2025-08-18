# The Chatbot Genius Website - Claude Project Instructions

## Quick Reference
- **Local Path**: `/Users/jaytarzwell/chatbotgenius/`
- **Live Site**: https://thechatbotgenius.com
- **GitHub**: https://github.com/jaystarz1/chatbotgenius

## ⚠️ CRITICAL: BLOG POST HEADER REQUIREMENTS ⚠️

**EVERY FUCKING BLOG POST MUST HAVE THE EXACT SAME HEADER AS THE MAIN SITE**

When creating ANY blog post, you MUST:
1. Use the template from `/Users/jaytarzwell/chatbotgenius/blog-post-template-PROPER.html`
2. Include ALL the inline CSS styles (not external CSS - it doesn't work properly)
3. NEVER modify the header structure - it has:
   - Dark navy top banner (#0a0f51) with the three professional roles
   - Blue gradient navigation bar (gradient from #1a1f71 to #4c5fd5)
   - White text on navigation
   - Orange "Book a Call" button (#ff8c42)
   - Mobile menu functionality

The header is NOT NEGOTIABLE. Every blog post MUST look professional and match the main site exactly. No blue underlined links, no missing styles, no half-assed implementations.

**Template location**: `/Users/jaytarzwell/chatbotgenius/blog-post-template-PROPER.html`
**DO NOT** use the old blog-post-template.html - it's wrong.

## Primary Responsibilities
When the user mentions "the website", "my site", or "chatbot genius", you should:
1. Work with files in `/Users/jaytarzwell/chatbotgenius/`
2. Be ready to edit, update, or deploy changes to the website
3. Know that this is a GitHub Pages site with a custom domain

## Current Site Structure
```
index.html        - Main landing page
style.css         - External CSS (but blog posts need inline CSS)
blog-posts-data.js - Centralized blog post data for dynamic loading
blog/             - Blog posts directory
blog.html         - Blog index page
images/           - Site images
blog/images/      - Blog post images
blog-post-template-PROPER.html - THE CORRECT TEMPLATE WITH PROPER HEADER
```

## Blog Post Creation System

### Creating a New Blog Post - THE RIGHT WAY

1. **START WITH THE PROPER TEMPLATE**
   - Copy `/Users/jaytarzwell/chatbotgenius/blog-post-template-PROPER.html`
   - This has the CORRECT header with inline CSS that actually works
   - DO NOT try to use external CSS - it doesn't render properly

2. **Create the HTML file** in `/blog/` directory
   - Replace all [PLACEHOLDER] values
   - Keep the header section EXACTLY as it is

3. **Create a header image** using SVG
   - Dimensions: 1200x630px
   - Save to `/blog/images/[post-name]-header.svg`

4. **Update blog-posts-data.js** 
   Add to the BEGINNING of the array:
   ```javascript
   {
       title: "Your Blog Post Title",
       excerpt: "A brief 1-2 sentence description",
       date: "August 2025",  // Current month/year
       image: "blog/images/your-image.svg",
       imageAlt: "Alt text for accessibility",
       url: "blog/your-post.html",
       sortDate: new Date("2025-08-18")  // Today's date
   },
   ```

5. **Commit and push** all changes

### What the Header MUST Include

```html
<!-- Top Banner with professional roles -->
<div class="top-banner">
    ✍️ Writer & Publisher • 🤖 Custom GPT & App Vibe Coder • 🎓 Generative AI Trainer
</div>

<!-- Navigation with gradient background -->
<nav class="navbar">
    - Logo: 🤖 The Chatbot Genius
    - Links: Home, About, AI News, Books, Blog, Projects, Contact
    - Orange "Book a Call" button
</nav>
```

ALL styling must be inline in a `<style>` tag, NOT linked to external CSS.

### Common Mistakes to AVOID
❌ Using external CSS (`<link rel="stylesheet" href="../style.css">`) - IT DOESN'T WORK
❌ Creating a different navigation structure
❌ Missing the top banner with the three professional roles
❌ Having blue underlined links instead of the proper styled navigation
❌ Forgetting the mobile menu JavaScript

### SVG Image Creation for Blog Posts
Create professional header images:
```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a237e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3949ab;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">Title</text>
</svg>
```

## Common Tasks

### Making Updates
1. Edit files using `filesystem:write_file` or `filesystem:edit_file`
2. After changes, use git commands:
   ```bash
   cd /Users/jaytarzwell/chatbotgenius/
   git add .
   git commit -m "Update: [describe changes]"
   git push
   ```

### Design Guidelines
- Navigation bar: Blue gradient (#1a1f71 to #4c5fd5)
- Top banner: Dark navy (#0a0f51)
- Call-to-action button: Orange (#ff8c42)
- Professional, clean aesthetic

## Deployment Notes
- Changes pushed to GitHub are automatically deployed
- GitHub Pages handles hosting
- Deployment typically takes 1-10 minutes after pushing

## Context
This is Jay Tarzwell's professional website for "The Chatbot Genius" brand. Every page, especially blog posts, must maintain a consistent, professional appearance that matches the main site exactly.