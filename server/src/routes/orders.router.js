const { Router } = require('express');

const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetCheckoutSession,
  httpCreateBookingCheckout,
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOneOrder,
  httpDeleteOrder,
  httpUpdateOrder,
  httpPayWithPayPal,
  httpAddFields,
} = require('../controllers/orders.controller');
const catchAsync = require('../services/catchAsync');

const router = Router({ mergeParams: true });

//Not RestFul

router.get(
  '/checkout-session/:orderId',
  catchAsync(httpProtect),
  catchAsync(httpGetCheckoutSession)
);

router.get(
  '/checkout-completed/:_id',
  catchAsync(httpProtect),
  catchAsync(httpCreateBookingCheckout)
);

router.route('/:_id/pay').patch(catchAsync(httpPayWithPayPal));

// RestFul
router.use(catchAsync(httpProtect));
router
  .route('/')
  .post(catchAsync(httpCreateOrder))
  .get(catchAsync(httpGetAllOrders));
router
  .route('/:_id')
  .get(catchAsync(httpGetOneOrder))
  .patch(catchAsync(httpUpdateOrder))
  .delete(catchAsync(httpDeleteOrder));

// TEST AGGREGATION

router.route('/test/fields').get(catchAsync(httpAddFields));

module.exports = router;
