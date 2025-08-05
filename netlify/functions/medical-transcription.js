// Netlify Function for Medical PET/CT Transcription - FIXED VERSION
// Handles natural language dictation with proper parsing

// Enhanced PET/CT Template with exact medical rules
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
        'Whole Body': 'eyes to thighs',
        'Total Body': 'vertex to toes',
        'Brain and Whole Body': 'vertex to thighs',
        'Brain plus eyes to thighs': 'brain and eyes to thighs',
        'whole body': 'eyes to thighs',
        'total body': 'vertex to toes',
        'brain and whole body': 'vertex to thighs',
        'head to toe': 'vertex to toes',
        'head to toes': 'vertex to toes',
        'eyes to toes': 'vertex to toes'
    },

    terminologyMap: {
        'speculated': 'spiculated',
        'Speculated': 'Spiculated'
    }
};

// Comprehensive PET/CT Report Generator - FIXED FOR NATURAL LANGUAGE
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
            this.buildAlternateImpression(parsed, dictation)
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
            findings: this.categorizeNaturalFindings(dictation),
            impression: this.extractImpression(dictation),
            hasProstatectomy: this.checkProstatectomy(dictation)
        };
    }

    extractTracer(text) {
        // Look for explicit tracer mentions in natural language
        if (/PSMA|Ga-?68-?PSMA/i.test(text)) return 'Ga-68-PSMA';
        if (/DOTATATE|Ga-?68-?DOTATATE/i.test(text)) return 'Ga-68-DOTATATE';
        if (/cardiac.*FDG|ketogenic.*FDG/i.test(text)) return 'FDG-Cardiac';
        if (/FDG\s*tracer|gave.*FDG|injected.*FDG|millicuries.*FDG/i.test(text)) return 'FDG';
        
        // Default fallback
        return 'FDG';
    }

    extractCoverage(text) {
        // Look for natural language coverage descriptions
        const patterns = {
            'head to toe': 'vertex to toes',
            'head to toes': 'vertex to toes',
            'vertex to toe': 'vertex to toes',
            'whole body': 'eyes to thighs',
            'total body': 'vertex to toes',
            'eyes to thighs': 'eyes to thighs',
            'brain and whole body': 'vertex to thighs',
            'brain plus eyes to thighs': 'brain and eyes to thighs'
        };
        
        for (const [pattern, conversion] of Object.entries(patterns)) {
            if (new RegExp(pattern, 'i').test(text)) {
                return conversion;
            }
        }
        
        return 'eyes to thighs'; // default
    }

    extractHistory(text) {
        // Look for natural language history patterns
        const patterns = [
            /(?:this is a?|we have a?)\s*(\d+[-\s]?year[-\s]?old.*?)(?:we compared|comparison|technique|so looking|in his|in her|in the)/is,
            /history[:\s]+(.*?)(?:comparison|technique|findings|we compared|$)/is,
            /^(.*?(?:cancer|carcinoma|disease|metastatic|diagnosed).*?)(?:we compared|comparison|his psa|her ca)/is
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1].trim().length > 10) {
                return this.cleanupText(match[1]);
            }
        }
        
        return '[History not specified]';
    }

    extractComparison(text) {
        // Look for natural language comparison patterns
        const patterns = [
            /(?:we compared.*?|compared to|comparison with)(.*?)(?:technique|he didn't|she didn't|findings|so looking|in his|in her)/is,
            /comparison[:\s]+(.*?)(?:technique|findings|$)/is,
            /(?:last|prior|previous)\s*(?:scan|pet|ct|study).*?from\s*(.*?)(?:\.|findings|technique|$)/is
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1].trim().length > 5) {
                return this.cleanupText(match[1]);
            }
        }
        
        return 'None';
    }

    extractImpression(text) {
        // Look for natural language impression patterns
        const patterns = [
            /(?:my impression is|impression is that|i think|in conclusion)(.*?)(?:for comparison|alternate|$)/is,
            /impression[:\s]+(.*?)(?:alternate|for comparison|$)/is
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1].trim().length > 10) {
                return this.cleanupText(match[1]);
            }
        }
        
        return '[Impression not provided]';
    }

    categorizeNaturalFindings(dictation) {
        const findings = this.initializeEmptyFindings();
        
        // Natural language patterns for each anatomical region
        const regionPatterns = {
            'Head/Neck': [
                /(?:looking at|in) (?:his|her|the) head (?:and|&) neck[,:]?\s*(.*?)(?:in (?:his|her|the) chest|down in|moving to|chest:|$)/is,
                /head(?:\s*and|\s*&)?\s*neck[:\s]+(.*?)(?:chest|abdomen|pelvis|msk|$)/is
            ],
            'Chest': [
                /(?:in|looking at) (?:his|her|the) chest[,:]?\s*(.*?)(?:down in|in (?:his|her|the) (?:belly|abdomen)|abdomen|pelvis|$)/is,
                /chest[:\s]+(.*?)(?:abdomen|pelvis|msk|bones|$)/is
            ],
            'Abdomen/Pelvis': [
                /(?:down in|in) (?:his|her|the) (?:belly|abdomen)(?:\s*and\s*pelvis)?[,:]?\s*(.*?)(?:(?:his|her|the) bones|msk|skeletal|$)/is,
                /abdomen(?:\s*and|\s*[/&])?\s*pelvis[:\s]+(.*?)(?:msk|bones|skeletal|$)/is
            ],
            'MSK/Integument': [
                /(?:his|her|the) bones\s*(.*?)(?:my impression|impression|$)/is,
                /(?:msk|skeletal|musculoskeletal)[:\s]+(.*?)(?:impression|$)/is
            ]
        };
        
        // Process each anatomical region
        for (const [region, patterns] of Object.entries(regionPatterns)) {
            for (const pattern of patterns) {
                const match = dictation.match(pattern);
                if (match && match[1]) {
                    const regionText = match[1].trim();
                    
                    // Process the regional findings
                    const processedFindings = this.processRegionalFindings(regionText, region);
                    findings[region] = processedFindings;
                    break; // Use first matching pattern
                }
            }
        }
        
        return findings;
    }

    processRegionalFindings(text, region) {
        const findings = [];
        
        // Convert measurements and fix terminology first
        let processedText = this.convertMeasurements(text);
        processedText = this.applyTerminologyCorrections(processedText);
        processedText = this.convertSUVValues(processedText);
        processedText = this.formatImageReferences(processedText);
        
        // Split into sentences for analysis
        const sentences = processedText.split(/[.!?]+/).filter(s => s.trim().length > 5);
        
        sentences.forEach(sentence => {
            const cleanSentence = sentence.trim();
            
            // Check if this is a positive or negative finding
            const hasFindings = this.hasPositiveFindings(cleanSentence);
            const isNodule = /nodule/i.test(cleanSentence);
            
            findings.push({
                text: cleanSentence,
                hasFindings: hasFindings,
                isNodule: isNodule
            });
        });
        
        return findings;
    }

    convertSUVValues(text) {
        // Convert natural language SUV values to proper format
        return text.replace(/SUV\s*(?:of|is)?\s*(?:about)?\s*([\d.]+)/gi, 'SUVmax $1');
    }

    formatImageReferences(text) {
        // Convert natural language image references to proper format
        return text.replace(/(?:on\s*)?image\s*([\w-]+)/gi, '(Image $1)');
    }

    initializeEmptyFindings() {
        return {
            'Head/Neck': [],
            'Chest': [],
            'Abdomen/Pelvis': [],
            'MSK/Integument': []
        };
    }

    hasPositiveFindings(text) {
        const positiveIndicators = [
            'uptake', 'activity', 'lesion', 'mass', 'nodule', 'lymph', 'SUVmax',
            'measuring', 'suspicious', 'abnormal', 'increased', 'hypermetabolic',
            'focus', 'lighting up', 'hot spot', 'lit up', 'lights up'
        ];
        
        const negativeIndicators = [
            'no abnormal', 'no suspicious', 'no evidence', 'normal', 'looks okay',
            'no bad areas', 'everything looks', 'all look good', 'looks fine',
            'no hot spots', 'nothing lighting up'
        ];

        const hasPositive = positiveIndicators.some(indicator => 
            new RegExp(indicator, 'i').test(text)
        );

        const hasNegative = negativeIndicators.some(indicator => 
            new RegExp(indicator, 'i').test(text)
        );

        return hasPositive && !hasNegative;
    }

    checkProstatectomy(text) {
        const hasProstatectomy = /prostatectomy|took.*prostate.*out|removed.*prostate|prostate.*surgery|prostate.*removed/i.test(text);
        const prostatePresent = /prostate.*present|prostate.*intact|prostate.*gland|prostate.*nodule|prostate.*activity|prostate.*zones|apex.*prostate|mid.*gland|BPH|benign prostatic/i.test(text);
        return hasProstatectomy && !prostatePresent;
    }

    buildTechnique(tracer, coverage) {
        const rule = this.template.tracerRules[tracer] || this.template.tracerRules['FDG'];
        
        let technique = `**Technique**: ${rule.startPhrase} ${coverage}`;
        
        // Add tracer if not already in the phrase
        if (!technique.includes(tracer)) {
            technique += ` with ${tracer}`;
        }
        
        technique += '.';
        
        return technique;
    }

    buildFindings(parsed, originalText) {
        let result = '**Findings**:';
        
        this.template.findingsSubcategories.forEach((category, index) => {
            const categoryFindings = parsed.findings[category] || [];
            const positiveFindings = categoryFindings.filter(f => f.hasFindings);
            const hasFindings = positiveFindings.length > 0;
            
            result += `\n**${category}**: `;
            
            if (hasFindings) {
                // Add positive findings first
                const positiveFindingsText = positiveFindings
                    .map(f => f.text)
                    .filter(t => t.length > 10) // Filter out very short fragments
                    .join('. ');
                
                if (positiveFindingsText) {
                    result += positiveFindingsText;
                    if (!positiveFindingsText.endsWith('.')) {
                        result += '.';
                    }
                    result += ' ';
                }
                
                // Add appropriate mandatory phrase
                if (category === 'Chest') {
                    result += this.template.mandatoryPhrases[category].withFindings;
                    
                    // Handle pulmonary nodules logic
                    const nodules = positiveFindings.filter(f => f.isNodule);
                    const noduleCount = nodules.length;
                    
                    if (noduleCount >= 1 && noduleCount <= 3) {
                        result += ' ' + this.template.mandatoryPhrases[category].noOtherNodules;
                    } else if (noduleCount === 0) {
                        result += ' ' + this.template.mandatoryPhrases[category].noNodules;
                    }
                    // If >3 nodules, don't add any nodule statement
                } else {
                    result += this.template.mandatoryPhrases[category].withFindings;
                }
            } else {
                // No findings - use appropriate mandatory phrase
                result += this.template.mandatoryPhrases[category].noFindings;
            }

            // Special logic for Abdomen/Pelvis surgical bed
            if (category === 'Abdomen/Pelvis' && parsed.hasProstatectomy) {
                if (!result.includes(', including the pelvic surgical bed')) {
                    result = result.replace(/lymphadenopathy(?![\w,])/, 'lymphadenopathy, including the pelvic surgical bed');
                }
            }

            // Add incidental findings
            const incidentalFindings = this.extractIncidentalFindings(originalText, category);
            if (incidentalFindings) {
                result += ' ' + incidentalFindings;
            }
            
            if (index < this.template.findingsSubcategories.length - 1) {
                result += '\n\n';  // Add blank line between subcategories
            }
        });

        return result;
    }

    extractIncidentalFindings(text, category) {
        const incidentalPatterns = {
            'Head/Neck': [/physiologic.*uptake/i, /physiologic FDG uptake/i],
            'Chest': [/coronary.*calcification/i, /atherosclerotic.*calcification/i, /mild.*calcification/i, /heart looks fine/i],
            'Abdomen/Pelvis': [/renal.*cyst/i, /hepatic.*cyst/i, /physiologic.*colonic/i, /small.*cyst/i, /bowel.*look.*should/i],
            'MSK/Integument': [/degenerative.*change/i, /multilevel.*degenerative/i]
        };

        const patterns = incidentalPatterns[category] || [];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let finding = match[0];
                
                // Convert casual language to medical terminology
                if (/heart looks fine/i.test(finding)) {
                    finding = 'Normal cardiac appearance';
                }
                if (/bowel.*look.*should/i.test(finding)) {
                    finding = 'Normal bowel activity pattern';
                }
                
                // Capitalize first letter and ensure proper ending
                finding = finding.charAt(0).toUpperCase() + finding.slice(1);
                if (!finding.endsWith('.')) finding += '.';
                return finding;
            }
        }
        return '';
    }

    convertMeasurements(text) {
        // Convert various measurement formats to mm
        return text
            .replace(/(\d+\.?\d*)\s*(?:point|\.)\s*(\d+)\s*(?:centimeters?|cm)/gi, (match, whole, decimal) => {
                const num = parseFloat(`${whole}.${decimal}`);
                return `${Math.round(num * 10)} mm`;
            })
            .replace(/(\d+\.?\d*)\s*(?:centimeters?|cm)/gi, (match, num) => {
                return `${Math.round(parseFloat(num) * 10)} mm`;
            });
    }

    applyTerminologyCorrections(text) {
        const corrections = {
            'speculated': 'spiculated',
            'Speculated': 'Spiculated',
            'lighting up': 'demonstrating increased uptake',
            'lights up': 'demonstrates increased uptake',
            'lit up': 'demonstrated increased uptake',
            'hot spot': 'focus of increased activity',
            'bad areas': 'areas of abnormal uptake',
            'scar tissue': 'post-surgical changes'
        };
        
        Object.entries(corrections).forEach(([wrong, correct]) => {
            text = text.replace(new RegExp(wrong, 'gi'), correct);
        });
        
        return text;
    }

    countMeasurements(text) {
        const measurements = text.match(/\d+\.?\d*\s*(?:cm|centimeters?|point \d)/gi) || [];
        return measurements.length;
    }

    buildHistory(history) {
        return `**History**: ${history}`;
    }

    buildComparison(comparison) {
        return `**Comparison**: ${comparison}`;
    }

    buildImpression(impression) {
        return `**Impression**: ${impression}`;
    }

    buildAlternateImpression(parsed, originalText) {
        const allFindings = Object.values(parsed.findings).flat();
        const positiveFindings = allFindings.filter(f => f.hasFindings);

        let summary = '**Alternate Impression for Comparison**: ';

        if (positiveFindings.length > 0) {
            // Extract key positive findings
            const summaryElements = [];
            
            positiveFindings.forEach(finding => {
                if (finding.text && finding.text.length > 10) {
                    // Extract key elements from the finding
                    const measurements = finding.text.match(/\d+\s*mm/gi) || [];
                    const locations = finding.text.match(/(right|left)?\s*(upper|lower)?\s*(lung|lobe|iliac|vertebr|hilar|pelvis|surgical)/gi) || [];
                    const pathology = finding.text.match(/nodule|mass|lesion|lymph node|uptake|activity/gi) || [];
                    
                    if (measurements.length > 0 || locations.length > 0 || pathology.length > 0) {
                        let element = '';
                        if (measurements[0]) element += measurements[0] + ' ';
                        if (locations[0]) element += locations[0] + ' ';
                        if (pathology[0]) element += pathology[0];
                        
                        if (element.trim()) {
                            summaryElements.push(element.trim());
                        }
                    }
                }
            });

            if (summaryElements.length > 0) {
                summary += summaryElements.join(', ') + '. ';
            }

            // Add negative findings for regions without findings
            const negativeRegions = [];
            Object.entries(parsed.findings).forEach(([category, findings]) => {
                const hasPositive = findings.some(f => f.hasFindings);
                if (!hasPositive) {
                    negativeRegions.push(category.toLowerCase());
                }
            });

            if (negativeRegions.length > 0) {
                summary += `No suspicious activity in ${negativeRegions.join(', ')}.`;
            }

        } else {
            summary += 'No suspicious activity identified in any region examined.';
        }

        return summary;
    }

    cleanupText(text) {
        // Remove extra whitespace and clean up the text
        return text
            .replace(/\s+/g, ' ')
            .replace(/\s*([,.])\s*/g, '$1 ')
            .trim();
    }
}

// Netlify Function Handler remains the same
exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
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
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { dictation, options = {} } = requestBody;

        // Validate required fields
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

        // Generate the medical report with natural language support
        const generator = new PETCTReportGenerator(PETCT_TEMPLATE);
        const result = generator.generateReport(dictation, options);

        // Return successful response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                ...result
            })
        };

    } catch (error) {
        console.error('Error processing medical transcription:', error);
        
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
