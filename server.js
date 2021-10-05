const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app.js');
const password = process.env.DB_PASSWORD;
let DB = process.env.DB;
DB = DB.replace('<password>', password);

mongoose
  .connect(DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log(err));
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

process.on('unhandledRejection', function (err) {
  console.log(err.name, err.message);
  console.log('unhandled rejection solved');
  server.close(() => {
    process.exit(1);
  });
});

console.log(process.env.NODE_ENV);
