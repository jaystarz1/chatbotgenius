const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
require('dotenv').config();

// Function to load article database
function loadArticleDatabase() {
    const dbPath = path.join(__dirname, '..', '..', 'article-database.json');
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading article database:', error);
    }
    return { articles: [] };
}

// Function to get yesterday's articles (modified for testing to get all articles)
function getTestArticles(articles) {
    // For testing, just return all articles in the database
    return articles;
}

// Function to generate chart URL using QuickChart.io
function generateCategoryChart(categoryCount) {
    const categories = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a]);
    const values = categories.map(cat => categoryCount[cat]);
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: categories.slice(0, 10), // Top 10 categories
            datasets: [{
                label: 'Article Count',
                data: values.slice(0, 10),
                backgroundColor: '#4c5fd5',
                borderColor: '#1a1f71',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'AI News Distribution by Category',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };
    
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=600&height=400&backgroundColor=white`;
    return chartUrl;
}

// Function to call OpenAI API
async function generateAISummary(articles) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.error('OpenAI API key not found!');
        return null;
    }
    
    // Prepare article summaries for the prompt
    const articleSummaries = articles.slice(0, 50).map(article => 
        `[${article.category}] ${article.title}: ${article.excerpt}`
    ).join('\n\n');
    
    const prompt = `You are an AI news analyst. Analyze these AI news articles from the past 24 hours and create a concise daily summary.

Articles:
${articleSummaries}

Create a professional summary with:
1. A compelling headline (max 10 words)
2. 3-4 key trends or insights (1-2 sentences each)
3. Most significant development of the day (2-3 sentences)
4. Brief outlook for tomorrow (1-2 sentences)

Format the response as JSON with keys: headline, keyTrends (array), topStory, outlook`;

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
                    content: 'You are a professional AI news analyst creating concise, insightful summaries.'
                }, {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 800,
                response_format: { type: "json_object" }
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return null;
    }
}

// Function to update AI news page with daily summary
function updateAINewsPage(summary, chartUrl, articleCount, date) {
    const aiNewsPath = path.join(__dirname, '..', '..', 'ai-news.html');
    let htmlContent = fs.readFileSync(aiNewsPath, 'utf8');
    
    // Create the daily digest HTML
    const dailyDigestHtml = `
    <!-- Daily AI Digest -->
    <div id="daily-digest" style="background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #f9c74f; margin-bottom: 10px; font-size: 2em;">📊 Daily AI Digest</h2>
        <p style="opacity: 0.9; margin-bottom: 20px;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h3 style="color: white; font-size: 1.8em; margin-bottom: 20px; line-height: 1.2;">${summary.headline}</h3>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #f9c74f; margin-bottom: 15px;">🔍 Key Trends</h4>
            <ul style="list-style: none; padding: 0;">
                ${summary.keyTrends.map(trend => `<li style="margin-bottom: 10px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #f9c74f;">▸</span> ${trend}</li>`).join('')}
            </ul>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #f9c74f; margin-bottom: 10px;">🏆 Top Story</h4>
            <p style="line-height: 1.6;">${summary.topStory}</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #f9c74f; margin-bottom: 10px;">🔮 Tomorrow's Outlook</h4>
            <p style="line-height: 1.6;">${summary.outlook}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <img src="${chartUrl}" alt="Category Distribution Chart" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">
            <p style="margin-top: 10px; opacity: 0.8; font-size: 0.9em;">Analyzed ${articleCount} articles from the past 24 hours</p>
        </div>
    </div>
    <!-- End Daily AI Digest -->`;
    
    // Find the main container after the search box and insert the digest
    const searchBoxEndPattern = /<\/div>\s*<!-- End Search and Filter -->/;
    const match = htmlContent.match(searchBoxEndPattern);
    
    if (match) {
        // Remove any existing daily digest
        htmlContent = htmlContent.replace(/<!-- Daily AI Digest -->[\s\S]*?<!-- End Daily AI Digest -->/g, '');
        
        // Insert the new digest after the search box
        const insertPosition = match.index + match[0].length;
        htmlContent = htmlContent.slice(0, insertPosition) + '\n' + dailyDigestHtml + htmlContent.slice(insertPosition);
        
        fs.writeFileSync(aiNewsPath, htmlContent);
        console.log('AI News page updated with daily digest');
    } else {
        console.error('Could not find insertion point in AI News page');
    }
}

// Function to save daily summary to file
function saveDailySummary(summary, date, articleCount, categoryBreakdown) {
    const summariesPath = path.join(__dirname, '..', '..', 'daily-summaries.json');
    let summaries = [];
    
    try {
        if (fs.existsSync(summariesPath)) {
            const data = fs.readFileSync(summariesPath, 'utf8');
            summaries = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading daily summaries:', error);
    }
    
    // Add new summary
    summaries.push({
        date: date,
        summary: summary,
        articleCount: articleCount,
        categoryBreakdown: categoryBreakdown,
        generatedAt: new Date().toISOString()
    });
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    summaries = summaries.filter(s => new Date(s.date) > thirtyDaysAgo);
    
    fs.writeFileSync(summariesPath, JSON.stringify(summaries, null, 2));
    console.log('Daily summary saved');
}

// Main function
async function generateDailySummary() {
    console.log('Starting TEST daily summary generation...');
    
    // Load article database
    const database = loadArticleDatabase();
    const testArticles = getTestArticles(database.articles);
    
    if (testArticles.length === 0) {
        console.log('No articles found in test database');
        return;
    }
    
    console.log(`Found ${testArticles.length} articles for testing`);
    
    // Count categories
    const categoryCount = {};
    testArticles.forEach(article => {
        categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });
    
    // Generate AI summary
    console.log('Calling OpenAI API...');
    const summary = await generateAISummary(testArticles);
    
    if (!summary) {
        console.error('Failed to generate AI summary');
        return;
    }
    
    console.log('Summary generated:', summary);
    
    // Generate chart
    const chartUrl = generateCategoryChart(categoryCount);
    console.log('Chart URL:', chartUrl);
    
    // Use today's date for testing
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Update AI news page
    updateAINewsPage(summary, chartUrl, testArticles.length, dateStr);
    
    // Save summary for weekly report
    saveDailySummary(summary, dateStr, testArticles.length, categoryCount);
    
    console.log('TEST daily summary generation complete!');
}

// Run the generator
generateDailySummary().catch(error => {
    console.error('Failed to generate daily summary:', error);
    process.exit(1);
});
