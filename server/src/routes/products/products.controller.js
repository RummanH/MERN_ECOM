const {
  getOneProduct,
  getAllProducts,
} = require('../../models/products/products.model');
const AppError = require('../../services/AppError');

async function httpGetOneProductBySlug(req, res, next) {
  const product = await getOneProduct({ slug: req.params.slug });
  if (!product) {
    return next(new AppError('No product found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}

async function httpGetOneProduct(req, res, next) {
  console.log(req.params.id);
  const product = await getOneProduct({ _id: req.params.id });
  console.log(product);
  if (!product) {
    return next(new AppError('No product found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product },
  });
}

async function httpGetAllProducts(req, res, next) {
  const products = await getAllProducts();
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
