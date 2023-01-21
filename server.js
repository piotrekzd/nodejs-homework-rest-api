const app = require('./app');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const dbUri = process.env.DB_HOST;

const connection = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\nDatabese is running on the PORT: ${PORT}`)
    });
  })
  .catch((error) => {
    console.log(`Database failed to connect: ${error.message}`);
    process.exit(1);
  });