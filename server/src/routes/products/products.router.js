const { Router } = require('express');
const {
  httpGetDummy,
  httpGetOneProduct,
  httpGetOneProductById,
} = require('./products.controller');

const router = Router();

//NOT RESTful
router.route('/dummy').get(httpGetDummy);
router.route('/slug/:slug').get(httpGetOneProduct);

//RESTful

router.route('/:id').get(httpGetOneProductById);

module.exports = router;
