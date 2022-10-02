const products = require('./products.mongo');

async function getAllProducts() {
  return await products.find({}, { __v: 0 });
}

async function getOneProduct({ _id, slug }) {
  let filter = {};
  if (slug) {
    filter = { slug };
  }
  if (_id) {
    filter = { _id };
  }
  return await products.findOne(filter);
}

module.exports = { getAllProducts, getOneProduct };
