// Netlify Function for Medical PET/CT Transcription
// Handles ChatGPT Custom Action requests - STRICT conformity to medical requirements

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
        'brain and whole body': 'vertex to thighs'
    },

    terminologyMap: {
        'speculated': 'spiculated',
        'Speculated': 'Spiculated'
    }
};

// Comprehensive PET/CT Report Generator - STRICT MEDICAL CONFORMITY
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
            findings: this.categorizeFindings(dictation),
            impression: this.extractImpression(dictation),
            hasProstatectomy: this.checkProstatectomy(dictation)
        };
    }

    extractTracer(text) {
        if (/PSMA/i.test(text)) return 'Ga-68-PSMA';
        if (/DOTATATE/i.test(text)) return 'Ga-68-DOTATATE';
        if (/cardiac.*FDG/i.test(text)) return 'FDG-Cardiac';
        return 'FDG';
    }

    extractCoverage(text) {
        const patterns = Object.keys(this.template.coverageConversions);
        const found = patterns.find(pattern => 
            new RegExp(pattern, 'i').test(text)
        );
        return found || 'eyes to thighs';
    }

    extractHistory(text) {
        const match = text.match(/history[:\s]+(.*?)(?=comparison|technique|findings|$)/is);
        return match ? match[1].trim() : '[History not specified]';
    }

    extractComparison(text) {
        const match = text.match(/comparison[:\s]+(.*?)(?=technique|findings|$)/is);
        return match ? match[1].trim() : 'None';
    }

    extractImpression(text) {
        const match = text.match(/impression[:\s]+(.*?)$/is);
        return match ? match[1].trim() : '[Impression not provided]';
    }

    categorizeFindings(dictation) {
        // Extract findings section
        const findingsMatch = dictation.match(/findings[:\s]+(.*?)(?=impression|$)/is);
        if (!findingsMatch) return this.initializeEmptyFindings();

        const findingsText = findingsMatch[1];
        const findings = this.initializeEmptyFindings();

        // Split findings text into sentences for analysis
        const sentences = findingsText.split(/[.!?]+/).filter(s => s.trim().length > 10);

        // Process each sentence and categorize
        sentences.forEach(sentence => {
            const cleanSentence = sentence.trim();
            if (cleanSentence.length < 10) return;

            // Convert measurements and apply corrections first
            let processedSentence = this.convertMeasurements(cleanSentence);
            processedSentence = this.applyTerminologyCorrections(processedSentence);

            // Determine which anatomical region this sentence belongs to
            const region = this.determineAnatomicalRegion(processedSentence);
            if (region) {
                findings[region].push({
                    text: processedSentence,
                    hasFindings: this.hasPositiveFindings(processedSentence),
                    isNodule: /nodule/i.test(processedSentence)
                });
            }
        });

        return findings;
    }

    determineAnatomicalRegion(sentence) {
        const anatomicalKeywords = {
            'Head/Neck': ['head', 'neck', 'cervical', 'thyroid', 'salivary', 'vocal cords', 'brain', 'tonsils', 'physiologic FDG uptake in the brain'],
            'Chest': ['chest', 'lung', 'pulmonary', 'thorax', 'mediastin', 'hilar', 'coronary', 'aorta', 'nodule', 'mass', 'moving to the chest'],
            'Abdomen/Pelvis': ['abdomen', 'pelvis', 'liver', 'hepatic', 'kidney', 'renal', 'prostate', 'bladder', 'iliac', 'cyst', 'in the abdomen'],
            'MSK/Integument': ['bone', 'spine', 'vertebr', 'skeletal', 'lumbar', 'thoracic', 'cervical', 'degenerative', 'ribs', 'changes', 'skeletal system']
        };

        // Find the best matching region
        let bestMatch = null;
        let bestScore = 0;

        Object.entries(anatomicalKeywords).forEach(([region, keywords]) => {
            const matches = keywords.filter(keyword => 
                new RegExp(keyword, 'i').test(sentence)
            );
            
            if (matches.length > bestScore) {
                bestScore = matches.length;
                bestMatch = region;
            }
        });

        return bestMatch;
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
            'focus', 'areas of', 'multiple areas'
        ];
        
        const negativeIndicators = [
            'no abnormal', 'no suspicious', 'no evidence', 'appears normal',
            'no enlarged', 'no masses'
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
        const hasProstatectomy = /prostatectomy|pelvic surgery/i.test(text);
        const prostatePresent = /prostate.*present|prostate.*intact|prostate.*gland|prostate.*nodule|prostate.*activity|prostate.*zones|apex.*prostate|mid.*gland|BPH|benign prostatic/i.test(text);
        return hasProstatectomy && !prostatePresent;
    }

    buildTechnique(tracer, coverage) {
        const rule = this.template.tracerRules[tracer] || this.template.tracerRules['FDG'];
        const convertedCoverage = this.template.coverageConversions[coverage] || coverage;
        
        return `**Technique**: ${rule.startPhrase} ${convertedCoverage} with ${tracer}.`;
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
                    .join('. ');
                
                result += positiveFindingsText + '. ';
                
                // Add appropriate mandatory phrase
                if (category === 'Chest') {
                    result += this.template.mandatoryPhrases[category].withFindings;
                    
                    // Handle pulmonary nodules logic - FIXED
                    const nodules = positiveFindings.filter(f => f.isNodule);
                    const noduleCount = nodules.length;
                    
                    if (noduleCount >= 1 && noduleCount <= 3) {
                        result += ' ' + this.template.mandatoryPhrases[category].noOtherNodules;
                    } else if (noduleCount > 3) {
                        // Do NOT include "No other pulmonary nodules" statement for >3 nodules
                    } else {
                        // No nodules mentioned in positive findings
                        result += ' ' + this.template.mandatoryPhrases[category].noNodules;
                    }
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
                result += '\n';
            }
        });

        return result;
    }

    extractIncidentalFindings(text, category) {
        const incidentalPatterns = {
            'Head/Neck': [/physiologic.*uptake/i, /physiologic FDG uptake/i],
            'Chest': [/coronary.*calcification/i, /atherosclerotic.*calcification/i, /mild.*calcification/i],
            'Abdomen/Pelvis': [/renal.*cyst/i, /hepatic.*cyst/i, /physiologic.*colonic/i, /small.*cyst/i],
            'MSK/Integument': [/degenerative.*change/i, /multilevel.*degenerative/i]
        };

        const patterns = incidentalPatterns[category] || [];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let finding = match[0];
                // Capitalize first letter and ensure proper ending
                finding = finding.charAt(0).toUpperCase() + finding.slice(1);
                if (!finding.endsWith('.')) finding += '.';
                return finding;
            }
        }
        return '';
    }

    convertMeasurements(text) {
        // Convert cm to mm with exact precision
        return text.replace(/(\d+\.?\d*)\s*centimeters?/gi, (match, num) => {
            return `${Math.round(parseFloat(num) * 10)} mm`;
        }).replace(/(\d+\.?\d*)\s*cm/gi, (match, num) => {
            return `${Math.round(parseFloat(num) * 10)} mm`;
        });
    }

    applyTerminologyCorrections(text) {
        Object.entries(this.template.terminologyMap).forEach(([wrong, correct]) => {
            text = text.replace(new RegExp(wrong, 'gi'), correct);
        });
        return text;
    }

    countMeasurements(text) {
        const measurements = text.match(/\d+\.?\d*\s*(cm|centimeters?)/gi) || [];
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
        // FIXED: Generate meaningful alternate impression from findings
        const allFindings = Object.values(parsed.findings).flat();
        const positiveFindings = allFindings.filter(f => f.hasFindings);

        let summary = '**Alternate Impression for Comparison**: ';

        if (positiveFindings.length > 0) {
            // Extract key positive findings with measurements and locations
            const summaryElements = [];
            
            positiveFindings.forEach(finding => {
                // Extract measurements
                const measurements = finding.text.match(/\d+\s*mm/gi) || [];
                
                // Extract anatomical locations
                const locations = finding.text.match(/(left|right)?\s*(external iliac|vertebr|hilar|upper lobe|lower lobe|lymph node|lesion|mass|nodule|hepatic lobe|L\d+)/gi) || [];
                
                // Extract tracer activity info
                const tracerActivity = finding.text.match(/(FDG|PSMA|DOTATATE)-avid|increased.*uptake|hypermetabolic/gi) || [];
                
                if (measurements.length > 0 || locations.length > 0) {
                    let element = '';
                    if (tracerActivity.length > 0) {
                        element += tracerActivity[0] + ' ';
                    }
                    if (measurements.length > 0) {
                        element += measurements[0] + ' ';
                    }
                    if (locations.length > 0) {
                        element += locations[0].toLowerCase();
                    }
                    
                    if (element.trim()) {
                        summaryElements.push(element.trim());
                    }
                }
            });

            if (summaryElements.length > 0) {
                summary += summaryElements.join(' and ') + '. ';
            }

            // Add negative findings summary for empty categories
            const negativeAreas = [];
            Object.entries(parsed.findings).forEach(([category, findings]) => {
                const hasPositive = findings.some(f => f.hasFindings);
                if (!hasPositive) {
                    negativeAreas.push(category.toLowerCase().replace('msk/integument', 'skeletal').replace('/', ' or '));
                }
            });

            if (negativeAreas.length > 0) {
                summary += `No suspicious activity in ${negativeAreas.join(' or ')}.`;
            }

            // Add key incidental findings
            const incidentals = [];
            if (/renal.*cyst|hepatic.*cyst/i.test(originalText)) {
                incidentals.push('incidental cysts');
            }
            if (/degenerative.*change/i.test(originalText)) {
                incidentals.push('degenerative changes');
            }
            if (/coronary.*calcification/i.test(originalText)) {
                incidentals.push('coronary calcification');
            }

            if (incidentals.length > 0) {
                summary += ` ${incidentals.join(' and ')} noted.`;
            }

        } else {
            summary += 'No suspicious activity identified in any region examined.';
        }

        return summary;
    }
}

// Netlify Function Handler
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

        // Generate the medical report with STRICT conformity
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
