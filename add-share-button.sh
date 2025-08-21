#!/bin/bash

# Add Share Button to All HTML Pages
# This script adds the universal share button to all HTML pages on the site

echo "🚀 Adding Share Button to all HTML pages..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for tracking
updated=0
skipped=0

# Find all HTML files
for file in $(find . -name "*.html" -type f ! -path "./archive/*" ! -path "./node_modules/*" ! -path "./.git/*"); do
    # Check if the share button script is already included
    if grep -q "share-button.js" "$file"; then
        echo -e "${YELLOW}⏭️  Skipping $file (already has share button)${NC}"
        ((skipped++))
    else
        # Check if the file has a closing body tag
        if grep -q "</body>" "$file"; then
            # Add the share button script before the closing body tag
            # Create a temporary file
            temp_file=$(mktemp)
            
            # Use sed to insert the script tag before </body>
            sed '/<\/body>/i\
\    <!-- Universal Share Button -->\
\    <script src="/js/share-button.js"></script>' "$file" > "$temp_file"
            
            # Move the temp file back to the original
            mv "$temp_file" "$file"
            
            echo -e "${GREEN}✅ Updated $file${NC}"
            ((updated++))
        else
            echo -e "${YELLOW}⚠️  Warning: $file has no closing body tag${NC}"
            ((skipped++))
        fi
    fi
done

echo ""
echo "📊 Summary:"
echo "   ✅ Updated: $updated files"
echo "   ⏭️  Skipped: $skipped files"
echo ""
echo "🎉 Share button deployment complete!"
echo ""
echo "📝 Notes:"
echo "   - The share button appears in the bottom-right corner of each page"
echo "   - It includes LinkedIn, X, Facebook, Reddit, WhatsApp, Telegram, Pinterest, Slack"
echo "   - Also includes Email, Copy Link, and QR Code options"
echo "   - The button is mobile-responsive and has a subtle pulse animation on load"
echo ""
echo "🔧 To customize the share button:"
echo "   - Edit /js/share-button.js"
echo "   - Modify colors, position, or social platforms as needed"
echo ""
echo "🚀 To deploy changes:"
echo "   git add ."
echo "   git commit -m 'Add universal share button to all pages'"
echo "   git push"