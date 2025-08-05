#!/bin/bash

echo "Testing Enhanced Medical Transcription API (Simple Test)..."
echo "=========================================================="

# Simple test without jq formatting
curl -X POST https://thechatbotgenius.com/.netlify/functions/medical-transcription \
  -H "Content-Type: application/json" \
  -d '{
    "dictation": "72-year-old man with prostate cancer, prostatectomy. Seven millimeter node, SUV of two point nine.",
    "options": {}
  }'

echo ""
echo "=========================================================="
echo "If you see JSON output above, the enhanced function is working!"
echo ""
echo "Look for:"
echo "- processingMode: 'internal-only' or 'claude-enhanced'"
echo "- enhancementStatus: shows Claude API status"  
echo "- internalReviewIssues: number of issues found"
echo "- '7 mm' and 'SUVmax 2.9' in the report"
echo "- 'including the pelvic surgical bed' in Abdomen/Pelvis"
