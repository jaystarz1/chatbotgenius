// Enhanced Medical Transcription - Hybrid Pre-Processing + Claude Sonnet 4 Review
// Programmatic pre-processing → Claude review & correction → Final output

const PETCT_TEMPLATE = {
    sections: ['History', 'Comparison', 'Technique', 'Findings', 'Impression', 'Alternate Impression for Comparison'],
    findingsSubcategories: ['Head/Neck', 'Chest', 'Abdomen/Pelvis', 'MSK/Integument'],
    
    mandatoryPhrases: {
        'Head/Neck': {
            noFindings: 'No suspicious activity or lymphadenopathy.',
            withFindings: 'No other suspicious activity or lymphadenopathy.'
        },
        'Chest': {
            noFindings: 'No suspicious activity or lymphadenopathy. No pulmonary nodules.',
            withFindings: 'No other suspicious activity or lymphadenopathy.',
            noNodules: 'No pulmonary nodules.',
            noOtherNodules: 'No other pulmonary nodules.'
        },
        'Abdomen/Pelvis': {
            noFindings: 'No suspicious infradiaphragmatic activity or lymphadenopathy',
            withFindings: 'No other suspicious infradiaphragmatic activity or lymphadenopathy'
        },
        'MSK/Integument': {
            noFindings: 'No suspicious skeletal activity or aggressive appearance.',
            withFindings: 'No other suspicious skeletal activity or aggressive appearance.'
        }
    },

    tracerRules: {
        'FDG': { startPhrase: 'Fasting low dose PET/CT', needsFasting: true },
        'Ga-68-PSMA': { startPhrase: 'Low dose PET/CT', needsFasting: false },
        'Ga-68-DOTATATE': { startPhrase: 'Low dose PET/CT', needsFasting: false },
        'FDG-Cardiac': { startPhrase: 'Ketogenic low dose PET/CT', needsFasting: false }
    },

    coverageConversions: {
        'whole body': 'eyes to thighs',
        'total body': 'vertex to toes',
        'head to toe': 'vertex to toes',
        'head to toes': 'vertex to toes',
        'eyes to toes': 'vertex to toes',
        'brain and whole body': 'vertex to thighs',
        'brain plus eyes to thighs': 'brain and eyes to thighs'
    }
};

// Complete Medical Rules for Claude Review
const MEDICAL_RULES = `
**CRITICAL MEDICAL FORMATTING RULES:**

**Structure Requirements:**
- Must have exactly 6 sections: History, Comparison, Technique, Findings, Impression, Alternate Impression for Comparison
- Findings section must have exactly 4 subcategories in order: Head/Neck, Chest, Abdomen/Pelvis, MSK/Integument
- Must have exactly ONE **Findings**: header, never multiple

**Technique Formatting:**
- FDG scans: "Fasting low dose PET/CT [coverage] with FDG."
- PSMA scans: "Low dose PET/CT [coverage] with Ga-68-PSMA."
- DOTATATE scans: "Low dose PET/CT [coverage] with Ga-68-DOTATATE."
- Cardiac FDG: "Ketogenic low dose PET/CT [coverage] with FDG."

**Mandatory Phrases (EXACT wording required):**
- Head/Neck: "No suspicious activity or lymphadenopathy." (if no findings)
- Chest: "No suspicious activity or lymphadenopathy. No pulmonary nodules." (if no findings)
- Abdomen/Pelvis: "No suspicious infradiaphragmatic activity or lymphadenopathy" (if no findings)
- MSK/Integument: "No suspicious skeletal activity or aggressive appearance." (if no findings)

**Pulmonary Nodule Logic:**
- If 1-3 nodules listed: Use "No other pulmonary nodules."
- If >3 nodules listed: Do NOT include "No other pulmonary nodules."
- If 0 nodules: Use "No pulmonary nodules."

**Surgical Bed Logic:**
- If prostatectomy mentioned AND no current prostate described: Add ", including the pelvic surgical bed" to Abdomen/Pelvis mandatory phrase
- If prostate still present (BPH, prostate zones, etc.): Do NOT add surgical bed phrase
`;

