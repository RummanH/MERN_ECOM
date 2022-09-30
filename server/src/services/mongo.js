const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');

let CONNECTION_URL = process.env.DEVELOPMENT_DATABASE;
//use different database for production
if (process.env.NODE_ENV === 'production') {
  CONNECTION_URL = process.env.PRODUCTION_DATABASE;
}

mongoose.connection.on('error', (error) => {
  console.log('There was an error connecting to the database!');
  console.log(error);
});

mongoose.connection.once('open', () => {
  console.log(
    `Successfully connected to the ${process.env.NODE_ENV} Database!`
  );
});

async function mongoConnect() {
  await mongoose.connect(CONNECTION_URL);
}
module.exports = { mongoConnect };
