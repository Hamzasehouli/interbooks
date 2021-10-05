const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating must have rating'],
    },
    description: {
      type: String,
      required: [true, 'Rating must have description'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ user: 1, book: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
