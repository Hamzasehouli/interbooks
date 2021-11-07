const AsyncHandler = require('../utilities/AsyncHandler.js');
const Review = require('../models/reviewModel.js');

exports.getReviews = AsyncHandler(async function (req, res, next) {
  let obj = {};
  if (req.params.bookId) {
    obj.book = req.params.bookId;
  }
  const reviews = await Review.find(obj);
  obj = {};
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = AsyncHandler(async function (req, res, next) {
  const obj = {
    rating: req.body.rating,
    book: req.body.book,
    user: req.body.user,
  };

  const review = await Review.create(obj);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = AsyncHandler(async function (req, res, next) {
  await Review.findByIdAndUpdate(req.params.reviewId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Review is updated successfully',
  });
});

exports.deleteReview = AsyncHandler(async function (req, res, next) {
  await Review.findByIdAndDelete(req.params.reviewId);
  res.status(204).json({
    status: 'success',
    message: 'Review is deleted successfully',
  });
});
