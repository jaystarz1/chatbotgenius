#!/bin/bash
cd /Users/jaytarzwell/jaystarz1.github.io

# Revert to the commit before the virtual list implementation
git checkout c1a48d3 -- ai-news.html

# Stage the change
git add ai-news.html

# Commit the restoration
git commit -m "Restore AI News page with Daily AI Digest cards - revert virtual list implementation"

# Push the changes
git push origin main

echo "AI News page restored to version with Daily AI Digest cards"
