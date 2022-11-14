const { Router } = require('express');
const {
  httpProtect,
  httpSignupUser,
  httpLoginUser,
  httpChangePassword,
} = require('../controllers/auth.controller');
const {
  httpUpdateMe,
  httpGetAllUsers,
  httpGetOneUser,
} = require('../controllers/users.controller');

const orderRouter = require('./orders.router');

const catchAsync = require('../services/catchAsync');

const router = Router();

router.use('/:userId/orders', orderRouter);

//Not RESTFul for all user
router.post('/signup', catchAsync(httpSignupUser));
router.post('/login', catchAsync(httpLoginUser));

//From this point all protected routes
router.use(catchAsync(httpProtect));
router.patch('/changePassword', catchAsync(httpChangePassword));
router.patch('/updateMe', catchAsync(httpUpdateMe));

//RESTFul
router.route('/').get(catchAsync(httpGetAllUsers));
router.route('/:id').get(catchAsync(httpGetOneUser));

module.exports = router;