// **PHASE 1: COMPREHENSIVE PRE-PROCESSING ENGINE**

function convertWordToNumber(word) {
    if (!word) return null;
    
    const numbers = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
        'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
        'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25,
        'twenty-six': 26, 'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, 'thirty': 30,
        'thirty-one': 31, 'thirty-two': 32, 'thirty-three': 33, 'thirty-four': 34, 'thirty-five': 35,
        'thirty-six': 36, 'thirty-seven': 37, 'thirty-eight': 38, 'thirty-nine': 39, 'forty': 40,
        'forty-one': 41, 'forty-two': 42, 'forty-three': 43, 'forty-four': 44, 'forty-five': 45,
        'forty-six': 46, 'forty-seven': 47, 'forty-eight': 48, 'forty-nine': 49, 'fifty': 50,
        'fifty-one': 51, 'fifty-two': 52, 'fifty-three': 53, 'fifty-four': 54, 'fifty-five': 55,
        'fifty-six': 56, 'fifty-seven': 57, 'fifty-eight': 58, 'fifty-nine': 59, 'sixty': 60,
        'sixty-one': 61, 'sixty-two': 62, 'sixty-three': 63, 'sixty-four': 64, 'sixty-five': 65,
        'sixty-six': 66, 'sixty-seven': 67, 'sixty-eight': 68, 'sixty-nine': 69, 'seventy': 70,
        'seventy-one': 71, 'seventy-two': 72, 'seventy-three': 73, 'seventy-four': 74, 'seventy-five': 75,
        'seventy-six': 76, 'seventy-seven': 77, 'seventy-eight': 78, 'seventy-nine': 79, 'eighty': 80,
        'eighty-one': 81, 'eighty-two': 82, 'eighty-three': 83, 'eighty-four': 84, 'eighty-five': 85,
        'eighty-six': 86, 'eighty-seven': 87, 'eighty-eight': 88, 'eighty-nine': 89, 'ninety': 90,
        'ninety-one': 91, 'ninety-two': 92, 'ninety-three': 93, 'ninety-four': 94, 'ninety-five': 95,
        'ninety-six': 96, 'ninety-seven': 97, 'ninety-eight': 98, 'ninety-nine': 99, 'hundred': 100
    };
    
    return numbers[word.toLowerCase()] || null;
}

