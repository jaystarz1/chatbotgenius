// Minimal test version of medical transcription API
// This is a simplified version to test if the basic function works

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

    console.log('=== MINIMAL TEST FUNCTION CALLED ===');
    console.log('Event body:', event.body);
    console.log('Environment check - OpenAI key exists:', !!process.env.OPENAI_API_KEY);

    try {
        const { dictation, options = {} } = JSON.parse(event.body);
        console.log('Parsed dictation length:', dictation?.length || 0);

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

        // Simple test response
        const testReport = `**History**: Test patient with test condition.

**Comparison**: None.

**Technique**: Test technique.

**Findings**:
**Head/Neck**: Test findings in head and neck.

**Chest**: Test findings in chest.

**Abdomen/Pelvis**: Test findings in abdomen and pelvis.

**MSK/Integument**: Test findings in bones.

**Impression**: This is a minimal test response.

**Alternate Impression for Comparison**: Minimal test completed successfully.`;

        const metadata = {
            test_mode: true,
            original_length: dictation.length,
            timestamp: new Date().toISOString(),
            function_status: 'working',
            openai_key_available: !!process.env.OPENAI_API_KEY,
            DEBUG_originalDictation: dictation.substring(0, 200)
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                report: testReport,
                metadata: metadata
            })
        };

    } catch (error) {
        console.error('Error in minimal test:', error);
        
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
