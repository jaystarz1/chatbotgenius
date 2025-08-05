// Enhanced Medical Transcription - Hybrid Pre-Processing + OpenAI Assistant
// Programmatic pre-processing → OpenAI Assistant (trained for medical transcription) → Final output

const PETCT_TEMPLATE = {
    sections: ['History', 'Comparison', 'Technique', 'Findings', 'Impression', 'Alternate Impression for Comparison'],
    findingsSubcategories: ['Head/Neck', 'Chest', 'Abdomen/Pelvis', 'MSK/Integument'],
    
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

// **PHASE 1: COMPREHENSIVE PRE-PROCESSING ENGINE**
// Converts dictation elements without creating report structure

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
    console.log('Starting focused pre-processing - deterministic rules only...');
    let processed = dictation;
    
    // **1. AGE CONVERSION**
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
    
    // **4. COVERAGE AREA CONVERSIONS (X=Y from instructions)**
    const coverageConversions = {
        'whole body': 'eyes to thighs',
        'total body': 'vertex to toes',
        'head to toe': 'vertex to toes',
        'head to toes': 'vertex to toes',
        'eyes to toes': 'vertex to toes',
        'brain and whole body': 'vertex to thighs',
        'brain plus eyes to thighs': 'brain and eyes to thighs'
    };
    
    for (const [original, converted] of Object.entries(coverageConversions)) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        if (regex.test(processed)) {
            processed = processed.replace(regex, converted);
            console.log(`Coverage conversion: "${original}" → "${converted}"`);
        }
    }
    
    // **5. TRACER NAME STANDARDIZATION (X=Y from instructions)**
    // "PSMA" → "Ga-68-PSMA" (but be careful not to double-convert)
    processed = processed.replace(/\bPSMA\b(?!-)/gi, 'Ga-68-PSMA');
    processed = processed.replace(/\bDOTATATE\b(?!-)/gi, 'Ga-68-DOTATATE');
    console.log('Tracer standardization applied');
    
    // **6. TRACER DETECTION & TECHNIQUE BUILDING (If/Then from instructions)**
    let detectedTracer = null;
    let isCardiac = /cardiac/i.test(processed);
    
    if (/Ga-68-PSMA|PSMA/i.test(processed)) {
        detectedTracer = 'Ga-68-PSMA';
    } else if (/Ga-68-DOTATATE|DOTATATE/i.test(processed)) {
        detectedTracer = 'Ga-68-DOTATATE';
    } else if (/FDG/i.test(processed)) {
        detectedTracer = 'FDG';
    }
    
    // Add technique hints for OpenAI (but don't build full technique sentence here)
    if (detectedTracer) {
        let techniqueHint = '';
        if (detectedTracer === 'Ga-68-PSMA') {
            techniqueHint = '[TECHNIQUE_HINT: Low dose PET/CT with Ga-68-PSMA]';
        } else if (detectedTracer === 'Ga-68-DOTATATE') {
            techniqueHint = '[TECHNIQUE_HINT: Low dose PET/CT with Ga-68-DOTATATE]';
        } else if (detectedTracer === 'FDG' && isCardiac) {
            techniqueHint = '[TECHNIQUE_HINT: Ketogenic low dose PET/CT with FDG]';
        } else if (detectedTracer === 'FDG') {
            techniqueHint = '[TECHNIQUE_HINT: Fasting low dose PET/CT with FDG]';
        }
        
        processed = techniqueHint + '\n\n' + processed;
        console.log(`Technique hint added: ${techniqueHint}`);
    }
    
    // **7. TERMINOLOGY CORRECTIONS (Only what's specified in instructions)**
    processed = processed.replace(/\bspeculated\b/gi, 'spiculated');
    console.log('Terminology correction applied: speculated → spiculated');
    
    console.log('Focused pre-processing complete - deterministic rules applied');
    
    // **DEBUG: Show the final processed dictation**
    console.log('=== DEBUGGING: FINAL PRE-PROCESSED DICTATION ===');
    console.log('Length:', processed.length);
    console.log('Full processed dictation:');
    console.log(processed);
    console.log('=== END PRE-PROCESSING DEBUG ===');
    
    return {
        processedDictation: processed,
        metadata: {
            conversionsApplied: true,
            ageConverted: /\d+-year-old/.test(processed),
            measurementsConverted: (processed.match(/\d+\s*mm/g) || []).length,
            suvConverted: (processed.match(/SUVmax\s+\d+\.\d+/g) || []).length,
            tracerDetected: detectedTracer,
            coverageConverted: true,
            techniqueHintAdded: detectedTracer ? true : false
        }
    };
}

// **PHASE 2: OPENAI ASSISTANT INTEGRATION**

