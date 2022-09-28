const {
  getDummyProducts,
  getOneProduct,
  getOneProductById,
} = require('../../models/products/products.model');

function httpGetDummy(req, res, next) {
  res.status(200).json({
    status: 'success',
    data: {
      products: getDummyProducts(),
    },
  });
}

function httpGetOneProduct(req, res, next) {
  const product = getOneProduct(req.params.slug);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No Product found!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}

function httpGetOneProductById(req, res, next) {
  const product = getOneProductById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Product not found' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}

module.exports = { httpGetDummy, httpGetOneProduct, httpGetOneProductById };
