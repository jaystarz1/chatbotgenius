#!/bin/bash

# Update git configuration for renamed repository
cd /Users/jaytarzwell/chatbotgenius

echo "🔄 Updating git configuration..."

# Check current remote
echo "Current remote URL:"
git remote -v

# You'll need to rename the GitHub repository first at:
# https://github.com/jaystarz1/jaystarz1.github.io
# Settings → Repository name → Change to "chatbotgenius"

# Then update the remote URL (uncomment after renaming on GitHub):
# git remote set-url origin https://github.com/jaystarz1/chatbotgenius.git

echo "✅ Local directory renamed to: /Users/jaytarzwell/chatbotgenius"
echo "📝 Next steps:"
echo "1. Go to https://github.com/jaystarz1/jaystarz1.github.io"
echo "2. Settings → Repository name → Change to 'chatbotgenius'"
echo "3. Run: git remote set-url origin https://github.com/jaystarz1/chatbotgenius.git"
echo "4. Test with: git push"
