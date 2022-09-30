const { Router } = require('express');

const catchAsync = require('../../services/catchAsync');
const {
  httpProtect,
  httpRestrictTo,
  httpUpdatePassword,
} = require('./auth.controller');

const {
  httpSignupUser,
  httpLoginUser,
  httpUpdateMe,
  httpGetOneUser,
  httpGetAllUsers,
  httpUpdateUser,
} = require('./users.controller');

const router = Router();

//Not RESTFul for all user
router.post('/signup', catchAsync(httpSignupUser));
router.post('/login', catchAsync(httpLoginUser));

// from this point all protected
router.use(catchAsync(httpProtect));
router.patch('/updateMe', catchAsync(httpUpdateMe));
router.patch('/updateMyPassword', catchAsync(httpUpdatePassword));

//Authorized to admin
router.use(httpRestrictTo('admin'));

//restFul
router.route('/').get(catchAsync(httpGetAllUsers));
router
  .route('/:id')
  .get(catchAsync(httpGetOneUser))
  .patch(catchAsync(httpUpdateUser));

module.exports = router;
