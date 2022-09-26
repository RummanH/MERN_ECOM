const { products } = require('../../services/data')

function getDummyProducts() {
  return products
}

module.exports = { getDummyProducts }
