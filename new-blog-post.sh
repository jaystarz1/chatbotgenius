#!/bin/bash

# The Chatbot Genius - New Blog Post Creator
# This script helps create a new blog post with consistent formatting

echo "🤖 Creating a new blog post for The Chatbot Genius..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Run the blog post creator
node create-blog-post.js

echo ""
echo "✨ Blog post creation complete!"
