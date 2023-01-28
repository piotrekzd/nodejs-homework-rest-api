const express = require('express');
const userController = require('../../controllers/users');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', auth, userController.register);

router.post('/login', auth, userController.login);

router.get('/logout', auth, userController.logout);

router.get('/current', auth, userController.current);

module.exports = router;