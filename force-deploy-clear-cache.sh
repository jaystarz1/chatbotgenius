#!/bin/bash

echo "🔧 FORCE DEPLOYING with CACHE CLEAR..."
echo "======================================"
cd /Users/jaytarzwell/chatbotgenius

echo ""
echo "📋 Current Git status:"
git status

echo ""
echo "➕ Adding all changes..."
git add -A

echo ""
echo "💬 Committing with cache bust message..."
TIMESTAMP=$(date +%s)
git commit -m "FORCE REDEPLOY: Clear all caches - timestamp $TIMESTAMP

This commit forces a full redeploy with cache clearing.
Testing if the medical transcription function updates are actually deploying.

Issues being tested:
- Surgical bed phrase in wrong section
- Measurement conversions not working
- SUV formatting not working

Cache bust timestamp: $TIMESTAMP"

echo ""
echo "🚀 Force pushing to trigger deployment..."
git push --force-with-lease

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "⏰ IMPORTANT NEXT STEPS:"
echo "1. Go to Netlify dashboard: https://app.netlify.com"
echo "2. Find your site: chatbotgenius"
echo "3. Go to Deploys tab"
echo "4. Click on the latest deploy"
echo "5. Click 'Clear cache and deploy site'"
echo ""
echo "🧪 Then test with: /Users/jaytarzwell/chatbotgenius/test-api-direct.html"
echo ""
echo "📊 Check function logs at:"
echo "https://app.netlify.com/sites/chatbotgenius/functions/medical-transcription"
