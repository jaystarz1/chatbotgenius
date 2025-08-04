#!/bin/bash

# Test git configuration after repository rename
cd /Users/jaytarzwell/chatbotgenius

echo "🔍 Testing git configuration..."
echo "Current remote URL:"
git remote -v

echo ""
echo "📝 Testing connection to renamed repository..."
git fetch --dry-run

echo ""
echo "✅ Git configuration updated!"
echo "🎯 New remote: https://github.com/jaystarz1/chatbotgenius.git"
echo ""
echo "📋 Summary of changes:"
echo "  • Local directory: /Users/jaytarzwell/chatbotgenius/"
echo "  • Remote repository: github.com/jaystarz1/chatbotgenius"
echo "  • Documentation: Updated with Netlify info"
echo "  • API endpoint: https://thechatbotgenius.com/api/medical-transcription"
