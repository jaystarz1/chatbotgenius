// Netlify Function for Medical PET/CT Transcription
// Handles ChatGPT Custom Action requests

// Enhanced PET/CT Template with all medical rules
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

// Comprehensive PET/CT Report Generator
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
            findings: this.extractDetailedFindings(dictation),
            impression: this.extractImpression(dictation),
            hasProstatectomy: this.checkProstatectomy(dictation),
            incidentalFindings: this.extractIncidentalFindings(dictation)
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

    extractDetailedFindings(text) {
        const findings = {
            'Head/Neck': [],
            'Chest': [],
            'Abdomen/Pelvis': [],
            'MSK/Integument': []
        };

        // Extract findings section
        const findingsMatch = text.match(/findings[:\s]+(.*?)(?=impression|$)/is);
        if (!findingsMatch) return findings;

        const findingsText = findingsMatch[1];

        // Look for specific anatomical mentions and measurements
        const measurements = this.extractMeasurements(findingsText);
        const activities = this.extractActivities(findingsText);
        const imageRefs = this.extractImageReferences(findingsText);

        // Categorize findings based on anatomical regions
        this.categorizeFindings(findingsText, findings, measurements, activities, imageRefs);

        return findings;
    }

    extractMeasurements(text) {
        const measurements = [];
        const measurementRegex = /(\d+\.?\d*)\s*(mm|cm)/gi;
        let match;
        while ((match = measurementRegex.exec(text)) !== null) {
            measurements.push({
                value: parseFloat(match[1]),
                unit: match[2].toLowerCase(),
                fullMatch: match[0],
                context: text.substring(Math.max(0, match.index - 50), match.index + 50)
            });
        }
        return measurements;
    }

    extractActivities(text) {
        const activities = [];
        const activityRegex = /SUVmax\s*([\d\.]+)/gi;
        let match;
        while ((match = activityRegex.exec(text)) !== null) {
            activities.push({
                value: parseFloat(match[1]),
                fullMatch: match[0],
                context: text.substring(Math.max(0, match.index - 50), match.index + 50)
            });
        }
        return activities;
    }

    extractImageReferences(text) {
        const imageRefs = [];
        const imageRegex = /image\s*(\d+)\s*of\s*(\d+)[^.]*series\s*(\d+)/gi;
        let match;
        while ((match = imageRegex.exec(text)) !== null) {
            imageRefs.push({
                imageNum: match[1],
                totalImages: match[2],
                series: match[3],
                fullMatch: match[0],
                context: text.substring(Math.max(0, match.index - 30), match.index + match[0].length + 30)
            });
        }
        return imageRefs;
    }

    categorizeFindings(text, findings, measurements, activities, imageRefs) {
        // Anatomical keywords for categorization
        const anatomicalKeywords = {
            'Head/Neck': ['head', 'neck', 'cervical', 'thyroid', 'salivary'],
            'Chest': ['chest', 'lung', 'pulmonary', 'thorax', 'mediastin', 'hilar', 'coronary'],
            'Abdomen/Pelvis': ['abdomen', 'pelvis', 'liver', 'kidney', 'prostate', 'bladder', 'iliac', 'renal'],
            'MSK/Integument': ['bone', 'spine', 'vertebr', 'skeletal', 'lumbar', 'thoracic', 'cervical', 'degenerative']
        };

        // Check for specific findings in text
        Object.entries(anatomicalKeywords).forEach(([category, keywords]) => {
            const categoryPattern = new RegExp(keywords.join('|'), 'i');
            if (categoryPattern.test(text)) {
                // Extract relevant sentences
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                sentences.forEach(sentence => {
                    if (categoryPattern.test(sentence)) {
                        const finding = {
                            description: sentence.trim(),
                            measurements: measurements.filter(m => sentence.includes(m.fullMatch)),
                            activities: activities.filter(a => sentence.includes(a.fullMatch)),
                            imageRefs: imageRefs.filter(r => sentence.includes(r.fullMatch))
                        };
                        
                        if (finding.measurements.length > 0 || finding.activities.length > 0 || 
                            /nodule|lesion|mass|lymph|activity/i.test(sentence)) {
                            findings[category].push(finding);
                        }
                    }
                });
            }
        });
    }

    extractIncidentalFindings(text) {
        const incidentalPatterns = [
            /coronary.*calcification/i,
            /hepatic.*cyst/i,
            /renal.*cyst/i,
            /degenerative.*change/i,
            /physiologic.*uptake/i
        ];

        const incidentals = [];
        incidentalPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                incidentals.push(matches[0]);
            }
        });

        return incidentals;
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
            const hasFindings = categoryFindings.length > 0;
            
            result += `\n**${category}**: `;
            
            if (hasFindings) {
                // Format the findings
                const formattedFindings = categoryFindings.map(finding => {
                    let desc = this.convertMeasurements(finding.description);
                    desc = this.applyTerminologyCorrections(desc);
                    
                    // Add image references if available
                    if (finding.imageRefs && finding.imageRefs.length > 0) {
                        const imageRef = finding.imageRefs[0];
                        if (!desc.includes('(Image')) {
                            desc += ` (Image ${imageRef.imageNum} of ${imageRef.totalImages}, series ${imageRef.series})`;
                        }
                    }
                    
                    return desc;
                }).join('. ');

                result += formattedFindings + '. ';
                result += this.template.mandatoryPhrases[category].withFindings;
            } else {
                result += this.template.mandatoryPhrases[category].noFindings;
            }

            // Special logic for Abdomen/Pelvis surgical bed
            if (category === 'Abdomen/Pelvis' && parsed.hasProstatectomy) {
                if (!result.includes(', including the pelvic surgical bed')) {
                    result = result.replace(/lymphadenopathy(?!\w)/, 'lymphadenopathy, including the pelvic surgical bed');
                }
            }

            // Handle pulmonary nodules for Chest
            if (category === 'Chest') {
                const noduleCount = categoryFindings.filter(f => /nodule/i.test(f.description)).length;
                if (noduleCount === 0) {
                    // Already included in mandatory phrase
                } else if (noduleCount <= 3) {
                    if (!result.includes('No other pulmonary nodules')) {
                        result += ' No other pulmonary nodules.';
                    }
                }
                
                // Add incidental findings
                if (/coronary.*calcification/i.test(originalText)) {
                    result += ' Coronary artery calcification noted.';
                }
            }

            // Add other incidental findings
            if (category === 'Abdomen/Pelvis' && /renal.*cyst|hepatic.*cyst/i.test(originalText)) {
                const cystMatch = originalText.match(/(renal|hepatic).*cyst[^.]*/i);
                if (cystMatch && !result.includes(cystMatch[0])) {
                    result += ` ${cystMatch[0].charAt(0).toUpperCase() + cystMatch[0].slice(1)}.`;
                }
            }

            if (category === 'MSK/Integument' && /degenerative.*change/i.test(originalText)) {
                const degMatch = originalText.match(/degenerative.*change[^.]*/i);
                if (degMatch && !result.includes(degMatch[0])) {
                    result += ` ${degMatch[0].charAt(0).toUpperCase() + degMatch[0].slice(1)}.`;
                }
            }
            
            if (index < this.template.findingsSubcategories.length - 1) {
                result += '\n';
            }
        });

        return result;
    }

    convertMeasurements(text) {
        // Convert cm to mm
        return text.replace(/(\d+\.?\d*)\s*cm/gi, (match, num) => {
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
        const measurements = text.match(/\d+\.?\d*\s*cm/gi) || [];
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

    buildAlternateImpression(parsed) {
        // Generate summary based on findings from this report only
        const allFindings = Object.values(parsed.findings).flat();
        const hasPositiveFindings = allFindings.length > 0;

        if (hasPositiveFindings) {
            let summary = '**Alternate Impression for Comparison**: ';
            const findingSummaries = [];

            // Summarize key positive findings
            Object.entries(parsed.findings).forEach(([category, findings]) => {
                if (findings.length > 0) {
                    findings.forEach(finding => {
                        const measurements = finding.measurements || [];
                        const activities = finding.activities || [];
                        
                        if (measurements.length > 0 || activities.length > 0) {
                            let summaryText = '';
                            if (measurements.length > 0) {
                                const sizeMm = measurements[0].unit === 'cm' ? 
                                    Math.round(measurements[0].value * 10) : measurements[0].value;
                                summaryText += `${sizeMm} mm `;
                            }
                            
                            // Extract key anatomical location
                            const locationMatch = finding.description.match(/(left|right)?\s*(external iliac|vertebr|hilar|upper lobe|lower lobe|lymph node|lesion|mass|nodule)/i);
                            if (locationMatch) {
                                summaryText += locationMatch[0].toLowerCase();
                            }
                            
                            if (summaryText.trim()) {
                                findingSummaries.push(summaryText.trim());
                            }
                        }
                    });
                }
            });

            if (findingSummaries.length > 0) {
                summary += findingSummaries.join(' and ') + '. ';
            }

            // Add negative findings summary
            const negativeAreas = [];
            Object.entries(parsed.findings).forEach(([category, findings]) => {
                if (findings.length === 0) {
                    negativeAreas.push(category.toLowerCase());
                }
            });

            if (negativeAreas.length > 0) {
                summary += `No suspicious activity in ${negativeAreas.join(' or ')}.`;
            }

            return summary;
        } else {
            return '**Alternate Impression for Comparison**: No suspicious activity identified in any region examined.';
        }
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

        // Generate the medical report
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
