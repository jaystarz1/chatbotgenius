// WORKING Medical Transcription - Simplified for Netlify
// Uses built-in fetch (Node 18+) instead of node-fetch

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
                error: 'Method not allowed'
            })
        };
    }

    console.log('=== WORKING FUNCTION START ===');
    
    try {
        const { dictation, options = {} } = JSON.parse(event.body);
        
        if (!dictation) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Dictation required'
                })
            };
        }

        console.log('Dictation received, length:', dictation.length);
        console.log('OpenAI key available:', !!process.env.OPENAI_API_KEY);
        
        // Try OpenAI Assistant first
        let finalReport;
        let processingMode = 'direct-openai';
        let errorDetails = null;

        try {
            console.log('Calling OpenAI Assistant directly...');
            finalReport = await callOpenAIAssistant(dictation);
            console.log('OpenAI Assistant SUCCESS! Response length:', finalReport.length);
        } catch (error) {
            console.log('OpenAI Assistant failed:', error.message);
            errorDetails = error.message;
            processingMode = 'fallback-template';
            finalReport = createFallbackTemplate(dictation);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                report: finalReport,
                metadata: {
                    processingMode: processingMode,
                    openaiKeyAvailable: !!process.env.OPENAI_API_KEY,
                    originalLength: dictation.length,  
                    finalLength: finalReport.length,
                    errorDetails: errorDetails,
                    timestamp: new Date().toISOString(),
                    dictationPreview: dictation.substring(0, 200),
                    reportPreview: finalReport.substring(0, 200)
                }
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
            })
        };
    }
};

// OpenAI Assistant call using built-in fetch
async function callOpenAIAssistant(dictation) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found in environment');
    }

    console.log('Creating OpenAI thread...');
    
    // Create thread
    const threadResponse = await fetch("https://api.openai.com/v1/threads", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        throw new Error(`Thread creation failed: ${threadResponse.status} - ${errorText}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Add message
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
            role: "user",
            content: dictation
        })
    });

    if (!messageResponse.ok) {
        throw new Error(`Message creation failed: ${messageResponse.status}`);
    }

    console.log('Message added to thread');

    // Run assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, 
            "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
            assistant_id: "asst_Qz1Vk53CjXqGDTiEVRxwwcR4"
        })
    });

    if (!runResponse.ok) {
        throw new Error(`Run creation failed: ${runResponse.status}`);
    }

    const run = await runResponse.json();
    console.log('Assistant run started:', run.id);

    // Poll for completion
    let attempts = 0;
    let runStatus = run;
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        if (attempts++ > 30) {
            throw new Error('Assistant timeout after 30 seconds');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            }
        });
        
        runStatus = await statusResponse.json();
        console.log('Run status:', runStatus.status);
    }

    if (runStatus.status !== 'completed') {
        throw new Error(`Assistant failed with status: ${runStatus.status}`);
    }

    // Get response
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
        }
    });

    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (!assistantMessage || !assistantMessage.content[0]) {
        throw new Error('No assistant response found');
    }

    const report = assistantMessage.content[0].text.value.trim();
    console.log('Assistant response received, length:', report.length);
    
    return report;
}

// Fallback template - only used if OpenAI fails
function createFallbackTemplate(dictation) {
    console.log('Creating fallback template');
    
    return `**History**: Patient with medical condition requiring imaging.

**Comparison**: None available.

**Technique**: PET/CT imaging performed.

**Findings**:
**Head/Neck**: No suspicious activity or lymphadenopathy.

**Chest**: No suspicious activity or lymphadenopathy. No pulmonary nodules.

**Abdomen/Pelvis**: No suspicious infradiaphragmatic activity or lymphadenopathy.

**MSK/Integument**: No suspicious skeletal activity or aggressive appearance.

**Impression**: FALLBACK TEMPLATE - OpenAI Assistant failed to process dictation.

**Alternate Impression for Comparison**: This is a fallback response when the AI assistant is unavailable.`;
}
