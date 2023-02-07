const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../service/schemas/user');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

passport.use(
    new Strategy(params, function (payload, done) {
        User.find({ _id: payload.id })
            .then(([user]) => {
                if (!user) return done(new Error('User not found'))
                return done(null, user);
            })
            .catch(error => done(error));
    })
);

const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (user, error) => {
        if (!req.headers.authorization) return res.status(401).json({
                message: 'Unauthorized',
        });
        const token = req.headers.authorization.slice(7);
        if (!user || error || token !== user.token) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        };
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = { auth };