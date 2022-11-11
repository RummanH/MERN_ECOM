const Product = require('../models/products/products.mongo');
const { mongoConnect } = require('./mongo');
const data = require('../../data/data');

(async () => {
  await mongoConnect();
})();

const importData = async () => {
  try {
    await Product.create(data.products);
    console.log('Successfully loaded data');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
