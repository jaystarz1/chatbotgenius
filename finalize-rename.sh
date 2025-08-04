#!/bin/bash

echo "🔄 Testing git configuration and pushing updates..."
cd /Users/jaytarzwell/chatbotgenius

echo "📍 Current directory: $(pwd)"
echo ""

echo "🔍 Git remote configuration:"
git remote -v
echo ""

echo "📊 Git status:"
git status --short
echo ""

echo "➕ Adding all changes..."
git add .

echo "💬 Committing changes..."
git commit -m "Repository renamed and documentation updated

- Renamed repository from jaystarz1.github.io to chatbotgenius
- Updated all documentation with Netlify hosting information
- Added comprehensive API endpoint documentation
- Updated paths and configuration for new structure
- Added medical transcription API with full PET/CT formatting"

echo "🚀 Pushing to renamed repository..."
git push

echo ""
echo "✅ All done! Repository successfully renamed and updated:"
echo "  🏠 Local: /Users/jaytarzwell/chatbotgenius/"
echo "  🌐 GitHub: https://github.com/jaystarz1/chatbotgenius"
echo "  🚀 Live: https://thechatbotgenius.com"
echo "  🏥 API: https://thechatbotgenius.com/api/medical-transcription"
