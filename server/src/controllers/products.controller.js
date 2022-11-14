const {
  getAllProducts,
  getOneProductBySlug,
  getOneProductById,
} = require('../models/products/products.model');
const AppError = require('../services/AppError');

async function httpGetOneProductBySlug(req, res, next) {
  const product = await getOneProductBySlug(req.params.slug);
  if (!product) {
    return next(new AppError('No product found!', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}

async function httpGetOneProduct(req, res, next) {
  const product = await getOneProductById(req.params._id);
  if (!product) {
    return next(new AppError('No product found!', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: { product },
  });
}

async function httpGetAllProducts(req, res, next) {
  const products = await getAllProducts(req.query);
  return res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
}

module.exports = {
  httpGetOneProductBySlug,
  httpGetOneProduct,
  httpGetAllProducts,
};
