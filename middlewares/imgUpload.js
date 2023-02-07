const path = require('path');
const multer = require('multer');

const avatarDir = path.join(process.cwd(), 'public', 'avatars');
const tempDir = path.join(process.cwd(), 'tmp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const id = req.user._id.toString();
        const name = [id, file.originalname].join('_');
        cb(null, name);
    },
});

const upload = multer({
    storage: storage
});

module.exports = { avatarDir, tempDir, upload };


