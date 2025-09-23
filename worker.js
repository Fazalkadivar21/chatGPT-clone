const fetch = require('node-fetch');

const ENDPOINT_1 = process.env.ENDPOINT_1;
const ENDPOINT_2 = process.env.ENDPOINT_2;

if (!ENDPOINT_1 || !ENDPOINT_2) {
    throw new Error('Please define ENDPOINT_1 and ENDPOINT_2 in your environment variables.');
}

function ping(url) {
    fetch(url)
        .then(res => {
            if (res.ok) console.log(`Ping successful: ${url} (${res.status})`);
            else console.log(`Ping failed: ${url} (${res.status})`);
        })
        .catch(err => console.error(`Ping error for ${url}:`, err));
}

// Ping both endpoints
ping(ENDPOINT_1);
ping(ENDPOINT_2);
