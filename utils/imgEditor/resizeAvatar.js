const Jimp = require('jimp');

const resizeAvatar = async (path, save) => {
    try {
        const img = await Jimp.read(path);
        return img.resize(250, 250).write(save);
    } catch (error) {
        return console.log(error.message);
    }
};

module.exports = { resizeAvatar };