const path = require('path');

const express = require('express');
const cors = require('cors');

const globalErrorHandler = require('./services/errorHandler');
const apiV1Router = require('./routes/api_v1');

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1', apiV1Router);

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(globalErrorHandler);

module.exports = app;
