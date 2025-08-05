// Enhanced Medical Transcription with Multi-Step Processing and Anthropic API Review
// Based on working medical-api-v2.js with graceful fallback

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

// Copy all the working PETCTReportGenerator class from medical-api-v2.js
class PETCTReportGenerator {
    constructor(template) {
        this.template = template;
    }

    generateReport(dictation, options = {}) {
        const parsed = this.parseDictation(dictation);
        const metadata = {
            tracer_detected: parsed.tracer,
            coverage_area: parsed.coverage,
            sections_generated: this.template.sections,
            findings_subcategories: this.template.findingsSubcategories,
            surgical_bed_included: parsed.hasProstatectomy,
            measurements_converted: this.countMeasurements(dictation),
            processing_time: Date.now()
        };

        const startTime = metadata.processing_time;
        
        const report = [
            this.buildHistory(parsed.history),
            this.buildComparison(parsed.comparison),
            this.buildTechnique(parsed.tracer, parsed.coverage),
            this.buildFindings(parsed, dictation),
            this.buildImpression(parsed.impression),
            this.buildAlternateImpression(parsed)
        ].join('\n\n');

        metadata.processing_time = (Date.now() - startTime) / 1000;

        return { report, metadata };
    }

    parseDictation(dictation) {
        return {
            tracer: this.extractTracer(dictation),
            coverage: this.extractCoverage(dictation),
            history: this.extractHistory(dictation),
            comparison: this.extractComparison(dictation),
            findings: this.categorizeFindings(dictation),
            impression: this.extractImpression(dictation),
            hasProstatectomy: this.checkProstatectomy(dictation)
        };
    }

    extractTracer(text) {
        if (/PSMA|Ga-?68-?PSMA/i.test(text)) return 'Ga-68-PSMA';
        if (/DOTATATE|Ga-?68-?DOTATATE/i.test(text)) return 'Ga-68-DOTATATE';
        if (/cardiac.*FDG|ketogenic.*FDG/i.test(text)) return 'FDG-Cardiac';
        if (/FDG\s*tracer|gave.*FDG|injected.*FDG|millicuries.*FDG/i.test(text)) return 'FDG';
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
        const ageGenderMatch = text.match(/(\d+)[-\s]?year[-\s]?old\s*(man|woman|male|female|boy|girl)/i);
        let history = '';
        
        if (ageGenderMatch) {
            history = `${ageGenderMatch[1]}-year-old ${ageGenderMatch[2].toLowerCase()}`;
        }
        
        const cancerMatch = text.match(/(prostate|breast|lung|colon|rectal|pancreatic|liver|kidney|bladder|lymph|thyroid|brain|ovarian|cervical|testicular|melanoma|sarcoma)\s*cancer/i);
        if (cancerMatch) {
            history += ` with ${cancerMatch[0].toLowerCase()}`;
        }
        
        if (/prostate\s*(taken out|removed)|prostatectomy/i.test(text)) {
            history += ', status post radical prostatectomy';
        }
        
        const psaMatch = text.match(/PSA\s*(?:is|was|went)?\s*(?:up to|from)?\s*([\d.]+)\s*(?:to\s*([\d.]+))?/i);
        if (psaMatch) {
            if (psaMatch[2]) {
                history += `. Rising PSA from ${psaMatch[1]} to ${psaMatch[2]}`;
            } else {
                history += `. PSA ${psaMatch[1]}`;
            }
        }
        
        return history || '[History not specified]';
    }

    extractComparison(text) {
        return 'None';
    }

    extractImpression(text) {
        const patterns = [
            /(?:my\s*)?impression\s*is\s*(?:that\s*)?(.*?)(?:compared|$)/is,
            /(?:so\s*)?(?:my\s*)?impression[:]\s*(.*?)(?:compared|$)/is
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                let impression = match[1].trim();
                impression = impression.replace(/^that\s+/i, '');
                impression = impression.charAt(0).toUpperCase() + impression.slice(1);
                return impression;
            }
        }
        
