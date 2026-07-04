const { fal } = require('@fal-ai/client');

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const requestId = event.queryStringParameters.id;
        if (!requestId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing id query parameter' })
            };
        }

        const statusResult = await fal.queue.status("fal-ai/pixverse/swap", {
            requestId: requestId
        });
        
        let normalizedStatus = 'queued';
        let output = null;

        if (statusResult.status === 'COMPLETED') {
            normalizedStatus = 'succeeded';
            // fetch the output
            const result = await fal.queue.result("fal-ai/pixverse/swap", {
                requestId: requestId
            });
            output = result.data.video?.url || result.data.url || result.data.image?.url || null;
        } else if (statusResult.status === 'IN_PROGRESS') {
            normalizedStatus = 'processing';
        } else if (statusResult.status === 'FAILED') {
            normalizedStatus = 'failed';
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: requestId, 
                status: normalizedStatus, 
                output: output
            })
        };
    } catch (error) {
        console.error('Error fetching status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
