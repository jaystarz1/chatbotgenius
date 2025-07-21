#!/bin/bash
cd /Users/jaytarzwell/jaystarz1.github.io

# Create a backup of the current file
cp ai-news.html ai-news-backup.html

# Revert to the commit before virtual list was added
git checkout 7cd09e9 -- ai-news.html

# Now edit the file to limit to 100 articles
sed -i '' 's/slice(0, 200)/slice(0, 100)/g' ai-news.html

# Stage and commit the changes
git add ai-news.html
git commit -m "Restore Daily AI Digest with 100 article limit for better performance"
git push origin main

echo "AI News page restored with 100 article limit"
