// FRESH START - Minimal Medical Transcription Function
// This version focuses on getting the OpenAI Assistant working first

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

    console.log('=== FRESH FUNCTION START ===');
    
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
        
        // Test direct OpenAI Assistant call
        let finalReport;
        let processingMode = 'direct-openai';
        let errorDetails = null;

        try {
            console.log('Calling OpenAI Assistant...');
            finalReport = await callOpenAIAssistant(dictation);
            console.log('OpenAI Assistant success, response length:', finalReport.length);
        } catch (error) {
            console.log('OpenAI Assistant failed:', error.message);
            errorDetails = error.message;
            processingMode = 'fallback-template';
            finalReport = createBasicTemplate(dictation);
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
                    preview: dictation.substring(0, 100)
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
                error: error.message
            })
        };
    }
};

// Simple OpenAI Assistant call
async function callOpenAIAssistant(dictation) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found');
    }

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
        throw new Error(`Thread creation failed: ${threadResponse.status}`);
    }

    const thread = await threadResponse.json();

    // Add message
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
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
        throw new Error(`Run failed: ${runResponse.status}`);
    }

    const run = await runResponse.json();

    // Poll for completion
    let attempts = 0;
    let runStatus = run;
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        if (attempts++ > 30) {
            throw new Error('Assistant timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            }
        });
        
        runStatus = await statusResponse.json();
    }

    if (runStatus.status !== 'completed') {
        throw new Error(`Assistant failed: ${runStatus.status}`);
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
    
    if (!assistantMessage) {
        throw new Error('No assistant response');
    }

    return assistantMessage.content[0].text.value.trim();
}

// Fallback template
function createBasicTemplate(dictation) {
    return `**History**: Medical history from dictation.

**Comparison**: None.

**Technique**: PET/CT scan performed.

**Findings**:
**Head/Neck**: No suspicious activity or lymphadenopathy.

**Chest**: No suspicious activity or lymphadenopathy. No pulmonary nodules.

**Abdomen/Pelvis**: No suspicious infradiaphragmatic activity or lymphadenopathy.

**MSK/Integument**: No suspicious skeletal activity or aggressive appearance.

**Impression**: Template response - OpenAI Assistant failed.

**Alternate Impression for Comparison**: This is a fallback template.`;
}
