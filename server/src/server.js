const https = require('https')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { mongoConnect } = require('./services/mongo')
const app = require('./app')

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '..', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert.pem')),
  },
  app
)

const PORT = process.env.PORT || 5000
;(async () => {
  try {
    await mongoConnect()
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}....`)
    })
  } catch (err) {
    console.log(err)
    console.log('There was an error starting the server!')
  }
})()
