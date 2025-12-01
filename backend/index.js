const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/hello1', (req, res) => {
  res.send('Hello World 1!');
});

app.get('/hello2', (req, res) => {
  res.send('Hello World 2!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

