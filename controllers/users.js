const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const service = require('../service/users');
const User = require('../service/schemas/user');
const { userValidator } = require('../utils/validator/validator');
const { avatarDir } = require('../middlewares/imgUpload');
const { resizeAvatar } = require('../utils/imgEditor/resizeAvatar');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const getAll = async (req, res, next) => {
    try {
        const result = await User.find();
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message);
        next(error);
    };
};

const register = async (req, res, next) => {
    const { error } = userValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { password, email} = req.body;
    const user = await service.getUser({ email });
    if (user) return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Email is already in use',
        data: 'Conflict'
    });

    try {
        const avatarURL = gravatar.url(email, { s: '250', d: 'mp' });
        const newUser = new User({ email, avatarURL });
        newUser.setPassword(password);
        await newUser.save();
        res.status(201).json({
            status: 'success',
            code: 201,
            data: {
                message: 'Registered uccessfully'
            }
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const login = async (req, res, next) => {
    const { error } = userValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await service.getUser({ email });

    if (!user || !user.validPassword(password)) return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Incorrect email or password',
        data: 'Unauthorized'
    });

    try {
        const payload = {
            id: user.id,
            email: user.email
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        // user.setToken(token);
        // await user.save();
        await service.updateUser(user.id, { token });
        res.json({
            status: 'success',
            code: 200,
            token
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const logout = async (req, res, next) => {
    try {
        const user = await service.getUser({ _id: req.user._id });
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        // user.setToken(null);
        // await user.save();
        await service.updateUser(user.id, { token: null });
        res.json({
            status: 'success',
            code: 204,
            message: 'No content'
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const current = async (req, res, next) => {
    try {
        const user = await service.getUser({  _id: req.user._id });
        if (!user) return res.status(401).json({ message: 'Not found' });
        res.json({
            status: 'success',
            code: 200,
            user
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const updateSubscription = async (req, res, next) => {
    const { error } = userValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { subscription } = req.body;
        const user = await service.getUser({ _id: req.user._id });
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        const updatedUser = await service.updateUser(user.id, { subscription });
        res.json({
            status: 'success',
            code: 200,
            updatedUser
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const updateAvatar = async (req, res, next) => {
    const { error } = userValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { path: tmpPath, filename } = req.file;
        const avatarURL = path.join(avatarDir, filename);
        resizeAvatar(tmpPath, avatarURL);
        await fs.unlink(tmpPath);

        const user = service.getUser({ _id: req.user._id });
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        const updatedUser = await service.updateUser(user.id, { avatarURL });
        res.json({
            status: 'success',
            code: 200,
            updatedUser
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

module.exports = {
    getAll,
    register,
    login,
    logout,
    current,
    updateSubscription,
    updateAvatar
};