const { Router } = require('express');

const catchAsync = require('../../services/catchAsync');
const {
  httpProtect,
  httpRestrictTo,
  httpUpdateMyPassword,
} = require('./auth.controller');

const {
  httpSignupUser,
  httpLoginUser,
  httpUpdateMe,
  httpDeleteMe,
  httpGetAllUsers,
  httpGetOneUser,
  httpUpdateUser,
} = require('./users.controller');

const router = Router();

//Not RESTFul for all user
router.post('/signup', catchAsync(httpSignupUser));
router.post('/login', catchAsync(httpLoginUser));

//From this point all protected routes
router.use(catchAsync(httpProtect));
router.patch('/updateMyPassword', catchAsync(httpUpdateMyPassword));
router.patch('/updateMe', catchAsync(httpUpdateMe));
router.delete('/deleteMe', catchAsync(httpDeleteMe));

//From this point all Authorized routes
router.use(httpRestrictTo('admin'));

//RESTFul
router.route('/').get(catchAsync(httpGetAllUsers));
router
  .route('/:id')
  .get(catchAsync(httpGetOneUser))
  .patch(catchAsync(httpUpdateUser));

module.exports = router;
