#!/usr/bin/env node

/**
 * AI Image Generator for Demo Pages
 * Generates appropriate images for event demo pages using DALL-E 3
 * Usage: node generate-demo-images.js [demo-file.html]
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Configuration
const CONFIG_FILES = ['.env', '.env.local'];

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

// Demo page configurations
const DEMO_CONFIGS = {
    'wedding.html': {
        type: 'wedding',
        images: [
            { name: 'hero', prompt: 'Photorealistic image of elegant wedding venue with happy bride and groom, white roses and gold accents, soft romantic lighting, luxury ballroom setting, professional wedding photography' },
            { name: 'couple', prompt: 'Photorealistic portrait of beautiful bride in white dress and handsome groom in black tuxedo at sunset, romantic golden hour wedding photography, genuine emotions' },
            { name: 'venue', prompt: 'Photorealistic outdoor wedding ceremony in progress with guests seated in white chairs, beautiful floral arch, bride and groom at altar, sunny day' },
            { name: 'reception', prompt: 'Photorealistic wedding reception with guests dining, elegant tables with gold centerpieces and candlelight, people celebrating and toasting' },
            { name: 'bride', prompt: 'Photorealistic professional headshot of beautiful bride, elegant makeup, wedding hairstyle with veil, warm smile, white background' },
            { name: 'groom', prompt: 'Photorealistic professional headshot of handsome groom in black tuxedo with boutonniere, confident smile, white background' },
            { name: 'bridesmaid1', prompt: 'Photorealistic headshot of bridesmaid in dusty rose dress, professional makeup, elegant updo hairstyle, friendly smile, white background' },
            { name: 'bridesmaid2', prompt: 'Photorealistic headshot of bridesmaid in dusty rose dress, curly hair, natural makeup, warm smile, white background' },
            { name: 'groomsman1', prompt: 'Photorealistic headshot of groomsman in black tuxedo, clean shaven, professional appearance, friendly expression, white background' },
            { name: 'groomsman2', prompt: 'Photorealistic headshot of groomsman in black tuxedo, short beard, confident smile, white background' }
        ]
    },
    'wedding-premium.html': {
        type: 'wedding',
        images: [
            { name: 'hero-premium', prompt: 'Ultra-luxury wedding venue, crystal chandeliers, marble floors, opulent gold and ivory decor' },
            { name: 'gallery1', prompt: 'Romantic couple portrait in garden, soft focus, dreamy atmosphere' },
            { name: 'gallery2', prompt: 'Close-up of wedding rings on white roses, elegant jewelry photography' },
            { name: 'gallery3', prompt: 'Wedding cake with gold leaf details and white flowers, luxury dessert' }
        ]
    },
    'birthday.html': {
        type: 'birthday',
        images: [
            { name: 'hero', prompt: 'Colorful birthday party celebration with balloons, confetti, and festive decorations' },
            { name: 'cake', prompt: 'Spectacular birthday cake with candles and sparklers, celebration dessert' },
            { name: 'party', prompt: 'Fun birthday party scene with decorations, presents, and party hats' }
        ]
    },
    'corporate-event.html': {
        type: 'corporate',
        images: [
            { name: 'hero', prompt: 'Modern corporate conference hall with professional lighting and stage setup' },
            { name: 'networking', prompt: 'Business professionals networking at elegant corporate event' },
            { name: 'speaker', prompt: 'Professional speaker on stage at corporate conference, dynamic presentation' },
            { name: 'venue', prompt: 'Luxury hotel conference center with modern architecture' }
        ]
    },
    'anniversary.html': {
        type: 'anniversary',
        images: [
            { name: 'hero', prompt: 'Golden anniversary celebration with elegant gold and ivory decorations' },
            { name: 'couple', prompt: 'Mature couple celebrating milestone anniversary, warm and joyful' },
            { name: 'memories', prompt: 'Vintage photo album and roses, nostalgic anniversary theme' }
        ]
    },
    'fundraiser.html': {
        type: 'fundraiser',
        images: [
            { name: 'hero', prompt: 'Charity gala event with purple and gold theme, elegant fundraising atmosphere' },
            { name: 'cause', prompt: 'Hands joining together for unity and support, community spirit' },
            { name: 'venue', prompt: 'Elegant banquet hall setup for charity fundraiser event' }
        ]
    },
    'garage-sale.html': {
        type: 'garage-sale',
        images: [
            { name: 'hero', prompt: 'Neighborhood garage sale with tables of items, sunny day, suburban setting' },
            { name: 'furniture', prompt: 'Vintage furniture pieces at yard sale, eclectic collection' },
            { name: 'treasures', prompt: 'Collection of antiques and collectibles at garage sale' }
        ]
    }
};

// Read configuration
async function loadConfig() {
    let config = {};
    
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
            
            if (!config.AI_IMAGE_API_KEY && config.OPENAI_API_KEY) {
                config.AI_IMAGE_API_KEY = config.OPENAI_API_KEY;
                config.AI_IMAGE_API_TYPE = 'OPENAI';
            }
            
            return config;
        } catch (error) {
            // Try next file
        }
    }
    
    console.log(`${colors.red}No API key found. Please set OPENAI_API_KEY in .env${colors.reset}`);
    process.exit(1);
}

// Generate image using OpenAI DALL-E 3
async function generateWithOpenAI(prompt, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1792x1024",
            quality: "hd",
            style: "natural"
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

// Download and optimize image
async function downloadAndOptimizeImage(url, outputPath) {
    return new Promise((resolve, reject) => {
        const tempPath = outputPath + '.tmp';
        const file = require('fs').createWriteStream(tempPath);
        
        https.get(url, (response) => {
            response.pipe(file);
            
            file.on('finish', async () => {
                file.close();
                
                try {
                    // Optimize with Sharp
                    await sharp(tempPath)
                        .resize(1200, 800, {
                            fit: 'cover',
                            withoutEnlargement: false
                        })
                        .jpeg({
                            quality: 85,
                            progressive: true
                        })
                        .toFile(outputPath);
                    
                    // Remove temp file
                    await fs.unlink(tempPath);
                    
                    const stats = await fs.stat(outputPath);
                    const sizeKB = (stats.size / 1024).toFixed(2);
                    console.log(`${colors.green}✓ Image optimized: ${sizeKB}KB${colors.reset}`);
                    
                    resolve(outputPath);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (err) => {
            fs.unlink(tempPath, () => {});
            reject(err);
        });
    });
}

// Update demo HTML with new images
async function updateDemoWithImages(demoPath, images) {
    let content = await fs.readFile(demoPath, 'utf-8');
    
    // Replace placeholder images with generated ones
    images.forEach(image => {
        // Replace picsum.photos references
        const picsum = new RegExp(`https://picsum\\.photos[^"]*`, 'g');
        if (content.includes('picsum.photos')) {
            content = content.replace(picsum, (match, offset) => {
                // Only replace the first few occurrences
                const before = content.substring(0, offset);
                const matchCount = (before.match(/picsum\.photos/g) || []).length;
                if (matchCount < images.length) {
                    return `assets/images/${path.basename(image.path)}`;
                }
                return match;
            });
        }
    });
    
    await fs.writeFile(demoPath, content);
    console.log(`${colors.green}✓ Updated ${path.basename(demoPath)} with new images${colors.reset}`);
}

// Main function
async function main() {
    try {
        console.log(`${colors.cyan}${colors.bright}🎨 Demo Page Image Generator${colors.reset}`);
        console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
        
        // Load configuration
        const config = await loadConfig();
        
        // Get demo file
        const demoFile = process.argv[2];
        
        if (!demoFile) {
            console.log('Available demos:');
            Object.keys(DEMO_CONFIGS).forEach(demo => {
                const config = DEMO_CONFIGS[demo];
                console.log(`  • ${demo} - ${config.images.length} images needed`);
            });
            console.log(`\n${colors.yellow}Usage: node generate-demo-images.js [demo-file.html]${colors.reset}`);
            console.log(`Example: node generate-demo-images.js wedding.html`);
            process.exit(0);
        }
        
        // Get demo configuration
        const demoName = path.basename(demoFile);
        const demoConfig = DEMO_CONFIGS[demoName];
        
        if (!demoConfig) {
            console.log(`${colors.red}Error: No configuration found for ${demoName}${colors.reset}`);
            console.log('Available demos:', Object.keys(DEMO_CONFIGS).join(', '));
            process.exit(1);
        }
        
        console.log(`${colors.blue}📋 Generating images for ${demoName}${colors.reset}`);
        console.log(`Type: ${demoConfig.type}`);
        console.log(`Images needed: ${demoConfig.images.length}\n`);
        
        // Create images directory if it doesn't exist
        const imagesDir = path.join('web-development/demos/assets/images');
        await fs.mkdir(imagesDir, { recursive: true });
        
        // Generate each image
        const generatedImages = [];
        for (const [index, imageConfig] of demoConfig.images.entries()) {
            console.log(`${colors.blue}[${index + 1}/${demoConfig.images.length}] Generating: ${imageConfig.name}${colors.reset}`);
            console.log(`Prompt: ${imageConfig.prompt.substring(0, 80)}...`);
            
            try {
                // Generate image
                const result = await generateWithOpenAI(imageConfig.prompt, config.AI_IMAGE_API_KEY);
                console.log(`${colors.green}✓ Image generated${colors.reset}`);
                
                // Download and optimize
                const filename = `${demoConfig.type}-${imageConfig.name}.jpg`;
                const imagePath = path.join(imagesDir, filename);
                
                console.log(`Downloading and optimizing...`);
                await downloadAndOptimizeImage(result.url, imagePath);
                
                generatedImages.push({
                    name: imageConfig.name,
                    path: imagePath
                });
                
                console.log(`${colors.green}✓ Saved as ${filename}${colors.reset}\n`);
                
            } catch (error) {
                console.log(`${colors.red}✗ Failed: ${error.message}${colors.reset}\n`);
            }
            
            // Small delay between requests
            if (index < demoConfig.images.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Update demo HTML
        if (generatedImages.length > 0) {
            console.log(`${colors.blue}📝 Updating demo HTML...${colors.reset}`);
            const demoPath = path.join('web-development/demos', demoName);
            await updateDemoWithImages(demoPath, generatedImages);
        }
        
        console.log(`\n${colors.green}${colors.bright}✨ Complete!${colors.reset}`);
        console.log(`Generated ${generatedImages.length} images for ${demoName}`);
        console.log(`Images saved to: ${imagesDir}`);
        
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