import fetch from 'node-fetch';

const ENDPOINT_1 = process.env.ENDPOINT_1;
const ENDPOINT_2 = process.env.ENDPOINT_2;

if (!ENDPOINT_1 || !ENDPOINT_2) {
    throw new Error('ENDPOINT_1 or ENDPOINT_2 is not defined in environment variables.');
}

async function pingEndpoint(url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            console.log(`Ping successful: ${url} (${res.status})`);
        } else {
            console.error(`Ping failed: ${url} (${res.status})`);
        }
    } catch (err) {
        console.error(`Ping error for ${url}:`, err);
    }
}

async function main() {
    await pingEndpoint(ENDPOINT_1);
    await pingEndpoint(ENDPOINT_2);
}

main();