const { getDummyProducts } = require('../../models/products/products.model')

async function httpGetDummy(req, res, next) {
  res.status(200).json({
    status: 'success',
    data: {
      products: getDummyProducts(),
    },
  })
}

module.exports = { httpGetDummy }
