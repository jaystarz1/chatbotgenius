#!/usr/bin/env node

/**
 * AI Image Generator for Blog Posts
 * Generates custom images using DALL-E 3 or Stable Diffusion
 * Usage: node generate-blog-image.js [blog-post-file.html]
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const readline = require('readline');

// Configuration
const CONFIG_FILE = '.env.local';
const SUPPORTED_APIS = {
    OPENAI: 'OpenAI DALL-E 3',
    STABILITY: 'Stability AI (Stable Diffusion)',
    REPLICATE: 'Replicate (Multiple Models)'
};

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

// Read configuration
async function loadConfig() {
    try {
        const configContent = await fs.readFile(CONFIG_FILE, 'utf-8');
        const config = {};
        configContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
            }
        });
        return config;
    } catch (error) {
        console.log(`${colors.yellow}No configuration file found. Creating one...${colors.reset}`);
        return {};
    }
}

// Save configuration
async function saveConfig(config) {
    const configContent = Object.entries(config)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n');
    await fs.writeFile(CONFIG_FILE, configContent);
    console.log(`${colors.green}✓ Configuration saved to ${CONFIG_FILE}${colors.reset}`);
}

// Extract content from blog post
async function extractBlogContent(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract meta description
    const metaMatch = content.match(/<meta name="description" content="([^"]+)"/);
    const description = metaMatch ? metaMatch[1] : '';
    
    // Extract key topics from content
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/);
    const articleContent = articleMatch ? articleMatch[1] : '';
    
    // Extract first few paragraphs for context
    const paragraphs = articleContent.match(/<p>([^<]+)<\/p>/g) || [];
    const context = paragraphs.slice(0, 3).join(' ').replace(/<[^>]+>/g, '');
    
    return { title, description, context };
}

// Generate prompt from blog content
function generateImagePrompt(blogData, style = 'modern') {
    const { title, description, context } = blogData;
    
    // Analyze content for key themes
    const themes = [];
    
    // Tech/AI themes
    if (/AI|artificial intelligence|robot|automation/i.test(context)) {
        themes.push('futuristic', 'technology', 'digital');
    }
    
    // Business themes
    if (/business|corporate|company|CEO/i.test(context)) {
        themes.push('professional', 'corporate');
    }
    
    // Food/Restaurant themes
    if (/food|restaurant|drive.?through|fast food|Taco|McDonald/i.test(context)) {
        themes.push('restaurant', 'food service');
    }
    
    // Failure/Error themes
    if (/fail|error|mistake|wrong|crash|problem/i.test(context)) {
        themes.push('malfunction', 'chaos', 'confusion');
    }
    
    // Build the prompt
    let prompt = `Create a modern, eye-catching blog header image for an article titled "${title}". `;
    
    if (themes.length > 0) {
        prompt += `The image should convey themes of ${themes.join(', ')}. `;
    }
    
    // Add style preferences
    const styleGuides = {
        modern: 'Use a clean, modern design with bold colors and geometric shapes. Professional but engaging.',
        illustration: 'Create a stylized illustration with vibrant colors and creative visual metaphors.',
        photorealistic: 'Generate a photorealistic image with dramatic lighting and composition.',
        minimalist: 'Use minimalist design with plenty of white space and simple, iconic elements.',
        retro: 'Apply a retro-futuristic style with vintage colors and nostalgic tech aesthetics.'
    };
    
    prompt += styleGuides[style] || styleGuides.modern;
    prompt += ' The image should be suitable for a professional blog and work well as a social media preview.';
    prompt += ' Aspect ratio should be 16:9 for optimal display.';
    
    // Add specific details from the content
    if (description) {
        prompt += ` Context: ${description.substring(0, 150)}`;
    }
    
    return prompt;
}

// Generate image using OpenAI DALL-E 3
async function generateWithOpenAI(prompt, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1792x1024", // 16:9 aspect ratio
            quality: "hd",
            style: "vivid"
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(responseData);
                    if (response.data && response.data[0]) {
                        resolve({
                            url: response.data[0].url,
                            revisedPrompt: response.data[0].revised_prompt
                        });
                    } else if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        reject(new Error('Unexpected response format'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Download image from URL
async function downloadImage(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = require('fs').createWriteStream(outputPath);
        
        https.get(url, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve(outputPath);
            });
        }).on('error', (err) => {
            require('fs').unlink(outputPath, () => {}); // Delete the file on error
            reject(err);
        });
    });
}

// Convert image to optimized format (requires separate tool)
async function optimizeImage(imagePath) {
    // For now, we'll keep the original
    // In production, you'd use sharp or imagemin here
    console.log(`${colors.yellow}Note: Image optimization can be added with 'sharp' npm package${colors.reset}`);
    return imagePath;
}

// Update blog post with new image
async function updateBlogPost(blogPath, imagePath) {
    const content = await fs.readFile(blogPath, 'utf-8');
    const imageFileName = path.basename(imagePath);
    const imageUrl = `blog/images/${imageFileName}`;
    
    // Update Open Graph image
    let updated = content.replace(
        /<meta property="og:image" content="[^"]+"/,
        `<meta property="og:image" content="https://thechatbotgenius.com/${imageUrl}"`
    );
    
    // Update Twitter Card image
    updated = updated.replace(
        /<meta name="twitter:image" content="[^"]+"/,
        `<meta name="twitter:image" content="https://thechatbotgenius.com/${imageUrl}"`
    );
    
    // Add image to article if it doesn't have one
    if (!/<img[^>]+class="article-image"/.test(updated)) {
        // Find the article content start
        const articleStart = updated.indexOf('<article class="article-content">');
        const containerStart = updated.indexOf('<div class="article-container">', articleStart);
        const firstParagraph = updated.indexOf('<p>', containerStart);
        
        if (firstParagraph > -1) {
            const imageHTML = `
            <!-- AI-Generated Header Image -->
            <div class="article-image-container" style="margin: 2rem 0;">
                <img src="../images/${imageFileName}" 
                     alt="AI-generated illustration for this article" 
                     class="article-image"
                     style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem; font-style: italic;">
                    Image: AI-generated illustration
                </p>
            </div>
            
            `;
            updated = updated.slice(0, firstParagraph) + imageHTML + updated.slice(firstParagraph);
        }
    }
    
    await fs.writeFile(blogPath, updated);
    console.log(`${colors.green}✓ Blog post updated with new image${colors.reset}`);
}

// Interactive prompt
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

// Main function
async function main() {
    try {
        console.log(`${colors.cyan}${colors.bright}🎨 AI Blog Image Generator${colors.reset}`);
        console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
        
        // Load configuration
        let config = await loadConfig();
        
        // Check for API key
        if (!config.AI_IMAGE_API_KEY) {
            console.log(`${colors.yellow}No API key found. Let's set one up.${colors.reset}`);
            console.log('\nSupported services:');
            Object.entries(SUPPORTED_APIS).forEach(([key, name]) => {
                console.log(`  • ${name}`);
            });
            
            const apiKey = await prompt('\nEnter your API key (OpenAI recommended): ');
            const apiType = await prompt('API type (OPENAI/STABILITY/REPLICATE) [OPENAI]: ') || 'OPENAI';
            
            config.AI_IMAGE_API_KEY = apiKey;
            config.AI_IMAGE_API_TYPE = apiType;
            await saveConfig(config);
        }
        
        // Get blog post file
        const blogFile = process.argv[2];
        if (!blogFile) {
            console.log(`${colors.red}Usage: node generate-blog-image.js [blog-post.html]${colors.reset}`);
            console.log('Example: node generate-blog-image.js blog/ai-drive-through-fiasco.html');
            process.exit(1);
        }
        
        // Check if file exists
        try {
            await fs.access(blogFile);
        } catch {
            console.log(`${colors.red}Error: Blog post file not found: ${blogFile}${colors.reset}`);
            process.exit(1);
        }
        
        // Extract blog content
        console.log(`\n${colors.blue}📄 Analyzing blog post...${colors.reset}`);
        const blogData = await extractBlogContent(blogFile);
        console.log(`Title: ${blogData.title}`);
        
        // Generate prompt
        console.log(`\n${colors.blue}🤖 Generating image prompt...${colors.reset}`);
        const imagePrompt = generateImagePrompt(blogData);
        console.log(`Prompt preview: ${imagePrompt.substring(0, 150)}...`);
        
        // Allow user to customize
        const customize = await prompt('\nCustomize prompt? (y/N): ');
        let finalPrompt = imagePrompt;
        if (customize.toLowerCase() === 'y') {
            console.log('\nCurrent prompt:');
            console.log(imagePrompt);
            const customPrompt = await prompt('\nEnter custom prompt (or press Enter to keep current): ');
            if (customPrompt) {
                finalPrompt = customPrompt;
            }
        }
        
        // Generate image
        console.log(`\n${colors.blue}🎨 Generating image with ${config.AI_IMAGE_API_TYPE}...${colors.reset}`);
        
        let imageResult;
        switch (config.AI_IMAGE_API_TYPE) {
            case 'OPENAI':
                imageResult = await generateWithOpenAI(finalPrompt, config.AI_IMAGE_API_KEY);
                break;
            default:
                console.log(`${colors.yellow}Note: Only OpenAI is fully implemented. Add other APIs as needed.${colors.reset}`);
                imageResult = await generateWithOpenAI(finalPrompt, config.AI_IMAGE_API_KEY);
        }
        
        console.log(`${colors.green}✓ Image generated successfully${colors.reset}`);
        if (imageResult.revisedPrompt) {
            console.log(`Revised prompt: ${imageResult.revisedPrompt.substring(0, 150)}...`);
        }
        
        // Download image
        console.log(`\n${colors.blue}📥 Downloading image...${colors.reset}`);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const imageName = path.basename(blogFile, '.html') + `-ai-${timestamp}.png`;
        const imagePath = path.join('blog/images', imageName);
        
        await downloadImage(imageResult.url, imagePath);
        console.log(`${colors.green}✓ Image saved to ${imagePath}${colors.reset}`);
        
        // Optimize image
        await optimizeImage(imagePath);
        
        // Update blog post
        const updatePost = await prompt('\nUpdate blog post with new image? (Y/n): ');
        if (updatePost.toLowerCase() !== 'n') {
            await updateBlogPost(blogFile, imagePath);
        }
        
        console.log(`\n${colors.green}${colors.bright}✨ Complete! Your AI-generated blog image is ready.${colors.reset}`);
        console.log(`Image location: ${imagePath}`);
        console.log('\nNext steps:');
        console.log('1. Review the image in your blog post');
        console.log('2. Commit and push changes to deploy');
        console.log('3. The image will be live at: https://thechatbotgenius.com/' + imagePath);
        
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}