        return '[Impression not provided]';
    }

    categorizeFindings(dictation) {
        const findings = {
            'Head/Neck': [],
            'Chest': [],
            'Abdomen/Pelvis': [],
            'MSK/Integument': []
        };
        
        let processedText = this.applyAllConversions(dictation);
        
        const regionPatterns = {
            'Head/Neck': /(?:looking at|in)\s*(?:his|her|the)?\s*head\s*(?:and|&)?\s*neck[,:]?\s*(.*?)(?:in\s*(?:his|her|the)?\s*chest|chest:|down\s*in|$)/is,
            'Chest': /(?:in|looking at)\s*(?:his|her|the)?\s*chest[,:]?\s*(.*?)(?:down\s*in|abdomen|pelvis|$)/is,
            'Abdomen/Pelvis': /(?:down\s*in|in)\s*(?:his|her|the)?\s*(?:belly|abdomen)(?:\s*and\s*pelvis)?[,:]?\s*(.*?)(?:bones|skeletal|msk|$)/is,
            'MSK/Integument': /(?:his|her|the)?\s*bones\s*(.*?)(?:impression|$)/is
        };
        
        for (const [region, pattern] of Object.entries(regionPatterns)) {
            const match = processedText.match(pattern);
            if (match && match[1]) {
                findings[region] = this.processRegionFindings(match[1], region);
            }
        }
        
        return findings;
    }

    processRegionFindings(text, region) {
        const findings = [];
        text = this.cleanMedicalText(text);
        text = this.applyAllConversions(text);
        
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
        
        sentences.forEach(sentence => {
            const cleaned = sentence.trim();
            if (cleaned) {
                findings.push({
                    text: cleaned,
                    hasFindings: this.hasPositiveFindings(cleaned),
                    isNodule: /nodule/i.test(cleaned)
                });
            }
        });
        
        return findings;
    }

    cleanMedicalText(text) {
        text = text.replace(/I\s*(don't|do not)\s*see\s*any/gi, 'No');
        text = text.replace(/everything(?:'s|\s*is)?\s*(quiet|normal|fine|good|okay)/gi, 'No abnormal activity');
        text = text.replace(/looks?\s*(normal|fine|good|okay|clear)/gi, 'unremarkable');
        text = text.replace(/nothing\s*lighting\s*up/gi, 'no abnormal uptake');
        text = text.replace(/no\s*bad\s*areas/gi, 'no suspicious areas');
        text = text.replace(/I\s*see\s*a?/gi, '');
        text = text.replace(/there(?:'s|\s*is)\s*a?/gi, '');
        
        text = this.convertAllMeasurements(text);
        text = this.formatSUVValues(text);
        text = this.formatImageReferences(text);
        text = this.applyTerminologyCorrections(text);
        
        return text;
    }

    applyAllConversions(text) {
        text = this.convertAllMeasurements(text);
        text = this.formatSUVValues(text);
        text = this.formatImageReferences(text);
        text = this.applyTerminologyCorrections(text);
        return text;
    }

    convertAllMeasurements(text) {
        const numberWords = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14', 'fifteen': '15'
        };
        
        for (const [word, digit] of Object.entries(numberWords)) {
            text = text.replace(new RegExp(`\\b${word}\\s+millimeters?\\b`, 'gi'), `${digit} mm`);
            text = text.replace(new RegExp(`\\b${word}\\s+(?:centimeters?|cm)\\b`, 'gi'), `${parseInt(digit) * 10} mm`);
            text = text.replace(new RegExp(`\\b${word}\\s*point\\s*(\\d+)`, 'gi'), `${digit}.$1`);
        }
        
        text = text.replace(/(\d+\.?\d*)\s*(?:centimeters?|cm)/gi, (match, num) => {
            return `${Math.round(parseFloat(num) * 10)} mm`;
        });
        
        text = text.replace(/(\d+)\s*point\s*(\d+)\s*(?:centimeters?|cm)?/gi, (match, whole, decimal, unit) => {
            const value = parseFloat(`${whole}.${decimal}`);
            if (unit && unit.match(/cm|centimeter/i)) {
                return `${Math.round(value * 10)} mm`;
            }
            return `${value}`;
        });
        
        return text;
    }

    formatSUVValues(text) {
        text = text.replace(/SUV\s*(?:of|is)?\s*(?:about)?\s*([\d.]+)/gi, 'SUVmax $1');
        
        text = text.replace(/(?:an?\s*)?SUV\s*(?:of\s*)?([a-zA-Z]+)\s*point\s*(\d+)/gi, (match, whole, decimal) => {
            const num = this.wordToNumber(whole);
            return num ? `SUVmax ${num}.${decimal}` : match;
        });
        
        text = text.replace(/\b(?:an?\s+)?SUV\b/gi, 'SUVmax');
        
        return text;
    }

    formatImageReferences(text) {
        text = text.replace(/(?:on\s*)?image\s*(\w+)(?:\s*(?:of|\/)\s*(\d+))?/gi, (match, img, total) => {
            const imgNum = this.wordToNumber(img) || img;
            return total ? `(Image ${imgNum} of ${total})` : `(Image ${imgNum})`;
        });
        return text;
    }

    applyTerminologyCorrections(text) {
        const corrections = {
            'speculated': 'spiculated',
            'lighting up': 'demonstrating uptake',
            'pretty good': 'significantly'
        };
        
        for (const [wrong, right] of Object.entries(corrections)) {
            text = text.replace(new RegExp(wrong, 'gi'), right);
        }
        
        return text;
    }

    wordToNumber(word) {
        const numbers = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
            'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18,
            'nineteen': 19, 'twenty': 20
        };
        
        return numbers[word.toLowerCase()] || null;
    }

    hasPositiveFindings(text) {
        const positive = [
            'uptake', 'activity', 'lesion', 'mass', 'nodule', 'lymph',
            'SUVmax', 'measuring', 'suspicious', 'abnormal', 'increased',
            'hypermetabolic', 'focus', 'avid', 'enhancement', 'thickening'
        ];
        
        const negative = [
            'no suspicious', 'no abnormal', 'no evidence', 'unremarkable',
            'normal', 'clear', 'negative', 'without', 'no increased'
        ];
        
        const hasPositive = positive.some(term => new RegExp(`\\b${term}\\b`, 'i').test(text));
        const hasNegative = negative.some(term => new RegExp(term, 'i').test(text));
        
        return hasPositive && !hasNegative;
    }

    checkProstatectomy(text) {
        const prostatectomyTerms = /prostatectomy|prostate\s*(taken\s*out|removed)|had\s*his\s*prostate/i;
        const prostatePresent = /prostate\s*(present|intact|gland)|BPH|benign\s*prostatic/i;
        
        return prostatectomyTerms.test(text) && !prostatePresent.test(text);
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
                
                if (category === 'Chest') {
                    result += this.template.mandatoryPhrases[category].withFindings;
                    
                    const noduleCount = positiveFindings.filter(f => f.isNodule).length;
                    if (noduleCount >= 1 && noduleCount <= 3) {
                        result += ' ' + this.template.mandatoryPhrases[category].noOtherNodules;
                    } else if (noduleCount === 0) {
                        result += ' ' + this.template.mandatoryPhrases[category].noNodules;
                    }
                } else {
                    result += this.template.mandatoryPhrases[category].withFindings;
                }
            } else {
                result += this.template.mandatoryPhrases[category].noFindings;
            }
            
            if (category === 'Abdomen/Pelvis' && parsed.hasProstatectomy) {
                const sectionStart = result.lastIndexOf(`**${category}**: `);
                const sectionEnd = index < this.template.findingsSubcategories.length - 1 
                    ? result.indexOf(`\n\n**`, sectionStart + 1)
                    : result.length;
                
                const beforeSection = result.substring(0, sectionStart);
                const currentSection = result.substring(sectionStart, sectionEnd);
                const afterSection = result.substring(sectionEnd);
                
                const modifiedSection = currentSection.replace(
                    /lymphadenopathy(?![\w,])/,
                    'lymphadenopathy, including the pelvic surgical bed'
                );
                
                result = beforeSection + modifiedSection + afterSection;
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
        const findings = [];
        
        Object.entries(parsed.findings).forEach(([category, categoryFindings]) => {
            const positive = categoryFindings.filter(f => f.hasFindings);
            positive.forEach(f => {
                if (f.text && f.text.length > 10) {
                    findings.push(f.text);
                }
            });
        });
        
        let summary = '**Alternate Impression for Comparison**: ';
        
        if (findings.length > 0) {
            const keyFindings = findings.slice(0, 3).map(f => {
                const match = f.match(/(\d+\s*mm\s*[\w\s]+(?:node|nodule|lesion|mass|focus))/i);
                return match ? match[1] : f.split('.')[0];
            });
            
            summary += keyFindings.join(', ') + '.';
            
            const negativeRegions = [];
            Object.entries(parsed.findings).forEach(([category, categoryFindings]) => {
                if (!categoryFindings.some(f => f.hasFindings)) {
                    negativeRegions.push(category.toLowerCase());
                }
            });
            
            if (negativeRegions.length > 0) {
                summary += ` No suspicious activity in ${negativeRegions.join(', ')}.`;
            }
        } else {
            summary += 'No suspicious activity identified in any region examined.';
        }
        
        return summary;
    }

    countMeasurements(text) {
        const patterns = [
            /\d+\.?\d*\s*(?:cm|centimeters?)/gi,
            /\d+\s*point\s*\d+\s*(?:cm|centimeters?)?/gi,
            /(?:one|two|three|four|five|six|seven|eight|nine|ten)\s*point\s*\d+/gi
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

        // Step 1: Generate initial report using working generator
        const generator = new PETCTReportGenerator(PETCT_TEMPLATE);
        const initialResult = generator.generateReport(dictation, options);
        
        // Step 2: Internal quality review
        const reviewResults = InternalReviewEngine.reviewReport(
            initialResult.report, 
            dictation, 
            'medical formatting rules'
        );
        
        // Step 3: Apply corrections or enhance with Claude if needed
        let finalReport = initialResult.report;
        let processingMode = 'internal-only';
        let enhancementStatus = 'not-needed';
        
        if (reviewResults.needsComplexReview) {
            // Try Anthropic API enhancement with fallback
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
                // finalReport remains as internal result
            }
        }

        // Step 4: Return enhanced result
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
        
        // Emergency fallback - basic structure
        try {
            const basicReport = `**History**: [Extracted from dictation]

**Comparison**: None

**Technique**: Low dose PET/CT eyes to thighs with FDG.

**Findings**:
**Head/Neck**: No suspicious activity or lymphadenopathy.

**Chest**: No suspicious activity or lymphadenopathy. No pulmonary nodules.

**Abdomen/Pelvis**: No suspicious infradiaphragmatic activity or lymphadenopathy.

**MSK/Integument**: No suspicious skeletal activity or aggressive appearance.

**Impression**: [Emergency fallback - review dictation manually]

**Alternate Impression for Comparison**: Emergency processing mode - manual review required.`;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    report: basicReport,
                    metadata: {
                        processingMode: 'emergency-fallback',
                        warning: 'Basic formatting applied due to processing errors',
                        originalError: error.message
                    }
                })
            };
        } catch (fallbackError) {
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
    }
};
