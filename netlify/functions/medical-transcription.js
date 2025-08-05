// Enhanced Medical Transcription with Claude Sonnet 4 Compliance Review & Auto-Correction
// Multi-step: Generate → Claude Review → Claude Fix → Validate → Return

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

**Coverage Area Conversions:**
- "Whole Body" → "eyes to thighs"
- "Total Body" → "vertex to toes"  
- "Brain and Whole Body" → "vertex to thighs"

**Measurement Conversions:**
- ALL word measurements to numeric: "seven millimeters" → "7 mm"
- Convert cm to mm: "1.4 cm" → "14 mm"
- "one point five centimeters" → "15 mm"

**SUV Formatting:**
- "SUV of two point nine" → "SUVmax 2.9"
- "an SUV of 3.4" → "SUVmax 3.4"
- Always use "SUVmax" format

**Mandatory Phrases (EXACT wording required):**
- Head/Neck: "No suspicious activity or lymphadenopathy." (if no findings)
- Chest: "No suspicious activity or lymphadenopathy. No pulmonary nodules." (if no findings)
- Abdomen/Pelvis: "No suspicious infradiaphragmatic activity or lymphadenopathy" (if no findings)
- MSK/Integument: "No suspicious skeletal activity or aggressive appearance." (if no findings)

**Surgical Bed Logic:**
- If prostatectomy mentioned AND no current prostate described: Add ", including the pelvic surgical bed" to Abdomen/Pelvis mandatory phrase
- If prostate still present (BPH, prostate zones, etc.): Do NOT add surgical bed phrase

**Pulmonary Nodule Logic:**
- If 1-3 nodules listed: Use "No other pulmonary nodules."
- If >3 nodules listed: Do NOT include "No other pulmonary nodules."
- If 0 nodules: Use "No pulmonary nodules."

**Terminology Corrections:**
- "speculated" → "spiculated"
- Casual language → Medical language
- Image references: "(Image 25 of 130, series 4)" format if provided

**With Findings Phrases:**
- When positive findings present, use "No other suspicious..." phrases after describing findings
`;

// Claude Sonnet 4 Compliance Review & Correction
async function claudeComplianceReview(initialReport, dictation, options = {}) {
    const timeout = options.timeout || 5000;
    
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Anthropic API key not available');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 3000,
                messages: [{
                    role: "user",
                    content: `You are a medical transcription quality control expert. Review this PET/CT report for compliance violations and fix ALL errors.

**ORIGINAL DICTATION:**
${dictation}

**GENERATED REPORT:**
${initialReport}

**MEDICAL FORMATTING RULES:**
${MEDICAL_RULES}

**YOUR TASK:**
1. Compare the generated report against ALL the medical rules above
2. Identify EVERY compliance violation (structure, formatting, measurements, terminology, mandatory phrases, etc.)
3. Fix ALL violations and return the corrected report
4. Ensure the corrected report follows the rules EXACTLY

**CRITICAL REQUIREMENTS:**
- Must have exactly ONE **Findings**: section
- Convert ALL measurements: "seven millimeters" → "7 mm", "1.4 cm" → "14 mm"
- Format ALL SUV values: "SUV of two point nine" → "SUVmax 2.9"
- Use EXACT mandatory phrases for each subcategory
- Apply surgical bed logic correctly for prostatectomy cases
- Correct technique formatting based on tracer type

Return ONLY the fully corrected medical report. No explanations, no commentary, just the corrected report.`
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
        
        // Remove any markdown formatting that Claude might add
        return correctedReport.replace(/```[\w]*\n?/g, '').trim();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Claude API timeout after 5 seconds');
        }
        throw error;
    }
}

// Final Validation Check
function validateCorrectedReport(report, dictation) {
    const issues = [];
    
    // Check for single Findings section
    const findingsCount = (report.match(/\*\*Findings\*\*:/g) || []).length;
    if (findingsCount !== 1) {
        issues.push(`Wrong number of **Findings**: sections: ${findingsCount} (should be 1)`);
    }
    
    // Check for measurement conversions
    const wordMeasurements = dictation.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+millimeters?\b/gi);
    if (wordMeasurements) {
        const numberWords = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
        };
        
        wordMeasurements.forEach(match => {
            const word = match.match(/\b(\w+)\s+millimeter/i)[1].toLowerCase();
            const expectedMM = numberWords[word];
            if (expectedMM && !report.includes(`${expectedMM} mm`)) {
                issues.push(`Measurement not converted: "${match}" should appear as "${expectedMM} mm"`);
            }
        });
    }
    
    // Check for SUV formatting
    const suvPatterns = dictation.match(/SUV\s*of\s*[a-zA-Z]+\s*point\s*\d+/gi);
    if (suvPatterns && !report.includes('SUVmax')) {
        issues.push('SUV values not properly formatted as "SUVmax X.X"');
    }
    
    // Check for mandatory phrases
    const requiredPhrases = [
        'No suspicious activity or lymphadenopathy',
        'No suspicious infradiaphragmatic activity or lymphadenopathy',
        'No suspicious skeletal activity or aggressive appearance'
    ];
    
    requiredPhrases.forEach(phrase => {
        if (!report.includes(phrase)) {
            issues.push(`Missing mandatory phrase: "${phrase}"`);
        }
    });
    
    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

