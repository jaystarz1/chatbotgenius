# WEB DESIGN SYSTEM - STOP FUCKING THIS UP

## ⚠️ MANDATORY: READ THE BOSS'S STANDARDS FIRST ⚠️
**BEFORE DOING ANYTHING, READ:**
→ `/Users/jaytarzwell/chatbotgenius/WEBPAGE-STANDARDS-BOSS.md`

That document contains:
- The EXACT quality standards required
- How to intelligently adapt to different event types
- The 90-minute build process
- What makes pages PREMIUM but NOT GENERIC

## CRITICAL: USE THE SHARED SYSTEM OR DIE

**NEVER WRITE MASSIVE INLINE HTML/CSS AGAIN. EVER. FUCKING EVER.**

## The System We Built

### Directory Structure
```
/Users/jaytarzwell/chatbotgenius/web-development/demos/
├── assets/
│   ├── css/
│   │   ├── base.css          # Core styles, typography, spacing
│   │   └── components.css    # Reusable components (buttons, forms, cards)
│   ├── themes/
│   │   ├── wedding.css       # Wedding-specific styling
│   │   ├── birthday.css      # Birthday-specific styling
│   │   ├── corporate.css     # Corporate-specific styling
│   │   ├── anniversary.css   # Anniversary-specific styling
│   │   ├── fundraiser.css    # Fundraiser-specific styling
│   │   └── garage-sale.css   # Garage sale-specific styling
│   └── js/
│       ├── accessibility.js  # Skip links, ARIA, keyboard nav
│       ├── navigation.js     # Menu, scroll behavior
│       ├── share-buttons.js  # Social sharing functionality
│       ├── forms.js          # Form validation and submission
│       ├── countdown.js      # Countdown timer functionality
│       └── animations.js     # Scroll animations, transitions
└── [demo-name].html         # MINIMAL HTML using the system

### Separate Production Events System
```
/Users/jaytarzwell/chatbot/websites/events/
├── assets/                   # Same structure as above
├── sarah-michael-wedding/    # Example production event
└── [client-event]/           # Other client events
```

## HTML Template Structure (USE THIS YOU FUCKING IDIOT)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Event Title]</title>
    <meta name="description" content="[Event Description]">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- USE THE FUCKING SHARED SYSTEM -->
    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="stylesheet" href="assets/themes/[event-type].css">
</head>
<body>
    <!-- Content using ONLY classes from the shared CSS -->
    
    <!-- USE THE FUCKING SHARED JAVASCRIPT -->
    <script src="assets/js/accessibility.js"></script>
    <script src="assets/js/navigation.js"></script>
    <script src="assets/js/share-buttons.js"></script>
    <script src="assets/js/forms.js"></script>
    <script src="assets/js/countdown.js"></script>
    <script src="assets/js/animations.js"></script>
</body>
</html>
```

## REQUIRED CONTENT FOR EACH EVENT TYPE

### Wedding (ALL OF THIS, NOT SOME OF IT)
1. **Hero** - Names, date, location, countdown
2. **Love Story Timeline** - Multiple milestones
3. **Wedding Party** - Bridesmaids & Groomsmen with roles
4. **Event Details** - Ceremony, reception, dress code
5. **Accommodations** - 3+ hotels with rates
6. **Tourism** - Local attractions for guests
7. **RSVP Form** - Name, email, attendance, guests, dietary, song request
8. **Registry** - Gift registry links

### Birthday
1. **Hero** - Name, age/milestone, date, location
2. **Party Details** - Time, venue, theme
3. **Activities** - Games, entertainment
4. **Menu** - Food and drinks
5. **RSVP Form**
6. **Gift Ideas** - If appropriate

### Corporate Event
1. **Hero** - Event name, date, tagline
2. **Agenda** - Schedule with speakers
3. **Speakers/Presenters** - Bios and topics
4. **Venue Details** - Location, parking, accessibility
5. **Registration Form**
6. **Sponsors** - If applicable

### Anniversary
1. **Hero** - Names, years celebrated, date
2. **Journey Timeline** - Milestones over the years
3. **Celebration Details**
4. **Photo Gallery** - Memory lane
5. **RSVP Form**
6. **Guest Book** - Messages section

### Fundraiser
1. **Hero** - Cause, goal amount, date
2. **Mission Statement**
3. **Impact Stories**
4. **Event Details**
5. **Donation Tiers**
6. **Registration/Donation Form**
7. **Sponsors**

