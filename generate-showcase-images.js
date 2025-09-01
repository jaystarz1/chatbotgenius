#!/usr/bin/env node

/**
 * Generate showcase images for web development demo cards
 * Creates 6 images for the demo preview cards on web-development.html
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Load API key from .env
async function loadConfig() {
    try {
        const configContent = await fs.readFile('.env', 'utf-8');
        const config = {};
        configContent.split('\n').forEach(line => {
            if (line.trim() && !line.trim().startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    config[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                }
            }
        });
        return config.OPENAI_API_KEY;
    } catch (error) {
        console.error('Error loading .env file:', error);
        process.exit(1);
    }
}

// Download image from URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = require('fs').createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            require('fs').unlink(filepath, () => {});
            reject(err);
        });
    });
}

// Generate image using DALL-E 3
async function generateImage(apiKey, prompt, filename) {
    console.log(`\n📸 Generating ${filename}...`);
    console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
    
    const requestBody = JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        style: "natural"
    });

    const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/images/generations',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', async () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        reject(new Error(response.error.message));
                        return;
                    }
                    
                    const imageUrl = response.data[0].url;
                    const filepath = path.join(__dirname, 'images', filename);
                    
                    // Download the image
                    await downloadImage(imageUrl, filepath);
                    console.log(`   ✓ Saved as images/${filename}`);
                    resolve(filepath);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(requestBody);
        req.end();
    });
}

// Demo configurations for showcase cards
const showcaseDemos = [
    {
        name: 'Wedding',
        filename: 'demo-wedding-venue.jpg',
        prompt: 'Elegant wedding reception venue photographed from the entrance, showing round tables with white linens and gold accents, soft-focus guests in formal attire mingling and celebrating, warm fairy lights strung overhead creating bokeh effect, crystal chandeliers, romantic golden hour lighting through tall windows, luxurious ballroom atmosphere, depth of field with foreground tables sharp and background softly blurred, photorealistic style, no close-ups of faces'
    },
    {
        name: 'Birthday Party',
        filename: 'demo-birthday-party.jpg',
        prompt: 'Vibrant birthday party celebration in decorated venue, colorful balloon arrangements in rainbow colors filling the space, multiple party tables with bright tablecloths, soft-focus view of diverse group of children and adults celebrating together, large decorated birthday cake on central table, streamers and "Happy Birthday" banners overhead, warm festive lighting, joyful atmosphere with people in motion blur, photorealistic wide angle view'
    },
    {
        name: 'Corporate Event',
        filename: 'demo-corporate-event.jpg',
        prompt: 'Modern corporate conference in large convention center, wide view of professional auditorium with hundreds of attendees in business attire, illuminated main stage with large LED screens showing presentation, soft-focus business professionals networking in foreground, sleek registration area visible, contemporary architecture with glass and steel, professional blue and white lighting scheme, depth of field effect, photorealistic'
    },
    {
        name: 'Anniversary Party',
        filename: 'demo-anniversary-party.jpg',
        prompt: 'Elegant 50th golden anniversary celebration in upscale hotel ballroom, multiple round tables with gold and ivory decorations, soft-focus view of formally dressed guests of various ages mingling and dancing, golden balloons and "50" displays, warm candlelit ambiance with crystal chandeliers, photo memory wall visible in background, champagne toast in progress, luxurious atmosphere, photorealistic with depth of field'
    },
    {
        name: 'Fundraiser Gala',
        filename: 'demo-fundraiser-gala.jpg',
        prompt: 'Upscale charity gala event in grand ballroom, wide view showing silent auction tables with items on display, soft-focus elegant guests in evening wear browsing and socializing, raised stage with purple and gold lighting, large donation thermometer display, round dining tables with purple linens, crystal chandeliers overhead, banner with cause logo, sophisticated atmosphere, photorealistic wide angle'
    },
    {
        name: 'Garage Sale',
        filename: 'demo-garage-sale.jpg',
        prompt: 'Busy neighborhood garage sale on sunny Saturday morning, multiple tables in suburban driveway displaying household items and treasures, vintage furniture and collectibles visible, colorful price tags and "Garage Sale" signs, soft-focus friendly neighbors browsing and chatting, tree-lined residential street with nice homes, bright natural sunlight, community atmosphere, some people carrying purchases, photorealistic wide view'
    }
];

// Main execution
async function main() {
    console.log('🎨 Web Development Showcase Image Generator');
    console.log('============================================\n');
    
    const apiKey = await loadConfig();
    if (!apiKey) {
        console.error('❌ Error: OPENAI_API_KEY not found in .env file');
        console.error('Please add your OpenAI API key to the .env file');
        process.exit(1);
    }
    
    console.log('📋 Generating 6 showcase images for demo cards...\n');
    console.log('This will cost approximately $0.48 (6 images × $0.08 each)\n');
    
    const successfulImages = [];
    const failedImages = [];
    
    for (const demo of showcaseDemos) {
        try {
            await generateImage(apiKey, demo.prompt, demo.filename);
            successfulImages.push(demo.name);
            // Add a 2-second delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`   ❌ Error generating ${demo.name} image: ${error.message}`);
            failedImages.push(demo.name);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✨ Generation Complete!\n');
    
    if (successfulImages.length > 0) {
        console.log(`✅ Successfully generated ${successfulImages.length} images:`);
        successfulImages.forEach(name => console.log(`   • ${name}`));
    }
    
    if (failedImages.length > 0) {
        console.log(`\n⚠️  Failed to generate ${failedImages.length} images:`);
        failedImages.forEach(name => console.log(`   • ${name}`));
        console.log('\nYou may want to run the script again for failed images.');
    }
    
    console.log('\n📁 Images saved in: /images/ directory');
    console.log('📝 Next step: Update web-development.html to include these images');
}

// Run the script
main().catch(console.error);