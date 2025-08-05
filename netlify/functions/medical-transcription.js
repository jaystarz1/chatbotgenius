// Netlify Function for Medical PET/CT Transcription - COMPLETE REWRITE
// Properly formats casual dictation into professional medical reports

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
        // Extract age and gender
        const ageGenderMatch = text.match(/(\d+)[-\s]?year[-\s]?old\s*(man|woman|male|female|boy|girl)/i);
        let history = '';
        
        if (ageGenderMatch) {
            history = `${ageGenderMatch[1]}-year-old ${ageGenderMatch[2].toLowerCase()}`;
        }
        
        // Extract cancer type
        const cancerMatch = text.match(/(prostate|breast|lung|colon|rectal|pancreatic|liver|kidney|bladder|lymph|thyroid|brain|ovarian|cervical|testicular|melanoma|sarcoma)\s*cancer/i);
        if (cancerMatch) {
            history += ` with ${cancerMatch[0].toLowerCase()}`;
        }
        
        // Extract surgical history
        if (/prostate\s*(taken out|removed)|prostatectomy/i.test(text)) {
            history += ', status post radical prostatectomy';
            const yearMatch = text.match(/(?:in|back in)\s*(twenty\s*twenty[-\s]?\w+|\d{4})/i);
            if (yearMatch) {
                const year = this.convertYear(yearMatch[1]);
                if (year) history += ` ${year}`;
            }
        }
        
        if (/mastectomy/i.test(text)) {
            const sideMatch = text.match(/(left|right|bilateral)\s*(?:side)?\s*mastectomy/i);
            history += sideMatch ? `, status post ${sideMatch[1].toLowerCase()} mastectomy` : ', status post mastectomy';
        }
        
        // Extract PSA or tumor markers
        const psaMatch = text.match(/PSA\s*(?:is|was|went)?\s*(?:up to|from)?\s*([\d.]+)\s*(?:to\s*([\d.]+))?/i);
        if (psaMatch) {
            if (psaMatch[2]) {
                history += `. Rising PSA from ${psaMatch[1]} to ${psaMatch[2]}`;
            } else {
                history += `. PSA ${psaMatch[1]}`;
            }
        }
        
        const caMatch = text.match(/CA\s*fifteen\s*three\s*(?:went|rose)?\s*from\s*([\d.]+)\s*to\s*([\d.]+)/i);
        if (caMatch) {
            history += `. CA 15-3 rising from ${caMatch[1]} to ${caMatch[2]}`;
        }
        
        return history || '[History not specified]';
    }

    extractComparison(text) {
        const patterns = [
            /comparing?\s*(?:this)?\s*to\s*(?:his|her|their)?\s*(?:last|prior|previous)?\s*(.*?)(?:from|dated)?\s*([A-Za-z]+\s*(?:twenty\s*twenty[-\s]?\w+|\d{4}))/i,
            /(?:last|prior|previous)\s*(PSMA|FDG|PET|CT|scan).*?from\s*([A-Za-z]+\s*(?:twenty\s*twenty[-\s]?\w+|\d{4}))/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const scanType = match[1] ? match[1].trim() : 'PET/CT';
                const date = this.convertDate(match[2]);
                return `${scanType} from ${date}`.replace(/\s+/g, ' ');
            }
        }
        
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
                // Clean up the impression
                impression = impression.replace(/^that\s+/i, '');
                impression = impression.charAt(0).toUpperCase() + impression.slice(1);
                
                // Add comparison if mentioned separately
                const compMatch = text.match(/compared\s*to\s*[A-Za-z]+,?\s*(.*)/i);
                if (compMatch) {
                    impression += '. ' + compMatch[0].charAt(0).toUpperCase() + compMatch[0].slice(1);
                }
                
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
        
        // Process dictation text with all conversions
        let processedText = this.applyAllConversions(dictation);
        
        // Extract findings for each region
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
        
        // Clean up the text first - INCLUDING measurement conversions
        text = this.cleanMedicalText(text);
        
        // Apply conversions BEFORE splitting into sentences
        text = this.applyAllConversions(text);
        
        // Split into sentences
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
        // Remove casual language
        text = text.replace(/I\s*(don't|do not)\s*see\s*any/gi, 'No');
        text = text.replace(/everything(?:'s|\s*is)?\s*(quiet|normal|fine|good|okay)/gi, 'No abnormal activity');
        text = text.replace(/looks?\s*(normal|fine|good|okay|clear)/gi, 'unremarkable');
        text = text.replace(/nothing\s*lighting\s*up/gi, 'no abnormal uptake');
        text = text.replace(/no\s*bad\s*areas/gi, 'no suspicious areas');
        text = text.replace(/I\s*see\s*a?/gi, '');
        text = text.replace(/there(?:'s|\s*is)\s*a?/gi, '');
        text = text.replace(/(?:his|her|the)\s*(lungs?|liver|kidneys?|bones?)\s*(?:are|is)/gi, '$1');
        
        // Apply measurement conversions
        text = this.convertAllMeasurements(text);
        
        // Apply SUV formatting
        text = this.formatSUVValues(text);
        
        // Apply image reference formatting
        text = this.formatImageReferences(text);
        
        // Apply terminology corrections
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
        // Convert written numbers to digits
        const numberWords = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14', 'fifteen': '15'
        };
        
        // First convert word numbers with measurements
        for (const [word, digit] of Object.entries(numberWords)) {
            // Convert "seven millimeters" to "7 mm"
            text = text.replace(new RegExp(`\\b${word}\\s+millimeters?\\b`, 'gi'), `${digit} mm`);
            // Convert "seven centimeters" to "70 mm"
            text = text.replace(new RegExp(`\\b${word}\\s+(?:centimeters?|cm)\\b`, 'gi'), `${parseInt(digit) * 10} mm`);
            // Convert "one point five" to "1.5"
            text = text.replace(new RegExp(`\\b${word}\\s*point\\s*(\\d+)`, 'gi'), `${digit}.$1`);
        }
        
        // Convert cm to mm for numeric values
        text = text.replace(/(\d+\.?\d*)\s*(?:centimeters?|cm)/gi, (match, num) => {
            return `${Math.round(parseFloat(num) * 10)} mm`;
        });
        
        // Convert decimal measurements
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
        // Format SUV values properly
        text = text.replace(/SUV\s*(?:of|is)?\s*(?:about)?\s*([\d.]+)/gi, 'SUVmax $1');
        
        // Handle "SUV of two point nine" format
        text = text.replace(/(?:an?\s*)?SUV\s*(?:of\s*)?([a-zA-Z]+)\s*point\s*(\d+)/gi, (match, whole, decimal) => {
            const num = this.wordToNumber(whole);
            return num ? `SUVmax ${num}.${decimal}` : match;
        });
        
        // Clean up any remaining "an SUV" or "a SUV"
        text = text.replace(/\b(?:an?\s+)?SUV\b/gi, 'SUVmax');
        
        return text;
    }

    formatImageReferences(text) {
        // Convert various image reference formats
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
            'pretty good': 'significantly',
            'mild': 'mild',
            'simple cyst': 'simple cyst',
            'degenerative changes': 'degenerative changes'
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
            'nineteen': 19, 'twenty': 20, 'thirty': 30, 'forty': 40,
            'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80,
            'ninety': 90, 'hundred': 100
        };
        
        const lower = word.toLowerCase();
        if (numbers[lower]) return numbers[lower];
        
        // Handle compound numbers like "twenty-eight"
        const parts = lower.split(/[-\s]+/);
        if (parts.length === 2 && numbers[parts[0]] && numbers[parts[1]]) {
            return numbers[parts[0]] + numbers[parts[1]];
        }
        
        return null;
    }

    convertYear(yearText) {
        if (/\d{4}/.test(yearText)) return yearText;
        
        const yearMap = {
            'twenty twenty': '2020',
            'twenty twenty one': '2021',
            'twenty twenty-one': '2021',
            'twenty twenty two': '2022',
            'twenty twenty-two': '2022',
            'twenty twenty three': '2023',
            'twenty twenty-three': '2023',
            'twenty twenty four': '2024',
            'twenty twenty-four': '2024',
            'twenty twenty five': '2025',
            'twenty twenty-five': '2025'
        };
        
        const lower = yearText.toLowerCase().replace(/[^\w\s-]/g, '');
        return yearMap[lower] || yearText;
    }

    convertDate(dateText) {
        const monthMap = {
            'january': 'January', 'february': 'February', 'march': 'March',
            'april': 'April', 'may': 'May', 'june': 'June',
            'july': 'July', 'august': 'August', 'september': 'September',
            'october': 'October', 'november': 'November', 'december': 'December'
        };
        
        let converted = dateText;
        
        // Convert month names
        for (const [lower, proper] of Object.entries(monthMap)) {
            converted = converted.replace(new RegExp(lower, 'gi'), proper);
        }
        
        // Convert years
        converted = converted.replace(/twenty\s*twenty[-\s]?(\w+)/gi, (match, suffix) => {
            const year = this.convertYear(match);
            return year || match;
        });
        
        return converted;
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
                // Format positive findings properly
                const findingsTexts = positiveFindings.map(f => {
                    let text = f.text;
                    // Ensure proper capitalization
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                    // Ensure proper ending
                    if (!text.match(/[.!?]$/)) text += '.';
                    return text;
                });
                
                result += findingsTexts.join(' ') + ' ';
                
                // Add mandatory phrases
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
            
            // Add surgical bed for prostatectomy cases - ONLY for current section
            if (category === 'Abdomen/Pelvis' && parsed.hasProstatectomy) {
                // Find the last occurrence of lymphadenopathy in the current section
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
            
            // Add incidental findings
            const incidentals = this.extractIncidentalFindings(originalText, category);
            if (incidentals) {
                result += ' ' + incidentals;
            }
            
            if (index < this.template.findingsSubcategories.length - 1) {
                result += '\n\n';
            }
        });
        
        return result;
    }

    extractIncidentalFindings(text, category) {
        const patterns = {
            'Chest': [/coronary\s*(?:artery)?\s*calcification/i, /atherosclerotic/i],
            'Abdomen/Pelvis': [/simple\s*cyst|renal\s*cyst|hepatic\s*cyst/i, /normal\s*bowel\s*activity/i],
            'MSK/Integument': [/degenerative\s*chang/i, /arthropathy/i]
        };
        
        const categoryPatterns = patterns[category] || [];
        for (const pattern of categoryPatterns) {
            const match = text.match(pattern);
            if (match) {
                let finding = match[0];
                finding = finding.charAt(0).toUpperCase() + finding.slice(1);
                if (!finding.endsWith('.')) finding += '.';
                return finding;
            }
        }
        
        return '';
    }

    buildImpression(impression) {
        return `**Impression**: ${impression}`;
    }

    buildAlternateImpression(parsed) {
        const findings = [];
        
        // Collect all positive findings
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
            // Summarize key findings
            const keyFindings = findings.slice(0, 3).map(f => {
                // Extract the key element from each finding
                const match = f.match(/(\d+\s*mm\s*[\w\s]+(?:node|nodule|lesion|mass|focus))/i);
                return match ? match[1] : f.split('.')[0];
            });
            
            summary += keyFindings.join(', ') + '.';
            
            // Add negative regions
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

// Netlify Function Handler
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

        const generator = new PETCTReportGenerator(PETCT_TEMPLATE);
        const result = generator.generateReport(dictation, options);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                ...result
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

// Force deployment: Mon  4 Aug 2025 23:59:56 EDT
