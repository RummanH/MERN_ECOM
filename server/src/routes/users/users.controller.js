const AppError = require('../../services/AppError');

const {
  saveUser,
  getOneUser,
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

// function bodyFilter(candidateObj, ...allowed) {
//   const filtered = {};
//   Object.keys(candidateObj).forEach((el) => {
//     if (allowed.includes(el)) {
//       filtered[el] = candidateObj[el];
//     }
//   });

//   return filtered;
// }

async function httpSignupUser(req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all values!', 400));
  }

  if (await getOneUser({ email })) {
    return next(new AppError('User already exist!', 400));
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
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await getOneUser({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
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

// async function httpUpdateMe(req, res, next) {
//   const { name, lastName, email, location, password, passwordConfirm } =
//     req.body;

//   if (password || passwordConfirm) {
//     return next(
//       new AppError(
//         'This route is not for password update. please use /updateMyPassword',
//         400
//       )
//     );
//   }

//   if (!name || !lastName || !email || !location) {
//     return next(new AppError('Please provide all the values!', 400));
//   }

//   const filteredBody = bodyFilter(
//     req.body,
//     'name',
//     'lastName',
//     'email',
//     'location'
//   );

//   const updatedMe = await updateMe(req.user.id, filteredBody);

//   return res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedMe,
//     },
//   });
// }

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
  httpUpdateUser,
  httpGetOneUser,
  httpGetAllUsers,
};
