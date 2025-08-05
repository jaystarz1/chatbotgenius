// Test the medical transcription function locally
const medicalFunction = require('./netlify/functions/medical-transcription.js');

async function testLocal() {
    const testEvent = {
        httpMethod: 'POST',
        body: JSON.stringify({
            dictation: "This is a 72-year-old man with prostate cancer. He had his prostate taken out. Looking at his head and neck, everything is quiet. Down in his belly, I see a seven millimeter node with an SUV of two point nine.",
            options: {}
        })
    };

    try {
        console.log("Testing local function...");
        const result = await medicalFunction.handler(testEvent, {});
        console.log("Status:", result.statusCode);
        
        if (result.statusCode === 200) {
            const body = JSON.parse(result.body);
            console.log("✅ Function works locally");
            console.log("Processing mode:", body.metadata.processingMode);
            console.log("Enhancement status:", body.metadata.enhancementStatus);
            console.log("Review issues:", body.metadata.internalReviewIssues);
            
            // Check key conversions
            console.log("\n=== KEY CONVERSIONS ===");
            console.log("7 mm conversion:", body.report.includes('7 mm'));
            console.log("SUVmax formatting:", body.report.includes('SUVmax'));
            console.log("Single Findings section:", (body.report.match(/\*\*Findings\*\*:/g) || []).length === 1);
        } else {
            const body = JSON.parse(result.body);
            console.log("❌ Error:", body.error);
        }
    } catch (error) {
        console.error("❌ Local test failed:", error.message);
        console.error("Stack:", error.stack);
    }
}

testLocal();
