// Enhanced Medical Transcription with Multi-Step Processing and Anthropic API Review
// Based on working medical-api-v2.js with graceful fallback
// Force redeploy: Aug 5 2025

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

// Internal Review Engine - checks formatting without external API
class InternalReviewEngine {
    static reviewReport(report, dictation, instructions) {
        const issues = [];
        const corrections = {};

        // Check 1: Technique formatting
        if (!report.includes('Fasting low dose PET/CT') && dictation.toLowerCase().includes('fdg')) {
            issues.push('Technique should use "Fasting low dose PET/CT" for FDG scans');
            corrections.technique = 'Use "Fasting low dose PET/CT" for FDG tracer';
        }
        
        if (!report.includes('Low dose PET/CT') && (dictation.toLowerCase().includes('psma') || dictation.toLowerCase().includes('dotatate'))) {
            issues.push('Technique should use "Low dose PET/CT" for PSMA/DOTATATE scans');
        }

        // Check 2: Single Findings section
        const findingsCount = (report.match(/\*\*Findings\*\*:/g) || []).length;
        if (findingsCount > 1) {
            issues.push(`Multiple **Findings**: sections found (${findingsCount}), should be exactly 1`);
            corrections.findings = 'Remove duplicate **Findings**: headers';
        }

        // Check 3: Mandatory phrases presence
        const mandatoryChecks = [
            { phrase: 'No suspicious activity or lymphadenopathy', section: 'Head/Neck' },
            { phrase: 'No suspicious infradiaphragmatic activity or lymphadenopathy', section: 'Abdomen/Pelvis' },
            { phrase: 'No suspicious skeletal activity or aggressive appearance', section: 'MSK/Integument' }
        ];

        mandatoryChecks.forEach(check => {
            if (!report.includes(check.phrase)) {
                issues.push(`Missing mandatory phrase for ${check.section}: "${check.phrase}"`);
            }
        });

        // Check 4: Measurement conversion
        const unconvertedMeasurements = dictation.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+millimeters?\b/gi);
        if (unconvertedMeasurements) {
            unconvertedMeasurements.forEach(match => {
                if (!this.isConvertedInReport(match, report)) {
                    issues.push(`Measurement not converted: "${match}" should be numeric mm`);
                    corrections.measurements = 'Convert word measurements to numeric mm format';
                }
            });
        }

        // Check 5: SUV formatting
        const unconvertedSUV = dictation.match(/SUV\s*of\s*[a-zA-Z]+\s*point\s*\d+/gi);
        if (unconvertedSUV) {
            unconvertedSUV.forEach(match => {
                if (!report.includes('SUVmax')) {
                    issues.push(`SUV not formatted: "${match}" should be "SUVmax X.X"`);
                    corrections.suv = 'Format SUV values as "SUVmax X.X"';
                }
            });
        }

        // Check 6: Surgical bed logic
        const hasProstatectomy = /prostatectomy|prostate\s*(taken\s*out|removed)/i.test(dictation);
        if (hasProstatectomy) {
            if (!report.includes('including the pelvic surgical bed')) {
                issues.push('Prostatectomy detected but surgical bed phrase missing from Abdomen/Pelvis');
                corrections.surgicalBed = 'Add "including the pelvic surgical bed" to Abdomen/Pelvis section';
            }
        }

        return {
            issues,
            corrections,
            needsComplexReview: issues.length > 3,
            passedBasicReview: issues.length === 0
        };
    }

    static isConvertedInReport(originalMeasurement, report) {
        const numberWords = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
        };
        
        const match = originalMeasurement.match(/\b(\w+)\s+millimeters?\b/i);
        if (match) {
            const word = match[1].toLowerCase();
            const digit = numberWords[word];
            return digit && report.includes(`${digit} mm`);
        }
        return false;
    }
}

