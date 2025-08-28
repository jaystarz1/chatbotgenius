# Client Workflow - Step-by-Step Process

## Phase 1: Initial Contact (Day 1)

### 1.1 Gather Requirements
```
Key Questions:
- Event type and date?
- Expected visitor count?
- Brand colors/theme?
- Must-have features?
- Budget range?
- Timeline for launch?
```

### 1.2 Demo Selection
Based on requirements, select appropriate demo:
- **Wedding/engagement** → wedding-clean.html
- **Conference/summit** → corporate-event.html
- **Birthday/celebration** → birthday.html
- **Fundraiser/charity** → fundraiser.html
- **Anniversary/milestone** → anniversary.html
- **Sale/community event** → garage-sale.html

### 1.3 Quote Preparation
```
Base price: $[497]
+ Custom features: $[197]
+ Rush delivery: $[97]
= Total: $[791]
```

## Phase 2: Project Setup (Day 1-2)

### 2.1 Create Project Structure
```bash
# Create client folder
mkdir -p clients/2025/johnson-wedding
cd clients/2025/johnson-wedding

# Copy template files
cp ~/chatbotgenius/web-development/demos/wedding-clean.html index.html
cp -r ~/chatbotgenius/web-development/demos/assets ./

# Initialize git
git init
git add .
git commit -m "Initial setup for Johnson wedding site"
```

### 2.2 Setup Staging Environment
```bash
# Option 1: Netlify
netlify init
netlify deploy

# Option 2: GitHub Pages
git remote add origin https://github.com/client/repo.git
git push -u origin main

# Option 3: Local preview
python -m http.server 8000
```

### 2.3 Create Project Tracker
```markdown
# Johnson Wedding Site

## Details
- Client: Sarah Johnson & Mike Smith
- Event Date: June 15, 2026
- Venue: Fairmont Château Laurier
- Launch Date: February 1, 2025

## Progress
- [ ] Initial setup
- [ ] Content replacement
- [ ] Photo integration
- [ ] Color customization
- [ ] Form setup
- [ ] Testing
- [ ] Client review
- [ ] Launch

## Notes
- Prefers rose gold theme
- Needs bilingual (EN/FR)
- 150 guests expected
```

## Phase 3: Customization (Day 2-3)

### 3.1 Content Replacement Checklist
```javascript
// Required replacements
const replacements = {
  names: "Sarah & Michael" → "Your Names",
  date: "June 15, 2026" → "Event Date",
  venue: "Château Laurier" → "Venue Name",
  location: "Ottawa" → "City",
  title: "Page Title",
  description: "Meta Description",
  countdown: "Date for Timer"
};
```

### 3.2 Visual Customization
```css
/* Update in assets/css/[demo].css */
:root {
  /* Client's brand colors */
  --primary: #HEX;
  --secondary: #HEX;
  --accent: #HEX;
  
  /* Client's fonts (optional) */
  --heading-font: 'Custom Font', serif;
  --body-font: 'Custom Font', sans-serif;
}
```

### 3.3 Feature Integration

#### RSVP Form Setup
```html
<!-- Option 1: Google Forms -->
<iframe src="https://docs.google.com/forms/d/e/[FORM_ID]/viewform?embedded=true">

<!-- Option 2: Typeform -->
<div data-tf-widget="[FORM_ID]"></div>

<!-- Option 3: Custom handler -->
<form action="https://formspree.io/f/[FORM_ID]" method="POST">
```

#### Photo Gallery
```javascript
// Simple gallery
const photos = [
  'engagement-1.jpg',
  'engagement-2.jpg',
  'engagement-3.jpg'
];

// With lightbox
<a href="full.jpg" data-lightbox="gallery">
  <img src="thumb.jpg" alt="Description">
</a>
```

#### Map Integration
```html
<!-- Google Maps -->
<iframe 
  src="https://www.google.com/maps/embed?pb=..." 
  width="100%" 
  height="400">
</iframe>

<!-- MapBox (prettier) -->
<div id='map' style='width: 100%; height: 400px;'></div>
<script>
  mapboxgl.accessToken = 'YOUR_TOKEN';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
  });
</script>
```

## Phase 4: Content Integration (Day 3-4)

### 4.1 Text Content
```markdown
## Content Sources
- [ ] Welcome message
- [ ] Event story/description
- [ ] Schedule/timeline
- [ ] Venue details
- [ ] Accommodation info
- [ ] Travel/parking instructions
- [ ] Gift registry text
- [ ] FAQ items
```

### 4.2 Media Assets
```bash
# Optimize images
for img in raw-photos/*.jpg; do
  convert "$img" -resize 1920x1080 -quality 85 "optimized/$(basename $img)"
done

# Create thumbnails
for img in optimized/*.jpg; do
  convert "$img" -resize 400x300 "thumbs/$(basename $img)"
done
```

### 4.3 SEO Optimization
```html
<!-- Essential meta tags -->
<title>Sarah & Mike | June 15, 2026 | Ottawa Wedding</title>
<meta name="description" content="Join us for our wedding celebration...">
<meta property="og:title" content="Sarah & Mike's Wedding">
<meta property="og:description" content="June 15, 2026 in Ottawa">
<meta property="og:image" content="https://site.com/hero.jpg">
<meta property="og:url" content="https://sarahandmike.com">
```

