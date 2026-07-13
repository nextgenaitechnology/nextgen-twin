exports.handler = async (event, context) => {
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

        if (video_url.includes('localhost') || video_url.includes('127.0.0.1')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Cannot process local files.' })
            };
        }

        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN in environment' })
            };
        }

        // Call Replicate API
        const response = await fetch("https://api.replicate.com/v1/models/ddvinh1/video-faceswap-gpu/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Prefer": "wait=1" // Don't block for long, return quickly
            },
            body: JSON.stringify({
                input: {
                    target_video: video_url,
                    source_image: image_url
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Replicate API Error:", data);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.detail || 'Replicate API error' })
            };
        }

        // data.id is the prediction ID
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.id, status: 'queued' })
        };
    } catch (error) {
        console.error('Error generating:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

