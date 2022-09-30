const users = require('./users.mongo');

const DEFAULT_USER_NUMBER = 0;

async function getLatestUserNumber() {
  const latestUser = await users.findOne().sort('-userNumber');
  if (!latestUser) {
    return DEFAULT_USER_NUMBER;
  }
  return latestUser.userNumber;
}

async function saveUser(user) {
  const userNumber = (await getLatestUserNumber()) + 1;
  user.userNumber = userNumber;
  const createdUser = await users.create(user);
  return createdUser;
}

async function updateMe(id, user) {
  return await users.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });
}

async function getOneUserById(userId) {
  return await users.findById(userId).select('+password');
}

async function getAllUser() {
  return await users.find({}, { __v: 0 });
}

async function getOneUserByEmail(email) {
  return await users.findOne({ email }).select('+password');
}

module.exports = {
  saveUser,
  getOneUserById,
  getAllUser,
  getOneUserByEmail,
  updateMe,
};
