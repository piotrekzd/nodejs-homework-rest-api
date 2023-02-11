const User = require('./schemas/user');

const getUser = async (body) => User.findOne(body);

const updateUser = async (id, body) => User.findOneAndUpdate(id, body, { new: true, runValidators: true });

const verifyToken = async (token) => User.findByIdAndUpdate(token, { verify: true, token: null });

module.exports = { getUser, updateUser, verifyToken };