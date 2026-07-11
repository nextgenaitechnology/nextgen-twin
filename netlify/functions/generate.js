const { fal } = require('@fal-ai/client');

// ============================================================
//  MODEL CONFIG
//  To swap models later, change ONLY this one line.
//  fal-ai/pixverse/swap  ->  input:  { video_url, image_url, mode, resolution }
//                            output: { video: { url: "....mp4" } }
// ============================================================
const FAL_ENDPOINT = 'fal-ai/pixverse/swap';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { video_url, image_url } = body;

        if (!video_url || !image_url) {
            return json(400, { error: 'Missing video_url or image_url' });
        }

        // fal.ai can ONLY download PUBLIC http(s) urls. Catch the common mistakes
        // (base64 data: urls, blob: urls, localhost) up front, otherwise the job
        // silently fails because the model cannot fetch the input.
        for (const [label, url] of [['video_url', video_url], ['image_url', image_url]]) {
            if (url.startsWith('data:') || url.startsWith('blob:')) {
                return json(400, { error: label + ' is a local ' + url.split(':')[0] + ': url. Upload the file first and send its public URL.' });
            }
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                return json(400, { error: label + ' points to localhost, which fal.ai cannot reach. Deploy the site so the URL is public.' });
            }
        }

        // Submit to the queue. Returns immediately with a request_id we poll later.
        const submitted = await fal.queue.submit(FAL_ENDPOINT, {
            input: {
                video_url: video_url,          // TEMPLATE video (the moving footage)
                image_url: image_url,          // SOURCE face (the uploaded photo)
                mode: 'person',                // person | object | background
                resolution: '720p',            // 360p | 540p | 720p  (1080p not supported)
                original_sound_switch: true    // keep the template's audio
            }
        });

        return json(200, { id: submitted.request_id, status: 'queued' });
    } catch (error) {
        // Surface fal.ai's REAL error/validation message instead of a generic 500.
        const detail = (error && error.body && (error.body.detail || JSON.stringify(error.body))) || error.message || 'Unknown error';
        console.error('Error generating:', detail);
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
