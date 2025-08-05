#!/bin/bash

# Script to commit and push medical transcription API fixes

cd /Users/jaytarzwell/chatbotgenius

# Add the changed file
git add netlify/functions/medical-transcription.js

# Create a commit with descriptive message
git commit -m "Fix medical transcription API for natural language parsing

- Enhanced tracer detection for natural speech (FDG, PSMA, DOTATATE)
- Fixed coverage area conversion (head to toe → vertex to toes)
- Added natural language parsing for sections (conversational style)
- Improved findings categorization with conversational patterns
- Fixed measurement conversion (one point two → 12 mm)
- Added SUV value formatting (SUV of 3.2 → SUVmax 3.2)
- Fixed image reference parsing (image forty-five → Image 45)
- Enhanced terminology corrections (lighting up → demonstrating uptake)
- Fixed surgical bed detection for natural language
- Corrected alternate impression generation logic
- Added better handling of incidental findings"

# Push to GitHub
git push origin main

echo "Changes pushed to GitHub. Netlify will automatically deploy in 2-3 minutes."
echo "Check deployment status at: https://app.netlify.com/sites/YOUR-SITE-NAME/deploys"
