const User = require('../models/User');

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select('+password');
};

const findUserById = async (id) => {
  return User.findById(id);
};

const createUser = async (data) => {
  return User.create(data);
};

const updateUserById = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const changeUserPassword = async (id, newPassword) => {
  const user = await User.findById(id).select('+password');
  if (!user) throw new Error('User not found');
  user.password = newPassword;
  await user.save();
  return user;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  changeUserPassword
};
