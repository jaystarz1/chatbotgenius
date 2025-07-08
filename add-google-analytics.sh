#!/bin/bash

# Google Analytics tracking code
GA_CODE='    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-R76R0B7J9B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "G-R76R0B7J9B");
    </script>'

# Function to add GA code to an HTML file
add_ga_to_file() {
    local file=$1
    echo "Processing: $file"
    
    # Check if GA code already exists
    if grep -q "G-R76R0B7J9B" "$file"; then
        echo "  ✓ Google Analytics already present in $file"
    else
        # Add GA code after the opening <head> tag
        # Using a temporary file to ensure proper insertion
        awk -v ga="$GA_CODE" '
            /<head>/ {
                print $0
                print ga
                next
            }
            {print}
        ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
        
        echo "  ✓ Added Google Analytics to $file"
    fi
}

# List of HTML files to update
HTML_FILES=(
    "about.html"
    "ai-insights.html"
    "ai-news.html"
    "blog.html"
    "books.html"
    "projects.html"
)

# Add GA to each file
for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        add_ga_to_file "$file"
    else
        echo "  ⚠ File not found: $file"
    fi
done

echo ""
echo "✅ Google Analytics installation complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push the changes to GitHub"
echo "2. Visit https://analytics.google.com to view your data"
echo "3. Note: It may take 24-48 hours to see initial data"
