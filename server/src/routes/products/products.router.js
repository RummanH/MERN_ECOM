const { Router } = require('express');
const { httpGetDummy, httpGetOneProduct } = require('./products.controller');

const router = Router();

//NOT RESTful
router.route('/dummy').get(httpGetDummy);
router.route('/slug/:slug').get(httpGetOneProduct);

module.exports = router;
