const app = require('./app');
const mongoose = require('mongoose');
const { createFolder } = require('./utils/createFolder/createFolder');
const { tempDir, avatarDir } = require('./middlewares/imgUpload');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

const connection = mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, async () => {
      await createFolder(tempDir);
      await createFolder(avatarDir);
      console.log(`\nDatabese is running on the PORT: ${PORT}`)
    });
  })
  .catch((error) => {
    console.log(`Database failed to connect: ${error.message}`);
    process.exit(1);
  });