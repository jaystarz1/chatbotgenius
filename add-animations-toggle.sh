#!/bin/bash

# This script adds the animations toggle button to all HTML pages

# Function to add animations toggle to a file
add_animations_toggle() {
    local file="$1"
    echo "Processing $file..."
    
    # Check if the toggle button already exists
    if grep -q "toggle-animations" "$file"; then
        echo "  - Animations toggle already exists, skipping..."
        return
    fi
    
    # Add the button after "Book a Call" in navigation
    if grep -q 'Book a Call</a></li>' "$file"; then
        sed -i '' 's|Book a Call</a></li>|Book a Call</a></li>\
                    <li><button id="toggle-animations" class="btn btn-secondary" style="padding: 8px 20px; border-radius: 5px; background: transparent; color: white; border: 1px solid white; cursor: pointer;" aria-label="Toggle animations on/off">Turn off animations</button></li>|' "$file"
        echo "  - Added toggle button to navigation"
    fi
    
    # Add JavaScript and CSS before closing body tag
    if grep -q '</body>' "$file"; then
        # Create temporary file with the script to add
        cat > /tmp/animations_script.txt << 'EOF'
        
        // Animations toggle functionality
        const animationsToggle = document.getElementById('toggle-animations');
        if (animationsToggle) {
            const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
            
            // Apply initial state
            if (!animationsEnabled) {
                document.body.classList.add('no-animations');
                animationsToggle.textContent = 'Turn on animations';
            }
            
            // Toggle animations
            animationsToggle.addEventListener('click', function() {
                const isEnabled = !document.body.classList.contains('no-animations');
                
                if (isEnabled) {
                    document.body.classList.add('no-animations');
                    localStorage.setItem('animationsEnabled', 'false');
                    this.textContent = 'Turn on animations';
                } else {
                    document.body.classList.remove('no-animations');
                    localStorage.setItem('animationsEnabled', 'true');
                    this.textContent = 'Turn off animations';
                }
            });
        }
    </script>
    
    <style>
        /* Disable animations when toggled off */
        .no-animations * {
            animation: none !important;
            transition: none !important;
        }
    </style>
</body>
EOF
        
        # Replace the closing body tag with script and closing body
        sed -i '' '/<\/body>/r /tmp/animations_script.txt' "$file"
        sed -i '' '/<\/body>/{N; s|</body>\n||}' "$file"
        
        echo "  - Added JavaScript and CSS"
    fi
}

# Process all main HTML files
for file in books.html blog.html projects.html ai-news.html ai-insights.html; do
    if [ -f "$file" ]; then
        add_animations_toggle "$file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "Done! Animations toggle has been added to all pages."