const products = require('./products.mongo');

async function getAllProducts() {
  return await products.find();
}

async function getOneProduct({ _id, slug }) {
  let filter = {};
  if (slug) {
    filter = { slug };
  } else {
    filter = { _id };
  }
  return await products.findOne(filter);
}

module.exports = { getAllProducts, getOneProduct };
