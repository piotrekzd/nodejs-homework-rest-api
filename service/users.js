const User = require('./schemas/user');

const getUser = async (body) => User.findOne(body);

const updateUser = async (id, body) => User.findOneAndUpdate(id, body, { new: true, runValidators: true });

module.exports = { getUser, updateUser };