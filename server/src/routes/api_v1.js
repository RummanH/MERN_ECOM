const express = require('express');
const AppError = require('../services/AppError');
const productRouter = require('./products/products.router');
const userRouter = require('./users/users.router');

const router = express.Router();

router.use('/products', productRouter);
router.use('/users', userRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
