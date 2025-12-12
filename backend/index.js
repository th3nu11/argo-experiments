const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const podId = process.env.HOSTNAME || "unknown";

const loopCount = process.env.LOOP_COUNT || 1_000_000;

let sleepTimeout = 0; // default sleep timeout in ms

function sleep(ms) {
    if (!ms || ms === 0) return Promise.resolve();
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/hello1', (req, res) => {
    res.send('Hello World 1!');
});

app.get('/setSleep', (req, res) => {
    const ms = parseInt(req.query.ms, 10);
    if (isNaN(ms) || ms < 0) {
        return res.status(400).json({ error: 'Invalid ms value' });
    }
    sleepTimeout = ms;
    res.json({ sleepTimeout });
});

app.get('/work', async (req, res) => {
    const start = process.hrtime.bigint();

    let x = 0;
    for (let i = 0; i < loopCount; i++) {
        x += Math.sqrt(i * Math.random());
    }
    await sleep(sleepTimeout);
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    res.json({
        pod: podId,
        result: x,
        durationMs: durationMs,
        time: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
