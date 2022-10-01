const { Router } = require('express');

const catchAsync = require('../../services/catchAsync');
const {
  httpGetAllProducts,
  httpGetOneProductBySlug,
  httpGetOneProduct,
} = require('./products.controller');

const router = Router();

//NOT RESTful
router.route('/slug/:slug').get(catchAsync(httpGetOneProductBySlug));

//RESTful
router.route('/').get(catchAsync(httpGetAllProducts));
router.route('/:id').get(catchAsync(httpGetOneProduct));

module.exports = router;
