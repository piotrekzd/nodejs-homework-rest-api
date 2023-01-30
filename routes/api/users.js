const express = require('express');
const { auth } = require('../../middlewares/auth');
const {
    register,
    login,
    logout,
    current,
    getAll
} = require('../../controllers/users');

const router = express.Router();

router.post('/signup', register);

router.post('/login', login);

router.get('/logout', auth, logout);

router.get('/current', auth, current);

router.get('/', auth, getAll);

module.exports = router;