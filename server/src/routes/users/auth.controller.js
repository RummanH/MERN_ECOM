const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const AppError = require('../../services/AppError');
const { getOneUser } = require('../../models/users/users.model');

async function httpProtect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await getOneUser({ _id: decoded.id });
  if (!currentUser) {
    return next(
      new AppError('Token user belong to this token does no longer exist!', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    );
  }

  currentUser.password = undefined;
  req.user = currentUser;
  next();
}

function httpRestrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
}

async function httpUpdatePassword(req, res, next) {
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword) {
    return next(new AppError('Current password is empty!', 400));
  }
  if (!password || !passwordConfirm) {
    return next(
      new AppError('Please provide password and confirm password.', 400)
    );
  }

  const user = await getOneUser({ _id: req.user.id });

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password!', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  const token = await user.createJWT();

  user.password = undefined;
  return res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
}

module.exports = { httpProtect, httpRestrictTo, httpUpdatePassword };
