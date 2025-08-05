exports.handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            success: true,
            message: "New deployment test - deployed at " + new Date().toISOString(),
            version: "2024-08-05-test"
        })
    };
};
