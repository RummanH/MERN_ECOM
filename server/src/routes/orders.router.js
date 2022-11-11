const { Router } = require('express');
const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetCheckoutSession,
  httpCreateBookingCheckout,
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOneOrder,
  httpPayOrder,
} = require('../controllers/orders.controller');
const catchAsync = require('../services/catchAsync');

const router = Router({ mergeParams: true });

router.get(
  '/checkout-session/:orderId',
  httpProtect,
  catchAsync(httpGetCheckoutSession)
);

router.get(
  '/checkout-completed/:_id',
  httpProtect,
  catchAsync(httpCreateBookingCheckout)
);
//From this point all route is protected
router.use(catchAsync(httpProtect));
router
  .route('/')
  .post(catchAsync(httpCreateOrder))
  .get(catchAsync(httpGetAllOrders));
router.route('/:_id').get(catchAsync(httpGetOneOrder));

//Not RestFul
router.route('/:_id/pay').patch(catchAsync(httpPayOrder));

module.exports = router;
