#!/bin/bash

# AI Blog Image Generator
# Generates custom AI images for blog posts using DALL-E 3 or other AI services

echo "🎨 AI Blog Image Generator"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if blog post argument is provided
if [ -z "$1" ]; then
    echo "Usage: ./generate-blog-image.sh [blog-post.html]"
    echo ""
    echo "Examples:"
    echo "  ./generate-blog-image.sh blog/ai-drive-through-fiasco.html"
    echo "  ./generate-blog-image.sh blog/latest-post.html"
    echo ""
    echo "This will:"
    echo "  1. Analyze your blog post content"
    echo "  2. Generate a custom AI image"
    echo "  3. Optimize and save it"
    echo "  4. Update your blog post with the new image"
    exit 1
fi

# Run the Node.js script
node generate-blog-image.js "$1"