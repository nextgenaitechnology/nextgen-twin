const { fal } = require('@fal-ai/client');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const { video_url, image_url } = body;

        if (!video_url || !image_url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing video_url or image_url' })
            };
        }

        // We use fal.queue.submit for asynchronous processing
        // Ensure FAL_KEY is set in your Netlify dashboard environment variables
        const result = await fal.queue.submit("fal-ai/pixverse/swap", {
            input: {
                video_url: video_url,
                image_url: image_url
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: result.request_id, status: 'queued' })
        };
    } catch (error) {
        console.error('Error generating:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
