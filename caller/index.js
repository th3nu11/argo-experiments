const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 4000;
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000/work';

let intervalId = null;
let running = false;

const requestCounter = new client.Counter({
    name: 'caller_requests_total',
    help: 'Total number of requests sent to backend'
});

const durationHistogram = new client.Histogram({
    name: 'caller_request_duration_ms',
    help: 'Duration of each backend call in ms',
    labelNames: ['pod']
});

app.get('/hello', (req, res) => {
    res.send('Hello World');
});

async function callBackend() {
    const start = Date.now();
    try {
        const response = await axios.get(backendUrl);
        requestCounter.inc();
        const duration = Date.now() - start;
        const pod = response.data.pod || 'unknown';
        durationHistogram.labels(pod).observe(duration);
    } catch (e) {
        // Optionally log error
    }
}

app.get('/run', (req, res) => {
    const interval = parseInt(req.query.interval, 10) || 1000;
    if (running) return res.json({ status: 'Already running' });
    running = true;
    intervalId = setInterval(() => {
        callBackend();
    }, interval);
    res.json({ status: 'Started', interval });
});

app.get('/stop', (req, res) => {
    if (intervalId) clearInterval(intervalId);
    running = false;
    res.json({ status: 'Stopped' });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(port, () => {
    console.log(`Caller listening on port ${port}`);
});
