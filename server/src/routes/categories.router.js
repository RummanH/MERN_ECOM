const { Router } = require('express');
const { httpProtect } = require('../controllers/auth.controller');
const {
  httpCreateCategory,
  httpGetAllCategories,
} = require('../controllers/categories.controller');
const catchAsync = require('../services/catchAsync');

const router = Router();

router
  .route('/')
  .get(catchAsync(httpGetAllCategories))
  .post(catchAsync(httpProtect), catchAsync(httpCreateCategory));

module.exports = router;
