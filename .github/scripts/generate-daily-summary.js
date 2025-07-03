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

// Function to get yesterday's articles
function getYesterdaysArticles(articles) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return articles.filter(article => {
        const articleDate = new Date(article.fetchedDate);
        return articleDate >= yesterday && articleDate < today;
    });
}

// Function to generate chart URL using QuickChart.io
function generateCategoryChart(categoryCount) {
    // Sort categories by count and take top 6 for better visibility
    const sortedCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    
    const categories = sortedCategories.map(([cat, _]) => cat);
    const values = sortedCategories.map(([_, count]) => count);
    
    // Calculate total for "Other" category
    const totalArticles = Object.values(categoryCount).reduce((a, b) => a + b, 0);
    const topSixTotal = values.reduce((a, b) => a + b, 0);
    const otherCount = totalArticles - topSixTotal;
    
    if (otherCount > 0) {
        categories.push('Other');
        values.push(otherCount);
    }
    
    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#1a1f71', // Deep Indigo
                    '#4c5fd5', // Bright Indigo  
                    '#f9c74f', // Golden Yellow
                    '#f8961e', // Orange
                    '#f3722c', // Red Orange
                    '#90be6d', // Green
                    '#577590'  // Gray Blue for "Other"
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'AI News by Category',
                    font: {
                        size: 16
                    }
                }
            }
        }
    };
    
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=400&height=300&backgroundColor=white`;
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
4. Brief outlook for today (1-2 sentences)

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
            throw new Error(`OpenAI API error: ${response.status}`);
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
    <div id="daily-digest" style="background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%); padding: 30px; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <h2 style="color: #f9c74f; margin: 0; font-size: 2em;">📊 Daily AI Digest</h2>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 0.95rem;">As of 9:00 AM EST</p>
        </div>
        
        <h3 style="color: white; font-size: 1.8em; margin-bottom: 25px; line-height: 1.2; text-align: center;">${summary.headline}</h3>
        
        <div class="digest-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <!-- Key Trends Card -->
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #1a1f71; margin-bottom: 15px; font-size: 1.2em; display: flex; align-items: center; gap: 8px;">
                    <span>🔍</span> Key Trends
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${summary.keyTrends.map((trend, i) => `<li style="color: #333; margin-bottom: ${i === summary.keyTrends.length - 1 ? '0' : '12px'}; padding-left: 20px; position: relative; line-height: 1.5;"><span style="position: absolute; left: 0; color: #f9c74f;">▸</span> ${trend}</li>`).join('')}
                </ul>
            </div>
            
            <!-- Chart Card -->
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <img src="${chartUrl}" alt="Category Distribution Chart" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p style="margin-top: 10px; color: #666; font-size: 0.85em; text-align: center;">Analyzed ${articleCount} articles from the past 24 hours</p>
            </div>
            
            <!-- Top Story Card -->
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #1a1f71; margin-bottom: 15px; font-size: 1.2em; display: flex; align-items: center; gap: 8px;">
                    <span>🏆</span> Top Story
                </h4>
                <p style="color: #333; line-height: 1.6; margin: 0;">${summary.topStory}</p>
            </div>
            
            <!-- Today's Outlook Card -->
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #1a1f71; margin-bottom: 15px; font-size: 1.2em; display: flex; align-items: center; gap: 8px;">
                    <span>🔮</span> Today's Outlook
                </h4>
                <p style="color: #333; line-height: 1.6; margin: 0;">${summary.outlook}</p>
            </div>
        </div>
    </div>
    <!-- End Daily AI Digest -->
    
    <style>
        /* Mobile responsive for daily digest */
        @media (max-width: 768px) {
            #daily-digest {
                padding: 20px 15px;
            }
            
            #daily-digest h2 {
                font-size: 1.5em;
            }
            
            #daily-digest h3 {
                font-size: 1.3em;
                margin-bottom: 20px;
            }
            
            .digest-grid {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
        }
    </style>`;
    
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
    console.log('Starting daily summary generation...');
    
    // Load article database
    const database = loadArticleDatabase();
    const yesterdaysArticles = getYesterdaysArticles(database.articles);
    
    if (yesterdaysArticles.length === 0) {
        console.log('No articles found for yesterday');
        return;
    }
    
    console.log(`Found ${yesterdaysArticles.length} articles from yesterday`);
    
    // Count categories
    const categoryCount = {};
    yesterdaysArticles.forEach(article => {
        categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });
    
    // Generate AI summary
    const summary = await generateAISummary(yesterdaysArticles);
    
    if (!summary) {
        console.error('Failed to generate AI summary');
        return;
    }
    
    // Generate chart
    const chartUrl = generateCategoryChart(categoryCount);
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    // Update AI news page
    updateAINewsPage(summary, chartUrl, yesterdaysArticles.length, dateStr);
    
    // Save summary for weekly report
    saveDailySummary(summary, dateStr, yesterdaysArticles.length, categoryCount);
    
    console.log('Daily summary generation complete!');
}

// Run the generator
generateDailySummary().catch(error => {
    console.error('Failed to generate daily summary:', error);
    process.exit(1);
});
