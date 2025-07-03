const fetch = require('node-fetch');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

// RSS Feed URLs from your AI News page
const RSS_FEEDS = [
    'https://www.google.ca/alerts/feeds/04066946017456136967/4823471870123205',
    'https://www.google.ca/alerts/feeds/04066946017456136967/4217792680075237154',
    'https://www.google.ca/alerts/feeds/04066946017456136967/13089354697454058042',
    'https://www.google.ca/alerts/feeds/04066946017456136967/13089354697454058988',
    'https://www.google.ca/alerts/feeds/04066946017456136967/1942817214412033827',
    'https://www.google.ca/alerts/feeds/04066946017456136967/8120264801281996652',
    'https://www.google.ca/alerts/feeds/04066946017456136967/11062023876626914074',
    'https://www.google.ca/alerts/feeds/04066946017456136967/2711366426680219224',
    'https://www.google.ca/alerts/feeds/04066946017456136967/3311723711538288468',
    'https://www.google.ca/alerts/feeds/04066946017456136967/759091706708141296',
    'https://www.google.ca/alerts/feeds/04066946017456136967/5779438660767372325',
    'https://www.google.ca/alerts/feeds/04066946017456136967/12857769517673299701',
    'https://www.google.ca/alerts/feeds/04066946017456136967/8173930679921090367',
    'https://www.google.ca/alerts/feeds/04066946017456136967/10149064895149665631',
    'https://www.google.ca/alerts/feeds/04066946017456136967/10667153709229080869',
    'https://www.google.ca/alerts/feeds/04066946017456136967/11084050275073569809',
    'https://www.google.ca/alerts/feeds/04066946017456136967/3381636154839232159'
];

// Category keywords (same as your AI News page)
const categoryKeywords = {
    'Business': ['ROI', 'revenue', 'profit', 'enterprise', 'CEO', 'startup', 'investment', 'market', 'business', 'company', 'corporate', 'executive', 'IPO', 'acquisition', 'merger'],
    'HR': ['hiring', 'recruitment', 'employee', 'workplace', 'talent', 'workforce', 'HR', 'human resources', 'staff', 'personnel', 'culture', 'remote work', 'hybrid'],
    'Jobs': ['job', 'career', 'employment', 'position', 'opening', 'vacancy', 'hire', 'recruiting', 'candidate', 'interview', 'salary', 'benefits'],
    'Tech': ['API', 'coding', 'software', 'hardware', 'cloud', 'developer', 'programming', 'tech', 'technology', 'platform', 'infrastructure'],
    'Microsoft': ['Microsoft', 'Azure', 'Windows', 'Office', 'Teams', 'Copilot', 'Bing', 'Surface', 'Xbox', 'Satya Nadella'],
    'Meta': ['Meta', 'Facebook', 'Instagram', 'WhatsApp', 'Oculus', 'Reality Labs', 'Zuckerberg', 'Threads', 'Metaverse'],
    'OpenAI': ['OpenAI', 'ChatGPT', 'GPT-4', 'GPT-5', 'Sam Altman', 'DALL-E', 'Codex', 'Whisper', 'Sora'],
    'NVIDIA': ['NVIDIA', 'GeForce', 'CUDA', 'Jensen Huang', 'RTX', 'GPU', 'graphics card', 'tensor cores', 'AI chip'],
    'YCombinator': ['Y Combinator', 'YC', 'startup accelerator', 'Paul Graham', 'Demo Day', 'batch', 'incubator', 'Hacker News'],
    'ML': ['machine learning', 'neural', 'deep learning', 'LLM', 'transformer', 'dataset', 'algorithm', 'model', 'training'],
    'Ethics': ['bias', 'ethical', 'ethics', 'fairness', 'transparency', 'accountability', 'responsible AI', 'AI ethics'],
    'Privacy': ['privacy', 'data protection', 'GDPR', 'personal data', 'surveillance', 'encryption', 'data breach', 'confidential'],
    'Security': ['security', 'cybersecurity', 'vulnerability', 'hack', 'breach', 'malware', 'phishing', 'threat', 'exploit'],
    'Policy': ['policy', 'regulation', 'governance', 'legislation', 'government', 'regulatory', 'compliance', 'framework'],
    'Legal': ['legal', 'lawsuit', 'court', 'lawyer', 'attorney', 'litigation', 'law', 'copyright', 'patent'],
    'Healthcare': ['medical', 'patient', 'diagnosis', 'healthcare', 'clinical', 'doctor', 'hospital', 'health', 'medicine'],
    'Education': ['student', 'learning', 'education', 'training', 'course', 'university', 'school', 'teacher'],
    'Stocks': ['stock', 'shares', 'trading', 'investment', 'market cap', 'IPO', 'nasdaq', 'NYSE', 'portfolio']
};

