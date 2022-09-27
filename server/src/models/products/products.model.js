const { products } = require('../../services/data');

function getDummyProducts() {
  return products;
}

function getOneProduct(slug) {
  return products.find((product) => product.slug === slug);
}

module.exports = { getDummyProducts, getOneProduct };
