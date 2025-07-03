const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
require('dotenv').config();

// Function to load daily summaries
function loadDailySummaries() {
    const summariesPath = path.join(__dirname, '..', '..', 'daily-summaries.json');
    try {
        if (fs.existsSync(summariesPath)) {
            const data = fs.readFileSync(summariesPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading daily summaries:', error);
    }
    return [];
}

// Function to get last 7 days of summaries
function getLastWeekSummaries(summaries) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return summaries.filter(summary => {
        const summaryDate = new Date(summary.date);
        return summaryDate >= oneWeekAgo;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Function to generate trend chart using QuickChart.io
function generateTrendChart(weekSummaries) {
    const dates = weekSummaries.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const articleCounts = weekSummaries.map(s => s.articleCount);
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Articles per Day',
                data: articleCounts,
                borderColor: '#4c5fd5',
                backgroundColor: 'rgba(76, 95, 213, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                pointBackgroundColor: '#1a1f71',
                pointBorderColor: '#f9c74f',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly AI News Volume Trend',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=700&height=400&backgroundColor=white`;
    return chartUrl;
}

// Function to generate category breakdown chart
function generateCategoryBreakdownChart(weekSummaries) {
    const totalCategories = {};
    
    weekSummaries.forEach(summary => {
        Object.entries(summary.categoryBreakdown || {}).forEach(([category, count]) => {
            totalCategories[category] = (totalCategories[category] || 0) + count;
        });
    });
    
    const sortedCategories = Object.entries(totalCategories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const chartConfig = {
        type: 'pie',
        data: {
            labels: sortedCategories.map(c => c[0]),
            datasets: [{
                data: sortedCategories.map(c => c[1]),
                backgroundColor: [
                    '#1a1f71', '#4c5fd5', '#f9c74f', '#f8961e',
                    '#f3722c', '#90be6d', '#43aa8b', '#577590'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Category Distribution',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'right'
                }
            }
        }
    };
    
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=700&height=400&backgroundColor=white`;
    return chartUrl;
}

// Function to call OpenAI API for weekly analysis
async function generateWeeklyAnalysis(weekSummaries) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.error('OpenAI API key not found!');
        return null;
    }
    
    // Prepare daily summaries for analysis
    const dailyInsights = weekSummaries.map(s => 
        `${s.date}: ${s.summary.headline}\nKey trends: ${s.summary.keyTrends.join('; ')}\nTop story: ${s.summary.topStory}`
    ).join('\n\n');
    
    const prompt = `You are an AI industry analyst creating a comprehensive weekly report. Analyze these daily AI news summaries from the past week:

${dailyInsights}

Create a professional weekly analysis with:
1. A compelling weekly headline (max 12 words)
2. Executive summary (3-4 sentences capturing the week's most important developments)
3. Major themes of the week (3-4 themes, 2-3 sentences each)
4. Key players and companies making news (with brief context)
5. Emerging trends to watch (2-3 forward-looking insights)
6. Strategic implications for businesses (2-3 actionable insights)

Format the response as JSON with keys: headline, executiveSummary, majorThemes (array of {title, description}), keyPlayers (array of {name, context}), emergingTrends (array), strategicImplications (array)`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'system',
                    content: 'You are a professional AI industry analyst creating insightful weekly reports that help business leaders understand AI trends.'
                }, {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1200,
                response_format: { type: "json_object" }
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return null;
    }
}

// Function to create AI Insights page if it doesn't exist
function ensureAIInsightsPage() {
    const insightsPath = path.join(__dirname, '..', '..', 'ai-insights.html');
    
    if (!fs.existsSync(insightsPath)) {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Insights - Weekly Analysis | The Chatbot Genius</title>
    <meta name="description" content="Weekly AI industry analysis and insights by The Chatbot Genius. Stay ahead with comprehensive reports on AI trends, key players, and strategic implications.">
    
    <!-- Inline CSS for reliability -->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        /* Navigation */
        nav {
            background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        nav .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        nav .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #f9c74f;
            text-decoration: none;
        }
        
        nav ul {
            list-style: none;
            display: flex;
            gap: 2rem;
        }
        
        nav a {
            color: white;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        nav a:hover {
            color: #f9c74f;
        }
        
        /* Main Content */
        main {
            margin-top: 80px;
            padding: 2rem 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .page-header {
            background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
            color: white;
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .page-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #f9c74f;
        }
        
        .page-header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        /* Weekly Reports Container */
        #weekly-reports {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .weekly-report {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .report-header {
            border-bottom: 3px solid #f9c74f;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        
        .report-date {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .report-headline {
            font-size: 2rem;
            color: #1a1f71;
            margin-bottom: 1rem;
        }
        
        .executive-summary {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            border-left: 4px solid #4c5fd5;
        }
        
        .report-section {
            margin-bottom: 2rem;
        }
        
        .report-section h3 {
            color: #1a1f71;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .theme-item, .player-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .theme-item h4, .player-item h4 {
            color: #4c5fd5;
            margin-bottom: 0.5rem;
        }
        
        .chart-container {
            text-align: center;
            margin: 2rem 0;
        }
        
        .chart-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        /* RSS Feed Link */
        .rss-link {
            text-align: center;
            margin: 3rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .rss-link a {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #4c5fd5;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
        }
        
        .rss-link a:hover {
            color: #1a1f71;
        }
        
        /* Footer */
        footer {
            background: #1a1f71;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            nav ul {
                display: none;
            }
            
            .page-header h1 {
                font-size: 2rem;
            }
            
            .report-headline {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <a href="index.html" class="logo">The Chatbot Genius</a>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="books.html">Books</a></li>
                <li><a href="ai-news.html">AI News</a></li>
                <li><a href="ai-insights.html">AI Insights</a></li>
                <li><a href="projects.html">Projects</a></li>
            </ul>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main>
        <div class="page-header">
            <div class="container">
                <h1>AI Insights</h1>
                <p>Weekly Analysis of AI Industry Trends and Developments</p>
            </div>
        </div>
        
        <div class="container">
            <!-- Weekly Reports Container -->
            <div id="weekly-reports">
                <!-- Reports will be inserted here -->
            </div>
            
            <!-- RSS Feed Link -->
            <div class="rss-link">
                <a href="insights-feed.xml">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3.75 3.75v2.5A10.003 10.003 0 0113.75 16.25h2.5A12.503 12.503 0 003.75 3.75z"/>
                        <path d="M3.75 8.75v2.5c2.9 0 5 2.1 5 5h2.5c0-4.1-3.4-7.5-7.5-7.5z"/>
                        <circle cx="5" cy="15" r="1.25"/>
                    </svg>
                    Subscribe to Weekly AI Insights RSS Feed
                </a>
            </div>
        </div>
    </main>
    
    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2025 The Chatbot Genius. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
        
        fs.writeFileSync(insightsPath, htmlContent);
        console.log('Created AI Insights page');
    }
}

// Function to add weekly report to AI Insights page
function addWeeklyReport(analysis, weekStart, weekEnd, trendChartUrl, categoryChartUrl, totalArticles) {
    const insightsPath = path.join(__dirname, '..', '..', 'ai-insights.html');
    let htmlContent = fs.readFileSync(insightsPath, 'utf8');
    
    // Create the report HTML
    const reportHtml = `
                <article class="weekly-report">
                    <div class="report-header">
                        <div class="report-date">Week of ${weekStart} - ${weekEnd}</div>
                        <h2 class="report-headline">${analysis.headline}</h2>
                    </div>
                    
                    <div class="executive-summary">
                        <h3>Executive Summary</h3>
                        <p>${analysis.executiveSummary}</p>
                    </div>
                    
                    <div class="chart-container">
                        <img src="${trendChartUrl}" alt="Weekly trend chart">
                    </div>
                    
                    <div class="report-section">
                        <h3>Major Themes</h3>
                        ${analysis.majorThemes.map(theme => `
                        <div class="theme-item">
                            <h4>${theme.title}</h4>
                            <p>${theme.description}</p>
                        </div>`).join('')}
                    </div>
                    
                    <div class="chart-container">
                        <img src="${categoryChartUrl}" alt="Category distribution chart">
                    </div>
                    
                    <div class="report-section">
                        <h3>Key Players</h3>
                        ${analysis.keyPlayers.map(player => `
                        <div class="player-item">
                            <h4>${player.name}</h4>
                            <p>${player.context}</p>
                        </div>`).join('')}
                    </div>
                    
                    <div class="report-section">
                        <h3>Emerging Trends</h3>
                        <ul style="list-style-position: inside; color: #666;">
                            ${analysis.emergingTrends.map(trend => `<li style="margin-bottom: 0.5rem;">${trend}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="report-section">
                        <h3>Strategic Implications</h3>
                        <ul style="list-style-position: inside; color: #666;">
                            ${analysis.strategicImplications.map(implication => `<li style="margin-bottom: 0.5rem;">${implication}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee; color: #666;">
                        <p>📊 Analyzed ${totalArticles} articles this week</p>
                    </div>
                </article>`;
    
    // Insert at the beginning of weekly-reports div
    const reportsPattern = /<div id="weekly-reports">\s*<!-- Reports will be inserted here -->/;
    htmlContent = htmlContent.replace(reportsPattern, `<div id="weekly-reports">\n                <!-- Reports will be inserted here -->${reportHtml}`);
    
    fs.writeFileSync(insightsPath, htmlContent);
    console.log('Weekly report added to AI Insights page');
}

// Function to generate insights RSS feed
function generateInsightsRSSFeed(analysis, weekStart, weekEnd) {
    const feedPath = path.join(__dirname, '..', '..', 'insights-feed.xml');
    let existingItems = '';
    
    // Load existing feed if it exists
    if (fs.existsSync(feedPath)) {
        const existingFeed = fs.readFileSync(feedPath, 'utf8');
        const itemsMatch = existingFeed.match(/<item>[\s\S]*<\/item>/g);
        if (itemsMatch) {
            existingItems = itemsMatch.slice(0, 50).join('\n    '); // Keep last 50 items
        }
    }
    
    const newItem = `<item>
      <title>${analysis.headline}</title>
      <link>https://thechatbotgenius.com/ai-insights.html</link>
      <description><![CDATA[${analysis.executiveSummary}]]></description>
      <author>jay@thechatbotgenius.com (Jay Tarzwell)</author>
      <guid isPermaLink="false">weekly-report-${weekEnd}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>AI Analysis</category>
    </item>`;
    
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Chatbot Genius - Weekly AI Insights</title>
    <link>https://thechatbotgenius.com/ai-insights.html</link>
    <description>Weekly AI industry analysis and insights by The Chatbot Genius</description>
    <language>en-us</language>
    <copyright>Copyright 2025 Jay Tarzwell</copyright>
    <managingEditor>jay@thechatbotgenius.com (Jay Tarzwell)</managingEditor>
    <webMaster>jay@thechatbotgenius.com (Jay Tarzwell)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://thechatbotgenius.com/insights-feed.xml" rel="self" type="application/rss+xml" />
    <generator>The Chatbot Genius Weekly Report Generator</generator>
    <ttl>10080</ttl>
    ${newItem}
    ${existingItems}
  </channel>
</rss>`;
    
    fs.writeFileSync(feedPath, rssContent);
    console.log('Insights RSS feed updated');
}

// Function to update homepage with latest insight
function updateHomepageWithLatestInsight(analysis) {
    const homePath = path.join(__dirname, '..', '..', 'index.html');
    let htmlContent = fs.readFileSync(homePath, 'utf8');
    
    // Create the latest insight section
    const insightHtml = `
        <!-- Latest AI Analysis Section -->
        <section id="latest-insight" style="padding: 60px 0; background: #f8f9fa;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <h2 style="text-align: center; font-size: 2.5rem; color: #1a1f71; margin-bottom: 40px;">Latest AI Analysis</h2>
                
                <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #f9c74f;">
                    <h3 style="color: #4c5fd5; font-size: 1.8rem; margin-bottom: 20px;">${analysis.headline}</h3>
                    <p style="color: #666; line-height: 1.8; margin-bottom: 20px;">${analysis.executiveSummary}</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="ai-insights.html" style="display: inline-block; background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%); color: white; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; transition: transform 0.3s;">
                            Read Full Weekly Report →
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!-- End Latest AI Analysis Section -->`;
    
    // Find where to insert (after services section)
    const servicesEndPattern = /<\/section>\s*<!-- End Services Section -->/;
    const match = htmlContent.match(servicesEndPattern);
    
    if (match) {
        // Remove any existing latest insight section
        htmlContent = htmlContent.replace(/<!-- Latest AI Analysis Section -->[\s\S]*?<!-- End Latest AI Analysis Section -->/g, '');
        
        // Insert the new section
        const insertPosition = match.index + match[0].length;
        htmlContent = htmlContent.slice(0, insertPosition) + '\n' + insightHtml + htmlContent.slice(insertPosition);
        
        fs.writeFileSync(homePath, htmlContent);
        console.log('Homepage updated with latest insight');
    }
}

// Main function
async function generateWeeklyReport() {
    console.log('Starting weekly report generation...');
    
    // Ensure AI Insights page exists
    ensureAIInsightsPage();
    
    // Load daily summaries
    const summaries = loadDailySummaries();
    const weekSummaries = getLastWeekSummaries(summaries);
    
    if (weekSummaries.length < 3) {
        console.log('Not enough daily summaries for weekly report (need at least 3)');
        return;
    }
    
    console.log(`Found ${weekSummaries.length} daily summaries for the week`);
    
    // Calculate total articles
    const totalArticles = weekSummaries.reduce((sum, s) => sum + s.articleCount, 0);
    
    // Generate AI analysis
    const analysis = await generateWeeklyAnalysis(weekSummaries);
    
    if (!analysis) {
        console.error('Failed to generate weekly analysis');
        return;
    }
    
    // Generate charts
    const trendChartUrl = generateTrendChart(weekSummaries);
    const categoryChartUrl = generateCategoryBreakdownChart(weekSummaries);
    
    // Get week dates
    const weekStart = new Date(weekSummaries[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const weekEnd = new Date(weekSummaries[weekSummaries.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Add report to AI Insights page
    addWeeklyReport(analysis, weekStart, weekEnd, trendChartUrl, categoryChartUrl, totalArticles);
    
    // Generate RSS feed for insights
    generateInsightsRSSFeed(analysis, weekStart, weekEnd);
    
    // Update homepage with latest insight
    updateHomepageWithLatestInsight(analysis);
    
    console.log('Weekly report generation complete!');
}

// Run the generator
generateWeeklyReport().catch(error => {
    console.error('Failed to generate weekly report:', error);
    process.exit(1);
});
