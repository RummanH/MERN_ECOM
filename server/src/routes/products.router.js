const { Router } = require('express');

const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetOneProductBySlug,
  httpGetAllProducts,
  httpGetOneProduct,
  httpCreateProduct,
  httpUpdateProduct,
  httpDeleteProduct,
} = require('../controllers/products.controller');

const catchAsync = require('../services/catchAsync');

const router = Router();

//NOT RESTful
router.route('/slug/:slug').get(catchAsync(httpGetOneProductBySlug));

//RESTful
router
  .route('/')
  .get(catchAsync(httpGetAllProducts))
  .post(catchAsync(httpProtect), catchAsync(httpCreateProduct));
router
  .route('/:_id')
  .get(catchAsync(httpGetOneProduct))
  .patch(catchAsync(httpProtect), catchAsync(httpUpdateProduct))
  .delete(catchAsync(httpProtect), catchAsync(httpDeleteProduct));

module.exports = router;
