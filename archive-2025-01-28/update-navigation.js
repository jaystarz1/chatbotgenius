const fs = require('fs');
const path = require('path');

// Pages to update
const pages = [
    'index.html',
    'about.html',
    'books.html',
    'ai-news.html',
    'projects.html',
    'blog.html'
];

// Update each page
pages.forEach(page => {
    const filePath = path.join('.', page);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find and replace navigation links
        // Look for the nav ul and update its contents
        const navPattern = /<nav[^>]*>[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>[\s\S]*?<\/nav>/;
        const match = content.match(navPattern);
        
        if (match) {
            // Check if AI Insights is already there
            if (!content.includes('ai-insights.html')) {
                // Replace the navigation list items
                const oldNav = match[1];
                const newNav = `
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="books.html">Books</a></li>
                <li><a href="ai-news.html">AI News</a></li>
                <li><a href="ai-insights.html">AI Insights</a></li>
                <li><a href="projects.html">Projects</a></li>
            `;
                
                content = content.replace(oldNav, newNav);
                
                fs.writeFileSync(filePath, content);
                console.log(`Updated navigation in ${page}`);
            } else {
                console.log(`${page} already has AI Insights in navigation`);
            }
        } else {
            console.log(`Could not find navigation pattern in ${page}`);
        }
    } else {
        console.log(`File not found: ${page}`);
    }
});

console.log('Navigation update complete!');
