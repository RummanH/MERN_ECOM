const { Router } = require('express');

const { httpProtect } = require('../users/auth.controller');
const { httpCreateOrder } = require('./orders.controller');
const catchAsync = require('../../services/catchAsync');

const router = Router();

router.use(catchAsync(httpProtect));
router.route('/').post(catchAsync(httpCreateOrder));

module.exports = router;
