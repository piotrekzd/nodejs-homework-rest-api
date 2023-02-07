const fs = require('fs/promises');

const accessible = async (path) => {
    return fs
        .access(path)
        .then(() => true)
        .catch(() => false);
};

const createFolder = async (dir) => {
    if (!await accessible(dir))
        await fs.mkdir(dir);
};

module.exports = { createFolder };