#!/bin/bash

echo "🔧 Deploying critical medical formatting fixes..."
cd /Users/jaytarzwell/chatbotgenius

echo "➕ Adding fixed function..."
git add netlify/functions/medical-transcription.js

echo "💬 Committing critical logic fixes..."
git commit -m "CRITICAL FIXES: Medical formatting logic corrections

PULMONARY NODULE LOGIC FIXED:
- ≥1 nodules listed: Use 'No other pulmonary nodules'
- No nodules listed: Use 'No pulmonary nodules'  
- >3 nodules listed: Do NOT include 'No other pulmonary nodules'
- Eliminated duplicate/contradictory nodule statements

ALTERNATE IMPRESSION GENERATION FIXED:
- Now generates meaningful summaries from actual findings
- Extracts measurements, locations, and tracer activity
- Includes key positive findings with specific details
- Adds pertinent negative findings from empty categories
- Incorporates relevant incidental findings
- No longer returns empty alternate impressions

ANATOMICAL CATEGORIZATION IMPROVED:
- Better sentence-level analysis for region assignment
- Enhanced keyword matching with scoring system
- Improved positive/negative finding detection
- More accurate measurement and activity extraction

MANDATORY PHRASING LOGIC CORRECTED:
- Fixed chest section logic to prevent contradictions
- Proper application of 'with findings' vs 'no findings' phrases
- Correct surgical bed logic implementation
- Eliminated phrase duplication issues

These fixes ensure strict conformity to the detailed medical formatting requirements."

echo "🚀 Pushing critical fixes..."
git push

echo ""
echo "✅ Critical fixes deployed! Function will update in ~2 minutes"
echo "🔧 Fixed: Pulmonary nodule contradictions"
echo "📝 Fixed: Empty alternate impression generation"
echo "🎯 Medical formatting now strictly conforms to requirements"
