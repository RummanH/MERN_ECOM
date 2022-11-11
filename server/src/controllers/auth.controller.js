const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const {
  getOneUserByEmail,
  getOneUserByToken,
  getOneUserById,
  saveUser,
} = require('../models/users/users.model');
const AppError = require('../services/AppError');
const Email = require('../services/Email');

function sendCookie(token, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie('token', token, cookieOptions);
}

async function httpSignupUser(req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;

  // 1) Check if user already exist
  if (await getOneUserByEmail(email)) {
    return next(new AppError('User already exist!', 400));
  }

  // Do not give whole body because user might give his role
  const user = await saveUser({
    name,
    email,
    password,
    passwordConfirm,
  });

  // 2) Create token and log the user in
  const token = await user.createJWT();
  user.password = undefined;
  sendCookie(token, res);

  // If for some reason email not sent still log the user in
  try {
    const url = 'example.com';
    await new Email(user, url).sendWelcome();
    return res.status(201).json({ status: 'success', token, data: { user } });
  } catch (err) {
    console.log('error in sending the email', err);
    return res.status(201).json({ status: 'success', token, data: { user } });
  }
}

async function httpLoginUser(req, res, next) {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Get user based on email
  const user = await getOneUserByEmail(email);

  // 3) Check if user exist and password correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // 4) Create token and log the user in
  const token = await user.createJWT();
  user.password = undefined;
  sendCookie(token, res);
  return res.status(201).json({ status: 'success', token, data: { user } });
}

async function httpProtect(req, res, next) {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Because if token is sent from react token is string null.
  if (token === 'null') {
    token = null;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token. There can happen two errors invalid and expire handle them in error controller
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const currentUser = await getOneUserById(decoded._id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // If pass all the previous steps user is protected
  req.user = currentUser;
  next();
}

async function httpForgotPassword(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide your email address!.', 400));
  }
  // 1) Get user based on posted email.
  const user = await getOneUserByEmail(email);
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate the random reset token.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email. If error reset token and expires as undefined
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    return res
      .status(200)
      .json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email!', 500));
  }
}

async function httpResetPassword(req, res, next) {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(
      new AppError('Please provide password and passwordConfirm', 400)
    );
  }

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await getOneUserByToken(hashedToken);

  // 2) If token has not expired and there is a user
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordAt property in mongoose model level

  // 4) Create token and log the user in
  const token = await user.createJWT();
  user.password = undefined;
  sendCookie(token, res);
  return res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
}

async function httpChangePassword(req, res, next) {
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword || !password || !passwordConfirm) {
    return next(new AppError('Please provide all values!', 400));
  }

  // 1) Get user based on req.user._id
  const user = await getOneUserById(req.user._id);

  // 2) Check if current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password!', 401));
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4) update changedPasswordAt property in mongoose model level

  // 5) Create token and log the user in
  const token = await user.createJWT();
  user.password = undefined;
  sendCookie(token, res);
  return res.status(201).json({ status: 'success', token, data: { user } });
}

module.exports = {
  httpSignupUser,
  httpLoginUser,
  httpProtect,
  httpForgotPassword,
  httpResetPassword,
  httpChangePassword,
};