## Phase 5: Testing (Day 4)

### 5.1 Functionality Tests
- [ ] Countdown timer shows correct time
- [ ] All links work (venue, hotels, registry)
- [ ] Forms submit properly
- [ ] Share buttons functional
- [ ] Map loads correctly
- [ ] Videos play (if any)

### 5.2 Cross-Browser Testing
```
Browsers to test:
- [ ] Chrome (Windows/Mac)
- [ ] Firefox
- [ ] Safari (Mac/iOS)
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari
```

### 5.3 Performance Testing
```bash
# Google PageSpeed
https://pagespeed.web.dev/

# GTmetrix
https://gtmetrix.com/

# Target scores:
- Mobile: 90+
- Desktop: 95+
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
```

### 5.4 Responsive Testing
```
Breakpoints to check:
- [ ] 375px (iPhone SE)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1440px (Desktop)
- [ ] 1920px (Full HD)
```

## Phase 6: Client Review (Day 5)

### 6.1 Staging Presentation
```
Email template:

Subject: Your wedding website is ready for review!

Hi [Client],

Your wedding website is ready for review at:
https://staging-url.netlify.app

Please test:
- Countdown timer
- RSVP form
- Share buttons
- All links and information

Let me know if you'd like any adjustments!

Best,
[Your name]
```

### 6.2 Revision Tracking
```markdown
## Round 1 Feedback (Date)
- [x] Change hero font to script style
- [x] Update color to more pink
- [x] Add photo gallery section
- [x] Fix typo in venue name

## Round 2 Feedback (Date)
- [x] Adjust mobile menu
- [x] Add dietary restrictions to RSVP
- [ ] Include wedding party names
```

### 6.3 Final Approval
```
Checklist before launch:
- [ ] Client approved all content
- [ ] Client tested RSVP form
- [ ] Client confirmed countdown date
- [ ] Client approved staging site
- [ ] Client provided domain details
```

## Phase 7: Launch (Day 6)

### 7.1 Domain Setup
```bash
# Netlify
- Add custom domain in settings
- Update DNS records:
  - A record: 75.2.60.5
  - CNAME: [subdomain].netlify.app

# Traditional hosting
- Upload files via FTP
- Set up SSL certificate
- Configure .htaccess if needed
```

### 7.2 Final Optimizations
```bash
# Minify CSS
npx csso assets/css/wedding.css -o assets/css/wedding.min.css

# Minify JS
npx terser assets/js/app.js -o assets/js/app.min.js

# Compress images
imageoptim assets/images/*
```

### 7.3 Launch Checklist
- [ ] Domain pointing correctly
- [ ] SSL certificate active
- [ ] Forms tested on live site
- [ ] Analytics installed
- [ ] Backup created
- [ ] Client notified

## Phase 8: Handoff (Day 7)

### 8.1 Documentation Package
```
Provide to client:
1. Access credentials
2. How to update content (if applicable)
3. Form submission instructions
4. Analytics access
5. Support contact info
```

### 8.2 Training (if included)
```
30-minute Zoom covering:
- How to access hosting
- How to view form submissions
- How to update basic content
- How to monitor analytics
- When to contact for help
```

### 8.3 Follow-up
```
Schedule:
- 1 week: Check everything working
- 1 month: Review analytics
- 3 months: Offer updates
- Post-event: Archive site
```

## Pricing Structure

### Base Packages
| Package | Pages | Features | Price | Timeline |
|---------|-------|----------|-------|----------|
| Event | 1 | Basic customization | $97 | 24 hours |
| Premium Event | 1 | Full customization | $497 | 3 days |
| Multi-page | 5 | Full site | $997 | 5 days |

### Rush Delivery
- Same day: +100%
- Next day: +50%
- 2 days: +25%

### Add-ons
- Bilingual: +$297
- Photo gallery: +$97
- Video backgrounds: +$197
- Custom forms: +$197
- Email integration: +$297

## Communication Templates

### Initial Response
"Thank you for your interest! I can create a beautiful [wedding] website for your [June 15th] event. Based on your requirements, I recommend our [Premium Event] package at $[497]. This includes [list features]. I can have it ready for you by [date]."

### Progress Update
"Quick update: Your site is coming along beautifully! I've completed the main layout and integrated your content. Tomorrow I'll add the photo gallery and finalize the RSVP form. You'll have a preview link by [time]."

### Delivery
"Your website is live at [URL]! Everything is fully functional - the countdown timer is set for [date], the RSVP form is connected, and share buttons are configured. Let me know if you need any adjustments!"

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Can you make it pop more?" | Add animations, gradients, or particle effects |
| "The colors don't match our theme" | Show color picker, get specific hex codes |
| "Can guests RSVP for plus-ones?" | Modify form to include guest count field |
| "We need it in French too" | Duplicate pages with /fr/ structure |
| "Can we add payment for gifts?" | Integrate Stripe or PayPal buttons |
| "The countdown is wrong" | Check timezone settings in JavaScript |

## Quality Metrics

Track for each project:
- Time to complete: ___ hours
- Client revisions: ___ rounds
- PageSpeed score: ___/100
- Client satisfaction: ___/5
- Referrals generated: ___

---
Last Updated: January 2025
Workflow Version: 1.0