// Function to categorize an article
function categorizeArticle(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    let bestCategory = 'General';
    let highestScore = 0;

    // Check company-specific categories first
    const companyCategories = ['Microsoft', 'Meta', 'OpenAI', 'NVIDIA', 'YCombinator'];
    for (const category of companyCategories) {
        const keywords = categoryKeywords[category];
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    // Check other categories
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (companyCategories.includes(category)) continue;
        
        let score = 0;
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                score++;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestCategory = category;
        }
    }

    return bestCategory;
}

// Function to strip HTML
function stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
}

// Function to escape XML
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Main function
async function updateRssFeed() {
    console.log('Starting RSS feed update...');
    const allArticles = [];
    let successfulFeeds = 0;

    // Fetch all feeds
    for (const feedUrl of RSS_FEEDS) {
        try {
            console.log(`Fetching feed: ${feedUrl}`);
            const response = await fetch(feedUrl);
            const xmlText = await response.text();
            
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(xmlText);
            
            if (result.feed && result.feed.entry) {
                const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
                
                for (const entry of entries) {
                    const title = entry.title?.[0] || 'No title';
                    const link = entry.link?.[0]?.$.href || '#';
                    const content = entry.content?.[0]?._ || entry.summary?.[0] || '';
                    const published = entry.published?.[0] || entry.updated?.[0] || new Date().toISOString();
                    
                    // Extract clean text
                    const cleanContent = stripHtml(content);
                    const excerpt = cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');
                    
                    // Extract source
                    const sourceMatch = content.match(/- ([^<]+)$/);
                    const source = sourceMatch ? sourceMatch[1] : 'AI News';
                    
                    // Categorize
                    const category = categorizeArticle(title, cleanContent);
                    
                    allArticles.push({
                        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
                        link,
                        excerpt,
                        source,
                        category,
                        published: new Date(published),
                        guid: link
                    });
                }
                
                successfulFeeds++;
                console.log(`Successfully processed feed with ${entries.length} entries`);
            }
        } catch (error) {
            console.error(`Error fetching feed ${feedUrl}:`, error.message);
        }
    }

    console.log(`Fetched ${allArticles.length} articles from ${successfulFeeds} feeds`);

    // Remove duplicates by title
    const uniqueArticles = Array.from(
        new Map(allArticles.map(item => [item.title, item])).values()
    );

    // Sort by date (newest first)
    uniqueArticles.sort((a, b) => b.published - a.published);

    // Take top 100 articles
    const topArticles = uniqueArticles.slice(0, 100);

    console.log(`Publishing ${topArticles.length} unique articles to RSS feed`);

    // Generate RSS XML
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Chatbot Genius - AI News &amp; Insights</title>
    <link>https://thechatbotgenius.com/ai-news.html</link>
    <description>Latest AI news curated from multiple sources by Jay Tarzwell, The Chatbot Genius</description>
    <language>en-us</language>
    <copyright>Copyright 2025 Jay Tarzwell</copyright>
    <managingEditor>jay@barkerhrs.com (Jay Tarzwell)</managingEditor>
    <webMaster>jay@barkerhrs.com (Jay Tarzwell)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://thechatbotgenius.com/feed.xml" rel="self" type="application/rss+xml" />
    <generator>The Chatbot Genius RSS Generator</generator>
    <ttl>180</ttl>
${topArticles.map(article => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.link)}</link>
      <description><![CDATA[${article.excerpt}]]></description>
      <author>jay@barkerhrs.com (via ${escapeXml(article.source)})</author>
      <guid isPermaLink="true">${escapeXml(article.guid)}</guid>
      <pubDate>${article.published.toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <source url="${escapeXml(article.link)}">${escapeXml(article.source)}</source>
    </item>`).join('\n')}
  </channel>
</rss>`;

    // Write to file
    const feedPath = path.join(__dirname, '..', '..', 'feed.xml');
    fs.writeFileSync(feedPath, rssContent);
    console.log('RSS feed updated successfully!');
}

// Run the update
updateRssFeed().catch(error => {
    console.error('Failed to update RSS feed:', error);
    process.exit(1);
});
