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
const sharp = require('sharp');

// Configuration - check both .env and .env.local
const CONFIG_FILES = ['.env', '.env.local'];
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
    let config = {};
    
    // Try to read from existing config files
    for (const configFile of CONFIG_FILES) {
        try {
            const configContent = await fs.readFile(configFile, 'utf-8');
            configContent.split('\n').forEach(line => {
                if (line.trim() && !line.trim().startsWith('#')) {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        config[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                    }
                }
            });
            console.log(`${colors.green}✓ Loaded configuration from ${configFile}${colors.reset}`);
            
            // Map OPENAI_API_KEY to AI_IMAGE_API_KEY if not set
            if (!config.AI_IMAGE_API_KEY && config.OPENAI_API_KEY) {
                config.AI_IMAGE_API_KEY = config.OPENAI_API_KEY;
                config.AI_IMAGE_API_TYPE = 'OPENAI';
                console.log(`${colors.cyan}Using existing OpenAI API key from ${configFile}${colors.reset}`);
            }
            
            return config;
        } catch (error) {
            // Try next file
        }
    }
    
    console.log(`${colors.yellow}No configuration file found. You'll need to set up API keys.${colors.reset}`);
    return config;
}

// Save configuration
async function saveConfig(config) {
    const configFile = CONFIG_FILES[0]; // Save to .env by default
    const configContent = Object.entries(config)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n');
    await fs.writeFile(configFile, configContent);
    console.log(`${colors.green}✓ Configuration saved to ${configFile}${colors.reset}`);
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

// Generate prompt from blog content - DRAMATIC COMIC STYLE
function generateImagePrompt(blogData, style = 'comic') {
    const { title, description, context } = blogData;
    
    // Extract the core theme/subject from the title
    let theme = 'business mystery';
    if (title.toLowerCase().includes('ai')) {
        if (title.toLowerCase().includes('shame') || title.toLowerCase().includes('hide')) {
            theme = 'executive in shadow hiding something';
        } else if (title.toLowerCase().includes('job') || title.toLowerCase().includes('work')) {
            theme = 'office workers looking worried';
        } else if (title.toLowerCase().includes('drive') || title.toLowerCase().includes('taco')) {
            theme = 'chaotic fast food restaurant';
        }
    }
    
    // Sanitize title for safety
    const cleanTitle = title
        .replace(/threat|crisis|problem|failure|gap|risk|danger|fiasco|disaster|wrong/gi, 'challenge')
        .replace(/stupid|fucking|shit|damn|hell/gi, '')
        .substring(0, 60);
    
    // Build a DRAMATIC COMIC prompt
    let prompt = `1960s pulp detective novel cover illustration. `;
    
    // Add specific scene based on content
    if (title.toLowerCase().includes('shame') || title.toLowerCase().includes('hide')) {
        prompt += `Businessman in suit looking over shoulder nervously in dark office. `;
        prompt += `Dramatic shadows, venetian blind lighting. `;
    } else if (title.toLowerCase().includes('workforce') || title.toLowerCase().includes('prepared')) {
        prompt += `Group of office workers looking up at giant computer screen with concern. `;
        prompt += `Dramatic perspective, film noir lighting. `;
    } else if (title.toLowerCase().includes('expectation') || title.toLowerCase().includes('reality')) {
        prompt += `Split scene showing optimistic vision vs harsh reality. `;
        prompt += `Dramatic contrast, noir style. `;
    } else {
        prompt += `Office scene with dramatic tension and mystery. `;
        prompt += `Film noir lighting through venetian blinds. `;
    }
    
    prompt += `Style: 1960s comic book art, bold colors, dramatic angles. `;
    prompt += `Color palette: deep blues, gold yellows, high contrast. `;
    prompt += `Pulp fiction aesthetic, vintage poster style. `;
    prompt += `Title text: "${cleanTitle.substring(0, 30)}" in bold retro font. `;
    prompt += `Aspect ratio 16:9.`;
    
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

// Convert image to optimized format using Sharp
async function optimizeImage(imagePath) {
    try {
        const originalStats = await fs.stat(imagePath);
        const originalSizeKB = (originalStats.size / 1024).toFixed(2);
        
        // Read the original image
        const imageBuffer = await fs.readFile(imagePath);
        
        // Optimize with Sharp
        const optimizedBuffer = await sharp(imageBuffer)
            .png({
                quality: 85,  // Slightly reduce quality for smaller file size
                compressionLevel: 9,  // Maximum compression
                effort: 10  // Maximum effort for compression
            })
            .resize(1792, 1024, {  // Ensure consistent size (16:9 ratio)
                fit: 'inside',
                withoutEnlargement: true
            })
            .toBuffer();
        
        // Write the optimized image back
        await fs.writeFile(imagePath, optimizedBuffer);
        
        const optimizedStats = await fs.stat(imagePath);
        const optimizedSizeKB = (optimizedStats.size / 1024).toFixed(2);
        const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
        
        console.log(`${colors.green}✓ Image optimized: ${originalSizeKB}KB → ${optimizedSizeKB}KB (${savings}% reduction)${colors.reset}`);
        
        return imagePath;
    } catch (error) {
        console.log(`${colors.yellow}Warning: Image optimization failed, keeping original${colors.reset}`);
        console.error(error.message);
        return imagePath;
    }
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
                <img src="images/${imageFileName}" 
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
        // Check if running in automatic mode (from git hook)
        const autoMode = process.env.AUTO_MODE === 'true';
        
        if (!autoMode) {
            console.log(`${colors.cyan}${colors.bright}🎨 AI Blog Image Generator${colors.reset}`);
            console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
        }
        
        // Load configuration
        let config = await loadConfig();
        
        // Check for API key
        if (!config.AI_IMAGE_API_KEY) {
            if (autoMode) {
                // In auto mode, skip if no API key
                console.log('No API key configured. Skipping image generation.');
                process.exit(0);
            }
            
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
        if (!autoMode) {
            console.log(`\n${colors.blue}📄 Analyzing blog post...${colors.reset}`);
        }
        const blogData = await extractBlogContent(blogFile);
        if (!autoMode) {
            console.log(`Title: ${blogData.title}`);
        }
        
        // Generate prompt
        if (!autoMode) {
            console.log(`\n${colors.blue}🤖 Generating image prompt...${colors.reset}`);
        }
        const imagePrompt = generateImagePrompt(blogData);
        if (!autoMode) {
            console.log(`Prompt preview: ${imagePrompt.substring(0, 150)}...`);
        }
        
        // Allow user to customize (skip in auto mode)
        let finalPrompt = imagePrompt;
        if (!autoMode) {
            const customize = await prompt('\nCustomize prompt? (y/N): ');
            if (customize.toLowerCase() === 'y') {
                console.log('\nCurrent prompt:');
                console.log(imagePrompt);
                const customPrompt = await prompt('\nEnter custom prompt (or press Enter to keep current): ');
                if (customPrompt) {
                    finalPrompt = customPrompt;
                }
            }
        }
        
        // Generate image
        if (!autoMode) {
            console.log(`\n${colors.blue}🎨 Generating image with ${config.AI_IMAGE_API_TYPE}...${colors.reset}`);
        }
        
        let imageResult;
        switch (config.AI_IMAGE_API_TYPE) {
            case 'OPENAI':
                imageResult = await generateWithOpenAI(finalPrompt, config.AI_IMAGE_API_KEY);
                break;
            default:
                console.log(`${colors.yellow}Note: Only OpenAI is fully implemented. Add other APIs as needed.${colors.reset}`);
                imageResult = await generateWithOpenAI(finalPrompt, config.AI_IMAGE_API_KEY);
        }
        
        if (!autoMode) {
            console.log(`${colors.green}✓ Image generated successfully${colors.reset}`);
            if (imageResult.revisedPrompt) {
                console.log(`Revised prompt: ${imageResult.revisedPrompt.substring(0, 150)}...`);
            }
        }
        
        // Download image
        if (!autoMode) {
            console.log(`\n${colors.blue}📥 Downloading image...${colors.reset}`);
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const imageName = path.basename(blogFile, '.html') + `-ai-${timestamp}.png`;
        const imagePath = path.join('blog/images', imageName);
        
        await downloadImage(imageResult.url, imagePath);
        if (!autoMode) {
            console.log(`${colors.green}✓ Image saved to ${imagePath}${colors.reset}`);
        }
        
        // Optimize image
        if (!autoMode) {
            console.log(`\n${colors.blue}🔧 Optimizing image...${colors.reset}`);
        }
        await optimizeImage(imagePath);
        
        // Update blog post (automatic in auto mode)
        if (autoMode) {
            await updateBlogPost(blogFile, imagePath);
        } else {
            const updatePost = await prompt('\nUpdate blog post with new image? (Y/n): ');
            if (updatePost.toLowerCase() !== 'n') {
                await updateBlogPost(blogFile, imagePath);
            }
        }
        
        if (!autoMode) {
            console.log(`\n${colors.green}${colors.bright}✨ Complete! Your AI-generated blog image is ready.${colors.reset}`);
            console.log(`Image location: ${imagePath}`);
            console.log('\nNext steps:');
            console.log('1. Review the image in your blog post');
            console.log('2. Commit and push changes to deploy');
            console.log('3. The image will be live at: https://thechatbotgenius.com/' + imagePath);
        }
        
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