const User = require('../models/users/users.mongo');

const {
  getAllUsers,
  getOneUserById,
  updateUser,
  deleteUser,
  getTopSellers,
} = require('../models/users/users.model');
const AppError = require('../services/AppError');

function bodyFilter(candidateObj, ...allowed) {
  const filtered = {};
  Object.keys(candidateObj).forEach((el) => {
    if (allowed.includes(el)) {
      filtered[el] = candidateObj[el];
    }
  });

  return filtered;
}

async function httpGetOneUser(req, res, next) {
  const user = await getOneUserById(req.params._id);

  console.log(req.params._id);

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  user.password = undefined;
  return res.status(200).json({ status: 'success', data: { user } });
}

async function httpGetAllUsers(req, res, next) {
  const users = await getAllUsers(req.query);
  return res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
}

async function httpUpdateUser(req, res, next) {
  const user = await updateUser(req.params._id, req.body);

  if (user === 'admin') {
    return next(new AppError("Sorry you can't change role of an admin!", 400));
  }
  if (!user) {
    return next(new AppError('User not found!', 404));
  }
  return res.status(200).json({ status: 'success', data: { user } });
}

async function httpUpdateMe(req, res, next) {
  const { password, passwordConfirm } = req.body;

  // 1) Create error if user posts password data
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. please use /changePassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = bodyFilter(
    req.body,
    'name',
    'email',
    'thumbnail',
    'seller'
  );

  // 3) Update user document
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'User not found!' });
  }

  filteredBody.seller = { ...user.seller, ...filteredBody.seller };
  user.set(filteredBody);
  await user.save();

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
}

async function httpDeleteUser(req, res, next) {
  const user = await deleteUser(req.params._id);

  if (user === 'admin') {
    return next(new AppError("Sorry you can't delete an admin", 403));
  }
  return res.status(204).json({ status: 'success', data: null });
}

async function httpGetTopSellers(req, res, next) {
  const sellers = await getTopSellers();
  return res
    .status(200)
    .json({ status: 'success', results: sellers.length, data: { sellers } });
}

module.exports = {
  httpGetOneUser,
  httpGetAllUsers,
  httpUpdateMe,
  httpUpdateUser,
  httpDeleteUser,
  httpGetTopSellers,
};
