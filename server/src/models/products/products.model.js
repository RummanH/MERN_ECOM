const Product = require('./products.mongo');

async function getAllProducts() {
  return await Product.find();
}

async function getOneProductById(_id) {
  return await Product.findById(_id);
}

async function getOneProductBySlug(slug) {
  return await Product.findOne({ slug });
}

module.exports = { getAllProducts, getOneProductBySlug, getOneProductById };