### Garage Sale
1. **Hero** - Dates, times, location
2. **Featured Items** - Preview of sale items
3. **Categories** - What's for sale
4. **Map/Directions**
5. **Contact Info**
6. **Early Bird Special** - If applicable

## CSS Classes Available in the System

### From base.css
- `.container` - Max-width wrapper
- `.section-header` - Section title wrapper
- `.section-title` - Main section heading
- `.section-subtitle` - Section subheading
- `.hero` - Full-height hero section
- `.hero-content` - Hero content wrapper
- `.hero-names` - Event main title (wedding names, etc.)
- `.hero-date` - Event date styling
- `.hero-location` - Event location styling

### From components.css
- `.btn` - Base button class
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-lg` - Large button
- `.btn-sm` - Small button
- `.form-group` - Form field wrapper
- `.form-label` - Form label
- `.form-input` - Text input
- `.form-select` - Dropdown
- `.form-textarea` - Textarea
- `.form-submit` - Submit button
- `.grid` - Grid container
- `.grid-sm-2` - 2 columns on small+
- `.grid-sm-3` - 3 columns on small+
- `.grid-sm-4` - 4 columns on small+
- `.timeline` - Timeline container
- `.timeline-item` - Timeline entry
- `.timeline-dot` - Timeline marker
- `.timeline-content` - Timeline text
- `.countdown` - Countdown wrapper
- `.countdown-item` - Countdown unit
- `.countdown-number` - Countdown digit
- `.countdown-label` - Countdown label
- `.share-buttons` - Share button container
- `.share-toggle` - Share button
- `.share-menu` - Share options dropdown
- `.detail-card` - Info card
- `.detail-icon` - Icon wrapper
- `.demo-return` - Back to package link

## JavaScript Functions Available

### From countdown.js
- `initCountdown(targetDate)` - Initialize countdown to date

### From share-buttons.js
- `toggleShareMenu()` - Toggle share menu
- `shareOnFacebook(event)` - Share on Facebook
- `shareOnTwitter(event)` - Share on Twitter
- `shareOnLinkedIn(event)` - Share on LinkedIn
- `shareViaEmail(event)` - Share via email
- `copyLink(event)` - Copy link to clipboard

### From forms.js
- Form validation automatically applied to `.event-form[data-validate="true"]`

### From animations.js
- Scroll animations automatically applied to elements with data attributes

## RULES - VIOLATE THESE AND YOU'RE FIRED

1. **NEVER** write inline styles unless absolutely necessary for one-off fixes
2. **NEVER** create massive single HTML files with embedded CSS
3. **ALWAYS** use the shared CSS/JS system
4. **ALWAYS** include all required content sections for each event type
5. **ALWAYS** test that the shared assets load properly
6. **ALWAYS** maintain the separation between demo (sales) and production (client) sites

## Demo vs Production

### Demos (For Sales)
- Location: `/Users/jaytarzwell/chatbotgenius/web-development/demos/`
- URL: thechatbotgenius.com/web-development/demos/
- Purpose: Show potential clients what we can build
- Include: Demo return button, sample content

### Production (Client Events)
- Location: `/Users/jaytarzwell/chatbot/websites/events/`
- URL: events.thechatbotgenius.com/[client-event]/
- Purpose: Actual client event websites
- Include: Real content, no demo controls

## Common Fuck-Ups to Avoid

1. **Writing 500+ lines of inline CSS** - USE THE FUCKING THEMES
2. **Forgetting to include all content sections** - CHECK THE REQUIREMENTS
3. **Using wrong date/location** - VERIFY THE DETAILS
4. **Not using the shared JS** - INCLUDE ALL JS FILES
5. **Creating new systems instead of using existing** - STICK TO THE PLAN

## Quick Reference Commands

```bash
# Test a demo locally
open /Users/jaytarzwell/chatbotgenius/web-development/demos/wedding.html

# Check if assets exist
ls -la /Users/jaytarzwell/chatbotgenius/web-development/demos/assets/

# Deploy to production
cd /Users/jaytarzwell/chatbotgenius
git add .
git commit -m "Update demos"
git push
```

## The Bottom Line

USE THE FUCKING SYSTEM WE BUILT. It's there for a reason. Stop reinventing the wheel every time. The shared CSS/JS handles everything. Your job is to:

1. Create minimal HTML
2. Use the existing classes
3. Include the proper theme CSS
4. Add ALL required content sections
5. Test it works

That's it. Stop making this harder than it needs to be.

---
Last Updated: January 2025
Status: THIS IS THE FUCKING LAW