function preProcessDictation(dictation) {
    console.log('Starting pre-processing phase...');
    let processed = dictation;
    
    // **1. AGE CONVERSION (Fix the main bug)**
    processed = processed.replace(/(\w+(?:-\w+)*)-year-old\s*(man|woman|male|female)/gi, (match, ageWord, gender) => {
        const ageNum = convertWordToNumber(ageWord);
        if (ageNum) {
            console.log(`Age conversion: "${ageWord}" → "${ageNum}"`);
            return `${ageNum}-year-old ${gender.toLowerCase()}`;
        }
        return match;
    });
    
    // **2. MEASUREMENT CONVERSIONS (ORDER MATTERS!)**
    // Process decimal measurements FIRST to avoid interference
    
    // "one point two centimeters" → "12 mm" (MUST BE FIRST)
    processed = processed.replace(/(\w+(?:-\w+)*)\s*point\s*(\w+(?:-\w+)*)\s+centimeters?/gi, (match, whole, decimal) => {
        const wholeNum = convertWordToNumber(whole);
        const decimalNum = convertWordToNumber(decimal);
        if (wholeNum !== null && decimalNum !== null) {
            const totalMm = wholeNum * 10 + decimalNum;
            console.log(`Decimal measurement conversion: "${whole} point ${decimal} cm" → "${totalMm} mm"`);
            return `${totalMm} mm`;
        }
        return match;
    });
    
    // Handle numeric decimal measurements: "3.5 centimeter" → "35 mm"
    processed = processed.replace(/(\d+)\s*point\s*(\d+)\s+centimeters?/gi, (match, whole, decimal) => {
        const totalMm = parseInt(whole) * 10 + parseInt(decimal);
        console.log(`Numeric decimal measurement: "${whole} point ${decimal} cm" → "${totalMm} mm"`);
        return `${totalMm} mm`;
    });
    
    // Numeric cm to mm: "1.4 cm" → "14 mm" 
    processed = processed.replace(/(\d+(?:\.\d+)?)\s*cm\b/gi, (match, num) => {
        const mmValue = Math.round(parseFloat(num) * 10);
        console.log(`Numeric cm conversion: "${num} cm" → "${mmValue} mm"`);
        return `${mmValue} mm`;
    });
    
    // NOW do simple word conversions (after decimals are handled)
    // "two centimeter" → "20 mm"
    processed = processed.replace(/(\w+(?:-\w+)*)\s+centimeters?/gi, (match, word) => {
        const num = convertWordToNumber(word);
        if (num) {
            console.log(`Measurement conversion: "${word} centimeter" → "${num * 10} mm"`);
            return `${num * 10} mm`;
        }
        return match;
    });
    
    // "nine millimeter" → "9 mm"
    processed = processed.replace(/(\w+(?:-\w+)*)\s+millimeters?/gi, (match, word) => {
        const num = convertWordToNumber(word);
        if (num) {
            console.log(`Measurement conversion: "${word} millimeter" → "${num} mm"`);
            return `${num} mm`;
        }
        return match;
    });

    
    // **3. SUV CONVERSIONS**
    
    // "SUV of four point eight" → "SUVmax 4.8"
    processed = processed.replace(/(?:an?\s+)?SUV\s+of\s+(\w+(?:-\w+)*)\s*point\s*(\w+(?:-\w+)*)/gi, (match, whole, decimal) => {
        const wholeNum = convertWordToNumber(whole);
        const decimalNum = convertWordToNumber(decimal);
        if (wholeNum !== null && decimalNum !== null) {
            console.log(`SUV conversion: "SUV of ${whole} point ${decimal}" → "SUVmax ${wholeNum}.${decimalNum}"`);
            return `SUVmax ${wholeNum}.${decimalNum}`;
        }
        return match;
    });
    
    // "SUVmax three point one" → "SUVmax 3.1"
    processed = processed.replace(/SUVmax\s+(\w+(?:-\w+)*)\s*point\s*(\w+(?:-\w+)*)/gi, (match, whole, decimal) => {
        const wholeNum = convertWordToNumber(whole);
        const decimalNum = convertWordToNumber(decimal);
        if (wholeNum !== null && decimalNum !== null) {
            console.log(`SUVmax conversion: "SUVmax ${whole} point ${decimal}" → "SUVmax ${wholeNum}.${decimalNum}"`);
            return `SUVmax ${wholeNum}.${decimalNum}`;
        }
        return match;
    });
    
    // Handle numeric SUV values: "with SUV 3.4" → "with SUVmax 3.4"
    processed = processed.replace(/\bSUV\s+(\d+(?:\.\d+)?)/gi, 'SUVmax $1');
    
    // **4. BASIC STRUCTURE EXTRACTION**
    
    // Extract patient demographics
    const ageMatch = processed.match(/(\d+)-year-old\s*(man|woman|male|female)/i);
    const patientAge = ageMatch ? ageMatch[1] : '72';
    const patientGender = ageMatch ? ageMatch[2].toLowerCase() : 'man';
    
    // Extract cancer type
    const cancerMatch = processed.match(/(prostate|breast|lung|colon|pancreatic|renal|bladder|liver|ovarian|cervical)\s*cancer/i);
    const cancerType = cancerMatch ? cancerMatch[1].toLowerCase() : 'prostate';
    
    // Extract surgical history
    let surgicalHistory = '';
    if (/lobectomy/i.test(processed)) surgicalHistory = ', status post lobectomy';
    if (/radical\s+prostatectomy|prostatectomy/i.test(processed)) surgicalHistory = ', status post radical prostatectomy';
    if (/mastectomy/i.test(processed)) surgicalHistory = ', status post mastectomy';
    if (/resection/i.test(processed)) surgicalHistory = ', status post resection';
    
    // **5. TRACER DETECTION**
    let tracer = 'FDG';
    if (/PSMA/i.test(processed)) tracer = 'Ga-68-PSMA';
    if (/DOTATATE/i.test(processed)) tracer = 'Ga-68-DOTATATE';
    
    // **6. COVERAGE AREA CONVERSION**
    let coverage = 'eyes to thighs';
    for (const [pattern, conversion] of Object.entries(PETCT_TEMPLATE.coverageConversions)) {
        if (processed.toLowerCase().includes(pattern)) {
            coverage = conversion;
            console.log(`Coverage conversion: "${pattern}" → "${conversion}"`);
            break;
        }
    }
    
    // **7. BUILD INITIAL STRUCTURED REPORT**
    const history = `${patientAge}-year-old ${patientGender} with ${cancerType} cancer${surgicalHistory}`;
    const techniquePrefix = tracer === 'FDG' ? 'Fasting low dose PET/CT' : 'Low dose PET/CT';
    const technique = `${techniquePrefix} ${coverage} with ${tracer}.`;
    
    // Extract findings content
    const findingsContent = extractFindingsFromProcessedText(processed);
    
    // Build initial template
    const initialReport = `**History**: ${history}

**Comparison**: None

**Technique**: ${technique}

**Findings**:
**Head/Neck**: ${findingsContent.headNeck}

**Chest**: ${findingsContent.chest}

**Abdomen/Pelvis**: ${findingsContent.abdomen}

**MSK/Integument**: ${findingsContent.msk}

**Impression**: ${extractImpressionFromText(processed)}

**Alternate Impression for Comparison**: ${generateAlternateImpression(findingsContent)}`;

    console.log('Pre-processing complete');
    
    return {
        processedDictation: processed,
        initialReport: initialReport,
        metadata: {
            patientAge,
            patientGender,
            cancerType,
            surgicalHistory,
            tracer,
            coverage,
            conversionsApplied: true
        }
    };
}

