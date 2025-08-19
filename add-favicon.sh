#!/bin/bash

# Script to add favicon to all HTML files
echo "Adding favicon to all HTML files..."

# Define the favicon links to add
FAVICON_LINKS='    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="mask-icon" href="/favicon.svg" color="#6B7280">
    <link rel="apple-touch-icon" href="/favicon.svg">'

# Process main HTML files in root directory
for file in *.html; do
    if [ -f "$file" ]; then
        # Check if favicon is already present
        if ! grep -q "favicon" "$file"; then
            echo "Adding favicon to $file"
            # Add favicon links after the <title> tag
            sed -i '' "/<title>.*<\/title>/a\\
$FAVICON_LINKS
" "$file"
        else
            echo "Favicon already exists in $file"
        fi
    fi
done

# Process blog HTML files
for file in blog/*.html; do
    if [ -f "$file" ]; then
        # Check if favicon is already present
        if ! grep -q "favicon" "$file"; then
            echo "Adding favicon to $file"
            # For blog files, we need to reference parent directory
            BLOG_FAVICON_LINKS='    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="alternate icon" href="../favicon.svg">
    <link rel="mask-icon" href="../favicon.svg" color="#6B7280">
    <link rel="apple-touch-icon" href="../favicon.svg">'
            
            sed -i '' "/<title>.*<\/title>/a\\
$BLOG_FAVICON_LINKS
" "$file"
        else
            echo "Favicon already exists in $file"
        fi
    fi
done

echo "Favicon addition complete!"