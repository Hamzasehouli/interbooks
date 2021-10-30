const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
});

wishlistSchema.index({ user: 1, book: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
