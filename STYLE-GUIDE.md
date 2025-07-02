# The Chatbot Genius Website Style Guide

## Brand Overview
**Website**: https://thechatbotgenius.com  
**Brand**: The Chatbot Genius  
**Tagline**: AI & Privacy Expert | Building Secure, Practical AI Solutions for SMBs

## Color Palette (Van Gogh-Inspired)

### Primary Colors
- **Deep Indigo**: `#1a1f71` - Primary dark color (inspired by Van Gogh's night sky)
- **Bright Indigo/Periwinkle**: `#4c5fd5` - Primary blue accent
- **Golden Yellow**: `#f9c74f` - Accent color (inspired by Van Gogh's stars)

### Secondary Colors
- **Text Dark**: `#333333` - Main body text
- **Text Light**: `#666666` - Secondary text
- **Background Light**: `#f8f9fa` - Light gray background
- **White**: `#ffffff` - Primary background
- **Orange Accent**: `#f39c12` - Warm orange (used sparingly)

### Gradients
- **Header/Hero Gradient**: `linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%)`
- **Footer Gradient**: `background: #1a1f71` (solid)

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Font Sizes
- **Hero Title**: `3rem` (48px)
- **Page Headers**: `3rem` (48px)
- **Section Headers**: `2.5rem` (40px)
- **Subsection Headers**: `2rem` (32px)
- **Body Text**: `1rem` (16px)
- **Small Text**: `0.9rem` (14.4px)

### Line Heights
- **Body Text**: `1.6`
- **Paragraphs**: `1.8`

## Layout Structure

### Container
- **Max Width**: `1200px`
- **Padding**: `0 20px`
- **Margin**: `0 auto`

### Navigation
- **Height**: ~60px
- **Position**: Fixed top
- **Background**: Indigo gradient
- **Logo**: 🤖 emoji + "The Chatbot Genius" text

### Sections
- **Padding**: `80px 0`
- **Alternating backgrounds**: White and light gray (#f8f9fa)

### Grid Layouts
- **Books Grid**: `repeat(auto-fit, minmax(300px, 1fr))`
- **Articles Grid**: `repeat(auto-fit, minmax(350px, 1fr))`
- **Gap**: `30-40px`

## Component Styles

### Buttons
```css
.btn {
    padding: 12px 30px;
    border-radius: 5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
}

.btn-primary {
    background: #f9c74f;  /* Golden yellow */
    color: #1a1f71;       /* Deep indigo text */
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-amazon {
    background: #ff9900;  /* Amazon orange */
    color: white;
}
```

### Cards
- **Background**: White or #f8f9fa
- **Padding**: `30-40px`
- **Border Radius**: `10px`
- **Shadow**: `0 5px 15px rgba(0,0,0,0.1)`
- **Hover Shadow**: `0 10px 30px rgba(0,0,0,0.2)`

### Book Covers
- **Width**: `200px` (display), `300px` (detail page)
- **Height**: `300px` (display), `auto` (detail page)
- **Shadow**: `0 10px 30px rgba(0,0,0,0.2)`

## Page-Specific Styles

### Homepage
- Hero section with gradient background
- Floating robot emoji animation
- Featured books grid
- Recent writings grid
- Services grid with icons

### Books Page
- Alternating layout (image left/right)
- Purchase buttons with Amazon styling
- Book metadata with emoji icons

### About Page
- Two-column layout (headshot + bio)
- Professional headshot styling

### Writings Page
- Article cards with hover effects
- Date styling in golden yellow
- "Read More" links in bright indigo

### Projects Page
- Large project cards
- Tag system with indigo backgrounds
- Feature lists with checkmarks

## Mobile Responsive Breakpoints
- **Tablet**: `@media (max-width: 768px)`
  - Navigation collapses to hamburger
  - Grids become single column
  - Reduced font sizes

## Special Effects
- **Hover States**: 
  - Cards lift: `transform: translateY(-5px)`
  - Shadows deepen
  - Colors brighten slightly
- **Transitions**: All transitions use `0.3s` timing

## File Structure
```
/Users/jaytarzwell/jaystarz1.github.io/
├── index.html          # Homepage
├── about.html          # About page
├── books.html          # Books showcase
├── writings.html       # Articles/blog
├── projects.html       # Project portfolio
├── style.css           # Main stylesheet (consolidated)
├── script.js           # JavaScript functionality
├── images/             # All images
│   ├── chatbot-genius-cover-final.jpg
│   ├── maggie-christmas-elf-cover-new.jpg
│   ├── last-algorithm-cover-new.jpg
│   └── jay-tarzwell-headshot.jpg
└── CNAME              # Custom domain config
```

## Important Notes

### Current Implementation
- Using **inline CSS** in all HTML files for reliability
- External `style.css` exists but inline styles take precedence
- This ensures styles always load, even if external CSS fails

### Navigation Structure
- Home (index.html)
- About (about.html)
- Books (books.html)
- Writings (writings.html)
- Projects (projects.html)
- Contact (anchor link to #contact on homepage)
- LinkedIn (external link)

### Book Links
1. **Chatbot Genius**: https://www.amazon.ca/Chatbot-Genius-10-Hour-Beginners-Transforming-ebook/dp/B0DB3GS284
2. **Maggie and the Christmas Elf**: https://www.amazon.com/Maggie-Christmas-Elf-Jay-Tarzwell/dp/B09M7GRGZB
3. **The Last Algorithm**: https://www.amazon.ca/Last-Algorithm-Jay-Tarzwell-ebook/dp/B0FB46WG8R

### Deployment
- GitHub Pages hosting
- Custom domain via CNAME
- Changes typically deploy within 1-10 minutes
- DNS managed through Squarespace

## Emergency Recovery

If the site breaks again, use this guide to:
1. Verify color codes are correct
2. Check that navigation links point to correct files
3. Ensure inline CSS is present in each HTML file
4. Confirm image paths are correct (`images/filename.jpg`)
5. Test all pages individually

## Quick CSS Reset Template
```css
/* Use this as a base for any page */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.navbar {
    background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
```

## Contact
**Email**: jay@barkerhrs.com  
**LinkedIn**: https://linkedin.com/in/jaysontarzwell

---
Last Updated: July 2, 2025
