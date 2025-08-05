#!/bin/bash

# Debug script to identify the medical API issue

echo "=== MEDICAL API DEBUG SCRIPT ==="
echo "Current working directory: $(pwd)"
echo ""

# 1. Check if we're in the right directory
if [ ! -d "/Users/jaytarzwell/chatbotgenius" ]; then
    echo "ERROR: chatbotgenius directory not found!"
    exit 1
fi

cd /Users/jaytarzwell/chatbotgenius

# 2. Check file exists
if [ ! -f "netlify/functions/medical-transcription.js" ]; then
    echo "ERROR: medical-transcription.js not found!"
    exit 1
fi

echo "✅ File exists: netlify/functions/medical-transcription.js"

# 3. Count **Findings**: occurrences
echo ""
echo "=== COUNTING **Findings**: OCCURRENCES ==="
grep -c "\*\*Findings\*\*:" netlify/functions/medical-transcription.js

# 4. Show lines where **Findings**: appears
echo ""
echo "=== LINES WITH **Findings**: ==="
grep -n "\*\*Findings\*\*:" netlify/functions/medical-transcription.js

# 5. Check for buildFindings function
echo ""
echo "=== CHECKING buildFindings FUNCTION ==="
grep -n "buildFindings" netlify/functions/medical-transcription.js

# 6. Check file size and last modified
echo ""
echo "=== FILE INFO ==="
ls -la netlify/functions/medical-transcription.js

# 7. Show git status
echo ""
echo "=== GIT STATUS ==="
git status --porcelain netlify/functions/medical-transcription.js

# 8. Compare with backup
echo ""
echo "=== COMPARING WITH BACKUP ==="
if [ -f "netlify/functions/medical-transcription-backup.js" ]; then
    echo "Backup file exists"
    echo "Main file **Findings**: count:"
    grep -c "\*\*Findings\*\*:" netlify/functions/medical-transcription.js
    echo "Backup file **Findings**: count:"
    grep -c "\*\*Findings\*\*:" netlify/functions/medical-transcription-backup.js
else
    echo "No backup file found"
fi

# 9. Test the simple test function
echo ""
echo "=== TESTING SIMPLE TEST FUNCTION ==="
curl -s https://thechatbotgenius.com/.netlify/functions/medical-test-fixed | jq .

# 10. Check if there are any loops or recursive calls in buildFindings
echo ""
echo "=== CHECKING FOR LOOPS IN buildFindings ==="
sed -n '/buildFindings(parsed, originalText) {/,/^    }$/p' netlify/functions/medical-transcription.js | grep -E "(for|while|forEach|map|filter)" | head -5

echo ""
echo "=== DEBUG COMPLETE ==="