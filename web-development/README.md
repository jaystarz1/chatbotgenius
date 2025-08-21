# Web Development Section Structure

## Directory Layout
```
/web-development/
├── index.html                    # Main web dev landing page (currently web-development.html)
├── README.md                      # This file - structure documentation
│
├── /demos/                        # Event page demos ($97 service)
│   ├── showcase.html             # Lists all demo types with previews
│   ├── wedding.html              # Wedding event page demo ✓ COMPLETE
│   ├── garage-sale.html          # Community garage sale demo
│   ├── birthday.html             # Birthday party demo
│   ├── anniversary.html          # Anniversary celebration demo
│   ├── fundraiser.html           # Charity fundraiser demo
│   └── corporate-event.html      # Corporate event demo
│
├── /packages/                     # Detailed package pages
│   ├── event-page.html           # $97 event page details
│   ├── landing-package.html      # $297 5-page details
│   ├── standard-package.html     # $497 10-page details
│   └── complete-package.html     # $997 25-page details
│
├── /maintenance/                  # Maintenance & training options
│   ├── diy-ai-training.html      # Claude Desktop training ($497)
│   ├── monthly-monitoring.html   # $97/month service details
│   └── pay-as-you-go.html       # $15/update details
│
├── /portfolio/                    # Client work showcase
│   ├── the-british-nanny.html   # Case study
│   ├── ottawa-handyman.html      # Case study
│   └── [future-clients].html     # To be added
│
└── /templates/                    # Claude project templates
    ├── event-template.html        # Base template for events
    ├── business-template.html     # Base template for businesses
    └── prompts.md                 # Prompt library for Claude

```

## Demo Pages Plan

### 1. Wedding (COMPLETE)
- Romantic color scheme (rose/cream)
- RSVP form
- Timeline/schedule
- Venue information
- Accommodations
- Registry

### 2. Garage Sale (TODO)
**Theme**: Community, bargain hunting
**Color Scheme**: Bright, friendly (blue/yellow)
**Sections**:
- Date & rain date
- Multiple addresses with map
- Item categories (furniture, clothes, tools, etc.)
- What to bring (cash, bags)
- Early bird info
- Contact organizer

### 3. Birthday Party (TODO)
**Theme**: Fun, celebratory
**Color Scheme**: Based on age (kids = bright, adult = elegant)
**Sections**:
- Party details (time, location)
- RSVP form
- Gift ideas/wishlist
- Activities planned
- Food/cake info
- Parking instructions

### 4. Anniversary (TODO)
**Theme**: Elegant celebration
**Color Scheme**: Gold/silver based on years
**Sections**:
- Celebration details
- Memory lane (photo timeline)
- RSVP
- Gift preferences (charity donations?)
- Special messages section

### 5. Fundraiser (TODO)
**Theme**: Cause-focused, inspiring
**Color Scheme**: Based on cause
**Sections**:
- About the cause
- Event details
- Donation options
- Silent auction items
- Sponsor recognition
- Progress thermometer

### 6. Corporate Event (TODO)
**Theme**: Professional
**Color Scheme**: Company colors
**Sections**:
- Agenda
- Speaker bios
- Registration form
- Venue/parking
- Networking opportunities
- Sponsor logos

## Package Detail Pages

### Event Page ($97)
- Show all 6 demo types
- 24-hour delivery promise
- What's included
- Perfect for one-time events
- Order process

### Landing Package ($297)
- 5-page structure examples
- 3-day delivery
- Small business focus
- SEO benefits
- Sample layouts

### Standard Package ($497)
- 10-page structure
- Blog capability
- 5-day delivery
- Most popular choice
- Business growth focus

### Complete Package ($997)
- 25-page structure
- Location pages for SEO
- Service area domination
- Advanced features
- Enterprise feel

## Maintenance Pages

### DIY AI Training ($497)
- What is Claude Desktop
- MCP filesystem setup
- Git/GitHub workflow
- Custom prompt playbooks
- Video preview of process
- Requirements checklist

### Monthly Monitoring ($97/month)
- 20 updates explained
- Sample update types
- Monitoring dashboard preview
- SEO adjustments included
- Comparison with agencies

### Pay-As-You-Go ($15/update)
- Update credit system
- Examples of 1-5 credit tasks
- How to request updates
- Turnaround times
- Billing process

## Implementation Priority

### Phase 1 (Immediate)
1. Move web-development.html to /web-development/index.html
2. Create showcase.html for demos
3. Build garage-sale.html demo
4. Create DIY AI training page

### Phase 2 (Next Week)
1. Complete all event demos
2. Create package detail pages
3. Build portfolio case studies

### Phase 3 (Following Week)
1. Create maintenance pages
2. Build Claude project templates
3. Add internal linking throughout

## URL Structure
```
Current:
/web-development.html

New Structure:
/web-development/                      # Main landing
/web-development/demos/showcase        # All demos
/web-development/demos/wedding         # Specific demo
/web-development/packages/standard     # Package details
/web-development/training              # DIY AI training
/web-development/portfolio             # Case studies
```

## SEO Benefits
- Each page targets specific keywords
- Internal linking boost
- More content = more authority
- Specific service pages rank better
- Demo pages can rank for "[event type] website Ottawa"

## Navigation Strategy
Each sub-page includes:
- Breadcrumb: Home > Web Development > [Current Page]
- Sidebar with related pages
- Clear CTAs to contact
- Link back to main web-development page

## Next Steps
1. Create showcase.html to display all demos
2. Build garage-sale.html as second demo
3. Create DIY AI training page (high value)
4. Set up proper navigation between pages
