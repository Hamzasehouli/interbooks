const express = require('express');

const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authControllers.isLoggedIn);
// router.use(authControllers.protect('admin'));

router
  .route('/')
  .post(reviewControllers.createReview)
  .get(reviewControllers.getReviews);

router
  .route('/:reviewId')
  .patch(reviewControllers.updateReview)
  .delete(reviewControllers.deleteReview);

module.exports = router;