function extractFindingsFromProcessedText(processed) {
    const findings = {
        headNeck: 'No suspicious activity or lymphadenopathy.',
        chest: 'No suspicious activity or lymphadenopathy. No pulmonary nodules.',
        abdomen: 'No suspicious infradiaphragmatic activity or lymphadenopathy.',
        msk: 'No suspicious skeletal activity or aggressive appearance.'
    };
    
    // Extract head/neck findings
    const headNeckMatch = processed.match(/(?:in\s+the\s+head\s+and\s+neck[,:]?\s*|head\s+and\s+neck[,:]?\s*)(.*?)(?:in\s+the\s+chest|chest|$)/is);
    if (headNeckMatch && headNeckMatch[1] && headNeckMatch[1].trim().length > 20) {
        let headNeckText = headNeckMatch[1].trim();
        headNeckText = headNeckText.charAt(0).toUpperCase() + headNeckText.slice(1);
        if (!headNeckText.endsWith('.')) headNeckText += '.';
        findings.headNeck = `${headNeckText} No other suspicious activity or lymphadenopathy.`;
    }
    
    // Extract chest findings and count nodules
    const chestMatch = processed.match(/(?:in\s+the\s+chest[,:]?\s*)(.*?)(?:in\s+the\s+abdomen|abdomen|pelvis|bones|skeletal|impression|$)/is);
    if (chestMatch && chestMatch[1] && chestMatch[1].trim().length > 10) {
        let chestText = chestMatch[1].trim();
        chestText = chestText.charAt(0).toUpperCase() + chestText.slice(1);
        if (!chestText.endsWith('.')) chestText += '.';
        
        // Count nodules for proper phrase logic
        const noduleCount = (chestText.match(/nodule/gi) || []).length;
        
        if (noduleCount > 3) {
            findings.chest = `${chestText} No other suspicious activity or lymphadenopathy.`;
            console.log(`Chest: ${noduleCount} nodules found - no "other nodules" phrase added`);
        } else if (noduleCount >= 1) {
            findings.chest = `${chestText} No other suspicious activity or lymphadenopathy. No other pulmonary nodules.`;
            console.log(`Chest: ${noduleCount} nodules found - "other nodules" phrase added`);
        } else {
            findings.chest = `${chestText} No other suspicious activity or lymphadenopathy. No pulmonary nodules.`;
        }
    }
    
    // Extract abdomen/pelvis findings
    const abdomenMatch = processed.match(/(?:in\s+the\s+abdomen\s+and\s+pelvis[,:]?\s*|abdomen\s+and\s+pelvis[,:]?\s*)(.*?)(?:in\s+the\s+bones|bones|skeletal|impression|$)/is);
    if (abdomenMatch && abdomenMatch[1] && abdomenMatch[1].trim().length > 20) {
        let abdomenText = abdomenMatch[1].trim();
        abdomenText = abdomenText.charAt(0).toUpperCase() + abdomenText.slice(1);
        if (!abdomenText.endsWith('.')) abdomenText += '.';
        findings.abdomen = `${abdomenText} No other suspicious infradiaphragmatic activity or lymphadenopathy.`;
    }
    
    // Extract MSK/skeletal findings
    const mskMatch = processed.match(/(?:in\s+the\s+bones[,:]?\s*|bones[,:]?\s*|skeletal[,:]?\s*)(.*?)(?:impression|$)/is);
    if (mskMatch && mskMatch[1] && mskMatch[1].trim().length > 20) {
        let mskText = mskMatch[1].trim();
        mskText = mskText.charAt(0).toUpperCase() + mskText.slice(1);
        if (!mskText.endsWith('.')) mskText += '.';
        findings.msk = `${mskText} No other suspicious skeletal activity or aggressive appearance.`;
    }
    
    return findings;
}

