# Adding Blog Posts to The Chatbot Genius Website

## Quick Guide

When you create a new blog post, you need to update **one file** to make it appear on the homepage:

### 1. Update blog-posts-data.js

Add your new blog post to the **beginning** of the `blogPostsData` array in `/Users/jaytarzwell/jaystarz1.github.io/blog-posts-data.js`:

```javascript
{
    title: "Your New Blog Post Title",
    excerpt: "A brief description of your blog post (1-2 sentences)",
    date: "Month Year",
    image: "blog/images/your-image.svg",  // or .jpg, .png
    imageAlt: "Description of the image for accessibility",
    url: "blog/your-blog-post.html",
    sortDate: new Date("2025-07-16")  // Use actual date in YYYY-MM-DD format
},
```

### 2. The System Automatically:
- Shows the **2 most recent posts** on the homepage in the "Latest Insights" section
- Sorts posts by date (newest first)
- Removes older posts from the homepage (they remain on the blog page)

## Example

If you create a blog post today about "AI in Education", you would:

1. Create your blog post file: `blog/ai-in-education.html`
2. Create your header image: `blog/images/ai-education-header.svg`
3. Add to the beginning of `blogPostsData`:

```javascript
{
    title: "How AI is Revolutionizing Education",
    excerpt: "Exploring the transformative impact of AI on personalized learning and educational outcomes.",
    date: "July 2025",
    image: "blog/images/ai-education-header.svg",
    imageAlt: "AI-powered classroom with students and digital learning tools",
    url: "blog/ai-in-education.html",
    sortDate: new Date("2025-07-16")
},
```

4. Save, commit, and push changes

The homepage will automatically show your new post and the most recent other post!

## Important Notes

- Always add new posts to the **beginning** of the array
- The `sortDate` should be the actual publication date
- Image paths are relative to the root directory
- The system automatically handles which posts appear on the homepage
- All posts remain visible on the main blog page (`blog.html`)
