const { products } = require('../../services/data');

function getDummyProducts() {
  return products;
}

function getOneProduct(slug) {
  return products.find((product) => product.slug === slug);
}

function getOneProductById(id) {
  return products.find((product) => product._id === id);
}

module.exports = { getDummyProducts, getOneProduct, getOneProductById };
