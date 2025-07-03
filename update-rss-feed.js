#!/usr/bin/env node

/**
 * RSS Feed Generator for The Chatbot Genius AI News
 * 
 * This script can be used to update the RSS feed with new articles.
 * It reads article data and generates a properly formatted RSS XML file.
 */

const fs = require('fs');
const path = require('path');

// Function to escape XML special characters
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

// Function to format date for RSS
function formatRSSDate(date) {
    return new Date(date).toUTCString();
}

// Function to generate RSS feed
function generateRSSFeed(articles) {
    const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Chatbot Genius - AI News &amp; Insights</title>
    <link>https://thechatbotgenius.com/ai-news.html</link>
    <description>Latest AI news, insights, and analysis curated by Jay Tarzwell, The Chatbot Genius</description>
    <language>en-us</language>
    <copyright>Copyright 2025 Jay Tarzwell</copyright>
    <managingEditor>jay@barkerhrs.com (Jay Tarzwell)</managingEditor>
    <webMaster>jay@barkerhrs.com (Jay Tarzwell)</webMaster>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
    <atom:link href="https://thechatbotgenius.com/feed.xml" rel="self" type="application/rss+xml" />`;

    const rssItems = articles.map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.link)}</link>
      <description>
        <![CDATA[${article.excerpt}]]>
      </description>
      <author>jay@barkerhrs.com (Jay Tarzwell)</author>
      <guid isPermaLink="true">${escapeXml(article.link)}</guid>
      <pubDate>${formatRSSDate(article.date)}</pubDate>
      <category>${escapeXml(article.category)}</category>
    </item>`).join('');

    const rssFooter = `
  </channel>
</rss>`;

    return rssHeader + rssItems + rssFooter;
}

// Example usage:
// To use this script, you would pass in an array of article objects
// Each article should have: title, link, excerpt, date, category

// Sample article structure:
const sampleArticles = [
    {
        title: "Sample AI Article",
        link: "https://example.com/article",
        excerpt: "This is a sample article about AI...",
        date: new Date(),
        category: "AI"
    }
];

// If running directly, generate a sample feed
if (require.main === module) {
    const feedContent = generateRSSFeed(sampleArticles);
    console.log("Sample RSS Feed Generated:");
    console.log(feedContent);
    
    // To write to file:
    // fs.writeFileSync(path.join(__dirname, 'feed.xml'), feedContent);
}

module.exports = { generateRSSFeed, escapeXml, formatRSSDate };