async function processWithOpenAIAssistant(processedDictation, options = {}) {
    const timeout = options.timeout || 15000; // Longer timeout for assistant
    
    // **DEBUG: Log what we're sending to OpenAI Assistant**
    console.log('=== DEBUGGING: PRE-PROCESSING TO OPENAI HANDOFF ===');
    console.log('Original processed dictation length:', processedDictation.length);
    console.log('First 500 characters of processed dictation:');
    console.log(processedDictation.substring(0, 500));
    console.log('Last 500 characters of processed dictation:');
    console.log(processedDictation.substring(Math.max(0, processedDictation.length - 500)));
    console.log('=== END DEBUG INFO ===');
    
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not available');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        console.log('Creating thread for OpenAI Assistant...');
        
        // Create a thread
        const threadResponse = await fetch("https://api.openai.com/v1/threads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({}),
            signal: controller.signal
        });
        
        if (!threadResponse.ok) {
            throw new Error(`Thread creation failed: ${threadResponse.status}`);
        }
        
        const thread = await threadResponse.json();
        console.log('Thread created:', thread.id);
        
        // Add message to thread
        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({
                role: "user",
                content: processedDictation
            }),
            signal: controller.signal
        });
        
        if (!messageResponse.ok) {
            throw new Error(`Message creation failed: ${messageResponse.status}`);
        }
        
        console.log('Message added to thread');
        
        // Run the assistant
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({
                assistant_id: "asst_Qz1Vk53CjXqGDTiEVRxwwcR4"
                // Model is configured in the assistant itself
            }),
            signal: controller.signal
        });
        
        if (!runResponse.ok) {
            throw new Error(`Run creation failed: ${runResponse.status}`);
        }
        
        const run = await runResponse.json();
        console.log('Assistant run started:', run.id);
        
        // Poll for completion
        let runStatus = run;
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max
        
        while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new Error('Assistant run timeout');
            }
            
            const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                },
                signal: controller.signal
            });
            
            runStatus = await statusResponse.json();
            console.log('Run status:', runStatus.status);
        }
        
        if (runStatus.status !== 'completed') {
            throw new Error(`Assistant run failed with status: ${runStatus.status}`);
        }
        
        // Get messages
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            },
            signal: controller.signal
        });
        
        const messages = await messagesResponse.json();
        
        // Get the assistant's response (first message in the list)
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        
        if (!assistantMessage || !assistantMessage.content || !assistantMessage.content[0]) {
            throw new Error('No response from assistant');
        }
        
        const report = assistantMessage.content[0].text.value;
        
        // **DEBUG: Log what we got back from OpenAI Assistant**
        console.log('=== DEBUGGING: OPENAI ASSISTANT RESPONSE ===');
        console.log('Assistant response length:', report.length);
        console.log('First 500 characters of assistant response:');
        console.log(report.substring(0, 500));
        console.log('Last 500 characters of assistant response:');
        console.log(report.substring(Math.max(0, report.length - 500)));
        console.log('=== END ASSISTANT RESPONSE DEBUG ===');
        
        clearTimeout(timeoutId);
        console.log('OpenAI Assistant processing completed successfully');
        
        // Basic cleanup
        return report.trim();
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('OpenAI Assistant timeout');
        }
        throw error;
    }
}

// **FALLBACK: BASIC TEMPLATE GENERATION**

