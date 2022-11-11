const {
  getAllUsers,
  getOneUserById,
  updateMe,
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
  const filteredBody = bodyFilter(req.body, 'name', 'email', 'thumbnail');

  // 3) Update user document
  const user = await updateMe(req.user._id, filteredBody);

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
}

module.exports = { httpGetOneUser, httpGetAllUsers, httpUpdateMe };
