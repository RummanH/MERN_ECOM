const { Router } = require('express');

const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetOneProductBySlug,
  httpGetAllProducts,
  httpGetOneProduct,
} = require('../controllers/products.controller');

const catchAsync = require('../services/catchAsync');

const router = Router();

//NOT RESTful
router.route('/slug/:slug').get(catchAsync(httpGetOneProductBySlug));

//RESTful
router.route('/').get(catchAsync(httpProtect), catchAsync(httpGetAllProducts));
router.route('/:_id').get(catchAsync(httpGetOneProduct));

module.exports = router;