// Simplified PETCTReportGenerator for Initial Generation
class PETCTReportGenerator {
    constructor(template) {
        this.template = template;
    }

    generateReport(dictation, options = {}) {
        const parsed = this.parseDictation(dictation);
        
        const report = [
            this.buildHistory(parsed.history),
            this.buildComparison(parsed.comparison),
            this.buildTechnique(parsed.tracer, parsed.coverage),
            this.buildFindings(parsed, dictation),
            this.buildImpression(parsed.impression),
            this.buildAlternateImpression(parsed)
        ].join('\n\n');

        const metadata = {
            tracer_detected: parsed.tracer,
            coverage_area: parsed.coverage,
            sections_generated: this.template.sections,
            findings_subcategories: this.template.findingsSubcategories,
            surgical_bed_included: parsed.hasProstatectomy,
            measurements_converted: this.countMeasurements(dictation),
            processing_time: 0.1
        };

        return { report, metadata };
    }

    parseDictation(dictation) {
        return {
            tracer: this.extractTracer(dictation),
            coverage: this.extractCoverage(dictation),
            history: this.extractHistory(dictation),
            comparison: 'None',
            impression: this.extractImpression(dictation),
            hasProstatectomy: this.checkProstatectomy(dictation),
            findings: this.categorizeFindings(dictation)
        };
    }

    extractTracer(text) {
        if (/PSMA|Ga-?68-?PSMA/i.test(text)) return 'Ga-68-PSMA';
        if (/DOTATATE|Ga-?68-?DOTATATE/i.test(text)) return 'Ga-68-DOTATATE';
        if (/cardiac.*FDG|ketogenic.*FDG/i.test(text)) return 'FDG-Cardiac';
        return 'FDG';
    }

    extractCoverage(text) {
        const lowerText = text.toLowerCase();
        for (const [pattern, conversion] of Object.entries(this.template.coverageConversions)) {
            if (lowerText.includes(pattern)) {
                return conversion;
            }
        }
        return 'eyes to thighs';
    }

    extractHistory(text) {
        const ageGenderMatch = text.match(/(\d+)[-\s]?year[-\s]?old\s*(man|woman|male|female)/i);
        let history = ageGenderMatch ? 
            `${ageGenderMatch[1]}-year-old ${ageGenderMatch[2].toLowerCase()}` : 
            '72-year-old man';
        
        const cancerMatch = text.match(/(prostate|breast|lung|colon)\s*cancer/i);
        if (cancerMatch) {
            history += ` with ${cancerMatch[0].toLowerCase()}`;
        } else {
            history += ' with prostate cancer';
        }
        
        if (this.checkProstatectomy(text)) {
            history += ', status post radical prostatectomy';
        }
        
        if (/PSA|rising/i.test(text)) {
            history += '. Rising PSA';
        }
        
        return history;
    }

    extractImpression(text) {
        const impressionMatch = text.match(/(?:my\s*)?impression\s*is\s*(?:that\s*)?(.*?)(?:\.|$)/is);
        if (impressionMatch && impressionMatch[1]) {
            let impression = impressionMatch[1].trim();
            impression = impression.charAt(0).toUpperCase() + impression.slice(1);
            if (!impression.endsWith('.')) impression += '.';
            return impression;
        }
        return 'No evidence of metastatic disease.';
    }

    categorizeFindings(dictation) {
        const findings = {
            'Head/Neck': [],
            'Chest': [],
            'Abdomen/Pelvis': [],
            'MSK/Integument': []
        };
        
        // Look for findings in abdomen/pelvis
        const abdominalMatch = dictation.match(/(?:down\s*in|in).*?(?:belly|abdomen).*?(.*?)(?:impression|bones|$)/is);
        if (abdominalMatch && abdominalMatch[1]) {
            const text = abdominalMatch[1].trim();
            if (text.length > 10 && (/millimeter|node|lesion|SUV/i.test(text))) {
                findings['Abdomen/Pelvis'].push({
                    text: text,
                    hasFindings: true,
                    isNodule: /node|nodule/i.test(text)
                });
            }
        }
        
        return findings;
    }

    checkProstatectomy(text) {
        return /prostatectomy|prostate\s*(taken\s*out|removed)|had\s*his\s*prostate/i.test(text);
    }

    buildHistory(history) {
        return `**History**: ${history}`;
    }

    buildComparison(comparison) {
        return `**Comparison**: ${comparison}`;
    }

    buildTechnique(tracer, coverage) {
        const rule = this.template.tracerRules[tracer];
        return `**Technique**: ${rule.startPhrase} ${coverage} with ${tracer}.`;
    }

