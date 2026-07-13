exports.handler = async (event, context) => {
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

        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN in environment' })
            };
        }

        const response = await fetch(`https://api.replicate.com/v1/predictions/${requestId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.detail || 'Replicate API error' })
            };
        }

        let normalizedStatus = 'queued';
        let output = null;

        // Replicate statuses: starting, processing, succeeded, failed, canceled
        if (data.status === 'starting' || data.status === 'queued') {
            normalizedStatus = 'queued';
        } else if (data.status === 'processing') {
            normalizedStatus = 'processing';
        } else if (data.status === 'succeeded') {
            normalizedStatus = 'succeeded';
            // Output is usually a URL or an array of URLs.
            // ddvinh1/video-faceswap-gpu typically returns a single URL string for the video.
            if (Array.isArray(data.output)) {
                output = data.output[0];
            } else {
                output = data.output;
            }
        } else if (data.status === 'failed' || data.status === 'canceled') {
            normalizedStatus = 'failed';
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
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
