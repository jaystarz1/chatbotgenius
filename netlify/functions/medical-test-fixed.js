exports.handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            success: true,
            message: "This is a test of the fixed medical API",
            report: "**History**: 72-year-old man with prostate cancer, status post radical prostatectomy\n\n**Findings**:\n**Head/Neck**: No suspicious activity.\n**Abdomen/Pelvis**: 7 mm node. No other suspicious activity, including the pelvic surgical bed.",
            timestamp: new Date().toISOString()
        })
    };
};
