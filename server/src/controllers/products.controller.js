const _ = require('lodash');

const {
  createProduct,
  getAllProducts,
  getOneProductById,
  getOneProductBySlug,
  updateProduct,
  deleteProduct,
} = require('../models/products/products.model');
const AppError = require('../services/AppError');

async function httpCreateProduct(req, res, next) {
  if (!req.body.category) {
    return next(new AppError('Please select a category!', 404));
  }

  req.body.seller = req.user._id;
  const product = await createProduct(req.body);

  return res.status(201).json({ status: 'success', data: { product } });
}

async function httpGetAllProducts(req, res, next) {
  if (!req.query.seller) {
    req.query = _.omit(req.query, 'seller');
  }

  console.log(req.query);

  const products = await getAllProducts(req.query);

  return res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
}

async function httpGetOneProduct(req, res, next) {
  const product = await getOneProductById(req.params._id);
  if (!product) {
    return next(new AppError('Product not found!', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: { product },
  });
}

async function httpGetOneProductBySlug(req, res, next) {
  const product = await getOneProductBySlug(req.params.slug);
  if (!product) {
    return next(new AppError('Product not found!', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}

async function httpUpdateProduct(req, res, next) {
  const product = await updateProduct(req.params._id, req.body);
  if (!product) {
    return next(new AppError('Product not found!', 404));
  }
  return res.status(200).json({ status: 'success', data: { product } });
}

async function httpDeleteProduct(req, res, next) {
  const product = await deleteProduct(req.params._id);
  if (!product) {
    return next(new AppError('Product not found!', 404));
  }

  return res.status(204).json({ status: 'success', data: null });
}

module.exports = {
  httpGetOneProductBySlug,
  httpGetOneProduct,
  httpGetAllProducts,
  httpCreateProduct,
  httpUpdateProduct,
  httpDeleteProduct,
};
