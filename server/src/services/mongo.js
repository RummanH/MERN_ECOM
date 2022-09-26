const mongoose = require('mongoose')

mongoose.connection.on('error', (error) => {
  console.log('There was an error connecting to the MONGO_DB database!')
  console.log(error)
})

mongoose.connection.once('open', () => {
  console.log('Successfully connected to the MONGO_DB Database!')
})

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URL)
}

module.exports = { mongoConnect }
