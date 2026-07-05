const { fal } = require('@fal-ai/client');
const busboy = require('busboy');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        return new Promise((resolve, reject) => {
            const bb = busboy({ headers: event.headers });
            let fileBuffer = null;
            let mimeType = '';
            let fileName = '';

            bb.on('file', (name, file, info) => {
                const { filename, mimeType: mime } = info;
                fileName = filename;
                mimeType = mime;
                const chunks = [];
                file.on('data', (data) => chunks.push(data));
                file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
            });

            bb.on('finish', async () => {
                if (!fileBuffer) {
                    resolve({ statusCode: 400, body: JSON.stringify({ error: 'No file uploaded' }) });
                    return;
                }

                try {
                    const url = await fal.storage.upload(fileBuffer, { contentType: mimeType, fileName: fileName });
                    resolve({ statusCode: 200, body: JSON.stringify({ url }) });
                } catch (e) {
                    resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
                }
            });

            bb.on('error', (err) => {
                reject({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
            });

            bb.write(Buffer.from(event.isBase64Encoded ? event.body : event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
            bb.end();
        });
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
