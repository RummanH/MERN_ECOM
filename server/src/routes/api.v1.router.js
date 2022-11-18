const { Router } = require('express');

const categoryRouter = require('./categories.router');
const productRouter = require('./products.router');
const AppError = require('../services/AppError');
const orderRouter = require('./orders.router');
const userRouter = require('./users.router');
const {
  uploadProductPhoto,
  resizeProductPhoto,
  uploadPhotoToS3,
} = require('../services/S3Client');
const catchAsync = require('../services/catchAsync');
const { httpProtect } = require('../controllers/auth.controller');

const router = Router();

router.get('/keys/paypal', (req, res, next) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

router.post(
  '/uploads',
  catchAsync(httpProtect),
  uploadProductPhoto,
  catchAsync(resizeProductPhoto),
  catchAsync(uploadPhotoToS3)
);

router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
