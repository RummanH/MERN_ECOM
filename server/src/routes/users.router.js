const { Router } = require('express');
const {
  httpUpdateMyPassword,
  httpProtect,
} = require('../controllers/auth.controller');
const {
  httpSignupUser,
  httpLoginUser,
  httpUpdateMe,
  httpDeleteMe,
  httpGetOneUser,
  httpUpdateUser,
  httpGetAllUsers,
} = require('../controllers/users.controller');

const catchAsync = require('../services/catchAsync');

const router = Router();

//Not RESTFul for all user
router.post('/signup', catchAsync(httpSignupUser));
router.post('/login', catchAsync(httpLoginUser));

//From this point all protected routes
router.use(catchAsync(httpProtect));
router.patch('/updateMyPassword', catchAsync(httpUpdateMyPassword));
router.patch('/updateMe', catchAsync(httpUpdateMe));
router.delete('/deleteMe', catchAsync(httpDeleteMe));

//RESTFul
router.route('/').get(catchAsync(httpGetAllUsers));
router
  .route('/:id')
  .get(catchAsync(httpGetOneUser))
  .patch(catchAsync(httpUpdateUser));

module.exports = router;
