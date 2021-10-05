const express = require('express');
// const userControllers = require('../controllers/userControllers');
// const authControllers = require('../controllers/authControllers');
const bookControllers = require('../controllers/bookControllers');
const reviewRoutes = require('./reviewRoutes');
const commentRoutes = require('./commentRoutes');
const cartRoutes = require('./cartRoutes');
const purchaseRoutes = require('./purchaseRoutes');

const router = express.Router();

router.use('/:bookId/reviews', reviewRoutes);
router.use('/:bookId/comments', commentRoutes);
router.use('/:bookId/cart', cartRoutes);
router.use('/:bookId/purchases', purchaseRoutes);

router
  .route('/')
  .get(bookControllers.getBooks)
  .post(bookControllers.createBook);

module.exports = router;
