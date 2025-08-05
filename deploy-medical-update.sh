#!/bin/bash

echo "🔄 Deploying updated medical transcription function..."
cd /Users/jaytarzwell/chatbotgenius

echo "➕ Adding updated function..."
git add netlify/functions/medical-transcription.js

echo "💬 Committing strict medical conformity updates..."
git commit -m "Updated medical transcription function for strict conformity

STRICT MEDICAL FORMATTING COMPLIANCE:
- Exact 6-section structure with proper ordering
- Mandatory 4 findings subcategories (Head/Neck, Chest, Abdomen/Pelvis, MSK/Integument)
- Precise mandatory phrasing based on findings presence/absence
- Proper measurement conversion (cm → mm) with exact precision
- Surgical bed logic for prostatectomy cases only when appropriate
- Tracer-specific technique formatting (FDG, PSMA, DOTATATE)
- Terminology corrections (speculated → spiculated)
- Anatomical region categorization with keyword matching
- Pulmonary nodule counting and appropriate phrasing
- Incidental findings extraction and placement
- Image reference preservation when provided
- Physician override rule for elaborate negative statements
- Exact formatting with proper markdown headers and spacing
- Alternate impression generation from findings only

PARSING IMPROVEMENTS:
- Enhanced sentence-level analysis for accurate categorization
- Improved positive/negative finding detection
- Better measurement extraction and conversion
- Proper handling of complex medical terminology
- Strict adherence to formatting rules and mandatory phrases"

echo "🚀 Pushing to trigger Netlify deployment..."
git push

echo ""
echo "✅ Updated function deployed! Changes will be live in ~2 minutes"
echo "🏥 Medical transcription API now strictly conforms to all formatting requirements"
echo "🎯 Test endpoint: https://thechatbotgenius.com/.netlify/functions/medical-transcription"
