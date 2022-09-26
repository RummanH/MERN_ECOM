const express = require('express')
const apiV1Router = require('./routes/api_v1')

const app = express()

app.use('/api/v1', apiV1Router)

module.exports = app