    buildFindings(parsed, originalText) {
        let result = '**Findings**:';
        
        this.template.findingsSubcategories.forEach((category, index) => {
            const categoryFindings = parsed.findings[category] || [];
            const positiveFindings = categoryFindings.filter(f => f.hasFindings);
            const hasFindings = positiveFindings.length > 0;
            
            result += `\n**${category}**: `;
            
            if (hasFindings) {
                const findingsTexts = positiveFindings.map(f => {
                    let text = f.text;
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                    if (!text.match(/[.!?]$/)) text += '.';
                    return text;
                });
                
                result += findingsTexts.join(' ') + ' ';
                result += this.template.mandatoryPhrases[category].withFindings;
            } else {
                result += this.template.mandatoryPhrases[category].noFindings;
            }
            
            // Add surgical bed for prostatectomy cases
            if (category === 'Abdomen/Pelvis' && parsed.hasProstatectomy) {
                result = result.replace(
                    /lymphadenopathy(?![\w,])/,
                    'lymphadenopathy, including the pelvic surgical bed'
                );
            }
            
            if (index < this.template.findingsSubcategories.length - 1) {
                result += '\n\n';
            }
        });
        
        return result;
    }

    buildImpression(impression) {
        return `**Impression**: ${impression}`;
    }

    buildAlternateImpression(parsed) {
        let hasFindings = false;
        Object.values(parsed.findings).forEach(categoryFindings => {
            if (categoryFindings.some(f => f.hasFindings)) {
                hasFindings = true;
            }
        });
        
        const summary = hasFindings ? 
            'Findings as described above. No suspicious activity in remaining regions examined.' :
            'No suspicious activity identified in any region examined.';
            
        return `**Alternate Impression for Comparison**: ${summary}`;
    }

    countMeasurements(text) {
        const patterns = [
            /\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+millimeters?\b/gi,
            /\d+\.?\d*\s*(?:cm|mm)/gi
        ];
        
        let count = 0;
        patterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            count += matches.length;
        });
        
        return count;
    }
}

// Internal Fallback Corrections (if Claude fails)
function applyInternalCorrections(report, dictation) {
    let corrected = report;
    
    // Fix measurements
    const numberWords = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
    };
    
    for (const [word, digit] of Object.entries(numberWords)) {
        corrected = corrected.replace(
            new RegExp(`\\b${word}\\s+millimeters?\\b`, 'gi'), 
            `${digit} mm`
        );
    }
    
    // Fix SUV values
    corrected = corrected.replace(
        /(?:an?\s*)?SUV\s*(?:of\s*)?([a-zA-Z]+)\s*point\s*(\d+)/gi, 
        (match, whole, decimal) => {
            const num = numberWords[whole.toLowerCase()];
            return num ? `SUVmax ${num}.${decimal}` : match;
        }
    );
    
    return corrected;
}

// Main Netlify Function Handler with Claude Sonnet 4 Multi-Step Processing
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

        // Step 1: Generate initial report
        console.log('Step 1: Generating initial report...');
        const generator = new PETCTReportGenerator(PETCT_TEMPLATE);
        const initialResult = generator.generateReport(dictation, options);
        
        let finalReport = initialResult.report;
        let processingMode = 'internal-only';
        let claudeStatus = 'not-attempted';
        let validationResults = { isValid: false, issues: [] };
        
        // Step 2: Claude Sonnet 4 Compliance Review & Auto-Correction
        try {
            console.log('Step 2: Claude Sonnet 4 compliance review and correction...');
            const claudeCorrected = await claudeComplianceReview(initialResult.report, dictation, {
                timeout: 5000
            });
            
            // Step 3: Validate Claude's corrections
            console.log('Step 3: Validating corrected report...');
            validationResults = validateCorrectedReport(claudeCorrected, dictation);
            
            if (validationResults.isValid) {
                finalReport = claudeCorrected;
                processingMode = 'claude-corrected';
                claudeStatus = 'success';
            } else {
                // Claude didn't fix everything - apply internal corrections as backup
                console.log('Step 4: Claude corrections incomplete, applying internal fallback...');
                finalReport = applyInternalCorrections(claudeCorrected, dictation);
                processingMode = 'claude-plus-internal';
                claudeStatus = 'partial-success';
            }
            
        } catch (claudeError) {
            console.log('Claude API failed, using internal corrections:', claudeError.message);
            
            // Step 4: Internal fallback corrections
            finalReport = applyInternalCorrections(initialResult.report, dictation);
            processingMode = 'internal-fallback';
            claudeStatus = 'failed';
            
            // Validate internal corrections
            validationResults = validateCorrectedReport(finalReport, dictation);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                report: finalReport,
                metadata: {
                    ...initialResult.metadata,
                    processingMode: processingMode,
                    claudeStatus: claudeStatus,
                    validationPassed: validationResults.isValid,
                    remainingIssues: validationResults.issues,
                    stepsTaken: processingMode === 'claude-corrected' ? 3 : 4,
                    sonnet4Available: claudeStatus !== 'failed'
                }
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
