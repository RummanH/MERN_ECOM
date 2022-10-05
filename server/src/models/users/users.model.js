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

async function updateUser(_id, update) {
  return await users.findOneAndUpdate({ _id }, update, {
    new: true,
    runValidators: true,
  });
}

async function getOneUser({ _id, email }) {
  let filter = {};
  if (_id) {
    filter = { _id };
  }
  if (email) {
    filter = { email };
  }

  return await users.findOne(filter).select('+password');
}

async function getAllUser() {
  return await users.find({}, { __v: 0 });
}

module.exports = {
  saveUser,
  updateUser,
  getOneUser,
  getAllUser,
};