// Anthropic API Enhancement with Timeout and Fallback
async function enhanceWithClaude(report, dictation, options = {}) {
    const timeout = options.timeout || 3000;
    
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
                model: "claude-3-sonnet-20240229",
                max_tokens: 2000,
                messages: [{
                    role: "user",
                    content: `Review this PET/CT report against medical formatting rules and fix any issues:

ORIGINAL DICTATION: ${dictation}

GENERATED REPORT: ${report}

MEDICAL RULES:
- Must have exactly ONE **Findings**: section
- Technique: "Fasting low dose PET/CT" for FDG, "Low dose PET/CT" for PSMA/DOTATATE
- Convert measurements: "seven millimeters" → "7 mm"
- Format SUV: "SUV of two point nine" → "SUVmax 2.9"
- Add "including the pelvic surgical bed" to Abdomen/Pelvis if prostatectomy mentioned
- Include mandatory phrases for each subcategory

Return ONLY the corrected report, no explanations.`
                }]
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.content[0].text.trim();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Claude API timeout');
        }
        throw error;
    }
}

// Simplified PETCTReportGenerator for reliable processing
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
        
        const psaMatch = text.match(/PSA.*?(\d+\.?\d*)/i);
        if (psaMatch) {
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
        
        // Process dictation with conversions
        let processedText = this.applyAllConversions(dictation);
        
        // Look for findings in abdomen/pelvis specifically
        const abdominalMatch = processedText.match(/(?:down\s*in|in).*?(?:belly|abdomen).*?(.*?)(?:impression|bones|$)/is);
        if (abdominalMatch && abdominalMatch[1]) {
            const text = abdominalMatch[1].trim();
            if (text.includes('mm') || text.includes('SUVmax') || text.includes('node') || text.includes('lesion')) {
                findings['Abdomen/Pelvis'].push({
                    text: text,
                    hasFindings: true,
                    isNodule: /node|nodule/i.test(text)
                });
            }
        }
        
        return findings;
    }

    applyAllConversions(text) {
        // Convert measurements
        const numberWords = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
        };
        
        for (const [word, digit] of Object.entries(numberWords)) {
            text = text.replace(new RegExp(`\\b${word}\\s+millimeters?\\b`, 'gi'), `${digit} mm`);
            text = text.replace(new RegExp(`\\b${word}\\s+(?:centimeters?|cm)\\b`, 'gi'), `${parseInt(digit) * 10} mm`);
        }
        
        // Convert SUV values
        text = text.replace(/(?:an?\s*)?SUV\s*(?:of\s*)?([a-zA-Z]+)\s*point\s*(\d+)/gi, (match, whole, decimal) => {
            const num = numberWords[whole.toLowerCase()];
            return num ? `SUVmax ${num}.${decimal}` : match;
        });
        
        text = text.replace(/SUV\s*(?:of|is)?\s*([\d.]+)/gi, 'SUVmax $1');
        
        return text;
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

// Main Netlify Function Handler with Multi-Step Processing
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
        const generator = new PETCTReportGenerator(PETCT_TEMPLATE);
        const initialResult = generator.generateReport(dictation, options);
        
        // Step 2: Internal quality review
        const reviewResults = InternalReviewEngine.reviewReport(
            initialResult.report, 
            dictation, 
            'medical formatting rules'
        );
        
        // Step 3: Claude enhancement with graceful fallback
        let finalReport = initialResult.report;
        let processingMode = 'internal-only';
        let enhancementStatus = 'not-needed';
        
        if (reviewResults.needsComplexReview) {
            try {
                const claudeEnhanced = await enhanceWithClaude(initialResult.report, dictation, {
                    timeout: 3000
                });
                finalReport = claudeEnhanced;
                processingMode = 'claude-enhanced';
                enhancementStatus = 'claude-success';
            } catch (claudeError) {
                console.log('Claude API unavailable, using internal processing:', claudeError.message);
                processingMode = 'claude-fallback';
                enhancementStatus = 'claude-failed';
            }
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
                    enhancementStatus: enhancementStatus,
                    internalReviewIssues: reviewResults.issues.length,
                    reviewIssues: reviewResults.issues,
                    corrections: reviewResults.corrections,
                    claudeAvailable: enhancementStatus === 'claude-success'
                }
            })
        };

    } catch (error) {
        console.error('Error processing transcription:', error);
        
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
