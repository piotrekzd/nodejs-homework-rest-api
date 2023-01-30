const express = require('express');
const userController = require('../../controllers/users');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', userController.register);

router.post('/login', userController.login);

router.get('/logout', auth, userController.logout);

router.get('/current', auth, userController.current);

router.get('/', auth, userController.getAll);

module.exports = router;