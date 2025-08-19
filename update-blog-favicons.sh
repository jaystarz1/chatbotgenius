#!/bin/bash

# Update remaining blog posts with favicon
echo "Updating blog posts with favicon..."

# Blog files to update
BLOG_FILES=(
    "blog/ai-bias-army-general.html"
    "blog/ai-doesnt-make-us-stupid.html"
    "blog/ai-jobs-paradox-ceos-wrong.html"
    "blog/claude-desktop-mcp-website-experiment.html"
    "blog/medical-dictation-tool.html"
    "blog/no-ai-doesnt-make-you-stupid.html"
)

for file in "${BLOG_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if favicon is already present
        if ! grep -q "favicon" "$file"; then
            echo "Adding favicon to $file"
            # Find the title tag and add favicon links after it
            perl -i -pe 's/(<title>.*?<\/title>)/$1\n    <link rel="icon" type="image\/svg+xml" href="..\/favicon.svg">\n    <link rel="alternate icon" href="..\/favicon.svg">\n    <link rel="mask-icon" href="..\/favicon.svg" color="#6B7280">\n    <link rel="apple-touch-icon" href="..\/favicon.svg">/' "$file"
        else
            echo "Favicon already exists in $file"
        fi
    fi
done

echo "Favicon update complete!"