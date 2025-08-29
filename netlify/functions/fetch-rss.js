exports.handler = async (event, context) => {
  // CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // RSS feed URLs - Google Alerts feeds
  const rssFeeds = [
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

  // Category keywords for article classification
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
  function categorizeArticle(title, excerpt) {
    const text = (title + ' ' + excerpt).toLowerCase();
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

  // Function to parse XML without external dependencies
  function parseXML(xml) {
    const items = [];
    
    // Extract all entry elements
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      
      // Extract fields from entry
      const title = (entry.match(/<title[^>]*>([\s\S]*?)<\/title>/) || ['', ''])[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/) || ['', ''];
      const link = linkMatch[1];
      
      const content = (entry.match(/<content[^>]*>([\s\S]*?)<\/content>/) || ['', ''])[1];
      const published = (entry.match(/<published>([\s\S]*?)<\/published>/) || ['', new Date().toISOString()])[1];
      
      // Clean content - remove HTML tags and decode entities
      const cleanContent = content
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      
      // Extract source from content if possible
      const sourceMatch = content.match(/- ([^<]+)$/);
      const source = sourceMatch ? sourceMatch[1].trim() : 'AI News';
      
      // Create excerpt
      const excerpt = cleanContent.substring(0, 200) + (cleanContent.length > 200 ? '...' : '');
      
      if (title && link) {
        items.push({
          title,
          link,
          excerpt,
          content: cleanContent,
          source,
          published: new Date(published)
        });
      }
    }
    
    return items;
  }

  try {
    const allNewsItems = [];
    let successfulFeeds = 0;
    
    // Fetch each feed
    for (const feedUrl of rssFeeds) {
      try {
        const response = await fetch(feedUrl);
        
        if (response.ok) {
          const xmlText = await response.text();
          const items = parseXML(xmlText);
          
          // Process and categorize items
          items.forEach(item => {
            const category = categorizeArticle(item.title, item.excerpt);
            allNewsItems.push({
              ...item,
              category,
              dateString: item.published.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            });
          });
          
          successfulFeeds++;
        }
      } catch (feedError) {
        console.error('Error fetching feed:', feedUrl, feedError);
      }
    }
    
    // Remove duplicates by title
    const uniqueItems = Array.from(
      new Map(allNewsItems.map(item => [item.title, item])).values()
    );
    
    // Sort by date (newest first)
    uniqueItems.sort((a, b) => b.published - a.published);
    
    // Take top 100 items
    const displayItems = uniqueItems.slice(0, 100);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        feedsProcessed: successfulFeeds,
        totalFeeds: rssFeeds.length,
        articles: displayItems,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Error in RSS fetch function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        feedsProcessed: 0,
        articles: []
      })
    };
  }
};