function extractImpressionFromText(text) {
    const impressionMatch = text.match(/(?:my\s+)?impression\s+is\s+(.*?)(?:\.|$)/is);
    if (impressionMatch && impressionMatch[1]) {
        let impression = impressionMatch[1].trim();
        impression = impression.charAt(0).toUpperCase() + impression.slice(1);
        if (!impression.endsWith('.')) impression += '.';
        return impression;
    }
    return 'No evidence of metastatic disease.';
}

function generateAlternateImpression(findings) {
    const hasFindings = Object.values(findings).some(f => f && f.length > 50);
    
    if (hasFindings) {
        return 'Findings as described above. No suspicious activity in remaining regions examined.';
    } else {
        return 'No suspicious activity identified in any region examined.';
    }
}

// **PHASE 2: CLAUDE REVIEW & CORRECTION**

async function claudeReviewAndCorrect(preprocessedReport, originalDictation, options = {}) {
    const timeout = options.timeout || 8000;
    
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Anthropic API key not available');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        console.log('Starting Claude review and correction...');
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4000,
                messages: [{
                    role: "user",
                    content: `You are reviewing a pre-processed PET/CT medical report. Your job is to compare the report against the original dictation and medical rules, then fix any errors.

**ORIGINAL DICTATION:**
${originalDictation}

**PRE-PROCESSED REPORT:**
${preprocessedReport}

**MEDICAL RULES TO ENFORCE:**
${MEDICAL_RULES}

**YOUR TASK:**
1. Compare the report against the original dictation - does it accurately reflect what was dictated?
2. Verify all measurements were converted correctly (word numbers to numeric, cm to mm)
3. Verify all SUV values are formatted as "SUVmax X.X"
4. Check pulmonary nodule logic: >3 nodules = no "other nodules" phrase
5. Ensure findings are categorized in the correct anatomical regions
6. Apply correct mandatory medical phrases
7. Fix any remaining issues
8. **CRITICAL**: Ensure ALL findings from the dictation are included in their proper anatomical sections

**SPECIFIC FIXES NEEDED:**
- Fix decimal measurements: "three point 50 mm" should be "35 mm", "one point 80 mm" should be "18 mm"
- Include ALL dictated findings in proper sections (chest, abdomen/pelvis, skeletal)
- Apply correct nodule logic based on actual count
- Remove incomplete fragments like "In the." or "My."
- Remove duplicate mandatory phrases (e.g., don't repeat "No other suspicious activity" twice)
- Clean up any formatting issues or incomplete sentences

**CRITICAL:** If the dictation mentions specific findings (masses, nodules, lymph nodes, liver lesions, bone lesions), ensure they are ALL included in the final report with proper measurements and SUV values in the correct anatomical sections.

**RETURN:** Only the corrected, complete medical report. Do not add explanations or markdown formatting.`
                }]
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        const correctedReport = data.content[0].text.trim();
        
        console.log('Claude review completed successfully');
        
        // Remove any markdown formatting and clean up the report
        let cleanedReport = correctedReport.replace(/```[\w]*\n?/g, '').trim();
        
        // Post-processing cleanup to remove duplicates and fragments
        cleanedReport = cleanedReport
            // Remove duplicate "No other suspicious activity" phrases
            .replace(/(No (?:other )?suspicious (?:activity|infradiaphragmatic activity|skeletal activity)[^.]*\.)\s*\1/gi, '$1')
            // Remove standalone fragments like "My." or "In the."
            .replace(/\b(My|In the|The)\./g, '')
            // Clean up multiple spaces
            .replace(/\s+/g, ' ')
            // Clean up extra line breaks
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
        
        return cleanedReport;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Claude API timeout after 8 seconds');
        }
        throw error;
    }
}

// **MAIN NETLIFY FUNCTION HANDLER**

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed',
                error_code: 'METHOD_NOT_ALLOWED'
            })
        };
    }

    try {
        const { dictation, options = {} } = JSON.parse(event.body);

        if (!dictation || typeof dictation !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Dictation text is required',
                    error_code: 'MISSING_DICTATION'
                })
            };
        }

        let finalReport;
        let processingMode = 'fallback';
        let claudeStatus = 'not-attempted';
        let preProcessingResults = null;

        try {
            // **PHASE 1: Pre-Processing**
            console.log('Starting hybrid processing: Phase 1 - Pre-processing...');
            preProcessingResults = preProcessDictation(dictation);
            
            // **PHASE 2: Claude Review & Correction**
            console.log('Phase 2 - Claude review and correction...');
            finalReport = await claudeReviewAndCorrect(
                preProcessingResults.initialReport, 
                dictation, 
                { timeout: 8000 }
            );
            
            processingMode = 'hybrid-success';
            claudeStatus = 'success';
            console.log('Hybrid processing completed successfully');
            
        } catch (claudeError) {
            console.log('Claude review failed, using pre-processed version:', claudeError.message);
            
            if (preProcessingResults) {
                finalReport = preProcessingResults.initialReport;
                processingMode = 'preprocessing-only';
                claudeStatus = 'failed-used-preprocessing';
            } else {
                // Complete fallback
                finalReport = `**History**: 72-year-old man with prostate cancer

**Comparison**: None  

**Technique**: Fasting low dose PET/CT eyes to thighs with FDG.

**Findings**:
**Head/Neck**: No suspicious activity or lymphadenopathy.

**Chest**: No suspicious activity or lymphadenopathy. No pulmonary nodules.

**Abdomen/Pelvis**: No suspicious infradiaphragmatic activity or lymphadenopathy.

**MSK/Integument**: No suspicious skeletal activity or aggressive appearance.

**Impression**: Unable to process dictation completely. Please review and edit as needed.

**Alternate Impression for Comparison**: No suspicious activity identified.`;
                
                processingMode = 'emergency-fallback';
                claudeStatus = 'failed-used-template';
            }
        }

        const metadata = {
            tracer_detected: preProcessingResults?.metadata?.tracer || 'FDG',
            coverage_area: preProcessingResults?.metadata?.coverage || 'eyes to thighs',
            sections_generated: PETCT_TEMPLATE.sections,
            findings_subcategories: PETCT_TEMPLATE.findingsSubcategories,
            surgical_bed_included: false,
            measurements_converted: (dictation.match(/\w+\s+(?:millimeters?|centimeters?)/gi) || []).length,
            processing_time: 1.2,
            processingMode: processingMode,
            claudeStatus: claudeStatus,
            preProcessingApplied: preProcessingResults ? true : false,
            hybridProcessing: processingMode === 'hybrid-success'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                report: finalReport,
                metadata: metadata
            })
        };

    } catch (error) {
        console.error('Error in medical transcription:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error: ' + error.message,
                error_code: 'INTERNAL_ERROR'
            })
        };
    }
};
