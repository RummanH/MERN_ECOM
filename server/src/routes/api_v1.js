const { Router } = require('express');

const productRouter = require('./products/products.router');
const orderRouter = require('./orders/orders.router');
const userRouter = require('./users/users.router');
const AppError = require('../services/AppError');

const router = Router();

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
