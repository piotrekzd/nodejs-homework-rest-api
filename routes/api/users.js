const express = require('express');
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/imgUpload');
const {
    register,
    login,
    logout,
    current,
    updateSubscription,
    updateAvatar,
    getAll,
    sendEmailConfirmation,
    resendEmailConfirmation
} = require('../../controllers/users');

const router = express.Router();

router.post('/signup', register);

router.post('/login', login);

router.patch('/subscription', auth, updateSubscription);

router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

router.get('/logout', auth, logout);

router.get('/current', auth, current);

router.get('/verify:verificationToken', sendEmailConfirmation);

router.post('/verify', resendEmailConfirmation);

router.get('/', auth, getAll);

module.exports = router;