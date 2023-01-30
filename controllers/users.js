const service = require('../service/users');
const jwt = require('jsonwebtoken');
const User = require('../service/schemas/user');
const { userValidator } = require('../utils/validator/validator');
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
        const newUser = new User({ email });
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
            id: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        user.setToken(token);
        await user.save();
        res.json({
            status: 'success',
            code: 200,
            data: {
                token
            }
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const logout = async (req, res, next) => {
    try {
        const user = await service.getUser({ _id: req.user.id });
        if (!user) return res.status(401).json({ message: 'Not authorized' });
        user.setToken(null);
        await user.save();
        res.json({
            status: 'success',
            code: 204,
            data: {
                message: 'No content'
            }
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const current = async (req, res, next) => {
    try {
        const user = await service.getUser({ _id: req.user.id });
        if (!user) return res.status(401).json({ message: 'Not found' });
        res.json({
            status: 'success',
            code: 200,
            data: {
                user
            }
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
    current
};