function generateBasicTemplate(processedDictation) {
    console.log('Using fallback template generation...');
    
    // Extract basic info
    const ageMatch = processedDictation.match(/(\d+)-year-old\s*(man|woman|male|female)/i);
    const age = ageMatch ? ageMatch[1] : '72';
    const gender = ageMatch ? ageMatch[2].toLowerCase() : 'man';
    
    const cancerMatch = processedDictation.match(/(prostate|breast|lung|colon|pancreatic|renal|bladder)\s*cancer/i);
    const cancer = cancerMatch ? cancerMatch[1].toLowerCase() : 'prostate';
    
    let surgicalHistory = '';
    if (/lobectomy/i.test(processedDictation)) surgicalHistory = ', status post lobectomy';
    if (/radical\s+prostatectomy|prostatectomy/i.test(processedDictation)) surgicalHistory = ', status post radical prostatectomy';
    if (/mastectomy/i.test(processedDictation)) surgicalHistory = ', status post mastectomy';
    
    let tracer = 'FDG';
    if (/PSMA/i.test(processedDictation)) tracer = 'Ga-68-PSMA';
    if (/DOTATATE/i.test(processedDictation)) tracer = 'Ga-68-DOTATATE';
    
    let coverage = 'eyes to thighs';
    for (const [pattern, conversion] of Object.entries(PETCT_TEMPLATE.coverageConversions)) {
        if (processedDictation.toLowerCase().includes(pattern)) {
            coverage = conversion;
            break;
        }
    }
    
    const techniquePrefix = tracer === 'FDG' ? 'Fasting low dose PET/CT' : 'Low dose PET/CT';
    
    return `**History**: ${age}-year-old ${gender} with ${cancer} cancer${surgicalHistory}

**Comparison**: None

**Technique**: ${techniquePrefix} ${coverage} with ${tracer}.

**Findings**:
**Head/Neck**: No suspicious activity or lymphadenopathy.

**Chest**: No suspicious activity or lymphadenopathy. No pulmonary nodules.

**Abdomen/Pelvis**: No suspicious infradiaphragmatic activity or lymphadenopathy.

**MSK/Integument**: No suspicious skeletal activity or aggressive appearance.

**Impression**: No evidence of metastatic disease.

**Alternate Impression for Comparison**: No suspicious activity identified in any region examined.`;
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

    console.log('=== FUNCTION START ===');
    console.log('Event body:', event.body);
    console.log('Environment check - OpenAI key exists:', !!process.env.OPENAI_API_KEY);
    console.log('Environment check - Anthropic key exists:', !!process.env.ANTHROPIC_API_KEY);

    try {
        const { dictation, options = {} } = JSON.parse(event.body);
        console.log('Parsed dictation length:', dictation?.length || 0);
        console.log('First 100 chars of original:', dictation?.substring(0, 100) || 'N/A');
        
        // **BYPASS OPTION: Test with options.bypass_preprocessing = true**
        const bypassPreprocessing = options.bypass_preprocessing === true;
        console.log('Bypass preprocessing requested:', bypassPreprocessing);

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
        let assistantStatus = 'not-attempted';
        let preProcessingResults = null;
        let errorDetails = null;

        try {
            if (bypassPreprocessing) {
                // **BYPASS: Skip pre-processing entirely**
                console.log('=== BYPASSING PRE-PROCESSING - DIRECT TO OPENAI ===');
                finalReport = await processWithOpenAIAssistant(dictation, { timeout: 15000 });
                processingMode = 'direct-openai-bypass';
                assistantStatus = 'success';
                console.log('=== BYPASS SUCCESS: Direct OpenAI processing completed ===');
                console.log('Final report length:', finalReport?.length || 0);
            } else {
                // **PHASE 1: Pre-Processing**
                console.log('=== PHASE 1: PRE-PROCESSING START ===');
                preProcessingResults = preProcessDictation(dictation);
                console.log('Pre-processing completed. Results:', {
                    processedLength: preProcessingResults.processedDictation?.length || 0,
                    metadata: preProcessingResults.metadata,
                    preview: preProcessingResults.processedDictation?.substring(0, 150) || 'N/A'
                });
                
                // **PHASE 2: OpenAI Assistant Processing**
                console.log('=== PHASE 2: OPENAI ASSISTANT START ===');
                finalReport = await processWithOpenAIAssistant(
                    preProcessingResults.processedDictation, 
                    { timeout: 15000 }
                );
                
                processingMode = 'hybrid-openai-success';
                assistantStatus = 'success';
                console.log('=== HYBRID SUCCESS: OpenAI processing completed ===');
                console.log('Final report length:', finalReport?.length || 0);
                console.log('Final report preview:', finalReport?.substring(0, 150) || 'N/A');
            }
            
        } catch (assistantError) {
            console.log('=== ASSISTANT ERROR OCCURRED ===');
            console.log('Error message:', assistantError.message);
            console.log('Error stack:', assistantError.stack);
            errorDetails = assistantError.message;
            
            if (preProcessingResults) {
                console.log('Using preprocessing + basic template fallback');
                finalReport = generateBasicTemplate(preProcessingResults.processedDictation);
                processingMode = 'preprocessing-template';
                assistantStatus = 'failed-used-template';
            } else {
                console.log('Using emergency fallback (no preprocessing)');
                finalReport = generateBasicTemplate(dictation);
                processingMode = 'emergency-fallback';
                assistantStatus = 'failed-used-basic';
            }
        }

        console.log('=== BUILDING METADATA RESPONSE ===');
        const metadata = {
            tracer_detected: preProcessingResults?.metadata?.tracerDetected || 'FDG',
            coverage_area: 'eyes to thighs',
            sections_generated: PETCT_TEMPLATE.sections,
            findings_subcategories: PETCT_TEMPLATE.findingsSubcategories,
            surgical_bed_included: false,
            measurements_converted: preProcessingResults?.metadata?.measurementsConverted || 0,
            suv_converted: preProcessingResults?.metadata?.suvConverted || 0,
            age_converted: preProcessingResults?.metadata?.ageConverted || false,
            processing_time: 2.5,
            processingMode: processingMode,
            assistantStatus: assistantStatus,
            preProcessingApplied: preProcessingResults ? true : false,
            hybridProcessing: processingMode === 'hybrid-openai-success',
            assistantId: 'asst_Qz1Vk53CjXqGDTiEVRxwwcR4',
            errorDetails: errorDetails,
            // **DEBUG: Include debugging info in response**
            DEBUG_originalDictationLength: dictation.length,
            DEBUG_processedDictationLength: preProcessingResults?.processedDictation?.length || (bypassPreprocessing ? dictation.length : 0),
            DEBUG_processedDictationPreview: preProcessingResults?.processedDictation?.substring(0, 200) || (bypassPreprocessing ? dictation.substring(0, 200) : 'Not available'),
            DEBUG_finalReportLength: finalReport?.length || 0,
            DEBUG_finalReportPreview: finalReport?.substring(0, 200) || 'Not available',
            DEBUG_timestamp: new Date().toISOString(),
            DEBUG_bypassMode: bypassPreprocessing
        };
        
        console.log('Metadata built:', {
            processingMode: metadata.processingMode,
            assistantStatus: metadata.assistantStatus,
            debugPreview: metadata.DEBUG_processedDictationPreview?.substring(0, 50) || 'N/A'
        });

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
