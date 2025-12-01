const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const podId = process.env.HOSTNAME || "unknown";

const loopCount = 10_000_000;

app.get('/hello1', (req, res) => {
    res.send('Hello World 1!');
});

app.get('/work', (req, res) => {
    const start = process.hrtime.bigint();

    let x = 0;
    for (let i = 0; i < loopCount; i++) {
        x += Math.sqrt(i * Math.random());
    }
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    res.json({
        pod: podId,
        result: x,
        durationMs: durationMs
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

