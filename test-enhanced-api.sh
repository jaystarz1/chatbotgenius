#!/bin/bash

echo "Testing Enhanced Medical Transcription API..."
echo "============================================="

# Test with the enhanced function
curl -X POST https://thechatbotgenius.com/.netlify/functions/medical-transcription \
  -H "Content-Type: application/json" \
  -d '{
    "dictation": "This is a 72-year-old man with prostate cancer. He had his prostate taken out. Looking at his head and neck, everything is quiet. Down in his belly, I see a seven millimeter node with an SUV of two point nine. My impression is that this represents metastatic disease.",
    "options": {}
  }' | jq '.'

echo ""
echo "============================================="
echo "Test complete. Check above for:"
echo "✅ Processing mode (internal-only or claude-enhanced)"
echo "✅ Measurement conversion (seven millimeter → 7 mm)"
echo "✅ SUV formatting (SUV of two point nine → SUVmax 2.9)"
echo "✅ Single **Findings**: section"
echo "✅ Surgical bed phrase in Abdomen/Pelvis"
echo "✅ Enhancement status and review results"
