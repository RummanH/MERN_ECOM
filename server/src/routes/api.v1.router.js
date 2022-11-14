const { Router } = require('express');

const categoryRouter = require('./categories.router');
const productRouter = require('./products.router');
const AppError = require('../services/AppError');
const orderRouter = require('./orders.router');
const userRouter = require('./users.router');

const router = Router();

router.get('/keys/paypal', (req, res, next) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
