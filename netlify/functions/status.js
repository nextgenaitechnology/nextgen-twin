const { fal } = require('@fal-ai/client');

// Must match the endpoint used in generate.js
const FAL_ENDPOINT = 'fal-ai/pixverse/swap';

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const requestId = event.queryStringParameters && event.queryStringParameters.id;
        if (!requestId) {
            return json(400, { error: 'Missing id query parameter' });
        }

        const statusResult = await fal.queue.status(FAL_ENDPOINT, { requestId: requestId });
        const s = (statusResult.status || '').toUpperCase();

        // Still waiting in line
        if (s === 'IN_QUEUE' || s === 'QUEUED') {
            return json(200, { id: requestId, status: 'queued', output: null });
        }
        // Actively processing
        if (s === 'IN_PROGRESS') {
            return json(200, { id: requestId, status: 'processing', output: null });
        }
        // Anything that is not COMPLETED here is a failure
        if (s !== 'COMPLETED') {
            return json(200, { id: requestId, status: 'failed', output: null, error: 'fal status: ' + statusResult.status });
        }

        // COMPLETED -> fetch the real result. This THROWS if the job errored.
        let data;
        try {
            const result = await fal.queue.result(FAL_ENDPOINT, { requestId: requestId });
            data = result.data || result;
        } catch (e) {
            const detail = (e && e.body && (e.body.detail || JSON.stringify(e.body))) || e.message || 'Job failed';
            return json(200, { id: requestId, status: 'failed', output: null, error: typeof detail === 'string' ? detail : JSON.stringify(detail) });
        }

        // Find the video url wherever this (or a future) model puts it.
        const videoUrl =
            (data.video && data.video.url) ||
            data.video_url ||
            (Array.isArray(data.videos) && data.videos[0] && data.videos[0].url) ||
            data.url ||
            null;

        const contentType =
            (data.video && data.video.content_type) ||
            (Array.isArray(data.videos) && data.videos[0] && data.videos[0].content_type) ||
            '';

        // Accept it as a video by content-type OR by file extension (don't over-reject).
        const looksLikeVideo =
            (contentType && contentType.toLowerCase().indexOf('video') === 0) ||
            (videoUrl && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(videoUrl));

        if (videoUrl && looksLikeVideo) {
            return json(200, { id: requestId, status: 'succeeded', output: videoUrl });
        }

        // Completed but nothing usable came back -> report why + raw payload for debugging.
        return json(200, {
            id: requestId,
            status: 'failed',
            output: null,
            error: 'Job completed but no video URL was returned',
            raw: data
        });
    } catch (error) {
        const detail = (error && error.body && (error.body.detail || JSON.stringify(error.body))) || error.message || 'Unknown error';
        console.error('Error fetching status:', detail);
        return json(500, { error: typeof detail === 'string' ? detail : JSON.stringify(detail) });
    }
};

function json(statusCode, obj) {
    return {
        statusCode: statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    };
}
