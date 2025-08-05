#!/bin/bash

echo "📋 Deploying medical API privacy policy..."
cd /Users/jaytarzwell/chatbotgenius

echo "➕ Adding privacy policy..."
git add privacy-policy-medical-api.html

echo "💬 Committing privacy policy..."
git commit -m "Added privacy policy for Medical Transcription API

- HIPAA-compliant privacy policy specifically for medical API
- Hidden from search engines (noindex, nofollow)
- Covers data processing, security, and compliance
- No storage policy clearly stated
- Professional healthcare-focused language
- Contact information provided
- Styled to match website branding"

echo "🚀 Pushing privacy policy..."
git push

echo ""
echo "✅ Privacy policy deployed successfully!"
echo "🔗 URL: https://thechatbotgenius.com/privacy-policy-medical-api.html"
echo "👁️ Hidden from public (noindex, nofollow, not linked)"
echo "🏥 Ready for ChatGPT Custom Action configuration"
