const express = require('express');
const applyCommonMiddlewares = require('./middlewares/common-middlewares');


const app = express();
applyCommonMiddlewares(app);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.all('*', (req, res) => {
  res.status(404).send('OOPS! Page not found');
});

module.exports = app;
