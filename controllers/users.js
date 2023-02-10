const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const service = require('../service/users');
const User = require('../service/schemas/user');
const { v4 } = require('uuid');
const { userValidator } = require('../utils/validator/validator');
const { avatarDir } = require('../middlewares/imgUpload');
const { resizeAvatar } = require('../utils/imgEditor/resizeAvatar');
const { verifyEmail } = require('../utils/verifyEmail/verifyEmail');

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
        const token = v4();
        const newUser = new User({ email, avatarURL, verificationToken });
        newUser.setPassword(password);
        await newUser.save();
        await verifyEmail(email, verificationToken);
        
        res.status(201).json({
            status: 'success',
            code: 201,
            data: {
                message: 'Registered uccessfully',
                email,
                verificationToken
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
        await service.updateUser(user._id, { token });
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
        const { token } = req.user;
        const user = await service.getUser({ token });
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        await service.updateUser(user._id, { token: null });
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
        const { email, subscription, token, avatarURL } = req.user;
        const user = await service.getUser({ token });
        if (!user) return res.status(401).json({ message: 'Not found' });
        res.json({
            status: 'success',
            code: 200,
            email,
            subscription,
            avatarURL
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
        const updatedUser = await service.updateUser(user._id, { subscription });
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

const sendEmailConfirmation = async (req, res, next) => {
    const { verificationToken } = req.params;

    try {
        const user = service.verifyToken(verificationToken);
        if (!user) res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const resendEmailConfirmation = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = service.getUser({ email });
        if (!user) res.status(404).json({ message: 'Not found' });
        if (user.verify) res.status(400).json({ message: 'Already verified', data: 'Bad request' });
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
    updateAvatar,
    sendEmailConfirmation,
    resendEmailConfirmation
};