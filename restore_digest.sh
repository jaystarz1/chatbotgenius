#!/bin/bash
cd /Users/jaytarzwell/jaystarz1.github.io

echo "Restoring AI News page with Daily AI Digest..."

# First, let's see what version is currently live
git status

# Revert to the last working version with the digest (before virtual list)
git checkout 7cd09e9 -- ai-news.html

# Now let's see if we can find where to limit articles
echo "File restored. Now you need to:"
echo "1. Open ai-news.html in your editor"
echo "2. Find the line that says: const displayItems = uniqueItems.slice(0, 200);"
echo "3. Change 200 to 100"
echo "4. Save the file"
echo "5. Run: git add ai-news.html"
echo "6. Run: git commit -m 'Restore Daily AI Digest with 100 article limit'"
echo "7. Run: git push origin main"
