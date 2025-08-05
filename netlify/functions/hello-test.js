// Ultra-minimal test function - just return "hello"
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            success: true,
            message: 'Hello from Netlify function!',
            timestamp: new Date().toISOString()
        })
    };
};
