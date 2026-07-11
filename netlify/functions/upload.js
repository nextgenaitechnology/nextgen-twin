const { fal } = require('@fal-ai/client');
const busboy = require('busboy');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { fileBuffer, mimeType, fileName } = await parseMultipart(event);
        if (!fileBuffer || fileBuffer.length === 0) {
            return json(400, { error: 'No file uploaded' });
        }

        // fal.storage.upload expects a Blob/File, NOT a raw Buffer.
        // Node 18+ provides global Blob; Node 20+ provides global File.
        let url;
        if (typeof File !== 'undefined') {
            const file = new File([fileBuffer], fileName || 'upload.jpg', { type: mimeType || 'application/octet-stream' });
            url = await fal.storage.upload(file);
        } else {
            const blob = new Blob([fileBuffer], { type: mimeType || 'application/octet-stream' });
            url = await fal.storage.upload(blob);
        }

        return json(200, { url: url });
    } catch (error) {
        console.error('Upload error:', error);
        return json(500, { error: error.message || 'Upload failed' });
    }
};

function parseMultipart(event) {
    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: event.headers });
        let fileBuffer = null;
        let mimeType = '';
        let fileName = '';

        bb.on('file', (name, file, info) => {
            fileName = info.filename;
            mimeType = info.mimeType;
            const chunks = [];
            file.on('data', (d) => chunks.push(d));
            file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
        });
        bb.on('finish', () => resolve({ fileBuffer: fileBuffer, mimeType: mimeType, fileName: fileName }));
        bb.on('error', (err) => reject(err));

        const bodyBuffer = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');
        bb.write(bodyBuffer);
        bb.end();
    });
}

function json(statusCode, obj) {
    return {
        statusCode: statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    };
}
