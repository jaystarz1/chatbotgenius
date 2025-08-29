#!/bin/bash

# Auto-generate blog image without any prompts
# Usage: ./generate-blog-image-auto.sh blog-post.html

if [ -z "$1" ]; then
    echo "Usage: ./generate-blog-image-auto.sh blog-post.html"
    exit 1
fi

# Run the image generator in auto mode
AUTO_MODE=true node generate-blog-image.js "$1"