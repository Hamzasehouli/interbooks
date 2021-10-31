const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authorRoutes = require('./routes/authorRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const emailRoutes = require('./routes/emailRoutes');
const ErrorHandler = require('./utilities/ErrorHandler');
const errorController = require('./controllers/errorController.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const imageId = (function (n) {
  const chars =
    '1234567890qwertzuioplkjhgfdsayxcvbnmYXCVBNMLKJHGFDSAQWEERTZUIOP';
  let str = '';
  for (let i = 0; i < n; i++) {
    let randomNum = Math.floor(Math.random() * n);
    str += chars[randomNum];
  }
  return str;
})(15);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/users');
  },
  filename: function (req, file, cb) {
    let ext = '.jpeg';

    cb(null, imageId + new Date().getTime() + ext);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(upload.single('photo'));
app.use(express.json());
app.use(cookieParser());
// app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1h minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

// //  apply to all requests
// app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(function (req, res, next) {
  console.log(new Date());
  console.log(req.cookies);
  next();
});

app.use(morgan('tiny'));

app.use('/', viewsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/authors', authorRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/email', emailRoutes);

app.all('*', function (req, res, next) {
  next(new ErrorHandler(404, 'no such route found on this api '));
});

app.use(errorController);

module.exports = app;
