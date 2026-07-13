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

        // Fal.ai requires publicly accessible URLs. Prevent submitting localhost URLs.
        if (video_url.includes('localhost') || video_url.includes('127.0.0.1')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Cannot process local video files. Please use Option 1 (Cloud Storage) or configure local uploads.' })
            };
        }

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
