const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        subscription: {
            type: String,
            enum: ['starter', 'pro', 'business'],
            default: 'starter'
        },
        token: {
            type: String,
            default: null,
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setToken = function (token) {
    this.token = token;
};

const User = model('User', userSchema, 'users');

module.exports = User;