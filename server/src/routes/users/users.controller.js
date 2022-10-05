const AppError = require('../../services/AppError');

const {
  getOneUser,
  saveUser,
  updateUser,
  getAllUser,
} = require('../../models/users/users.model');

function sendCookie(token, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };

  res.cookie('token', token, cookieOptions);
}

function bodyFilter(candidateObj, ...allowed) {
  const filtered = {};
  Object.keys(candidateObj).forEach((el) => {
    if (allowed.includes(el)) {
      filtered[el] = candidateObj[el];
    }
  });

  return filtered;
}

async function httpSignupUser(req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all values!', 400));
  }

  if (await getOneUser({ email })) {
    return next(new AppError('User with this email already exist!', 400));
  }

  const user = await saveUser({ name, email, password, passwordConfirm });

  const token = await user.createJWT();
  sendCookie(token, res);

  user.password = undefined;
  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

async function httpLoginUser(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await getOneUser({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isActive) {
    await updateUser(user._id, { isActive: true });
  }

  const token = await user.createJWT();
  sendCookie(token, res);

  user.password = undefined;
  return res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

async function httpUpdateMe(req, res, next) {
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. please use /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = bodyFilter(req.body, 'name', 'email');
  const updatedMe = await updateUser(req.user._id, filteredBody);

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedMe,
    },
  });
}

async function httpDeleteMe(req, res, next) {
  await updateUser(req.user._id, { isActive: false });
  return res.status(204).json({
    status: 'success',
    data: null,
  });
}

//these are restful only for administrations
async function httpGetAllUsers(req, res, next) {
  const users = await getAllUser();
  return res.status(200).json({
    status: 'success',
    data: {
      users: users,
    },
  });
}

async function httpGetOneUser(req, res, next) {
  const user = await getOneUser({ _id: req.params.id });

  if (!user) {
    return next(new AppError('No user found!', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { user },
  });
}

async function httpUpdateUser(req, res, next) {
  return res.status(200).json({
    status: 'success',
    data: {
      user: 'User',
    },
  });
}

module.exports = {
  httpSignupUser,
  httpLoginUser,
  httpUpdateMe,
  httpDeleteMe,
  httpUpdateUser,
  httpGetOneUser,
  httpGetAllUsers,
};
