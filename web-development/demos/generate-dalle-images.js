#!/usr/bin/env node

require('dotenv').config({ path: '/Users/jaytarzwell/chatbotgenius/.env' });
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Function to generate image using DALL-E
async function generateImage(prompt, filename, size = "1024x1024") {
  try {
    console.log(`\n🎨 Generating: ${filename}`);
    console.log(`  Prompt: ${prompt.substring(0, 80)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}. Style: soft watercolor painting, artistic brush strokes, gentle colors, NOT photorealistic, traditional watercolor on paper feel`,
      n: 1,
      size: size,
      quality: "standard", // Use "hd" for higher quality but more cost
      style: "natural", // Natural style works better for watercolor
    });

    const imageUrl = response.data[0].url;
    const outputDir = '/Users/jaytarzwell/chatbotgenius/web-development/demos/assets/images';
    const filepath = path.join(outputDir, filename);
    
    await downloadImage(imageUrl, filepath);
    
    // Add a delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error generating ${filename}:`, error.message);
    return false;
  }
}

// Birthday images batch
const birthdayImages = [
  {
    filename: 'birthday-cake-watercolor.jpg',
    prompt: 'Elegant birthday cake with lit number 30 candles, pastel pink and gold colors, delicate brush strokes, dreamy watercolor artistic style, white background with subtle color bleeds'
  },
  {
    filename: 'birthday-party-setup.jpg',
    prompt: 'Birthday party decorations watercolor, soft pastel balloons floating, ribbons and streamers, gentle brush strokes, dreamy atmosphere, light and airy composition'
  },
  {
    filename: 'birthday-gifts.jpg',
    prompt: 'Beautifully wrapped gift boxes with silk ribbons and bows watercolor painting, soft pastel colors, delicate textures, artistic gift presentation, gentle shadows'
  },
  {
    filename: 'birthday-celebration.jpg',
    prompt: 'Watercolor party scene with floating confetti, champagne glasses, soft golden light, celebratory atmosphere, impressionistic style, warm colors bleeding together'
  },
  {
    filename: 'birthday-dessert-table.jpg',
    prompt: 'Elegant dessert table watercolor with cupcakes, macarons, and treats, soft pastel colors, delicate details, sweet artistic composition'
  }
];

// Garage sale images batch
const garageImages = [
  {
    filename: 'garage-vintage-furniture.jpg',
    prompt: 'Antique furniture pieces watercolor, vintage wooden chair and dresser, soft brown and amber tones, nostalgic artistic style, gentle shadows'
  },
  {
    filename: 'garage-collectibles.jpg',
    prompt: 'Vintage collectibles display watercolor, old cameras, pocket watches, antique items, soft sepia tones, artistic arrangement, nostalgic mood'
  },
  {
    filename: 'garage-books.jpg',
    prompt: 'Stack of vintage books watercolor with worn covers, soft earth tones, old paper texture, artistic book pile, warm nostalgic feeling'
  },
  {
    filename: 'garage-toys.jpg',
    prompt: 'Vintage toys and games watercolor, teddy bear and wooden toys, soft nostalgic colors, childlike artistic style, warm atmosphere'
  }
];

// Anniversary images batch
const anniversaryImages = [
  {
    filename: 'anniversary-couple.jpg',
    prompt: 'Romantic couple silhouette embracing watercolor, soft sunset colors, gentle brush strokes, love and romance, artistic and ethereal style'
  },
  {
    filename: 'anniversary-rings.jpg',
    prompt: 'Wedding rings with delicate flowers watercolor painting, soft gold tones, romantic composition, artistic jewelry illustration, gentle shadows'
  },
  {
    filename: 'anniversary-roses.jpg',
    prompt: 'Bouquet of red roses watercolor, soft petals with color bleeding, romantic floral arrangement, artistic rose painting, gentle green leaves'
  },
  {
    filename: 'anniversary-toast.jpg',
    prompt: 'Champagne glasses clinking in toast watercolor, soft golden bubbles, celebratory mood, artistic glass rendering, romantic atmosphere'
  }
];

// Corporate speaker portraits (diverse representation)
const corporateImages = [
  {
    filename: 'speaker-1-watercolor.jpg',
    prompt: 'Professional businesswoman portrait watercolor, African American, confident smile, navy blazer, soft artistic style, warm skin tones, corporate setting'
  },
  {
    filename: 'speaker-2-watercolor.jpg',
    prompt: 'Professional businessman portrait watercolor, Caucasian, gray hair, friendly expression, dark suit, artistic corporate portrait, soft brush strokes'
  },
  {
    filename: 'speaker-3-watercolor.jpg',
    prompt: 'Professional businesswoman portrait watercolor, Asian, black hair, warm smile, burgundy blazer, artistic style, gentle colors'
  },
  {
    filename: 'speaker-4-watercolor.jpg',
    prompt: 'Professional businessman portrait watercolor, Hispanic, confident pose, blue shirt and tie, artistic corporate style, warm tones'
  }
];

async function generateBatch(images, batchName) {
  console.log(`\n📦 Starting ${batchName} batch...`);
  let successCount = 0;
  
  for (const image of images) {
    const success = await generateImage(image.prompt, image.filename);
    if (success) successCount++;
  }
  
  console.log(`✅ ${batchName} batch complete: ${successCount}/${images.length} images generated`);
  return successCount;
}

async function main() {
  console.log('🎨 DALL-E 3 Watercolor Image Generator');
  console.log('=====================================\n');
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in .env file');
    process.exit(1);
  }
  
  // Create output directory if it doesn't exist
  const outputDir = '/Users/jaytarzwell/chatbotgenius/web-development/demos/assets/images';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }
  
  // Get command line argument for which batch to generate
  const batch = process.argv[2];
  
  if (!batch || batch === 'all') {
    // Generate all batches
    await generateBatch(birthdayImages, 'Birthday');
    await generateBatch(garageImages, 'Garage Sale');
    await generateBatch(anniversaryImages, 'Anniversary');
    await generateBatch(corporateImages, 'Corporate Speakers');
  } else if (batch === 'birthday') {
    await generateBatch(birthdayImages, 'Birthday');
  } else if (batch === 'garage') {
    await generateBatch(garageImages, 'Garage Sale');
  } else if (batch === 'anniversary') {
    await generateBatch(anniversaryImages, 'Anniversary');
  } else if (batch === 'corporate') {
    await generateBatch(corporateImages, 'Corporate Speakers');
  } else {
    console.log('Usage: node generate-dalle-images.js [all|birthday|garage|anniversary|corporate]');
    process.exit(1);
  }
  
  console.log('\n🎉 Image generation complete!');
  console.log('📍 Images saved to:', outputDir);
  console.log('\n💡 Next steps:');
  console.log('1. Review generated images for quality');
  console.log('2. Optimize file sizes if needed (use TinyPNG or similar)');
  console.log('3. Update HTML files with new image paths');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});