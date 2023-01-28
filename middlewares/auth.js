const passport = require('passport');
const passportJWT = require('passport-jwt');

require('dotenv').config();
const secret = process.env.JWT_SECRET;

